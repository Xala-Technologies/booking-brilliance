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
  metaTitle: "Cookie policy · Digilist | Privacy-first, no tracking",
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
    "Digilists tilgjengelighetserklæring: standard (WCAG 2.1 AA), hvordan vi tester, og hvordan du gir tilbakemelding eller klager via uustatus.no.",
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
    "Digilist's accessibility statement: the standard we follow, current status, how we test, and how to give feedback or complain via uustatus.no.",
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
    "Salgsvilkår for Digilist-abonnement og bruk av plattformen: parter, betaling, oppsigelse, levering, angrerett, retur, booking og ansvar.",
  intro: "Vilkår for kjøp av Digilist-abonnement og bruk av plattformen",
  updated: "Sist publisert: 23.08.2026",
  sections: [
    {
      h2: "1. Parter",
      blocks: [
        {
          body: "Salgsvilkårene gjelder mellom Xala Technologies AS (org.nr. 920 972 454, Nesbruveien 75, 1394 Nesbru, kontakt@digilist.no, telefon +47 96 66 50 01), heretter «Digilist», og den som kjøper eller bruker tjenesten, heretter «kunden». På markedsplassen kan det i tillegg være leieforhold mellom utleier og leietaker. Digilist er ikke part i slike leieforhold.",
        },
        {
          body: "Avtalen reguleres av norsk rett, herunder avtaleloven, markedsføringsloven og — der kunden er forbruker — angrerettloven og forbrukerkjøpsloven. Offentlige kunder inngår avtale etter gjeldende anskaffelsesregler, for eksempel SSA-L.",
        },
      ],
    },
    {
      h2: "2. Om Digilist",
      blocks: [
        {
          link: {
            before: "Digilist (",
            href: "https://www.digilist.no",
            text: "www.digilist.no",
            after: ") er en digital plattform for booking og administrasjon av utleie. Plattformen kan brukes til å finne og booke lokaler og ressurser, og til å administrere utleie som utleier eller kommune. Hver utleier er ansvarlig for sine utleieobjekter, inkludert drift, vedlikehold, tilgjengelighet, priser og egne vilkår.",
          },
        },
      ],
    },
    {
      h2: "3. Hva Digilist selger",
      blocks: [
        {
          body: "Digilist selger abonnement på plattformen og tilhørende administrative tjenester, som kalender, booking, rapportering, integrasjoner og brukeradministrasjon. Pris og omfang fremgår av tilbud, prisside (digilist.no/priser) eller avtale.",
        },
        {
          body: "Digilist behandler ikke betalinger på vegne av kunder for leieforhold mellom leietaker og utleier. Digilist er ikke betalingsformidler, holder ikke midler fra leie og tar ikke imot leieinnbetalinger på vegne av utleier. Eventuelle betalingsløsninger i plattformen er tekniske verktøy som kobles til utleiers egne avtaler med betalingsleverandører.",
        },
        {
          body: "Hver kunde må selv skaffe og konfigurere egen betalingsløsning med egne credentials (for eksempel merchant-nummer, API-nøkler og avtale med betalingsleverandør) for å ta imot betaling i sin tenant. Digilist tilbyr teknisk integrasjon mot slike løsninger, men kunden inngår og opprettholder betalingsavtalen direkte med leverandøren.",
        },
      ],
    },
    {
      h2: "4. Regulatorisk status og betalingstjenester",
      blocks: [
        {
          body: "Xala Technologies AS er verken registrert som betalingsforetak, e-pengeforetak eller på annen måte autorisert av Finanstilsynet til å yte betalingstjenester etter finansavtaleloven. Digilist yter ikke regulerte betalingstjenester som innebærer mottak, holding eller utbetaling av betalingsmidler på vegne av tredjeparter.",
        },
        {
          body: "Ved leiebetalinger i plattformen mottas betaling direkte av utleier (kunden) gjennom utleiers egen merchant-avtale med betalingsleverandør, for eksempel Vipps MobilePay eller kortbetaling. Digilist er ikke part i betalingstransaksjonen, disponerer ikke utleiers innbetalinger og deler ikke i leieinntektene. Dette er i tråd med Vipps MobilePay sine krav om at mottaker av betaling må være bedriftskunde hos betalingsleverandøren.",
        },
        {
          body: "Kunder som vil ta imot betaling i sin tenant må selv oppfylle betalingsleverandørens krav, inkludert KYC og merchant-avtale, og konfigurere egne credentials i plattformen. Oppgjør skjer til kundens bankkonto knyttet til kundens org.nr., ikke til Digilist.",
        },
      ],
    },
    {
      h2: "5. Betaling for Digilist-abonnement",
      blocks: [
        {
          body: "Betaling for Digilist-abonnement skjer til Xala Technologies AS og kan skje med kort, Vipps MobilePay eller faktura, avhengig av hva som er avtalt. Abonnementspris, faktureringsperiode og betalingsfrist fremgår av tilbud eller avtale. Priser oppgis i norske kroner med mindre annet er avtalt. Merverdiavgift fremgår av faktura der dette er aktuelt.",
        },
        {
          body: "Kortbetaling og Vipps MobilePay behandles via godkjent betalingsleverandør. Betalingsdata håndteres kryptert i henhold til leverandørens sikkerhetsmekanismer. Krav til sterk kundeautentisering (SCA) etter PSD2 ivaretas gjennom betalingsleverandøren.",
        },
        {
          body: "Ved betaling med Vipps MobilePay gjelder i tillegg Vipps MobilePay sine vilkår og standardrutiner. Ved forsinket betaling kan tilgang til plattformen begrenses inntil betaling er mottatt. For næringsdrivende kunder kan forsinkelsesrente kreves etter forsinkelsesrenteloven.",
        },
      ],
    },
    {
      h2: "6. Bindingstid, oppsigelse og endring av abonnement",
      blocks: [
        {
          body: "Abonnement kan inngås som månedlig eller årlig avtale, eller som SSA-L-kontrakt for offentlig sektor. Bindingstid og oppsigelsesfrist fremgår av tilbud eller avtale. Pilot- og prøveperioder er uforpliktende med mindre annet er skriftlig avtalt.",
        },
        {
          body: "Kunden kan si opp abonnementet i henhold til avtalt oppsigelsesfrist. Oppsigelse sendes skriftlig til kontakt@digilist.no. Endring av abonnementsnivå, antall anlegg eller integrasjoner avtales skriftlig og kan medføre justering av pris fra avtalt tidspunkt. Ved oppsigelse avsluttes tilgang ved utløp av oppsigelsesfrist, med mindre annet følger av avtalen.",
        },
      ],
    },
    {
      h2: "7. Levering av tjenesten",
      blocks: [
        {
          body: "Digilist leveres som en nettbasert tjeneste (SaaS). Tilgang gis når avtale er inngått og nødvendig oppsett er fullført, med mindre annet er avtalt. Drift, oppdateringer og sikkerhetshåndtering inngår i abonnementet som beskrevet i tilbud eller avtale.",
        },
      ],
    },
    {
      h2: "8. Angrerett",
      blocks: [
        {
          body: "For næringsdrivende kunder gjelder normalt ikke angrerett etter angrerettloven. For forbrukere som inngår avtale om Digilist-abonnement som fjernsal, gjelder 14 dagers angrerett fra avtaleinngåelse, med mindre tjenesten er fullt ut levert med forbrukerens uttrykkelige samtykke før fristen utløp.",
        },
        {
          body: "Angrerett utøves ved skriftlig melding til kontakt@digilist.no innen fristen. Ved bruk av angreretten refunderes mottatt betaling uten unødig opphold, og senest innen 14 dager fra melding er mottatt, med mindre annet følger av loven.",
        },
        {
          body: "Ved leie av lokaler og tjenester knyttet til fritidsaktiviteter eller arrangement på bestemt tidspunkt, gjelder normalt ikke angrerett for selve leieforholdet, jf. angrerettloven. Utleier kan ha egne vilkår som leietaker må gjøre seg kjent med før booking bekreftes.",
        },
      ],
    },
    {
      h2: "9. Retur og refusjon",
      blocks: [
        {
          body: "Digilist er en digital tjeneste uten fysisk leveranse. «Retur» i forbindelse med abonnement innebærer oppsigelse og eventuell refusjon i henhold til angrerett, avtale og disse salgsvilkårene. Etter utløpt angrerett refunderes ikke allerede betalt abonnementsperiode, med mindre annet følger av avtalen eller ufravikelig lov.",
        },
        {
          body: "Refusjon i leieforhold reguleres av utleiers egne vilkår og håndteres direkte mellom leietaker og utleier. Digilist kan ikke refundere leiebetalinger, da slike betalinger ikke mottas av Digilist.",
        },
      ],
    },
    {
      h2: "10. Booking via plattformen",
      blocks: [
        {
          body: "En booking kan være enten direkte bekreftet eller sendes inn som forespørsel for godkjenning, avhengig av utleiers regler for det aktuelle utleieobjektet. Booking regnes som bindende når den er bekreftet av utleier, eller når aksept er gjennomført i henhold til flyten som gjelder for utleieobjektet.",
        },
      ],
    },
    {
      h2: "11. Betaling for leie",
      blocks: [
        {
          body: "Betaling for leie skjer mellom leietaker og utleier, ikke mellom leietaker og Digilist. Hvilken betalingsmetode som gjelder (for eksempel kort, Vipps MobilePay eller faktura) bestemmes av utleier for hvert utleieobjekt og håndteres gjennom utleiers egne betalingsavtaler og credentials i tenanten.",
        },
        {
          body: "Digilist formidler ikke leieinnbetalinger og er ikke ansvarlig for betaling, refusjon, faktura eller oppgjør i leieforholdet. Spørsmål om leie, faktura, beløp eller betalingsstatus rettes til utleier. Utleier er selv ansvarlig for å overholde regelverk som gjelder for utleiers betalingsvirksomhet.",
        },
      ],
    },
    {
      h2: "12. Avbestilling og kansellering av bookinger",
      blocks: [
        {
          h3: "12.1 Forespørsler som venter på godkjenning",
          body: "Forespørsler som ikke er godkjent kan kanselleres av leietaker frem til utleier har behandlet forespørselen.",
        },
        {
          h3: "12.2 Godkjente bookinger",
          body: "Utleier kan ha egne vilkår for avbestilling. Dersom booking er godkjent, kan kansellering kreve godkjenning fra utleier og eventuelle gebyrer kan gjelde i tråd med utleiers regler.",
        },
        {
          h3: "12.3 Manglende avbestillingsvilkår",
          body: "Dersom utleier ikke har oppgitt avbestillingsvilkår, kan leietaker normalt kansellere før leiestart uten å bli belastet for leie. Der utleier har oppgitt egne vilkår, gjelder disse.",
        },
        {
          h3: "12.4 Force majeure",
          body: "Utleier og leietaker kan avbestille en reservasjon dersom gjennomføring hindres av forhold utenfor partenes kontroll, og som ikke med rimelighet kunne forutsees eller unngås (force majeure).",
        },
      ],
    },
    {
      h2: "13. Bruk av reservert leieobjekt",
      blocks: [
        {
          body: "Dersom leietaker ikke benytter et reservert leieobjekt i avtalt tidsrom, kan fullt leiebeløp belastes av utleier. Dersom leietaker benytter leieobjektet utover avtalt tid eller leverer tilbake utstyr/leieobjekt for sent, kan leietaker belastes for overtid/ekstra brukstid etter utleiers satser og regler.",
        },
      ],
    },
    {
      h2: "14. Reklamasjon og ansvar",
      blocks: [
        {
          body: "Digilist er en digital plattform som kobler leietaker og utleier. Digilist er ikke part i leieforholdet mellom utleier og leietaker, og leier ikke ut lokaler eller utstyr i eget navn. Reklamasjoner, innsigelser og erstatningskrav knyttet til leieobjektet eller leieforholdet håndteres direkte mellom leietaker og utleier.",
        },
        {
          body: "Reklamasjon på Digilist-abonnement eller plattformens administrative tjenester rettes skriftlig til kontakt@digilist.no innen rimelig tid etter at mangelen ble oppdaget. For forbrukere gjelder reklamasjonsreglene i forbrukerkjøpsloven. Utleier er ansvarlig for at utleieobjektet beskrives korrekt, og at informasjon om tilstand, bruksområde og vilkår er oppdatert.",
        },
      ],
    },
    {
      h2: "15. Konfliktløsning",
      blocks: [
        {
          body: "Partene skal søke å løse tvister i minnelighet. Tvister som ikke løses i minnelighet, behandles etter norsk rett med Oslo tingrett som verneting, med mindre ufravikelig lov gir annet verneting.",
        },
        {
          body: "Forbrukere kan klage til Forbrukertilsynet (forbrukertilsynet.no) og bringe saken inn for Forbrukerklageutvalget (forbrukerklageutvalget.no) i henhold til reglene der. Spørsmål om utleiers betalingsløsning rettes til utleier og dennes betalingsleverandør, ikke til Digilist.",
        },
      ],
    },
    {
      h2: "16. Utestengelse fra Digilist",
      blocks: [
        {
          body: "Bruk av Digilist forutsetter at vilkårene overholdes, samt gjeldende lov og forskrift. Digilist kan begrense eller stenge en brukers tilgang ved brudd på vilkårene, misbruk, forsøk på svindel, eller handlinger som kan skade tjenestens integritet eller andre brukere. Kunden kan når som helst avslutte bruk av tjenesten ved å si opp abonnementet i henhold til avtalt oppsigelsesfrist.",
        },
      ],
    },
    {
      h2: "17. Utestengelse hos enkeltutleier",
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
  metaTitle: "Terms of sale and delivery · Digilist | Payment and booking",
  metaDescription:
    "Terms of sale for Digilist subscriptions and use of the platform: parties, payment, cancellation, delivery, right of withdrawal, returns, booking and liability.",
  intro: "Terms for purchasing a Digilist subscription and using the platform",
  updated: "Last published: 23 August 2026",
  sections: [
    {
      h2: "1. Parties",
      blocks: [
        {
          body: "These terms apply between Xala Technologies AS (org. no. 920 972 454, Nesbruveien 75, 1394 Nesbru, kontakt@digilist.no, phone +47 96 66 50 01), hereinafter \"Digilist\", and the person or organisation that purchases or uses the service, hereinafter \"the customer\". On the marketplace, there may also be a rental relationship between the operator and the person renting. Digilist is not a party to such rental agreements.",
        },
        {
          body: "The agreement is governed by Norwegian law, including the Contracts Act and the Marketing Control Act, and — where the customer is a consumer — the Right of Withdrawal Act and the Consumer Purchases Act. Public-sector customers enter into agreements under the applicable procurement rules, such as SSA-L.",
        },
      ],
    },
    {
      h2: "2. About Digilist",
      blocks: [
        {
          link: {
            before: "Digilist (",
            href: "https://www.digilist.no",
            text: "www.digilist.no",
            after: ") is a digital platform for booking and administering rentals. The platform can be used to find and book venues and resources, and to administer rentals as an operator or public body. Each operator is responsible for its own venues, including running them, maintenance, availability, prices and its own terms.",
          },
        },
      ],
    },
    {
      h2: "3. What Digilist sells",
      blocks: [
        {
          body: "Digilist sells subscriptions to the platform and related administrative services, such as calendars, booking, reporting, integrations and user administration. Price and scope are set out in the offer, the pricing page (digilist.no/priser) or the agreement.",
        },
        {
          body: "Digilist does not process payments on behalf of customers for rental agreements between the person renting and the operator. Digilist is not a payment intermediary, does not hold rental funds and does not receive rental payments on behalf of operators. Any payment features in the platform are technical tools connected to the operator's own agreements with payment providers.",
        },
        {
          body: "Each customer must obtain and configure their own payment solution with their own credentials (for example a merchant number, API keys and an agreement with a payment provider) in order to accept payment in their tenant. Digilist provides technical integration with such solutions, but the customer enters into and maintains the payment agreement directly with the provider.",
        },
      ],
    },
    {
      h2: "4. Regulatory status and payment services",
      blocks: [
        {
          body: "Xala Technologies AS is neither registered as a payment institution nor an e-money institution, nor otherwise authorised by Finanstilsynet to provide payment services under the Financial Contracts Act. Digilist does not provide regulated payment services that involve receiving, holding or paying out payment funds on behalf of third parties.",
        },
        {
          body: "For rental payments in the platform, payment is received directly by the operator (the customer) through the operator's own merchant agreement with a payment provider, such as Vipps MobilePay or card payment. Digilist is not a party to the payment transaction, does not control the operator's incoming payments and does not share in rental revenue. This is in line with Vipps MobilePay's requirement that the recipient of a payment must be a business customer of the payment provider.",
        },
        {
          body: "Customers who wish to accept payment in their tenant must themselves meet the payment provider's requirements, including KYC and a merchant agreement, and configure their own credentials in the platform. Settlement is made to the customer's bank account linked to the customer's org. no., not to Digilist.",
        },
      ],
    },
    {
      h2: "5. Payment for a Digilist subscription",
      blocks: [
        {
          body: "Payment for a Digilist subscription is made to Xala Technologies AS and can be made by card, Vipps MobilePay or invoice, depending on what has been agreed. The subscription price, billing period and payment deadline are set out in the offer or agreement. Prices are quoted in Norwegian kroner unless otherwise agreed. Value added tax is shown on the invoice where applicable.",
        },
        {
          body: "Card payment and Vipps MobilePay are handled by an approved payment provider. Payment data is handled in encrypted form under that provider's security mechanisms. Requirements for strong customer authentication (SCA) under PSD2 are met through the payment provider.",
        },
        {
          body: "When paying with Vipps MobilePay, Vipps MobilePay's terms and standard procedures also apply. If payment is late, access to the platform may be restricted until payment is received. For business customers, default interest may be charged under the Late Payment Interest Act.",
        },
      ],
    },
    {
      h2: "6. Minimum term, cancellation and changes to the subscription",
      blocks: [
        {
          body: "A subscription may be entered into as a monthly or annual agreement, or as an SSA-L contract for the public sector. The minimum term and notice period are set out in the offer or agreement. Pilot and trial periods are non-binding unless otherwise agreed in writing.",
        },
        {
          body: "The customer may cancel the subscription in accordance with the agreed notice period. Cancellation must be sent in writing to kontakt@digilist.no. Changes to the subscription tier, the number of venues or integrations must be agreed in writing and may lead to a price adjustment from the agreed date. On cancellation, access ends at the expiry of the notice period, unless the agreement provides otherwise.",
        },
      ],
    },
    {
      h2: "7. Delivery of the service",
      blocks: [
        {
          body: "Digilist is delivered as an online service (SaaS). Access is granted once an agreement has been entered into and the necessary setup is complete, unless otherwise agreed. Operation, updates and security management are included in the subscription as described in the offer or agreement.",
        },
      ],
    },
    {
      h2: "8. Right of withdrawal",
      blocks: [
        {
          body: "Business customers normally do not have a right of withdrawal under the Right of Withdrawal Act. For consumers who enter into an agreement for a Digilist subscription as a distance sale, a 14-day right of withdrawal applies from the date the agreement is entered into, unless the service has been fully delivered with the consumer's express consent before the period expires.",
        },
        {
          body: "The right of withdrawal is exercised by written notice to kontakt@digilist.no within the period. When the right of withdrawal is used, any payment received is refunded without undue delay, and no later than 14 days from receipt of the notice, unless the law provides otherwise.",
        },
        {
          body: "For the rental of venues and services connected to leisure activities or events at a specific time, the statutory right of withdrawal normally does not apply to the rental itself, cf. the Right of Withdrawal Act. The operator may have its own terms that the person renting must familiarise themselves with before a booking is confirmed.",
        },
      ],
    },
    {
      h2: "9. Returns and refunds",
      blocks: [
        {
          body: "Digilist is a digital service with no physical delivery. A \"return\" in connection with a subscription means cancellation and any refund under the right of withdrawal, the agreement and these terms of sale. After the withdrawal period has expired, an already paid subscription period is not refunded unless the agreement or mandatory law provides otherwise.",
        },
        {
          body: "Refunds in a rental relationship are governed by the operator's own terms and handled directly between the person renting and the operator. Digilist cannot refund rental payments, as such payments are not received by Digilist.",
        },
      ],
    },
    {
      h2: "10. Booking through the platform",
      blocks: [
        {
          body: "A booking is either confirmed directly or submitted as a request for approval, depending on the operator's rules for that venue. A booking is binding once the operator has confirmed it, or once acceptance has gone through under the flow that applies to that venue.",
        },
      ],
    },
    {
      h2: "11. Payment for a rental",
      blocks: [
        {
          body: "Payment for a rental is made between the person renting and the operator, not between the person renting and Digilist. Which payment method applies (for example card, Vipps MobilePay or invoice) is decided by the operator for each venue and is handled through the operator's own payment agreements and credentials in their tenant.",
        },
        {
          body: "Digilist does not arrange rental payments and is not responsible for payment, refunds, invoices or settlement in the rental relationship. Questions about a rental, an invoice, the amount or payment status must be directed to the operator. The operator is itself responsible for complying with the regulations that apply to its payment activity.",
        },
      ],
    },
    {
      h2: "12. Cancellation of bookings",
      blocks: [
        {
          h3: "12.1 Requests awaiting approval",
          body: "A request that has not been approved can be cancelled by the person renting until the operator has dealt with it.",
        },
        {
          h3: "12.2 Approved bookings",
          body: "The operator may have its own cancellation terms. Once a booking is approved, cancelling it may require the operator's approval, and fees may apply under the operator's rules.",
        },
        {
          h3: "12.3 Where no cancellation terms are given",
          body: "If the operator has not stated any cancellation terms, the person renting can normally cancel before the rental begins without being charged. Where the operator has stated its own terms, those apply.",
        },
        {
          h3: "12.4 Force majeure",
          body: "Either the operator or the person renting may cancel a reservation if it is prevented by circumstances outside the parties' control that could not reasonably have been foreseen or avoided (force majeure).",
        },
      ],
    },
    {
      h2: "13. Use of a reserved venue",
      blocks: [
        {
          body: "If the person renting does not use a reserved venue during the agreed period, the operator may charge the full rental amount. If they use the venue beyond the agreed time, or return equipment or the venue late, they may be charged for the extra time at the operator's rates and under its rules.",
        },
      ],
    },
    {
      h2: "14. Complaints and liability",
      blocks: [
        {
          body: "Digilist is a digital platform that connects the person renting with the operator. Digilist is not a party to the rental agreement between them, and does not rent out venues or equipment in its own name. Complaints, objections and claims for compensation relating to the venue or the rental are handled directly between the person renting and the operator.",
        },
        {
          body: "Complaints about a Digilist subscription or the platform's administrative services must be sent in writing to kontakt@digilist.no within a reasonable time after the defect was discovered. For consumers, the complaint rules in the Consumer Purchases Act apply. The operator is responsible for describing the venue correctly, and for keeping information about its condition, its intended use and its terms up to date.",
        },
      ],
    },
    {
      h2: "15. Dispute resolution",
      blocks: [
        {
          body: "The parties shall seek to resolve disputes amicably. Disputes that are not resolved amicably shall be governed by Norwegian law, with Oslo District Court as the agreed venue, unless mandatory law provides otherwise.",
        },
        {
          body: "Consumers may complain to the Norwegian Consumer Authority (forbrukertilsynet.no) and bring the matter before the Consumer Complaints Commission (forbrukerklageutvalget.no) under the rules there. Questions about an operator's payment solution must be directed to the operator and its payment provider, not to Digilist.",
        },
      ],
    },
    {
      h2: "16. Exclusion from Digilist",
      blocks: [
        {
          body: "Use of Digilist requires that these terms are followed, along with the applicable law and regulations. Digilist may restrict or close a user's access in the event of a breach of these terms, misuse, attempted fraud, or actions that could harm the integrity of the service or other users. The customer may stop using the service at any time by cancelling the subscription in accordance with the agreed notice period.",
        },
      ],
    },
    {
      h2: "17. Exclusion by an individual operator",
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
