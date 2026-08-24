/**
 * The /booking-av-lokaler-og-moterom page copy, in both languages.
 *
 * "Leieavtalen signeres digitalt med juridisk bindende eID-signatur" is the
 * sentence to be careful with. It is a legal claim about what the signature
 * IS, so the English says "a legally binding electronic signature" and names
 * BankID and ID-porten as the means — not "sign digitally", which would
 * describe the gesture and drop the claim that makes it enforceable.
 *
 * "Sambruk" has no English word. It is the practice of several user groups
 * sharing one municipal room on different terms, and the English says exactly
 * that rather than reaching for "shared use", which sounds like a co-working
 * arrangement.
 */
import type { Locale } from "@/lib/i18n";

export interface QA {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  body: string;
}

export interface UseCase {
  title: string;
  body: string;
  href: string;
  cta: string;
}

export interface Step {
  step: string;
  title: string;
  body: string;
}

export interface BookingCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  crumb: string;
  howToName: string;
  howToDescription: string;
  howToSteps: readonly { name: string; text: string }[];
  rule: string;
  h1: string;
  h1em: string;
  lede: string;
  ctaOpen: string;
  ctaDemo: string;
  useRule: string;
  useKinds: string;
  whyRule: string;
  whyKinds: string;
  howRule: string;
  howKinds: string;
  steps: readonly Step[];
  faqRule: string;
  faqKinds: string;
  seeAlso: string;
  operatorLink: string;
  municipalLink: string;
  orWord: string;
  allVenuesLink: string;
  ctaHeading: string;
  ctaBody: string;
  benefits: readonly Benefit[];
  useCases: readonly UseCase[];
  faq: readonly QA[];
}

const FAQ_NB: readonly QA[] = [
  {
    question: "Hva er et bookingsystem for lokaler?",
    answer:
      "Et bookingsystem for lokaler er en digital plattform der utleiere og kommuner viser ledige lokaler i sanntid, og innbyggere, lag, foreninger og bedrifter booker og betaler direkte. Digilist er et slikt bookingsystem for lokaler og møterom – for både offentlige og private lokaler, med kalender, pris, kontrakt og betaling i én sammenhengende flyt.",
  },
  {
    question: "Hva er booking av lokaler og møterom?",
    answer:
      "Booking av lokaler og møterom er den digitale prosessen der innbyggere, bedrifter, lag eller foreninger reserverer fysiske rom (selskapslokaler, møterom, idrettshaller, kantiner, kulturhus) for et bestemt tidsrom. En moderne plattform håndterer sanntidstilgjengelighet, betaling, kontrakt, varsling av driftsroller og fakturering i én sammenhengende flyt.",
  },
  {
    question: "Hvordan booker man et lokale eller møterom på Digilist?",
    answer:
      "Søk etter sted og dato i sanntidskalenderen. Velg ledig tid, fyll inn formål og antall deltakere, signer leieavtalen digitalt og betal med Vipps, kort eller faktura. Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk. Hele flyten tar typisk under 90 sekunder.",
  },
  {
    question: "Hvilke typer lokaler og møterom kan jeg booke?",
    answer:
      "Digilist støtter selskapslokaler, møterom, kantiner, idrettshaller, gymsaler, kulturhus, samfunnshus, undervisningsrom og spesialressurser som AV-utstyr eller kjøretøy. Hvert anlegg kan ha egne regler for kapasitet, brukergrupper, prising og rabatter.",
  },
  {
    question: "Hvor mye koster det å booke et lokale via Digilist?",
    answer:
      "Prisen avhenger av lokalet, varigheten, brukergruppen og kommunens regler. Lag og foreninger får ofte 30–100 % rabatt avhengig av kommunens prioriteringsregler. Selve plattformen er gratis å bruke for innbyggere. Du betaler kun leieprisen til utleier.",
  },
  {
    question: "Kan kommuner og bedrifter bruke Digilist for å sette opp egne booking-tjenester?",
    answer:
      "Ja. Digilist er bygget for norske kommuner og private utleiere. Kommunen får eget administratorpanel der saksbehandlere håndterer søknader, sesongleie og kalenderbooking. Bedrifter får sin egen profil for selskapslokaler, kulturhus eller møterom. Plattformen er SSA-L 2026-klar.",
  },
  {
    question: "Er Digilist trygt og GDPR-kompatibelt?",
    answer:
      "Ja. All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er sertifisert mot ISO 27001 og ISO 27701, oppfyller GDPR-krav, og bruker ID-porten/BankID for autentisering. Audit-spor registrerer hver mutasjon med tidsstempel.",
  },
  {
    question: "Hvilke betalingsmetoder støttes for booking av lokaler?",
    answer:
      "Vipps, kortbetaling via Stripe Connect, depositum med automatisk frigjøring, og EHF/Peppol-fakturering for organisasjoner. Refusjonsregler kan tilpasses per anlegg.",
  },
  {
    question: "Hvordan håndterer Digilist sesongleie for idrettslag og foreninger?",
    answer:
      "Digilist har en dedikert sesongleie-modul: lag og foreninger søker via egen portal, organisasjonen verifiseres mot Brønnøysundregistrene, og saksbehandler får regelstyrt fordelingsforslag basert på kommunens prioriteringer. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk.",
  },
];

