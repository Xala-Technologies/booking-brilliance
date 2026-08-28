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
  openingScene: string;
  h1: string;
  h1em: string;
  ledeA: string;
  ledeStrong: string;
  ledeB: string;
  ctaQuote: string;
  ctaOpen: string;
  forOperators: string;
  operatorSpecs: readonly Spec[];
  definitionRule: string;
  definitionH2: string;
  definitionP1: string;
  definitionP2: string;
  definitionP3: string;
  whyRule: string;
  whyH2: string;
  whyH2em: string;
  whyLede: string;
  featureRule: string;
  featureH2: string;
  featureLede: string;
  zonesH2: string;
  zonesP1: string;
  zonesP2: string;
  zonesP3: string;
  zonesLinkText: string;
  zonesLinkUrl: string;
  approvalH2: string;
  approvalP1: string;
  approvalP2: string;
  approvalP3: string;
  bufferH2: string;
  bufferP1: string;
  bufferP2: string;
  bufferP3: string;
  embeddedH2: string;
  embeddedP1: string;
  embeddedLinkText: string;
  embeddedLinkUrl: string;
  renterTypesH2: string;
  renterTypesP1: string;
  renterTypesP2: string;
  renterTypesLinkText: string;
  renterTypesLinkUrl: string;
  typesRule: string;
  typesH2: string;
  typesH2em: string;
  typesLede: string;
  integrationRule: string;
  integrationH2: string;
  integrationH2em: string;
  kommuneRule: string;
  kommuneH2: string;
  kommuneBody: string;
  kommuneLinkText: string;
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
    question: "Hva er et bookingsystem for utleie av lokaler?",
    answer:
      "Et system der utleier legger ut ledige tider på et lokale (festlokale, møterom, gård, hall), og leietaker ser sanntid, booker og betaler. Kalender, pris, tillegg og bekreftelse ligger ett sted. Digilist er et system for utleie av lokaler, ikke et lagersystem for utstyr.",
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
      "Prisen avhenger av antall utleieobjekter, bookingvolum og integrasjoner. Digilist tilbyr en gratis demo og et pristilbud tilpasset behovet ditt. For leietakere er det gratis å søke, sammenligne og booke. De betaler kun leieprisen til utleier.",
  },
  {
    question: "Passer dette for private utleiere, eller bare kommuner?",
    answer:
      "Denne siden er for private utleiere av lokaler. Kommuner bruker bookingsystem for kommuner (https://digilist.no/bookingsystem-kommune). Samme produktfamilie, ulik landing.",
  },
  {
    question: "Hvordan får utleieobjektet mitt mer synlighet?",
    answer:
      "Utleieobjektet ditt blir søkbart på lokaltype, geografi og fasiliteter, slik at leietakere som leter etter akkurat den typen lokale finner deg. Sanntidskalender og direkte booking senker terskelen for at en interessert leietaker faktisk fullfører bookingen.",
  },
  {
    question: "Er dette et bookingsystem for utstyr og lager, eller for lokaler?",
    answer:
      "For lokaler. Tilhenger, verktøy og minilager er en annen jobb. Digilist håndterer festlokale, møterom, gård og hall, med en kalender leietakeren kan booke.",
  },
  {
    question: "Hva er forskjellen på et bookingsystem og et utleiesystem?",
    answer:
      "Booking er kalenderen og kassen. Et utleiesystem kjører også pris, tillegg, bekreftelse og oversikt. Digilist gjør begge deler for lokaler.",
  },
  {
    question: "Hva er sammenhengende bookingressurser?",
    answer:
      "Sammenhengende bookingressurser er lokaler som låser hverandre. Booker noen hele etasjen, går begge salene opptatt. Booker noen én sal, kan ikke etasjen bookes.",
  },
  {
    question: "Kan vi sette buffer før og etter en booking?",
    answer:
      "Ja. Bufferen ligger i bookingen, ikke i hodet på den som sist redigerte Excel. Dere setter den per type, for eksempel kortere før en øving og lenger etter et selskap.",
  },
  {
    question: "Må bookinger godkjennes før de er bindende?",
    answer:
      "Ja, hvis dere vil. Forespørselen lander hos dere. Dere sjekker husregler og fakturaadresse, så bekrefter dere. Før det er tiden ikke tatt.",
  },
  {
    question: "Kan leietaker se ledig tid på vår nettside?",
    answer:
      "Ja. Kalenderen kan ligge på deres egen nettside. Leietaker ser samme ledig og opptatt som dere, og sender derfra.",
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
      "A system where the operator publishes free times for a venue, and the person renting sees real-time availability, books, and pays. Calendar, price, extras, and confirmation are all in one place. Digilist is a system for venue rental.",
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
      "The price depends on the number of venues, booking volume and integrations. Digilist offers a free demo and a quote suited to your needs. For the person renting it is free to search, compare and book. They pay only the rental price to the operator.",
  },
  {
    question: "Is this for private operators, or only for municipalities?",
    answer:
      "This page is for private operators of venues. Municipalities use the booking system for municipalities (https://digilist.no/bookingsystem-kommune). Same product family, different landing page.",
  },
  {
    question: "How does my venue get more visibility?",
    answer:
      "Your venue becomes searchable by venue type, location and facilities, so people looking for exactly that kind of space find you. A real-time calendar and direct booking lower the barrier to an interested visitor actually completing the booking.",
  },
  {
    question: "Is this a booking system for equipment and storage, or for venues?",
    answer:
      "For venues. Systems for trailers, tools and storage are a different job. Digilist handles function rooms, meeting rooms, farms and halls, with a calendar people can book.",
  },
  {
    question: "What is the difference between a booking system and a rental system?",
    answer:
      "Booking is the calendar and the checkout. A rental system also handles price, extras, confirmation and reporting. Digilist does both for venues.",
  },
  {
    question: "What are linked booking resources?",
    answer:
      "Linked booking resources are spaces that lock each other. If someone books the whole floor, both rooms become unavailable. If someone books one room, the floor cannot be booked.",
  },
  {
    question: "Can we set buffer time before and after a booking?",
    answer:
      "Yes. The buffer sits in the booking, not in the head of whoever last edited the spreadsheet. You set it per type, for example shorter before a rehearsal and longer after a party.",
  },
  {
    question: "Do bookings need to be approved before they are binding?",
    answer:
      "Yes, if you want. The request lands with you. You check house rules and billing address, then you confirm. Before that, the time is not taken.",
  },
  {
    question: "Can the person renting see availability on our website?",
    answer:
      "Yes. The calendar can sit on your own website. The person renting sees the same availability as you, and sends from there.",
  },
];

