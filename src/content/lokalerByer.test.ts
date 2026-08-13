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

// XAL-1008: same rule, applied to every city. LokalerTilLeieBy.tsx renders
// `data.title ?? \`Lokaler til leie i ${data.name} – finn og book ledige
// lokaler | Digilist\`` — so a city with no override is only safe if that
// templated default happens to stay ≤65 chars for its name.
describe("every BYER entry's effective SEO title is ≤65 chars", () => {
  const defaultTitle = (name: string) =>
    `Lokaler til leie i ${name} – finn og book ledige lokaler | Digilist`;

  for (const [slug, data] of Object.entries(BYER)) {
    it(`${slug}: "${data.title ?? defaultTitle(data.name)}"`, () => {
      const effectiveTitle = data.title ?? defaultTitle(data.name);
      expect(effectiveTitle.length).toBeLessThanOrEqual(65);
    });
  }
});
