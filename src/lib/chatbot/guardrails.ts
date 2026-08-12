/**
 * Rules every assistant reply must satisfy, checked on the reply itself.
 *
 * The scenario suite proves that GIVEN a conversation the right thing happens.
 * It says nothing about whether what the assistant SAYS is any good — and
 * every incident on this project so far has been about what it said:
 *
 *   2026-07-23  a 20-day outage answered with FAQ text and nobody noticed
 *   2026-08-12  "Se også /faq#q-27" — an anchor that has never existed
 *   2026-08-12  drifted into Nynorsk mid-conversation after a sales rewrite
 *   2026-08-12  "Jeg sender tilbudet nå til …" — an action it cannot perform
 *
 * Each was fixed by adding a line to the prompt. Every one of those lines is
 * still in the prompt, and the model still broke the next rule. A prompt is a
 * request; this is a check.
 *
 * Everything here is pure and runs on a string, so the same rules serve two
 * masters: `gradeReply` scores a live model in `scripts/grade-chat.ts`, and the
 * severe ones run in the browser on every real reply.
 */
import { FAQ_ANCHORS } from "./sales/persona";
import { claimsFalseAction } from "./contact";

export type Severity = "block" | "warn";

export interface Violation {
  rule: string;
  severity: Severity;
  detail: string;
}

/**
 * Nynorsk markers with no bokmål meaning.
 *
 * Deliberately narrow. "ein"/"eit" are unambiguous, but words like "no" (nynorsk
 * for "nå") are also ordinary English and appear in product names, so they are
 * left out — a false Nynorsk flag on a correct reply is worse than a missed
 * one, because it would suppress a good answer.
 */
const NYNORSK = [
  /\bdykkar\b/iu, /\beit\b/iu, /\bein\b/iu, /\bikkje\b/iu, /\bkva\b/iu,
  /\bkorleis\b/iu, /\bmånadleg\b/iu, /\bårleg\b/iu, /\butan\b/iu, /\bnokon\b/iu,
];

/** A price claim: any number next to a currency or a per-period phrase. */
const PRICE_CLAIM =
  /\b\d[\d\s.,]*\s*(kr|kroner|nok|,-)\b|\b\d[\d\s.,]*\s*(kr|kroner|nok)?\s*(per|pr\.?|i)\s+(mnd|måned|år|bruker|lokale)/iu;

