/**
 * The colophon copy, in both languages.
 *
 * A parallel corpus, the same shape as `content/faq.en.ts`, and for the same
 * reason: this is prose, not UI chrome. "SSA-L 2026", "sesongleie" and
 * "ID-porten" are load-bearing for a Norwegian buyer; an English reader needs
 * the gloss ("the Norwegian public-procurement framework"), not the acronym.
 * A `t(key)` lookup would force both languages into one sentence shape and the
 * gloss would have nowhere to live.
 *
 * The prose is split into fragments because the rendered paragraphs carry
 * inline emphasis — the italic clause is a typographic decision that belongs in
 * the component, so the copy is stored as the pieces around it rather than as
 * one string with markup baked in.
 *
 * `AboutUsSection` renders on both `/om-oss` and `/en/om-oss`, so this file is
 * what decides whether that page is actually translated. `check:english` reads
 * the built HTML and will fail the moment a Norwegian fragment leaks into the
 * English side.
 */
import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Calendar,
  Shield,
  Code2,
  Building,
  Languages,
  Flag,
  Lock,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface Fact {
  Icon: LucideIcon;
  label: string;
  value: string;
}

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

export interface Principle {
  n: string;
  Icon: LucideIcon;
  title: string;
  body: string;
}

export interface AboutCopy {
  rule: string;
  role: string;
  place: string;
  heading: string;
  headingEm: string;
  dropCap: string;
  beliefLead: string;
  beliefEm: string;
  beliefTail: string;
  platform: string;
  factsHeading: string;
  creedLabel: string;
  creedCount: string;
  manifestLabel: string;
  quoteLead: string;
  quoteEm: string;
  quoteTail: string;
  authorRole: string;
  timelineLabel: string;
  timelineKind: string;
  facts: readonly Fact[];
  timeline: readonly Milestone[];
  creed: readonly Principle[];
}

const NB: AboutCopy = {
  rule: "KOLOFON",
  role: "Utgiver",
  place: "Oslo, 2026",
  heading: "Om",
  headingEm: "Digilist.",
  dropCap:
    "Digilist er en SaaS-plattform for det norske utleiemarkedet, utviklet av Xala Technologies AS. Plattformen samler booking, betaling, kalender, rapportering og integrasjoner mot offentlige tjenester i én løsning, bygd for både private utleiere, kulturhus, foreninger og kommuner.",
  beliefLead:
    "Vi tror norske utleiere fortjener verktøy som passer det norske landskapet: Vipps og BankID til betaling og autentisering, EHF og Peppol til fakturering, ID-porten til innbyggerautentisering, ISO 27001 og GDPR til samsvar.",
  beliefEm: "Ikke amerikansk SaaS oversatt til bokmål,",
  beliefTail: "men en plattform bygd fra grunnen for norske krav.",
  platform:
    "Plattformen kjører på Convex og PostgreSQL, hostet i Norge og EU. Hver mutasjon revisjonsspores. Hver komponent isoleres. Tilgang kontrolleres med RBAC og step-up-autentisering for sensitive operasjoner.",
  factsHeading: "Fakta",
  creedLabel: "HVA VI TROR · DIGILIST-PROGRAM",
  creedCount: "IV PRINSIPPER",
  manifestLabel: "MANIFEST",
  quoteLead: "Vi bygger ikke en booking-app for verden,",
  quoteEm: "vi bygger plattformen Norge fortjener",
  quoteTail:
    ". Én løsning som kommunen kan stole på i drift, og som utleieren ser frem til å bruke en mandag morgen.",
  authorRole: "CTO, Xala Technologies AS",
  timelineLabel: "MILEPÆLER · 2024–2026",
  timelineKind: "KRONOLOGI",
  facts: [
    { Icon: Building, label: "UTGIVER", value: "Xala Technologies AS" },
    { Icon: MapPin, label: "KONTOR", value: "Nesbruveien 75, Nesbru" },
    { Icon: Calendar, label: "ETABLERT", value: "2024" },
    { Icon: Languages, label: "SPRÅK", value: "Bokmål · Nynorsk · English" },
    { Icon: Shield, label: "SERTIFISERT", value: "ISO 27001 · ISO 27701" },
    { Icon: Code2, label: "STACK", value: "Convex · React 19 · PostgreSQL" },
  ],
  timeline: [
    {
      year: "2024",
      title: "Etablert",
      body: "Xala Technologies starter arbeidet med Digilist, én plattform for det norske utleiemarkedet.",
    },
    {
      year: "2025",
      title: "Første kunder",
      body: "Rønningen Selskapslokale og andre private utleiere går i drift. Sanntid, Vipps, BankID og EHF i produksjon.",
    },
    {
      year: "2025",
      title: "Kommune live",
      body: "Nordre Follo kommune tar i bruk plattformen for 12 anlegg, sesongleie og ID-porten-innlogging.",
    },
    {
      year: "2026",
      title: "SSA-L 2026 klar",
      body: "Plattformen oppfyller SSA-L 2026-kravene. Norske kommuner kan ta i bruk Digilist gjennom offentlig anskaffelse.",
    },
  ],
  creed: [
    {
      n: "I",
      Icon: Flag,
      title: "Norsk fra grunnen",
      body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir-designsystemet er innebygd, ikke bolt-on på en amerikansk SaaS.",
    },
    {
      n: "II",
      Icon: Lock,
      title: "Datasuverenitet",
      body: "All data lagres i Norge og EU. Ingen CLOUD Act-eksponering, ingen kryssjurisdiksjon, full GDPR-suverenitet.",
    },
    {
      n: "III",
      Icon: ClipboardCheck,
      title: "Etterprøvbar",
      body: "Hver mutasjon revisjonsspores. Hver beslutning kan forsvares i kontrakt, i drift og i revisjon.",
    },
    {
      n: "IV",
      Icon: Layers,
      title: "Sammenhengende",
      body: "Booking, betaling, sesongleie, fakturering, regnskap og rapportering i én plattform, ikke fem integrerte verktøy.",
    },
  ],
};

