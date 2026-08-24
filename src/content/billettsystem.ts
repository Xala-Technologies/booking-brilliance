/**
 * The /billettsystem page copy, in both languages.
 *
 * Norwegian ticket categories do not map cleanly. "Honnør" is a statutory
 * concession rate for people over 67 and certain disability groups — there is
 * no single English word for it, and "senior" would quietly narrow who
 * qualifies. The English says "concession", which is the right level of
 * generality for a page listing what ticket types you CAN create.
 *
 * "Oppgjør" is "settlement" — the money reaching the organiser's account —
 * not "payment", which is what the buyer does. The page describes both in
 * adjacent sentences, so keeping them distinct matters.
 */
import type { Locale } from "@/lib/i18n";

export interface Feature {
  title: string;
  body: string;
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

export interface TicketCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  howToName: string;
  howToDescription: string;
  rule: string;
  h1: string;
  h1em: string;
  lede: string;
  ctaDemo: string;
  ctaOpen: string;
  visualLabel: string;
  filmLabel: string;
  filmCaption: string;
  whatRule: string;
  whatKinds: string;
  howRule: string;
  howKinds: string;
  faqRule: string;
  ctaHeading: string;
  ctaBody: string;
  features: readonly Feature[];
  steps: readonly Step[];
  faq: readonly QA[];
}

const FEATURES_NB: readonly Feature[] = [
  {
    title: "Billettsalg i sanntid",
    body: "Opprett flere billettyper med hver sin pris, kvote og salgsperiode: ordinær, honnør, barn, student eller VIP. Beholdningen oppdateres i sanntid, så du aldri selger mer enn kapasiteten.",
  },
  {
    title: "Rabattkoder",
    body: "Lag rabattkoder med fast beløp eller prosent, med tak på antall bruk og gyldighetsperiode. Perfekt for tidligfugl, medlemspriser eller samarbeidspartnere.",
  },
  {
    title: "Kuponger og kampanjer",
    body: "Kjør kampanjer med kuponger som gjelder utvalgte billettyper eller hele arrangementet. Sett start og slutt, og se effekten på salget mens kampanjen løper.",
  },
  {
    title: "Gavekort",
    body: "Selg og løs inn gavekort som kan brukes på billetter og booking. Saldo og gyldighet håndteres digitalt, og gjenstående beløp følger med til neste kjøp.",
  },
  {
    title: "Betaling med Vipps og kort",
    body: "Kjøperen betaler med Vipps eller kort i samme flyt, og får billetten med en gang. Ingen konto er nødvendig for å kjøpe, og kvittering sendes automatisk.",
  },
  {
    title: "QR-billett og skanning",
    body: "Hver billett får en unik QR-kode. Ved inngangen skanner du den fra mobilen, og billetten merkes som brukt med en gang, slik at den ikke kan gå igjen.",
  },
  {
    title: "Salg og oversikt live",
    body: "Følg solgte billetter, omsetning, rabattbruk og innsjekk i sanntid. Eksporter deltakerlister og se hvilke kanaler som faktisk selger.",
  },
  {
    title: "Oppgjør og regnskap",
    body: "Oppgjør utbetales til arrangøren, og bilag følger med til regnskapet, med EHF-fakturagrunnlag der det trengs. Full sporbarhet på hver transaksjon.",
  },
  {
    title: "Refusjon og ombooking",
    body: "Håndter avlysning, refusjon og navnebytte digitalt etter reglene du selv setter. Kjøperen får beskjed automatisk, og oppgjøret justeres.",
  },
];

