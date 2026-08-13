/**
 * Legal pages, in both languages.
 *
 * These are the pages a visitor is asked to *agree* to. A consent banner in
 * English over a policy readable only in Norwegian is not informed consent —
 * GDPR art. 7(2) requires the request to be "in an intelligible and easily
 * accessible form, using clear and plain language", and art. 12(1) ties that to
 * the data subject, not to the publisher's home market. So the English versions
 * are not a nicety on these four pages specifically.
 *
 * Stored as sections rather than JSX because every legal page here has the same
 * shape — a title, an intro, then h2 blocks each holding paragraphs and
 * optional bullets. One renderer, and adding the next policy is data.
 *
 * The English text is a translation of the Norwegian, not a separate policy.
 * Where the two could drift into saying different things about what we collect,
 * they must not: `legal.test.ts` pins that both languages have the same section
 * count and the same bullet counts, so a paragraph cannot quietly go missing on
 * one side.
 */
import type { Locale } from "@/lib/i18n";

/**
 * An inline link inside a paragraph.
 *
 * Modelled rather than written as markup because these are load-bearing on a
 * legal page: the accessibility statement has to name the supervisory body and
 * link to the national register, and a translation that drops the anchor drops
 * the reader's route to complain.
 */
export interface LegalLink {
  before: string;
  href: string;
  text: string;
  after: string;
  external?: boolean;
}

export interface LegalBlock {
  h3?: string;
  body?: string;
  /** Bullets may use `backticks` for inline code, as the ARIA landmarks do. */
  bullets?: readonly string[];
  link?: LegalLink;
}

