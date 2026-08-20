/**
 * The /leie hub copy, in both languages.
 *
 * The Norwegian building types are the hard part. "Grendehus" and "samfunnshus"
 * are village and community halls owned and run by the locality — there is no
 * single English word, and "village hall" is close enough to be useful while
 * "community centre" would suggest a council facility. Both are rendered as
 * "community hall", with the distinction dropped rather than invented.
 *
 * "Gård og låve" is "farm and barn" literally, but the thing being rented is a
 * farmyard wedding venue, so the English leads with that.
 *
 * The links all point at Norwegian-query landing pages that stay Norwegian, so
 * the English page keeps the category labels and drops the destinations.
 */
import type { Locale } from "@/lib/i18n";

export interface CategoryItem {
  title: string;
  to: string;
  body: string;
}

export interface CategoryGroup {
  label: string;
  meta: string;
  items: readonly CategoryItem[];
}

export interface Step {
  step: string;
  title: string;
  body: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface RentCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  howToName: string;
  howToDescription: string;
  rule: string;
  h1: string;
  h1em: string;
  lede: string;
  definitionH2: string;
  definitionP1: string;
  definitionP2: string;
  definitionP3: string;
  ctaFind: string;
  ctaHow: string;
  rentOutPromptA: string;
  rentOutPromptEm: string;
  rentOutPromptB: string;
  rentOutLink: string;
  visualLabel: string;
  filmLabel: string;
  filmCaption: string;
  whatRule: string;
  whatKinds: string;
  readMore: string;
  howRule: string;
  howKinds: string;
  faqRule: string;
  faqH2: string;
  rentOutTail: string;
  ctaHeading: string;
  ctaBody: string;
  groups: readonly CategoryGroup[];
  steps: readonly Step[];
  faq: readonly QA[];
}

const GROUPS_NB: readonly CategoryGroup[] = [
  {
    label: "FEST & FEIRING",
    meta: "SELSKAP · BRYLLUP · BURSDAG",
    items: [
      {
        title: "Selskapslokale",
        to: "/leie/selskapslokale",
        body: "Bryllup, jubileum, konfirmasjon og fest. Ekte pris for din dato, depositum og vilkår synlig før du booker.",
      },
      {
        title: "Gård og låve",
        to: "/leie/gaard",
        body: "Gårdsbryllup, sommerfest på tunet eller firmatur på landet. Låver og gårdstun med pris og ledig helg synlig.",
      },
      {
        title: "Bursdagslokale",
        to: "/leie/bursdagslokale",
        body: "Barnebursdag eller runde år. Festrom, grendehus og aktivitetslokaler med kjøkken, bookbart med Vipps.",
      },
      {
        title: "Kulturhus og grendehus",
        to: "/leie/kulturhus",
        body: "Konsert, forestilling eller storselskap. Kulturhus, samfunnshus og grendehus med scene og kapasitet oppgitt.",
      },
    ],
  },
  {
    label: "MØTE & ARBEID",
    meta: "MØTE · KONFERANSE · KONTOR",
    items: [
      {
        title: "Møterom",
        to: "/leie/moterom",
        body: "Møte, workshop eller kurs, per time. Kommunale rom, næringsbygg og private, med pris per time synlig.",
      },
      {
        title: "Konferanselokale",
        to: "/leie/konferanselokale",
        body: "Seminar, kurs eller fagdag. Plenumssal og grupperom med kapasitet, AV og servering oppgitt.",
      },
      {
        title: "Kontorlokaler",
        to: "/leie/kontorlokaler",
        body: "Privat kontor på fleksibel leie. Cellekontor og teamkontor med pris, felleskostnader og ledig fra-dato.",
      },
      {
        title: "Coworking",
        to: "/leie/coworking",
        body: "Dagplass eller hot desk uten medlemskap. Kontorfellesskap med dagspris og ledige plasser synlig.",
      },
    ],
  },
  {
    label: "IDRETT & AKTIVITET",
    meta: "HALL · PADEL · SVØMMING",
    items: [
      {
        title: "Idrettshall",
        to: "/leie/idrettshall",
        body: "Trening, turnering eller bursdag i gymsalen. Ledige enkelttimer i hallene, bookbart uten søknad.",
      },
      {
        title: "Padelbane",
        to: "/leie/padelbane",
        body: "Book padelbane per time. Ledige tider i sanntid på tvers av anlegg, med utstyrsleie og Vipps.",
      },
      {
        title: "Svømmehall",
        to: "/leie/svommehall",
        body: "Basseng til bursdag, svømmegruppe eller kurs. Ledige tider utenom klubbtidene, med pris og regler synlig.",
      },
    ],
  },
  {
    label: "HOBBY & KLUBB",
    meta: "HOBBYKLUBB · INTERESSEKLUBB",
    items: [
      {
        title: "Hobbyklubb",
        to: "/leie/hobbyklubb",
        body: "Strikkeklubb, yogagruppe eller brettspillkveld. Fast rom for klubbaktivitet, med pris og ledig ukedag synlig.",
      },
    ],
  },
];

