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
describe("lokaler-til-leie/oslo CTR overrides (2026-11-02)", () => {
  const oslo = BYER.oslo;

  it("has title at or under 60 characters with head-query wording", () => {
    expect(oslo.title).toBeDefined();
    expect(oslo.title!.length).toBeLessThanOrEqual(60);
    expect(oslo.title!.toLowerCase()).toContain("leie lokale");
    expect(oslo.title!.toLowerCase()).toContain("oslo");
  });

  it("has meta description at most 155 characters without sanntid/book claims", () => {
    expect(oslo.description).toBeDefined();
    expect(oslo.description!.length).toBeGreaterThanOrEqual(140);
    expect(oslo.description!.length).toBeLessThanOrEqual(155);
    expect(oslo.description).not.toMatch(/sanntid/i);
    expect(oslo.description).not.toMatch(/book direkte/i);
  });

  it("has 6–8 FAQ entries for visible + JSON-LD parity", () => {
    expect(oslo.faq.length).toBeGreaterThanOrEqual(6);
    expect(oslo.faq.length).toBeLessThanOrEqual(8);
  });

  it("includes reading links to /leie and blog posts", () => {
    const paths = oslo.readingLinks?.map((l) => l.to) ?? [];
    expect(paths).toContain("/leie");
    expect(paths.filter((p) => p.startsWith("/blogg/")).length).toBeGreaterThanOrEqual(2);
  });
});

describe("lokaler-til-leie/trondheim unchanged baseline", () => {
  const trondheim = BYER.trondheim;

  it("keeps default title pattern and four FAQ items", () => {
    expect(trondheim.title).toBe("Lokaler til leie i Trondheim – finn og book | Digilist");
    expect(trondheim.h1).toBeUndefined();
    expect(trondheim.landscapeHeading).toBeUndefined();
    expect(trondheim.readingLinks).toBeUndefined();
    expect(trondheim.faq).toHaveLength(4);
  });
});

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
