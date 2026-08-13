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

const TERMS_NB: LegalDoc = {
  title: "Salgsvilkår",
  metaTitle: "Salgsvilkår – Digilist",
  metaDescription:
    "Vilkår for bruk av Digilist sine tjenester: bestilling, betaling, avbestilling, angrerett og ansvar mellom leietaker og utleier.",
  intro: "Vilkår for bruk av Digilist sine tjenester",
  updated: "Sist publisert: 07.01.2026",
  sections: [
    {
      h2: "1. Om Digilist og utleieaktører",
      blocks: [
        {
          link: {
            before: "Digilist (",
            href: "https://www.digilist.no",
            text: "www.digilist.no",
            after: ") er en digital portal som formidler leie av lokaler og ressurser fra flere utleieaktører. Hver utleier er ansvarlig for sine utleieobjekter, inkludert drift, vedlikehold, tilgjengelighet, priser og egne vilkår. Når en booking blir bekreftet, kan utleier gi supplerende vilkår for bruk. Du må gjøre deg kjent med vilkårene før du bekrefter leie.",
          },
        },
      ],
    },
    {
      h2: "2. Bestilling og bekreftelse",
      blocks: [
        {
          body: "En booking kan være enten direkte bekreftet eller sendes inn som forespørsel for godkjenning, avhengig av utleiers regler for det aktuelle utleieobjektet. Booking regnes som bindende når den er bekreftet av utleier, eller når betaling/aksept er gjennomført i henhold til flyten som gjelder for utleieobjektet.",
        },
      ],
    },
    {
      h2: "3. Bruk av reservert leieobjekt",
      blocks: [
        {
          body: "Dersom leietaker ikke benytter et reservert leieobjekt i avtalt tidsrom, kan fullt leiebeløp belastes. Dersom leietaker benytter leieobjektet utover avtalt tid eller leverer tilbake utstyr/leieobjekt for sent, kan leietaker belastes for overtid/ekstra brukstid etter utleiers satser og regler.",
        },
      ],
    },
    {
      h2: "4. Avbestilling og kansellering",
      blocks: [
        {
          h3: "4.1 Forespørsler som venter på godkjenning",
          body: "Forespørsler som ikke er godkjent kan kanselleres av leietaker frem til utleier har behandlet forespørselen.",
        },
        {
          h3: "4.2 Godkjente bookinger",
          body: "Utleier kan ha egne vilkår for avbestilling. Dersom booking er godkjent, kan kansellering kreve godkjenning fra utleier og eventuelle gebyrer kan gjelde i tråd med utleiers regler.",
        },
        {
          h3: "4.3 Manglende avbestillingsvilkår",
          body: "Dersom utleier ikke har oppgitt avbestillingsvilkår, kan leietaker normalt kansellere før leiestart uten å bli belastet for leie. Der utleier har oppgitt egne vilkår, gjelder disse.",
        },
        {
          h3: "4.4 Force majeure",
          body: "Utleier og leietaker kan avbestille en reservasjon dersom gjennomføring hindres av forhold utenfor partenes kontroll, og som ikke med rimelighet kunne forutsees eller unngås (force majeure).",
        },
      ],
    },
    {
      h2: "5. Betaling",
      blocks: [
        {
          body: "Betaling i Digilist kan skje enten som forskuddsbetaling (kort eller Vipps) eller etterskuddsvis via faktura. Hvilken betalingsmetode som gjelder bestemmes av utleier for hvert utleieobjekt. Ved spørsmål om faktura eller betalingsbetingelser, må leietaker kontakte utleier.",
        },
      ],
    },
    {
      h2: "6. Kortbetaling",
      blocks: [
        {
          body: "Kortbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Kortbetaling behandles via betalingstjenesteleverandør (for eksempel Stripe). Betaling kan gjennomføres med vanlige debit- og kredittkort. Betalingsdata håndteres kryptert i henhold til leverandørens sikkerhetsmekanismer.",
        },
      ],
    },
    {
      h2: "7. Betaling med Vipps",
      blocks: [
        {
          body: "Vippsbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Ved Vipps-betaling kan beløpet reserveres i henhold til Vipps sine standardrutiner og overføres i tråd med avtalte betingelser mellom utleier og betalingsleverandør.",
        },
      ],
    },
    {
      h2: "8. Betaling med faktura",
      blocks: [
        {
          body: "Utleier kan ha egne rutiner for fakturering, inkludert tidspunkt for utsendelse, betalingsfrist, gebyrer og eventuell samlefakturering. Spørsmål om faktura, innhold, beløp eller betalingsstatus må rettes til utleier.",
        },
      ],
    },
    {
      h2: "9. Angrerett",
      blocks: [
        {
          body: "Ved leie av lokaler og tjenester knyttet til fritidsaktiviteter eller arrangement som leveres på et bestemt tidspunkt eller innenfor en bestemt periode, gjelder normalt ikke angrerett etter angrerettreglene. Utleier kan likevel ha egne vilkår. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes.",
        },
      ],
    },
    {
      h2: "10. Reklamasjon og ansvar",
      blocks: [
        {
          body: "Digilist er en digital formidlingsplattform som kobler leietaker og utleier. Digilist er ikke part i leieforholdet mellom utleier og leietaker, og leier ikke ut lokaler eller utstyr i eget navn. Eventuelle reklamasjoner, innsigelser og erstatningskrav knyttet til leieobjektet eller leieforholdet håndteres direkte mellom leietaker og utleier.",
        },
        {
          body: "Utleier er ansvarlig for at utleieobjektet beskrives korrekt, og at informasjon om tilstand, bruksområde og vilkår er oppdatert.",
        },
      ],
    },
    {
      h2: "11. Refusjon",
      blocks: [
        {
          body: "Utleier kan ha egne vilkår for refusjon, for eksempel dersom leieobjektet ikke er i forventet stand eller ikke kan benyttes som avtalt. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes.",
        },
      ],
    },
    {
      h2: "12. Utestengelse fra Digilist",
      blocks: [
        {
          body: "Bruk av Digilist forutsetter at vilkårene overholdes, samt gjeldende lov og forskrift. Digilist kan begrense eller stenge en brukers tilgang til hele eller deler av tjenesten ved brudd på vilkårene, misbruk, forsøk på svindel, eller handlinger som kan skade tjenestens integritet eller andre brukere. Bruker kan når som helst avslutte bruk av tjenesten ved å stenge sin konto der dette tilbys.",
        },
      ],
    },
    {
      h2: "13. Utestengelse hos enkeltutleier",
      blocks: [
        {
          body: "Utleiere kan ha egne rutiner for å avvise eller utestenge leietakere fra sine utleieobjekter, basert på interne retningslinjer eller tidligere kundeforhold. Slik utestengelse gjelder kun for den aktuelle utleieren.",
        },
      ],
    },
  ],
};

