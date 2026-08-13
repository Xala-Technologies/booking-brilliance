/**
 * The /sikkerhet page copy, in both languages.
 *
 * This is the page a public-sector buyer reads before they will consider the
 * product at all, so the English version is not decoration — it is the first
 * page an international evaluator asks for.
 *
 * Two translation rules applied throughout, both about not overclaiming:
 *
 * - Norwegian infrastructure is glossed, not just named. "BankID og ID-porten"
 *   tells a Norwegian reader exactly what level of assurance is meant and tells
 *   an English reader nothing, so the English says what they are.
 * - Legal references keep their Norwegian identity. "norsk personopplysnings-
 *   lov" becomes "the Norwegian Personal Data Act", not "national data
 *   protection law" — an evaluator needs to know which statute, and a vague
 *   rendering would read as a claim about their own jurisdiction.
 */
import type { Locale } from "@/lib/i18n";

export interface QA {
  question: string;
  answer: string;
}

export interface Area {
  title: string;
  body: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface SecurityCopy {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  rule: string;
  h1: string;
  h1em: string;
  lede: { lead: string; strong1: string; mid: string; strong2: string; tail: string };
  ctaDemo: string;
  ctaTech: string;
  summaryHeading: string;
  specs: readonly Spec[];
  principlesRule: string;
  principlesH2: string;
  principlesH2em: string;
  principlesLede: string;
  areasRule: string;
  areasH2: string;
  areasLede: string;
  faqRule: string;
  faqLede: string;
  principles: readonly string[];
  areas: readonly Area[];
  faq: readonly QA[];
}

const NB: SecurityCopy = {
  metaTitle: "Sikkerhet og personvern · Digilist | ISO 27001, GDPR",
  metaDescription:
    "Slik ivaretar Digilist sikkerhet og personvern: data i Norge og EU, ISO 27001- og 27701-sertifisert, GDPR-kompatibelt, BankID/ID-porten og audit-logg. Trygt bookingsystem for kommuner og utleiere.",
  keywords:
    "iso 27001, gdpr, personvern bookingsystem, datasikkerhet, sikker booking, gdpr bookingsystem, iso 27701, databehandleravtale, datalagring norge",
  rule: "SIKKERHET OG PERSONVERN · 2026",
  h1: "Sikkerhet og",
  h1em: "personvern",
  lede: {
    lead: "Digilist er bygget for å håndtere personopplysninger trygt. All data lagres i ",
    strong1: "Norge og EU",
    mid: ", plattformen er ",
    strong2: "ISO 27001- og 27701-sertifisert",
    tail: " og GDPR-kompatibel, med BankID/ID-porten-innlogging og audit-logg på hver endring. Et bookingsystem kommuner og utleiere kan stole på.",
  },
  ctaDemo: "Be om demo",
  ctaTech: "Se teknologien",
  summaryHeading: "Kort fortalt",
  specs: [
    { label: "Datalokasjon", value: "Norge · EU" },
    { label: "Sertifisering", value: "ISO 27001 · 27701" },
    { label: "Personvern", value: "GDPR · DPA" },
    { label: "Innlogging", value: "BankID · ID-porten" },
  ],
  principlesRule: "I. SIKKERHETSPRINSIPPER",
  principlesH2: "Innebygd sikkerhet,",
  principlesH2em: "ikke påklistret",
  principlesLede:
    "Tolv prinsipper som gjør Digilist trygt for offentlige og private data.",
  areasRule: "II. OMRÅDER",
  areasH2: "Hvordan vi ivaretar dataene.",
  areasLede:
    "Fra datalokasjon og sertifisering til innlogging og sporbarhet.",
  faqRule: "III. SPØRSMÅL OG SVAR",
  faqLede: "Vanlige spørsmål om sikkerhet og personvern.",
  principles: [
    "Data lagret i Norge og EU – aldri utenfor EØS",
    "ISO 27001 (informasjonssikkerhet) sertifisert",
    "ISO 27701 (personvern) sertifisert",
    "GDPR-kompatibel med databehandleravtale",
    "BankID og ID-porten for sikker innlogging",
    "Rollebasert tilgangsstyring",
    "Kryptering i transitt og hvile",
    "Audit-logg på hver endring",
    "Dataminimering – kun det bookingen krever",
    "Innsyn, retting og sletting for de registrerte",
    "Varslingsrutiner iht. GDPR (72 timer)",
    "SSA-L 2026-klar for offentlige anskaffelser",
  ],
  areas: [
    {
      title: "Personvern og GDPR",
      body: "Databehandleravtale med hver kunde, dataminimering og innsyn/retting/sletting for de registrerte. Vi behandler kun de personopplysningene en booking faktisk krever.",
    },
    {
      title: "Datalagring i Norge og EU",
      body: "All data lagres innenfor EU/EØS, aldri utenfor. Det oppfyller kravene til datalokasjon i norske offentlige anskaffelser og i personvernregelverket.",
    },
    {
      title: "ISO 27001 og 27701",
      body: "Informasjonssikkerhet og personvern styres etter et sertifisert, revidert rammeverk. Kontroller, risikovurdering og forbedring er innebygd, ikke tilfeldig.",
    },
    {
      title: "Sikker innlogging",
      body: "BankID og ID-porten gir sterk autentisering på nivå med offentlige tjenester. Rollebasert tilgang sikrer at hver bruker kun ser det de skal.",
    },
    {
      title: "Sporbarhet og audit-logg",
      body: "Hver mutasjon registreres med tidsstempel og bruker. Det gir full sporbarhet for offentlig forvaltning og et etterprøvbart spor ved tvist om en utleie eller booking.",
    },
    {
      title: "Kryptering og drift",
      body: "Data krypteres i transitt og hvile. Drift, sikkerhetsoppdateringer og overvåking håndteres av oss, slik at kommuner og utleiere slipper egen sikkerhetsforvaltning.",
    },
  ],
  faq: [
    {
      question: "Er Digilist GDPR-kompatibelt?",
      answer:
        "Ja. Digilist oppfyller kravene i GDPR og norsk personopplysningslov. Vi inngår databehandleravtale (DPA) med hver kunde, behandler kun de personopplysningene bookingen krever, og gir de registrerte innsyn, retting og sletting. All data lagres i Norge og EU.",
    },
    {
      question: "Hvor lagres dataene?",
      answer:
        "All data lagres i Norge og EU, aldri utenfor EØS. Databasen driftes på infrastruktur innenfor EU/EØS, slik at offentlige og private kunder oppfyller kravene til datalokasjon i norske anskaffelser og personvernregelverket.",
    },
    {
      question: "Er Digilist ISO 27001-sertifisert?",
      answer:
        "Ja. Digilist er sertifisert mot ISO 27001 (informasjonssikkerhet) og ISO 27701 (personverninformasjon). Det betyr at sikkerhet og personvern styres etter et etablert, revidert rammeverk – ikke ad hoc.",
    },
    {
      question: "Hvordan logger brukere inn sikkert?",
      answer:
        "Innlogging skjer med BankID og ID-porten for sterk autentisering, slik offentlige tjenester krever. Tilgang er rollebasert, så saksbehandlere, utleiere og innbyggere ser kun det de skal.",
    },
    {
      question: "Hvordan sikres sporbarhet og tilgangskontroll?",
      answer:
        "Tilgang styres rollebasert, og hver endring registreres i en audit-logg med tidsstempel og bruker. Det gir full sporbarhet på hvem som gjorde hva og når – nødvendig både for offentlig forvaltning og for tvistehåndtering ved utleie.",
    },
    {
      question: "Hva skjer ved et sikkerhetsbrudd?",
      answer:
        "Digilist har rutiner for hendelseshåndtering og varsling. Ved brudd på personopplysningssikkerheten varsler vi kunden uten ugrunnet opphold, slik at avviket kan meldes til Datatilsynet innen 72 timer i tråd med GDPR.",
    },
  ],
};

const EN: SecurityCopy = {
  metaTitle: "Security and privacy · Digilist | ISO 27001, GDPR",
  metaDescription:
    "How Digilist handles security and privacy: data in Norway and the EU, ISO 27001 and 27701 certified, GDPR compliant, national identity sign-in, and an audit log on every change.",
  keywords:
    "iso 27001, gdpr, booking system security, data security, secure booking, iso 27701, data processing agreement, data stored in norway",
  rule: "SECURITY AND PRIVACY · 2026",
  h1: "Security and",
  h1em: "privacy",
  lede: {
    lead: "Digilist is built to handle personal data safely. All data is stored in ",
    strong1: "Norway and the EU",
    mid: ", the platform is ",
    strong2: "ISO 27001 and 27701 certified",
    tail: " and GDPR compliant, with sign-in through the Norwegian national identity services and an audit log on every change. A booking system public bodies and operators can rely on.",
  },
  ctaDemo: "Request a demo",
  ctaTech: "See the technology",
  summaryHeading: "In brief",
  specs: [
    { label: "Data location", value: "Norway · EU" },
    { label: "Certification", value: "ISO 27001 · 27701" },
    { label: "Privacy", value: "GDPR · DPA" },
    { label: "Sign-in", value: "BankID · ID-porten" },
  ],
  principlesRule: "I. SECURITY PRINCIPLES",
  principlesH2: "Security built in,",
  principlesH2em: "not bolted on",
  principlesLede:
    "Twelve principles that make Digilist safe for public and private data.",
  areasRule: "II. AREAS",
  areasH2: "How we look after the data.",
  areasLede:
    "From where data lives and how we are certified, to sign-in and traceability.",
  faqRule: "III. QUESTIONS AND ANSWERS",
  faqLede: "Common questions about security and privacy.",
  principles: [
    "Data stored in Norway and the EU — never outside the EEA",
    "ISO 27001 certified (information security)",
    "ISO 27701 certified (privacy)",
    "GDPR compliant, with a data processing agreement",
    "Sign-in through the national identity services",
    "Role-based access control",
    "Encrypted in transit and at rest",
    "An audit log on every change",
    "Data minimisation — only what the booking requires",
    "Access, rectification and erasure for data subjects",
    "Breach notification under GDPR (72 hours)",
    "Ready for Norwegian public procurement (SSA-L 2026)",
  ],
  areas: [
    {
      title: "Privacy and GDPR",
      body: "A data processing agreement with every customer, data minimisation, and access, rectification and erasure for data subjects. We process only the personal data a booking actually requires.",
    },
    {
      title: "Data stored in Norway and the EU",
      body: "All data is stored within the EU/EEA, never outside it. That meets the data-location requirements in Norwegian public procurement and under the data protection rules.",
    },
    {
      title: "ISO 27001 and 27701",
      body: "Information security and privacy are managed under a certified, audited framework. Controls, risk assessment and improvement are built in rather than ad hoc.",
    },
    {
      title: "Secure sign-in",
      body: "BankID and ID-porten, the Norwegian national identity services, give strong authentication at the level public services require. Role-based access means each user sees only what they should.",
    },
    {
      title: "Traceability and audit log",
      body: "Every change is recorded with a timestamp and the user who made it. That gives public bodies full traceability, and gives both parties a verifiable record if a rental or booking is disputed.",
    },
    {
      title: "Encryption and operations",
      body: "Data is encrypted in transit and at rest. Operations, security updates and monitoring are handled by us, so public bodies and operators do not have to run their own security management.",
    },
  ],
  faq: [
    {
      question: "Is Digilist GDPR compliant?",
      answer:
        "Yes. Digilist meets the requirements of GDPR and the Norwegian Personal Data Act. We enter into a data processing agreement with every customer, process only the personal data the booking requires, and give data subjects access, rectification and erasure. All data is stored in Norway and the EU.",
    },
    {
      question: "Where is data stored?",
      answer:
        "All data is stored in Norway and the EU, never outside the EEA. The database runs on infrastructure within the EU/EEA, so public and private customers alike meet the data-location requirements in Norwegian procurement and under the data protection rules.",
    },
    {
      question: "Is Digilist ISO 27001 certified?",
      answer:
        "Yes. Digilist is certified against ISO 27001 (information security) and ISO 27701 (privacy information). That means security and privacy are managed under an established, audited framework rather than ad hoc.",
    },
    {
      question: "How do users sign in securely?",
      answer:
        "Sign-in uses BankID and ID-porten, the Norwegian national identity services, for strong authentication at the level public services require. Access is role-based, so case officers, operators and residents each see only what they should.",
    },
    {
      question: "How are traceability and access control handled?",
      answer:
        "Access is role-based, and every change is recorded in an audit log with a timestamp and the user. That gives full traceability of who did what and when — necessary both for public administration and for resolving a dispute about a rental.",
    },
    {
      question: "What happens in the event of a security breach?",
      answer:
        "Digilist has procedures for incident handling and notification. In the event of a personal data breach we notify the customer without undue delay, so that it can be reported to the Norwegian Data Protection Authority within 72 hours as GDPR requires.",
    },
  ],
};

export function securityCopy(locale: Locale): SecurityCopy {
  return locale === "en" ? EN : NB;
}
