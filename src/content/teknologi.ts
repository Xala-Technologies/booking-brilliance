/**
 * The /teknologi FAQ, in both languages.
 *
 * Single source of truth for the visible accordion AND the FAQPage JSON-LD
 * that `<SEO faq>` emits. Google requires the two to match, so a translation
 * that changed one and not the other would turn a structured-data win into a
 * structured-data penalty.
 *
 * Kept byte-for-byte in sync with the `/teknologi` and `/en/teknologi` route
 * entries in `scripts/prerender.mjs` — that copy is what crawlers index before
 * any JavaScript runs, and `teknologi-faq-sync.test.ts` pins the two together.
 *
 * The English answers keep the vendor names (Convex, PostgreSQL, Stripe) and
 * translate everything around them. Where a name is Norwegian infrastructure
 * rather than a product an English reader would recognise — ID-porten, BankID,
 * EHF/Peppol — it is glossed on first use, because "we support ID-porten"
 * carries no information for someone who has never had to log in with one.
 */
import type { Locale } from "@/lib/i18n";

export interface FaqEntry {
  q: string;
  a: string;
}

const NB: readonly FaqEntry[] = [
  {
    q: "Hvilken teknologi er Digilist bygget på?",
    a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten.",
  },
  {
    q: "Hvilke integrasjoner støttes?",
    a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking.",
  },
  {
    q: "Hvor lagres dataene?",
    a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier.",
  },
  {
    q: "Er Digilist ISO 27001 og 27701-sertifisert?",
    a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel.",
  },
  {
    q: "Oppfyller Digilist WCAG 2.0 AA?",
    a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal.",
  },
  {
    q: "Hvor høy oppetid garanterer Digilist?",
    a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig.",
  },
];

const EN: readonly FaqEntry[] = [
  {
    q: "What is Digilist built on?",
    a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS and the Norwegian public-sector design system. Backend: Convex (self-hosted) reactive runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobile: React Native only (iOS, iPadOS, Android). Security: TLS 1.3, AES-256-GCM, role-based access control, and the national identity portal.",
  },
  {
    q: "Which integrations are supported?",
    a: "Payment: Vipps and Stripe Connect, plus EHF/Peppol for e-invoicing. Authentication: BankID via Signicat, the national identity portal, and the company register. Accounting: Visma eAccounting, Tripletex, Fiken, PowerOffice and DNB Regnskap. Calendars: Microsoft 365 and Outlook. Access control: Salto KS. Migration: RCO booking.",
  },
  {
    q: "Where is data stored?",
    a: "All customer data is stored in Norway and the EU, on PostgreSQL hosted by Convex in EU regions. Backups and redundancy follow the same rule. No data is stored outside the EEA without explicit safeguards.",
  },
  {
    q: "Is Digilist ISO 27001 and 27701 certified?",
    a: "Yes. Digilist is certified against both ISO 27001, the information security management standard, and ISO 27701, its privacy extension. Certificates are available on request.",
  },
  {
    q: "Does Digilist meet WCAG 2.1 AA?",
    a: "Yes. Digilist tests against WCAG 2.1 AA and runs automated axe-core audits on every deploy. The accessibility statement is published to the template set by the Norwegian Digitalisation Agency.",
  },
  {
    q: "What uptime does Digilist guarantee?",
    a: "Digilist has a 99.9% uptime SLA. The platform is built on transactional event logs (the outbox pattern), which keep data consistent even when something fails. A status page and incident reporting are available.",
  },
];

export function teknologiFaq(locale: Locale): readonly FaqEntry[] {
  return locale === "en" ? EN : NB;
}
