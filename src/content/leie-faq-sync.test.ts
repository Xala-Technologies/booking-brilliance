import { describe, expect, it } from "vitest";
import { rentCopy } from "./leie";
import { loadLeieFaqNb } from "../../scripts/leie-faq-loader.mjs";

/**
 * The prerendered /leie FAQPage must equal the visible accordion.
 *
 * scripts/prerender.mjs loads FAQ_NB from src/content/leie.ts at build time
 * (see scripts/leie-faq-loader.mjs). Google requires the structured data to
 * match the text on the page; if they drift, the page goes from earning a rich
 * result to carrying a structured-data violation.
 */
describe("/leie FAQ is identical in prerender and on the page", () => {
  it("has every question and answer from FAQ_NB, verbatim", async () => {
    const page = rentCopy("nb").faq;
    const prerender = await loadLeieFaqNb();

    expect(prerender).toHaveLength(page.length);
    for (let i = 0; i < page.length; i++) {
      expect(prerender[i].q).toBe(page[i].question);
      expect(prerender[i].a).toBe(page[i].answer);
    }
  });
});
