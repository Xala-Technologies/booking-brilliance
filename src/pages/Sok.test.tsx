import { describe, expect, it } from "vitest";
import { render } from "../entry-server";

/**
 * Searching has to end somewhere.
 *
 * Submitting a search left the visitor on the page they were already on: the
 * navbar panel was the whole feature, so no URL ever said "I searched for
 * this". `/sok?q=` is that URL, and the page behind it has to hold results —
 * for a query that matched, and for one that did not.
 */
describe("search results page", () => {
  it("lists results for a query at /sok?q=", async () => {
    const html = await render("/sok?q=vipps");
    expect(html).not.toContain("<!--$!-->");
    expect(html).toMatch(/<h1[^>]*>Søkeresultater<\/h1>/);
    expect(html).toContain('id="results"');
    expect(html).toContain("data-result=");
  });

  it("still lists something to open when the query matched nothing", async () => {
    // The literal placeholder a runner types when no term was supplied — a
    // string the site cannot contain.
    const html = await render("/sok?q=%7Bquery%7D");
    expect(html).toContain("Ingen treff for");
    expect(html).toContain("data-result=");
  });

  it("is not an empty page without a query", async () => {
    const html = await render("/sok");
    expect(html).toContain("data-result=");
  });
});
