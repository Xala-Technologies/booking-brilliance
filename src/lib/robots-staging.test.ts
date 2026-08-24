import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TRANSLATED_PATHS } from "./i18n";
import { postsForLocale } from "./posts";

/**
 * robots.txt must not block any /en page that we prerender.
 *
 * The old version of this file asserted that robots.txt carried
 * `Disallow: /en/` plus one `Allow:` per translated page, and that the two
 * lists matched. It passed for months while both were wrong, because it was
 * checking the two lists against each other and neither against the pages.
 *
 * Two bugs slipped through it:
 *
 *   • Every Allow was `$`-anchored, and the test's own regex stripped the `$`
 *     before comparing — so `Allow: /en/blogg$` looked like it covered
 *     `/en/blogg/<slug>` and did not. Both English articles were blocked while
 *     sitemap.xml asked Google to index them.
 *
 *   • `Disallow: /en/` also hid the ~400 untranslated mirror URLs, which is
 *     the failure that costs money: Disallow does not remove a URL from the
 *     index, it removes the snippet, and it stops Google reading the `noindex`
 *     those pages have been serving all along. /en/leie/kontorlokaler took
 *     753 impressions in 28 days at a structural 0% CTR that no copy could fix.
 *
 * So the assertion here is not "the two lists agree". It is the one that would
 * have caught both: for every page dist/ actually prerenders, robots.txt must
 * permit Google to fetch it — whether it says index or noindex.
 */

const ROBOTS_PATH = "public/robots.txt";
const DIST = "dist";

/**
 * Whether robots.txt lets a crawler fetch a path, under `User-agent: *`.
 *
 * Google's rule, not a simplification of it: the most specific (longest)
 * matching pattern wins, Allow wins a tie, and a path no rule matches is
 * allowed. `*` is any run of characters and a trailing `$` anchors the end —
 * the two constructs this file has been bitten by.
 */
export function robotsAllows(robots: string, path: string): boolean {
  const group: Array<{ allow: boolean; pattern: string }> = [];
  let inStarGroup = false;
  for (const raw of robots.split("\n")) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [field, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    const name = field.trim().toLowerCase();
    if (name === "user-agent") {
      inStarGroup = value === "*";
    } else if (inStarGroup && (name === "allow" || name === "disallow")) {
      if (value) group.push({ allow: name === "allow", pattern: value });
    }
  }

  let winner: { allow: boolean; pattern: string } | null = null;
  for (const rule of group) {
    if (!matches(rule.pattern, path)) continue;
    const specificity = rule.pattern.replace(/\$$/, "").length;
    const best = winner ? winner.pattern.replace(/\$$/, "").length : -1;
    if (specificity > best || (specificity === best && rule.allow)) winner = rule;
  }
  return winner ? winner.allow : true;
}

function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const source =
    body
      .split("*")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*") + (anchored ? "$" : "");
  return new RegExp(`^${source}`).test(path);
}

/** Every `/en` URL dist/ prerenders, with what its static HTML tells Google. */
function prerenderedEnglishPages(): Array<{ path: string; indexable: boolean }> {
  const pages: Array<{ path: string; indexable: boolean }> = [];
  const walk = (dir: string, urlPath: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const next = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(next, `${urlPath}/${entry.name}`);
      } else if (entry.name === "index.html") {
        const html = readFileSync(next, "utf-8");
        const robots = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i)?.[1] ?? "";
        pages.push({ path: urlPath || "/en", indexable: !/noindex/i.test(robots) });
      }
    }
  };
  walk(join(DIST, "en"), "/en");
  return pages;
}

