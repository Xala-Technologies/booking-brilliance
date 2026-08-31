// Gates <title> and <meta name="description"> lengths against what Google
// renders in a SERP snippet before truncating. A truncated snippet costs CTR
// at an unchanged ranking position, which is the site's largest measured gap
// — so this is a real revenue check, not a style rule.
//
// Usage: node scripts/check-meta-lengths.mjs [--all]
//   --all  print every string that was checked, not just the violations.
// Exit code: 0 when every checked string is within the limits, 1 otherwise.
//
// This IS wired into CI: `pnpm check:meta-lengths` runs as its own step in
// .github/workflows/pr-check.yml. (It replaces check-title-lengths.mjs, which
// checked blog titles only and was deliberately left un-wired while a backlog
// of pre-existing violations was tracked separately. That backlog — 538
// violations at the 60/165 limits — was cleared in the same change that added
// this script and wired it into pr-check.yml, so the gate is enforced from
// here on. It is a gate, not a ratchet: there is no baseline file to grow.
// here on: the blog is regenerated daily by the content agent, and without a
// gate the backlog rebuilds itself every night.)
//
// Deliberately NOT in `pnpm build`: build is what deploy.sh runs on every push
// to main, so a failing meta check there would block the production deploy of
// the whole site rather than just the offending change.
//
// Overlaps src/pages/seo-title-length.test.ts, which pins titles at ≤65 from
// inside `pnpm test`. That stays: it fails per-title with a readable vitest
// name. This is the stricter, wider gate (≤60, and descriptions, and the blog).
//
// What it does NOT read, and why: bare `title:` / `description:` keys in a
// page's own local COPY object (src/pages/Blog.tsx, src/App.tsx). Those key
// names are far too common across the codebase to match without drowning in
// card and section copy; the titles among them are covered by the vitest above.

import { promises as fs } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Google renders roughly 60 chars of title and ~160 of description before
// truncating; 165 is the description threshold the SEO crawl reports against.
// Never raise these to make a run green — that defeats the point of the gate.
const TITLE_LIMIT = 60;
const DESC_LIMIT = 165;

const SHOW_ALL = process.argv.includes("--all");

/* ------------------------------------------------------------------ *
 * A very small JS/TS value reader.
 *
 * The metadata lives in source literals (prerender's ROUTES table, the i18n
 * dicts, the BYER city record), so the alternative to parsing is importing —
 * and importing prerender.mjs runs the whole build. A regex alone is not
 * enough either: `description:` appears at several nesting depths inside a
 * route (article.description, dataset.description) and only the top-level one
 * is the meta description. So: read the literals, depth-aware.
 * ------------------------------------------------------------------ */

const OTHER = Symbol("other");

function isWs(c) {
  return c === " " || c === "\t" || c === "\n" || c === "\r";
}

/** Reads a quoted string ('…', "…" or `…`) starting at src[i]. */
function readString(src, i) {
  const quote = src[i];
  let out = "";
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === "\\") {
      out += src.slice(j, j + 2);
      j += 2;
      continue;
    }
    if (c === quote) {
      j++;
      break;
    }
    // A template literal's ${…} can hold braces and strings of its own; skip
    // the whole interpolation so it can't unbalance the scan.
    if (quote === "`" && c === "$" && src[j + 1] === "{") {
      let depth = 1;
      let k = j + 2;
      while (k < src.length && depth > 0) {
        const d = src[k];
        if (d === '"' || d === "'" || d === "`") {
          k = readString(src, k).end;
          continue;
        }
        if (d === "{") depth++;
        else if (d === "}") depth--;
        k++;
      }
      out += src.slice(j, k);
      j = k;
      continue;
    }
    out += c;
    j++;
  }
  return { raw: src.slice(i, j), value: decode(out, quote), end: j, quote };
}

/** Turns the source text of a string body into the characters it renders as. */
function decode(body, quote) {
  if (quote === "`") return body; // kept raw: callers handle interpolation
  try {
    return JSON.parse(`"${body.replace(/\n/g, "\\n")}"`);
  } catch {
    return body.replace(/\\(.)/g, "$1");
  }
}

function skipComment(src, i) {
  if (src[i] === "/" && src[i + 1] === "/") {
    const nl = src.indexOf("\n", i);
    return nl < 0 ? src.length : nl;
  }
  if (src[i] === "/" && src[i + 1] === "*") {
    const end = src.indexOf("*/", i);
    return end < 0 ? src.length : end + 2;
  }
  return -1;
}

