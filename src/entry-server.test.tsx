import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

// Regression pin for the nested-lazy SSR race: /status and /transparens
// each nest two React.lazy boundaries (ConvexScope wrapping the page),
// and renderToString's blind setTimeout(0) retry loop in entry-server.tsx
// can lose that race, shipping an empty <div id="root"> with only the
// "Laster…" Suspense fallback instead of the real LCP content. Caught by
// running the real build repeatedly (3/3 failures pre-fix); this pins the
// same failure mode so it can't silently come back with CI green. See the
// warmupImports comment in entry-server.tsx for the fix.
describe("entry-server SSR", () => {
  it("renders the /status lede, not the Suspense fallback", async () => {
    const html = await render("/status");
    expect(html).toContain("Status.");
    expect(html).toContain("Sanntid for Digilist-økosystemet");
    expect(html).not.toContain("Laster…");
  });

  it("renders the /transparens lede, not the Suspense fallback", async () => {
    const html = await render("/transparens");
    expect(html).toContain("Transparens.");
    expect(html).toContain("Digilist sin egen");
    expect(html).not.toContain("Laster…");
  });
});
