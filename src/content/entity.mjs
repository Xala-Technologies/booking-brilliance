// The Digilist entity: one set of facts, one shape, every surface.
//
// This file exists because the SAME graph was written twice — once in
// `src/components/SEO.tsx` (injected after hydration) and once in
// `scripts/prerender.mjs` (baked into the static HTML a crawler reads first)
// — and the two had already drifted: the prerendered SoftwareApplication
// carried a bare `price: "0"` while the hydrated one carried a
// priceSpecification, and the Organization node had no `description` at all
// in either copy. An answer engine that reads both surfaces of digilist.no
// therefore got two slightly different Digilists, and neither of them said
// what Digilist IS.
//
// Kept as plain JS (no TS syntax) for the same reason as `blogFaq.mjs`:
// `scripts/prerender.mjs` runs under plain Node ESM with no build step and
// has to `import` it directly.
//
// Facts here come from three places and nowhere else:
//   - /public/llms.txt          (the definition, the address, the owner)
//   - src/content/legal.ts      (org.nr. 920 972 454, phone, e-mail)
//   - src/content/about.ts      (founded 2024, publisher Xala Technologies AS)
// If a schema field needs a fact none of those state, the field is omitted.

export const BASE_URL = "https://digilist.no";

/**
 * The definitional sentence — "Digilist er …".
 *
 * Answer engines quote definitions, not slogans. This exact string is used in
 * three places at once, deliberately:
 *   1. the homepage hero, as visible indexable text in the first 100 words
 *      (via `hero.definition` in src/lib/copy.ts),
 *   2. `description` on the Organization and SoftwareApplication nodes below,
 *   3. and it mirrors the "Hva Digilist er" paragraph in /public/llms.txt.
 * One fact, worded identically wherever a machine finds it. Changing it means
 * changing llms.txt too.
 */
export const ENTITY_DEFINITION = {
  nb: "Digilist er en norsk bookingplattform for utleie av lokaler og anlegg — selskapslokaler, møterom, idrettshaller, kantiner og kulturhus — som håndterer hele løpet fra forespørsel via betaling til fakturering og rapportering.",
  en: "Digilist is a Norwegian booking platform for renting out venues and facilities — function rooms, meeting rooms, sports halls, canteens and cultural centres — covering the whole path from enquiry through payment to invoicing and reporting.",
};

/**
 * Topics the entity is competent in. Mutated at build time by
 * scripts/prerender.mjs, which appends the content agent's cluster centroids
 * — so read it at call time (the builders below do), never copy it.
 */
export const BRAND_KNOWS_ABOUT = [
  "Bookingsystem",
  "Kommunal utleie",
  "Sesongleie",
  "ID-porten",
  "BankID",
  "Vipps",
  "EHF / Peppol-fakturering",
  "ISO 27001",
  "ISO 27701",
  "GDPR",
  "WCAG 2.1",
  "SSA-L 2026",
  "Digdir Designsystemet",
  "Convex reaktiv runtime",
  "PostgreSQL",
];

/**
 * The named things the platform connects to. This is a list of LINKS on every
 * page of digilist.no, so a dead URL here is a dead link on the whole site at
 * once — and invisible to a human, because these only appear inside a
 * <script type="application/ld+json">. That is how https://peppol.eu survived
 * for months (the apex has no DNS A record; the peppol.eu SUBdomains the docs
 * link resolve fine, so it read as obviously correct). geoqa found it from the
 * outside, by resolving the page's links — issue #299. SEO.brand-mentions.test.ts
 * now pins the shape.
 */
export const BRAND_MENTIONS = [
  { "@type": "Service", name: "Vipps", url: "https://vipps.no" },
  { "@type": "Service", name: "BankID", url: "https://bankid.no" },
  { "@type": "Service", name: "ID-porten", url: "https://www.idporten.no" },
  { "@type": "Service", name: "EHF / Peppol", url: "https://peppol.org" },
  { "@type": "Organization", name: "Digdir", url: "https://www.digdir.no" },
  {
    "@type": "Organization",
    name: "Brønnøysundregistrene",
    url: "https://www.brreg.no",
  },
];

/** schema.org `inLanguage` for our two locales. */
const IN_LANGUAGE = { nb: "nb-NO", en: "en" };

