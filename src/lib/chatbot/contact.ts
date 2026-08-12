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

export function claimsFalseAction(reply: string): boolean {
  return FALSE_ACTION_CLAIMS.some((re) => re.test(reply));
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
