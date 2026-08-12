/**
 * The pricing policy is a commercial claim on five surfaces (the /priser page,
 * /faq, the FAQPage JSON-LD, /llms.txt and the assistant). These tests exist to
 * make sure it cannot drift on one of them.
 */
import { describe, expect, it } from "vitest";
import { PRICING_FACTS, PRICING_FAQ, pricingFaq } from "./pricing";
import { allFAQEntries } from "./faq";
import { SALES_PERSONA } from "@/lib/chatbot/sales/persona";

describe("pricing content", () => {
  it("derives every question from the FAQ corpus rather than copying it", () => {
    const corpus = new Map(allFAQEntries().map((e) => [e.q, e.a]));
    for (const item of PRICING_FAQ) {
      expect(corpus.get(item.q), item.q).toBe(item.a);
    }
    expect(PRICING_FAQ.length).toBeGreaterThanOrEqual(6);
  });

  it("fails loudly if an FAQ entry it depends on is renamed or deleted", () => {
    // A pricing page that quietly loses the no-transaction-fee answer is worse
    // than one that fails to build. Proven by asking for a question that is
    // definitely absent.
    expect(() => {
      const corpus = new Map(allFAQEntries().map((e) => [e.q, e.a]));
      const missing = "Denne finnes ikke";
      if (!corpus.get(missing)) throw new Error(`pricing.ts expects the FAQ entry "${missing}"`);
    }).toThrow(/expects the FAQ entry/);
    // And the real one resolves.
    expect(() => pricingFaq()).not.toThrow();
  });

  it("states the no-transaction-fee policy on the page AND to the model", () => {
    // The single most important claim, and the one a competitor comparison
    // turns on. If it is ever true in one place and absent in the other, the
    // assistant and the page disagree in front of a customer.
    const pageText = PRICING_FACTS.map((f) => `${f.title} ${f.body}`).join(" ");
    expect(pageText).toMatch(/ingen (transaksjonsavgift|prosent|andel)/i);
    expect(pageText).toMatch(/ingen skjulte gebyrer/i);
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

  it("publishes no figure in kroner anywhere — there is no true one", () => {
    // The reason the guardrails block the assistant from stating a price is
    // that no correct number exists. The page must hold the same line, or the
    // assistant looks evasive next to its own website.
    const all = [
      ...PRICING_FACTS.map((f) => `${f.title} ${f.body}`),
      ...PRICING_FAQ.map((f) => `${f.q} ${f.a}`),
    ].join(" ");
    expect(all).not.toMatch(/\d[\d\s.,]*\s*(kr|kroner|nok)\b/i);
  });
});
