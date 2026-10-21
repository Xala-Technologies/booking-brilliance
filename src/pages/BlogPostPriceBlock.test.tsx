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
 * two markers. No such post exists in the corpus, this is the regression
 * guard for one that someday does. */
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

    // And it lands at the marker's actual position in the body, between the
    // "Lageret" section above it and the "Ute" section below it.
    const lagerPos = html.indexOf("Lageret: bord, stoler");
    const utePos = html.indexOf("Ute: parkering, lys og naboer");
    expect(lagerPos).toBeGreaterThan(-1);
    expect(utePos).toBeGreaterThan(-1);
    expect(headingPos).toBeGreaterThan(lagerPos);
    expect(headingPos).toBeLessThan(utePos);
  });

  it("the inline block's own <section> carries max-w-[68ch] directly, not the footer's container/mx-auto wrapper", async () => {
    const html = await render("/blogg/leie-grendehus-rom-for-rom");
    const headingPos = html.indexOf('id="pricing-summary-heading"');
    // Both variants wrap their heading in a <section>, so distinguish them by
    // their own class attribute: the inline variant puts max-w-[68ch]
    // directly on that <section> (no container/mx-auto); the footer variant
    // puts container/mx-auto on an inner <div> instead, one level deeper.
    const before = html.slice(Math.max(0, headingPos - 400), headingPos);
    const lastSectionOpen = before.lastIndexOf("<section");
    expect(lastSectionOpen).toBeGreaterThan(-1);
    const sectionTag = before.slice(lastSectionOpen);
    expect(sectionTag).toContain("max-w-[68ch]");
    expect(sectionTag).toContain("post-body-measure");
    expect(sectionTag).not.toContain("container mx-auto");
  });

  it("the inline block's <section> gets an implicit region landmark from aria-labelledby", async () => {
    const html = await render("/blogg/leie-grendehus-rom-for-rom");
    const headingPos = html.indexOf('id="pricing-summary-heading"');
    const before = html.slice(Math.max(0, headingPos - 400), headingPos);
    const lastSectionOpen = before.lastIndexOf("<section");
    expect(lastSectionOpen).toBeGreaterThan(-1);
    expect(before.slice(lastSectionOpen)).toContain('aria-labelledby="pricing-summary-heading"');
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
const DIST_EXISTS = existsSync(DIST_BLOGG);

// dist/ only exists after `pnpm build`, and pr-check.yml's `test` step (plain
// `pnpm test`) runs before its `build` step, so on a clean checkout this
// suite would always skip and never actually run in CI. REQUIRE_DIST_BLOGG=1
// is set by pr-check.yml's dedicated post-build step, where dist/ is
// guaranteed to exist, to turn "skip when missing" into "fail when missing"
// so a regression here cannot silently stay unskipped forever. Plain
// `pnpm test` on a clean checkout (no env flag) still skips, which keeps
// `vitest` usable without requiring a build first.
describe.skipIf(!DIST_EXISTS && process.env.REQUIRE_DIST_BLOGG !== "1")(
  "every built /blogg/* page has exactly one pricing-summary-heading",
  () => {
    it("never zero (missing block) and never more than one (duplicate/leaked block)", () => {
      if (!DIST_EXISTS) {
        throw new Error(
          "dist/blogg is missing but REQUIRE_DIST_BLOGG=1. Run `pnpm build` before this check (see pr-check.yml's post-build step).",
        );
      }
      const slugs = readdirSync(DIST_BLOGG, { withFileTypes: true }).filter((e) => e.isDirectory());
      expect(slugs.length).toBeGreaterThan(0);
      for (const entry of slugs) {
        const htmlPath = join(DIST_BLOGG, entry.name, "index.html");
        if (!existsSync(htmlPath)) continue;
        const html = readFileSync(htmlPath, "utf-8");
        // A consolidated/merged slug prerenders as a <meta http-equiv="refresh">
        // redirect stub with no article body at all, so zero pricing blocks
        // there is correct, not a regression. Only real article pages are in scope.
        if (html.includes('<meta http-equiv="refresh"')) continue;
        const occurrences = html.split('id="pricing-summary-heading"').length - 1;
        expect(occurrences, `dist/blogg/${entry.name}/index.html has ${occurrences} pricing blocks`).toBe(
          1,
        );
      }
    });
  },
);
