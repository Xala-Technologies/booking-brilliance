import { describe, expect, it } from "vitest";
import { followUpSuggestions } from "./rag";
import { FAQ_CATEGORIES } from "@/content/faq";

const kommuneCat = FAQ_CATEGORIES.find((c) => c.id === "kommune")!;
/** The entry a "vi driver et kulturhus" message actually matched on the live site. */
const KOMMUNE_HIT = {
  q: "Hvilke kommunale anleggstyper støttes?",
  a: "Idrettshaller, svømmehaller, …",
  category: kommuneCat.label,
  score: 9,
} as never;

describe("followUpSuggestions", () => {
  /**
   * THE BUG. A private venue operator described a kulturhus, matched the
   * municipal "Hvilke kommunale anleggstyper støttes?" entry, and was offered
   * "Oppfyller Digilist SSA-L 2026-kravene?" and "Kan kommunen importere
   * bookinger…". The LLM answer beside them had already adapted to a private
   * customer — the chips never go near the model, so no prompt could fix them.
   */
  it("never offers municipal follow-ups to a private customer", () => {
    const chips = followUpSuggestions(KOMMUNE_HIT, "privat");
    for (const c of chips) {
      expect(c, `municipal chip leaked: ${c}`).not.toMatch(/kommune|SSA-L|sesongtildel|anskaffelse/i);
    }
  });

  /**
   * The inverse must NOT happen. Hiding municipal questions from an actual
   * municipality is the more expensive mistake — they are the ones who need
   * SSA-L and sesongtildeling — so filtering only applies when we know the
   * customer is private.
   */
  it("still offers municipal follow-ups to a municipality", () => {
    const chips = followUpSuggestions(KOMMUNE_HIT, "kommune");
    expect(chips.length).toBeGreaterThan(1);
    expect(chips.some((c) => /kommune|SSA-L|pilot|implementering/i.test(c))).toBe(true);
  });

  it("does not filter when the segment is unknown", () => {
    expect(followUpSuggestions(KOMMUNE_HIT, null)).toEqual(followUpSuggestions(KOMMUNE_HIT));
  });

  it("falls back to private-flavoured generics when every sibling is municipal", () => {
    // A single-question municipal category leaves nothing after filtering.
    const lonely = { ...KOMMUNE_HIT, q: kommuneCat.questions[0].q } as never;
    const chips = followUpSuggestions(lonely, "privat");
    expect(chips).not.toEqual(["Snakk med en rådgiver"]);
    expect(chips.length).toBeGreaterThanOrEqual(2);
    for (const c of chips) expect(c).not.toMatch(/kommune|SSA-L/i);
  });

  it("offers private-flavoured generics with no hit at all", () => {
    expect(followUpSuggestions(undefined, "privat")).toContain("Hva slags kontrakter tilbys?");
    expect(followUpSuggestions(undefined, "privat").some((c) => /kommune/i.test(c))).toBe(false);
  });

  it("always ends with the human handoff", () => {
    for (const seg of ["privat", "kommune", null] as const) {
      expect(followUpSuggestions(KOMMUNE_HIT, seg).at(-1)).toBe("Snakk med en rådgiver");
    }
  });
});
