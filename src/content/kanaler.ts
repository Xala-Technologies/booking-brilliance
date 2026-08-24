/**
 * The /kanaler page copy, in both languages.
 *
 * Channel names (Airbnb, Booking.com, Bookup, Eventum, Finn) stay as they are
 * — they are the products themselves, and an operator recognises them by name
 * in any language. Finn is Norway's dominant classifieds site and is glossed on
 * first use in English, because to an outside reader it is just a word.
 *
 * "Toveis synk" is rendered "two-way sync" rather than the literal
 * "bidirectional": this page is read by people who run venues, not by
 * integration engineers, and the plainer phrase is the one they use.
 */
import type { Locale } from "@/lib/i18n";

export interface Step {
  title: string;
  body: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface ChannelsCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  rule: string;
  h1: string;
  h1em: string;
  ledeA: string;
  ledeStrong: string;
  ledeB: string;
  ctaDemo: string;
  ctaOpen: string;
  yourChannels: string;
  allSources: string;
  specs: readonly Spec[];
  syncRule: string;
  syncH2: string;
  syncH2em: string;
  syncLede: string;
  importRule: string;
  importH2: string;
  importH2em: string;
  importLede: string;
  faqRule: string;
  faqLede: string;
  benefits: readonly string[];
  steps: readonly Step[];
  faq: readonly QA[];
}

const NB: ChannelsCopy = {
  metaTitle: "Kanaler & synk · Digilist | Toveis kalendersynk og AI-import",
  metaDescription:
    "Koble Airbnb, Booking.com, Bookup, Eventum og Finn til Digilist. Toveis kalendersynk i sanntid og AI-import av oppføringene dine – behold begge plattformer.",
  keywords:
    "kanalsynk, channel manager, kalendersynk, importere oppføring airbnb, importere finn, toveis synk booking, unngå dobbeltbooking",
  rule: "KANALER · TOVEIS SYNK",
  h1: "Én kalender.",
  h1em: "alle kanaler",
  ledeA: "Har du lokaler på Airbnb, Booking.com, Bookup eller Eventum? Koble dem til Digilist én gang, så holdes kalender og tilgjengelighet i ",
  ledeStrong: "toveis synk automatisk",
  ledeB: " – og la AI-agenten importere oppføringene dine til ferdige utkast. Ingen dobbeltarbeid, ingen dobbeltbookinger, og du beholder kanalene du allerede tjener på.",
  ctaDemo: "Book en demo",
  ctaOpen: "Åpne plattformen",
  yourChannels: "Dine kanaler",
  allSources: "+ alle kilder",
  specs: [
    { label: "Synk", value: "Toveis · sanntid" },
    { label: "Kanaler", value: "Airbnb · Booking.com · +" },
    { label: "Kalender", value: "iCal · CalDAV · Outlook" },
    { label: "Import", value: "AI-agent · lenke" },
    { label: "Admin", value: "Én for alle" },
  ],
  syncRule: "I. TOVEIS SYNK",
  syncH2: "Koble til én gang.",
  syncH2em: "alltid oppdatert",
  syncLede:
    "Kalender, priser og tilgjengelighet holdes i sync begge veier — uten manuelt vedlikehold.",
  importRule: "II. AI-AGENT · IMPORT",
  importH2: "La agenten flytte",
  importH2em: "oppføringene dine",
  importLede:
    "Slipp å taste inn alt på nytt – agenten bygger utkastet for deg.",
  faqRule: "III. SPØRSMÅL OG SVAR",
  faqLede: "Vanlige spørsmål om kanaler og synk.",
  benefits: [
    "Synk kalender, priser og tilgjengelighet automatisk",
    "Legg til nye oppføringer uten dobbeltarbeid",
    "Alltid oppdatert – aldri dobbeltbookinger",
    "Én admin for alle kanaler",
    "Endringer slår gjennom i sanntid, overalt",
    "Behold kanalene du allerede tjener på",
  ],
  steps: [
    {
      title: "Lim inn lenken",
      body: "Fra Finn, Airbnb, Booking.com, Eventum – eller hvilken som helst kilde. Du kan også laste opp et dokument.",
    },
    {
      title: "Agenten henter alt",
      body: "Tekst, bilder, kalender, priser og konfigurasjon trekkes ut og struktureres automatisk.",
    },
    {
      title: "Ferdig utkast",
      body: "Du får et komplett oppføringsutkast i Digilist. Gjennomgå, juster og publiser – ingen manuell inntasting.",
    },
  ],
  faq: [
    {
      question: "Hvordan fungerer toveis kalendersynk?",
      answer:
        "Du kobler kanalene dine – som Airbnb, Booking.com, Bookup, Eventum eller Finn – til Digilist én gang. Deretter holdes kalender, priser og tilgjengelighet synkronisert begge veier: en booking på én kanal blokkerer tiden på alle de andre umiddelbart, og endringer du gjør i Digilist slår gjennom overalt. Slik unngår du dobbeltbookinger uten manuelt vedlikehold.",
    },
    {
      question: "Hvilke kanaler kan jeg koble til?",
      answer:
        "Digilist kobler mot de vanligste kanalene norske utleiere bruker – Airbnb, Booking.com, Bookup, Eventum og Finn – samt kalenderstandarder som iCal, CalDAV, Outlook og Google Calendar. Mangler kanalen din? Ta kontakt, så ser vi på en tilkobling.",
    },
    {
      question: "Kan AI-agenten importere oppføringene mine automatisk?",
      answer:
        "Ja. Lim inn lenken til en eksisterende oppføring (eller last opp et dokument), så henter agenten tekst, bilder, kalender, priser og konfigurasjon og lager et ferdig utkast i Digilist. Du trenger bare å gjennomgå og publisere – ingen manuell inntasting fra bunnen av.",
    },
    {
      question: "Kan jeg fortsette å bruke Airbnb og Booking.com samtidig?",
      answer:
        "Absolutt. Poenget med toveis synk er nettopp at du beholder kanalene du allerede tjener på. Digilist blir det samlende kalender- og driftslaget, mens du fortsetter å ta imot bookinger der kundene dine allerede er.",
    },
    {
      question: "Hindrer synk dobbeltbookinger?",
      answer:
        "Ja. Fordi tilgjengeligheten holdes synkronisert i sanntid på tvers av alle tilkoblede kanaler, blir en tid som bookes ett sted umiddelbart utilgjengelig alle andre steder. Det er selve grunnen til at én felles kalender fjerner dobbeltbookinger.",
    },
  ],
};

