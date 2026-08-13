/**
 * FAQ banks for the two calculator tools, in both languages.
 *
 * Separate from `lib/copy.ts` for the same reason the other content modules
 * are: these are answers with their own sentence shape, and they feed the
 * FAQPage JSON-LD as well as the visible accordion.
 *
 * The figures (m² per person, the 15–25% allowance) are identical in both
 * languages because they are measurements, not phrasing. What changes is the
 * vocabulary around them — a Norwegian reader knows what a "selskapslokale"
 * is; an English one needs "function room".
 */
import type { Locale } from "@/lib/i18n";

export interface QA {
  question: string;
  answer: string;
}

const CAPACITY_NB: readonly QA[] = [
  {
    question: "Hvor stort lokale trenger jeg per gjest?",
    answer:
      "Det avhenger av oppsettet. Til en sittende middag med runde bord regner man vanligvis 1,5–2,0 m² per gjest, til mingling og stående mottakelse 0,8–1,0 m², til klasserom/kurs 2,0–2,5 m², og til kino/teater med stolrader 0,8–1,2 m². Kalkulatoren ganger antall gjester med disse standard-tallene og gir et anbefalt areal.",
  },
  {
    question: "Er arealtallene eksakte?",
    answer:
      "Nei, det er standard planleggingstall for å gi en pekepinn. Faktisk behov varierer med bord- og stoltyper, dansegulv, scene, buffé, garderobe, rømningsveier og bevegelsesareal. Legg gjerne på litt margin, og se alltid lokalets oppgitte kapasitet før du booker.",
  },
  {
    question: "Hvilke lokaltyper passer til antallet mitt?",
    answer:
      "Kalkulatoren foreslår lokaltyper hvis oppgitte kapasitet passer gjesteantallet ditt – for eksempel møterom for små grupper, selskapslokaler for 30–150 gjester, og kulturhus/storsaler for store arrangementer. Hver type lenker videre til ledige lokaler på Digilist.",
  },
  {
    question: "Bør jeg regne inn plass til dansegulv og buffé?",
    answer:
      "Ja. Skal du ha dansegulv, scene, buffébord eller bar, trenger du mer areal enn ren bordplass. En tommelfingerregel er å legge til 15–25 % ekstra for slike soner. Velg gjerne et lokale i øvre del av det anbefalte intervallet hvis programmet er variert.",
  },
];

const CAPACITY_EN: readonly QA[] = [
  {
    question: "How much space do I need per guest?",
    answer:
      "It depends on the layout. A seated dinner with round tables usually needs 1.5–2.0 m² per guest; a standing reception 0.8–1.0 m²; a classroom or training setup 2.0–2.5 m²; and theatre style with rows of chairs 0.8–1.2 m². The calculator multiplies your guest count by these standard figures and gives a recommended area.",
  },
  {
    question: "Are the area figures exact?",
    answer:
      "No — they are standard planning figures meant to give you a sense of scale. The real requirement varies with table and chair types, a dance floor, a stage, a buffet, a cloakroom, escape routes and circulation space. Allow yourself some margin, and always check the venue's stated capacity before you book.",
  },
  {
    question: "Which venue types suit my guest count?",
    answer:
      "The calculator suggests venue types whose stated capacity fits your number — meeting rooms for small groups, function rooms for 30–150 guests, and cultural venues or large halls for bigger events. Each type links on to available venues on Digilist.",
  },
  {
    question: "Should I allow space for a dance floor and buffet?",
    answer:
      "Yes. A dance floor, stage, buffet tables or a bar all need more room than table space alone. A rule of thumb is to add 15–25% for those zones. If your programme is varied, choose a venue towards the upper end of the recommended range.",
  },
];

export function capacityFaq(locale: Locale): readonly QA[] {
  return locale === "en" ? CAPACITY_EN : CAPACITY_NB;
}

