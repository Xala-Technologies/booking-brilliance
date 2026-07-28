import { describe, expect, it } from "vitest";
import { BYER } from "@/content/lokalerByer";

// The default templated title/description in LokalerTilLeieBy.tsx run long
// for longer city names. Google truncates title tags past ~60 chars and
// meta descriptions past ~160 chars, so Fredrikstad (and any other city
// that overruns the default template) needs an explicit shorter override.
describe("lokaler-til-leie/fredrikstad SEO title and description", () => {
  const fredrikstad = BYER.fredrikstad;

  it("has an explicit title override under 60 characters", () => {
    expect(fredrikstad.title).toBeDefined();
    expect(fredrikstad.title!.length).toBeLessThan(60);
  });

  it("has an explicit description override under 160 characters", () => {
    expect(fredrikstad.description).toBeDefined();
    expect(fredrikstad.description!.length).toBeLessThan(160);
  });

  it("keeps the city name in both title and description", () => {
    expect(fredrikstad.title).toContain("Fredrikstad");
    expect(fredrikstad.description).toContain("Fredrikstad");
  });
});
