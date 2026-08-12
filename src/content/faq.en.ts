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
        a: "Digilist is a Norwegian platform for renting out and booking venues: function rooms, sports halls, meeting rooms, canteens and cultural centres. It handles booking, payment, calendars, seasonal allocation, invoicing and reporting in one place, for private operators and public bodies alike.",
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
        a: "Digilist has subscription tiers, and the price depends on how many venues you have, how many people use the system, and which integrations you need. We take no share of your booking revenue and there are no hidden charges — you pay to use Digilist and its administration panel. Smaller and private operators get their own tailored pricing. The first 100 customers get 6 months free.",
        keywords: ["price", "pricing", "cost", "how much", "what does it cost", "cheap", "cheapest", "budget", "monthly", "subscription", "free trial"],
      },
      {
        q: "Do you take a cut of booking revenue?",
        a: "No. Digilist charges no transaction fee and takes no share of what you charge for rentals. We charge for use of the service and the administration panel, and there are no hidden fees.",
        keywords: ["transaction fee", "commission", "cut", "percentage", "revenue share", "hidden fees", "per booking"],
      },
      {
        q: "How does the subscription work?",
        a: "Digilist is a subscription with several tiers. The tier is set by the number of venues, how many people use the system, and which integrations you need. You pay to use Digilist and the administration panel — nothing per booking.",
        keywords: ["subscription", "tier", "plan", "licence", "how it works", "pricing model"],
      },
      {
        q: "What is included in the price?",
        a: "Use of the platform and the administration panel, with calendars, booking, payment, contracts and reporting. Standard integrations are included. Custom integrations against your own systems are priced separately by scope.",
        keywords: ["included", "what do we get", "extras", "add-ons", "covered"],
      },
      {
        q: "Is Digilist too expensive for a small organisation?",
        a: "No. Smaller clubs, associations and private operators get their own tailored pricing — it should not resemble what a large public body with many buildings pays. A single venue is perfectly fine, and the first 100 customers get 6 months free.",
        keywords: ["small", "too expensive", "afford", "club", "association", "single venue", "volunteer"],
      },
      {
        q: "What is the offer for early customers?",
        a: "The first 100 customers get 6 months of Digilist free. After the trial you choose a subscription tier based on your venues and needs. No lock-in during the trial.",
        keywords: ["free trial", "first 100", "offer", "discount", "early customer", "launch", "no lock-in"],
      },
      {
        q: "Why is there no price list?",
        a: "Because one number would be wrong for almost everyone reading it. The gap between a community hall with one room and a county authority with twenty-two schools is too wide. We publish everything that decides the price instead, and give a concrete quote after a short conversation.",
        keywords: ["price list", "no prices", "why no price", "quote", "estimate"],
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
  "What does Digilist cost?",
  "Do you take a cut of booking revenue?",
  "How does the subscription work?",
  "What is included in the price?",
  "Is Digilist too expensive for a small organisation?",
  "What is the offer for early customers?",
  "Why is there no price list?",
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
    body: "Digilist is a subscription with several tiers. You pay to use the platform and the administration panel — not per booking, and not as a share of what you charge for rentals.",
  },
  {
    title: "No transaction fee",
    body: "We take no percentage of your booking revenue. Going from twenty rentals a year to sixty does not make Digilist cost more. A system that earns more when you succeed penalises exactly the operator who is getting it right.",
  },
  {
    title: "The tier follows the need",
    body: "Price depends on how many venues you have, how many people use the system, and which integrations you need. Growing from one venue to five changes the subscription — more bookings in the same venue does not.",
  },
  {
    title: "Integrations are included",
    body: "Payment, national digital identity, e-invoicing and the common accounting systems are part of the subscription. Custom integrations against your own systems are priced separately by scope.",
  },
  {
    title: "Small operators pay small-operator prices",
    body: "Clubs, associations, community halls and private operators with a single venue get tailored pricing. It should not resemble what a large public body with many buildings pays, because the need does not resemble it either.",
  },
  {
    title: "No hidden charges",
    body: "What is in the quote is what you pay. No per-booking cost, no share of revenue, and no fees that appear after signature.",
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
