/**
 * The /lokaler-til-leie page copy, in both languages.
 *
 * One factual claim on this page is cited: "rundt 20 000 par gifter seg i
 * Norge hvert år (SSB)". The figure and the attribution to Statistics Norway
 * are carried across unchanged — a translated statistic that loses its source
 * becomes an unsourced claim, and rounding or restating it would make it a
 * different claim from the one someone checked.
 *
 * Prices stay in kroner and are not converted, for the same reason as the
 * price calculator: they are facts about this market, and an invented exchange
 * rate would misstate what a visitor pays.
 */
import type { Locale } from "@/lib/i18n";

export interface HowToStep {
  name: string;
  text: string;
}

export interface Guidance {
  type: string;
  cap: string;
  price: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface VenueType {
  label: string;
  desc: string;
  to: string;
}

export interface CityLink {
  label: string;
  to: string;
}

export interface VenuesCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  articleHeadline: string;
  articleDescription: string;
  articleSection: string;
  authorRole: string;
  rule: string;
  h1: string;
  h1em: string;
  ledeA: string;
  ledeStrong: string;
  ledeB: string;
  ctaFind: string;
  ctaTypes: string;
  forRenters: string;
  renterSpecs: readonly { label: string; value: string }[];
  stepsRule: string;
  stepsH2: string;
  stepsH2em: string;
  stepsLede: string;
  priceRule: string;
  priceH2: string;
  priceH2em: string;
  priceLede: string;
  priceNote: string;
  pullQuote: string;
  typesRule: string;
  typesH2: string;
  typesH2em: string;
  typesLede: string;
  cityRule: string;
  cityH2: string;
  cityH2em: string;
  cityLede: string;
  faqRule: string;
  faqH2: string;
  operatorPrompt: string;
  operatorLink: string;
  orGoTo: string;
  overviewLink: string;
  steps: readonly HowToStep[];
  guidance: readonly Guidance[];
  types: readonly VenueType[];
  cities: readonly CityLink[];
  faq: readonly QA[];
}

const STEPS_NB: readonly HowToStep[] = [
  {
    name: "Bestem arrangementstype og antall gjester",
    text: "Kapasiteten avgjør mye. Et intimt selskap på 20 personer og et bryllup på 120 krever helt ulike lokaler. Tell gjester før du leter, så slipper du å vurdere lokaler som er for små eller unødvendig dyre.",
  },
  {
    name: "Sett dato – og vær tidlig ute i høysesong",
    text: "Lørdager i mai, juni, august og september er de mest ettertraktede. Har du fleksible datoer, får du flere valg og ofte lavere pris på hverdager og utenfor høysesong.",
  },
  {
    name: "Søk på lokaltype, geografi og fasiliteter",
    text: "Filtrer på det som faktisk betyr noe for deg: kapasitet, kjøkken, parkering, universell utforming, uteområde eller AV-utstyr. Da står du igjen med lokaler som passer, ikke bare lokaler som er ledige.",
  },
  {
    name: "Sammenlign pris, kapasitet og tilleggstjenester",
    text: "Se på totalprisen, ikke bare grunnleien: rengjøring, utstyr, bemanning og catering kan komme i tillegg. På Digilist vises tilleggstjenester som egne linjer, så du ser hva sluttsummen faktisk blir.",
  },
  {
    name: "Sjekk sanntidskalenderen for ledige datoer",
    text: "En sanntidskalender viser med én gang om datoen din er ledig, opptatt eller blokkert – i stedet for at du sender e-post og venter på svar som kanskje kommer for sent.",
  },
  {
    name: "Book og betal direkte",
    text: "Bekreft bookingen, betal med Vipps eller kort, og få bekreftelse og kvittering automatisk. Da er datoen sikret, og du unngår at lokalet blir booket av noen andre mens du venter.",
  },
];

const GUIDANCE_NB: readonly Guidance[] = [
  { type: "Selskapslokale / festlokale", cap: "30–150 gjester", price: "5 000–30 000 kr / dag" },
  { type: "Grendehus / foreningslokale", cap: "40–120 gjester", price: "1 000–5 000 kr / dag" },
  { type: "Møterom", cap: "4–20 personer", price: "300–2 500 kr / dag" },
  { type: "Konferanselokale", cap: "20–200 personer", price: "2 000–15 000 kr / dag" },
  { type: "Kulturhus / storsal", cap: "50–400 personer", price: "3 000–20 000 kr / arr." },
  { type: "Idrettshall", cap: "Lag / grupper", price: "200–1 500 kr / time" },
];