const TERMS_EN: LegalDoc = {
  title: "Terms of sale",
  metaTitle: "Terms of sale – Digilist",
  metaDescription:
    "Terms for using Digilist: booking, payment, cancellation, right of withdrawal, and liability between the person renting and the operator.",
  intro: "Terms for using the Digilist services",
  updated: "Last published: 7 January 2026",
  sections: [
    {
      h2: "1. About Digilist and the operators",
      blocks: [
        {
          link: {
            before: "Digilist (",
            href: "https://www.digilist.no",
            text: "www.digilist.no",
            after: ") is a digital portal that arranges the rental of venues and resources from a number of operators. Each operator is responsible for its own venues, including running them, maintenance, availability, prices and its own terms. When a booking is confirmed, the operator may add further terms of use. You must familiarise yourself with those terms before you confirm a rental.",
          },
        },
      ],
    },
    {
      h2: "2. Booking and confirmation",
      blocks: [
        {
          body: "A booking is either confirmed directly or submitted as a request for approval, depending on the operator's rules for that venue. A booking is binding once the operator has confirmed it, or once payment or acceptance has gone through under the flow that applies to that venue.",
        },
      ],
    },
    {
      h2: "3. Use of a reserved venue",
      blocks: [
        {
          body: "If the person renting does not use a reserved venue during the agreed period, the full rental amount may be charged. If they use the venue beyond the agreed time, or return equipment or the venue late, they may be charged for the extra time at the operator's rates and under its rules.",
        },
      ],
    },
    {
      h2: "4. Cancellation",
      blocks: [
        {
          h3: "4.1 Requests awaiting approval",
          body: "A request that has not been approved can be cancelled by the person renting until the operator has dealt with it.",
        },
        {
          h3: "4.2 Approved bookings",
          body: "The operator may have its own cancellation terms. Once a booking is approved, cancelling it may require the operator's approval, and fees may apply under the operator's rules.",
        },
        {
          h3: "4.3 Where no cancellation terms are given",
          body: "If the operator has not stated any cancellation terms, the person renting can normally cancel before the rental begins without being charged. Where the operator has stated its own terms, those apply.",
        },
        {
          h3: "4.4 Force majeure",
          body: "Either the operator or the person renting may cancel a reservation if it is prevented by circumstances outside the parties' control that could not reasonably have been foreseen or avoided (force majeure).",
        },
      ],
    },
    {
      h2: "5. Payment",
      blocks: [
        {
          body: "Payment in Digilist is made either in advance (by card or through the national payment app) or afterwards by invoice. Which method applies is decided by the operator for each venue. For questions about an invoice or payment terms, the person renting must contact the operator.",
        },
      ],
    },
    {
      h2: "6. Card payment",
      blocks: [
        {
          body: "Card payment is taken after the rental is approved, where the venue requires approval. Where it does not, payment may be taken immediately at the time of booking. Card payments are handled by a payment service provider, such as Stripe. Ordinary debit and credit cards can be used. Payment data is handled in encrypted form under that provider's security mechanisms.",
        },
      ],
    },
    {
      h2: "7. Payment with Vipps",
      blocks: [
        {
          body: "Payment with Vipps, the Norwegian payment app, is taken after the rental is approved, where the venue requires approval. Where it does not, payment may be taken immediately at the time of booking. The amount may be reserved under Vipps's standard procedures and transferred under the terms agreed between the operator and the payment provider.",
        },
      ],
    },
    {
      h2: "8. Payment by invoice",
      blocks: [
        {
          body: "The operator may have its own invoicing procedures, including when invoices are sent, the payment deadline, fees and whether invoices are combined. Questions about an invoice, its contents, the amount or its payment status must be directed to the operator.",
        },
      ],
    },
    {
      h2: "9. Right of withdrawal",
      blocks: [
        {
          body: "For the rental of venues and services connected to leisure activities or events delivered at a specific time or within a specific period, the statutory right of withdrawal normally does not apply. The operator may nevertheless have its own terms. The person renting must familiarise themselves with the operator's terms before a booking is confirmed.",
        },
      ],
    },
    {
      h2: "10. Complaints and liability",
      blocks: [
        {
          body: "Digilist is a digital platform that connects the person renting with the operator. Digilist is not a party to the rental agreement between them, and does not rent out venues or equipment in its own name. Complaints, objections and claims for compensation relating to the venue or the rental are handled directly between the person renting and the operator.",
        },
        {
          body: "The operator is responsible for describing the venue correctly, and for keeping information about its condition, its intended use and its terms up to date.",
        },
      ],
    },
    {
      h2: "11. Refunds",
      blocks: [
        {
          body: "The operator may have its own refund terms — for example where the venue is not in the expected condition or cannot be used as agreed. The person renting must familiarise themselves with the operator's terms before a booking is confirmed.",
        },
      ],
    },
    {
      h2: "12. Exclusion from Digilist",
      blocks: [
        {
          body: "Use of Digilist requires that these terms are followed, along with the applicable law and regulations. Digilist may restrict or close a user's access to all or part of the service in the event of a breach of these terms, misuse, attempted fraud, or actions that could harm the integrity of the service or other users. A user may stop using the service at any time by closing their account, where that option is offered.",
        },
      ],
    },
    {
      h2: "13. Exclusion by an individual operator",
      blocks: [
        {
          body: "Operators may have their own procedures for refusing or excluding people from their venues, based on internal guidelines or a previous customer relationship. Such an exclusion applies only to that operator.",
        },
      ],
    },
  ],
};

export const TERMS_OF_SALE = { nb: TERMS_NB, en: TERMS_EN } as const;




export function legalDoc(
  doc: { nb: LegalDoc; en: LegalDoc },
  locale: Locale,
): LegalDoc {
  return locale === "en" ? doc.en : doc.nb;
}
