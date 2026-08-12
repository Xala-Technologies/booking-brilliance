/**
 * Contact details a visitor types into the conversation.
 *
 * WHY THIS EXISTS
 *
 * On 2026-08-12 a live conversation went:
 *
 *   assistant  "Perfekt. Jeg sender tilbudet til e-postadressen deres — hva er den?"
 *   visitor    "wahidullah_rahmani@hotmail.com"
 *   assistant  "Takk. Jeg sender tilbudet nå til wahidullah_rahmani@hotmail.com.
 *               Dere får oversikt over pris for to lokaler med egen nettside."
 *
 * Three things were wrong and they compounded. The assistant has no ability to
 * send anything, so the promise was false. It then described the contents of an
 * offer that does not exist. And — the expensive part — **the address was
 * discarded**: `/api/inquiry` is only called from the form flow, so a visitor
 * who handed over their email inside the chat generated no lead at all. Someone
 * asked to buy and nobody at Digilist ever heard about it.
 *
 * The prompt now forbids the claim. This module fixes the other half: an
 * address given in conversation is captured and the inquiry is filed for real,
 * so what the assistant says next — that a rådgiver will follow up — is true.
 */

/**
 * Deliberately conservative. It runs on every visitor turn, and a false
 * positive files a lead against a string that is not a person's address, which
 * pollutes the inbox the sales follow-up works from.
 */
const EMAIL = /\b[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}\b/u;

/**
 * Norwegian numbers: 8 digits, optionally +47 / 0047, optionally spaced. Not
 * matched inside a longer digit run, so an org number or a year does not
 * qualify.
 */
const PHONE = /(?<![\d])(?:(?:\+|00)47[\s]?)?(?:\d[\s]?){8}(?![\d])/;

export interface ChatContact {
  email: string | null;
  phone: string | null;
}

export const NO_CONTACT: ChatContact = { email: null, phone: null };

export function extractContact(text: string): ChatContact {
  const email = EMAIL.exec(text)?.[0] ?? null;
  const phoneRaw = PHONE.exec(text)?.[0] ?? null;
  return {
    email: email ? email.toLowerCase() : null,
    // Normalise away the spacing people type; keep any country prefix.
    phone: phoneRaw ? phoneRaw.replace(/\s+/g, "") : null,
  };
}

/** The first contact details across a conversation, oldest turn first. */
export function contactFromTurns(turns: readonly string[]): ChatContact {
  const found: ChatContact = { ...NO_CONTACT };
  for (const turn of turns) {
    const c = extractContact(turn);
    if (!found.email && c.email) found.email = c.email;
    if (!found.phone && c.phone) found.phone = c.phone;
    if (found.email && found.phone) break;
  }
  return found;
}

/**
 * Claims of having done something the assistant cannot do.
 *
 * The prompt forbids these, and a prompt is guidance rather than a guarantee —
 * this one had an explicit "aldri finn på en lenke" rule and still invented
 * `/faq#q-27`. A false "I've sent it" reaches a prospect and costs their trust,
 * so it gets a second line of defence that does not depend on the model
 * cooperating.
 *
 * Matching is on the ACTION, not the noun: "sender tilbudet", "har sendt",
 * "oppretter", "booker". Talking *about* an offer is fine and common —
 * "et tilbud avhenger av antall lokaler" must not trip this.
 */
const FALSE_ACTION_CLAIMS: readonly RegExp[] = [
  // jeg sender / vi sender / sender … (tilbud|e-post|pris|demo|detaljene)
  /\b(?:jeg|vi)?\s*sender\b[^.!?]{0,40}\b(?:tilbud|e-?post|mail|pris|demo|detaljene|oversikt)/iu,
  /\bhar\s+sendt\b/iu,
  /\bsendt\s+(?:deg|dere|det)\b/iu,
  // du/dere får det … på e-post
  /\b(?:du|dere)\s+får\b[^.!?]{0,40}\b(?:på\s+e-?post|i\s+innboksen|tilsendt)/iu,
  /\bjeg\s+(?:oppretter|setter\s+opp|booker|bestiller|registrerer|ordner)\b/iu,
  /\bkommer\s+i\s+innboksen\b/iu,
];

/**
 * The one sending claim that is TRUE: forwarding the inquiry internally.
 *
 * Found by grading the live model. It replied "Da har jeg sendt forespørselen
 * videre til en rådgiver som tar kontakt der" — which is accurate, is exactly
 * what we want it to say, and was being BLOCKED by the bare `har sendt` rule.
 * Suppressing a true, useful sentence is its own defect: the visitor then gets
 * a generic replacement instead of the specific thing that just happened.
 *
 * The distinction is direction and object. Sending something TO THE VISITOR —
 * an offer, a price, an email — is the lie. Passing the inquiry ONWARD to a
 * colleague is the truth, and the lead really is filed by the time it is said.
 */
