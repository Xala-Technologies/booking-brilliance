/**
 * Source-of-truth FAQ content for Digilist.
 * Used by:
 *   1. /faq page — SEO + GEO landing with FAQPage JSON-LD
 *   2. Landing-page FAQ JSON-LD (subset)
 *   3. /llms.txt + /llms-full.txt static assets
 *   4. Chatbot RAG corpus (each entry is one retrievable chunk)
 *
 * Edit here, run `pnpm build`, deploy — all surfaces stay in sync.
 */

export interface FAQCategory {
  id: string;
  label: string;
  description: string;
  questions: Array<{
    q: string;
    a: string;
    keywords?: string[];
  }>;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "produkt",
    label: "Om Digilist",
    description: "Hva Digilist er, hvem som bruker det, og hva som skiller plattformen fra alternativene.",
    questions: [
      {
        q: "Hva er Digilist?",
        // Answers "hva er Digilist" for BOTH sides, in that order, because both
        // arrive in comparable numbers. The previous answer said "for både
        // private utleiere og norske kommuner" — which names two kinds of
        // seller and leaves the person trying to book a room out of the
        // description of what we are.
        a: "Digilist er en norsk plattform som betjener begge sider av utleie. Skal du leie, finner du lokaler med ekte priser og ledige datoer og booker direkte. Leier du ut — privat eller kommunalt — drifter du kalender, betaling, sesongleie, fakturering og rapportering i samme løsning. Vi leverer tjenesten og tar ingen andel av leien.",
        keywords: ["digilist", "hva er", "bookingplattform"],
      },
      {
        q: "Hvem står bak Digilist?",
        a: "Digilist er utviklet av Xala Technologies AS, et norsk teknologiselskap basert i Nesbruveien 75, 1394 Nesbru. Selskapet utvikler digitale løsninger for offentlig sektor og næringsliv i Norge.",
        keywords: ["xala", "leverandør", "selskap"],
      },
      {
        q: "Hvilke organisasjoner bruker Digilist i dag?",
        a: "Digilist brukes blant andre av Nordre Follo kommune (12 anlegg, ~340 lag og foreninger, ~1 200 bookinger/mnd), Rønningen Selskapslokale (Asker), Lier Bygdetun og RightSize Group (Nesbru). Plattformen håndterer både offentlige og private utleiere.",
        keywords: ["kunder", "referanser", "nordre follo", "rønningen"],
      },
      {
        q: "Hva skiller Digilist fra andre bookingsystemer?",
        a: "Digilist er bygget for norske krav fra grunnen: Vipps, BankID, ID-porten, EHF/Peppol, BRREG og Digdir Designsystemet er innebygd. Én plattform håndterer både privat utleie og kommunal drift. Convex' reaktive runtime gir sanntid uten polling, og all data lagres i Norge og EU.",
        keywords: ["differensiering", "konkurrenter", "fordeler"],
      },
    ],
  },
  {
    id: "funksjonalitet",
    label: "Funksjonalitet",
    description: "Hva plattformen kan gjøre: fra booking og betaling til sesongleie og rapportering.",
    questions: [
      {
        q: "Hvilke betalingsmetoder støtter Digilist?",
        a: "Digilist støtter Vipps (mobil + web), kortbetaling via Stripe Connect (Express), depositum, fakturering og EHF/Peppol for offentlig fakturering. Refusjonsregler kan tilpasses per anlegg og brukergruppe.",
        keywords: ["betaling", "vipps", "stripe", "ehf"],
      },
      {
        q: "Støtter Digilist sanntidstilgjengelighet?",
        a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart for alle brukere, drevet av Convex' reaktive runtime, ingen polling eller refresh nødvendig.",
        keywords: ["sanntid", "kalender", "real-time"],
      },
      {
        q: "Hvordan håndteres sesongleie for lag og foreninger?",
        a: "Digilist har en egen sesongleie-modul med søknadsportal for lag og foreninger, BRREG-verifisering av organisasjoner, regelstyrt fordelingsforslag basert på kommunens prioriteringsregler, saksbehandlerverktøy for justering og automatisk varsling. Tilskudd og kapasitetsutnyttelse rapporteres automatisk.",
        keywords: ["sesongleie", "lag", "foreninger", "fordeling"],
      },
      {
        q: "Hva er forskjellen på auto-godkjenning og manuell godkjenning?",
        a: "Auto-godkjenning bekrefter bookinger umiddelbart basert på regler (lave verdier, korte bookinger, verifiserte brukere). Manuell godkjenning sender bookinger til saksbehandler-kø for kontroll. Begge moduser kan kombineres: auto for hovedtidsperiode, manuell for unntak.",
        keywords: ["godkjenning", "automatisk", "manuell"],
      },
      {
        q: "Støtter Digilist digital nøkkel og adgangskontroll?",
        a: "Ja. Salto KS digital nøkkel er integrert. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt. Vaktmestere og driftsroller varsles automatisk om aktive bookinger.",
        keywords: ["digital nøkkel", "salto", "adgang"],
      },
      {
        q: "Hvordan varsles vaktmestere og driftspersonell?",
        a: "Når en booking bekreftes, sendes automatiske varsler til vaktmester, renholdspersonell, vekter og andre relevante driftsroller, via e-post, SMS eller varsler i Digilist-appen. Varslene tilpasses per anlegg.",
        keywords: ["varsling", "drift", "vaktmester"],
      },
    ],
  },
  {
    id: "kommune",
    label: "For kommuner",
    description: "SSA-L 2026, anskaffelse, sesongleie og hvordan kommunen kan starte en pilot.",
    questions: [
      {
        q: "Oppfyller Digilist SSA-L 2026-kravene?",
        a: "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering.",
        keywords: ["ssa-l", "anskaffelse", "krav"],
      },
      {
        q: "Kan kommunen importere bookinger fra eksisterende system?",
        a: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi tar over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen.",
        keywords: ["migrasjon", "rco", "import"],
      },
      {
        q: "Hva er pilotprogrammet for kommuner?",
        a: "Vi tilbyr norske kommuner en gratis pilotfase hvor Digilist hjelper med oppsett og publisering av kommunale lokaler og anlegg. Kommunen får egen administrativ tilgang. Målet er ikke å erstatte eksisterende prosesser, men å utforske hvordan Digilist kan supplere kommunens digitale tjenester.",
        keywords: ["pilot", "gratis", "start"],
      },
      {
        q: "Hvor lang tid tar implementeringen for en kommune?",
        a: "En typisk kommunal etableringsfase tar 6–12 uker, avhengig av antall anlegg og kompleksiteten av eksisterende data. Pilotopplegg kan komme i gang på under to uker. Detaljert tidslinje finnes i Bilag 3 for SSA-L-anskaffelser.",
        keywords: ["implementering", "tidslinje", "etablering"],
      },
      {
        q: "Hvilke kommunale anleggstyper støttes?",
        a: "Idrettshaller, svømmehaller, gymsaler, fotballbaner, møterom, kantiner, kulturhus, samfunnshus, kjøretøy, AV-utstyr og ressurser. Hver anleggstype kan ha egne regler for kapasitet, prising og brukergrupper.",
        keywords: ["anlegg", "idrettshall", "møterom", "kulturhus"],
      },
    ],
  },
  {
    id: "samsvar",
    label: "Samsvar og sikkerhet",
    description: "GDPR, ISO 27001, datalokasjon og hvordan kommunens persondata behandles.",
    questions: [
      {
        q: "Er Digilist GDPR-kompatibel?",
        a: "Ja. Digilist er GDPR-kompatibel og leverer standard databehandleravtale (DPA) før kontraktsinngåelse. Plattformen har dataregister, rett til sletting, audit-logg og prosedyrer for sikkerhetsbrudd og innsynsbegjæringer.",
        keywords: ["gdpr", "personvern"],
      },
      {
        q: "Hvor lagres dataene?",
        a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier.",
        keywords: ["datalokasjon", "norge", "eu"],
      },
      {
        q: "Er Digilist ISO 27001 og 27701-sertifisert?",
        a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel.",
        keywords: ["iso", "27001", "27701", "sertifisering"],
      },
      {
        q: "Oppfyller Digilist WCAG 2.0 AA?",
        a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal.",
        keywords: ["wcag", "universell utforming", "tilgjengelighet"],
      },
      {
        q: "Hva inneholder audit-loggen?",
        a: "Hver mutasjon i systemet (bookinger, godkjenninger, endringer, slettinger, brukerhandlinger) registreres med tidsstempel, brukerident og endringsdetaljer. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.",
        keywords: ["audit", "logg", "revisjon"],
      },
    ],
  },
  {
    id: "teknologi",
    label: "Teknologi",
    description: "Stack, arkitektur, integrasjoner og hvordan plattformen er bygget.",
    questions: [
      {
        q: "Hvilken teknologi er Digilist bygget på?",
        a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten.",
        keywords: ["stack", "teknologi", "react", "convex"],
      },
      {
        q: "Hvilke integrasjoner støttes?",
        a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking.",
        keywords: ["integrasjoner", "tredjepart"],
      },
      {
        q: "Har Digilist åpne API-er?",
        a: "Ja. Digilist tilbyr REST- og webhook-API-er for bookinger, brukere, betaling og integrasjon med eksisterende kommunale systemer. API-dokumentasjon er tilgjengelig for kunder og potensielle kunder under signert NDA.",
        keywords: ["api", "integrasjon", "webhook"],
      },
      {
        q: "Hvor høy oppetid garanterer Digilist?",
        a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig.",
        keywords: ["oppetid", "sla", "uptime"],
      },
      {
        q: "Hvor rask er plattformen?",
        a: "API-respons under 200 ms i 95-persentilen. Sanntid-oppdateringer leveres som push fra Convex' reaktive runtime, ikke polling. Frontend laster mindre enn 300 kB gzip og Lighthouse-scoring er 90+ på alle parametere.",
        keywords: ["ytelse", "hastighet", "performance"],
      },
    ],
  },
  {
    id: "priser",
    label: "Priser og kontrakter",
    description: "Hva Digilist koster, hvordan vi prises og hvilke kontraktsformer som er tilgjengelige.",
    questions: [
      {
        // THE most-asked question on this site, and until now the corpus had no
        // answer to it at all. A visitor asking "hva koster det å leie et
        // lokale?" is a RENTER asking what a room costs to hire. The only
        // pricing entry was "Hva koster Digilist?" — the platform subscription —
        // so the retriever matched that, and the assistant told a renter about
        // their own imagined rental income. It is the right answer to a
        // question nobody asked.
        //
        // Placed FIRST in the category so it wins the tie on a bare "pris".
        // The figures are the ones already published on /lokaler-til-leie and
        // the price calculator — not new claims.
        q: "Hva koster det å leie et lokale?",
        a: "Det varierer med lokaltype, sted, kapasitet, ukedag og sesong. Som grove pekepinner ligger grendehus og foreningslokaler ofte på 1 000–5 000 kr per dag, selskaps- og festlokaler på 5 000–30 000 kr, møterom fra noen hundre kroner per time, og kulturhus og storsaler høyere. Lørdager i høysesong koster mest. Du ser den faktiske totalprisen for din dato, inkludert eventuelt depositum og rengjøring, før du bekrefter bookingen. Leiepriskalkulatoren gir et veiledende intervall.",
        // Every keyword is anchored on renting — "leie", "leiepris", a venue
        // type — and none contains a bare money word. That is deliberate and
        // load-bearing: keyword scoring gives +3 when ANY query token matches
        // ANY token of the keyword, so a keyword like "hva koster det å leie"
        // would fire on a bare "hva koster det?" through the word "koster"
        // alone and steal the platform-pricing question. Anchoring means this
        // entry wins when someone says leie/lokale and stays out of the way
        // otherwise — which is what the tests above pin.
        keywords: [
          "leie", "leier", "leiepris", "leiepriser", "leieprisen",
          "leiepriskalkulator", "lokale", "lokalet", "lokaler", "leielokale",
          "selskapslokale", "festlokale", "grendehus", "møterom", "kulturhus",
          "utleiepris", "døgnpris", "dagspris", "timespris", "depositum",
        ],
      },
      {
        q: "Hva koster Digilist?",
        // Opens by naming both readings on purpose. Search Console shows the
        // two audiences arriving in comparable numbers — venue-rental queries
        // took 53% of clicks over the last period and booking-system queries
        // 27% — so "hva koster det?" with no other context is genuinely
        // ambiguous on this site. Assuming produced the live reply that
        // lectured a would-be renter about their own rental income.
        a: "Kommer an på hva du spør om. Skal du LEIE et lokale, avhenger prisen av lokalet, datoen og kapasiteten — du ser totalprisen før du bekrefter. Skal du BRUKE Digilist til å leie ut eller administrere lokaler, er det et abonnement: prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tar ingen andel av bookinginntektene og har ingen skjulte gebyrer. Mindre og private aktører får egne, tilpassede priser, og de 100 første kundene får 6 måneder gratis.",
        // Two keywords ("pris", "kostnad") meant every way of asking about money
        // WITHOUT those words missed: "billigste alternativ" returned nothing at
        // all, "rimeligste alternativ for sånne som oss" returned implementation
        // time, and "hva koster det per måned" returned GDPR. The model then
        // invented "fra omkring 300 kroner månedlig" to fill the gap.
        keywords: [
          // Generic money words stay: removing them sent "hva koster det per
          // måned" back to GDPR, which is the exact regression the tests above
          // this line were written for. Disambiguation is done by ADDING
          // renter-specific phrases to the venue-rental entry instead, which
          // outscores this one on "leie"/"lokale" without weakening it here.
          "pris", "prisen", "priser", "kostnad", "koster", "koste", "billig",
          "billigste", "rimelig", "rimeligste", "dyrt", "budsjett", "alternativ",
          "måned", "månedlig", "abonnement", "abonnementsnivå", "gratis",
          "prøveperiode", "tilbud", "pricing", "cost",
          "hva koster digilist", "hva koster plattformen", "hva koster systemet",
        ],
      },
      {
        q: "Hvorfor har dere ingen prisliste?",
        a: "Fordi ett tall ville vært feil for nesten alle som leste det. Spennet mellom et grendehus med én sal og en fylkeskommune med tjueto skoler er for stort. Vi publiserer i stedet alt som avgjør prisen, og gir et konkret tilbud etter en kort samtale.",
        keywords: [
          "prisliste", "priser", "hvorfor ingen", "tall", "oversikt over priser",
          "hva koster det egentlig", "konkret pris", "estimat",
        ],
      },
      {
        q: "Hvordan fungerer abonnementet?",
        a: "Digilist er en abonnementstjeneste med flere nivåer. Nivået velges ut fra antall anlegg, hvor mange som skal bruke systemet og hvilke integrasjoner dere trenger. Dere betaler for bruk av Digilist og administrasjonspanelet — ingenting per booking.",
        keywords: [
          "abonnement", "abonnementsnivå", "nivå", "pakke", "plan", "lisens",
          "hvordan fungerer", "modell", "prismodell", "subscription", "tier",
        ],
      },
      {
        q: "Hva er inkludert i prisen?",
        a: "Bruk av Digilist og administrasjonspanelet, med kalender, booking, betaling, kontrakter og rapportering. Standardintegrasjoner som Vipps, BankID, ID-porten, EHF og regnskapssystemer er inkludert. Ingen skjulte gebyrer og ingen kostnad per booking.",
        keywords: [
          "inkludert", "inngår", "hva får vi", "hva dekker", "tillegg",
          "ekstra", "skjulte", "gebyr", "inkluderer",
        ],
      },
      {
        q: "Tar dere en andel av bookinginntektene?",
        a: "Nei. Digilist tar ingen transaksjonsavgift og ingen andel av det dere tar betalt for utleie. Vi tar betalt for bruk av tjenesten og administrasjonspanelet, og det er ingen skjulte gebyrer.",
        // "per booking" added because the identity answer now also says we
        // take no share of the rent — which is the point, but it meant "tar
        // dere noe per booking?" started landing on "Hva er Digilist?" instead
        // of the entry written to answer it. The fee entry should own fee
        // phrasings no matter what else happens to mention the fee.
        keywords: [
          "transaksjon", "transaksjonsavgift", "andel", "provisjon", "kutt",
          "gebyr", "skjulte", "prosent", "avgift", "inntekt", "omsetning",
          "per booking", "per reservasjon", "tar dere noe", "koster per",
        ],
      },
      {
        q: "Er Digilist for dyrt for en liten forening?",
        a: "Nei. Mindre lag, foreninger og private utleiere får egne tilpassede priser — prisen skal ikke ligne på det en kommune med mange bygg betaler. Ett lokale er helt greit, og de 100 første kundene får 6 måneder gratis.",
        keywords: [
          "liten", "små", "lite", "forening", "lag", "frivillig", "ett lokale",
          "for dyrt", "har ikke råd", "billig", "rimelig", "budsjett", "grendehus",
        ],
      },
      {
        q: "Hva er tilbudet til de første kundene?",
        a: "De 100 første kundene får 6 måneder gratis bruk av Digilist. Etter prøveperioden velger dere abonnementsnivå ut fra antall anlegg og behov. Ingen binding i prøveperioden.",
        keywords: [
          "første", "100", "lansering", "tilbud", "gratis", "6 måneder",
          "prøveperiode", "uforpliktende", "binding", "kampanje", "rabatt",
        ],
      },
      {
        q: "Er det kostnader knyttet til integrasjoner?",
        a: "Standardintegrasjoner (Vipps, BankID, ID-porten, EHF, Visma, Tripletex, Fiken, PowerOffice, Microsoft 365, Salto KS) er inkludert. Spesialtilpassede integrasjoner mot kommunens egne systemer prises separat etter omfang.",
        keywords: ["integrasjonspris", "tilkobling"],
      },
      {
        q: "Hva slags kontrakter tilbys?",
        a: "For offentlig sektor tilbyr vi SSA-L 2026-kontrakter med standard bilag (1–6). For privat sektor: månedlig eller årlig abonnement. Pilotperioder er alltid gratis og uforpliktende.",
        keywords: ["kontrakt", "ssa-l", "abonnement"],
      },
    ],
  },
  {
    id: "support",
    label: "Support og opplæring",
    description: "Hvordan vi hjelper deg i gang og holder plattformen i drift.",
    questions: [
      {
        q: "Hvilken support inkluderes?",
        a: "Telefon- og e-post-support i ordinære arbeidstider (08:00–17:00 norsk tid), kunnskapsbase, opplæringsmateriale og dedikert onboarding-konsulent i etableringsfasen. 24/7 driftsovervåking med automatisk alarmering.",
        keywords: ["support", "hjelp", "kundestøtte"],
      },
      {
        q: "Får vi opplæring av brukere og saksbehandlere?",
        a: "Ja. I etableringsfasen tilbys workshops for saksbehandlere, administratorer og driftsroller. Opplæringsmateriell (video, dokumentasjon) er tilgjengelig kontinuerlig. Vi tilbyr også løpende opplæring ved behov.",
        keywords: ["opplæring", "kurs", "workshop"],
      },
      {
        q: "Hvordan rapporteres feil og forbedringsforslag?",
        a: "Via support@digilist.no, statusside, eller direkte i administrasjonsverktøyet. Feilrettinger prioriteres etter alvorlighetsgrad (kritisk → høy → middels → lav). Forbedringsforslag samles i offentlig veikart hvor kommuner kan stemme.",
        keywords: ["feilmelding", "bug", "rapportering"],
      },
    ],
  },
];

