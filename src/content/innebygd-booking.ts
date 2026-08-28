/**
 * The /innebygd-booking page copy, Norwegian only.
 *
 * Embedded booking is when the Digilist calendar or full booking flow sits on
 * the venue's existing website. Norwegian first, as this is a marketing page
 * targeting Norwegian venue operators.
 */
import type { Locale } from "@/lib/i18n";

export interface QA {
  question: string;
  answer: string;
}

export interface EmbeddedBookingCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  description: string;
  ledeA: string;
  ledeB: string;
  whatIsH2: string;
  whatIsP1: string;
  whatIsP2: string;
  whatIsP3: string;
  whatIsP4: string;
  whatIsLinkText: string;
  whatIsLinkUrl: string;
  administrationH2: string;
  administrationP1: string;
  administrationP2: string;
  administrationP3: string;
  administrationLinkText: string;
  administrationLinkUrl: string;
  notChannelSyncH2: string;
  notChannelSyncP1: string;
  notChannelSyncP2: string;
  canShowOnDigilistH2: string;
  canShowOnDigilistP1: string;
  canShowOnDigilistP2: string;
  canShowOnDigilistLinkText: string;
  canShowOnDigilistLinkUrl: string;
  faqH2: string;
  faq: readonly QA[];
  ctaDemo: string;
  relatedLinks: readonly { label: string; url: string }[];
}

const FAQ_NB: readonly QA[] = [
  {
    question: "Kan vi ha innebygd booking på egen nettside?",
    answer:
      "Ja. Innebygd booking ligger på nettsiden dere allerede har. Leietaker ser samme ledig og opptatt som dere.",
  },
  {
    question: "Kan vi ha booking på nettsiden vår?",
    answer:
      "Ja. Booking på nettsiden er innebygd booking. Hen booker hos dere. Dere styrer i Digilist.",
  },
  {
    question: "Må leietaker booke på Digilist?",
    answer:
      "Nei. Hen kan booke på deres nettside. Administrasjonen av bookingen blir i Digilist.",
  },
  {
    question: "Hva er forskjellen på innebygd booking og kanalsynk?",
    answer:
      "Innebygd booking er kalenderen på deres egen nettside. Kanalsynk er når andre markedsplasser skriver til samme kalender.",
  },
  {
    question: "Kan lokalet også vises på Digilist?",
    answer:
      "Ja. Samme kalender kan ligge på deres side og på Digilist. Ledig er ledig begge steder.",
  },
  {
    question: "Hvem administrerer bookingen når den ligger på nettsiden vår?",
    answer:
      "Dere. Godkjenning, husregler, faktura og logg ligger i Digilist. Nettsiden viser det samme.",
  },
];

const NB: EmbeddedBookingCopy = {
  metaTitle: "Innebygd booking på egen nettside | Digilist",
  metaDescription:
    "Innebygd booking på egen nettside: kalenderen, eller hele bookingmotoren, hos dere. Administrasjonen blir i Digilist. Lokalet kan også vises på Digilist.",
  keywords:
    "innebygd booking, booking på egen nettside, kalender på nettside, booking widget, embedded booking",
  h1: "Innebygd booking på egen nettside",
  description:
    "Innebygd booking på egen nettside: kalenderen, eller hele bookingmotoren, hos dere. Administrasjonen blir i Digilist. Lokalet kan også vises på Digilist.",
  ledeA:
    "Dere har allerede en nettside. Folk forlater den for å booke. Eller de ringer.",
  ledeB:
    "Innebygd booking er booking på nettsiden dere har. Kalenderen, eller hele bookingmotoren, ligger der. Administrasjonen blir i Digilist.",
  whatIsH2: "Hva er innebygd booking?",
  whatIsP1:
    "Innebygd booking er at folk booker der de allerede er. På deres nettside.",
  whatIsP2:
    "Dere kan legge inn bare kalenderen. Eller hele flyten: ledig tid, forespørsel, betaling. Det er samme kalender som i Digilist. Ikke et bilde av i går.",
  whatIsP3:
    "Dere lager ikke en ny side. Dere kobler bookingen til den dere har.",
  whatIsP4: "",
  whatIsLinkText: "bookingsystem for utleie av lokaler",
  whatIsLinkUrl: "/bookingsystem-utleie",
  administrationH2: "Administrasjonen blir i Digilist",
  administrationP1:
    "Godkjenning, husregler, faktura og logg ligger hos dere i Digilist. Nettsiden viser det samme.",
  administrationP2:
    "Leietaker trenger ikke en ny konto hos noen andre for å se ledig tid. Hen sender der hen står. Dere bekrefter i Digilist, hvis dere vil godkjenne først.",
  administrationP3:
    "Systemet viser ledig og opptatt. Det fatter ikke vedtaket.",
  administrationLinkText: "bookingsystem for utleie av lokaler",
  administrationLinkUrl: "/bookingsystem-utleie",
  notChannelSyncH2: "Dette er ikke kanalsynk",
  notChannelSyncP1:
    "Kanalsynk er når lokalet også bookes på andre markedsplasser, og kalenderen skrives begge veier.",
  notChannelSyncP2:
    "Innebygd booking er deres egen nettside. Folk blir hos dere. Det er en annen jobb.",
  canShowOnDigilistH2: "Lokalet kan også vises på Digilist",
  canShowOnDigilistP1:
    "Dere kan vise lokalet på lokaler til leie samtidig. Samme kalender. Samme ledig og opptatt.",
  canShowOnDigilistP2:
    "Da finner folk dere både på deres side og der de leter etter lokale. Dere administrerer ett sted.",
  canShowOnDigilistLinkText: "lokaler til leie",
  canShowOnDigilistLinkUrl: "/lokaler-til-leie",
  faqH2: "Vanlige spørsmål",
  faq: FAQ_NB,
  ctaDemo: "Book en demo",
  relatedLinks: [
    { label: "Bookingsystem for utleie", url: "/bookingsystem-utleie" },
    { label: "Lokaler til leie", url: "/lokaler-til-leie" },
    { label: "Priser", url: "/priser" },
  ],
};

export function embeddedBookingCopy(locale: Locale): EmbeddedBookingCopy {
  return NB;
}
