/**
 * Where the customer is in the conversation, and what the assistant owes them
 * next.
 *
 * WHY A STATE MACHINE AND NOT JUST A PROMPT
 *
 * The assistant is good at writing a Norwegian sentence and bad at remembering
 * that it has already asked three questions and never made a recommendation. If
 * the whole sales process lives in prose, the model re-improvises it every turn
 * and the conversation has no shape: it answers, defers to the contact form, and
 * the visitor leaves.
 *
 * That is not hypothetical. On 2026-08-12 a venue operator asked three times
 * whether Digilist suits a single-venue business. He was never asked a single
 * question back, never got the concern addressed, and escalated to the contact
 * form to ask a human. The stage below is what would have caught that: at
 * OBJECTION, the assistant's job is to answer the fear, not the sentence.
 *
 * The stage is INFERRED from the transcript rather than tracked as mutable
 * state, because a chat widget has no session store and a page reload must not
 * reset the sale. Same input, same stage — so it is testable, and two identical
 * conversations cannot diverge.
 *
 * Pure. No model call, no I/O.
 */

export type SalesStage =
  /** Opening. We know nothing. Job: understand their situation. */
  | "DISCOVERY"
  /** We know roughly what they run. Job: size it — volume, current process. */
  | "QUALIFICATION"
  /** Enough context to be specific. Job: connect Digilist to THEIR situation. */
  | "VALUE"
  /** They raised a concern, explicit or implied. Job: answer the fear. */
  | "OBJECTION"
  /** They are signalling purchase intent. Job: propose the concrete next step. */
  | "INTENT"
  /** Enough is known and intent is real. Job: get a human in the room. */
  | "HANDOFF";

/**
 * A concern the customer voiced, and the thing they are actually worried about.
 *
 * The whole point of this table is the second column. "Hva koster det?" answered
 * literally is a price list; answered as the fear behind it, it is a sale.
 */
export interface Objection {
  id: string;
  /** Norwegian phrases that surface this concern. Matched case-insensitively. */
  cues: readonly string[];
  /** What they are really asking. This is what the answer must address. */
  concern: string;
  /** How to open the reply. Not a script — the shape of an honest answer. */
  answer: string;
}

export const OBJECTIONS: readonly Objection[] = [
  {
    id: "too-small",
    cues: ["bare ett lokale", "kun ett lokale", "bare ett bygg", "kun et lokale", "vi er små", "lite lag", "bare én sal"],
    concern: "Er vi for små for dette produktet?",
    answer:
      "Ett lokale er ikke noe problem, og prisen skal ikke ligne på det en kommune med mange bygg betaler. Det er ofte nettopp med ett aktivt lokale man raskest merker at manuell booking forsvinner.",
  },
  {
    id: "price",
    cues: ["hva koster", "pris", "prisen", "kostnad", "dyrt", "kostbart", "budsjett", "pr måned", "per måned"],
    concern: "Er verdien verdt kostnaden for oss?",
    answer:
      "Plasser dem i riktig prisklasse først (antall lokaler, hva de faktisk trenger) i stedet for å ramse opp prismodellen. Aldri oppgi et tall som ikke står i KILDER.",
  },
  {
    id: "trial",
    // "test" alone is dropped. `matchesCue` is prefix-anchored, so it matched
    // a scraper sending "test test aaaaaaa" and scored it as a visitor asking
    // for a trial — 10 points of objection credit for pure noise. The verb
    // forms carry the intent; the bare noun is the one people never use to
    // mean "let us try it", and the one bots send constantly.
    cues: ["prøve", "teste", "prøver", "testet", "pilot", "prøveperiode", "uforpliktende"],
    concern: "Jeg er interessert, men stoler ikke på kjøpet ennå.",
    answer:
      "Senk risikoen: pilot/demo er gratis og uforpliktende. Ikke selg hardere — de har allerede sagt at de vurderer.",
  },
  {
    id: "existing-tool",
    cues: ["google calendar", "outlook", "excel", "regneark", "bruker allerede", "har allerede et system", "vi har et system"],
    concern: "Hvorfor bytte fra det vi har?",
    answer:
      "Ikke snakk ned verktøyet deres. Spør hva som faktisk koster tid i dagens løsning, og knytt svaret til det ene.",
  },
  {
    id: "decision-maker",
    cues: ["styret", "ledelsen", "må diskutere", "må forankre", "sjefen", "kommunestyret", "eier"],
    concern: "Hjelp meg begrunne dette internt.",
    answer:
      "Gi dem noe å ta med seg: hva det løser, hva det koster i tid i dag, og tilbud om at en rådgiver blir med i møtet.",
  },
  {
    id: "integration",
    cues: ["integrasjon", "regnskap", "vipps", "fakturering mot", "eksisterende system", "importere"],
    concern: "Passer dette inn i det vi allerede bruker?",
    answer: "Bekreft konkret hva som er innebygd, og spør hva de bruker i dag før du lover noe.",
  },
] as const;