const BENEFITS_NB: readonly Benefit[] = [
  {
    title: "Sanntids tilgjengelighet",
    body: "Innbyggere ser ledige og opptatte tider umiddelbart. Ingen polling, ingen daglig synkronisering. Endringer oppdateres samme sekund hos alle brukere.",
  },
  {
    title: "Betaling i én flyt",
    body: "Vipps, kort eller faktura, uten å forlate booking-skjemaet. EHF/Peppol til organisasjoner. Automatisk avstemming mot regnskapssystemet.",
  },
  {
    title: "Sesongleie og brukergrupper",
    body: "Lag og foreninger med BRREG-verifisering, regelstyrt fordeling, og dokumentert prioritering. Saksbehandler får forslag, beholder skjønnet.",
  },
  {
    title: "Trygt og etterprøvbart",
    body: "ID-porten, ISO 27001 og 27701, GDPR, WCAG 2.1 AA, data i Norge og EU. Hver mutasjon revisjonsspores.",
  },
  {
    title: "Bygget for norske krav",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir Designsystemet, innebygd. SSA-L 2026-klar for kommunale anskaffelser.",
  },
  {
    title: "Én plattform, ingen siloer",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og driftsvarsling: én datakilde. Ingen dobbelinntastinger, ingen synkroniseringsfeil.",
  },
];

const USE_CASES_NB: readonly UseCase[] = [
  {
    title: "Selskapslokaler",
    body: "Bryllup, jubileer, firmafester. Med depositum, leieavtale-signering og digital nøkkel.",
    href: "/bruksomrader/selskapslokaler",
    cta: "Les om selskapslokaler",
  },
  {
    title: "Møterom",
    body: "Kommunale møterom, næringsbygg, foreningslokaler, med sambruk og pris per brukergruppe.",
    href: "/bruksomrader/moterom",
    cta: "Les om møterom",
  },
  {
    title: "Idrettshaller og gymsaler",
    body: "Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger.",
    href: "/bruksomrader/idrettshaller-gymsaler",
    cta: "Les om idrettshaller",
  },
  {
    title: "Kulturhus og kantiner",
    body: "Forestillinger, konserter, åpne dager. Adgangskontroll via Salto KS og automatisk varsling av driftsroller.",
    href: "/bruksomrader/kulturhus-kantiner",
    cta: "Les om kulturhus",
  },
];

const BENEFITS_EN: readonly Benefit[] = [
  {
    title: "Real-time availability",
    body: "Residents see free and booked times immediately. No polling, no nightly sync. Changes appear the same second for every user.",
  },
  {
    title: "Payment in one flow",
    body: "Card, Vipps or invoice, without leaving the booking form. EHF and Peppol e-invoicing for organisations. Automatic reconciliation against the accounting system.",
  },
  {
    title: "Seasonal allocation and user groups",
    body: "Clubs and associations verified against the national organisation register, rule-driven allocation, and documented prioritisation. The case officer gets a proposal and keeps the discretion.",
  },
  {
    title: "Safe and answerable",
    body: "National identity sign-in, ISO 27001 and 27701, GDPR, WCAG 2.1 AA, data in Norway and the EU. Every change is written to an audit trail.",
  },
  {
    title: "Built for Norwegian requirements",
    body: "The national payment, identity, e-invoicing, company-registry and public design systems are built in. Ready for public procurement under SSA-L 2026.",
  },
  {
    title: "One platform, no silos",
    body: "Booking, payment, seasonal allocation, invoicing, accounting and operational alerts share one source of data. No double entry, no sync errors.",
  },
];

