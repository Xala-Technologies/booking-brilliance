/**
 * The /bookingsystem-kommune page copy, in both languages.
 *
 * This page is read by procurement. That changes what a good translation is:
 * every Norwegian instrument keeps its own name and gains a gloss, because an
 * evaluator has to be able to look the thing up. "SSA-L 2026" is not
 * "the standard software leasing contract" — it is SSA-L 2026, the Norwegian
 * government's standard agreement for software leasing, and an English
 * paraphrase that drops the identifier is useless in a tender.
 *
 * Same rule for ID-porten, BRREG (the Brønnøysund Register Centre), EHF and
 * Peppol. Named, then explained once.
 *
 * "Kommune" is rendered "municipality" rather than "council": Norwegian
 * kommuner combine functions that sit across several tiers in the UK and the
 * US, and "council" imports the wrong set of powers.
 */
import type { Locale } from "@/lib/i18n";

export interface QA {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  body: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface MunicipalCopy {
  metaTitle: string;
  metaDescription: string;
  rule: string;
  h1: string;
  h1em: string;
  ledeA: string;
  ledeStrong: string;
  ctaQuote: string;
  ctaOpen: string;
  activeHeading: string;
  activeSpecs: readonly Spec[];
  ssaRule: string;
  ssaH2: string;
  ssaH2em: string;
  ssaLede: string;
  featureRule: string;
  featureH2: string;
  featureLede: string;
  integrationRule: string;
  integrationH2: string;
  integrationH2em: string;
  contactRule: string;
  faqRule: string;
  faqH2: string;
  backTo: string;
  frontPage: string;
  contactLede: string;
  ctaDemo: string;
  procurementHeading: string;
  procurementSpecs: readonly Spec[];
  checklist: readonly string[];
  features: readonly Feature[];
  faq: readonly QA[];
}

const FAQ_NB: readonly QA[] = [
  {
    question: "Hva er et kommunalt bookingsystem?",
    answer:
      "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler (idrettshaller, svømmehaller, møterom, kantiner og kulturhus) i sanntid. Plattformen håndterer kalender, godkjenning, betaling, sesongleie og fakturering.",
  },
  {
    question: "Oppfyller Digilist SSA-L 2026-kravene?",
    answer:
      "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering.",
  },
  {
    question: "Hvordan håndteres sesongleie for lag og foreninger?",
    answer:
      "Digilist har egen sesongleie-modul med søknadsportal for lag og foreninger. Saksbehandler får regelstyrt fordelingsforslag som kan justeres og godkjennes. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk.",
  },
  {
    question: "Kan kommunen importere bookinger fra eksisterende system?",
    answer:
      "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi kan ta over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen.",
  },
  {
    question: "Hvor lagres dataene?",
    answer:
      "All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er ISO 27001 og ISO 27701-sertifisert, og oppfyller GDPR-kravene.",
  },
  {
    question: "Hva koster Digilist for en kommune?",
    answer:
      "Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tilbyr en gratis demo og pristilbud basert på kommunens spesifikke behov. Kontakt salg på kontakt@digilist.no.",
  },
];

const FEATURES_NB: readonly Feature[] = [
  {
    title: "Sanntidskalender",
    body: "Innbyggere og saksbehandlere ser ledig, opptatt og blokkert tid umiddelbart. Endringer fra bookinger, avlysninger eller administrasjon oppdateres uten refresh.",
  },
  {
    title: "Sesongleie med regelstyrt fordeling",
    body: "Lag og foreninger søker via egen portal. Saksbehandler får regelstyrt forslag basert på kommunens prioriteringsregler og kan justere før godkjenning.",
  },
  {
    title: "Driftsroller varsles automatisk",
    body: "Vaktmestere, renholdspersonell, vektere og andre driftsroller får automatisk varsel ved bookingbekreftelse, endring eller avlysning.",
  },
  {
    title: "ID-porten + BankID-innlogging",
    body: "Innbyggere logger inn med ID-porten eller BankID. Lag og foreninger verifiseres via Brønnøysundregisteret (BRREG).",
  },
  {
    title: "EHF / Peppol-fakturering",
    body: "Faktura sendes automatisk via EHF til kommunens regnskapssystem. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap.",
  },
  {
    title: "Digital nøkkel (Salto KS)",
    body: "Adgangskontroll med Salto KS digital nøkkel. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt.",
  },
];

const CHECKLIST_NB: readonly string[] = [
  "Sanntidstilgjengelighet",
  "Sesongleiesøknad og regelstyrt fordeling",
  "ID-porten + BankID-autentisering",
  "BRREG-verifisering av organisasjoner",
  "Digital nøkkel for adgangskontroll",
  "EHF-fakturagrunnlag",
  "Min side for innbyggere",
  "Universell utforming (WCAG 2.0 AA)",
  "ISO 27001 og 27701-sertifisering",
  "Data lagret i Norge og EU (GDPR)",
  "Rapportering på kapasitet og økonomi",
  "Audit-logg på alle endringer",
];

const FEATURES_EN: readonly Feature[] = [
  {
    title: "A real-time calendar",
    body: "Residents and case officers see free, booked and blocked time immediately. Changes from bookings, cancellations or the administration appear without a refresh.",
  },
  {
    title: "Seasonal allocation, rule-driven",
    body: "Clubs and associations apply through their own portal. The case officer gets a proposal driven by the municipality's own priority rules, and can adjust it before approving.",
  },
  {
    title: "Operations staff notified automatically",
    body: "Caretakers, cleaning staff, security and other operational roles are notified automatically when a booking is confirmed, changed or cancelled.",
  },
  {
    title: "Sign-in with the national identity services",
    body: "Residents sign in with ID-porten or BankID, Norway's national identity services. Clubs and associations are verified against the Brønnøysund Register Centre (BRREG), the national register of organisations.",
  },
  {
    title: "E-invoicing via EHF and Peppol",
    body: "Invoices are sent automatically over EHF, the Norwegian e-invoicing standard, into the municipality's accounting system. Integrations with Visma, Tripletex, Fiken, PowerOffice and DNB Regnskap.",
  },
  {
    title: "Digital keys (Salto KS)",
    body: "Access control with Salto KS digital keys. Access is activated automatically when a booking starts and deactivated when it ends.",
  },
];

const CHECKLIST_EN: readonly string[] = [
  "Real-time availability",
  "Seasonal applications and rule-driven allocation",
  "Authentication with ID-porten and BankID",
  "Organisations verified against BRREG",
  "Digital keys for access control",
  "EHF invoicing data",
  "A personal page for residents",
  "Accessibility (WCAG 2.0 AA)",
  "ISO 27001 and 27701 certification",
  "Data stored in Norway and the EU (GDPR)",
  "Reporting on capacity and finances",
  "An audit log on every change",
];

const FAQ_EN: readonly QA[] = [
  {
    question: "What is a municipal booking system?",
    answer:
      "A municipal booking system is a digital platform that lets residents, clubs and associations apply for and book municipal venues — sports halls, swimming pools, meeting rooms, canteens and cultural venues — in real time. The platform handles the calendar, approval, payment, seasonal allocation and invoicing.",
  },
  {
    question: "Does Digilist meet the SSA-L 2026 requirements?",
    answer:
      "Yes. Digilist is built against SSA-L 2026 — the Norwegian government's standard agreement for software leasing — and meets its core requirements: real-time availability, seasonal allocation with rule-driven distribution, authentication through the national identity portal, verification against the national organisation register, digital keys, EHF invoicing data, accessibility (WCAG 2.0 AA) and ISO 27001/27701 certification.",
  },
  {
    question: "How is seasonal allocation for clubs handled?",
    answer:
      "Digilist has its own seasonal allocation module, with an application portal for clubs and associations. The case officer receives a rule-driven allocation proposal that can be adjusted and approved. Grants, allocation and capacity use are reported automatically.",
  },
  {
    question: "Can a municipality import bookings from its existing system?",
    answer:
      "Yes. Digilist supports migration from RCO booking and other existing booking systems. We can take over historical bookings, seasonal agreements and club registers during setup.",
  },
  {
    question: "Where is data stored?",
    answer:
      "All data is stored in Norway and the EU, on PostgreSQL hosted by Convex. The platform is ISO 27001 and ISO 27701 certified and meets the requirements of GDPR.",
  },
  {
    question: "What does Digilist cost a municipality?",
    answer:
      "The price depends on the number of facilities, how many people use the system, and which integrations are needed. We offer a free demo and a quote based on the municipality's specific needs. Contact sales at kontakt@digilist.no.",
  },
];

const NB: MunicipalCopy = {
  metaTitle: "Bookingsystem for kommuner · Digilist | SSA-L 2026 klar",
  metaDescription:
    "Digital bookingplattform for norske kommuner. Sanntidskalender, sesongleie, ID-porten, EHF, ISO 27001. Bygget for SSA-L 2026-krav.",
  rule: "KOMMUNAL BOOKING · 2026",
  h1: "Bookingsystem for",
  h1em: "norske kommuner",
  ledeA: "Sanntidskalender, sesongleie, ID-porten-innlogging, EHF-fakturering og automatisk driftsvarsling, i én plattform bygget for ",
  ledeStrong: "SSA-L 2026-krav",
  ctaQuote: "Be om pristilbud",
  ctaOpen: "Åpne plattformen",
  activeHeading: "Aktive kommuner",
  activeSpecs: [
    { label: "Nordre Follo", value: "12 anlegg" },
    { label: "Foreninger", value: "~340" },
    { label: "Bookinger / mnd", value: "~1 200" },
    { label: "Datalokasjon", value: "Norge · EU" },
  ],
  ssaRule: "I. SSA-L 2026 KRAV",
  ssaH2: "Bygget for offentlig",
  ssaH2em: "anskaffelse",
  ssaLede: "Hver SSA-L 2026-funksjon dekket fra dag én, ikke som tillegg.",
  featureRule: "II. FUNKSJONALITET",
  featureH2: "Hva kommunen får.",
  featureLede: "Seks funksjoner som adresserer kjernekrav fra norske kommuner.",
  integrationRule: "III. NORSKE INTEGRASJONER",
  integrationH2: "Tilkoblet kommunens",
  integrationH2em: "eksisterende systemer",
  contactRule: "IV. KONTAKT",
  faqRule: "V. SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål fra kommuner.",
  backTo: "Tilbake til",
  frontPage: "forsiden",
  contactLede:
    "Vi setter sammen et pristilbud basert på antall anlegg, bookingvolum og integrasjoner. Demo på 30–45 minutter, ingen forpliktelser.",
  ctaDemo: "Be om demo",
  procurementHeading: "Anskaffelsesinformasjon",
  procurementSpecs: [
    { label: "Leverandør", value: "Xala Technologies AS" },
    { label: "Org.nr.", value: "Tilgjengelig" },
    { label: "Adresse", value: "Nesbruveien 75, 1394 Nesbru" },
    { label: "Telefon", value: "+47 96 66 50 01" },
    { label: "E-post", value: "kontakt@digilist.no" },
    { label: "SSA-L 2026", value: "Tilpasset" },
    { label: "ISO 27001/27701", value: "Sertifisert" },
  ],
  checklist: CHECKLIST_NB,
  features: FEATURES_NB,
  faq: FAQ_NB,
};

const EN: MunicipalCopy = {
  metaTitle: "Booking for municipalities · Digilist | SSA-L 2026 ready",
  metaDescription:
    "A digital booking platform for Norwegian municipalities: real-time calendar, seasonal allocation, national identity sign-in, e-invoicing. Built for SSA-L 2026.",
  rule: "MUNICIPAL BOOKING · 2026",
  h1: "A booking system for",
  h1em: "Norwegian municipalities",
  ledeA: "A real-time calendar, seasonal allocation, sign-in with the national identity services, e-invoicing and automatic notification of operations staff — in one platform built for ",
  ledeStrong: "the SSA-L 2026 requirements",
  ctaQuote: "Request a quote",
  ctaOpen: "Open the platform",
  activeHeading: "Municipalities live",
  activeSpecs: [
    { label: "Nordre Follo", value: "12 facilities" },
    { label: "Associations", value: "~340" },
    { label: "Bookings / month", value: "~1,200" },
    { label: "Data location", value: "Norway · EU" },
  ],
  ssaRule: "I. SSA-L 2026 REQUIREMENTS",
  ssaH2: "Built for public",
  ssaH2em: "procurement",
  ssaLede: "Every SSA-L 2026 capability covered from day one, not added later.",
  featureRule: "II. CAPABILITIES",
  featureH2: "What the municipality gets.",
  featureLede: "Six capabilities that address the core requirements Norwegian municipalities set.",
  integrationRule: "III. NORWEGIAN INTEGRATIONS",
  integrationH2: "Connected to the municipality's",
  integrationH2em: "existing systems",
  contactRule: "IV. CONTACT",
  faqRule: "V. QUESTIONS AND ANSWERS",
  faqH2: "Common questions from municipalities.",
  backTo: "Back to the",
  frontPage: "home page",
  contactLede:
    "We put together a quote based on the number of facilities, booking volume and integrations. A 30–45 minute demo, with no commitment.",
  ctaDemo: "Request a demo",
  procurementHeading: "Procurement details",
  procurementSpecs: [
    { label: "Supplier", value: "Xala Technologies AS" },
    { label: "Company no.", value: "On request" },
    { label: "Address", value: "Nesbruveien 75, 1394 Nesbru, Norway" },
    { label: "Telephone", value: "+47 96 66 50 01" },
    { label: "Email", value: "kontakt@digilist.no" },
    { label: "SSA-L 2026", value: "Aligned" },
    { label: "ISO 27001/27701", value: "Certified" },
  ],
  checklist: CHECKLIST_EN,
  features: FEATURES_EN,
  faq: FAQ_EN,
};

export function municipalCopy(locale: Locale): MunicipalCopy {
  return locale === "en" ? EN : NB;
}