const STEPS_NB: readonly Step[] = [
  {
    step: "01",
    title: "Finn",
    body: "Søk på sted og dato. Du ser grendehus, kulturhus og private selskapslokaler i nærområdet, med ekte priser og hva som faktisk er ledig.",
  },
  {
    step: "02",
    title: "Book",
    body: "Velg ledig tid og book direkte, ingen uforpliktende forespørsel og ingen dager med e-post fram og tilbake. Vilkår, depositum og kapasitet er synlig før du bekrefter.",
  },
  {
    step: "03",
    title: "Betal med Vipps",
    body: "Betal trygt med Vipps eller kort. Bekreftelse og kvittering kommer med en gang. Ingen bankoverføring til en fremmed, ingen usikkerhet.",
  },
];

const FAQ_NB: readonly QA[] = [
  {
    question: "Hvor kan jeg leie lokaler?",
    answer:
      "Du kan leie lokaler på nett gjennom en bookingplattform som Digilist, der du søker på sted og dato og ser hva som faktisk er ledig i sanntid. Digilist samler både private selskapslokaler og kommunale lokaler på ett sted, så du slipper å lete gjennom kommunens sider, Finn-annonser og Facebook-grupper hver for seg.",
  },
  {
    question: "Kan jeg leie både private og kommunale lokaler?",
    answer:
      "Ja. Digilist samler private festlokaler, grendehus og lag- og foreningslokaler sammen med kommunale kulturhus, møterom og idrettshaller i samme kalender. Du sammenligner tilgjengelighet og pris på tvers av private og offentlige utleiere ett sted, i stedet for å kontakte hver enkelt.",
  },
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med type lokale, sted og varighet. Et grendehus kan koste noen hundre til noen tusen kroner for en helg, mens et kulturhus eller selskapslokale ligger høyere. På Digilist ser du den faktiske totalprisen for din dato, inkludert eventuelt depositum og rengjøring, før du booker, så du slipper å gjette.",
  },
  {
    question: "Kan jeg se ledige datoer og booke på nett?",
    answer:
      "Ja. Du søker på sted og dato, ser hva som faktisk er ledig i sanntid, og booker direkte. Ingen uforpliktende forespørsel og ingen venting på svar, du får bekreftelsen med en gang.",
  },
  {
    question: "Hvordan betaler jeg?",
    answer:
      "Du betaler trygt med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt med automatisk frigjøring etter arrangementet. Ingen bankoverføring til en fremmed.",
  },
  {
    question: "Hva slags lokaler finner jeg?",
    answer:
      "Selskapslokaler, møterom, idrettshaller og gymsaler, kulturhus, samfunnshus og grendehus, både kommunale og private. Digilist samler lokalene der du bor på ett sted, så du slipper å lete gjennom kommunens sider, Finn-annonser og Facebook-grupper hver for seg.",
  },
  {
    question: "Er det gratis å bruke Digilist?",
    answer:
      "Ja, det er gratis å søke, sammenligne og booke som privatperson. Du betaler kun leieprisen til utleier. Depositum og eventuelle tilleggstjenester vises tydelig før du bekrefter.",
  },
  {
    question: "Kan jeg avbestille?",
    answer:
      "Avbestillingsvilkårene settes av utleier og vises tydelig på hvert lokale før du booker. Der det er tillatt, kan du avbestille digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for lokalet.",
  },
  {
    question: "Hva er lokaler til leie?",
    answer:
      "Rom du leier for en kveld, en time eller en helg: selskapslokale, møterom, idrettshall, kulturhus eller grendehus. På Digilist ser du pris og ledig dato før du booker, både hos private utleiere og kommuner.",
  },
];