/** Reads the value starting at src[i]. Objects and strings are materialised. */
function readValue(src, i) {
  while (i < src.length) {
    if (isWs(src[i])) {
      i++;
      continue;
    }
    const c = skipComment(src, i);
    if (c >= 0) {
      i = c;
      continue;
    }
    break;
  }
  const c = src[i];
  if (c === '"' || c === "'" || c === "`") {
    const s = readString(src, i);
    return { value: s.value, quote: s.quote, start: i, end: s.end };
  }
  if (c === "{") return readObject(src, i);
  // Anything else (array, number, identifier, call, JSX…) is skipped wholesale;
  // no metadata string is expressed that way.
  return { value: OTHER, start: i, end: skipUnknown(src, i) };
}

function skipUnknown(src, i) {
  let depth = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      i = readString(src, i).end;
      continue;
    }
    const cm = skipComment(src, i);
    if (cm >= 0) {
      i = cm;
      continue;
    }
    if (c === "{" || c === "[" || c === "(") {
      depth++;
      i++;
      continue;
    }
    if (c === "}" || c === "]" || c === ")") {
      if (depth === 0) return i;
      depth--;
      i++;
      continue;
    }
    if (c === "," && depth === 0) return i;
    i++;
  }
  return i;
}

/**
 * Reads an object literal starting at src[i] === "{".
 * Returns a plain object of its OWN keys; each key's source offset is recorded
 * under `__loc` so a violation can be reported with a file:line.
 */
function readObject(src, i) {
  const out = { __loc: {} };
  const start = i;
  i++; // past "{"
  while (i < src.length) {
    const c = src[i];
    if (isWs(c) || c === ",") {
      i++;
      continue;
    }
    const cm = skipComment(src, i);
    if (cm >= 0) {
      i = cm;
      continue;
    }
    if (c === "}") {
      i++;
      break;
    }
    const key = /^(?:([A-Za-z_$][\w$]*)|"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*:/.exec(
      src.slice(i),
    );
    if (!key) {
      // Spread, computed key, method — not a metadata carrier; step over it.
      i = skipUnknown(src, i);
      if (i < src.length && src[i] === "}") {
        i++;
        break;
      }
      continue;
    }
    const name = key[1] ?? key[2] ?? key[3];
    const valueStart = i + key[0].length;
    const v = readValue(src, valueStart);
    out[name] = v.value;
    out.__loc[name] = v.start;
    i = v.end;
  }
  return { value: out, start, end: i };
}

/** Reads an array literal of object literals starting at src[i] === "[". */
function readObjectArray(src, i) {
  const out = [];
  i++; // past "["
  while (i < src.length) {
    const c = src[i];
    if (isWs(c) || c === ",") {
      i++;
      continue;
    }
    const cm = skipComment(src, i);
    if (cm >= 0) {
      i = cm;
      continue;
    }
    if (c === "]") break;
    if (c === "{") {
      const o = readObject(src, i);
      out.push(o.value);
      i = o.end;
      continue;
    }
    i = skipUnknown(src, i);
  }
  return out;
}

function lineAt(src, index) {
  if (index == null) return 0;
  return src.slice(0, index).split("\n").length;
}

/* ------------------------------------------------------------------ *
 * File helpers
 * ------------------------------------------------------------------ */

async function walk(dir, exts, excludeDirs = new Set()) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      if (excludeDirs.has(e.name)) continue;
      out.push(...(await walk(join(dir, e.name), exts, excludeDirs)));
    } else if (exts.some((x) => e.name.endsWith(x))) {
      out.push(join(dir, e.name));
    }
  }
  return out.sort();
}

const rel = (p) => relative(ROOT, p);

/* ------------------------------------------------------------------ *
 * Findings
 * ------------------------------------------------------------------ */

/** @type {{group: string, kind: "title"|"description", where: string, length: number, limit: number, text: string}[]} */
const rows = [];

function check(group, kind, where, text) {
  if (typeof text !== "string" || text.length === 0) return;
  const limit = kind === "title" ? TITLE_LIMIT : DESC_LIMIT;
  rows.push({ group, kind, where, length: text.length, limit, text });
}

const fatal = [];

/* ------------------------------------------------------------------ *
 * 1. Blog posts — src/content/blog/*.md
 * ------------------------------------------------------------------ */

// Mirrors parseFrontmatter() in src/lib/blogFrontmatter.ts, which is the parser
// the site itself uses. Reimplemented rather than imported because that file is
// TypeScript and this script runs on bare node. Keep the two in step: the old
// title-only checker used a looser regex that silently dropped every value
// containing a quote, so those posts were never checked at all.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return data;
}