const FAQ_NB: readonly QA[] = [
  {
    question: "Hvor finner jeg lokaler til leie?",
    answer:
      "Du finner lokaler til leie på bookingplattformer som viser ledige tider i sanntid. På Digilist søker du på lokaltype, geografi og fasiliteter, ser hva som er ledig på datoen din, og booker direkte – uten å sende e-poster og vente på svar. Plattformen samler både private utleielokaler og offentlige/kommunale lokaler ett sted.",
  },
  {
    question: "Hva slags lokaler kan jeg leie?",
    answer:
      "Du kan leie selskapslokaler og festlokaler, møterom og konferanselokaler, kontorlokaler og coworking, kulturhus og grendehus, idrettshaller, svømmehaller og gårder. På Digilist er både private og kommunale lokaler samlet, slik at du kan sammenligne på ett sted i stedet for å lete på mange nettsider.",
  },
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med lokaltype, kapasitet, ukedag og sesong. Som en grov pekepinn ligger grendehus og foreningslokaler ofte på 1 000–5 000 kr per dag, mens selskapslokaler til større fester kan koste 5 000–30 000 kr eller mer, og møterom fra noen hundre kroner. Lørdager i høysesong koster mer enn hverdager. Se alltid prisen på det enkelte lokalet før du bekrefter bookingen.",
  },
  {
    question: "Hvor tidlig bør jeg booke et lokale?",
    answer:
      "Det kommer an på arrangementet. Populære selskaps- og festlokaler til bryllup og store fester bookes ofte 6–12 måneder i forveien, særlig for lørdager i mai–september. Møterom og mindre lokaler kan gjerne bookes med noen dagers eller ukers varsel. Med sanntidskalender ser du umiddelbart om datoen din er ledig.",
  },
  {
    question: "Hvordan booker jeg et lokale på nett?",
    answer:
      "Du finner lokalet, velger en ledig dato i sanntidskalenderen, legger til eventuelle tilleggstjenester, og bekrefter. Betaling skjer med Vipps eller kort, og du får bekreftelse og kvittering automatisk. Fordi kalenderen er i sanntid, vet du med én gang om lokalet faktisk er ledig.",
  },
  {
    question: "Kan jeg leie både private og kommunale lokaler?",
    answer:
      "Ja. Digilist samler private utleielokaler og offentlige/kommunale lokaler i samme kalender. Mange grendehus, kulturhus og kommunale lokaler leies ut til private arrangementer, og du kan sammenligne dem side om side med private festlokaler på ett sted.",
  },
];

const TYPES_NB: readonly VenueType[] = [
  { label: "Selskapslokale", desc: "Bryllup, fest og feiring", to: "/leie/selskapslokale" },
  { label: "Møterom", desc: "Møter og workshops", to: "/leie/moterom" },
  { label: "Konferanselokale", desc: "Seminarer og konferanser", to: "/leie/konferanselokale" },
  { label: "Kontorlokaler", desc: "Fast eller fleksibelt kontor", to: "/leie/kontorlokaler" },
  { label: "Coworking", desc: "Delt arbeidsplass", to: "/leie/coworking" },
  { label: "Kulturhus", desc: "Kultur og arrangement", to: "/leie/kulturhus" },
  { label: "Idrettshall", desc: "Trening og aktivitet", to: "/leie/idrettshall" },
  { label: "Hall", desc: "Idretts- og aktivitetshall", to: "/leie/hall" },
  { label: "Gård", desc: "Landlig ramme for fest", to: "/leie/gaard" },
  { label: "Bursdagslokale", desc: "Barnebursdag og feiring", to: "/leie/bursdagslokale" },
  { label: "Svømmehall", desc: "Svømming og vannaktivitet", to: "/leie/svommehall" },
  { label: "Alle lokaltyper", desc: "Se hele oversikten", to: "/leie" },
];

