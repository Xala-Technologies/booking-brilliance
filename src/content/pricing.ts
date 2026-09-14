/**
 * The pricing policy, in one place.
 *
 * Backs /priser, the shared PricingSummaryBlock, the FAQ corpus, FAQPage
 * JSON-LD, /llms.txt and the assistant. Private subscription tiers are locked
 * numbers — do not invent kroner here. Kommune and customized solutions stay
 * contact-only with no published figures.
 */
import { allFAQEntries } from "./faq";

export interface PricingFact {
  title: string;
  body: string;
}

export interface PrivatePlan {
  id: "small" | "medium" | "large";
  name: string;
  priceKr: number;
  venues: string;
  body: string;
}

/** Locked private monthly plans — the only kroner we publish for subscriptions. */
export const PRIVATE_PLANS: readonly PrivatePlan[] = [
  {
    id: "small",
    name: "Small",
    priceKr: 490,
    venues: "1 lokale.",
    body:
      "Kalender, booking, betaling, kontrakter og rapportering. Vipps, kort, BankID og vanlige regnskapsintegrasjoner ligger i abonnementet.",
  },
  {
    id: "medium",
    name: "Medium",
    priceKr: 790,
    venues: "2–3 lokaler.",
    body:
      "Samme plattform. Flere lokaler i én kalender. Samme regel: ingen provisjon, ingen kostnad per booking.",
  },
  {
    id: "large",
    name: "Large",
    priceKr: 1290,
    venues: "4 eller flere lokaler.",
    body:
      "Samme plattform for den som drifter flere bygg. Vokser du videre, eller trenger noe utenfor planen: kontakt oss.",
  },
];

/** Format a monthly subscription price in Norwegian kroner. */
export function formatPriceKr(amount: number): string {
  return `${amount.toLocaleString("nb-NO")} kr/mnd`;
}

/** One-line summary of all private tiers, for FAQ and the assistant corpus. */
export function privatePlansSummary(): string {
  return PRIVATE_PLANS
    .map((p) => `${p.name} ${p.priceKr} kr`)
    .join(", ");
}

/** «Det som fortsatt gjelder» on /priser. */
export const PRICING_FACTS: readonly PricingFact[] = [
  {
    title: "Abonnement, ikke provisjon",
    body:
      "Du betaler for plattform og administrasjonspanel. Ikke per booking. Ikke en andel av leien.",
  },
  {
    title: "Ingen transaksjonsavgift",
    body:
      "Går du fra tjue til seksti utleier i året, koster ikke Digilist mer av den grunn.",
  },
  {
    title: "Integrasjonene er inkludert",
    body:
      "Vipps MobilePay, kortbetaling, BankID, ID-porten, EHF og Peppol ligger i abonnementet. Du trenger egen merchant-avtale hos betalingsleverandør. Spesialtilpasninger mot egne systemer prises etter omfang.",
  },
  {
    title: "Leien går til deg",
    body:
      "Abonnementet betales til Xala Technologies AS. Leieinnbetalinger fra gjestene går til deg via din egen betalingsavtale. Digilist behandler ikke de betalingene.",
  },
  {
    title: "6 måneder gratis for de 100 første",
    body:
      "De 100 første kundene får 6 måneder gratis, uten binding. Etterpå velger dere nivå ut fra antall lokaler.",
  },
];

/** FAQ on /priser — derived from content/faq.ts, not copied. */
const PRICING_QUESTIONS = [
  "Hva koster Digilist for private utleiere?",
  "Hva koster Digilist for en kommune?",
  "Har dere en prisliste?",
  "Tar dere en andel av bookinginntektene?",
  "Hva er inkludert i prisen?",
  "Er Digilist for dyrt for en liten forening?",
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
