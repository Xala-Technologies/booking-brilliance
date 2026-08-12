/**
 * The pricing policy, in one place.
 *
 * The site had no pricing page at all, on a product whose pricing IS the
 * differentiator — /priser fell through to the 404 page, so an ad click had
 * nowhere to land and a visitor who wanted a number had to ask the chatbot.
 *
 * This module backs that page. The Q&A is DERIVED from `content/faq.ts` rather
 * than copied, because that file is already the declared source of truth for
 * /faq, the FAQPage JSON-LD, /llms.txt and the assistant's retrieval corpus.
 * The one claim that must never be stale on any surface is "we take no share of
 * your revenue", and the way to guarantee that is to have one place where it is
 * written. The editorial cards below are page-only framing and exist nowhere
 * else, so they are literals.
 *
 * **No figures.** We publish no price list, deliberately — the span between a
 * grendehus with one hall and a county with twenty-two schools makes any single
 * number wrong for nearly everyone reading it. The guardrails block the
 * assistant from stating a figure precisely because there is no true one to
 * state.
 */
import { allFAQEntries } from "./faq";

export interface PricingFact {
  title: string;
  body: string;
}

/** What decides the price, and what does not. */
export const PRICING_FACTS: readonly PricingFact[] = [
  {
    title: "Abonnement, ikke provisjon",
    body:
      "Digilist er en abonnementstjeneste med flere nivåer. Du betaler for å bruke plattformen og administrasjonspanelet — ikke per booking, og ikke som en andel av det du tar betalt for utleien.",
  },
  {
    title: "Ingen transaksjonsavgift",
    body:
      "Vi tar ingen prosent av bookinginntektene dine. Går du fra tjue til seksti utleier i året, koster ikke Digilist mer av den grunn. Et system som tjener mer når du lykkes, straffer nettopp den utleieren som får det til.",
  },
  {
    title: "Nivået følger behovet",
    body:
      "Prisen avhenger av hvor mange anlegg du har, hvor mange som skal bruke systemet, og hvilke integrasjoner du trenger. Vokser du fra ett til fem lokaler, endrer det abonnementet — flere bookinger i det samme lokalet gjør det ikke.",
  },
  {
    title: "Integrasjonene er inkludert",
    body:
      "Vipps, kortbetaling, BankID, ID-porten, EHF og Peppol, og regnskapsintegrasjoner mot Visma, Tripletex, Fiken og PowerOffice ligger i abonnementet. Spesialtilpasninger mot egne systemer prises separat etter omfang.",
  },
  {
    title: "Egne priser for de små",
    body:
      "Lag, foreninger, grendehus, menighetshus og private utleiere med ett enkelt lokale får tilpassede priser. Prisen skal ikke ligne på det en kommune med mange bygg betaler, av den enkle grunn at behovet ikke ligner heller.",
  },
  {
    title: "Ingen skjulte gebyrer",
    body:
      "Det som står i tilbudet er det du betaler. Ingen kostnad per booking, ingen andel av inntektene, og ingen gebyrer som dukker opp etter at avtalen er signert.",
  },
];

/**
 * The pricing questions, pulled out of the FAQ corpus by exact question text.
 *
 * DERIVED, not copied. `content/faq.ts` is already the declared source of truth
 * for the /faq page, the FAQPage JSON-LD, /llms.txt and the chatbot's retrieval
 * corpus — so the pricing page reads from it rather than becoming a fifth copy
 * of a commercial policy. The one claim that must never be stale anywhere is
 * "we take no share of your revenue"; the way to guarantee that is to have one
 * place where it is written.
 *
 * `pricingFaq()` throws on a missing question rather than silently rendering a
 * shorter page. A pricing page that quietly loses the no-transaction-fee answer
 * is worse than one that fails to build.
 */
const PRICING_QUESTIONS = [
  "Hva koster Digilist?",
  "Tar dere en andel av bookinginntektene?",
  "Hvordan fungerer abonnementet?",
  "Hva er inkludert i prisen?",
  "Er Digilist for dyrt for en liten forening?",
  "Hva er tilbudet til de første kundene?",
  "Hvorfor har dere ingen prisliste?",
] as const;

export interface PricingQA {
  q: string;
  a: string;
}

export function pricingFaq(): PricingQA[] {
  const byQuestion = new Map(allFAQEntries().map((e) => [e.q, e.a]));
  return PRICING_QUESTIONS.map((q) => {
    const a = byQuestion.get(q);
    if (!a) {
      throw new Error(
        `pricing.ts expects the FAQ entry "${q}", which no longer exists in content/faq.ts. ` +
          `Update PRICING_QUESTIONS rather than letting /priser drop the answer.`,
      );
    }
    return { q, a };
  });
}

export const PRICING_FAQ: PricingQA[] = pricingFaq();
