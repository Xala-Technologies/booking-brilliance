/**
 * Pulls every blog draft from Convex with status === "published" and
 * writes it to src/content/blog/<slug>.md so the next build/deploy
 * ships them to digilist.no/blogg.
 *
 * This is the manual half of the blog workflow:
 *   1. Admin clicks "Publish" on a blog draft in /admin/intelligence/vekst/drafts
 *   2. Convex flips draft.status = "published" + sets published_url
 *   3. Operator (you) runs `pnpm content:sync` to pull the markdown
 *      into the repo, then commits and `./deploy.sh`
 *
 * Idempotent: skips files where the on-disk markdown already matches
 * Convex's body byte-for-byte, so re-running on no-op is cheap and
 * doesn't dirty the working tree.
 *
 * Env:
 *   VITE_CONVEX_URL (or CONVEX_URL) — deployment URL
 *   ADMIN_BASIC_AUTH                — same "user:pass" the dashboard uses
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "..", "src", "content", "blog");
const PUBLIC_BLOG_IMG = path.resolve(__dirname, "..", "public", "images", "blog");

/** Real cover images shipped in public/images/blog (excludes placeholders). */
function availableCovers(): string[] {
  try {
    return fs
      .readdirSync(PUBLIC_BLOG_IMG)
      .filter((f) => /\.(webp|jpg|png)$/i.test(f) && !/placeholder/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

/**
 * The generator often invents a cover path (e.g. /images/blog/idrettshall.webp)
 * that doesn't exist, so the post renders a broken image. If the cover is
 * missing or points at a non-existent file, swap in a real library image
 * chosen deterministically by slug (stable across re-syncs).
 */
function ensureValidCover(body: string, slug: string): string {
  const covers = availableCovers();
  if (covers.length === 0) return body;
  const m = body.match(/^cover:\s*["']?([^"'\n]+)["']?\s*$/m);
  const currentFile = m?.[1]
    ? path.basename(m[1].trim().split(/[?#]/)[0])
    : null;
  if (currentFile && fs.existsSync(path.join(PUBLIC_BLOG_IMG, currentFile))) {
    return body;
  }
  const hash = [...slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const pick = `/images/blog/${covers[hash % covers.length]}`;
  return m
    ? body.replace(m[0], `cover: "${pick}"`)
    : body.replace(/^(---\r?\n)/, `$1cover: "${pick}"\n`);
}

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";

if (!CONVEX_URL) {
  console.error("VITE_CONVEX_URL not set. Source .env.local first.");
  process.exit(1);
}
if (!ADMIN) {
  console.error("ADMIN_BASIC_AUTH not set.");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

interface DraftDoc {
  _id: string;
  channel: string;
  title: string;
  body: string;
  frontmatter_json: string;
  status: string;
  published_url: string | null;
}

function extractSlug(d: DraftDoc): string | null {
  // Prefer the published_url path
  if (d.published_url) {
    const m = d.published_url.match(/\/blogg\/([^/?#]+)/);
    if (m) return m[1];
  }
  // Then frontmatter_json
  try {
    const fm = JSON.parse(d.frontmatter_json) as { slug?: string };
    if (fm.slug) return fm.slug;
  } catch {
    /* ignore */
  }
  // Then leading YAML frontmatter inside the body
  const yaml = d.body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (yaml) {
    const slugLine = yaml[1]
      .split(/\r?\n/)
      .find((l) => /^slug:\s*/.test(l));
    if (slugLine) {
      return slugLine
        .replace(/^slug:\s*/, "")
        .replace(/^["']|["']$/g, "")
        .trim();
    }
  }
  // Fallback: kebab the title (last resort, may clash)
  return d.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || null;
}

async function main() {
  console.log(`[content:sync] target: ${CONVEX_URL}`);

  // Two reasons we use the snapshot query instead of listByStatus:
  // 1. The snapshot already includes _id alongside the display id.
  // 2. We get the published-list directly without extra round-trips.
  const snap = (await client.query(api.content.state.snapshot, {
    adminToken: token,
  })) as { drafts: { published: DraftDoc[] } };

  const published = snap.drafts.published.filter((d) => d.channel === "blog");
  console.log(`[content:sync] ${published.length} published blog draft(s)`);

  if (published.length === 0) {
    console.log("[content:sync] nothing to do.");
    return;
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  let written = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const d of published) {
    const slug = extractSlug(d);
    if (!slug) {
      console.warn(`[content:sync] skip — no slug for "${d.title}"`);
      skipped++;
      continue;
    }
    const target = path.join(BLOG_DIR, `${slug}.md`);
    // Ensure the body has a YAML frontmatter block at the top. The
    // generator inserts one; if the operator hand-edited it out, we
    // recover from the structured frontmatter_json instead.
    let body = d.body;
    // The generator sometimes wraps the whole post in a ```markdown … ```
    // code fence. Strip it so the file starts with the YAML frontmatter —
    // otherwise the blog-index parser (src/lib/posts.ts) fails to read the
    // frontmatter and the post loses its date/slug/title, dropping off /blogg.
    body = body
      .replace(/^﻿?[ \t]*```(?:markdown|md)?[ \t]*\r?\n/, "")
      .replace(/\r?\n```[ \t]*\r?\n?[ \t]*$/, "\n");
    // Belt-and-suspenders: an em/en-dash used as punctuation (spaced) reads as
    // AI-generated. The generation prompt no longer produces them, but strip
    // any that slip through so a sync can never re-introduce the tell. Only
    // spaced dashes are touched, so numeric ranges (95–100) are left intact.
    body = body.replace(/[  ]+[—–][  ]+/g, ", ");
    if (!/^---\r?\n/.test(body)) {
      try {
        const fm = JSON.parse(d.frontmatter_json) as Record<string, unknown>;
        const yamlLines = Object.entries(fm)
          .filter(([k]) => k !== "")
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join("\n");
        body = `---\n${yamlLines}\n---\n\n${d.body}`;
      } catch {
        /* fall through and write as-is */
      }
    }
    // Guarantee a real cover image so auto-published posts never render broken.
    body = ensureValidCover(body, slug);
    const existing = fs.existsSync(target)
      ? fs.readFileSync(target, "utf-8")
      : null;
    if (existing === body) {
      unchanged++;
      continue;
    }
    fs.writeFileSync(target, body, "utf-8");
    console.log(`[content:sync] wrote ${path.relative(process.cwd(), target)}`);
    written++;
  }

  console.log(
    `[content:sync] done — ${written} written, ${unchanged} unchanged, ${skipped} skipped`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
