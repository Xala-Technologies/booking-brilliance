/**
 * The /bookingsystem-utleie page copy, in both languages.
 *
 * The audience here is a person who rents out a hall, not a procurement
 * officer, so the English is plainer than its municipal twin — "shows what is
 * free", not "presents real-time availability".
 *
 * "Utleier" and "leietaker" are the load-bearing pair. English has no clean
 * equivalent that avoids tenancy law: "landlord" and "tenant" describe a
 * lease, and this is someone booking a room for an evening. So: "operator"
 * for the person who owns the venue, "the person renting" for the one booking
 * it, consistently, on this page and in the terms of sale.
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

export interface VenueLink {
  label: string;
  to: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface OperatorCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  rule: string;
  h1: string;
  h1em: string;
  ledeA: string;
  ledeStrong: string;
  ledeB: string;
  ctaQuote: string;
  ctaOpen: string;
  forOperators: string;
  operatorSpecs: readonly Spec[];
  whyRule: string;
  whyH2: string;
  whyH2em: string;
  whyLede: string;
  featureRule: string;
  featureH2: string;
  featureLede: string;
  typesRule: string;
  typesH2: string;
  typesH2em: string;
  typesLede: string;
  integrationRule: string;
  integrationH2: string;
  integrationH2em: string;
  contactRule: string;
  contactLede: string;
  ctaDemo: string;
  supplierHeading: string;
  supplierSpecs: readonly Spec[];
  faqRule: string;
  faqH2: string;
  seeAlso: string;
  municipalLink: string;
  orBackTo: string;
  frontPage: string;
  why: readonly string[];
  types: readonly VenueLink[];
  features: readonly Feature[];
  faq: readonly QA[];
}

const FAQ_NB: readonly QA[] = [
  {
    question: "Hva er et bookingsystem for utleie?",
    answer:
      "Et bookingsystem for utleie er en digital plattform der du som utleier legger ut ledige tider på lokalet ditt, og leietakere ser tilgjengelighet i sanntid og booker direkte. Systemet håndterer kalender, pris, tilleggstjenester, betaling og bekreftelser, så du slipper e-poster og telefoner frem og tilbake. Digilist er et slikt system, bygget for både private utleiere og offentlige/kommunale lokaler.",
  },
  {
    question: "Hvordan leier jeg ut lokaler med sanntidskalender?",
    answer:
      "Du legger utleieobjektet inn med ledige tider, pris og eventuelle tilleggstjenester. Leietakere ser umiddelbart hva som er ledig, opptatt og blokkert, og booker den datoen de trenger. Kalenderen oppdateres uten refresh, og dobbeltbooking hindres automatisk fordi alle ser samme sanntidsstatus.",
  },
  {
    question: "Kan jeg ta betalt på nett for utleien?",
    answer:
      "Ja. Leietaker kan betale direkte ved booking med Vipps eller kort. Du kan sette differensiert pris etter ukedag, sesong og kapasitet, og legge til tilleggstjenester som rengjøring, utstyr eller bemanning som egne linjer i prisen.",
  },
  {
    question: "Hva koster et bookingsystem for utleie?",
    answer:
      "Prisen avhenger av antall utleieobjekter, bookingvolum og integrasjoner. Digilist tilbyr en gratis demo og et pristilbud tilpasset behovet ditt. For leietakere er det gratis å søke, sammenligne og booke – de betaler kun leieprisen til utleier.",
  },
  {
    question: "Passer Digilist for både private utleiere og kommuner?",
    answer:
      "Ja. Digilist er bygget for begge markeder i samme system. Private utleiere av festlokaler, gårder, møterom og idrettsanlegg bruker samme sanntidskalender som kommuner bruker for offentlige lokaler. Det betyr at leietakere finner både private og offentlige lokaler samlet ett sted.",
  },
  {
    question: "Hvordan får utleieobjektet mitt mer synlighet?",
    answer:
      "Utleieobjektet ditt blir søkbart på lokaltype, geografi og fasiliteter, slik at leietakere som leter etter akkurat den typen lokale finner deg. Sanntidskalender og direkte booking senker terskelen for at en interessert leietaker faktisk fullfører bookingen.",
  },
];

const FEATURES_NB: readonly Feature[] = [
  {
    title: "Sanntidskalender",
    body: "Leietakere ser ledig, opptatt og blokkert tid umiddelbart. Dobbeltbooking hindres automatisk, og endringer oppdateres uten refresh for både utleier og leietaker.",
  },
  {
    title: "Online booking og betaling",
    body: "Leietaker booker og betaler direkte med Vipps eller kort. Bekreftelse og kvittering sendes automatisk – ingen manuell fakturering av småoppdrag.",
  },
  {
    title: "Differensiert pris og tilleggstjenester",
    body: "Sett pris etter ukedag, sesong og kapasitet. Legg til rengjøring, utstyr, bemanning eller andre tillegg som egne linjer, slik at leietaker ser totalprisen før booking.",
  },
  {
    title: "Kalendersynk (iCal / CalDAV / Outlook)",
    body: "Hold utleiekalenderen synkronisert med Outlook, Google og andre kalendere, så en booking ett sted aldri kolliderer med en avtale et annet.",
  },
  {
    title: "Automatiske bekreftelser og påminnelser",
    body: "Forespørsler, bekreftelser, påminnelser og endringer sendes automatisk til leietaker og relevante driftsroller – mindre e-post og telefon for deg.",
  },
  {
    title: "Søkbar og oppdagbar",
    body: "Utleieobjektet vises der leietakere leter, med filtrering på lokaltype, geografi og fasiliteter. Det gjør at interesserte finner deg og fullfører bookingen.",
  },
];

const WHY_NB: readonly string[] = [
  "Sanntidstilgjengelighet uten dobbeltbooking",
  "Online booking og betaling (Vipps, kort)",
  "Differensiert pris etter sesong og ukedag",
  "Tilleggstjenester som egne prislinjer",
  "Kalendersynk (iCal / CalDAV / Outlook)",
  "Automatiske bekreftelser og påminnelser",
  "Mindre e-post og telefon per booking",
  "Søkbar på lokaltype, geografi og fasiliteter",
  "Privat og offentlig utleie i samme system",
  "Data lagret i Norge og EU (GDPR)",
  "Rapportering på belegg og inntekt",
  "Audit-logg på alle endringer",
];

const TYPES_NB: readonly VenueLink[] = [
  { label: "Selskapslokale", to: "/leie/selskapslokale" },
  { label: "Gård", to: "/leie/gaard" },
  { label: "Bursdagslokale", to: "/leie/bursdagslokale" },
  { label: "Kulturhus", to: "/leie/kulturhus" },
  { label: "Møterom", to: "/leie/moterom" },
  { label: "Konferanselokale", to: "/leie/konferanselokale" },
  { label: "Kontorlokaler", to: "/leie/kontorlokaler" },
  { label: "Coworking", to: "/leie/coworking" },
  { label: "Idrettshall", to: "/leie/idrettshall" },
  { label: "Padelbane", to: "/leie/padelbane" },
  { label: "Svømmehall", to: "/leie/svommehall" },
  { label: "Alle lokaler", to: "/leie" },
];

const FEATURES_EN: readonly Feature[] = [
  {
    title: "A real-time calendar",
    body: "People renting see free, booked and blocked time immediately. Double bookings are prevented automatically, and changes appear without a refresh for both sides.",
  },
  {
    title: "Booking and payment online",
    body: "The person renting books and pays directly by card or Vipps, the Norwegian payment app. Confirmation and receipt are sent automatically — no manual invoicing for small jobs.",
  },
  {
    title: "Varied pricing and extras",
    body: "Set the price by day of the week, season and capacity. Add cleaning, equipment, staffing or other extras as separate lines, so the person renting sees the total before booking.",
  },
  {
    title: "Calendar sync (iCal / CalDAV / Outlook)",
    body: "Keep your rental calendar in step with Outlook, Google and other calendars, so a booking in one place never collides with an appointment in another.",
  },
  {
    title: "Automatic confirmations and reminders",
    body: "Requests, confirmations, reminders and changes go out automatically to the person renting and to the relevant operations staff — less email and fewer phone calls for you.",
  },
  {
    title: "Searchable and easy to find",
    body: "Your venue appears where people are looking, with filtering by venue type, location and facilities. That is what gets an interested visitor to finish the booking.",
  },
];

const WHY_EN: readonly string[] = [
  "Real-time availability, with no double bookings",
  "Booking and payment online (card, Vipps)",
  "Prices that vary by season and day of the week",
  "Extras as their own price lines",
  "Calendar sync (iCal / CalDAV / Outlook)",
  "Automatic confirmations and reminders",
  "Less email and fewer calls per booking",
  "Searchable by venue type, location and facilities",
  "Private and public rentals in one system",
  "Data stored in Norway and the EU (GDPR)",
  "Reporting on occupancy and income",
  "An audit log on every change",
];

const TYPES_EN: readonly VenueLink[] = [
  { label: "Function room", to: "/leie/selskapslokale" },
  { label: "Farm venue", to: "/leie/gaard" },
  { label: "Birthday venue", to: "/leie/bursdagslokale" },
  { label: "Cultural venue", to: "/leie/kulturhus" },
  { label: "Meeting room", to: "/leie/moterom" },
  { label: "Conference venue", to: "/leie/konferanselokale" },
  { label: "Office space", to: "/leie/kontorlokaler" },
  { label: "Coworking", to: "/leie/coworking" },
  { label: "Sports hall", to: "/leie/idrettshall" },
  { label: "Padel court", to: "/leie/padelbane" },
  { label: "Swimming pool", to: "/leie/svommehall" },
  { label: "All venues", to: "/leie" },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "What is a booking system for venue rental?",
    answer:
      "A booking system for venue rental is a platform where you, as the operator, publish the times your venue is free, and people see availability in real time and book directly. It handles the calendar, price, extras, payment and confirmations, so you avoid rounds of email and phone calls. Digilist is such a system, built for private operators and for public venues alike.",
  },
  {
    question: "How do I rent out venues with a real-time calendar?",
    answer:
      "You add the venue with its free times, price and any extras. People see immediately what is free, booked and blocked, and book the date they need. The calendar updates without a refresh, and double booking is prevented automatically because everyone sees the same live status.",
  },
  {
    question: "Can I take payment online?",
    answer:
      "Yes. The person renting can pay at the point of booking by card or with Vipps, the Norwegian payment app. You can set prices that vary by day of the week, season and capacity, and add extras such as cleaning, equipment or staffing as separate lines in the price.",
  },
  {
    question: "What does a booking system for venue rental cost?",
    answer:
      "The price depends on the number of venues, booking volume and integrations. Digilist offers a free demo and a quote suited to your needs. For the person renting it is free to search, compare and book — they pay only the rental price to the operator.",
  },
  {
    question: "Does Digilist suit both private operators and public bodies?",
    answer:
      "Yes. Digilist is built for both markets in the same system. Private operators of function rooms, farms, meeting rooms and sports facilities use the same real-time calendar that municipalities use for public venues. That means people find private and public venues together, in one place.",
  },
  {
    question: "How does my venue get more visibility?",
    answer:
      "Your venue becomes searchable by venue type, location and facilities, so people looking for exactly that kind of space find you. A real-time calendar and direct booking lower the barrier to an interested visitor actually completing the booking.",
  },
];

const NB: OperatorCopy = {
  metaTitle: "Bookingsystem utleie · Digilist | Leie ut lokaler på nett",
  metaDescription:
    "Bookingsystem utleie av lokaler: sanntidskalender, online booking og betaling med Vipps, differensiert pris og kalendersynk. For private utleiere og kommuner.",
  keywords:
    "bookingsystem utleie, bookingsystem for utleie av lokaler, utleie booking, leie ut lokaler system, utleiesystem lokaler",
  rule: "BOOKINGSYSTEM UTLEIE · 2026",
  h1: "Bookingsystem for",
  h1em: "utleie av lokaler",
  ledeA: "Et bookingsystem for utleie lar deg vise ledige tider i sanntid og la leietakere booke og betale direkte. Digilist er en norsk bookingplattform for ",
  ledeStrong: "både private utleiere og kommuner",
  ledeB: " – sanntidskalender, Vipps-betaling og differensiert pris, uten runder med e-post og telefon.",
  ctaQuote: "Be om pristilbud",
  ctaOpen: "Åpne plattformen",
  forOperators: "For utleiere",
  operatorSpecs: [
    { label: "Marked", value: "Privat · offentlig" },
    { label: "Lokaltyper", value: "11+" },
    { label: "Betaling", value: "Vipps · kort" },
    { label: "Datalokasjon", value: "Norge · EU" },
  ],
  whyRule: "I. HVORFOR DIGITAL UTLEIE",
  whyH2: "Fra e-post til",
  whyH2em: "direkte booking",
  whyLede: "Alt en utleier trenger for å fylle kalenderen, samlet ett sted.",
  featureRule: "II. FUNKSJONALITET",
  featureH2: "Hva utleieren får.",
  featureLede: "Seks funksjoner som gjør utleie til en digital, selvbetjent flyt.",
  typesRule: "III. LOKALTYPER DU KAN LEIE UT",
  typesH2: "Én plattform, mange",
  typesH2em: "lokaltyper",
  typesLede: "Fra festlokaler og gårder til møterom og idrettsanlegg.",
  integrationRule: "IV. NORSKE INTEGRASJONER",
  integrationH2: "Tilkoblet det du",
  integrationH2em: "allerede bruker",
  contactRule: "V. KONTAKT",
  contactLede:
    "Vi setter sammen et pristilbud basert på antall utleieobjekter, bookingvolum og integrasjoner. Demo på 30–45 minutter, ingen forpliktelser.",
  ctaDemo: "Be om demo",
  supplierHeading: "Leverandørinformasjon",
  supplierSpecs: [
    { label: "Leverandør", value: "Xala Technologies AS" },
    { label: "Adresse", value: "Nesbruveien 75, 1394 Nesbru" },
    { label: "Telefon", value: "+47 96 66 50 01" },
    { label: "E-post", value: "kontakt@digilist.no" },
    { label: "Betaling", value: "Vipps · kort" },
    { label: "ISO 27001/27701", value: "Sertifisert" },
  ],
  faqRule: "VI. SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål om utleie-booking.",
  seeAlso: "Se også",
  municipalLink: "bookingsystem for kommuner",
  orBackTo: "eller tilbake til",
  frontPage: "forsiden",
  why: WHY_NB,
  types: TYPES_NB,
  features: FEATURES_NB,
  faq: FAQ_NB,
};

const EN: OperatorCopy = {
  metaTitle: "Booking system for venue rental · Digilist",
  metaDescription:
    "A booking system for renting out venues: a real-time calendar, booking and payment online, varied pricing and calendar sync. For private operators and public bodies.",
  keywords:
    "venue booking system, booking system for venue rental, rent out a venue, hall hire software, venue management system",
  rule: "VENUE RENTAL BOOKING · 2026",
  h1: "A booking system for",
  h1em: "renting out venues",
  ledeA: "A booking system for venue rental lets you show what is free in real time, and lets people book and pay directly. Digilist is a Norwegian booking platform for ",
  ledeStrong: "private operators and public bodies alike",
  ledeB: " — a real-time calendar, payment online and varied pricing, without rounds of email and phone calls.",
  ctaQuote: "Request a quote",
  ctaOpen: "Open the platform",
  forOperators: "For operators",
  operatorSpecs: [
    { label: "Market", value: "Private · public" },
    { label: "Venue types", value: "11+" },
    { label: "Payment", value: "Vipps · card" },
    { label: "Data location", value: "Norway · EU" },
  ],
  whyRule: "I. WHY RENT OUT DIGITALLY",
  whyH2: "From email to",
  whyH2em: "direct booking",
  whyLede: "Everything an operator needs to fill the calendar, in one place.",
  featureRule: "II. CAPABILITIES",
  featureH2: "What the operator gets.",
  featureLede: "Six capabilities that turn renting out into a digital, self-service flow.",
  typesRule: "III. VENUE TYPES YOU CAN RENT OUT",
  typesH2: "One platform, many",
  typesH2em: "venue types",
  typesLede: "From function rooms and farms to meeting rooms and sports facilities.",
  integrationRule: "IV. NORWEGIAN INTEGRATIONS",
  integrationH2: "Connected to what you",
  integrationH2em: "already use",
  contactRule: "V. CONTACT",
  contactLede:
    "We put together a quote based on the number of venues, booking volume and integrations. A 30–45 minute demo, with no commitment.",
  ctaDemo: "Request a demo",
  supplierHeading: "Supplier details",
  supplierSpecs: [
    { label: "Supplier", value: "Xala Technologies AS" },
    { label: "Address", value: "Nesbruveien 75, 1394 Nesbru, Norway" },
    { label: "Telephone", value: "+47 96 66 50 01" },
    { label: "Email", value: "kontakt@digilist.no" },
    { label: "Payment", value: "Vipps · card" },
    { label: "ISO 27001/27701", value: "Certified" },
  ],
  faqRule: "VI. QUESTIONS AND ANSWERS",
  faqH2: "Common questions about rental booking.",
  seeAlso: "See also",
  municipalLink: "the booking system for municipalities",
  orBackTo: "or back to the",
  frontPage: "home page",
  why: WHY_EN,
  types: TYPES_EN,
  features: FEATURES_EN,
  faq: FAQ_EN,
};

export function operatorCopy(locale: Locale): OperatorCopy {
  return locale === "en" ? EN : NB;
}