const NB: OperatorCopy = {
  metaTitle: "Bookingsystem for utleie av lokaler, ikke utstyr | Digilist",
  metaDescription:
    "Bookingsystem for utleie av lokaler. Festlokale, møterom, gård og hall, ikke tilhenger, verktøy eller minilager. Sanntidskalender, Vipps og kort, differensiert pris.",
  keywords:
    "bookingsystem utleie, bookingsystem for utleie av lokaler, system for utleie av lokaler, utleie av lokaler, bookingsystem lokaler",
  rule: "BOOKINGSYSTEM UTLEIE · 2026",
  openingScene: "Innboksen er full. Tre vil ha samme lørdag. Kalenderen sitter i hodet.",
  h1: "Bookingsystem for",
  h1em: "utleie av lokaler, ikke utstyr",
  ledeA: "Et bookingsystem for utleie av lokaler skal vise ledig tid, ta imot booking og betaling, og hindre dobbeltbooking. ",
  ledeStrong: "Ikke mer e-post frem og tilbake",
  ledeB: ".",
  ctaQuote: "Be om pristilbud",
  ctaOpen: "Åpne plattformen",
  forOperators: "For utleiere",
  operatorSpecs: [
    { label: "Marked", value: "Privat · offentlig" },
    { label: "Lokaltyper", value: "11+" },
    { label: "Betaling", value: "Vipps · kort" },
    { label: "Datalokasjon", value: "Norge · EU" },
  ],
  definitionRule: "I. DEFINISJON",
  definitionH2: "Hva er et bookingsystem for utleie av lokaler?",
  definitionP1: "Et bookingsystem for utleie av lokaler viser ledig tid på et lokale, tar imot booking og betaling, og holder én kalender for utleier og leietaker.",
  definitionP2: "Denne siden gjelder festlokale, møterom, gård og hall. Ikke tilhenger, verktøy, lager eller minilager.",
  definitionP3: "Digilist er et system for utleie av lokaler. Mindre e-post og telefon. Samme kalender for begge.",
  whyRule: "II. HVORFOR DIGITAL UTLEIE",
  whyH2: "Fra e-post til",
  whyH2em: "direkte booking",
  whyLede: "Alt en utleier trenger for å fylle kalenderen, samlet ett sted.",
  featureRule: "III. FUNKSJONALITET",
  featureH2: "Hva utleieren får.",
  featureLede: "Seks funksjoner som gjør utleie til en digital, selvbetjent flyt.",
  zonesH2: "Soner og tildeling",
  zonesP1: "Et lokale kan ha deler. En sal. En etasje. En sone.",
  zonesP2: "Booker noen hele etasjen, går salene opptatt. Booker noen én sal, kan ikke etasjen bookes. Kalenderen behandler delene som hører sammen, ikke som tre rader som ikke kjenner hverandre.",
  zonesP3: "Kollisjonen er inne i huset. Ikke to systemer som skriver forbi hverandre.",
  zonesLinkText: "Når hele etasjen er booket, må salene også være opptatt",
  zonesLinkUrl: "/blogg/naar-hele-etasjen-er-booket-maa-salene-vaere-opptatt",
  approvalH2: "Godkjenning før bekreftelse",
  approvalP1: "Forespørselen lander hos dere. Den er ikke bindende ennå.",
  approvalP2: "Dere sjekker husregler og fakturaadresse. Så bekrefter dere. Før det er tiden ikke tatt. Etterpå er den tatt i salen, etasjen og sonen som hører sammen.",
  approvalP3: "Systemet viser ledig og opptatt. Det fatter ikke vedtaket.",
  bufferH2: "Døgnkalender og buffer",
  bufferP1: "Kalenderen går døgnet rundt. Ledig er ledig. Opptatt er opptatt.",
  bufferP2: "Buffer før og etter sitter i bookingen, ikke i hodet. Dere setter den per type. Kortere før en øving. Lenger etter et selskap.",
  bufferP3: "Ingen fast minuttverdi som «slik er det hos oss». Det er husets regel, i bookingen.",
  embeddedH2: "Kalender på egen nettside",
  embeddedP1: "Kalenderen kan ligge på nettsiden dere allerede har. Leietaker ser samme ledig og opptatt som dere, og sender derfra.",
  embeddedLinkText: "Innebygd booking",
  embeddedLinkUrl: "/innebygd-booking",
  renterTypesH2: "Pris og regler per leietakertype",
  renterTypesP1: "Privat, næring, offentlig og visning kan ha ulike priser og regler. Forskning er egne regler per bruk, ikke en femte type ved siden av.",
  renterTypesP2: "Det er utleierens regler. Ikke kommunens prisgrupper.",
  renterTypesLinkText: "Leietakertyper",
  renterTypesLinkUrl: "/leietakertyper",
  typesRule: "IV. LOKALTYPER DU KAN LEIE UT",
  typesH2: "Én plattform, mange",
  typesH2em: "lokaltyper",
  typesLede: "Fra festlokaler og gårder til møterom og idrettsanlegg.",
  integrationRule: "V. NORSKE INTEGRASJONER",
  integrationH2: "Tilkoblet det du",
  integrationH2em: "allerede bruker",
  kommuneRule: "VI. KOMMUNER",
  kommuneH2: "Kommuner",
  kommuneBody: "Kommuner som leier ut lokaler, bruker ",
  kommuneLinkText: "bookingsystem for kommuner",
  contactRule: "VII. KONTAKT",
  contactLede:
    "Vi setter sammen et pristilbud basert på antall utleieobjekter, bookingvolum og integrasjoner. Demo på 30 til 45 minutter, ingen forpliktelser.",
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
  faqRule: "VIII. SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål om bookingsystem for utleie",
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
  openingScene: "The inbox is full. Three want the same Saturday. The calendar is in your head.",
  h1: "A booking system for",
  h1em: "renting out venues",
  ledeA: "A booking system for venue rental shows what is free, takes bookings and payments, and prevents double bookings. ",
  ledeStrong: "No more email back and forth",
  ledeB: ".",
  ctaQuote: "Request a quote",
  ctaOpen: "Open the platform",
  forOperators: "For operators",
  operatorSpecs: [
    { label: "Market", value: "Private · public" },
    { label: "Venue types", value: "11+" },
    { label: "Payment", value: "Vipps · card" },
    { label: "Data location", value: "Norway · EU" },
  ],
  definitionRule: "I. DEFINITION",
  definitionH2: "What is a booking system for venue rental?",
  definitionP1: "A booking system for venue rental shows free times, takes bookings and payments, and prevents double bookings.",
  definitionP2: "This page is about renting out venues (function rooms, meeting rooms, farms, halls). Not trailers, tools, or storage.",
  definitionP3: "Less email and phone. One calendar for operator and renter.",
  whyRule: "II. WHY RENT OUT DIGITALLY",
  whyH2: "From email to",
  whyH2em: "direct booking",
  whyLede: "Everything an operator needs to fill the calendar, in one place.",
  featureRule: "III. CAPABILITIES",
  featureH2: "What the operator gets.",
  featureLede: "Six capabilities that turn renting out into a digital, self-service flow.",
  zonesH2: "Zones and allocation",
  zonesP1: "A venue can have parts. A hall. A floor. A zone.",
  zonesP2: "If someone books the whole floor, the halls become unavailable. If someone books one hall, the floor cannot be booked. The calendar treats the parts that belong together as a unit, not as three rows that do not know each other.",
  zonesP3: "The collision is inside the building. Not two systems writing past each other.",
  zonesLinkText: "When the whole floor is booked, the halls must also be unavailable",
  zonesLinkUrl: "/blogg/naar-hele-etasjen-er-booket-maa-salene-vaere-opptatt",
  approvalH2: "Approval before confirmation",
  approvalP1: "The request lands with you. It is not binding yet.",
  approvalP2: "You check house rules and billing address. Then you confirm. Before that, the time is not taken. After that, it is taken in the hall, the floor and the zone that belong together.",
  approvalP3: "The system shows free and booked. It does not make the decision.",
  bufferH2: "Around-the-clock calendar and buffer",
  bufferP1: "The calendar runs around the clock. Free is free. Booked is booked.",
  bufferP2: "Buffer time before and after sits in the booking, not in someone's head. You set it per type. Shorter before a rehearsal. Longer after a party.",
  bufferP3: "No fixed minute value of 'that is how we do it'. It is the building's rule, in the booking.",
  embeddedH2: "Calendar on your own website",
  embeddedP1: "The calendar can sit on the website you already have. The person renting sees the same availability as you, and sends from there.",
  embeddedLinkText: "Embedded booking",
  embeddedLinkUrl: "/innebygd-booking",
  renterTypesH2: "Price and rules per renter type",
  renterTypesP1: "Private, business, public and viewing can have different prices and rules. Research is its own rules per use, not a fifth type alongside the others.",
  renterTypesP2: "It is the operator's rules. Not the municipality's price groups.",
  renterTypesLinkText: "Renter types",
  renterTypesLinkUrl: "/leietakertyper",
  typesRule: "IV. VENUE TYPES YOU CAN RENT OUT",
  typesH2: "One platform, many",
  typesH2em: "venue types",
  typesLede: "From function rooms and farms to meeting rooms and sports facilities.",
  integrationRule: "V. NORWEGIAN INTEGRATIONS",
  integrationH2: "Connected to what you",
  integrationH2em: "already use",
  kommuneRule: "VI. MUNICIPALITIES",
  kommuneH2: "Municipalities",
  kommuneBody: "Municipalities that rent out venues use ",
  kommuneLinkText: "the booking system for municipalities",
  contactRule: "VII. CONTACT",
  contactLede:
    "We put together a quote based on the number of venues, booking volume and integrations. A 30 to 45 minute demo, with no commitment.",
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
  faqRule: "VIII. QUESTIONS AND ANSWERS",
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
