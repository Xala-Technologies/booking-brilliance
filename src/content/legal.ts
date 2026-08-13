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

export interface LegalBlock {
  h3?: string;
  body?: string;
  bullets?: readonly string[];
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

export function legalDoc(
  doc: { nb: LegalDoc; en: LegalDoc },
  locale: Locale,
): LegalDoc {
  return locale === "en" ? doc.en : doc.nb;
}