/**
 * Who we are.
 *
 * `legalName` replaces what used to be `parentOrganization: Xala Technologies
 * AS`. That was not a smaller mistake than it looks: it declared a second
 * Organization entity that is the parent of a company it actually IS, and it
 * left the org.nr. hanging on a node with no registered name to attach it to.
 * Digilist is a product of Xala Technologies AS, not a subsidiary of it, so
 * one node with a brand `name` and a registered `legalName` is both simpler
 * and true — and it lets the identifier, the address and the Brønnøysund
 * entry all describe the same, checkable legal person.
 *
 * `sameAs` links the official Enhetsregisteret record. For a small Norwegian
 * company with no Wikipedia page and no social profiles, that registry entry
 * is the strongest external anchor available: it is the record every other
 * Norwegian database resolves against.
 */
export function organizationLD(lang = "nb") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Digilist",
    legalName: "Xala Technologies AS",
    alternateName: "Digilist · Enkel booking",
    description: ENTITY_DEFINITION[lang] ?? ENTITY_DEFINITION.nb,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    image: `${BASE_URL}/og-image.png`,
    sameAs: [
      "https://xala.no",
      // Enhetsregisteret, the official Norwegian company register.
      "https://virksomhet.brreg.no/nb/oppslag/enheter/920972454",
    ],
    // The year Digilist itself began, as stated on /om-oss. Not the
    // registration date of Xala Technologies AS, which is a different fact
    // about a different thing.
    foundingDate: "2024",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Norwegian Organisasjonsnummer",
      value: "920972454",
    },
    taxID: "920972454",
    email: "kontakt@digilist.no",
    telephone: "+47-96-66-50-01",
    knowsAbout: BRAND_KNOWS_ABOUT,
    mentions: BRAND_MENTIONS,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nesbruveien 75",
      postalCode: "1394",
      addressLocality: "Nesbru",
      addressCountry: "NO",
    },
    areaServed: { "@type": "Country", name: "Norway" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+47-96-66-50-01",
      contactType: "Customer Service",
      email: "kontakt@digilist.no",
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    },
  };
}

export function websiteLD(lang = "nb") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Digilist",
    // The site's description is a property of the SITE, so it must not change
    // from page to page. It used to be passed in per route, which meant the
    // one `#website` entity described itself differently on all ~460 URLs.
    description: ENTITY_DEFINITION[lang] ?? ENTITY_DEFINITION.nb,
    inLanguage: IN_LANGUAGE[lang] ?? IN_LANGUAGE.nb,
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/faq?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * What the product is. Same reasoning as `websiteLD`: `#software` is one
 * entity, so it gets one description — the definition — rather than whatever
 * the current page's <meta name="description"> happened to say.
 */
export function softwareApplicationLD(lang = "nb") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#software`,
    name: "Digilist",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Booking & Reservation Platform",
    operatingSystem: "Web, iOS, iPadOS, Android",
    description: ENTITY_DEFINITION[lang] ?? ENTITY_DEFINITION.nb,
    softwareVersion: "2026.05",
    url: "https://app.digilist.no",
    featureList: [
      "Sanntidskalender",
      "Privatbookinger og sesongleie",
      "Betaling med Vipps og kort",
      "BankID og ID-porten autentisering",
      "EHF / Peppol fakturering",
      "Regnskapsintegrasjoner (Visma, Tripletex, Fiken, PowerOffice, DNB)",
      "Driftsroller og varsler",
      "Digital nøkkel (Salto KS)",
      "Universell utforming (WCAG 2.1 AA)",
      "ISO 27001 og 27701 sertifisert",
      "RCO booking-migrasjon",
      "Audit-spor og RBAC",
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        description:
          "Gratis pilot for norske kommuner. Pristilbud basert på antall anlegg og brukermengde.",
      },
      availability: "https://schema.org/InStock",
    },
    provider: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Norway" },
    inLanguage: IN_LANGUAGE[lang] ?? IN_LANGUAGE.nb,
  };
}

/**
 * The three nodes every page of digilist.no carries, in order.
 * `lang` is "nb" or "en" — the locale of the PAGE, not of the visitor.
 */
export function entityLD(lang = "nb") {
  return [organizationLD(lang), websiteLD(lang), softwareApplicationLD(lang)];
}