const GROUPS_EN: readonly CategoryGroup[] = [
  {
    label: "PARTIES & CELEBRATIONS",
    meta: "FUNCTIONS · WEDDINGS · BIRTHDAYS",
    items: [
      {
        title: "Function room",
        to: "/leie/selskapslokale",
        body: "Weddings, anniversaries, confirmations and parties. The real price for your date, with the deposit and terms visible before you book.",
      },
      {
        title: "Farm and barn",
        to: "/leie/gaard",
        body: "A farmyard wedding, a summer party in the yard or a company day in the country. Barns and farmyards with the price and free weekends shown.",
      },
      {
        title: "Birthday venue",
        to: "/leie/bursdagslokale",
        body: "A children's party or a milestone birthday. Party rooms, community halls and activity spaces with a kitchen, bookable and paid for online.",
      },
      {
        title: "Cultural and community halls",
        to: "/leie/kulturhus",
        body: "A concert, a performance or a large function. Cultural venues and community halls, with the stage and capacity stated.",
      },
    ],
  },
  {
    label: "MEETINGS & WORK",
    meta: "MEETINGS · CONFERENCES · OFFICES",
    items: [
      {
        title: "Meeting room",
        to: "/leie/moterom",
        body: "A meeting, workshop or course, by the hour. Municipal rooms, commercial buildings and private spaces, with the hourly price shown.",
      },
      {
        title: "Conference venue",
        to: "/leie/konferanselokale",
        body: "A seminar, course or study day. A main hall and breakout rooms, with capacity, AV and catering stated.",
      },
      {
        title: "Office space",
        to: "/leie/kontorlokaler",
        body: "A private office on flexible terms. Single and team offices with the price, service charges and available-from date.",
      },
      {
        title: "Coworking",
        to: "/leie/coworking",
        body: "A day pass or hot desk with no membership. Shared offices with a day rate and free places shown.",
      },
    ],
  },
  {
    label: "SPORT & ACTIVITY",
    meta: "HALLS · PADEL · SWIMMING",
    items: [
      {
        title: "Sports hall",
        to: "/leie/idrettshall",
        body: "Training, a tournament or a birthday party in the gym. Free single hours in the halls, bookable without an application.",
      },
      {
        title: "Padel court",
        to: "/leie/padelbane",
        body: "Book a padel court by the hour. Free times in real time across venues, with equipment hire and payment online.",
      },
      {
        title: "Swimming pool",
        to: "/leie/svommehall",
        body: "A pool for a birthday, a swimming group or a course. Times outside club hours, with the price and rules shown.",
      },
    ],
  },
  {
    label: "HOBBIES & CLUBS",
    meta: "HOBBY CLUBS · INTEREST GROUPS",
    items: [
      {
        title: "Hobby club",
        to: "/leie/hobbyklubb",
        body: "A knitting group, a yoga class or a board-game evening. A regular room for club activity, with the price and free weekday shown.",
      },
    ],
  },
];

const STEPS_EN: readonly Step[] = [
  {
    step: "01",
    title: "Find",
    body: "Search by place and date. You see community halls, cultural venues and private function rooms nearby, with real prices and what is genuinely free.",
  },
  {
    step: "02",
    title: "Book",
    body: "Choose a free time and book directly — no non-binding enquiry and no days of email back and forth. Terms, deposit and capacity are visible before you confirm.",
  },
  {
    step: "03",
    title: "Pay online",
    body: "Pay safely by card or with Vipps, the Norwegian payment app. Confirmation and receipt arrive at once. No bank transfer to a stranger, no uncertainty.",
  },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "Where can I rent a venue?",
    answer:
      "You can rent a venue online through a booking platform such as Digilist, where you search by place and date and see what is genuinely free in real time. Digilist brings private function rooms and municipal venues together in one place, so you do not have to search the municipality's own pages, classified ads and Facebook groups separately.",
  },
  {
    question: "Can I rent both private and municipal venues?",
    answer:
      "Yes. Digilist brings private party venues, community halls and club premises together with municipal cultural venues, meeting rooms and sports halls in the same calendar. You compare availability and price across private and public operators in one place, instead of contacting each one.",
  },
  {
    question: "What does it cost to rent a venue?",
    answer:
      "The price varies a great deal with the type of venue, the location and the duration. A community hall might be a few hundred to a few thousand kroner for a weekend, while a cultural venue or function room sits higher. On Digilist you see the actual total for your date, including any deposit and cleaning, before you book — so there is nothing to guess at.",
  },
  {
    question: "Can I see free dates and book online?",
    answer:
      "Yes. You search by place and date, see what is genuinely free in real time, and book directly. No non-binding enquiry and no waiting for a reply — the confirmation comes at once.",
  },
  {
    question: "How do I pay?",
    answer:
      "You pay safely by card or with Vipps in the same flow as the booking. Where the venue requires a deposit, it is handled digitally and released automatically after the event. No bank transfer to a stranger.",
  },
  {
    question: "What kinds of venues will I find?",
    answer:
      "Function rooms, meeting rooms, sports halls and gyms, cultural venues and community halls, both municipal and private. Digilist gathers the venues where you live in one place, so you do not have to search the municipality's pages, classified ads and Facebook groups separately.",
  },
  {
    question: "Is Digilist free to use?",
    answer:
      "Yes — searching, comparing and booking is free for a private individual. You pay only the rental price to the operator. Any deposit and extras are shown clearly before you confirm.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Cancellation terms are set by the operator and shown clearly on each venue before you book. Where cancellation is allowed you can do it digitally, and any deposit is released automatically under the rules that apply to that venue.",
  },
];

