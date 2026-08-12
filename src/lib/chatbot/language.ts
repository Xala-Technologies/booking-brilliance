/**
 * Which language the assistant answers in.
 *
 * The persona has always ended with "SKRIV NORSK BOKMÅL", and the live grading
 * run showed exactly what that produces: an English-speaking operator writing
 * "we run a community hall in Stavanger, how much would this cost us?" gets a
 * fluent Norwegian reply. The scenario passed — the lead was filed, the price
 * answered — and the visitor could not read a word of it.
 *
 * ── Why the VISITOR decides, not the page ───────────────────────────────
 *
 * Locale everywhere else on this site comes from the URL, deliberately. The
 * chat is the one place that rule is wrong. Someone reading the Norwegian site
 * who types in English is telling us something the URL cannot: that Norwegian
 * is not working for them. Answering in Norwegian because they happen to be on
 * /priser would be choosing consistency over the person in front of us.
 *
 * The page is still the starting point — the first turn of a conversation on
 * /en is answered in English before the visitor has typed anything detectable.
 *
 * ── Why it is sticky ────────────────────────────────────────────────────
 *
 * Language is decided ONCE per conversation and then held. A visitor who writes
 * three English turns and then types a Norwegian place name — "we are in
 * Trondheim" — must not get a Norwegian reply mid-conversation. Language
 * flapping reads as broken far more than a wrong initial guess does, and the
 * visitor can always correct it by writing a full sentence in the other
 * language, which is what `detectLanguage` reads.
 */

export type ChatLanguage = "nb" | "en";

/**
 * Words that only appear in Norwegian, and only as function words.
 *
 * Deliberately function words rather than nouns: place names, "Vipps",
 * "kommune" and venue words show up constantly in English sentences written by
 * people dealing with Norway, and treating those as Norwegian would flip the
 * language on an English speaker mid-conversation.
 */
const NORWEGIAN_MARKERS = [
  /\bikke\b/iu, /\bdere\b/iu, /\bvåre?\b/iu, /\bhva\b/iu, /\bhvor\b/iu,
  /\bhvordan\b/iu, /\bkan\s+vi\b/iu, /\bvi\s+har\b/iu, /\bmed\b/iu,
  /\bfor\s+oss\b/iu, /\bkoster\b/iu, /\bnoe\b/iu, /\bmen\b/iu, /\bogså\b/iu,
  /\bjeg\b/iu, /\bdet\s+er\b/iu, /\bsom\b/iu, /\btil\b/iu, /\bpå\b/iu,
  /\bkva\b/iu, /\bikkje\b/iu, /\beit\b/iu,
];

/** The English equivalents. Same rule: function words, not domain nouns. */
const ENGLISH_MARKERS = [
  /\bthe\b/iu, /\band\b/iu, /\bwe\s+(are|have|need|want)\b/iu, /\bcan\s+we\b/iu,
  /\bhow\s+(much|do|does|many)\b/iu, /\bwhat\b/iu, /\byour\b/iu, /\bour\b/iu,
  /\bwith\b/iu, /\bfor\s+us\b/iu, /\bis\s+(it|there)\b/iu, /\bdo\s+you\b/iu,
  /\bplease\b/iu, /\bthanks?\b/iu, /\bwould\b/iu, /\bcost\b/iu,
];

function score(text: string, markers: readonly RegExp[]): number {
  return markers.filter((re) => re.test(text)).length;
}

/**
 * The language of a piece of text, or null when it is too short to tell.
 *
 * Null matters. "ok", "ja", an email address or an emoji carry no signal, and
 * guessing on them is how a conversation flips language on a one-word turn.
 * The caller keeps whatever it decided before.
 */
export function detectLanguage(text: string): ChatLanguage | null {
  const nb = score(text, NORWEGIAN_MARKERS);
  const en = score(text, ENGLISH_MARKERS);
  if (nb === en) return null;
  // A single marker is enough when nothing contradicts it — "how much does this
  // cost?" contains no Norwegian at all and should not need three hits — but a
  // tie or an empty read is never resolved by guessing.
  return nb > en ? "nb" : "en";
}

export interface LanguageInput {
  /** Everything the visitor has typed, oldest first. */
  userTurns: readonly string[];
  /** The locale of the page the chat is open on. */
  pageLocale: ChatLanguage;
  /** What was decided earlier in this conversation, if anything. */
  current?: ChatLanguage | null;
}

/**
 * The language for this turn.
 *
 * Order of authority:
 *   1. A language already established for this conversation — held, so a stray
 *      Norwegian place name in an English sentence cannot flip it.
 *   2. What the visitor has actually written, read across ALL their turns so a
 *      short second turn cannot overturn a clear first one.
 *   3. The page they are on.
 *
 * Rule 2 reading every turn rather than the latest one is the important part.
 * Reading only the newest turn would flip to Norwegian the moment an English
 * speaker typed "Trondheim" on its own.
 */
export function conversationLanguage(input: LanguageInput): ChatLanguage {
  if (input.current) return input.current;
  const detected = detectLanguage(input.userTurns.join(" "));
  return detected ?? input.pageLocale;
}

/**
 * The instruction appended to the persona.
 *
 * Replaces the bokmål rule wholesale rather than sitting beside it. Two
 * conflicting language instructions in one prompt is how a reply comes back
 * half-translated, and the Norwegian rule is long and specific — leaving it in
 * place while adding "answer in English" would be asking the model to resolve
 * a contradiction on every turn.
 */
export function languageInstruction(lang: ChatLanguage): string {
  if (lang === "en") {
    return `SPRÅK — SKRIV ENGELSK
The visitor is writing in English, so answer in English. Everything else in
these instructions still applies: same length, same single question, same rules
about never inventing a price, a link or an action.

- Plain English. Short sentences. Say what a thing does before naming it.
- Norwegian terms need a short gloss the first time: ID-porten and BankID are
  Norway's national digital identity services, EHF is the European e-invoicing
  standard, a kommune is a municipality, a grendehus is a community hall.
- Never leave a Norwegian sentence in an English reply.
- Pricing in English, unsoftened: Digilist takes NO transaction fee and NO share
  of booking revenue. Never "low fees" or "a small commission" — we take
  nothing, and that is the strongest thing we can say.`;
  }
  return `SPRÅK — SKRIV NORSK BOKMÅL
Ikke nynorsk, ikke dialekt, ikke bland inn engelsk. Skriv «deres» (aldri
«dykkar»), «et/en» (aldri «eit/ein»), «de» (aldri «dei»), «månedlig/årlig»
(aldri «månedleg/årleg»), «prøve/teste» (aldri «prøva/testa»), «nå» (aldri
«no»), «uten» (aldri «utan»). Kunden forventer bokmål; en blanding leser som
slurv.`;
}