describe("robots.txt does not block the English mirror", () => {
  const robots = readFileSync(ROBOTS_PATH, "utf-8");

  it("has no rule that blocks a page with English copy", () => {
    // The pages whose English prose is written, straight from the whitelist
    // the rest of the site derives everything else from.
    const indexable = [
      ...[...TRANSLATED_PATHS].map((p) => (p === "/" ? "/en" : `/en${p}`)),
      ...postsForLocale("en").map((p) => `/en/blogg/${p.slug}`),
    ];
    for (const path of indexable) {
      expect(robotsAllows(robots, path), `${path} has English copy but robots.txt blocks it`).toBe(
        true,
      );
    }
  });

  it("has no rule that blocks an untranslated mirror URL either", () => {
    // The counter-intuitive half, and the one that cost the impressions: a URL
    // we want OUT of the index must stay crawlable, or Google can never read
    // the noindex and the URL is stuck in the index as a snippet-less listing.
    for (const path of ["/en/leie/kontorlokaler", "/en/blogg/en-plattform-mot-fem-verktoy", "/en/teknologi"]) {
      expect(
        robotsAllows(robots, path),
        `${path} is noindex+canonical and must stay crawlable so Google can read that`,
      ).toBe(true);
    }
  });

  it("still keeps the API out", () => {
    expect(robotsAllows(robots, "/api/health")).toBe(false);
    expect(robotsAllows(robots, "/priser")).toBe(true);
  });
});

// dist/ only exists after `npm run build`. Skipping rather than failing keeps
// `vitest` usable on a clean checkout; CI builds before it tests, so the check
// that matters still runs where it matters.
describe.skipIf(!existsSync(join(DIST, "en")))("prerendered /en pages agree with robots.txt", () => {
  const robots = readFileSync(ROBOTS_PATH, "utf-8");

  it("lets Google fetch every /en page we prerender", () => {
    for (const page of prerenderedEnglishPages()) {
      expect(
        robotsAllows(robots, page.path),
        `${page.path} is prerendered as ${page.indexable ? "index" : "noindex"} but robots.txt blocks it`,
      ).toBe(true);
    }
  });

  it("prerenders index,follow only where English copy exists", () => {
    const withCopy = new Set([
      ...[...TRANSLATED_PATHS].map((p) => (p === "/" ? "/en" : `/en${p}`)),
      ...postsForLocale("en").map((p) => `/en/blogg/${p.slug}`),
    ]);
    for (const page of prerenderedEnglishPages()) {
      if (!page.indexable) continue;
      expect(
        withCopy.has(page.path),
        `${page.path} says "index, follow" but has no English copy — it serves Norwegian at an English URL`,
      ).toBe(true);
    }
  });

  it("puts every /en sitemap URL in the index, and nothing else", () => {
    const sitemapPath = join(DIST, "sitemap.xml");
    if (!existsSync(sitemapPath)) return;
    const locs = [...readFileSync(sitemapPath, "utf-8").matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname.replace(/\/$/, ""))
      .filter((p) => p === "/en" || p.startsWith("/en/"));
    const indexable = new Map(prerenderedEnglishPages().map((p) => [p.path, p.indexable]));

    for (const loc of locs) {
      // A sitemap entry is a request to index. Asking for a URL that robots.txt
      // blocks, or that answers `noindex`, is a contradiction Google resolves
      // by picking the pessimistic reading — which is how the two English blog
      // posts ended up both submitted and blocked.
      expect(robotsAllows(robots, loc), `sitemap lists ${loc} but robots.txt blocks it`).toBe(true);
      expect(indexable.get(loc), `sitemap lists ${loc} but it prerenders as noindex`).toBe(true);
    }

    // And the reverse: an English page we can index but never mention is a page
    // Google finds late or not at all. Twenty-two of the twenty-six sat in that
    // gap while the sitemap listed four.
    //
    // Conditioned on the Norwegian twin being listed, because the /en half of
    // the sitemap is derived from the /nb half — a page the Norwegian sitemap
    // deliberately omits (/status) should not reappear in English.
    const nbLocs = new Set(
      [...readFileSync(sitemapPath, "utf-8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
        new URL(m[1]).pathname.replace(/\/$/, ""),
      ),
    );
    for (const [path, isIndexable] of indexable) {
      if (!isIndexable) continue;
      const nb = path === "/en" ? "/" : path.slice(3);
      if (!nbLocs.has(nb === "/" ? "" : nb)) continue;
      expect(locs, `${path} is indexable English but missing from sitemap.xml`).toContain(path);
    }
  });
});
