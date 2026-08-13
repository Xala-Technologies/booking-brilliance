import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * XAL-1008: several <SEO title="..."> strings ran past the ~65-char length
 * Google tends to render in full in a SERP snippet before truncating.
 * Pins the ≤65 rule for every static title in src/pages/**\/*.tsx (recursive
 * — some pages live in subdirectories like src/pages/agents/), plus the
 * couple of pages that source their title from an i18n dict (FAQ.tsx via
 * copy.ts, Blog.tsx via its own local COPY) instead of a literal prop, and
 * every page that routes its title through a wrapper component's `seoTitle`/
 * `metaTitle` prop (UseCasePage, MarketplaceHub, AgentSpokeLayout) instead of
 * rendering <SEO title="..."> directly — a round-2 regression review found
 * this prop shape was invisible to a plain `title="..."` match.
 */

const PAGES_DIR = join(__dirname);
const LIMIT = 65;

// admin/ is an internal, non-indexed dashboard: its native tooltip
// `title="..."` attributes are unrelated to SERP snippets and legitimately
// run long (e.g. explanatory hover text), so it's excluded from this scan.
// The one page there that does render <SEO title="..."> (IntelligenceShell.tsx)
// already has short titles, out of scope for this ticket either way.
const EXCLUDED_DIRS = new Set(["admin"]);

function tsxFilesIn(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) return [];
      return tsxFilesIn(join(dir, entry.name));
    }
    return entry.name.endsWith(".tsx") ? [join(dir, entry.name)] : [];
  });
}

function staticTitlesIn(file: string): string[] {
  const raw = readFileSync(file, "utf-8");
  return [
    ...[...raw.matchAll(/title="([^"]*)"/g)].map((m) => m[1]),
    ...[...raw.matchAll(/seoTitle="([^"]*)"/g)].map((m) => m[1]),
    ...[...raw.matchAll(/metaTitle:\s*"([^"]*)"/g)].map((m) => m[1]),
  ];
}

describe("SEO <title> length ≤ 65 chars (src/pages/**/*.tsx)", () => {
  const files = tsxFilesIn(PAGES_DIR);

  for (const file of files) {
    const titles = staticTitlesIn(file);
    const relFile = file.slice(PAGES_DIR.length + 1);
    for (const title of titles) {
      it(`${relFile}: "${title}" is ≤${LIMIT} chars`, () => {
        expect(title.length).toBeLessThanOrEqual(LIMIT);
      });
    }
  }
});

describe("SEO <title> length ≤ 65 chars (i18n-sourced titles)", () => {
  it("faqPage.title (nb + en, src/lib/copy.ts) is ≤65 chars", () => {
    const raw = readFileSync(join(PAGES_DIR, "..", "lib", "copy.ts"), "utf-8");
    const matches = [...raw.matchAll(/"faqPage\.title":\s*"([^"]*)"/g)];
    expect(matches.length).toBe(2); // nb + en
    for (const [, title] of matches) {
      expect(title.length).toBeLessThanOrEqual(LIMIT);
    }
  });

  it("Blog.tsx COPY.nb/en.title is ≤65 chars", () => {
    const raw = readFileSync(join(PAGES_DIR, "Blog.tsx"), "utf-8");
    const matches = [...raw.matchAll(/^\s*title:\s*"([^"]*)"/gm)];
    expect(matches.length).toBe(2); // nb + en
    for (const [, title] of matches) {
      expect(title.length).toBeLessThanOrEqual(LIMIT);
    }
  });

  it("home.title (nb + en, src/lib/copy.ts) is ≤65 chars", () => {
    const raw = readFileSync(join(PAGES_DIR, "..", "lib", "copy.ts"), "utf-8");
    const matches = [...raw.matchAll(/"home\.title":\s*"([^"]*)"/g)];
    expect(matches.length).toBe(2); // nb + en
    for (const [, title] of matches) {
      expect(title.length).toBeLessThanOrEqual(LIMIT);
    }
  });

  it("pricing.title (nb + en, src/lib/copy.ts) is ≤65 chars", () => {
    const raw = readFileSync(join(PAGES_DIR, "..", "lib", "copy.ts"), "utf-8");
    const matches = [...raw.matchAll(/"pricing\.title":\s*"([^"]*)"/g)];
    expect(matches.length).toBe(2); // nb + en
    for (const [, title] of matches) {
      expect(title.length).toBeLessThanOrEqual(LIMIT);
    }
  });
});

describe("SEO <title> length ≤ 65 chars (scripts/prerender.mjs static route metadata)", () => {
  // prerender.mjs writes its OWN title into dist/**/index.html via a regex
  // overwrite, independent of what src/pages/*.tsx renders at runtime — so
  // it needs the same length guard, or the shipped <title> can regress even
  // when the component-level title is fixed.
  const raw = readFileSync(join(PAGES_DIR, "..", "..", "scripts", "prerender.mjs"), "utf-8");
  const matches = [...raw.matchAll(/^\s*title:\s*"([^"]*)",?$/gm)];

  it("found route title literals to check", () => {
    expect(matches.length).toBeGreaterThan(0);
  });

  for (const [, title] of matches) {
    it(`"${title}" is ≤${LIMIT} chars`, () => {
      expect(title.length).toBeLessThanOrEqual(LIMIT);
    });
  }
});