const HONEST_HANDOFF =
  /\b(sender|sendt|videresender|gir)\b[^.!?]{0,40}\b(foresp[øo]rselen|saken|samtalen|beskjed)\b[^.!?]{0,40}\b(videre|til\s+en\s+r[åa]dgiver|til\s+support|til\s+oss)/iu;

export function claimsFalseAction(reply: string): boolean {
  // Sentence by sentence: one honest handoff must not excuse a lie sitting
  // next to it in the same reply, and a lie must not condemn the handoff.
  return reply
    .split(/(?<=[.!?])\s+/)
    .some((sentence) => !HONEST_HANDOFF.test(sentence) && FALSE_ACTION_CLAIMS.some((re) => re.test(sentence)));
}

/**
 * What to say instead when a reply claims an action.
 *
 * Replacing the whole reply rather than editing it: the claim is usually the
 * point of the sentence, and a surgically-patched sentence tends to read as a
 * non-sequitur. Better one honest sentence than a repaired lie.
 */
export function honestHandoffReply(contact: ChatContact): string {
  if (contact.email) {
    return `Takk — jeg sender forespørselen videre til en rådgiver, som tar kontakt på ${contact.email}. Er det noe du vil de skal vite på forhånd?`;
  }
  return "Takk — jeg sender forespørselen videre til en rådgiver som tar kontakt. Hva er den beste e-postadressen å nå dere på?";
}

/**
 * Is the visitor asking for something only a human at Digilist can deliver?
 *
 * The assistant can explain, qualify and answer from KILDER. It cannot produce
 * an offer, price a specific setup, book a demo or call anyone back. When one
 * of those is asked for, the honest move is to put the escalation in front of
 * the visitor — not to keep talking.
 *
 * This drives the "Send forespørsel til oss" button. Before, that button
 * appeared only when the FAQ search returned NOTHING (`hits.length === 0`),
 * which is precisely backwards: "hva koster det for to lokaler" matches the
 * pricing FAQ, so the retrieval succeeds and the button stays hidden — at the
 * exact moment the visitor is trying to buy. That is how a live prospect ended
 * up handing an email to a chat bubble instead of to a form.
 */
const NEEDS_HUMAN: readonly RegExp[] = [
  // Price for THEIR setup, across both written standards and the verb forms
  // people actually use. "hva ville det koste for oss" missed on the original,
  // which required the present tense — and that was a municipality asking to
  // buy under the procurement threshold, the exact buyer this site is for.
  /\b(hva|kva)\s+(vil|ville|kan)?\s*(det\s+)?(koster?|kostar?|koste)\b/iu,
  /\bpris(tilbud|overslag|eksempel)?\s+(for|på)\s+(oss|v[åa]rt|v[åa]re|dette)/iu,
  /\btilbud\b/iu,
  /\bpristilbud\b/iu,
  /\bdemo\b/iu,
  /\bring(e)?\s+(meg|oss|dere)\b/iu,
  /\bkontakt(e)?\s+(meg|oss)\b/iu,
  /\bta\s+kontakt\b/iu,
  /\bsnakke?\s+med\s+(en\s+)?(r[åa]dgiver|selger|menneske|noen)\b/iu,
  /\bavtale\s+(et\s+)?m[øo]te\b/iu,
  // "kommer VI i gang" — Norwegian puts the subject between verb and phrase.
  /\bkomme(r|t)?\s+(?:vi|dere|man|jeg|de)?\s*i\s+gang\b/iu,
  // "send meg", "send oss", and "send til <address>" — the last one is how
  // people hand over contact details without typing a parseable address.
  /\bsend\s+(meg|oss|til)\b/iu,

  // English. Every cue above is Norwegian, and an English-speaking operator
  // saying "can we get a quote" scored exactly nothing — the site is Norwegian
  // but its buyers are not all Norwegian-writing.
  /\b(a\s+)?quote\b/iu,
  /\bpricing\b/iu,
  /\b(cost|price)\s+for\s+(us|our)\b/iu,
  /\bcall\s+me\b/iu,
  /\bcontact\s+(me|us)\b/iu,
  /\btalk\s+to\s+(sales|someone|an?\s+advisor)\b/iu,
  /\bbook\s+a\s+(meeting|demo|call)\b/iu,
  /\bget\s+started\b/iu,
];

/**
 * Someone selling TO Digilist rather than buying from it.
 *
 * "kan vi avtale et møte med noen hos dere?" trips every meeting cue above, and
 * it is an SMS vendor pitching in. Filing that as a lead puts a supplier in the
 * sales pipeline and is the clearest false positive the scenario suite found.
 *
 * Requires BOTH a vendor verb and a directed-at-us phrase, so a customer
 * describing their own business — "vi leverer catering til bryllup" — is not
 * caught. Direction is what separates the two, not vocabulary.
 */
