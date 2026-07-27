import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * SEO.tsx's hydration effect used to clear only its own previous
 * `[data-seo="true"]` scripts before re-injecting the JSON-LD graph, so the
 * prerendered `data-prerendered="true"` copy from scripts/prerender.mjs was
 * never removed — every hydration doubled the Organization/WebSite/etc.
 * structured data in the live DOM. It also wrote one <script> per block.
 * Both are cheap to reintroduce by accident (e.g. copy-pasting the old
 * pattern back in), so pin them directly against a no-jsdom-available repo
 * the same way no-toaster.test.ts / no-react-query.test.ts guard their
 * invariants: by reading the source.
 */
const SEO_SOURCE = readFileSync(
  join(process.cwd(), "src/components/SEO.tsx"),
  "utf-8",
);

describe("SEO.tsx JSON-LD hydration stays deduped and unmerged-tag-free", () => {
  it("clears every previous ld+json script, not just its own data-seo ones", () => {
    expect(SEO_SOURCE).not.toMatch(
      /querySelectorAll\(\s*['"]script\[type="application\/ld\+json"\]\[data-seo="true"\]['"]\s*\)/,
    );
    expect(SEO_SOURCE).toMatch(
      /querySelectorAll\(\s*['"]script\[type="application\/ld\+json"\]['"]\s*\)/,
    );
  });

  it("writes the JSON-LD graph as a single appended script, not one per block", () => {
    expect(SEO_SOURCE).toMatch(
      /script\.textContent = JSON\.stringify\(blocks\);\s*\n\s*document\.head\.appendChild\(script\);/,
    );
    expect(SEO_SOURCE).not.toMatch(/blocks\.forEach\(\s*\(block\)/);
  });
});
