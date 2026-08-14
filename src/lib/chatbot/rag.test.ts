/**
 * What the assistant is given to answer with.
 *
 * This file exists because retrieval was the only part of the chat path with no
 * tests at all, and it turned out to hold the root cause of the worst thing the
 * assistant has done. Live grading caught the model telling a scout group
 * "Digilist koster fra omkring 300 kroner månedlig" — a number in no source.
 * That looked like a hallucination and was not: the retriever had handed it
 * GDPR, page speed and payment methods, because the entry that answers "hva
 * koster det" scored below them.
 *
 * Two defects, both invisible without a test:
 *
 * 1. The keyword boost asked whether the KEYWORD contains the query token.
 *    "personvern" contains "per", so "hva koster det PER måned" scored the GDPR
 *    entry +3.
 * 2. The loose prefix match had no minimum length, and three-letter prefixes in
 *    Norwegian match almost everything.
 *
 * The rule these tests encode: **a question about money must reach the answer
 * about money**, however it is phrased. Anything less and the model fills the
 * gap itself, which is the one failure the guardrails can only suppress, never
 * repair.
 */
import { describe, expect, it } from "vitest";
import { retrieve } from "./rag";

/** The top hit's question, or null when nothing matched. */
function top(query: string): string | null {
  return retrieve(query, 3)[0]?.q ?? null;
}

function questions(query: string): string[] {
  return retrieve(query, 3).map((h) => h.q);
}

const PRICE_ANSWER = "Hva koster Digilist?";
const OFFER_ANSWER = "Hva er tilbudet til de første kundene?";

describe("price questions reach the price answer, however they are phrased", () => {
  // Every one of these is a real turn from the scenario suite or the live
  // grading run. Half of them returned something unrelated before the fix, and
  // one returned nothing at all.
  const PHRASINGS = [
    "hva koster det?",
    "hva koster det per måned?",
    "hva koster det for oss?",
    "hva ville det koste for oss?",
    "hva er det billigste alternativet deres?",
    "finnes det noe rimeligste alternativ for sånne som oss?",
    "bare si hva det koster",
    "koss e prisen på sånt?",
  ];

  it.each(PHRASINGS)("%s", (query) => {
    expect(questions(query), `no price answer for "${query}"`).toContain(PRICE_ANSWER);
  });

  it("sends a budget worry to the small-operator answer, which is more specific", () => {
    // Not a miss. "vi har ikke budsjett til noe dyrt" is the too-small fear,
    // and the entry that says smaller operators get their own prices answers it
    // better than the generic price entry does.
    expect(top("vi har ikke budsjett til noe dyrt")).toBe(
      "Er Digilist for dyrt for en liten forening?",
    );
  });

  it("sends a subscription-shape question to the subscription answer", () => {
    // Same shape as the budget case above: a more specific entry wins, and
    // that is right. "hva slags abonnement har dere?" is asking how the tiers
    // are structured, which "Hvordan fungerer abonnementet?" answers directly
    // and the price entry only alludes to.
    //
    // It moved here when the price answer grew: that entry now opens by naming
    // both readings of "hva koster det?" — renting a venue versus using
    // Digilist — because Search Console shows both audiences arriving in
    // comparable numbers, and assuming one produced a live reply that lectured
    // a would-be renter about their own rental income.
    expect(top("hva slags abonnement har dere?")).toBe("Hvordan fungerer abonnementet?");
  });

  it("puts the price answer FIRST, not merely somewhere in the top three", () => {
    // Being third is not good enough: the prompt leads with the top hit, and
    // "hva koster det per måned" used to put GDPR there.
    for (const query of PHRASINGS) {
      expect(top(query), query).toBe(PRICE_ANSWER);
    }
  });

  it("never answers a price question with GDPR or page speed", () => {
    // The exact three entries that beat it. Named individually so a future
    // scoring change that reintroduces them fails with an obvious message.
    const hits = questions("hva koster det per måned?");
    expect(hits[0]).toBe(PRICE_ANSWER);
    expect(hits.indexOf("Er Digilist GDPR-kompatibel?")).not.toBe(0);
    expect(hits.indexOf("Hvor rask er plattformen?")).not.toBe(0);
  });
});

