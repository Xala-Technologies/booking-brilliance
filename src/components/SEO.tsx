import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  /** Use "article" for case-study routes, "website" otherwise */
  ogType?: "website" | "article";
  /** Optional FAQ Q/A array — rendered as FAQPage JSON-LD */
  faq?: Array<{ question: string; answer: string }>;
  /** Optional breadcrumb trail */
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const DEFAULT_TITLE = "Digilist — Én plattform for alt som leies ut";
const DEFAULT_DESCRIPTION =
  "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering — én digital plattform for det norske utleiemarkedet.";
const DEFAULT_KEYWORDS =
  "booking, utleie, selskapslokale, kulturhus, idrettshall, møterom, kommune, kontorbygg, foreninger, Vipps, BankID, ID-porten, EHF, Peppol, ISO 27001, GDPR, universell utforming, bookingsystem, lokalbooking, ressurstyring, Norge";

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical = "https://digilist.no/",
  ogImage = "https://digilist.no/og-image.png",
  ogType = "website",
  faq,
  breadcrumbs,
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:type", ogType, true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:url", canonical, true);
    setMeta("og:locale", "nb_NO", true);
    setMeta("og:site_name", "Digilist", true);
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    setMeta("twitter:image", ogImage, true);

    // Canonical
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canonical);

    // Build all JSON-LD blocks
    const blocks: object[] = [];

    // Organization (always)
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Digilist",
      "alternateName": "Digilist — Enkel booking",
      "url": "https://digilist.no",
      "logo": "https://digilist.no/logo.svg",
      "sameAs": ["https://xala.no"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nesbruveien 75",
        "postalCode": "1394",
        "addressLocality": "Nesbru",
        "addressCountry": "NO",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+47-96-66-50-01",
        "contactType": "Customer Service",
        "email": "kontakt@digilist.no",
        "areaServed": "NO",
        "availableLanguage": ["Norwegian", "English"],
      },
      "parentOrganization": {
        "@type": "Organization",
        "name": "Xala Technologies AS",
        "url": "https://xala.no",
      },
    });

    // SoftwareApplication (always)
    blocks.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Digilist",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Booking & Reservation Platform",
      "operatingSystem": "Web, iOS, Android",
      "description": description,
      "softwareVersion": "2026.05",
      "url": "https://app.digilist.no",
      "featureList": [
        "Sanntidskalender",
        "Privatbookinger og sesongleie",
        "Betaling med Vipps og kort",
        "BankID og ID-porten autentisering",
        "EHF / Peppol fakturering",
        "Regnskapsintegrasjoner (Visma, Tripletex, Fiken, PowerOffice, DNB)",
        "Driftsroller og varsler",
        "Digital nøkkel (Salto KS)",
        "Universell utforming (WCAG 2.0 AA)",
        "ISO 27001 og 27701 sertifisert",
      ],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "NOK",
        "price": "0",
        "availability": "https://schema.org/InStock",
      },
      "provider": {
        "@type": "Organization",
        "name": "Xala Technologies AS",
        "url": "https://xala.no",
      },
      "areaServed": { "@type": "Country", "name": "Norway" },
      "inLanguage": "nb-NO",
    });

    // FAQ (optional)
    if (faq && faq.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map((q) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": { "@type": "Answer", "text": q.answer },
        })),
      });
    }

    // BreadcrumbList (optional)
    if (breadcrumbs && breadcrumbs.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": b.name,
          "item": b.url,
        })),
      });
    }

    // Remove old ld+json blocks, replace with new
    document
      .querySelectorAll('script[type="application/ld+json"][data-seo="true"]')
      .forEach((el) => el.remove());
    blocks.forEach((block) => {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [title, description, keywords, canonical, ogImage, ogType, faq, breadcrumbs]);

  return null;
};

export default SEO;
