import { describe, expect, it } from "vitest";
import {
  BUYING_SIGNALS,
  countBuyingSignals,
  detectObjections,
  inferStage,
  OBJECTIONS,
  STAGE_OBJECTIVE,
} from "./stage";
import {
  buildBriefing,
  extractProfile,
  interestScore,
  profileCompleteness,
  recommendedOpening,
  renderKnownFacts,
} from "./lead";
import { buildSalesSystemPrompt, FAQ_ANCHORS, SALES_PERSONA } from "./persona";

/**
 * TRAINING CASE #1 — the conversation that exposed all of this.
 * Geir Werner, Meta Hansens hus, Lillesand, 2026-08-12.
 */
const GEIR_1 =
  "Hei, vi driver et kulturhus, forsamlingslokale med plass til 80 personer. " +
  "Selskaper, bryllup kunstutstillinger m.m. Vi leier ut hele året, nesten " +
  "utelukkende helgebasert fre til søn";
const GEIR_2 = "Kan dere antyde en pris pr måned for å bruke digilist?";
const GEIR_3 = "Hva slags kontrakter tilbys?";

describe("extractProfile — training case #1", () => {
  it("reads Geir's opening the way a salesperson would", () => {
    const p = extractProfile([GEIR_1]);
    expect(p.segment).toBe("privat");
    expect(p.capacity).toBe(80);
    expect(p.cadence).toContain("helgebasert");
    expect(p.cadence).toContain("hele året");
    expect(p.useCases).toEqual(expect.arrayContaining(["bryllup", "selskaper", "utstillinger"]));
  });

  /**
   * The anti-"so what kind of venue do you have?" mechanism. Everything the
   * visitor already said goes into the prompt as VET ALLEREDE, so the assistant
   * cannot ask for it again. Re-asking is the clearest possible signal that
   * nobody is listening.
   */
  it("renders known facts so the assistant cannot re-ask them", () => {
    const facts = renderKnownFacts(extractProfile([GEIR_1]));
    expect(facts).toContain("kapasitet: 80");
    expect(facts).toContain("bryllup");
    expect(facts).toContain("helgebasert");
    expect(facts).not.toBe("(ingenting ennå)");
  });

  it("is empty for an empty conversation", () => {
    expect(renderKnownFacts(extractProfile([]))).toBe("(ingenting ennå)");
    expect(profileCompleteness(extractProfile([]))).toBe(0);
  });
});

describe("extractProfile — venue counting", () => {
  it.each([
    ["Vi har 3 lokaler", 3],
    ["vi driver to lokaler", 2],
    ["vi har bare ett lokale", 1],
    ["kun ett bygg", 1],
    ["vi leier ut 12 anlegg", 12],
  ])("reads %s as %i venue(s)", (text, expected) => {
    expect(extractProfile([text]).venues).toBe(expected);
  });

  // A wrong inference is worse than a missing one — acting on "you have 40
  // venues" when they said one destroys trust; a blank field just means we ask.
  it("leaves venues null rather than guessing", () => {
    expect(extractProfile(["Hei, hva koster Digilist?"]).venues).toBeNull();
  });

  it.each([
    ["plass til 80 personer", 80],
    ["kapasitet på 250", 250],
    ["rom for 40 gjester", 40],
  ])("reads capacity from %s", (text, expected) => {
    expect(extractProfile([text]).capacity).toBe(expected);
  });

  it("identifies the tool they use today", () => {
    expect(extractProfile(["vi bruker Google Calendar i dag"]).currentTool).toBe("Google Calendar");
    expect(extractProfile(["alt ligger i et regneark"]).currentTool).toBe("Excel/regneark");
  });

  it("only calls them a kommune when they say it about themselves", () => {
    expect(extractProfile(["Hva tilbyr dere kommuner?"]).segment).not.toBe("kommune");
    expect(extractProfile(["vi er en kommune med 12 anlegg"]).segment).toBe("kommune");
  });
});