const STEPS_NB: readonly Step[] = [
  {
    step: "01",
    title: "Opprett arrangementet",
    body: "Legg inn dato, sted og kapasitet, og sett opp billettypene dine med pris, kvote og salgsperiode. Alt på ett sted, uten oppsett hos en ekstern billettleverandør.",
  },
  {
    step: "02",
    title: "Sett opp rabatter og gavekort",
    body: "Lag rabattkoder, kuponger og kampanjer, og aktiver gavekort. Bestem hvem som gjelder for hva, hvor lenge, og hvor mange ganger koden kan brukes.",
  },
  {
    step: "03",
    title: "Del og selg",
    body: "Del salgslenken på nett, i sosiale medier eller på plakat. Kjøperen betaler med Vipps eller kort og får QR-billetten med en gang. Salget oppdateres i sanntid.",
  },
  {
    step: "04",
    title: "Skann ved inngangen",
    body: "Skann QR-koden fra mobilen ved døra. Billetten merkes som brukt umiddelbart, og du ser innsjekk og fyllingsgrad live gjennom hele arrangementet.",
  },
];

const FAQ_NB: readonly QA[] = [
  {
    question: "Hva slags arrangementer passer billettsystemet for?",
    answer:
      "Konserter, forestillinger, konferanser, kurs, festivaler, idrettsarrangementer og lukkede selskaper. Du kan selge til åpne arrangementer med mange billettyper eller til et lukket arrangement med et fast antall plasser. Billettsystemet henger sammen med booking av lokalet, så arrangement og lokale kan håndteres i samme plattform.",
  },
  {
    question: "Hvordan fungerer rabattkoder og kuponger?",
    answer:
      "Du lager rabattkoder med enten et fast beløp eller en prosent, og setter gyldighetsperiode og maks antall bruk. Kuponger kan knyttes til bestemte billettyper eller hele arrangementet, og du kan kjøre tidsbegrensede kampanjer. Kjøperen legger inn koden i kassen, og rabatten trekkes fra med en gang.",
  },
  {
    question: "Kan jeg selge og løse inn gavekort?",
    answer:
      "Ja. Gavekort selges digitalt og kan brukes til å betale for billetter og booking. Saldoen håndteres i systemet, og hvis kjøpet er mindre enn gavekortets verdi, følger restbeløpet med til neste gang. Gyldighet og saldo er synlig for både kjøper og arrangør.",
  },
  {
    question: "Hvordan betaler kjøperen, og når får jeg oppgjør?",
    answer:
      "Kjøperen betaler med Vipps eller kort i samme flyt som billettkjøpet, og får billetten og kvitteringen med en gang. Oppgjøret utbetales til arrangøren etter avtalte vilkår, med bilag og EHF-fakturagrunnlag til regnskapet. Du har full oversikt over transaksjoner og omsetning underveis.",
  },
  {
    question: "Hvordan sjekker jeg inn gjester ved inngangen?",
    answer:
      "Hver billett har en unik QR-kode. Ved inngangen skanner du koden fra kjøperens mobil, og billetten merkes som brukt umiddelbart, slik at den samme billetten ikke kan brukes to ganger. Du ser innsjekk og fyllingsgrad live mens arrangementet pågår.",
  },
  {
    question: "Kan jeg refundere billetter hvis noe avlyses?",
    answer:
      "Ja. Du setter reglene for refusjon, ombooking og navnebytte selv, og håndterer det digitalt. Ved avlysning kan du refundere samlet, og kjøperne får beskjed automatisk. Oppgjøret justeres etter refusjonene som er gjort.",
  },
];

