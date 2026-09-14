/**
 * The pricing policy is a commercial claim on five surfaces (the /priser page,
 * /faq, the FAQPage JSON-LD, /llms.txt and the assistant). These tests exist to
 * make sure it cannot drift on one of them.
 */
import { describe, expect, it } from "vitest";
import {
  PRICING_FACTS,
  PRICING_FAQ,
  PRIVATE_PLANS,
  formatPriceKr,
  pricingFaq,
  privatePlansSummary,
} from "./pricing";
import { allFAQEntries } from "./faq";
import { SALES_PERSONA } from "@/lib/chatbot/sales/persona";

describe("pricing content", () => {
  it("derives every question from the FAQ corpus rather than copying it", () => {
    const corpus = new Map(allFAQEntries().map((e) => [e.q, e.a]));
    for (const item of PRICING_FAQ) {
      expect(corpus.get(item.q), item.q).toBe(item.a);
    }
    expect(PRICING_FAQ).toHaveLength(6);
  });

  it("fails loudly if an FAQ entry it depends on is renamed or deleted", () => {
    expect(() => {
      const corpus = new Map(allFAQEntries().map((e) => [e.q, e.a]));
      const missing = "Denne finnes ikke";
      if (!corpus.get(missing)) throw new Error(`pricing.ts expects the FAQ entry "${missing}"`);
    }).toThrow(/expects the FAQ entry/);
    expect(() => pricingFaq()).not.toThrow();
  });

  it("states the no-transaction-fee policy on the page AND to the model", () => {
    const pageText = PRICING_FACTS.map((f) => `${f.title} ${f.body}`).join(" ");
    expect(pageText).toMatch(/ingen transaksjonsavgift/i);
    expect(SALES_PERSONA).toMatch(/INGEN transaksjonsavgift/);
    expect(SALES_PERSONA).toMatch(/INGEN andel av bookinginntektene/i);
  });

  it("keeps the launch offer consistent between the page and the assistant", () => {
    const answers = PRICING_FAQ.map((f) => f.a).join(" ");
    expect(answers).toContain("100 første");
    expect(answers).toContain("6 måneder");
    expect(SALES_PERSONA).toContain("100 første");
    expect(SALES_PERSONA).toContain("6 måneder");
  });

  it("publishes the locked private monthly prices and a price list for private actors", () => {
    expect(PRIVATE_PLANS.map((p) => p.priceKr)).toEqual([490, 790, 1290]);
    expect(formatPriceKr(490)).toBe("490 kr/mnd");
    expect(formatPriceKr(1290)).toBe("1 290 kr/mnd");
    expect(privatePlansSummary()).toContain("490 kr");

    const faqText = PRICING_FAQ.map((f) => `${f.q} ${f.a}`).join(" ");
    expect(faqText).toContain("490 kr");
    expect(faqText).toContain("790 kr");
    expect(faqText).toContain("1 290 kr");
    expect(faqText).toMatch(/Har dere en prisliste\?/);
    expect(faqText).toMatch(/Ja\. For private utleiere/);
    expect(faqText).not.toMatch(/ingen prisliste/i);
    expect(faqText).not.toMatch(/Hvorfor har dere ingen prisliste/i);
  });
});