const VENDOR_VERB = /\b(vi\s+(leverer|tilbyr|selger|lager|utvikler)|we\s+(provide|offer|sell|build))\b/iu;
const PITCHED_AT_US = /\b(til|for|hos)\s+dere\b|\bpresentere\b|\bsamarbeid\b|\bpartnerskap\b|\bpartnership\b|\byour\s+(team|company)\b/iu;

export function sellingToUs(text: string): boolean {
  return VENDOR_VERB.test(text) && PITCHED_AT_US.test(text);
}

export function needsHuman(text: string): boolean {
  return NEEDS_HUMAN.some((re) => re.test(text));
}

/**
 * Interest score at which a conversation is worth a human's attention.
 *
 * `interestScore` is 0-100: up to 60 for buying signals, 30 for how much of the
 * profile has been established, 10 for having raised an objection at all.
 *
 * MEASURED, not guessed. It started at 45 — a number picked by feel, and
 * provably dead: `interestScore` was being handed a profile whose signals and
 * objections were always empty, so nothing could exceed 30 and it never fired
 * once. Every lead was actually caught by `needsHuman` keyword matching, which
 * looked exactly like the system working.
 *
 * With scoring fixed, `scenarios.test.ts` prints the real distribution:
 *
 *     73  serious   kommune, 14 buildings, replacing RCO, asks price
 *     35  serious   private operator, one venue, "too small?" objection
 *     29  serious   sports club, spreadsheet today, wants to start
 *     24  serious   venue owner who hands over an address
 *     14  browser   asking about ID-porten, Vipps, real-time calendar
 *     -------------------------------------------------------- 15
 *      0  bot       "test test aaaaaaa"
 *      0  bot       prompt injection
 *      0  support   GDPR question, login problem
 *      0  browser   comparing vendors, nothing concrete
 *
 * Set deliberately LOW. Missing a real buyer costs a deal; a surplus
 * notification costs someone ten seconds. The bar sits just above the
 * technically-engaged browser at 14 and far above every bot and support
 * request, all of which now score zero.
 *
 * That browser sitting one point below is the live trade-off: three questions
 * about ID-porten and Vipps on a booking-system site is plausibly a kommune
 * evaluating, and dropping this to 10 would notify on it. That is a judgement
 * about how much noise the inbox tolerates, not a technical question — change
 * the constant and flip that scenario's `expectNotify`.
 */
export const SERIOUS_LEAD_SCORE = 15;

export interface QualifyInput {
  /** Everything the visitor has said, oldest first. */
  userTurns: readonly string[];
  /** `interestScore(profile)` — 0-100. */
  interest: number;
}

/**
 * Is this a serious prospect, worth telling a human about?
 *
 * Two earlier versions of this were both wrong in the same direction. The
 * first notified on the visitor's FIRST message; the second added a bare
 * three-message threshold. Both measured ACTIVITY, and activity is not
 * interest — three questions about GDPR from a student is not a lead, and
 * burying a real one under those is how the inbox stops being read.
 *
 * This measures the conversation instead:
 *
 *   - asking for something only a human can deliver is decisive on its own
 *   - otherwise the assistant's own read of them has to clear a bar
 *
 * A long conversation with no buying signal deliberately does NOT notify. It
 * is the assistant doing its job, and it needs no supervision.
 */
export function shouldNotify(input: QualifyInput): { notify: boolean; reason: string } {
  const latest = input.userTurns[input.userTurns.length - 1] ?? "";
  // A supplier pitching in trips the meeting cues but is not a lead. Checked
  // across the whole conversation: the pitch usually arrives before the ask.
  if (sellingToUs(input.userTurns.join("\n"))) {
    return { notify: false, reason: "" };
  }
  if (needsHuman(latest)) {
    return { notify: true, reason: "ba om noe bare et menneske kan levere" };
  }
  if (input.interest >= SERIOUS_LEAD_SCORE) {
    return { notify: true, reason: `seriøs interesse (${input.interest}/100)` };
  }
  return { notify: false, reason: "" };
}

/**
 * What the assistant adds to its reply when it reports a lead.
 *
 * The visitor is told, because telling someone quietly is not the same as
 * telling them — and it is the honest counterpart to the false "jeg sender
 * tilbudet" this whole module exists to prevent. It is also a genuine sales
 * moment: someone hearing "a rådgiver will look at this" is being taken
 * seriously.
 *
 * The second sentence matters as much as the first. The assistant does NOT
 * hand off and go quiet — it stays in the conversation. A visitor told "we
 * will contact you" and then met with silence has been dismissed, not helped.
 */
export function handoffNotice(hasContact: boolean): string {
  return hasContact
    ? " Jeg gir beskjed til en rådgiver som følger opp — og jeg er her videre hvis du lurer på noe mer."
    : " Jeg gir beskjed til en rådgiver om samtalen vår. Spør gjerne videre imens — jeg svarer så godt jeg kan.";
}