export function allFAQEntries(): Array<{ q: string; a: string; category: string }> {
  return FAQ_CATEGORIES.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, category: cat.label })),
  );
}

/**
 * Homepage FAQ — the six questions rendered in the visible accordion on `/`
 * AND emitted as the homepage FAQPage JSON-LD (via <SEO faq>). Single source
 * of truth for the React app.
 *
 * IMPORTANT: keep this byte-for-byte in sync with the `/` route `faq` array in
 * scripts/prerender.mjs — that copy is what crawlers index in the static HTML,
 * and Google requires the visible FAQ text to match the FAQPage markup.
 */
export const HOMEPAGE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Hva er Digilist?",
    a: "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning.",
  },
  {
    q: "Hvilke kommuner og utleiere bruker Digilist?",
    a: "Digilist brukes av norske kommuner og private utleiere, blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group.",
  },
  {
    q: "Hvilke betalingsmetoder støttes?",
    a: "Vipps, BankID, Stripe Connect for kort, samt EHF/Peppol-fakturering. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap er aktive.",
  },
  {
    q: "Er Digilist GDPR- og ISO-sertifisert?",
    a: "Ja. Digilist oppfyller GDPR, er ISO 27001 og ISO 27701 sertifisert og følger WCAG 2.0 AA. Data lagres i Norge og EU.",
  },
  {
    q: "Hvordan håndteres sesongleie til lag og foreninger?",
    a: "Digilist har en egen sesongleie-modul med søknadsbehandling, regelstyrt fordeling og rapportering.",
  },
  {
    q: "Støtter Digilist sanntidstilgjengelighet?",
    a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid og oppdateres umiddelbart.",
  },
];