const FEATURES_EN: readonly Feature[] = [
  {
    title: "Ticket sales in real time",
    body: "Create several ticket types, each with its own price, quota and sales period: standard, concession, child, student or VIP. Stock updates in real time, so you never sell beyond capacity.",
  },
  {
    title: "Discount codes",
    body: "Create discount codes for a fixed amount or a percentage, with a cap on uses and a validity period. Ideal for early birds, member rates or partners.",
  },
  {
    title: "Coupons and campaigns",
    body: "Run campaigns with coupons that apply to selected ticket types or to the whole event. Set a start and an end, and watch the effect on sales while the campaign runs.",
  },
  {
    title: "Gift cards",
    body: "Sell and redeem gift cards that work for both tickets and bookings. Balance and validity are handled digitally, and any remaining amount carries over to the next purchase.",
  },
  {
    title: "Payment by card and Vipps",
    body: "The buyer pays by card or with Vipps, the Norwegian payment app, in the same flow, and gets the ticket immediately. No account is needed to buy, and the receipt is sent automatically.",
  },
  {
    title: "QR tickets and scanning",
    body: "Every ticket gets a unique QR code. At the door you scan it from the buyer's phone, and the ticket is marked as used at once, so it cannot be reused.",
  },
  {
    title: "Sales and overview, live",
    body: "Follow tickets sold, revenue, discount use and check-ins in real time. Export attendee lists and see which channels actually sell.",
  },
  {
    title: "Settlement and accounting",
    body: "Settlement is paid out to the organiser, with vouchers passed through to accounting and EHF invoicing data where it is needed. Full traceability on every transaction.",
  },
  {
    title: "Refunds and rebooking",
    body: "Handle cancellation, refunds and name changes digitally, under rules you set yourself. The buyer is notified automatically, and the settlement is adjusted.",
  },
];

const STEPS_EN: readonly Step[] = [
  {
    step: "01",
    title: "Create the event",
    body: "Enter the date, place and capacity, and set up your ticket types with price, quota and sales period. All in one place, with no setup at an external ticketing provider.",
  },
  {
    step: "02",
    title: "Set up discounts and gift cards",
    body: "Create discount codes, coupons and campaigns, and switch on gift cards. Decide who each applies to, for how long, and how many times a code can be used.",
  },
  {
    step: "03",
    title: "Share and sell",
    body: "Share the sales link online, on social media or on a poster. The buyer pays by card or Vipps and gets the QR ticket immediately. Sales update in real time.",
  },
  {
    step: "04",
    title: "Scan at the door",
    body: "Scan the QR code from the phone at the door. The ticket is marked as used at once, and you see check-ins and how full the room is throughout the event.",
  },
];

const FAQ_EN: readonly QA[] = [
  {
    question: "What kinds of events does the ticketing system suit?",
    answer:
      "Concerts, performances, conferences, courses, festivals, sporting events and private functions. You can sell to open events with many ticket types, or to a closed event with a fixed number of places. Ticketing is joined up with booking the venue, so the event and the room are handled in the same platform.",
  },
  {
    question: "How do discount codes and coupons work?",
    answer:
      "You create discount codes for either a fixed amount or a percentage, and set a validity period and a maximum number of uses. Coupons can be tied to particular ticket types or to the whole event, and you can run time-limited campaigns. The buyer enters the code at checkout and the discount comes off immediately.",
  },
  {
    question: "Can I sell and redeem gift cards?",
    answer:
      "Yes. Gift cards are sold digitally and can be used to pay for tickets and bookings. The balance is handled in the system, and if the purchase is less than the value of the card, the remainder carries over to next time. Validity and balance are visible to both the buyer and the organiser.",
  },
  {
    question: "How does the buyer pay, and when do I get settled?",
    answer:
      "The buyer pays by card or Vipps in the same flow as the ticket purchase, and gets the ticket and receipt immediately. Settlement is paid out to the organiser on agreed terms, with vouchers and EHF invoicing data for the accounts. You have a full view of transactions and revenue as you go.",
  },
  {
    question: "How do I check guests in at the door?",
    answer:
      "Every ticket has a unique QR code. At the door you scan the code from the buyer's phone, and the ticket is marked as used immediately, so the same ticket cannot be used twice. You see check-ins and how full the room is live while the event runs.",
  },
  {
    question: "Can I refund tickets if something is cancelled?",
    answer:
      "Yes. You set the rules for refunds, rebooking and name changes yourself, and handle it all digitally. If an event is cancelled you can refund everyone at once, and buyers are notified automatically. The settlement is adjusted for the refunds made.",
  },
];