const EN: ChannelsCopy = {
  metaTitle: "Channels & sync · Digilist | Calendar sync and AI import",
  metaDescription:
    "Connect Airbnb, Booking.com, Bookup, Eventum and Finn to Digilist. Real-time two-way calendar sync, and AI import of your listings — keep both platforms.",
  keywords:
    "channel sync, channel manager, calendar sync, import airbnb listing, two-way booking sync, avoid double bookings",
  rule: "CHANNELS · TWO-WAY SYNC",
  h1: "One calendar.",
  h1em: "every channel",
  ledeA: "Do you list venues on Airbnb, Booking.com, Bookup or Eventum? Connect them to Digilist once, and your calendar and availability stay in ",
  ledeStrong: "automatic two-way sync",
  ledeB: " — and let the AI agent import your listings into finished drafts. No duplicated work, no double bookings, and you keep the channels you already earn from.",
  ctaDemo: "Book a demo",
  ctaOpen: "Open the platform",
  yourChannels: "Your channels",
  allSources: "+ any source",
  specs: [
    { label: "Sync", value: "Two-way · real time" },
    { label: "Channels", value: "Airbnb · Booking.com · +" },
    { label: "Calendar", value: "iCal · CalDAV · Outlook" },
    { label: "Import", value: "AI agent · a link" },
    { label: "Admin", value: "One for all" },
  ],
  syncRule: "I. TWO-WAY SYNC",
  syncH2: "Connect once.",
  syncH2em: "always current",
  syncLede:
    "Calendar, prices and availability stay in sync both ways — with no manual upkeep.",
  importRule: "II. AI AGENT · IMPORT",
  importH2: "Let the agent move",
  importH2em: "your listings",
  importLede:
    "No retyping everything — the agent builds the draft for you.",
  faqRule: "III. QUESTIONS AND ANSWERS",
  faqLede: "Common questions about channels and sync.",
  benefits: [
    "Sync calendar, prices and availability automatically",
    "Add new listings without duplicating work",
    "Always current — never a double booking",
    "One admin for every channel",
    "Changes take effect in real time, everywhere",
    "Keep the channels you already earn from",
  ],
  steps: [
    {
      title: "Paste the link",
      body: "From Finn, Airbnb, Booking.com, Eventum — or any other source. You can upload a document instead.",
    },
    {
      title: "The agent collects it all",
      body: "Text, images, calendar, prices and configuration are extracted and structured automatically.",
    },
    {
      title: "A finished draft",
      body: "You get a complete listing draft in Digilist. Review it, adjust it and publish — no manual data entry.",
    },
  ],
  faq: [
    {
      question: "How does two-way calendar sync work?",
      answer:
        "You connect your channels — Airbnb, Booking.com, Bookup, Eventum or Finn, Norway's main classifieds site — to Digilist once. After that, calendar, prices and availability stay synchronised both ways: a booking on one channel immediately blocks that time on all the others, and changes you make in Digilist take effect everywhere. That is how you avoid double bookings without manual upkeep.",
    },
    {
      question: "Which channels can I connect?",
      answer:
        "Digilist connects to the channels Norwegian operators use most — Airbnb, Booking.com, Bookup, Eventum and Finn — as well as calendar standards such as iCal, CalDAV, Outlook and Google Calendar. If your channel is missing, get in touch and we will look at a connection.",
    },
    {
      question: "Can the AI agent import my listings automatically?",
      answer:
        "Yes. Paste the link to an existing listing, or upload a document, and the agent pulls in the text, images, calendar, prices and configuration and builds a finished draft in Digilist. All you do is review it and publish — no typing it all in from scratch.",
    },
    {
      question: "Can I keep using Airbnb and Booking.com at the same time?",
      answer:
        "Absolutely. The whole point of two-way sync is that you keep the channels you already earn from. Digilist becomes the calendar and operations layer that ties them together, while you carry on taking bookings where your customers already are.",
    },
    {
      question: "Does sync prevent double bookings?",
      answer:
        "Yes. Because availability stays synchronised in real time across every connected channel, a slot booked in one place becomes immediately unavailable everywhere else. That is precisely why a single shared calendar removes double bookings.",
    },
  ],
};

export function channelsCopy(locale: Locale): ChannelsCopy {
  return locale === "en" ? EN : NB;
}
