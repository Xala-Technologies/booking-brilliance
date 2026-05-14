// Post-build: writes per-route static HTML with route-specific
// title/description/og/canonical + JSON-LD so social-media crawlers
// (Twitter, FB, LinkedIn, Slack) see the right meta without executing JS.
// Modern search bots (Google, GPT, Claude) execute JS and will use the
// SPA-rendered meta anyway — this fix is purely for the no-JS unfurl case.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const BASE_URL = "https://digilist.no";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

/** @type {Array<{route: string, title: string, description: string, ogType?: string, faq?: Array<{q: string, a: string}>, breadcrumbs?: Array<{name: string, url: string}>}>} */
const ROUTES = [
  {
    route: "/bookingsystem-kommune",
    title: "Bookingsystem for kommuner — Digilist | SSA-L 2026 klar",
    description:
      "Digital bookingplattform for norske kommuner. Sanntidskalender, sesongleie, ID-porten, EHF, ISO 27001. Bygget for SSA-L 2026-krav.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bookingsystem for kommuner", url: `${BASE_URL}/bookingsystem-kommune` },
    ],
    faq: [
      {
        q: "Hva er et kommunalt bookingsystem?",
        a: "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler — idrettshaller, svømmehaller, møterom, kantiner og kulturhus — i sanntid.",
      },
      {
        q: "Oppfyller Digilist SSA-L 2026-kravene?",
        a: "Ja. Digilist oppfyller SSA-L 2026-krav om sanntid, sesongleie, ID-porten, BRREG, digital nøkkel, EHF-fakturagrunnlag, WCAG 2.0 AA og ISO 27001/27701.",
      },
      {
        q: "Kan kommunen importere bookinger fra eksisterende system?",
        a: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer i etableringsfasen.",
      },
    ],
  },
  {
    route: "/book-demo",
    title: "Book demo av Digilist — Norsk bookingplattform",
    description:
      "Be om en gratis 30–45 minutters demo av Digilist. Vi viser hvordan plattformen håndterer ditt bruksområde — privat lokale, kommune eller kulturhus.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Book demo", url: `${BASE_URL}/book-demo` },
    ],
  },
  {
    route: "/personvern",
    title: "Personvernerklæring — Digilist",
    description:
      "Slik behandler Digilist personopplysninger. GDPR-kompatibel, ISO 27701-sertifisert, data lagret i Norge og EU.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Personvern", url: `${BASE_URL}/personvern` },
    ],
  },
  {
    route: "/salgsvilkar",
    title: "Salgsvilkår — Digilist",
    description: "Salgs- og leveransevilkår for Digilist bookingplattform.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Salgsvilkår", url: `${BASE_URL}/salgsvilkar` },
    ],
  },
  {
    route: "/cookies",
    title: "Cookies og informasjonskapsler — Digilist",
    description: "Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Cookies", url: `${BASE_URL}/cookies` },
    ],
  },
];

const baseLD = (description) => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Digilist",
    alternateName: "Digilist — Enkel booking",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    sameAs: ["https://xala.no"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nesbruveien 75",
      postalCode: "1394",
      addressLocality: "Nesbru",
      addressCountry: "NO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+47-96-66-50-01",
      contactType: "Customer Service",
      email: "kontakt@digilist.no",
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Xala Technologies AS",
      url: "https://xala.no",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Digilist",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Booking & Reservation Platform",
    operatingSystem: "Web, iOS, Android",
    description,
    url: "https://app.digilist.no",
    softwareVersion: "2026.05",
    featureList: [
      "Sanntidskalender",
      "Privatbookinger og sesongleie",
      "Betaling med Vipps og kort",
      "BankID og ID-porten autentisering",
      "EHF / Peppol fakturering",
      "Regnskapsintegrasjoner",
      "Digital nøkkel (Salto KS)",
      "Universell utforming (WCAG 2.0 AA)",
      "ISO 27001 og 27701 sertifisert",
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: "0",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "Xala Technologies AS",
      url: "https://xala.no",
    },
    areaServed: { "@type": "Country", name: "Norway" },
    inLanguage: "nb-NO",
  },
];

function patchHTML(template, meta) {
  const canonical = `${BASE_URL}${meta.route}`;
  const ldBlocks = [...baseLD(meta.description)];
  if (meta.faq && meta.faq.length > 0) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: { "@type": "Answer", text: q.a },
      })),
    });
  }
  if (meta.breadcrumbs) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: meta.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }
  const ldHTML = ldBlocks
    .map(
      (b) =>
        `<script type="application/ld+json" data-prerendered="true">${JSON.stringify(b)}</script>`,
    )
    .join("\n    ");

  return template
    // Title
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(
      /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="title" content="${meta.title}" />`,
    )
    // Description
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${meta.description}" />`,
    )
    // OG
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${meta.title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${meta.description}" />`,
    )
    // Twitter
    .replace(
      /<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:title" content="${meta.title}" />`,
    )
    .replace(
      /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:description" content="${meta.description}" />`,
    )
    // Canonical
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    // Inject JSON-LD before </head>
    .replace("</head>", `    ${ldHTML}\n  </head>`);
}

const HOMEPAGE = {
  route: "/",
  title: "Digilist — Én plattform for alt som leies ut",
  description:
    "Digital bookingplattform for selskapslokaler, idrettshaller, møterom og kulturhus. Sanntidskalender, Vipps, BankID, EHF, sesongleie. ISO 27001-sertifisert.",
  breadcrumbs: [{ name: "Hjem", url: `${BASE_URL}/` }],
  faq: [
    {
      q: "Hva er Digilist?",
      a: "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning.",
    },
    {
      q: "Hvilke kommuner og utleiere bruker Digilist?",
      a: "Digilist brukes av norske kommuner og private utleiere — blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group.",
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
  ],
};

async function main() {
  const indexPath = join(DIST, "index.html");
  const template = await fs.readFile(indexPath, "utf-8");

  // Patch the homepage in place — adds base JSON-LD so non-JS crawlers see it
  const homepageHTML = patchHTML(template, HOMEPAGE);
  await fs.writeFile(indexPath, homepageHTML, "utf-8");
  console.log(`  ✓ /index.html — base JSON-LD injected (${homepageHTML.length} bytes)`);

  // Pre-render per-route variants (use the freshly-patched template so they inherit homepage updates)
  for (const route of ROUTES) {
    const html = patchHTML(template, route);
    const outDir = join(DIST, route.route.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(join(outDir, "index.html"), html, "utf-8");
    console.log(`  ✓ ${route.route}/index.html (${html.length} bytes)`);
  }

  console.log(`\nPre-rendered ${ROUTES.length + 1} pages with route-specific meta + JSON-LD.`);
}

main().catch((e) => {
  console.error("Pre-render failed:", e);
  process.exit(1);
});