const PRICE_NB: readonly QA[] = [
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med lokaltype, sted, kapasitet, ukedag og sesong. Som grove pekepinner ligger grendehus og foreningslokaler ofte på 1 000–5 000 kr per dag, selskaps- og festlokaler på 5 000–30 000 kr, møterom fra noen hundre kroner, og kulturhus og storsaler høyere. Denne kalkulatoren gir et estimert intervall basert på disse pekepinnene – den faktiske prisen ser du på det enkelte lokalet.",
  },
  {
    question: "Er estimatet et bindende tilbud?",
    answer:
      "Nei. Kalkulatoren gir kun et veiledende prisintervall for å hjelpe deg å budsjettere. Faktisk pris settes av den enkelte utleier og avhenger av lokalet, tidspunktet og eventuelle tilleggstjenester. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
  },
  {
    question: "Hva påvirker prisen mest?",
    answer:
      "Lokaltype og størrelse betyr mest, deretter sted (sentrale strøk i de største byene er dyrest), ukedag (lørdager i høysesong koster mest) og sesong (mai–september er høysesong for fester og bryllup). Tilleggstjenester som rengjøring, bemanning, AV-utstyr og catering kommer ofte i tillegg til grunnleien.",
  },
  {
    question: "Kan jeg leie både private og kommunale lokaler?",
    answer:
      "Ja. Mange grendehus, kulturhus og kommunale lokaler leies ut til private arrangementer, ofte rimeligere enn rene selskapslokaler. På Digilist ligger private og kommunale lokaler i samme kalender, så du kan sammenligne pris og tilgjengelighet på ett sted.",
  },
];

/**
 * The English price FAQ.
 *
 * The figures stay in Norwegian kroner and are not converted. A price range is
 * a fact about this market; showing it in euros would invent an exchange rate
 * we do not quote in and would misstate what a visitor actually pays.
 */
const PRICE_EN: readonly QA[] = [
  {
    question: "What does it cost to rent a venue?",
    answer:
      "The price varies a great deal with venue type, location, capacity, day of the week and season. As rough guides, community halls are often NOK 1,000–5,000 per day, function and party venues NOK 5,000–30,000, meeting rooms from a few hundred kroner, and cultural venues and large halls higher. This calculator gives an estimated range based on those guides — the actual price is shown on each individual venue.",
  },
  {
    question: "Is the estimate a binding quote?",
    answer:
      "No. The calculator gives an indicative price range to help you budget. The actual price is set by each operator and depends on the venue, the timing and any additional services. On Digilist you see the total price for your date, including any deposit, before you book.",
  },
  {
    question: "What affects the price most?",
    answer:
      "Venue type and size matter most, then location (central areas of the largest cities are the most expensive), day of the week (Saturdays in high season cost the most) and season (May to September is high season for parties and weddings). Additional services such as cleaning, staffing, AV equipment and catering usually come on top of the base rent.",
  },
  {
    question: "Can I rent both private and municipal venues?",
    answer:
      "Yes. Many community halls, cultural venues and municipal premises are rented out for private events, often more cheaply than dedicated function rooms. On Digilist, private and municipal venues sit in the same calendar, so you can compare price and availability in one place.",
  },
];

export function priceFaq(locale: Locale): readonly QA[] {
  return locale === "en" ? PRICE_EN : PRICE_NB;
}

const TOOLS_NB: readonly QA[] = [
  {
    question: "Er verktøyene gratis?",
    answer:
      "Ja. Alle verktøyene på Digilist er gratis å bruke, uten innlogging. De gir veiledende estimater for å hjelpe deg å planlegge og budsjettere et arrangement.",
  },
  {
    question: "Gir verktøyene bindende priser?",
    answer:
      "Nei. Verktøyene gir veiledende pekepinner basert på typiske tall i det norske utleiemarkedet. Faktisk pris og kapasitet ser du på det enkelte lokalet på Digilist.",
  },
];

const TOOLS_EN: readonly QA[] = [
  {
    question: "Are the tools free?",
    answer:
      "Yes. Every tool on Digilist is free to use, with no sign-in. They give indicative estimates to help you plan and budget an event.",
  },
  {
    question: "Do the tools give binding prices?",
    answer:
      "No. The tools give indicative guides based on typical figures in the Norwegian rental market. The actual price and capacity are shown on each individual venue on Digilist.",
  },
];

export function toolsFaq(locale: Locale): readonly QA[] {
  return locale === "en" ? TOOLS_EN : TOOLS_NB;
}