// scripts/prerender.mjs, src/pages/BlogPost.tsx and scripts/verify-live.mjs all
// append a " – Digilist" suffix only when the title is ≤50 chars (they use
// different dashes, but all three suffixes are 11 characters). The rendered
// string is what Google truncates, so that is what gets measured — which means
// a 50-char title renders at 61 and fails: shorten to ≤49 or lengthen past 50.
const TITLE_SUFFIX_LEN = " – Digilist".length;

function renderedBlogTitle(title) {
  return title.length > 50 ? title : title + " – Digilist";
}

async function scanBlog() {
  const dir = join(ROOT, "src", "content", "blog");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  if (files.length === 0) fatal.push("no blog posts found in src/content/blog");
  for (const file of files) {
    const raw = await fs.readFile(join(dir, file), "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm) {
      fatal.push(`src/content/blog/${file}: no YAML frontmatter`);
      continue;
    }
    const where = `src/content/blog/${file}`;
    if (fm.seoTitle) check("blog", "title", where, fm.seoTitle);
    else if (fm.title) check("blog", "title", where, renderedBlogTitle(fm.title));
    if (fm.description) check("blog", "description", where, fm.description);
  }
}

/* ------------------------------------------------------------------ *
 * 2. scripts/prerender.mjs ROUTES — the meta that actually ships
 *
 * prerender writes its own title/description into dist/**\/index.html with a
 * regex overwrite, independent of what the components render at runtime. This
 * is the copy a crawler sees first, so it is checked on its own.
 * ------------------------------------------------------------------ */

async function scanPrerender() {
  const file = join(ROOT, "scripts", "prerender.mjs");
  const src = await fs.readFile(file, "utf8");
  const decl = src.indexOf("const ROUTES = [");
  if (decl < 0) {
    fatal.push("scripts/prerender.mjs: could not find `const ROUTES = [`");
    return;
  }
  const routes = readObjectArray(src, src.indexOf("[", decl));
  // Fail closed: if a refactor breaks the scan, that must surface as a red
  // check, not as a silently empty pass.
  if (routes.length < 50) {
    fatal.push(
      `scripts/prerender.mjs: parsed only ${routes.length} routes — the ROUTES scan needs updating`,
    );
    return;
  }
  for (const r of routes) {
    if (typeof r.route !== "string") continue;
    const at = (k) => `scripts/prerender.mjs:${lineAt(src, r.__loc[k])} (${r.route})`;
    check("prerender", "title", at("title"), r.title);
    check("prerender", "description", at("description"), r.description);
  }

  // ROUTES is not the whole story. Four pages carry their meta in standalone
  // objects BELOW the array — the homepage, /faq, /blogg and /en/blogg — and
  // they ship exactly like the rest. Reading only ROUTES let /en/blogg sit at a
  // 61-char title that the gate could not see; it was caught by scanning built
  // HTML, which is not something a pre-merge check can do. Scan them by name.
  const standalone = [
    ["/", "const HOMEPAGE = {"],
    ["/faq", "const faqRoute = {"],
    ["/blogg", "const blogIndex = {"],
    ["/en/blogg", 'patchHTML(template, {\n    route: "/en/blogg"'],
  ];
  let found = 0;
  for (const [route, marker] of standalone) {
    const at = src.indexOf(marker);
    if (at < 0) continue;
    // readObject returns a { value, start, end } wrapper — the fields live on
    // .value. Reading obj.title directly yields undefined, and check() skips
    // undefined silently, so the scan reports success having verified nothing.
    const wrapped = readObject(src, src.indexOf("{", at));
    const obj = wrapped?.value;
    if (!obj || typeof obj.title !== "string") continue;
    found += 1;
    const loc = (k) => `scripts/prerender.mjs:${lineAt(src, obj.__loc?.[k] ?? at)} (${route})`;
    check("prerender", "title", loc("title"), obj.title);
    check("prerender", "description", loc("description"), obj.description);
  }
  // Fail closed, same discipline as the ROUTES count above: if a rename hides
  // these, that must be red rather than a quietly smaller scan.
  if (found < standalone.length) {
    fatal.push(
      `scripts/prerender.mjs: found ${found}/${standalone.length} standalone meta objects — ` +
        "the below-ROUTES scan needs updating",
    );
  }
}

/* ------------------------------------------------------------------ *
 * 3. src/lib/copy.ts — the i18n dict behind several pages' <SEO> props
 * ------------------------------------------------------------------ */