describe("objections — answer the fear, not the sentence", () => {
  it("maps 'bare ett lokale' to the real worry", () => {
    const [o] = detectObjections("Vi har bare ett lokale, passer det?");
    expect(o.id).toBe("too-small");
    expect(o.concern).toBe("Er vi for små for dette produktet?");
  });

  it.each([
    ["Hva koster det per måned?", "price"],
    ["Kan vi prøve først?", "trial"],
    ["Vi bruker allerede Google Calendar", "existing-tool"],
    ["Jeg må diskutere det med styret", "decision-maker"],
  ])("detects %s as %s", (text, id) => {
    expect(detectObjections(text).map((o) => o.id)).toContain(id);
  });

  it("finds nothing in a neutral message", () => {
    expect(detectObjections("Hei, hvordan fungerer kalenderen?")).toEqual([]);
  });

  /**
   * REGRESSION. A plain substring match found the decision-maker cue "eier"
   * inside "vi l-eier ut hver helg" — the single most common sentence a venue
   * operator types — and classified routine discovery as a boardroom objection.
   * Cues are now anchored at a word start.
   */
  it("does not match a cue buried inside a longer word", () => {
    expect(detectObjections("vi leier ut hver helg").map((o) => o.id)).not.toContain("decision-maker");
    expect(detectObjections("vi leier ut lokalet")).toEqual([]);
  });

  // …while still matching Norwegian inflection, which is why the anchor is at
  // the START of the word and not both ends.
  it("still matches inflected forms", () => {
    expect(detectObjections("hva er prisen?").map((o) => o.id)).toContain("price");
    expect(detectObjections("prisnivået deres?").map((o) => o.id)).toContain("price");
    expect(countBuyingSignals("kan vi teste kontrakten?")).toBeGreaterThan(0);
  });

  it("every objection carries a concern and an answer shape", () => {
    for (const o of OBJECTIONS) {
      expect(o.concern.length).toBeGreaterThan(10);
      expect(o.answer.length).toBeGreaterThan(20);
      expect(o.cues.length).toBeGreaterThan(0);
    }
  });
});

describe("inferStage", () => {
  it("opens in DISCOVERY", () => {
    expect(inferStage({ userTurns: [], completeness: 0 })).toBe("DISCOVERY");
  });

  /**
   * Geir's second message. The old prompt treated this as an FAQ lookup and
   * recited the pricing model. It is an objection — the fear is "are we too
   * small / can we afford this" — and it outranks everything else.
   */
  it("treats Geir's pricing question as an OBJECTION, not a lookup", () => {
    const stage = inferStage({ userTurns: [GEIR_1, GEIR_2], completeness: 0.5 });
    expect(stage).toBe("OBJECTION");
  });

  it("an unaddressed concern outranks progress", () => {
    // High completeness AND buying signals — an objection still wins, because
    // pushing value at someone who just raised a worry loses them.
    expect(inferStage({ userTurns: ["vi har bare ett lokale"], completeness: 1 })).toBe("OBJECTION");
  });

  it("moves to HANDOFF on sustained intent once we know who they are", () => {
    expect(
      inferStage({ userTurns: ["kan vi få demo?", "hvor raskt kan vi komme i gang?"], completeness: 0.6 }),
    ).toBe("HANDOFF");
  });

  it("stays in INTENT when they signal but we still know little", () => {
    expect(inferStage({ userTurns: ["kan vi få demo?"], completeness: 0 })).toBe("INTENT");
  });

  it("reaches VALUE once we know enough and nothing is blocking", () => {
    expect(inferStage({ userTurns: ["vi leier ut hver helg"], completeness: 0.6 })).toBe("VALUE");
  });

  it("every stage has exactly one objective", () => {
    for (const [stage, objective] of Object.entries(STAGE_OBJECTIVE)) {
      expect(objective.length, stage).toBeGreaterThan(30);
      // The failure being corrected is a reply that does six things. An
      // objective naming several goals would reproduce it.
      expect(objective.split("?").length - 1, `${stage} asks for >1 question`).toBeLessThanOrEqual(1);
    }
  });
});