const CITIES_NB: readonly CityLink[] = [
  { label: "Lokaler til leie i Oslo", to: "/lokaler-til-leie/oslo" },
  { label: "Lokaler til leie i Bergen", to: "/lokaler-til-leie/bergen" },
  { label: "Lokaler til leie i Trondheim", to: "/lokaler-til-leie/trondheim" },
];

const STEPS_EN: readonly HowToStep[] = [
  {
    name: "Decide on the type of event and the number of guests",
    text: "Capacity settles most of it. An intimate gathering of 20 and a wedding of 120 need completely different venues. Count your guests before you start looking, and you avoid weighing up rooms that are too small or needlessly expensive.",
  },
  {
    name: "Set the date — and be early in high season",
    text: "Saturdays in May, June, August and September are the most sought-after. If your dates are flexible, you get more choice and often a lower price on weekdays and outside high season.",
  },
  {
    name: "Search by venue type, location and facilities",
    text: "Filter on what actually matters to you: capacity, a kitchen, parking, accessibility, outdoor space or AV equipment. That leaves you with venues that fit, rather than venues that are merely free.",
  },
  {
    name: "Compare price, capacity and extras",
    text: "Look at the total, not just the base rent: cleaning, equipment, staffing and catering can be added. On Digilist extras appear as separate lines, so you can see what the final figure will actually be.",
  },
  {
    name: "Check the real-time calendar for free dates",
    text: "A real-time calendar shows immediately whether your date is free, booked or blocked — instead of sending an email and waiting for a reply that may come too late.",
  },
  {
    name: "Book and pay directly",
    text: "Confirm the booking, pay by card or Vipps, and get confirmation and a receipt automatically. The date is then secured, and the venue cannot be booked by someone else while you wait.",
  },
];

const GUIDANCE_EN: readonly Guidance[] = [
  { type: "Function room / party venue", cap: "30–150 guests", price: "NOK 5,000–30,000 / day" },
  { type: "Community hall", cap: "40–120 guests", price: "NOK 1,000–5,000 / day" },
  { type: "Meeting room", cap: "4–20 people", price: "NOK 300–2,500 / day" },
  { type: "Conference venue", cap: "20–200 people", price: "NOK 2,000–15,000 / day" },
  { type: "Cultural venue / large hall", cap: "50–400 people", price: "NOK 3,000–20,000 / event" },
  { type: "Sports hall", cap: "Teams / groups", price: "NOK 200–1,500 / hour" },
];

const TYPES_EN: readonly VenueType[] = [
  { label: "Function room", desc: "Weddings, parties and celebrations", to: "/leie/selskapslokale" },
  { label: "Meeting room", desc: "Meetings and workshops", to: "/leie/moterom" },
  { label: "Conference venue", desc: "Seminars and conferences", to: "/leie/konferanselokale" },
  { label: "Office space", desc: "A fixed or flexible office", to: "/leie/kontorlokaler" },
  { label: "Coworking", desc: "A shared workspace", to: "/leie/coworking" },
  { label: "Cultural venue", desc: "Culture and events", to: "/leie/kulturhus" },
  { label: "Sports hall", desc: "Training and activity", to: "/leie/idrettshall" },
  { label: "Hall", desc: "Sports and activity hall", to: "/leie/hall" },
  { label: "Farm venue", desc: "A rural setting for a party", to: "/leie/gaard" },
  { label: "Birthday venue", desc: "Children's parties and celebrations", to: "/leie/bursdagslokale" },
  { label: "Swimming pool", desc: "Swimming and water activities", to: "/leie/svommehall" },
  { label: "All venue types", desc: "See the full list", to: "/leie" },
];