// "consent.title" is the cookie-banner heading, not a page <title>.
const COPY_NON_META_KEYS = new Set(["consent"]);

async function scanCopy() {
  const file = join(ROOT, "src", "lib", "copy.ts");
  const src = await fs.readFile(file, "utf8");
  const re = /"([A-Za-z0-9_]+)\.(title|description)":\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"/g;
  let found = 0;
  for (const m of src.matchAll(re)) {
    if (COPY_NON_META_KEYS.has(m[1])) continue;
    found++;
    check(
      "copy.ts",
      m[2] === "title" ? "title" : "description",
      `src/lib/copy.ts:${lineAt(src, m.index)} (${m[1]}.${m[2]})`,
      decode(m[3], '"'),
    );
  }
  if (found === 0) fatal.push("src/lib/copy.ts: no *.title / *.description keys matched");
}

/* ------------------------------------------------------------------ *
 * 4. src/content/*.ts — metaTitle / metaDescription on the page copy objects
 * ------------------------------------------------------------------ */

async function scanContent() {
  const files = await walk(join(ROOT, "src", "content"), [".ts", ".mjs"], new Set(["blog"]));
  const re = /\b(metaTitle|metaDescription):\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"/g;
  let found = 0;
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    for (const m of src.matchAll(re)) {
      found++;
      check(
        "src/content",
        m[1] === "metaTitle" ? "title" : "description",
        `${rel(file)}:${lineAt(src, m.index)}`,
        decode(m[2], '"'),
      );
    }
  }
  if (found === 0) fatal.push("src/content: no metaTitle / metaDescription literals matched");
}

/* ------------------------------------------------------------------ *
 * 5. src/pages/**\/*.tsx — literal <SEO> props and wrapper seoTitle/seoDescription
 * ------------------------------------------------------------------ */

// admin/ is an internal, noindex dashboard: its `title=`/`description=` props are
// native tooltips and PageHeader copy, unrelated to SERP snippets. Same exclusion
// the existing src/pages/seo-title-length.test.ts makes, for the same reason.
const PAGES_EXCLUDED_DIRS = new Set(["admin"]);

/**
 * Returns the source of the JSX opening tag that starts at src[i] === "<".
 * Stops at the first ">" that isn't inside a string or a {…} expression, so an
 * attribute holding an object or an arrow function can't end the tag early.
 */
function readJsxOpenTag(src, i) {
  let depth = 0;
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '"' || c === "'" || c === "`") {
      j = readString(src, j).end;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) return { text: src.slice(i, j + 1), end: j + 1 };
    j++;
  }
  return { text: src.slice(i), end: src.length };
}

async function scanPages() {
  const files = await walk(join(ROOT, "src", "pages"), [".tsx"], PAGES_EXCLUDED_DIRS);
  // A bare `title=`/`description=` is only a meta string INSIDE <SEO …>. On the
  // wrapper components (UseCasePage, MarketplaceHub, AgentSpokeLayout) the same
  // prop names carry the visible H1 and dek, which are allowed to run long — so
  // those are read only through the explicit seoTitle/seoDescription props.
  const anywhere = [
    ["title", /\bseoTitle="((?:[^"\\]|\\.)*)"/g],
    ["title", /\bmetaTitle:\s*"((?:[^"\\]|\\.)*)"/g],
    ["description", /\bseoDescription="((?:[^"\\]|\\.)*)"/g],
    ["description", /\bmetaDescription:\s*"((?:[^"\\]|\\.)*)"/g],
  ];
  const inSeoTag = [
    ["title", /(?<![A-Za-z])title="((?:[^"\\]|\\.)*)"/g],
    ["description", /(?<![A-Za-z])description="((?:[^"\\]|\\.)*)"/g],
  ];
  const before = rows.length;
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    const where = (index) => `${rel(file)}:${lineAt(src, index)}`;
    for (const [kind, re] of anywhere) {
      for (const m of src.matchAll(re)) {
        check("src/pages", kind, where(m.index), decode(m[1], '"'));
      }
    }
    for (const m of src.matchAll(/<SEO[\s/>]/g)) {
      const tag = readJsxOpenTag(src, m.index);
      for (const [kind, re] of inSeoTag) {
        for (const attr of tag.text.matchAll(re)) {
          check("src/pages", kind, where(m.index + attr.index), decode(attr[1], '"'));
        }
      }
    }
  }
  if (rows.length === before) {
    fatal.push("src/pages: no <SEO> / seoTitle / seoDescription literals matched");
  }
}

