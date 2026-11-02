import { describe, expect, it } from "vitest";
import { BYER } from "@/content/lokalerByer";
import { loadOsloPrerenderMeta } from "../../scripts/lokaler-oslo-prerender-loader.mjs";

/**
 * The prerendered /lokaler-til-leie/oslo FAQPage must equal the visible FAQ.
 *
 * scripts/prerender.mjs loads Oslo title, description and FAQ from
 * lokalerByer.ts at build time (see scripts/lokaler-oslo-prerender-loader.mjs).
 */
describe("/lokaler-til-leie/oslo FAQ matches prerender source", () => {
  it("has every question and answer from BYER.oslo.faq, verbatim", async () => {
    const page = BYER.oslo.faq;
    const { faq: prerender } = await loadOsloPrerenderMeta();

    expect(prerender).toHaveLength(page.length);
    for (let i = 0; i < page.length; i++) {
      expect(prerender[i].q).toBe(page[i].question);
      expect(prerender[i].a).toBe(page[i].answer);
    }
  });

  it("keeps prerender title and description aligned with BYER.oslo", async () => {
    const meta = await loadOsloPrerenderMeta();
    expect(meta.title).toBe(BYER.oslo.title);
    expect(meta.description).toBe(BYER.oslo.description);
  });
});
