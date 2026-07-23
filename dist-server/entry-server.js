import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import * as React from "react";
import { useEffect, useRef, useState, useMemo, forwardRef, useId, lazy, Suspense, useReducer, useCallback, createContext, useContext } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate, useLocation, Link, NavLink as NavLink$1, Routes, Route } from "react-router-dom";
import { useTheme, ThemeProvider } from "next-themes";
import { useScroll, useSpring, motion, useMotionValue, useTransform, MotionConfig, AnimatePresence } from "framer-motion";
import { Sun, Moon, Search, ArrowUpRight, Menu, X, ChevronRight, Check, Circle, ChevronDown, Theater, Trophy, GlassWater, Medal, Tent, Drama, Music, Sparkles, Music2, Disc3, UtensilsCrossed, Bike, Speaker, Wrench, PartyPopper, Home, BedDouble, Building2, TreePine, Waves, Dumbbell, Laptop, Presentation, Users2, Cake, Warehouse, Users, BookOpen, Handshake, Newspaper, Zap, Plug, Cpu, Network, Info, Mail, Cookie, Shield } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const LOGOS_WITH_WEBP = /* @__PURE__ */ new Set(["/clients/ronning.png"]);
function logoWebpSrc(src) {
  return src && LOGOS_WITH_WEBP.has(src) ? src.replace(/\.png$/, ".webp") : void 0;
}
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const DEFAULT_TITLE = "Digilist · Én plattform for alt som leies ut";
const DEFAULT_DESCRIPTION = "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering: én digital plattform for det norske utleiemarkedet.";
const DEFAULT_KEYWORDS = "booking, utleie, selskapslokale, kulturhus, idrettshall, møterom, kommune, kontorbygg, foreninger, Vipps, BankID, ID-porten, EHF, Peppol, ISO 27001, GDPR, universell utforming, bookingsystem, lokalbooking, ressurstyring, Norge";
const BRAND_KNOWS_ABOUT = [
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
  "PostgreSQL"
];
const BRAND_MENTIONS = [
  { "@type": "Service", name: "Vipps", url: "https://vipps.no" },
  { "@type": "Service", name: "BankID", url: "https://bankid.no" },
  { "@type": "Service", name: "ID-porten", url: "https://www.idporten.no" },
  { "@type": "Service", name: "EHF / Peppol", url: "https://peppol.eu" },
  { "@type": "Organization", name: "Digdir", url: "https://www.digdir.no" },
  {
    "@type": "Organization",
    name: "Brønnøysundregistrene",
    url: "https://www.brreg.no"
  }
];
const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical = "https://digilist.no/",
  ogImage = "https://digilist.no/og-image.png",
  ogType = "website",
  faq,
  breadcrumbs,
  howTo,
  article,
  aboutPage,
  service,
  robots
}) => {
  useEffect(() => {
    document.title = title;
    const setMeta = (name, content, property = false) => {
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
    if (robots) setMeta("robots", robots);
    setMeta("og:type", ogType, true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", title, true);
    setMeta("og:url", canonical, true);
    setMeta("og:locale", "nb_NO", true);
    setMeta("og:site_name", "Digilist", true);
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    setMeta("twitter:image", ogImage, true);
    setMeta("twitter:image:alt", title, true);
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canonical);
    const blocks = [];
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://digilist.no/#organization",
      name: "Digilist",
      alternateName: "Digilist · Enkel booking",
      url: "https://digilist.no",
      logo: "https://digilist.no/logo.svg",
      image: "https://digilist.no/og-image.png",
      sameAs: ["https://xala.no"],
      foundingDate: "2024",
      knowsAbout: BRAND_KNOWS_ABOUT,
      mentions: BRAND_MENTIONS,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nesbruveien 75",
        postalCode: "1394",
        addressLocality: "Nesbru",
        addressCountry: "NO"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+47-96-66-50-01",
        contactType: "Customer Service",
        email: "kontakt@digilist.no",
        areaServed: "NO",
        availableLanguage: ["Norwegian", "English"]
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Xala Technologies AS",
        url: "https://xala.no"
      }
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://digilist.no/#website",
      url: "https://digilist.no",
      name: "Digilist",
      description: DEFAULT_DESCRIPTION,
      inLanguage: "nb-NO",
      publisher: { "@id": "https://digilist.no/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://digilist.no/faq?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });
    blocks.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": "https://digilist.no/#software",
      name: "Digilist",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Booking & Reservation Platform",
      operatingSystem: "Web, iOS, iPadOS, Android",
      description,
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
        "Audit-spor og RBAC"
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "NOK",
        price: "0",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "NOK",
          description: "Gratis pilot for norske kommuner. Pristilbud basert på antall anlegg og brukermengde."
        },
        availability: "https://schema.org/InStock"
      },
      provider: { "@id": "https://digilist.no/#organization" },
      areaServed: { "@type": "Country", name: "Norway" },
      inLanguage: "nb-NO"
    });
    if (faq && faq.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
            inLanguage: "nb-NO"
          }
        }))
      });
    }
    if (breadcrumbs && breadcrumbs.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url
        }))
      });
    }
    if (howTo) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howTo.name,
        description: howTo.description,
        inLanguage: "nb-NO",
        step: howTo.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text
        }))
      });
    }
    if (article) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline,
        description: article.description,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
          "@type": "Person",
          name: article.author,
          ...article.authorRole ? { jobTitle: article.authorRole } : {}
        },
        publisher: { "@id": "https://digilist.no/#organization" },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        ...article.image ? {
          image: article.image.startsWith("http") ? article.image : `https://digilist.no${article.image}`
        } : {},
        articleSection: article.articleSection,
        keywords: article.keywords,
        ...article.wordCount ? { wordCount: article.wordCount } : {},
        inLanguage: "nb-NO"
      });
    }
    if (aboutPage) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: canonical,
        name: title,
        description,
        mainEntity: { "@id": "https://digilist.no/#organization" },
        inLanguage: "nb-NO"
      });
    }
    if (service) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Booking Platform",
        provider: { "@id": "https://digilist.no/#organization" },
        areaServed: { "@type": "Country", name: "Norway" },
        availableLanguage: ["Norwegian", "English"],
        offers: {
          "@type": "Offer",
          priceCurrency: "NOK",
          availability: "https://schema.org/InStock"
        },
        category: "Software / SaaS",
        description,
        url: canonical
      });
    }
    document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]').forEach((el) => el.remove());
    blocks.forEach((block) => {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType,
    faq,
    breadcrumbs,
    howTo,
    article,
    aboutPage,
    service
  ]);
  return null;
};
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => setTheme(isDark ? "light" : "dark"),
      className: "inline-flex items-center justify-center h-10 w-10 rounded-sm border border-hairline-strong text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial",
      "aria-label": "Bytt tema",
      children: [
        /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all duration-normal dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all duration-normal dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Bytt tema" })
      ]
    }
  );
};
const blogMeta = [{ "slug": "automatisert-avbooking-og-refusjon-kommunal-saksbehandling", "title": "Slik sparer saksbehandlere timer på avbooking og refusjon", "description": "Automatisert regelbasert refusjonslogikk reduserer manuelle saksbehandlingstimer og minimerer tvister, slik fungerer det i praksis.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/integrations_idporten_hero_no.webp", "keywords": ["avbooking", "refusjon", "saksbehandling", "kommunal booking", "automatisering", "leietaker", "betalingsintegrasjon"] }, { "slug": "hvor-booke-idrettshall-kommune", "title": "Slik booker du kommunal idrettshall uten papirskjema", "description": "Finn riktig hall, sjekk ledige tider og bekreft bookingen digitalt, uten å sende e-post eller vente uker på svar fra kommunen.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["booke idrettshall", "leie kommunal hall", "idrettshall kommune", "booking anlegg", "sportsanlegg leie", "digital booking hall", "kommunal idrettshall"] }, { "slug": "booking-paa-90-sekunder-innbygger", "title": "Booking på 90 sekunder: innbyggerens reise, steg for steg", "description": "Fra «trenger et møterom på torsdag» til bekreftelse i e-posten. Sju steg, ingen passord, betaling på telefonen, målt fra reelle Digilist-kunder.", "date": "2026-05-31", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 5, "tag": "Innbygger", "cover": "/images/blog/availability_calendar_hero_no.webp", "keywords": ["innbygger booking", "rask booking", "kundeopplevelse", "90 sekunder", "Digilist UX", "kommunal booking opplevelse"] }, { "slug": "bookingsystem-kommune-leverandor-valg", "title": "Slik velger kommunen riktig bookingsystem-leverandør", "description": "IT-ledere i kommuner bør stille disse spørsmålene før de signerer. Her er hva som skiller et kommunalt bookingsystem fra en generisk løsning.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "IT-leder", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["bookingsystem kommune", "leverandørvalg", "ID-porten", "GDPR kommune", "kommunal integrasjon", "innkjøp bookingsystem", "Digilist"] }, { "slug": "bookingkalender-for-innbygger-og-saksbehandler", "title": "Bookingkalenderen: for innbyggere, bygget for saksbehandlere", "description": "Bestemor som booker kantinen og kulturkonsulent som godkjenner 1 200 søknader i måneden trenger ulike grensesnitt. Slik balanserer Digilist begge.", "date": "2026-05-21", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "UX", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["bookingkalender", "saksbehandler UX", "innbygger UX", "kommunal UX", "tilgjengelighet"] }, { "slug": "bookingsoftware-kommune-sammenligning-pris", "title": "Bookingsoftware for kommuner: hva koster det egentlig?", "description": "Se de tre prismodellene, de skjulte kostnadene og en konkret sammenligningstabell før du velger bookingløsning for kommunen din.", "date": "2026-07-09", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "IT-leder", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["bookingsoftware kommune", "sammenligning pris", "bookingløsning offentlig sektor", "kommunal bookingplattform", "IT-leder kommune", "Digilist", "lokalbooking"] }, { "slug": "bookingsystem-kommunale-lokaler-guide-it-leder", "title": "Bookingsystem for kommunale lokaler: alt en IT-leder må vurdere", "description": "Konkret sjekkliste for IT-ledere før anskaffelse av bookingsystem: lokaltyper, brukergrupper, SSA-L, GDPR, ID-porten, pris og fallgruver.", "date": "2026-07-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "IT-leder", "cover": "/images/blog/accessibility_hero_no.webp", "keywords": ["bookingsystem kommunale lokaler", "SSA-L", "GDPR datalokasjon", "ID-porten booking", "kommunal SaaS", "utleie idrettshaller"] }, { "slug": "bookingsystem-kommune-sammenligning-matrise-tco", "title": "Bookingsystem kommune: sammenligningsmatrise fremfor prisliste", "description": "Slik sammenligner IT-lederen bookingsystemer på funksjon, sikkerhet og totalkostnad over fem år, og avdekker skjulte kostnader og kontraktsfeller før signering.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "IT-leder", "cover": "/images/blog/ssal_2026_booking_hero.webp", "keywords": ["bookingsystem kommune sammenligning", "bookingsystem kommune pris 2026", "totalkostnad bookingsystem", "beste bookingsystem kommune", "referansesjekk leverandør", "demo pilotperiode bookingsystem"] }, { "slug": "bryllupslokale-forening-utleie-og-booking-festsal", "title": "Bryllupslokale: slik leier foreningen ut og booker festsal selv", "description": "Praktisk guide for lag og foreninger: leie ut eget lokale til bryllup som inntekt, booke kommunal festsal selv, og unngå dobbeltbooking og tvist.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["bryllupslokale kommune pris", "bryllupslokale utleie forening", "grendehus samfunnshus bryllup", "depositum avbestilling bryllupslokale", "sesongtildeling bryllupshelger"] }, { "slug": "bryllupslokale-kommune-godkjenning-vigsel-skjenkebevilling-catering-depositum", "title": "Bryllupslokale i kommunen: alt du må godkjenne, ikke bare booke", "description": "Vigsel, skjenkebevilling, catering, pynt, støygrenser, forsikring og depositum: dette må du avklare med kommunen før bryllupslokalet er godkjent, ikke bare booket.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["bryllupslokale kommune pris", "vigsel kommunehuset", "skjenkebevilling bryllup", "catering bryllupslokale", "depositum bryllup"] }, { "slug": "bryllupslokale-kommune-pris-privat-sammenligning", "title": "Bryllupslokale i kommunen: pris og ledighet mot private lokaler", "description": "Se hva et kommunalt bryllupslokale faktisk koster mot private lokaler, hva som er inkludert i prisen, og hvordan du sjekker ledige bryllupsdatoer på nett før du booker.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["bryllupslokale kommune pris", "bryllupslokale pris", "leie bryllupslokale", "ledige bryllupsdatoer", "billigste bryllupslokale", "kapasitet bryllupslokale"] }, { "slug": "bryllupslokale-kommune-sjekkliste-bryllupsdagen", "title": "Bryllupslokale i kommunen: sjekklisten som avgjør bryllupsdagen", "description": "Fra kapasitet og kjøkken til pynt, alkohol, støy og depositum: en praktisk sjekkliste som viser hva et kommunalt bryllupslokale faktisk tillater før du signerer.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["bryllupslokale kommune", "bryllupslokale kapasitet", "kjøkken catering bryllup", "dekorering regler lokale", "avbestilling bryllupslokale", "depositum rengjøring"] }, { "slug": "datalokasjon-norge-gdpr-kommunal-booking", "title": "Kommunal booking-SaaS: GDPR gjør datalokasjon ikke valgfritt", "description": "IT-ledere i kommuner må sikre at bookingdata lagres i Norge. Her er hva GDPR krever, og hvordan Digilist løser det i praksis.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "IT-leder", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["datalokasjon Norge", "GDPR kommunal", "booking SaaS offentlig sektor", "databehandleravtale", "kommunal IT-compliance", "norsk sky", "personvernforordningen"] }, { "slug": "cyberangrep-norske-kommuner-bookingsystem", "title": "Cyberangrep mot norske kommuner: bookingsystem i fare?", "description": "Norske kommuner rammes av cyberangrep oftere enn før. Hva betyr trusselbildet for bookingsystemet ditt, og hvilke spørsmål bør CIO stille?", "date": "2026-05-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Sikkerhet", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["cyberangrep", "ransomware", "kommune", "bookingsystem", "NSM", "kommunal sikkerhet"] }, { "slug": "ddos-ransomware-beredskap-bookingplattform", "title": "DDoS og ransomware: beredskap for bookingplattformer", "description": "Hvordan en bookingplattform skal håndtere et angrep eller utfall: RPO/RTO, backup, hendelseskommunikasjon og praktisk beredskapsplan.", "date": "2026-05-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Sikkerhet", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["DDoS", "ransomware", "beredskap", "RPO", "RTO", "backup", "kommune", "incident response"] }, { "slug": "digdir-designsystemet-kommunal-bookingplattform", "title": "Digdir Designsystemet: hvorfor det er et must i offentlig sektor", "description": "Designsystemet er Norges offisielle byggekloss-bibliotek for offentlige digitale tjenester, og grunnlaget for tilliten Digilist bygger på.", "date": "2026-05-17", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 9, "tag": "Designsystem", "cover": "/images/blog/digdir_designsystemet_hero_no.webp", "keywords": ["Digdir Designsystemet", "designsystemet.no", "universell utforming", "kommunal digitalisering", "offentlig sektor"] }, { "slug": "digilist-mobil-app", "title": "Digilist mobil: booking i lomma, drift på vaktrommet", "description": "Innbyggere booker fra mobil. Driftsroller varsles på mobil. Saksbehandlere signerer fra mobil. Digilists native iOS- og Android-apper er bygget for jobben.", "date": "2026-05-24", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Mobil", "cover": "/images/blog/digilist_app_hero_no.webp", "keywords": ["mobil app", "React Native", "iOS", "Android", "push-varsler", "Digilist app"] }, { "slug": "en-plattform-mot-fem-verktoy", "title": "Én plattform vs. fem verktøy: den skjulte kostnaden", "description": "Bookingsystem, kalender, betaling, regnskap, varsling. Hvert system fungerer isolert, men friksjonen oppstår mellom dem. Det er der Digilist løser problemet.", "date": "2026-05-20", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Plattform", "cover": "/images/blog/en_plattform_hero_no.webp", "keywords": ["én plattform", "integrasjoner", "kommunal driftskostnad", "single source of truth", "sambruk"] }, { "slug": "faktura-refusjon-avstemming", "title": "Fakturering, refusjoner og avstemming: økonomimotoren i Digilist", "description": "Hvordan en booking blir til en faktura, hvordan en kansellering blir til en refusjon, og hvordan kommunens regnskap får tallene som stemmer, uten Excel.", "date": "2026-06-01", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Økonomi", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["fakturering", "EHF", "Peppol", "refusjon", "avstemming", "regnskap", "Visma Tripletex Fiken PowerOffice", "økonomi kommunal booking"] }, { "slug": "finn-og-book-ledige-moterom-i-din-kommune", "title": "Slik finner og booker du ledige møterom i din kommune", "description": "Finn ledige møterom i ditt område, sjekk ledighet i sanntid og book med BankID, uten å ringe rundt til skoler og servicetorg.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["møterom kommune", "ledige møterom nær meg", "book møterom online", "gratis møterom lag og foreninger", "møterom pris leie", "finn møterom bydel"] }, { "slug": "foresporsel-chat-kommunikasjon", "title": "Forespørsel og chat: leietaker og utleier i Digilist", "description": "To kanaler, samme dataspor: en strukturert forespørsel for nye bookinger, og en samtaletråd per booking for alt etterpå. Ingen tapte e-poster, ingen siloer.", "date": "2026-05-28", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 5, "tag": "Kommunikasjon", "cover": "/images/blog/digilist_app_hero_no.webp", "keywords": ["forespørsel", "chat", "kommunikasjon", "samtaletråd", "booking inquiry", "Digilist messaging"] }, { "slug": "gdpr-iso-datalokasjon-norge", "title": "GDPR, ISO 27001 og datalokasjon: hva kommuner må vite", "description": "Norske kommuner stiller stadig høyere krav til persondata. Hva datalokasjon i Norge og EU dekker, og hva sertifiseringer faktisk ikke gjør.", "date": "2026-05-10", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Samsvar", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["GDPR", "ISO 27001", "datalokasjon", "personvern", "kommune", "SaaS"] }, { "slug": "booking-idrettshall-kommune-app", "title": "Slik slipper du doble bookinger i idrettshallen", "description": "En enkel bookingapp gir driftsleder på idrettshaller full kontroll, og frigjør timer hver uke som går til administrasjon i dag.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Driftsleder", "cover": "/images/blog/ssal_2026_booking_hero.webp", "keywords": ["booking idrettshall", "kommune app", "idrettshall leie", "bookingsystem kommunal", "doble bookinger", "driftsleder anlegg", "digital bookingapp"] }, { "slug": "hva-er-bookingsystem-kommunale-lokaler", "title": "Hva er et bookingsystem for kommunale lokaler? Full guide for IT-ledere", "description": "Komplett guide for IT-ledere: hva et bookingsystem for kommunale lokaler er, hvilke lokaltyper som kan bookes, priser og anbud, GDPR og datalokasjon, ID-porten, SSA-L og målbar gevinst etter innføring.", "date": "2026-07-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "IT-leder", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["bookingsystem kommunale lokaler", "SSA-L kravspesifikasjon", "ID-porten booking", "GDPR datalokasjon Norge", "digital utleie idrettshall", "booking lag og foreninger"] }, { "slug": "hvorfor-digital-booking-2026", "title": "Hvorfor digital booking er påkrevd for kommuner i 2026", "description": "Innbyggerforventninger, anskaffelsesregelverk og kostnadspress peker samme vei: 2026 er året kommunale bookingsystemer ble påkrevd, ikke valgfritt.", "date": "2026-05-22", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Strategi", "cover": "/images/blog/digital_booking_importance_hero_no.webp", "keywords": ["digital booking", "kommunal digitalisering", "SSA-L 2026", "innbyggertjenester", "Digdir"] }, { "slug": "idporten-bankid-kommunal-innlogging", "title": "ID-porten og BankID: pålitelig innlogging i kommunale tjenester", "description": "ID-porten er Norges felles innloggingsløsning for offentlig sektor. Slik integrerer Digilist ID-porten og BankID, uten å håndtere passord.", "date": "2026-05-16", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Integrasjoner", "cover": "/images/blog/integrations_idporten_hero_no.webp", "keywords": ["ID-porten", "BankID", "eIDAS", "Signicat", "BRREG", "kommunal innlogging", "autentisering"] }, { "slug": "digitalisert-tildeling-idrettshaller-lag-foreninger", "title": "Idrettshall-tildeling på dager, ikke uker, slik gjør du det", "description": "Lær hvordan digitalisert tildeling av kommunale idrettshaller gir lag og foreninger raskere svar og full oversikt over sesongleie på én plass.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall booking", "kommunale lokaler tildeling", "sesongleie idrettshall", "lag og foreninger booking", "kalenderbasert booking", "kommunal utleie", "dobbeltbooking"] }, { "slug": "idrettshall-bookingsystem-krav-kravspec-it-leder", "title": "Idrettshall-modul i bookingsystemet: kravspec for IT-lederen", "description": "Idrettshaller stiller krav møteromsbooking ikke dekker: sesongtildeling, rammetimeplan, garderobe og spillemidler. Slik skriver du kravspec riktig.", "date": "2026-07-16", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "IT-leder", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall booking", "idrettshall ledige tider", "idrettshall sesongtildeling", "bookingsystem krav", "spillemidler rapportering", "idrettshall pris"] }, { "slug": "idrettshall-enkelttime-saksbehandler-soknad-godkjenning-venteliste", "title": "Enkelttime i idrettshallen: saksbehandlerens guide til søknad og vedtak", "description": "Fra søknad om ledig idrettshalltid til godkjenning, avslag, venteliste og konflikthåndtering. Slik behandler saksbehandler enkelttimer raskt, rettferdig og etterprøvbart.", "date": "2026-07-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/availability_calendar_hero_no.webp", "keywords": ["idrettshall ledige tider", "booke idrettshall enkelttime", "avslag idrettshall begrunnelse", "venteliste idrettshall", "dobbeltbooking idrettshall", "prioritering skole lag idrettshall", "godkjenne booking idrettshall saksbehandler"] }, { "slug": "idrettshall-kommune-booke-enkelttime-trening-arrangement", "title": "Idrettshall i kommunen: alle måtene å finne og booke en ledig hall", "description": "Enkelttime, fast trening, arrangement eller ferie: her er alle bookingveiene til kommunal idrettshall samlet, med pris, regler og ledige tider forklart.", "date": "2026-07-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall ledige tider", "booke idrettshall", "idrettshall leie pris", "fast trening idrettshall", "idrettshall arrangement", "idrettshall skoleferie"] }, { "slug": "idrettshall-ledige-tider-booking-avbud-boter-lag-foreninger", "title": "Idrettshall ledige tider: booking, avbud og bøter for laget", "description": "Slik finner laget ledige treningstider i sanntid, melder avbud før fristen og unngår no-show-gebyr. Guide til booking, avbestillingsfrist, venteliste og sesongtildeling for lag og foreninger.", "date": "2026-07-20", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall ledige tider", "booking idrettshall", "avbestille idrettshall time", "no-show bot idrettshall", "sesongtildeling", "treningstid forening"] }, { "slug": "idrettshall-ledige-tider-booking-driftsleder-prioritering-skole-lag-privat", "title": "Idrettshall ledige tider: slik løser driftslederen bookingkonflikten mellom skole, lag og privat", "description": "Når skole, lag og privat leie vil ha samme kveld: slik viser systemet ledige tider, prioritering og sanntidskollisjoner, så driftslederen slipper å avgjøre per telefon.", "date": "2026-07-21", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Driftsleder", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["idrettshall ledige tider", "dobbeltbooking idrettshall", "sesongtildeling", "avbud og venteliste idrettshall", "prioritering skole lag privat", "booking uten telefonrunder", "spillemidler rapportering"] }, { "slug": "idrettshall-ledige-tider-booking-hele-livssyklusen", "title": "Idrettshall ledige tider: hvorfor timer blir frie og hvordan du booker", "description": "Fra sesongfordeling til lag og foreninger, via avbestillinger, til timene du faktisk kan booke selv. Slik henger idrettshall-booking sammen fra ende til ende.", "date": "2026-07-14", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall ledige tider", "book idrettshall time", "leie idrettshall pris", "idrettshall sesongfordeling", "avbestille idrettshall booking", "idrettshall vs gymsal"] }, { "slug": "idrettshall-ledige-tider-booking-innbygger", "title": "Idrettshall ledige tider: finn og book en ledig time på under to minutter", "description": "Slik finner du ledige tider i kommunens idrettshaller i sanntid, setter deg på venteliste ved avbestilling og booker en ledig time uten å ringe drift.", "date": "2026-07-14", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall ledige tider", "booke ledig time idrettshall", "venteliste idrettshall avbestilling", "sanntidskalender idrettshall", "sammenligne idrettshaller ledig tid", "idrettshall booking app", "finne ledig idrettshall i dag"] }, { "slug": "idrettshall-ledige-tider-booking-lag-foreninger-pilar", "title": "Idrettshall ledige tider: hele sesongen for treningsansvarlige i laget", "description": "Finn ledige tider, bytt eller avlys treningstid og løs kollisjoner med andre lag i ett system. Slik styrer treningsansvarlige hele sesongen i idrettshallen uten e-postrunder med kommunen.", "date": "2026-07-17", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["idrettshall ledige tider", "booke idrettshall lag", "leie idrettshall trening", "bytte treningstid idrettshall", "idrettshall regler foreninger", "idrettshall pris leie lag"] }, { "slug": "idrettshall-ledige-tider-booking-sanntid-innbygger", "title": "Ledige tider i idrettshallen: søk i sanntid og book fra mobilen", "description": "Se ledige treningstider på tvers av alle idrettshaller i kommunen i sanntid, få varsel når en time avbestilles, og book fra mobilen på under ett minutt.", "date": "2026-07-14", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/realtime_updates_hero_no.webp", "keywords": ["idrettshall ledige tider", "booking idrettshall", "ledige treningstider idrettshall", "mobil booking idrettshall", "venteliste idrettshall", "avbestilte timer varsel"] }, { "slug": "idrettshall-ledige-tider-booking", "title": "Idrettshall: finn ledige tider og book uten telefonrunder", "description": "Slik ser laget ditt ledige tider i idrettshall i sanntid, booker enkelttimer eller fast leie, og slipper dobbeltbooking og telefonkø til vaktmester.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Lag og foreninger", "cover": "/images/blog/digital_booking_importance_hero_no.webp", "keywords": ["idrettshall ledige tider", "booking idrettshall", "faste treningstider idrettslag", "kommunale idrettsanlegg", "søknad om leie av idrettshall", "avbestilling frigitte timer"] }, { "slug": "idrettshall-ledige-tider-drift-sanntid-belegg", "title": "Idrettshall ledige tider: driftslederens sanntidsoversikt og belegg", "description": "Slik får driftslederen full sanntidsoversikt over ledige tider i alle haller og soner, måler utnyttelsesgraden per ukedag og fyller tomme timer uten manuell purring.", "date": "2026-07-18", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Driftsleder", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["idrettshall ledige tider", "booking idrettshall", "beleggsstatistikk idrettshall", "utnyttelsesgrad idrettshall", "dobbeltbooking", "sesongtildeling"] }, { "slug": "idrettshall-ledige-tider-booking", "title": "Idrettshall: ledige tider og booking uten dobbeltbooking", "description": "Slik gir sanntids ledig-tid-oversikt i idrettshallen færre tomme timer og telefonhenvendelser, mens saksbehandler og lag jobber mot samme tall.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Driftsleder", "cover": "/images/blog/ssal_2026_booking_hero.webp", "keywords": ["idrettshall ledige tider booking", "booking av idrettshall", "ledig kapasitet idrettshall", "faste treningstider idrettslag", "dobbeltbooking idrettshall", "kapasitetsutnyttelse idrettsanlegg"] }, { "slug": "id-porten-bankid-integrasjon-kommune-booking", "title": "ID-porten og BankID: Slik sikrer Digilist bookingen din", "description": "Lær hvordan Digilist integrerer ID-porten, BankID og Outlook slik at kommunen din får sikker autentisering, kalendersync og full revisjonsspor uten tilleggsarbeid.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "IT-leder", "cover": "/images/blog/digital_booking_importance_hero_no.webp", "keywords": ["ID-porten", "BankID", "Outlook-integrasjon", "kommune booking", "autentisering offentlig sektor", "revisjonsspor", "GDPR"] }, { "slug": "kapasitetsstyring-idrettsanlegg-driftsleder", "title": "Kapasitetsstyring av idrettsanlegg: driftslederens guide", "description": "Slik fordeler du halltid mellom lag, skoler og private leietakere uten dobbeltbooking, med kapasitetsoversikt på tvers av flere anlegg i én kommune.", "date": "2026-07-09", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Driftsleder", "cover": "/images/blog/digital_booking_importance_hero_no.webp", "keywords": ["hvor booke idrettshall kommune", "kapasitetsstyring flere anlegg", "fordeling halltid lag foreninger", "leie idrettshall privat arrangement", "booking flerbrukshall gymsal", "belegg bruksstatistikk idrettsanlegg"] }, { "slug": "kommunalt-bookingsystem-hva-er-det", "title": "Kommunalt bookingsystem: hva IT-lederen må vite før kravspec", "description": "Hva et kommunalt bookingsystem er, hvorfor det skiller seg fra Calendly, og hvilke krav til ID-porten, SSA-L og datalokasjon du bør stille før anskaffelse.", "date": "2026-07-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "IT-leder", "cover": "/images/blog/digilist_app_hero_no.webp", "keywords": ["kommunalt bookingsystem", "ID-porten booking", "SSA-L bookingløsning", "datalokasjon Norge GDPR", "kostnad bookingsystem kommune", "booking lag og foreninger"] }, { "slug": "ledige-moterom-i-kommunen", "title": "Slik finner og booker du ledige møterom i din kommune på nett", "description": "Søk opp alle kommunens møterom på område, se ledighet i sanntid og styr egne bookinger fra Mine side, uten å ringe rundt til hvert enkelt bygg.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["møterom kommune", "ledige møterom", "booke møterom", "mine bookinger", "møterom nær meg", "kommunale lokaler"] }, { "slug": "leie-bryllupslokale", "title": "Leie bryllupslokale: pris, kapasitet og booking, forklart", "description": "Hva koster det å leie bryllupslokale, hva er inkludert i leien, og hvordan booker du ledig dato på nett? Guide til pris, kapasitet, depositum og avbestilling.", "date": "2026-07-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 9, "tag": "Privatperson", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["leie bryllupslokale", "bryllupslokale pris", "hva koster bryllupslokale", "selskapslokale bryllup", "depositum bryllupslokale", "book bryllupslokale online"] }, { "slug": "leie-idrettshall-kommune-komplett-guide-lag", "title": "Leie idrettshall i kommunen: komplett guide for lag og foreninger", "description": "Fra å finne ledig hall til fast treningstid, priser og avlysning. Slik booker idrettslag kommunale anlegg uke etter uke, uten papir og venting.", "date": "2026-07-09", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Lag og foreninger", "cover": "/images/blog/digital_booking_importance_hero_no.webp", "keywords": ["hvor booke idrettshall kommune", "leie gymsal kommune", "booke treningstid idrettslag", "idrettshall priser leie", "søke fast treningstid", "avbestille idrettshall"] }, { "slug": "leie-idrettshall-privat-enkelttime-innbygger", "title": "Leie idrettshall privat: slik booker du enkelttime selv", "description": "Praktisk guide for privatpersoner og uorganiserte grupper som skal booke kommunal idrettshall, gymsal eller anlegg selv, uten lag og uten å ringe.", "date": "2026-07-11", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/realtime_updates_hero_no.webp", "keywords": ["hvor booke idrettshall kommune", "leie idrettshall privat", "booke gymsal enkelttime", "leie idrettshall bursdag", "pris leie idrettshall kommune", "booke idrettsanlegg uten medlemskap", "ledige tider idrettshall"] }, { "slug": "leie-lokale-billigst-kommune-sammenlign-lokaltyper", "title": "Leie lokale billigst i kommunen: sammenlign alle lokaltypene", "description": "Én oversikt over pris og vilkår på idrettshall, møterom, kulturhus, gymsal og selskapslokale, slik at laget velger billigste egnede lokale første gang.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["leie sal billigst kommune", "leie lokale billig kommune", "leie idrettshall pris lag", "leie kulturhus pris", "medlemspris leie", "depositum avbestilling lokale"] }, { "slug": "leie-lokale-kommune-anledning-guide-innbygger", "title": "Leie lokale i kommunen: riktig sal for bursdag, konfirmasjon og mer", "description": "Match lokaltype og kapasitet til anledningen, fra bursdag til minnestund, og finn det billigste ledige alternativet i kommunen med pris før du booker.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/en_plattform_hero_no.webp", "keywords": ["leie sal billigst kommune", "leie lokale til bursdag", "leie lokale konfirmasjon", "leie lokale minnestund", "leie forsamlingshus kommune", "sammenligne pris leie lokale kommune"] }, { "slug": "leie-lokale-kommune-vilkar-depositum-avbestilling", "title": "Leie lokale i kommunen: vilkår, depositum og avbestilling forklart", "description": "Alt som står i leiekontrakten for et kommunalt lokale: hva som er inkludert, depositum, avbestillingsfrister, ansvar for skader og søknadstid før du signerer.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Innbygger", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["leie lokale kommune vilkår", "depositum leie lokale", "avbestille leid lokale kommune", "leie forsamlingshus regler", "leiekontrakt kommunalt lokale"] }, { "slug": "leie-motrom-kommune-samme-dag", "title": "Slik booker kommunen møterom samme dag, uten ventelister", "description": "Digitalisert bookingportal gjør kommunale møterom og kulturhus søkbare i sanntid, og kutter timer med manuell administrasjon hver uke.", "date": "2026-07-09", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/availability_calendar_hero_no.webp", "keywords": ["leie møterom kommune", "bookingportal kommunal", "samme dag booking", "møteromreservasjon", "kulturhus booking", "dobbeltbooking", "romutleie kommune"] }, { "slug": "leie-sal-billigst-kommune-kravspec-pris-betaling-it-leder", "title": "Salleie i bookingsystemet: kravspec for pris og betaling", "description": "Slik kravspesifiserer IT-lederen differensiert prising, prisregulativ, sesongavtaler og betalingsflyt så billigste ledige sal viser riktig pris i sanntid.", "date": "2026-07-21", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 5, "tag": "IT-leder", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["leie sal billigst kommune", "prisregulativ kommunale lokaler", "differensiert pris lag og foreninger", "betaling depositum leie kommunalt lokale", "sesongleie faste leieavtaler", "kravspec bookingsystem"] }, { "slug": "leie-sal-billigst-kommune-lag-foreninger-reell-pris", "title": "Leie sal billigst i kommunen: slik finner foreningen reell pris", "description": "Listepris er sjelden det laget faktisk betaler. Slik regner foreningen ut reell pris med frivillighetsrabatt, friplass og sesongleie, og booker billigst.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["leie sal billigst kommune", "leie lokale billigst", "leie sal pris", "gratis leie lag og foreninger", "søke om fritak leie kommunalt lokale", "depositum leie lokale", "leie sal fast pris sesong"] }, { "slug": "leie-sal-billigst-kommune-prisregulativ-saksbehandler", "title": "Leie sal billigst i kommunen: prisregulativet saksbehandleren forvalter", "description": "Innbyggeren søker billigste sal. Du forvalter prisregulativet bak: hvem betaler hva, selvkost, rabatter, depositum, klagehåndtering og automatisert prisberegning.", "date": "2026-07-18", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["leie sal billigst kommune", "leiepriser sal kommune", "prisregulativ sal kommune", "selvkostprinsipp kommunal utleie", "rabatt lag og foreninger", "depositum leie sal kommune", "klage på pris kommunalt lokale"] }, { "slug": "leie-sal-billigst-kommune", "title": "Leie sal billigst i kommunen: slik settes prisen og finner du ledig lokale", "description": "Forstå soner, foreningsrabatt og skjulte tillegg når du leier sal, gymsal eller møterom av kommunen, og finn det billigste ledige lokalet på nett.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/realtime_updates_hero_no.webp", "keywords": ["leie sal kommune", "gratis lokale lag og foreninger", "leie gymsal pris", "leie møterom kommune", "booke lokale kommune på nett"] }, { "slug": "leie-sal-fast-kommune-forening-sesong", "title": "Leie sal fast i kommunen: slik sikrer foreningen samme ukedag hele sesongen", "description": "Kor, korps, idrettslag og speidere kan sikre fast sal og ukedag for en hel sesong. Guide til fastplass, medlemspris, søknadsfrister og fornyelse.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Lag og foreninger", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["leie sal fast kommune", "fastplass sesong sal", "medlemspris leie sal forening", "sal for kor korps speider", "søknadsfrister fast sal"] }, { "slug": "leie-selskapslokale-bryllup-fest", "title": "Leie selskapslokale til bryllup eller fest: slik finner og booker du", "description": "Hvor kan du leie et selskapslokale til bryllup eller fest? Et konkret svar på hvor du finner ledige lokaler, ser tilgjengelighet i sanntid og booker direkte, med sjekkliste og sammenligning.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Privatperson", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["leie selskapslokale", "bryllupslokale", "festlokale", "booke selskapslokale", "Digilist", "selskapslokale bryllup", "leie festlokale konfirmasjon"] }, { "slug": "leiepriser-kommunale-lokaler-driftsleder-guide", "title": "Leiepriser på kommunale lokaler: driftslederens guide til prising", "description": "Slik setter og forvalter driftsledere leiepriser for idrettshall, gymsal og møterom: prismodeller, rabatt til lag, depositum og automatisk beregning.", "date": "2026-07-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Driftsleder", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["leiepriser kommunale lokaler", "sette pris på leie av lokale", "medlemspris lag og foreninger", "kommersiell utleie kommunalt lokale", "depositum avbestillingsgebyr", "differensiert prising idrettshall gymsal"] }, { "slug": "mote-rom-kommune-finn-ledige-i-omradet-mine-bookinger", "title": "Møterom i kommunen: finn ledige i ditt område og styr egne bookinger", "description": "Slik finner innbyggere og foreninger ledige møterom på tvers av alle kommunens bygg, sammenligner kapasitet og utstyr, og styrer egne bookinger fra Min side.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/accessibility_hero_no.webp", "keywords": ["møterom kommune", "ledige møterom i mitt område", "mine møterom bookinger", "møterom for foreninger", "pris på møterom kommune", "booke møterom uten saksbehandler"] }, { "slug": "magic-link-sms-bankid-sikker-innlogging", "title": "Magic link, SMS og BankID: tre sikre innloggingsmåter", "description": "Magic link på e-post, engangskode på SMS, eller BankID via ID-porten. Tre sikre innloggingsmåter, én plattform. Kommunen bestemmer hvilken som kreves.", "date": "2026-05-29", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Sikkerhet", "cover": "/images/blog/integrations_idporten_hero_no.webp", "keywords": ["magic link", "passordløs innlogging", "SMS innlogging", "BankID", "ID-porten", "passwordless authentication", "kommunal innlogging"] }, { "slug": "min-side-alle-bookinger-paa-ett-sted", "title": "Min Side: alle bookinger, samtaler og kvitteringer på ett sted", "description": "Kommende bookinger, fullførte, samtaletråder med utleier, kvitteringer og kalender­integrasjon. Alt samlet et sted innbyggeren faktisk kan finne tilbake til.", "date": "2026-06-02", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 5, "tag": "Innbygger", "cover": "/images/blog/minside_hero.svg", "keywords": ["Min Side", "innbygger dashboard", "bookings historikk", "kvittering", "kalenderintegrasjon", "selvbetjening", "Digilist UX"] }, { "slug": "moterom-kommune-finn-og-book-ledige-lokaler", "title": "Møterom i kommunen: finn og book ledige lokaler i sanntid", "description": "Slik finner og booker du ledige kommunale møterom i ditt nærområde via Digilists portal, med sanntidskalender, ID-porten-innlogging og priser forklart.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["møterom kommune", "ledige møterom", "book møterom online", "møterom for foreninger", "møterom pris leie", "avbestille møterom"] }, { "slug": "onboarding-uke-til-live", "title": "Onboarding for nye kunder: fra signering til live på en uke", "description": "Fem dager, fem milepæler. Ingen konsulent, ingen prosjektrigging: bare en sekvens som er bygget for at en kommune eller utleier skal komme live uten å miste fart.", "date": "2026-05-30", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Onboarding", "cover": "/images/blog/onboarding_hero.svg", "keywords": ["onboarding", "implementering", "go-live", "Digilist onboarding", "kommunal SaaS", "raskt i drift"] }, { "slug": "penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor", "title": "Penetrasjonstesting: hva en SaaS-leverandør skal levere", "description": "Hva betyr egentlig at en SaaS-leverandør er sikker? Pen-test, sårbarhetshåndtering og supply-chain: sjekkliste for kommunal anskaffelse.", "date": "2026-05-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Sikkerhet", "cover": "/images/blog/gdpr_iso27001_hero_no.webp", "keywords": ["penetrasjonstesting", "pen-test", "sikkerhetsrevisjon", "supply chain", "Dependabot", "Snyk", "anskaffelse"] }, { "slug": "phishing-resistente-innlogginger-idporten-bankid", "title": "Phishing-resistente innlogginger med ID-porten og BankID", "description": "Passordbaserte innlogginger phishes hver dag. Derfor er ID-porten og BankID det enkleste forsvarsgrepet en norsk kommune kan gjøre.", "date": "2026-05-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Sikkerhet", "cover": "/images/blog/integrations_idporten_hero_no.webp", "keywords": ["phishing", "ID-porten", "BankID", "FIDO2", "innlogging", "kommune", "MFA"] }, { "slug": "realtime-varsler-driftsroller", "title": "Realtime-varsler: plattformen forteller før noen ringer", "description": "En vaktmester som får telefon søndag morgen fordi noen står ute, er en kommune som mangler informasjonsflyt. Digilist fjerner samtalen før den starter.", "date": "2026-05-25", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Drift", "cover": "/images/blog/realtime_updates_hero_no.webp", "keywords": ["push-varsler", "driftsroller", "vaktmester", "renhold", "automatisk varsling", "outbox event bus"] }, { "slug": "saksbehandler-godkjenne-avvise-kommunisere", "title": "Saksbehandler: godkjenne, avvise og kommunisere på minutter", "description": "Innboks for forespørsler, regelbasert auto-godkjenning, samtaletråd per booking, og fullt revisjons­spor. Slik fungerer saks­behandlings­flyten i praksis.", "date": "2026-05-27", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/booking_calendar_hero_no.webp", "keywords": ["saksbehandler", "godkjenning", "avvise booking", "kommunikasjon", "innboks", "kommunal booking"] }, { "slug": "sal-for-kulturarrangementer-og-seminarer", "title": "Finn og book sal til konsert, utstilling og seminar i kommunen", "description": "Samlet oversikt over kommunale saler for kultur og seminar: priser, ledig kapasitet i sanntid, tekniske krav og booking uten å ringe rundt.", "date": "2026-07-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Innbygger", "cover": "/images/blog/accessibility_hero_no.webp", "keywords": ["konferanse sal kommune priser", "leie sal til konsert kommune", "utstillingslokale kommune priser", "seminarlokale leie pris", "kulturhus sal leie priser", "sal for arrangement kommune ledig", "pris leie sal lag og foreninger"] }, { "slug": "sanntidskalender-kommunal-booking", "title": "Sanntidskalender: hvorfor «oppdateres hver natt» ikke holder mål", "description": "Innbyggere som ser feil opptatt-tider og dobbeltbookinger er symptomer på én rot. Hvorfor reaktiv sanntid er en forutsetning, ikke luksus.", "date": "2026-05-18", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Sanntid", "cover": "/images/blog/sanntidskalender_hero_no.webp", "keywords": ["sanntidskalender", "reaktiv runtime", "Convex", "dobbeltbooking", "kommunal booking"] }, { "slug": "sesongleie-fordeling-lag-foreninger", "title": "Sesongleie: Slik fordeler du kommunale lokaler rettferdig", "description": "Sesongleie er kommunens største bookingoppgave og kilden til flest klager. Slik håndterer Digilist regelstyrt fordeling og saksbehandling.", "date": "2026-05-12", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Sesongleie", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["sesongleie", "lag og foreninger", "fordeling", "kommunal booking", "idrettshall"] }, { "slug": "sesongtildeling-idrettshall-saksbehandler-guide", "title": "Sesongtildeling av idrettshall: saksbehandlerens komplette guide", "description": "Slik tildeler du treningstid i kommunens idrettshaller: søknadsfrister, prioritering, konflikthåndtering, drop-in og rapportering til idrettsrådet.", "date": "2026-07-14", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "Saksbehandler", "cover": "/images/blog/sesongleie_hero_no.webp", "keywords": ["sesongtildeling idrettshall", "tildeling treningstid", "idrettshall ledige tider", "søknad treningstid sesong", "klage tildelt treningstid", "drop-in idrettshall"] }, { "slug": "somlos-betaling-vipps-ehf", "title": "Sømløs betaling med Vipps, kort og EHF: sammenheng slår valg", "description": "En kommune med fire betalingsmåter, men uten avstemming, har bare fire kanaler å feilsøke. Slik kobler Digilist betaling sammen ende til ende.", "date": "2026-05-19", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Betaling", "cover": "/images/blog/somlos_betaling_hero_no.webp", "keywords": ["Vipps", "Stripe Connect", "EHF", "Peppol", "kommunal fakturering", "regnskap"] }, { "slug": "ssa-l-2026-bookingsystem-kommune", "title": "Hva kreves av et kommunalt bookingsystem i 2026?", "description": "SSA-L 2026 setter nye krav til kommunale bookingsystemer. Vi går gjennom sanntid, sesongleie, ID-porten, EHF og hva som skal til for å oppfylle kravspesifikasjonen.", "date": "2026-05-14", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Anskaffelse", "cover": "/images/blog/ssal_2026_booking_hero.webp", "keywords": ["SSA-L 2026", "kommunalt bookingsystem", "anskaffelse", "kravspesifikasjon", "Digdir"] }, { "slug": "tilgjengelighetskalender-innbygger", "title": "Tilgjengelighet på første blikk: innbyggerens kalender", "description": "En kalender som krever forklaring har feilet. Slik viser Digilist ledig, opptatt og blokkert tid på en måte enhver innbygger forstår uten hjelp.", "date": "2026-05-23", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 6, "tag": "UX", "cover": "/images/blog/availability_calendar_hero_no.webp", "keywords": ["tilgjengelighetskalender", "kommunal booking", "innbygger UX", "kalender design", "ledige tider"] }, { "slug": "universell-utforming-wcag-kommunal-booking", "title": "Universell utforming: WCAG 2.1 AA er minimumskravet", "description": "Diskrimineringsloven § 17a gjør universell utforming pliktig for kommunale digitale tjenester. Slik bygger Digilist for revisjon og reell tilgjengelighet.", "date": "2026-05-15", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 8, "tag": "Universell utforming", "cover": "/images/blog/accessibility_hero_no.webp", "keywords": ["universell utforming", "WCAG 2.1 AA", "tilgjengelighet", "Digdir", "Likestillings- og diskrimineringsloven"] }, { "slug": "utleieobjekt-veiviser-steg-for-steg", "title": "Nytt utleieobjekt: Digilist-veiviseren steg for steg", "description": "Seks steg, hjelpetekst i hvert felt, lagring underveis. Publisert på under tjue minutter, og du kan endre alt etter publisering.", "date": "2026-05-26", "author": "Ibrahim Rahmani", "role": "Grunnlegger, Digilist", "readingMinutes": 7, "tag": "Utleier", "cover": "/images/blog/wizard_utleieobjekt_hero.svg", "keywords": ["utleieobjekt", "veiviser", "wizard", "publisere lokale", "Digilist utleier", "booking onboarding"] }];
const posts = [...blogMeta].sort((a, b) => a.date < b.date ? 1 : -1);
function getAllPosts() {
  return posts;
}
function previewCover(cover) {
  const match = cover == null ? void 0 : cover.match(/^(.*)\.(webp|jpg|jpeg|png)$/i);
  if (!match) return cover;
  return `${match[1]}-preview.webp`;
}
function formatPostDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
const FAQ_CATEGORIES = [
  {
    id: "produkt",
    label: "Om Digilist",
    description: "Hva Digilist er, hvem som bruker det, og hva som skiller plattformen fra alternativene.",
    questions: [
      {
        q: "Hva er Digilist?",
        a: "Digilist er en norsk digital plattform for utleie og booking av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie, fakturering og rapportering i én løsning, bygget for både private utleiere og norske kommuner.",
        keywords: ["digilist", "hva er", "bookingplattform"]
      },
      {
        q: "Hvem står bak Digilist?",
        a: "Digilist er utviklet av Xala Technologies AS, et norsk teknologiselskap basert i Nesbruveien 75, 1394 Nesbru. Selskapet utvikler digitale løsninger for offentlig sektor og næringsliv i Norge.",
        keywords: ["xala", "leverandør", "selskap"]
      },
      {
        q: "Hvilke organisasjoner bruker Digilist i dag?",
        a: "Digilist brukes blant andre av Nordre Follo kommune (12 anlegg, ~340 lag og foreninger, ~1 200 bookinger/mnd), Rønningen Selskapslokale (Asker), Lier Bygdetun og RightSize Group (Nesbru). Plattformen håndterer både offentlige og private utleiere.",
        keywords: ["kunder", "referanser", "nordre follo", "rønningen"]
      },
      {
        q: "Hva skiller Digilist fra andre bookingsystemer?",
        a: "Digilist er bygget for norske krav fra grunnen: Vipps, BankID, ID-porten, EHF/Peppol, BRREG og Digdir Designsystemet er innebygd. Én plattform håndterer både privat utleie og kommunal drift. Convex' reaktive runtime gir sanntid uten polling, og all data lagres i Norge og EU.",
        keywords: ["differensiering", "konkurrenter", "fordeler"]
      }
    ]
  },
  {
    id: "funksjonalitet",
    label: "Funksjonalitet",
    description: "Hva plattformen kan gjøre: fra booking og betaling til sesongleie og rapportering.",
    questions: [
      {
        q: "Hvilke betalingsmetoder støtter Digilist?",
        a: "Digilist støtter Vipps (mobil + web), kortbetaling via Stripe Connect (Express), depositum, fakturering og EHF/Peppol for offentlig fakturering. Refusjonsregler kan tilpasses per anlegg og brukergruppe.",
        keywords: ["betaling", "vipps", "stripe", "ehf"]
      },
      {
        q: "Støtter Digilist sanntidstilgjengelighet?",
        a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart for alle brukere, drevet av Convex' reaktive runtime, ingen polling eller refresh nødvendig.",
        keywords: ["sanntid", "kalender", "real-time"]
      },
      {
        q: "Hvordan håndteres sesongleie for lag og foreninger?",
        a: "Digilist har en egen sesongleie-modul med søknadsportal for lag og foreninger, BRREG-verifisering av organisasjoner, regelstyrt fordelingsforslag basert på kommunens prioriteringsregler, saksbehandlerverktøy for justering og automatisk varsling. Tilskudd og kapasitetsutnyttelse rapporteres automatisk.",
        keywords: ["sesongleie", "lag", "foreninger", "fordeling"]
      },
      {
        q: "Hva er forskjellen på auto-godkjenning og manuell godkjenning?",
        a: "Auto-godkjenning bekrefter bookinger umiddelbart basert på regler (lave verdier, korte bookinger, verifiserte brukere). Manuell godkjenning sender bookinger til saksbehandler-kø for kontroll. Begge moduser kan kombineres: auto for hovedtidsperiode, manuell for unntak.",
        keywords: ["godkjenning", "automatisk", "manuell"]
      },
      {
        q: "Støtter Digilist digital nøkkel og adgangskontroll?",
        a: "Ja. Salto KS digital nøkkel er integrert. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt. Vaktmestere og driftsroller varsles automatisk om aktive bookinger.",
        keywords: ["digital nøkkel", "salto", "adgang"]
      },
      {
        q: "Hvordan varsles vaktmestere og driftspersonell?",
        a: "Når en booking bekreftes, sendes automatiske varsler til vaktmester, renholdspersonell, vekter og andre relevante driftsroller, via e-post, SMS eller varsler i Digilist-appen. Varslene tilpasses per anlegg.",
        keywords: ["varsling", "drift", "vaktmester"]
      }
    ]
  },
  {
    id: "kommune",
    label: "For kommuner",
    description: "SSA-L 2026, anskaffelse, sesongleie og hvordan kommunen kan starte en pilot.",
    questions: [
      {
        q: "Oppfyller Digilist SSA-L 2026-kravene?",
        a: "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering.",
        keywords: ["ssa-l", "anskaffelse", "krav"]
      },
      {
        q: "Kan kommunen importere bookinger fra eksisterende system?",
        a: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi tar over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen.",
        keywords: ["migrasjon", "rco", "import"]
      },
      {
        q: "Hva er pilotprogrammet for kommuner?",
        a: "Vi tilbyr norske kommuner en gratis pilotfase hvor Digilist hjelper med oppsett og publisering av kommunale lokaler og anlegg. Kommunen får egen administrativ tilgang. Målet er ikke å erstatte eksisterende prosesser, men å utforske hvordan Digilist kan supplere kommunens digitale tjenester.",
        keywords: ["pilot", "gratis", "start"]
      },
      {
        q: "Hvor lang tid tar implementeringen for en kommune?",
        a: "En typisk kommunal etableringsfase tar 6–12 uker, avhengig av antall anlegg og kompleksiteten av eksisterende data. Pilotopplegg kan komme i gang på under to uker. Detaljert tidslinje finnes i Bilag 3 for SSA-L-anskaffelser.",
        keywords: ["implementering", "tidslinje", "etablering"]
      },
      {
        q: "Hvilke kommunale anleggstyper støttes?",
        a: "Idrettshaller, svømmehaller, gymsaler, fotballbaner, møterom, kantiner, kulturhus, samfunnshus, kjøretøy, AV-utstyr og ressurser. Hver anleggstype kan ha egne regler for kapasitet, prising og brukergrupper.",
        keywords: ["anlegg", "idrettshall", "møterom", "kulturhus"]
      }
    ]
  },
  {
    id: "samsvar",
    label: "Samsvar og sikkerhet",
    description: "GDPR, ISO 27001, datalokasjon og hvordan kommunens persondata behandles.",
    questions: [
      {
        q: "Er Digilist GDPR-kompatibel?",
        a: "Ja. Digilist er GDPR-kompatibel og leverer standard databehandleravtale (DPA) før kontraktsinngåelse. Plattformen har dataregister, rett til sletting, audit-logg og prosedyrer for sikkerhetsbrudd og innsynsbegjæringer.",
        keywords: ["gdpr", "personvern"]
      },
      {
        q: "Hvor lagres dataene?",
        a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier.",
        keywords: ["datalokasjon", "norge", "eu"]
      },
      {
        q: "Er Digilist ISO 27001 og 27701-sertifisert?",
        a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel.",
        keywords: ["iso", "27001", "27701", "sertifisering"]
      },
      {
        q: "Oppfyller Digilist WCAG 2.0 AA?",
        a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal.",
        keywords: ["wcag", "universell utforming", "tilgjengelighet"]
      },
      {
        q: "Hva inneholder audit-loggen?",
        a: "Hver mutasjon i systemet (bookinger, godkjenninger, endringer, slettinger, brukerhandlinger) registreres med tidsstempel, brukerident og endringsdetaljer. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.",
        keywords: ["audit", "logg", "revisjon"]
      }
    ]
  },
  {
    id: "teknologi",
    label: "Teknologi",
    description: "Stack, arkitektur, integrasjoner og hvordan plattformen er bygget.",
    questions: [
      {
        q: "Hvilken teknologi er Digilist bygget på?",
        a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten.",
        keywords: ["stack", "teknologi", "react", "convex"]
      },
      {
        q: "Hvilke integrasjoner støttes?",
        a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking.",
        keywords: ["integrasjoner", "tredjepart"]
      },
      {
        q: "Har Digilist åpne API-er?",
        a: "Ja. Digilist tilbyr REST- og webhook-API-er for bookinger, brukere, betaling og integrasjon med eksisterende kommunale systemer. API-dokumentasjon er tilgjengelig for kunder og potensielle kunder under signert NDA.",
        keywords: ["api", "integrasjon", "webhook"]
      },
      {
        q: "Hvor høy oppetid garanterer Digilist?",
        a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig.",
        keywords: ["oppetid", "sla", "uptime"]
      },
      {
        q: "Hvor rask er plattformen?",
        a: "API-respons under 200 ms i 95-persentilen. Sanntid-oppdateringer leveres som push fra Convex' reaktive runtime, ikke polling. Frontend laster mindre enn 300 kB gzip og Lighthouse-scoring er 90+ på alle parametere.",
        keywords: ["ytelse", "hastighet", "performance"]
      }
    ]
  },
  {
    id: "priser",
    label: "Priser og kontrakter",
    description: "Hva Digilist koster, hvordan vi prises og hvilke kontraktsformer som er tilgjengelige.",
    questions: [
      {
        q: "Hva koster Digilist?",
        a: "Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tilbyr en gratis demo og pristilbud basert på kommunens eller bedriftens spesifikke behov. For kommuner i pilotfase er bruken gratis i prøveperioden.",
        keywords: ["pris", "kostnad"]
      },
      {
        q: "Er det kostnader knyttet til integrasjoner?",
        a: "Standardintegrasjoner (Vipps, BankID, ID-porten, EHF, Visma, Tripletex, Fiken, PowerOffice, Microsoft 365, Salto KS) er inkludert. Spesialtilpassede integrasjoner mot kommunens egne systemer prises separat etter omfang.",
        keywords: ["integrasjonspris", "tilkobling"]
      },
      {
        q: "Hva slags kontrakter tilbys?",
        a: "For offentlig sektor tilbyr vi SSA-L 2026-kontrakter med standard bilag (1–6). For privat sektor: månedlig eller årlig abonnement. Pilotperioder er alltid gratis og uforpliktende.",
        keywords: ["kontrakt", "ssa-l", "abonnement"]
      }
    ]
  },
  {
    id: "support",
    label: "Support og opplæring",
    description: "Hvordan vi hjelper deg i gang og holder plattformen i drift.",
    questions: [
      {
        q: "Hvilken support inkluderes?",
        a: "Telefon- og e-post-support i ordinære arbeidstider (08:00–17:00 norsk tid), kunnskapsbase, opplæringsmateriale og dedikert onboarding-konsulent i etableringsfasen. 24/7 driftsovervåking med automatisk alarmering.",
        keywords: ["support", "hjelp", "kundestøtte"]
      },
      {
        q: "Får vi opplæring av brukere og saksbehandlere?",
        a: "Ja. I etableringsfasen tilbys workshops for saksbehandlere, administratorer og driftsroller. Opplæringsmateriell (video, dokumentasjon) er tilgjengelig kontinuerlig. Vi tilbyr også løpende opplæring ved behov.",
        keywords: ["opplæring", "kurs", "workshop"]
      },
      {
        q: "Hvordan rapporteres feil og forbedringsforslag?",
        a: "Via support@digilist.no, statusside, eller direkte i administrasjonsverktøyet. Feilrettinger prioriteres etter alvorlighetsgrad (kritisk → høy → middels → lav). Forbedringsforslag samles i offentlig veikart hvor kommuner kan stemme.",
        keywords: ["feilmelding", "bug", "rapportering"]
      }
    ]
  }
];
function allFAQEntries() {
  return FAQ_CATEGORIES.flatMap(
    (cat) => cat.questions.map((q) => ({ ...q, category: cat.label }))
  );
}
const HOMEPAGE_FAQ = [
  {
    q: "Hva er Digilist?",
    a: "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning."
  },
  {
    q: "Hvilke kommuner og utleiere bruker Digilist?",
    a: "Digilist brukes av norske kommuner og private utleiere, blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group."
  },
  {
    q: "Hvilke betalingsmetoder støttes?",
    a: "Vipps, BankID, Stripe Connect for kort, samt EHF/Peppol-fakturering. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap er aktive."
  },
  {
    q: "Er Digilist GDPR- og ISO-sertifisert?",
    a: "Ja. Digilist oppfyller GDPR, er ISO 27001 og ISO 27701 sertifisert og følger WCAG 2.0 AA. Data lagres i Norge og EU."
  },
  {
    q: "Hvordan håndteres sesongleie til lag og foreninger?",
    a: "Digilist har en egen sesongleie-modul med søknadsbehandling, regelstyrt fordeling og rapportering."
  },
  {
    q: "Støtter Digilist sanntidstilgjengelighet?",
    a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid og oppdateres umiddelbart."
  }
];
const SECTION_ITEMS = [
  { id: "sec-marketplace", kind: "section", title: "Finn og book", subtitle: "Lokaler, overnatting, arrangementer, utstyr, tjenester", href: "#marketplace", isAnchor: true, keywords: ["finn", "book", "leie", "marketplace"] },
  { id: "sec-agenter", kind: "section", title: "AI-agenter", subtitle: "Innebygd intelligens", href: "#agenter", isAnchor: true, keywords: ["ai", "agenter", "intelligens", "automatisering"] },
  { id: "sec-for-utleiere", kind: "section", title: "For utleiere og kommuner", subtitle: "Én plattform, fra ett lokale til hele kommunen", href: "#for-utleiere", isAnchor: true, keywords: ["kommune", "utleier", "pilot", "sesongleie", "plattform"] },
  { id: "sec-funksjonalitet", kind: "section", title: "Slik fungerer det", subtitle: "Fire steg fra forespørsel til oppgjør", href: "#funksjonalitet", isAnchor: true, keywords: ["howitworks", "steg", "flyt"] },
  { id: "sec-brukerhistorier", kind: "section", title: "Brukerhistorier", subtitle: "Kunder som bruker Digilist", href: "#brukerhistorier", isAnchor: true, keywords: ["kunder", "case", "stories"] },
  { id: "sec-faq", kind: "section", title: "Ofte stilte spørsmål", subtitle: "Booking, betaling, sesongleie, samsvar", href: "#faq", isAnchor: true, keywords: ["faq", "spørsmål", "svar"] },
  { id: "sec-kontakt", kind: "section", title: "Kontakt", subtitle: "Book demo / Snakk med oss", href: "#kontakt", isAnchor: true, keywords: ["demo", "kontakt"] }
];
const ROUTE_ITEMS = [
  { id: "r-blogg", kind: "route", title: "Blogg", subtitle: "Alle artikler", href: "/blogg" },
  { id: "r-faq", kind: "route", title: "FAQ", subtitle: "Ofte stilte spørsmål", href: "/faq" },
  { id: "r-book-demo", kind: "route", title: "Book demo", subtitle: "30–45 min, gratis", href: "/book-demo" },
  { id: "r-booking-lokaler", kind: "route", title: "Booking av lokaler og møterom", subtitle: "Landingsside", href: "/booking-av-lokaler-og-moterom" },
  { id: "r-bookingsystem-kommune", kind: "route", title: "Bookingsystem for kommuner", subtitle: "SSA-L 2026", href: "/bookingsystem-kommune" },
  { id: "r-teknologi", kind: "route", title: "Teknologi og sikkerhet", subtitle: "Stack, arkitektur, integrasjoner, samsvar", href: "/teknologi", keywords: ["teknologi", "arkitektur", "convex", "postgresql", "iso 27001", "gdpr", "wcag", "sikkerhet", "datalagring", "integrasjoner"] },
  { id: "r-om-oss", kind: "route", title: "Om Digilist", subtitle: "Xala Technologies AS", href: "/om-oss", keywords: ["om oss", "xala", "selskap", "leverandør", "kolofon"] },
  { id: "r-personvern", kind: "route", title: "Personvern", subtitle: "GDPR + ISO 27001/27701", href: "/personvern" },
  { id: "r-salgsvilkar", kind: "route", title: "Salgsvilkår", subtitle: "Avtalevilkår", href: "/salgsvilkar" },
  { id: "r-cookies", kind: "route", title: "Cookies", subtitle: "Cookie-policy", href: "/cookies" }
];
const MARKETPLACE_ITEMS = [
  // hubs
  { id: "m-leie", kind: "route", title: "Finn lokale", subtitle: "Selskapslokale, møterom, kulturhus, idrettshall", href: "/leie", keywords: ["leie lokale", "finn lokale", "festlokale", "book lokale"] },
  { id: "m-overnatting", kind: "route", title: "Overnatting", subtitle: "Hytte, leilighet, rom, feriehus", href: "/overnatting", keywords: ["overnatting", "leie overnatting", "book overnatting"] },
  { id: "m-arrangementer", kind: "route", title: "Arrangementer", subtitle: "Billetter til konsert, teater, festival, sport", href: "/arrangementer", keywords: ["billetter", "kjøp billett", "arrangement", "event"] },
  { id: "m-utstyr", kind: "route", title: "Leie utstyr", subtitle: "Festutstyr, verktøy, lyd og lys, sport", href: "/utstyr", keywords: ["leie utstyr", "utstyr til leie"] },
  { id: "m-tjenester", kind: "route", title: "Tjenester", subtitle: "Catering, DJ, musiker, dekor", href: "/tjenester", keywords: ["tjenester", "book tjeneste", "arrangement"] },
  { id: "m-billettsystem", kind: "route", title: "Billettsystem", subtitle: "Selg billetter med rabatt, kupong og gavekort", href: "/billettsystem", keywords: ["billettsystem", "selge billetter", "rabattkode", "kupong", "gavekort"] },
  // leie
  { id: "m-selskapslokale", kind: "route", title: "Leie selskapslokale", subtitle: "Bryllup, jubileum, konfirmasjon, fest", href: "/leie/selskapslokale", keywords: ["selskapslokale", "festlokale", "bryllupslokale", "leie lokale til fest"] },
  { id: "m-gaard", kind: "route", title: "Leie gård", subtitle: "Gårdsbryllup, låve, selskap", href: "/leie/gaard", keywords: ["leie gård", "gårdsbryllup", "leie låve", "bryllupsgård"] },
  { id: "m-bursdagslokale", kind: "route", title: "Leie bursdagslokale", subtitle: "Barnebursdag og voksenbursdag", href: "/leie/bursdagslokale", keywords: ["bursdagslokale", "lokale til bursdag", "barnebursdag lokale"] },
  { id: "m-kulturhus", kind: "route", title: "Leie kulturhus", subtitle: "Konsert, forestilling, samfunnshus, grendehus", href: "/leie/kulturhus", keywords: ["leie kulturhus", "samfunnshus", "grendehus", "leie sal"] },
  { id: "m-moterom", kind: "route", title: "Leie møterom", subtitle: "Møte, workshop, kurs per time", href: "/leie/moterom", keywords: ["leie møterom", "møterom til leie", "book møterom"] },
  { id: "m-konferanselokale", kind: "route", title: "Leie konferanselokale", subtitle: "Konferanse, seminar, kurs", href: "/leie/konferanselokale", keywords: ["konferanselokale", "konferansesal", "kurslokale"] },
  { id: "m-kontorlokaler", kind: "route", title: "Leie kontorlokaler", subtitle: "Privat kontor, fleksibel leie", href: "/leie/kontorlokaler", keywords: ["leie kontor", "kontorlokaler", "kontor til leie"] },
  { id: "m-coworking", kind: "route", title: "Coworking", subtitle: "Dagplass, kontorfellesskap", href: "/leie/coworking", keywords: ["coworking", "kontorfellesskap", "leie kontorplass", "dagplass"] },
  { id: "m-idrettshall", kind: "route", title: "Leie idrettshall", subtitle: "Enkelttimer, gymsal, trening", href: "/leie/idrettshall", keywords: ["leie idrettshall", "leie gymsal", "hall til leie"] },
  { id: "m-padelbane", kind: "route", title: "Leie padelbane", subtitle: "Book padel per time", href: "/leie/padelbane", keywords: ["leie padelbane", "book padel", "padel"] },
  { id: "m-svommehall", kind: "route", title: "Leie svømmehall", subtitle: "Basseng til bursdag og grupper", href: "/leie/svommehall", keywords: ["leie svømmehall", "leie basseng", "svømmehall"] },
  // overnatting
  { id: "m-hytte", kind: "route", title: "Leie hytte", subtitle: "Helgetur, ferie, familiesamling", href: "/overnatting/hytte", keywords: ["leie hytte", "hytte til leie", "hytteutleie"] },
  { id: "m-leilighet", kind: "route", title: "Leie leilighet", subtitle: "Korttidsleie, byferie, jobbreise", href: "/overnatting/leilighet", keywords: ["leie leilighet", "korttidsleie leilighet"] },
  { id: "m-rom", kind: "route", title: "Leie rom", subtitle: "Gjesterom, rimelig overnatting", href: "/overnatting/rom", keywords: ["leie rom", "gjesterom", "rimelig overnatting"] },
  { id: "m-feriehus", kind: "route", title: "Leie feriehus", subtitle: "Familieferie, gjenforening", href: "/overnatting/feriehus", keywords: ["leie feriehus", "feriehus til leie"] },
  // arrangementer
  { id: "m-konsert", kind: "route", title: "Konsertbilletter", subtitle: "Kjøp billett med Vipps", href: "/arrangementer/konsert", keywords: ["konsertbilletter", "billetter til konsert", "konsert"] },
  { id: "m-teater", kind: "route", title: "Teaterbilletter", subtitle: "Teater, standup, revy", href: "/arrangementer/teater-og-scene", keywords: ["teaterbilletter", "billetter til teater", "forestilling", "standup"] },
  { id: "m-festival", kind: "route", title: "Festivalbilletter", subtitle: "Dagspass, helgepass", href: "/arrangementer/festival", keywords: ["festivalbilletter", "festivalpass", "festival"] },
  { id: "m-sport", kind: "route", title: "Sportsbilletter", subtitle: "Billetter til kamp og idrettsarrangement", href: "/arrangementer/sport", keywords: ["sportsbilletter", "billetter til kamp", "fotballbilletter"] },
  // utstyr
  { id: "m-festutstyr", kind: "route", title: "Leie festutstyr", subtitle: "Telt, bord, stoler, servise", href: "/utstyr/festutstyr", keywords: ["leie festutstyr", "leie telt", "leie bord og stoler"] },
  { id: "m-verktoy", kind: "route", title: "Leie verktøy og maskiner", subtitle: "Minigraver, høytrykksspyler, stillas", href: "/utstyr/verktoy-maskiner", keywords: ["leie verktøy", "leie maskiner", "leie minigraver"] },
  { id: "m-lyd-lys", kind: "route", title: "Leie lyd og lys", subtitle: "Lydanlegg, scenelys, projektor", href: "/utstyr/lyd-og-lys", keywords: ["leie lydanlegg", "leie lyd og lys", "leie projektor"] },
  { id: "m-sport-friluft", kind: "route", title: "Leie sport- og friluftsutstyr", subtitle: "Sykkel, ski, kajakk, telt", href: "/utstyr/sport-og-friluft", keywords: ["leie sportsutstyr", "leie sykkel", "leie ski", "leie kajakk"] },
  // tjenester
  { id: "m-catering", kind: "route", title: "Bestille catering", subtitle: "Koldtbord, tapas, middag", href: "/tjenester/catering", keywords: ["bestille catering", "catering til bryllup", "catering"] },
  { id: "m-dj", kind: "route", title: "Leie DJ", subtitle: "DJ til bryllup, fest, firmafest", href: "/tjenester/dj", keywords: ["leie dj", "dj til bryllup", "dj til fest"] },
  { id: "m-musiker", kind: "route", title: "Leie musiker", subtitle: "Band, solist, livemusikk", href: "/tjenester/musiker", keywords: ["leie musiker", "leie band", "livemusikk bryllup"] },
  { id: "m-dekor", kind: "route", title: "Leie dekor og pynt", subtitle: "Blomster, bordpynt, ballongbue", href: "/tjenester/dekor", keywords: ["leie dekor", "bordpynt", "blomsterdekor", "ballongbue"] }
];
const ACTION_ITEMS = [
  { id: "a-chatbot", kind: "action", title: "Snakk med oss", subtitle: "Åpne chat: svar på under et minutt", href: "#chat", action: "open-chatbot", keywords: ["chat", "spørsmål", "kontakt"] }
];
let cached = null;
function getSearchCorpus() {
  if (cached) return cached;
  const blogItems = getAllPosts().map((p) => ({
    id: `b-${p.slug}`,
    kind: "blog",
    title: p.title,
    subtitle: p.description,
    href: `/blogg/${p.slug}`,
    keywords: [p.tag, ...p.keywords ?? []].filter(Boolean)
  }));
  const faqItems = allFAQEntries().map((e, i) => ({
    id: `f-${i}`,
    kind: "faq",
    title: e.q,
    subtitle: stripFirstSentence(e.a),
    href: `/faq#q-${i}`,
    keywords: [e.category]
  }));
  cached = [
    ...SECTION_ITEMS,
    ...ROUTE_ITEMS,
    ...MARKETPLACE_ITEMS,
    ...blogItems,
    ...faqItems,
    ...ACTION_ITEMS
  ];
  return cached;
}
function stripFirstSentence(text) {
  const s = text.trim();
  const cut = s.search(/[.!?]\s/);
  if (cut === -1) return s.slice(0, 140);
  return s.slice(0, cut + 1);
}
function searchCorpus(query, corpus) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const scored = corpus.map((item) => {
    const haystackParts = [
      item.title,
      item.subtitle ?? "",
      ...item.keywords ?? []
    ];
    const hay = haystackParts.join(" ").toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (!hay.includes(tok)) {
        score = -1;
        break;
      }
      if (item.title.toLowerCase().includes(tok)) score += 5;
      const wordHit = new RegExp(`\\b${escapeRegExp(tok)}`, "i").test(hay);
      if (wordHit) score += 2;
      score += 1;
    }
    if (item.kind === "section") score += 1;
    if (item.kind === "route") score += 0.5;
    return { item, score };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 12);
  return scored.map((r) => r.item);
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const KIND_LABEL = {
  section: "SEKSJON",
  route: "SIDE",
  blog: "BLOGG",
  faq: "FAQ",
  action: "HANDLING"
};
const OPEN_CHAT_EVENT = "digilist:open-chatbot";
function openChatbot(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail }));
}
const TIP_GROUPS = [
  {
    id: "snarveier",
    label: "Snarveier",
    tips: [
      { id: "t-demo", label: "Book demo", href: "/book-demo" },
      { id: "t-chat", label: "Snakk med oss", action: () => openChatbot({ mode: "chat" }) },
      { id: "t-blogg", label: "Blogg", href: "/blogg" },
      { id: "t-faq", label: "FAQ", href: "/faq" }
    ]
  },
  {
    id: "populare-sok",
    label: "Populære søk",
    tips: [
      { id: "p-sesongleie", label: "Sesongleie" },
      { id: "p-vipps", label: "Vipps" },
      { id: "p-ssa-l", label: "SSA-L 2026" },
      { id: "p-bankid", label: "BankID" },
      { id: "p-ehf", label: "EHF" },
      { id: "p-kommune", label: "Kommune" }
    ]
  }
];
function GlobalSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const corpus = useMemo(() => open ? getSearchCorpus() : [], [open]);
  const results = useMemo(
    () => query.trim() ? searchCorpus(query, corpus) : [],
    [query, corpus]
  );
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      var _a;
      if (!((_a = containerRef.current) == null ? void 0 : _a.contains(e.target))) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);
  useEffect(() => {
    const onKey = (e) => {
      var _a;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);
  const selectItem = (item) => {
    setOpen(false);
    setQuery("");
    if (item.action === "open-chatbot") {
      openChatbot({ mode: "chat" });
      return;
    }
    if (item.isAnchor) {
      if (location.pathname === "/") {
        const el = document.querySelector(item.href);
        if (el)
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", item.href);
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
      return;
    }
    navigate(item.href);
  };
  const onTip = (tip) => {
    var _a;
    setOpen(false);
    if (tip.action) {
      tip.action();
      return;
    }
    if (tip.href) {
      navigate(tip.href);
      return;
    }
    setQuery(tip.label);
    setOpen(true);
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const onKeyDown = (e) => {
    var _a;
    if (e.key === "Escape") {
      setOpen(false);
      (_a = inputRef.current) == null ? void 0 : _a.blur();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[selectedIdx];
      if (item) selectItem(item);
    }
  };
  const showTips = !query.trim();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative w-full max-w-[420px] xl:max-w-[480px]",
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-2.5 border border-hairline-strong rounded-sm bg-paper px-3 py-2 transition-colors duration-quick ease-editorial",
              open ? "border-navy" : "hover:border-ink"
            ),
            children: [
              /* @__PURE__ */ jsx(
                Search,
                {
                  className: "h-4 w-4 text-ink-faint shrink-0",
                  "aria-hidden": "true",
                  strokeWidth: 1.5
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "search",
                  value: query,
                  onChange: (e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  },
                  onFocus: () => setOpen(true),
                  onKeyDown,
                  placeholder: "Søk i Digilist…",
                  "aria-label": "Søk i Digilist",
                  className: "flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none min-w-0"
                }
              ),
              query ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    setQuery("");
                    (_a = inputRef.current) == null ? void 0 : _a.focus();
                  },
                  "aria-label": "Tøm søk",
                  className: "text-ink-faint hover:text-ink text-lg leading-none px-1",
                  children: "×"
                }
              ) : /* @__PURE__ */ jsx(
                "kbd",
                {
                  className: "hidden lg:inline-flex items-center font-mono text-[0.65rem] tracking-widest text-ink-faint border border-rule rounded-sm px-1.5 py-0.5",
                  "aria-hidden": "true",
                  children: "⌘K"
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsx(
          "div",
          {
            role: "dialog",
            "aria-label": "Søkeresultater",
            className: "absolute left-0 right-0 mt-2 bg-paper border border-hairline-strong rounded-sm shadow-2xl max-h-[70vh] overflow-y-auto z-50",
            children: showTips ? /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-5", children: [
              TIP_GROUPS.map((group) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint mb-2", children: group.label }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: group.tips.map((tip) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onTip(tip),
                    className: "font-sans text-xs px-3 py-1.5 border border-rule rounded-full text-ink hover:bg-paper-deep hover:border-ink transition-colors duration-quick ease-editorial",
                    children: tip.label
                  },
                  tip.id
                )) })
              ] }, group.id)),
              /* @__PURE__ */ jsxs("p", { className: "editorial-mono-caption text-ink-faint pt-2 border-t border-rule", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "↑↓" }),
                " bla ·",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "↵" }),
                " velg ·",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: "esc" }),
                " lukk"
              ] })
            ] }) : results.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-base text-ink-soft", children: [
                "Ingen treff for «",
                query,
                "»."
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setOpen(false);
                    setQuery("");
                    openChatbot({ mode: "chat" });
                  },
                  className: "mt-3 inline-block font-sans text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px]",
                  children: "Spør oss direkte i chat ↗"
                }
              )
            ] }) : /* @__PURE__ */ jsx("ul", { role: "listbox", className: "py-1", children: results.map((item, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => selectItem(item),
                onMouseEnter: () => setSelectedIdx(i),
                "aria-selected": i === selectedIdx,
                className: cn(
                  "w-full text-left px-4 py-3 flex items-start gap-4 transition-colors duration-quick ease-editorial",
                  i === selectedIdx ? "bg-paper-deep" : "hover:bg-paper-deep/60"
                ),
                children: [
                  /* @__PURE__ */ jsx("span", { className: "font-mono text-[0.65rem] tracking-widest text-accent-text mt-0.5 min-w-[60px]", children: KIND_LABEL[item.kind] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "block font-sans text-base text-ink leading-snug truncate", children: item.title }),
                    item.subtitle && /* @__PURE__ */ jsx("span", { className: "block text-sm text-ink-soft leading-snug mt-0.5 line-clamp-2", children: item.subtitle })
                  ] })
                ]
              }
            ) }, item.id)) })
          }
        )
      ]
    }
  );
}
function SectionRule({ label, align = "left", className }) {
  if (!label) {
    return /* @__PURE__ */ jsx("div", { className: cn("rule-h my-8", className) });
  }
  const alignment = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-6 mb-10 lg:mb-12", alignment, className), children: [
    align !== "left" && /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-rule" }),
    /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption whitespace-nowrap", children: label }),
    align !== "right" && /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-rule" })
  ] });
}
const PRESETS = {
  hero: '"opsz" 72, "wght" 500',
  display: '"opsz" 72, "wght" 500',
  section: '"opsz" 60, "wght" 540',
  sub: '"opsz" 30, "wght" 580',
  quote: '"opsz" 44, "wght" 440',
  dropcap: '"opsz" 72, "wght" 620',
  "body-italic": '"opsz" 18, "wght" 480'
};
function getFraunces(size) {
  return PRESETS[size];
}
const SIZE_CLASSES$1 = {
  hero: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  display: "text-3xl md:text-4xl lg:text-5xl tracking-tight",
  section: "text-2xl md:text-3xl lg:text-4xl tracking-tight",
  sub: "text-lg md:text-xl"
};
const SIZE_TO_FRAUNCES = {
  hero: "hero",
  display: "display",
  section: "section",
  sub: "sub"
};
function EditorialHeading({
  as: Tag = "h2",
  size = "section",
  children,
  className
}) {
  const variation = getFraunces(SIZE_TO_FRAUNCES[size]);
  return /* @__PURE__ */ jsx(
    Tag,
    {
      className: cn(
        "font-serif text-ink",
        SIZE_CLASSES$1[size],
        size === "sub" && "italic",
        className
      ),
      style: {
        fontVariationSettings: variation,
        lineHeight: size === "hero" ? 1 : size === "display" ? 1.02 : 1.08,
        letterSpacing: size === "hero" ? "-0.02em" : "-0.015em"
      },
      children
    }
  );
}
function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 1e-3
  });
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "fixed top-0 left-0 right-0 h-px bg-navy origin-left z-[60]",
      style: { scaleX },
      "aria-hidden": "true"
    }
  );
}
function GrainOverlay() {
  return /* @__PURE__ */ jsx("div", { className: "grain", "aria-hidden": "true" });
}
const VARIANT_CLASSES = {
  primary: "bg-navy text-on-navy border border-navy shadow-[inset_0_1px_0_hsl(0_0%_100%/0.22),inset_0_-2px_5px_hsl(207_100%_9%/0.45),0_2px_5px_-1px_hsl(207_100%_12%/0.45),0_11px_24px_-8px_hsl(207_100%_17%/0.55)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.26),inset_0_-2px_5px_hsl(207_100%_9%/0.5),0_6px_14px_-3px_hsl(207_100%_12%/0.5),0_20px_38px_-10px_hsl(207_100%_17%/0.65)] active:translate-y-0 active:shadow-[inset_0_2px_5px_hsl(207_100%_8%/0.55)]",
  outline: "text-ink border border-hairline-strong bg-gradient-to-b from-paper to-paper-deep/60 shadow-[0_1px_2px_rgba(10,18,40,0.08),0_6px_16px_-10px_rgba(10,18,40,0.25)] hover:-translate-y-0.5 hover:border-accent-text/40 hover:shadow-[0_10px_24px_-10px_rgba(10,18,40,0.34)] active:translate-y-0",
  inverted: "bg-paper text-ink border border-paper shadow-[0_2px_6px_-1px_rgba(10,18,40,0.16),0_10px_24px_-12px_rgba(10,18,40,0.3)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(10,18,40,0.4)] active:translate-y-0",
  link: "bg-transparent text-ink border-0 px-0 hover:underline underline-offset-8 decoration-[0.5px]"
};
const SIZE_CLASSES = {
  sm: "text-xs px-4 py-2 gap-2",
  md: "text-sm px-5 py-3 gap-2.5",
  lg: "text-sm px-6 py-4 gap-3"
};
const BASE = "group inline-flex items-center justify-center rounded-md font-sans uppercase tracking-widest font-medium transition-all duration-quick ease-editorial focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";
const EditorialButton = forwardRef((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    icon = true,
    children,
    className,
    ...rest
  } = props;
  const showIcon = icon === true || icon && icon !== false;
  const iconNode = icon === true || icon === void 0 ? /* @__PURE__ */ jsx(
    ArrowUpRight,
    {
      className: "h-4 w-4 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
      "aria-hidden": "true"
    }
  ) : icon;
  const classes = cn(
    BASE,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
  if ("href" in rest && rest.href !== void 0) {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        ref,
        className: classes,
        ...rest,
        children: [
          /* @__PURE__ */ jsx("span", { children }),
          showIcon && iconNode
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      className: classes,
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { children }),
        showIcon && iconNode
      ]
    }
  );
});
EditorialButton.displayName = "EditorialButton";
const ROUTES = [
  { label: "Forsiden", to: "/", eyebrow: "Hjem" },
  { label: "Lokaler", to: "/leie", eyebrow: "Selskap · møte · idrett · kultur" },
  { label: "Overnatting", to: "/overnatting", eyebrow: "Hytte · leilighet · rom" },
  { label: "Arrangementer", to: "/arrangementer", eyebrow: "Konsert · teater · festival" },
  { label: "Utstyr", to: "/utstyr", eyebrow: "Fest · verktøy · lyd & lys" },
  { label: "Tjenester", to: "/tjenester", eyebrow: "Catering · DJ · musiker · dekor" },
  { label: "Blogg", to: "/blogg", eyebrow: "Artikler" },
  { label: "FAQ", to: "/faq", eyebrow: "Vanlige spørsmål" },
  { label: "Transparens", to: "/transparens", eyebrow: "Live kvalitetsrapport" },
  {
    label: "Booking av lokaler og møterom",
    to: "/booking-av-lokaler-og-moterom",
    eyebrow: "Landingsside"
  },
  {
    label: "Bookingsystem for kommuner",
    to: "/bookingsystem-kommune",
    eyebrow: "SSA-L 2026"
  },
  {
    label: "Billettsystem",
    to: "/billettsystem",
    eyebrow: "Rabatt · kupong · gavekort"
  },
  {
    label: "Teknologi og sikkerhet",
    to: "/teknologi",
    eyebrow: "Plattform · samsvar"
  },
  { label: "Om oss", to: "/om-oss", eyebrow: "Xala Technologies" },
  { label: "Book demo", to: "/book-demo", eyebrow: "30–45 min" }
];
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        "aria-label": "Åpne meny",
        "aria-expanded": open,
        "aria-controls": "mobile-menu-drawer",
        className: "xl:hidden inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial",
        children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5", strokeWidth: 1.75, "aria-hidden": "true" })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        onClick: () => setOpen(false),
        className: cn(
          "xl:hidden fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-normal ease-editorial",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        id: "mobile-menu-drawer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Hovedmeny",
        className: cn(
          "xl:hidden fixed right-0 top-0 bottom-0 z-50 w-[88%] max-w-sm bg-paper border-l border-hairline-strong shadow-2xl flex flex-col transition-transform duration-normal ease-editorial",
          open ? "translate-x-0" : "translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 py-4 border-b border-hairline-strong", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/",
                onClick: () => setOpen(false),
                className: "inline-flex items-center gap-3",
                "aria-label": "Digilist, forsiden",
                children: [
                  /* @__PURE__ */ jsx("img", { src: "/logo.svg", alt: "", "aria-hidden": "true", width: 64, height: 64, className: "h-9 w-auto" }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif text-2xl text-ink leading-none",
                      style: {
                        fontVariationSettings: '"opsz" 96, "wght" 460',
                        letterSpacing: "-0.02em"
                      },
                      children: "Digilist"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                "aria-label": "Lukk meny",
                className: "inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial",
                children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5", strokeWidth: 1.75, "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "nav",
            {
              "aria-label": "Sider",
              className: "flex-1 overflow-y-auto px-5 py-6 space-y-1",
              children: [
                /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint mb-4", children: "NAVIGASJON" }),
                ROUTES.map((r) => /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: r.to,
                    className: "group block border-b border-rule py-4 transition-colors duration-quick ease-editorial hover:bg-paper-deep/50",
                    children: [
                      r.eyebrow && /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: r.eyebrow }),
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: "mt-1 flex items-baseline justify-between gap-3 font-serif text-2xl text-ink leading-tight",
                          style: {
                            fontVariationSettings: '"opsz" 36, "wght" 480',
                            letterSpacing: "-0.01em"
                          },
                          children: [
                            r.label,
                            /* @__PURE__ */ jsx(
                              ArrowUpRight,
                              {
                                className: "h-4 w-4 text-ink-faint shrink-0 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                                strokeWidth: 1.75,
                                "aria-hidden": "true"
                              }
                            )
                          ]
                        }
                      )
                    ]
                  },
                  r.to
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxs("footer", { className: "border-t border-hairline-strong px-5 py-5 space-y-3 bg-accent-tinted", children: [
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "primary",
                size: "lg",
                href: "/leie",
                className: "w-full",
                children: "Finn lokale"
              }
            ),
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "outline",
                size: "lg",
                href: "/book-demo",
                className: "w-full",
                children: "Book demo"
              }
            ),
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "outline",
                size: "lg",
                onClick: () => {
                  setOpen(false);
                  openChatbot({ mode: "chat" });
                },
                className: "w-full",
                children: "Snakk med oss"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://app.digilist.no",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block text-center font-mono text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px] pt-2",
                children: "Åpne plattformen ↗"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const NavLink = forwardRef(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      NavLink$1,
      {
        ref,
        to,
        className: ({ isActive, isPending }) => cn(className, isActive && activeClassName, isPending && pendingClassName),
        ...props
      }
    );
  }
);
NavLink.displayName = "NavLink";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, { ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props }));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const SOLUTIONS = [
  {
    label: "Booking av lokaler og møterom",
    to: "/booking-av-lokaler-og-moterom",
    eyebrow: "Landingsside"
  },
  {
    label: "Bookingsystem for kommuner",
    to: "/bookingsystem-kommune",
    eyebrow: "SSA-L 2026"
  },
  {
    label: "Billettsystem",
    to: "/billettsystem",
    eyebrow: "Rabatt · kupong · gavekort"
  },
  {
    label: "Teknologi og sikkerhet",
    to: "/teknologi",
    eyebrow: "Plattform · samsvar"
  },
  {
    label: "Om oss",
    to: "/om-oss",
    eyebrow: "Xala Technologies"
  }
];
const MARKETPLACES = [
  { label: "Lokaler", to: "/leie", eyebrow: "Selskap · møte · idrett · kultur" },
  { label: "Overnatting", to: "/overnatting", eyebrow: "Hytte · leilighet · rom" },
  { label: "Arrangementer", to: "/arrangementer", eyebrow: "Konsert · teater · festival" },
  { label: "Utstyr", to: "/utstyr", eyebrow: "Fest · verktøy · lyd & lys" },
  { label: "Tjenester", to: "/tjenester", eyebrow: "Catering · DJ · musiker · dekor" }
];
const PRIMARY_NAV = [
  { label: "Blogg", to: "/blogg" },
  { label: "FAQ", to: "/faq" },
  // Lowest-priority item: dropped first when the desktop assistant rail
  // (permanently reserving 22rem, see `--rail-w` below) leaves this nav too
  // little room, so higher-priority items — notably "Book demo" — don't
  // overflow into and get covered by the actions column at `xl`. Still
  // reachable via the mobile drawer and footer at every width.
  { label: "Transparens", to: "/transparens", collapseBelow2xl: true },
  { label: "Book demo", to: "/book-demo" }
];
const NAV_LINK = "font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial whitespace-nowrap";
const NAV_LINK_ACTIVE = "text-ink underline underline-offset-8 decoration-[0.5px] decoration-ink";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const solutionsActive = SOLUTIONS.some(
    (s) => location.pathname.startsWith(s.to)
  );
  const finnActive = MARKETPLACES.some(
    (m) => location.pathname.startsWith(m.to)
  );
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#main",
        className: "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-navy focus:text-on-navy focus:px-4 focus:py-2 focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2",
        children: "Hopp til hovedinnhold"
      }
    ),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: cn(
          // Height is constant on scroll (py-3 both states) so the navbar's
          // bottom border stays aligned with the assistant rail's 76px header;
          // only the border weight + shadow change as the scroll cue.
          "fixed top-0 left-0 right-0 lg:right-[var(--rail-w,22rem)] z-40 bg-paper border-b py-3 transition-all duration-normal ease-editorial",
          isScrolled ? "border-rule-strong shadow-[0_1px_0_0_hsl(var(--rule))]" : "border-rule"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 grid grid-cols-[auto_1fr_auto] items-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/",
              "aria-label": "Digilist, gå til forsiden",
              className: "group inline-flex items-center gap-3 shrink-0",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/logo-64.webp",
                    alt: "",
                    "aria-hidden": "true",
                    width: 64,
                    height: 64,
                    className: "h-11 md:h-12 w-auto transition-opacity group-hover:opacity-80"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-start leading-none", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif text-3xl md:text-[2rem] text-ink leading-none",
                      style: {
                        fontVariationSettings: '"opsz" 96, "wght" 460',
                        letterSpacing: "-0.02em"
                      },
                      children: "Digilist"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "mt-0.5 inline-flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "inline-block w-3.5 h-px bg-accent-text"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "font-serif italic text-sm md:text-[0.95rem] text-ink-soft leading-none",
                        style: {
                          fontVariationSettings: '"opsz" 16, "wght" 420',
                          letterSpacing: "0.005em"
                        },
                        children: "Enkel booking"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "inline-block w-1 h-1 rounded-full bg-accent-text/60"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "hidden md:flex lg:hidden w-full max-w-[320px]", children: /* @__PURE__ */ jsx(GlobalSearch, {}) }),
            /* @__PURE__ */ jsxs(
              "nav",
              {
                "aria-label": "Hovednavigasjon",
                className: "hidden xl:flex items-center gap-3",
                children: [
                  /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxs(
                      DropdownMenuTrigger,
                      {
                        className: cn(
                          NAV_LINK,
                          "inline-flex items-center gap-1 outline-none focus-visible:underline focus-visible:underline-offset-8 data-[state=open]:text-ink",
                          finnActive && NAV_LINK_ACTIVE
                        ),
                        children: [
                          "Finn",
                          /* @__PURE__ */ jsx(
                            ChevronDown,
                            {
                              className: "h-3.5 w-3.5 transition-transform duration-quick ease-editorial",
                              strokeWidth: 1.75,
                              "aria-hidden": "true"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      DropdownMenuContent,
                      {
                        align: "start",
                        sideOffset: 12,
                        className: "min-w-[18rem] bg-paper border-hairline-strong rounded-sm p-1.5",
                        children: MARKETPLACES.map((m) => /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
                          Link,
                          {
                            to: m.to,
                            className: "w-full flex flex-col !items-start text-left gap-0.5 px-3 py-2.5 rounded-sm cursor-pointer focus:bg-paper-deep hover:bg-paper-deep",
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: m.eyebrow }),
                              /* @__PURE__ */ jsx("span", { className: "font-sans text-[0.95rem] text-ink", children: m.label })
                            ]
                          }
                        ) }, m.to))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxs(
                      DropdownMenuTrigger,
                      {
                        className: cn(
                          NAV_LINK,
                          "inline-flex items-center gap-1 outline-none focus-visible:underline focus-visible:underline-offset-8 data-[state=open]:text-ink",
                          solutionsActive && NAV_LINK_ACTIVE
                        ),
                        children: [
                          "Løsninger",
                          /* @__PURE__ */ jsx(
                            ChevronDown,
                            {
                              className: "h-3.5 w-3.5 transition-transform duration-quick ease-editorial",
                              strokeWidth: 1.75,
                              "aria-hidden": "true"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      DropdownMenuContent,
                      {
                        align: "start",
                        sideOffset: 12,
                        className: "min-w-[17rem] bg-paper border-hairline-strong rounded-sm p-1.5",
                        children: SOLUTIONS.map((s) => /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs(
                          Link,
                          {
                            to: s.to,
                            className: "w-full flex flex-col !items-start text-left gap-0.5 px-3 py-2.5 rounded-sm cursor-pointer focus:bg-paper-deep hover:bg-paper-deep",
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: s.eyebrow }),
                              /* @__PURE__ */ jsx("span", { className: "font-sans text-[0.95rem] text-ink", children: s.label })
                            ]
                          }
                        ) }, s.to))
                      }
                    )
                  ] }),
                  PRIMARY_NAV.map((item) => /* @__PURE__ */ jsx(
                    NavLink,
                    {
                      to: item.to,
                      className: cn(
                        NAV_LINK,
                        "collapseBelow2xl" in item && item.collapseBelow2xl && "hidden 2xl:inline"
                      ),
                      activeClassName: NAV_LINK_ACTIVE,
                      children: item.label
                    },
                    item.to
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 justify-self-end", children: [
            /* @__PURE__ */ jsx(ThemeToggle, {}),
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "primary",
                size: "md",
                href: "https://app.digilist.no",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hidden lg:inline-flex",
                children: "Åpne plattformen"
              }
            ),
            /* @__PURE__ */ jsx(MobileMenu, {})
          ] })
        ] })
      }
    )
  ] });
};
const editorialEase = [0.22, 1, 0.36, 1];
const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase }
  }
};
const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};
const staggerChild = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase }
  }
};
const viewportOnce = {
  once: true,
  amount: 0.05,
  margin: "0px 0px 0px 0px"
};
const pageEnter = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: editorialEase }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: editorialEase }
  }
};
const customers = [
  {
    name: "Rønningen Selskapslokale",
    sector: "Selskapslokale",
    location: "Asker",
    src: "/clients/ronning.png"
  },
  {
    name: "Nordre Follo kommune",
    sector: "Kommune",
    location: "Viken",
    src: "/clients/nordre-follo.svg"
  },
  {
    name: "RightSize Group",
    sector: "Coworking",
    location: "Nesbru"
  },
  {
    name: "Lier Bygdetun",
    sector: "Selskapslokale",
    location: "Lierbyen"
  }
];
const HeroSection = () => {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "hjem",
      className: "relative pt-20 lg:pt-24 pb-0 overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "container mx-auto md:px-8 lg:px-12 pt-4 lg:pt-6 pb-20 lg:pb-28", children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: staggerParent,
            className: "grid grid-cols-12 gap-6 lg:gap-gutter items-start",
            children: [
              /* @__PURE__ */ jsxs(motion.div, { variants: staggerChild, className: "col-span-12 lg:col-span-7", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption mb-6 inline-block", children: "Bookingplattform · 2026 · Norge" }),
                /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "hero", children: [
                  "Lokaler du trenger,",
                  " ",
                  /* @__PURE__ */ jsx(
                    "em",
                    {
                      className: "italic",
                      style: {
                        fontVariationSettings: '"opsz" 144, "wght" 400'
                      },
                      children: "og plattformen som drifter det"
                    }
                  ),
                  "."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-8 text-lg lg:text-xl text-ink-soft measure leading-relaxed", children: "Finn og book lokaler med ekte priser og ledige datoer — betal trygt med Vipps. Og for utleiere og kommuner: plattformen som drifter det hele, fra kalender til oppgjør." }),
                /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3", children: [
                  /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "lg", href: "/leie", children: "Finn ledig lokale" }),
                  /* @__PURE__ */ jsx(
                    EditorialButton,
                    {
                      variant: "outline",
                      size: "lg",
                      icon: false,
                      onClick: (e) => {
                        e.preventDefault();
                        const el = document.getElementById("kontakt");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      },
                      children: "Book demo"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "mt-9 space-y-3", children: [
                  "Ekte priser og ledige datoer i sanntid",
                  "Betal trygt med Vipps eller faktura",
                  "Bygd for norske krav — BankID, GDPR og universell utforming"
                ].map((b) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-ink-soft", children: [
                  /* @__PURE__ */ jsx(
                    Check,
                    {
                      className: "mt-0.5 h-5 w-5 shrink-0 text-accent-text",
                      strokeWidth: 2,
                      "aria-hidden": "true"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-base lg:text-lg", children: b })
                ] }, b)) })
              ] }),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  variants: staggerChild,
                  className: "col-span-12 lg:col-span-5 mt-8 lg:mt-0",
                  children: /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-rule bg-paper-deep/40 p-1.5 shadow-[0_24px_64px_-32px_rgba(10,18,40,0.55)] overflow-hidden", children: /* @__PURE__ */ jsxs(
                    "video",
                    {
                      className: "w-full rounded-md",
                      style: { aspectRatio: "16 / 9" },
                      autoPlay: true,
                      muted: true,
                      loop: true,
                      playsInline: true,
                      preload: "auto",
                      poster: "/videos/digilist-book-venue-poster.jpg",
                      "aria-label": "Digilist booking i praksis",
                      children: [
                        /* @__PURE__ */ jsx("source", { src: "/videos/digilist-book-venue.webm", type: "video/webm" }),
                        /* @__PURE__ */ jsx("source", { src: "/videos/digilist-book-venue.mp4", type: "video/mp4" })
                      ]
                    }
                  ) })
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: staggerChild,
                  className: "col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch mt-10 lg:mt-14",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "group flex flex-col border border-rule rounded-sm p-6 lg:p-7 bg-gradient-to-br from-paper to-paper-deep/60 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]", children: [
                      /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text mb-3", children: "◆ For deg som skal leie" }),
                      /* @__PURE__ */ jsx(
                        "h2",
                        {
                          className: "font-serif text-2xl lg:text-3xl text-ink",
                          style: {
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                            lineHeight: 1.1
                          },
                          children: "Finn og book lokale, der du bor"
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-base text-ink-soft leading-relaxed", children: "Grendehus, kulturhus og selskapslokaler samlet, med ekte pris, ledig dato og betaling med Vipps. Book direkte, uten ringerunder eller ventetid på svar, med alt samlet på ett sted." }),
                      /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: ["Selskapslokale", "Møterom", "Kulturhus", "Idrettshall"].map((c) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft border border-rule rounded-full px-3 py-1",
                          children: c
                        },
                        c
                      )) }),
                      /* @__PURE__ */ jsx("div", { className: "mt-auto pt-6", children: /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "lg", href: "/leie", children: "Finn lokale" }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "group flex flex-col border border-rule rounded-sm p-6 lg:p-7 bg-gradient-to-br from-paper-deep/60 to-paper-tinted/40 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]", children: [
                      /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint mb-3", children: "■ For utleier & kommune" }),
                      /* @__PURE__ */ jsx(
                        "h2",
                        {
                          className: "font-serif text-2xl lg:text-3xl text-ink",
                          style: {
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                            lineHeight: 1.1
                          },
                          children: "Plattformen som drifter utleien"
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-base text-ink-soft leading-relaxed", children: "Booking, sesongtildeling og innbyggerdialog i én plattform, med innebygd etterlevelse (GDPR, universell utforming, NSM). Ett system som erstatter regneark, e-post og løse betalingsløsninger, slik at dere beholder full oversikt og kontroll. Innbyggere, lag og foreninger booker selv, hele døgnet, uten telefonkø og uten dobbeltbookinger." }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 flex flex-col sm:flex-row gap-3", children: [
                        /* @__PURE__ */ jsx(
                          EditorialButton,
                          {
                            variant: "primary",
                            size: "lg",
                            icon: false,
                            onClick: (e) => {
                              e.preventDefault();
                              const el = document.getElementById("kontakt");
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            },
                            children: "Book demo"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          EditorialButton,
                          {
                            variant: "outline",
                            size: "lg",
                            href: "https://app.digilist.no",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "Åpne plattformen"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            className: "border-y border-rule bg-paper-tinted",
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 py-12 lg:py-14", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-6 mb-8 lg:mb-10", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "Kunder · I bruk" }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint hidden md:inline", children: "To av flere: referanser på forespørsel" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5", children: customers.map((c) => /* @__PURE__ */ jsxs(
                motion.article,
                {
                  variants: staggerChild,
                  "aria-label": c.name,
                  className: "group bg-paper rounded-lg border border-rule shadow-[0_2px_10px_-4px_rgba(10,18,40,0.12)] px-6 lg:px-7 py-6 lg:py-7 flex items-center gap-5 transition-all duration-normal ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_34px_-18px_rgba(10,18,40,0.45)]",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "shrink-0 w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] rounded-lg border border-rule bg-paper-deep flex items-center justify-center overflow-hidden", children: c.src ? /* @__PURE__ */ jsxs("picture", { children: [
                      logoWebpSrc(c.src) && /* @__PURE__ */ jsx("source", { type: "image/webp", srcSet: logoWebpSrc(c.src) }),
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: c.src,
                          alt: `${c.name} logo`,
                          className: "max-w-[78%] max-h-[78%] object-contain",
                          loading: "lazy"
                        }
                      )
                    ] }) : /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "font-serif text-3xl text-accent-text",
                        style: { fontVariationSettings: getFraunces("section") },
                        children: c.name.charAt(0)
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
                      /* @__PURE__ */ jsx(
                        "p",
                        {
                          className: "font-serif text-xl lg:text-2xl text-ink leading-tight",
                          style: {
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em"
                          },
                          children: c.name
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
                        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: c.sector }),
                        /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-rule", "aria-hidden": "true" }),
                        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption", children: c.location })
                      ] })
                    ] })
                  ]
                },
                c.name
              )) })
            ] })
          }
        )
      ]
    }
  );
};
function SectionHeader({
  label,
  children,
  intro,
  action,
  headingId,
  className = "mb-10 lg:mb-14"
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SectionRule, { label }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `grid lg:grid-cols-12 gap-6 lg:gap-gutter items-start ${className}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", id: headingId, children }) }),
          (intro || action) && /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-col gap-5", children: [
            intro && /* @__PURE__ */ jsx("p", { className: "text-lg text-ink-soft leading-relaxed", children: intro }),
            action
          ] })
        ]
      }
    )
  ] });
}
const ICONS = {
  // leie
  selskapslokale: GlassWater,
  gaard: Warehouse,
  bursdagslokale: Cake,
  kulturhus: Theater,
  moterom: Users2,
  konferanselokale: Presentation,
  kontorlokaler: Building2,
  coworking: Laptop,
  idrettshall: Trophy,
  padelbane: Dumbbell,
  svommehall: Waves,
  // overnatting
  hytte: TreePine,
  leilighet: Building2,
  rom: BedDouble,
  feriehus: Home,
  // utstyr
  festutstyr: PartyPopper,
  "verktoy-maskiner": Wrench,
  "lyd-og-lys": Speaker,
  "sport-og-friluft": Bike,
  // tjenester
  catering: UtensilsCrossed,
  dj: Disc3,
  musiker: Music2,
  dekor: Sparkles,
  // arrangementer
  konsert: Music,
  "teater-og-scene": Drama,
  festival: Tent,
  sport: Medal,
  // legacy /bruksomrader
  selskapslokaler: GlassWater,
  "idrettshaller-gymsaler": Trophy,
  "kulturhus-kantiner": Theater
};
function iconForSlug(slug) {
  return ICONS[slug] ?? Sparkles;
}
const CAT = "/images/cat";
const IMAGES = {
  selskapslokale: `${CAT}/selskapslokale.jpg`,
  gaard: `${CAT}/gaard.jpg`,
  bursdagslokale: `${CAT}/bursdagslokale.jpg`,
  kulturhus: `${CAT}/kulturhus.jpg`,
  moterom: `${CAT}/moterom.jpg`,
  konferanselokale: `${CAT}/konferanselokale.jpg`,
  kontorlokaler: `${CAT}/kontorlokaler.jpg`,
  coworking: `${CAT}/coworking.jpg`,
  idrettshall: `${CAT}/idrettshall.jpg`,
  padelbane: `${CAT}/padelbane.jpg`,
  svommehall: `${CAT}/svommehall.jpg`,
  hytte: `${CAT}/hytte.jpg`,
  leilighet: `${CAT}/leilighet.jpg`,
  rom: `${CAT}/rom.jpg`,
  feriehus: `${CAT}/feriehus.jpg`,
  festutstyr: `${CAT}/festutstyr.jpg`,
  "verktoy-maskiner": `${CAT}/verktoy-maskiner.jpg`,
  "lyd-og-lys": `${CAT}/lyd-og-lys.jpg`,
  "sport-og-friluft": `${CAT}/sport-og-friluft.jpg`,
  catering: `${CAT}/catering.jpg`,
  dj: `${CAT}/dj.jpg`,
  musiker: `${CAT}/musiker.jpg`,
  dekor: `${CAT}/dekor.jpg`,
  konsert: `${CAT}/konsert.jpg`,
  "teater-og-scene": `${CAT}/teater-og-scene.jpg`,
  festival: `${CAT}/festival.jpg`,
  sport: `${CAT}/sport.jpg`,
  // legacy /bruksomrader slugs reuse the closest photo
  selskapslokaler: `${CAT}/selskapslokale.jpg`,
  "idrettshaller-gymsaler": `${CAT}/idrettshall.jpg`,
  "kulturhus-kantiner": `${CAT}/kulturhus.jpg`
};
function imageForSlug(slug) {
  return IMAGES[slug];
}
function bundledSrcSet(src) {
  if (!src || !src.startsWith("/images/cat/") || !src.endsWith(".jpg")) {
    return void 0;
  }
  const stem = src.slice(0, -4);
  return `${stem}-640.jpg 640w, ${stem}-1024.jpg 1024w, ${src} 1600w`;
}
function bundledWebpSrcSet(src) {
  const jpgSet = bundledSrcSet(src);
  return jpgSet == null ? void 0 : jpgSet.replace(/\.jpg/g, ".webp");
}
function CategoryVisual({
  icon: Icon,
  label,
  src,
  alt,
  aspect = "16 / 10",
  variant = "primary",
  eager = false,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  className = ""
}) {
  const patternId = useId();
  if (src) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative rounded-2xl border border-rule bg-gradient-to-br from-paper to-paper-deep p-1.5 lg:p-2 shadow-[0_18px_50px_-20px_rgba(10,18,40,0.4)] ${className}`,
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative w-full overflow-hidden rounded-xl bg-paper-deep ring-1 ring-ink/10",
              style: { aspectRatio: aspect },
              children: [
                /* @__PURE__ */ jsxs("picture", { children: [
                  /* @__PURE__ */ jsx("source", { type: "image/webp", srcSet: bundledWebpSrcSet(src), sizes }),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src,
                      srcSet: bundledSrcSet(src),
                      sizes,
                      alt: alt ?? label ?? "",
                      className: "h-full w-full object-cover",
                      loading: eager ? "eager" : "lazy",
                      decoding: "async"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-ink/0 to-ink/0"
                  }
                )
              ]
            }
          ),
          label && /* @__PURE__ */ jsx("span", { className: "absolute left-5 bottom-5 inline-flex items-center editorial-mono-caption text-ink-soft bg-paper/85 backdrop-blur-sm border border-hairline-strong rounded-sm px-2 py-1", children: label })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative w-full overflow-hidden rounded-sm border border-rule bg-gradient-to-br from-paper-deep to-paper ${className}`,
      style: { aspectRatio: aspect },
      role: "img",
      "aria-label": label ?? "Illustrasjon",
      children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            "aria-hidden": "true",
            className: "absolute inset-0 h-full w-full text-navy/10",
            children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx(
                "pattern",
                {
                  id: patternId,
                  width: "14",
                  height: "14",
                  patternUnits: "userSpaceOnUse",
                  children: /* @__PURE__ */ jsx("circle", { cx: "1.5", cy: "1.5", r: "1.5", fill: "currentColor" })
                }
              ) }),
              /* @__PURE__ */ jsx("rect", { width: "100%", height: "100%", fill: `url(#${patternId})` })
            ]
          }
        ),
        variant === "primary" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-paper border border-hairline-strong text-navy shadow-sm", children: /* @__PURE__ */ jsx(Icon, { className: "h-9 w-9", strokeWidth: 1.25, "aria-hidden": "true" }) }) }),
          label && /* @__PURE__ */ jsx("span", { className: "absolute left-4 bottom-3 editorial-mono-caption text-ink-faint", children: label })
        ] }) : /* @__PURE__ */ jsx(
          Icon,
          {
            className: "absolute -bottom-4 -right-3 h-24 w-24 text-navy/[0.08]",
            strokeWidth: 1,
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
const TILES = [
  {
    title: "Lokaler",
    tag: "Selskap · møte · kultur",
    to: "/leie",
    image: "/images/cat/selskapslokale.jpg",
    Icon: GlassWater
  },
  {
    title: "Overnatting",
    tag: "Hytte · leilighet · feriehus",
    to: "/overnatting",
    image: "/images/cat/hytte.jpg",
    Icon: TreePine
  },
  {
    title: "Sport og aktivitet",
    tag: "Idrettshall · padel · svømming",
    to: "/leie/idrettshall",
    image: "/images/cat/idrettshall.jpg",
    Icon: Dumbbell
  },
  {
    title: "Arrangementer",
    tag: "Konsert · teater · sport",
    to: "/arrangementer",
    image: "/images/cat/konsert.jpg",
    Icon: Music
  },
  {
    title: "Utstyr",
    tag: "Fest · verktøy · friluft",
    to: "/utstyr",
    image: "/images/cat/festutstyr.jpg",
    Icon: PartyPopper
  },
  {
    title: "Tjenester",
    tag: "Catering · DJ · dekor",
    to: "/tjenester",
    image: "/images/cat/dekor.jpg",
    Icon: Sparkles
  }
];
const MarketplaceSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "marketplace", className: "py-10 lg:py-14 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsxs(
      SectionHeader,
      {
        label: "FINN OG BOOK",
        intro: "Lokaler, overnatting, arrangementer, utstyr og tjenester, samlet på ett sted. Ekte priser, ledige tider og betaling med Vipps.",
        children: [
          "Alt du kan finne og",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: { fontVariationSettings: getFraunces("display") },
              children: "booke"
            }
          ),
          "."
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6", children: TILES.map((t) => {
      const Icon = t.Icon;
      return /* @__PURE__ */ jsx(
        Link,
        {
          to: t.to,
          className: "group block rounded-2xl border border-rule bg-paper p-1.5 lg:p-2 shadow-md transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-2xl hover:border-accent-text/40",
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative overflow-hidden rounded-xl ring-1 ring-ink/10",
              style: { aspectRatio: "16 / 10" },
              children: [
                /* @__PURE__ */ jsxs("picture", { children: [
                  /* @__PURE__ */ jsx(
                    "source",
                    {
                      type: "image/webp",
                      srcSet: bundledWebpSrcSet(t.image),
                      sizes: "(min-width: 640px) 45vw, 90vw"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: t.image,
                      srcSet: bundledSrcSet(t.image),
                      sizes: "(min-width: 640px) 45vw, 90vw",
                      alt: "",
                      "aria-hidden": "true",
                      className: "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]",
                      loading: "lazy",
                      decoding: "async"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 p-4 lg:p-5 flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "self-start inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-navy shadow-sm", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: "font-serif text-2xl lg:text-3xl text-white leading-tight",
                        style: {
                          fontVariationSettings: getFraunces("sub"),
                          letterSpacing: "-0.015em"
                        },
                        children: t.title
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-white/70", children: t.tag }),
                    /* @__PURE__ */ jsxs("span", { className: "mt-3 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-white", children: [
                      "Finn",
                      /* @__PURE__ */ jsx(
                        ArrowUpRight,
                        {
                          className: "h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                          "aria-hidden": "true"
                        }
                      )
                    ] })
                  ] })
                ] })
              ]
            }
          )
        },
        t.to
      );
    }) })
  ] }) });
};
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    if (ids.length === 0) return;
    const scrollLine = () => window.scrollY + window.innerHeight * 0.35;
    const compute = () => {
      const y = scrollLine();
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (y >= top) current = id;
      }
      setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);
  return active;
}
const CHAPTERS = [
  { id: "", label: "Hjem", icon: Home },
  { id: "verdi", label: "Verdi", icon: Sparkles },
  { id: "bruksomrader", label: "Bruksområder", icon: Users },
  { id: "brukerhistorier", label: "Brukerhistorier", icon: BookOpen },
  { id: "pilot", label: "Pilot for kommuner", icon: Handshake },
  { id: "blogg-preview", label: "Blogg", icon: Newspaper },
  { id: "funksjonalitet", label: "Funksjonalitet", icon: Zap },
  { id: "integrasjoner", label: "Integrasjoner", icon: Plug },
  { id: "teknologi", label: "Teknologi", icon: Cpu },
  { id: "arkitektur", label: "Arkitektur", icon: Network },
  { id: "om-oss", label: "Om oss", icon: Info },
  { id: "kontakt", label: "Kontakt", icon: Mail }
];
const HOME_ID = "__home__";
function LeftRail({
  chapters,
  activeId,
  onJump
}) {
  const navRef = useRef(null);
  const mouseY = useMotionValue(Infinity);
  return /* @__PURE__ */ jsx(
    motion.nav,
    {
      ref: navRef,
      "aria-label": "Kapittelnavigasjon",
      onMouseMove: (e) => mouseY.set(e.clientY),
      onMouseLeave: () => mouseY.set(Infinity),
      className: "hidden fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 py-3 px-2 bg-paper/85 backdrop-blur-md border border-hairline-strong rounded-full shadow-[0_6px_24px_-12px_hsl(var(--ink)/0.25)]",
      children: chapters.map((c) => /* @__PURE__ */ jsx(
        DockItem,
        {
          chapter: c,
          mouseY,
          active: c.id === "" ? activeId === HOME_ID : activeId === c.id,
          onClick: () => onJump(c)
        },
        c.id || HOME_ID
      ))
    }
  );
}
function DockItem({
  chapter,
  mouseY,
  active,
  onClick
}) {
  const ref = useRef(null);
  const distance = useTransform(mouseY, (val) => {
    var _a;
    const rect = ((_a = ref.current) == null ? void 0 : _a.getBoundingClientRect()) ?? { y: 0, height: 0 };
    const center = rect.y + rect.height / 2;
    return val - center;
  });
  const rawScale = useTransform(distance, [-100, 0, 100], [1, 1.4, 1]);
  const scale = useSpring(rawScale, { mass: 0.1, stiffness: 220, damping: 18 });
  const Icon = chapter.icon;
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      ref,
      type: "button",
      onClick,
      style: { scale },
      "aria-label": `Gå til ${chapter.label}`,
      title: chapter.label,
      className: `group relative z-10 w-10 h-10 inline-flex items-center justify-center rounded-full transition-colors duration-quick ease-editorial ${active ? "bg-navy text-on-navy shadow-md" : "bg-paper-deep/70 text-ink-soft hover:bg-paper-deep hover:text-ink"}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 1.75, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute left-[calc(100%+0.65rem)] top-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-xs uppercase tracking-widest text-on-navy opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-quick ease-editorial pointer-events-none bg-navy px-2.5 py-1 rounded-sm shadow-md",
            children: chapter.label
          }
        )
      ]
    }
  );
}
function SideRails({ chapters = CHAPTERS }) {
  const location = useLocation();
  const navigate = useNavigate();
  const ids = useMemo(
    () => chapters.filter((c) => c.id !== "").map((c) => c.id),
    [chapters]
  );
  const sectionActive = useActiveSection(ids);
  const [aboveFirst, setAboveFirst] = useState(true);
  useEffect(() => {
    const firstId = ids[0];
    if (!firstId) return;
    const compute = () => {
      const el = document.getElementById(firstId);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setAboveFirst(window.scrollY + window.innerHeight * 0.35 < top);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);
  const activeId = aboveFirst ? HOME_ID : sectionActive;
  useMemo(() => {
    if (activeId === HOME_ID) return 0;
    const i = chapters.findIndex((c) => c.id === activeId);
    return i === -1 ? 0 : i;
  }, [activeId, chapters]);
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : window.scrollY / max;
      setScrollPct(Math.max(0, Math.min(1, pct)));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);
  const onHomepage = location.pathname === "/";
  const handleJump = (chapter) => {
    if (chapter.id === "") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        navigate("/");
      }
      return;
    }
    const href = `#${chapter.id}`;
    if (location.pathname === "/") {
      const el = document.getElementById(chapter.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(chapter.id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };
  if (!onHomepage) return null;
  const showRightRail = false;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(LeftRail, { chapters, activeId, onJump: handleJump }),
    showRightRail
  ] });
}
const AiAgentsSection = lazy(() => import("./assets/AiAgentsSection-BMOUwcym.js"));
const B2BLaneSection = lazy(() => import("./assets/B2BLaneSection-2wQ9bs57.js"));
const ChannelSyncSection = lazy(() => import("./assets/ChannelSyncSection-CcvrUDCx.js"));
const HowItWorksSection = lazy(() => import("./assets/HowItWorksSection-DxGVweIZ.js"));
const BrukerhistorierSection = lazy(() => import("./assets/BrukerhistorierSection-DfmjxFy4.js"));
const BlogPreviewSection = lazy(() => import("./assets/BlogPreviewSection-s5Tqe3hV.js"));
const HomepageFAQSection = lazy(() => import("./assets/HomepageFAQSection-DTEzhNUw.js"));
const CTASection = lazy(() => import("./assets/CTASection-CD1-uJNJ.js"));
const Footer = lazy(() => import("./assets/Footer-DGXQxzOH.js"));
const Index = () => {
  const location = useLocation();
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };
    scrollToHash();
    const handleHashChange = () => {
      scrollToHash();
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        faq: HOMEPAGE_FAQ.map((e) => ({ question: e.q, answer: e.a })),
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" }
        ],
        aboutPage: true,
        service: true,
        howTo: {
          name: "Slik booker du med Digilist",
          description: "Fra forespørsel til oppgjør på fire steg, gjennom Digilist-plattformen.",
          steps: [
            {
              name: "Søknad",
              text: "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart."
            },
            {
              name: "Godkjenning",
              text: "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie."
            },
            {
              name: "Bekreftelse",
              text: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller (vaktmester, renhold, vekter) varsles automatisk."
            },
            {
              name: "Oppfølging",
              text: "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform."
            }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(GrainOverlay, {}),
    /* @__PURE__ */ jsx(SideRails, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { id: "main", children: [
      /* @__PURE__ */ jsx(HeroSection, {}),
      /* @__PURE__ */ jsx(MarketplaceSection, {}),
      /* @__PURE__ */ jsxs(Suspense, { fallback: null, children: [
        /* @__PURE__ */ jsx(AiAgentsSection, {}),
        /* @__PURE__ */ jsx(B2BLaneSection, {}),
        /* @__PURE__ */ jsx(ChannelSyncSection, {}),
        /* @__PURE__ */ jsx(HowItWorksSection, {}),
        /* @__PURE__ */ jsx(BrukerhistorierSection, {}),
        /* @__PURE__ */ jsx(BlogPreviewSection, {}),
        /* @__PURE__ */ jsx(HomepageFAQSection, {}),
        /* @__PURE__ */ jsx(CTASection, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(Footer, {}) })
  ] });
};
const STOPWORDS = /* @__PURE__ */ new Set([
  "og",
  "i",
  "på",
  "av",
  "for",
  "til",
  "en",
  "et",
  "som",
  "er",
  "med",
  "den",
  "det",
  "de",
  "et",
  "kan",
  "du",
  "vi",
  "jeg",
  "har",
  "hva",
  "om",
  "hvor",
  "når",
  "hvordan",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "is",
  "are",
  "for",
  "with",
  "what",
  "how",
  "where",
  "when",
  "do",
  "does"
]);
function tokenize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}
function retrieve(query, k = 3) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const hits = [];
  for (const cat of FAQ_CATEGORIES) {
    for (const entry of cat.questions) {
      const haystack = [
        entry.q,
        entry.a,
        ...entry.keywords ?? []
      ].join(" ");
      const hayTokens = tokenize(haystack);
      let score = 0;
      for (const t of qTokens) {
        if (hayTokens.includes(t)) score += 2;
        else if (hayTokens.some((h) => h.startsWith(t) || t.startsWith(h)))
          score += 1;
      }
      for (const kw of entry.keywords ?? []) {
        if (qTokens.some((t) => kw.toLowerCase().includes(t))) score += 3;
      }
      if (score > 0) {
        hits.push({ q: entry.q, a: entry.a, category: cat.label, score });
      }
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}
function followUpSuggestions(lastHit) {
  const generic = [
    "Hvilke kunder bruker Digilist?",
    "Datasuverenitet og GDPR",
    "Snakk med en rådgiver"
  ];
  if (!lastHit) return generic;
  const cat = FAQ_CATEGORIES.find((c) => c.label === lastHit.category);
  if (cat) {
    const siblings = cat.questions.filter((q) => q.q !== lastHit.q).slice(0, 2).map((q) => q.q);
    return [...siblings, "Snakk med en rådgiver"];
  }
  return generic;
}
const FALLBACK_NO_MATCH = [
  "Jeg fant ikke svar på det i kunnskapsbasen min. Vil du snakke med en rådgiver, eller skal jeg sende en forespørsel på dine vegne?",
  "Hmm, jeg er ikke sikker på det. Vil du at jeg setter deg i kontakt med en rådgiver?",
  "Det er utenfor det jeg vet. Skal jeg lage en kort forespørsel til teamet for deg?"
];
function answerFrom(hit) {
  return hit.a;
}
function buildLLMContext(query, hits, history, pages = []) {
  const corpus = hits.map(
    (h, i) => `[${i + 1}] (${h.category})
Spørsmål: ${h.q}
Svar: ${h.a}`
  ).join("\n\n");
  const sider = pages.slice(0, 6).map((p) => `- ${p.title}${p.subtitle ? `: ${p.subtitle}` : ""} (${p.href})`).join("\n");
  const system = `Du er Digilist-assistenten, en norsk AI-rådgiver for Digilist, en bookingplattform for norske utleiere og kommuner. Svar kort, presist og på norsk bokmål. Hold deg til informasjonen i KILDER nedenfor og henvis til /faq for utfyllende svar. Hvis du ikke vet svaret, foreslå at brukeren snakker med en rådgiver via skjemaet.

KILDER:
${corpus || "(ingen relevante treff i kunnskapsbasen)"}

RELEVANTE SIDER (fra søk på hele nettstedet):
${sider || "(ingen)"}

REGLER:
- Svar maks 3 setninger.
- Bruk norsk bokmål.
- Der en side under RELEVANTE SIDER passer svaret, nevn den kort.
- Hvis spørsmålet ikke kan besvares fra KILDER, si det ærlig og foreslå skjemaet.
- Ikke fabriker pris, dato, navn eller tall som ikke står i KILDER.`;
  return {
    system,
    messages: [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: query }
    ]
  };
}
allFAQEntries().length;
const PERSONA_OPTIONS = [
  {
    value: "kommune",
    label: "Norsk kommune",
    hint: "Booking, sesongleie, SSA-L, ID-porten"
  },
  {
    value: "utleier",
    label: "Privat utleier",
    hint: "Selskapslokale, kulturhus, idrettshall"
  },
  {
    value: "annet",
    label: "Annet",
    hint: "Konsulent, partner, presse"
  }
];
const TOPIC_SUGGESTIONS = {
  kommune: [
    "Pilot for kommunen",
    "Tilbud i SSA-L 2026-anskaffelse",
    "Migrasjon fra RCO booking",
    "Sesongleie og lag/foreninger",
    "ID-porten og EHF",
    "Demo for ledergruppen"
  ],
  utleier: [
    "Bookingplattform for selskapslokale",
    "Bookingplattform for kulturhus",
    "Bookingplattform for idrettsanlegg",
    "Vipps og automatisk fakturering",
    "Sambruk mellom rom og ressurser",
    "Demo og pristilbud"
  ],
  annet: [
    "Partnerskap og integrasjon",
    "Presse og medieforespørsler",
    "Rekruttering og åpne stillinger",
    "Generell informasjon"
  ]
};
function topicSuggestionsFor(persona) {
  if (!persona) return [];
  return TOPIC_SUGGESTIONS[persona];
}
function summarizeInquiry(draft) {
  var _a;
  const personaLabel = ((_a = PERSONA_OPTIONS.find((p) => p.value === draft.persona)) == null ? void 0 : _a.label) ?? "Ukjent";
  return `${personaLabel} · ${draft.organization || "-"} · ${draft.topic}`;
}
const STORAGE_KEY = "digilist-chat-v1";
const emptyDraft = {
  persona: null,
  topic: "",
  organization: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  contextSummary: ""
};
const initialState = () => ({
  open: false,
  mode: "chat",
  messages: [],
  inquiry: { ...emptyDraft },
  thinking: false,
  error: null
});
function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, open: action.value ?? !state.open };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_THINKING":
      return { ...state, thinking: action.value };
    case "SET_DRAFT":
      return { ...state, inquiry: { ...state.inquiry, ...action.patch } };
    case "RESET":
      return initialState();
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "HYDRATE":
      return { ...action.state, open: false, thinking: false };
    default:
      return state;
  }
}
function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}
function buildContextSummary(messages) {
  return messages.slice(-8).map((m) => `${m.role === "user" ? "Bruker" : "Bot"}: ${m.text}`).join("\n");
}
const CHAT_ENDPOINT = "/api/chat";
const INQUIRY_ENDPOINT = "/api/inquiry";
function useChatbot() {
  const [state, dispatch] = useReducer(reducer, void 0, initialState);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted = JSON.parse(raw);
        if (persisted.inquiry) {
          dispatch({ type: "SET_DRAFT", patch: persisted.inquiry });
        }
      }
    } catch {
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ inquiry: state.inquiry })
      );
    } catch {
    }
  }, [state.inquiry]);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (state.open && window.innerWidth < 768) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [state.open]);
  const toggle = useCallback((value) => {
    dispatch({ type: "TOGGLE_OPEN", value });
  }, []);
  const setMode = useCallback((mode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);
  const send = useCallback(
    async (text) => {
      var _a;
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg = {
        id: cryptoId(),
        role: "user",
        text: trimmed,
        timestamp: Date.now()
      };
      dispatch({ type: "ADD_MESSAGE", message: userMsg });
      dispatch({ type: "SET_THINKING", value: true });
      dispatch({ type: "SET_ERROR", error: null });
      const hits = retrieve(trimmed, 3);
      const results = searchCorpus(trimmed, getSearchCorpus()).slice(0, 6);
      try {
        const history = state.messages.filter((m) => m.role !== "system").slice(-8).map((m) => ({ role: m.role, text: m.text }));
        const ctx = buildLLMContext(trimmed, hits, history, results);
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: ctx.system,
            messages: ctx.messages,
            hits
          })
        });
        if (res.ok) {
          const payload = await res.json();
          if (payload == null ? void 0 : payload.text) {
            const assistantMsg2 = {
              id: cryptoId(),
              role: "assistant",
              text: payload.text,
              sourceQ: (_a = hits[0]) == null ? void 0 : _a.q,
              suggestions: followUpSuggestions(hits[0]),
              showInquiryCta: hits.length === 0,
              results,
              timestamp: Date.now()
            };
            dispatch({ type: "ADD_MESSAGE", message: assistantMsg2 });
            dispatch({ type: "SET_THINKING", value: false });
            return;
          }
        }
      } catch (err) {
      }
      const top = hits[0];
      let assistantMsg;
      if (top && top.score >= 2) {
        const lead = top.score >= 5 ? "" : "Basert på det jeg vet: ";
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: `${lead}${answerFrom(top)}`,
          sourceQ: top.q,
          suggestions: followUpSuggestions(top),
          results,
          timestamp: Date.now()
        };
      } else {
        const fallback = FALLBACK_NO_MATCH[Math.floor(Math.random() * FALLBACK_NO_MATCH.length)];
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: fallback,
          suggestions: ["Send forespørsel", "Book demo"],
          showInquiryCta: true,
          showDemoCta: true,
          results,
          timestamp: Date.now()
        };
      }
      setTimeout(() => {
        dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
        dispatch({ type: "SET_THINKING", value: false });
      }, 250);
    },
    [state.messages]
  );
  const startInquiry = useCallback(() => {
    dispatch({
      type: "SET_DRAFT",
      patch: { contextSummary: buildContextSummary(state.messages) }
    });
    dispatch({ type: "SET_MODE", mode: "inquiry-persona" });
  }, [state.messages]);
  const setPersona = useCallback((p) => {
    dispatch({ type: "SET_DRAFT", patch: { persona: p } });
    dispatch({ type: "SET_MODE", mode: "inquiry-topic" });
  }, []);
  const setTopic = useCallback((topic) => {
    dispatch({ type: "SET_DRAFT", patch: { topic } });
    dispatch({ type: "SET_MODE", mode: "inquiry-contact" });
  }, []);
  const updateDraft = useCallback((patch) => {
    dispatch({ type: "SET_DRAFT", patch });
  }, []);
  const submitInquiry = useCallback(async () => {
    dispatch({ type: "SET_THINKING", value: true });
    dispatch({ type: "SET_ERROR", error: null });
    const payload = {
      ...state.inquiry,
      summary: summarizeInquiry(state.inquiry),
      source: "chatbot",
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const res = await fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({ type: "SET_MODE", mode: "inquiry-success" });
    } catch (err) {
      console.error("[chatbot] /api/inquiry failed:", err);
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({
        type: "SET_ERROR",
        error: "Vi fikk ikke sendt forespørselen. Prøv igjen, eller send e-post direkte til kontakt@digilist.no."
      });
    }
  }, [state.inquiry]);
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);
  const isConfigured = useMemo(() => ({ llm: true, inquiry: true }), []);
  return {
    state,
    toggle,
    send,
    setMode,
    startInquiry,
    setPersona,
    setTopic,
    updateDraft,
    submitInquiry,
    reset,
    isConfigured
  };
}
const ChatbotContext = createContext(null);
const RAIL_KEY = "digilist-rail-expanded-v1";
function initialRailExpanded() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(RAIL_KEY) === "1";
  } catch {
    return false;
  }
}
function ChatbotProvider({ children }) {
  const controller = useChatbot();
  const { toggle, setMode, startInquiry, send } = controller;
  const [railExpanded, setRailExpandedState] = useState(initialRailExpanded);
  const setRailExpanded = (v) => {
    setRailExpandedState(v);
    try {
      localStorage.setItem(RAIL_KEY, v ? "1" : "0");
    } catch {
    }
  };
  useEffect(() => {
    function onOpen(e) {
      const detail = e.detail ?? {};
      toggle(true);
      setRailExpanded(true);
      if (detail.mode === "inquiry-persona") setTimeout(() => startInquiry(), 80);
      else if (detail.mode === "chat") setMode("chat");
      if (detail.seed) setTimeout(() => void send(detail.seed), 120);
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [toggle, setMode, startInquiry, send]);
  return /* @__PURE__ */ jsx(ChatbotContext.Provider, { value: { controller, railExpanded, setRailExpanded }, children });
}
function useChatbotContext() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbotContext must be used within ChatbotProvider");
  return ctx;
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Hero variant for prominent CTAs with hover effects
        hero: "bg-primary text-primary-foreground font-semibold hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-100 transition-all duration-300 group",
        // Outline variant with glow effect
        heroOutline: "border-2 border-primary text-foreground font-semibold hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1e3);
    }
  }, []);
  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };
  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "region",
      "aria-label": "Samtykke til informasjonskapsler",
      className: "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up",
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto md:px-8 lg:px-12 max-w-6xl", children: /* @__PURE__ */ jsx("div", { className: "bg-card/95 dark:bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-start md:items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(Cookie, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Vi bruker informasjonskapsler" }),
              /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-primary" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-3", children: [
              'Vi bruker nødvendige cookies for å sikre grunnleggende funksjonalitet og forbedre din opplevelse på vår nettside. Ved å klikke "Godta alle" samtykker du til bruk av cookies i henhold til vår',
              " ",
              /* @__PURE__ */ jsx(Link, { to: "/cookies", className: "text-primary hover:underline font-medium", children: "cookie-policy" }),
              " ",
              "og",
              " ",
              /* @__PURE__ */ jsx(Link, { to: "/personvern", className: "text-primary hover:underline font-medium", children: "personvernerklæring" }),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full md:w-auto", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "lg",
              onClick: rejectCookies,
              className: "w-full sm:w-auto",
              children: "Kun nødvendige"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "hero",
              size: "lg",
              onClick: acceptCookies,
              className: "w-full sm:w-auto shadow-lg shadow-primary/30",
              children: "Godta alle"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: rejectCookies,
            className: "absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-muted-foreground hover:text-foreground transition-colors",
            "aria-label": "Lukk",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }) }) })
    }
  );
};
const prefersReducedMotion = () => {
  var _a;
  return typeof window !== "undefined" && ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-reduced-motion: reduce)").matches);
};
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const tryScroll = (attempt) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
          });
          return;
        }
        if (attempt < 8) {
          setTimeout(() => tryScroll(attempt + 1), 60);
        }
      };
      tryScroll(0);
      return;
    }
    const reduced = prefersReducedMotion();
    const distance = window.scrollY;
    if (!reduced && distance < 2e3) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, hash, key]);
  return null;
};
const VISITOR_KEY = "digilist-rum-visitor-v1";
const SKIP_PATH_PREFIXES = ["/admin/", "/blogg/preview/"];
function getVisitorId() {
  if (typeof sessionStorage === "undefined") return crypto.randomUUID();
  let id = sessionStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    try {
      sessionStorage.setItem(VISITOR_KEY, id);
    } catch {
    }
  }
  return id;
}
function RumReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (navigator.webdriver) return;
    if (SKIP_PATH_PREFIXES.some((p) => window.location.pathname.startsWith(p))) {
      return;
    }
    getVisitorId();
    return;
  }, []);
  return null;
}
const ConvexScope = lazy(() => import("./assets/ConvexScope-CqH4QtLW.js"));
const BookDemo = lazy(() => import("./assets/BookDemo-B76734BE.js"));
const BookingsystemKommune = lazy(() => import("./assets/BookingsystemKommune-DX9jORUs.js"));
const BookingsystemUtleie = lazy(() => import("./assets/BookingsystemUtleie-BPnPKCB4.js"));
const Sikkerhet = lazy(() => import("./assets/Sikkerhet-CqBy-4Jp.js"));
const BookingLokalerMoterom = lazy(() => import("./assets/BookingLokalerMoterom-Yyzp17Qv.js"));
const Billettsystem = lazy(() => import("./assets/Billettsystem-Bs5P1BqB.js"));
const Teknologi = lazy(() => import("./assets/Teknologi-wXlVNBPn.js"));
const OmOss = lazy(() => import("./assets/OmOss-CJ1c82-u.js"));
const Leie = lazy(() => import("./assets/Leie-GR7ZCGqK.js"));
const LokalerTilLeie = lazy(() => import("./assets/LokalerTilLeie-B9w-So4f.js"));
const LokalerTilLeieBy = lazy(() => import("./assets/LokalerTilLeieBy-CtLaU0GU.js"));
const LeieSelskapslokale = lazy(() => import("./assets/LeieSelskapslokale-dnQNd9ED.js"));
const LeieMoterom = lazy(() => import("./assets/LeieMoterom-CqVaCfUK.js"));
const LeieKonferanselokale = lazy(() => import("./assets/LeieKonferanselokale-CkVCgQUW.js"));
const LeieKontorlokaler = lazy(() => import("./assets/LeieKontorlokaler-Casy1VdI.js"));
const LeieCoworking = lazy(() => import("./assets/LeieCoworking-Z8j7_ZWg.js"));
const LeieIdrettshall = lazy(() => import("./assets/LeieIdrettshall-ah0_t-fH.js"));
const LeieHall = lazy(() => import("./assets/LeieHall-BNkBqxkv.js"));
const LeiePadelbane = lazy(() => import("./assets/LeiePadelbane-BbcIE20g.js"));
const LeieSvommehall = lazy(() => import("./assets/LeieSvommehall-ByR2LF2l.js"));
const LeieKulturhus = lazy(() => import("./assets/LeieKulturhus-BpnByuD2.js"));
const LeieGaard = lazy(() => import("./assets/LeieGaard-BW0W3yEI.js"));
const LeieBursdagslokale = lazy(() => import("./assets/LeieBursdagslokale-BtiiiZZr.js"));
const Overnatting = lazy(() => import("./assets/Overnatting-PxQGFFQW.js"));
const OvernattingHytte = lazy(() => import("./assets/OvernattingHytte-De9oyv-2.js"));
const OvernattingLeilighet = lazy(() => import("./assets/OvernattingLeilighet-Cei1tQlA.js"));
const OvernattingRom = lazy(() => import("./assets/OvernattingRom-BAoq7bIS.js"));
const OvernattingFeriehus = lazy(() => import("./assets/OvernattingFeriehus-BfrLkekM.js"));
const Utstyr = lazy(() => import("./assets/Utstyr-0qh4EJCL.js"));
const UtstyrFestutstyr = lazy(() => import("./assets/UtstyrFestutstyr-Dj_-tPBS.js"));
const UtstyrVerktoyMaskiner = lazy(() => import("./assets/UtstyrVerktoyMaskiner-BCggr8NE.js"));
const UtstyrLydOgLys = lazy(() => import("./assets/UtstyrLydOgLys-4b3sQrB1.js"));
const UtstyrSportOgFriluft = lazy(() => import("./assets/UtstyrSportOgFriluft-Byan7_J9.js"));
const Tjenester = lazy(() => import("./assets/Tjenester-Bn7m0U12.js"));
const TjenesteCatering = lazy(() => import("./assets/TjenesteCatering-CPerPEyA.js"));
const TjenesteDj = lazy(() => import("./assets/TjenesteDj-DvY2ydMl.js"));
const TjenesteMusiker = lazy(() => import("./assets/TjenesteMusiker-06fbF0Ha.js"));
const TjenesteDekor = lazy(() => import("./assets/TjenesteDekor-BWuW3icN.js"));
const Arrangementer = lazy(() => import("./assets/Arrangementer-B2IYy1vS.js"));
const ArrangementKonsert = lazy(() => import("./assets/ArrangementKonsert-DKg-BZIj.js"));
const ArrangementTeaterOgScene = lazy(() => import("./assets/ArrangementTeaterOgScene-C2cLPgog.js"));
const ArrangementFestival = lazy(() => import("./assets/ArrangementFestival-CdYyYT9U.js"));
const ArrangementSport = lazy(() => import("./assets/ArrangementSport-DfOqxj0w.js"));
const Blog = lazy(() => import("./assets/Blog-Det5y6V3.js"));
const FAQ = lazy(() => import("./assets/FAQ-D6UMQiZh.js"));
const AiAgenter = lazy(() => import("./assets/AiAgenter-JXxMOb3q.js"));
const AgentSesongtildeling = lazy(() => import("./assets/Sesongtildeling-B6fLGTxV.js"));
const AgentComplianceGodkjenning = lazy(() => import("./assets/ComplianceGodkjenning-B1CUNWil.js"));
const AgentImporterOppforing = lazy(() => import("./assets/ImporterOppforing-Buf4TBtq.js"));
const Salgsvilkar = lazy(() => import("./assets/Salgsvilkar-Ctyk3JIb.js"));
const Personvern = lazy(() => import("./assets/Personvern-g2upfh0M.js"));
const Cookies = lazy(() => import("./assets/Cookies-y1TvX0x5.js"));
const NotFound = lazy(() => import("./assets/NotFound-ClDJ9eC7.js"));
const Transparens = lazy(() => import("./assets/Transparens-B2tbWbf3.js"));
const UseCaseSelskapslokaler = lazy(() => import("./assets/UseCaseSelskapslokaler-CvF8vd1Q.js"));
const UseCaseMoterom = lazy(() => import("./assets/UseCaseMoterom-o2w5huTP.js"));
const UseCaseIdrettshaller = lazy(() => import("./assets/UseCaseIdrettshaller-rnahhJwB.js"));
const UseCaseKulturhus = lazy(() => import("./assets/UseCaseKulturhus-CEtoWjv7.js"));
const BlogPost = lazy(() => import("./assets/BlogPost-C7pRu0MA.js"));
const BlogPreview = lazy(() => import("./assets/BlogPreview-DcBV3NFW.js"));
const Status = lazy(() => import("./assets/Status-D4cK_jLq.js"));
const IntelligenceShell = lazy(() => import("./assets/IntelligenceShell-B7V1wVg2.js"));
const IntelligenceOverview = lazy(() => import("./assets/IntelligenceOverview-C0H9Lphj.js"));
const IntelligenceIssues = lazy(() => import("./assets/IntelligenceIssues-BANlP-4c.js"));
const IntelligenceAgents = lazy(() => import("./assets/IntelligenceAgents-CMow-1oK.js"));
const IntelligenceCompliance = lazy(() => import("./assets/IntelligenceCompliance-DK0hHOOz.js"));
const IntelligenceSeo = lazy(() => import("./assets/IntelligenceSeo-BrvAV10t.js"));
const IntelligenceCategoryPage = lazy(
  () => import("./assets/IntelligenceCategory-By610SAF.js").then((m) => ({
    default: m.IntelligenceCategoryPage
  }))
);
const IntelligenceScans = lazy(
  () => import("./assets/IntelligenceMisc-TblgeQuB.js").then((m) => ({
    default: m.IntelligenceScans
  }))
);
const IntelligenceSurfaces = lazy(
  () => import("./assets/IntelligenceMisc-TblgeQuB.js").then((m) => ({
    default: m.IntelligenceSurfaces
  }))
);
const IntelligenceSettings = lazy(
  () => import("./assets/IntelligenceMisc-TblgeQuB.js").then((m) => ({
    default: m.IntelligenceSettings
  }))
);
const IntelligenceTransparensPreview = lazy(
  () => import("./assets/IntelligenceMisc-TblgeQuB.js").then((m) => ({
    default: m.IntelligenceTransparensPreview
  }))
);
const VekstOverview = lazy(
  () => import("./assets/IntelligenceVekst-xW-ZJAWI.js").then((m) => ({
    default: m.VekstOverview
  }))
);
const VekstKeywords = lazy(
  () => import("./assets/IntelligenceVekst-xW-ZJAWI.js").then((m) => ({
    default: m.VekstKeywords
  }))
);
const VekstDrafts = lazy(
  () => import("./assets/IntelligenceVekst-xW-ZJAWI.js").then((m) => ({
    default: m.VekstDrafts
  }))
);
const VekstConnections = lazy(
  () => import("./assets/IntelligenceVekst-xW-ZJAWI.js").then((m) => ({
    default: m.VekstConnections
  }))
);
const VekstAktivitet = lazy(
  () => import("./assets/IntelligenceVekst-xW-ZJAWI.js").then((m) => ({
    default: m.VekstAktivitet
  }))
);
const Chatbot = lazy(
  () => import("./assets/index-DRwWfnEU.js").then((m) => ({ default: m.Chatbot }))
);
const AssistantRail = lazy(
  () => import("./assets/AssistantRail-CdqPp-Fr.js").then((m) => ({
    default: m.AssistantRail
  }))
);
const RouteFallback = () => /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-ink-faint", children: "Laster…" }) });
function ChatbotMount() {
  const location = useLocation();
  const skip = location.pathname.startsWith("/admin") || location.pathname.startsWith("/blogg/preview");
  if (skip) return null;
  return /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(Chatbot, {}) });
}
function AssistantRailMount() {
  const location = useLocation();
  const skip = location.pathname.startsWith("/admin") || location.pathname.startsWith("/blogg/preview");
  if (skip) return null;
  return /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(AssistantRail, {}) });
}
function ContentShell({ children }) {
  const location = useLocation();
  const skip = location.pathname.startsWith("/admin") || location.pathname.startsWith("/blogg/preview");
  return /* @__PURE__ */ jsx("div", { className: `transition-[padding] duration-300 ease-out ${skip ? "" : "lg:pr-[var(--rail-w,22rem)]"}`, children });
}
function AnimatedRoutesWrap({ children }) {
  const location = useLocation();
  return /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsx("div", { children }, location.pathname) });
}
function MotionFirstPaintShim({ children }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: hydrated ? "user" : "always", children });
}
function AppShell() {
  return /* @__PURE__ */ jsx(ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: false, children: /* @__PURE__ */ jsx(MotionFirstPaintShim, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(RumReporter, {}),
    /* @__PURE__ */ jsxs(ChatbotProvider, { children: [
      /* @__PURE__ */ jsx(ContentShell, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteFallback, {}), children: /* @__PURE__ */ jsx(AnimatedRoutesWrap, { children: /* @__PURE__ */ jsxs(Routes, { children: [
        /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/book-demo", element: /* @__PURE__ */ jsx(BookDemo, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bookingsystem-kommune", element: /* @__PURE__ */ jsx(BookingsystemKommune, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bookingsystem-utleie", element: /* @__PURE__ */ jsx(BookingsystemUtleie, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/sikkerhet", element: /* @__PURE__ */ jsx(Sikkerhet, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/booking-av-lokaler-og-moterom", element: /* @__PURE__ */ jsx(BookingLokalerMoterom, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/billettsystem", element: /* @__PURE__ */ jsx(Billettsystem, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/teknologi", element: /* @__PURE__ */ jsx(Teknologi, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/om-oss", element: /* @__PURE__ */ jsx(OmOss, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie", element: /* @__PURE__ */ jsx(Leie, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/lokaler-til-leie", element: /* @__PURE__ */ jsx(LokalerTilLeie, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/lokaler-til-leie/:by", element: /* @__PURE__ */ jsx(LokalerTilLeieBy, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/selskapslokale", element: /* @__PURE__ */ jsx(LeieSelskapslokale, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/gaard", element: /* @__PURE__ */ jsx(LeieGaard, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/bursdagslokale", element: /* @__PURE__ */ jsx(LeieBursdagslokale, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/kulturhus", element: /* @__PURE__ */ jsx(LeieKulturhus, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/moterom", element: /* @__PURE__ */ jsx(LeieMoterom, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/konferanselokale", element: /* @__PURE__ */ jsx(LeieKonferanselokale, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/kontorlokaler", element: /* @__PURE__ */ jsx(LeieKontorlokaler, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/coworking", element: /* @__PURE__ */ jsx(LeieCoworking, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/idrettshall", element: /* @__PURE__ */ jsx(LeieIdrettshall, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/hall", element: /* @__PURE__ */ jsx(LeieHall, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/padelbane", element: /* @__PURE__ */ jsx(LeiePadelbane, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/leie/svommehall", element: /* @__PURE__ */ jsx(LeieSvommehall, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/overnatting", element: /* @__PURE__ */ jsx(Overnatting, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/overnatting/hytte", element: /* @__PURE__ */ jsx(OvernattingHytte, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/overnatting/leilighet", element: /* @__PURE__ */ jsx(OvernattingLeilighet, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/overnatting/rom", element: /* @__PURE__ */ jsx(OvernattingRom, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/overnatting/feriehus", element: /* @__PURE__ */ jsx(OvernattingFeriehus, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/utstyr", element: /* @__PURE__ */ jsx(Utstyr, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/utstyr/festutstyr", element: /* @__PURE__ */ jsx(UtstyrFestutstyr, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/utstyr/verktoy-maskiner", element: /* @__PURE__ */ jsx(UtstyrVerktoyMaskiner, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/utstyr/lyd-og-lys", element: /* @__PURE__ */ jsx(UtstyrLydOgLys, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/utstyr/sport-og-friluft", element: /* @__PURE__ */ jsx(UtstyrSportOgFriluft, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/tjenester", element: /* @__PURE__ */ jsx(Tjenester, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/tjenester/catering", element: /* @__PURE__ */ jsx(TjenesteCatering, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/tjenester/dj", element: /* @__PURE__ */ jsx(TjenesteDj, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/tjenester/musiker", element: /* @__PURE__ */ jsx(TjenesteMusiker, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/tjenester/dekor", element: /* @__PURE__ */ jsx(TjenesteDekor, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/arrangementer", element: /* @__PURE__ */ jsx(Arrangementer, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/arrangementer/konsert", element: /* @__PURE__ */ jsx(ArrangementKonsert, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/arrangementer/teater-og-scene", element: /* @__PURE__ */ jsx(ArrangementTeaterOgScene, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/arrangementer/festival", element: /* @__PURE__ */ jsx(ArrangementFestival, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/arrangementer/sport", element: /* @__PURE__ */ jsx(ArrangementSport, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/blogg", element: /* @__PURE__ */ jsx(Blog, {}) }),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "/blogg/preview/:draftId",
            element: /* @__PURE__ */ jsx(ConvexScope, { children: /* @__PURE__ */ jsx(BlogPreview, {}) })
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "/blogg/:slug", element: /* @__PURE__ */ jsx(BlogPost, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FAQ, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ai-agenter", element: /* @__PURE__ */ jsx(AiAgenter, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ai-agenter/sesongtildeling", element: /* @__PURE__ */ jsx(AgentSesongtildeling, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ai-agenter/compliance-godkjenning", element: /* @__PURE__ */ jsx(AgentComplianceGodkjenning, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/ai-agenter/importer-oppforing", element: /* @__PURE__ */ jsx(AgentImporterOppforing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/salgsvilkar", element: /* @__PURE__ */ jsx(Salgsvilkar, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/personvern", element: /* @__PURE__ */ jsx(Personvern, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(Cookies, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/transparens", element: /* @__PURE__ */ jsx(Transparens, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/status", element: /* @__PURE__ */ jsx(Status, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/selskapslokaler", element: /* @__PURE__ */ jsx(UseCaseSelskapslokaler, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/moterom", element: /* @__PURE__ */ jsx(UseCaseMoterom, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/idrettshaller-gymsaler", element: /* @__PURE__ */ jsx(UseCaseIdrettshaller, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/kulturhus-kantiner", element: /* @__PURE__ */ jsx(UseCaseKulturhus, {}) }),
        /* @__PURE__ */ jsxs(
          Route,
          {
            path: "/admin/intelligence",
            element: /* @__PURE__ */ jsx(ConvexScope, { children: /* @__PURE__ */ jsx(IntelligenceShell, {}) }),
            children: [
              /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(IntelligenceOverview, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "issues", element: /* @__PURE__ */ jsx(IntelligenceIssues, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "scans", element: /* @__PURE__ */ jsx(IntelligenceScans, {}) }),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "uptime",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "uptime",
                      title: "Oppetid & SSL",
                      description: "HTTP-status, responstid og TLS-sertifikatutløp per overflate."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "seo",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "seo",
                      title: "SEO",
                      description: "Titler, descriptions, canonical, OG/Twitter, JSON-LD, duplikater og ødelagte interne lenker."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "wcag",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "a11y",
                      title: "WCAG / Tilgjengelighet",
                      description: "Lang, alt-tekst, label-for, heading-hierarki, ARIA-landmark, knapp- og lenkenavn. axe-core via Playwright kommer i pass 2."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "sikkerhet",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "security",
                      title: "Sikkerhet",
                      description: "HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy + sensitive-file-prober og mixed-content."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "ytelse",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "performance",
                      title: "Ytelse",
                      description: "Core Web Vitals (LCP, CLS, INP, FCP, TTFB) + Lighthouse-score. Hentet fra Google PageSpeed Insights. Målt mot Chrome User Experience Report-data der det finnes RUM-data."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "lenker",
                  element: /* @__PURE__ */ jsx(
                    IntelligenceCategoryPage,
                    {
                      auditType: "links",
                      title: "Lenker",
                      description: "Eksterne lenker HEAD-sjekket på tvers av alle skannede sider."
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(Route, { path: "overflater", element: /* @__PURE__ */ jsx(IntelligenceSurfaces, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "seo-historikk", element: /* @__PURE__ */ jsx(IntelligenceSeo, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "agenter", element: /* @__PURE__ */ jsx(IntelligenceAgents, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "vekst", element: /* @__PURE__ */ jsx(VekstOverview, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "vekst/keywords", element: /* @__PURE__ */ jsx(VekstKeywords, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "vekst/drafts", element: /* @__PURE__ */ jsx(VekstDrafts, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "vekst/connections", element: /* @__PURE__ */ jsx(VekstConnections, {}) }),
              /* @__PURE__ */ jsx(Route, { path: "vekst/aktivitet", element: /* @__PURE__ */ jsx(VekstAktivitet, {}) }),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "transparens",
                  element: /* @__PURE__ */ jsx(IntelligenceTransparensPreview, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "innstillinger",
                  element: /* @__PURE__ */ jsx(IntelligenceSettings, {})
                }
              ),
              /* @__PURE__ */ jsx(
                Route,
                {
                  path: "etterlevelse",
                  element: /* @__PURE__ */ jsx(IntelligenceCompliance, {})
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(CookieConsent, {}),
      /* @__PURE__ */ jsx(ChatbotMount, {}),
      /* @__PURE__ */ jsx(AssistantRailMount, {})
    ] })
  ] }) }) });
}
const UNRESOLVED_SUSPENSE_MARKER = "<!--$!-->";
const RETRY_DEADLINE_MS = 5e3;
const RETRY_INTERVAL_MS = 20;
async function render(url) {
  const tree = /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(AppShell, {}) });
  let html = renderToString(tree);
  const deadline = Date.now() + RETRY_DEADLINE_MS;
  while (html.includes(UNRESOLVED_SUSPENSE_MARKER) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    html = renderToString(tree);
  }
  if (html.includes(UNRESOLVED_SUSPENSE_MARKER)) {
    throw new Error(
      `SSR prerender for ${url} did not resolve within ${RETRY_DEADLINE_MS}ms (unresolved Suspense boundary)`
    );
  }
  return html;
}
export {
  CategoryVisual as C,
  EditorialHeading as E,
  FAQ_CATEGORIES as F,
  HOMEPAGE_FAQ as H,
  KIND_LABEL as K,
  Navbar as N,
  ProgressRail as P,
  SEO as S,
  SectionRule as a,
  EditorialButton as b,
  cn as c,
  staggerChild as d,
  bundledSrcSet as e,
  iconForSlug as f,
  getFraunces as g,
  getAllPosts as h,
  imageForSlug as i,
  formatPostDate as j,
  allFAQEntries as k,
  PERSONA_OPTIONS as l,
  SectionHeader as m,
  logoWebpSrc as n,
  openChatbot as o,
  pageEnter as p,
  previewCover as q,
  revealUp as r,
  render,
  staggerParent as s,
  topicSuggestionsFor as t,
  useChatbotContext as u,
  viewportOnce as v
};
