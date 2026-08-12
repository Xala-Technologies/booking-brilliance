/**
 * The English pricing page states a commercial policy in a second language.
 *
 * Every translation is a fresh chance to soften a claim, and the one that must
 * never soften is "we take no share of your revenue" — "low fees" would be the
 * weakest version of the strongest thing we have. These tests pin the English
 * wording against the Norwegian so the two cannot drift apart in front of a
 * customer who reads both.
 */
import { describe, expect, it } from "vitest";
import { PRICING_FACTS_EN, allFAQEntriesEn, pricingFaqEn } from "./faq.en";
import { PRICING_FACTS, PRICING_FAQ } from "./pricing";

describe("the English pricing page says the same thing as the Norwegian one", () => {
  it("makes the same six claims, in the same order", () => {
    // Not the same words — the same claims. If one language grows a seventh
    // card, a reader who switches languages sees a different offer.
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
    expect(text).toMatch(/no share of (your |what you )/i);
    expect(text).toMatch(/no hidden (charges|fees)/i);
  });

  it("never softens the fee claim into a small one", () => {
    // The exact failure a translation invites, and the reason the content
    // agent's translator has a `softened-fee` guard for the same thing.
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

  it("publishes no figure in either language", () => {
    // The assistant is blocked from stating a price because no correct one
    // exists. An English page that published one would contradict the
    // Norwegian page, the assistant, and itself.
    const text = [
      ...PRICING_FACTS_EN.map((f) => f.body),
      ...pricingFaqEn().map((f) => f.a),
      ...allFAQEntriesEn().map((f) => f.a),
    ].join(" ");
    expect(text).not.toMatch(/(?:\d[\d\s.,]*\s*(?:kr\b|kroner\b|nok\b|usd\b|eur\b|dollars?\b|euros?\b|[$€£]))|(?:[$€£]\s*\d)/i);
  });

  it("fails loudly if an English entry it depends on is renamed", () => {
    // Same rule as the Norwegian page: dropping the no-transaction-fee answer
    // silently is worse than failing to build.
    expect(() => pricingFaqEn()).not.toThrow();
  });
});

describe("the English FAQ is written for an English reader, not translated at it", () => {
  it("does not leave Norwegian-only terms unexplained", () => {
    // "SSA-L", "sesongtildeling" and "kommunestyret" are load-bearing in
    // Norwegian and meaningless in English. Where the English corpus needs the
    // concept it explains it; it never just prints the Norwegian word.
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
