import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * XAL-1008: several <SEO title="..."> strings ran past the ~65-char length
 * Google tends to render in full in a SERP snippet before truncating.
 * Pins the ≤65 rule for every static title in src/pages/*.tsx, plus the
 * couple of pages that source their title from an i18n dict (FAQ.tsx via
 * copy.ts, Blog.tsx via its own local COPY) instead of a literal prop.
 */

const PAGES_DIR = join(__dirname);
const LIMIT = 65;

function staticTitlesIn(file: string): string[] {
  const raw = readFileSync(join(PAGES_DIR, file), "utf-8");
  return [...raw.matchAll(/title="([^"]*)"/g)].map((m) => m[1]);
}

describe("SEO <title> length ≤ 65 chars (src/pages/*.tsx)", () => {
  const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".tsx"));

  for (const file of files) {
    const titles = staticTitlesIn(file);
    for (const title of titles) {
      it(`${file}: "${title}" is ≤${LIMIT} chars`, () => {
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