const CITIES_EN: readonly CityLink[] = [
  { label: "Venues to rent in Oslo", to: "/lokaler-til-leie/oslo" },
  { label: "Venues to rent in Bergen", to: "/lokaler-til-leie/bergen" },
  { label: "Venues to rent in Trondheim", to: "/lokaler-til-leie/trondheim" },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "Where do I find venues to rent?",
    answer:
      "You find venues to rent on booking platforms that show free times in real time. On Digilist you search by venue type, location and facilities, see what is free on your date, and book directly — without sending emails and waiting for replies. The platform brings private rental venues and public ones together in one place.",
  },
  {
    question: "What kinds of venues can I rent?",
    answer:
      "You can rent function rooms and party venues, meeting rooms and conference venues, offices and coworking space, cultural venues and community halls, sports halls, swimming pools and farms. On Digilist private and municipal venues sit together, so you can compare in one place instead of searching across many websites.",
  },
  {
    question: "What does it cost to rent a venue?",
    answer:
      "The price varies a great deal with venue type, capacity, day of the week and season. As a rough guide, community halls are often NOK 1,000–5,000 per day, while function rooms for larger parties can be NOK 5,000–30,000 or more, and meeting rooms start from a few hundred kroner. Saturdays in high season cost more than weekdays. Always check the price on the individual venue before you confirm.",
  },
  {
    question: "How far ahead should I book a venue?",
    answer:
      "It depends on the event. Popular function and party venues for weddings and large celebrations are often booked 6–12 months ahead, particularly for Saturdays between May and September. Meeting rooms and smaller venues can usually be booked a few days or weeks ahead. With a real-time calendar you see immediately whether your date is free.",
  },
  {
    question: "How do I book a venue online?",
    answer:
      "You find the venue, choose a free date in the real-time calendar, add any extras, and confirm. Payment is by card or Vipps, and you get confirmation and a receipt automatically. Because the calendar is live, you know at once whether the venue is genuinely available.",
  },
  {
    question: "Can I rent both private and municipal venues?",
    answer:
      "Yes. Digilist brings private rental venues and public ones into the same calendar. Many community halls, cultural venues and municipal premises are rented out for private events, and you can compare them side by side with private party venues in one place.",
  },
];

const NB: VenuesCopy = {
  metaTitle: "Lokaler til leie – finn og book ledige lokaler | Digilist",
  metaDescription:
    "Lokaler til leie: se ledige private og kommunale selskapslokaler, møterom, kulturhus og haller i sanntid. Sammenlign pris og book direkte på Digilist.",
  keywords:
    "lokaler til leie, lokale til leie, leie lokaler, leie lokale, finn lokale til leie, lokale til leie på nett, leie lokale pris",
  articleHeadline: "Lokaler til leie: slik finner, sammenligner og booker du",
  articleDescription:
    "Slik finner du lokaler til leie: kapasitet, pris, sanntidskalender og direkte booking.",
  articleSection: "Lokaler til leie",
  authorRole: "Grunnlegger, Digilist",
  rule: "LOKALER TIL LEIE · 2026",
  h1: "Lokaler",
  h1em: "til leie",
  ledeA: "Du finner lokaler til leie ved å søke i sanntid på Digilist – en norsk bookingplattform der ",
  ledeStrong: "både private og kommunale lokaler",
  ledeB: " ligger samlet. Se hva som er ledig på datoen din, sammenlign pris og kapasitet, og book direkte, uten en runde med e-post og telefon.",
  ctaFind: "Finn ledige lokaler",
  ctaTypes: "Se lokaltyper",
  forRenters: "For leietakere",
  renterSpecs: [
    { label: "Marked", value: "Privat · offentlig" },
    { label: "Lokaltyper", value: "11+" },
    { label: "Tilgjengelighet", value: "Sanntid" },
  ],
  stepsRule: "I. SLIK FINNER OG VELGER DU LOKALE",
  stepsH2: "Seks steg til riktig",
  stepsH2em: "lokale",
  stepsLede: "Fra antall gjester til bekreftet booking – uten e-postjakt.",
  priceRule: "II. KAPASITET OG PRIS",
  priceH2: "Hva slags lokale –",
  priceH2em: "og hva koster det",
  priceLede: "Grove intervaller som pekepinn – se alltid prisen på det enkelte lokalet.",
  priceNote:
    "Prisene varierer mye med kapasitet, ukedag, sesong og geografi, og er ment som en grov pekepinn – ikke et tilbud. Grendehus og foreningslokaler ligger typisk lavere enn hotell- og restaurantlokaler, og lørdager i høysesong koster mer enn hverdager. Prisen på det enkelte lokalet vises alltid før du bekrefter bookingen på Digilist.",
  pullQuote:
    "Rundt 20 000 par gifter seg i Norge hvert år (SSB), og populære festlokaler bookes ofte 6–12 måneder i forveien. Er du ute i god tid, har du langt flere lokaler å velge mellom – og bedre priser på hverdager og utenfor høysesong.",
  typesRule: "III. LOKALTYPER DU KAN LEIE",
  typesH2: "Hva vil du",
  typesH2em: "leie",
  typesLede: "Fra selskapslokaler og møterom til kulturhus, haller og gårder.",
  cityRule: "IV. LOKALER TIL LEIE ETTER BY",
  cityH2: "Finn lokaler i",
  cityH2em: "din by",
  cityLede: "Lokale oversikter over hva du kan leie i de største byene.",
  faqRule: "V. SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål om lokaler til leie.",
  operatorPrompt: "Er du utleier? Se",
  operatorLink: "bookingsystem for utleie",
  orGoTo: "eller gå til",
  overviewLink: "oversikten over lokaltyper",
  steps: STEPS_NB,
  guidance: GUIDANCE_NB,
  types: TYPES_NB,
  cities: CITIES_NB,
  faq: FAQ_NB,
};