const USE_CASES_EN: readonly UseCase[] = [
  {
    title: "Function rooms",
    body: "Weddings, anniversaries, company parties. With a deposit, a digitally signed rental agreement and a digital key.",
    href: "/bruksomrader/selskapslokaler",
    cta: "Read about function rooms",
  },
  {
    title: "Meeting rooms",
    body: "Municipal meeting rooms, commercial buildings and club premises — with several user groups sharing one room on different terms and prices.",
    href: "/bruksomrader/moterom",
    cta: "Read about meeting rooms",
  },
  {
    title: "Sports halls and gyms",
    body: "Half-hall, full-hall and mixed bookings, with seasonal allocation to clubs and associations.",
    href: "/bruksomrader/idrettshaller-gymsaler",
    cta: "Read about sports halls",
  },
  {
    title: "Cultural venues and canteens",
    body: "Performances, concerts, open days. Access control through Salto KS and automatic alerts to operations staff.",
    href: "/bruksomrader/kulturhus-kantiner",
    cta: "Read about cultural venues",
  },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "What is a booking system for venues?",
    answer:
      "A booking system for venues is a platform where operators and public bodies show available rooms in real time, and residents, clubs, associations and businesses book and pay directly. Digilist is such a system, for public and private venues alike, with the calendar, price, contract and payment in one continuous flow.",
  },
  {
    question: "What is booking a venue or meeting room?",
    answer:
      "Booking a venue or meeting room is the digital process where residents, businesses, clubs or associations reserve a physical room — a function room, meeting room, sports hall, canteen or cultural venue — for a set period. A modern platform handles real-time availability, payment, the contract, alerts to operations staff and invoicing in one continuous flow.",
  },
  {
    question: "How do you book a venue or meeting room on Digilist?",
    answer:
      "Search for a place and date in the real-time calendar. Choose a free time, enter the purpose and the number of people, sign the rental agreement digitally and pay by card, Vipps or invoice. Confirmation, a calendar invitation and a digital key are sent automatically. The whole flow typically takes under 90 seconds.",
  },
  {
    question: "What kinds of venues and meeting rooms can I book?",
    answer:
      "Digilist supports function rooms, meeting rooms, canteens, sports halls, gyms, cultural venues, community halls, teaching rooms and specialist resources such as AV equipment or vehicles. Each facility can have its own rules for capacity, user groups, pricing and discounts.",
  },
  {
    question: "How much does it cost to book a venue through Digilist?",
    answer:
      "The price depends on the venue, the duration, the user group and the municipality's own rules. Clubs and associations often get a 30–100% discount, depending on those priority rules. The platform itself is free for residents to use — you pay only the rental price to the operator.",
  },
  {
    question: "Can municipalities and businesses use Digilist to set up their own booking services?",
    answer:
      "Yes. Digilist is built for Norwegian municipalities and private operators. A municipality gets its own administrator panel, where case officers handle applications, seasonal allocation and calendar bookings. Businesses get their own profile for function rooms, cultural venues or meeting rooms. The platform is ready for procurement under SSA-L 2026.",
  },
];

const STEPS_NB: readonly Step[] = [
  {
    step: "01",
    title: "Søk og velg ledig tid",
    body: "Søk på lokale eller møterom, filtrer på dato og kapasitet. Sanntidskalenderen viser ledige og opptatte tider umiddelbart.",
  },
  {
    step: "02",
    title: "Fyll inn formål og deltakere",
    body: "Angi anledning, antall personer og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring).",
  },
  {
    step: "03",
    title: "Logg inn og signer",
    body: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur.",
  },
  {
    step: "04",
    title: "Betal og motta bekreftelse",
    body: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk.",
  },
];

const STEPS_EN: readonly Step[] = [
  {
    step: "01",
    title: "Search and choose a free time",
    body: "Search for a venue or meeting room and filter by date and capacity. The real-time calendar shows free and booked times immediately.",
  },
  {
    step: "02",
    title: "Enter the purpose and the people",
    body: "State the occasion, the number of people and any extras — AV equipment, catering, additional cleaning.",
  },
  {
    step: "03",
    title: "Sign in and sign the agreement",
    body: "Sign in with BankID or ID-porten, the Norwegian national identity services. The rental agreement is signed with a legally binding electronic signature.",
  },
  {
    step: "04",
    title: "Pay and get confirmation",
    body: "Pay by card, Vipps or invoice, with EHF e-invoicing for organisations. Confirmation, a calendar invitation and a digital key are sent automatically.",
  },
];