describe("buying signals", () => {
  it("counts distinct signals across the conversation", () => {
    expect(countBuyingSignals("hva koster det og kan vi få demo?")).toBeGreaterThanOrEqual(2);
    expect(countBuyingSignals("hvordan fungerer kalenderen?")).toBe(0);
  });

  it("includes the phrases that actually appeared in the real lead", () => {
    expect(BUYING_SIGNALS).toContain("pris");
    expect(BUYING_SIGNALS).toContain("kontrakt");
  });
});

describe("the prompt", () => {
  const base = {
    stage: "OBJECTION" as const,
    profile: { ...extractProfile([GEIR_1]), objections: ["price"], signals: ["pris"] },
    latestUserTurn: GEIR_2,
    sources: "[1] Hva koster Digilist? Prisen avhenger av antall anlegg.",
    pages: "",
  };

  it("carries the restraint rule, the pacing, and the one-question limit", () => {
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("de ÉN ELLER TO som er mest relevante");
    expect(p).toContain("20-70 ord");
    expect(p).toContain("Maks ETT spørsmål per svar");
  });

  /**
   * Grounding must survive the rewrite. Verified against a live probe: with the
   * FAQ context the assistant said "det finnes ikke en fast pris per måned";
   * WITHOUT it, an ungrounded probe invented "300-600 kr/mnd". Selling harder
   * must never cost this rule.
   */
  it("keeps the no-fabrication rule from the old support prompt", () => {
    expect(SALES_PERSONA).toContain("Aldri finn på pris");
    expect(buildSalesSystemPrompt(base)).toContain("KILDER");
  });

  it("injects the concern behind the question when one is detected", () => {
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("BEKYMRINGEN BAK DET DE NETTOPP SA");
    expect(p).toContain("Er verdien verdt kostnaden for oss?");
  });

  it("omits the objection block entirely when nothing is detected", () => {
    const p = buildSalesSystemPrompt({ ...base, latestUserTurn: "Hvordan fungerer kalenderen?" });
    expect(p).not.toContain("BEKYMRINGEN BAK");
  });

  it("tells the model what it already knows, so it cannot re-ask", () => {
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("VET ALLEREDE OM KUNDEN");
    expect(p).toContain("kapasitet: 80");
  });

  it("ends with the single objective for this stage", () => {
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("fase OBJECTION");
    expect(p.trimEnd().endsWith("maks ett spørsmål.")).toBe(true);
  });

  // The old prompt's closing move. It is now explicitly forbidden.
  it("forbids ending on 'kontakt salg'", () => {
    expect(SALES_PERSONA).toContain("Aldri skriv «kontakt salg»");
  });

  /**
   * A live lead on 2026-08-12 was told "Se også /faq#q-27". That anchor has
   * never existed — the FAQ emits anchors from category ids. A bad fragment does
   * not 404; it silently drops the visitor at the top of the page, which is the
   * same silent-failure shape as the FAQ fallback itself.
   *
   * Forbidding invented links is only half the fix: a model told "no links" when
   * it has something worth pointing at will disobey or drop a useful reference.
   * So it also gets the real list.
   */
  it("forbids invented links and supplies the real anchors", () => {
    expect(SALES_PERSONA).toContain("Aldri finn på en lenke");
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("GYLDIGE FAQ-LENKER");
    expect(p).toContain("/faq#priser");
  });

  /**
   * REGRESSION. The old support prompt carried "Bruk norsk bokmål" as an explicit
   * rule. The first sales rewrite left it only in the closing line, and the live
   * model drifted into Nynorsk mid-answer — "for eit kulturhus på størrelse med
   * dykkar… ein moderat prisklasse", "månedleg eller årleg", "prøva utan risiko".
   * A Bokmål/Nynorsk blend reads as sloppy to a Norwegian business reader, so the
   * rule is back in the body with the specific words that drifted.
   */
  it("demands Bokmål explicitly, naming the forms that drifted", () => {
    // The rule MOVED into the per-language instruction when English was added —
    // two conflicting language rules in one prompt is how a reply comes back
    // half-translated. It is asserted on the built prompt rather than on the
    // persona constant, which is where it now has to be true.
    const p = buildSalesSystemPrompt(base);
    expect(p).toContain("SKRIV NORSK BOKMÅL");
    for (const nynorsk of ["dykkar", "eit/ein", "dei", "månedleg/årleg", "prøva/testa", "utan"]) {
      expect(p, `missing guard for ${nynorsk}`).toContain(nynorsk);
    }
  });

  it("switches the whole language rule for an English visitor, not just adds one", () => {
    // An English-speaking operator asking "how much would this cost us?" used
    // to get a fluent Norwegian reply. The scenario passed — lead filed, price
    // answered — and the visitor could not read a word of it.
    const en = buildSalesSystemPrompt({ ...base, language: "en" });
    expect(en).toContain("SKRIV ENGELSK");
    expect(en).not.toContain("SKRIV NORSK BOKMÅL");
    // The pricing policy has to survive the language switch unsoftened.
    expect(en).toMatch(/NO transaction fee/);
    expect(en).toMatch(/Never "low fees"/);
  });

  /**
   * The live answer claimed the price was "langt mindre enn det dere spart på å
   * slippe manuell bookingbehandling" — a claim about the CUSTOMER's numbers,
   * which the assistant does not have. Grounding covers Digilist's facts; this
   * covers assertions about the customer's savings.
   */
  it("forbids unevidenced savings claims", () => {
    expect(SALES_PERSONA).toContain("Aldri lov en besparelse du ikke kan belegge");
  });

  it("every advertised anchor matches a real FAQ category id", () => {
    // The ids the FAQ page actually renders (src/content/faq.ts).
    const real = ["produkt", "funksjonalitet", "kommune", "samsvar", "teknologi", "priser", "support"];
    expect(FAQ_ANCHORS.map((a) => a.replace("/faq#", ""))).toEqual(real);
    expect(FAQ_ANCHORS.some((a) => /q-\d+/.test(a))).toBe(false);
  });
});

