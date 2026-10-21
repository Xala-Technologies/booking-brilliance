import { describe, expect, it } from "vitest";
import { splitBodyAtPriceBlock } from "./blogPriceBlock";

describe("splitBodyAtPriceBlock", () => {
  it("returns the whole body with hasInlinePriceBlock false when there is no marker", () => {
    const md = "Para one.\n\nPara two.";
    expect(splitBodyAtPriceBlock(md)).toEqual({
      bodyBefore: md,
      bodyAfter: "",
      hasInlinePriceBlock: false,
    });
  });

  it("splits a single marker into bodyBefore/bodyAfter", () => {
    const md = "Before text.\n\n<!-- price-block: shared -->\n\nAfter text.";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyBefore).toBe("Before text.");
    expect(result.bodyAfter).toBe("After text.");
  });

  it("strips a second, later marker from bodyAfter instead of leaking it as text", () => {
    const md =
      "Before.\n\n<!-- price-block: shared -->\n\nMiddle.\n\n<!-- price-block: shared -->\n\nAfter.";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyBefore).toBe("Before.");
    expect(result.bodyAfter).not.toMatch(/<!--/);
    expect(result.bodyAfter).not.toMatch(/price-block/i);
    expect(result.bodyAfter).toBe("Middle.\n\nAfter.");
  });

  it("matches regardless of case", () => {
    const md = "Before.\n\n<!-- PRICE-BLOCK: SHARED -->\n\nAfter.";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyBefore).toBe("Before.");
    expect(result.bodyAfter).toBe("After.");
  });

  it("matches regardless of internal whitespace", () => {
    const md = "Before.\n\n<!--price-block:shared-->\n\nAfter.";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyBefore).toBe("Before.");
    expect(result.bodyAfter).toBe("After.");
  });

  it("matches a marker with extra internal spacing", () => {
    const md = "Before.\n\n<!--   price-block:   shared   -->\n\nAfter.";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyBefore).toBe("Before.");
    expect(result.bodyAfter).toBe("After.");
  });

  it("produces an empty bodyAfter (not a falsy-but-rendered one) when the marker is the last thing in the body", () => {
    const md = "Before.\n\n<!-- price-block: shared -->";
    const result = splitBodyAtPriceBlock(md);
    expect(result.hasInlinePriceBlock).toBe(true);
    expect(result.bodyAfter).toBe("");
  });
});