const NB: RentCopy = {
  metaTitle: "Lokaler til leie: finn og book med synlig pris",
  metaDescription:
    "Lokaler til leie på nett: private selskapslokaler og kommunale haller i samme kalender. Ekte pris, ledig dato og Vipps. Fest, møte eller idrett.",
  keywords:
    "lokaler til leie, leie lokaler, selskapslokale, kommunale lokaler, booke lokale",
  howToName: "Slik finner og booker du lokale",
  howToDescription: "Finn, book og betal med Vipps på tre steg via Digilist.",
  rule: "FINN LOKALE",
  h1: "Lokaler til leie,",
  h1em: "der du bor",
  lede:
    "Du leter på kommunens side. Så på Finn. Så i en Facebook-gruppe. På Digilist ligger private og kommunale lokaler i samme kalender. Ekte pris og ledig dato synlig, og du booker med Vipps.",
  definitionH2: "Hva er lokaler til leie?",
  definitionP1:
    "Lokaler til leie er rom du booker for en dato: selskapslokale, møterom, hall, kulturhus, grendehus.",
  definitionP2:
    "På Digilist ligger private og kommunale lokaler i samme kalender, med pris og ledig tid synlig.",
  definitionP3:
    "Du booker og betaler med Vipps, uten e-post og uten å ringe kommunen.",
  ctaFind: "Finn ledige lokaler",
  ctaHow: "Slik funker det",
  rentOutPromptA: "Skal du leie ",
  rentOutPromptEm: "ut",
  rentOutPromptB: " et lokale?",
  rentOutLink: "Se bookingsystem for utleie",
  visualLabel: "DIGILIST · LOKALER",
  filmLabel: "Reklamefilm · Finn lokaler",
  filmCaption: "Kort film om hvordan du finner og booker lokale",
  whatRule: "HVA VIL DU LEIE?",
  whatKinds: "FEIRING · ARBEID · AKTIVITET",
  readMore: "Les mer",
  howRule: "SLIK BOOKER DU",
  howKinds: "FINN · BOOK · BETAL MED VIPPS",
  faqRule: "SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål om lokaler til leie",
  rentOutTail: "Skal du leie ut lokaler?",
  ctaHeading: "Klar til å finne lokalet?",
  ctaBody:
    "Søk blant lokaler i nærområdet, se ekte priser og ledige datoer, og book på minutter med Vipps.",
  groups: GROUPS_NB,
  steps: STEPS_NB,
  faq: FAQ_NB,
};

const EN: RentCopy = {
  metaTitle: "Rent a venue — find and book a function room | Digilist",
  metaDescription:
    "Rent a venue online: private function rooms and municipal venues in one place. See real prices and free dates, and book directly — for a wedding, party, meeting or event.",
  keywords:
    "rent a venue, find a venue, rent a function room, rent a meeting room, party venue hire, birthday venue hire, book a venue online, community hall hire",
  howToName: "How to find and book a venue",
  howToDescription: "Find, book and pay in three steps through Digilist.",
  rule: "FIND A VENUE",
  h1: "Find and book a venue for the party,",
  h1em: "where you live",
  lede:
    "You can rent a venue online through Digilist, a Norwegian booking platform where private function rooms and municipal venues sit in the same calendar. Search by place and date, see real prices and what is genuinely free, and book directly — without enquiries and waiting.",
  definitionH2: "What are venues for rent?",
  definitionP1:
    "Venues for rent are spaces you book for a date: function rooms, meeting rooms, halls, cultural venues, community halls.",
  definitionP2:
    "On Digilist, private and municipal venues sit in the same calendar, with prices and availability shown.",
  definitionP3:
    "You book and pay online, without email exchanges and without calling the council.",
  ctaFind: "Find available venues",
  ctaHow: "How it works",
  rentOutPromptA: "Are you renting a venue ",
  rentOutPromptEm: "out",
  rentOutPromptB: "?",
  rentOutLink: "See the booking system for venue rental",
  visualLabel: "DIGILIST · VENUES",
  filmLabel: "Film · Finding venues",
  filmCaption: "A short film about finding and booking a venue",
  whatRule: "WHAT DO YOU WANT TO RENT?",
  whatKinds: "CELEBRATION · WORK · ACTIVITY",
  readMore: "Read more",
  howRule: "HOW TO BOOK",
  howKinds: "FIND · BOOK · PAY",
  faqRule: "QUESTIONS AND ANSWERS",
  faqH2: "Common questions about renting a venue.",
  rentOutTail: "Do you rent out venues?",
  ctaHeading: "Ready to find the venue?",
  ctaBody:
    "Search venues near you, see real prices and free dates, and book in minutes.",
  groups: GROUPS_EN,
  steps: STEPS_EN,
  faq: FAQ_EN,
};

export function rentCopy(locale: Locale): RentCopy {
  return locale === "en" ? EN : NB;
}