/** Any link the reply points at. */
const LINKS = /(?:https?:\/\/[^\s)]+|(?<![\w/])\/[\w\-/#]+)/gu;

/** Phrases that only appear if the system prompt has leaked. */
const PROMPT_LEAK = [
  /\bKILDER\b/u, /\bRELEVANTE SIDER\b/u, /\bGYLDIGE FAQ-LENKER\b/u,
  /\bVET ALLEREDE\b/u, /\bDENNE MELDINGEN\b/u, /\bSALES_PERSONA\b/u,
  /\bsystem prompt\b/iu, /\bsystemprompt\b/iu,
];

/**
 * The assistant claiming Digilist takes a cut of the customer's revenue.
 *
 * Every other rule here catches the assistant promising too much. This one
 * catches the opposite, and it is more expensive: a venue operator comparing
 * platforms is choosing between one that takes a percentage and one that does
 * not, and Digilist does not. An assistant that invents a transaction fee
 * argues the customer out of the sale using a fact that is false.
 *
 * Nothing caught this before, because a false claim that makes the product look
 * WORSE does not look like a hallucination to a reviewer skimming for
 * overpromises. It is still a lie.
 *
 * Negations are excluded deliberately — "vi tar INGEN andel av
 * bookinginntektene" is the correct answer and contains every trigger word.
 */
const FEE_CLAIM =
  /\b(?:vi|digilist)\s+(?:tar|krever|beregner|trekker)\b[^.!?]{0,40}(?:\b(?:andel|prosent|provisjon|transaksjonsavgift|kutt)|%)/iu;
const FEE_PER_BOOKING =
  /\b(?:avgift|gebyr|provisjon|kostnad)\s+(?:per|pr\.?|for\s+hver)\s+(?:booking|bestilling|reservasjon|transaksjon|utleie)/iu;
/** "ingen/uten/ikke noe" anywhere in the sentence means it is the denial. */
const FEE_NEGATED = /\b(ingen|uten|ikke|aldri|null)\b/iu;

export function claimsTransactionFee(reply: string): boolean {
  return reply
    .split(/(?<=[.!?])\s+/)
    .some((sentence) => !FEE_NEGATED.test(sentence) && (FEE_CLAIM.test(sentence) || FEE_PER_BOOKING.test(sentence)));
}

export interface GradeInput {
  reply: string;
  /** Page paths the prompt offered this turn, which the reply may cite. */
  allowedPages?: readonly string[];
  /** True when the sources given to the model actually contained a price. */
  sourcesHadPrice?: boolean;
  /**
   * The language the reply is meant to be in.
   *
   * The Nynorsk rule exists to catch a bokmål reply drifting, and its markers
   * are ordinary English words: "ein" is not, but "utan" sits inside nothing
   * while `\bein\b` would never fire — the real collision is that an English
   * reply is not bokmål at all, so judging it against bokmål rules suppresses
   * correct answers. Checked only for Norwegian.
   */
  language?: "nb" | "en";
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function questionCount(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

/** Every link in the reply that was not offered to it. */
export function inventedLinks(reply: string, allowedPages: readonly string[] = []): string[] {
  const allowed = new Set<string>([...FAQ_ANCHORS, ...allowedPages]);
  const found = reply.match(LINKS) ?? [];
  return found.filter((link) => {
    if (allowed.has(link)) return false;
    // A bare origin is fine; a made-up path on it is not.
    if (/^https?:\/\/(www\.)?digilist\.no\/?$/i.test(link)) return false;
    // Allow an offered page even when cited with the full origin.
    const path = link.replace(/^https?:\/\/(www\.)?digilist\.no/i, "");
    return !allowed.has(path);
  });
}

/**
 * Grade one reply. `block` means it must not be shown as written.
 *
 * Length and question count are `warn`, not `block`: a 90-word answer to
 * "compare these three" is the right answer, and suppressing it would be worse
 * than the style drift. Only claims that are FALSE — an invented link, an
 * invented price, an action it cannot take, a leaked prompt — block.
 */
export function gradeReply(input: GradeInput): Violation[] {
  const { reply } = input;
  const violations: Violation[] = [];

  if (claimsFalseAction(reply)) {
    violations.push({
      rule: "false-action",
      severity: "block",
      detail: "claims to send, create or book something the assistant cannot do",
    });
  }

  if (claimsTransactionFee(reply)) {
    violations.push({
      rule: "false-fee",
      severity: "block",
      detail: "claims Digilist takes a cut, a percentage or a per-booking fee — it takes none",
    });
  }

  const links = inventedLinks(reply, input.allowedPages ?? []);
  if (links.length) {
    violations.push({
      rule: "invented-link",
      severity: "block",
      detail: `links not offered to the model: ${links.join(", ")}`,
    });
  }

  if (!input.sourcesHadPrice && PRICE_CLAIM.test(reply)) {
    violations.push({
      rule: "invented-price",
      severity: "block",
      detail: "states a price that was not in the sources",
    });
  }

  const leak = PROMPT_LEAK.find((re) => re.test(reply));
  if (leak) {
    violations.push({ rule: "prompt-leak", severity: "block", detail: `reply echoes prompt scaffolding: ${leak}` });
  }

  const nynorsk = (input.language ?? "nb") === "nb" ? NYNORSK.filter((re) => re.test(reply)) : [];
  if (nynorsk.length) {
    violations.push({
      rule: "nynorsk-drift",
      severity: "block",
      detail: `Nynorsk forms in a bokmål reply: ${nynorsk.length} marker(s)`,
    });
  }

  const words = wordCount(reply);
  if (words > 70) violations.push({ rule: "too-long", severity: "warn", detail: `${words} words (target 20-70)` });
  if (words < 8) violations.push({ rule: "too-short", severity: "warn", detail: `${words} words` });

  const questions = questionCount(reply);
  if (questions > 1) {
    violations.push({
      rule: "multiple-questions",
      severity: "warn",
      detail: `${questions} questions — a form disguised as a conversation`,
    });
  }

  return violations;
}

export function blocking(violations: readonly Violation[]): Violation[] {
  return violations.filter((v) => v.severity === "block");
}

/** One-line summary for a scorecard row. */
export function describeViolations(violations: readonly Violation[]): string {
  if (!violations.length) return "clean";
  return violations.map((v) => `${v.severity === "block" ? "✗" : "!"} ${v.rule}`).join(", ");
}
