import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HOMEPAGE_FAQ } from "./faq";
import { HOMEPAGE_FAQ_EN } from "./faq.en";

/**
 * The homepage's FAQPage markup and the homepage's visible accordion must be
 * the same Q&A.
 *
 * The accordion renders HOMEPAGE_FAQ from this directory. The FAQPage JSON-LD
 * a crawler reads before any JavaScript runs is a hand-copied MIRROR of it
 * inside `scripts/prerender.mjs`, because that script is plain Node ESM and
 * cannot import a .ts file. The mirror carries a comment asking whoever edits
 * it to keep the two byte-for-byte identical, and nothing checked that they
 * were — so an edit to one would have shipped FAQ markup that does not match
 * the text on the page. Google treats that as a structured-data violation and
 * drops the rich result, and an answer engine quoting the markup would quote a
 * sentence the page does not contain.
 */
function prerenderedFAQ(open: string, close: string): Array<{ q: string; a: string }> {
  const src = readFileSync("scripts/prerender.mjs", "utf8");
  const start = src.indexOf(open);
  expect(start, `no ${open} in scripts/prerender.mjs`).toBeGreaterThan(-1);
  const end = src.indexOf(close, start);
  expect(end, `unterminated block after ${open}`).toBeGreaterThan(-1);
  const block = src.slice(start, end);

  const faqStart = block.indexOf("faq: [");
  expect(faqStart, `the prerendered ${open} has no FAQPage markup`).toBeGreaterThan(-1);
  const faq = block.slice(faqStart);

  return [...faq.matchAll(/q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => ({
      q: m[1].replace(/\\"/g, '"'),
      a: m[2].replace(/\\"/g, '"'),
    }),
  );
}

describe("homepage FAQPage markup mirrors the visible accordion", () => {
  it("is the same questions and answers, in the same order", () => {
    expect(prerenderedFAQ("const HOMEPAGE = {", "\n};")).toEqual(HOMEPAGE_FAQ);
  });

  it("covers the English homepage too, which is indexable", () => {
    // /en renders the same accordion in English and carried no FAQPage at all.
    expect(prerenderedFAQ('route: "/en",', "\n  },\n")).toEqual(HOMEPAGE_FAQ_EN);
  });

  it("still opens with the definitional question", () => {
    // "Hva er Digilist?" is the question an answer engine is answering when it
    // builds an AI Overview for the bare brand name. It earns first place.
    expect(HOMEPAGE_FAQ[0].q).toBe("Hva er Digilist?");
    expect(HOMEPAGE_FAQ[0].a).toMatch(/^Digilist er /);
  });
});
