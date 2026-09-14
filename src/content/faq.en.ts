/**
 * The English FAQ.
 *
 * A parallel corpus, not a translation layer. `content/faq.ts` is the Norwegian
 * source of truth for /faq, the FAQPage JSON-LD, /llms.txt and the assistant's
 * retrieval; this is the same thing for `/en/faq`, `/en/pricing` and English
 * chat.
 *
 * **Why parallel rather than a `t(key)` lookup.** These are answers, not UI
 * strings. "SSA-L 2026", "sesongtildeling" and "kommunestyret" are load-bearing
 * for a Norwegian buyer and meaningless to an English one, who instead needs to
 * know what a Norwegian municipal procurement even is. A key-based translation
 * forces the two languages to have the same shape, and the right English answer
 * is frequently a different answer — shorter here, glossed there, occasionally
 * absent because the question does not arise outside Norway.
 *
 * **The pricing entries are not free translations.** They are the commercial
 * policy, and the English wording is fixed here so it cannot drift each time
 * someone edits a page. `pricing.en.test.ts` pins them against the Norwegian
 * originals: same claims, same offer, no figure in either.
 */
import type { FAQCategory } from "./faq";

export const FAQ_CATEGORIES_EN: FAQCategory[] = [
  {
    id: "product",
    label: "About Digilist",
    description: "What Digilist is, who uses it, and what makes it different.",
    questions: [
      {
        q: "What is Digilist?",
        a: "Digilist is a Norwegian platform serving both sides of venue rental. If you are looking to rent, you find venues with real prices and real availability and book directly. If you rent one out — privately or as a public body — you run the calendar, payment, seasonal allocation, invoicing and reporting in the same place. We provide the service and take no share of the rent.",
        keywords: ["what is digilist", "booking platform", "venue booking software", "rental platform"],
      },
      {
        q: "Who is Digilist for?",
        a: "Two groups with the same underlying problem. Private operators — function rooms, community halls, farms, marinas, clubs — who take bookings by email and spreadsheet today. And public bodies renting out sports halls, gyms and cultural venues to residents and local clubs, where the rules around allocation and invoicing are stricter.",
        keywords: ["who uses digilist", "venue operators", "municipal booking", "sports hall booking"],
      },
      {
        q: "Is Digilist available outside Norway?",
        a: "The platform is built in Norway and its deepest integrations are Norwegian — national digital identity, the European e-invoicing standard, and the local payment providers. The booking, marketplace and payment flow itself is not country-specific. Talk to us about what your market needs; we would rather be honest about a gap than promise a fit that is not there.",
        keywords: ["international", "outside norway", "global", "other countries", "availability"],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "What Digilist costs, what decides it, and what we never charge for.",
    questions: [
      {
        q: "What does Digilist cost?",
        a: "For private operators it is a monthly subscription with no transaction fee: Small (1 venue) NOK 490/month, Medium (2–3 venues) NOK 790/month, Large (4+ venues) NOK 1,290/month. Public bodies and custom setups get a quote. We take no share of your booking revenue and there are no hidden charges. The first 100 customers get 6 months free.",
        keywords: ["price", "pricing", "cost", "how much", "what does it cost", "cheap", "cheapest", "budget", "monthly", "subscription", "free trial"],
      },
      {
        q: "What does Digilist cost for private operators?",
        a: "Small NOK 490, Medium NOK 790 or Large NOK 1,290 per month, depending on the number of venues. A subscription, not a commission. The first 100 customers get 6 months free.",
        keywords: ["private", "operator", "small", "medium", "large", "490", "790", "1290", "monthly"],
      },
      {
        q: "What does Digilist cost for a municipality?",
        a: "Municipalities receive their own quote. We do not publish public-sector figures here. Book a demo or contact us.",
        keywords: ["municipality", "public sector", "public body", "quote", "price list", "estimate"],
      },
      {
        q: "Do you have a price list?",
        a: "Yes. Three monthly plans are published for private operators above. Public bodies and custom setups are still contact-only.",
        keywords: ["price list", "prices", "published", "plans"],
      },
      {
        q: "Do you take a cut of booking revenue?",
        a: "No. No transaction fee. No per-booking cost. No share of what you charge for rentals.",
        keywords: ["transaction fee", "commission", "cut", "percentage", "revenue share", "hidden fees", "per booking"],
      },
      {
        q: "How does the subscription work?",
        a: "Digilist is a subscription with several tiers. Private operators choose Small (1 venue), Medium (2–3 venues) or Large (4+ venues) — see the prices on /en/priser. Public bodies and custom setups get a quote. You pay to use Digilist and the administration panel — nothing per booking.",
        keywords: ["subscription", "tier", "plan", "licence", "how it works", "pricing model"],
      },
      {
        q: "What is included in the price?",
        a: "Calendars, booking, payment, contracts and reporting. Standard integrations such as Vipps, national digital identity, e-invoicing and accounting systems. No hidden charges.",
        keywords: ["included", "what do we get", "extras", "add-ons", "covered"],
      },
      {
        q: "Is Digilist too expensive for a small organisation?",
        a: "No. Small is NOK 490 per month for a single venue. The first 100 customers get 6 months free, with no lock-in.",
        keywords: ["small", "too expensive", "afford", "club", "association", "single venue", "volunteer"],
      },
      {
        q: "What is the offer for early customers?",
        a: "The first 100 customers get 6 months of Digilist free. After the trial you choose a subscription tier based on your venues and needs. No lock-in during the trial.",
        keywords: ["free trial", "first 100", "offer", "discount", "early customer", "launch", "no lock-in"],
      },
    ],
  },
  {
    id: "compliance",
    label: "Security and compliance",
    description: "Where data lives, and which standards the platform meets.",
    questions: [
      {
        q: "Where is data stored?",
        a: "All customer data is stored in Norway and the EU. Backups and redundancy follow the same rule. No data is stored outside the EEA without explicit safeguards.",
        keywords: ["data location", "where is data stored", "eu", "gdpr", "data residency"],
      },
      {
        q: "Is Digilist GDPR compliant?",
        a: "Yes. Digilist is GDPR compliant and provides a standard data processing agreement before contract. The platform has a data register, right to erasure, an audit log, and procedures for breaches and subject access requests.",
        keywords: ["gdpr", "privacy", "dpa", "data processing agreement", "compliance"],
      },
      {
        q: "Is the platform accessible?",
        a: "Digilist tests against WCAG 2.1 AA and runs automated accessibility audits on every deploy. Accessibility is a legal requirement for public bodies in Norway, so it is treated as a build constraint rather than a feature.",
        keywords: ["accessibility", "wcag", "a11y", "universal design", "screen reader"],
      },
    ],
  },
];

/** Every English entry, flattened — mirrors `allFAQEntries` for the Norwegian set. */
export function allFAQEntriesEn(): Array<{ q: string; a: string; keywords?: string[] }> {
  return FAQ_CATEGORIES_EN.flatMap((c) => c.questions);
}

/** The pricing questions, for /en/pricing. Same selection as the Norwegian page. */
const PRICING_QUESTIONS_EN = [
  "What does Digilist cost for private operators?",
  "What does Digilist cost for a municipality?",
  "Do you have a price list?",
  "Do you take a cut of booking revenue?",
  "What is included in the price?",
  "Is Digilist too expensive for a small organisation?",
] as const;

export function pricingFaqEn(): Array<{ q: string; a: string }> {
  const byQuestion = new Map(allFAQEntriesEn().map((e) => [e.q, e.a]));
  return PRICING_QUESTIONS_EN.map((q) => {
    const a = byQuestion.get(q);
    if (!a) {
      throw new Error(
        `faq.en.ts expects the entry "${q}", which no longer exists. Update ` +
          `PRICING_QUESTIONS_EN rather than letting /en/pricing drop the answer.`,
      );
    }
    return { q, a };
  });
}

export interface PricingFactEn {
  title: string;
  body: string;
}

/** The editorial cards on /en/pricing. Page-only framing, same six claims. */
export const PRICING_FACTS_EN: readonly PricingFactEn[] = [
  {
    title: "A subscription, not a commission",
    body: "You pay for the platform and administration panel. Not per booking. Not a share of the rent.",
  },
  {
    title: "No transaction fee",
    body: "Going from twenty rentals a year to sixty does not make Digilist cost more.",
  },
  {
    title: "Integrations are included",
    body: "Vipps MobilePay, card payment, national digital identity, e-invoicing and Peppol are part of the subscription. You need your own merchant agreement with a payment provider. Custom integrations against your own systems are priced by scope.",
  },
  {
    title: "The rent goes to you",
    body: "The subscription is paid to Xala Technologies AS. Rental payments from your guests go to you through your own payment agreement. Digilist does not process those payments.",
  },
  {
    title: "Six months free for the first 100",
    body: "The first 100 customers get 6 months free, with no lock-in. Afterwards you choose a tier based on the number of venues.",
  },
];


/**
 * The homepage FAQ, English.
 *
 * Mirrors `HOMEPAGE_FAQ` in `faq.ts`: the same handful of questions, rendered
 * through the same accordion and the same JSON-LD. The visible copy has to
 * match the schema or the page stops being an answer-engine surface and
 * becomes decoration with a structured-data block attached.
 */
export const HOMEPAGE_FAQ_EN: Array<{ q: string; a: string }> = [
  "What is Digilist?",
  "Who is Digilist for?",
  "What does Digilist cost?",
  "Do you take a cut of booking revenue?",
  "Where is data stored?",
  "Is Digilist available outside Norway?",
].map((q) => {
  const entry = allFAQEntriesEn().find((e) => e.q === q);
  if (!entry) {
    throw new Error(
      `HOMEPAGE_FAQ_EN expects the entry "${q}". Update the list rather than ` +
        `letting the homepage silently show fewer questions than the Norwegian one.`,
    );
  }
  return { q, a: entry.a };
});