/* ------------------------------------------------------------------ *
 * 6. The 15 city pages — one template in LokalerTilLeieBy.tsx, expanded per city
 *
 * Every /lokaler-til-leie/<by> page builds its meta from a fallback template
 * unless the city overrides it in BYER, so the rendered length differs per city
 * (Kristiansand is 8 chars longer than Oslo). Checking the template alone would
 * miss that; this expands it against the real city names.
 * ------------------------------------------------------------------ */

async function scanCityPages() {
  const pageFile = join(ROOT, "src", "pages", "LokalerTilLeieBy.tsx");
  const byerFile = join(ROOT, "src", "content", "lokalerByer.ts");
  const page = await fs.readFile(pageFile, "utf8");
  const byerSrc = await fs.readFile(byerFile, "utf8");

  const titleTpl = page.match(/title=\{data\.title \?\?\s*`([^`]*)`\}/);
  const descTpl = page.match(/data\.description \?\?\s*`([^`]*)`/);
  if (!titleTpl || !descTpl) {
    fatal.push(
      "src/pages/LokalerTilLeieBy.tsx: could not find the `data.title ?? \\`…\\`` / " +
        "`data.description ?? \\`…\\`` fallbacks — update the city scan",
    );
    return;
  }

  const decl = byerSrc.indexOf("export const BYER");
  if (decl < 0) {
    fatal.push("src/content/lokalerByer.ts: could not find `export const BYER`");
    return;
  }
  const byer = readObject(byerSrc, byerSrc.indexOf("{", byerSrc.indexOf("=", decl))).value;
  const keys = Object.keys(byer).filter((k) => k !== "__loc");
  if (keys.length === 0) {
    fatal.push("src/content/lokalerByer.ts: parsed no cities — update the city scan");
    return;
  }

  const fill = (tpl, name) => tpl.replace(/\$\{data\.name\}/g, name);
  for (const key of keys) {
    const city = byer[key];
    if (!city || typeof city.name !== "string") continue;
    const where = `src/pages/LokalerTilLeieBy.tsx (/lokaler-til-leie/${city.slug ?? key})`;
    const title =
      typeof city.title === "string" ? city.title : fill(titleTpl[1], city.name);
    const description =
      typeof city.description === "string"
        ? city.description
        : fill(descTpl[1], city.name);
    check("city pages", "title", where, title);
    check("city pages", "description", where, description);
  }
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

await scanBlog();
await scanPrerender();
await scanCopy();
await scanContent();
await scanPages();
await scanCityPages();

const GROUPS = ["blog", "prerender", "copy.ts", "src/content", "src/pages", "city pages"];
const over = rows.filter((r) => r.length > r.limit);

for (const group of GROUPS) {
  const groupRows = rows.filter((r) => r.group === group);
  if (groupRows.length === 0) continue;
  const groupOver = groupRows.filter((r) => r.length > r.limit);
  const shown = (SHOW_ALL ? groupRows : groupOver).sort((a, b) => b.length - a.length);
  console.log(
    `\n${group}: ${groupRows.length} string(s) checked, ${groupOver.length} over limit`,
  );
  for (const r of shown) {
    const flag = r.length > r.limit ? "OVER" : "ok  ";
    console.log(`  ${flag} ${r.kind.padEnd(11)} ${String(r.length).padStart(3)}/${r.limit}  ${r.where}`);
    if (r.length > r.limit) console.log(`       ${r.text}`);
  }
}

if (fatal.length > 0) {
  console.log("\nScan errors (a source file no longer matches what this script reads):");
  for (const f of fatal) console.log(`  ${f}`);
}

const overTitles = over.filter((r) => r.kind === "title").length;
const overDescs = over.length - overTitles;
console.log(
  `\n${rows.length} string(s) checked · title limit ${TITLE_LIMIT}, description limit ${DESC_LIMIT}` +
    ` · ${overTitles} title(s) and ${overDescs} description(s) over limit.`,
);
if (over.length > 0) {
  console.log(
    "Rewrite the copy shorter — do not raise the limits. These strings are the search\n" +
      "snippet: keep the keyword, keep it readable, just say it in fewer words." +
      (overTitles > 0
        ? `\nBlog titles render with an ${TITLE_SUFFIX_LEN}-char \" – Digilist\" suffix when ≤50 chars,` +
          " so a 50-char\ntitle measures 61: shorten to ≤49 or rephrase past 50."
        : ""),
  );
}

process.exit(over.length > 0 || fatal.length > 0 ? 1 : 0);
