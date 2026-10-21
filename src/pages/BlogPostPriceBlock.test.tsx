import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";
import { splitBodyAtPriceBlock } from "@/lib/blogPriceBlock";

/** Mirrors BlogPost.tsx's own render shape closely enough to exercise the
 * split + inline-render path end to end, without needing a real post with
 * two markers (no such post exists in the corpus — this is the regression
 * guard for one that someday does). */
function renderBodyWithPriceBlock(markdown: string): string {
  const { bodyBefore, bodyAfter, hasInlinePriceBlock } = splitBodyAtPriceBlock(markdown);
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/blogg/test-post"]}>
      <div>
        <ReactMarkdown>{bodyBefore}</ReactMarkdown>
        {hasInlinePriceBlock && <PricingSummaryBlock variant="inline" />}
        {bodyAfter && <ReactMarkdown>{bodyAfter}</ReactMarkdown>}
      </div>
    </MemoryRouter>,
  );
}

/**
 * Integration coverage for the `<!-- price-block: shared -->` marker, on top
 * of the pure-function unit tests in `src/lib/blogPriceBlock.test.ts`.
 *
 * These render full routes through the SSR entry (the same path
 * `scripts/prerender.mjs` uses) so a regression here is one that would also
 * ship to `dist/`, not just pass a component-level assertion.
 */
describe("BlogPost inline price block (SSR)", () => {
  it("a marker post renders the block exactly once, inline, and not in the footer position", async () => {
    const html = await render("/blogg/leie-grendehus-rom-for-rom");
    const occurrences = html.split('id="pricing-summary-heading"').length - 1;
    expect(occurrences).toBe(1);

    // Inline: the block sits between the article's body paragraphs, i.e.
    // before the closing </article> that opens the end-of-article CTA band.
    const headingPos = html.indexOf('id="pricing-summary-heading"');
    const articleClosePos = html.indexOf("</article>");
    expect(headingPos).toBeGreaterThan(-1);
    expect(articleClosePos).toBeGreaterThan(-1);
    expect(headingPos).toBeLessThan(articleClosePos);

    // And it lands at the marker's actual position in the body — between the
    // "Lageret" section above it and the "Ute" section below it.
    const lagerPos = html.indexOf("Lageret: bord, stoler");
    const utePos = html.indexOf("Ute: parkering, lys og naboer");
    expect(lagerPos).toBeGreaterThan(-1);
    expect(utePos).toBeGreaterThan(-1);
    expect(headingPos).toBeGreaterThan(lagerPos);
    expect(headingPos).toBeLessThan(utePos);
  });

  it("the inline block is not wrapped in the full-bleed section/container used in the footer", async () => {
    const html = await render("/blogg/leie-grendehus-rom-for-rom");
    const headingPos = html.indexOf('id="pricing-summary-heading"');
    // Walk back from the heading to its own wrapper's opening tag and check
    // it is the narrow aria-labelledby div, not the full-width <section>.
    const before = html.slice(Math.max(0, headingPos - 400), headingPos);
    const lastSectionOpen = before.lastIndexOf("<section");
    const lastDivOpen = before.lastIndexOf("<div");
    expect(lastDivOpen).toBeGreaterThan(lastSectionOpen);
    expect(before.slice(lastDivOpen)).toContain("max-w-[68ch]");
    expect(before.slice(lastDivOpen)).not.toContain("container mx-auto");
  });

  it("a non-marker post renders the block exactly once, only in the footer", async () => {
    const html = await render("/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling");
    const occurrences = html.split('id="pricing-summary-heading"').length - 1;
    expect(occurrences).toBe(1);

    const headingPos = html.indexOf('id="pricing-summary-heading"');
    const articleClosePos = html.indexOf("</article>");
    expect(headingPos).toBeGreaterThan(articleClosePos);
  });

  it("never leaks the raw <!-- price-block: shared --> marker as visible text", async () => {
    const html = await render("/blogg/leie-grendehus-rom-for-rom");
    expect(html).not.toContain("price-block");
  });
});

describe("splitBodyAtPriceBlock + inline render, double-marker regression", () => {
  it("a body with two markers renders the block exactly once and leaks no raw marker text", () => {
    const md =
      "Before.\n\n<!-- price-block: shared -->\n\nMiddle.\n\n<!-- price-block: shared -->\n\nAfter.";
    const html = renderBodyWithPriceBlock(md);
    const occurrences = html.split('id="pricing-summary-heading"').length - 1;
    expect(occurrences).toBe(1);
    expect(html).not.toContain("price-block");
    expect(html).not.toContain("<!--");
    expect(html).toContain("Before.");
    expect(html).toContain("Middle.");
    expect(html).toContain("After.");
  });

  it("whitespace and case variants of the marker still produce exactly one block", () => {
    const variants = [
      "<!-- price-block: shared -->",
      "<!--price-block:shared-->",
      "<!-- PRICE-BLOCK: SHARED -->",
      "<!--   price-block:   shared   -->",
    ];
    for (const marker of variants) {
      const md = `Before.\n\n${marker}\n\nAfter.`;
      const html = renderBodyWithPriceBlock(md);
      const occurrences = html.split('id="pricing-summary-heading"').length - 1;
      expect(occurrences, `marker variant ${JSON.stringify(marker)} did not split`).toBe(1);
      expect(html).not.toContain("price-block");
    }
  });
});

const DIST_BLOGG = join("dist", "blogg");

// dist/ only exists after `pnpm build`. Skipping (rather than failing) keeps
// `vitest` usable on a clean checkout — the build step runs it for real where
// it matters (pr-check.yml builds, then tests).
describe.skipIf(!existsSync(DIST_BLOGG))(
  "every built /blogg/* page has exactly one pricing-summary-heading",
  () => {
    it("never zero (missing block) and never more than one (duplicate/leaked block)", () => {
      const slugs = readdirSync(DIST_BLOGG, { withFileTypes: true }).filter((e) => e.isDirectory());
      expect(slugs.length).toBeGreaterThan(0);
      for (const entry of slugs) {
        const htmlPath = join(DIST_BLOGG, entry.name, "index.html");
        if (!existsSync(htmlPath)) continue;
        const html = readFileSync(htmlPath, "utf-8");
        // A consolidated/merged slug prerenders as a <meta http-equiv="refresh">
        // redirect stub with no article body at all — correctly zero pricing
        // blocks, not a regression. Only real article pages are in scope.
        if (html.includes('<meta http-equiv="refresh"')) continue;
        const occurrences = html.split('id="pricing-summary-heading"').length - 1;
        expect(occurrences, `dist/blogg/${entry.name}/index.html has ${occurrences} pricing blocks`).toBe(
          1,
        );
      }
    });
  },
);
