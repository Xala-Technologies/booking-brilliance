/**
 * What the assistant decides on a single turn, as one pure function.
 *
 * Extracted from `useChatbot.send` so it can be exercised against realistic
 * conversations without a browser, an API key, or — importantly — sending a
 * real notification email to Digilist every time a test runs.
 *
 * The extraction is the point. A scenario suite that re-implemented this logic
 * would pass while production diverged, which is the oldest trap in testing:
 * the test asserts a copy. The hook calls exactly this.
 */
import { contactFromTurns, handoffNotice, honestHandoffReply, looksLikeInjection, needsHuman, shouldNotify, type ChatContact } from "./contact";
import { enrichProfile, interestScore } from "./sales/lead";
import { blocking, gradeReply, type Violation } from "./guardrails";

export interface TurnInput {
  /** Everything the visitor has said this conversation, oldest first. */
  userTurns: readonly string[];
  /** The assistant's reply for this turn, before any guarding. */
  reply: string;
  /** How many FAQ entries the retrieval matched. */
  hitCount: number;
  /** Page paths offered to the model this turn — the only ones it may cite. */
  allowedPages?: readonly string[];
  /** True when the sources actually contained a price. */
  sourcesHadPrice?: boolean;
  /** The language this reply is meant to be in. Norwegian when unset. */
  language?: "nb" | "en";
  /** Whether a lead has already been filed this conversation. */
  leadAlreadyFiled: boolean;
  /** Whether a qualified-conversation notice has already been sent. */
  alreadyNotified: boolean;
}

export type NotifyKind = "none" | "lead" | "qualified";

export interface TurnDecision {
  /** The text actually shown to the visitor. */
  text: string;
  /** `lead` = contact details captured. `qualified` = worth a human's time. */
  notify: NotifyKind;
  /** Why, for the notification's subject line. Empty when not notifying. */
  reason: string;
  /** Contact details found anywhere in the conversation so far. */
  contact: ChatContact;
  /** Whether the reply claimed an action the assistant cannot perform. */
  guardTripped: boolean;
  /** Everything the guardrails found, blocking or not. */
  violations: Violation[];
  /** Whether to show "Send forespørsel til oss" under the reply. */
  showInquiryCta: boolean;
  /** The assistant's read of how serious this visitor is, 0-100. */
  interest: number;
}

export function decideTurn(input: TurnInput): TurnDecision {
  const latest = input.userTurns[input.userTurns.length - 1] ?? "";
  const contact = contactFromTurns(input.userTurns);
  // enrich, NOT extract: extractProfile always returns empty signals and
  // objections, which are 70 of interestScore's 100 points.
  const profile = enrichProfile(input.userTurns);
  const interest = interestScore(profile);

  // Contact details outrank everything: someone who hands over an address has
  // already decided, and making them wait for a score would be the original
  // bug — a lead reaching nobody.
  // An address handed over inside a prompt-injection payload is not a lead.
  // This is the ONLY thing that outranks "they gave us an address", and it is
  // deliberately narrow — see `looksLikeInjection`.
  const hostile = input.userTurns.some(looksLikeInjection);

  let notify: NotifyKind = "none";
  let reason = "";
  if (hostile) {
    notify = "none";
  } else if (contact.email && !input.leadAlreadyFiled) {
    notify = "lead";
    reason = "oppga kontaktinfo i chatten";
  }
  // A conversation that looks serious no longer emails on its own. It used to:
  // "every contact must be visible to a human" meant a visitor asking "hva
  // koster det å leie et lokale?" produced a notification with every field
  // blank — no name, no email, no organisation — because there was nothing to
  // put in them. An inbox full of anonymous "someone is chatting" notices is
  // one nobody reads, which defeats the purpose it was built for.
  //
  // The visitor asks to be contacted instead, by filling in the form. That is
  // the only thing that sends mail now, and it arrives with who they are.
  // `qualifiedForCta` still marks the moment worth asking at.
  const qualifiedForCta =
    !hostile && shouldNotify({ userTurns: input.userTurns, interest }).notify;

  // Grade the reply against every rule, not just the false-action one. Each
  // incident on this project was fixed by adding a line to the prompt; each
  // line is still there and the model still broke the next rule. A prompt is a
  // request, this is a check.
  const violations = gradeReply({
    reply: input.reply,
    allowedPages: input.allowedPages ?? [],
    sourcesHadPrice: input.sourcesHadPrice ?? false,
    language: input.language ?? "nb",
  });
  const mustBlock = blocking(violations).length > 0;
  const guardTripped = mustBlock;
  // Replaced wholesale rather than patched: the violation is usually the point
  // of the sentence, and a surgically-edited claim reads as a non-sequitur.
  // The FIRST blocking rule decides the replacement. Only the price case has
  // its own wording so far; everything else falls back to the generic handoff.
  const base = mustBlock ? honestHandoffReply(contact, blocking(violations)[0]?.rule) : input.reply;
  const text = notify !== "none" ? `${base}${handoffNotice(Boolean(contact.email))}` : base;

  return {
    text,
    notify,
    reason,
    contact,
    guardTripped,
    violations,
    // Offer the escalation whenever retrieval came up empty, whenever they
    // asked for something only a human can do, whenever a false promise was
    // suppressed — a suppressed promise must always leave a way forward rather
    // than a dead end — and whenever the conversation reads as serious.
    // Also offered the moment the conversation reads as serious — that used
    // to be the trigger for a silent email, and is now the trigger for asking.
    showInquiryCta:
      input.hitCount === 0 || needsHuman(latest) || guardTripped || qualifiedForCta,
    interest,
  };
}