describe("the launch offer is findable — it is the strongest thing we can say", () => {
  it.each([
    "får vi noe rabatt som tidlig kunde?",
    "er det noe kampanje nå?",
    "hva er tilbudet til de første kundene?",
  ])("%s", (query) => {
    expect(questions(query)).toContain(OFFER_ANSWER);
  });

  it("states the offer without inventing a number the guardrails would block", async () => {
    const answer = retrieve("hva er tilbudet til de første kundene?", 1)[0]?.a ?? "";
    expect(answer).toContain("6 måneder");
    expect(answer).toContain("100");
    const { gradeReply, blocking } = await import("./guardrails");
    // A price claim in the SOURCES is fine; the guard only blocks numbers the
    // model produced without one. This checks the offer wording itself would
    // survive being said back to a visitor.
    expect(blocking(gradeReply({ reply: answer, sourcesHadPrice: false }))).toEqual([]);
  });
});

describe("the pricing model is answerable, not just the price", () => {
  // "Do you take a cut?" is the question that decides it for a venue operator,
  // and the answer is a differentiator: Digilist takes none. It had no entry at
  // all, so every phrasing landed on the generic price answer or on nothing.
  // Two entries answer this family — "Tar dere en andel…" and "Hva er
  // inkludert i prisen?", which also says there are no hidden fees. Either is
  // correct; landing on something outside the family is not.
  const FEE_FAMILY = [
    "Tar dere en andel av bookinginntektene?",
    "Hva er inkludert i prisen?",
    "Hvordan fungerer abonnementet?",
  ];

  it.each([
    "tar dere en andel av det vi tar betalt?",
    "er det noen skjulte gebyrer?",
    "tar dere provisjon?",
    "hvor mye prosent tar dere av omsetningen?",
    "tar dere noe per booking?",
  ])("%s", (query) => {
    expect(FEE_FAMILY, query).toContain(top(query));
  });

  it("answers the too-small fear with pricing, not reassurance", () => {
    // The objection that failed live on 2026-08-12, and the highest-value
    // thing the assistant can now say: smaller operators get their own prices.
    for (const query of [
      "vi er en liten forening, er dette for dyrt?",
      "vi har bare ett lokale, er det for lite?",
      "vi har ikke råd til noe stort",
    ]) {
      expect(top(query), query).toBe("Er Digilist for dyrt for en liten forening?");
    }
  });
});

describe("the fix did not break everything else", () => {
  it.each([
    ["hvor lagres dataene?", "Hvor lagres dataene?"],
    ["er dere gdpr-kompatible?", "Er Digilist GDPR-kompatibel?"],
    ["hvilke integrasjoner støttes?", "Hvilke integrasjoner støttes?"],
    ["hvordan håndteres sesongleie?", "Hvordan håndteres sesongleie for lag og foreninger?"],
    ["hvilke betalingsmetoder støtter dere?", "Hvilke betalingsmetoder støtter Digilist?"],
  ])("%s finds its own entry", (query, expected) => {
    expect(top(query)).toBe(expected);
  });

  it("returns nothing for a query with no content rather than guessing", () => {
    expect(retrieve("")).toEqual([]);
    // "på" normalises to "pa", which used to survive the stopword filter and
    // match every answer containing the word.
    expect(retrieve("og på i")).toEqual([]);
  });

  it("respects k", () => {
    expect(retrieve("booking kommune pris", 2).length).toBeLessThanOrEqual(2);
  });
});

describe("short tokens must not match into the middle of long words", () => {
  it("does not let 'per' reach 'personvern'", () => {
    // The defect in one line. If this passes with the length floor removed,
    // the floor is not what is doing the work.
    const hits = questions("per");
    expect(hits).not.toContain("Er Digilist GDPR-kompatibel?");
  });
});
