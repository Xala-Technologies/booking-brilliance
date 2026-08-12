/**
 * Interface copy, per language.
 *
 * The English site is the Norwegian site with the language changed — same
 * components, same layout, same routes. That only works if the strings live
 * outside the components, so this is where the chrome's words go: the consent
 * banner, the navigation, the footer, the chat widget. Anything a visitor sees
 * on every page.
 *
 * **Not page body copy.** An article or a landing page is prose, not a bag of
 * labels, and forcing it through a key-value table produces the stilted
 * sentence-by-sentence translation that makes a site read as machine-made.
 * Those are translated as whole documents — the FAQ has `faq.en.ts`, and blog
 * posts have their own twin files.
 *
 * Keys are dotted and named for MEANING, not for the Norwegian words, so a
 * rewrite of the Norwegian does not orphan the key.
 */
import type { Locale } from "./i18n";

type Copy = Record<string, string>;

const nb: Copy = {
  // Consent — the first thing every visitor sees, and it was Norwegian on the
  // English site because it predates the translation entirely.
  // The region label is deliberately NOT the heading: a screen reader announces
  // the landmark before the heading, so "Consent to cookies" tells the listener
  // what the region is FOR, while the heading states what we do. Collapsing the
  // two lost that distinction and broke the test that pins it.
  "consent.regionLabel": "Samtykke til informasjonskapsler",
  "consent.title": "Vi bruker informasjonskapsler",
  "consent.body":
    "Nødvendige cookies gjør at nettsiden fungerer. Med ditt samtykke bruker vi i tillegg statistikk‑ og markedsføringscookies fra Google og Meta, slik at vi kan måle hvilke annonser som faktisk fører til en henvendelse. Du kan når som helst ombestemme deg.",
  "consent.readMoreIn": "Les mer i vår",
  "consent.cookiePolicy": "cookie-policy",
  "consent.privacyPolicy": "personvernerklæring",
  "consent.and": "og",
  "consent.acceptAll": "Godta alle",
  "consent.necessaryOnly": "Kun nødvendige",
  "consent.settings": "Innstillinger",
  "consent.readMore": "Les mer om cookies",
  "consent.analytics": "Analyse",
  "consent.analyticsHelp": "Hjelper oss å forstå hvordan siden brukes.",
  "consent.necessary": "Nødvendige",
  "consent.necessaryHelp": "Kreves for at nettsiden skal fungere. Kan ikke slås av.",
  "consent.save": "Lagre valg",

  // Chrome
  "nav.openPlatform": "Åpne plattformen",
  "nav.bookDemo": "Book demo",
  "nav.findVenues": "Finn ledige lokaler",
  "nav.talkToUs": "Snakk med oss",
  "nav.main": "Hovednavigasjon",
  "nav.skipToContent": "Hopp til hovedinnhold",
  "nav.tagline": "Enkel booking",
  "nav.toggleTheme": "Bytt tema",
  "nav.talkToUsMeanwhile": "Snakk med oss imens",

  // Homepage hero. The rotating word is a list, so it is joined with "|" and
  // split on read — a dictionary of strings stays a dictionary of strings.
  "hero.eyebrow": "Bookingplattform · 2026 · Norge",
  "hero.words":
    "Lokaler|Selskapslokaler|Møterom|Idrettshaller|Kulturhus|Bryllupslokaler|Julebordlokaler|Grendehus",
  "hero.headlineTail": "du trenger,",
  "hero.headlineEm": "og plattformen bak dem",
  "hero.lede":
    "Finn og book lokaler med ekte priser og ledige datoer, og betal trygt med Vipps. Er du utleier eller kommune, drifter du alt fra kalender til oppgjør i samme plattform.",
  "hero.bullet1": "Ekte priser og ledige datoer i sanntid",
  "hero.bullet2": "Betal trygt med Vipps eller faktura",
  "hero.bullet3": "Bygd for norske krav – BankID, GDPR og universell utforming",

  // How it works
  "how.label": "FUNKSJONALITET",
  "how.intro": "Fra forespørsel til oppgjør: én sammenhengende prosess.",
  "how.headline": "Booking med",
  "how.headlineEm": "få steg.",
  "how.step1.title": "Søknad",
  "how.step1.body":
    "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart.",
  "how.step2.title": "Godkjenning",
  "how.step2.body":
    "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie.",
  "how.step3.title": "Bekreftelse",
  "how.step3.body":
    "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller (vaktmester, renhold, vekter) varsles automatisk.",
  "how.step4.title": "Oppfølging",
  "how.step4.body":
    "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform.",

  "cta.label": "BOOK EN DEMO",

  // Marketplace tiles. The images and links are identical in both languages —
  // only the words change, which is the whole point of the mirror.
  "market.label": "FINN OG BOOK",
  "market.intro":
    "Lokaler, overnatting, arrangementer, utstyr og tjenester, samlet på ett sted. Ekte priser, ledige tider og betaling med Vipps.",
  "market.headline": "Alt du kan finne og",
  "market.headlineEm": "booke",
  "market.tile.venues": "Lokaler",
  "market.tile.venues.tag": "Selskap · møte · kultur",
  "market.tile.stays": "Overnatting",
  "market.tile.stays.tag": "Hytte · leilighet · feriehus",
  "market.tile.sport": "Sport og aktivitet",
  "market.tile.sport.tag": "Idrettshall · padel · svømming",
  "market.tile.events": "Arrangementer",
  "market.tile.events.tag": "Konsert · teater · sport",
  "market.tile.equipment": "Utstyr",
  "market.tile.equipment.tag": "Fest · verktøy · friluft",
  "market.tile.services": "Tjenester",
  "market.tile.services.tag": "Catering · DJ · dekor",

  "faq.label": "OFTE STILTE SPØRSMÅL",
  "faq.intro":
    "Det folk lurer mest på om Digilist: booking, betaling, sesongleie og samsvar. Finner du ikke svaret?",
  "faq.headline": "Ofte stilte",
  "faq.headlineEm": "spørsmål",
  "faq.seeAll": "Se alle spørsmål",

  "sync.label": "KANALER · TOVEIS SYNK",
  "sync.headline": "Én kalender.",
  "sync.headlineEm": "alle kanaler",
  "sync.lede":
    "Har du lokaler på Airbnb, Booking.com, Bookup eller Eventum? Koble dem til Digilist én gang – så holdes kalender og tilgjengelighet i sync automatisk. Ingen dobbeltarbeid, ingen dobbeltbookinger, alltid oppdatert overalt.",
  "sync.benefit1": "Synk kalender, priser og tilgjengelighet automatisk",
  "sync.benefit2": "Legg til nye oppføringer uten dobbeltarbeid",
  "sync.benefit3": "Alltid oppdatert – aldri dobbeltbookinger",
  "sync.benefit4": "Én admin for alle kanaler",
  "sync.cta": "Se hvordan synk fungerer",

  "agents.label": "INNEBYGD INTELLIGENS",
  "agents.intro":
    "Under overflaten jobber en flåte av AI-agenter som godkjenner, svarer, forklarer og varsler, så administrasjonen slipper.",
  "agents.headline": "Agenter og",
  "agents.headlineEm": "automatisering",
  "agents.a1.title": "Godkjenning & compliance",
  "agents.a1.body":
    "Hver oppføring gjennomgås mot GDPR, NSM, SOC 2 og universell utforming, i både tekst og bilder, før den publiseres. Rent innhold godkjennes, resten stoppes med konkret veiledning.",
  "agents.a2.title": "Svar på henvendelser",
  "agents.a2.body":
    "Kundeforespørsler får et varmt, korrekt førstesvar med én gang, og leser formål, dato og antall. Klager, pris og juss løftes alltid til en saksbehandler.",
  "agents.a3.title": "Sesongtildeling",
  "agents.a3.body":
    "Gjennomgår og forklarer sesongtildeling av halltid. Fanger klubber som faller utenfor, vurderer om resultatet er forsvarlig, og gir hver klubb en begrunnelse. Aldri «systemet bestemte».",
  "agents.a4.title": "Dagens oversikt",
  "agents.a4.body":
    "Vaktmester, renhold, vakthold og brannvern får en rolig, personlig oversikt over dagen, med tidene i riktig rekkefølge og det som må følges opp. Aldri en tom melding.",
  "agents.a5.title": "Markedsinnsikt",
  "agents.a5.body":
    "Leser tilbud og etterspørsel på tvers av markedsplassen og finner hullene, der det mangler lokaler folk faktisk leter etter, som en kort, rangert mulighetsoversikt.",
  "agents.a6.title": "Lag utkast fra en lenke",
  "agents.a6.body":
    "Har du lokalet på Airbnb, Booking.com, Finn eller Eventum, eller i et Word-dokument? Lim inn lenken eller last opp filen, så analyserer agenten innholdet og lager et ferdig utkast til oppføring du bare finpusser.",

  "b2b.label": "FOR UTLEIERE OG KOMMUNER",
  "b2b.intro":
    "Digilist drifter privat utleie og kommunal booking i samme løsning: privatbookinger, sesongleie til lag og foreninger, sambruk mellom avdelinger og innbyggerdialog med ID-porten.",
  "b2b.headline": "Fra ett lokale til",
  "b2b.headlineEm": "hele kommunen",
  "b2b.b1.title": "Alt samlet",
  "b2b.b1.body":
    "Bestilling, kalender, priser, vilkår og administrasjon i én plattform. Slutt med Excel, e-poster og dobbeltbookinger.",
  "b2b.b2.title": "Enkel å bruke",
  "b2b.b2.body":
    "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring. Universelt utformet, WCAG 2.0 AA.",
  "b2b.b3.title": "Effektiv drift",
  "b2b.b3.body":
    "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid. Driftsroller varsles automatisk ved bookinger.",
  "b2b.b4.title": "Skalerbar",
  "b2b.b4.body":
    "Fra ett selskapslokale til en kommune med tolv anlegg: sesongleie, lag og foreninger, tilskudd og fakturering.",
};

