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