describe("handoff briefing", () => {
  it("turns Geir's transcript into a brief a human can act on", () => {
    const p = { ...extractProfile([GEIR_1, GEIR_2, GEIR_3]), objections: ["price"], signals: ["pris", "kontrakt"] };
    const b = buildBriefing(p, "Meta Hansens hus", "Geir Werner");
    expect(b).toContain("Geir Werner — Meta Hansens hus");
    expect(b).toContain("Kapasitet: ca. 80");
    expect(b).toContain("Innvendinger: price");
    expect(b).toContain("Interesse:");
    expect(b).toContain("Anbefalt åpning:");
  });

  it("flags a single-venue customer as price-sensitive", () => {
    const b = buildBriefing({ ...extractProfile(["vi har bare ett lokale"]), objections: [], signals: [] });
    expect(b).toContain("liten kunde");
  });

  it("recommends addressing the small-customer fear first when it applies", () => {
    const p = { ...extractProfile(["bare ett lokale"]), objections: ["too-small"], signals: [] };
    expect(recommendedOpening(p)).toContain("ett lokale er helt greit");
  });

  it("falls back to the discovery question when nothing else is known", () => {
    expect(recommendedOpening(extractProfile([]))).toContain("håndterer forespørsler og kalender i dag");
  });

  it("scores interest higher with signals than without", () => {
    const cold = { ...extractProfile([GEIR_1]), objections: [], signals: [] };
    const warm = { ...extractProfile([GEIR_1]), objections: ["price"], signals: ["pris", "kontrakt"] };
    expect(interestScore(warm)).toBeGreaterThan(interestScore(cold));
    expect(interestScore(warm)).toBeLessThanOrEqual(100);
  });
});