const NB: BookingCopy = {
  metaTitle: "Booking av lokaler og møterom · Digilist",
  metaDescription:
    "Bookingsystem for lokaler og møterom: sanntidskalender, Vipps, BankID, EHF og sesongleie. For kommuner, selskapslokaler, idrettshaller og kulturhus.",
  keywords:
    "lokaler bookingsystem, bookingsystem for lokaler, bookingsystem lokaler, booking av lokaler og møterom, booking lokale, booking møterom, leie lokale, leie møterom, bookingplattform Norge, kommunal booking, selskapslokale booking, idrettshall booking, kulturhus booking, Vipps booking, BankID booking, EHF, sesongleie",
  crumb: "Booking av lokaler og møterom",
  howToName: "Slik booker du lokale eller møterom",
  howToDescription:
    "Søk, velg tid, signer leieavtalen og betal – i én sammenhengende flyt.",
  howToSteps: STEPS_NB.map((s) => ({ name: s.title, text: s.body })),
  rule: "BOOKING AV LOKALER OG MØTEROM",
  h1: "Booking av",
  h1em: "lokaler og møterom",
  lede:
    "Digilist er et norsk bookingsystem for lokaler og møterom – for kommuner, selskapslokaler, idrettshaller, kulturhus og bedrifter. Søk, book og betal i én flyt, med Vipps, BankID, EHF og sesongleie innebygd.",
  ctaOpen: "Åpne plattformen",
  ctaDemo: "Book demo",
  useRule: "BRUKSOMRÅDER",
  useKinds: "LOKALER · MØTEROM · IDRETT · KULTUR",
  whyRule: "HVORFOR DIGILIST",
  whyKinds: "SEKS PRINSIPPER",
  howRule: "SLIK BOOKER DU",
  howKinds: "FIRE STEG · UNDER 90 SEKUNDER",
  steps: STEPS_NB,
  faqRule: "OFTE STILTE SPØRSMÅL",
  faqKinds: "BOOKING AV LOKALER OG MØTEROM",
  seeAlso: "Se også",
  operatorLink: "bookingsystem for utleie",
  municipalLink: "bookingsystem for kommuner",
  orWord: "eller",
  allVenuesLink: "alle lokaler til leie",
  ctaHeading: "Klar til å digitalisere booking av lokaler og møterom?",
  ctaBody:
    "Få en gratis 30-minutters demo for kommunen eller utleier. Vi viser plattformen i ditt bruksområde. Ingen forpliktelser.",
  benefits: BENEFITS_NB,
  useCases: USE_CASES_NB,
  faq: FAQ_NB,
};

const EN: BookingCopy = {
  metaTitle: "Booking venues and meeting rooms · Digilist",
  metaDescription:
    "Booking for venues and meeting rooms in Norway: real-time calendar, card and Vipps payment, national ID sign-in, e-invoicing and seasonal allocation.",
  keywords:
    "venue booking system, booking venues and meeting rooms, book a venue, book a meeting room, hall hire, municipal booking, sports hall booking, cultural venue booking",
  crumb: "Booking venues and meeting rooms",
  howToName: "How to book a venue or meeting room",
  howToDescription:
    "Search, choose a time, sign the rental agreement and pay — in one continuous flow.",
  howToSteps: STEPS_EN.map((s) => ({ name: s.title, text: s.body })),
  rule: "BOOKING VENUES AND MEETING ROOMS",
  h1: "Booking",
  h1em: "venues and meeting rooms",
  lede:
    "Digilist is a Norwegian booking system for venues and meeting rooms — for public bodies, function rooms, sports halls, cultural venues and businesses. Search, book and pay in one flow, with payment, national identity sign-in, e-invoicing and seasonal allocation built in.",
  ctaOpen: "Open the platform",
  ctaDemo: "Book a demo",
  useRule: "WHERE IT IS USED",
  useKinds: "VENUES · MEETING ROOMS · SPORT · CULTURE",
  whyRule: "WHY DIGILIST",
  whyKinds: "SIX PRINCIPLES",
  howRule: "HOW TO BOOK",
  howKinds: "FOUR STEPS · UNDER 90 SECONDS",
  steps: STEPS_EN,
  faqRule: "FREQUENTLY ASKED QUESTIONS",
  faqKinds: "BOOKING VENUES AND MEETING ROOMS",
  seeAlso: "See also",
  operatorLink: "the booking system for venue rental",
  municipalLink: "the booking system for municipalities",
  orWord: "or",
  allVenuesLink: "all venues to rent",
  ctaHeading: "Ready to digitise booking for venues and meeting rooms?",
  ctaBody:
    "Get a free 30-minute demo for your municipality or as an operator. We show the platform in your own setting. No commitment.",
  benefits: BENEFITS_EN,
  useCases: USE_CASES_EN,
  faq: FAQ_EN,
};

export function bookingCopy(locale: Locale): BookingCopy {
  return locale === "en" ? EN : NB;
}