const EN: VenuesCopy = {
  metaTitle: "Venues to rent — find and book available spaces | Digilist",
  metaDescription:
    "Venues to rent: find available function rooms, meeting rooms, cultural venues and halls in real time. Compare private and municipal venues on price, and book.",
  keywords:
    "venues to rent, venue to rent, rent a venue, find a venue, hall hire, venue hire price, book a venue online",
  articleHeadline: "Venues to rent: how to find, compare and book one",
  articleDescription:
    "How to find a venue to rent: capacity, price, a real-time calendar and direct booking.",
  articleSection: "Venues to rent",
  authorRole: "Founder, Digilist",
  rule: "VENUES TO RENT · 2026",
  h1: "Venues",
  h1em: "to rent",
  ledeA: "You find venues to rent by searching in real time on Digilist — a Norwegian booking platform where ",
  ledeStrong: "private and municipal venues",
  ledeB: " sit together. See what is free on your date, compare price and capacity, and book directly, without a round of email and phone calls.",
  ctaFind: "Find available venues",
  ctaTypes: "See venue types",
  forRenters: "For people renting",
  renterSpecs: [
    { label: "Market", value: "Private · public" },
    { label: "Venue types", value: "11+" },
    { label: "Availability", value: "Real time" },
  ],
  stepsRule: "I. HOW TO FIND AND CHOOSE A VENUE",
  stepsH2: "Six steps to the right",
  stepsH2em: "venue",
  stepsLede: "From a guest count to a confirmed booking — with no email chasing.",
  priceRule: "II. CAPACITY AND PRICE",
  priceH2: "What kind of venue —",
  priceH2em: "and what does it cost",
  priceLede: "Rough ranges as a guide — always check the price on the individual venue.",
  priceNote:
    "Prices vary a great deal with capacity, day of the week, season and location, and are meant as a rough guide rather than a quote. Community halls are typically lower than hotel and restaurant spaces, and Saturdays in high season cost more than weekdays. The price for the individual venue is always shown before you confirm a booking on Digilist.",
  pullQuote:
    "Around 20,000 couples marry in Norway each year (Statistics Norway), and popular party venues are often booked 6–12 months ahead. If you are early, you have far more venues to choose between — and better prices on weekdays and outside high season.",
  typesRule: "III. VENUE TYPES YOU CAN RENT",
  typesH2: "What do you want to",
  typesH2em: "rent",
  typesLede: "From function rooms and meeting rooms to cultural venues, halls and farms.",
  cityRule: "IV. VENUES TO RENT BY CITY",
  cityH2: "Find venues in",
  cityH2em: "your city",
  cityLede: "Local overviews of what you can rent in the largest cities.",
  faqRule: "V. QUESTIONS AND ANSWERS",
  faqH2: "Common questions about renting a venue.",
  operatorPrompt: "Do you rent out venues? See",
  operatorLink: "the booking system for venue rental",
  orGoTo: "or go to",
  overviewLink: "the list of venue types",
  steps: STEPS_EN,
  guidance: GUIDANCE_EN,
  types: TYPES_EN,
  cities: CITIES_EN,
  faq: FAQ_EN,
};

export function venuesCopy(locale: Locale): VenuesCopy {
  return locale === "en" ? EN : NB;
}