export interface LegalSection {
  h2: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDoc {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: readonly LegalSection[];
  /** Rendered as "Last updated"; kept as data so it cannot differ per language. */
  updated?: string;
}

const COOKIES_NB: LegalDoc = {
  title: "Informasjonskapsler (cookies)",
  metaTitle: "Cookies og informasjonskapsler · Digilist",
  metaDescription:
    "Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies: ingen sporing, ingen tredjepart, full GDPR-suverenitet.",
  intro:
    "Digilist benytter informasjonskapsler (cookies) og lignende teknologier for å sikre grunnleggende funksjonalitet, forbedre brukeropplevelsen og gi innsikt i hvordan tjenesten brukes.",
  sections: [
    {
      h2: "Hva er informasjonskapsler",
      blocks: [
        {
          body: "Informasjonskapsler er små tekstfiler som lagres på din enhet når du besøker en nettside. De brukes blant annet for å huske innstillinger, håndtere innlogging og sikre at tjenester fungerer som de skal.",
        },
      ],
    },
    {
      h2: "Hvilke typer informasjonskapsler brukes i Digilist",
      blocks: [
        {
          h3: "Nødvendige informasjonskapsler",
          body: "Disse er påkrevd for at Digilist skal fungere korrekt. De brukes blant annet til:",
          bullets: [
            "innlogging og autentisering",
            "sikkerhet og sesjonshåndtering",
            "gjennomføring av bookingflyt",
          ],
        },
        { body: "Disse informasjonskapslene kan ikke slås av." },
        {
          h3: "Analyse og statistikk (valgfritt)",
          body: "Digilist kan benytte analyseverktøy for å samle anonymisert informasjon om bruk av tjenesten, som for eksempel:",
          bullets: [
            "antall besøk",
            "hvilke sider som benyttes",
            "generell bruksmønster",
          ],
        },
        {
          body: "Disse opplysningene brukes kun til å forbedre tjenesten og deles ikke for markedsføringsformål. Slike informasjonskapsler settes kun dersom du samtykker.",
        },
      ],
    },
    {
      h2: "Informasjonskapsler fra tredjeparter",
      blocks: [
        {
          body: "Ved bruk av betalingsløsninger eller andre integrasjoner kan tredjeparts informasjonskapsler benyttes, for eksempel i forbindelse med betaling. Disse leverandørene behandler informasjon i henhold til sine egne personvernerklæringer og gjeldende regelverk.",
        },
      ],
    },
    {
      h2: "Samtykke til bruk av informasjonskapsler",
      blocks: [
        {
          body: "Når du besøker Digilist første gang, blir du bedt om å ta stilling til bruk av informasjonskapsler som ikke er strengt nødvendige. Du kan når som helst endre eller trekke tilbake ditt samtykke via innstillinger i nettleseren eller gjennom tilgjengelige valg i løsningen.",
        },
      ],
    },
    {
      h2: "Hvordan slette eller blokkere informasjonskapsler",
      blocks: [
        {
          body: "Du kan selv administrere eller slette informasjonskapsler via innstillingene i din nettleser. Vær oppmerksom på at blokkering av nødvendige informasjonskapsler kan føre til at deler av Digilist ikke fungerer som forutsatt.",
        },
      ],
    },
  ],
};

const COOKIES_EN: LegalDoc = {
  title: "Cookies",
  metaTitle: "Cookie policy · Digilist",
  metaDescription:
    "How Digilist uses cookies. Privacy-first analytics with no cookies: no tracking, no third parties, full GDPR sovereignty.",
  intro:
    "Digilist uses cookies and similar technologies to provide basic functionality, improve the experience of using the service, and understand how the service is used.",
  sections: [
    {
      h2: "What cookies are",
      blocks: [
        {
          body: "Cookies are small text files stored on your device when you visit a website. Among other things, they are used to remember settings, handle sign-in, and make sure services work as they should.",
        },
      ],
    },
    {
      h2: "Which cookies Digilist uses",
      blocks: [
        {
          h3: "Strictly necessary cookies",
          body: "These are required for Digilist to work correctly. They are used for:",
          bullets: [
            "sign-in and authentication",
            "security and session handling",
            "completing a booking",
          ],
        },
        { body: "These cookies cannot be turned off." },
        {
          h3: "Analytics and statistics (optional)",
          body: "Digilist may use analytics tools to collect anonymised information about how the service is used, such as:",
          bullets: [
            "the number of visits",
            "which pages are used",
            "general patterns of use",
          ],
        },
        {
          body: "This information is used only to improve the service and is not shared for marketing purposes. These cookies are set only if you consent to them.",
        },
      ],
    },
    {
      h2: "Third-party cookies",
      blocks: [
        {
          body: "When payment services or other integrations are used, third-party cookies may be set — for example as part of a payment. Those providers process information under their own privacy policies and the applicable regulations.",
        },
      ],
    },
    {
      h2: "Consent to the use of cookies",
      blocks: [
        {
          body: "The first time you visit Digilist, you are asked to decide about cookies that are not strictly necessary. You can change or withdraw your consent at any time through your browser settings or through the choices available in the service.",
        },
      ],
    },
    {
      h2: "How to delete or block cookies",
      blocks: [
        {
          body: "You can manage or delete cookies yourself through your browser settings. Note that blocking strictly necessary cookies may stop parts of Digilist from working as intended.",
        },
      ],
    },
  ],
};

export const COOKIE_POLICY = { nb: COOKIES_NB, en: COOKIES_EN } as const;

const A11Y_NB: LegalDoc = {
  title: "Tilgjengelighetserklæring",
  metaTitle: "Tilgjengelighetserklæring · Digilist | WCAG 2.1 AA",
  metaDescription:
    "Digilists tilgjengelighetserklæring: standard, status, hvordan vi tester, og hvordan du gir tilbakemelding eller klager til Digitaliseringsdirektoratet (uustatus.no).",
  intro:
    "Denne erklæringen beskriver hvordan Digilist arbeider med universell utforming av digilist.no og bookingplattformen, hvilken standard vi følger, og hvordan du gir tilbakemelding eller klager dersom du støter på et tilgjengelighetsproblem.",
  updated: "Sist oppdatert: 11.08.2026",
  sections: [
    {
      h2: "1. Standard og regelverk",
      blocks: [
        {
          body: "Digilist utvikles etter WCAG 2.1 nivå AA, som er kravet i forskrift om universell utforming av IKT, hjemlet i likestillings- og diskrimineringsloven § 17a. Standarden gjelder både digilist.no og bookingplattformen som tilbys kommuner og utleiere.",
        },
      ],
    },
    {
      h2: "2. Hvordan vi tester",
      blocks: [
        {
          body: "Tilgjengelighet inngår i den vanlige utviklingsprosessen, ikke som en engangskontroll:",
          bullets: [
            "automatiserte axe-core-revisjoner kjøres på hvert deploy",
            "overskriftshierarki, landemerker (som `main` og `nav`) og alt-tekster kontrolleres for hver side",
            "tastaturnavigasjon og synlig fokusmarkering testes på nye komponenter",
          ],
        },
        {
          body: "Automatisert testing fanger ikke alt. Vi retter feil fortløpende etter hvert som de oppdages, enten av oss selv eller gjennom tilbakemeldinger fra brukere.",
        },
      ],
    },
    {
      h2: "3. Kjente avvik",
      blocks: [
        {
          body: "Vi kjenner ikke til vesentlige, uløste avvik fra WCAG 2.1 AA på digilist.no per publiseringsdato under. Enkeltstående feil kan likevel forekomme, særlig i innhold levert av tredjepart (for eksempel bilder eller tekst fra utleiere i markedsplassen). Oppdager du et problem, hører vi gjerne fra deg – se kontaktpunkt under.",
        },
      ],
    },
    {
      h2: "4. Tilbakemelding og klage",
      blocks: [
        {
          link: {
            before: "Har du støtt på et tilgjengelighetsproblem på digilist.no, kan du gi tilbakemelding til ",
            href: "mailto:kontakt@digilist.no",
            text: "kontakt@digilist.no",
            after: ". Beskriv gjerne hvilken side, hva som skjedde, og hvilket hjelpemiddel du eventuelt brukte.",
          },
        },
        {
          link: {
            before: "Er du ikke fornøyd med svaret du får, kan du klage til Digitaliseringsdirektoratet, som fører tilsyn med regelverket om universell utforming av IKT. Tilsynet forvalter det nasjonale registeret for tilgjengelighetserklæringer på ",
            href: "https://uustatus.no",
            text: "uustatus.no",
            after: ".",
            external: true,
          },
        },
      ],
    },
  ],
};

const A11Y_EN: LegalDoc = {
  title: "Accessibility statement",
  metaTitle: "Accessibility statement · Digilist | WCAG 2.1 AA",
  metaDescription:
    "Digilist's accessibility statement: the standard we follow, current status, how we test, and how to give feedback or complain to the Norwegian Digitalisation Agency (uustatus.no).",
  intro:
    "This statement describes how Digilist works on accessibility for digilist.no and the booking platform, which standard we follow, and how to give feedback or complain if you run into an accessibility problem.",
  updated: "Last updated: 11 August 2026",
  sections: [
    {
      h2: "1. Standard and regulation",
      blocks: [
        {
          body: "Digilist is built to WCAG 2.1 level AA, the level required by the Norwegian regulation on universal design of ICT, which rests on section 17a of the Equality and Anti-Discrimination Act. The standard applies to digilist.no and to the booking platform offered to public bodies and operators alike.",
        },
      ],
    },
    {
      h2: "2. How we test",
      blocks: [
        {
          body: "Accessibility is part of ordinary development, not a one-off check:",
          bullets: [
            "automated axe-core audits run on every deploy",
            "heading order, landmarks (such as `main` and `nav`) and alt text are checked on every page",
            "keyboard navigation and a visible focus indicator are tested on new components",
          ],
        },
        {
          body: "Automated testing does not catch everything. We fix problems as they are found, whether we find them ourselves or a user reports them.",
        },
      ],
    },
    {
      h2: "3. Known deviations",
      blocks: [
        {
          body: "We know of no significant unresolved deviations from WCAG 2.1 AA on digilist.no as of the date below. Individual faults may still occur, particularly in content supplied by third parties — images or text from operators in the marketplace, for example. If you find a problem we would like to hear about it; the contact point is below.",
        },
      ],
    },
    {
      h2: "4. Feedback and complaints",
      blocks: [
        {
          link: {
            before: "If you have run into an accessibility problem on digilist.no, you can send feedback to ",
            href: "mailto:kontakt@digilist.no",
            text: "kontakt@digilist.no",
            after: ". Please say which page it was, what happened, and which assistive technology you were using, if any.",
          },
        },
        {
          link: {
            before: "If you are not satisfied with the response, you can complain to the Norwegian Digitalisation Agency, which supervises the rules on universal design of ICT. The agency maintains the national register of accessibility statements at ",
            href: "https://uustatus.no",
            text: "uustatus.no",
            after: ".",
            external: true,
          },
        },
      ],
    },
  ],
};

export const ACCESSIBILITY_STATEMENT = { nb: A11Y_NB, en: A11Y_EN } as const;

const PRIVACY_NB: LegalDoc = {
    title: "Personvernerklæring",
    metaTitle: "Personvernerklæring – Digilist",
    metaDescription: "Slik behandler Digilist personopplysninger. GDPR-kompatibel, ISO 27701-sertifisert, data lagret i Norge og EU.",
    intro: "Denne personvernerklæringen beskriver hvordan Digilist behandler personopplysninger i forbindelse med bruk av tjenesten. Erklæringen gir informasjon du har krav på når Digilist samler inn personopplysninger, samt generell informasjon om hvordan opplysningene behandles.",
    updated: "Sist oppdatert: 07.01.2026",
    sections: [
      {
        h2: "1. Behandlingsansvarlig",
        blocks: [
          {
            body: "Behandlingsansvarlig er den virksomheten eller organisasjonen som tilbyr utleie av lokaler eller ressurser gjennom Digilist, og som bestemmer formålet med behandlingen av personopplysninger og hvilke hjelpemidler som benyttes.",
          },
          {
            body: "Hvem som er behandlingsansvarlig for en konkret booking fremgår av informasjonen knyttet til det aktuelle utleieobjektet.",
          },
        ],
      },
      {
        h2: "2. Databehandler",
        blocks: [
          {
            body: "Digilist fungerer som teknisk plattform og er databehandler på vegne av utleier (behandlingsansvarlig).",
          },
          {
            body: "Databehandler:",
          },
          {
            body: "Xala Technologies AS",
          },
          {
            body: "Organisasjonsnummer: 920 972 454",
          },
          {
            body: "Digilist behandler personopplysninger kun i henhold til inngåtte databehandleravtaler og gjeldende regelverk.",
          },
        ],
      },
      {
        h2: "3. Underleverandører og drift",
        blocks: [
          {
            body: "Digilist benytter underleverandører for drift, lagring og teknisk infrastruktur. Personopplysninger lagres på servere lokalisert innen EU/EØS og behandles i samsvar med gjeldende personvernregler.",
          },
          {
            body: "Underleverandører kan blant annet benyttes til:",
            bullets: [
              "drift og hosting",
              "betalingsformidling",
              "utsendelse av varsler",
            ],
          },
          {
            body: "Alle underleverandører er underlagt databehandleravtaler som sikrer tilfredsstillende informasjonssikkerhet.",
          },
        ],
      },
      {
        h2: "4. Hvordan og hvorfor samles personopplysninger inn",
        blocks: [
          {
            body: "Når du oppretter en bruker i Digilist eller benytter tjenesten for å booke lokaler, blir du bedt om å oppgi personopplysninger som lagres i løsningen. Ved bruk av tilgjengelige innloggingsmetoder samtykker du til at Digilist kan motta nødvendige identitets- og kontaktopplysninger.",
          },
          {
            body: "Enkelte utleiere kan kreve ytterligere autentisering for å:",
            bullets: [
              "bekrefte identitet",
              "verifisere alder",
              "sikre korrekt fakturering",
            ],
          },
          {
            body: "Personopplysninger benyttes blant annet for å:",
            bullets: [
              "muliggjøre kontakt mellom leietaker og utleier",
              "gjennomføre og administrere bookinger",
              "håndtere betaling og fakturering",
              "sende varsler knyttet til booking og tilgang",
              "sikre sporbarhet og etterlevelse av lovpålagte krav",
            ],
          },
          {
            body: "Digilist vil aldri selge eller leie ut personopplysninger til tredjepart for markedsføringsformål.",
          },
        ],
      },
      {
        h2: "5. Deling av personopplysninger",
        blocks: [
          {
            body: "Kontaktopplysninger deles med aktuell utleier i forbindelse med booking.",
          },
          {
            body: "Betalingsopplysninger behandles av godkjente betalingsleverandører og deles ikke med utleier utover det som er nødvendig for fakturering og oppfølging.",
          },
        ],
      },
      {
        h2: "6. Hvilke personopplysninger behandles",
        blocks: [
          {
            body: "For å kunne bruke Digilist kan følgende opplysninger behandles:",
            bullets: [
              "navn",
              "mobilnummer",
              "e-postadresse",
              "alder eller alderskategori",
              "adresse (der dette kreves av utleier)",
              "organisasjonsnummer (for organisasjoner)",
              "booking- og transaksjonshistorikk",
            ],
          },
          {
            body: "Betalingsopplysninger behandles av eksterne betalingsleverandører i henhold til deres egne vilkår og sikkerhetsrutiner.",
          },
        ],
      },
      {
        h2: "7. Informasjonskapsler (cookies)",
        blocks: [
          {
            body: "Digilist benytter informasjonskapsler og lignende teknologier for å sikre funksjonalitet og forbedre brukeropplevelsen. Dette kan blant annet omfatte:",
            bullets: [
              "tekniske sesjonskapsler",
              "midlertidige identifikatorer knyttet til pågående bestillinger",
              "analyse av bruksmønstre",
            ],
          },
          {
            body: "Informasjonskapsler benyttes ikke til markedsføring uten særskilt samtykke.",
          },
        ],
      },
      {
        h2: "8. Lagringstid",
        blocks: [
          {
            body: "Opplysninger knyttet til bookinger lagres så lenge det er nødvendig for å:",
            bullets: [
              "oppfylle avtaleforpliktelser",
              "oppfylle lovpålagte krav, herunder regnskaps- og arkivplikt",
            ],
          },
          {
            body: "Brukeropplysninger lagres frem til brukeren selv sletter sin konto, med mindre lengre lagring er påkrevd etter lov.",
          },
        ],
      },
      {
        h2: "9. Rett til innsyn",
        blocks: [
          {
            body: "Som innlogget bruker har du rett til innsyn i hvilke personopplysninger som er lagret om deg. Dette kan gjøres via din brukerkonto.",
          },
        ],
      },
      {
        h2: "10. Dataportabilitet",
        blocks: [
          {
            body: "Du har rett til å få utlevert personopplysninger du har gitt Digilist i et strukturert og maskinlesbart format, der dette er teknisk mulig og rettslig grunnlag foreligger.",
          },
        ],
      },
      {
        h2: "11. Retting, sletting og begrensning",
        blocks: [
          {
            body: "Du kan selv rette uriktige eller ufullstendige opplysninger via din brukerkonto.",
          },
          {
            body: "Du kan også be om sletting av konto og personopplysninger. Enkelte opplysninger kan ikke slettes umiddelbart dersom lagring er påkrevd etter lov.",
          },
        ],
      },
      {
        h2: "12. Samtykke",
        blocks: [
          {
            body: "Ved å ta i bruk Digilist samtykker du til behandling av personopplysninger som beskrevet i denne erklæringen. Dersom du ikke samtykker, kan du benytte tjenesten til å søke og se tilgjengelighet, men ikke gjennomføre booking.",
          },
          {
            body: "Samtykke kan trekkes tilbake når som helst ved å slette brukerkontoen.",
          },
        ],
      },
      {
        h2: "13. Endringer i personvernerklæringen",
        blocks: [
          {
            body: "Digilist kan oppdatere denne personvernerklæringen ved endringer i tjenesten eller regelverket. Oppdatert versjon publiseres på nettsiden.",
          },
        ],
      },
    ],
  };

const PRIVACY_EN: LegalDoc = {
  title: "Privacy policy",
  metaTitle: "Privacy policy – Digilist",
  metaDescription:
    "How Digilist processes personal data. GDPR compliant, ISO 27701 certified, data stored in Norway and the EU.",
  intro:
    "This privacy policy describes how Digilist processes personal data in connection with use of the service. It gives you the information you are entitled to when Digilist collects personal data, together with general information about how that data is handled.",
  updated: "Last updated: 7 January 2026",
  sections: [
    {
      h2: "1. Data controller",
      blocks: [
        {
          body: "The data controller is the business or organisation that offers venues or resources for rent through Digilist, and that decides the purpose of processing personal data and the means used to do it.",
        },
        {
          body: "Who the controller is for a particular booking is stated in the information attached to that venue.",
        },
      ],
    },
    {
      h2: "2. Data processor",
      blocks: [
        {
          body: "Digilist acts as the technical platform and is a data processor on behalf of the operator, who is the controller.",
        },
        { body: "Data processor:" },
        { body: "Xala Technologies AS" },
        { body: "Company registration number: 920 972 454" },
        {
          body: "Digilist processes personal data only under the data processing agreements in place and the applicable regulations.",
        },
      ],
    },
    {
      h2: "3. Sub-processors and operations",
      blocks: [
        {
          body: "Digilist uses sub-processors for operations, storage and technical infrastructure. Personal data is stored on servers located within the EU/EEA and processed in line with the applicable data protection rules.",
        },
        {
          body: "Sub-processors may be used for, among other things:",
          bullets: [
            "operations and hosting",
            "payment processing",
            "sending notifications",
          ],
        },
        {
          body: "All sub-processors are bound by data processing agreements that require adequate information security.",
        },
      ],
    },
    {
      h2: "4. How and why personal data is collected",
      blocks: [
        {
          body: "When you create a user in Digilist, or use the service to book a venue, you are asked for personal data that is stored in the system. By using one of the available sign-in methods you consent to Digilist receiving the identity and contact details it needs.",
        },
        {
          body: "Some operators may require further authentication in order to:",
          bullets: [
            "confirm identity",
            "verify age",
            "ensure correct invoicing",
          ],
        },
        {
          body: "Personal data is used, among other things, to:",
          bullets: [
            "make contact possible between the person renting and the operator",
            "carry out and administer bookings",
            "handle payment and invoicing",
            "send notifications about a booking and about access",
            "provide traceability and meet statutory requirements",
          ],
        },
        {
          body: "Digilist will never sell or rent personal data to third parties for marketing purposes.",
        },
      ],
    },
    {
      h2: "5. Sharing personal data",
      blocks: [
        {
          body: "Contact details are shared with the relevant operator in connection with a booking.",
        },
        {
          body: "Payment details are handled by approved payment providers and are not shared with the operator beyond what is necessary for invoicing and follow-up.",
        },
      ],
    },
    {
      h2: "6. Which personal data is processed",
      blocks: [
        {
          body: "To use Digilist, the following data may be processed:",
          bullets: [
            "name",
            "mobile number",
            "email address",
            "age or age bracket",
            "address, where the operator requires it",
            "company registration number, for organisations",
            "booking and transaction history",
          ],
        },
        {
          body: "Payment details are handled by external payment providers under their own terms and security procedures.",
        },
      ],
    },
    {
      h2: "7. Cookies",
      blocks: [
        {
          body: "Digilist uses cookies and similar technologies to provide functionality and improve the experience of using the service. This may include:",
          bullets: [
            "technical session cookies",
            "temporary identifiers tied to a booking in progress",
            "analysis of usage patterns",
          ],
        },
        {
          body: "Cookies are not used for marketing without separate consent.",
        },
      ],
    },
    {
      h2: "8. How long data is kept",
      blocks: [
        {
          body: "Data connected to bookings is kept for as long as it is needed in order to:",
          bullets: [
            "meet contractual obligations",
            "meet statutory requirements, including accounting and archiving duties",
          ],
        },
        {
          body: "User data is kept until the user deletes their own account, unless longer storage is required by law.",
        },
      ],
    },
    {
      h2: "9. Right of access",
      blocks: [
        {
          body: "As a signed-in user you have the right to see which personal data is stored about you. You can do this through your user account.",
        },
      ],
    },
    {
      h2: "10. Data portability",
      blocks: [
        {
          body: "You have the right to receive the personal data you have given Digilist in a structured, machine-readable format, where that is technically possible and there is a legal basis for it.",
        },
      ],
    },
    {
      h2: "11. Rectification, erasure and restriction",
      blocks: [
        {
          body: "You can correct inaccurate or incomplete data yourself through your user account.",
        },
        {
          body: "You can also ask for your account and personal data to be deleted. Some data cannot be deleted immediately where storage is required by law.",
        },
      ],
    },
    {
      h2: "12. Consent",
      blocks: [
        {
          body: "By using Digilist you consent to the processing of personal data described in this policy. If you do not consent, you can still use the service to search and see availability, but not to complete a booking.",
        },
        {
          body: "Consent can be withdrawn at any time by deleting your user account.",
        },
      ],
    },
    {
      h2: "13. Changes to this privacy policy",
      blocks: [
        {
          body: "Digilist may update this privacy policy when the service or the regulations change. The updated version is published on the website.",
        },
      ],
    },
  ],
};

export const PRIVACY_POLICY = { nb: PRIVACY_NB, en: PRIVACY_EN } as const;



export function legalDoc(
  doc: { nb: LegalDoc; en: LegalDoc },
  locale: Locale,
): LegalDoc {
  return locale === "en" ? doc.en : doc.nb;
}