const en: Copy = {
  "consent.regionLabel": "Consent to cookies",
  "consent.title": "We use cookies",
  "consent.body":
    "Necessary cookies make the site work. With your consent we also use statistics and marketing cookies from Google and Meta, so we can measure which ads actually lead to an enquiry. You can change your mind at any time.",
  "consent.readMoreIn": "Read more in our",
  "consent.cookiePolicy": "cookie policy",
  "consent.privacyPolicy": "privacy statement",
  "consent.and": "and",
  "consent.acceptAll": "Accept all",
  "consent.necessaryOnly": "Necessary only",
  "consent.settings": "Settings",
  "consent.readMore": "Read more about cookies",
  "consent.analytics": "Analytics",
  "consent.analyticsHelp": "Helps us understand how the site is used.",
  "consent.necessary": "Necessary",
  "consent.necessaryHelp": "Required for the site to work. Cannot be turned off.",
  "consent.save": "Save choices",

  "nav.openPlatform": "Open the platform",
  "nav.bookDemo": "Book a demo",
  "nav.findVenues": "Find available venues",
  "nav.talkToUs": "Talk to us",
  "nav.main": "Main navigation",
  "nav.skipToContent": "Skip to main content",
  "nav.tagline": "Booking made simple",
  "nav.toggleTheme": "Switch theme",
  "nav.talkToUsMeanwhile": "Talk to us meanwhile",

  "hero.eyebrow": "Booking platform · 2026 · Norway",
  "hero.words":
    "Venues|Function rooms|Meeting rooms|Sports halls|Cultural centres|Wedding venues|Party venues|Community halls",
  "hero.headlineTail": "you need,",
  "hero.headlineEm": "and the platform behind them",
  "hero.lede":
    "Find and book venues with real prices and real availability, and pay securely. If you rent space out, you run everything from the calendar to settlement in one platform.",
  "hero.bullet1": "Real prices and live availability",
  "hero.bullet2": "Pay securely by card, mobile payment or invoice",
  "hero.bullet3": "Built for Norwegian requirements — national ID, GDPR and accessibility",

  "how.label": "HOW IT WORKS",
  "how.intro": "From request to settlement: one continuous process.",
  "how.headline": "Booking in",
  "how.headlineEm": "a few steps.",
  "how.step1.title": "Request",
  "how.step1.body":
    "A resident, club, association or business sends a request through Digilist. Availability is shown live, and requests that fit the rules are booked immediately.",
  "how.step2.title": "Approval",
  "how.step2.body":
    "Requests outside the rules go to an administrator. Approval can be delegated to operational roles, and automatic rules cover recurring patterns such as seasonal allocation.",
  "how.step3.title": "Confirmation",
  "how.step3.body":
    "Automatic confirmation with the details, and payment by card or mobile payment. Operational roles — caretaker, cleaning, security — are notified automatically.",
  "how.step4.title": "Follow-up",
  "how.step4.body":
    "Invoices and vouchers to the common accounting systems, or by the European e-invoicing standard. Reporting, KPIs and financial reconciliation in one platform.",

  "cta.label": "BOOK A DEMO",

  "market.label": "FIND AND BOOK",
  "market.intro":
    "Venues, accommodation, events, equipment and services in one place. Real prices, real availability, and secure payment.",
  "market.headline": "Everything you can find and",
  "market.headlineEm": "book",
  "market.tile.venues": "Venues",
  "market.tile.venues.tag": "Function · meeting · culture",
  "market.tile.stays": "Accommodation",
  "market.tile.stays.tag": "Cabin · apartment · holiday home",
  "market.tile.sport": "Sport and activity",
  "market.tile.sport.tag": "Sports hall · padel · swimming",
  "market.tile.events": "Events",
  "market.tile.events.tag": "Concert · theatre · sport",
  "market.tile.equipment": "Equipment",
  "market.tile.equipment.tag": "Party · tools · outdoor",
  "market.tile.services": "Services",
  "market.tile.services.tag": "Catering · DJ · decor",

  "faq.label": "FREQUENTLY ASKED",
  "faq.intro":
    "What people most often ask about Digilist: booking, payment, pricing and compliance. Cannot find your answer?",
  "faq.headline": "Frequently asked",
  "faq.headlineEm": "questions",
  "faq.seeAll": "See all questions",

  "sync.label": "CHANNELS · TWO-WAY SYNC",
  "sync.headline": "One calendar.",
  "sync.headlineEm": "every channel",
  "sync.lede":
    "Listed on Airbnb, Booking.com or another channel? Connect them to Digilist once, and your calendar and availability stay in sync automatically. No duplicate work, no double bookings, always current everywhere.",
  "sync.benefit1": "Sync calendar, prices and availability automatically",
  "sync.benefit2": "Add new listings without doing the work twice",
  "sync.benefit3": "Always current — never a double booking",
  "sync.benefit4": "One admin for every channel",
  "sync.cta": "See how sync works",

  "agents.label": "BUILT-IN INTELLIGENCE",
  "agents.intro":
    "Underneath, a fleet of AI agents approves, answers, explains and notifies — so the administration does not have to.",
  "agents.headline": "Agents and",
  "agents.headlineEm": "automation",
  "agents.a1.title": "Approval and compliance",
  "agents.a1.body":
    "Every listing is checked against GDPR, security and accessibility standards — text and images both — before it is published. Clean content is approved; the rest is stopped with specific guidance.",
  "agents.a2.title": "Answering enquiries",
  "agents.a2.body":
    "Enquiries get a warm, accurate first reply straight away, reading the purpose, the date and the numbers. Complaints, pricing and legal questions always go to a person.",
  "agents.a3.title": "Seasonal allocation",
  "agents.a3.body":
    "Reviews and explains how recurring slots are allocated to local clubs. It catches the clubs that miss out, judges whether the outcome is defensible, and gives each one a reason. Never “the system decided”.",
  "agents.a4.title": "The day ahead",
  "agents.a4.body":
    "Caretakers, cleaning, security and fire safety get a calm, personal view of the day, with the times in order and what needs following up. Never an empty message.",
  "agents.a5.title": "Market insight",
  "agents.a5.body":
    "Reads supply and demand across the marketplace and finds the gaps — where the venues people are actually searching for do not exist — as a short, ranked list of opportunities.",
  "agents.a6.title": "Draft a listing from a link",
  "agents.a6.body":
    "Already listed elsewhere, or have the details in a document? Paste the link or upload the file, and the agent reads it and produces a finished draft listing for you to polish.",

  "b2b.label": "FOR OPERATORS AND PUBLIC BODIES",
  "b2b.intro":
    "Digilist runs private rental and public-sector booking in one system: individual bookings, recurring seasonal slots for local clubs, shared use across departments, and resident access through national digital identity.",
  "b2b.headline": "From one venue to",
  "b2b.headlineEm": "an entire authority",
  "b2b.b1.title": "Everything in one place",
  "b2b.b1.body":
    "Orders, calendar, prices, terms and administration in one platform. No more spreadsheets, email threads and double bookings.",
  "b2b.b2.title": "Simple to use",
  "b2b.b2.body":
    "Residents and tenants find a free slot, send a request and pay without being trained. Built to WCAG accessibility standards.",
  "b2b.b3.title": "Efficient to run",
  "b2b.b3.body":
    "Automated rules, approvals and oversight cut manual work. Operational roles are notified automatically when a booking lands.",
  "b2b.b4.title": "Scales with you",
  "b2b.b4.body":
    "From a single function room to an authority with twelve facilities: seasonal allocation, clubs and associations, grants and invoicing.",
};

const DICT: Record<Locale, Copy> = { nb, en };

/**
 * Look up a string.
 *
 * Falls back to Norwegian, then to the key itself. Never throws and never
 * renders empty: a missing translation should read as untranslated text, which
 * someone notices, rather than as a blank button, which looks like a broken
 * page and gets misdiagnosed.
 */
export function t(locale: Locale, key: string): string {
  return DICT[locale]?.[key] ?? nb[key] ?? key;
}

/** Every key, for the test that keeps the two languages in step. */
export function copyKeys(locale: Locale): string[] {
  return Object.keys(DICT[locale] ?? {});
}