const NB: TicketCopy = {
  metaTitle: "Billettsystem: selg billetter med rabatt | Digilist",
  metaDescription:
    "Digilist billettsystem: selg billetter til arrangementet med rabattkoder, kuponger og gavekort. Vipps og kort, QR-billett, skanning ved inngang og oppgjør. Sanntid.",
  keywords:
    "billettsystem, selge billetter, billettsystem arrangement, rabattkoder billetter, kuponger, gavekort, billettsalg vipps, qr-billett, billettsystem norge",
  howToName: "Slik selger du billetter med Digilist",
  howToDescription:
    "Opprett arrangement, sett opp billetter og rabatter, selg med Vipps, og skann ved inngangen.",
  rule: "BILLETTSYSTEM",
  h1: "Selg billetter til arrangementet,",
  h1em: "med rabatt, kupong og gavekort",
  lede:
    "Digilist billettsystem lar deg selge billetter med rabattkoder, kuponger og gavekort, ta betalt med Vipps og kort, og skanne QR-billetter ved inngangen. Alt sammen med booking av lokalet i samme plattform.",
  ctaDemo: "Book demo",
  ctaOpen: "Åpne plattformen",
  visualLabel: "DIGILIST · BILLETTSYSTEM",
  filmLabel: "Reklamefilm · Billettsystem",
  filmCaption: "Kort film om billettsalg med Digilist",
  whatRule: "HVA DU KAN GJØRE",
  whatKinds: "BILLETTER · RABATT · KUPONG · GAVEKORT",
  howRule: "SLIK FUNKER DET",
  howKinds: "OPPRETT · SELG · SKANN",
  faqRule: "OFTE STILTE SPØRSMÅL",
  ctaHeading: "Klar til å selge billetter?",
  ctaBody:
    "Book en demo, så viser vi hvordan billetter, rabattkoder, kuponger og gavekort settes opp for ditt arrangement, med booking av lokalet i samme plattform.",
  features: FEATURES_NB,
  steps: STEPS_NB,
  faq: FAQ_NB,
};

const EN: TicketCopy = {
  metaTitle: "Ticketing system: sell tickets with discounts | Digilist",
  metaDescription:
    "Sell tickets with discount codes, coupons and gift cards. Card and Vipps payment, QR tickets, scanning at the door and settlement — in real time.",
  keywords:
    "ticketing system, sell tickets, event ticketing, discount codes tickets, coupons, gift cards, qr ticket, ticketing norway",
  howToName: "How to sell tickets with Digilist",
  howToDescription:
    "Create the event, set up tickets and discounts, sell online, and scan at the door.",
  rule: "TICKETING",
  h1: "Sell tickets to your event,",
  h1em: "with discounts, coupons and gift cards",
  lede:
    "The Digilist ticketing system lets you sell tickets with discount codes, coupons and gift cards, take payment by card and Vipps, and scan QR tickets at the door. All alongside booking the venue itself, in the same platform.",
  ctaDemo: "Book a demo",
  ctaOpen: "Open the platform",
  visualLabel: "DIGILIST · TICKETING",
  filmLabel: "Film · Ticketing",
  filmCaption: "A short film about selling tickets with Digilist",
  whatRule: "WHAT YOU CAN DO",
  whatKinds: "TICKETS · DISCOUNTS · COUPONS · GIFT CARDS",
  howRule: "HOW IT WORKS",
  howKinds: "CREATE · SELL · SCAN",
  faqRule: "FREQUENTLY ASKED QUESTIONS",
  ctaHeading: "Ready to sell tickets?",
  ctaBody:
    "Book a demo and we will show how tickets, discount codes, coupons and gift cards are set up for your event, with booking of the venue in the same platform.",
  features: FEATURES_EN,
  steps: STEPS_EN,
  faq: FAQ_EN,
};

export function ticketCopy(locale: Locale): TicketCopy {
  return locale === "en" ? EN : NB;
}
