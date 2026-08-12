import { describe, expect, it } from "vitest";
import { conversationLanguage, detectLanguage, languageInstruction } from "./language";

describe("detectLanguage", () => {
  it.each([
    ["hei, vi har et kulturhus og lurer på hva det koster", "nb"],
    ["kan vi bruke dette for oss?", "nb"],
    ["hi, we run a community hall and want to know how much it costs", "en"],
    ["can we get a quote for our venue?", "en"],
    ["what is included in the price?", "en"],
  ])("%s → %s", (text, expected) => {
    expect(detectLanguage(text)).toBe(expected);
  });

  it("is null on text too short to tell — guessing is how a chat flips language", () => {
    for (const text of ["ok", "ja", "👋", "kari@example.com", "", "Trondheim"]) {
      expect(detectLanguage(text), text).toBeNull();
    }
  });

  it("does not read a Norwegian place or product name as Norwegian", () => {
    // The failure this guards: an English speaker mentioning Vipps, a kommune
    // or a city gets answered in Norwegian mid-conversation.
    expect(detectLanguage("we are a kommune in Trondheim and we use Vipps")).toBe("en");
    expect(detectLanguage("do you support BankID and ID-porten?")).toBe("en");
  });
});

describe("conversationLanguage", () => {
  it("follows the visitor over the page they are on", () => {
    // The URL decides locale everywhere else on the site. Here it must not:
    // someone on the Norwegian site writing English is telling us Norwegian is
    // not working for them.
    expect(
      conversationLanguage({
        userTurns: ["how much does this cost for a single venue?"],
        pageLocale: "nb",
      }),
    ).toBe("en");
  });

  it("falls back to the page when the visitor has given no signal", () => {
    expect(conversationLanguage({ userTurns: ["ok"], pageLocale: "en" })).toBe("en");
    expect(conversationLanguage({ userTurns: [], pageLocale: "nb" })).toBe("nb");
  });

  it("holds the language once established — flapping reads as broken", () => {
    // Three English turns then a Norwegian place name must not switch it.
    expect(
      conversationLanguage({
        userTurns: ["we run a hall", "how much?", "vi er i Trondheim"],
        pageLocale: "nb",
        current: "en",
      }),
    ).toBe("en");
  });

  it("reads ALL turns, so a short second turn cannot overturn a clear first", () => {
    expect(
      conversationLanguage({
        userTurns: ["hi, we run a community hall and want to know how much it costs", "Oslo"],
        pageLocale: "nb",
      }),
    ).toBe("en");
  });
});

describe("languageInstruction", () => {
  it("REPLACES the bokmål rule rather than sitting beside it", () => {
    // Two conflicting language instructions in one prompt is how a reply comes
    // back half-translated.
    const en = languageInstruction("en");
    expect(en).toContain("SKRIV ENGELSK");
    expect(en).not.toMatch(/Svar på norsk bokmål/);
  });

  it("carries the pricing policy into English, unsoftened", () => {
    const en = languageInstruction("en");
    expect(en).toMatch(/NO transaction fee/);
    // Whitespace-tolerant: the instruction is line-wrapped prose.
    expect(en).toMatch(/NO share\s+of booking revenue/);
    expect(en).toMatch(/Never "low fees"/);
  });

  it("tells it to gloss Norwegian terms rather than drop or keep them raw", () => {
    expect(languageInstruction("en")).toMatch(/ID-porten and BankID are/);
  });

  it("keeps the Norwegian instruction Norwegian", () => {
    expect(languageInstruction("nb")).toContain("NORSK BOKMÅL");
    expect(languageInstruction("nb")).not.toMatch(/English/);
  });
});

describe("the rest of the chat path follows the language", () => {
  it("retrieves from the ENGLISH corpus for an English question", async () => {
    // Retrieval is lexical token overlap, so an English query against Norwegian
    // answers matches almost nothing — the model gets no sources and fills the
    // gap itself, which is exactly how the invented price happened.
    const { retrieve } = await import("./rag");
    const nb = retrieve("what does it cost per month?", 3, "nb");
    const en = retrieve("what does it cost per month?", 3, "en");
    expect(en[0]?.q).toBe("What does Digilist cost?");
    expect(en[0]?.q).not.toBe(nb[0]?.q);
  });

  it("finds the fee answer in English, which is the question that decides a sale", async () => {
    const { retrieve } = await import("./rag");
    const hits = retrieve("do you take a cut of our bookings?", 3, "en").map((h) => h.q);
    expect(hits).toContain("Do you take a cut of booking revenue?");
  });

  it("does not judge an English reply against the Nynorsk rule", async () => {
    // "ein", "eit" and "utan" are Nynorsk markers. An English reply is not
    // bokmål at all, and judging it as bokmål suppresses correct answers.
    const { blocking, gradeReply } = await import("./guardrails");
    const reply = "We take no share of your booking revenue. What kind of venue do you run?";
    expect(blocking(gradeReply({ reply, language: "en" }))).toEqual([]);
  });

  it("still catches Nynorsk drift in a Norwegian reply", async () => {
    const { blocking, gradeReply } = await import("./guardrails");
    const drift = "Prisen for eit kulturhus på storleik med dykkar ligg i ein moderat klasse.";
    expect(blocking(gradeReply({ reply: drift, language: "nb" })).map((v) => v.rule)).toContain(
      "nynorsk-drift",
    );
    // And by default, since every existing caller passes no language.
    expect(blocking(gradeReply({ reply: drift })).map((v) => v.rule)).toContain("nynorsk-drift");
  });
});

describe("decideTurn forwards the language — the seam, not the pieces", () => {
  it("passes the language to the guardrails — same reply, two verdicts", async () => {
    // The plumbing, pinned directly. My first attempt at this test used an
    // ordinary English reply and passed with the forward DELETED, because no
    // Nynorsk marker appears in ordinary English — it proved nothing. This one
    // holds the reply constant and changes only the language, so it can only
    // pass if `decideTurn` actually forwards it.
    const { decideTurn } = await import("./turn");
    const reply = "We can do that utan problem for eit lokale.";
    const base = {
      userTurns: ["how much does this cost?"],
      reply,
      hitCount: 2,
      leadAlreadyFiled: false,
      alreadyNotified: false,
    };
    expect(decideTurn({ ...base, language: "en" }).guardTripped).toBe(false);
    expect(decideTurn({ ...base, language: "nb" }).guardTripped).toBe(true);
  });

  it("lets an ordinary English reply through untouched", async () => {
    const { decideTurn } = await import("./turn");
    const d = decideTurn({
      userTurns: ["how much does this cost for our community hall?"],
      reply: "We take no share of your booking revenue. How many venues do you run?",
      hitCount: 2,
      leadAlreadyFiled: false,
      alreadyNotified: false,
      language: "en",
    });
    expect(d.guardTripped).toBe(false);
    expect(d.text).toContain("no share of your booking revenue");
  });

  it("still guards a Norwegian reply when no language is given", async () => {
    const { decideTurn } = await import("./turn");
    const d = decideTurn({
      userTurns: ["hva koster det?"],
      reply: "Prisen for eit kulturhus på storleik med dykkar ligg i ein moderat klasse.",
      hitCount: 2,
      leadAlreadyFiled: false,
      alreadyNotified: false,
    });
    expect(d.guardTripped).toBe(true);
  });
});
