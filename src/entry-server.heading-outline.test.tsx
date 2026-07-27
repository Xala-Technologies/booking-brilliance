import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

/**
 * Regression coverage for a11y.heading.skip: the Audience section of
 * UseCasePage rendered a SectionRule (a <div> eyebrow label, never a
 * heading) directly above the persona <h3> cards, so the DOM heading
 * sequence jumped from <h1> straight to <h3> with no <h2> in between.
 * Affects all ~38 /leie/* use-case pages sharing UseCasePage.
 */
function assertNoHeadingSkip(html: string, route: string) {
  const levels = [...html.matchAll(/<h([1-6])[ >]/g)].map((m) => Number(m[1]));
  expect(levels.length, `expected headings on ${route}`).toBeGreaterThan(0);

  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];
    if (curr > prev) {
      expect(
        curr - prev,
        `heading level skip on ${route}: h${prev} -> h${curr} at position ${i}`
      ).toBeLessThanOrEqual(1);
    }
  }
}

describe("SSR heading outline", () => {
  it("has no heading-level skip on a /leie/* use-case page (XAL-750)", async () => {
    const route = "/leie/konfirmasjonslokale";
    const html = await render(route);
    assertNoHeadingSkip(html, route);
  });

  it("renders an <h2> before the first Audience persona <h3> (XAL-750)", async () => {
    const route = "/leie/konfirmasjonslokale";
    const html = await render(route);

    const h2Index = html.indexOf("<h2");
    const h3Index = html.indexOf("<h3");
    expect(h2Index, `expected an <h2> before Audience personas on ${route}`).toBeGreaterThanOrEqual(0);
    expect(h3Index, `expected an <h3> for Audience personas on ${route}`).toBeGreaterThanOrEqual(0);
    expect(h2Index, `expected <h2> to precede <h3> on ${route}`).toBeLessThan(h3Index);
  });
});
