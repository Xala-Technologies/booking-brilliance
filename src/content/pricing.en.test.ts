/**
 * The English pricing page states a commercial policy in a second language.
 */
import { describe, expect, it } from "vitest";
import { PRICING_FACTS_EN, allFAQEntriesEn, pricingFaqEn } from "./faq.en";
import { PRICING_FACTS, PRICING_FAQ } from "./pricing";

describe("the English pricing page says the same thing as the Norwegian one", () => {
  it("makes the same number of claims", () => {
    expect(PRICING_FACTS_EN.length).toBe(PRICING_FACTS.length);
  });

  it("answers the same set of pricing questions", () => {
    expect(pricingFaqEn().length).toBe(PRICING_FAQ.length);
  });

  it("states the no-transaction-fee policy in English, unsoftened", () => {
    const text = [
      ...PRICING_FACTS_EN.map((f) => `${f.title} ${f.body}`),
      ...pricingFaqEn().map((f) => `${f.q} ${f.a}`),
    ].join(" ");
    expect(text).toMatch(/no transaction fee/i);
    expect(text).toMatch(/no share of what you charge/i);
  });

  it("never softens the fee claim into a small one", () => {
    const text = [
      ...PRICING_FACTS_EN.map((f) => `${f.title} ${f.body}`),
      ...pricingFaqEn().map((f) => f.a),
    ].join(" ");
    expect(text).not.toMatch(/\b(low|small|modest|competitive)\s+(fee|fees|commission)\b/i);
    expect(text).not.toMatch(/\bsmall\s+(share|percentage|cut)\b/i);
  });

  it("carries the launch offer in both languages, identically", () => {
    const en = pricingFaqEn().map((f) => f.a).join(" ");
    const nb = PRICING_FAQ.map((f) => f.a).join(" ");
    expect(en).toMatch(/first 100 customers/i);
    expect(en).toMatch(/6 months/i);
    expect(nb).toContain("100 første");
    expect(nb).toContain("6 måneder");
  });

  it("publishes the locked private monthly prices in English", () => {
    const text = [
      ...PRICING_FACTS_EN.map((f) => f.body),
      ...pricingFaqEn().map((f) => f.a),
    ].join(" ");
    expect(text).toMatch(/490/);
    expect(text).toMatch(/790/);
    expect(text).toMatch(/1,?290/);
    expect(text).toMatch(/Three monthly plans are published/i);
    expect(text).not.toMatch(/why is there no price list/i);
  });

  it("fails loudly if an English entry it depends on is renamed", () => {
    expect(() => pricingFaqEn()).not.toThrow();
  });
});

describe("the English FAQ is written for an English reader, not translated at it", () => {
  it("does not leave Norwegian-only terms unexplained", () => {
    const text = allFAQEntriesEn().map((e) => `${e.q} ${e.a}`).join(" ");
    for (const term of ["SSA-L", "sesongtildeling", "kommunestyret", "grendehus", "ID-porten"]) {
      expect(text, term).not.toContain(term);
    }
  });

  it("is honest about what is Norway-specific rather than implying it works everywhere", () => {
    const text = allFAQEntriesEn().map((e) => e.a).join(" ");
    expect(text).toMatch(/deepest integrations are Norwegian|built in Norway/i);
  });

  it("has no Norwegian left in it", () => {
    const text = allFAQEntriesEn().map((e) => `${e.q} ${e.a}`).join(" ");
    expect(text).not.toMatch(/\b(ikke|dere|som|utleie|lokaler|avhenger|gebyrer)\b/i);
  });
});