/**
 * Phrases that mean the visitor is buying, not browsing.
 *
 * These change what the assistant owes them: a browsing visitor wants an answer,
 * a buying visitor wants a next step. Treating a buying signal as an FAQ lookup
 * is the single most expensive mistake this assistant can make.
 */
export const BUYING_SIGNALS: readonly string[] = [
  "pris", "hva koster", "tilbud", "demo", "komme i gang", "hvor raskt",
  "kontrakt", "abonnement", "betaling", "bytte løsning", "vurderer",
  "kan vi bruke", "passer det for oss", "hvordan starter",
] as const;

/**
 * Does `cue` appear as a word (or the start of one) in `text`?
 *
 * Anchored at the word START but suffix-permissive, which is exactly right for
 * Norwegian: "pris" must match "prisen"/"priser"/"prisnivå", while "eier" must
 * NOT match inside "leier".
 *
 * That second case is not theoretical. A plain `includes()` matched the
 * decision-maker cue "eier" inside "vi l-eier ut hver helg" — the single most
 * common sentence a venue operator types — and silently classified a routine
 * discovery turn as a boardroom objection. Word boundaries here use a
 * Unicode letter class, not `\b`, because æ/ø/å are non-word characters to `\b`
 * and half the Norwegian cues would break on it.
 */
export function matchesCue(text: string, cue: string): boolean {
  const escaped = cue.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}`, "iu").test(text.toLowerCase());
}

/** Every objection whose cues appear in the text. */
export function detectObjections(text: string): Objection[] {
  return OBJECTIONS.filter((o) => o.cues.some((c) => matchesCue(text, c)));
}

/** How many distinct buying signals the visitor has given. */
export function countBuyingSignals(text: string): number {
  return buyingSignalsIn(text).length;
}

/**
 * WHICH buying signals appear — the list, not the count.
 *
 * Uses `matchesCue`, not `includes`. That distinction is the whole reason
 * `matchesCue` exists: a plain substring match found the cue "eier" inside
 * "vi l-eier ut hver helg". `buildLLMContext` was filtering BUYING_SIGNALS
 * with `includes` and so carried that bug independently; both callers now go
 * through here.
 */
export function buyingSignalsIn(text: string): string[] {
  return BUYING_SIGNALS.filter((s) => matchesCue(text, s));
}

export interface StageInput {
  /** Everything the VISITOR has said, oldest first. */
  userTurns: readonly string[];
  /** How much we have managed to learn — see lead.ts `profileCompleteness`. */
  completeness: number;
}

/**
 * Infer the stage. Order matters: an objection outranks progress, because an
 * unaddressed concern stops a sale regardless of how much we have learned.
 */
export function inferStage(input: StageInput): SalesStage {
  const all = input.userTurns.join("\n");
  if (input.userTurns.length === 0) return "DISCOVERY";

  const latest = input.userTurns[input.userTurns.length - 1];
  const signals = countBuyingSignals(all);
  const objections = detectObjections(latest);

  // An unanswered concern outranks everything. Pushing value at someone who
  // just asked "are we too small for this?" is how you lose them.
  if (objections.length > 0) return "OBJECTION";

  // Strong, sustained intent + we know who they are ⇒ stop selling, get a human.
  if (signals >= 2 && input.completeness >= 0.5) return "HANDOFF";
  if (signals >= 1) return "INTENT";

  if (input.completeness >= 0.5) return "VALUE";
  if (input.userTurns.length >= 2 || input.completeness > 0) return "QUALIFICATION";
  return "DISCOVERY";
}

/**
 * The ONE thing the assistant owes the visitor at this stage.
 *
 * Singular on purpose. The failure mode being corrected is a reply that answers
 * six things at once; an objective that lists three goals reproduces it.
 */
export const STAGE_OBJECTIVE: Record<SalesStage, string> = {
  DISCOVERY:
    "Forstå situasjonen deres. Anerkjenn det de nettopp sa med ÉN setning, og still ÉTT åpent spørsmål om hvordan de jobber i dag. Ikke presenter funksjoner ennå.",
  QUALIFICATION:
    "Finn omfanget. Still ÉTT konkret spørsmål (volum, dagens rutine, hvem som håndterer forespørsler). Ikke still flere spørsmål i samme svar.",
  VALUE:
    "Knytt Digilist til DERES situasjon med ett konkret utfall — ikke en funksjonsliste. Avslutt med ÉTT spørsmål som tar samtalen videre.",
  OBJECTION:
    "Svar på bekymringen bak spørsmålet, ikke bare det bokstavelige spørsmålet. Én setning som fjerner bekymringen, så ÉTT spørsmål som fortsetter samtalen.",
  INTENT:
    "De signaliserer kjøp. Svar kort på det de spurte om, og foreslå ÉTT konkret neste steg. Ikke ramse opp mer produktinfo.",
  HANDOFF:
    "Slutt å selge. Foreslå en kort prat med en rådgiver som ser på akkurat deres oppsett, og spør om det passer. Ikke skriv «kontakt salg» — tilby det konkret.",
};
