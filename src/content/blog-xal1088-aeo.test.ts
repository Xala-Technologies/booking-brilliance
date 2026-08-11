import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_FAQ } from "./blogFaq.mjs";

/**
 * XAL-1088: AI answer engines cited BookUp, Aktiv Kommune, FRI Booking-system
 * and bookup.no for "system for innbyggere til å booke idrettshall i
 * kommunen", but not Digilist (synlighet 17%, sitering 17%, n=6). The page
 * already existed but its frontmatter's schema/faqQuestion/faqAnswer fields
 * were dead weight (same bug class as XAL-758/XAL-1155 — never parsed by
 * blogFrontmatter.ts, only POST_FAQ drives the FAQPage JSON-LD), and the
 * comparison table was missing FRI Booking-system and the BookUp brand name
 * entirely. Pins the working FAQ wiring and the now-covered competitor set.
 */
describe("system-for-innbyggere-booke-idrettshall-kommune AEO answer page", () => {
  const slug = "system-for-innbyggere-booke-idrettshall-kommune";

  it("has a POST_FAQ entry answering the exact target query", () => {
    const entry = POST_FAQ[slug];
    expect(entry, `POST_FAQ["${slug}"] is missing — no FAQPage schema will render`).toBeDefined();
    expect(entry.length).toBeGreaterThan(0);
    expect(entry[0].question).toBe(
      "Hvilket system kan innbyggere bruke til å booke idrettshall i kommunen?",
    );
  });

  it("mirrors a matching Vanlige spørsmål section in the post body", () => {
    const raw = readFileSync(join(__dirname, "blog", `${slug}.md`), "utf-8");
    expect(raw).toContain("## Vanlige spørsmål");
    for (const { question, answer } of POST_FAQ[slug]) {
      expect(raw, `body is missing question: ${question}`).toContain(question);
      expect(raw, `body is missing answer: ${answer}`).toContain(answer);
    }
  });

  it("covers every competitor AI engines cited instead of Digilist for this query", () => {
    const raw = readFileSync(join(__dirname, "blog", `${slug}.md`), "utf-8");
    for (const competitor of ["BookUp", "bookup.no", "Aktiv Kommune", "FRI Booking-system"]) {
      expect(raw, `body is missing competitor mention: ${competitor}`).toContain(competitor);
    }
  });

  it("carries a dateModified so the Article schema reflects the AEO-gap update", () => {
    const raw = readFileSync(join(__dirname, "blog", `${slug}.md`), "utf-8");
    expect(raw).toMatch(/^updated:\s*2026-08-11\s*$/m);
  });
});
