/**
 * The /leietakertyper page copy. Norwegian only (no EN version).
 *
 * Explains how Digilist lets operators set pricing and rules per renter type
 * (privat, næring, offentlig, visning) rather than negotiating on every booking.
 */

export interface QA {
  question: string;
  answer: string;
}

export interface LeietakertyperCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  rule: string;
  h1: string;
  lede: string;
  whatH2: string;
  whatP1: string;
  whatP2: string;
  whatP3: string;
  whatLinkText: string;
  whatLinkUrl: string;
  fourTypesH2: string;
  fourTypesP1: string;
  fourTypesP2: string;
  fourTypesP3: string;
  fourTypesP4: string;
  fourTypesP5: string;
  researchH2: string;
  researchP1: string;
  researchP2: string;
  notMunicipalH2: string;
  notMunicipalP1: string;
  notMunicipalP2: string;
  sameRuleH2: string;
  sameRuleP1: string;
  sameRuleP2: string;
  sameRuleP3: string;
  faqRule: string;
  faqH2: string;
  faq: readonly QA[];
  ctaDemo: string;
  relatedHeading: string;
  related: readonly { label: string; to: string }[];
}

const FAQ: readonly QA[] = [
  {
    question: "Hva er pris og regler etter type leietaker?",
    answer:
      "Det er at dere setter pris og vilkår per type: privat, næring, offentlig og visning. Systemet bruker dem. Dere bekrefter.",
  },
  {
    question: "Hvilke leietakertyper kan vi ha?",
    answer:
      "Fire: privat, næring, offentlig og visning. Det er utleierens typer. Ikke kommunens prisgrupper.",
  },
  {
    question: "Er forskning, øving eller egne arrangementer en egen leietakertype?",
    answer:
      "Nei. Det er bruk, ikke type. Samme leietaker kan øve én kveld og holde selskap en annen. Reglene følger bruken.",
  },
  {
    question: "Er dette det samme som kommunens prisgrupper?",
    answer:
      "Nei. Kommunens grupper er et annet vedtak. Denne siden er for utleieren som setter egne typer på eget lokale.",
  },
  {
    question: "Kan visning ha andre regler enn en booking?",
    answer:
      "Ja. Visning er egen type. Egen tid. Egne regler. Den tar ikke salen som en vanlig leie.",
  },
  {
    question: "Setter Digilist prisen for lokalet vårt?",
    answer:
      "Nei. Dere setter pris og regler. Digilist viser dem til leietaker og logger hvem som fikk hva.",
  },
];

const NB: LeietakertyperCopy = {
  metaTitle: "Pris og regler etter type leietaker | Digilist",
  metaDescription:
    "Samme sal. Ulike leietakere. Dere setter pris og regler for privat, næring, offentlig og visning. Systemet bruker dem. Dere bekrefter.",
  keywords:
    "leietakertyper, pris per leietaker, regler per leietaker, privat næring offentlig visning, bookingsystem prissetting",
  rule: "LEIETAKERTYPER · 2026",
  h1: "Pris og regler etter type leietaker",
  lede:
    "Lørdag. Samme sal. En familie vil ha bursdag. Et firma vil ha kickoff. En skole vil ha møte. Noen vil bare se rommet først.\n\nPris og regler etter type leietaker betyr at dere setter én regel per type. Privat, næring, offentlig og visning. Systemet bruker den. Dere bekrefter.",
  whatH2: "Hva er pris og regler etter type leietaker?",
  whatP1:
    "Det er at prisen og vilkårene følger hvem som leier. Ikke en rabatt dere skriver i e-posten etterpå.",
  whatP2:
    "Leietaker ser det som gjelder for hen, før hen sender. Depositum, godkjenning, visningstid. Samme type, samme regel. Neste gang også.",
  whatP3: "Dere setter regelen. Systemet viser den. Det fatter ikke vedtaket.",
  whatLinkText: "bookingsystem for utleie av lokaler",
  whatLinkUrl: "/bookingsystem-utleie",
  fourTypesH2: "Fire typer. Ikke fem.",
  fourTypesP1:
    "Privat. Familie, bursdag, en kveld. Ofte depositum. Ofte godkjenning først.",
  fourTypesP2:
    "Næring. Firma, kurs, kommersiell bruk. Andre vilkår enn privat. Ofte annen faktura.",
  fourTypesP3:
    "Offentlig. Skole, etat, annen offentlig virksomhet som leier hos dere. Ikke kommunens egne prisgrupper. Det er hen som leier.",
  fourTypesP4:
    "Visning. Hen vil se lokalet før hen booker. Egen tid. Egne regler. Ikke en vanlig leie.",
  fourTypesP5: "Fire typer er nok. Dere trenger ikke en femte rad for hvert unntak.",
  researchH2: "Forskning, øving og egne arrangementer er bruk. Ikke type.",
  researchP1:
    "Samme leietaker kan øve én kveld og holde selskap en annen. Det er to bruk. Ikke to leietakertyper.",
  researchP2:
    "Forskning, øving og egne arrangementer får egne regler per bruk. De er ikke en femte type ved siden av privat, næring, offentlig og visning.\n\nRegelen sitter på bruken. Kalenderen viser ledig og opptatt som før.",
  notMunicipalH2: "Dette er ikke kommunens prisgrupper",
  notMunicipalP1:
    "Kommunen som eier salen har ofte egne grupper: lag, intern bruk, kommersiell. Det er et annet vedtak. En annen side.",
  notMunicipalP2:
    "Denne siden er for utleieren. Dere eier lokalet, eller leier det ut. Dere velger typene. Dere eier reglene.",
  sameRuleH2: "Samme regel. Synlig logg.",
  sameRuleP1:
    "Når typen er satt, trenger dere ikke forhandle prisen på nytt hver lørdag. Hen som booker privat, får privat. Hen som booker næring, får næring.",
  sameRuleP2:
    "Endringen ligger i loggen. Hvem som fikk hvilken regel. Når. Det er kontroll, ikke et regneark bare dere har sett.",
  sameRuleP3: "Dere kan fortsatt si nei. Godkjenning før bekreftelse ligger hos dere.",
  faqRule: "SPØRSMÅL OG SVAR",
  faqH2: "Vanlige spørsmål",
  faq: FAQ,
  ctaDemo: "Book en demo",
  relatedHeading: "Se også",
  related: [
    { label: "Bookingsystem for utleie av lokaler", to: "/bookingsystem-utleie" },
    { label: "Priser", to: "/priser" },
  ],
};

export function leietakertyperCopy(): LeietakertyperCopy {
  return NB;
}