const EN: AboutCopy = {
  rule: "COLOPHON",
  role: "Publisher",
  place: "Oslo, 2026",
  heading: "About",
  headingEm: "Digilist.",
  dropCap:
    "Digilist is a platform for the Norwegian rental market, built by Xala Technologies AS. It brings booking, payment, calendars, reporting and the integrations with public services into one place, for private operators, cultural venues, clubs and public bodies alike.",
  beliefLead:
    "We think Norwegian operators deserve tools that fit the ground they stand on: the national payment and identity services for taking money and proving who someone is, the European e-invoicing standard for billing, the national login for residents, and ISO 27001 and GDPR for compliance.",
  beliefEm: "Not American software translated into Norwegian,",
  beliefTail: "but a platform built from the ground up for Norwegian requirements.",
  platform:
    "The platform runs on Convex and PostgreSQL, hosted in Norway and the EU. Every change is written to an audit trail. Every component is isolated. Access is controlled with role-based permissions, and sensitive operations require a second authentication step.",
  factsHeading: "Facts",
  creedLabel: "WHAT WE BELIEVE · THE DIGILIST PROGRAMME",
  creedCount: "IV PRINCIPLES",
  manifestLabel: "MANIFESTO",
  quoteLead: "We are not building a booking app for the world,",
  quoteEm: "we are building the platform Norway deserves",
  quoteTail:
    ". One system a public body can rely on in daily operation, and that an operator looks forward to using on a Monday morning.",
  authorRole: "CTO, Xala Technologies AS",
  timelineLabel: "MILESTONES · 2024–2026",
  timelineKind: "CHRONOLOGY",
  facts: [
    { Icon: Building, label: "PUBLISHER", value: "Xala Technologies AS" },
    { Icon: MapPin, label: "OFFICE", value: "Nesbruveien 75, Nesbru, Norway" },
    { Icon: Calendar, label: "FOUNDED", value: "2024" },
    { Icon: Languages, label: "LANGUAGES", value: "Bokmål · Nynorsk · English" },
    { Icon: Shield, label: "CERTIFIED", value: "ISO 27001 · ISO 27701" },
    { Icon: Code2, label: "STACK", value: "Convex · React 19 · PostgreSQL" },
  ],
  timeline: [
    {
      year: "2024",
      title: "Founded",
      body: "Xala Technologies begins work on Digilist, one platform for the Norwegian rental market.",
    },
    {
      year: "2025",
      title: "First customers",
      body: "Rønningen Selskapslokale and other private operators go live, with real-time availability, national payment and identity services, and e-invoicing in production.",
    },
    {
      year: "2025",
      title: "First public body live",
      body: "Nordre Follo municipality adopts the platform for 12 venues, seasonal allocation, and login through the national identity portal.",
    },
    {
      year: "2026",
      title: "Ready for public procurement",
      body: "The platform meets SSA-L 2026, the Norwegian standard contract for software leasing. Public bodies can adopt Digilist through formal procurement.",
    },
  ],
  creed: [
    {
      n: "I",
      Icon: Flag,
      title: "Norwegian from the ground up",
      body: "The national payment, identity, e-invoicing, company-registry and public design systems are built in — not bolted onto software designed for somewhere else.",
    },
    {
      n: "II",
      Icon: Lock,
      title: "Data sovereignty",
      body: "All data is stored in Norway and the EU. No exposure to the US CLOUD Act, no cross-jurisdiction transfer, full GDPR sovereignty.",
    },
    {
      n: "III",
      Icon: ClipboardCheck,
      title: "Answerable",
      body: "Every change is written to an audit trail. Every decision can be defended in a contract, in daily operation, and in an audit.",
    },
    {
      n: "IV",
      Icon: Layers,
      title: "One system, not five",
      body: "Booking, payment, seasonal allocation, invoicing, accounting and reporting in a single platform — not five tools with integrations between them.",
    },
  ],
};

export function aboutCopy(locale: Locale): AboutCopy {
  return locale === "en" ? EN : NB;
}
