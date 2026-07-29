import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The seoDescription prop is written verbatim into <meta name="description">
 * at build time (scripts/prerender.mjs keeps a matching copy in sync). A
 * description over ~160 chars gets truncated by Google (XAL-787).
 */
describe("UtstyrFestutstyr meta description", () => {
  const source = readFileSync(join(__dirname, "UtstyrFestutstyr.tsx"), "utf-8");
  const match = source.match(/seoDescription="([^"]*)"/);

  it("has a seoDescription prop", () => {
    expect(match).not.toBeNull();
  });

  it("is under 160 characters", () => {
    expect(match![1].length).toBeLessThanOrEqual(160);
  });

  it("leads with the exact-match keyword 'leie festutstyr'", () => {
    expect(match![1].toLowerCase().startsWith("leie festutstyr")).toBe(true);
  });
});
