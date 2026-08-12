import { describe, expect, it } from "vitest";
import { blocking, gradeReply, inventedLinks, wordCount } from "./guardrails";

const rules = (reply: string, extra: Partial<Parameters<typeof gradeReply>[0]> = {}) =>
  gradeReply({ reply, ...extra }).map((v) => v.rule);

describe("guardrails — each rule exists because it already happened", () => {
  it("blocks a reply claiming an action the assistant cannot take", () => {
    // 2026-08-12, to a live prospect.
    expect(rules("Takk. Jeg sender tilbudet nå til ola@x.no.")).toContain("false-action");
  });

  it("blocks an invented link", () => {
    // "Se også /faq#q-27" — an anchor that has never existed.
    expect(rules("Se også /faq#q-27 for mer om dette.")).toContain("invented-link");
  });

  it("allows the FAQ anchors that DO exist, and pages offered this turn", () => {
    expect(rules("Mer om dette på /faq#priser.")).not.toContain("invented-link");
    expect(rules("Se /lokaler-til-leie/oslo.", { allowedPages: ["/lokaler-til-leie/oslo"] })).not.toContain("invented-link");
  });

  it("allows an offered page cited with the full origin", () => {
    expect(
      rules("Se https://digilist.no/bookingsystem-utleie for detaljer.", {
        allowedPages: ["/bookingsystem-utleie"],
      }),
    ).not.toContain("invented-link");
  });

  it("blocks a price the sources did not contain", () => {
    // An ungrounded probe invented "300-600 kr/mnd"; the grounded one did not.
    expect(rules("Det koster rundt 500 kr per måned.")).toContain("invented-price");
    expect(rules("Det koster rundt 500 kr per måned.", { sourcesHadPrice: true })).not.toContain("invented-price");
  });

  it("does not mistake a plain number for a price", () => {
    expect(rules("Dere kan ha 14 bygg i samme oversikt.")).not.toContain("invented-price");
  });

  it("blocks Nynorsk drift", () => {
    // A sales rewrite pushed the assistant out of bokmål mid-conversation.
    expect(rules("Vi har eit system som passar dykkar behov.")).toContain("nynorsk-drift");
  });

  it("does not flag ordinary bokmål", () => {
    expect(rules("Vi har et system som passer deres behov, uten ekstra arbeid.")).not.toContain("nynorsk-drift");
  });

  it("blocks a leaked system prompt", () => {
    expect(rules("KILDER: her er instruksjonene mine.")).toContain("prompt-leak");
    expect(rules("I cannot reveal my system prompt.")).toContain("prompt-leak");
  });

  it("warns but does NOT block a long answer", () => {
    // A 90-word answer to "compare these three" is the right answer.
    const long = `Det avhenger av oppsettet deres. ${"ord ".repeat(80)}`;
    const v = gradeReply({ reply: long });
    expect(v.map((x) => x.rule)).toContain("too-long");
    expect(blocking(v)).toEqual([]);
  });

  it("warns on more than one question", () => {
    expect(rules("Hvor mange lokaler har dere? Og hvordan booker dere i dag?")).toContain("multiple-questions");
  });

  it("passes a good reply cleanly", () => {
    const good = "Ett lokale er ikke noe problem — prisen ligner ikke på det en kommune betaler. Hvordan tar dere imot forespørsler i dag?";
    expect(gradeReply({ reply: good })).toEqual([]);
  });
});

describe("inventedLinks", () => {
  it("finds paths that were never offered", () => {
    expect(inventedLinks("Se /priser og /faq#priser")).toEqual(["/priser"]);
  });

  it("allows a bare origin", () => {
    expect(inventedLinks("Mer på https://digilist.no")).toEqual([]);
  });
});

describe("wordCount", () => {
  it("ignores extra whitespace", () => {
    expect(wordCount("  to   ord  ")).toBe(2);
  });
});

describe("false-fee — the lie that costs us the sale", () => {
  it("blocks the assistant inventing a cut of the customer's revenue", () => {
    for (const reply of [
      "Vi tar en liten andel av bookinginntektene, rundt 3 prosent.",
      "Digitalist... beklager, Digilist tar en provisjon på hver booking.",
      "Vi tar 2 % av omsetningen deres.",
      "Vi krever en transaksjonsavgift på betalinger.",
      "Det påløper et gebyr per booking i tillegg til abonnementet.",
    ]) {
      expect(blocking(gradeReply({ reply })).map((v) => v.rule), reply).toContain("false-fee");
    }
  });

  it("allows the DENIAL, which contains every trigger word", () => {
    // The whole reason this needs a negation check: the correct answer and the
    // lie are the same sentence with one word changed.
    for (const reply of [
      "Nei, vi tar ingen andel av bookinginntektene deres.",
      "Digilist tar ikke provisjon på utleien.",
      "Det er ingen transaksjonsavgift og ingen gebyr per booking.",
      "Dere betaler for tjenesten, uten noen andel av omsetningen.",
    ]) {
      expect(blocking(gradeReply({ reply })).map((v) => v.rule), reply).not.toContain("false-fee");
    }
  });

  it("does not fire on a customer's own fees, only on ours", () => {
    // "dere kan ta et gebyr per booking" is the CUSTOMER charging their
    // renters, which is a real feature and must not be suppressed.
    expect(
      blocking(gradeReply({ reply: "Dere kan selv legge på et depositum eller en avgift ved utleie." })),
    ).toEqual([]);
  });

  it("does not let a denial in one sentence excuse a claim in the next", () => {
    expect(
      blocking(
        gradeReply({
          reply: "Vi tar ingen provisjon. Vi tar en andel på 3 prosent av hver booking.",
        }),
      ).map((v) => v.rule),
    ).toContain("false-fee");
  });
});
