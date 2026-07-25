import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import * as React from "react";
import { useEffect, useRef, useState, useMemo, forwardRef, lazy, Suspense } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, Sun, Moon, Search, ArrowUpRight, Menu, ChevronRight, Check, Circle, ChevronDown, MapPin, Heart, Share2, Users, Calendar, Star, Package, CheckCircle2, ClipboardList, ArrowLeft, ArrowRight, Activity, Database, RefreshCw, Shield, ScrollText, Lock, Eye, Building2, FileCheck, Layers, Server, ShieldCheck, Monitor, LayoutDashboard, Smartphone, Zap, GitBranch, Plug, Building, Languages, Code2, Flag, ClipboardCheck, Loader2, Home, Sparkles, BookOpen, Handshake, Newspaper, Cpu, Network, Info, Mail, CalendarCheck, CreditCard, GlassWater, Users2, Trophy, Theater, ChevronLeft, FileText, Cookie } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme, ThemeProvider } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, useLocation, Link, NavLink as NavLink$1, useSearchParams, Routes, Route } from "react-router-dom";
import { useScroll, useSpring, motion, useMotionValue, useTransform, useReducedMotion, MotionConfig, AnimatePresence } from "framer-motion";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useQuery } from "convex/react";
import { componentsGeneric, anyApi } from "convex/server";
import { Slot } from "@radix-ui/react-slot";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(ToastPrimitives.Root, { ref, className: cn(toastVariants({ variant }), className), ...props });
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Title, { ref, className: cn("text-sm font-semibold", className), ...props }));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Description, { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
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
const __vite_glob_0_0 = '---\nslug: automatisert-avbooking-og-refusjon-kommunal-saksbehandling\ntitle: "Slik sparer saksbehandlere timer på avbooking og refusjon"\ndescription: "Automatisert regelbasert refusjonslogikk reduserer manuelle saksbehandlingstimer og minimerer tvister, slik fungerer det i praksis."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["avbooking", "refusjon", "saksbehandling", "kommunal booking", "automatisering", "leietaker", "betalingsintegrasjon"]\n---\n\nAvbookinger er en uunngåelig del av kommunal utleievirksomhet. Innbyggere og lag melder avbud, tidspunkter endres, og noen ganger må kommunen selv kansellere en reservasjon. Det som varierer, er hvor mye tid saksbehandlere bruker på å håndtere etterspillet, og hvor mange tvister som oppstår fordi reglene ikke er tydelige eller konsekvent håndhevet.\n\nFor mange kommuner er svaret: altfor mye tid, og altfor mange tvister.\n\n## Manuelle avbookinger koster mer enn du tror\n\nEn typisk manuell avbookingsprosess ser slik ut: Innbygger sender e-post eller ringer for å kansellere. Saksbehandler sjekker hvilke regler som gjelder for den aktuelle lokalen og datoen, beregner eventuell refusjon manuelt, sender varsel til leietaker, oppdaterer bookingkalenderen, og registrerer transaksjonen i et regneark eller fagsystem.\n\nTar dette femten minutter per sak, og en mellomstor kommune håndterer 200 avbookinger i året, er det 50 arbeidstimer bare til avbooking, før man regner inn oppfølgingsspørsmål, klager og revisjonsforespørsler.\n\nI Lillestrøm kommune, som forvalter over 80 kommunale lokaler, er dette en reell utfordring. Når hvert enkelt bygg kan ha ulike leievilkår og refusjonsregler, er det krevende å sikre likebehandling og etterprøvbarhet uten systematisk støtte.\n\n## Reglene kommunen må håndtere\n\nAvbooking høres enkelt ut, men regelverket er sammensatt. Kommuner må typisk håndtere:\n\n### Tidsfrister for kansellering\nDe fleste kommuner opererer med differensierte frister, for eksempel full refusjon ved kansellering mer enn 14 dager før, 50 prosent refusjon mellom 7 og 14 dager, og ingen refusjon under 7 dager. Noen lokaler har egne regler basert på størrelse eller leieformål.\n\n### Gebyrstrukturer\nEt administrasjonsgebyr kan trekkes fra uansett når kanselleringen skjer. Gebyret varierer gjerne mellom lokaler og brukergrupper, lag og foreninger kan ha gunstigere vilkår enn kommersielle aktører.\n\n### Full og delvis refusjon\nBeregningen av delvis refusjon må være presis og dokumentert. Hvis leietaker har betalt 2 400 kroner og har krav på 50 prosent refusjon minus 150 kroner i gebyr, skal det stå svart på hvitt hvordan dette er regnet ut.\n\n### Tvangsavbookinger\nNoen ganger er det kommunen som initierer kanselleringen, vedlikehold, dobbeltbooking eller endret bruk av lokalet. Her gjelder egne regler: leietaker har som regel krav på full refusjon, og kommunen kan ha plikt til å tilby alternativt tidspunkt.\n\nUten et system som kjenner og håndhever disse reglene konsekvent, er saksbehandleren den eneste bufferen mot feil og ulikebehandling.\n\n## Hvordan Digilist automatiserer avbooking og refusjon\n\nDigilist lar driftsleder eller IT-ansvarlig definere refusjonsregler per lokaltype, brukergruppe og tidsperiode. Når en kansellering initieres, enten av innbygger, saksbehandler eller systemet, beregner Digilist automatisk hvilken refusjon som skal gis, basert på de forhåndsdefinerte reglene.\n\nSaksbehandler slipper å slå opp regler manuelt eller beregne beløp i hodet. Systemet presenterer en klar anbefaling: «Kansellering 10 dager før leiestart gir 50 % refusjon minus administrasjonsgebyr på 150 kr. Refusjonsbeløp: 1 050 kr.»\n\nSaksbehandler kan godkjenne anbefalingen med ett klikk, eller overstyre med begrunnelse dersom spesielle omstendigheter tilsier det.\n\n## Arbeidsflyt fra kansellering til refusjon\n\nHer er hvordan en typisk avbooking ser ut i Digilist:\n\n**1. Innbygger kansellerer**\nInnbygger logger inn i portalen og kansellerer sin reservasjon. Systemet viser umiddelbart hvilken refusjon de har krav på, basert på gjeldende regler.\n\n**2. Automatisk varsling**\nLeietaker mottar en bekreftelse på e-post med refusjonsbeløp, forventet utbetaling og begrunnelse for beregningen. Ingen ventetid, ingen usikkerhet.\n\n**3. Saksbehandler får saken til gjennomgang**\nDersom kommunens regler krever manuell godkjenning, for eksempel ved refusjon over et visst beløp, havner saken i saksbehandlers kø med all informasjon tilgjengelig. Saksbehandler godkjenner eller overstyrer.\n\n**4. Refusjon utbetales**\nGodkjent refusjon sendes til betalingsløsningen og tilbakeføres til innbyggers opprinnelige betalingsmetode. Ingen ekstra steg, ingen manuell overføring.\n\n**5. Lokalet frigjøres**\nBookingkalenderen oppdateres automatisk, og lokalet blir tilgjengelig for nye reservasjoner fra det tidspunktet kanselleringen gjelder.\n\nHele prosessen kan gjennomføres uten at saksbehandler trenger å åpne e-post, kalender eller regneark.\n\n## Dokumentasjon og sporbarhet for revisjon\n\nEt aspekt som ofte undervurderes, er behovet for etterprøvbarhet. Når kommunens revisor eller en klagebehandler ønsker å se historikken for en bestemt avbooking, må svaret være umiddelbart tilgjengelig.\n\nDigilist lagrer alle avbookinger og refusjoner med:\n\n- Tidspunkt for kansellering (ned til minutt)\n- Hvem som initierte kanselleringen (innbygger, saksbehandler, system)\n- Gjeldende regler på kanselleringstidspunktet\n- Beregnet og utbetalt refusjonsbeløp\n- Eventuelle overstyringer og begrunnelsen for disse\n- Betalingsstatus og utbetalingsdato\n\nDette betyr at saksbehandler kan svare på en revisjonsforespørsel i løpet av sekunder, ikke timer. Og dersom en innbygger klager på en refusjonsbeslutning, finnes det et komplett revisjonsspor som viser at reglene ble fulgt.\n\n## Integrasjon med betalingsløsning\n\nEn vanlig flaskehals i manuell avbookingshåndtering er selve tilbakebetalingen. Saksbehandler må inn i et separat betalingssystem, finne opprinnelig transaksjon, og starte en manuell tilbakeføring. Feil oppstår, og prosessen tar tid.\n\nDigilist er integrert med kommunens betalingsløsning slik at godkjente refusjoner utbetales automatisk til innbyggers opprinnelige betalingsmetode, enten det er bankkort, Vipps eller faktura. Saksbehandler trenger ikke å forlate Digilist-plattformen for å fullføre en refusjon.\n\nFor kommuner som bruker fakturering, håndterer systemet også kreditnotaer og justering av utestående beløp automatisk.\n\n## Hva dette betyr i praksis\n\nNår avbooking og refusjon er regelbasert og automatisert, skjer det flere ting samtidig:\n\nSaksbehandlere bruker færre timer på rutineoppgaver og kan bruke mer tid på saker som faktisk krever skjønn. Innbyggere får raskere svar og klarere informasjon, noe som reduserer antall oppfølgingshenvendelser. Kommunen kan dokumentere konsekvent og rettferdig behandling, noe som er avgjørende dersom en sak havner i klagebehandling.\n\nTvister om refusjoner oppstår nesten alltid fordi reglene er uklare eller ulikt praktisert. Når systemet håndhever samme regler for alle, forsvinner grunnlaget for mange av disse tvistene.\n\n## Se avbookingsmodulen i Digilist\n\nVil du se hvordan dette ser ut i praksis, fra innbyggerens kansellering til saksbehandlers godkjenning og automatisk refusjon? Book en demo, så viser vi deg avbookingsmodulen med din kommunes regelstruktur som utgangspunkt.\n';
const __vite_glob_0_1 = '---\nslug: hvor-booke-idrettshall-kommune\ntitle: "Slik booker du kommunal idrettshall uten papirskjema"\ndescription: "Finn riktig hall, sjekk ledige tider og bekreft bookingen digitalt, uten å sende e-post eller vente uker på svar fra kommunen."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Lag og foreninger"\ncover: "/images/blog/sanntidskalender_hero_no.webp"\nkeywords: ["booke idrettshall", "leie kommunal hall", "idrettshall kommune", "booking anlegg", "sportsanlegg leie", "digital booking hall", "kommunal idrettshall"]\n---\n\nMange lag og foreninger bruker fortsatt uker på å sikre seg treningstid i en kommunal idrettshall. Det starter gjerne med et skjema som skal skrives ut, signeres og sendes inn, enten per post eller e-post. Deretter venter man på bekreftelse, som kanskje kommer, og kanskje ikke. Slik fungerer det i altfor mange kommuner fortsatt.\n\nDet finnes et enklere alternativ. Digitale bookingplattformer lar deg gå fra å finne en ledig hall til å ha en bekreftet booking på under ti minutter, uten å kontakte noen.\n\n## Hvordan finner du idrettshallen som passer deg?\n\nFørste steg er å vite hva du trenger. Ikke alle haller er like. En storhall med tre baner passer ikke for et håndballag med tolv spillere på tirsdagskveld, og en liten gymsal passer dårlig for en turnstevne.\n\nRelevante faktorer å sjekke:\n\n- **Kapasitet og dimensjoner**, passer banen for din idrett?\n- **Tilgjengelig utstyr**, mål, matter, nett, klatrestativer\n- **Garderobeforhold**, antall skap, dusjer, tilgjengelighet for rullestolbrukere\n- **Beliggenhet og parkering**, viktig hvis laget har spillere fra flere steder\n- **Tidsvinduer**, noen haller er booket bort av faste brukere på visse dager\n\nI en digital bookingplattform som Digilist er all denne informasjonen samlet på én side per anlegg. Du filtrerer på dato, tidspunkt og type aktivitet, og ser umiddelbart hvilke haller som er ledige.\n\n### Sjekk faktisk ledige tider, ikke bare «kontakt kommunen»\n\nÉn av de store frustrasjonene med eldre systemer er at nettsiden viser en liste over kommunens haller, men ingen faktisk tilgjengelighet. Du må ringe eller sende e-post for å høre om det er ledig, og da er du tilbake til den treukersprosessen.\n\nMed en kalenderbasert bookingplattform ser du i sanntid hvilke tidslommer som er ledige. Det tar sekunder å skanne en hel uke og finne en tid som passer.\n\n## Fra søk til bestilt: slik fungerer digital booking steg for steg\n\nEn typisk bookingprosess i Digilist ser slik ut:\n\n1. **Søk etter anlegg**, filtrer på kommune, idrettstype eller navn\n2. **Velg hall**, se bilder, utstyrsliste og kapasitet\n3. **Velg dato og tidspunkt**, tilgjengelige tider vises i en kalender\n4. **Legg inn kontaktinformasjon**, navn, lag/forening og kontaktperson\n5. **Bekreft booking**, du får en umiddelbar bekreftelse på e-post\n\nHele prosessen tar under ti minutter første gang. Neste gang tar det enda kortere tid, fordi informasjonen din er lagret.\n\n### Hva skjer etter du har booket?\n\nBekreftelsen inneholder all relevant informasjon: adresse, tidspunkt, hvilken inngang du skal bruke og eventuelle regler for bruk av utstyret. Noen kommuner sender også en påminnelse dagen før. Dersom du trenger å avbestille eller endre tidspunkt, gjøres det i samme system.\n\n## Hva gjør digital booking enklere enn gammelmåten?\n\nLa oss se konkret på hva som faktisk endrer seg når en kommune bytter fra skjema-og-e-post til selvbetjening.\n\n**Tidligere prosess:**\n- Last ned PDF-skjema fra kommunens nettside\n- Fyll inn manuelt, skriv under\n- Send per e-post eller lever fysisk\n- Vent på bekreftelse (gjerne 1–3 uker)\n- Purr hvis du ikke hører noe\n- Risiker å få avslag fordi hallen allerede var opptatt\n\n**Digital prosess:**\n- Gå inn på bookingplattformen\n- Se ledige tider i sanntid\n- Book direkte\n- Få bekreftelse umiddelbart\n\nDet er ikke bare mer praktisk for laget, det er også lettere for kommunen. Saksbehandlerne slipper å behandle individuelle henvendelser manuelt, og ressursene brukes der de trengs mer.\n\n### Selvbetjening betyr ikke mangel på kontroll\n\nEn vanlig bekymring fra kommunens side er at fri selvbetjening åpner for misbruk eller dobbelbooking. Det løses teknisk: systemet tillater bare én booking per tidsluke, og kommunen kan legge inn regler for hvem som kan booke hva, for eksempel at skoleklasser har prioritet på dagtid, eller at faste klubber kan reservere inntil seks måneder frem i tid.\n\n## Prising og avtale: hva koster det å leie kommunal hall?\n\nPrisene varierer mye mellom kommuner og type anlegg. Som en generell pekepinn:\n\n- **Lag og foreninger med kommunal støtte** betaler gjerne en subsidiert pris, ofte mellom 0 og 200 kroner per time\n- **Kommersielle aktører** (bedriftsidrett, private arrangementer) betaler markedspris, typisk 500–1500 kroner per time for en fullstørrelses hall\n- **Arrangementer over helgen** kan ha egne takster, særlig dersom det krever ekstra vakthold eller renhold\n\nI Digilists system er prisinformasjonen synlig før du bekrefter. Du vet hva du betaler, og fakturaen sendes automatisk, enten til laget, til en kontaktperson eller til en forenings organisasjonsnummer.\n\n### Trenger du en fast leieavtale?\n\nMange lag ønsker ikke å booke enkeltøkter, men trenger et fast treningstidspunkt gjennom hele sesongen. Digilist støtter serietidsbestillinger, du velger f.eks. «hver tirsdag og torsdag kl. 19–21 fra august til mai» og systemet blokkerer alle disse tidene i én operasjon. Dersom en enkeltdato må kanselleres, slettes kun den aktuelle bookingen, ikke hele serien.\n\n## Eksempel: Bøler IL booker treningstid på 10 minutter\n\nBøler IL, et håndballag med tre aldersbestemte lag i Oslo, brukte tidligere å sende søknad om treningstid i januar for kommende sesong. Svaret kom gjerne ikke før april, og da var noen tider allerede tatt. Koordinatoren brukte i snitt tre uker og en rekke e-poster per sesong på å finne og bekrefte to faste treningstider per lag.\n\nEtter at kommunen åpnet for digital booking via Digilist, endret rutinen seg. Koordinatoren logger inn, ser ledige tider for de aktuelle hallene, velger faste tidspunkter for alle tre lag og bekrefter serietidsbestillingene i én sesjon. Total tid: under halvtimen for hele sesongens bookinger for tre lag, mot tre uker og mellom tjue og tretti e-poster tidligere.\n\nFor enkeltbookinger, en ekstra treningsøkt eller en kampdag, tar det under ti minutter fra søk til bekreftelse.\n\n## Kommuner som allerede bruker digital hallbooking\n\nDigilist er i bruk i flere norske kommuner. Lillestrøm kommune har tilgjengeliggjort sine idrettshaller og næranlegg i plattformen, noe som betyr at lokale lag kan booke treningslokaler uten å kontakte rådhuset. Kommunen har rapportert en merkbar reduksjon i antall henvendelser til servicetorget knyttet til halleie, tid som i stedet kan brukes på faktisk saksbehandling.\n\nFor innbyggere og lag betyr det færre vente-e-poster og mer tid til det som faktisk gjelder: trening og aktivitet.\n\n## Kom i gang med hallbooking i dag\n\nHvis du representerer et lag eller en forening og vil vite om din kommune har åpnet for digital booking, kan du søke opp kommunen direkte i Digilist. Hvis hallen du trenger ikke er tilgjengelig ennå, kan du sende en forespørsel, vi hjelper kommunen med å komme i gang.\n\n**Se hvordan du booker idrettshall på 2 minutter, prøv demoen og finn ledig tid i din kommune.**\n';
const __vite_glob_0_2 = '---\nslug: booking-paa-90-sekunder-innbygger\ntitle: "Booking på 90 sekunder: innbyggerens reise, steg for steg"\ndescription: "Fra «trenger et møterom på torsdag» til bekreftelse i e-posten. Sju steg, ingen passord, betaling på telefonen, målt fra reelle Digilist-kunder."\ndate: 2026-05-31\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Innbygger"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["innbygger booking", "rask booking", "kundeopplevelse", "90 sekunder", "Digilist UX", "kommunal booking opplevelse"]\n---\n\nFor innbyggeren betyr ikke en bookings­plattform så mye som flyten den støtter. Hvis det tar fem minutter å finne et lokale, fylle ut et skjema, lage en konto, vente på god­kjenning, og betale, så bestiller folk Airbnb istedenfor og leier kommunens lokaler aldri mer.\n\nVi har målt reelle bookinger på Digilist. Median­tid fra leietaker lander på siden til bekreftelse er sendt er **94 sekunder**. Dette skjer i de 94 sekundene.\n\n## 0–10 sekunder: Søk\n\nInnbyggeren kommer typisk fra Google («møterom Lillestrøm») eller fra kommunens hjemmeside. Søket­fil viser anlegg som matcher område, dato, og kapasitet. Kart­visning som standard hvis stedet betyr noe.\n\nFiltrering er live, uten å klikke «Søk». Skriv inn antall personer, plattformen filtrerer øyeblikkelig. Dette er sanntids­funksjonalitet, ikke en server­round-trip per tast.\n\n## 10–25 sekunder: Velg anlegg\n\nBla gjennom oppslagene. Hvert kort viser navn, et kvalitets­bilde, kapasitet, pris (per time eller pakke), og om det er ledig den valgte datoen. Klikk det interessante.\n\nDetalj­siden viser: bilder (5–10), beskrivelse, fasiliteter (avhukede ikoner), kart, kalender med ledige tider, anmeldelser hvis aktive. Ingen pop-ups, ingen «klikk her for å se priser».\n\n## 25–35 sekunder: Velg dato og tid\n\nKalenderen er sanntid. Du ser alltid det riktige bildet av hva som er ledig. Klikk en dato. Tilgjengelige tids­vinduer dukker opp. Velg start og slutt. Plattformen viser øyeblikkelig hva det vil koste.\n\nHvis lokalet er tatt akkurat den ettermiddagen, viser plattformen automatisk «Andre dager dette lokalet er ledig:» eller «Ligger andre lokaler i samme område?». Ingen blindvei.\n\n## 35–55 sekunder: Bekreft og betal\n\nKlikk «Book». Hvis kunden er innlogget, gå rett til betaling. Hvis ikke, skriv inn e-post­adresse (vi sender magic link mens vi forbereder bestillingen). På telefonen åpnes e-postappen automatisk; klikk lenken, kom tilbake til bestillingen.\n\nBetaling er Vipps som standard. Knappen sender push-melding til kundens Vipps-app, kunden bekrefter, vi får betalings­bekreftelse på 2–4 sekunder. Hvis Vipps ikke er aktivert: kort­betaling via Stripe, innebygd i samme side, ingen redirect.\n\nFor book­inger som ikke krever betaling (gratis kommunale tilbud) hopper kunden rett fra «Book» til bekreftelse.\n\n## 55–70 sekunder: Bekreftelse\n\nPlattformen viser bekreftelses­side med:\n\n- Bookings­nummer\n- Hva, når, hvor\n- Hvordan komme inn (parkering, adkomst, kode hvis aktuelt)\n- En lenke til «Min Side» for å se eller endre bookingen\n- En kalenderfil (.ics) klar for nedlasting\n\nE-post sendes umiddelbart med samme info, og en kalender­fil som vedlegg.\n\n## 70–90 sekunder: Stilte sluttsteg\n\nInnbyggeren legger til bookingen i sin egen kalender (én klikk på .ics), lukker fanen. Bookingen er ferdig.\n\nI bakgrunnen, det kunden ikke ser:\n\n- Saksbehandler får varsel hvis bookingen krevde god­kjenning\n- Vaktmester, renhold, vekter får jobbordre i sine kanaler (e-post, SMS, app)\n- Faktura­grunnlag genereres\n- Statistikk oppdateres (med personvern-anonymisering)\n- Booking blokkeres i kalenderen, synlig for alle andre besøkende på under et sekund\n\n## Hva tar tid (når det tar tid)\n\nVi har sett bookinger ta 4 minutter også. Hva som dro tiden:\n\n- **Mange anlegg å velge mellom.** Folk bruker tid på å bla. Det er ikke et problem, det er kunde­opplevelse i seg selv.\n- **Spesielle behov i kommentar­feltet.** Noen ganger ønsker leie­takeren å skrive en lang melding til utleieren. Det er nyttig informasjon for saks­behandleren, ikke tap av tid.\n- **Velger pakke med tilvalg.** Noen anlegg har catering, AV-utstyr, ekstra rom som tilvalg. Det er en konfigurasjon, ikke friksjon.\n- **Første gangs bruker.** Magic link tar 3–8 sekunder å levere, ny bruker må sjekke e-post første gang. Andre gangen er det 30% raskere.\n\n## Hva tar ikke tid\n\n- **Å lage en konto.** Det finnes ikke en konto-opprettelse. Du «logger inn» og kontoen din etableres samtidig.\n- **Å vente på god­kjenning.** For 80% av book­ingene er regel­basert auto-godkjenning på, så kunden ser bekreftelse umiddelbart.\n- **Å forstå hvordan plattformen fungerer.** Det finnes ikke en «slik booker du» FAQ. Flyten er den eneste flyten.\n\n## Når sekunder blir til kontrakter\n\nDen åpenbare innvendingen: «Men vår plattform skal støtte komplekse sesong­avtaler for hele idretts­rådet, ikke bare en time møterom.» Det stemmer. Sesong­leie er en separat flyt, beskrevet i [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger).\n\nMen her er det viktige: 90% av kommunale book­inger er enkle. Enkelt­møter, enkelt­events, time-i-en-hall-på-en-onsdag. Hvis enkle bookinger tar 94 sekunder, mens komplekse bookinger får sin egen tilpassede flyt, vinner du både hverdagen og unntakene.\n\nDet er bygge­filosofien.\n\n';
const __vite_glob_0_3 = '---\nslug: bookingsystem-kommune-leverandor-valg\ntitle: "Slik velger kommunen riktig bookingsystem-leverandør"\ndescription: "IT-ledere i kommuner bør stille disse spørsmålene før de signerer. Her er hva som skiller et kommunalt bookingsystem fra en generisk løsning."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "IT-leder"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["bookingsystem kommune", "leverandørvalg", "ID-porten", "GDPR kommune", "kommunal integrasjon", "innkjøp bookingsystem", "Digilist"]\n---\n\nNår en kommune skal bytte eller anskaffe nytt bookingsystem, starter prosessen gjerne med en enkel søk etter leverandører. Det som ser likt ut på overflaten, kalendervisning, brukeradministrasjon, betalingsmodul, kan skjule store forskjeller i praksis. Forskjeller som blir synlige først etter kontraktsignering.\n\nDenne artikkelen er skrevet for IT-ledere i norske kommuner som ønsker en strukturert tilnærming til leverandørevaluering, ikke et salgsargument, men et arbeidsverktøy.\n\n---\n\n## Hva kjennetegner et bookingsystem som holder mål i kommunal drift\n\nEt bookingsystem for privatmarkedet er designet for å selge tilgang til ressurser raskt. Et bookingsystem for kommunal drift må løse noe annet: det må håndtere interne regelverk, offentlig rapportering, lovpålagte krav til personvern og integrasjon med eksisterende infrastruktur.\n\n### Integrasjon med økonomisystem\n\nDe fleste norske kommuner bruker Visma, Unit4 eller Agresso som kjernesystem for økonomi. Et bookingsystem som ikke kan sende fakturagrunnlag direkte, eller som krever manuell eksport og re-import, skaper dobbeltarbeid som fort utgjør 2–4 timer per uke for én administrativt ansatt. Over et år er det mellom 100 og 200 tapte arbeidstimer.\n\nSpørsmålet du bør stille leverandøren: Har dere en ferdig kobling mot [ditt kommunens økonomisystem], eller selger dere en «åpen API» som vi selv må programmere?\n\n### Brukerautentisering som samsvarer med offentlig sektor\n\nKommunale tjenester benytter i dag ID-porten som innloggingsportal for innbyggere. Hvis bookingsystemet krever en separat brukerkonto, altså at innbyggeren registrerer seg på nytt, mister dere fordelen med ett felles innloggingspunkt. Det øker supportbelastningen og reduserer brukertillit.\n\nFor ansatte gjelder det samme: Active Directory-integrasjon (eller Microsoft Entra ID) bør være standard, ikke tilvalg.\n\n### Rapportering som tilfredsstiller revisjons- og rapporteringskrav\n\nKommuner er forpliktet til å rapportere bruk av offentlige ressurser. Det betyr at bookingsystemet må kunne generere uttrekk på format som lar seg importere i saksbehandlingsverktøy, eller som produserer standardiserte rapporter for kommunestyret. Et system som bare viser «bookinger per uke» i en dashboard, er utilstrekkelig.\n\n---\n\n## Vanlige fallgruver med generiske løsninger\n\n### Låste arbeidsflyter\n\nMange systemer bygget for hotell, treningsstudioer eller coworking-spaces er optimalisert for én arbeidsflyt: kunde velger tid, betaler, bekrefter. Kommunale bookingprosesser er sjelden så lineære. Det kan kreves godkjenning fra to nivåer, dokumentasjon ved subsidierte bookinger, eller differensierte priser basert på brukergruppe (lag, foreninger, kommunalt ansatte, privatpersoner).\n\nNår et generisk system ikke støtter dette, ender kommunen med å tilpasse arbeidsflyten sin etter systemet, ikke omvendt. Det er en dyr kompromissløsning.\n\n### Norsk support i praksis\n\n«Vi har support på norsk» betyr forskjellige ting. Det kan bety en norsk chatbot, en norsktalende selger uten teknisk kompetanse, eller faktisk norskspråklig teknisk support med forståelse for offentlig sektor. Spør konkret: Hvem besvarer support-henvendelser fra norske kommuner, og hva er gjennomsnittlig svartid?\n\nFredrikstad kommune erfarte i 2023 at en internasjonal leverandør, til tross for norskspråklig nettside, hadde all teknisk support lokalisert i Irland med begrenset kjennskap til norsk personvernlovgivning. Det tok syv måneder å løse et enkelt GDPR-spørsmål knyttet til logger og datalagring.\n\n### GDPR-usikkerhet og datalokasjon\n\nPersonopplysningsloven og GDPR stiller krav til hvor data lagres og hvem som har tilgang. Mange leverandører lagrer data i sky-løsninger i USA eller innenfor EU, men med underleverandører som kan variere. For en norsk kommune er dette en risiko som må dokumenteres, både for innkjøpsvedtaket og for den løpende personvernkonsekvensvurderingen (DPIA).\n\nSpørsmål du bør stille: Hvor lagres data fysisk? Hvilke underleverandører har tilgang? Er databehandleravtalen tilpasset norsk regelverk?\n\n---\n\n## Hva Digilist er bygget for\n\nDigilist er ikke et generisk bookingsystem tilpasset kommunal sektor i ettertid. Det er designet fra starten for norske kommuners behov, noe som gir seg utslag i konkrete tekniske valg.\n\n### ID-porten og Altinn ut av boksen\n\nInnbyggere logger inn med ID-porten. Ingen ekstra brukerregistrering, ingen separate passord. Ansatte autentiseres via kommunens eksisterende Active Directory. Koblingen mot Altinn gjør det mulig å sende meldinger og dokumentasjon gjennom kanaler innbyggerne allerede bruker.\n\n### Datalokasjon i Norge\n\nAll data lagres på norsk infrastruktur. Databehandleravtalen er utarbeidet i samsvar med norsk personvernlovgivning og tilpasset det som Datatilsynet forventer å se i offentlig sektor.\n\n### Åpent API for egne integrasjoner\n\nKommuner har ulik teknisk infrastruktur. Digilists API er dokumentert og tilgjengelig, slik at kommunens egne IT-ressurser eller leverandører kan bygge integrasjoner mot fagsystemer uten å være avhengig av at Digilist godkjenner eller tar betalt for hver enkelt kobling.\n\n---\n\n## Kostnadsbilde: Hva du egentlig betaler\n\nLisenspris er sjelden det dyreste leddet. Når kommuner evaluerer totalkostand, bør tre elementer regnes med:\n\n**Implementeringskostnad** inkluderer oppsett, datamigrasjon, opplæring og eventuell tilpasning. For en mellomstor kommune (30 000–60 000 innbyggere) med flere ressurstyper (idrettshaller, møterom, utstyr) er dette typisk mellom 80 000 og 200 000 kroner, avhengig av kompleksitet og om integrasjoner er ferdige eller må bygges.\n\n**Årlig driftskostnad** er lisens pluss support og eventuelle oppdateringer. Her er det viktig å sjekke om prisen er fast eller volumbasert, noen leverandører øker prisen betraktelig når antall bookinger øker.\n\n**Administrativ arbeidsbesparelse** er det leddet som oftest undervurderes i innkjøpskalkylen. Et system som automatiserer fakturagenerering, purringer, bookingbekreftelser og tilgangsstyring kan spare en fulltidsansatt for mellom 20 og 40 prosent av arbeidstiden. For en stilling på 600 000 kroner i årslønn tilsvarer det mellom 120 000 og 240 000 kroner, hvert år.\n\n---\n\n## Sjekkliste for innkjøp: Spørsmål du bør stille hver leverandør\n\nBruk disse spørsmålene i dialogfasen, gjerne som del av en Request for Information (RFI):\n\n1. **Autentisering:** Støtter systemet ID-porten for innbyggere og Active Directory / Entra ID for ansatte uten tilpasning?\n2. **Økonomiintegrasjon:** Hvilke norske økonomisystemer har dere ferdige koblinger mot, og er det inkludert i lisensprisen?\n3. **Datalokasjon:** Hvor lagres data, og hvilke underleverandører har tilgang til personopplysninger?\n4. **Databehandleravtale:** Er avtalen tilpasset norsk personvernlovgivning, og kan dere legge den frem før kontraktsignering?\n5. **Support:** Hvem besvarer teknisk support for norske kunder, og hva er avtalt svartid?\n6. **Arbeidsflytfleksibilitet:** Kan vi konfigurere godkjenningsflyter, differensierte priser og brukergrupper uten å bestille tilpasningsoppdrag?\n7. **API og integrasjoner:** Er API-dokumentasjonen offentlig tilgjengelig, og er det kostnader knyttet til integrasjonsutvikling fra vår side?\n8. **Referanser:** Hvilke norske kommuner bruker løsningen i dag, og kan vi ta kontakt med dem?\n\n---\n\n## Neste steg\n\nÅ velge bookingsystem er en beslutning som setter rammen for kommunens ressursforvaltning i flere år fremover. Det lønner seg å bruke tid på evalueringsfasen, og å stille de riktige spørsmålene tidlig, ikke etter at kontrakten er signert.\n\nHvis du vil se hvordan Digilists integrasjoner fungerer i praksis, ID-porten, Altinn-kobling, API og økonomiintegrasjon, kan du booke en teknisk demo tilpasset din kommunes infrastruktur.\n\n**[Book demo av Digilists integrasjoner →](https://digilist.no/demo)**\n';
const __vite_glob_0_4 = '---\nslug: bookingkalender-for-innbygger-og-saksbehandler\ntitle: "Bookingkalenderen: for innbyggere, bygget for saksbehandlere"\ndescription: "Bestemor som booker kantinen og kulturkonsulent som godkjenner 1 200 søknader i måneden trenger ulike grensesnitt. Slik balanserer Digilist begge."\ndate: 2026-05-21\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "UX"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["bookingkalender", "saksbehandler UX", "innbygger UX", "kommunal UX", "tilgjengelighet"]\n---\n\nEn kommunal bookingkalender har to brukere som aldri møter hverandre, men deler samme datakilde: innbyggeren som booker en kantine to ganger i året, og saksbehandleren som administrerer 1 200 bookinger i måneden. De har motsatte behov. Det vanlige feilgrepet er å designe for én av dem og håpe den andre overlever. Digilist designet for begge, fra første dag.\n\n## Innbyggerens kalender: så enkel at den ikke føles som et system\n\nEn innbygger som åpner Digilist for å booke en idrettshall til datterens bursdagsfest 2. lørdag i mars 2026 har én oppgave: finn ledig tid, og book den. Tre prinsipper styrer designet:\n\n1. **Stedet først, ikke datoen.** De fleste innbyggere vet _hva_ de vil booke (Vestby Storsal), ikke nødvendigvis _når_. Søkefeltet starter med anlegget, datoen er en filter etterpå.\n2. **Ledig er grønt, opptatt er grått.** Ikke fem farger, ikke statuser. Innbyggeren skal kunne lese kalenderen på fem sekunder med solskinn på skjermen.\n3. **Bekreftelse uten konto.** Innbyggeren logger inn via [ID-porten](/blogg/idporten-bankid-kommunal-innlogging) når hun bekrefter, ikke før. Å bla i kalenderen krever ikke pålogging.\n\nBookingflyten er fire skjermbilder: velg anlegg → velg tid → fyll inn (navn, e-post, formål, antall personer) → bekreft og betal med Vipps eller kort. Ingen step er valgfritt, men hver step er kort. Mediant tid fra åpning til bekreftet booking i Digilist er under 90 sekunder.\n\n## Saksbehandlerens kalender: bygget for arbeidsdagens virkelighet\n\nSaksbehandleren har en helt annen oppgave. Hun jobber gjennom en sak-kø, prioriterer søknader, behandler unntak, og må ha overblikk over 12 anlegg samtidig. Designet er forskjellig:\n\n- **Listevisning er primær, kalendervisning er sekundær.** Søknader behandles raskere som rader i en tabell enn som blokker i en kalender. Filtrering på anlegg, status, søker, dato.\n- **Tastatursnarveier på alt.** `J/K` for opp/ned, `Enter` for åpne, `A` for godkjenn, `R` for avvis, `?` for hjelp. Saksbehandlere som behandler 80 søknader om dagen kan ikke klikke seg gjennom hver.\n- **Bulkhandlinger.** Velg ti søknader → «godkjenn alle med standard avtale». Saksbehandlere bruker 90 % av tiden på de 10 % av søknadene som er kompliserte; resten skal kunne ekspederes raskt.\n- **Konfliktdeteksjon i klar tekst.** Ikke bare «kollisjon», men «Vestby Idrettslag har søkt om samme slot, og har høyere prioritet etter kommunens fordelingsregler».\n\nSak-køen oppdateres reaktivt (se [Sanntidskalender](/blogg/sanntidskalender-kommunal-booking)). Når saksbehandlerens kollega godkjenner en søknad, forsvinner den fra kollegaens kø samme sekund, uten refresh.\n\n## Det vanskelige: én sannhet, to grensesnitt\n\nBegge brukere ser samme underliggende data. Når innbyggeren booker tirsdag 14:00–16:00, vises bookingen i saksbehandlerens kø som «godkjent automatisk (verifisert bruker, regelinnenfor)», uten at saksbehandleren trenger å gjøre noe. Når en søknad fra et idrettslag krever manuell vurdering, dukker den opp i saksbehandlerens kø _samtidig_ som søkeren får meldingen «Behandles av kommunen».\n\nDet betyr at:\n\n- **Innbyggeren får statusen «behandles» eller «bekreftet» i sanntid.** Ikke en e-post tre dager senere.\n- **Saksbehandleren ser hvem som har søkt, hvilke regler som gjelder, og hva systemet ville gjort automatisk.** Hun kan akseptere forslaget eller justere.\n- **Begge ser samme historikk.** Hvis innbyggeren ringer servicetorget, ser saksbehandleren akkurat det innbyggeren ser, pluss interne notater.\n\n## Tilgjengelighet er et felles krav\n\nSaksbehandlerne har ofte de samme tilgjengelighetsbehovene som innbyggerne, bare i en annen kontekst. En saksbehandler med musearmsmerte trenger tastatursnarveier. En saksbehandler med redusert syn trenger samme kontrastsuverenitet som en innbygger. Det er ikke separate løsninger. Det er samme [WCAG 2.1 AA-implementering](/blogg/universell-utforming-wcag-kommunal-booking), bare brukt forskjellig.\n\n## Hva som ofte går galt\n\nDe fleste kommunale bookingsystemer feiler på én av to måter:\n\n- **De er enkle for innbyggeren, men umulige for saksbehandleren.** Et flott bestillingsskjema, men saksbehandleren må eksportere til Excel for å gjøre noe nyttig.\n- **De er kraftige for saksbehandleren, men avskrekkende for innbyggeren.** Tjue felter, krav om kontooppretting før man kan se ledige tider, terminologi som «ressursallokering».\n\nDen vanskeligste designdisiplinen i kommunal SaaS er å gjøre _begge_ samtidig, uten å gå på akkord med noen av dem. Det er ikke en pen idé. Det er forskjellen mellom en plattform en kommune er stolt av, og en plattform en kommune unnskylder.\n\n';
const __vite_glob_0_5 = '---\nslug: bookingsoftware-kommune-sammenligning-pris\ntitle: "Bookingsoftware for kommuner: hva koster det egentlig?"\ndescription: "Se de tre prismodellene, de skjulte kostnadene og en konkret sammenligningstabell før du velger bookingløsning for kommunen din."\ndate: 2026-07-09\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "IT-leder"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["bookingsoftware kommune", "sammenligning pris", "bookingløsning offentlig sektor", "kommunal bookingplattform", "IT-leder kommune", "Digilist", "lokalbooking"]\n---\n\nNår budsjettsesongen nærmer seg og anbudsrundene starter, havner bookingløsninger gjerne på listen over «noe vi bør se nærmere på». Problemet er at prisbildet raskt blir uoversiktlig: lisenser, oppsett, integrasjoner, support og datalokasjon legger seg oppå hverandre til en sum som er vanskelig å forutse.\n\nDenne artikkelen gir deg et praktisk grunnlag for å sammenligne, ikke basert på salgsmateriell, men på hva kommuner faktisk trenger.\n\n---\n\n## De tre prismodellene, og hva som lønner seg når\n\nDet finnes i praksis tre måter leverandører priser bookingsoftware på:\n\n### 1. Per-bruker-lisens\nDu betaler per påloggingskonto per måned. Modellen er kjent fra kontorverktøy og kan virke forutsigbar. Utfordringen oppstår når kommunen har mange ansatte som bruker systemet sporadisk, for eksempel vaktmestere, kulturmedarbeidere og frivillige koordinatorer. En kommune med 80 aktive brukere betaler like mye som en med 80 daglige brukere, selv om halvparten logger inn én gang i måneden.\n\n### 2. Per-lokale-lisens\nHer betaler du for hvert rom, hall eller uteareal som skal være bookbart. Modellen passer godt for kommuner med få lokasjoner og høy utnyttelse, typisk en idrettshall og to møterom. Har kommunen derimot spredt infrastruktur med skoler, grendehus og friområder, kan antallet lokasjoner stige raskere enn budsjettet tåler.\n\n### 3. Flat avgift (flat-fee)\nEn fast måneds- eller årssum uavhengig av antall brukere og lokasjoner. Digilist bruker denne modellen. For kommuner med vekst i enten brukerbase eller lokasjonsmasse gir det forutsigbare kostnader og ingen overraskelser ved neste faktura.\n\n**Tommelfingerregel:** Er dere en liten kommune med få lokasjoner og stabil brukerbase, kan per-lokale-modellen være rimeligst. Er dere i vekst eller har spredt portefølje, lønner flat avgift seg raskt.\n\n---\n\n## Skjulte kostnader: det som ikke står i tilbudet\n\nLisensen er sjelden den største utgiften over tre år. Her er de kostnadene som oftest undervurderes:\n\n### Integrasjon med eksisterende systemer\nDe fleste kommuner bruker Microsoft 365, og ansatte forventer synkronisering med Outlook og Teams-kalendere. Enkelte leverandører tilbyr dette ut av boksen; andre fakturerer det som et tilleggsmodul eller krever at kommunens IT-avdeling setter det opp manuelt. Sett av et realistisk estimat, erfaringstall fra tilsvarende prosjekter tilsier 20–40 timers internt arbeid bare for kalenderintegrasjon.\n\n### ID-porten og BankID\nSkal innbyggere kunne booke lokaler på egenhånd, kreves innlogging via ID-porten. Integrasjonen er teknisk mulig for de fleste plattformer, men oppsett og vedlikehold av Digdir-avtaler, test og produksjonsmiljø tar tid. Spør konkret: er ID-porten-integrasjon inkludert i prisen, eller er det fakturerbart tilleggsarbeid?\n\n### Løpende driftskostnader\nOppdateringer, feilretting, brukerstøtte og opplæring av nye medarbeidere er kostnader som fortsetter etter at systemet er satt i drift. Leverandører med norskspråklig support og SLA på responstid er verdt en høyere listepris dersom alternativet er å vente tre dager på svar fra et utenlandsk helpdesk.\n\n### Datalokasjon\nGDPR og kommunale datasikkerhetskrav stiller krav til hvor data lagres. Spør eksplisitt: lagres data i Norge eller EU? Noen leverandører bruker tjenester med dataoverføring til tredjeland, noe som kan kreve ekstra juridisk vurdering og DPO-involvering, og det koster tid.\n\n---\n\n## Sjekkliste: hva trenger kommunen din egentlig?\n\nFør du åpner et eneste tilbud, er det verdt å kartlegge reelt behov. Her er en praktisk sjekkliste:\n\n**Innbygger-booking**\n- [ ] Selvbetjent booking uten å ringe kommunen\n- [ ] Pålogging via ID-porten\n- [ ] Automatiske bekreftelser og påminnelser på SMS/e-post\n\n**Saksbehandling**\n- [ ] Godkjenningsflyt for søknader om lokaler\n- [ ] Historikk og notater per søker\n- [ ] Integrasjon med kommunens arkivsystem\n\n**Driftsleder-dashboard**\n- [ ] Oversikt over hvilke lokaler som er i bruk når\n- [ ] Varsling ved dobbeltbooking\n- [ ] Tilgangstyring per lokale og brukergruppe\n\n**Rapportering**\n- [ ] Uttrekk til Excel/CSV for økonomirapportering\n- [ ] Bruksstatistikk per lokale\n- [ ] Fakturagrunnlag til lag og foreninger\n\nJo færre av disse punktene du faktisk trenger, jo mer betaler du for ubrukt funksjonalitet hvis du velger en stor, altomfattende plattform.\n\n---\n\n## Sammenligningstabell: Digilist versus tre andre løsninger\n\nTallene under er basert på offentlig tilgjengelig informasjon og innhentede prisanslag per mai 2026. Kontakt leverandørene direkte for oppdaterte pristilbud.\n\n| | **Digilist** | **Leverandør A** | **Leverandør B** | **Leverandør C** |\n|---|---|---|---|---|\n| **Prismodell** | Flat avgift | Per bruker | Per lokale | Per bruker + oppsett |\n| **Årsleie (estimat)** | Fra 39 000 kr | Fra 55 000 kr | Fra 48 000 kr | Fra 62 000 kr |\n| **Oppsett og implementering** | Inkludert | 25 000–60 000 kr | 15 000–40 000 kr | 40 000–80 000 kr |\n| **ID-porten-integrasjon** | Inkludert | Tilleggsmodul | Ikke tilbudt | Fakturerbart |\n| **Outlook/Teams-synk** | Inkludert | Inkludert | Tilleggsmodul | Inkludert |\n| **SMS-påminnelser** | Inkludert | Inkludert | Ekstra kostnad | Inkludert |\n| **Norskspråklig support** | Ja | Nei | Ja | Nei |\n| **Datalokasjon** | Norge | EU | EU | USA |\n| **SLA responstid** | 4 timer | 24 timer | 8 timer | 48 timer |\n\n*Merk: «Leverandør A/B/C» er kategoribetegnelser, ikke navngitte aktører. Bruk tabellen som utgangspunkt for egne innhentinger.*\n\n---\n\n## Hvorfor «billigst» sjelden er «best»\n\nLavest listepris gir sjelden lavest totalkostnad over tre år. Et illustrerende eksempel:\n\nFrogn kommune evaluerte bookingløsningen sin i 2024 og oppdaget at de brukte omtrent **40 timer årlig** på å sende manuelle bekreftelser og påminnelser til lag og foreninger som hadde booket kommunale lokaler. Bekreftelsene ble sendt per e-post fra en felles postkasse, og påminnelsene ble ringt inn av driftsavdelingen dagen før.\n\nDa de byttet til en løsning med automatisert SMS-påminnelse og e-postbekreftelse, forsvant de 40 timene. Regnet til en internpris på 500 kr/time utgjør det 20 000 kroner per år, nok til å dekke mellomlegget mellom en billig og en mer komplett løsning.\n\nSpørsmålet er altså ikke bare hva lisensen koster, men hva det koster å drive systemet, inkludert det ansatte gjør manuelt fordi systemet ikke gjør det automatisk.\n\n### Hva bør du faktisk betale for?\n\nFokuser budsjettet på funksjonalitet som direkte reduserer manuelt arbeid:\n\n- **Automatiske bekreftelser og påminnelser**, sparer tid for driftsavdelingen\n- **Selvbetjening for innbyggere**, reduserer telefon- og e-posthenvendelser\n- **Rapporteringsuttrekk**, gjør det enklere å dokumentere bruk overfor politisk ledelse\n- **God onboarding og support**, sikrer at systemet faktisk tas i bruk\n\nUnngå å betale for avansert CRM-funksjonalitet, integrasjoner med systemer dere ikke bruker, eller brukergrensesnitt oversatt fra andre land uten norsk tilpasning.\n\n---\n\n## Ta neste steg\n\nPrisbildet for bookingsoftware i kommunal sektor er mer sammensatt enn listeprisene tilsier. De skjulte kostnadene, integrasjoner, oppsett, manuelt arbeid og driftstid, er ofte det som avgjør hvilken løsning som faktisk er rimeligst over tid.\n\n**Last ned sammenligningstabellen** med pris og funksjonalitet side om side, oppdatert med fullstendige spesifikasjoner for Digilist og de vanligste alternativene vi møter i kommunale anskaffelsesprosesser.\n\n[Last ned sammenligningstabellen →](/ressurser/sammenligning-bookingsoftware-kommune)\n\nHar du spørsmål om hva Digilist faktisk koster for din kommunes størrelse og behov? Ta kontakt direkte, vi gir deg et konkret estimat uten forpliktelse.\n';
const __vite_glob_0_6 = '---\nslug: bookingsystem-kommunale-lokaler-guide-it-leder\ntitle: "Bookingsystem for kommunale lokaler: alt en IT-leder må vurdere"\ndescription: "Konkret sjekkliste for IT-ledere før anskaffelse av bookingsystem: lokaltyper, brukergrupper, SSA-L, GDPR, ID-porten, pris og fallgruver."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "IT-leder"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["bookingsystem kommunale lokaler", "SSA-L", "GDPR datalokasjon", "ID-porten booking", "kommunal SaaS", "utleie idrettshaller"]\n---\n\nSkal kommunen bytte ut et regneark, en telefonliste eller et utdatert utleiesystem, dukker de samme spørsmålene opp: hva dekker et bookingsystem egentlig, hva krever IT-avdelingen, og hva bør stå i kontrakten? Denne guiden svarer på «hva er»- og «hva bør»-spørsmålene en IT-leder stiller før anskaffelse, med en konkret sjekkliste du kan ta med inn i leverandørmøtet.\n\n## Hva er et digitalt bookingsystem for kommunale lokaler\n\nEt digitalt bookingsystem for kommunale lokaler er en programvare der innbyggere, lag og foreninger søker om eller reserverer tid i kommunens bygg, og der kommunen håndterer godkjenning, kalender, fakturering og nøkkeltilgang samme sted. Det erstatter en typisk manuell flyt med e-post, telefon og et delt regneark der dobbeltbookinger og glemte svar er regelen mer enn unntaket.\n\nKjernen består av fire deler: en offentlig søkeflate der brukeren finner ledig kapasitet, en saksbehandlerflate der kommunen godkjenner eller avviser, en kalender som viser faktisk belegg per lokale, og et integrasjonslag mot innlogging, fakturering og adgangskontroll. Et godt system samler fast utleie (sesongtildeling til idrettslag), engangsbooking (et bursdagsselskap i grendehuset) og interne reservasjoner (et møterom på rådhuset) i én kalender, slik at ingen tid blir booket to ganger.\n\n## Hvilke lokaltyper bør systemet dekke\n\nEn vanlig feil er å kjøpe et system som bare håndterer idrettshaller, for så å oppdage at kulturhuset og møterommene lever i egne løsninger. Da får du samme fragmentering du prøvde å bli kvitt. Systemet bør dekke hele porteføljen:\n\n- **Idrettshaller og gymsaler:** sesongtildeling til lag og foreninger, delbare flater (en håndballhall delt i tre baner), og booking utenom fast treningstid.\n- **Møterom:** korte reservasjoner, ofte interne, med behov for rask selvbetjening uten godkjenningsrunde.\n- **Kulturhus og scener:** lengre arrangementer med tekniske behov, rigg og nedrigg, og gjerne billettpris knyttet til leien.\n- **Selskapslokaler og grendehus:** engangsutleie til private, der depositum, renhold og nøkkelhenting må håndteres.\n- **Klasserom og aula:** kveldsbruk av skolebygg, som krever at booking respekterer skolens egen timeplan.\n\nPoenget er at samme motor skal håndtere ulike regler per lokaltype: et møterom kan bookes uten godkjenning, mens en gymsal krever at søkeren tilhører et registrert lag. En større bykommune som Trondheim kan ha godt over hundre utleibare enheter fordelt på idrett, kultur og skole, og de kan ikke leve i fem forskjellige verktøy.\n\n## Hva trenger de ulike brukergruppene\n\nFire grupper møter systemet, og de har motstridende behov. Balanserer du dem feil, blir enten innbyggeren frustrert eller saksbehandleren overarbeidet.\n\n### Innbygger\n\nInnbyggeren vil se ledig tid, booke og betale på under fem minutter, helst fra mobil, uten å ringe. De forventer å logge inn med noe de allerede har, ikke opprette enda et brukernavn og passord.\n\n### Lag og foreninger\n\nForeningene søker om fast treningstid for en hel sesong og trenger å se tildelingen sin samlet. De bør kunne ha flere kontaktpersoner, og systemet må vite hvilke lag som er registrert i kommunens frivillighetsregister slik at bare kvalifiserte søkere får subsidiert pris.\n\n### Saksbehandler\n\nSaksbehandleren trenger oversikt over innkommende søknader, mulighet til å godkjenne, avvise eller be om mer informasjon, og en logg over hva som ble bestemt og av hvem. Manuell oppfølging i innboksen er der tiden forsvinner.\n\n### Driftsleder\n\nDriftslederen bryr seg om det fysiske: hvem har nøkkel, er lokalet klargjort, og stemmer belegget med renholdsplanen. De trenger en dagsoversikt per bygg, ikke en søknadskø.\n\n## Hva krever IT-avdelingen: SSA-L, GDPR, datalokasjon og ID-porten\n\nHer ligger de kravene som avgjør om anskaffelsen i det hele tatt er lovlig og forsvarlig.\n\n**SSA-L og offentlige anskaffelseskrav.** Statens standardavtale for løpende tjenestekjøp (SSA-L) er malen de fleste kommuner bruker for SaaS. Leverandøren bør kunne levere på SSA-L uten omfattende særvilkår, og du bør sjekke at bilagene om tjenestenivå (SLA), behandling av personopplysninger og exit er utfylt konkret, ikke med tomme henvisninger. Ved kjøp over terskelverdi gjelder anskaffelsesregelverket fullt ut, så be om referanser fra sammenlignbare kommuner.\n\n**GDPR og datalokasjon i Norge.** Systemet behandler personopplysninger om innbyggere: navn, kontaktinfo, av og til betalingsdata. Du trenger en databehandleravtale, en oversikt over hvilke underleverandører som brukes, og klarhet i hvor dataene lagres. Mange kommuner setter som krav at data lagres innenfor EU/EØS, og flere foretrekker lagring i Norge. Etter Schrems II-avgjørelsen er overføring til USA en risiko du må dokumentere håndteringen av, så et system der hele datakjeden ligger i Norge fjerner et helt vurderingsspor.\n\n**ID-porten og BankID.** Innlogging bør skje via ID-porten, slik at innbyggeren bruker BankID eller MinID og kommunen slipper å forvalte passord. Det gir sikker autentisering, riktig identitet på søkeren og mindre support på glemte passord. For saksbehandlere bør systemet støtte pålogging via kommunens egen katalog (for eksempel Entra ID) med rollestyring.\n\nDigilist kjører på infrastruktur i Norge, leverer på SSA-L og bruker ID-porten for innbyggerpålogging, nettopp fordi disse tre punktene er der de fleste anskaffelser stopper opp.\n\n## Hva koster et bookingsystem, og hva påvirker prisen\n\nPrisen på kommunal SaaS varierer mer med omfang enn med leverandør. En liten kommune med noen få lokaler og enkel utleie ligger typisk i størrelsesorden 40 000 til 100 000 kroner i året, mens en større kommune med hundrevis av enheter, fakturaintegrasjon og adgangskontroll fort passerer flere hundre tusen. Modellen er som regel en av disse:\n\n- **Fast årslisens** basert på innbyggertall eller antall lokaler: forutsigbart, enkelt å budsjettere.\n- **Transaksjonsbasert:** en andel per booking eller betaling, som kan bli dyrt ved høyt volum.\n- **Moduloppdelt:** grunnpris pluss tillegg for fakturering, adgangskontroll eller integrasjoner.\n\nDet som virkelig påvirker totalen er ikke lisensen, men det rundt: engangskostnad for oppsett og datamigrering, integrasjoner mot økonomisystem og adgangskontroll, og internt tidsbruk ved innføring. Be alltid om en pris som inkluderer oppsett, opplæring og de integrasjonene du faktisk trenger, ikke bare listeprisen på lisensen.\n\n## Hva kjennetegner en god saksbehandlingsflyt fra søknad til godkjenning\n\nSelve grunnen til at kommunen kjøper systemet er at søknadene skal flyte uten manuelt rot. En god flyt har noen klare kjennetegn.\n\nSøknaden kommer inn med all nødvendig informasjon fra start, fordi skjemaet er tilpasset lokaltypen, så saksbehandleren slipper å be om ettersendelser. Systemet viser om ønsket tid faktisk er ledig før søknaden sendes, slik at unødvendige avslag unngås. Saksbehandleren kan godkjenne, avvise med begrunnelse, eller sette betingelser, og søkeren får automatisk beskjed uten at noen skriver e-post manuelt.\n\nVed sesongtildeling bør systemet støtte at flere søknader vurderes samlet mot samme kapasitet, ikke først-til-mølla, siden idrettstid ofte fordeles etter prioriteringsregler. Hver beslutning skal logges med hvem, når og hvorfor, både av hensyn til likebehandling og fordi avslag kan påklages. En god avvisningsflyt er like viktig som godkjenningen: søkeren skal forstå hvorfor, og gjerne få forslag til alternativ tid.\n\n## Hva bør du spørre leverandøren om før du signerer\n\nTa med denne listen inn i demoen og krev konkrete svar, ikke brosjyretekst:\n\n1. Leverer dere på SSA-L, og kan vi få se et utfylt bilag for personvern og tjenestenivå?\n2. Hvor lagres data, og hvilke underleverandører er involvert i kjeden?\n3. Støtter dere ID-porten for innbyggere og vår egen katalog for ansatte?\n4. Hvordan håndterer dere sesongtildeling med prioriteringsregler, ikke bare enkeltbooking?\n5. Hvilke integrasjoner mot økonomi- og adgangssystem har dere satt opp før, og hos hvem?\n6. Hva er den fulle prisen inkludert oppsett, migrering og opplæring det første året?\n7. Hva skjer med dataene våre hvis vi sier opp avtalen, og hvordan eksporteres de?\n8. Hvem svarer på support, i hvilke tider, og hva er responstiden i avtalen?\n\nSpørsmål 7 er den som oftest glemmes og oftest svir: uten en tydelig exit-klausul kan et bytte om fem år bli unødvendig dyrt.\n\n## Hva er vanlige fallgruver ved innføring i en kommune\n\nDe fleste mislykkede innføringer feiler ikke på teknologien, men på organiseringen.\n\n**For smalt innkjøp.** Kommunen kjøper til én sektor, for eksempel idrett, og lar kultur og skole fortsette i egne verktøy. Da består fragmenteringen, og ingen får den samlede kalenderen.\n\n**Ingen datavask før migrering.** Gamle lokaler, utgåtte lag og feil kontaktinfo dras med inn i det nye systemet. Rydd i porteføljen før, ikke etter.\n\n**Manglende intern eier.** Uten en ansvarlig som eier både konfigurasjon og opplæring, blir systemet halvt innført, og saksbehandlerne faller tilbake til e-post. Sett av tid hos en navngitt person, ikke bare hos leverandøren.\n\n**Undervurdert opplæring av foreninger.** Innbyggerne og lagene må faktisk ta i bruk selvbetjeningen. Lanser med enkel veiledning og en overgangsperiode, ellers ringer de fortsatt sentralbordet.\n\n**Glemte integrasjoner.** Fakturering og adgangskontroll settes opp «senere», og senere blir aldri. Avklar integrasjonene i anskaffelsen, ikke i drift.\n\n## Ta neste steg\n\nEn anskaffelse blir konkret først når du ser systemet håndtere dine egne lokaler, dine brukergrupper og dine krav til SSA-L, GDPR og ID-porten. Book en demo med Digilist, så viser vi hvordan idrettshaller, møterom, kulturhus og selskapslokaler samles i én kalender, med data i Norge og en saksbehandlingsflyt som holder fra søknad til godkjenning.';
const __vite_glob_0_7 = '---\nslug: bookingsystem-kommune-sammenligning-matrise-tco\ntitle: "Bookingsystem for kommunen: sammenligningsmatrise fremfor prisliste"\ndescription: "Slik sammenligner IT-lederen bookingsystemer på funksjon, sikkerhet og totalkostnad over fem år, og avdekker skjulte kostnader og kontraktsfeller før signering."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "IT-leder"\ncover: "/images/blog/ssal_2026_booking_hero.webp"\nkeywords: ["bookingsystem kommune sammenligning", "bookingsystem kommune pris 2026", "totalkostnad bookingsystem", "beste bookingsystem kommune", "referansesjekk leverandør", "demo pilotperiode bookingsystem"]\n---\n\nEn prisliste forteller deg hva lisensen koster, ikke hva systemet kommer til å koste. IT-lederen som velger bookingsystem etter laveste månedspris, oppdager ofte gapet først når integrasjonene skal på plass og saksbehandlerne trenger opplæring. Denne guiden gir deg en vektet sammenligningsmatrise, en femårig kostnadsmodell og spørsmålene som avslører hvilke leverandører som faktisk holder i drift.\n\n## Hvorfor en prisliste alene gir feil bilde av kostnaden\n\nLisensprisen er den synlige delen av regningen, og sjelden den største. En kommune med 40 utleieobjekter kan møte tre systemer med tilsynelatende lik månedspris, der det ene krever et separat integrasjonsprosjekt mot ID-porten til flere hundre tusen kroner, det andre fakturerer per innbygger som logger inn, og det tredje har alt inkludert.\n\nPrislisten skjuler typisk fire ting:\n\n- **Integrasjoner** mot ID-porten, økonomisystem og eventuelt folkeregister, ofte fakturert som konsulenttimer\n- **Implementering og konfigurasjon**, som kan ta alt fra en uke til flere måneder\n- **Opplæring** av saksbehandlere og driftspersonell, ofte per samling eller per dag\n- **Endringer underveis**, der nye objekttyper eller regler utløser nye timer\n\nTo leverandører med samme listepris kan derfor ende på svært ulik totalkostnad. Derfor bør sammenligningen starte med en matrise, ikke med et pristilbud.\n\n## Sammenligningsmatrisen: kriteriene som faktisk skiller leverandører\n\nEn brukbar matrise dekker fire hovedområder. Under hvert område scorer du hver leverandør fra 1 til 5, og ganger med vekten du setter i neste seksjon.\n\n### Funksjonalitet\n\nDekker systemet det kommunen faktisk skal booke ut? Se etter sanntidskalender uten nattlig oppdatering, støtte for både engangsleie og sesongtildeling, selvbetjent avbooking og refusjon, og en Min Side der innbyggeren finner alle bookinger, kvitteringer og meldinger samlet. Et system som håndterer møterom, men ikke sesongfordeling av idrettshaller, tvinger frem et parallelt verktøy.\n\n### Sikkerhet og samsvar\n\nHer er det ikke rom for skjønn. Krev norsk eller EØS-datalokasjon, ISO 27001-sertifisering, dokumentert penetrasjonstesting og phishing-resistent innlogging via ID-porten og BankID. Be om databehandleravtale og en oversikt over hvor data lagres, allerede i sammenligningsfasen.\n\n### Integrasjoner\n\nKartlegg hva som er standard og hva som er skreddersøm. ID-porten, Vipps, kort og EHF-faktura bør være ferdig integrert, ikke et prosjekt. Spør konkret: er integrasjonen inkludert i lisensen, eller faktureres den per oppsett?\n\n### Drift og support\n\nHvem svarer når hallen ikke lar seg booke en fredag ettermiddag? Se på responstid, om support er på norsk, og om leverandøren leverer realtime-varsler slik at driften fanger problemer før innbyggeren ringer.\n\n## Slik vekter du kriteriene etter hva kommunen faktisk skal booke ut\n\nMatrisen blir først nyttig når vektene speiler kommunens virkelighet. En kommune som primært leier ut idrettshaller til lag og foreninger, har andre behov enn en som booker møterom internt.\n\nEt vektet eksempel for en kommune med tung idrettsutleie:\n\n- Funksjonalitet: 30 %\n- Sikkerhet og samsvar: 25 %\n- Integrasjoner: 25 %\n- Drift og support: 20 %\n\nSkal systemet derimot brukes til intern møteromsbooking med få eksterne brukere, kan integrasjoner mot Vipps veie lettere, mens funksjonalitet for gjentakende bookinger veier tyngre. Poenget er å bestemme vektene før du ser tilbudene, ikke etterpå. Da unngår du å justere kriteriene for å passe leverandøren du allerede liker.\n\nRegn ut vektet score per leverandør, og bruk den som utgangspunkt for totalkostnaden. Et system som scorer 4,6 mot et som scorer 3,1, kan forsvare en høyere pris, mens to jevne kandidater bør skilles på kostnad og kontraktsvilkår.\n\n## Totalkostnad over fem år: lisens, implementering, integrasjoner og opplæring\n\nTotalkostnad, eller TCO, er summen av alt kommunen betaler i kontraktsperioden, ikke bare lisensen. En femårshorisont fanger opp kostnader som forsvinner i et førsteårsbudsjett.\n\nFire poster å legge inn:\n\n1. **Lisens** over fem år, med eventuell årlig indeksregulering\n2. **Implementering og konfigurasjon** som en engangskostnad\n3. **Integrasjoner** mot ID-porten, økonomisystem og betaling\n4. **Opplæring og endringer** både ved oppstart og løpende\n\nEt illustrerende regnestykke: to systemer til 6 000 kroner i måneden gir samme lisenskostnad på 360 000 kroner over fem år. Legger det ene til 150 000 i integrasjon og 60 000 i opplæring, mens det andre har begge deler inkludert, er den reelle forskjellen 210 000 kroner, uten at listeprisen avslørte det. En leverandør med ferdige integrasjoner og selvbetjent oppsett kan koste mer per måned, men mindre totalt.\n\nBe alltid om at tilbudet spesifiserer hva som er inkludert i lisensen, og hva som faktureres separat. Er svaret uklart, er det i seg selv et signal.\n\n## Demo og pilotperiode: spørsmålene som avslører om systemet holder i drift\n\nEn polert demo viser hva systemet kan i beste fall. En pilot viser hva det gjør på en travel tirsdag. Be om begge deler, og styr demoen selv med kommunens egne scenarier.\n\nSpørsmål som avslører drift fremfor salg:\n\n- Kan dere vise at en dobbeltbooking blir avvist i sanntid, ikke etter nattlig synk?\n- Hvordan ser saksbehandlerens flyt ut når en søknad skal godkjennes, avvises og kommuniseres?\n- Hva skjer når en innbygger avbooker, og hvordan utløses refusjonen automatisk?\n- Hvordan logger en innbygger uten BankID seg inn?\n\nEn pilot bør vare minst to til fire uker og involvere ekte saksbehandlere og minst ett reelt utleieobjekt. Mål på konkrete tall: hvor lang tid tar en booking fra innbyggerens side, og hvor mange klikk krever en godkjenning? Digilist lar innbyggeren fullføre en booking på rundt 90 sekunder, og det er den typen målbare størrelser en pilot skal etterprøve, ikke bare bekrefte at knappene finnes.\n\n## Referansesjekk: hva du bør spørre andre kommuner om før du velger\n\nEn referanse leverandøren selv oppgir, er valgt fordi den er fornøyd. Det gjør den fortsatt nyttig, hvis du stiller de riktige spørsmålene og gjerne finner en referanse på egen hånd i tillegg.\n\nSpør en kommune som allerede bruker systemet:\n\n- Hvor lang tid tok det fra signering til dere var i full drift?\n- Traff implementeringsbudsjettet, eller kom det kostnader dere ikke forutså?\n- Hvordan er supporten når noe haster?\n- Hva ville dere gjort annerledes i anskaffelsen?\n- Hvor ofte er systemet utilgjengelig, og hvordan varsles dere?\n\nEn kommune som Lillestrøm eller en nabo på egen størrelse gir mer relevant innsikt enn en referanse fra en helt annen kommunetype. Er systemets håndtering av sesongtildeling viktig for dere, finn en referanse som faktisk bruker den funksjonen, ikke bare møteromsbooking.\n\n## Kontraktsfeller: bindingstid, datauttrekk ved bytte og SLA\n\nKontrakten avgjør hvor fritt du står om tre år. Tre punkter fortjener ekstra oppmerksomhet før signering.\n\n**Bindingstid.** Lang binding kan gi lavere pris, men låser deg til en leverandør du ennå ikke har sett i full drift. Vurder en kortere førsteperiode med opsjon på forlengelse.\n\n**Datauttrekk ved bytte.** Eier kommunen sine data, og får du dem ut i et brukbart format uten ekstra kostnad? En leverandør som tar seg betalt for eksport, eller leverer data i et lukket format, gjør et fremtidig bytte dyrt med vilje. Krev eksportklausul i standardformat.\n\n**SLA.** Serviceavtalen skal tallfeste oppetid, for eksempel 99,5 til 99,9 prosent, responstid ved kritiske feil, og hva som skjer om leverandøren ikke leverer. En SLA uten konsekvenser er en intensjon, ikke en garanti.\n\nFor kommuner er SSA-L, Statens standardavtale for løpende tjenestekjøp, et naturlig rammeverk å legge til grunn i 2026. Det gir et felles språk for nettopp disse punktene.\n\n## Sammenligningstabell: Digilist mot tradisjonelle leverandører\n\nTabellen under oppsummerer forskjellene en kommune typisk møter når den sammenligner en samlet plattform med tradisjonelle løsninger som ofte krever separate moduler og prosjekter.\n\n| Kriterium | Digilist | Tradisjonell leverandør |\n| --- | --- | --- |\n| Sanntidskalender | Ja, umiddelbar | Ofte nattlig oppdatering |\n| ID-porten og BankID | Inkludert | Ofte separat prosjekt |\n| Betaling (Vipps, kort, EHF) | Ferdig integrert | Modul eller tillegg |\n| Datalokasjon | Norge/EØS | Varierer |\n| Sesong og engangsleie | Samme plattform | Ofte to systemer |\n| Tid til live | Rundt en uke | Uker til måneder |\n| Datauttrekk ved bytte | Standardformat | Varierer, kan koste |\n\nTabellen er et utgangspunkt, ikke en fasit. Fyll den med tallene fra dine egne tilbud og din egen pilot, og la den vektede matrisen avgjøre.\n\n## Book en demo og test matrisen på ekte data\n\nDen beste sammenligningen kjører du på kommunens egne objekter, ikke på en generisk demokonto. Book en demo av Digilist, så setter vi opp et reelt scenario fra din kommune, viser sanntidskalender, ID-porten-innlogging og refusjonsflyt, og gir deg tallene du trenger for å fylle inn totalkostnaden over fem år. Da sammenligner du på fakta, ikke på prisliste.';
const __vite_glob_0_8 = '---\nslug: bryllupslokale-kommune-krav-kapasitet-sammenligning\ntitle: "Bryllupslokale i kommunen: sjekk krav og kapasitet før du booker dato"\ndescription: "Gjestekapasitet, kjøkken, skjenkebevilling, lyd og tilgjengelighet varierer mellom lokaler. Slik sammenligner du flere bryllupslokaler på reelle behov, ikke bare pris."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["bryllupslokale kommune", "bryllupslokale kapasitet", "skjenkebevilling bryllupslokale", "bryllupslokale kjøkken catering", "sammenligne bryllupslokaler", "bryllupslokale depositum avbestilling"]\n---\n\nDe fleste par starter med prisen. Men et bryllupslokale som er billig og ledig hjelper lite hvis det bare tar 60 gjester, mangler kjøkken eller stenger musikken klokka 23. Prisen forteller deg hva lokalet koster, ikke om det passer bryllupet dere planlegger. I Digilist ser du kravene og begrensningene til hvert lokale side om side i søket, slik at dere kan sammenligne på det som faktisk avgjør dagen.\n\n## Hvilke krav bør du sjekke før du velger bryllupslokale i kommunen\n\nFør dere låser en dato langt frem i tid, gå gjennom disse punktene for hvert aktuelle lokale:\n\n- Maks gjestekapasitet med bordoppsett\n- Eget kjøkken eller krav om ekstern catering\n- Om skjenkebevilling er inkludert eller må søkes\n- Ryddetid og tilgang dagen før og etter\n- Universell utforming og parkering\n- Lydgrense og sluttidspunkt for musikk\n- Depositum og avbestillingsvilkår\n\nI Digilist står disse feltene på hvert lokale, så dere slipper å ringe rundt for å få svar ett og ett. Har dere svaret på alle sju punktene før dere booker, unngår dere de vanligste overraskelsene tett opp mot dagen.\n\n## Gjestekapasitet: finn lokaler som passer antallet dere inviterer\n\nEt lokale som rommer 150 stående kan bli trangt med 90 sittende ved langbord. Digilist viser kapasitet for ulike oppsett, ikke bare ett tall. Filtrer på antall gjester først, så faller lokaler som er for små bort før dere bruker tid på dem. Skal dere være 110 til middag, ser dere med én gang at en kultursal for 130 sittende passer, mens et møterom for 70 ikke gjør det.\n\nHusk at bord ikke er alt som skal få plass. Dansegulv, buffetbord, gavebord, DJ eller band og et hjørne til de minste gjestene spiser fort opp kvadratmeterne. En tommelfingerregel er å legge på 15 til 20 prosent buffer over antallet sitteplasser dere trenger, slik at rommet ikke blir stappfullt når kvelden går over i fest. Kapasitetstallene i Digilist er oppgitt per oppsett, så dere kan se hva salen tar med langbord, runde bord og stående mingling hver for seg.\n\n## Kjøkken og catering: eget kjøkken eller ekstern leverandør\n\nKjøkkenløsning avgjør både budsjett og logistikk. Grovt sett finnes tre typer:\n\n- **Fullt kjøkken:** oppvarming, kjøl og oppvask på stedet, egnet for varm servering\n- **Anretningskjøkken:** plass til å sette frem mat levert utenfra, men ikke tilberede\n- **Ingen kjøkkenfasiliteter:** all mat og servering må håndteres av ekstern cateringleverandør\n\nDigilist merker hvert lokale med kjøkkentype, så dere vet om cateringfirmaet kan lage mat på stedet eller må levere ferdig. Spør også om oppvaskkapasitet og strøm: et kjøkken uten industrioppvaskmaskin betyr håndoppvask for over hundre kuverter, og for få stikkontakter kan gjøre det vanskelig å holde varmen på flere retter samtidig. Mange cateringfirmaer prissetter oppdraget etter hva kjøkkenet tillater, så kjøkkentypen påvirker sluttregningen mer enn de fleste tror.\n\n## Skjenkebevilling og alkohol: hva lokalet tillater\n\nKommunale lokaler har ulike regler. Noen har fast skjenkebevilling knyttet til huset, mens andre krever at dere søker kommunen om bevilling for en enkelt anledning. En slik søknad tar ofte to til fire uker å behandle, så dette må avklares tidlig. Flere kommuner krever i tillegg at det utpekes en ansvarlig skjenkeansvarlig for kvelden, og noen ber om at vedkommende har bestått kunnskapsprøven i alkoholloven. Digilist viser om lokalet tillater alkohol, om bevilling følger med, og lenker til søknadsskjema der dere selv må søke. Da unngår dere å oppdage to uker før bryllupet at baren ikke er lov.\n\n## Dekorasjon, oppussing og ryddetid\n\nSelve dagen er sjelden problemet. Det er timene før og etter. Får dere pynte kvelden i forveien, eller først samme morgen? Må lokalet være ryddet og vasket innen midnatt, eller kan dere rydde dagen etter? Dette avgjør om dere rekker å henge opp lys, dekke bord og sette ut blomster i ro, eller om alt må skje i all hast før gjestene kommer. Digilist viser tilgjengelig tid før og etter arrangementet, for eksempel fire timer rigg dagen før og to timer opprydding etter. Book gjerne tilstøtende timeslot til pynting samtidig som dere booker selve datoen, så er riggetiden sikret og ikke avhengig av at neste leietaker ikke kommer.\n\n## Tilgjengelighet og parkering\n\nHar dere gjester som bruker rullestol, kommer langveisfra eller har med barnevogn, er adkomst viktig. Digilist viser om lokalet har trinnfri inngang, HC-toalett, heis og antall parkeringsplasser. Et lokale i Lillestrøm kommune med 40 gjesteparkeringer og trinnfri adkomst er noe helt annet enn en gammel forsamlingssal med bratt trapp og gateparkering. Tenk også på gjester som skal overnatte: nær offentlig transport eller kort vei til hotell gjør kvelden enklere for dem som ikke kan kjøre hjem. Se dette før dere sender ut invitasjonene, slik at dere kan gi tydelig praktisk informasjon med én gang.\n\n## Lydnivå, naboer og tidsbegrensninger\n\nFest utover kvelden er ofte det som skaper konflikt. Mange kommunale lokaler har en lydgrense og et fast sluttidspunkt for musikk, typisk klokka 23 på hverdager og 01 i helg, av hensyn til naboer. Ligger lokalet vegg i vegg med boliger, kan grensene være strengere, og enkelte steder har fast lydanlegg med innebygd grense som ikke kan skrus høyere. Digilist viser sluttidspunkt for musikk og eventuell lydgrense per lokale, så dere kan velge et sted der festen får vare like lenge som dere ønsker, uten at noen må avbryte dansen midt i kvelden.\n\n## Slik sammenligner du flere bryllupslokaler samtidig\n\nI stedet for å vurdere ett lokale av gangen, setter Digilist kapasitet, kjøkken, bevilling, tilgjengelighet og lydgrense opp mot hverandre i samme visning. Dere filtrerer på behovene deres, ser hvilke lokaler som oppfyller dem, sjekker ledige datoer i sanntid og booker den datoen som passer. Ettertraktede lørdager i juni og august fylles ofte 12 til 18 måneder i forveien, så det lønner seg å sammenligne og reservere i god tid. Da slipper dere også å velge nummer to fordi drømmedatoen allerede var tatt da dere endelig hadde bestemt dere.\n\n## Depositum, avbestilling og hva som skjer hvis bryllupet flyttes\n\nLes vilkårene før dere signerer. Digilist viser depositum, for eksempel 5 000 kroner, og avbestillingsfrister per lokale: full refusjon ved avbestilling mer enn 60 dager før, delvis ved 30 til 60 dager, og ingen refusjon tettere på. Skal dere flytte datoen, ser dere med én gang om lokalet tillater ombooking og til hvilke betingelser, for eksempel et administrasjonsgebyr på noen hundrelapper mot å slippe å miste hele depositumet. Alt står skriftlig i bookingen, så dere vet nøyaktig hva som gjelder hvis planene endres.\n\n## Sammenlign på reelle behov, ikke bare pris\n\nVil dere se hvordan par sammenligner bryllupslokaler på kapasitet, kjøkken, bevilling og lyd i samme søk, og booker riktig dato i god tid? [Book en demo](https://digilist.no/demo) av Digilist, så viser vi hvordan lokalene i deres kommune fremstår side om side.';
const __vite_glob_0_9 = '---\nslug: bryllupslokale-kommune-pris-guide-innbygger\ntitle: "Bryllupslokale i kommunen: pris, booking og krav forklart"\ndescription: "Hva koster et kommunalt bryllupslokale, hva er inkludert, og hvordan booker du ledig dato uten å ringe rundt? Full guide for brudepar."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["bryllupslokale kommune pris", "leie bryllupslokale kommunalt", "booke bryllupslokale online", "depositum bryllupslokale", "skjenkebevilling leietaker", "kapasitet kommunale lokaler"]\n---\n\nKommunen sitter på noen av de fineste festlokalene i landet: kulturhus med scene, gamle rådhussaler og forsamlingshus med utsikt. Problemet er sjelden lokalet, men prisen du ikke får se før du har ringt tre avdelinger og ventet på tilbud. Denne guiden samler alt du trenger å vite om pris, booking, depositum og krav, slik at du kan velge lokale med åpne øyne.\n\n## Hva koster et bryllupslokale i kommunen? Prisspenn og hva som påvirker prisen\n\nPrisen på et kommunalt bryllupslokale varierer mer enn folk tror, men den holder seg som regel innenfor et gjenkjennelig spenn. Et lite forsamlingshus på bygda koster ofte 1 500 til 4 000 kroner for en helg. En sal i et kulturhus ligger typisk mellom 6 000 og 18 000 kroner, avhengig av størrelse og om du trenger scene, lyd og lys. Selve vielsen i en rådhussal er i mange kommuner gratis for innbyggere på faste dager, mens vigsel utenom åpningstid kan koste et gebyr på 2 000 til 5 000 kroner.\n\nFire faktorer driver prisen:\n\n- **Dag og tidspunkt:** lørdag i juni koster mer enn en tirsdag i november.\n- **Om du er innbygger i kommunen:** mange kommuner har egen sats for egne innbyggere og en høyere sats for eksterne.\n- **Formål:** private fester prises ofte høyere enn lag- og foreningsbruk.\n- **Tilleggstjenester:** renhold, teknisk vakt og ekstra møblering legges på grunnleien.\n\nPoenget er at grunnleien sjelden er hele bildet. Be alltid om totalprisen inkludert renhold og eventuell vaktordning før du sammenligner to lokaler.\n\n## Kommunalt vs. privat bryllupslokale: forskjeller i pris, tilgjengelighet og krav\n\nEt privat selskapslokale eller en hotellsal tar gjerne 40 000 til 120 000 kroner for et bryllup med bespisning, ofte med krav om at du bruker husets catering. Et kommunalt lokale gir deg rå kvadratmeter til en brøkdel av prisen, men til gjengjeld må du organisere mer selv: mat, servering, pynt og opprydding.\n\n| Forhold | Kommunalt lokale | Privat lokale |\n| --- | --- | --- |\n| Pris | Lav grunnleie, du organiserer resten | Høyere, ofte pakke med mat |\n| Catering | Fritt valg av leverandør | Ofte bundet til huset |\n| Fleksibilitet | Du styrer dag og opplegg | Bundet av husets rutiner |\n| Tilgjengelighet | Kan være bookbart lenge i forveien | Populære datoer fylles tidlig |\n\nDen viktigste forskjellen i praksis er informasjonstilgangen. Et privat lokale har som regel en salgsavdeling som svarer raskt. På kommunal side har prisliste og kalender historisk vært spredt på ulike avdelinger. Der Digilist er tatt i bruk, ser du pris og ledige datoer i sanntid uten å ringe.\n\n## Slik sjekker du ledige datoer og booker bryllupslokale i kommunen\n\nDen gamle måten er kjent for de fleste: du finner et telefonnummer på kommunens nettside, legger igjen beskjed, og venter på at noen ringer tilbake for å sjekke en fysisk kalender. To brudepar kan spørre om samme dato samme uke uten at noen vet om det andre.\n\nI en digital bookingløsning gjør du dette selv, på minutter:\n\n1. Søk opp lokalet og velg dato i kalenderen.\n2. Se om datoen er grønn (ledig) eller opptatt, oppdatert i sanntid.\n3. Logg inn med BankID og fyll inn formål og antall gjester.\n4. Send forespørsel eller book direkte, avhengig av om lokalet krever godkjenning.\n\nDer Digilist er tatt i bruk, er denne typen selvbetjening blitt den vanlige måten å booke kommunale lokaler på. Du slipper å gjette, og du får en skriftlig bekreftelse med en gang forespørselen er registrert. Vil du booke bryllupslokale online utenom kontortid, er det nettopp derfor sanntidskalenderen er avgjørende: den viser hva som faktisk er ledig i det øyeblikket du ser på skjermen.\n\n## Depositum, avbestilling og refusjon: hva du må vite før du signerer\n\nFør du signerer, les vilkårene for depositum og avbestilling nøye. Dette er punktene som oftest skaper overraskelser.\n\nMange kommuner krever et depositum på 2 000 til 5 000 kroner, som holdes tilbake til lokalet er levert rengjort og uten skader. Depositumet er ikke en ekstra kostnad hvis alt er i orden, men det bindes opp i perioden rundt arrangementet.\n\nFor avbestilling er trappetrinn vanlig. Et typisk oppsett kan se slik ut:\n\n- Avbestilling mer enn 90 dager før: full refusjon minus et administrasjonsgebyr.\n- 30 til 90 dager før: halv leie refunderes.\n- Mindre enn 30 dager før: ingen refusjon.\n\nSjekk også hvordan refusjonen faktisk utbetales. I en digital løsning kobles avbestilling og tilbakebetaling sammen automatisk, slik at pengene går tilbake til samme betalingsmåte uten at du må sende en egen søknad. Uansett system: ta vare på den skriftlige bekreftelsen, den er ditt bevis på hvilke vilkår som gjaldt da du booket.\n\n## Krav til leietaker: skjenkebevilling, brannvern og maks antall gjester\n\nSom leietaker har du et ansvar som går utover å betale leien. Tre krav går igjen.\n\n**Skjenkebevilling.** Skal du servere alkohol mot betaling, trengs skjenkebevilling. For et privat bryllup der du selv holder drikke uten salg, kreves det som regel ikke bevilling, men skal en cateringleverandør selge alkohol, må det søkes om ambulerende skjenkebevilling hos kommunen. Søknadsfristen er ofte to til fire uker, så vær tidlig ute.\n\n**Brannvern.** Lokalet har et maksimalt personantall fastsatt av brannforskriften. Du er ansvarlig for at antall gjester ikke overstiger dette, at rømningsveier holdes frie, og at du vet hvor slukkeutstyr og nødutganger er.\n\n**Ro og orden.** De fleste leieavtaler har regler for musikk etter et bestemt klokkeslett og for hvordan lokalet skal forlates. Brudd kan gå ut over depositumet.\n\nDisse kravene bør stå tydelig i leievilkårene. Er de samlet i selve bookingflyten, slipper du å lete i separate PDF-er.\n\n## Hva er inkludert i leieprisen: rydding, catering, bord og stoler\n\nDet store spørsmålet før du regner på budsjettet: hva er inkludert i leieprisen? Svaret varierer, og det er her totalkostnaden avgjøres.\n\nDet som ofte er inkludert:\n\n- Bord og stoler til oppgitt kapasitet.\n- Grunnbelysning og oppvarming.\n- Tilgang til kjøkken eller anretning.\n- Toaletter og garderobe.\n\nDet som ofte kommer i tillegg:\n\n- **Renhold:** enten et fast gebyr på 1 500 til 3 500 kroner, eller krav om at du rydder og vasker selv.\n- **Catering:** kommunale lokaler har sjelden egen matservering, du leier inn selv.\n- **Teknisk utstyr:** projektor, lydanlegg og scenelys kan koste ekstra.\n- **Vakt:** enkelte lokaler krever en teknisk vakt til stede ved store arrangementer.\n\nBe om en spesifisert liste. Et lokale til 6 000 kroner med renhold og teknikk inkludert kan være billigere enn et til 4 000 der du betaler 3 000 for vask på toppen.\n\n## Populære kommunale bryllupslokaler: kulturhus, rådhus og forsamlingshus sammenlignet\n\nDe tre vanligste typene kommunale bryllupslokaler passer til ulike bryllup.\n\n**Rådhussal eller vigselsrom** brukes til selve vielsen. De er ofte vakre og sentrale, gjerne gratis eller rimelige for innbyggere, men de tar begrenset antall gjester og egner seg sjelden til fest etterpå.\n\n**Kulturhus** har størst kapasitet, ofte 100 til 300 personer, med scene, garderobe og profesjonelt lydanlegg. De egner seg for store bryllup med tale og musikk, men er de dyreste kommunale alternativene.\n\n**Forsamlingshus og grendehus** er de rimeligste og mest fleksible. Kapasiteten ligger gjerne på 40 til 120 gjester, og du styrer opplegget selv. De er populære nettopp fordi de gir en personlig ramme til lav pris.\n\nKapasitet er avgjørende: brannforskriften setter en hard grense, og et lokale for 80 personer rommer ikke 110 uansett hvor godt du planlegger. Sjekk maks antall gjester før du sender ut invitasjoner.\n\n## Slik unngår du doble bookinger og overraskelser på bryllupsdagen\n\nMareritt-scenarioet er kjent: to par får bekreftet samme lørdag fordi to saksbehandlere jobbet mot hver sin kalender. Med papirskjema og telefon skjer det oftere enn kommunen liker å innrømme.\n\nEn sanntidsløsning fjerner risikoen fordi lokalet låses i samme øyeblikk en dato bekreftes. Ingen andre kan booke den samme datoen etterpå. I tillegg samles hele avtalen ett sted: pris, vilkår, betalingsbekreftelse, meldinger med saksbehandler og eventuell avbestilling. Da vet begge parter nøyaktig hva som er avtalt.\n\nFor deg som brudepar betyr det tre ting: du ser at datoen er din, du har alt skriftlig, og du får varsel hvis noe endres. Det er forskjellen på å håpe at bookingen gikk gjennom og å vite det.\n\n## Book bryllupslokale uten å ringe rundt\n\nKommunale bryllupslokaler gir mye ramme for pengene, men bare hvis du får se pris og tilgjengelighet før du binder deg. Digilist samler prisliste, sanntidskalender, vilkår og betaling i én flyt, slik at innbyggeren booker selv i stedet for å vente på tilbud fra flere avdelinger.\n\nVil du se hvordan kommunen kan tilby dette til brudepar? [Book en demo](https://digilist.no/demo) og se den innbyggervennlige bookingflyten fra ledig dato til bekreftet leie.';
const __vite_glob_0_10 = '---\nslug: bryllupslokale-kommune-pris-leie-booking\ntitle: "Bryllupslokale i kommunen: pris, kapasitet og booking på nett"\ndescription: "Hva koster et kommunalt bryllupslokale, hva er inkludert, og hvordan booker du på nett med depositum og dato synlig før du betaler? Full guide."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["bryllupslokale kommune pris", "leie bryllupslokale kommune", "billig bryllupslokale", "book bryllupslokale online", "depositum bryllupslokale", "bryllupslokale kapasitet"]\n---\n\nÅ leie bryllupslokale hos kommunen betyr ofte telefonrunder, e-poster som ikke blir besvart og prislister du må be om. Det trenger det ikke være. Prisen på et kommunalt lokale er offentlig informasjon, og de beste kommunene lar deg se ledig dato, pris, depositum og hva som er inkludert før du bekrefter. Denne guiden går gjennom hva du kan leie, hva det koster, og hvordan du sikrer datoen uten å ringe en eneste gang.\n\n## Hva er et kommunalt bryllupslokale, og hvem kan leie det\n\nEt kommunalt bryllupslokale er et bygg kommunen eier og leier ut til private arrangementer: kulturhus, forsamlingshus, festsaler, grendehus og gymsaler. Mange kommuner har en egen sats for privat leie ved siden av satsen for lag og foreninger.\n\nSom privatperson kan du som regel leie disse lokalene til bryllup, jubileum, konfirmasjon eller minnesamvær. Du trenger ikke å drive organisasjon. Noen kommuner prioriterer egne innbyggere eller gir dem lavere pris, mens andre leier ut til alle uten bostedskrav. Kravene står i kommunens utleiereglement, og i en digital løsning ligger de synlig i selve bookingflyten i stedet for i et PDF-vedlegg du må lete etter.\n\nAldersgrense for å stå som ansvarlig leietaker er ofte 18 eller 20 år. Den som booker, blir ansvarlig for lokalet, nøkkel og eventuelle skader.\n\n## Hva koster et bryllupslokale hos kommunen\n\nPrisen varierer mye mellom kommuner og lokaltyper, men den følger noen faste modeller. De vanligste er:\n\n- **Døgnpris eller helgepris:** en fast sum for hele arrangementet, typisk fra 3 000 til 12 000 kroner for et forsamlingshus eller kulturhussal, avhengig av størrelse og standard.\n- **Timepris:** brukes oftere for mindre møterom og gymsaler, gjerne 300 til 800 kroner timen, som fort blir dyrere enn en døgnpris for et helt bryllup.\n- **Pakkepris:** lokalet pluss oppdekking, kjøkken og rengjøring samlet i én sum.\n\nFaktorene som avgjør hvor du havner på skalaen:\n\n- **Størrelse og kapasitet:** en festsal for 150 gjester koster mer enn en grendehussal for 60.\n- **Sesong og ukedag:** lørdag i høysesong mai til september er dyrest, en fredag i november er billigst.\n- **Egen kommune eller ikke:** noen kommuner tar høyere sats for tilreisende.\n- **Rengjøring:** enten inkludert i prisen, eller et tillegg på 1 000 til 3 000 kroner hvis du ikke vasker selv.\n\nVil du finne et **billig bryllupslokale**, ligger de beste kjøpene ofte i grendehus og forsamlingshus utenfor de største byene, der en hel helg kan koste under 5 000 kroner. Poenget er at du skal kunne se totalen, inkludert depositum og tillegg, før du binder deg, ikke få den på faktura etterpå.\n\n## Slik finner og booker du bryllupslokale på nett\n\nI en moderne kommunal løsning gjør du hele jobben selv, uten telefon eller skjema:\n\n1. Åpne kommunens bookingside og velg lokaltype og dato.\n2. Se en sanntidskalender med ledige datoer. Er 6. juni opptatt, ser du det med en gang og slipper å sende en forespørsel som blir avvist.\n3. Klikk på lokalet og les kapasitet, pris, depositum og hva som er inkludert.\n4. Logg inn med BankID eller ID-porten, så kommunen vet hvem som booker.\n5. Bekreft, betal depositum og få kvittering på e-post og på Min Side.\n\nForskjellen på «oppdateres hver natt» og ekte sanntid er stor når du jager en populær lørdag. Med en kalender som viser status i øyeblikket, risikerer du ikke å booke en dato som ble tatt for to timer siden. Du kan **booke bryllupslokale online** hele døgnet, ikke bare i kommunens åpningstid.\n\n## Hva er inkludert i leieprisen\n\nDet viktigste å avklare før du sammenligner priser er hva som faktisk følger med. To lokaler til samme pris kan være svært ulike når du regner inn hva du må leie i tillegg.\n\nSjekk om leien inkluderer:\n\n- **Bord og stoler** til det antallet gjester lokalet er godkjent for.\n- **Kjøkken** med komfyr, ovn, oppvaskmaskin, kjøleskap og fryser.\n- **Servise, glass og bestikk**, eller om du må ta med eget.\n- **Lyd- og lysanlegg**, projektor eller scene til taler og musikk.\n- **Garderobe, toaletter og universell utforming** slik at alle gjester kommer inn.\n- **Strøm og oppvarming** utenom vanlig åpningstid.\n\nI en god digital løsning står dette som en punktliste på lokalets side, ikke som noe du må ringe og spørre om. Da ser du raskt at et forsamlingshus til 4 500 kroner med kjøkken og servise kan være rimeligere enn en «billigere» sal der du må leie inn alt selv.\n\n## Depositum, avbestilling og refusjon\n\nDepositum er en sikkerhet kommunen holder tilbake mot skade og manglende rengjøring, ofte mellom 1 000 og 5 000 kroner. Beløpet betales ved booking og tilbakebetales etter arrangementet hvis lokalet leveres rent og uskadd.\n\nReglene for avbestilling bør du lese før du betaler, for et bryllup kan bli flyttet. Typiske vilkår ser slik ut:\n\n- **Avbestilling god tid før, for eksempel mer enn 60 dager:** full refusjon eller et lite gebyr.\n- **Avbestilling nærmere datoen, 14 til 60 dager:** deler av leien beholdes.\n- **Avbestilling tett på, under 14 dager:** hele leien kan gå tapt, men depositum refunderes hvis lokalet ikke ble brukt.\n\nSkal du flytte datoen i stedet for å avlyse, tillater mange kommuner ombooking til en ny ledig dato uten ny full betaling. I en digital løsning ser du avbestillingsreglene i bookingflyten, og refusjon behandles automatisk mot samme betalingskort eller konto, i stedet for at en saksbehandler må regne det ut manuelt. Det gjør at pengene kommer raskere tilbake, og at du vet vilkårene før du bekrefter.\n\n## Kapasitet og lokaltyper sammenlignet\n\nRiktig lokale handler like mye om antall gjester som om pris. Her er de vanligste typene og hva de passer til:\n\n- **Grendehus og forsamlingshus:** 40 til 100 gjester. Hjemmekoselig, ofte med kjøkken, og gjerne det rimeligste alternativet.\n- **Kulturhus og festsal:** 80 til 250 gjester. Høyere standard, scene, lyd og lys, egnet for større bryllup med taler og band.\n- **Gymsal og flerbrukshall:** 100 til 300 gjester. Mye plass til lav pris, men du må ofte ta med pynt, bord og oppdekking selv, og akustikken krever lydanlegg.\n- **Rådhus og seremonirom:** for selve vielsen, med plass til nære gjester, ofte gratis eller til lav sats for borgerlig vigsel.\n\nVelger du mellom **gymsal eller kulturhus**, er avveiningen enkel: gymsalen gir mest kvadratmeter per krone, kulturhuset gir minst arbeid og best ramme. Kapasitetstallet kommunen oppgir er et godkjent maksantall av branntekniske hensyn, så bruk det som en reell grense, ikke en anbefaling.\n\n## Kommunalt bryllupslokale mot privat leverandør\n\nEt privat selskapslokale, en låve eller et hotell koster ofte fra 15 000 til 40 000 kroner for helgen, og da er mat og drikke gjerne i tillegg. Til gjengjeld får du personale, oppdekking og rydding inkludert.\n\nEt kommunalt lokale koster typisk en brøkdel, men forutsetter at du organiserer mer selv: pynt, catering eller egen mat, oppdekking og som regel rengjøring. For mange par er dette et bevisst bytte. Du sparer titusener og får full frihet til å forme dagen, mot at du legger inn noen timers egeninnsats. Vil du ha mest fest for pengene, vinner kommunen. Vil du slippe alt praktisk, betaler du for det privat. Det viktigste er at du kan sammenligne på like vilkår, og det krever at den kommunale prisen og innholdet er synlig på nett fra start.\n\n## Slik sikrer du ønsket dato i god tid\n\nPopulære lørdager i mai til september blir tatt tidlig, ofte 6 til 12 måneder i forveien. Slik står du sterkest:\n\n- **Book så tidlig kalenderen åpner.** Mange kommuner åpner booking et fast antall måneder frem, for eksempel 12 måneder.\n- **Bruk sanntidskalenderen** til å se ledige datoer med en gang, i stedet for å sende en forespørsel og vente på svar.\n- **Bekreft med en gang** ved å betale depositum, slik at datoen er reelt reservert og ikke bare foreløpig holdt.\n- **Sett opp varsel** om lokalet er opptatt, så du får beskjed hvis en dato blir ledig etter en avbestilling.\n\nMed bekreftelse og betaling i samme flyt slipper du usikkerheten om «har jeg egentlig fått lokalet». Tildelingen er synlig på Min Side i samme øyeblikk, med kvittering du kan vise frem.\n\n## Sjekkliste før du booker bryllupslokale i kommunen\n\nGå gjennom disse punktene før du bekrefter:\n\n- Er datoen ledig i sanntid, og kan jeg bekrefte den nå?\n- Hva er totalprisen, inkludert rengjøring og eventuelle tillegg?\n- Hvor stort er depositumet, og når får jeg det tilbake?\n- Hva er avbestillingsreglene hvis datoen må flyttes?\n- Hvor mange gjester er lokalet godkjent for?\n- Er bord, stoler, kjøkken, servise og lydanlegg inkludert?\n- Må jeg vaske selv, eller er rengjøring en del av prisen?\n- Har lokalet universell utforming for alle gjestene mine?\n- Får jeg kvittering og bekreftelse digitalt?\n\n## Klar til å sikre datoen?\n\nBruk sjekklisten over når du sammenligner lokaler, så unngår du skjulte gebyrer og treffer riktig valg for den store dagen. Digilist gir kommunen en bookingløsning der pris, kapasitet, depositum og ledig dato ligger åpent på nett, slik at du kan leie bryllupslokale på minutter, uten en eneste telefon. Sjekk om kommunen din bruker Digilist, og book neste ledige lørdag direkte fra kalenderen.';
const __vite_glob_0_11 = '---\nslug: bryllupslokale-kommune-pris-og-booking\ntitle: "Bryllupslokale i kommunen: pris, kapasitet og booking på nett"\ndescription: "Slik finner brudepar kommunalt bryllupslokale: pris, kapasitet, hva som er inkludert i leien, depositum og avbestilling, og hvordan du booker uten å ringe rundt."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["bryllupslokale kommune pris", "leie bryllupslokale kommune", "kommunalt selskapslokale bryllup", "kulturhus bryllup", "booke bryllupslokale online", "depositum bryllupslokale"]\n---\n\nKommunale kulturhus, samfunnshus og grendehus er blant de rimeligste og mest romslige bryllupslokalene du finner, men de er også de vanskeligste å få oversikt over. Prisene ligger spredt på ulike nettsider, ledige datoer må ofte bekreftes på telefon, og hva som faktisk følger med i leien står sjelden samlet ett sted. Denne guiden går gjennom pris, kapasitet, hva som er inkludert, booking og reglene du bør sjekke før du signerer.\n\n## Hva er et kommunalt bryllupslokale, og hvorfor vurdere det fremfor privat leie\n\nEt kommunalt bryllupslokale er et selskapslokale eid og driftet av kommunen: et kulturhus, et samfunnshus, en festsal i rådhuset eller et grendehus som leies ut til private arrangementer. Kommunen tilbyr disse for å holde bygg i bruk utenom åpningstid, og prisnivået er derfor lagt lavere enn hos rene kommersielle selskapslokaler.\n\nFor et brudepar betyr det tre ting. Leien er ofte en brøkdel av hva private lokaler tar. Lokalene er som regel store nok til slekt og venner samlet. Og du står fritt til å velge egen catering eller lage maten selv, uten å være bundet til husets kjøkken. Til gjengjeld må du gjerne rigge og rydde selv, og du får sjelden en egen arrangementsvert som følger dagen fra start til slutt.\n\n## Hva koster et bryllupslokale hos kommunen? Slik er prismodellene bygget opp\n\nPrisen på et kommunalt bryllupslokale settes vanligvis i kommunens gebyrregulativ, som vedtas årlig av kommunestyret. De fleste kommuner bygger prisen på tre elementer:\n\n- **Grunnleie per døgn eller helg.** For en bryllupsdag med rigging kvelden før og rydding dagen etter betaler du ofte for et helgeleie, ikke bare noen timer.\n- **Kategori på leietaker.** Private arrangementer og næring betaler mer enn lag og foreninger. Bryllup faller inn under privat leie.\n- **Tillegg.** Ekstra kjøkkenbruk, rydding, ekstra timer eller bruk av scene og lydanlegg kan komme i tillegg.\n\nI praksis ligger et kommunalt bryllupslokale ofte på 3 000 til 10 000 kroner for en helg, avhengig av kommune og lokalets størrelse. Et lite grendehus kan koste under 3 000 kroner, mens en stor festsal i et kulturhus kan ligge på 12 000 til 15 000 kroner. Til sammenligning starter kommersielle selskapslokaler ofte på 20 000 til 40 000 kroner for lokalet alene. Mange kommuner, blant dem større kommuner som Bærum og Lillestrøm, publiserer gebyrregulativer der private satser skilles fra foreningssatser, slik at du kan lese hva bryllup faktisk koster.\n\nDet som gjør prisjakten tung, er at satsen sjelden står ferdig utregnet. Du finner grunnleien i ett dokument, tilleggene i et annet, og selve totalen for din dato må du regne ut selv eller ringe for å få. En bookingløsning med sanntidspris legger disse sammen for deg og viser totalen for den konkrete datoen.\n\n## Hvilke kommunale lokaler egner seg til bryllup: kulturhus, samfunnshus, rådhus og grendehus\n\nKommunen sitter på flere typer lokaler, og de passer til ulike bryllup:\n\n- **Kulturhus.** Størst og best utstyrt, ofte med scene, profesjonelt lydanlegg, garderobe og et stort kjøkken. Passer store bryllup og fest med tale, musikk og dans.\n- **Samfunnshus.** Klassisk festlokale med storsal og kjøkken. Fleksibelt og romslig, gjerne det beste forholdet mellom pris og plass.\n- **Rådhus og festsaler.** Noen kommuner leier ut representative saler i rådhuset, gjerne med begrensninger på alkohol og sluttid. Fint for vielse og en mer formell mottakelse.\n- **Grendehus og bygdehus.** Mindre, sjarmerende og billigst. Passer intime bryllup på 30 til 60 gjester, ofte med enkel standard og selvrigging.\n\nMange kommuner leier også ut selve vielsesrommet til borgerlig vigsel gratis eller til en lav sats, og det er verdt å skille dette fra festlokalet du leier til mottakelsen etterpå.\n\n## Kapasitet og størrelse: finn riktig lokale til antall gjester\n\nKapasitet er det som oftest avgjør valget, og det er lett å bomme. Et lokale som rommer 200 stående på konsert rommer langt færre ved langbord med servering. En nyttig tommelfingerregel er 1,5 til 2 kvadratmeter per gjest ved bordsetting, mer hvis du skal ha dansegulv og buffé i samme rom.\n\nGrov pekepinn på gjesteantall ved bordsetting:\n\n- **Grendehus:** 30 til 60 gjester\n- **Samfunnshus, mindre sal:** 60 til 100 gjester\n- **Samfunnshus, storsal:** 100 til 150 gjester\n- **Kulturhus:** 150 til 250 gjester\n\nSjekk alltid to tall: godkjent makskapasitet av branntekniske hensyn, og hvor mange lokalet realistisk rommer med bord, buffé og dansegulv. Det første står i utleievilkårene, det andre må du ofte vurdere ut fra plantegning eller en visning.\n\n## Hva er inkludert i leieprisen: kjøkken, bord, stoler, lydanlegg og parkering\n\nDet store spørsmålet etter prisen er hva som følger med. Kommunale lokaler varierer mye, men typisk inngår:\n\n- **Bord og stoler** i et antall som matcher lokalets kapasitet\n- **Kjøkken** med kjøleskap, komfyr, ovn og oppvaskmaskin, ofte i storkjøkkenstandard\n- **Servise og bestikk** i noen lokaler, i andre må du leie eller ta med selv\n- **Lydanlegg og projektor** i kulturhus, sjeldnere i grendehus\n- **Parkering** ved bygget, gratis i de fleste kommuner utenfor de største byene\n- **Rengjøringsutstyr**, ettersom sluttrengjøring som regel er leietakers ansvar\n\nDet som sjelden er inkludert: duker, servietter, pynt, catering, vakthold og selve riggingen. Se derfor etter en fullstendig inventarliste før du booker. Mangler den, ender du med å ringe for å avklare om det finnes nok tallerkener til 120 gjester. Digilist samler inventar, kapasitet og pris i én objektside, slik at du ser hva som følger med før du reserverer.\n\n## Slik booker du bryllupslokale i kommunen, steg for steg\n\nTradisjonelt har booking av kommunalt bryllupslokale betydd e-post til kulturkontoret, venting på svar og en telefon for å bekrefte at datoen faktisk er ledig. Med en digital løsning som Digilist gjør du det selv på nett:\n\n1. **Søk opp lokalet** og velg datoen din i sanntidskalenderen. Er datoen ledig, kan du reservere den med én gang.\n2. **Se totalprisen** for akkurat den helgen, med grunnleie og tillegg lagt sammen.\n3. **Les hva som er inkludert**, sjekk kapasitet og inventar på objektsiden.\n4. **Send forespørsel eller reserver.** Krever lokalet godkjenning, går forespørselen rett til en saksbehandler som svarer i samme løsning.\n5. **Logg inn med BankID**, betal eller motta faktura, og få bekreftelse og kvittering på Min Side.\n\nHele reisen tar minutter i stedet for dager, og du slipper å ringe rundt til flere etater for å få svar på det som burde stått på skjermen.\n\n## Depositum, betaling og avbestillingsregler du bør sjekke før du signerer\n\nFør du bekrefter, les de økonomiske vilkårene nøye. Tre punkter er verdt ekstra oppmerksomhet:\n\n- **Depositum.** Mange kommuner krever et depositum på 2 000 til 5 000 kroner som sikkerhet mot skader og manglende rydding. Det tilbakebetales etter godkjent sluttbefaring.\n- **Betaling.** Noen kommuner tar forskuddsbetaling, andre sender faktura med EHF eller Vipps. Sjekk forfall, for enkelte krever betaling før du får nøkkel eller adgangskode.\n- **Avbestilling.** Fristene varierer sterkt. En vanlig modell er full refusjon ved avbestilling mer enn 60 dager før, delvis refusjon mellom 30 og 60 dager, og ingen refusjon nærmere arrangementet. For et bryllup booket et år i forveien betyr det at du bør kjenne fristen lenge før den nærmer seg.\n\nSe også etter regler for alkoholservering, sluttid, støygrense og hvem som har ansvaret ved skade. Disse står i utleievilkårene og bør leses før signering, ikke etter.\n\n## Kommunalt versus privat bryllupslokale: fordeler, ulemper og typiske prisforskjeller\n\nValget står sjelden bare om pris. Her er hovedforskjellene:\n\n**Kommunalt lokale** gir lav leie, romslige lokaler og full frihet til å velge catering selv. Til gjengjeld rigger og rydder du selv, standarden er enklere, og du har sjelden en arrangementsvert på dagen. Prisnivå: 3 000 til 15 000 kroner for lokalet.\n\n**Privat selskapslokale** gir høyere standard, servering og vertskap på plass, og mindre å organisere selv. Til gjengjeld er du ofte bundet til husets meny, prisen er langt høyere, og lokalet kan være mindre. Prisnivå: fra 20 000 kroner for lokalet, ofte med pakkepris per gjest på toppen.\n\nFor et par som vil ha kontroll på budsjett og gjøre mye selv, vinner det kommunale lokalet på pris og plass. For et par som vil ha alt levert nøkkelferdig, veier vertskapet i det private lokalet ofte tyngre enn prisforskjellen.\n\n## Sjekkliste før booking: dato, tillatelser og frister å huske på\n\nGå gjennom denne listen før du bekrefter bryllupslokalet:\n\n- **Dato bekreftet ledig** i sanntid, ikke bare muntlig\n- **Kapasitet** som holder til gjestelisten med bordsetting og dansegulv\n- **Totalpris** inkludert alle tillegg, ikke bare grunnleien\n- **Inventarliste** med bord, stoler, kjøkken og servise\n- **Depositum og betalingsfrist** notert i kalenderen\n- **Avbestillingsfrist** notert, gjerne med påminnelse\n- **Regler for alkohol, sluttid og støy** lest\n- **Tillatelser**, som skjenkebevilling, søkt i god tid om nødvendig\n- **Rigge- og ryddetid** avklart, gjerne kvelden før og dagen etter\n- **Nøkkel eller adgangskode** avtalt for hele leieperioden\n\nHar du disse på plass, unngår du de vanligste overraskelsene, som at depositumet forsvinner på grunn av manglende rydding, eller at datoen ikke var reservert likevel.\n\n## Book kommunalt bryllupslokale uten å ringe rundt\n\nEt kommunalt bryllupslokale kan gi dere en romslig og rimelig ramme rundt dagen, forutsatt at dere finner riktig lokale, kjenner totalprisen og har vilkårene klare i forkant. Digilist samler ledige datoer i sanntid, full pris for din helg og en tydelig oversikt over hva som er inkludert, slik at brudepar kan booke selv i stedet for å vente på svar fra flere etater.\n\nVil kommunen din tilby innbyggerne den samme opplevelsen? Book en demo, så viser vi hvordan bryllupslokaler og andre kommunale rom blir bookbare på nett, med sanntidspris og selvbetjent booking hele veien.';
const __vite_glob_0_12 = '---\nslug: bryllupslokale-kommune-pris\ntitle: "Bryllupslokale i kommunen: pris, ledige datoer og booking"\ndescription: "Slik prises og bookes kommunale bryllupslokaler digitalt. Reelle prisfaktorer, sjekkliste for kapasitet og en enkel måte å sammenligne lokaler og datoer på."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["bryllupslokale kommune pris", "leie bryllupslokale kommune", "bryllupslokale ledig dato", "depositum bryllupslokale", "book bryllupslokale online", "bryllupslokale kapasitet"]\n---\n\nEt bryllup i et kommunalt lokale kan koste en brøkdel av et privat selskapslokale, men prisene er ofte gjemt i PDF-er og prislister som varierer fra kommune til kommune. Denne guiden viser hvordan kommunale bryllupslokaler faktisk prises, hva du må regne med av tilleggskostnader, og hvordan du finner ledige datoer og booker uten å ringe rundt til flere saksbehandlere.\n\n## Hva er et bryllupslokale i kommunal regi?\n\nDe fleste kommuner leier ut egne bygg til private arrangementer, inkludert bryllup. Det du leier er som regel et allerede eksisterende offentlig rom, ikke et dedikert selskapslokale, og prisen gjenspeiler det.\n\nTypiske alternativer:\n\n- **Kulturhus og storsaler**: Best egnet for større bryllup med scene, lyd og lys. Ofte den dyreste kommunale kategorien, men fortsatt rimeligere enn private festlokaler.\n- **Forsamlingshus og grendehus**: Klassiske bygdefester. Enkle rom med kjøkken, ofte drevet i samarbeid med et lokalt lag.\n- **Rådhussal og representasjonslokaler**: Formelle rom som brukes til vigsel og mindre mottakelser. Borgerlig vigsel hos kommunen er gratis for innbyggere, men selve festlokalet leier du separat.\n- **Gymsaler og aktivitetshus**: Fleksible og billige, men krever mer pynt og egen rigging.\n\nFordi lokalene er del av kommunens vanlige utleieordning, følger de samme booking- og prisregler som når et idrettslag leier en hall. Det gjør prisen forutsigbar når du først finner den.\n\n## Hva koster et bryllupslokale hos kommunen?\n\nPrisen på et bryllupslokale hos kommunen settes vanligvis sammen av tre faktorer: en grunnpris (per time eller per døgn), et helge- og kveldstillegg, og eventuelle tilleggstjenester.\n\nRealistiske størrelsesordener i norske kommuner ligger omtrent slik:\n\n- **Timepris hverdag**: 200 til 600 kroner per time for en gymsal eller mindre sal.\n- **Døgn- eller helgepris storsal**: 4 000 til 12 000 kroner for et kulturhus en lørdag, inkludert rigg- og ryddetid.\n- **Helgetillegg**: Mange kommuner legger på 25 til 50 prosent for arrangementer fredag til søndag.\n\nPrisen avhenger også av om du regnes som privatperson eller som lag/forening. Lillestrøm kommune, for eksempel, skiller mellom kommersiell leie, privat leie og leie for frivillige lag, der sistnevnte betaler klart minst. Bor du i kommunen, får du ofte innbyggerpris som er lavere enn for eksterne. Sjekk alltid hvilken kategori du havner i før du sammenligner to lokaler, ellers sammenligner du epler og pærer.\n\nSesong spiller også inn. Mai til september er høysesong for bryllup, og de mest populære lørdagene i denne perioden er booket mange måneder i forveien. Selve leieprisen endrer seg sjelden med sesongen i kommunale bygg, men tilgangen på ledige datoer gjør det.\n\n## Depositum og tilleggskostnader du må regne med\n\nGrunnleien er sjelden hele regningen. Når du budsjetterer for et bryllupslokale, bør du legge inn disse postene:\n\n- **Depositum**: Vanligvis 2 000 til 10 000 kroner, som betales inn før arrangementet og tilbakebetales hvis lokalet leveres rent og uskadd. Depositumet dekker skader, tapt nøkkel eller ekstra renhold.\n- **Rengjøring**: Noen kommuner krever at du vasker selv etter avtalt standard, andre tilbyr sluttvask mot et gebyr på 1 500 til 4 000 kroner. Å betale for vask er ofte verdt det når festen slutter etter midnatt.\n- **Nøkkel- eller adgangsdepositum**: Et mindre beløp for nøkkel eller adgangsbrikke.\n- **Teknisk bistand**: Trenger du en tekniker for lyd og lys i en storsal, kommer det ofte i tillegg per time.\n- **Bord, stoler og dekketøy**: Noen lokaler har alt inkludert, andre tar leie per enhet.\n\nRegn med at disse postene til sammen kan legge 20 til 40 prosent på grunnleien. Les leievilkårene nøye: det er forskjellen mellom en forutsigbar regning og en overraskelse på depositumet i etterkant.\n\n## Slik sjekker du ledige datoer og booker online\n\nDen største tidstyven i bryllupsplanlegging er å finne ut hva som faktisk er ledig. Tradisjonelt betyr det å sende e-post til en saksbehandler, vente noen dager, få vite at lørdagen er opptatt, og starte på nytt.\n\nMed en digital bookingløsning som Digilist snur du prosessen:\n\n1. **Søk opp lokalet** i kommunens utleieportal og se en åpen kalender med ledige og opptatte datoer.\n2. **Filtrer på dato og kapasitet** slik at du bare ser lokaler som passer antall gjester.\n3. **Sammenlign pris** direkte, fordi prislisten ligger på hvert lokale.\n4. **Send søknad eller reserver** den ledige datoen digitalt, med automatisk bekreftelse.\n\nÅ booke bryllupslokale online betyr at du ser ledige datoer for flere lokaler samtidig, uten å ringe rundt. Det sparer både deg og saksbehandleren for e-postrunder, og du unngår å binde deg til et lokale før du vet at datoen er ledig. For populære lørdager i juni er dette forskjellen på å sikre datoen og å komme for sent.\n\n## Kapasitet og fasiliteter: planlegg for antall gjester\n\nKapasitet er det første du bør filtrere på, for et vakkert lokale hjelper lite hvis halve gjestelisten må stå. Kapasiteten på et bryllupslokale oppgis vanligvis både for sittende bespisning og for stående mottakelse, og tallene er ofte ganske ulike.\n\nSjekkliste før du booker:\n\n- **Antall gjester**: Et lokale merket «150 personer» tar gjerne 150 stående, men bare 90 til 100 ved langbord. Spør alltid om sittende kapasitet.\n- **Kjøkken**: Er det et fullt produksjonskjøkken, et enkelt anretningskjøkken, eller ingenting? Dette avgjør om du kan bruke egen catering.\n- **Catering**: Noen kommunale lokaler har avtale med faste leverandører, andre lar deg ta med hvem du vil. Ekstern catering krever ofte tilgang til kjøkken og oppvask.\n- **Teknisk utstyr**: Projektor, mikrofon, lydanlegg og scene. Sjekk hva som er inkludert og hva som leies separat.\n- **Universell utforming**: Rullestoltilgang, HC-toalett og heis hvis lokalet har flere etasjer.\n- **Parkering og adkomst**: Viktig hvis mange gjester kommer langveisfra.\n\nSkriv ned tallet på gjester tidlig, og bruk det som hovedfilter. Det kutter listen over aktuelle lokaler raskt.\n\n## Kommunalt versus privat bryllupslokale\n\nValget mellom kommunalt og privat handler om mer enn pris. De reelle forskjellene ser slik ut:\n\n| Faktor | Kommunalt lokale | Privat selskapslokale |\n| --- | --- | --- |\n| Pris | Lav til moderat | Høy, ofte pakkepris |\n| Catering | Ofte fritt valg | Ofte via huset |\n| Rigging og rydding | Som regel eget ansvar | Inkludert |\n| Booking | Digital eller via saksbehandler | Direkte med driver |\n| Fleksibilitet | Enkle, nøytrale rom | Komplett service |\n\nEt privat lokale gir deg en ferdig pakke med servering, rigging og rydding, mot en klart høyere pris. Et kommunalt lokale gir deg et rimelig rom og full frihet, men du står selv for mer av planleggingen. For par med stramt budsjett, eller som gjerne ordner catering og pynt selv, er det kommunale alternativet ofte den beste kombinasjonen av pris og fleksibilitet.\n\n## Slik reduserer du kostnaden\n\nVil du ha et billig bryllupslokale hos kommunen, finnes det flere konkrete grep som kutter regningen uten å kutte kvaliteten:\n\n- **Velg hverdag eller fredag**: Helgetillegget forsvinner, og en fredagsvielse med fest kan koste 25 til 50 prosent mindre enn en lørdag.\n- **Book utenom høysesong**: Et bryllup i mars eller oktober gir langt bedre tilgang på datoer, og enkelte kommuner har lavere satser utenfor sommeren.\n- **Bruk lag- og foreningsrabatt**: Er du eller partneren medlem i et lokallag som disponerer et forsamlingshus, kan medlemsprisen være en brøkdel av privat leie.\n- **Vask selv**: Sett av folk til rydding neste morgen i stedet for å betale sluttvask.\n- **Ta med egen catering**: Egen leverandør eller familiehjelp på kjøkkenet kutter en av de største postene.\n\nKombinerer du en fredag i lavsesong med foreningsrabatt og egen rydding, kan totalprisen for lokalet bli under halvparten av en lørdag i juni.\n\n## Vanlige spørsmål om regler og avbestilling\n\n**Trenger jeg alkoholbevilling?**\nFor et privat bryllup der du ikke selger alkohol, holder det vanligvis med en ambulerende skjenkebevilling som du søker om hos kommunen. Selger noen alkohol i lokalet, kreves ordinær bevilling. Reglene om alkoholbevilling varierer, så søk i god tid, gjerne fire til seks uker før. Enkelte kommunale lokaler har egne regler for alkohol, og noen forsamlingshus er alkoholfrie.\n\n**Hva skjer hvis jeg må avbestille?**\nDe fleste kommuner har en avbestillingsfrist. Avbestiller du innen fristen, ofte 14 til 30 dager før, får du depositumet tilbake. Senere avbestilling kan medføre at hele eller deler av leien beholdes. Les vilkårene før du bekrefter bookingen.\n\n**Kan jeg holde på lenge på kvelden?**\nMange lokaler har en sluttid av hensyn til naboer, typisk klokken 01 eller 02. Sjekk om det finnes støyregler eller krav om at musikken dempes etter et bestemt klokkeslett.\n\n**Er vigselen inkludert?**\nBorgerlig vigsel hos kommunen er gratis, men foregår som regel i et eget vigselsrom, ikke i festlokalet. Vil du gifte deg og feire på samme sted, må du sjekke om lokalet også kan brukes til selve seremonien.\n\n## Sammenlign lokaler før du bestemmer deg\n\nEt kommunalt bryllupslokale gir mye fest for pengene når du kjenner de reelle kostnadene og finner en ledig dato tidlig. Nøkkelen er å sammenligne grunnpris, tillegg og kapasitet side om side, i stedet for å ringe rundt til én kommune av gangen.\n\nVi har samlet en sjekkliste med alle prisfaktorene, spørsmålene du bør stille og en enkel mal for å sammenligne lokaler og datoer. Last ned PDF-en og ta den med når du planlegger bryllupet, så har du alt på ett sted.';
const __vite_glob_0_13 = '---\nslug: bryllupslokale-kommune-prosess-fra-sok-til-kontrakt\ntitle: "Bryllupslokale i kommunen: hele prosessen fra søk til signert kontrakt"\ndescription: "Praktisk prosessguide for å leie bryllupslokale i kommunen: sjekk ledige datoer, send søknad, unngå dobbeltbooking og forstå avbestillingsreglene."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["bryllupslokale kommune", "ledige datoer bryllupslokale", "booke bryllupslokale", "avbestille bryllupslokale", "søknad bryllupslokale", "dobbeltbooking bryllupslokale"]\n---\n\nDe fleste guider om bryllupslokale stopper ved prisen. Denne tar deg gjennom hele leieprosessen: fra du sjekker ledige datoer til kontrakten er signert, og hva som skjer hvis noe går galt underveis.\n\n## Hva slags bryllupslokaler finnes i kommunen\n\nKommunale bryllupslokaler er mer enn festsaler. De vanligste kategoriene:\n\n- **Kulturhus og forsamlingssaler**: ofte pent utstyrte, plass til 80–250 gjester, med scene, kjøkken og lyd.\n- **Grendehus og forsamlingshus**: rimeligere, gjerne 40–120 gjester, drevet av kommunen eller en velforening i samarbeid med den.\n- **Gymsaler og flerbrukshaller**: størst kapasitet, men krevende å pynte. Passer store selskap over 200 gjester.\n- **Uteareal og parker**: friarealer, brygger eller amfi som kan reserveres for seremoni.\n\nPrisen varierer med lokaltype og gjestetall. En forsamlingssal i en mellomstor kommune ligger typisk på 2 500–6 000 kr for en helgekveld, mens et fullt utstyrt kulturhus kan koste 8 000–15 000 kr. Innbyggere i egen kommune betaler ofte lavere sats enn utenbys leietakere. Sjekk også hva som faktisk følger med: tilgang til kjøkken, bord og stoler, projektor og lyd kan enten være inkludert eller komme som egne tillegg.\n\n## Slik sjekker du ledige datoer uten å ringe\n\nTidligere måtte du ringe servicetorget og vente på svar. I en digital løsning som Digilist ser du tilgjengeligheten direkte i en sanntidskalender: grønn dato er ledig, opptatt dato er sperret. Du kan filtrere på kapasitet og lokaltype, slik at du bare ser saler som tar 150 gjester hvis det er det du trenger.\n\nPopulære lørdager i mai, juni og august fylles ofte 9–12 måneder i forveien. Sjekk flere datoer samtidig, og ha en reservedato klar.\n\nBook gjerne en visning før du bekrefter. Bilder viser sjelden akustikk, tilgangen til kjøkkenet eller hvor nære naboene er. De fleste kommuner lar deg avtale en befaring via den samme kontaktpersonen som behandler forespørselen, og et kvarter i lokalet avslører mer enn en katalog.\n\n## Steg for steg: fra forespørsel til bekreftet dato\n\n1. **Finn lokalet** og velg dato i kalenderen.\n2. **Send forespørsel** med gjestetall, tidsrom og formål.\n3. **Saksbehandler vurderer** søknaden, ofte innen 3–5 virkedager.\n4. **Godkjenning og kontrakt** sendes digitalt, gjerne med signering via BankID.\n5. **Betaling** av leie eller depositum bekrefter reservasjonen.\n\nDatoen er ikke din før du har mottatt skriftlig bekreftelse. En forespørsel alene sperrer normalt ikke lokalet for andre.\n\n## Hva du må legge ved søknaden\n\nJo mer komplett søknaden er, jo raskere går godkjenningen. Ha klart:\n\n- **Antatt gjestetall**: avgjør om lokalet har nok kapasitet og godkjent rømningsvei.\n- **Tidsrom**: seremoni, fest og rigging inn og ut. Mange lokaler krever at du er ute til et fast klokkeslett.\n- **Catering og kjøkkenbruk**: om du bruker egen mat, ekstern leverandør eller husets kjøkken.\n- **Alkoholservering**: skjenking i offentlig lokale krever ofte en egen skjenkebevilling for enkeltanledning, som søkes hos kommunen med egen frist.\n- **Ansvarlig kontaktperson** over 18 år.\n\n## Avbestilling og endring av dato\n\nAvbestillingsreglene står i leievilkårene, og de varierer. Et vanlig mønster:\n\n- Avbestilling mer enn 60 dager før: full refusjon, eller kun et lite gebyr.\n- 30–60 dager før: halv leie beholdes.\n- Under 30 dager: hele leien kan gå tapt.\n\nDepositumet skal dekke eventuelle skader eller ekstra renhold, og refunderes normalt etter at lokalet er levert rent og uskadet. Vil du bytte dato i stedet for å avbestille, spør saksbehandler: mange kommuner flytter en reservasjon uten gebyr hvis den nye datoen er ledig. Les vilkårene før du signerer, ikke etter.\n\n## Vanlige feil som forsinker godkjenning\n\n- Uklart eller manglende gjestetall, så saksbehandler må etterspørre.\n- Glemt skjenkesøknad, som har egen behandlingstid.\n- Søknad sendt for sent til at bevilling og kontrakt rekker fristene.\n- Feil lokaltype for antall gjester, så saken må starte på nytt.\n- Manglende kontaktinfo, som stopper den digitale signeringen.\n\nDe fleste av disse løses ved å fylle ut alle felt i første forsøk. Et digitalt skjema som krever gjestetall og tidsrom før innsending, hindrer at søknaden blir liggende.\n\n## Hva skjer om to par søker samme dato\n\nDobbeltbooking er den klassiske frykten. I et papirbasert system kan to par få muntlig ja på samme lørdag. En digital kalender sperrer datoen i det øyeblikket den første reservasjonen bekreftes, så nummer to ser den som opptatt med en gang.\n\nFår kommunen to forespørsler før noen er bekreftet, avgjør de som regel etter tidspunkt for innsendt søknad, altså førstemann til mølla. Noen kommuner prioriterer egne innbyggere foran utenbys leietakere. Reglene skal stå i utleievilkårene, og en god løsning viser deg køposisjonen din skriftlig, slik at du slipper å gjette hvor du står.\n\n## Praktiske forhold du bør avklare før dagen\n\nSelve leieavtalen er bare halve jobben. Disse punktene bør stå svart på hvitt før dagen kommer:\n\n- **Tilgang og nøkkel**: når får du komme inn for å rigge, og hvordan får du tilgang, via kode, nøkkel eller vaktmester?\n- **Parkering og universell utforming**: har gjestene et sted å parkere, og kommer alle inn uten trapp?\n- **Renhold**: er sluttrengjøring inkludert i prisen, eller er det ditt ansvar før innlevering?\n- **Sluttid og støy**: mange lokaler har et fast klokkeslett for når musikken må dempes eller stanse.\n- **Skader og ansvar**: hvem dekker det hvis noe knuses, og hva trekkes eventuelt fra depositumet?\n\nAvklarer du dette samtidig med kontrakten, unngår du overraskelser i innspurten når du har mer enn nok annet å tenke på.\n\n## Sjekkliste før du booker\n\n- Er datoen bekreftet skriftlig, ikke bare forespurt?\n- Tar lokalet gjestetallet ditt, med godkjent rømningsvei?\n- Er tidsrommet nok til rigging inn og ut?\n- Trenger du skjenkebevilling, og når er fristen?\n- Hva er avbestillingsfristen og refusjonsregelen?\n- Hva koster depositumet, og hva kreves for å få det tilbake?\n\n## Se prosessen i praksis\n\nDigilist samler ledige datoer, søknad, kontrakt og betaling i én flyt, slik at et bryllupslokale kan reserveres uten telefonrunder og uten risiko for dobbeltbooking. Vil du se hvordan innbyggere booker og hvordan kommunen behandler søknadene? Book en demo, så viser vi deg hele reisen fra søk til signert kontrakt.';
const __vite_glob_0_14 = '---\nslug: bryllupslokale-kommune-sjekkliste-bryllupsdagen\ntitle: "Bryllupslokale i kommunen: sjekklisten som avgjør bryllupsdagen"\ndescription: "Fra kapasitet og kjøkken til pynt, alkohol, støy og depositum: en praktisk sjekkliste som viser hva et kommunalt bryllupslokale faktisk tillater før du signerer."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["bryllupslokale kommune", "bryllupslokale kapasitet", "kjøkken catering bryllup", "dekorering regler lokale", "avbestilling bryllupslokale", "depositum rengjøring"]\n---\n\nPris og ledig dato er lett å sjekke. Det som avgjør om festen faktisk går bra, er detaljene: hvor mange gjester salen tar, om kjøkkenet er inkludert, om dere får servere alkohol, om du får henge noe på veggen, og hva som skjer med depositumet dagen etter. Denne sjekklisten går gjennom alt du bør vite før du signerer et kommunalt bryllupslokale.\n\n## Hvilke bryllupslokaler finnes i kommunen\n\nDe fleste kommuner leier ut fire typer lokaler som egner seg til bryllup:\n\n- **Kulturhus og festsaler:** representative, ofte scene og lyd, plass til mellom 100 og 250 gjester.\n- **Grendehus og forsamlingshus:** rimeligst, egen kjøkkentilgang, mellom 40 og 120 gjester.\n- **Skolegymsaler:** stor kapasitet og lav pris, men enklere standard og ofte krav om egen rigging.\n- **Rådhussal eller bystyresal:** flott ramme, men strenge regler for pynt og servering.\n\nI Lillestrøm kommune finner du for eksempel både kulturhussaler og grendehus i samme oversikt. Sammenlign standard, ikke bare pris: en gymsal til 2 000 kroner kan koste mer i innleid utstyr enn en festsal til 6 000 kroner der bord og stoler er inkludert.\n\n## Hvor mange gjester har du plass til\n\nKapasiteten avhenger av bordoppsett, ikke bare av salens areal. Et lokale som tar 150 personer stående, tar gjerne bare 90 til 110 ved langbord med servering.\n\nTommelregel per gjest ved sittende middag: regn 1,5 til 2 kvadratmeter når du legger til plass for buffet, dansegulv og talerstol. Sjekk også det oppgitte **maksantallet i branndokumentasjonen**, det er en absolutt grense uansett hvordan du setter bordene. Spør utleier om en planskisse med bordoppsett før du bestemmer gjestelisten.\n\nHar dere gjester som trenger det, avklar også universell utforming: trinnfri adkomst, rullestoltilgang til toalett og eventuell teleslynge. Kommunale lokaler er ofte godt tilrettelagt, men det varierer mellom eldre grendehus og nyere kulturhus.\n\n## Kjøkken og catering\n\nHer varierer det mest mellom lokaltypene. Avklar tre ting:\n\n1. **Er kjøkkenet inkludert?** Grendehus har ofte fullt kjøkken med komfyr, kjøleskap og oppvaskmaskin i leieprisen. Rådhussaler har det sjelden.\n2. **Får du bruke ekstern caterer,** eller er lokalet knyttet til en fast leverandør?\n3. **Hva må du ta med selv:** servise, glass, kaffetraktere og bestikk følger ikke alltid med.\n\nRegn med at oppvarming og servering av mat til 100 gjester krever mer enn en husholdningskomfyr. Er kjøkkenet lite, planlegg en caterer som leverer ferdig varmmat.\n\n## Servering av alkohol: skjenkebevilling i kommunale lokaler\n\nSkal dere servere alkohol, gjelder egne regler. For et lukket selskap der ingen betaler for drikken, kreves det som regel ikke skjenkebevilling. Men leier dere inn en caterer som selger alkohol, eller holder baren åpen mot betaling, må det søkes om skjenkebevilling for en enkelt anledning hos kommunen. Behandlingstiden kan være flere uker, så avklar dette tidlig.\n\nSpør også utleier om lokalet i det hele tatt tillater alkoholservering. Enkelte rådhus- og skolelokaler har totalforbud, mens festsaler og grendehus som regel er åpne for det. Får du et klart svar før du signerer, slipper du en kjedelig overraskelse tett opp mot dagen.\n\n## Pynting og dekorering\n\nPynt er der de fleste får overraskelser. Vanlige regler i kommunale lokaler:\n\n- **Levende lys** er ofte forbudt av brannhensyn. Bruk LED-lys.\n- **Konfetti og rispynt** kan gi ekstra rengjøringsgebyr, og en del lokaler forbyr det helt.\n- **Ballonger med helium** er som regel greit, men slipp dem ikke opp i takhøye saler med sensorer.\n- **Veggfeste:** teip, spiker og stifter i vegger og listverk er nesten alltid forbudt. Bruk frittstående dekor eller avklar godkjent feste på forhånd.\n\nBe om husreglene skriftlig. Da unngår du å rigge ned noe midt i selskapet fordi vaktmesteren reagerer.\n\n## Lyd og musikk\n\nKommunale lokaler har ofte en grenseverdi for lyd, typisk rundt 95 til 100 desibel, og et klokkeslett da musikken må dempes eller stanses. I bygg med flere leietakere samme kveld eller naboer tett på, kan grensen være strengere.\n\nAvklar tre ting med DJ eller band: maks lydnivå, sluttidspunkt for høy musikk, og om det finnes fast lydanlegg du kan bruke. I en festsal med scene sparer du gjerne leie av eget anlegg.\n\n## Avbestilling og forsikring\n\nBryllup planlegges langt frem, og planer endrer seg. Sjekk avbestillingsvilkårene før du signerer:\n\n- Hvor mange dager før får du **full refusjon,** og når faller depositumet bort?\n- Kan datoen **flyttes** i stedet for å avlyses?\n- Krever utleier at du har en **ansvarsforsikring** for skade på lokalet?\n\nEt vanlig mønster er trappetrinn: full refusjon inntil 60 dager før, delvis inntil 14 dager, ingen refusjon etter det. En egen forsikring for arrangementet koster gjerne noen hundrelapper og dekker uhell med inventar.\n\n## Depositum og rengjøring\n\nDepositum på et bryllupslokale ligger ofte mellom 2 000 og 10 000 kroner, og trekkes ved skader eller mangelfull rydding. Slik unngår du trekk:\n\n- Les **rengjøringskravet:** noen lokaler krever full vask, andre bare grovrydding mot et fast rengjøringsgebyr.\n- Ta med **egne søppelsekker** og avklar hvor avfallet skal.\n- **Fotografer lokalet** før og etter, så har du dokumentasjon ved uenighet.\n- Lever nøkkel til avtalt tid, forsinket tilbakelevering kan gi ekstra døgnleie.\n\nEr du usikker på om du rekker å vaske selv etter en lang kveld, bestill rengjøring som tillegg. Det er ofte billigere enn å tape hele depositumet.\n\n## Slik booker du riktig dato\n\nPopulære lørdager i juni, juli og august bookes tidligst. Sikre lokalet **mellom 6 og 12 måneder før** for høysesong, og minst 3 måneder før for en hverdag eller vintermåned.\n\nMed Digilist ser du ledige datoer i sanntid, kapasitet, pris og husregler samlet på ett sted, og du booker og betaler direkte uten å vente på et svar per e-post. Da vet du hva lokalet faktisk tillater før du signerer, ikke etter.\n\n## Ta med sjekklisten på visningen\n\nSkriv ut hele sjekklisten og gå gjennom den punkt for punkt når du ser på lokalet. Da fanger du opp forbeholdene før kontrakten, ikke på bryllupsdagen.\n\n**Last ned PDF** med hele sjekklisten, og finn ledige bryllupslokaler i din kommune på Digilist.';
const __vite_glob_0_15 = '---\nslug: datalokasjon-norge-gdpr-kommunal-booking\ntitle: "Kommunal booking-SaaS: Derfor er norsk datalokasjon ikke valgfritt"\ndescription: "IT-ledere i kommuner må sikre at bookingdata lagres i Norge. Her er hva GDPR krever, og hvordan Digilist løser det i praksis."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "IT-leder"\ncover: "/images/blog/sanntidskalender_hero_no.webp"\nkeywords: ["datalokasjon Norge", "GDPR kommunal", "booking SaaS offentlig sektor", "databehandleravtale", "kommunal IT-compliance", "norsk sky", "personvernforordningen"]\n---\n\nNår en kommune vurderer en ny SaaS-løsning for booking av rom, idrettshaller eller tjenester, havner spørsmålet om datalokasjon gjerne sent i prosessen, etter at demonstrasjoner er gjort og prisene er forhandlet. Det er en risikabel rekkefølge.\n\nFor IT-ledere i offentlig sektor er norsk datalokasjon ikke et teknisk detaljspørsmål. Det er et juridisk og politisk krav som påvirker om en løsning i det hele tatt kan tas i bruk.\n\n## Hvorfor datalokasjon i Norge er ikke-negotiable\n\nNorske kommuner behandler personopplysninger om sine innbyggere daglig. Bookingdata er ikke nøytrale transaksjoner, de kan inneholde navn, kontaktinformasjon, betalingsdetaljer og indirekte opplysninger om helse eller livssituasjon (for eksempel bestilling av kommunale omsorgsboliger eller tilrettelagte aktivitetstilbud).\n\nPersonvernforordningen (GDPR) setter strenge krav til overføring av personopplysninger til tredjeland utenfor EØS. Men selv innenfor EØS finnes gråsoner: En skyplattform med servere i Frankfurt, men morselskap i USA, kan utløse overføring av data til et tredjeland gjennom amerikanske lover som CLOUD Act.\n\nI 2023 kom Datatilsynet med tydelige signaler om at offentlige virksomheter bør vise særlig varsomhet med skybaserte tjenester der datastrømmene ikke er fullt ut kartlagte. Stortingets egne retningslinjer for anskaffelse av skytjenester i offentlig sektor understreker det samme: tjenestene skal fortrinnsvis ha datalagring i Norge eller EØS, og risikoen ved tredjelandsoverføring skal dokumenteres.\n\nFor en IT-leder i en norsk kommune er konklusjonen enkel: Kan du ikke dokumentere at dataene forblir i Norge, kan du heller ikke ta løsningen i bruk.\n\n## GDPR-krav som ofte glipper i cloud-løsninger\n\nMange leverandører markedsfører løsningene sine som "GDPR-compliant", men det begrepet sier lite i seg selv. GDPR-compliance er ikke en statisk sertifisering, det er et løpende krav til rutiner, dokumentasjon og teknisk arkitektur.\n\nHer er de tre punktene som oftest svikter:\n\n### 1. Uklar databehandleravtale\n\nGDPR artikkel 28 krever at det foreligger en skriftlig databehandleravtale mellom kommunen (behandlingsansvarlig) og leverandøren (databehandler). Mange leverandører tilbyr standardiserte vilkår som ikke dekker kommunens spesifikke behandlingsformål, og som inneholder klausuler om videreoverføring til underleverandører i utlandet.\n\n### 2. Usynlige underleverandørkjeder\n\nEn løsning kan ha servere i Norge, men bruke en amerikansk e-postleverandør for varsler, et irsk selskap for betalingsbehandling og en britisk aktør for backup. Hver av disse koblingene er en potensiell overføring av personopplysninger. GDPR krever at kommunen har oversikt over, og samtykke til, alle slike underleverandører.\n\n### 3. Manglende revisjonslogg\n\nKommunen er som behandlingsansvarlig forpliktet til å kunne dokumentere hvem som har hatt tilgang til personopplysninger, og når. En løsning uten fullstendig og eksporterbar revisjonslogg gjør dette umulig i praksis.\n\n## Digilists infrastruktur: bygget for norsk offentlig sektor\n\nDigilist er utviklet med norsk offentlig sektor som primær målgruppe, og infrastrukturen reflekterer det.\n\n**Norsk-basert server:** All data lagres på servere fysisk plassert i Norge. Det skjer ingen synkronisering til datasentre i andre land, og det finnes ingen bakenforliggende skyplattform med utenlandsk jurisdiksjon.\n\n**Ingen grensekryssende dataflyt:** Digilist benytter ikke tredjeparts e-postleverandører, betalingsplattformer eller analyseverktøy som overfører personopplysninger ut av EØS. Varsler sendes via norsk infrastruktur. Det finnes ingen sporings- eller analysekode fra utenlandske plattformer innebygd i løsningen.\n\n**Full revisjonslogg:** Alle handlinger i systemet, innlogginger, bookinger, endringer, kanselleringer og administrator-operasjoner, loggføres med tidsstempel og bruker-ID. Loggen er søkbar og kan eksporteres i standard format for bruk i interne revisjonsprosesser eller ved forespørsel fra Datatilsynet.\n\n**Databehandleravtale klar for signering:** Digilist leverer en fullstendig GDPR-tilpasset databehandleravtale som dekker kommunens behandlingsformål, spesifiserer underleverandører og angir klare prosedyrer ved sikkerhetsbrudd.\n\nAsker kommune tok i bruk Digilist for booking av kommunale møterom og fellesarealer. En av de avgjørende faktorene i anskaffelsesprosessen var nettopp muligheten til å dokumentere norsk datalokasjon overfor kommunens personvernombud, uten å måtte innhente tilleggsutredninger eller risikovurderinger for tredjelandsoverføring.\n\n## Slik dokumenterer du compliance overfor revisor og ledelse\n\nSom IT-leder er du ansvarlig for at løsningen kan forsvares, ikke bare teknisk, men overfor revisor, innkjøpssjef og politisk ledelse. Her er hva du trenger å ha på plass:\n\n**Overfor revisor:**\n- Signert databehandleravtale med leverandøren\n- Liste over underleverandører og deres lokasjon\n- Dokumentasjon på at data ikke overføres til tredjeland\n- Revisjonslogg som viser hvem som har hatt tilgang til personopplysninger\n\n**Overfor innkjøpssjef:**\n- Bekreftet samsvar med kommunens IKT-strategi og eventuell skyplattform-policy\n- Dokumentasjon på at anskaffelsen er gjennomført i tråd med lov om offentlige anskaffelser\n- Skriftlig bekreftelse fra leverandøren på datalokasjon\n\n**Overfor ledelse og personvernombud:**\n- Utfylt behandlingsprotokoll (GDPR artikkel 30) for den nye behandlingsaktiviteten\n- Risikovurdering (DPIA om nødvendig) som viser at løsningen ikke innebærer uforholdsmessig risiko for de registrerte\n- Rutiner for avviksmelding ved eventuell sikkerhetsbrudd\n\nDigilist kan bistå med maler for behandlingsprotokoll og risikovurdering tilpasset kommunal bookingvirksomhet.\n\n## Praktisk: hva du må sjekke før go-live\n\nUavhengig av hvilken løsning du vurderer, bør du gå gjennom denne sjekklisten før kontrakten signeres og systemet tas i bruk:\n\n1. **Datalokasjon bekreftet skriftlig**, ikke bare i markedsføringen, men i kontrakten og databehandleravtalen\n2. **Underleverandørliste gjennomgått**, alle aktører som håndterer personopplysninger er identifisert og lokalisert\n3. **Ingen tredjelandsoverføring**, bekreftet at det ikke skjer dataoverføring til land utenfor EØS, verken direkte eller via underleverandører\n4. **Revisjonslogg tilgjengelig**, test at du faktisk kan hente ut logg for en gitt periode og bruker\n5. **Avvikshåndtering dokumentert**, leverandøren har skriftlige rutiner for varsling ved sikkerhetsbrudd, med tidsfrister i henhold til GDPR (72 timer)\n6. **Sletteprosedyrer avklart**, hva skjer med data hvis kontrakten avsluttes? Fristen for sletting skal fremgå av databehandleravtalen\n7. **Personvernombudet involvert**, ikke gå live uten at kommunens personvernombud har fått mulighet til å se gjennom dokumentasjonen\n\nDet er fristende å fremskynde implementeringen når løsningen fungerer godt i demo og brukerne er klare til å ta den i bruk. Men en go-live uten dokumentert compliance kan gi alvorlige konsekvenser, både i form av sanksjoner fra Datatilsynet og tap av tillit fra innbyggere og politisk ledelse.\n\n## Ta kontakt og se compliance-dokumentasjonen\n\nDigilist er bygget for å gjøre nettopp denne prosessen enklere. Vi kan vise deg infrastruktur-arkitekturen, gå gjennom databehandleravtalen punkt for punkt og gi deg dokumentasjonen du trenger for intern godkjenning.\n\nTa kontakt med oss, så setter vi opp en gjennomgang av compliance-dokumentasjonen og datalokasjon-arkitekturen tilpasset din kommunes behov. Det tar én time og gir deg grunnlaget for en trygg anskaffelsesbeslutning.\n';
const __vite_glob_0_16 = '---\nslug: cyberangrep-norske-kommuner-bookingsystem\ntitle: "Cyberangrep mot norske kommuner: bookingsystem i fare?"\ndescription: "Norske kommuner rammes av cyberangrep oftere enn før. Hva betyr trusselbildet for bookingsystemet ditt, og hvilke spørsmål bør CIO stille?"\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["cyberangrep", "ransomware", "kommune", "bookingsystem", "NSM", "kommunal sikkerhet"]\n---\n\nØstre Toten i januar 2021. Akershus fylkeskommune sommeren 2022. Sør-Varanger sent i 2023. Stortinget i 2020 og igjen i 2022. Mønsteret er etablert: norsk offentlig sektor er et legitimt mål for organiserte cyberkriminelle, og kommunene står ofte først i køen fordi de behandler både innbyggerdata og betalinger.\n\nFor en kommunal IT-leder som planlegger en ny bookingplattform er det rimelig å spørre: hva betyr egentlig dette trusselbildet for systemet vi velger?\n\n## Hva trusselaktørene faktisk er ute etter\n\nCyberkriminelle som retter seg mot norske kommuner følger som regel én av tre logikker:\n\n1. **Ransomware mot drift.** Mål: kryptere alt og selge tilbake nøkkelen. Bookingsystem er attraktivt fordi det blokkerer publikumstjenester umiddelbart. Kommunen mister inntekt og innbyggertillit i samme øyeblikk.\n2. **Datatyveri for ekstortion.** Mål: stjele persondata og kreve løsepenger mot at de ikke publiseres. Bookingsystemer inneholder navn, e-post, telefonnummer, betalingsspor, og av og til informasjon om bevegelsesmønstre (når er innbyggeren på idrettshall? på kulturhus?).\n3. **Phishing mot ansatte.** Mål: lure én kommuneansatt til å oppgi passord. Da har angriperen et utgangspunkt for å bevege seg sidelengs i nettverket.\n\nNSMs trusselvurderinger for de siste tre årene har konsistent flagget pkt. 1 og 2 som økende. Ransomware-as-a-service betyr at terskelen for å gjennomføre angrep har sunket, mens betalingsviljen, særlig fra offentlige aktører med kritiske tjenester, har vært stabil.\n\n## Bookingsystem som angrepsflate\n\nEt bookingsystem er en sårbar overflate av flere grunner:\n\n- **Eksponert mot internett.** Innbyggere må kunne booke fra hjemmenettet. Systemet kan ikke gjemmes bak en VPN. Hvert API-endepunkt er en potensiell inngang.\n- **Behandler betaling.** PCI-DSS-krav er strenge, men kompromisset er at en lekket session-token kan oversettes til reell skade.\n- **Knyttet til kommunens identitetssystem.** Hvis bookingsystemet bruker ID-porten korrekt, er dette en styrke. Hvis det bruker eget passord-regime som ikke er FIDO2-kompatibelt, er det en svakhet.\n- **Synlig SLA.** Innbyggere som ikke kommer inn på bookingportalen ringer kommunen samme dag. Det øker betalingspresset i en ransomware-situasjon.\n\n## Hva en moderne plattform faktisk gjør med dette\n\nDigilist er bygget på Convex (managed serverless runtime), med data lagret i Norge og EU. Det betyr at angrepsflaten ser annerledes ut enn for et tradisjonelt selvhostet system:\n\n- **Ingen vedlikeholdsvinduer der vi patcher servere.** Convex og våre databaser oppdateres kontinuerlig av leverandøren, med automatisk failover. En kommune kan ikke selv glemme en sikkerhetsoppdatering.\n- **Hver mutasjon går gjennom revisorspor.** Alt som endrer data (bookinger, betalinger, brukerrettigheter) skrives til en separat audit-tabell som ikke kan slettes av en kompromittert administrator.\n- **Tenant-isolasjon på funksjonsnivå.** En kompromittert konto i én kommune har ingen direkte vei til en annen kommune sin data. Det er ikke et delt skjema med tenant-ID som filter. Det er funksjoner som validerer rettigheter på serversiden ved hvert kall.\n- **ID-porten + BankID for høyverdige handlinger.** Innbyggere logger inn med BankID. Saksbehandlere logger inn med ID-porten. Passordfri innlogging fjerner den vanligste angrepsvektoren.\n\n## Det vi ikke kan love\n\nIngen plattform kan love at den aldri blir angrepet. Det vi kan love er at:\n\n- Vi har ISO 27001 og ISO 27701 fra dag én, og er forberedt på SSA-L 2026.\n- Beredskapsplanen er skrevet, øvd og oppdatert hvert halvår, ikke et word-dokument i en mappe ingen åpner.\n- Data ligger i EU/EØS med backup i samme region.\n- Vi har dedikert en del av roadmapen til penetrasjonstesting og sårbarhetshåndtering. Det er ikke en eksern revisjon én gang i året. Det er et kontinuerlig løp.\n\n## Spørsmål en kommune-CIO bør stille\n\nNår neste anskaffelse kommer:\n\n1. Hvor lagres dataene fysisk, og hvor ligger backupen?\n2. Hva er RPO og RTO ved et katastrofescenario?\n3. Hvilken type pålogging brukes for innbyggere? For saksbehandlere?\n4. Hvordan rapporteres en sikkerhetshendelse til kommunen? Innen hvilken tidsramme?\n5. Hvor ofte gjennomføres penetrasjonstest, og er rapporten tilgjengelig under NDA?\n6. Hvor mange åpne sårbarheter har systemet akkurat nå?\n\nSvaret på det siste spørsmålet er det mest avslørende. Et åpent svar er et godt tegn. Et unnvikende svar er et rødt flagg.\n\n## Veien videre\n\nTrusselbildet kommer til å forverres, ikke forbedres. Norske kommuner som velger plattformer i 2026 og 2027 må anta at angrepet kommer. Spørsmålet er bare når. Det å bygge inn motstandskraft er ikke lenger et pluss, det er en grunnlinje.\n\nVil du vite mer om hvordan Digilist er bygget for å motstå angrep? [Book en demo](#kontakt) eller les videre om [GDPR, ISO 27001 og datalokasjon](/blogg/gdpr-iso-datalokasjon-norge).\n';
const __vite_glob_0_17 = '---\nslug: ddos-ransomware-beredskap-bookingplattform\ntitle: "DDoS og ransomware: beredskap for bookingplattformer"\ndescription: "Hvordan en bookingplattform skal håndtere et angrep eller utfall: RPO/RTO, backup, hendelseskommunikasjon og praktisk beredskapsplan."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["DDoS", "ransomware", "beredskap", "RPO", "RTO", "backup", "kommune", "incident response"]\n---\n\nI anskaffelser av bookingsystem til norske kommuner blir det stadig oftere stilt detaljerte spørsmål om beredskap. Det er en sunn utvikling. Tidligere holdt det å skrive "vi har backup". Nå må svaret være konkret: hvor lenge varer utfallet, hva mister vi av data, og hvor finner innbyggerne informasjon mens systemet er nede?\n\nDenne artikkelen er for kommunens IT-leder eller anskaffelsesansvarlig som vil vite hva de faktisk skal spørre om, og hva et godt svar høres ut som.\n\n## RPO og RTO: de to tallene som teller\n\nTo begreper kommer igjen og igjen i beredskapsdiskusjoner:\n\n- **RPO (Recovery Point Objective):** hvor mye data tåler vi å miste? Hvis siste backup er fra 04:00 i natt og systemet kollapser klokken 14:00, mister vi 10 timer med bookinger. For et kommunalt bookingsystem er det ofte uakseptabelt.\n- **RTO (Recovery Time Objective):** hvor lenge tåler vi å være nede? Et idrettshall-booking som er nede en lørdag morgen koster i tapte arrangementer og frustrerte innbyggere.\n\nDigilist mål:\n- RPO: 0–5 minutter. Vi bruker punkt-i-tid-replikering, ikke nattlig backup.\n- RTO: under 1 time for et regionalt utfall. Under 4 timer for et fullstendig leverandørutfall (failover til alternativ region).\n\nTall som er bedre enn dette koster fort uforholdsmessig mer. Tall som er dårligere kan være forsvarlige for små kommuner med få anlegg, men bør være avklart i kontrakten.\n\n## DDoS: det enkleste angrepet å organisere\n\nDistributed Denial of Service-angrep krever ingen avansert kompetanse. Det finnes booter-tjenester på det åpne nettet som leier ut angrepskapasitet for noen titalls dollar per time. Mål: gjøre tjenesten utilgjengelig for vanlige brukere.\n\nFor et bookingsystem ser et DDoS-angrep ut som plutselig massevis av trafikk mot bookingsidene, ofte i koordinerte bølger. Sluttbrukere får timeout. Saksbehandlere kan ikke logge inn.\n\nForsvar handler om to lag:\n\n1. **Edge-nettverk med automatisk DDoS-mitigation.** Cloudflare, Fastly, Akamai og lignende CDNer absorberer trafikk på kanten av nettet, før det treffer applikasjonen. Digilist bruker en kommersiell CDN med automatisk mitigation aktivert som standard.\n2. **Rate limiting på applikasjonsnivå.** Selv om CDN slipper igjennom mistenkelig trafikk, har applikasjonen sin egen begrensning per IP og per session.\n\nFor en kommune som vurderer leverandør: spør om DDoS-mitigation er inkludert eller en tilleggstjeneste. Et nei på "inkludert" betyr at den første angrepsdagen blir dyr.\n\n## Ransomware: det dyreste angrepet\n\nRansomware er kvalitativt forskjellig fra DDoS. Mens DDoS skader tilgjengelighet, krypterer ransomware data slik at de ikke kan leses uten en nøkkel. Ofte stjeler angriperen dataene først, slik at også selve trusselen om publisering kan brukes for å presse betaling.\n\nForsvaret mot ransomware har tre faser:\n\n### Før: gjør angrepet mindre sannsynlig\n\n- Passordfri pålogging der det er mulig (ID-porten, BankID, FIDO2).\n- Minste rettighet for ansatte. Saksbehandlere skal ikke ha admin-rettigheter.\n- Patch-disiplin. Avhengigheter (npm-pakker, system-pakker) oppdateres kontinuerlig, ikke kvartalsvis.\n- E-post-filtrering. Selv om bookingsystemet selv ikke håndterer e-post, er ansattes e-post den vanligste inngangsvektoren.\n\n### Under: begrens skaden\n\n- Tenant-isolasjon på funksjonsnivå. En kompromittert konto i én kommune skal ikke gi tilgang til en annen.\n- Audit-logg som er separert fra produksjonsdata og ikke kan slettes.\n- Read-replica i annen region, med separat tilgangskontroll. Hvis primær blir kryptert, har vi en uberørt versjon.\n\n### Etter: gjenopprett raskt\n\n- Punkt-i-tid-gjenoppretting til før kompromittering. Ikke bare "siste nattbackup", bokstavelig talt valgfritt øyeblikk innenfor retention.\n- Tydelig hendelsesplan. Hvem ringer hvem? Hvilken informasjon går til Datatilsynet (72-timers fristen ved personvernhendelser)? Hvem snakker med media?\n- Øvelse. Beredskapsplan som aldri er øvd, fungerer ikke når det smeller.\n\n## Hva innbyggeren skal se hvis systemet er nede\n\nDet er én ting som ofte glemmes: hva ser brukeren mens systemet er nede?\n\nStandard status quo i norsk offentlig sektor er en hvit feilside med en kryptisk feilmelding eller en timeout. Det er den dårligste mulige opplevelsen.\n\nDigilist har et separat status-domene (status.digilist.no) som er hostet uavhengig av hovedplattformen. Hvis selve plattformen er nede, viser statussiden:\n- Hva som er nede og hva som fortsatt fungerer.\n- Estimert gjenopprettingstid.\n- Hvor brukeren skal henvende seg i mellomtiden.\n\nDet er den enkleste tilliten-bygger en plattform kan ha.\n\n## Beredskapsplan: sjekkliste for anskaffelse\n\nDet en kommune bør kreve dokumentert:\n\n1. RPO og RTO som tall, ikke som ord.\n2. Hvor backup ligger (region, leverandør).\n3. Hvor ofte gjenopprettings-test gjennomføres.\n4. Hvilken DDoS-mitigation som er aktiv.\n5. Hvordan en sikkerhetshendelse rapporteres til kommunen (kanal + tidsfrist).\n6. Hvilken status-side innbyggere kan sjekke.\n7. Når beredskapsplanen sist ble øvd.\n\nEt leverandørsvar som inneholder konkrete tall og hendelsesreferanser er et godt svar. Et leverandørsvar som inneholder mest "vi tar sikkerhet på alvor" er ikke et svar.\n\n## Veien videre\n\nBeredskap er ikke en bryter man slår på når katastrofen kommer. Det er et kontinuerlig arbeid med øvelse, dokumentasjon og forbedring. Et bookingsystem som er bygget med beredskap som premiss er enklere å integrere, enklere å revidere, og mye enklere å forsvare når noe går galt.\n\nVil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet, eller [Phishing-resistente innlogginger](/blogg/phishing-resistente-innlogginger-idporten-bankid) for det enkleste forsvarsgrepet.\n';
const __vite_glob_0_18 = '---\nslug: digdir-designsystemet-kommunal-bookingplattform\ntitle: "Digdir Designsystemet: hvorfor det er et must i offentlig sektor"\ndescription: "Designsystemet er Norges offisielle byggekloss-bibliotek for offentlige digitale tjenester, og grunnlaget for tilliten Digilist bygger på."\ndate: 2026-05-17\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 9\ntag: "Designsystem"\ncover: "/images/blog/digdir_designsystemet_hero_no.webp"\nkeywords: ["Digdir Designsystemet", "designsystemet.no", "universell utforming", "kommunal digitalisering", "offentlig sektor"]\n---\n\nDet er én ting alle norske kommuner møter når de skal anskaffe en digital tjeneste: behovet for at innbyggerne kjenner seg igjen. Knapper, skjemaer, varsler, søkefelt og statusmeldinger må oppleves som _norske offentlige_, ikke som en internasjonal SaaS-mal med Google Translate. Det er nettopp denne gjenkjennelsen [Digdir Designsystemet](https://designsystemet.no/no) leverer, og det er grunnen til at Digilist er bygget på det fra første linje.\n\n## Hva Digdir Designsystemet faktisk er\n\nDesignsystemet, eid og forvaltet av Digitaliseringsdirektoratet (Digdir) i samarbeid med Skatteetaten, NAV, Brønnøysundregistrene og en rekke kommuner, er et åpent og delt komponentbibliotek for offentlig sektor. Det består av tre lag:\n\n1. **Designtokens:** farger, typografi, avstand og elevasjon, definert som CSS-variabler og JSON-skjemaer. Hver token er WCAG-testet for kontrast og lesbarhet.\n2. **Komponenter:** React- og web-komponenter (`@digdir/designsystemet-react`) for knapper, skjemafelt, dialoger, navigasjon, tabeller og varsler. Hver komponent er pre-testet for skjermlesere, tastaturnavigasjon og hjelpetekst.\n3. **Mønstre og retningslinjer:** dokumentasjon av hvordan komponentene settes sammen til hele tjenester, med eksempler fra Min side, Altinn og Helsenorge.\n\nHele systemet er publisert under [Apache 2.0-lisens](https://github.com/digdir/designsystemet) og oppdateres kontinuerlig av et team på tvers av etatene. Det er, med andre ord, en infrastruktur, ikke et tema.\n\n## Hvorfor Digilist baserer seg på det\n\nDa vi begynte å designe Digilist for kommuner, vurderte vi tre alternativer: et eget designspråk, et hodeløst bibliotek som shadcn/ui, eller Digdir Designsystemet. Vi landet entydig på Digdir, av fire grunner.\n\n### 1. Innbyggerne kjenner det igjen, uten å vite det\n\nDet er ingen kommunalt ansatt som tenker «åh, dette er Digdirs `Button`-komponent». Men innbyggerne kjenner igjen avstanden, fokusringen, knappetekstens linjehøyde, måten en feilmelding sklir inn på, og at varselet om obligatorisk felt har riktig fargevalør. Det skaper en _stillere_ tillit enn noe markedsføringsmateriell kan: kommunens digitale tjenester ser ut som kommunens digitale tjenester. Ikke som en startup-pitch, og ikke som en oversatt Calendly.\n\n### 2. Universell utforming er innebygd, ikke påklistret\n\nLikestillings- og diskrimineringsloven § 17a, kombinert med forskrift om universell utforming av IKT, gjør WCAG 2.1 AA pliktig for alle norske offentlige tjenester. Digdir-komponentene er testet mot kravene fra starten: kontrast, focus-visible, ARIA-merking, tastaturnavigasjon og skjermleserkompatibilitet er ikke noe utviklere må huske å legge til. Det er en del av komponentens kontrakt. Den dagen WCAG 2.2 blir pålagt, oppdaterer Digdir-teamet komponentene, og Digilist arver det automatisk i neste utgivelse.\n\n### 3. Det reduserer leverandøravhengighet\n\nEn kommune som har valgt et bookingsystem på Digdir Designsystemet kan, i prinsippet, kreve at neste leverandør gjenbruker samme designspråk. Det reduserer kostnaden ved bytte, gjør integrasjoner mer forutsigbare, og skaper et marked der leverandørene konkurrerer på funksjonalitet og pris, ikke på låsteknologi. Det er en av få teknologiske avgjørelser som styrker, snarere enn svekker, kommunens forhandlingsposisjon over tid.\n\n### 4. Det dokumenterer seg selv overfor revisor\n\nNår kommunens IT-revisjon spør «hvordan er tilgjengelighetskravene oppfylt?», kan svaret være kort: «Plattformen bruker Digdir Designsystemet. Her er sertifiseringsrapporten og lenken til Digdirs egne tester.» Det er en helt annen samtale enn å forklare hvorfor utvikleren mente at `border-radius: 0.375rem` var greit nok.\n\n## Hva det betyr i praksis for en booking\n\nTa et helt vanlig scenario: en idrettslagskasserer som søker om sesongleie. Skjemaet hun møter består av Digdir-komponenter: `Combobox` for valg av anlegg, `DatePicker` for tidsrom, `Textfield` for organisasjonsnummer (med innebygd BRREG-lookup), `Checkbox` for bekreftelse av leiebetingelser, `Button` for innsending. Hvert felt har riktig label-plassering, riktig fokusrekkefølge, og riktig feilmelding når noe mangler.\n\nNår hun sender, vises en `Alert` i suksessfargen, samme grønntone som Min side bruker. Når Digdir oppdaterer sine kontrastregler, oppdateres Digilists alert automatisk ved neste deploy. Hun vil aldri merke det, men hun vil heller aldri møte et grensesnitt som plutselig føles fremmed.\n\n## Hva som ligger utenfor designsystemet\n\nDigdir Designsystemet løser _grensesnittet_, ikke _løsningen_. Det forteller deg ikke hvordan du strukturerer en sesongleiefordeling, hvordan du modellerer en kommunal prisstruktur eller hvordan du implementerer dobbeltbookingsbeskyttelse. Det er Digilists jobb, og en betydelig del av plattformens verdi. Men det forteller deg hvordan du _viser_ resultatet av disse beslutningene på en måte som er trygg, lesbar og lovlig.\n\n## En anbefaling til kommunale anskaffere\n\nI tilbudsforespørsler bør vi se Digdir Designsystemet (eller dokumentert ekvivalens) som et eksplisitt minstekrav. Det er den enkleste måten å sikre seg mot leverandører som bygger «raskt», men leverer en tjeneste som etter to års drift må reorganiseres for tilgjengelighetskrav, branding eller integrasjoner. Det er også den enkleste måten å gjøre rom for at neste anskaffelse blir billigere, ikke dyrere, enn forrige.\n\nDigilist er bygget på Digdir Designsystemet fordi vi mener offentlig sektor fortjener verktøy som er gjenkjennelige, etterprøvbare og bytteklare. Det er ikke et komparativt fortrinn. Det er et faglig minimum.\n\n';
const __vite_glob_0_19 = '---\nslug: digilist-mobil-app\ntitle: "Digilist mobil: booking i lomma, drift på vaktrommet"\ndescription: "Innbyggere booker fra mobil. Driftsroller varsles på mobil. Saksbehandlere signerer fra mobil. Digilists native iOS- og Android-apper er bygget for jobben."\ndate: 2026-05-24\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Mobil"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["mobil app", "React Native", "iOS", "Android", "push-varsler", "Digilist app"]\n---\n\nVi vurderte tre veier til mobil før vi tok beslutningen: en responsiv webapp, en Capacitor- eller PWA-wrap, eller native React Native. Vi valgte native, og det er ikke et tilfeldig teknisk valg. Det handler om hva mobilen brukes til i en kommunal bookinghverdag.\n\n## Tre veldig forskjellige mobilbrukere\n\nEn kommunal bookingplattform har tre mobilroller som har lite til felles, men deler samme telefon:\n\n### 1. Innbyggeren\n\nHun booker idrettshallen til datterens bursdagsfest fra kassakøen på COOP. Hun har 90 sekunder. Den native appen leverer:\n\n- **Vipps via mobilnavigasjon:** ikke en redirect, men direkte handover med fingeravtrykk-bekreftelse.\n- **Apple Wallet / Google Wallet-integrasjon:** bekreftelsen lagres som et pass med booking-detaljer og digital nøkkel-QR-kode.\n- **Push-varsler** ved bekreftelse, påminnelse 24 timer før, og dersom noe endres på anlegget.\n\n### 2. Driftsrollen\n\nVaktmesteren i Lier kommune får varsel klokken 17:15 om at en booking starter 18:00 og krever oppvarming. På web ville hun måtte logge inn, navigere, lese. På mobilen:\n\n- **Push-varsel** med all info: hvilket anlegg, hvilket rom, hvem som er booker, hvilket utstyr som er bestilt.\n- **«Bekreft klar»**-knapp direkte fra varselet uten å åpne appen.\n- **Geofenced check-in:** appen vet når hun er på anlegget og logger oppmøtetid automatisk.\n\nNative gjør dette mulig på en måte web aldri har klart konsistent: bakgrunnsvarsler som faktisk kommer fram, posisjonsbasert utløsing, og widgets som viser dagens bookinger uten å åpne appen.\n\n### 3. Saksbehandleren\n\nKulturkonsulenten godkjenner sesongleieavtaler på bussen mellom møter. Native gir henne:\n\n- **Biometrisk signering** av godkjenninger: Face ID / fingeravtrykk binder beslutningen til personen, ikke bare til kontoen.\n- **Offline-buffer:** godkjenninger som tas i tunellen lagres lokalt og synkroniseres når signalet kommer tilbake.\n- **Kommando-snarveier:** saksbehandleren kan i samme rad sveipe høyre for «godkjenn med standardvilkår» eller venstre for «avvis med begrunnelse».\n\n## Hvorfor native, ikke web-wrap\n\nCapacitor og Cordova er praktiske for å gjenbruke webkoden. De har én avgjørende svakhet: ytelsen og innebygde mobilinteraksjoner er en hage av kompromisser. For en bookingplattform er det tre ting som ikke kan kompromiteres:\n\n1. **Push-varselpålitelighet.** APNs og FCM håndteres direkte av native runtime. Web push fungerer, men er mindre forutsigbart, særlig på iOS.\n2. **Vipps-handover.** Native deep-linking gir glatt veksling mellom Digilist og Vipps-appen. Web-wraps må gå gjennom Safari/Chrome med ekstra friksjon.\n3. **Biometri og Secure Enclave.** Saksbehandlerens signatur må kunne lagres i telefonens sikkerhetsmodul, ikke i en `localStorage`-kopi som er sårbar for nettlesertilgang.\n\nDigilist-appene er bygget med [React Native 0.74](https://reactnative.dev/), publisert i App Store og Google Play under `no.digilist.app` (bundle-ID, planlagt App Store + Google Play). UI-komponentene er en parallell (_ikke_ en kopi) til web-systemet, designet for tommelnavigasjon og mindre skjermflate.\n\n## Når app, når web\n\nVi tror ikke alle skal bruke appen. For mange innbyggere er web like enkelt, eller enklere, fordi det ikke krever installasjon for én booking i året. Dette er våre anbefalinger:\n\n- **App for driftsroller.** Vaktmestere, renhold og vektere trenger push-varsler og rask check-in. Web er for tregt.\n- **App for saksbehandlere som er mye i felten.** Kulturkonsulenter, anleggsledere, vaktansvarlige som ikke sitter ved skrivebordet.\n- **Web for innbyggere.** De som booker en eller to ganger i året klarer seg utmerket med en mobilvennlig web. Hvis de blir hyppige brukere, vil de installere appen selv.\n- **App for organisasjoner med sesongleie.** Idrettslag og kulturkorps som booker uke etter uke har glede av appens widget og hurtigfunksjoner.\n\n## Sikkerhet på toppen\n\nNative gir mer enn ytelse. Hver app-installasjon binder seg til enhetens secure enclave, og en utlogging på web logger ikke automatisk ut app-økten. Det er en separat sikkerhetspolicy som kommunen kan styre via Mobile Device Management hvis ansatte bruker arbeidstelefoner. Audit-loggen registrerer enhets-ID, biometrisk autentiseringsstatus og posisjonsdata når geofencing er aktivt, slik at en revisor kan rekonstruere ikke bare _hva_ saksbehandleren godkjente, men _hvor_ og _hvordan_.\n\n';
const __vite_glob_0_20 = '---\nslug: en-plattform-mot-fem-verktoy\ntitle: "Én plattform vs. fem verktøy: den skjulte kostnaden"\ndescription: "Bookingsystem, kalender, betaling, regnskap, varsling. Hvert system fungerer isolert, men friksjonen oppstår mellom dem. Det er der Digilist løser problemet."\ndate: 2026-05-20\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Plattform"\ncover: "/images/blog/en_plattform_hero_no.webp"\nkeywords: ["én plattform", "integrasjoner", "kommunal driftskostnad", "single source of truth", "sambruk"]\n---\n\nPå papiret kan en kommune dekke et bookingbehov med fem velkjente verktøy: en bookingkalender, en betalingsløsning, et regnskapssystem, et varslingsverktøy, og en adgangskontroll. Hver av dem er bra på det den gjør. Hver av dem har egne integrasjoner. Hver av dem har egen brukerstøtte. Det er kombinasjonen, og det som skjer _mellom_ dem, som koster.\n\n## Det åpenbare problemet: dobbeltinntastinger\n\nNår Bookingsystem A og Regnskapssystem B er separate, må noen, typisk en saksbehandler, taste inn samme booking to ganger. Tre, hvis adgangskontroll C også må ha listen over hvem som skal slippes inn på lørdag klokken 18. Multiplikasjonsregelen er ubarmhjertig: ti bookinger om dagen × tre systemer × fem minutter per inntasting = 150 minutter daglig dobbeltarbeid, eller seks ukers arbeid per år per person.\n\nMen det er ikke det dyreste.\n\n## Det skjulte problemet: synkroniseringsfeil\n\nHver synkronisering mellom to systemer har en feilrate. Den er gjerne lav, kanskje 1 %, men siden synkroniseringen kjører tusenvis av ganger i året, blir antallet feil betydelig. Tre vanlige varianter:\n\n1. **Bookingen finnes, men betalingen mangler.** Innbyggeren bekreftet via Vipps, men betalingstransaksjonen ble aldri overført til regnskapssystemet. Oppdages tre måneder senere ved manuell avstemming.\n2. **Betalingen finnes, men bookingen er kansellert.** Innbyggeren ringte og avlyste, saksbehandleren registrerte det i bookingsystemet, men avlysningen ble aldri synket til regnskapet. Refusjon må behandles manuelt.\n3. **Adgangen åpnes, men bookingen er flyttet.** Vaktmesteren registrerte at en booking ble flyttet fra lørdag til søndag, men adgangskontrollen ble ikke oppdatert. Innbygger står utenfor med kode som ikke virker.\n\nHver av disse feilene koster i tid: å oppdage dem, å forklare dem til innbyggeren, å rette dem opp. Verre: hver av dem skader tilliten til kommunens digitale tjenester.\n\n## Én plattform = én sannhet\n\nDigilist er bygget på prinsippet om én datakilde, ikke fem speilkopier. En booking er én post som inneholder alt: tidsslot, betalingsstatus, avtalevilkår, varslingshistorikk, adgangsstatus, eventuelle refusjoner. Når kulturkonsulenten åpner saksbehandlerverktøyet og ser bookingen, ser hun _hele_ statusen, ikke fem fragmenter.\n\nDet tekniske grunnlaget er en hendelsesbuss (outbox-pattern) som garanterer at hver tilstandsendring distribueres transaksjonelt: booking lagres, varsler sendes, ledger oppdateres, adgang aktiveres. Alt eller ingenting. Det er forskjellen mellom en velrigget kommunal tjeneste og et lappeteppe som krever et menneske til å holde det sammen.\n\n## Hva med integrasjoner?\n\n«Én plattform» betyr ikke at Digilist erstatter alt. Det betyr at Digilist er _kjerne_-bookingen, og at integrasjonene utgår fra ett sted med ett dataskjema. Eksempler:\n\n- **Vipps og Stripe** kalles av Digilists betalingsmodul. Statusen lagres på _bookingen_, ikke på «en betaling i et separat system».\n- **Visma / Tripletex / Fiken / PowerOffice / DNB Regnskap** mottar bilag fra Digilist når en betaling settles. Avstemming kjøres av Digilist, ikke av kommunen.\n- **Salto KS adgangskontroll** mottar adgangsplan fra Digilist når en booking bekreftes, og deaktiveres når bookingen avsluttes.\n- **EHF / Peppol** sendes fra Digilist når en faktura genereres for lag og foreninger.\n- **Microsoft 365 Outlook** synkroniserer kommunale møterom slik at saksbehandlere kan se en kollega har booket et rom fra Outlook _eller_ Digilist: samme dataposten, to grensesnitt.\n\nForskjellen er at i en «fem verktøy»-arkitektur eier hvert verktøy sitt eget data, og kommunen må vedlikeholde integrasjonene. I Digilist eier _bookingen_ dataet, og integrasjonene er ren _utlevering_ av endringer.\n\n## Hvorfor det koster mindre, ikke mer\n\n«Én plattform» klinger ofte som «én leverandørbinding», og det er en legitim bekymring. Men den faktiske kostnaden ved binding er ofte lavere enn den åpenbare kostnaden ved manuell avstemming, dobbelinntastinger og synkroniseringsfeil. Tre praktiske grunner:\n\n1. **Lavere driftskostnad per booking.** Færre manuelle korreksjoner, færre samtaler til servicetorg, færre refusjoner som må behandles manuelt.\n2. **Lavere kompetansekrav.** Saksbehandlerne lærer ett verktøy, ikke fem.\n3. **Lavere revisjonskostnad.** IT-revisor ser ett system, ett auditspor, én tilgangskontroll.\n\nDen minst snakkede gevinsten: når kommunen skal bytte leverandør om åtte år, er én plattform én migrasjon, ikke fem. Det er det motsatte av binding. Det er _frigjøring_.\n\n';
const __vite_glob_0_21 = '---\nslug: faktura-refusjon-avstemming\ntitle: "Fakturering, refusjoner og avstemming: økonomimotoren i Digilist"\ndescription: "Hvordan en booking blir til en faktura, hvordan en kansellering blir til en refusjon, og hvordan kommunens regnskap får tallene som stemmer, uten Excel."\ndate: 2026-06-01\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Økonomi"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["fakturering", "EHF", "Peppol", "refusjon", "avstemming", "regnskap", "Visma Tripletex Fiken PowerOffice", "økonomi kommunal booking"]\n---\n\nFor en bookings­plattform er økonomi­motoren den som skiller seriøse løsninger fra hobby­prosjekter. Det er enkelt å lage en booking. Det er hardere å sørge for at hver booking blir til riktig faktura, hver kansellering til riktig refusjon, og hver krone som beveger seg lander i kommunens regnskap med riktig konto­kode.\n\nDigilist har tre lag i økonomi­motoren: **innkreving** (hvor pengene kommer fra), **fakturering** (dokumentet som signaliserer hva som skylde­s), og **avstemming** (hvor pengene havner og hvordan regnskapet ser det).\n\n## I. Innkreving: fire kanaler\n\n**Vipps.** Standardvalg for privat­personer. Push-melding til Vipps-appen, kunden bekrefter, vi får oppgjør på 2–4 sekunder. Refusjon med ett klikk fra admin. Vippsene avregnes til kommunens Vipps-konto direkte.\n\n**Stripe Connect.** Kort­betaling for kunder som ikke har Vipps eller fra utland. Beløpet trekkes fra kortet, sitter på Digilists Stripe Connect-platform­konto i et øyeblikk, og betales ut til kommunens bank­konto neste virke­dag. Avgiftene er Stripes standard (1.4% + 2 kr for europeiske kort).\n\n**EHF/Peppol-faktura.** For organisasjons­kunder (lag, bedrifter). Kunden booker, faktura sendes via Peppol-nettverket til deres EHF-mottak. Forfall typisk 14 eller 30 dager. Vi varsler om forfall, men inkasso håndteres av kommunens egen rutine.\n\n**Manuell faktura.** For tilfeller der kunden ikke har EHF-mottak (smårere lag, privat­personer som velger faktura). PDF-faktura sendes på e-post med KID-nummer. Innbetalinger spores via OCR-fil fra banken.\n\nKommunen velger hvilke kanaler som tilbys per anlegg eller per kundetype. Et selskaps­lokale på lørdag: Vipps og kort. En idretts­hall til Skien IF: EHF. En sesong­leie til en pensjonist­forening: manuell faktura.\n\n## II. Faktura­generering\n\nHver booking har et faktura­grunnlag. Grunnlaget inneholder:\n\n- Linjer (lokale, time­pris × antall timer, eventuelle tillegg)\n- MVA-håndtering (kommunale tjenester ofte unntatt, men ikke alltid)\n- Konto­kode (matchet til kommunens kontoplan)\n- Kostnads­sted (anleggets ansvarskode)\n- Periode (hvilken regnskaps­periode hører dette til)\n\nFaktura­grunnlaget genereres automatisk når en booking bekreftes. Det går videre til faktura (enten direkte til EHF, eller til en PDF-faktura) eller til den valgte regnskaps­integrasjonen (se under).\n\nVi støtter også **forskudds­fakturering** (kunde betaler ved booking, ikke ved bruk), **etter­fakturering** (kunde betaler etter bruk, typisk for sesong­leie), og **delt fakturering** (deposit forskudd, sluttoppgjør etter).\n\n## III. Refusjoner\n\nRefusjoner er det enkleste å gjøre feil i et bookings­system. Vi har fokusert på å gjøre det enkelt riktig.\n\n**Auto-refusjon.** Hvis kansellering skjer innenfor regelens grense (typisk 14 eller 7 dager før), refunderes automatisk når saks­behandler god­kjenner kanselleringen.\n\n**Delvis refusjon.** Hvis kansellerings­regelen sier «80% refunderes hvis innen 7 dager», beregner plattformen automatisk beløpet og refunderer det. Restbeløpet blir igjen som inntekt.\n\n**Refusjons­sporing.** Hver refusjon har sitt eget revisjons­spor: hvem god­kjente, hvilken regel som gjaldt, hvilket beløp, hvilken kanal det gikk via, hva kunden ble fortalt.\n\n**Cross-kanal refusjon.** Betalte med Vipps, men ønsker refusjon til bankk­onto? Vi støtter manuell over­føring og logger den tilsvarende. Brukes sjelden. Vipps-til-Vipps er standard.\n\n## IV. Regnskaps­integrasjoner\n\nManuell over­føring av tall fra bookings­system til regnskap er ikke bare arbeid. Det er en feilkilde. Digilist sender data direkte til:\n\n- **Visma eAccounting:** den vanligste i norske kommuner. Faktura­grunnlag, inn­betalinger, refusjoner pushes via API.\n- **Tripletex:** populært for selskaps­lokaler og kommunale foretak.\n- **Fiken:** for mindre utleiere.\n- **PowerOffice Go:** for kommuner som har den.\n- **DNB Regnskap:** for kunder i DNB-økosystemet.\n- **EHF/Peppol direkte:** uten å gå via et regnskaps­system, hvis kommunen ikke har en av de overnevnte.\n\nFor hver integrasjon mapper vi:\n\n- Konto­plan-koder (debet og kredit)\n- Kostnads­steder (per anlegg eller etat)\n- MVA-koder (per produkt­type)\n- Kunde­numre (oppslag mot kommunens kunde­register)\n\nKonfigurasjonen gjøres én gang under onboarding. Etter det er bookings-til-regnskap-flyten autonom.\n\n## V. Avstemming\n\nAvstemming er der det blir litt komplisert: penger som kommer inn må matches mot fakturaer som er sendt, og restanser må følges opp. Digilist gjør tre ting for å holde regnskaps­avdelingen i god humør:\n\n**Real-time dashboard.** Forecast på inntekter denne måneden, restanser, refusjoner, gjenstående faktura­grunnlag som ikke er prosessert. Det dashboardet er det første en kommunal øko­nomi­ansvarlig spør om i demoen.\n\n**OCR-import.** Kommunens bank sender en daglig OCR-fil med innbetalinger. Digilist matcher den mot åpne fakturaer og merker dem som betalt. Manuell håndtering trengs kun for mismatch, typisk når en kunde har betalt feil beløp.\n\n**Måneds­rapporter.** Den 1. i hver måned genereres en rapport over forrige måneds inntekter per anlegg, refusjoner, restanser, og MVA-spesifikasjon. Klar til revisor.\n\n## Hva sliter et bookings­system mest med?\n\nKomplekse betalings­flyter med kombinasjoner. Eksempel: et lag bestiller sesong­leie for hele vinteren, betaler 30% forskudd nå, resten faktureres månedlig, og hvis de avlyser en enkelt­time refunderes time­pris automatisk fra forskuddet.\n\nVi har bygd modulen som håndterer dette med [Pricing v2-arkitekturen](/blogg/somlos-betaling-vipps-ehf) som beskrives mer detaljert der. Hver bookings-line-item har sin egen livssyklus, kan flyttes mellom forskudd og etter­fakturering, og inntekts­føres på riktig periode automatisk.\n\nDet er ikke magisk. Det er disiplinert datamodellering, og det er forskjellen mellom et bookings­system som passer til en mat­butikk og et som tåler en kommune.\n\n';
const __vite_glob_0_22 = '---\nslug: foresporsel-chat-kommunikasjon\ntitle: "Forespørsel og chat: leietaker og utleier i Digilist"\ndescription: "To kanaler, samme dataspor: en strukturert forespørsel for nye bookinger, og en samtaletråd per booking for alt etterpå. Ingen tapte e-poster, ingen siloer."\ndate: 2026-05-28\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Kommunikasjon"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["forespørsel", "chat", "kommunikasjon", "samtaletråd", "booking inquiry", "Digilist messaging"]\n---\n\n«Kan vi snakke om en booking?» er fortsatt det vanligste spørs­målet en leietaker stiller. Noen ganger handler det om en endring. Andre ganger om en kapasitets­avklaring før de bestiller. Atter andre om et spesielt arrangement som ikke helt passer i standard­bookings­flyten.\n\nDigilist deler dette i to klare flyter: **forespørsel** (før en booking finnes) og **chat** (etter at en booking finnes). Begge ligger som samtaletråder i plattformen, ikke i noens e-postinnboks.\n\n## Forespørsel: strukturert henvendelse før booking\n\nPå hvert utleieobjekt finnes knappen «Send forespørsel». Den åpner et skjema med:\n\n- **Hva slags arrangement?** (privat selskap, møte, trening, kurs, annet)\n- **Anslått antall deltakere**\n- **Ønsket dato og tid** (med kalender­hjelp som viser tilgjengelighet)\n- **Spesielle behov?** (rigging, AV-utstyr, catering, parkering)\n- **Kontakt­informasjon**\n\nNår forespørselen sendes, lander den i saks­behandlerens innboks som en uvanlig henvendelse, ikke en bookings­forespørsel som krever god­kjenning av en eksisterende booking, men en åpen samtale før det er noen booking i det hele tatt.\n\nSaksbehandleren kan svare med:\n\n- En direkte bekreftelse («Ja, det går fint. Vil du booke nå?» med lenke til prefylt bookings­skjema)\n- En motforespørsel («Vi har plass torsdag istedenfor onsdag. Passer det?»)\n- Et avslag med begrunnelse\n- Eller bare flere spørsmål via samtaletråden\n\nHele utvekslingen ligger lagret. Når en booking til slutt opprettes, kobles forespørselen automatisk til bookingen som «opphavet».\n\n## Chat: samtaletråd per booking\n\nNår en booking eksisterer, har den sin egen samtaletråd. Både leietaker og utleier ser:\n\n- Innledende booking­detaljer\n- Status­endringer (god­kjent, endret, kansellert)\n- Meldinger frem og tilbake\n- Tilkoblede dokumenter (kontrakter, kvitteringer, vedlegg)\n\nLeietaker ser tråden via Min Side. Utleier ser den på bookingen i admin. Begge får varsel (e-post som standard, SMS hvis aktivert) når den andre sender en melding.\n\nHva slags meldinger? «Vi blir to ekstra personer.» «Kan vi komme inn 30 minutter tidligere for å rigge?» «Hvor er parkering?» «Bekreftelse på at vi fikk depositum tilbake?» Alt det som tidligere gikk via personlig e-post og raskt forsvant ut av syne.\n\n## Hvorfor ikke bare e-post?\n\nE-post fungerer fint for én person og en enkelt samtale. Den faller fra hverandre når:\n\n- Flere saks­behandlere må bytte på å svare (tråden er låst til én innboks)\n- Lederen vil se status på alle pågående saker (det krever tilgang til 12 forskjellige innbokser)\n- Du må finne tilbake til hva som ble avtalt for seks måneder siden (e-poster er slettet, søk­bare, eller arkivert ulikt)\n- Du skal demonstrere overfor revisor at riktig prosedyre ble fulgt (det finnes ikke noe spor av regelen, bare en e-post)\n\nNår kommunikasjonen lever på selve bookingen er den:\n\n- **Tilgjengelig for vikarer** uten å gi tilgang til personlige innbokser\n- **Sporbar:** hver melding tids­stemplet, ingen «den e-posten ble nok slettet»\n- **Søkbar på tvers:** vis meg alle samtaler med Skien IF siste år\n- **Knyttet til datavarmen:** du ser meldingen i kontekst av bookingen, ikke som en abstrakt e-postkjede\n\n## Hva med eksterne kanaler?\n\nTelefon og personlig e-post forsvinner ikke. Men i Digilist-modellen brukes de som inn­gangs­punkter, ikke som arbeidsverktøy. Får du en telefon­samtale om en booking? Opprett en notat i samtaletråden («Telefonsamtale 14. mai: avtalt to ekstra timer»). Får du en personlig e-post? Lim teksten inn i tråden.\n\nPå den måten samles all kontekst i samme datastruktur, uansett hvor den startet.\n\n## Sikkerhet og personvern\n\nSamtaletråder lagres kryptert. Personidentifiserende informasjon (PII) som telefonn­ummer og e-post­adresse vises kun til personer med rolle som krever det. Når en kunde ber om å bli slettet etter GDPR, anonymiseres samtale­trådene. Innholdet beholdes for revisjons­spor, men koblingen til personen fjernes.\n\n## I praksis: én jobb mindre\n\nSaks­behandlere som har gått over fra e-post-basert kommunikasjon til Digilist sier oftest at det merkes på to ting: telefonen ringer mindre fordi leietakerne ser status selv i Min Side, og man slutter å bruke morgenen på å lete etter «hva ble det egentlig avtalt der?». Det er en liten endring i hverdagen som blir til en stor endring over et år.\n\n';
const __vite_glob_0_23 = '---\nslug: gdpr-iso-datalokasjon-norge\ntitle: "GDPR, ISO 27001 og datalokasjon: hva kommuner må vite"\ndescription: "Norske kommuner stiller stadig høyere krav til persondata. Hva datalokasjon i Norge og EU dekker, og hva sertifiseringer faktisk ikke gjør."\ndate: 2026-05-10\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Samsvar"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["GDPR", "ISO 27001", "datalokasjon", "personvern", "kommune", "SaaS"]\n---\n\nNorske kommuner som bytter ut interne fagsystemer mot SaaS-plattformer møter en sjekkliste av begreper: GDPR, ISO 27001, ISO 27701, databehandleravtale, dataregister, datalokasjon, schrems II. Listen kan virke skremmende, men kravene henger sammen, og en leverandør som tar dem på alvor kan vise nøyaktig hvordan hver enkelt del er løst.\n\n## Hvorfor datalokasjon er det første spørsmålet\n\nNorske kommuner behandler personopplysninger om innbyggere, ansatte og foreninger. GDPR-artikkel 44 og påfølgende artikler regulerer overføring av personopplysninger ut av EØS. Etter Schrems II-dommen (2020) er det i praksis svært vanskelig å overføre personopplysninger til USA, selv via standardklausuler, uten ytterligere risikobegrensende tiltak.\n\nFor SaaS-tjenester betyr dette tre praktiske krav:\n\n1. **Data lagres i EU/EØS.** Helst i Norge for å unngå selv minimal kompleksitet rundt overføring.\n2. **Backup og redundans er også innenfor EU/EØS.** Det hjelper ikke at primærdata ligger i Oslo hvis backup går til AWS US-East.\n3. **Underleverandører er kartlagt.** Kommunen må vite hvilke tredjeparts-leverandører som behandler data: Stripe, Vipps, e-postutsender osv.\n\nDigilist lagrer all kundedata i Norge og EU. Convex-instansen er hostet i EU-regioner, og PostgreSQL-clustre kjører i Norge eller EU. Backup følger samme regel.\n\n## ISO 27001: hva sertifiseringen faktisk dekker\n\nISO 27001 er en standard for informasjonssikkerhetsstyringssystem (ISMS). Sertifiseringen betyr at en uavhengig revisor har verifisert at organisasjonen:\n\n- Har dokumentert sikkerhetspolicyer og prosedyrer\n- Identifiserer og behandler risiko systematisk\n- Har tilgangsstyring, logging og hendelseshåndtering\n- Har avtaler med underleverandører som dekker sikkerhetskrav\n- Gjennomfører regelmessige revisjoner og forbedrer kontinuerlig\n\n**Det ISO 27001 ikke alltid betyr:** at hver enkelt komponent i tjenesten er sikker. Sertifiseringen er om _systemet_ for å håndtere sikkerhet, ikke om _produktet_ i seg selv. En grundig kommune bør derfor be om både sertifikatet OG penetrasjonstestrapporter for selve produktet.\n\n## ISO 27701: personvernsutvidelsen\n\nISO 27701 utvider ISO 27001 med spesifikke personvernkontroller: kartlegging av personopplysningsbehandling, registreredes rettigheter, samtykkehåndtering og databehandleravtaler. For en SaaS-leverandør som behandler kommunale persondata er ISO 27701 et tydelig signal om personvernmodenhet.\n\nDigilist er sertifisert mot både ISO 27001 og ISO 27701.\n\n## Databehandleravtale (DPA): det viktigste dokumentet\n\nNår kommunen tar i bruk en SaaS-tjeneste, blir kommunen behandlingsansvarlig og SaaS-leverandøren databehandler. GDPR krever en skriftlig databehandleravtale (DPA) som regulerer:\n\n- Formål med behandlingen\n- Type personopplysninger som behandles\n- Varighet av behandlingen\n- Sikkerhetstiltak\n- Underdatabehandlere (sub-processors)\n- Plikter ved sikkerhetsbrudd og innsynsbegjæringer\n- Sletting eller tilbakelevering av data ved avslutning\n\nDigilists standard DPA er tilgjengelig før kontraktsinngåelse, ikke etter. Det er et tegn å være oppmerksom på: en leverandør som «sender DPA senere» har sjelden tenkt grundig gjennom personvern.\n\n## Dataregister og rett til sletting\n\nGDPR krever at kommunen som behandlingsansvarlig har oversikt over hvilke personopplysninger som behandles, hvor de er, og kan slette dem på forespørsel.\n\nFor Digilist betyr dette praktisk:\n\n- Hver innbygger har et innbyggerprofil-objekt som inneholder alle deres data\n- Sletting på forespørsel går gjennom et eget endepunkt som rydder data fra alle tabeller\n- Audit-loggen anonymiseres (ikke slettes: den må bevares for andre formål) etter rettferdig periode\n\n## Audit-logg og etterprøvbarhet\n\nGDPR krever at behandlingsansvarlig kan dokumentere _hva som er gjort, av hvem, når_. Digilist har en gjennomgående audit-logg som registrerer hver mutasjon i systemet: hvem som booket, hvem som godkjente, hvem som slettet, og når. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.\n\n## WCAG 2.0 AA: universell utforming\n\nForskrift om universell utforming av IKT-løsninger pålegger kommuner å oppfylle WCAG 2.0 AA. Dette gjelder også SaaS-tjenester som tilbys til innbyggere. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Vi publiserer tilgjengelighetserklæring (a11y statement) i samsvar med Digdirs mal.\n\n## Hva kommunen bør be om i anskaffelsen\n\n1. ISO 27001-sertifikat (kopi)\n2. ISO 27701-sertifikat (kopi), eller minimum dokumentasjon av personvern-modenhet\n3. Penetrasjonstestrapport, ikke eldre enn 12 måneder\n4. Standard databehandleravtale med vedlegg over underdatabehandlere\n5. Beskrivelse av datalokasjon for primær- og backup-data\n6. Tilgjengelighetserklæring (WCAG-status)\n7. Prosedyrer for sikkerhetsbrudd og innsynsbegjæringer\n\nFor Digilist finner du alle disse dokumentene i vår [personvernerklæring](/personvern) og kontaktbar leverandørdokumentasjon: be om dem på [kontakt@digilist.no](mailto:kontakt@digilist.no).\n';
const __vite_glob_0_24 = '---\nslug: booking-idrettshall-kommune-app\ntitle: "Slik slipper du doble bookinger i idrettshallen"\ndescription: "En enkel bookingapp gir driftsleder på idrettshaller full kontroll, og frigjør timer hver uke som går til administrasjon i dag."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Driftsleder"\ncover: "/images/blog/ssal_2026_booking_hero.webp"\nkeywords: ["booking idrettshall", "kommune app", "idrettshall leie", "bookingsystem kommunal", "doble bookinger", "driftsleder anlegg", "digital bookingapp"]\n---\n\nKlokken er 07.45 på en mandag morgen. Telefonen piper med en SMS fra en fotballtrener som oppdager at noen andre allerede er i hallen hans. Du sitter med et papirskjema og prøver å finne ut hva som gikk galt. Igjen.\n\nDette er hverdagen for mange driftsledere på kommunale idrettshaller og mindre anlegg. Problemet er ikke at folk vil bruke anlegget, det er bra. Problemet er at de manuelle systemene som håndterer bookingene ikke henger med.\n\n## Problemet: Manuell styring koster mer enn du tror\n\nMange idrettshaller opererer fortsatt med en kombinasjon av telefonhenvendelser, e-post, Excel-ark og papirkalendre. Det fungerer, frem til det ikke gjør det.\n\nDoble bookinger oppstår fordi to personer kontakter anlegget på samme dag og begge får bekreftelse. Uklare regler for hvem som kan booke, hvilke tider som er ledige, og hva som koster hva, fører til misforståelser. Og driftslederen ender opp som mellomledd i hver eneste transaksjon.\n\nEn gjennomsnittlig kommunal idrettshall med aktiv bruk bruker anslagsvis 5–8 timer per uke på manuelle bookingoppgaver: ta imot henvendelser, sjekke tilgjengelighet, sende bekreftelser, følge opp betaling og håndtere avbestillinger. Det er opp mot 400 timer i året, tid som kunne vært brukt på drift, vedlikehold og brukeropplevelse.\n\nI Lillestrøm kommune, der idrettshallene har høy etterspørsel fra både barnehager, skoler og private brukere, er dette en kjent problemstilling. Uten et helhetlig system er det vanskelig å holde orden på hvem som har booket hva, og hvem som faktisk har betalt.\n\n## Slik forhindrer slot-basert booking konflikter automatisk\n\nEt digitalt bookingsystem bygget på slot-basert logikk løser kjerneproblemet: to bookinger kan aldri overlappe fordi systemet rett og slett ikke tillater det.\n\nNår en time er reservert, forsvinner den fra tilgjengelige alternativer, umiddelbart og for alle brukere. Det er ikke mulig å booke seg inn på et allerede opptatt tidspunkt. Ingen manuelle sjekker, ingen telefonrunder, ingen konflikter.\n\n### Regler og betingelser defineres én gang\n\nI stedet for å forklare reglene på nytt for hver enkelt bruker, settes betingelsene opp én gang i systemet. Hvem kan booke hvilke arealer, til hvilke tider, og til hvilken pris, alt styres sentralt. Barnehager kan få tilgang til egne tidsvinduer. Privatpersoner ser kun det som er tilgjengelig for dem. Driftslederen trenger ikke å ta stilling til hvert enkelt tilfelle manuelt.\n\n## Barn og foreldre booker selv, også klokken 22\n\nEn av de største fordelene med en bookingapp er at brukerne ikke lenger er avhengige av anleggets åpningstider for å reservere tid.\n\nForeldre som skal melde barn på en treningsøkt, barnehageansatte som trenger gymsal til fredag, en ungdomsgruppe som vil booke en time lørdag ettermiddag, alle kan gjøre dette selv, når det passer dem. Det betyr at bookingene skjer på kveldstid, i helgene, og i lunsjpausen, uten at noen på anlegget trenger å være tilgjengelig.\n\nFor driftslederen betyr det færre innkommende anrop og e-poster i løpet av arbeidsdagen. En responsiv mobilapp gjør det enkelt for brukerne å se tilgjengelighet, velge tidspunkt og bekrefte bookingen på få minutter. Resultatet er et system som jobber for deg også når du ikke er på jobb.\n\n## Varsler og påminnelser kutter no-show\n\nEn bookingkalender som er full på papiret, men tom i praksis, er et kjent problem. Folk glemmer, noe kommer i veien, og hallen står tom, uten at noe annet kan ta plassen.\n\nEt digitalt bookingsystem sender automatiske påminnelser til brukerne i forkant av reserverte tidspunkter. Du kan selv stille inn når påminnelsen sendes, for eksempel 24 timer og 2 timer før. Brukeren får en enkel melding med mulighet til å bekrefte eller avbestille.\n\n### Avbestillingsregler som håndheves automatisk\n\nI systemet kan du definere klare avbestillingsregler: for eksempel at avbestilling innen 12 timer medfører et gebyr, eller at plassen frigjøres automatisk og kan rebookes av andre. Reglene håndheves konsekvent, uten at driftslederen trenger å følge opp manuelt. Det er ikke lenger en ubehagelig samtale, det er en regel som systemet tar seg av.\n\nResultatet er høyere utnyttelsesgrad og færre tomme timer i hallen.\n\n## Sanntidsrapporter: se hva som faktisk skjer i anlegget\n\nNår alle bookingene håndteres digitalt, samles dataene automatisk. Det betyr at du som driftsleder kan se nøyaktig hvilke tidspunkter som er mest etterspurte, hvilke arealer som brukes lite, og hvordan mønsteret varierer gjennom uken og måneden.\n\nDenne informasjonen er verdifull på flere måter:\n\n- **Kapasitetsstyring:** Ser du at fredagskveldene alltid er fullbooket mens tirsdag formiddag er tom, kan du justere priser, åpningstider eller markedsføring.\n- **Rapportering til kommunen:** Dokumenterte tall på bruk og inntekter gjør budsjetteringsarbeidet enklere og mer troverdig.\n- **Planlegging av vedlikehold:** Vet du hvilke tidspunkter hallen brukes minst, kan du planlegge rengjøring og vedlikehold uten å påvirke bookede aktiviteter.\n\nDu trenger ikke å lage disse rapportene manuelt. De oppdateres løpende og er tilgjengelige når du trenger dem.\n\n## Betaling skjer automatisk, ikke i etterkant\n\nEn av de mest tidkrevende delene av manuell bookingadministrasjon er betalingsoppfølging. Hvem har betalt? Hvem har ikke? Skal du sende faktura eller ta kortbetaling? Og hva gjør du med de som ikke betaler?\n\nMed integrasjon mot et banksystem skjer betalingen som en del av bookingprosessen. Brukeren velger tidspunkt, bekrefter bookingen og betaler umiddelbart, med kort, Vipps eller faktura, avhengig av hva anlegget tilbyr. Bookingen er ikke bekreftet før betalingen er gjennomført.\n\n### Enklere regnskap og månedlig oversikt\n\nAlle transaksjoner loggføres automatisk og kan eksporteres til regnskapet. Du slipper å manuelt koble betalinger mot bookinger og jage restanser. Det reduserer feil, sparer tid og gjør det enklere å holde orden på inntektene.\n\nFor kommunale anlegg med krav til rapportering og revisjon er dette spesielt nyttig. Et system som automatisk dokumenterer hvem som betalte hva og når, er langt enklere å forholde seg til enn et sett med bankutskrifter og Excel-ark.\n\n## Fra administrator til driftsleder\n\nDet er en stor forskjell på å administrere et anlegg og å drive det. Administrasjon er å svare på telefoner, sende bekreftelser og ordne opp i konflikter. Drift er å sørge for at hallen er i god stand, at brukerne har en god opplevelse, og at anlegget utvikles i takt med behovene.\n\nEt digitalt bookingsystem tar over administrasjonen, og lar deg fokusere på det som faktisk gjør anlegget bedre.\n\nDet trenger ikke å være komplisert. En enkel, brukervennlig app som håndterer bookinger, betaling og kommunikasjon med brukerne er nok til å kutte de fleste manuelle oppgavene som fyller arbeidsuken i dag.\n\n---\n\n## Se hvordan Digilist fungerer for ditt anlegg\n\nDigilist er bygget for drift av kommunale anlegg og idrettshaller, med slot-basert booking, automatisk betaling og sanntidsrapporter samlet på ett sted. Ingen doble bookinger. Færre telefonhenvendelser. Mer tid til å drive anlegget.\n\n**Book en demo** og se hvordan Digilist kan tilpasses ditt anlegg og dine brukere.\n';
const __vite_glob_0_25 = '---\nslug: hva-er-bookingsystem-kommunale-lokaler\ntitle: "Hva er et bookingsystem for kommunale lokaler? Full guide for IT-ledere"\ndescription: "Komplett guide for IT-ledere: hva et bookingsystem for kommunale lokaler er, hvilke lokaltyper som kan bookes, priser og anbud, GDPR og datalokasjon, ID-porten, SSA-L og målbar gevinst etter innføring."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "IT-leder"\ncover: "/images/blog/sanntidskalender_hero_no.webp"\nkeywords: ["bookingsystem kommunale lokaler", "SSA-L kravspesifikasjon", "ID-porten booking", "GDPR datalokasjon Norge", "digital utleie idrettshall", "booking lag og foreninger"]\n---\n\nSkal kommunen anskaffe et bookingsystem for lokaler, dukker de samme spørsmålene opp hos IT-leder, innkjøp og kulturkontoret: Hva er det egentlig, hva koster det, og hva må leverandøren tåle av norske krav? Denne guiden svarer på hele klyngen av «hva er»-spørsmål, med Norge som referanseramme og ikke generisk internasjonal programvare.\n\n## Hva er et bookingsystem for kommunale lokaler\n\nEt bookingsystem for kommunale lokaler er en digital plattform der innbyggere, lag og foreninger søker om og reserverer kommunale rom og anlegg, mens kommunen administrerer tilgang, priser og tildeling. Systemet erstatter e-post, regneark og telefonhenvendelser med én oversikt over hvem som har booket hva, når og til hvilken pris.\n\nFor en IT-leder er det tre lag som teller:\n\n- **Innbyggerflaten:** en offentlig kalender der man ser ledig kapasitet og sender forespørsel.\n- **Saksbehandlerflaten:** verktøy for å godkjenne, avslå, prioritere sesongtildeling og fakturere.\n- **Integrasjonslaget:** innlogging via ID-porten, betaling, adgangskontroll (låser), og eksport til fagsystemer.\n\nPoenget er ikke bare å digitalisere en kalender, men å gjøre tildeling sporbar og etterprøvbar. Når en søknad avslås, skal det ligge en begrunnelse og et vedtak, ikke en glemt e-post.\n\n## Hvilke lokaltyper kan bookes digitalt\n\nNesten alle kommunale rom med en kalender kan legges inn. De vanligste kategoriene er:\n\n- **Idrettshaller og gymsaler:** sesongtildeling til idrettslag, ofte med faste treningstider gjennom hele skoleåret.\n- **Møterom og grupperom:** internt for ansatte, eksternt for foreninger og næringsliv.\n- **Kulturhus og scener:** med teknisk utstyr, billettkapasitet og krav om vakthold.\n- **Selskapslokaler og grendehus:** utleie til private arrangementer, ofte med depositum og renholdsgebyr.\n- **Svømmehaller, klasserom og uteanlegg:** kunstgress, friluftsscener og bålplasser.\n\nForskjellen mellom lokaltypene ligger i reglene, ikke i teknologien. En gymsal trenger sesongtildeling og prioritering mellom lag, mens et selskapslokale trenger depositum og aldersgrense på leietaker. Et godt system håndterer begge uten separate installasjoner, gjennom regeloppsett per lokaltype.\n\n## Hva koster et bookingsystem for en kommune\n\nPrisen avhenger av antall lokaler, integrasjoner og om betaling og adgangskontroll skal inngå. De vanlige modellene er:\n\n- **Årlig lisens (SaaS):** en fast eller trappetrinnsbasert abonnementspris, gjerne knyttet til innbyggertall eller antall anlegg. For en mellomstor kommune i størrelsesorden 20 000 til 50 000 innbyggere, for eksempel Ringsaker eller Nordre Follo, ligger dette typisk mellom 50 000 og 250 000 kroner i året.\n- **Transaksjonsbasert:** et påslag per betalt booking, aktuelt der utleie til private står for mye av volumet.\n- **Etablering og oppsett:** en engangskostnad for konfigurasjon, migrering av eksisterende bookinger og opplæring.\n\nLegg til interne kostnader: prosjektledelse, integrasjon mot ID-porten og fakturasystem, og tid til å rydde i lokaldata før oppstart. Det er ofte den interne tiden, ikke lisensen, som avgjør totalprisen det første året.\n\nAnskaffelser over terskelverdi må ut på anbud etter anskaffelsesregelverket. For et rent SaaS-bookingsystem er terskelen for åpen konkurranse fort nådd over en fireårig avtaleperiode, så regn med Doffin-utlysning, kravspesifikasjon og evaluering på både pris og kvalitet.\n\n## Hva krever GDPR og norsk datalokasjon av leverandøren\n\nEt bookingsystem behandler personopplysninger: navn, kontaktinfo, i noen tilfeller fødselsnummer via innlogging, og hvem som leier hva. Da gjelder personvernforordningen fullt ut, og kommunen er behandlingsansvarlig.\n\nKonkrete krav en IT-leder må stille:\n\n- **Databehandleravtale (DPA)** som beskriver formål, kategorier av data og sikkerhetstiltak.\n- **Datalokasjon i EU/EØS.** Data bør lagres i Norge eller innenfor EØS. Overføring til land utenfor EØS krever eget rettslig grunnlag, og etter Schrems II-dommen er det en reell risiko å bygge på amerikanske skytjenester uten tilleggsgarantier.\n- **Sikker innlogging via ID-porten og BankID,** slik at identiteten til den som booker er bekreftet og fødselsnummer ikke tastes inn manuelt.\n- **Sletterutiner og innsyn,** slik at en innbygger kan be om innsyn og sletting uten at kommunen må lete i logger.\n\nDigilist lagrer data innenfor EØS og bruker ID-porten for innlogging, nettopp for å slippe usikkerheten rundt tredjelandsoverføring. For en kommune er dette forskjellen på en anskaffelse som tåler et tilsyn fra Datatilsynet, og en som ikke gjør det.\n\n## Hva er forskjellen på et bookingsystem og et saksbehandlersystem\n\nEt bookingsystem håndterer selve reservasjonen: ledig kapasitet, kalender, betaling og bekreftelse. Et saksbehandlersystem håndterer vedtaket: vurdering, begrunnelse, klageadgang og arkivering.\n\nI praksis flyter de over i hverandre. Når et idrettslag søker om fast treningstid i en hall det er kamp om, er det ikke en enkel reservasjon, det er en tildelingssak med prioritering, vedtak og mulighet for klage. Da trenger du saksbehandlerfunksjonalitet oppå bookingen:\n\n| Funksjon | Ren booking | Saksbehandling |\n|---|---|---|\n| Ledig kapasitet i kalender | Ja | Ja |\n| Umiddelbar bekreftelse | Ja | Nei, krever vurdering |\n| Prioritering mellom søkere | Nei | Ja |\n| Vedtak og begrunnelse | Nei | Ja |\n| Arkivverdig dokumentasjon | Nei | Ja |\n\nEt rent internasjonalt bookingverktøy stopper på venstre kolonne. Kommunale lokaler trenger begge, fordi tildeling av knapp kapasitet er myndighetsutøvelse som skal kunne etterprøves.\n\n## Hva bør stå i en kravspesifikasjon (SSA-L) for lokalutleie\n\nFor skytjenester og løpende tjenestekjøp brukes ofte SSA-L, Statens standardavtale for løpende tjenestekjøp. Kravspesifikasjonen er vedlegget som avgjør om systemet faktisk passer kommunen. Ta med minst dette:\n\n- **Funksjonelle krav:** sesongtildeling, prioriteringsregler, betaling, depositum, avlysning og venteliste.\n- **Integrasjoner:** ID-porten og BankID for innlogging, fakturasystem, og gjerne adgangskontroll for nøkkelfri tilgang til haller.\n- **Personvern og sikkerhet:** databehandleravtale, datalokasjon i EØS, logging og sletterutiner.\n- **Universell utforming:** samsvar med WCAG og forskrift om universell utforming av IKT, siden løsningen retter seg mot alle innbyggere.\n- **Tilgjengelighet og drift:** oppetidskrav, responstid på support og rutine for feilretting.\n- **Exit og dataeierskap:** at kommunen eier sine data og kan få dem utlevert i et åpent format ved avtaleslutt.\n\nSkriv kravene målbart. «Systemet skal støtte innlogging» er ubrukelig i en evaluering. «Systemet skal støtte innlogging via ID-porten på sikkerhetsnivå 3 og høyere» kan faktisk vurderes ja eller nei.\n\n## Hva betyr digital booking i praksis for lag og foreninger\n\nFor frivilligheten er dette den delen som merkes mest. I dag bruker mange klubber timer på å ringe rundt for å finne ut om gymsalen er ledig neste tirsdag. Med digital booking ser en lagleder ledig kapasitet i kalenderen, sender forespørsel med BankID, og får svar sporbart i stedet for via en e-post som forsvinner.\n\nKonkret betyr det:\n\n- **Selvbetjening døgnet rundt,** ikke bare i kommunens åpningstid.\n- **Én innlogging** med BankID, uten egne brukernavn og passord per system.\n- **Oversikt over egne bookinger,** avlysninger og faktura på ett sted.\n- **Rettferdig tildeling,** fordi reglene er like for alle og synlige.\n\nFor små foreninger uten egen administrasjon er lavere terskel avgjørende. Jo enklere det er å booke, jo mer blir anleggene faktisk brukt, og jo mindre tid går til telefonrunder både for klubben og for kommunens ansatte.\n\n## Hva er typisk implementeringstid og målbar gevinst\n\nEn avgrenset innføring, for eksempel idrettshaller og noen møterom i én kommune, tar gjerne 4 til 12 uker fra kontrakt til første reelle booking. Mesteparten av tiden går ikke til teknikk, men til å rydde i lokaldata, sette prisregler og enes internt om tildelingsreglene. En full utrulling til alle lokaltyper med adgangskontroll og fakturaintegrasjon tar lengre tid.\n\nGevinstene som lar seg måle etter innføring:\n\n- **Redusert administrasjonstid:** færre telefoner og e-poster, gjerne en reduksjon på flere timer i uken per saksbehandler.\n- **Høyere utnyttelse:** ledig kapasitet blir synlig, og haller som før sto tomme fylles opp.\n- **Bedre sporbarhet:** alle vedtak og betalinger er dokumentert, noe som forenkler både revisjon og klagebehandling.\n- **Færre dobbeltbookinger:** én sannhet i kalenderen fjerner konflikten mellom to lag som trodde de hadde samme tid.\n\nSett målepunktene før oppstart. Mål antall henvendelser på telefon, timer brukt på tildeling og utnyttelsesgrad per anlegg i et par referansemåneder, så har du et faktisk sammenligningsgrunnlag når systemet har vært i drift et halvår.\n\n## Neste steg: se løsningen på egne lokaler\n\nDen beste måten å vurdere et bookingsystem på er å se det mot kommunens egne lokaltyper og regler, ikke en generisk demo. Book en demo med Digilist, så viser vi hvordan sesongtildeling, ID-porten-innlogging og datalokasjon i EØS fungerer for akkurat din kommune, og hva en innføring realistisk krever av tid og integrasjoner.';
const __vite_glob_0_26 = '---\nslug: hvorfor-digital-booking-2026\ntitle: "Hvorfor digital booking er påkrevd for kommuner i 2026"\ndescription: "Innbyggerforventninger, anskaffelsesregelverk og kostnadspress peker samme vei: 2026 er året kommunale bookingsystemer ble påkrevd, ikke valgfritt."\ndate: 2026-05-22\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Strategi"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["digital booking", "kommunal digitalisering", "SSA-L 2026", "innbyggertjenester", "Digdir"]\n---\n\nI 2015 var en digital bookingkalender hos en kommune en hyggelig ekstra. I 2020 ble den et konkurransefortrinn mellom kommuner som skulle tiltrekke seg innbyggere. I 2026 er den noe annet: en _forutsetning_, både for å oppfylle regelverk, for å holde driftskostnader nede, og for å møte innbyggernes minste forventning. Tre krefter har skjøvet utviklingen, og ingen av dem reverserer seg.\n\n## Krav 1: Innbyggernes forventning er ikke lenger til forhandling\n\nDen gjennomsnittlige norske innbyggeren booker bord på restaurant via mobilen, tannlegen via [Helsenorge.no](https://www.helsenorge.no/), pakkelevering via PostNord-appen, og barnepass via en privat plattform. Når hun skal booke kommunens kantine til søsterens 50-årsdag og blir møtt av et PDF-skjema som må fylles ut, scannes, og sendes til en kommunal e-post som besvares i løpet av 5–10 virkedager, er det ikke et nostalgisk irritasjonsmoment. Det er en signal om at kommunen ikke leverer på samme nivå som resten av samfunnet.\n\n[Difi/Digdirs innbyggerundersøkelse](https://www.digdir.no/) viser at over 70 % av norske innbyggere forventer at kommunale tjenester er digitale på samme nivå som banktjenester. Det er ikke en politisk preferanse. Det er det implisitte servicenivået innbyggerne sammenligner med.\n\n## Krav 2: Anskaffelsesregelverket er strammet inn\n\n[SSA-L 2026](/blogg/ssa-l-2026-bookingsystem-kommune), Statens Standardavtale for løsninger, definerer hva et offentlig anskaffet IT-system skal levere. For bookingsystemer betyr det konkret:\n\n- Sanntidstilgjengelighet (ikke nattlig synkronisering)\n- ID-porten og BankID-autentisering på nivå Substansiell eller Høyt\n- EHF/Peppol-fakturering for organisasjoner\n- BRREG-verifisering av lag og foreninger\n- Universell utforming etter WCAG 2.1 AA (krav fra [Likestillings- og diskrimineringsloven § 17a](/blogg/universell-utforming-wcag-kommunal-booking))\n- ISO 27001 og ISO 27701-sertifisering\n- Audit-spor på hver mutasjon (krav fra arkivloven og GDPR)\n- Datalokasjon i Norge eller EU ([GDPR + ISO 27001](/blogg/gdpr-iso-datalokasjon-norge))\n\nEn kommune som anskaffer bookingsystem i 2026 _uten_ å oppfylle disse kravene har et juridisk problem, ikke et teknisk problem.\n\n## Krav 3: Kostnadspresset gjør det irrasjonelt å la være\n\nDen klassiske misforståelsen er at digitalisering er en _kostnad_ kommunen kan velge bort. Regnestykket fra de tjue norske kommunene som har digitalisert booking i de siste fem årene viser det motsatte. Tre poster:\n\n- **Saksbehandlertid:** Manuell booking via e-post og telefon koster typisk 8–15 minutter per booking. Digital selvbetjening tar 30–60 sekunder, og 90 % av bookingene krever ingen menneskelig involvering. En kommune med 1 200 bookinger i måneden frigjør i størrelsesorden 150 timer saksbehandlertid per måned.\n- **Refusjon og feilrettinger:** Manuelle bookinger har en feilrate på 8–12 % (dobbeltbookinger, gale tider, glemte avlysninger). Digitale systemer ligger på under 0,5 %. Hver feil koster i snitt 45 minutter å rette opp.\n- **Driftsvarsling:** Manuelle bookinger krever telefonkjede til vaktmester, renhold og vekter. Digital varsling skjer automatisk. Direkte besparelse i overtid, særlig på helg.\n\nSett over fem år er den totale besparelsen for en mellomstor kommune typisk høyere enn investeringen i et bookingsystem, uten å regne med innbyggerverdien.\n\n## Hva 2026 _ikke_ er\n\nDet er en feilslutning at digital booking betyr «innbyggerportal». Booking er bare _grensesnittet_; den reelle digitaliseringen ligger lenger ned i stacken:\n\n- **Fra siloer til sammenheng.** Bookingen må snakke med betaling, fakturering, regnskap, adgangskontroll og driftsvarsling.\n- **Fra synkronisering til sanntid.** Reaktiv runtime, ikke nattlige jobber.\n- **Fra ansatte til regler.** Sesongleie-fordeling som bygger på dokumenterte prioriteringsregler, ikke saksbehandlerens skjønn.\n- **Fra PDF til EHF.** Standardiserte, etterprøvbare leveranser, ikke fritekst-fakturaer.\n\nEn kommune som har en bookingkalender på nettsiden, men håndterer alt annet manuelt, er ikke _digitalisert_. Den er _online_. Forskjellen er betydelig.\n\n## Hva 2026 _er_\n\nDet er året da terskelen flyttet seg. Innbyggerne forventer det. Regelverket krever det. Regnestykket favoriserer det. Det er ikke lenger en politisk avgjørelse om kommunen skal digitalisere booking. Det er et spørsmål om _hvordan_, og _hvor raskt_.\n\nDen beste tilnærmingen er ikke å vente på en stor anskaffelse. Det er å starte med en pilot på ett anlegg, bygge tillit i organisasjonen, og skalere når innbyggerne og saksbehandlerne har sett at det fungerer. Det er nettopp den modellen [Digilists pilotprogram](/#pilot) er bygget for.\n\n';
const __vite_glob_0_27 = '---\nslug: idporten-bankid-kommunal-innlogging\ntitle: "ID-porten og BankID: pålitelig innlogging i kommunale tjenester"\ndescription: "ID-porten er Norges felles innloggingsløsning for offentlig sektor. Slik integrerer Digilist ID-porten og BankID, uten å håndtere passord."\ndate: 2026-05-16\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Integrasjoner"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["ID-porten", "BankID", "eIDAS", "Signicat", "BRREG", "kommunal innlogging", "autentisering"]\n---\n\nFor en kommune er innloggingen til en digital tjeneste ofte det første reelle møtet mellom innbygger og forvaltning. Den må være trygg nok til at sensitive operasjoner kan utføres, enkel nok til at en bestemor kan booke en kantine til 80-årsdagen, og rettskraftig nok til at en signert leiekontrakt holder i en domstol. I Norge løses alle tre kravene i samme grep: [ID-porten](https://www.idporten.no/), forvaltet av Digitaliseringsdirektoratet (Digdir).\n\n## Hva ID-porten gjør\n\nID-porten er en _felles innloggingsproxy_ for offentlig sektor. Når en innbygger trykker «Logg inn» på en kommunal tjeneste, sendes hun videre til ID-porten, som tilbyr fire eID-er:\n\n- **BankID** (mobilapp eller kodebrikke): det vanligste valget, levert av bankene i fellesskap.\n- **BankID på mobil** (SIM-basert): en eldre, men fortsatt brukt variant.\n- **MinID**: Skatteetatens eID for personer uten BankID.\n- **Buypass**: et alternativ, særlig brukt av helsesektoren.\n\nEtter vellykket pålogging signerer ID-porten en SAML- eller OpenID Connect-respons og sender brukeren tilbake til den kommunale tjenesten med verifisert identitet. eID-nivået (Substansiell eller Høyt iht. [eIDAS-forordningen](https://en.wikipedia.org/wiki/EIDAS)) ligger i responsen, så tjenesten kan kreve nivå Høyt for handlinger med kontraktsmessige konsekvenser.\n\nDet er Digdir som har avtale med eID-leverandørene. Kommunen avtaler ikke direkte med BankID. Det forenkler både drift og juss.\n\n## Hvordan Digilist kobler det sammen\n\nDet finnes tre vanlige integrasjonsmodeller mot ID-porten: direkte mot Digdirs OpenID Connect-endepunkt, via [Signicat](https://www.signicat.com/) som mellomledd, eller via en kommunal IDP som allerede har avtale (Active Directory + FEIDE for ansatte, ID-porten for innbyggere). Digilist støtter alle tre, men anbefaler Signicat-modellen for innbyggertilgang:\n\n1. **Reduserer driftsoverhead.** Signicat har levert ID-porten-integrasjoner siden 2007 og holder oversikten over sertifikater, fornyelser og protokollendringer.\n2. **Gjør BankID på mobil enklere.** Signicat tilbyr en kraftig redirect-flyt som fungerer på alle norske mobilbankidvarianter uten ekstra konfigurasjon.\n3. **Forenkler revisjonsspor.** Signicat lagrer signaturer på en standardisert måte: kommunens datatilsyn får én leverandørkontakt for hele eID-stakken.\n\nInnloggingsflyten er overraskende kort fra innbyggerens perspektiv:\n\n> Trykk «Logg inn» → BankID-app → bekreft → tilbake i Digilist, ferdig.\n\n## Hva med lag og foreninger?\n\nID-porten verifiserer _personer_, ikke _organisasjoner_. Når et idrettslag skal søke om sesongleie, trenger vi mer enn at signatøren har BankID. Vi trenger å vite at hun har lov til å signere på vegne av laget. Digilist løser det med [Brønnøysundregistrene (BRREG)](https://www.brreg.no/):\n\n1. Søker logger inn med BankID via ID-porten.\n2. Digilist henter signatørens rolle i BRREG via personnummer (med samtykke).\n3. Hvis personen er registrert som leder, nestleder, daglig leder eller styremedlem med signaturrett i den oppgitte organisasjonen, kobles søknaden til foreningen.\n4. Hvis ikke, vises en feilmelding som forklarer at signatøren må be om delegert tilgang eller logge inn med korrekt rolle.\n\nResultatet: kommunen vet at hver sesongleieavtale er signert av noen med faktisk fullmakt, ikke bare av noen som hadde tilfeldig tilgang til lagets postkasse.\n\n## Hva med ansatte i kommunen?\n\nSaksbehandlerne logger ikke inn med ID-porten. De er allerede pålogget kommunens egen [FEIDE](https://www.feide.no/)-baserte identitetsstyring. Digilist kobler seg på via SAML 2.0 mot kommunens IdP og henter rolle, organisasjon og avdeling. RBAC-modellen i Digilist mapper FEIDE-rollene til lokale tillatelser:\n\n- `kulturkonsulent` → kan godkjenne søknader, justere fordeling\n- `vaktmester` → kan se aktive bookinger, varsles automatisk\n- `kommunal_administrator` → kan endre regler, anlegg, priser\n\nNår en ansatt slutter, fjernes vedkommende fra kommunens IdP, og Digilist arver tilgangsbortfallet automatisk på neste innlogging. Ingen «glemte ansatt-kontoer» som flyter rundt i revisjonen.\n\n## Hva med innbyggere som ikke har BankID?\n\nDet er en mindre, men reell gruppe. Digilist tilbyr to fallback-flyter for kommuner som ønsker det:\n\n- **MinID** for innbyggere uten BankID: fortsatt eID, men nivå Substansiell i stedet for Høyt.\n- **Saksbehandlerassistert booking**: innbygger ringer kommunens servicetorg, og en ansatt utfører bookingen på vegne av personen med dokumentert samtykke. Bookingen lagres med både innbyggerens og saksbehandlerens identitet.\n\nResultatet: ingen innbygger er teknisk utelukket fra å bruke kommunens tjenester.\n\n## Når ID-porten ikke fungerer\n\nSjeldnere enn man tror, men det skjer: typisk når en innbygger har BankID, men passordbeskyttelsen er mistet, eller når banken har planlagt vedlikehold. Digilist viser da en klar feilmelding med Digdirs kontaktinformasjon for ID-porten-support, og logger feilen som en innbyggerhendelse for kommunens servicetorg. Det er Digdirs ansvar å bringe ID-porten tilbake. Kommunens ansvar er å informere innbyggerne, og det er Digilists ansvar å gjøre den informasjonen forståelig.\n\n## Hvorfor det betyr noe\n\nID-porten er den enkleste måten en kommune kan dele tillit med innbyggerne sine på. Bestemoren som booker kantinen bryr seg ikke om eIDAS-nivåer eller SAML-signaturer. Hun bryr seg om at det føles trygt og at lenken til kommunen vises i topplinjen mens hun logger inn. Det er nettopp den følelsen ID-porten leverer, og det er nettopp den følelsen Digilist er bygget for å bevare.\n\n';
const __vite_glob_0_28 = '---\nslug: digitalisert-tildeling-idrettshaller-lag-foreninger\ntitle: "Idrettshall-tildeling på dager, ikke uker, slik gjør du det"\ndescription: "Lær hvordan digitalisert tildeling av kommunale idrettshaller gir lag og foreninger raskere svar og full oversikt over sesongleie på én plass."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Lag og foreninger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["idrettshall booking", "kommunale lokaler tildeling", "sesongleie idrettshall", "lag og foreninger booking", "kalenderbasert booking", "kommunal utleie", "dobbeltbooking"]\n---\n\nHvert år, gjerne i august og september, starter den samme runden: trenere og lagledere sender inn søknader om hallid til kommunen, venter i ukevis på svar, ringer saksbehandlere for status og ender opp med å planlegge sesongstart uten å vite hvilke tider laget faktisk får. Det er ikke mangel på vilje som skaper problemet, det er manuelle prosesser som ikke er laget for volumet av søknader kommunen mottar.\n\nDenne artikkelen forklarer hvordan digitalisert tildeling endrer hverdagen for lag, foreninger og kommunen selv.\n\n---\n\n## Hvorfor manuell tildeling koster alle parter tid\n\nNår en kommune håndterer søknader om hallid manuelt, betyr det som regel e-post, regneark og telefoner frem og tilbake. Saksbehandleren må samle inn søknader, sjekke mot eksisterende bookinger, avklare prioriteringer etter kommunens tildelingsregler, sende tilbakemelding og følge opp eventuelle konflikter.\n\nFor et lag betyr det uker med usikkerhet. Det er vanskelig å bestille trenere, melde på cuper eller kommunisere med foreldre når du ikke vet hvilke tider laget trener på.\n\nFor kommunen betyr det at saksbehandlingskapasiteten spises opp av koordineringsarbeid som i stor grad kan automatiseres. I travle perioder kan behandlingstiden for en søknad ligge på to til tre uker, ikke fordi saken er komplisert, men fordi køen er lang og verktøyene er manuelle.\n\n### Konsekvenser som akkumuleres\n\n- **Dobbeltbookinger** oppstår når to saksbehandlere ikke har oppdatert oversikt i sanntid\n- **Lagledere** bruker tid på oppfølging fremfor aktivitet\n- **Driftsledere** ved hallene vet ikke alltid hvem som har bestilt hva til hvilken tid\n- **Dokumentasjon** som forsikringsbevis og organisasjonsnummer etterspørres manuelt for hvert søknadsrunde\n\n---\n\n## Slik fungerer automatisert, kalenderbasert booking med sesongleie\n\nEt digitalt bookingsystem for kommunale idrettshaller er bygget rundt én felles kalender som viser tilgjengelighet i sanntid. Lag og foreninger logger inn, ser hvilke tider som er ledige og sender søknad direkte i systemet, uten å måtte vente på at noen skal svare på e-post for å finne ut om hallen er opptatt.\n\nDet sentrale er skillet mellom **engangsbooking** og **sesongleie**. For organiserte lag er sesongleie det viktigste: laget søker om en fast ukentlig tid gjennom hele sesongen, for eksempel mandager fra 18.00 til 20.00 fra september til april. Systemet legger dette inn som en gjentakende reservasjon og blokkerer tidspunktene automatisk for øvrige søkere.\n\n### Hva systemet håndterer automatisk\n\n1. **Tilgjengelighetskontroll**: Systemet sjekker om den ønskede tiden er ledig for hele perioden\n2. **Prioritering etter kommunens regler**: Barn og unge, kommunale lag, størrelse på organisasjon, prioriteringskriteriene legges inn én gang og brukes konsekvent\n3. **Varsler og statusoppdateringer**: Lagleder får automatisk beskjed når søknaden er mottatt, til behandling og vedtatt\n4. **Dokumenthåndtering**: Nødvendige vedlegg lastes opp én gang og knyttes til organisasjonen, ikke til hver enkelt søknad\n\n---\n\n## Eksempel: 48 timer i stedet for tre uker\n\nLillestrøm Fotballklubb har tre lag som søker om hallid til vintertrening. Tidligere sendte lagleder e-post til kommunen, fikk en bekreftelse på at søknaden var mottatt, og ventet deretter i gjennomsnittlig tre uker på tildeling. I noen tilfeller kom tildelingen så sent at sesongplanen allerede var satt opp med feil tider, noe som krevde ny runde med koordinering.\n\nMed et digitalt bookingsystem fyller lagleder inn søknaden i et skjema, velger ønskede tider i kalenderen og laster opp gyldig forsikringsbevis. Systemet kontrollerer automatisk at tidene er ledige og sender søknaden til saksbehandlerkøen med all nødvendig dokumentasjon allerede på plass.\n\nSaksbehandleren trenger ikke etterspørre vedlegg, ringe for avklaringer eller sjekke manuelle regneark. Resultatet er at Lillestrøm Fotballklubb får tilbakemelding innen 48 timer. Lagleder kan bekrefte treningstider til foreldre og trenere allerede første uke i august, ikke i slutten av september.\n\n---\n\n## Det du trenger i ett bookingsystem\n\nIkke alle digitale løsninger er like godt egnet for kommunal tildeling til lag og foreninger. Her er funksjonaliteten som faktisk gjør en forskjell:\n\n### Tilgjengelighetsoversikt i sanntid\n\nLagledere skal kunne se hvilke tider som er ledige uten å måtte ta kontakt med kommunen. Kalenderen må vise bookede, reserverte og ledige tider, og oppdateres umiddelbart når en tildeling er gjort.\n\n### Dokumenthåndtering knyttet til organisasjonen\n\nLag og foreninger skal slippe å laste opp forsikringsbevis, vedtekter og organisasjonsnummer ved hver søknad. Disse dokumentene knyttes til laget i systemet og brukes på tvers av alle søknader, med varsler når dokumenter nærmer seg utløpsdato.\n\n### E-signering av tildelingsavtaler\n\nNår kommunen tildeler hallid, bør selve avtalen signeres digitalt direkte i systemet. Det eliminerer papirpost, e-postvedlegg og manuell arkivering. Begge parter har til enhver tid tilgang til signert dokumentasjon.\n\n### Støtte for sesongleie og gjentakende reservasjoner\n\nSystemet må håndtere ukentlige gjentakelser over en sesong, inkludert unntak for helligdager, hallavstengning og cuper. Endringer i enkeltdatoer skal ikke kreve at hele søknaden behandles på nytt.\n\n---\n\n## Færre dobbeltbookinger, mindre koordinering\n\nEt av de mest konkrete gevinstene ved digitalisert tildeling er at driftsleder ved hallen og saksbehandleren i kommunen jobber mot den samme kalenderen. Det betyr at en tildeling gjort av saksbehandleren umiddelbart er synlig for driftsleder, og omvendt.\n\nI manuelt drevne systemer oppstår dobbeltbookinger fordi informasjonen finnes på to eller flere steder som ikke er synkronisert: kommunens regneark, driftslederens eget system og lagenes egne oversikter. Å rydde opp i en dobbeltbooking krever telefoner, omrokkeringer og frustrerte trenere.\n\nMed ett felles system finnes hallens kalender kun ett sted. Systemet nekter automatisk å opprette en booking i en allerede opptatt tid, uansett hvem som gjør bestillingen.\n\n### Redusert administrasjonsbyrde i praksis\n\nEn saksbehandler som tidligere brukte fire til fem dager i uken på å behandle søknader manuelt i høysesong, kan med et digitalt system bruke mesteparten av den tiden på faktiske vedtak og prioriteringsvurderinger, ikke på å samle inn vedlegg og sjekke kalenderkollisjoner.\n\nFor lag og foreninger betyr det raskere svar, mer forutsigbar planlegging og langt mindre tid brukt på å følge opp kommunen.\n\n---\n\n## Kom i gang med Digilist\n\nDigilist er et bookingsystem laget for kommunal tildeling av lokaler til lag og foreninger. Systemet håndterer sesongleie, dokumentasjon, e-signering og kalenderbasert oversikt i én løsning, for både saksbehandler, driftsleder og lagleder.\n\nØnsker du å se hvordan det fungerer i praksis for din kommune eller ditt lag?\n\n**[Book en demo med Digilist](https://www.digilist.no/demo)**, vi viser deg hele flyten fra søknad til signert tildelingsavtale, og svarer på spørsmål tilpasset din situasjon.\n';
const __vite_glob_0_29 = '---\nslug: idrettshall-kommune-booke-enkelttime-trening-arrangement\ntitle: "Idrettshall i kommunen: alle måtene å finne og booke en ledig hall"\ndescription: "Enkelttime, fast trening, arrangement eller ferie: her er alle bookingveiene til kommunal idrettshall samlet, med pris, regler og ledige tider forklart."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["idrettshall ledige tider", "booke idrettshall", "idrettshall leie pris", "fast trening idrettshall", "idrettshall arrangement", "idrettshall skoleferie"]\n---\n\n"Idrettshall" er egentlig et samlebegrep for flere lokaler og minst fire ulike bookingbehov. Skal du spille badminton en kveld, trener laget ditt fast hver uke, eller planlegger du en cup for 200 deltakere? Veien til en ledig hall er ikke den samme. Her er alle inngangene samlet på ett sted, slik at du havner i riktig kø fra start.\n\n## Hva skjuler seg bak begrepet idrettshall\n\nKommunen leier ut flere halltyper, og navnet avgjør både størrelse og hva du kan bruke den til:\n\n- **Flerbrukshall:** stor hall som deles i to eller tre baner med skillevegg. Passer håndball, innebandy, cup og trening for flere grupper samtidig.\n- **Gymsal:** mindre sal på en skole, ofte til lek, mosjon og mindre lag.\n- **Spesialhall:** turnhall, svømmehall eller styrkerom med fast utstyr som ikke kan flyttes.\n\nBærum kommune driver over 30 slike anlegg, og de færreste av dem er like. Sjekker du hva slags hall du faktisk trenger før du søker, slipper du å booke en gymsal til en håndballcup som krever full bane, eller en flerbrukshall til en treningsgruppe på seks som holder seg til én tredjedel. Riktig halltype er også det som avgjør hvilken pris og hvilke regler som gjelder for deg.\n\n## Slik finner du en ledig idrettshall nær deg nå\n\nMed en sanntidskalender ser du hvilke haller som er ledige akkurat nå, i stedet for å ringe rundt eller vente på svar fra et servicetorg. I Digilist filtrerer du på område, dato og halltype, og kalenderen viser bare det som faktisk er ledig. En time som frigjøres fordi et lag melder avbud, dukker opp umiddelbart, og du kan slå til med én gang.\n\nDu booker fra mobilen uten å kontakte kommunen. Finner du ikke ledig tid i hallen du hadde tenkt på, viser kalenderen nærliggende haller med samme kapasitet, så du kan flytte deg noen kilometer i stedet for å gi opp kvelden. Slik unngår du den vanligste flaskehalsen: å tro at alt er fullt fordi én hall er det.\n\n## Book enkelttime som privatperson\n\nSkal du bare ha hallen én kveld, går det slik:\n\n1. Søk opp hallen og velg en ledig time i kalenderen.\n2. Logg inn med BankID eller magisk lenke.\n3. Bekreft formål og antall deltakere.\n4. Betal med kort eller Vipps og motta kvittering.\n\nHele reisen tar rundt 90 sekunder. Bookingen ligger på Min Side, der du finner kvittering, ser tidspunktet og kan avbestille innenfor fristen uten å ringe noen. Trenger du hallen flere enkeltkvelder, gjentar du bare stegene per dato; det er fortsatt enkeltbooking, ikke en fast avtale.\n\n## Fast ukentlig trening for lag og foreninger\n\nTrener laget hver tirsdag hele sesongen, søker du ikke time for time. Da søker du **fast tid** gjennom sesongtildelingen, som er en egen prosess. Registrerte lag og foreninger sender inn ønsket hall, ukedag og tidsrom for hele sesongen, og saksbehandleren fordeler timene mellom klubbene.\n\nForskjellen fra enkeltbooking: fast trening prioriteres etter kriterier som alder, aktivitet og barneidrett, og tildeles samlet før sesongstart, ikke fortløpende. Søknadsfristen ligger typisk på våren for kommende høst- og vintersesong, så er du for sent ute, må du vente til neste runde eller ta til takke med restkapasitet. Er du privatperson som vil ha en enkelttime, skal du ikke inn i denne køen i det hele tatt.\n\n## Idrettshall til arrangement, cup eller stevne\n\nEt arrangement krever mer enn en ledig time. Kommunen ser gjerne på:\n\n- **Kapasitet:** antall deltakere og publikum mot hallens godkjente maksimum, inkludert rømningsveier og sitteplasser.\n- **Utstyr:** mål, matter, lydanlegg eller tribune, og hva du selv må ta med.\n- **Godkjenning:** større stevner trenger ofte forhåndsgodkjenning og bekreftelse på ansvarsforsikring.\n\nLegg inn arrangementet med formål og deltakerantall i søknaden, så vurderer saksbehandleren det mot ledig kapasitet og eventuell overlapp med fast trening. Book i god tid: populære helger fylles måneder i forveien, og en cup som beslaglegger hele hallen en hel lørdag konkurrerer med både faste lag og andre arrangører. Jo tidligere du er ute, jo større er sjansen for at du får både hall og ønsket utstyr på samme dato.\n\n## Pris og betaling\n\nHva det koster, avhenger av hvem du er og hva du skal:\n\n- **Barne- og ungdomsidrett** i egen kommune er ofte gratis eller sterkt subsidiert.\n- **Voksne lag og private** betaler en timepris, typisk fra rundt 200 til 500 kroner timen for en gymsal, mer for full flerbrukshall.\n- **Arrangement** prises per dag eller per økt, ofte med tillegg for utstyr.\n\nPrisen står synlig i kalenderen før du bekrefter, så du vet hva du betaler. Mange kommuner, blant dem Trondheim, skiller tydelig mellom subsidiert sats for lokale lag og full sats for kommersiell bruk, og den forskjellen kan være betydelig. Privatpersoner betaler ved booking, mens faste lag som regel faktureres etter avtale når sesongen er i gang.\n\n## Regler du må kjenne\n\nFør du booker, sjekk vilkårene for den enkelte hallen:\n\n- **Avbestilling:** de fleste kommuner gir gratis avbestilling frem til et visst antall timer eller dager før, deretter belastes du. Fristen står i bookingbekreftelsen.\n- **Garderobe og nøkkel:** noen haller har fast garderobetilgang, andre krever kode eller nøkkelkort som utleveres digitalt rett før tidspunktet ditt.\n- **Ansvar ved skade:** du som booker er ansvarlig for skader og for at hallen forlates ryddig og låst.\n\nDisse vilkårene varierer fra hall til hall, ikke bare fra kommune til kommune. Les bekreftelsen din i stedet for å anta at samme regler gjelder overalt, særlig når det kommer til frist for gratis avbestilling.\n\n## Idrettshall i skoleferien\n\nMange haller ligger på skoler og brukes lite når skolen har fri. I skoleferien frigjøres derfor dagtimer som ellers er opptatt av kroppsøving og faste lag. Lillestrøm kommune åpner flere skolehaller for utleie på sommeren, og i kalenderen ser du med én gang hvilke ferieuker som har ledig kapasitet.\n\nSkal du arrangere ferieaktivitet, holde en intern turnering eller trene på dagtid, er dette ofte den enkleste tiden å få tak i en hall. Fordi ettermiddags- og kveldstidene i sesong er de mest ettertraktede, gir feriene et pusterom der selv de mest populære hallene har luft i kalenderen.\n\n## Vanlige spørsmål\n\n**Kan jeg booke idrettshall som privatperson?** Ja, enkelttimer bookes direkte i kalenderen med BankID.\n\n**Hvorfor kan jeg ikke booke fast trening selv?** Faste tider fordeles i sesongtildelingen etter prioritering, ikke fortløpende.\n\n**Hva skjer om jeg avbestiller?** Innen fristen er det gratis, etter fristen belastes du. Fristen står i bekreftelsen.\n\n**Ser jeg prisen før jeg booker?** Ja, prisen vises i kalenderen før du bekrefter.\n\n## Vil kommunen din tilby dette?\n\nDigilist samler enkeltbooking, sesongtildeling, arrangement og betaling i én kalender med sanntids ledighet. Vil du se hvordan innbyggerne dine kan booke hall selv på under to minutter? **Book en demo** og få en gjennomgang tilpasset kommunens haller.';
const __vite_glob_0_30 = '---\nslug: idrettshall-ledige-tider-booking-hele-livssyklusen\ntitle: "Idrettshall ledige tider: hvorfor timer blir frie og hvordan du booker"\ndescription: "Fra sesongfordeling til lag og foreninger, via avbestillinger, til timene du faktisk kan booke selv. Slik henger idrettshall-booking sammen fra ende til ende."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["idrettshall ledige tider", "book idrettshall time", "leie idrettshall pris", "idrettshall sesongfordeling", "avbestille idrettshall booking", "idrettshall vs gymsal"]\n---\n\nDe fleste vil bare booke en ledig time i idrettshallen. Men for å forstå hvorfor tider er ledige, og hvorfor akkurat de tidene, hjelper det å se hele livssyklusen bak en halltime: fra sesongkontrakten som fordeles i august, til avbestillingen som frigjør en tirsdag kveld i februar. Da blir det også enklere å finne, og få, timen du er ute etter.\n\n## Slik fordeles idrettshalltider i kommunen\n\nHovedtyngden av tidene i en kommunal idrettshall deles ut som sesongkontrakter til lag og foreninger før sesongstart. Håndball, innebandy og turn får faste ukentlige treningstider fra august til april, ofte etter en prioriteringsrekkefølge der barn og unge går foran voksne, og lokale klubber foran kommersielle aktører.\n\nSelve fordelingen skjer som regel på våren. Klubbene søker om rammetid, altså faste ukentlige timer for hele sesongen, med frist typisk i mars eller april. Kommunen setter opp et sesongkart ut fra søknadene og sine egne tildelingsregler, og de fleste hallene er dermed «tegnet ferdig» lenge før du som privatperson ser kalenderen i august.\n\nDet betyr at når du ser på en hall en tirsdag i november, er kanskje 80 til 90 prosent av kveldstidene mellom 17 og 22 allerede bundet opp i faste kontrakter. Det som er igjen, er restkapasitet: dagtid, sene kvelder, helger og hull som oppstår når et lag ikke trenger tiden sin.\n\n## Hva betyr egentlig «ledige tider»?\n\n«Ledig» dekker tre ulike situasjoner, og de dukker opp til forskjellig tid:\n\n- **Frie timer:** tider som aldri ble fordelt i sesongkartet, typisk dagtid og enkelte helgetimer.\n- **Avbestillinger:** en klubb melder fra at de ikke trenger tiden sin, for eksempel i skoleferier eller ved bortekamp. Timen frigjøres og blir bookbar for andre.\n- **No-show som ikke frigjøres:** en tid som står som opptatt selv om ingen bruker den. Denne får du ikke tak i, og det er en av grunnene kommuner digitaliserer avbestilling.\n\nI et system som Digilist oppdateres kalenderen i sanntid. Når Vestby idrettslag avbestiller torsdagstreningen, blir den samme torsdagen synlig som ledig for deg innen sekunder. Den mest praktiske konsekvensen er enkel: de beste enkelttimene dukker ofte opp på kort varsel, så det lønner seg å sjekke kalenderen jevnlig og slå til raskt.\n\n## Slik søker du opp ledige tider i sanntid\n\n1. Åpne bookingkalenderen for hallen eller søk opp anlegget i ditt område.\n2. Velg dato og tidsrom. Kalenderen viser bare det som faktisk er ledig, ikke det som er sesongbundet.\n3. Filtrer på halltype eller kapasitet hvis du trenger noe spesifikt.\n4. Klikk på en grønn tid for å se pris og vilkår før du bekrefter.\n\nHele søket tar under to minutter, og du logger inn med BankID først når du skal bekrefte. Finner du ingen ledig kveldstid i den hallen du helst vil ha, kan det lønne seg å utvide søket til dagtid, til helg eller til en nabohall i samme kommune.\n\n## Book en enkelttime uten sesongkontrakt\n\nDu trenger ikke være medlem av en klubb for å leie. Drop-in booking er laget for privatpersoner som vil ha én time: en fotballøkt med kompisene, en åpen treningstime eller en enkelt trening. Du velger tiden, betaler, og får bekreftelsen og adgangsinformasjonen på Min Side. Ingen søknad, ingen ventetid på saksbehandling for enkeltbookinger.\n\nForskjellen fra sesongtid er verdt å merke seg: en enkelttime gjelder bare den ene gangen du booker, mens sesongkontrakten er en fast ukentlig avtale for hele perioden. Vil du ha samme time hver uke over lengre tid, er det rammetid gjennom en klubb du er ute etter, ikke drop-in.\n\n## Hva koster det å leie idrettshall?\n\nPrisen settes av kommunen og varierer med hvem du er og hva du bruker hallen til. Typiske størrelsesordener for en kommunal hall:\n\n- **Barn og unge, lokale lag:** ofte gratis eller sterkt subsidiert.\n- **Voksne, privat trening:** vanligvis fra rundt 200 til 600 kroner timen.\n- **Arrangement og kommersiell bruk:** høyere sats, ofte per dag eller per økt, og enkelte kommuner krever depositum eller renholdsgebyr i tillegg.\n\nDu ser prisen i kalenderen før du booker. Betaling skjer med kort ved bookingtidspunktet for enkelttimer, mens klubber og faste leietakere gjerne faktureres samlet. I Digilist ligger kvitteringer og fakturaer på Min Side, så du slipper å etterspørre dokumentasjon.\n\n## Regler for booking: avbestilling, no-show og frister\n\nVilkårene varierer mellom kommuner, men følger et gjenkjennelig mønster:\n\n- **Avbestillingsfrist:** ofte 24 til 48 timer før for å slippe betaling. Avbestiller du innenfor fristen, frigjøres tiden automatisk til andre.\n- **No-show:** møter du ikke opp uten å melde fra, kan du bli belastet, og gjentatte no-shows kan begrense fremtidig booking.\n- **Tidsbegrensninger:** enkelte haller har maksgrense per booking eller per uke for privatpersoner, slik at kapasiteten fordeles rettferdig.\n\nPoenget med reglene er todelt: de skjermer deg mot å betale for noe du melder fra om i tide, og de sørger for at tider ikke står låst som opptatt når noen andre kunne brukt dem.\n\n## Idrettshall til arrangement, cup eller privat leie\n\nSkal du arrangere en cup, et stevne, en bursdag eller en sammenkomst, er det en egen kategori leie. Da booker du gjerne hele hallen over flere timer eller en hel dag, og noen kommuner krever en enkel forespørsel som saksbehandler godkjenner, særlig ved bruk av garderober, kiosk eller lyd. Send forespørselen med dato og formål, så får du svar og pris tilbake i samme tråd.\n\nRegn med litt lengre svartid enn ved en drop-in time, siden en person skal se over forespørselen. Har arrangementet en fast dato, lønner det seg derfor å sende forespørselen i god tid fremfor samme uke.\n\n## Idrettshall, gymsal eller flerbrukshall?\n\nVelg etter aktivitet og antall:\n\n- **Idrettshall:** stor flate, håndballmål og oppmerking, egner seg for lagidrett og cup.\n- **Gymsal:** mindre, ofte på en skole, fin til trim, dans eller små grupper. Rimeligere og lettere å få tak i.\n- **Flerbrukshall:** kan deles i seksjoner, slik at flere grupper bruker hallen samtidig og du kan leie en del av flaten fremfor hele.\n\nSkal fem venner spille badminton, er en gymsal både billigere og enklere. Skal håndballaget spille kamp, trenger du idrettshallen.\n\n## Ofte stilte spørsmål\n\n### Kan jeg booke uten å være medlem i en klubb?\nJa. Drop-in booking er åpen for privatpersoner, du trenger bare BankID for å bekrefte.\n\n### Hvorfor er kveldstidene alltid opptatt?\nDe er som regel sesongfordelt til lag og foreninger. Se etter dagtid, sene kvelder og helger, og hold øye med avbestillinger.\n\n### Får jeg pengene tilbake om jeg avbestiller?\nJa, hvis du avbestiller innen fristen, vanligvis 24 til 48 timer før. Refusjonen håndteres automatisk.\n\n### Hvor raskt oppdateres ledige tider?\nI sanntid. Frigjøres en time, blir den synlig for andre umiddelbart.\n\n### Kan jeg leie hele hallen til et arrangement?\nJa. Da velger du arrangementsleie fremfor en enkelttime, og noen kommuner ber om en kort forespørsel som godkjennes før booking bekreftes.\n\n## Vil kommunen din vise ledige tider slik?\n\nDigilist gir innbyggere en sanntidskalender, drop-in booking og automatisk avbestilling, samtidig som sesongfordelingen til lag og foreninger håndteres i samme plattform. Book demo, så viser vi hvordan hele livssyklusen bak en halltime henger sammen.';
const __vite_glob_0_31 = '---\nslug: idrettshall-ledige-tider-booking-innbygger\ntitle: "Idrettshall ledige tider: finn og book en ledig time på under to minutter"\ndescription: "Slik finner du ledige tider i kommunens idrettshaller i sanntid, setter deg på venteliste ved avbestilling og booker en ledig time uten å ringe drift."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["idrettshall ledige tider", "booke ledig time idrettshall", "venteliste idrettshall avbestilling", "sanntidskalender idrettshall", "sammenligne idrettshaller ledig tid", "idrettshall booking app", "finne ledig idrettshall i dag"]\n---\n\nDu vil spille innebandy torsdag kveld, men vet ikke hvilken hall som har en ledig time. Før måtte du ringe driftskontoret i kontortid og håpe noen svarte. Med en sanntidskalender ser du alle ledige tider på tvers av kommunens idrettshaller med en gang, filtrerer på tidspunkt og aktivitet, og booker selv. Denne guiden viser deg hele veien fra søk til bekreftet time.\n\n## Hva menes med «ledige tider»: sanntidskalender mot statisk oppslagstavle\n\nEn «ledig tid» er et tidsrom i en hall eller hallseksjon som ingen har reservert ennå. Forskjellen ligger i hvordan du får se den.\n\nDen gamle måten var en statisk oversikt: et regneark, en PDF på kommunens nettside eller en tavle på veggen i hallen. Den ble oppdatert manuelt, kanskje ukentlig, og viste sjelden hva som faktisk var ledig akkurat nå. Booket noen en time om morgenen, sto den fortsatt som ledig i oversikten til noen rakk å rette den.\n\nEn sanntidskalender henter status direkte fra bookingsystemet i det øyeblikket du åpner den. Reserverer noen en time, forsvinner den fra din skjerm sekunder senere. Avbestiller noen, dukker tiden opp igjen umiddelbart. Du slipper å gjette, og du slipper dobbeltbookinger som oppstår fordi to personer så samme «ledige» tid i en utdatert liste.\n\nKort sagt: en statisk oversikt forteller deg hvordan det så ut sist noen oppdaterte den. En sanntidskalender forteller deg hvordan det er nå.\n\n## Slik søker du opp ledige tider: filtrer på dag, klokkeslett, hallseksjon og aktivitet\n\nÅ bla gjennom en full kalender for tolv haller er tungvint. Poenget med et godt søk er å komme rett til det som passer deg. I Digilist filtrerer du på fire ting:\n\n- **Dag eller dato:** «i kveld», «lørdag», eller en konkret dato tre uker frem.\n- **Klokkeslett:** bare tider mellom 18 og 22 hvis det er da du kan.\n- **Hallseksjon:** hele hallen, en tredjedel, eller en spesifikk bane. Mange idrettshaller kan deles i seksjoner med skillevegg, slik at tre grupper spiller samtidig.\n- **Aktivitet:** noen seksjoner passer til volleyball, andre er utstyrt for klatring eller styrke.\n\nSier du «tredjedels hall, torsdag, etter klokka 19, innebandy», får du en liste der hver linje er en faktisk ledig time du kan booke. Ingen blaing, ingen telefon.\n\n## Hvorfor tidene endrer seg i sanntid: avbestillinger, faste tildelinger og enkelttimer\n\nLedige tider er ikke statiske, og det er en fordel. Tre ting styrer bildet gjennom uka.\n\n**Faste tildelinger** er sesongtimer som idrettslag får tildelt, typisk for et halvår om gangen. Fotballgruppa har mandager 17 til 19 hele høsten. Disse timene er som regel ikke ledige for enkeltbooking.\n\n**Enkelttimer** er det du som innbygger booker: én time neste tirsdag, ikke en fast avtale.\n\n**Avbestillinger** er grunnen til at det stadig dukker opp nye muligheter. Når et lag melder fra at de ikke bruker en fast time i en skoleferie, eller en enkeltbooking blir kansellert, frigjøres tiden. I en sanntidskalender blir den ledig for alle andre i samme sekund. Det betyr at en hall som så helt full ut mandag morgen, kan ha flere åpne kvelder onsdag. Sjekk gjerne på nytt, tilbudet lever.\n\n## Venteliste og varsel: få beskjed på SMS eller e-post når en ledig time dukker opp\n\nNoen ganger er tiden du vil ha, opptatt. Da trenger du ikke oppdatere siden hvert kvarter i håp om en avbestilling.\n\nSett deg på venteliste for et tidsrom, for eksempel «Skedsmohallen, torsdager 20 til 21». Avbestiller den som har timen, sender systemet deg et varsel på SMS eller e-post med en gang, og du kan booke før noen andre rekker det. Du velger selv hvor bredt du vil vente: én bestemt hall og time, eller «hvilken som helst hall i sentrum torsdag kveld».\n\nFor populære haller er dette ofte forskjellen på å få trent og ikke. En avbestilling som før forsvant til den som tilfeldigvis satt på nettsiden i rett øyeblikk, går nå til den som faktisk står i kø.\n\n## Sammenlign flere idrettshaller samtidig og finn nærmeste ledige tid\n\nEr du fleksibel på hvilken hall, men ikke på tidspunktet, snur du søket. I stedet for å åpne én hall om gangen, ber du om alle ledige tider torsdag kveld på tvers av alle kommunens idrettshaller.\n\nEn mellomstor kommune som Lillestrøm har en rekke idrettshaller. Å ringe rundt til hver av dem er urealistisk. Med et samlet søk får du én liste: hvilke haller som er ledige torsdag 20 til 21, sortert etter avstand fra deg. Vil du ha nærmeste ledige tid akkurat i dag, filtrerer du på «i dag» og lar systemet vise nærmeste treff. Dette er kjernen i å finne ledig idrettshall i dag uten å gjette: ett søk, alle haller, sortert etter det som betyr noe for deg.\n\n## Fra ledig tid til bekreftet booking: reservasjon og betaling i samme flyt\n\nEn ledig tid du ser, men ikke får booket, er verdiløs. Derfor henger søk og booking sammen i én flyt.\n\nNår du velger en time, reserveres den for deg noen minutter mens du fullfører. Slik unngår du at noen kaprer den mens du legger inn detaljer. Du logger inn trygt med BankID eller magic link, bekrefter formål og antall, og betaler med Vipps eller kort der hallen krever betaling. Er timen gratis for din type bruk, hopper du over betalingssteget. Bekreftelsen kommer på skjermen og på e-post, og bookingen ligger på Min Side sammen med alt annet du har reservert.\n\nHele veien fra du åpner kalenderen til du har en bekreftet time tar under to minutter når du vet hva du vil ha. Ingen telefon, ingen venting på svar neste morgen.\n\n## Vanlige årsaker til at ingen tider vises\n\nNoen ganger ser du en tom liste. Det betyr sjelden at systemet er nede. De vanligste årsakene er:\n\n- **Fast tildeling:** hele hallen er tildelt idrettslag i sesongen, typisk hverdager mellom 16 og 22. Prøv dagtid, sen kveld eller helg.\n- **Vedlikehold:** gulvsliping, kontroll av utstyr eller rengjøring. Hallen er stengt for booking en avgrenset periode.\n- **Stengt hall:** ferier, arrangementer eller bygningsarbeid kan ta hele hallen ut av kalenderen midlertidig.\n- **For strengt søk:** filtrerer du på «tredjedels hall, mandag, 18 til 19, klatring», kan alle fire kriteriene til sammen gi null treff. Løsne på ett av gangen, ofte er det tidspunktet eller seksjonen som stenger deg ute.\n\nEr det stille i én hall, bruk det samlede søket over flere haller. Ofte finnes det en åpning i nabohallen samme kveld.\n\n## Hvorfor riktig visning av ledige tider også gir bedre utnyttelsesgrad for kommunen\n\nDette handler ikke bare om deg. Når ledige tider vises korrekt og i sanntid, blir hallene bedre utnyttet.\n\nEn avbestilt time som ingen ser, står tom. Med venteliste og varsel går den samme timen til noen som vil trene. Idrettshaller har typisk godt belegg på kveldstid, men hull på dagtid og i randtimene. Når disse hullene blir synlige og enkle å booke, fylles flere av dem. En idrettshall koster betydelige summer å drifte hvert år uansett hvor mange timer den faktisk er i bruk, så hver tomme time er tapt kapasitet.\n\nFor deg som innbygger betyr det flere reelle muligheter. For kommunen betyr det at anleggene folk allerede har betalt for gjennom skatten, faktisk brukes. Riktig visning av ledige tider er derfor både en tjeneste til innbyggeren og et driftsverktøy.\n\n## Ofte stilte spørsmål om ledige tider og booking i idrettshall\n\n### Hvordan finner jeg ledige tider i idrettshallen akkurat nå?\nÅpne sanntidskalenderen for kommunens haller og filtrer på «i dag». Du ser hva som er ledig i samme øyeblikk, uten å ringe drift.\n\n### Kan jeg booke en enkelttime, eller må jeg være med i et idrettslag?\nDu kan booke en enkelttime som privatperson. Faste tildelinger går til lag og foreninger, men enkelttimer og ledige avbestillinger er åpne for innbyggere.\n\n### Hva gjør jeg hvis tiden jeg vil ha er opptatt?\nSett deg på venteliste for den timen. Avbestiller noen, får du varsel på SMS eller e-post og kan booke før andre.\n\n### Hvorfor vises det ingen ledige tider i hallen jeg vil bruke?\nVanligvis fordi hallen er fast tildelt i sesongen, er under vedlikehold eller midlertidig stengt. Prøv et annet tidspunkt, eller søk på tvers av flere haller.\n\n### Hvor raskt kan jeg booke en ledig time?\nMed et konkret søk og innlogging via BankID eller magic link tar det under to minutter fra du åpner kalenderen til du har bekreftet booking.\n\n### Kan jeg sammenligne flere idrettshaller samtidig?\nJa. Søk på et tidsrom uten å velge hall, så får du alle ledige tider på tvers av hallene, sortert etter avstand fra deg.\n\n## Se det i praksis\n\nVil du se hvordan sanntidskalenderen, ventelisten og bookingflyten henger sammen for innbyggerne i din kommune? Book en demo, så viser vi deg hvordan en innbygger finner og booker en ledig idrettshall på under to minutter, og hvordan kommunen får bedre utnyttelse av hallene på kjøpet.';
const __vite_glob_0_32 = '---\nslug: idrettshall-ledige-tider-booking-sanntid-innbygger\ntitle: "Ledige tider i idrettshallen: søk i sanntid og book fra mobilen"\ndescription: "Se ledige treningstider på tvers av alle idrettshaller i kommunen i sanntid, få varsel når en time avbestilles, og book fra mobilen på under ett minutt."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/realtime_updates_hero_no.webp"\nkeywords: ["idrettshall ledige tider", "booking idrettshall", "ledige treningstider idrettshall", "mobil booking idrettshall", "venteliste idrettshall", "avbestilte timer varsel"]\n---\n\nDu vil spille innebandy en tirsdag, men vet ikke om noen idrettshall i kommunen har en ledig time. Den gamle måten var å ringe servicetorget, vente på svar og ofte få «sjekk ukeplanen på nettsiden», en plan som allerede var utdatert. Denne guiden viser hvordan du finner reelle ledige tider i sanntid, booker fra mobilen og får varsel når en avbestilt time åpner seg.\n\n## Hva «ledige tider» betyr i en idrettshall, og hvorfor bildet endrer seg\n\nEn idrettshall er sjelden helt tom eller helt full. Kapasiteten deles i tidsblokker, som regel timer eller halvtimer, ofte splittet på flere baner i samme hall. En «ledig time» er en blokk der ingen har en bekreftet booking, verken et lag med fast treningstid eller en privatperson med en enkelttime.\n\nBildet endrer seg gjennom sesongen. Fra august til oktober fordeler kommunen faste treningstider til lag og foreninger, og da fylles kveldene mellom klokken 17 og 21 raskt opp. På dagtid, i helger og i skoleferier er det langt mer restkapasitet. En hall som ser «full» ut i oktober kan ha flere ledige kveldstimer i mars, når enkelte lag avslutter innesesongen.\n\nPoenget: ledighet er ferskvare. En statisk ukeplan som oppdateres manuelt, eller «hver natt», forteller deg hvordan hallen så ut i går, ikke hvordan den ser ut nå. Det er forskjellen mellom å planlegge på gammel informasjon og å booke på det som faktisk er tilgjengelig i dette øyeblikket.\n\n## Faste treningstider for lag versus enkelttimer for privatpersoner\n\nTo ulike bookingløp lever i samme kalender, og det er nyttig å forstå forskjellen.\n\n**Faste treningstider** tildeles lag og foreninger for en hel sesong. Håndballklubben som har mandag 18–20 hele vinteren, har en fast tildeling. Disse behandles av en saksbehandler i kommunen etter en søknadsrunde, og de legger beslag på de mest attraktive kveldstimene.\n\n**Enkelttimer** er det du som privatperson booker: én time på lørdag for en bursdag, eller en fast ukentlig time for et vennegjeng-lag uten organisasjonsnummer. Disse går inn i restkapasiteten som er igjen etter at de faste tildelingene er lagt.\n\nI Digilist ligger begge løpene i den samme kalenderen, men de vises tydelig atskilt. Når du søker som innbygger, ser du bare det som faktisk er ledig for enkeltbooking, ikke blokker som allerede er bundet opp i faste treningstider. Du slipper altså å forsøke å booke en time som ser åpen ut, men som klubben har hånd om.\n\n## Slik søker du ledige tider på tvers av flere idrettshaller samtidig\n\nDe fleste kommuner har mer enn ett anlegg. En kommune som Lillestrøm har flere idrettshaller og en rekke gymsaler i tillegg. Den gamle måten var å åpne én PDF eller én kalender per anlegg og lete manuelt.\n\nI Digilist søker du på tvers av alle anlegg i én operasjon. Du velger:\n\n- **Dato eller datointervall**, for eksempel «lørdag 9. august» eller «alle tirsdager i august»\n- **Tidsrom**, for eksempel etter klokken 18\n- **Type aktivitet eller banestørrelse**, hvis hallen er delbar i flere baner\n- **Geografi**, hvis du bare vil ha treff i nærheten\n\nResultatet er en samlet liste over alle ledige tider i alle haller og gymsaler som matcher, sortert slik at du raskt ser hva som er nærmest eller først ledig. I stedet for å sjekke seks kalendere hver for seg, ser du på ett skjermbilde at Skedsmohallen er opptatt lørdag kveld, men at gymsalen på naboskolen har en ledig time klokken 19.\n\nDette er kjernen i søket «søk ledige idrettshaller flere anlegg»: du leter etter en ledig time, ikke etter et bestemt bygg.\n\n## Sanntidsoppdatering: hvorfor en avbestilt time dukker opp med en gang\n\nAnta at et lag avbestiller onsdag 19–20 klokken 14 på ettermiddagen. Med et system som synkroniserer «hver natt», blir den timen først synlig for andre neste morgen. I mellomtiden står hallen tom, og innbyggere som leter samme kveld ser den som opptatt.\n\nDigilist oppdaterer kalenderen i sanntid. I samme sekund som avbestillingen bekreftes, frigjøres timen og blir bookbar for alle andre. Det er ingen nattlig batch-jobb som må kjøre først, og ingen manuell oppdatering av en ukeplan.\n\nKonsekvensen for deg er konkret: hvis du sitter og ser på ledige tider klokken 14.05, ser du timen som nettopp ble ledig klokken 14.00. To personer som ser på den samme timen kan ikke begge få den, for bookingmotoren låser blokken i det øyeblikket den ene bekrefter. Du unngår altså å fylle ut et skjema for en time som allerede er tatt.\n\nFor en kommune betyr sanntid også bedre utnyttelse. En time som frigjøres onsdag ettermiddag og blir synlig med en gang, har langt større sjanse for å bli fylt samme kveld enn en time som først dukker opp neste morgen.\n\n## Varsel på ønsket tid: slik erstatter push-varsel den gamle ventelisten\n\nDen gamle ventelisten var en liste hos servicetorget der noen ringte deg tilbake hvis en time ble ledig, i praksis sjelden i tide. Digilist erstatter dette med et varsel du styrer selv.\n\nFinner du ingen ledig time i det tidsrommet du ønsker, kan du sette opp et varsel: «gi meg beskjed hvis noe blir ledig i Skedsmohallen på tirsdager mellom 18 og 21». Når en time i det vinduet avbestilles, får du et push-varsel eller en e-post umiddelbart, med en direkte lenke til å booke.\n\nForskjellen fra den gamle ventelisten:\n\n- Du blir varslet i det timen faktisk blir ledig, ikke når en saksbehandler rekker å ringe\n- Varselet gjelder akkurat de kriteriene du satte, ikke en generell kø\n- Du booker selv fra lenken, uten å vente på at noen andre skal behandle deg\n\nDette dekker det mange leter etter med «avbestilte timer varsel» og «venteliste idrettshall»: du trenger ikke sitte og trykke oppdater. Systemet passer på for deg og sier ifra.\n\n## Sjekk ledige tider og book fra mobilen på under ett minutt\n\nHele flyten er bygget for mobil, fordi det er der folk faktisk sjekker ledige tider, gjerne stående på bussen.\n\nEn typisk booking tar under ett minutt:\n\n1. Åpne kommunens bookingside i mobilnettleseren, ingen app å laste ned\n2. Velg dato og tidsrom, se ledige tider på tvers av alle haller\n3. Trykk på timen du vil ha\n4. Logg inn med BankID eller magisk lenke og bekreft\n5. Betal med Vipps hvis timen krever betaling\n\nKvitteringen havner på Min Side sammen med alle dine andre bookinger, og du får en påminnelse før timen. Skulle du bli forhindret, avbestiller du fra samme skjerm, og timen går rett tilbake i sanntidskalenderen for neste person. Det er dette søket «mobil booking idrettshall» handler om: hele reisen fra «har noen en ledig time» til bekreftet booking, uten et eneste papirskjema.\n\n## Vanlige årsaker til at en time ikke vises som ledig\n\nNoen ganger leter du etter en time du vet burde være åpen, men den vises ikke. De vanligste forklaringene:\n\n- **Fast tildeling.** Timen er bundet opp i en sesongtildeling til et lag, selv om hallen står tom akkurat den uken. Klubben kan velge å frigi enkeltkvelder de ikke bruker, og da dukker de opp.\n- **Buffer for rigg og renhold.** Kommunen legger ofte inn 15–30 minutter mellom bookinger til rydding og vasking, så timen kan starte senere enn du tror.\n- **Vedlikehold eller arrangement.** Hallen kan være sperret for gulvsliping, en turnering eller valglokale, og da er blokken markert utilgjengelig.\n- **Åpningstider og aldersgrense.** Enkelte gymsaler leies ikke ut etter klokken 22, eller krever myndig ansvarlig, og timer utenfor dette filtreres bort.\n- **Minste bookinglengde.** Krever hallen minimum to timer, vises ikke en enkelt ledig time som del av en lengre blokk.\n\nSer du en time du mener burde vært bookbar, sender du en forespørsel gjennom chatten i Digilist. Da svarer en saksbehandler direkte i tråden, og du slipper å ringe.\n\n## Samme ledighetsdata sett fra driftslederens side\n\nDen samme kalenderen som viser deg ledige tider, gir driftslederen i kommunen et helt annet, men beslektet bilde. Der du ser «er denne timen ledig», ser driftslederen «hvor mye av kapasiteten står tom».\n\nHver frigjort time teller inn i utnyttelsesgraden. En idrettshall med 90 bookbare kveldstimer i uken og 72 bookede timer har en utnyttelse på 80 prosent og 18 timer restkapasitet. Driftslederen ser hvilke tidsrom som konsekvent står tomme, for eksempel tidlige lørdagsmorgener, og kan justere priser eller markedsføre dem mot innbyggere.\n\nFordi dataene er de samme og oppdateres i sanntid, oppstår det ikke avvik mellom det du ser og det kommunen ser. Når du booker en tom lørdagstime, går utnyttelsen opp med det samme, og driftslederen trenger ikke telle manuelt i et regneark. Bedre synlige ledige tider for deg betyr høyere utnyttelse for kommunen, uten at noen taster inn tall dobbelt.\n\n## Se ledige tider selv, book på ett minutt\n\nSanntidssøk på tvers av alle haller, varsel når en time avbestilles og booking fra mobilen på under ett minutt: det er forskjellen mellom å jakte på en ledig idrettshall og å faktisk få den. Vil du se hvordan dette ser ut for innbyggerne i din kommune, book en demo, så viser vi deg hele flyten fra søk til bekreftet booking.';
const __vite_glob_0_33 = '---\nslug: idrettshall-ledige-tider-booking\ntitle: "Idrettshall: slik finner og booker du ledige tider selv"\ndescription: "Sjekk ledige tider i idrettshallen, se priser og forstå prioritering mellom lag, skole og private. Book kveld og helg uten å ringe saksbehandler."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["idrettshall ledige tider", "booking idrettshall", "leie idrettshall pris", "treningstider idrettslag", "venteliste idrettshall", "avbestilling idrettshall"]\n---\n\nSkal du finne en ledig time i idrettshallen til lørdagens turnering, eller sikre faste treningstider for laget gjennom hele sesongen? Da trenger du å vite hvor du sjekker ledigheten, hva det koster, og hvordan kommunen prioriterer mellom lag, skole og private. Denne guiden går gjennom hele veien fra ledighetsoversikt til bekreftet booking.\n\n## Hva en idrettshall-booking i kommunal regi faktisk innebærer\n\nDe fleste idrettshaller i Norge eies og driftes av kommunen. Det betyr at tilgangen fordeles etter felles regler, ikke etter hvem som ringer først. En idrettshall er sjelden ett rom: en typisk flerbrukshall kan deles i to eller tre håndballflater, og hver flate kan bookes hver for seg. I tillegg kommer styrkerom, garderober og noen ganger et tilstøtende svømmeanlegg eller en gymsal på naboskolen.\n\nNår du booker en time, reserverer du en konkret flate i et konkret tidsrom. Kommunen knytter bookingen til navn, kontaktperson og formål, både for å ha oversikt ved avlysninger og for å vite hvem som har ansvar for lokalet mens dere er der. I praksis betyr det tre ting du bør ha klart før du booker:\n\n- **Hvilken flate og hvor stor plass** aktiviteten krever (hel hall, halv hall, styrkerom)\n- **Om du booker som privatperson eller på vegne av et lag** eller en forening\n- **Om du trenger en enkelttime eller fast tid** gjennom sesongen\n\nHar du dette klart, tar selve bookingen få minutter i en digital løsning.\n\n## Slik sjekker du ledige tider i idrettshallen steg for steg\n\nDet vanligste hinderet er ikke at hallen er opptatt, men at ledigheten er usynlig. Med en sanntids ledighetsoversikt slipper du å gjette. Slik gjør du det:\n\n1. **Åpne kommunens bookingoversikt** og velg idrettshallen du er ute etter, eller søk på tvers av alle haller i kommunen samtidig.\n2. **Velg dato og tidsrom.** Vil du ha en ledig hall på kvelden eller i helgen, filtrerer du på for eksempel fredag etter klokken 18 eller lørdag formiddag.\n3. **Se hva som faktisk er ledig.** En sanntidsoversikt viser grønne, ledige felt og opptatte felt side om side, oppdatert i det øyeblikket noen booker eller avbestiller.\n4. **Velg flate og tidspunkt**, fyll inn formål og antall deltakere.\n5. **Bekreft bookingen.** Du får en kvittering, og tiden forsvinner umiddelbart fra oversikten slik at ingen andre booker den samme timen.\n\nPoenget med sanntid er at det du ser er det som er sant nå. Slipper du en time som var reservert, dukker den opp for neste innbygger med en gang, i stedet for å stå tom fordi ingen fikk beskjed.\n\n## Forskjellen på å booke som privatperson og som idrettslag eller forening\n\nKommuner skiller nesten alltid mellom private brukere og organiserte lag, fordi de to har ulikt behov og ulik pris.\n\n**Som privatperson** booker du typisk enkelttimer: en bursdag i hallen, en vennekamp i futsal, eller trening for en uformell gjeng. Du betaler ofte ordinær sats, og du booker som regel nær i tid fordi behovet er engangs.\n\n**Som idrettslag eller forening** søker du om faste treningstider for en hel sesong, gjerne før sesongstart i august. Registrerte lag i Norges idrettsforbund har normalt tilgang til reduserte satser eller gratis leie for barne- og ungdomsaktivitet, og de prioriteres foran private enkeltbookinger i de mest ettertraktede kveldstidene.\n\nFor å booke som lag må organisasjonen vanligvis være registrert hos kommunen med organisasjonsnummer og en ansvarlig kontaktperson. Da knyttes alle lagets bookinger til foreningen, og styret får oversikt over egne tider ett sted.\n\n## Faste treningstider gjennom sesongen versus enkelttimer og drop-in\n\nDet finnes tre grunnleggende måter å bruke en idrettshall på, og de fordeles på hver sin måte.\n\n**Faste treningstider** går over hele sesongen, for eksempel tirsdager 18–19.30 fra september til april. Disse fordeles i en samlet søknadsrunde før sesongen, der kommunen legger kabalen for alle lag samtidig. Dette er hovedmåten idrettslag får plass på.\n\n**Enkelttimer** bookes fortløpende i ledige felt, altså timer som ikke er lagt ut som fast tid, eller tider som blir ledige når et lag melder frafall for en uke.\n\n**Drop-in** tilbys i noen kommuner i tidsrom som ellers ville stått tomme, for eksempel søndag ettermiddag, der innbyggere kan komme uten forhåndsbooking eller reservere samme dag.\n\nEn sanntidsoversikt binder de tre sammen. Melder et lag at de ikke bruker den faste tiden sin tirsdag i høstferien, blir den timen automatisk synlig som ledig enkelttime for alle andre. Slik står færre haller tomme, og flere innbyggere får brukt dem.\n\n## Priser og leiesatser: hva koster det å leie idrettshall\n\nPrisen avhenger av hvem du er, hva du skal bruke hallen til, og hvor mye plass du trenger. Satsene settes av den enkelte kommune, men mønsteret er ganske likt over hele landet:\n\n- **Barne- og ungdomsidrett** i registrerte lag leier ofte gratis eller til en symbolsk sats, fordi kommunen subsidierer aktivitet for barn.\n- **Voksenlag og seniortrening** betaler en moderat timesats, gjerne i størrelsesorden noen hundre kroner per time for en hel flate.\n- **Private og kommersielle leietakere** betaler høyest sats, og et arrangement med inngangsbilletter eller salg kan ha egne priser.\n\nSom en realistisk størrelsesorden ligger ordinær leie av en hel håndballflate for voksne typisk rundt 200–500 kroner timen, mens en halv hall koster tilsvarende mindre. Sjekk alltid kommunens gjeldende prisliste, for satsene justeres årlig. I en digital løsning vises riktig pris for din brukertype allerede når du velger tid, slik at du slipper å regne selv eller vente på et pristilbud på e-post.\n\n## Venteliste, avbestilling og no-show: hva skjer når hallen er fullbooket\n\nDe mest populære tidene, hverdagskvelder mellom 17 og 21, blir raskt fulle. Da trer tre mekanismer inn.\n\n**Venteliste.** Er tiden du vil ha opptatt, kan du sette deg på venteliste. Blir tiden ledig, får den første på listen tilbud automatisk. Dette er mer rettferdig enn å ringe rundt, og du slipper å følge med selv.\n\n**Avbestilling.** Kan laget ikke bruke en fast tid en gitt uke, skal den meldes fra i god tid, ofte med en frist på for eksempel 48 timer. Da rekker en annen å ta timen. Digital avbestilling frigjør tiden i samme øyeblikk, i stedet for at den blir stående som opptatt til noen manuelt oppdaterer et regneark.\n\n**No-show.** Møter ingen opp uten å ha meldt fra, står hallen tom mens andre kunne brukt den. Kommuner registrerer ofte gjentatt no-show og kan trekke tilbake faste tider fra lag som ikke møter. En digital løsning gjør dette synlig: kommunen ser hvem som faktisk brukte tiden sin, og kan følge opp de som stadig lar hallen stå tom.\n\nSummen er enkel. Jo raskere frigjort tid blir synlig for andre, jo bedre utnyttes hallen, og jo lettere finner du selv en ledig kveld.\n\n## Prioriteringsregler mellom idrettslag, skoler og private arrangement\n\nNår flere vil ha samme tid, avgjør kommunens prioriteringsregler. Rekkefølgen varierer, men følger som regel dette mønsteret:\n\n1. **Skolen på dagtid.** Idrettshaller ligger ofte ved en skole, og kroppsøving har førsteprioritet i skoletiden.\n2. **Barne- og ungdomsidrett** på ettermiddag og tidlig kveld.\n3. **Voksenidrett og breddeaktivitet** senere på kvelden.\n4. **Private og kommersielle arrangement**, ofte i helger og ferier når organisert trening ligger nede.\n\nI tillegg vekter mange kommuner lokale lag foran lag fra nabokommuner, og aktivitet for personer med nedsatt funksjonsevne kan ha egen prioritet. Reglene bestemmer hvem som vinner den faste tiden i sesongfordelingen, mens ledige enkelttimer utenom dette fordeles etter først til mølla. Når reglene er lagt inn i bookingsystemet, ser du med en gang hvilke tider som er reservert for skole eller faste lag, og hvilke som er åpne for deg.\n\n## Digital sanntidsbooking versus telefon og e-post\n\nDen tradisjonelle veien er å ringe eller sende e-post til en saksbehandler, som sjekker et regneark og svarer tilbake, kanskje neste dag. Da er timen du spurte om ofte allerede tatt, og runden starter på nytt.\n\nEn sanntids ledighetsoversikt kutter denne fram-og-tilbaken for begge parter:\n\n- **Innbyggeren** ser ledigheten selv, når som helst på døgnet, og booker på minuttet uten å vente på svar.\n- **Saksbehandleren** slipper telefoner og e-poster om tider som allerede er opptatt, og kan bruke tiden på fordeling, oppfølging og drift.\n\nLillestrøm kommune og andre kommuner med mange idrettsanlegg håndterer hundrevis av bookinger i uken. Flytter man bare halvparten av disse fra telefon og e-post til selvbetjening, forsvinner en stor mengde manuelt arbeid, samtidig som innbyggerne får svar umiddelbart i stedet for å vente. Ledige tider som før forsvant i en e-postkø, blir nå brukt.\n\n## Slik får kommunen idrettshallen på nett med Digilist\n\nDigilist samler alle kommunens idrettshaller i én sanntids ledighetsoversikt. Innbyggere og lag ser hva som er ledig kveld og helg, filtrerer på dato og flate, og booker selv uten å ringe eller sende e-post. Prioriteringsregler, brukertyper og priser legges inn én gang, og systemet viser riktig sats og tilgjengelighet automatisk. Faste sesongtider, enkelttimer, venteliste og avbestilling håndteres samme sted, slik at frigjort tid blir synlig for neste innbygger med en gang.\n\nVil du se hvordan kommunen kan få idrettshallene på nett og fjerne telefonkøen for både innbyggere og saksbehandlere? **Book en demo**, så viser vi deg ledighetsoversikten i praksis.';
const __vite_glob_0_34 = '---\nslug: id-porten-bankid-integrasjon-kommune-booking\ntitle: "ID-porten og BankID: Slik sikrer Digilist bookingen din"\ndescription: "Lær hvordan Digilist integrerer ID-porten, BankID og Outlook slik at kommunen din får sikker autentisering, kalendersync og full revisjonsspor uten tilleggsarbeid."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "IT-leder"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["ID-porten", "BankID", "Outlook-integrasjon", "kommune booking", "autentisering offentlig sektor", "revisjonsspor", "GDPR"]\n---\n\nOffentlig sektor stiller strenge krav til hvem som får tilgang til hvilke tjenester, og med god grunn. Når innbyggere booker time hos NAV-kontoret, bestiller plass i kommunal barnehage eller reserverer et møterom på rådhuset, må kommunen kunne dokumentere at riktig person fikk tilgang til riktig ressurs til riktig tid. Det holder ikke med brukernavn og passord.\n\nFor IT-ledere i kommunal sektor betyr dette at bookingløsningen må snakke med ID-porten og BankID. Den må synke med eksisterende kalendersystemer. Og den må produsere revisjonslogger som tåler intern kontroll og tilsyn fra Datatilsynet. Denne artikkelen forklarer hvordan Digilist løser alle tre kravene, uten at IT-avdelingen din trenger å skrive en eneste linje integrasjonskode.\n\n## Hvorfor ID-porten og BankID er obligatorisk i offentlig sektor\n\nDigitaliseringsrundskrivet fra Kommunal- og distriktsdepartementet krever at offentlige digitale tjenester rettet mot innbyggere skal bruke nasjonale felleskomponenter, herunder ID-porten, for autentisering. Det er ikke et anbefalt tiltak. Det er et krav.\n\nBakgrunnen er todelt:\n\n**GDPR og dataminimering.** Kommunen skal bare samle inn personopplysninger den faktisk trenger. Når autentisering delegeres til ID-porten, slipper kommunen å lagre passordhasher, e-postadresser og sekundære identifikasjonsfaktorer selv. ID-porten eier identiteten, kommunen eier tjenesten.\n\n**Revisjonsspor og sporbarhet.** Ved klager, innsyn eller tilsyn må kommunen kunne dokumentere hvem som bestilte hva og når. En bokstavelig logg med «bruker klikket på Bekreft» er ikke tilstrekkelig. Det kreves en kryptografisk verifisert kobling mellom en autentisert identitet (personnummer) og en konkret handling i systemet.\n\nBankID oppfyller høyeste sikkerhetsnivå (nivå 4 i eIDAS-terminologien), noe som gjør det egnet for tjenester som krever sterk autentisering, for eksempel booking av helsetjenester, juridisk veiledning eller tjenester knyttet til barnevernssaker.\n\n## Slik integrerer Digilist med ID-porten\n\nDigilist er sertifisert tjenesteintegrasjon mot ID-porten via Digdirs OIDC-baserte API. I praksis betyr det følgende flyt for innbyggeren:\n\n1. Innbyggeren klikker «Book time» på kommunens nettside.\n2. Digilist sender en autentiseringsforespørsel til ID-porten.\n3. Innbyggeren logger inn med BankID, BankID på mobil eller Buypass, alt etter hva kommunen har konfigurert som minimum sikkerhetsnivå.\n4. ID-porten returnerer en verifisert token med personnummer og navn.\n5. Digilist oppretter eller gjenoppretter en bookingprofil basert på personnummeret, uten at innbyggeren trenger å opprette eget brukernavn.\n\nFor kommunalt ansatte er flyten annerledes. Saksbehandlere, driftsledere og andre interne brukere logger inn via Microsoft Entra ID (tidligere Azure AD) med kommunens eksisterende Microsoft 365-kontoer. Det betyr at en saksbehandler som allerede er innlogget på sin kommunale PC, automatisk er autentisert i Digilist, ingen ekstra innlogging, ingen ekstra passord.\n\nDenne todelingen, BankID for innbyggere, Microsoft Entra for ansatte, er bevisst. Det gjenspeiler den faktiske brukerstrukturen i norske kommuner og eliminerer behovet for å administrere egne brukerkontoer i bookingplattformen.\n\n## Direkte synking med Outlook-kalender\n\nEn av de mest praktiske konsekvensene av Microsoft Entra-integrasjonen er at Digilist kan synke bookinger direkte mot den ansattes Outlook-kalender via Microsoft Graph API.\n\nUten denne integrasjonen ser hverdagen slik ut: En innbygger booker en time i bookingsystemet. Saksbehandleren ser bookingen i systemet, men må manuelt legge den inn i Outlook for å unngå dobbeltbooking med andre møter. Hvis hun glemmer det, ender hun opp med to møter på samme tidspunkt. Eller hun husker det, men skriver feil klokkeslett.\n\nMed Digilists Outlook-synk skjer dette automatisk:\n\n- Når en innbygger bekrefter en booking, opprettes en kalenderoppføring i saksbehandlerens Outlook-kalender umiddelbart.\n- Hvis bookingen kanselleres eller flyttes, oppdateres kalenderoppføringen tilsvarende.\n- Tilgjengeligheten i Digilist speiler saksbehandlerens faktiske Outlook-kalender, inkludert møter som er lagt inn manuelt av lederen eller automatisk fra Teams-invitasjoner.\n\nFor driftsledere som administrerer lokaler og ressurser, fungerer samme logikk for romkalendrene i Microsoft 365. Rådhussalen kan ikke bookes til et innbyggermøte hvis IT-avdelingen allerede har reservert den til systemvedlikehold.\n\n## Revisjonslogg og tilgangsrettigheter\n\nDigilist logger alle hendelser i bookingprosessen med tidsstempel, autentisert bruker-ID og type handling. Loggen er uforanderlig, verken administratorer i kommunen eller Digilist-support kan slette enkeltoppføringer.\n\nEn typisk loggrad for en booking ser slik ut:\n\n```\n2026-03-14T09:12:44Z | AUTHENTICATE | sub=04067812345 | provider=ID-porten | level=High\n2026-03-14T09:12:51Z | CREATE_BOOKING | resource=room-203 | slot=2026-03-21T10:00 | actor=04067812345\n2026-03-14T09:12:51Z | CALENDAR_SYNC | outlook_event_id=AAMk... | status=created\n```\n\nDenne revisjonsloggen eksporteres som CSV eller JSON og kan leveres direkte til intern kontroll, DPO (Data Protection Officer) eller Datatilsynet ved behov.\n\nTilgangsrettigheter styres via rollebasert tilgangskontroll (RBAC) koblet mot Entra ID-grupper. En saksbehandler ser bare bookinger knyttet til sin egen enhet. En driftsleder ser ressurskalendrene for sine bygg. En systemadministrator har tilgang til hele tenanten. Ingen av disse trenger å konfigureres manuelt i Digilist, de speiler tilgangene som allerede er satt opp i kommunens Active Directory.\n\n## Praktisk eksempel: Færder kommune reduserte bookingfeil med 87 %\n\nFærder kommune i Vestfold innførte Digilist som bookingløsning for tekniske tjenester og innbyggerdialog i 2025. Før implementeringen håndterte de booking via e-post og telefon, med manuell overføring til Outlook-kalendere. Resultatet var forutsigbart: dobbeltbookinger, manglende bekreftelser og et revisjonsgrunnlag som i praksis ikke eksisterte.\n\nEtter at Digilist ble koblet til ID-porten og kommunens Microsoft 365-miljø, målte de en reduksjon på 87 % i bookingfeil (definert som dobbeltbookinger, kanselleringer uten forvarsel og feilregistrerte tidspunkter) i løpet av de første tre månedene. Saksbehandlerne rapporterte at den automatiske Outlook-synken alene sparte dem for om lag 20 minutter per arbeidsdag.\n\nIT-avdelingen i Færder brukte fire arbeidsdager på implementeringen, inkludert oppsett av OIDC-klienten i Digdirs selvbetjeningsportal og konfigurering av Entra ID-appregistreringen. Resten var testing og opplæring.\n\n## Hva dette betyr for IT-avdelingen din\n\nSom IT-leder i en kommune har du trolig allerede Microsoft 365 og er i gang med digitalisering av innbyggertjenester. Digilist er bygget for å passe inn i den infrastrukturen du allerede har, ikke for å erstatte den.\n\nDu trenger ikke å drifte egne identitetsleverandører. Du trenger ikke å bygge integrasjoner mot ID-porten selv. Du trenger ikke å skrive skript for å flytte bookingdata inn i Outlook. Og du trenger ikke å bekymre deg for at revisjonsloggen mangler nødvendig detaljeringsnivå ved neste tilsyn.\n\nIntegrasjonene er dokumenterte, testede og i produksjon hos norske kommuner i dag.\n\n## Book demo med vår integrasjonsekspert\n\nVil du se hvordan Digilist kobler seg til kommunens ID-porten-klient og Microsoft 365-miljø i praksis? Book en demo med vår integrasjonsekspert. Vi gjennomgår den tekniske arkitekturen, viser deg revisjonsloggen live og svarer på spørsmål om sikkerhetsmodell og databehandleravtale.\n\n[Book demo →](https://digilist.no/demo)\n';
const __vite_glob_0_35 = '---\nslug: kapasitetsstyring-idrettsanlegg-driftsleder\ntitle: "Kapasitetsstyring av idrettsanlegg: driftslederens komplette guide"\ndescription: "Slik fordeler du halltid mellom lag, skoler og private leietakere uten dobbeltbooking, med kapasitetsoversikt på tvers av flere anlegg i én kommune."\ndate: 2026-07-09\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Driftsleder"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["hvor booke idrettshall kommune", "kapasitetsstyring flere anlegg", "fordeling halltid lag foreninger", "leie idrettshall privat arrangement", "booking flerbrukshall gymsal", "belegg bruksstatistikk idrettsanlegg"]\n---\n\nEt møterom bookes for en time og står tomt igjen. En idrettshall bookes for hele sesongen, deles mellom fem lag på en kveld, brukes av skolen på dagtid og leies ut til en bursdag på lørdag. For driftslederen er idrettsanlegget den mest krevende bookingoppgaven i kommunen. Denne guiden går gjennom hvordan halltid faktisk allokeres, fra prioriteringsregler til kapasitetsstyring på tvers av flere haller.\n\n## Hvorfor kommunale idrettsanlegg er vanskeligere å administrere enn møterom og selskapslokaler\n\nEt møterom har én bruksform: noen sitter der en avgrenset periode. Et selskapslokale har to eller tre. En idrettshall har alt på en gang.\n\nPå en vanlig ukedag kan samme flerbrukshall brukes av skolen fra 08 til 15, av barneidretten fra 16 til 18, og av voksenlagene fra 18 til 22. Halvparten av tiden er halldelt: én sal til håndball, en annen til turn. Garderober må reserveres separat, utstyrsrommet kan låses av ett lag mens et annet trenger tilgang, og på lørdag skal alt være ledig for et arrangement som betaler leie.\n\nDenne kombinasjonen av faste brukere, sesongtildeling, delt kapasitet og enkeltutleie gjør at et regneark raskt bryter sammen. En driftsleder med ansvar for flere anlegg holder ikke oversikt manuelt uten at noe kolliderer. Det er ikke et spørsmål om, men når.\n\n## Fast trening kontra enkeltarrangement: to ulike bookingløp driftsleder må håndtere samtidig\n\nDe to bruksformene har helt ulik logikk, og de må håndteres parallelt.\n\n**Fast treningstid** tildeles for en hel sesong, gjerne august til juni. Håndballaget har mandag og onsdag 18 til 20 i hall A hver uke. Denne tiden søkes om en gang, godkjennes en gang, og gjentar seg automatisk. Endringer skjer sjelden, men når de skjer, påvirker de mange uker fremover.\n\n**Enkeltbooking** er alt annet: en cupdag i helgen, en bedrift som leier til firmatrim, en privatperson som skal ha barnebursdag i den lille salen. Disse er engangs, ofte betalte, og legges inn i hullene mellom den faste treningen.\n\nProblemet oppstår i grenseflaten. Når håndballaget avlyser en treningsøkt, blir det plutselig ledig kapasitet som kan selges som enkeltbooking. Når en bedrift booker en lørdag, må systemet vite at den faste treningen uansett ikke går i helgen. I Digilist ligger begge løpene i samme kalender: den faste treningen som gjentakende tildeling, enkeltbookingene som frittstående reservasjoner, og systemet stopper overlapp uansett hvilken type det gjelder.\n\n## Slik settes prioriteringsregler for lag, foreninger, skoler og private leietakere i praksis\n\nFordeling av halltid er politikk satt i praksis. De fleste kommuner har en vedtatt prioriteringsrekkefølge, og driftslederens jobb er å håndheve den konsekvent.\n\nEn typisk rekkefølge ser slik ut:\n\n1. **Skole og SFO** på dagtid, lovpålagt bruk\n2. **Barne- og ungdomsidrett** i beste kveldstid\n3. **Voksenidrett og lokale foreninger** i resten av kveldstiden\n4. **Private og kommersielle leietakere** i det som er igjen, mot betaling\n\nI praksis betyr det at et barnelag har fortrinn til klokken 18 til 20 fremfor et voksenlag, og at en privat leietaker aldri kan fortrenge organisert idrett i den faste tildelingen. Reglene kan også variere per anlegg: en kampanleggshall prioriteres til seriekamper i helgene, mens en nærmiljøhall holdes åpen for lavterskeltilbud.\n\nNår reglene ligger i systemet i stedet for i hodet på driftslederen, blir tildelingen etterprøvbar. Et lag som ikke fikk ønsket tid kan få begrunnelsen svart på hvitt, og neste sesong starter fra en dokumentert fordeling i stedet for fra minnet om hvem som ringte oftest.\n\n## Kapasitetsoversikt på tvers av flere haller og anlegg i én kommune\n\nEn driftsleder har sjelden ansvar for én hall. Ansvaret er ofte en portefølje: fire flerbrukshaller, to gymsaler på skoler, en svømmehall og et utendørs kunstgress. Kapasitetsstyring på tvers av disse er der de virkelige gevinstene ligger.\n\nUten samlet oversikt behandles hvert anlegg som en øy. Et lag får nei i sin nærhall selv om nabohallen står tom samme kveld. En cup fylles i én hall mens en annen kunne tatt overtrykket. Enkeltbookinger avvises fordi ingen så at kapasiteten fantes 800 meter unna.\n\nMed alle anlegg i samme plattform ser driftslederen belegget på tvers i én visning. Da blir spørsmålet ikke «er hall A ledig», men «hvor i kommunen finnes ledig kapasitet tirsdag 19 til 21». Det gjør at man kan:\n\n- Tilby et lag et alternativt anlegg fremfor å avvise\n- Fylle lavutnyttede haller ved å styre enkeltbookinger dit\n- Se hvilke anlegg som er overbooket og hvilke som er underbrukt før neste sesongtildeling\n\nFor en kommune med et titalls anlegg er dette forskjellen mellom å styre en portefølje og å slukke branner i hver hall for seg.\n\n## Håndtering av avlyst trening, vikarhaller og korttidsledig kapasitet\n\nFast trening avlyses hele tiden. Laget reiser på cup, treneren er syk, skolen tar hallen til eksamen. Hver avlysning skaper et hull, og hullet er en ressurs hvis noen fanger det opp.\n\nI et regneark forsvinner den ledige tiden. Ingen andre får vite at hall B er ledig onsdag fordi turnlaget meldte avbud. I et bookingsystem kan avlyst tid frigjøres automatisk og gjøres tilgjengelig for andre, enten for et lag som venter på mer tid eller som betalt korttidsutleie.\n\nVikarhall er den motsatte situasjonen. Når en hall stenges for vedlikehold en periode, må de faste brukerne flyttes. Med kapasitetsoversikt på tvers finner driftslederen ledige tider i andre anlegg og reallokerer den faste treningen dit for perioden, uten å måtte ringe hvert lag og forhandle manuelt. Endringen varsles til de berørte, og kalenderen viser den nye tiden.\n\nKorttidsledig kapasitet, hullene mellom faste økter eller frigjort tid, er også inntekt. En time som ellers hadde stått tom, kan selges til en privat leietaker samme dag hvis systemet gjør den synlig.\n\n## Hva et anlegg med garderober, utstyrsrom og flere saler krever av bookingsystemet\n\nEn idrettshall er ikke ett bookbart objekt. Den er flere, og de henger sammen.\n\nEt fullverdig system må kunne booke:\n\n- **Delbare saler**: en hall som kan deles med skillevegg, der to lag bruker hver sin halvdel samtidig, men der ett arrangement kan låse hele\n- **Garderober** som tilknyttes en booking, slik at et lag har omkledning uten at neste lag står uten\n- **Utstyrs- og lagerrom** med separat tilgangsstyring\n- **Tilleggsutstyr** som mål, matter eller lydanlegg som følger med en reservasjon\n\nPoenget er at systemet må forstå avhengighetene. Booker du hele hallen til et arrangement, skal begge halldeler og de tilhørende garderobene låses samtidig. Booker du bare den ene salen, skal den andre fortsatt være tilgjengelig for andre. En løsning som bare kan booke «hallen» som én enhet, tvinger driftslederen tilbake til manuell koordinering av alt det andre.\n\n## Rapportering: belegg, inntekter og bruksmønster driftsleder må kunne dokumentere\n\nDriftslederen skal ikke bare fordele tid, men også dokumentere hvordan den brukes. Kommunestyret vil vite om investeringen i en ny hall svarer seg. Kulturkontoret vil se hvordan halltiden fordeler seg mellom aldersgrupper og lag. Økonomiavdelingen vil ha inntektstallene.\n\nUten data blir dette gjetting. Med data samlet i plattformen kan driftslederen dokumentere:\n\n- **Belegg per anlegg og tidsrom**: hvilke haller som er fulle, hvilke timer som står tomme\n- **Fordeling mellom brukergrupper**: hvor mange timer går til barneidrett kontra voksen kontra privat\n- **Inntekter fra enkeltutleie** per anlegg og periode\n- **Bruksmønster over tid**: sammenlign sesong mot sesong, se trender i etterspørsel\n\nBelegg og bruksstatistikk for idrettsanlegg er også et beslutningsgrunnlag. Viser tallene at én hall har 95 prosent belegg mens en annen ligger på 40, forteller det noe om hvor neste investering bør gå, eller hvor markedsføringen av ledig kapasitet bør settes inn.\n\n## Eksempel: hvordan Bærum kommune styrer fordeling mellom haller i sesong og lavsesong\n\nBærum kommune driver et stort antall idrettsanlegg, med rundt tolv flerbrukshaller i tillegg til gymsaler og spesialanlegg. I sesong, fra august til påske, er etterspørselen etter kveldstid nær total. I lavsesong, sommermånedene, faller belegget kraftig.\n\nEn driftsleder i en slik portefølje har to helt ulike oppgaver gjennom året. I sesong handler alt om rettferdig fordeling av knapp kapasitet: hvem får mandag 18 til 20 i den mest attraktive hallen, og på hvilket grunnlag. Her er prioriteringsreglene og den dokumenterte tildelingen avgjørende, for hver time er omkjempet.\n\nI lavsesong snur oppgaven. Nå handler det om å fylle ledig kapasitet, gjennom enkeltutleie, cuper og arrangementer som ellers ikke får plass i sesong. Den samme kalenderen som håndhevet knapphet i vinter, brukes til å selge overskuddskapasitet om sommeren.\n\nMed alle anlegg samlet ser driftslederen begge bildene i samme visning. Sesongtildelingen legges inn som gjentakende bookinger som holder gjennom hele perioden, mens enkeltbookinger legges i hullene og i lavsesong. Rapportene viser belegget per hall gjennom året, slik at neste sesongtildeling starter fra fakta om hva som faktisk ble brukt, ikke fra hvem som klagde høyest.\n\n## Se hvordan din anleggsportefølje kan styres i én kalender\n\nFra sesongtildeling og prioriteringsregler til enkeltutleie, vikarhaller og belegg på tvers av alle anlegg: kapasitetsstyring av idrettshaller er en egen disiplin, og den lar seg ikke løse i et regneark. Book en demo, så viser vi hvordan Digilist samler hele porteføljen din i én kalender, håndhever prioriteringsreglene automatisk og gir deg rapportene du trenger for å dokumentere bruken.';
const __vite_glob_0_36 = '---\nslug: kommunalt-bookingsystem-hva-er-det\ntitle: "Kommunalt bookingsystem: hva IT-lederen må vite før kravspec"\ndescription: "Hva et kommunalt bookingsystem er, hvorfor det skiller seg fra Calendly, og hvilke krav til ID-porten, SSA-L og datalokasjon du bør stille før anskaffelse."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "IT-leder"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["kommunalt bookingsystem", "ID-porten booking", "SSA-L bookingløsning", "datalokasjon Norge GDPR", "kostnad bookingsystem kommune", "booking lag og foreninger"]\n---\n\nFør en IT-leder skriver et kravspec, kommer spørsmålene som avgjør hele anskaffelsen: hva er egentlig et kommunalt bookingsystem, og hvorfor holder det ikke å ta i bruk et generisk reservasjonsverktøy? Denne artikkelen svarer på grunnlagsspørsmålene i rekkefølge, fra begrepsavklaring til pris, integrasjoner og implementering, slik at du kan vurdere behovet før du låser deg til én løsning.\n\n## Hva er et kommunalt bookingsystem, og hvorfor skiller det seg fra generiske reservasjonsverktøy\n\nEt kommunalt bookingsystem er en løsning der innbyggere, lag og foreninger søker om og reserverer kommunale lokaler og anlegg, mens kommunen styrer tilgang, godkjenning, prioritering og fakturering. Det håndterer ikke bare «ledig time», men et helt saksforløp: hvem har rett til å booke, hvilke satser gjelder for hvilken brukergruppe, og hvordan sesongtildeling til faste leietakere fordeles på tvers av anlegg.\n\nDet er her forskjellen fra Calendly og Google Calendar blir tydelig. Generiske verktøy er bygget for én persons kalender og én type avtale. De har ingen forståelse av innbyggerpålogging via ID-porten, ingen rollestyrt saksbehandling, ingen kobling til kommunale gebyrsatser og ingen dokumentasjon på hvor data lagres. En kommune som booker gymsaler til 40 idrettslag trenger prioriteringsregler, avslag med begrunnelse og en revisjonslogg, ikke en delbar møtelenke.\n\nEt generisk verktøy løser altså kalenderproblemet, mens et kommunalt bookingsystem løser forvaltningsproblemet.\n\n## Hvilke lokaltyper og bruksområder må løsningen dekke\n\nEn kommune har sjelden bare én type lokale. Løsningen må håndtere ulike bruksmønstre samtidig:\n\n- **Idrettshaller og gymsaler:** sesongtildeling til faste lag, treningstider på kveld og helg, deling mellom skole på dagtid og foreninger på kveldstid.\n- **Møterom og grupperom:** korttidsbooking for interne enheter og eksterne leietakere, ofte med selvbetjent bekreftelse.\n- **Kulturhus og scener:** arrangementer med rigg- og øvingstid, tekniske ressurser og billetterte forestillinger.\n- **Selskapslokaler og grendehus:** utleie til private arrangementer med depositum, renholdsgebyr og nøkkelhåndtering.\n\nEn hall bookes for en hel sesong, et møterom for to timer neste tirsdag. Klarer ikke systemet begge deler i samme grensesnitt, ender kommunen med parallelle regneark og manuell koordinering, som er nettopp det anskaffelsen skulle fjerne.\n\n## Hvordan fungerer godkjenningsflyten mellom innbygger, forening og saksbehandler\n\nGodkjenningsflyten er kjernen i et kommunalt system. En typisk sak går slik:\n\n1. Innbygger eller foreningskontakt logger inn og sender en søknad om et konkret lokale og tidsrom.\n2. Systemet sjekker automatisk mot allerede godkjente bookinger og prioriteringsregler.\n3. En saksbehandler ser søknaden i en felles kø, godkjenner, avslår med begrunnelse eller ber om mer informasjon.\n4. Søkeren får svar, og ved godkjenning opprettes reservasjonen med tilhørende faktura eller gebyr.\n\nFor rene korttidsbookinger av møterom kan flyten være helautomatisk, mens sesongtildeling av haller krever manuell vurdering. Poenget er at samme system dekker begge, og at hver beslutning logges. En saksbehandler i en mellomstor kommune kan håndtere flere hundre søknader i en sesongtildeling, og uten sporbar historikk blir klagebehandling nesten umulig.\n\n## Hvilke krav bør IT-ledere stille til datalokasjon, GDPR og SSA-L\n\nEt bookingsystem behandler personopplysninger: navn, kontaktinfo, tilknytning til lag og noen ganger betalingsdata. Da gjelder personvernforordningen fullt ut, og du bør stille tre konkrete krav i konkurransegrunnlaget:\n\n- **Datalokasjon:** Krev dokumentert lagring innenfor EU/EØS, og helst i Norge. Be leverandøren navngi driftssted og underleverandører, slik at du kan vurdere overføring til tredjeland.\n- **Databehandleravtale:** En GDPR-konform databehandleravtale skal være på plass ved kontraktsinngåelse, med tydelig ansvarsdeling mellom kommunen som behandlingsansvarlig og leverandøren som databehandler.\n- **SSA-L:** For en skytjeneste kjøpt som lisens er Statens standardavtale for løpende tjenestekjøp (SSA-L) et naturlig avtalegrunnlag. Den regulerer tjenestenivå, endringshåndtering og oppsigelse. Sjekk at leverandøren aksepterer SSA-L uten omfattende forbehold.\n\nDigilist leverer med data lagret i Norge og standardvilkår tilpasset SSA-L, nettopp fordi disse punktene ofte blir avklaringspunkter sent i en anskaffelse dersom de ikke er dekket fra start.\n\n## Hvordan integreres ID-porten og BankID i bookingprosessen\n\nInnlogging via ID-porten gjør at kommunen vet hvem som faktisk står bak en booking, uten å bygge og drifte et eget brukerregister. Når innbyggeren logger inn med BankID gjennom ID-porten, får systemet et verifisert fødselsnummer og navn, og kan koble personen til riktig rolle: privatperson, kontaktperson for en forening eller kommunal ansatt.\n\nDet betyr tre ting for sikkerheten:\n\n- **Sterk autentisering** på nivå høyt, slik at ingen booker på andres vegne uten legitim tilgang.\n- **Færre falske reservasjoner**, fordi en verifisert identitet henger ved hver søknad og faktura.\n- **Enklere klagebehandling**, siden det er sporbart hvem som gjorde hva og når.\n\nFor lag og foreninger kobles en verifisert kontaktperson til organisasjonen, slik at foreningen kan booke uten at kommunen mister oversikt over hvem som er ansvarlig. Integrasjonen mot ID-porten er dermed ikke bare innlogging, men grunnlaget for hele tilgangsstyringen.\n\n## Hva koster et kommunalt bookingsystem, og hvilke prismodeller finnes\n\nPrisen avhenger av kommunens størrelse, antall anlegg og hvilke moduler som tas i bruk. De vanligste modellene er:\n\n- **Årlig lisens (SaaS):** en fast årsavgift, ofte trappet etter innbyggertall eller antall anlegg. Dette er den mest forutsigbare modellen for budsjettering.\n- **Etableringskostnad pluss abonnement:** en engangssum for oppsett, konfigurasjon og migrering, deretter løpende abonnement.\n- **Transaksjons- eller volumbasert:** pris knyttet til antall bookinger eller betalingstransaksjoner, mest aktuelt der utleie til private er stor.\n\nEn liten kommune med noen få anlegg havner typisk i et helt annet leie enn en kommune med 30 til 40 anlegg og tung sesongtildeling. Be alltid om totalkostnad over avtaleperioden, ikke bare månedspris, og få frem hva som ligger i etablering kontra løpende drift. Skjulte kostnader dukker oftest opp i migrering, integrasjoner og support, så disse bør spesifiseres i tilbudet.\n\n## Hvordan ser en typisk implementering ut\n\nImplementering av et kommunalt bookingsystem er sjelden et halvårsprosjekt, men det krever ryddig ansvarsdeling. Et vanlig forløp:\n\n1. **Oppstart og konfigurasjon (uke 1 til 3):** anlegg, lokaltyper, satser og brukergrupper legges inn. Kommunen eier innholdet, leverandøren setter opp strukturen.\n2. **Integrasjoner (parallelt):** ID-porten kobles på, sammen med eventuell fakturering og kalendersynk.\n3. **Datamigrering:** eksisterende bookinger og faste leietakere flyttes over, gjerne fra regneark eller et eldre system. Kvaliteten på gamle data avgjør hvor mye arbeid dette blir.\n4. **Test og opplæring:** saksbehandlere øver på godkjenningsflyten før innbyggerne slipper til.\n5. **Lansering:** åpning for innbyggere og foreninger, ofte i forkant av en sesongtildeling.\n\nEn kommune med ryddig datagrunnlag er typisk i drift innen 6 til 10 uker. Den største tidstyven er ikke teknologien, men å bli enige internt om satser, prioriteringsregler og hvem som skal godkjenne hva.\n\n## Eksempel fra praksis: booking på tvers av anlegg\n\nLillestrøm kommune er et konkret eksempel på utfordringen mange står i: mange idrettsanlegg, kulturlokaler og skoler som deles mellom skoledrift på dagtid og foreninger på kveldstid. Uten et samlet system blir tildelingen fragmentert, med separate lister per anlegg og risiko for dobbeltbooking når en gymsal både er skolearena og treningsflate.\n\nLøsningen på et slikt behov er ett grensesnitt der alle anlegg ligger i samme oversikt, der sesongtildeling og korttidsbooking håndteres side om side, og der saksbehandleren ser hele porteføljen fremfor ett og ett hus. Da kan foreninger søke på tvers av anlegg, mens kommunen beholder kontroll på prioritering og kapasitet. Gevinsten er mindre manuelt koordineringsarbeid og færre konflikter mellom brukergrupper som konkurrerer om de samme timene.\n\n## Vanlige spørsmål IT-ledere og saksbehandlere stiller\n\n**Kan vi bruke Calendly eller Google Calendar i stedet?**\nTil interne møterom kan det fungere, men det mangler ID-porten-pålogging, rollestyrt saksbehandling, kommunale satser og dokumentert datalokasjon. Til innbyggerrettet utleie holder det ikke.\n\n**Hvor lagres dataene?**\nKrev at leverandøren dokumenterer lagring innenfor EU/EØS, og helst i Norge, med navngitte underleverandører i databehandleravtalen.\n\n**Hvordan får lag og foreninger tilgang?**\nEn verifisert kontaktperson logger inn via ID-porten og knyttes til organisasjonen, slik at foreningen kan booke mens kommunen ser hvem som er ansvarlig.\n\n**Hva skjer med personopplysningene ved klage eller innsyn?**\nAlle beslutninger logges, slik at kommunen kan dokumentere hvem som søkte, hvem som godkjente og på hvilket grunnlag, som er nødvendig både for GDPR-innsyn og klagebehandling.\n\n**Hvor lang tid tar det å komme i gang?**\nMed ryddig datagrunnlag tar det typisk 6 til 10 uker, avhengig av antall anlegg og integrasjoner.\n\n## Neste steg\n\nGrunnlagsspørsmålene over er det som skiller en gjennomtenkt anskaffelse fra et kravspec som må skrives om halvveis. Vil du se hvordan et kommunalt bookingsystem løser godkjenningsflyt, ID-porten-innlogging og booking på tvers av anlegg i praksis, book en demo med Digilist. Da går vi gjennom din konkrete anleggsportefølje og hvilke krav du bør ta med videre til konkurransegrunnlaget.';
const __vite_glob_0_37 = '---\nslug: konferansesal-kultursal-kommune-pris-kapasitet-booking\ntitle: "Konferansesal og kultursal i kommunen: pris, kapasitet og booking"\ndescription: "Slik finner lag og foreninger pris, ledig kapasitet og teknisk utstyr for kommunale kultursaler til konsert, utstilling og seminar, før du ringer kommunen."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Lag og foreninger"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["konferanse sal kommune priser", "leie sal til konsert", "utstillingslokale kommune", "seminarrom stor kapasitet", "kultursal booking pris", "sal med scene og lyd", "ledige datoer kultursal"]\n---\n\nSkal koret ha julekonsert, foreningen arrangere årsseminar eller kunstlaget stille ut, holder det ikke med et møterom eller en gymsal. Da trenger dere en sal med scene, lyd og garderobe, og dere trenger å vite prisen og de ledige datoene før planleggingen starter. Denne guiden viser hvordan dere finner riktig kultursal i kommunen, hva den koster, og hvordan dere booker den uten å ringe rundt.\n\n## Hva skiller en kultursal fra møterom og idrettshall\n\nEt møterom er bygget for 10 til 30 personer rundt et bord. En idrettshall er bygget for aktivitet, ikke publikum. En kultursal er noe helt annet: den er tegnet for at et publikum skal se og høre en scene.\n\nDet gir konkrete forskjeller dere merker med en gang:\n\n- **Fast eller uttrekkbar scene** med plass til orkester, kor eller foredragsholder.\n- **Amfi eller nummererte stoler** slik at alle ser scenen, ikke flatt gulv.\n- **Fast lyd- og lysrigg**, ofte med lydtekniker som kan bestilles i tillegg.\n- **Garderober og backstage** for artister og frivillige.\n- **Foaje** til billettsalg, garderobe for publikum og enkel servering.\n\nLillestrøm kultursenter og Bærum kulturhus er typiske eksempler: begge har storsal med amfi til flere hundre publikummere, pluss mindre saler for seminar og utstilling. Poenget for dere som arrangør er at valget av sal styrer hele opplevelsen. Booker dere en gymsal til en konsert, mangler dere akustikk, sikt og garderobe. Booker dere et møterom til et seminar med 120 deltakere, får ikke halvparten plass.\n\n## Slik settes prisen på en kommunal kultursal\n\nPris på kultursal er sjelden ett tall. Den bygges opp av flere ledd, og det er derfor det er så vanskelig å få oversikt på telefon.\n\nDe vanligste leddene er:\n\n- **Grunnleie per dag eller kveld**, ofte delt i formiddag, ettermiddag og kveld.\n- **Rabattert sats for lag og foreninger** i egen kommune, gjerne 40 til 70 prosent lavere enn kommersiell pris.\n- **Riggetid** dagen før eller timene før arrangementet, noen ganger til redusert sats.\n- **Teknisk personell**, som lyd- og lystekniker, per time.\n- **Tilleggsutstyr**: flygel, ekstra mikrofoner, prosjektor, stolrigg.\n- **Renhold** etter arrangement.\n\nEt realistisk bilde: en storsal kan ha kommersiell kveldsleie på 8 000 til 15 000 kroner, mens en lokal forening betaler 2 500 til 5 000 for samme kveld. Legger dere til tekniker i fire timer og riggetid, kan sluttsummen likevel doble seg. Det er nettopp derfor dere bør se hele prisbildet før dere bestemmer datoen, ikke bare grunnleien.\n\nI Digilist vises alle leddene i saloversikten. Er dere registrert som forening i kommunen, ser dere foreningsprisen direkte, ikke listeprisen. Da slipper dere å regne selv eller vente på et tilbud på e-post.\n\n## Kapasitet og oppsett: konsert, utstilling eller seminar\n\nSamme sal kan romme svært ulikt antall mennesker avhengig av oppsett. Kapasitet er ikke ett tall, det er et tall per oppsett.\n\n- **Konsert med amfi eller stolrader:** flest publikummere, alle vendt mot scenen, for eksempel en sal med 400 sitteplasser i fullt amfi.\n- **Seminar med bord og stoler:** færre plasser fordi hver deltaker trenger bordplass. Samme sal tar kanskje 180 i seminaroppsett.\n- **Utstilling med åpent gulv:** ingen faste stoler, men krav til veggplass, henging og fri flyt. Her teller kvadratmeter og veggmeter mer enn stolantall.\n- **Bankett eller mingling:** runde bord eller ståbord, ofte 150 til 250 avhengig av servering.\n\nNår dere leter etter **seminarrom med stor kapasitet** eller et **utstillingslokale i kommunen**, sjekk derfor hvilket oppsett kapasitetstallet gjelder. En sal som annonseres med "plass til 400" kan ende på 160 når dere trenger bord til alle. I saloversikten viser Digilist kapasitet per oppsett, slik at dere ser om salen faktisk passer arrangementet deres før dere går videre.\n\n## Slik sjekker du ledige datoer uten å ringe kommunen\n\nDen vanligste flaskehalsen er ikke pris, det er datoen. En storsal med god beliggenhet kan være booket 6 til 12 måneder frem, særlig helger i høst- og adventsesongen. Å ringe kommunen for å høre om 14. november er ledig, koster ofte flere dager med telefonkø og tilbakeringing.\n\nMed en **tilgjengelighetskalender for kultursal** ser dere de ledige datoene i sanntid. Dere velger salen, ser hvilke kvelder som er grønne, og planlegger rundt det som faktisk er ledig. Skal koret ha konsert i desember, ser dere med en gang at tre av fire lørdager er tatt, og at søndag 7. desember er ledig. Da bruker dere energien på å booke, ikke på å vente.\n\nFor arrangører som er fleksible på dato, er dette avgjørende. I stedet for å låse dere til én kveld og håpe, ser dere hele desember på ett skjermbilde og velger den kvelden som både er ledig og har best pris.\n\n## Teknisk utstyr: scene, lyd, lys og garderobe i saloversikten\n\nEn **sal med scene og lyd** høres selvsagt ut, men det tekniske avgjør om arrangementet lar seg gjennomføre. Et kor på 40 trenger annen lyd enn en foredragsholder med lysbilder. En utstilling trenger punktbelysning, ikke scenelys.\n\nSjekk disse punktene i saloversikten før dere booker:\n\n- **Scene:** fast, uttrekkbar eller ingen, og målene på scenegulvet.\n- **Lyd:** fast PA-anlegg, antall mikrofoner, mulighet for egen tekniker.\n- **Lys:** scenelys, punktlys, mulighet for å dempe salen.\n- **Projeksjon:** lerret, projektor eller LED-skjerm for seminar.\n- **Garderober:** antall, størrelse og om de har speil og dusj for artister.\n- **Flygel eller piano:** finnes det i salen, og koster det ekstra å bruke.\n\nDigilist lister det tekniske utstyret på hvert objekt, slik at dere vet om salen har det dere trenger, eller om dere må leie inn eksternt. Det sparer den klassiske overraskelsen der koret møter opp og oppdager at det ikke finnes mikrofoner til solistene.\n\n## Booking steg for steg fra søk til bekreftet arrangement\n\nSelve bookingen skal ta minutter, ikke uker. Slik ser flyten ut i Digilist:\n\n1. **Søk** på type sal, kapasitet og område, for eksempel "kultursal, 300 plasser, konsert".\n2. **Filtrer** på ledig dato og se prisen med foreningsrabatt direkte.\n3. **Velg oppsett** (konsert, seminar eller utstilling) og eventuelt tilleggsutstyr.\n4. **Send forespørsel** med formål og forventet antall deltakere.\n5. **Chat** med saksbehandler i samme sak hvis noe må avklares, som riggetid eller tekniker.\n6. **Få bekreftelse** og kvittering på Min Side, der alle detaljer og betingelser står samlet.\n\nFordi hele dialogen ligger i saken, slipper dere e-posttråder som forsvinner og telefonbeskjeder ingen husker. Frivillige som overtar arrangementet neste år, finner hele historikken på ett sted.\n\n## Avbestilling, depositum og hva som skjer ved avlysning\n\nEt arrangement kan bli avlyst, og et kor kan bli sykt. Da er det viktig å vite betingelsene før dere signerer, ikke etter.\n\nDe vanligste betingelsene på en kommunal kultursal:\n\n- **Depositum eller forskudd** for store saler, ofte 20 til 30 prosent av leien.\n- **Avbestillingsfrister** med trappetrinn: full refusjon ved avbestilling tidlig, delvis nærmere datoen, ingen de siste dagene.\n- **Ansvar for skade** på scene, utstyr og garderober.\n- **Regler for servering og alkohol**, som kan kreve egen bevilling.\n\nI Digilist står avbestillingsvilkårene på selve objektet og i bekreftelsen, ikke gjemt i et vedlegg. Avbestiller dere innenfor fristen, håndteres refusjonen automatisk mot samme betalingsmåte. Da vet både foreningen og kassereren nøyaktig hva som gjelder, og slipper diskusjonen i etterkant.\n\n## Slik sammenligner du saler på tvers av kommunen\n\nMange kommuner har flere aktuelle saler: en storsal i kulturhuset, en mindre sal på biblioteket, en aula på en videregående skole. Skal dere velge riktig, trenger dere å sammenligne dem på like vilkår.\n\nSett opp de faktorene som betyr mest for arrangementet:\n\n- Kapasitet i det oppsettet dere trenger, ikke maks.\n- Totalpris med tekniker, rigg og renhold, ikke bare grunnleie.\n- Ledig dato i den perioden dere sikter mot.\n- Teknisk utstyr og garderobe.\n- Beliggenhet og parkering for publikum.\n\nI stedet for å hente denne informasjonen fra fire ulike telefonsamtaler, ser dere den side om side i Digilist. Koret som vurderer både kulturhuset og skoleaulaen, ser med en gang at aulaen er 40 prosent billigere, men mangler fast lydanlegg. Da er valget et faktavalg, ikke en gjetning.\n\n## Se salen, prisen og datoen før du løfter telefonen\n\nKultursaler er den typen lokale der detaljene avgjør: kapasitet per oppsett, teknisk utstyr, totalpris og ledige datoer. Digilist samler alt dette i én saloversikt, med foreningspris synlig fra første klikk, slik at lag og foreninger kan planlegge konsert, utstilling eller seminar uten en eneste telefonrunde.\n\n**Vil dere se hvordan det ser ut for deres kommune? Book en demo, så viser vi saloversikten, priskalkylen og bookingflyten på egne saler.**';
const __vite_glob_0_38 = '---\nslug: leie-idrettshall-kommune-komplett-guide-lag\ntitle: "Leie idrettshall i kommunen: komplett guide for lag og foreninger"\ndescription: "Fra å finne ledig hall til fast treningstid, priser og avlysning. Slik booker idrettslag kommunale anlegg uke etter uke, uten papir og venting."\ndate: 2026-07-09\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Lag og foreninger"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["hvor booke idrettshall kommune", "leie gymsal kommune", "booke treningstid idrettslag", "idrettshall priser leie", "søke fast treningstid", "avbestille idrettshall"]\n---\n\nEt idrettslag booker sjelden bare én time. Dere trenger fast tid hver tirsdag, en ekstra økt før kamp, og noen ganger en helg til turnering. Denne guiden går gjennom hele leieprosessen for kommunale idrettshaller og gymsaler, fra å finne riktig anlegg til å håndtere avlysning og bytte av treningstid.\n\n## Hvilke idrettshaller og anlegg kan du faktisk booke i kommunen din\n\nKommunen eier og drifter flere typer anlegg enn de fleste tror. Det vanligste er de store idrettshallene med håndballmål og oppmerking, men porteføljen inkluderer også gymsaler på skoler, mindre aktivitetssaler, svømmehaller, kunstgressbaner og friidrettsanlegg. Skolelokaler er ofte tilgjengelige for utleie på ettermiddag og kveld når undervisningen er ferdig.\n\nI en kommune på størrelse med Lillestrøm snakker vi om godt over 20 haller og gymsaler som kan bookes av lag og foreninger. Utfordringen har historisk vært at hvert anlegg lever på sin egen liste, sitt eget regneark eller sin egen saksbehandler. Da blir det tungvint å se hva som faktisk finnes.\n\nI et samlet bookingsystem ligger alle anleggene i én katalog. Du ser hall, gymsal og bane side om side, med bilder, kapasitet, utstyr og åpningstider. Det gir deg oversikt over reelle alternativer før du søker, ikke bare det ene anlegget noen tipset deg om.\n\n## Slik finner du ledig tid: søk, filter og tilgjengelighetskalender i praksis\n\nDet første spørsmålet er nesten alltid: finnes det en **ledig idrettshall i dag**, eller på den tiden vi trenger? Et moderne system svarer på dette uten telefonrunder.\n\nDu filtrerer på type anlegg, geografi, kapasitet og utstyr, og får opp treffene som passer. Deretter åpner du tilgjengelighetskalenderen for hvert anlegg. Grønt betyr ledig, opptatt tid er markert, og du ser med en gang om onsdag kveld er tatt eller om det finnes en luke tidligere.\n\nEn sanntidskalender er avgjørende her. Hvis kalenderen bare oppdateres om natten, risikerer du å søke på en tid som allerede er booket noen timer tidligere. Da får du avslag i etterkant, og hele prosessen starter på nytt. Med sanntidsvisning ser du samme tilgjengelighet som saksbehandleren, i det øyeblikket du ser på den.\n\nFor faste brukere er dette spesielt nyttig: dere kan planlegge hele sesongen ved å se hvilke faste luker som er åpne, i stedet for å gjette.\n\n## Faste treningstider vs. enkelttimer: hva er forskjellen i søknadsprosessen\n\nHer ligger den viktigste distinksjonen for et lag. Det finnes to helt ulike prosesser.\n\n**Enkelttimer** er en engangsbooking: én kamp, én dugnad, én turnering. Du velger tid, søker, og får som regel raskt svar. Dette bruker dere til det som ligger utenfor det faste treningsopplegget.\n\n**Faste treningstider** fordeles gjennom sesongtildeling. Kommunen setter en søknadsfrist, gjerne i mai eller juni for påfølgende sesong, og fordeler så all treningstid samlet. Grunnen er rettferdighet: hvis fast tid ble delt ut fortløpende, ville laget som søkte først få de beste tidene år etter år. Ved samlet fordeling kan kommunen veie barn og unge, aktivitetsnivå og geografisk spredning opp mot hverandre.\n\nFor dere betyr det:\n\n- **Fast treningstid** søkes én gang per sesong, innen fristen, og gjelder for eksempel hver tirsdag 18–20 fra august til juni.\n- **Enkelttimer** søkes ved behov, ofte gjennom hele året, og bekreftes raskere.\n\nÅ blande disse er en vanlig kilde til frustrasjon. Søker du om fast tid etter fristen, havner du i restfordelingen med det som er igjen.\n\n## Hva koster det å leie idrettshall: prisregler, moms og gratis lag-satser\n\nPrisene på **leie av idrettshall** varierer mye, og det er logikk bak variasjonen. De fleste kommuner opererer med flere satser:\n\n- **Gratis eller sterkt subsidiert** for lokale lag med aktivitet for barn og unge under 19 år. Dette er hovedregelen for treningstid, og en bevisst prioritering.\n- **Redusert sats** for andre lokale foreninger og voksenaktivitet.\n- **Full kommersiell sats** for bedrifter, private arrangementer og aktører utenfor kommunen.\n\nEn idrettshall til en kveldstime kan variere fra 0 kroner for et barnelag til flere hundre kroner i timen for kommersiell bruk. En gymsal er som regel rimeligere enn en fullstor hall.\n\nUtleie av fast eiendom er i utgangspunktet fritatt for merverdiavgift, men enkelte tilleggstjenester kan komme med moms. I praksis ser laget deres én samlet pris, og systemet håndterer momsberegningen automatisk basert på hvilken kategori dere tilhører. Det avgjørende er at dere er registrert med riktig lag-status, ellers risikerer dere feil sats.\n\nEt samlet bookingsystem knytter prisregelen til lagets profil. Er dere godkjent som lokalt barne- og ungdomslag, blir gratissatsen brukt automatisk. Dere slipper å forhandle om pris hver gang.\n\n## Slik søker og bekrefter du booking steg for steg\n\nSelve prosessen er kort når systemet er på plass. En typisk **booking av treningstid** ser slik ut:\n\n1. **Logg inn** med det laget er registrert på. De fleste kommuner bruker ID-porten eller BankID for sikker innlogging, slik at søknaden knyttes til en reell person og et reelt lag.\n2. **Finn anlegget** i katalogen, filtrer på type og område.\n3. **Velg tid** i tilgjengelighetskalenderen. For fast tid velger du gjentakende mønster, for eksempel hver tirsdag i sesongen.\n4. **Fyll ut formålet**: hvilken aktivitet, hvor mange deltakere, aldersgruppe. Dette avgjør både prioritet og pris.\n5. **Send søknaden.** Du får en kvittering med referanse med det samme.\n6. **Motta svar.** For enkelttimer kommer bekreftelsen ofte i løpet av kort tid. For fast tid får du svar etter fordelingen.\n\nAlt samles på Min Side: aktive bookinger, søknader under behandling, meldinger fra saksbehandler og kvitteringer. Du slipper å lete i e-postinnboksen etter hva laget faktisk har fått tildelt.\n\n## Avlysning, endring og bytte av treningstid: reglene du må kjenne\n\nPlaner endrer seg. Et lag som booker fast, trenger å kunne **avbestille en idrettshall-booking** eller flytte en økt uten å ringe rundt.\n\nRegelen de fleste kommuner følger, er at avlysning skal skje i god tid, ofte minst 24 til 48 timer før. Grunnen er praktisk: en frigitt time kan da tilbys et annet lag, og hallen står ikke tom. Avlyser dere for sent, kan tiden faktureres selv om dere ikke møtte opp, akkurat som ved sen avbestilling andre steder.\n\nI et digitalt system gjør du dette selv, uten å vente på en saksbehandler:\n\n- **Avlys en enkelt økt** i en fast serie, for eksempel når laget er på cup en helg. Resten av serien består.\n- **Endre tid** hvis en luke passer bedre, forutsatt at den er ledig.\n- **Bytt treningstid** med et annet lag der kommunen tillater det, gjennom en forespørsel begge parter godkjenner.\n\nFrigitt tid legges umiddelbart tilbake i kalenderen som ledig. Det er slik hallen holdes i bruk, og hvordan et annet lag kan finne den ledige idrettshallen samme dag.\n\n## Vanlige feil som gjør at søknaden avslås eller forsinkes\n\nDe fleste avslag skyldes ikke at det er fullt, men enkle feil som er lette å unngå:\n\n- **Søkt etter fristen for fast tid.** Sesongtildelingen skjer samlet. Kommer søknaden inn etterpå, konkurrerer dere kun om restkapasiteten.\n- **Feil eller manglende lagregistrering.** Er ikke laget registrert som lokal barne- og ungdomsforening, får dere ikke gratissatsen og kan bli nedprioritert.\n- **Uklart formål.** Skriv hvilken aktivitet, hvor mange og hvilken aldersgruppe. «Trening» alene gir saksbehandleren for lite til å prioritere riktig.\n- **Booket feil anlegg.** En gymsal på 200 kvadratmeter passer ikke for full håndballtrening. Sjekk kapasitet og oppmerking før dere søker.\n- **Glemt kontaktperson med tilgang.** Bookingen bør ligge på laget, ikke på en enkeltperson som slutter i styret. Da mister dere oversikten når vervet skifter.\n\nEt system som viser krav og felter tydelig underveis, fanger opp de fleste av disse feilene før dere sender søknaden.\n\n## Spørsmål og svar: det lag og foreninger lurer mest på\n\n**Kan vi booke en idrettshall samme dag?**\nJa, hvis den er ledig. Enkelttimer som ikke er tildelt fast, kan bookes fortløpende. Sanntidskalenderen viser hva som faktisk er åpent akkurat nå.\n\n**Hvordan søker vi om fast treningstid?**\nGjennom sesongtildelingen, innen kommunens frist. Du velger gjentakende tid i kalenderen og oppgir aktivitet og aldersgruppe. Fordelingen skjer samlet etter fristen.\n\n**Er det gratis for barnelag å leie gymsal?**\nI de fleste kommuner er treningstid gratis eller sterkt subsidiert for lokale lag med aktivitet for barn og unge. Forutsetningen er at laget er riktig registrert.\n\n**Hva skjer hvis vi ikke bruker en booket time?**\nAvlys i god tid, gjerne minst et døgn før, så frigis tiden til andre. Uteblivelse uten avlysning kan faktureres.\n\n**Kan vi bytte fast treningstid med et annet lag?**\nDer kommunen tillater det, ja. Byttet skjer som en forespørsel begge lag bekrefter, slik at kalenderen holdes riktig.\n\n**Hvor finner vi alle anleggene kommunen leier ut?**\nI bookingsystemets katalog. Der ligger idrettshaller, gymsaler, svømmehaller og baner samlet, med kapasitet, utstyr og tilgjengelighet.\n\n## Fra papirsøknad til fast plass i kalenderen\n\nEt lag som booker uke etter uke, taper mest på uoversiktlige systemer: tid som forsvinner i telefonrunder, avslag på grunn av misforståelser, og en fast treningstid som er umulig å planlegge rundt. Digilist samler katalog, sanntidskalender, sesongtildeling, pris og avlysning på ett sted, med sikker innlogging via ID-porten og BankID.\n\nVil dere se hvordan hele leieprosessen ser ut for et idrettslag, fra søknad til fast plass i kalenderen? [Book en demo](https://digilist.no/demo), så viser vi det på anleggene i deres kommune.';
const __vite_glob_0_39 = '---\nslug: leie-idrettshall-privat-enkelttime-innbygger\ntitle: "Leie idrettshall privat: slik booker du enkelttime selv"\ndescription: "Praktisk guide for privatpersoner og uorganiserte grupper som skal booke kommunal idrettshall, gymsal eller anlegg selv, uten lag og uten å ringe."\ndate: 2026-07-11\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/realtime_updates_hero_no.webp"\nkeywords: ["hvor booke idrettshall kommune", "leie idrettshall privat", "booke gymsal enkelttime", "leie idrettshall bursdag", "pris leie idrettshall kommune", "booke idrettsanlegg uten medlemskap", "ledige tider idrettshall"]\n---\n\nSkal du samle vennegjengen til innebandy en søndag, feire bursdag i gymsalen eller trene fast uten å være med i et lag? Da leier du hallen som privatperson, ikke gjennom en klubb. Denne guiden viser hvem som kan booke, hvor du finner ledige tider, hva det koster og hvordan du unngår at bookingen blir avvist.\n\n## Hvem kan booke en kommunal idrettshall: innbygger, lag, bedrift eller forening\n\nKommunale idrettshaller er åpne for langt flere enn de organiserte idrettslagene. I praksis leier fire grupper anlegg:\n\n- **Innbyggere og uorganiserte grupper.** En privatperson kan booke en enkelttime til egentrening, en aktivitetsdag med kollegaer eller en bursdag. Du trenger ikke å være medlem av noe lag.\n- **Lag og foreninger.** Registrerte klubber søker om fast treningstid gjennom sesongtildelingen og betaler ofte redusert sats eller ingenting for barne- og ungdomsaktivitet.\n- **Bedrifter.** Firmaidrett, kick-off eller interne arrangementer bookes til kommersiell sats.\n- **Andre offentlige aktører.** Skoler, SFO og nabokommuner bruker anleggene på dagtid.\n\nPoenget for deg som innbygger: du konkurrerer ikke med idrettslagene om de faste kveldstidene. Du booker enkelttimer i det som er ledig etter at sesongtildelingen er lagt, typisk hull på dagtid, sene kvelder og helger. I en kommune som Lillestrøm betyr det at en gymsal ofte har god plass lørdag formiddag, mens tirsdag klokken 18 er fullbooket av håndballen.\n\n## Hvor finner du oversikt over ledige haller, gymsaler og anlegg i kommunen din\n\nFørste steg er å finne en oppdatert oversikt over ledige tider. Tre veier er vanlige:\n\n1. **Kommunens bookingportal.** De fleste kommuner har en digital tjeneste der du søker opp anlegg, ser en kalender og booker direkte. Det er her du skal ende opp.\n2. **Kommunens nettsider.** Søk på «leie lokaler» eller «booke idrettshall» pluss kommunenavnet. Siden lenker som regel videre til portalen.\n3. **Telefon til servicetorget.** Fungerer, men er tregt og gir deg sjelden sanntidsoversikt.\n\nDet avgjørende er om kalenderen viser tilgjengelighet i sanntid. En portal som «oppdateres hver natt» kan vise en time som ledig selv om noen booket den for en time siden. I Digilist er kalenderen sanntidsstyrt: når en time er tatt, forsvinner den umiddelbart for alle andre, så du slipper å oppdage kollisjonen først etter at du har fylt ut skjemaet. Du kan filtrere på anleggstype, dato og kapasitet, og se pris før du bekrefter.\n\n## Steg for steg: slik booker og betaler du en enkelttime uten å ringe noen\n\nSelve bookingen tar under to minutter når portalen er bygget for det:\n\n1. **Logg inn.** Bruk ID-porten eller BankID. Da er identiteten din verifisert, og du slipper å registrere navn, adresse og fødselsnummer manuelt.\n2. **Velg anlegg og tid.** Finn hallen eller gymsalen, klikk på en ledig time i kalenderen. Grå felt er opptatt, ledige felt er klikkbare.\n3. **Oppgi formål.** Trening, bursdag, arrangement. Formålet avgjør ofte hvilken pris og hvilke regler som gjelder.\n4. **Se totalpris.** Timespris, eventuelt depositum og gebyr summeres før du bekrefter. Ingen skjulte tillegg som dukker opp på faktura senere.\n5. **Betal.** Vipps eller kort gir umiddelbar bekreftelse. Velger du faktura, kommer den i etterkant.\n6. **Få kvittering.** Bekreftelsen ligger på Min Side sammen med adresse, tidspunkt og eventuell adgangskode til døra.\n\nHele poenget er at du gjennomfører dette selv, når det passer deg, uten å ringe servicetorget i åpningstiden. En innbygger som en fredag kveld vil booke gymsal til søndagsfotball skal ikke måtte vente til mandag på svar.\n\n## Fast leie for lag og foreninger versus enkelttime for privatpersoner: hva er forskjellen\n\nDette er skillet flest blander sammen. To ordninger lever side om side:\n\n| | Fast sesongtildeling | Enkelttime (privat) |\n|---|---|---|\n| Hvem | Registrerte lag og foreninger | Privatpersoner, uorganiserte grupper, bedrifter |\n| Når søker du | Én gang før sesongen, ofte med frist i mai for høsten | Fortløpende, når som helst |\n| Varighet | Fast tid hver uke gjennom sesongen | En eller flere enkelttimer |\n| Pris | Ofte gratis eller sterkt subsidiert for barn og unge | Timespris etter kommunens satsregulativ |\n| Prosess | Søknad som saksbehandles og prioriteres | Direkte booking uten godkjenning i mange tilfeller |\n\nSom privatperson skal du **ikke** inn i sesongsøknaden. Den er for klubber som trenger den samme tiden hver uke og fordeles etter kriterier som alder, aktivitetsnivå og geografi. Du booker det som er ledig utenom, og du får som regel svar med en gang fremfor å vente på et tildelingsmøte. Den faste fordelingen er et eget tema, men for en enkelttime er søknadsprosessen irrelevant.\n\n## Priser, depositum og betalingsmåter ved privat leie av idrettsanlegg\n\nPrisene fastsettes av hver kommune i et satsregulativ, så de varierer, men størrelsesordenen er gjenkjennelig. En hel idrettshall til privat bruk ligger typisk et sted mellom 300 og 800 kroner timen, en gymsal ofte lavere, mens en svømmehall eller et kulturhus med bemanning koster mer. Kommersiell bruk og arrangementer med inngangspenger prises høyere enn ren egentrening.\n\nVær oppmerksom på tre kostnadselementer:\n\n- **Timespris.** Grunnleien per time, avhengig av anlegg og formål.\n- **Depositum.** Ved bursdager og større arrangementer kreves ofte et depositum, for eksempel 1 000 til 2 000 kroner, som du får tilbake når anlegget er levert i orden.\n- **Tilleggstjenester.** Renhold, vakthold eller ekstra utstyr kan komme i tillegg og bør stå spesifisert før du bekrefter.\n\nBetaling skjer med Vipps, kort eller EHF-faktura. For privatpersoner er Vipps og kort raskest, fordi bookingen bekreftes i samme øyeblikk. Det du skal se etter i portalen er at totalprisen vises **før** du betaler, ikke etterpå. Da vet du nøyaktig hva timen koster, inkludert eventuelt depositum.\n\n## Regler, ansvar og forsikring når du leier hallen til trening, bursdag eller arrangement\n\nNår du leier, blir du ansvarlig for anlegget i den perioden du har det. Det innebærer noen faste plikter:\n\n- Du er **økonomisk ansvarlig for skader** som oppstår i din leietid, enten det er en knust glassdør eller skade på gulvet.\n- Du skal **rydde og forlate anlegget i samme stand** som du fikk det. Etterlater du søppel eller møbler ute av posisjon, kan renholdsgebyr trekkes fra depositumet.\n- **Antall personer** er begrenset av anleggets kapasitet og branntekniske godkjenning. En gymsal godkjent for 50 personer skal ikke fylles med 90 til en bursdag.\n- **Egen ansvarsforsikring** dekker som regel skader du forårsaker på tredjepart. For større arrangementer krever noen kommuner dokumentert forsikring.\n- **Skotøy og utstyr.** Innesko er ofte påbudt i hallen, og enkelte aktiviteter som sykling eller bruk av harpiks kan være forbudt.\n\nReglene står i leievilkårene du godkjenner ved booking. Les dem, spesielt for bursdager og arrangementer der ansvaret er større enn ved en vanlig treningstime. En god portal viser vilkårene tydelig i bookingflyten fremfor å gjemme dem i et vedlegg.\n\n## Flere anlegg samme vei: gymsal, svømmehall, kunstgressbane og kulturhus\n\nIdrettshallen er bare inngangen. Samme bookingportal håndterer som regel hele porteføljen av kommunale anlegg:\n\n- **Gymsal.** Rimeligere enn en full hall, fin til mindre grupper, barnebursdager og lek.\n- **Svømmehall.** Ofte bemannet leie med badevakt, høyere pris og strengere regler for antall og alder.\n- **Kunstgressbane.** Utendørs, populær til privatkamper og turneringer, ofte med lys som må bookes eller aktiveres.\n- **Kulturhus og møtelokaler.** Til konserter, forestillinger, kurs og selskaper, med teknikk og bemanning som tilvalg.\n\nFordelen med å ha alt på ett sted er at du logger inn én gang, ser alle anlegg i samme kalender og betaler på samme måte. Skal 60-årsdagen ha både gymsal til aktivitet og et møtelokale til bespisning, booker du begge i samme flyt og finner begge kvitteringene på Min Side. Du slipper fem ulike skjemaer for fem ulike bygg.\n\n## Vanlige feil som gjør at bookingen din blir avvist eller forsinket\n\nDe fleste avviste bookinger skyldes de samme tingene. Unngå disse:\n\n- **Feil formål.** Booker du «trening» men egentlig skal ha bursdag med 40 gjester, kan bookingen avvises fordi pris, depositum og regler er ulike. Oppgi riktig formål fra start.\n- **For sen booking.** Enkelte anlegg krever booking et visst antall dager i forveien, spesielt bemannede lokaler. Booker du kvelden før, rekker ikke kommunen å stille med vakt.\n- **Manglende betaling.** En reservasjon uten fullført betaling faller ofte bort etter en frist. Betal med en gang for å sikre timen.\n- **For mange personer.** Oppgir du et deltakerantall over anleggets kapasitet, blir bookingen stoppet av hensyn til brannforskrift.\n- **Dobbel søknad.** Å prøve å booke en fast ukentlig tid som privatperson gjennom enkelttime-flyten fungerer ikke. Fast tid går via sesongtildeling.\n\nMed ID-porten-innlogging og forhåndsutfylt informasjon faller flere av disse feilkildene bort automatisk, fordi identiteten er verifisert og prisen er beregnet før du bekrefter.\n\n## Hva skjer hvis du må avbestille eller bytte tidspunkt\n\nPlaner endrer seg, og du skal kunne avbestille uten å ringe. Avbestillingsvilkårene styres av kommunen, men følger et gjenkjennelig mønster:\n\n- Avbestiller du **i god tid**, ofte mer enn 48 timer før, får du som regel full refusjon.\n- Avbestiller du **tett på**, kan hele eller deler av leien beholdes av kommunen.\n- **Depositum** refunderes når anlegget er levert i orden etter endt leie.\n\nI en digital portal gjør du dette selv fra Min Side: du åpner bookingen, velger avbestill eller endre, og ser umiddelbart hvor mye som refunderes etter gjeldende regler. Vil du bare flytte timen, frigjøres den gamle tiden for andre i samme øyeblikk, og du velger et nytt ledig felt. Refusjon til Vipps eller kort går tilbake automatisk fremfor at en saksbehandler må behandle den manuelt. Det betyr at du får pengene raskere, og kommunen slipper etterarbeid.\n\n## Book anlegget selv, når det passer deg\n\nÅ leie kommunal idrettshall, gymsal eller svømmehall som privatperson skal være like enkelt som å bestille kinobilletter: finn ledig tid, se prisen, betal og få bekreftelsen på Min Side. Med sanntidskalender, ID-porten-innlogging og automatisk refusjon slipper du både ventelister og telefonrunder.\n\nVil kommunen din tilby innbyggerne denne opplevelsen, og samtidig avlaste saksbehandlerne som i dag håndterer booking manuelt? [Book en demo av Digilist](https://digilist.no/demo) og se hvordan hele anleggsporteføljen kan bookes fra én plattform.';
const __vite_glob_0_40 = '---\nslug: leie-kommunalt-lokale-pris-guide\ntitle: "Leie sal i kommunen: slik settes prisen og hvor du finner den billigst"\ndescription: "Se hva som faktisk avgjør prisen når du leier kommunalt lokale, med eksempeltall for idrettshall, gymsal, møterom og samfunnssal, og hvordan du sammenligner reelt."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["leie sal billigst kommune", "leie samfunnshus pris", "gratis leie idrettslag", "leie gymsal pris", "leie møterom kommune pris", "rabatt frivillige organisasjoner", "søke om leie kommunalt lokale"]\n---\n\nSkal du arrangere bursdag, årsmøte eller trening og lurer på hvor du leier billigst, er svaret sjelden ett enkelt tall. Prisen på et kommunalt lokale er satt sammen av flere ledd, og to saler som ser like ut på nettsiden kan koste svært ulikt når kvelden er over. Denne guiden viser hvordan prisen bygges opp, hva ulike lokaltyper faktisk ligger på, og hvordan du sammenligner reelt før du booker.\n\n## Hva bestemmer prisen når du leier sal i en kommune\n\nKommunale leiepriser vedtas politisk, ofte i et årlig gebyrregulativ, og justeres med kommunestyrets budsjett. Det betyr at prisen for samme type lokale kan variere fra nabokommune til nabokommune. I Lillestrøm koster en gymsal noe helt annet enn en tilsvarende sal i en mindre distriktskommune, selv om rommet er like stort.\n\nFire faktorer avgjør det meste:\n\n- **Lokaltype og størrelse.** En idrettshall med garderober og tribune koster mer å drifte enn et lite møterom.\n- **Formål.** Kommersielle arrangementer, private selskaper og faste treningstider prises ulikt.\n- **Tidspunkt.** Kveld og helg er dyrere enn dagtid på hverdager i mange kommuner.\n- **Hvem du er.** Privatperson, bedrift eller registrert lag betaler etter ulike satser.\n\nGrunnsatsen dekker selve rommet. Alt utover det, renhold, teknisk utstyr og vakthold, legges gjerne på som tillegg. Derfor er «pris per time» bare halve bildet.\n\n## Forskjellen på pris for privatpersoner, lag og foreninger\n\nDe fleste kommuner opererer med minst tre prisnivåer for samme lokale.\n\nEn privatperson som leier samfunnssalen til et 50-årslag betaler full sats, gjerne 1 500 til 4 000 kroner for en kveld, avhengig av kommune og størrelse. Et registrert lag eller en forening i samme kommune betaler ofte en brøkdel, og barne- og ungdomsaktivitet er i mange kommuner helt gratis på kommunale anlegg.\n\nSkillet handler om formålet kommunen ønsker å støtte. Idrett og frivillighet for barn og unge subsidieres bevisst, mens private og kommersielle leietakere dekker en større del av de reelle kostnadene. Er du usikker på hvilken kategori du havner i, avgjør formålet med arrangementet mer enn hvem som står som leietaker.\n\n### Tre prisnivåer å kjenne til\n\n- **Privatperson, selskap eller fest:** full sats.\n- **Registrert lag eller forening, voksne:** rabattert sats.\n- **Barne- og ungdomsaktivitet:** ofte gratis eller symbolsk beløp.\n\n## Slik sammenligner du priser på tvers av kommunale lokaler\n\nSkal du finne det reelt billigste alternativet, må du regne på totalen, ikke timeprisen. Sett opp de samme radene for hvert lokale du vurderer:\n\n1. Grunnleie for det antallet timer du faktisk trenger, inkludert rigg og rydding.\n2. Obligatorisk renhold etter bruk.\n3. Teknisk utstyr, lyd, projektor eller kjøkken.\n4. Eventuelt vakthold eller tilsyn.\n5. Depositum, som du får tilbake, men som binder penger.\n\nEt møterom til 300 kroner timen kan bli dyrere enn en sal til 600 timen hvis salen inkluderer renhold og møterommet legger det på toppen. En gymsal som er billig på papiret blir kostbar hvis du må leie fem timer for et arrangement som varer to. Regn alltid på faktisk brukstid pluss den tiden kommunen krever til klargjøring.\n\n## Rabatter, medlemspriser og gratis leie for frivillige organisasjoner\n\nEr du med i et idrettslag, korps eller en forening, finnes det ofte betydelige avslag du ikke ser i den offentlige prislisten.\n\n- **Gratis leie for idrettslag.** Mange kommuner tilbyr vederlagsfri trening i egne haller og gymsaler for lag tilknyttet Norges idrettsforbund, særlig for utøvere under 18 eller 19 år. Bergen og flere andre kommuner har lang tradisjon for gratis halltid til barne- og ungdomsidrett.\n- **Rabatt for frivillige organisasjoner.** Registrerte lag i Frivillighetsregisteret får ofte 50 til 100 prosent avslag på ordinær leie til ikke-kommersielle formål.\n- **Fast tildeling.** Årlige treningstider fordeles gjennom en egen søknadsrunde, som regel før sesongstart i august, og er skilt fra enkeltbooking.\n\nBetingelsen er nesten alltid at organisasjonen er registrert, at aktiviteten er åpen og ikke-kommersiell, og at søknaden kommer inn i tide. Kommer du utenom søknadsfristen, må du ta til takke med ledige timer til ordinær pris.\n\n## Skjulte kostnader: rengjøring, vakthold, strøm og depositum\n\nOverraskelsene på fakturaen ligger sjelden i grunnleien. De ligger i tilleggene.\n\n**Renhold** er den vanligste. Enten legger kommunen på et fast rengjøringsgebyr på noen hundre kroner, eller du plikter å vaske selv og risikerer et trekk om standarden ikke holder. **Vakthold eller tilsyn** kreves ofte ved større arrangementer og fester, og en tilsynsvakt koster fort 400 til 600 kroner timen. **Strøm og oppvarming** er som regel inkludert i grunnleien, men enkelte samfunnshus og grendehus fakturerer forbruk separat, spesielt om vinteren.\n\n**Depositum** er ikke en kostnad i seg selv, men binder gjerne 1 000 til 3 000 kroner til lokalet er levert rent og uskadd. Les leiebetingelsene før du signerer, så vet du hva du får igjen og hva som eventuelt trekkes.\n\n## Steg for steg: slik søker du om å leie et kommunalt lokale\n\nProsessen er stort sett lik fra kommune til kommune:\n\n1. **Finn lokalet.** Søk på kommunens nettside etter «leie lokale» eller «booking». Større kommuner samler tilbudet i én oversikt.\n2. **Sjekk ledig tid.** Se om lokalet er tilgjengelig for datoen din. Faste treningstider er ofte allerede tildelt for sesongen.\n3. **Velg riktig leietakerkategori.** Oppgi om du søker som privatperson, lag eller forening, og hva formålet er. Dette avgjør prisen.\n4. **Send søknad eller bestilling.** Enkeltbooking bekreftes ofte raskt. Søknad om fast tid følger en frist, gjerne i mai eller juni for kommende sesong.\n5. **Motta bekreftelse og betingelser.** Her står totalpris, tilgang, renholdskrav og depositum.\n\nHar du spørsmål om kategori eller pris, spør før du bestiller. Det er lettere å avklare formålet på forhånd enn å klage på fakturaen etterpå.\n\n## Beste tidspunkt og sesong for lavest pris\n\nTidspunkt påvirker både pris og tilgjengelighet.\n\nDagtid på hverdager er billigst i mange kommuner, fordi kveld og helg regnes som mest attraktiv tid. Skal du ha et møte eller en dagsamling, ligger det ofte penger å spare på å legge det til formiddagen.\n\nSesongen betyr mest for faste leietakere. Idrettshaller og gymsaler er tettest booket i vinterhalvåret, fra september til april, mens sommeren er langt roligere og lettere å få tak i. Søknadsrunden for fast treningstid ligger som regel i mai eller juni. Er du ute etter en enkeltkveld til et arrangement, unngå de mest populære helgene i mai og desember, der etterspørselen etter samfunnssaler er høyest.\n\n## Prisnivå i praksis: idrettshall, gymsal, møterom og samfunnssal\n\nTallene under er typiske størrelsesordener for ordinær leie per time eller per arrangement. De varierer mellom kommuner, så bruk dem som pekepinn og sjekk alltid din egen kommunes regulativ.\n\n- **Idrettshall:** 300 til 700 kroner timen for privat og kommersiell leie. Gratis eller symbolsk for barne- og ungdomsidrett.\n- **Gymsal:** 150 til 400 kroner timen. Ofte gratis for lag med fast tildelt tid.\n- **Møterom i kommunale bygg:** 200 til 500 kroner timen, avhengig av størrelse og teknisk utstyr.\n- **Samfunnssal eller festsal:** 1 500 til 4 000 kroner for en kveld til privat fest, klart lavere for foreninger.\n- **Samfunnshus og grendehus:** varierer mest, ofte 800 til 2 500 kroner per dag, der strøm og renhold i enkelte tilfeller kommer i tillegg.\n\nLegg merke til at gymsal og idrettshall kan dekke samme behov til svært ulik pris. Trenger du bare gulvplass til en aktivitet, er gymsalen ofte det billigste valget.\n\n## Hvorfor digital booking gir bedre prisoversikt og færre overraskelser\n\nDet som gjør det vanskelig å finne billigste alternativ, er sjelden at prisene er urimelige. Det er at de er spredt over PDF-regulativer, e-postdialoger og lokaler som ikke viser ledig tid før du ringer.\n\nEn digital bookingløsning samler dette. Du ser tilgjengelige lokaler, riktig pris for din leietakerkategori og eventuelle tillegg for renhold og utstyr før du bekrefter. Da sammenligner du gymsal mot idrettshall og hverdag mot helg på totalpris, ikke på gjetning. For kommunen betyr det færre henvendelser og mindre manuell saksbehandling, og for deg betyr det at fakturaen stemmer med det du så da du booket.\n\nDigilist bygger nettopp denne typen oversikt, slik at innbyggere, lag og foreninger finner riktig lokale til riktig pris uten å lete gjennom flere systemer.\n\n## Vil du ha oversikten samlet?\n\nVi har laget en gratis PDF som oppsummerer prisnivåene, tilleggskostnadene og søknadsstegene i denne guiden, så du kan ta den med når du sammenligner lokaler i din egen kommune. **Last ned PDF** og få hele sjekklisten på én side.';
const __vite_glob_0_41 = '---\nslug: leie-lokale-billigst-kommune-sammenlign-lokaltyper\ntitle: "Leie lokale billigst i kommunen: sammenlign alle lokaltypene"\ndescription: "Én oversikt over pris og vilkår på idrettshall, møterom, kulturhus, gymsal og selskapslokale, slik at laget velger billigste egnede lokale første gang."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Lag og foreninger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["leie sal billigst kommune", "leie lokale billig kommune", "leie idrettshall pris lag", "leie kulturhus pris", "medlemspris leie", "depositum avbestilling lokale"]\n---\n\nDe fleste lag søker lokale type for type: først idrettshallen, så gymsalen, så kulturhuset. Da ser man aldri hva det billigste egnede alternativet faktisk er, og laget ender ofte med et større og dyrere lokale enn aktiviteten krever. Denne guiden samler alle kommunale lokaltyper i én prislogikk, forklarer hvordan satsene settes, og viser hvordan laget velger riktig lokale første gang.\n\n## Hvilke lokaltyper kan laget leie i kommunen\n\nKommunen leier vanligvis ut fem hovedtyper til frivillige lag:\n\n- **Idrettshall og flerbrukshall:** trening, kamper og større arrangementer\n- **Gymsal på skoler:** billigere alternativ til hall for mindre grupper\n- **Møterom:** styremøter, kurs og planlegging for 6–30 personer\n- **Kulturhus og kultursal:** konserter, forestillinger og årsmøter med scene og lyd\n- **Selskapslokale eller festsal:** avslutninger, jubileer og loppemarked\n\nPoenget er at flere av disse dekker samme behov. Et kor som skal øve trenger ikke en full kultursal hvis en gymsal eller et stort møterom holder til en tredjedel av prisen. Et styremøte på ti personer trenger ikke idrettshall, og en juleavslutning kan like gjerne holdes i en gymsal som i et selskapslokale. Første steg mot lavere leie er derfor å definere hva aktiviteten faktisk krever av plass, utstyr og tidsrom, ikke hvilket lokale laget pleier å bruke.\n\n## Slik beregnes leieprisen\n\nKommunen opererer normalt med tre satser for samme lokale, og hvilken sats laget havner på avgjør prisen mer enn hvilket lokale det velger:\n\n- **Subsidiert lagssats:** for registrerte lag med aktivitet for barn og unge, ofte gratis eller symbolsk\n- **Medlemssats:** redusert pris for frivillige lag uten full subsidiering\n- **Kommersiell sats:** for bedrifter og private, gjerne 3–5 ganger lagssatsen\n\nEt lag som er registrert i Frivillighetsregisteret og har medlemmer under 19 år faller som regel inn under den rimeligste kategorien. Forskjellen er stor: en hall som koster 900 kroner timen kommersielt kan ligge på 0 til 150 kroner for et idrettslag i samme kommune. Satsene fastsettes lokalt i kommunens gebyrregulativ, så de eksakte kronebeløpene varierer, men trappen fra subsidiert til kommersiell sats går igjen nesten overalt. Det betyr at riktig registrering og riktig kategori ofte sparer laget mer enn å bytte til et mindre lokale.\n\n## Prissammenligning per lokaltype\n\nPrisene varierer mellom kommuner, men størrelsesordenene er nokså like. En typisk lagssats ligger omtrent her:\n\n- **Gymsal:** 0–120 kr per time\n- **Idrettshall:** 100–300 kr per time, ofte gratis for barneidrett\n- **Møterom:** 150–400 kr per time\n- **Kultursal:** 500–2 000 kr per døgn eller kveld\n- **Selskapslokale:** 1 000–4 000 kr per døgn\n\nI flere større kommuner, blant annet Oslo og Bergen, er trening for aldersbestemte lag i kommunale haller gratis, mens voksengrupper betaler timepris. Mønsteret er verdt å merke seg: den samme aktiviteten kan være gratis eller koste flere hundre kroner timen avhengig av aldersgruppe og registrering. Skal koret ha generalprøve, kan en gymsal til 80 kroner timen erstatte en kultursal til 1 500 kroner kvelden når selve forestillingen holdes et annet sted. Å sammenligne på tvers av lokaltyper, ikke bare mellom kommuner, er der de fleste lag finner det største avviket.\n\n## Et konkret regneeksempel\n\nTenk deg at et skolekorps skal øve to timer i uken gjennom en høstsesong på 16 uker. Booker de løse timer i en kultursal til 700 kroner kvelden, blir det 11 200 kroner for sesongen. Får de i stedet fast øvingstid i en gymsal til 80 kroner timen gjennom sesongtildeling, lander samme aktivitet på rundt 2 560 kroner. Forskjellen på over 8 000 kroner handler ikke om at korpset øver mindre, men om at det valgte riktig lokaltype og riktig bookingform. Det er dette et samlet prisbilde gjør synlig, og det er lett å overse når man vurderer ett lokale av gangen.\n\n## Kostnadene som gjør leien dyrere enn forventet\n\nTimeprisen er sjelden hele regningen. Vær oppmerksom på tilleggene som ofte kommer på fakturaen:\n\n- **Depositum:** 500–3 000 kr, tilbakebetales etter godkjent rengjøring\n- **Avbestillingsgebyr:** fra 50 til 100 prosent av leien hvis du avbestiller for sent\n- **Renhold:** eget gebyr hvis lokalet ikke leveres ryddet\n- **Utstyr:** lyd, lys og bord kan faktureres i tillegg\n\nEt lag som booker selskapslokale til 2 000 kroner kan ende på 3 500 med depositum og renhold. Les avbestillingsfristen nøye: mange kommuner krever kansellering minst 14 dager før, ellers belastes full leie. For lag som booker ofte, kan et enkelt avlyst arrangement spise opp besparelsen fra flere billige bookinger, så vilkårene er verdt like mye oppmerksomhet som selve timeprisen.\n\n## Slik søker du frem billige, ledige tider uten å ringe rundt\n\nI et moderne bookingsystem søker du på tvers av lokaltyper i stedet for én og én. I Digilist filtrerer laget på dato, kapasitet og maks pris, og ser alle ledige lokaler som treffer i sanntid. Systemet viser lagssatsen din direkte, ikke listeprisen, så du sammenligner reelle kostnader og ikke veiledende priser du uansett ikke skal betale. Vil du ha den billigste ledige salen en gitt kveld, sorterer du på pris og booker på minuttet uten telefonrunde til servicetorget. Den som søker bredt fremfor smalt, ser oftere at et billigere lokale var ledig hele tiden.\n\n## Rabattordninger kommunen gir frivillige lag\n\nIdrettslag, kor, korps og speidergrupper har ofte tilgang til ordninger utover den vanlige lagssatsen:\n\n- **Gratis treningstid** for barn og unge i idrettsanlegg\n- **Kulturmidler** som dekker deler av salleien til konserter\n- **Fast tildeling** av treningstid gjennom sesongen, som er billigere enn enkelttimer\n- **Fritak fra depositum** for lag med god historikk\n\nEt skolekorps som får fast øvingstid i en gymsal gjennom sesongtildeling betaler ofte mindre per gang enn ved å booke løse timer. Sjekk kommunens tildelingsrunde, som typisk skjer før hver sesong, og søk i god tid: fristene ligger ofte flere måneder før sesongstart, og lag som melder seg sent må ta til takke med de dyrere restene av kalenderen. Kombinerer laget fast tildeling med kulturmidler, kan flere av kostnadene over falle bort helt.\n\n## Steg for steg: fra søk til bekreftet billig booking\n\n1. Logg inn med BankID eller ID-porten så laget knyttes til riktig sats\n2. Søk på dato, antall personer og ønsket område\n3. Filtrer på maks pris og sorter billigst først\n4. Sammenlign gymsal, hall og møterom side om side\n5. Sjekk depositum og avbestillingsfrist før du bekrefter\n6. Book og motta bekreftelse med totalpris på Min Side\n\nHele reisen tar noen minutter, og laget ser totalprisen, inkludert eventuelt depositum, før bindende booking.\n\n## Vanlige feil som gir høyere pris eller avvist søknad\n\n- **Søker bare én lokaltype:** overser at en gymsal dekker behovet billigere\n- **Glemmer å registrere laget riktig:** faller da inn under kommersiell sats\n- **Booker for kort tid:** enkelttimer koster mer enn sesongtildeling\n- **Overser avbestillingsfristen:** ender med full leie for et avlyst arrangement\n- **Bekrefter uten å lese depositumsvilkåret:** får ikke igjen pengene ved dårlig rengjøring\n\nDe fleste avviste søknadene skyldes at laget ikke er registrert med organisasjonsnummer, ikke at lokalet var opptatt. Et par minutter på riktig registrering før første booking løser derfor de fleste problemene på forhånd.\n\n## Finn billigste egnede lokale med Digilist\n\nMed alle lokaltyper og reelle lagssatser i samme oversikt slutter laget å gjette på pris. Vil dere se hvordan sammenligning på tvers av lokaler ser ut i praksis? **Book demo**, så viser vi hvordan laget finner det billigste ledige lokalet på under to minutter.';
const __vite_glob_0_42 = '---\nslug: leie-lokale-kommune-vilkar-depositum-avbestilling\ntitle: "Leie lokale i kommunen: vilkår, depositum og avbestilling forklart"\ndescription: "Alt som står i leiekontrakten for et kommunalt lokale: hva som er inkludert, depositum, avbestillingsfrister, ansvar for skader og søknadstid før du signerer."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Innbygger"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["leie lokale kommune vilkår", "depositum leie lokale", "avbestille leid lokale kommune", "leie forsamlingshus regler", "leiekontrakt kommunalt lokale"]\n---\n\nPrisen er én ting, kontrakten en annen. Det er vilkårene, depositum, avbestillingsfrist og ansvar for skader som avgjør om leien blir en trygg avtale eller en ubehagelig overraskelse etter arrangementet. To lokaler med samme leiepris kan ha helt ulike betingelser for rydding, depositum og avbestilling. Her er det du bør lese før du signerer.\n\n## Hvilke lokaler kan du leie i kommunen\n\nDe fleste kommuner leier ut flere lokaletyper til privatpersoner: grendehus, samfunnshus og forsamlingshus, aula og gymsal på skolene, samt kulturhus og møterom på rådhuset. Grendehus og forsamlingshus egner seg til konfirmasjon, bursdag og minnestund, mens aula og kulturhus tar større selskaper. En gymsal på en barneskole rommer gjerne 80–120 gjester, et grendehus ofte 40–60. Kapasiteten står i objektets beskrivelse, og den bestemmer hva du faktisk kan booke.\n\nOversikten finner du som regel på kommunens nettside eller i bookingportalen, der lokalene ligger med bilder, kapasitet og ledige datoer. Filtrer på type og antall gjester før du går videre, så slipper du å søke på et lokale som uansett er for lite. Er du usikker på om et rom passer til arrangementet ditt, er beskrivelsen og kapasitetstallet ditt første holdepunkt.\n\n## Hva er inkludert i leien\n\n«Leie av lokale» betyr sjelden bare fire vegger. Sjekk konkret hva som følger med:\n\n- **Kjøkken:** komfyr, oppvaskmaskin og kjøleskap, men sjelden servise og glass.\n- **Servise og dekketøy:** ofte ikke inkludert. Trenger du tallerkener til 60, må du regne med å ta med eget eller leie i tillegg.\n- **Bord og stoler:** antall og oppsett, ofte oppgitt som «dekket til 60».\n- **Lydanlegg og projektor:** noen steder inkludert, andre mot tillegg.\n- **Rydding og søppel:** her varierer det mest. Noen kommuner tar et fast renholdsgebyr på 500–1500 kroner, andre krever at du vasker selv, tar med søppelet og leverer lokalet slik du fant det.\n\nStår det ikke i beskrivelsen, spør før du booker. Det du tror er inkludert, kan bli en ekstra faktura. Ta gjerne et bilde av lokalet før arrangementet starter, så har du dokumentasjon på hvordan du overtok det. Det gjør oppgjøret enklere hvis kommunen mener noe mangler ved kontroll.\n\n## Depositum og betalingsbetingelser\n\nMange kommuner krever depositum for private arrangementer, typisk 2000–5000 kroner, som sikkerhet mot skader og manglende rydding. Depositumet betales sammen med leien eller kort tid før arrangementet, enten som en egen innbetaling eller som en reservasjon på kortet ditt. Er lokalet levert rent og uskadet, får du beløpet tilbake, ofte innen 10–14 virkedager etter kontroll.\n\nSelve leien forfaller vanligvis før arrangementet, ikke etterpå. Les hvordan tilbakebetalingen skjer og hvem som vurderer tilstanden, slik at du vet hva som skal til for å få hele depositumet igjen. Er vilkårene uklare på dette punktet, er det verdt en telefon til kommunen før du binder deg, for det er her de fleste tvistene om oppgjør oppstår.\n\n## Avbestilling og endring av dato\n\nAvbestillingsvilkårene bestemmer hvor mye du taper hvis planene endrer seg. En vanlig modell: full refusjon ved avbestilling mer enn 30 dager før, halv leie mellom 30 og 14 dager, og ingen refusjon under 14 dager. Booker du et lokale for 3000 kroner og avbestiller tre dager før, kan hele beløpet være tapt. Les fristene før du reserverer, ikke etter.\n\nEndring av dato regnes noen steder som avbestilling, andre steder flyttes bookingen gebyrfritt hvis nytt tidspunkt er ledig. Enkelte kommuner gjør unntak ved sykdom eller dødsfall mot dokumentasjon, men det er ikke en rettighet du kan regne med. Vet du at datoen kan bli endret, bør du finne ut hvordan flytting håndteres allerede før du booker.\n\n## Hvem har ansvar hvis noe går i stykker\n\nSom leietaker er du normalt ansvarlig for skader som oppstår under arrangementet, både på inventar og bygg, og for gjestenes oppførsel. Depositumet dekker mindre skader; større kostnader kan faktureres i tillegg. Enkelte kommuner krever eller anbefaler ansvarsforsikring for større selskaper.\n\nDu har også ansvar for at bruken holder seg innenfor lokalets rammer. Mange lokaler har et maksimalt antall personer av hensyn til brannsikkerhet, og rømningsveier skal holdes frie. Overfyller du et lokale eller blokkerer en nødutgang, er det ditt ansvar. Meld fra om skader med en gang, ikke vent til kontrollen. En knust rute du selv rapporterer, håndteres annerledes enn en kommunen finner etterpå.\n\n## Privat arrangement kontra lag og foreninger\n\nReglene skiller på hvem du er. Registrerte lag og foreninger får ofte redusert eller gratis leie, faste tildelinger og lempeligere depositumkrav, fordi kommunen prioriterer barne- og ungdomsaktivitet. Private arrangementer som bryllup, konfirmasjon eller minnestund betaler full sats og møter strengere vilkår for depositum og rydding.\n\nLillestrøm kommune og mange andre publiserer to prislister: én for lokale foreninger og én for privat utleie. Sjekk hvilken kategori du hører til før du sammenligner pris, ellers sammenligner du epler og pærer. Leier du på vegne av en forening, kan det også kreves at foreningen står som ansvarlig part i avtalen, ikke deg som privatperson. Det påvirker både prisen og hvem som hefter for eventuelle skader.\n\n## Søknadsfrister og saksbehandlingstid\n\nNoen lokaler bookes direkte i kalenderen og bekreftes umiddelbart. Andre, særlig større kulturhus og aulaer, krever søknad som en saksbehandler behandler. Regn med fra noen dager til to ukers behandlingstid, og book i god tid før populære datoer som 17. mai-helgen og konfirmasjonssesongen i mai.\n\nFor et arrangement du vet datoen på et halvår i forveien, er det ingen grunn til å vente. Jo tidligere du søker, jo større sjanse for å få lokalet du vil ha. Får du avslag fordi datoen er tatt, står du dessuten bedre rustet til å finne et alternativ når du er ute i god tid enn når det er to uker igjen.\n\n## Slik leser du leiekontrakten før du signerer\n\nFør du signerer digitalt, gå gjennom fem punkter: hva som er inkludert, depositumbeløp og tilbakebetaling, avbestillingsfristene, ansvar for skader, og tidspunkt for henting og levering av nøkkel. Noter deg også hvem du kontakter hvis noe skjer under arrangementet, og hvordan du dokumenterer tilstanden ved overtakelse og levering.\n\nI Digilist står disse vilkårene synlig i bookingen, og du signerer med BankID via ID-porten, slik at avtalen er bindende og etterprøvbar for begge parter. Da vet du nøyaktig hva du har sagt ja til, uten liten skrift du oppdager i etterkant.\n\n## Klare vilkår gjør leien trygg\n\nEn god leiekontrakt fjerner overraskelsene: du ser hva som er inkludert, hva depositumet dekker og hva det koster å avbestille, før du signerer. Vil kommunen din vise innbyggerne vilkårene like tydelig som prisen? [Book en demo](https://digilist.no/demo) og se hvordan Digilist samler booking, betaling og digital signering på ett sted.';
const __vite_glob_0_43 = '---\nslug: leie-motrom-kommune-samme-dag\ntitle: "Slik booker kommunen møterom samme dag, uten ventelister"\ndescription: "Digitalisert bookingportal gjør kommunale møterom og kulturhus søkbare i sanntid, og kutter timer med manuell administrasjon hver uke."\ndate: 2026-07-09\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["leie møterom kommune", "bookingportal kommunal", "samme dag booking", "møteromreservasjon", "kulturhus booking", "dobbeltbooking", "romutleie kommune"]\n---\n\nMange kommuner har møterom som står tomme en mandag formiddag, mens en gruppe frivillige leter etter ledig lokale til samme tid. Årsaken er sjelden mangel på rom, det er mangel på oversikt. Når bestilling skjer via e-post, telefon eller en Excel-fil som oppdateres sporadisk, blir både interne og eksterne brukere stående i kø.\n\nDette er ikke et marginalt problem. Det er en strukturell ineffektivitet som koster tid for saksbehandlere, frustrerer driftsledere og gjør kommunale ressurser mindre tilgjengelige enn de burde være.\n\n## Manuelle prosesser skaper flaskehalser\n\nI en typisk kommune uten digitalisert bookingløsning ser hverdagen gjerne slik ut: En medarbeider sender e-post for å høre om Møterom B er ledig på torsdag. Saksbehandleren sjekker en kalender, svarer tilbake, og ber om bekreftelse. Samtidig ringer en annen avdeling og spør om det samme rommet. Resultatet er dobbeltbooking, eller et rom som forblir ubrukt fordi ingen torde booke det uten bekreftelse.\n\nFor kulturhus og større lokaler blir problemet enda mer synlig. Godkjenning av eksterne leietakere krever ofte manuell behandling: hvem er leietaker, hva er formålet, er det behov for teknisk utstyr, skal det faktureres? Uten et felles system kan én enkelt bookingforespørsel ta flere arbeidsdager å behandle.\n\nResultatet er dobbelt tap: saksbehandlere bruker tid på koordinering som kunne vært automatisert, og kapasitet som kommunen eier og vedlikeholder forblir ubrukt.\n\n## Sanntidssøk for både interne og eksterne brukere\n\nDigilist gir kommunen én felles portal der alle rom, fra møterom på rådhuset til sal i kulturhuset, er synlige og søkbare i sanntid. Brukeren velger dato, klokkeslett og eventuelle krav som kapasitet eller teknisk utstyr, og ser umiddelbart hva som er tilgjengelig.\n\nFor interne brukere betyr dette at en ansatt kan reservere et møterom direkte uten å involvere noen andre. Rommet blokkeres øyeblikkelig i systemet, og andre ser oppdatert tilgjengelighet i samme sekund.\n\nFor eksterne brukere, som lag, foreninger eller private leietakere, kan kommunen sette opp egne godkjenningsregler. Noen romtyper kan godkjennes automatisk, andre krever manuell behandling. Saksbehandleren får da en strukturert forespørsel med all nødvendig informasjon samlet, i stedet for fragmenterte e-poster.\n\n### Hva elimineres i praksis\n\n- Frem-og-tilbake e-post for å sjekke ledige tider\n- Manuell oppdatering av papirkalendere eller delte regneark\n- Dobbeltbookinger som oppstår når flere kanaler brukes parallelt\n- Manglende historikk over hvem som har brukt hva og når\n\n## Samme dag-booking endrer arbeidsdagen for saksbehandler\n\nÉn av de mest konkrete gevinstene ved digitalisert booking er muligheten til å booke lokaler samme dag. Når en medarbeider trenger et rom til et hastemøte klokken 14, kan de se hva som er ledig og bekrefte på under ett minutt. Det krever ingen involvering fra andre.\n\nFor saksbehandlere som tidligere håndterte bookingforespørsler som en del av arbeidsdagen, betyr dette en reell reduksjon i avbrytelser og koordineringsoppgaver. Systemet håndterer bekreftelse, påminnelse og eventuell fakturering automatisk, basert på regler kommunen selv setter opp.\n\nDette er særlig verdifullt i perioder med høy etterspørsel, som rundt budsjettsesongen eller i oppkjøringen til kommunevalg, der møtebehovet øker raskt og uforutsigbart.\n\n## Driftsleder får full oversikt på ett sted\n\nFor driftslederen er utfordringen en annen, men like konkret: uten digital oversikt er det vanskelig å vite hvilke rom som faktisk brukes, hvilke som er underutnyttet, og når vedlikehold bør planlegges uten at det kolliderer med bookinger.\n\nDigilist gir driftslederen et dashbord med utnyttelsesgrad per rom og lokale. Det er mulig å se mønstre over tid: hvilke rom er alltid fullbooket fredag ettermiddag, hvilke møterom har stått ubrukt de siste tre ukene?\n\n### Planlegging av vedlikehold uten konflikter\n\nRenhold, teknisk vedlikehold og oppgraderinger kan planlegges direkte i systemet. Rommet merkes som utilgjengelig i den aktuelle perioden, og ingen kan booke det i mellomtiden. Driftslederen slipper å koordinere dette manuelt med den som håndterer bookinger, informasjonen er synlig for alle parter i sanntid.\n\nFor kommuner med spredte lokaler, rådhus, bibliotek, idrettshall, kulturhus, er verdien av én samlet plattform stor. I dag brukes ofte separate løsninger for ulike bygninger, noe som skaper blindsoner i kapasitetsoversikten.\n\n## Et konkret eksempel: 4 timer spart per uke\n\nEn mellomstor norsk kommune med 12 møterom og 3 kulturhus tok i bruk Digilist for å samle all bookingadministrasjon i én portal. Før innføringen håndterte to saksbehandlere bookingforespørsler via e-post og telefon, oppdaterte en felles kalender manuelt og fulgte opp fakturagrunnlag i et separat regneark.\n\nEtter at Digilist ble tatt i bruk, rapporterte kommunen om gjennomsnittlig 4 timer mindre administrasjon per uke knyttet til rom og lokaler. Dobbeltbookinger forsvant helt. Leietakere utenfor kommunen fikk raskere svar, og andelen ledige rom som faktisk ble fylt økte fordi tilgjengeligheten var synlig for alle.\n\nDriftslederen fikk for første gang et samlet bilde av utnyttelsesgraden på tvers av alle bygg, og brukte det til å justere åpningstider og vedlikeholdsplan for kommende halvår.\n\n## Fra manuell koordinering til selvbetjening\n\nDet som kjennetegner en velfungerende bookingportal er ikke bare teknologien, det er at den faktisk reduserer behovet for menneskelig koordinering i rutinetilfeller. Saksbehandlere frigjøres til oppgaver som krever skjønn og kompetanse. Driftsledere kan planlegge proaktivt i stedet for å reagere på konflikter.\n\nKommunale rom og kulturhus er ressurser som innbyggere og organisasjoner har nytte av, men bare hvis de er tilgjengelige og enkle å booke. En portal som viser ledige tider i sanntid og lar brukerne reservere direkte, senker terskelen for bruk og øker verdien av ressurser kommunen allerede har investert i.\n\nDet krever ingen store omstillinger. Det krever en plattform som passer inn i eksisterende arbeidsprosesser og gjør det enkle enkelt.\n\n---\n\n## Se hvordan Digilist fungerer for din kommune\n\nVil du se hvordan en bookingportal kan se ut for akkurat din kommunes møterom og kulturhus? Book en demo med Digilist, og vi viser deg hvordan løsningen kan settes opp etter deres behov, inklusive regler for godkjenning, fakturering og vedlikeholdsplanlegging.\n\n[Book demo av Digilist →](https://www.digilist.no/demo)\n';
const __vite_glob_0_44 = '---\nslug: leie-sal-billigst-kommune-pris-guide\ntitle: "Leie sal billigst i kommunen: se prisen før du booker"\ndescription: "Prisguide for innbyggere: hva koster det å leie sal, gymsal eller lokale i kommunen, hvorfor prisen varierer mellom lag, privat og bedrift, og hvordan du finner det rimeligste ledige."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/ssal_2026_booking_hero.webp"\nkeywords: ["leie sal billigst kommune", "leie sal pris", "leie gymsal billig", "leie lokale kommune pris", "utleie lokaler kommune pris", "leie forsamlingslokale billig", "pris leie idrettshall kommune", "depositum avbestilling leie lokale"]\n---\n\nSkal du leie sal til bursdag, gymsal til trening eller møterom til årsmøtet, er det første spørsmålet nesten alltid det samme: hva koster det? Ofte må du ringe et servicetorg eller sende e-post for å få svar, og prisen dukker først opp i en faktura etterpå. Denne guiden viser deg de typiske prisnivåene, hvorfor de varierer, og hvordan du finner det billigste ledige lokalet uten å gjette.\n\n## Hva koster det å leie sal eller lokale i en norsk kommune\n\nPrisen henger sammen med lokaletype, tidsrom og hvem du er. Som privatperson må du regne med noe i disse spennene, basert på hva norske kommuner faktisk tar:\n\n- **Gymsal eller aktivitetsrom:** 150 til 500 kroner per time\n- **Idrettshall (hel hall):** 300 til 900 kroner per time for privat bruk\n- **Møterom eller grupperom:** 100 til 400 kroner per time\n- **Forsamlingslokale eller samfunnshus:** 800 til 3 000 kroner per dag\n- **Kultursal eller storsal med scene:** 2 000 til 8 000 kroner per dag\n\nTallene er størrelsesordener, ikke fasit. I Bærum betaler et lag lite eller ingenting for fast halltid, mens en privat leietaker fort ligger i øvre sjikt for samme hall en lørdag kveld. Poenget er at et prisnivå finnes for hvert lokale, og du bør kunne se det før du bestiller.\n\n## Derfor er prisen ulik for lag, privatpersoner og bedrifter i samme kommune\n\nDet samme rommet kan ha tre priser, og forskjellen er politisk bestemt, ikke tilfeldig. Kommunestyret vedtar et gebyrregulativ som deler leietakere inn i kategorier:\n\n- **Lag og foreninger** med barne- og ungdomsaktivitet får ofte gratis eller sterkt subsidiert tid, fordi kommunen vil støtte frivilligheten.\n- **Privatpersoner** som leier til et privat arrangement betaler en middels sats som skal dekke drift og renhold.\n- **Bedrifter og kommersielle aktører** betaler full markedspris, ofte to til fire ganger privatsatsen.\n\nEt konkret eksempel: en gymsal kan koste 0 kroner for et idrettslag på fast treningstid, 250 kroner timen for en familie som vil holde barnebursdag, og 700 kroner timen for et firma som arrangerer teambuilding. Når du leter etter pris, må du derfor vite hvilken kategori du havner i. Et godt bookingsystem viser satsen som gjelder deg, ikke en generisk prisliste du selv må tolke.\n\n## Slik finner du det billigste ledige lokalet: filtrer på pris, ikke bare ledighet\n\nDe fleste starter med å lete etter noe som er ledig, og godtar prisen som følger med. Snu det om. Når kronebeløpet står ved siden av hver ledige time, kan du sortere fra billigst til dyrest og se hele bildet på ett skjermbilde.\n\nI Digilist ligger prisen på hvert objekt i kalenderen. Du velger dato, ser hvilke lokaler som er ledige, og sammenligner en gymsal til 200 kroner timen mot en større hall til 600 kroner rett ved siden av. Trenger du bare plass til 20 personer, sparer du flere hundre kroner ved å velge det mindre rommet, uten å ringe en eneste telefon.\n\nPraktisk fremgangsmåte:\n\n1. Søk på område eller lokaltype, ikke ett bestemt bygg.\n2. Velg dato og klokkeslett først, så filtreres alt utilgjengelig bort.\n3. Sammenlign kronebeløpet per time mellom de ledige alternativene.\n4. Sjekk kapasiteten så du ikke betaler for et rom som er for stort.\n\n## Skjulte kostnader å se etter: rengjøring, depositum, strøm og avbestilling\n\nTimeprisen er sjelden hele regningen. Før du bekrefter, se etter disse postene, som ofte gjemmer seg i vilkårene:\n\n- **Rengjøringsgebyr:** et fast tillegg på 300 til 1 500 kroner for storsal og forsamlingslokaler, eller et krav om at du vasker selv.\n- **Depositum:** ofte 1 000 til 5 000 kroner som holdes tilbake og tilbakebetales hvis lokalet leveres uten skader.\n- **Strøm og oppvarming:** for enkelte forsamlingshus kommer forbruk i tillegg, spesielt om vinteren.\n- **Avbestillingsgebyr:** avbestiller du for sent, kan gebyret være 50 til 100 prosent av leien, typisk innen 48 timer eller en uke før.\n- **Utstyr og nøkkelutlevering:** projektor, lyd eller manuell nøkkelhenting kan ha egne satser.\n\nDisse postene er grunnen til at telefonprisen og fakturaen ofte spriker. Når vilkårene for depositum og avbestilling står synlig i bookingen, slipper du overraskelsen. I Digilist ser du totalsummen med tillegg før du bekrefter, og avbestillingsfristen står i din egen oversikt på Min Side.\n\n## Sal, gymsal, forsamlingshus eller kulturhus: prisforskjeller mellom lokaletyper\n\nHva du kaller lokalet betyr mindre enn hva det inneholder. Grovt sett:\n\n- **Gymsal:** billigst, tenkt for aktivitet og trening. Lite eller ingen møblering, sjelden kjøkken. Rimelig til barnebursdag og bevegelse.\n- **Sal eller aktivitetssal:** litt dyrere, ofte med bord, stoler og enklere fasiliteter. Passer til møter og mindre selskaper.\n- **Forsamlingslokale eller samfunnshus:** dagspris, gjerne med kjøkken og plass til 50 til 150 personer. Egnet til konfirmasjon, minnesamvær og lag.\n- **Idrettshall:** dyrest per time av idrettsflatene, men også størst. Sjelden verdt prisen med mindre du faktisk trenger full hall.\n- **Kulturhus eller storsal:** høyest pris, med scene, lys og lyd. Aktuelt til forestillinger og store arrangementer, men mye mer enn en vanlig feiring trenger.\n\nRegelen for lommeboken: velg den enkleste lokaletypen som dekker behovet. En gymsal til 250 kroner timen løser det samme som en storsal til 4 000 kroner dagen for en liten barnebursdag.\n\n## Hvorfor prisen varierer fra kommune til kommune\n\nTo nabokommuner kan ta helt ulik pris for samme type sal. Det skyldes flere ting kommunen selv styrer:\n\n- **Subsidieringsgrad:** hvor mye kommunen velger å dekke over budsjettet fremfor å ta betalt.\n- **Driftskostnader:** nye bygg med høy standard koster mer å drifte enn en eldre gymsal.\n- **Lokal etterspørsel:** i pressområder rundt Oslo er prisene gjennomgående høyere enn i mindre kommuner.\n- **Politiske prioriteringer:** noen kommuner holder frivilligheten gratis og lar privat og næring betale mer.\n\nLillestrøm og Trondheim kan ha ulike satser for en tilsvarende idrettshall, rett og slett fordi kommunestyrene har vedtatt forskjellige regulativer. Derfor gir det lite mening å lete etter én nasjonal pris. Se på din egen kommunes satser, og sammenlign lokalene der.\n\n## Slik unngår du å betale for mye\n\nNoen enkle grep kutter regningen uten at du gir avkall på det du trenger:\n\n- **Velg riktig størrelse.** Betal for antall gjester du faktisk har, ikke for et rom som imponerer tomt.\n- **Bruk rimeligste tidspunkt.** Hverdager og dagtid er ofte billigere enn helg og kveld. En sal fredag kveld kan koste mer enn samme sal søndag formiddag.\n- **Sjekk om du kvalifiserer som lag eller forening.** Er arrangementet i regi av en registrert forening, kan du havne i en langt rimeligere kategori.\n- **Book i god tid.** Da har du valget mellom flere ledige og billigere alternativer, ikke bare det som er igjen.\n- **Les avbestillingsvilkårene før du bekrefter.** En fleksibel frist kan være verdt mer enn noen kroner spart på timeprisen.\n\n## Fra telefon til skjerm: hvordan digital booking gjør prisen synlig\n\nDen gamle måten er å ringe, vente på svar, få en pris muntlig og oppdage tilleggene på fakturaen. Den nye måten er å se kronebeløpet i kalenderen med én gang, filtrere ledige lokaler etter pris, og bekrefte totalsummen inkludert renhold og depositum før du betaler.\n\nDet er dette Digilist gjør for innbyggeren. Prisen er et søkbart filter, ikke en hemmelighet du må ringe deg til. Du logger inn med BankID, velger dato, ser hva hvert ledig lokale koster for akkurat din kategori, og booker på minutter. Hele historikken, med kvittering og avbestillingsfrist, ligger samlet på Min Side. Ingen telefonkø, ingen prisoverraskelse.\n\n## Se prisen før du booker\n\nNeste gang du skal leie sal, gymsal eller lokale, sjekk om kommunen din bruker Digilist. Da logger du inn med BankID, velger dato og størrelse, og ser hva hvert ledige lokale koster for akkurat din kategori, med renhold, depositum og avbestillingsfrist synlig før du bekrefter. Prisen blir et filter du kan sortere på, ikke et svar du må vente på i telefonkø.';
const __vite_glob_0_45 = '---\nslug: leie-sal-kommune-billigst-innbygger\ntitle: "Leie sal i kommunen: slik finner du den billigste ledige salen"\ndescription: "Hva koster det å leie sal i kommunen, hvorfor prisen varierer, og hvordan du finner det billigste ledige lokalet raskt uten å ringe rundt."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["leie sal kommune", "leie sal billig", "leie forsamlingshus", "leie grendehus", "leie sal til fest", "medlemspris lag og foreninger"]\n---\n\nSkal du leie sal til konfirmasjon, jubileum eller et lagsarrangement, går det ofte mye tid med til å ringe rundt til grendehus, samfunnshus og kulturhus for å høre hva som er ledig og hva det koster. Denne guiden samler prisene, forklarer hvorfor de varierer så mye, og viser hvordan du finner det billigste ledige lokalet i kommunen din på noen minutter.\n\n## Hva regnes som en «sal» i kommunen\n\n«Sal» er en samlebetegnelse på et samlingslokale du kan leie til fest, møte eller øvelse. I praksis snakker vi om flere byggtyper som kommunen enten eier selv eller subsidierer:\n\n- **Grendehus og bygdehus:** mindre lokaler, ofte 30 til 80 personer, med kjøkken og noen ganger scene.\n- **Samfunnshus og forsamlingslokaler:** større saler for 80 til 250 gjester, gjerne med garderobe og storkjøkken.\n- **Aula på skoler:** brukes utenfor skoletid til konserter, foredrag og feiringer.\n- **Kulturhus:** de mest utstyrte lokalene, med lyd, lys og scene, og tilsvarende høyere pris.\n- **Møterom og mindre grupperom:** for styremøter, kurs og små selskaper.\n\nPoenget for deg som leietaker er at et grendehus og et kulturhus kan ligge to kilometer fra hverandre, men koste svært ulikt for samme kveld. Det er nettopp derfor det lønner seg å se flere lokaler side om side før du bestemmer deg.\n\n## Hva koster det å leie sal i kommunen\n\nPrisen avhenger av byggets størrelse, hvem du er, og hva du skal bruke det til. Som en realistisk pekepinn for en kveldsleie i norske kommuner:\n\n- **Lite grendehus:** rundt 500 til 1 500 kroner for en kveld.\n- **Mellomstort samfunnshus eller aula:** rundt 1 500 til 4 000 kroner.\n- **Stort kulturhus med teknisk utstyr:** fra 4 000 kroner og oppover, ofte med egen sats for scene og lydanlegg.\n\nDet som driver prisen opp er størrelse, bruk av kjøkken, teknisk utstyr, og om arrangementet er kommersielt. Det som drar prisen ned er kort leietid, dagtid på hverdager, og at du leier som privatperson eller frivillig lag i egen kommune. En helgekveld i høysesong koster typisk mer enn en tirsdag i januar, selv i samme bygg.\n\n## Hvorfor prisen varierer: differensierte satser\n\nDen vanligste kilden til forvirring er at samme sal har flere priser samtidig. Nesten alle kommuner opererer med differensierte satser etter hvem som leier:\n\n- **Innbygger og privat fest:** standard privatsats.\n- **Lag, foreninger og frivillige:** ofte kraftig rabattert eller subsidiert, gjerne 40 til 70 prosent lavere enn privatsats.\n- **Næringsliv og kommersielle arrangement:** høyeste sats, fordi kommunen ikke skal subsidiere kommersiell drift.\n\nBergen kommune og Lillestrøm kommune er eksempler på kommuner som publiserer egne prisgrupper for privat, lag og næring. Problemet er at satsene ofte ligger spredt i PDF-er, reglementer og gamle nettsider, så det er vanskelig å vite hvilken pris som faktisk gjelder deg før du har ringt. En plattform som viser alle tre satsene ved siden av hverandre fjerner den usikkerheten: du ser med en gang om du kvalifiserer til medlemspris eller betaler full privatsats.\n\n## Slik finner du de billigste ledige salene uten å ringe rundt\n\nDen tradisjonelle måten å finne billigste sal på er å ringe eller e-poste hvert bygg, vente på svar, og manuelt sammenligne pris mot ledighet. Det tar dager, og du risikerer at lokalet er booket når du endelig får svar.\n\nI Digilist snur du prosessen. Du søker på dato og antall gjester, og får opp alle ledige saler i kommunen samtidig, med pris for din brukergruppe rett ved siden av kalenderen. Da ser du på ett skjermbilde at grendehuset er ledig til 900 kroner mens kulturhuset koster 3 800 for samme kveld, og at nabobygda har en aula til 1 400. Sanntidskalenderen betyr at det som står ledig faktisk er ledig, ikke en oversikt som ble oppdatert natten før.\n\nFor deg som bare vil ha «billigste sal å leie i nærheten» er dette forskjellen mellom en ettermiddag med telefoner og et enkelt søk.\n\n## Skjulte kostnader å sjekke før du booker\n\nGrunnleien er sjelden hele regningen. Før du sammenligner to lokaler, sjekk om disse postene kommer i tillegg:\n\n- **Rengjøring:** enten et fast gebyr på typisk 500 til 1 500 kroner, eller krav om at du vasker selv etter en sjekkliste.\n- **Depositum:** et forskudd på 1 000 til 5 000 kroner som betales tilbake hvis lokalet leveres uskadd og rent.\n- **Teknisk utstyr:** lyd, lys, projektor og scene faktureres ofte separat.\n- **Vakthold og brannvakt:** enkelte kommuner krever godkjent vakt ved arrangement over et visst antall gjester.\n- **Nøkkel eller adgangskort:** noen bygg tar et gebyr for utlevering.\n\nEn sal med lav grunnleie kan bli dyrere enn en litt dyrere sal når rengjøring og depositum er lagt til. Derfor bør du alltid se totalprisen, ikke bare timeprisen. I Digilist listes tilleggene som egne poster i bookingen, slik at summen du ser er summen du betaler.\n\n## Rabatter og subsidierte satser for lag og foreninger\n\nEr du med i et idrettslag, korps, velforening eller en annen frivillig organisasjon, betaler du sjelden full pris. Mange kommuner har gratis eller sterkt subsidiert utleie til lag og foreninger som er registrert i kommunens foreningsregister, særlig for aktiviteter rettet mot barn og unge.\n\nFor å få medlemsprisen må laget vanligvis være registrert i Frivillighetsregisteret eller kommunens eget register, og bookingen må gjøres i lagets navn, ikke privat. Forskjellen er stor: der en privatperson betaler 2 500 kroner for en samfunnshussal, kan det samme laget betale 800 kroner eller ingenting for et medlemsmøte.\n\nUtfordringen har vært at satsene er vanskelige å finne og at du må dokumentere lagstilknytning på nytt hver gang. Når laget er registrert i plattformen, kjenner systemet igjen brukergruppen din og viser medlemsprisen automatisk, uten at du må mase om rabatt i hver enkelt henvendelse.\n\n## Slik booker og betaler du trinn for trinn\n\nSelve bestillingen skal ikke være det vanskeligste. I Digilist ser en typisk innbyggerbooking slik ut:\n\n1. **Søk:** velg dato, tidspunkt og antall gjester.\n2. **Sammenlign:** se ledige saler med pris for din brukergruppe side om side.\n3. **Velg:** åpne lokalet du vil ha og se totalprisen med eventuelle tillegg som rengjøring og depositum.\n4. **Logg inn:** identifiser deg trygt med BankID eller ID-porten.\n5. **Bekreft og betal:** betal med Vipps, kort eller få faktura, avhengig av hva kommunen tilbyr.\n6. **Kvittering:** motta bekreftelse og kvittering på Min Side, der du også finner adgangsinfo og kan ta kontakt med utleier via chat.\n\nHele forløpet tar noen få minutter, og du slipper å vente på et manuelt svar for å vite om lokalet er ditt.\n\n## Konkrete grep for å spare penger\n\nDu kan påvirke prisen mer enn du tror. Noen enkle grep:\n\n- **Velg tidspunkt bevisst:** dagtid og hverdager er nesten alltid billigere enn helgekvelder.\n- **Tenk sesong:** januar til mars er lavsesong for selskapslokaler, mens mai, juni og desember er dyrest og booker seg først.\n- **Book i riktig navn:** leier du som lag, sørg for at bookingen gjøres i lagets navn så medlemsprisen slår inn.\n- **Les avbestillingsreglene:** sjekk fristen for gratis avbestilling før du betaler, slik at du ikke taper depositum ved endring.\n- **Vurder nabobygda:** et grendehus én kommunedel unna kan koste under halvparten av det sentrale kulturhuset for samme kveld.\n- **Regn på totalen:** legg alltid rengjøring, depositum og utstyr inn i sammenligningen.\n\nDisse grepene kan fort utgjøre flere tusen kroner på et enkelt arrangement, uten at du gir avkall på et brukbart lokale.\n\n## Finn den billigste ledige salen raskt\n\nÅ leie sal i kommunen skal ikke koste deg en ettermiddag med telefoner og gjetting på hvilken pris som gjelder. Med differensierte satser synlig side om side, sanntidskalender og totalpris uten skjulte tillegg finner du raskt den billigste ledige salen for akkurat din brukergruppe. Vil kommunen din tilby innbyggerne den oversikten? [Book en demo](https://digilist.no/demo) og se hvordan Digilist samler alle salene på ett sted.';
const __vite_glob_0_46 = '---\nslug: leiepriser-kommunale-lokaler-driftsleder-guide\ntitle: "Leiepriser på kommunale lokaler: driftslederens guide til prising"\ndescription: "Slik setter og forvalter driftsledere leiepriser for idrettshall, gymsal og møterom: prismodeller, rabatt til lag, depositum og automatisk beregning."\ndate: 2026-07-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Driftsleder"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["leiepriser kommunale lokaler", "sette pris på leie av lokale", "medlemspris lag og foreninger", "kommersiell utleie kommunalt lokale", "depositum avbestillingsgebyr", "differensiert prising idrettshall gymsal"]\n---\n\nDe fleste guider om leie av kommunale lokaler er skrevet for leietakeren som jakter billigste sal. Denne er for deg som sitter på andre siden av bordet. Som driftsleder er det du som setter prisene, forvalter rabattene og fanger opp tapt inntekt fra no-show og avbestilling.\n\n## Hvem bestemmer leieprisen i en kommune\n\nPrisen på et kommunalt lokale er sjelden én persons avgjørelse. Kommunestyret eller et hovedutvalg vedtar prisregulativet, ofte som en del av gebyrregulativet i budsjettet for kommende år. Saksbehandler forbereder saken og legger inn satsene i systemet. Driftsleder eier den daglige forvaltningen: hvilke lokaler som legges ut, hvilke rabattkoder som gjelder, og hvordan avvik håndteres. Skillet er verdt å holde rede på, fordi en prisendring på selve satsen krever politisk vedtak, mens en justering av rabattstruktur eller kapasitet ofte ligger innenfor ditt mandat. I praksis betyr det at du kan rydde opp i hvordan rabattene fungerer uten å vente på neste budsjettbehandling, så lenge du ikke rører den vedtatte grunnsatsen.\n\n## Medlemspris versus kommersiell leie\n\nTo prismodeller dekker de fleste behov.\n\n- **Medlems- eller subsidiert pris** gjelder registrerte lag og foreninger, gjerne med krav om at flertallet av medlemmene er bosatt i kommunen. Barne- og ungdomsidrett er ofte gratis eller nær null.\n- **Kommersiell leie** gjelder bedrifter, private arrangementer og eksterne aktører. Her ligger prisen på markedsnivå og skal dekke drift og slitasje.\n\nEn idrettshall kan koste et lokalt håndballag 0 kroner per treningstime, mens en bedrift betaler 900 kroner per time for samme flate. Poenget er ikke å tjene mest mulig på laget, men å ha en tydelig grense mellom det subsidierte og det kommersielle. Uten den grensen ender du enten med å subsidiere kommersielle aktører eller med å ta betalt av barneidretten, og begge deler skaper støy.\n\n## Slik bygger du en rabattmodell uten å tape inntekt\n\nRabatt til lag og foreninger er politisk ønsket, men en udefinert rabatt lekker penger. Bygg modellen på tre nivåer i stedet for én prosentsats:\n\n1. **Kategori** avgjør grunnrabatten (barneidrett, voksenidrett, kulturlag, kommersiell).\n2. **Tidspunkt** styrer prisen på ettertraktede tider. Fredagskveld i selskapslokalet er dyrere enn tirsdag formiddag.\n3. **Volum** belønner faste leietakere med sesongkontrakt fremfor spredte enkeltbookinger.\n\nMed denne strukturen gir du reell rabatt der kommunen vil, samtidig som du unngår at et firma booker gymsalen til foreningspris på en fredag kveld. Nivåene henger sammen: en forening får riktig kategori automatisk, men betaler likevel mer for den mest ettertraktede tiden, og aller minst hvis den binder seg til en hel sesong.\n\n## Differensiert prising per lokaltype\n\nÉn prisliste for alt er den vanligste feilen. Fem lokaltyper trenger fem logikker:\n\n- **Idrettshall:** pris per time eller per banedel, med subsidiert idrettspris og kommersiell sats.\n- **Gymsal:** lavere sats enn hall, ofte per skolekrets.\n- **Møterom:** pris per time eller halvdag, gjerne gratis for lag på dagtid.\n- **Selskapslokale:** døgn- eller kveldspris med depositum og renholdsgebyr.\n- **Kulturhus:** trappet pris etter sal, teknikk og bemanning.\n\nDifferensieringen gjør at et lite lag ikke subsidierer et bryllup, og at et kulturhus med lys- og lydtekniker ikke prises som et bart møterom.\n\n## Sesongkontrakt versus enkeltbooking\n\nSesongkontrakt gir laget forutsigbarhet og deg kapasitetskontroll. En fast tildeling gjennom hele sesongen prises typisk lavere per time enn enkeltbookinger, fordi den fyller kalenderen jevnt. Enkeltbooking prises høyere og legges på ledige rester. Kombinasjonen lar deg tildele 80 til 90 prosent av hallkapasiteten til faste lag, og selge resten som enkelttimer. Se den utdypende [guiden til sesongtildeling av idrettshall](/blogg/sesongtildeling-idrettshall-saksbehandler-guide) for selve tildelingsprosessen.\n\n## Depositum, avbestillingsgebyr og no-show\n\nTapt leieinntekt kommer sjelden fra prisen, men fra tider som står tomme uten oppgjør. Tre virkemidler:\n\n- **Depositum** på selskapslokaler dekker skade og renhold, ofte 1 500 til 3 000 kroner som frigis etter kontroll.\n- **Avbestillingsgebyr** med trappet frist: gratis avbestilling til 14 dager før, delvis gebyr innenfor 48 timer, fullt gebyr ved avbestilling samme dag.\n- **No-show-håndtering:** gjentatte uteblivelser gir tap av fast tildeling, ikke bare et gebyr.\n\nNår reglene ligger i systemet og trekkes automatisk, slipper du diskusjonen i hvert enkelt tilfelle. Leietakeren ser fristene ved booking, og oppgjøret følger reglene uten at du må ta en skjønnsvurdering per sak.\n\n## Prisendringer og kommunikasjon\n\nEn prisøkning som kommer uanmeldt gir klagestrøm. Varsle faste leietakere i god tid, minst før ny sesong starter, og forklar hva økningen dekker. Legg endringen ut samtidig som det nye regulativet vedtas, slik at satsen i systemet og satsen i vedtaket alltid er den samme. Én tydelig melding til alle sesongleietakere er billigere enn hundre telefoner til saksbehandler. Har en forening satt opp budsjettet sitt for året, tåler den en varslet økning langt bedre enn en overraskelse på første faktura.\n\n## Fra Excel-prisliste til automatisk beregning\n\nEn del kommuner forvalter fortsatt prisene i et regneark som saksbehandler slår opp i manuelt. Det gir feil pris, glemte rabatter og ingen kobling til faktura. I et bookingsystem legges hver regel inn én gang: lokaltype, kategori, tidspunkt, sesong og gebyr. Prisen beregnes automatisk når leietakeren booker, og går rett videre til [faktura og avstemming](/blogg/faktura-refusjon-avstemming). Driftsleder slipper å prise hver booking for hånd, og satsen er den samme uansett hvem som er på jobb.\n\n## Eksempel: prisstruktur i en Digilist-kommune\n\nSlik kan en oppsett se ut i praksis. En mellomstor kommune på Østlandet satte opp følgende i Digilist: idrettshall gratis for barneidrett, 250 kroner per time for voksenlag og 900 kroner kommersielt. Gymsaler til halv hallpris. Selskapslokale med 2 000 kroner i depositum og trappet avbestillingsgebyr. Møterom gratis for lag på dagtid. Alt regnes automatisk, og saksbehandler bruker tiden på tildeling i stedet for prisoppslag. Poenget med eksempelet er strukturen, ikke de eksakte satsene: din kommune legger inn sine egne tall fra sitt eget regulativ.\n\n## Sett opp din prisstruktur i Digilist\n\nVil du se hvordan medlemspris, kommersiell leie, rabatter og gebyrer settes opp på dine egne lokaler? **Book en demo**, så viser vi prisstrukturen med utgangspunkt i din kommunes regulativ.';
const __vite_glob_0_47 = '---\nslug: mote-rom-kommune-finn-ledige-i-omradet-mine-bookinger\ntitle: "Møterom i kommunen: finn ledige i ditt område og styr egne bookinger"\ndescription: "Slik finner innbyggere og foreninger ledige møterom på tvers av alle kommunens bygg, sammenligner kapasitet og utstyr, og styrer egne bookinger fra Min side."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Innbygger"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["møterom kommune", "ledige møterom i mitt område", "mine møterom bookinger", "møterom for foreninger", "pris på møterom kommune", "booke møterom uten saksbehandler"]\n---\n\nKommunen din eier trolig flere titalls møterom, spredt over rådhus, bibliotek, kulturhus og bydelshus. Problemet har vært å se dem samlet: hvilke er ledige torsdag kveld, hvor mange plasser, og har rommet prosjektor? Denne guiden viser hvordan du søker på tvers av alle byggene, sammenligner rommene, booker uten å ringe en saksbehandler, og følger opp alt fra Min side.\n\n## Hva regnes som et kommunalt møterom, og hvem kan leie?\n\nEt kommunalt møterom er et lukket rom kommunen leier ut til innbyggere, lag, foreninger og næringsliv når det ikke er i bruk til egen drift. Det spenner fra et lite grupperom med plass til seks personer på biblioteket, til en møtesal med plass til femti i kulturhuset. Felles for dem er at de bookes for et avgrenset tidsrom, ofte et par timer på kveldstid eller i helgen.\n\nHvem som kan leie varierer, men de vanligste gruppene er:\n\n- **Lag og foreninger** registrert i kommunen, for eksempel styremøter, årsmøter eller kurskvelder.\n- **Privatpersoner** bosatt i kommunen, til alt fra lesegrupper til nabolagsmøter.\n- **Bedrifter og næringsliv**, som ofte betaler en høyere sats enn foreninger.\n\nNoen rom har begrensninger. Et grupperom på biblioteket kan være forbeholdt stille arbeid, mens en sal med kjøkken krever at du er over 18 år og står ansvarlig for rydding. Disse reglene står på hvert rom, slik at du ser dem før du booker, ikke etter.\n\n## Slik finner du ledige møterom i ditt område: søk og filtrering på kart og liste\n\nDen gamle måten var å vite hvilket bygg du ville til, finne riktig avdeling, og sende en e-post. Da så du aldri rommet i nabobygget som faktisk var ledig. Med en samlet plattform søker du i stedet på tvers av hele kommunens beholdning.\n\nDu starter med å søke på **ditt område** eller din bydel. Resultatet vises både som liste og på kart, så du ser hvor langt unna hvert rom ligger. I Lillestrøm kommune kan en beboer på Strømmen se alle ledige møterom innenfor to kilometer, uavhengig av om rommet hører til biblioteket, frivilligsentralen eller et bydelshus.\n\nDeretter filtrerer du:\n\n- **Dato og klokkeslett**, slik at kun rom som faktisk er ledige da vises.\n- **Antall plasser**, for eksempel minst tolv personer.\n- **Utstyr**, som prosjektor, whiteboard, wifi eller teleslynge.\n- **Type leietaker**, som avgjør hvilken pris og hvilke rom du har tilgang til.\n\nKalenderen er i sanntid. Ser du en ledig time, er den faktisk ledig i det øyeblikket, ikke basert på en oversikt som oppdateres over natten.\n\n## Kapasitet, utstyr og tilgjengelighet: hva du bør sjekke før du booker\n\nEt møterom som ser riktig ut på navnet, kan mangle det du trenger. Sjekk disse punktene før du bekrefter:\n\n**Kapasitet.** Oppgitt antall plasser gjelder gjerne med bord og stoler i standardoppsett. Skal dere ha kursoppsett eller sitte i ring, tåler rommet ofte færre. Book med litt margin.\n\n**Utstyr.** Trenger dere prosjektor og wifi til en presentasjon, filtrer på nettopp det. Da slipper dere å stille med egen skjerm eller finne ut at rommet bare har en gammel flippover.\n\n**Tilgjengelighet.** Rominformasjonen bør vise om det er trinnfri adkomst, om det finnes teleslynge for hørselshemmede, og om det er tilgjengelig toalett i nærheten. For mange er dette avgjørende, ikke en detalj.\n\n**Adkomst og nøkkel.** Noen rom åpnes med kode du får på SMS, andre krever henting av nøkkel i åpningstiden. Det står på rommet, så du planlegger riktig.\n\n## Steg for steg: fra søk til bekreftet møteromsbooking\n\nHele forløpet tar rundt 90 sekunder når rommet først er funnet:\n\n1. **Søk** på område, dato og antall plasser.\n2. **Filtrer** på utstyret dere trenger, for eksempel prosjektor og wifi.\n3. **Velg rom** og se bilder, kapasitet, regler og pris.\n4. **Velg tidsrom** i sanntidskalenderen.\n5. **Logg inn** med BankID eller ID-porten, eller med magisk lenke på e-post for enklere formål.\n6. **Bekreft** og motta kvittering på skjerm og e-post.\n\nFor lag og foreninger med gyldig avtale skjer bekreftelsen umiddelbart, uten at en saksbehandler må godkjenne manuelt. Du booker altså møterom uten å kontakte noen, på samme måte som du bestiller en kinobillett. Krever rommet en vurdering, for eksempel ved arrangement med servering, går forespørselen til rett saksbehandler, og du følger statusen underveis.\n\n## Pris og betaling: gratis for lag og foreninger, betalt for næringsliv\n\nPrismodellen for kommunale møterom følger et vanlig prinsipp: frivilligheten prioriteres, næringslivet betaler kostnadsdekning.\n\n- **Lag og foreninger** leier ofte gratis eller til en symbolsk sats, gjerne under 200 kroner per kveld, som del av kommunens støtte til frivillig aktivitet.\n- **Privatpersoner** betaler en moderat sats som varierer med rommets størrelse.\n- **Bedrifter og næringsliv** betaler full pris, som kan ligge fra noen hundre til et par tusen kroner avhengig av rom og varighet.\n\nPrisen du ser, er prisen som gjelder for din type leietaker. Er du logget inn som forening, vises foreningssatsen, ikke næringssatsen. Betaling skjer med Vipps eller kort for enkeltbookinger, mens bedrifter og faste leietakere kan få faktura via EHF. Er leien gratis, hopper du rett forbi betalingssteget. Ingen kvittering forsvinner: alt lagres under Min side.\n\n## Endre eller avbestille en møteromsbooking\n\nPlaner endrer seg. Skal møtet flyttes en time eller avlyses helt, gjør du det selv fra Min side uten å sende en eneste e-post.\n\nÅpne bookingen, velg **endre tidspunkt** eller **avbestill**, og bekreft. Systemet frigjør rommet umiddelbart, slik at neste person ser det som ledig i sanntid. Betalte du for rommet, håndteres refusjon etter kommunens frister automatisk, uten at du må purre en saksbehandler på pengene. Er du innenfor gratisfristen, er det ingenting å gjøre opp.\n\nMerk deg avbestillingsfristen som står på hver booking. Avbestiller du senere enn fristen, kan hele eller deler av leien belastes, akkurat som når du booker et konferanselokale privat.\n\n## Mine møterom: oversikt over egne bookinger, kvitteringer og historikk\n\nUnder **Min side** samler du alt på ett sted. Her ligger:\n\n- **Kommende bookinger** med tid, sted, adkomstkode og en knapp for å endre eller avbestille.\n- **Historikk** over rom du har leid tidligere, nyttig når foreningen skal booke det samme rommet igjen neste semester.\n- **Kvitteringer og fakturaer**, som du laster ned til regnskapet.\n- **Meldinger** fra saksbehandler, hvis en forespørsel krever avklaring.\n\nFor en foreningskasserer betyr dette at årsmøtets lokalleie, kvittering og eventuell refusjon ligger samlet, klart til regnskapet, i stedet for spredt i en e-postboks. Søker du etter «mine møterom bookinger», er det nettopp denne oversikten du er ute etter.\n\n## Ulike regler for foreninger, bedrifter og private i samme kommune\n\nSamme rom kan ha ulike vilkår avhengig av hvem som leier. Det er ikke forskjellsbehandling for forskjellsbehandlingens skyld, men gjenspeiler at kommunen prioriterer frivillig aktivitet.\n\n| Leietaker | Typisk pris | Godkjenning | Prioritet |\n|---|---|---|---|\n| Lag og foreninger | Gratis eller symbolsk | Ofte automatisk | Høy |\n| Privatpersoner | Moderat sats | Automatisk eller enkel vurdering | Middels |\n| Bedrifter | Full kostnadsdekning | Kan kreve vurdering | Lavere |\n\nI Bærum kommune kan for eksempel en registrert idrettsforening booke et grupperom uten kostnad og få bekreftelse med en gang, mens en bedrift som vil leie samme rom til et kurs, betaler næringssats og kan bli bedt om formålet. Plattformen viser riktig regelsett ut fra hvem du er logget inn som, så du slipper å tolke et prisark selv.\n\n## Vanlige spørsmål om møteromsbooking i kommunen\n\n**Kan jeg booke møterom uten å kontakte en saksbehandler?**\nJa. For rom med automatisk godkjenning bekreftes bookingen med en gang du har logget inn og betalt eventuell leie. Saksbehandler kobles kun inn når rommet krever en vurdering.\n\n**Hvordan finner jeg ledige møterom i mitt område?**\nSøk på område, dato og antall plasser. Ledige rom vises på kart og i liste, filtrert etter utstyr som prosjektor og wifi.\n\n**Finnes det møterom med prosjektor og wifi?**\nJa, filtrer på utstyr i søket. Da vises kun rom som faktisk har det du trenger.\n\n**Hva koster et møterom?**\nLag og foreninger leier ofte gratis eller til en symbolsk sats, privatpersoner betaler en moderat sats, og bedrifter betaler full pris. Din innlogging avgjør hvilken pris du ser.\n\n**Hvor finner jeg mine tidligere bookinger?**\nUnder Min side ligger kommende bookinger, historikk, kvitteringer og meldinger samlet.\n\n## Slik ser det ut i din kommune\n\nInnbyggere og foreninger sparer tid når alle kommunens møterom finnes ett sted, med sanntidskalender, selvbetjent booking og full oversikt på Min side. Vil du se hvordan søk, filtrering og betaling fungerer på tvers av alle byggene i nettopp din kommune? [Book en demo](https://digilist.no/demo), så viser vi flyten fra søk til bekreftet booking på under ti minutter.';
const __vite_glob_0_48 = '---\nslug: magic-link-sms-bankid-sikker-innlogging\ntitle: "Magic link, SMS og BankID: tre sikre innloggingsmåter"\ndescription: "Magic link på e-post, engangskode på SMS, eller BankID via ID-porten. Tre sikre innloggingsmåter, én plattform. Kommunen bestemmer hvilken som kreves."\ndate: 2026-05-29\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sikkerhet"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["magic link", "passordløs innlogging", "SMS innlogging", "BankID", "ID-porten", "passwordless authentication", "kommunal innlogging"]\n---\n\nPassord var en feilbeslutning av Internett. For en bookings­plattform for kommunale lokaler er det også en barriere: innbyggeren skal bestille en bryllups­lokale, ikke administrere et SaaS-system. Hver glemt passord-tilbake­stilling er en kunde som forsvant.\n\nDigilist støtter tre passordløse innloggings­metoder, og kommunen bestemmer hvilke som kreves for hvilke flyter.\n\n## I. Magic link på e-post\n\nSkriv inn e-post­adressen din. Vi sender en lenke. Klikk på lenken. Du er innlogget i 30 dager (kan justeres per kommune).\n\n**Når brukes det.** Standard for privat­personer som booker selskaps­lokaler, møterom eller idretts­haller hvor det ikke kreves identitets­verifikasjon. 80% av book­ingene faller i denne kategorien.\n\n**Hvor sikkert er det.** Sikkert nok for low-risk bookinger. Lenken er kryptografisk signert, gyldig i 15 minutter, og kan kun brukes én gang. Den havner i samme innboks som kunden allerede bruker, som er kontoen de uansett ville mistet hvis noen hadde tilgang.\n\n**Tekniske detaljer.** JWT-signert token med kort levetid. Sendes via Resend (ikke SMTP-direkte). E-postene leveres med en gjennomsnittlig latens på 3–8 sekunder. Forsvinner lenken i spam? Klikk «Send på nytt».\n\n## II. SMS-engangskode\n\nSkriv inn mobil­nummer. Du får en 6-sifret kode på SMS. Skriv inn koden, du er innlogget.\n\n**Når brukes det.** For brukere uten norsk e-post­adresse, eller hvor kommunen ønsker en sterkere bekreftelse på telefonnummer enn på e-post. Også standard på mobil-først arrange­menter der det er enklere å taste en kode enn å bytte til e-postappen.\n\n**Hvor sikkert er det.** Sterkere enn passord, svakere enn BankID. SMS er ikke kryptert mellom operatører, så det er ikke egnet for høy-risk operasjoner. Men for «logg inn for å se min booking»: fullt tilstrekkelig.\n\n**Tekniske detaljer.** Koden er 6 sifre, gyldig i 5 minutter, maks 3 forsøk før blokkering i 30 minutter. Telefonn­ummer valideres mot E.164-format og verifiseres mot kjente VOIP-tjenester (vi tillater ikke engangs­numre fra burner-tjenester).\n\n## III. BankID via ID-porten\n\nKlikk «Logg inn med ID-porten». Du sendes til ID-porten, autentiserer med BankID, og blir sendt tilbake til Digilist autentisert.\n\n**Når brukes det.** Krevd for sesong­leie-søknader (lag og foreninger må kunne identifisere personlig signatar), for kontrakter som krever digital signatur, og som standard for organisasjons­kontoer. Kommunen kan kreve det også for vanlige bookinger hvis ønskelig.\n\n**Hvor sikkert er det.** Sterkeste sivile autentiserings­metode i Norge. Vi bruker det også som identifikator når kunden senere skal signere kontrakt: én autentisering, hele løpet ID-verifisert.\n\n**Tekniske detaljer.** OIDC-flyt via Signicat (eller direkte ID-porten for større kommuner). Vi mottar `sub` (pseudonymisert ID), navn, fødselsdato og e-post. Ingen fødselsnummer lagres i Digilist. Sesjons­varighet 8 timer, krever ny autentisering etter det.\n\n## Hva velger en kommune?\n\nVi anbefaler en lagdelt strategi:\n\n| Operasjon | Krav |\n|---|---|\n| Bla i tilgjengelige lokaler | Ingen innlogging |\n| Send forespørsel | Magic link (e-post) |\n| Book et standard lokale | Magic link eller SMS |\n| Book et anlegg med tilgangs­kontroll (nøkkel) | SMS eller BankID |\n| Søke om sesong­leie | BankID |\n| Signere kontrakt | BankID |\n| Administrere organisasjons­konto | BankID |\n\nDette balanserer brukervennlig­het mot tillit. En innbygger som booker barnebursdagsfest skal ikke trenge BankID. En lag­leder som forplikter organisasjonen til sesong­leie burde.\n\n## Onboarding-friksjon: målt på tvers\n\nVi har data fra kommuner som har brukt Digilist over 18 måneder. Med passordløs innlogging:\n\n- **Konvertering fra forespørsel til fullført booking:** 73% (industri­snitt for kommunale tjenester med passord: 41%)\n- **Drop-off på innloggings­steget:** 4% (industri­snitt: 22%)\n- **Andel innbyggere som booker mer enn én gang:** 58% (industri­snitt: 19%)\n\nTallene forteller én ting tydelig: når innlogging slutter å være en hindring, blir gjenkjøps­andelen høyere. Ikke fordi tjenesten er bedre, men fordi den ikke kaster ut folk.\n\n## Hva med eldre brukere?\n\nFrykten er reell: «Hva med folk som ikke bruker e-post på telefonen?» Svaret i praksis: de som har problemer med passord, har større problemer med passord enn med magic link. Magic link på desktop fungerer slik:\n\n1. Skriv inn e-post på din PC\n2. Åpne e-post-programmet ditt på samme PC\n3. Klikk lenken, så er du innlogget i samme nettleser-fane\n\nDet krever ikke at brukeren forstår OAuth, OTP, eller noe annet. Det krever bare at de kan åpne sin egen e-post. Som de uansett allerede gjør.\n\nFor de få som virkelig sliter, har kommunen alltid telefon­support som backup. Disse er en liten gruppe, men plattformen er designet for at de ikke skal stenges ute.\n\n## Sikkerhet bak kulissene\n\nAlle innloggings­hendelser logges. Mistenkelig aktivitet (mange forsøk fra ulike IP-adresser, store geografiske hopp innen kort tid) trigger automatisk konto­låsing og e-postvarsel til brukeren. Vi har ikke selv noensinne hatt et innbrudd i en plattform­konto: passordløs design fjerner hele angreps­overflaten der passord blir lekt fra andre tjenester og prøvd hos oss.\n\n';
const __vite_glob_0_49 = '---\nslug: min-side-alle-bookinger-paa-ett-sted\ntitle: "Min Side: alle bookinger, samtaler og kvitteringer på ett sted"\ndescription: "Kommende bookinger, fullførte, samtaletråder med utleier, kvitteringer og kalender­integrasjon. Alt samlet et sted innbyggeren faktisk kan finne tilbake til."\ndate: 2026-06-02\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Innbygger"\ncover: "/images/blog/minside_hero.svg"\nkeywords: ["Min Side", "innbygger dashboard", "bookings historikk", "kvittering", "kalenderintegrasjon", "selvbetjening", "Digilist UX"]\n---\n\nDet vanligste support-spørs­målet hos kommunens servicetorg er ikke «hvordan booker jeg?», det er «hvor finner jeg igjen bookingen min?». Den ble bekreftet på e-post for tre uker siden. E-posten er borte. Bekreftelses­linken er glemt. Personen vil bare endre tids­punktet en time.\n\nMin Side i Digilist løser den problemstillingen ved å eksistere på samme adresse hver gang, å være tilgjengelig uten passord, og å samle absolutt alt en innbygger har gjort i plattformen på samme sted.\n\n## Hvordan innbyggeren finner Min Side\n\nTre veier:\n\n1. **`booking.kommune.no/minside`**, direkte URL, fungerer alltid\n2. **Knappen «Min Side»** i toppmenyen, synlig når innlogget\n3. **«Se mine bookinger»** i hver bekreftelses- og påminnelses-e-post\n\nHvis innbyggeren ikke er innlogget, trigges magic link automatisk. Skriv e-post, klikk lenke i e-post, du er på Min Side. Ingen passord-glemt-flyt.\n\n## Hva Min Side viser\n\nTre faner:\n\n### Kommende bookinger\n\nListe over alt som ligger framover i tid. For hver:\n\n- Lokale (navn, bilde, adresse, kart-lenke)\n- Dato og tid\n- Bookings­nummer\n- Status (bekreftet, venter på god­kjenning, foreslått endring)\n- Aksjoner: vis detaljer, send melding, endre, kanseller\n\n«Endre» åpner et skjema som lar kunden foreslå ny tid. Hvis utleier har auto-god­kjenning av endringer på, gjennomføres den umiddelbart. Hvis ikke, sendes endrings­forespørsel til saksbehandler.\n\n### Fullførte\n\nBooking­shistorikk: alt som er ferdig. For hver kan kunden:\n\n- Laste ned kvittering (PDF)\n- Be om kopi av faktura hvis det var en organisasjons­booking\n- Lese tilbake samtale­tråden\n- Skrive en anmeldelse hvis kommunen har det aktivert\n\nHistorikken går så langt tilbake som GDPR-policy­en tillater: typisk 36 måneder for vanlige bookinger, lengre for organisasjons­bookinger som er knyttet til kontrakter.\n\n### Søknader og avtaler\n\nFor sesong­leie og lengre­varige avtaler. Lag og foreninger ser her:\n\n- Status på sesong­leie-søknaden (innsendt, under behandling, god­kjent, avvist)\n- Tildelte tider når fordelingen er publisert\n- Avtaler de er knyttet til (digitalt signert via BankID)\n- Endrings­logger på avtalene\n\n## Samtaletråder: én pr. booking\n\nHver booking har sin egen samtale­tråd (se [Forespørsel og chat](/blogg/forespørsel-chat-kommunikasjon)). Fra Min Side ser kunden alle samtaler de har hatt, ordnet etter siste aktivitet. Klikk en samtale, så er du i tråden, klar til å svare.\n\nUlest melding fra saks­behandler? Min Side har et lite tall-merke i navigasjonen, og kunden får e-post + push-varsel hvis den har installert plattformen som PWA på telefonen.\n\n## Kalender­integrasjon\n\nHver booking har en «Legg til i kalender»-knapp som genererer en .ics-fil. Klikker kunden den på telefonen, åpnes telefon­ens kalender­app med book­ingen prefylt. På desktop laster .ics-filen ned og kan importeres til Google Calendar, Outlook, Apple Calendar.\n\nVi vurderer abonnement-feed (kunden abonnerer på alle sine bookinger som en levende kalender), men det er foreløpig ikke prioritert: folk klager ikke på .ics-modellen.\n\n## Kvitteringer og fakturaer\n\nFor book­inger med betaling lagres:\n\n- **Kvittering** (PDF, alltid tilgjengelig): viser hva som ble betalt, når, og hvordan\n- **Faktura** (PDF, hvis organisasjons­booking): EHF-formatet for digital arkivering hvis kunden trenger det\n- **Refusjons­bekreftelse** (hvis aktuelt): viser når og hvordan beløp ble tilbakeført\n\nInnbygger­regnskap er ofte etter­spurt rundt skatte­oppgjør (treningsavgift for barn osv.). Å ha en oversikt på ett sted gjør den jobben dramatisk enklere.\n\n## Personvern på Min Side\n\nDet innbyggeren ser om seg selv:\n\n- Sine egne bookinger og samtaler\n- Sin profil med navn, e-post og telefon (kan endres)\n- Sin betalingshistorikk\n- Sine preferanser (varsler, kalender­integrasjon)\n\nDet innbyggeren ikke ser:\n\n- Andre kunders data\n- Saks­behandlerens interne notater\n- Plattformens audit-logger\n\n«Last ned mine data» og «slett kontoen min» finnes som knapper. GDPR-retten håndteres direkte i grensesnittet, ikke via en e-post til support.\n\n## Tilgjengelighet\n\nMin Side er WCAG 2.1 AA-kompatibel:\n\n- Tastatur­navigerbar\n- Skjermleser­vennlig (Aria-roller, semantisk HTML)\n- 4.5:1-kontrast minimum\n- Skalerer til 200% uten tap av funksjonalitet\n- Responsive helt ned til 320 px bredde\n\nHvorfor det betyr noe: en del av kundebasen for kommunale book­inger er eldre eller har funksjons­nedsettelser. Tilgjengelig­hets-arbeid er ikke en juridisk avkrysnings­oppgave. Det er hvordan man gjør tjenesten reell for alle.\n\n## Det enkle prinsippet bak\n\nMin Side er bygd på antakelsen om at innbyggeren ikke skal måtte huske hvordan plattformen fungerer. Hver gang de kommer tilbake, skal det være den samme adressen, samme layout, alle tidligere bookinger der de forventer dem. Det bygger den ene egenskapen som gjør at folk kommer tilbake: forutsigbarhet.\n';
const __vite_glob_0_50 = '---\nslug: onboarding-uke-til-live\ntitle: "Onboarding for nye kunder: fra signering til live på en uke"\ndescription: "Fem dager, fem milepæler. Ingen konsulent, ingen prosjektrigging: bare en sekvens som er bygget for at en kommune eller utleier skal komme live uten å miste fart."\ndate: 2026-05-30\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Onboarding"\ncover: "/images/blog/onboarding_hero.svg"\nkeywords: ["onboarding", "implementering", "go-live", "Digilist onboarding", "kommunal SaaS", "raskt i drift"]\n---\n\n«Hvor lang tid tar det å komme live?» er det første spørs­målet en kommune stiller. Det andre er: «Hvor mye av oss krever det?»\n\nBegge svar er kortere enn dere tror. Hovedgrunnen er at Digilist har bygget onboarding som et produkt, ikke som et konsulent­prosjekt. Den følger en bestemt sekvens, har klare milepæler, og forutsetter ingen tekniske personer på deres side.\n\nSlik ser en typisk uke ut.\n\n## Dag 1: Signering og kick-off (1 time)\n\nAvtalen er signert, kommunen har en konto­ansvarlig hos oss, og dere har valgt:\n\n- Hvilke anlegg som skal med i første lansering (vi anbefaler maks 5–10 til å starte)\n- Hvilken juridisk enhet som er kunde (kommune­etat, foretak, kommune­selskap)\n- Hvilke roller som trenger admin-tilgang (typisk 2–4 personer)\n\nKick-off-møtet er 30 minutter. Vi går gjennom planen for uken, dere får tilganger, vi avtaler check-in-møter dag 3 og dag 5. Det er det.\n\n## Dag 2: Konfigurasjon (2 timer dere · 3 timer oss)\n\nPlattformen er provisjonert. Dere logger inn for første gang og:\n\n- Last opp logo, sett farger om dere har en visuell profil\n- Sett organisasjons­detaljer (org.nr, adresse, kontakt)\n- Velg betalings­leverandører (Vipps, Stripe, EHF/Peppol). Vi setter opp koblingene\n- Inviter saks­behandlere og admins med deres e-postadresser\n\nVi tar oss av alt det tekniske: domene­oppsett (`booking.kommune.no`), e-postdomene-verifisering, integrasjons­kontoer.\n\n## Dag 3: Innhold (4 timer dere · 1 time oss)\n\nDette er den eneste dagen som krever en seriøs arbeids­innsats fra deres side. Hvert anlegg får opprettet en oppføring med veiviseren (se [Slik legger du til et nytt utleieobjekt](/blogg/utleieobjekt-veiviser-steg-for-steg)). For 8–10 anlegg tar det ca. 30 minutter per anlegg første gang, eller mindre hvis dere har en mal å kopiere fra.\n\nHvis dere har data i et eksisterende system (RCO Booking, Excel-ark, en gammel webside) tilbyr vi importer:\n\n- **RCO-migrasjon.** Vi har en standard import som tar bygg, åpningstider, priser og pågående sesong­avtaler ut av RCO.\n- **Excel-import.** Last opp en .xlsx med kolonne­strukturen vi sender: anlegg, kapasitet, fasiliteter, åpningstider.\n- **Manuell oppretting.** Veiviseren, anlegg for anlegg.\n\nMøtet dag 3 er 30 minutter for å avklare spørsmål som dukker opp underveis.\n\n## Dag 4: Test (3 timer dere · 2 timer oss)\n\nNå går plattformen i en stille modus: domenet svarer, alt fungerer, men den er ikke annonsert offentlig. Vi gjør sammen:\n\n- **Test-bookinger.** Saksbehandler oppretter en booking som privat­person (med Magic link). Plattformen sender bekreftelse. Kalender oppdateres. Faktura­grunnlag genereres.\n- **Driftsroller.** Vaktmester får e-post + SMS-varsel. Stemmer detaljene?\n- **Betalings­flyt.** En test-booking med Vipps-betaling. 1 krone, vi refunderer etterpå.\n- **Sesongleie.** Hvis dere skal bruke den, en test-søknad fra et fiktivt lag.\n- **Mobil.** Alt på iPhone og Android.\n\nEventuelle bugs eller justeringer fikses samme dag. Vi har en hot­fix-rutine for go-live-uker som leverer endringer innen 4 timer.\n\n## Dag 5: Go-live (1 time dere)\n\nKnappen «Aktiver offentlig» trykkes. Plattformen er live på `booking.kommune.no` (eller deres valgte domene). Vi kjører sammen gjennom:\n\n- Sjekkliste for at alle anlegg er publisert\n- Bekreftelse på at SEO-data er i orden (sitemap submitted)\n- Test av siste e-post-flyt\n- Avtale om første ukes oppfølging\n\nResten av dagen sender dere selv en kort kommunikasjon til relevante interessenter: innbyggere via nettside/sosiale medier, lag og foreninger via e-post, kommune­ansatte via internt nyhetsbrev. Vi har maler.\n\n## Uke 2: Stabilisering, ikke implementasjon\n\nUke 2 er ikke en del av onboarding. Den er en del av drift. Men det er typisk når:\n\n- Første reelle book­ing fra innbygger kommer inn (oftest dag 1 av uke 2)\n- Saksbehandler oppdager noen flyter de vil justere (vi ringer kunde­ansvarlig)\n- Dere starter å se Plausible-statistikk på hva som faktisk skjer\n- Reglene for auto-god­kjenning kalibreres basert på reelle data\n\nVi har en check-in dag 10. Etter det er vi i normal support-modus.\n\n## Hva som ikke står på listen\n\n**Tilpasset utvikling.** Vi gjør ikke kundespesifikk koding under onboarding. Plattformen har konfigurer­ings­valg som dekker 95% av kommuner; resten holdes til etter at dere er live.\n\n**Migrasjon av historiske bookinger.** Vi importerer fram­tidige sesong­leier og pågående avtaler, men ikke hver eneste historisk booking fra 2019. Erfaringen er at det skaper mer støy enn verdi.\n\n**Custom integrasjoner.** Hvis dere trenger en kobling vi ikke har, vurderes det etter go-live. Standard-integrasjonene (Vipps, BankID, ID-porten, Visma, Tripletex, Fiken, EHF) er på plass dag én.\n\n## Hva en uke faktisk gir\n\nEtter onboarding har dere:\n\n- En live, offentlig bookings­plattform\n- 5–10 anlegg som tar imot bookinger\n- Saks­behandlere som er trent på flyten\n- Betalings­strøm fra Vipps og kort til kommune­konto\n- Faktura­grunnlag til regnskap (EHF eller direkte integrasjon)\n- En tjeneste innbyggere kan bruke på telefonen, uten passord\n\nFor en ordinær kommune med 12 anlegg er det 30+ timer å investere fra deres side over fem dager. Sammenlignet med et tradisjonelt SaaS-implementasjons­prosjekt på 3–6 måneder er det forskjellen mellom å bygge en bro og å gå over en eksisterende.\n\n';
const __vite_glob_0_51 = '---\nslug: penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor\ntitle: "Penetrasjonstesting: hva en SaaS-leverandør skal levere"\ndescription: "Hva betyr egentlig at en SaaS-leverandør er sikker? Pen-test, sårbarhetshåndtering og supply-chain: sjekkliste for kommunal anskaffelse."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["penetrasjonstesting", "pen-test", "sikkerhetsrevisjon", "supply chain", "Dependabot", "Snyk", "anskaffelse"]\n---\n\nNår en norsk kommune skal velge ny SaaS-leverandør, dukker spørsmålet om sikkerhet alltid opp, men ofte med altfor brede formuleringer. "Leverandøren skal følge gjeldende sikkerhetsstandarder." Hva betyr det egentlig? Hva er forskjellen mellom en leverandør som faktisk gjør arbeidet og en som har sertifikatet på veggen?\n\nDenne artikkelen er en praktisk guide for kommunens IT-leder eller anskaffelsesansvarlig: hva penetrasjonstesting og sikkerhetsrevisjon faktisk skal innebære, og hvilke spørsmål du bør stille.\n\n## Penetrasjonstest, sårbarhetsskanning og kodevurdering\n\nTre forskjellige aktiviteter blir ofte slått sammen under "sikkerhetstesting":\n\n- **Sårbarhetsskanning (Vulnerability scanning).** Automatisert verktøy som leter etter kjente sårbarheter. Rimelig, kjøres ofte (helst daglig). Verktøy: OWASP ZAP, Nessus, Qualys.\n- **Penetrasjonstest (Penetration test).** Manuell, av en sikkerhetsekspert som forsøker å bryte inn. Mer grundig, men dyrere. Bør kjøres minst én gang per år, og ved større endringer.\n- **Kodevurdering (Code review / SAST).** Statisk analyse av kildekoden. Skal være integrert i utviklerflyten, ikke en kvartalsvis aktivitet.\n\nEt godt sikkerhetsprogram har alle tre. En leverandør som bare har ett, dekker bare deler av angrepsflaten.\n\n## Hva en penetrasjonstest faktisk gir\n\nEn typisk leveranse fra en penetrasjonstest:\n- Rapport med funn, klassifisert etter alvorlighetsgrad (kritisk / høy / middels / lav).\n- Detaljert beskrivelse av hver sårbarhet med stegene for å reprodusere.\n- Anbefalt utbedring.\n- Etterprøving etter at utbedringen er gjennomført.\n\nEn kommune som signerer NDA bør ha rett til å se sammendraget av siste pen-test før kontraktssignering. Et leverandørsvar som er "vi gjør pen-test men kan ikke dele resultater" er et rødt flagg. Et leverandørsvar som er "her er sammendraget under NDA, vi har stengt alle kritiske funn og kan dokumentere det" er det riktige svaret.\n\n## Sårbarhetshåndtering: den daglige delen\n\nPen-test er punktnedslag. Den daglige sikkerheten handler om kontinuerlig sårbarhetshåndtering. Dette er hva en moderne SaaS-leverandør faktisk gjør (eller skal gjøre):\n\n### Avhengighetsoppdateringer\n\nEt typisk moderne system har 500+ tredjeparts-avhengigheter (npm-pakker, system-pakker, container-images). Nye sårbarheter publiseres daglig.\n\n- **GitHub Dependabot** eller **Snyk** overvåker hvilke avhengigheter som har CVE-er.\n- Kritiske CVE-er blir patchet innen 48 timer.\n- Høy-alvorlighetsgrad blir patchet innen 7 dager.\n- Resten følger normal cadens (ukentlig).\n\nEn leverandør som ikke kan svare på "hvor mange sårbarheter har du åpne akkurat nå?" har sannsynligvis ikke et fungerende program.\n\n### Supply chain: der angrepene kommer fra nå\n\nSupply chain-angrep er der angriperen kompromitterer en tredjeparts-pakke som mange systemer bruker. Eksempler: SolarWinds (2020), node-ipc (2022), xz-utils (2024).\n\nForsvar:\n- Pakke-pinning. Bruk eksakte versjoner, ikke "latest".\n- Lockfile-validering. Bekreft at den installerte versjonen samsvarer med det som er testet.\n- Builds i isolerte miljøer.\n- Signaturverifikasjon der det er tilgjengelig.\n\nFor en kommune i en anskaffelse: spør hva leverandøren gjør med supply chain. Et tomt svar er en advarsel.\n\n### Hemmelighetsskanning\n\nGitHub Secret Scanning, truffleHog eller lignende verktøy som leter etter ved et uhell innsjekkede API-nøkler. Et team som bruker disse vil oppdage et lekket Stripe-nøkkel innen minutter, ikke uker.\n\n## Bug bounty og ansvarlig sårbarhetsrapportering\n\nStørre SaaS-leverandører tilbyr bug bounty: en betalingsstruktur for at eksterne forskere skal rapportere sårbarheter ansvarlig. Mindre leverandører har minst en `security.txt`-fil med kontaktinformasjon for sikkerhetsforskere.\n\nHvis en leverandør ikke har en kanal for å motta sårbarhetsrapporter fra eksterne, betyr det at en forsker som finner noe må enten varsle leverandøren via vanlige kanaler (som ofte ignoreres) eller publisere funnet, i verste fall sammen med eksploiten.\n\nSjekk om leverandøren har `https://digilist.no/.well-known/security.txt`. Hvis ikke, spør hvorfor.\n\n## ISO 27001 vs faktisk arbeid\n\nISO 27001-sertifisering betyr at en uavhengig revisor har bekreftet at organisasjonen har et fungerende informasjonssikkerhetsstyringssystem (ISMS) på revisjonstidspunktet. Det betyr ikke at systemet ikke har sårbarheter.\n\nSertifisering er en grunnlinje, ikke et endepunkt. En leverandør med ISO 27001 og en aktiv pen-test-rapport er det du vil ha. En leverandør med bare ISO 27001 og ingen pen-test, har klart en revisjon, men ikke nødvendigvis bygget et sikkert system.\n\n## Sjekkliste: det du bør spørre om i anskaffelse\n\nKonkret bør du spørre om dette:\n\n1. **Penetrasjonstest:** Hvor ofte? Hvem utfører? Kan vi se sammendraget under NDA?\n2. **Sårbarhetshåndtering:** Hvor mange åpne sårbarheter har dere akkurat nå? Hva er SLA for kritisk / høy?\n3. **Avhengighetsoppdateringer:** Dependabot / Snyk / annet? Hvor ofte oppdateres avhengigheter?\n4. **Supply chain:** Hvilke tiltak? Lockfile-validering? Pinning?\n5. **Hemmelighetsskanning:** Aktiv? Hvilket verktøy?\n6. **Sikkerhetshendelse-rapportering:** `security.txt`? Bug bounty? Responstid?\n7. **ISO 27001:** Når sist revidert? Hvilket revisjonsfirma?\n8. **Kodevurdering:** SAST i CI? Hvilken dekning?\n\nEt leverandørtilbud bør kunne svare på alle åtte uten ekstra spørreruner. Hvis svarene er vage eller "vi kommer tilbake til deg", er det informasjon i seg selv.\n\n## Hva Digilist gjør\n\nFor ordens skyld:\n\n- Pen-test gjennomføres årlig av eksternt firma. Sammendrag er tilgjengelig under NDA for kommuner i anskaffelse.\n- Dependabot er aktivt på alle repositorier. Kritiske CVE-er har 48-timers SLA. Status er offentlig på et internt sikkerhetsdashboard.\n- Supply chain: pakkene er pinned, lockfile-validering ved hver deploy, npm audit i CI.\n- `security.txt` ligger på `digilist.no/.well-known/security.txt`.\n- ISO 27001 fra dag én. ISO 27701 på samme spor.\n- SAST integrert i CI gjennom typecheck + linting + dependency-scanning.\n\nDet er ikke en garanti mot angrep. Det er et fungerende program som gjør angrep dyrere for angriperen og raskere å oppdage for oss.\n\n## Veien videre\n\nSikkerhetsrevisjon er ikke et engangsarbeid. Det er et kontinuerlig program. En leverandør som forstår dette, er en leverandør du kan stole på over tid.\n\nVil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet eller [DDoS og ransomware: beredskap](/blogg/ddos-ransomware-beredskap-bookingplattform) for hva som skjer hvis angrepet kommer.\n';
const __vite_glob_0_52 = '---\nslug: phishing-resistente-innlogginger-idporten-bankid\ntitle: "Phishing-resistente innlogginger med ID-porten og BankID"\ndescription: "Passordbaserte innlogginger phishes hver dag. Derfor er ID-porten og BankID det enkleste forsvarsgrepet en norsk kommune kan gjøre."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sikkerhet"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["phishing", "ID-porten", "BankID", "FIDO2", "innlogging", "kommune", "MFA"]\n---\n\nStatistisk sett er passord-phishing den enkleste måten å bryte seg inn i en organisasjon på. Det krever ikke avanserte verktøy, ingen sero-days. Det krever bare at én ansatt klikker på riktig lenke og taster inn passordet på en falsk side. NSM og Mnemonic har konsistent flagget dette som den dominerende inngangsvektoren for cyberhendelser i norsk offentlig sektor.\n\nDen gode nyheten: phishing-resistente innloggingsteknologier finnes, er gratis å bruke for kommuner, og er allerede integrert i de fleste norske offentlige tjenester. Den enda bedre nyheten: et bookingsystem som velger riktig pålogging fra dag én lukker den vanligste angrepsvektoren før den åpnes.\n\n## Hvorfor passord ikke kan vinne\n\nEt passord er et delt hemmelig: brukeren kjenner det, og serveren kjenner det. Det betyr at hvis brukeren oppgir hemmeligheten på feil sted (en phishing-side), så vinner angriperen.\n\nTo-faktor med SMS hjelper noe. To-faktor med authenticator-app hjelper mer. Men begge har et grunnleggende problem: en angriper som lurer brukeren til å taste inn både passord og engangskode på samme falske side, vinner fortsatt.\n\nPhishing-resistent autentisering løser dette problemet ved å koble innloggingen til selve nettstedet brukeren besøker. Det er ikke noe brukeren *kan oppgi*. Det er kryptografisk knyttet til opprinnelsen.\n\n## ID-porten og BankID: phishing-resistent i praksis\n\nNår en norsk innbygger logger inn med BankID på en bookingside, skjer følgende:\n1. Bookingsiden ber ID-porten om en innlogging.\n2. ID-porten viser et BankID-vindu hos banken som leverer BankID.\n3. Brukeren autentiserer seg i BankID-appen eller med kodebrikke.\n4. ID-porten gir bookingsiden en signert token om at brukeren er den de utgir seg for å være.\n\nDet kritiske er steg 1 og 4: bookingsiden snakker direkte med ID-porten, og ID-porten signerer en token til *akkurat det opprinnelses-domenet*. En phishing-side på `digiIist.no` (med stor I) kan ikke be om en token til seg selv fordi ID-porten ikke kjenner det domenet.\n\nDette er kvalitativt forskjellig fra passord-phishing. Selv om brukeren *forsøker* å bli phisket, klarer ikke angriperen å oversette en BankID-pålogging til tilgang på sin egen falske side.\n\n## Hva med saksbehandlere?\n\nInnbyggere bruker BankID. Saksbehandlere (kulturkonsulenter, idrettskoordinatorer, vaktmestere) har behov for noe litt annet:\n- De logger inn ofte (flere ganger per dag).\n- De jobber fra kommunens nett, ikke hjemmefra.\n- De har behov for rollebaserte tilganger som varierer.\n\nDigilist tilbyr to spor for ansatte:\n\n1. **ID-porten med ansattlegitimasjon.** Den enkleste varianten: saksbehandleren har allerede en bekreftet identitet hos ID-porten, og bruker den.\n2. **Magic-link på e-post + SMS-bekreftelse.** For roller som ikke har ID-porten, eller for nye ansatte før ID-porten er provisjonert.\n\nBegge er phishing-resistente. Begge fungerer uten passord.\n\n## "FIDO2": det teknologien heter\n\nFor dem som vil ha bakgrunnen: phishing-resistent autentisering bygger på FIDO2-standarden, som er bygget rundt offentlig-nøkkel-kryptografi i stedet for delte hemmeligheter. ID-porten og BankID er begge FIDO-kompatible.\n\nPraktisk betyr det at en kommune som velger en plattform som bygger på ID-porten + BankID, automatisk får dette forsvaret, uten å måtte forstå standarden i detalj. Det er en av få beslutninger der det enkleste valget også er det sikreste.\n\n## Hva som faktisk skjer i et phishing-forsøk\n\nEt tenkt scenario med passordbasert innlogging:\n1. Saksbehandler får en e-post: "Klikk her for å bekrefte din konto på bookingsystemet."\n2. Lenken går til `bookingsystem-bekreft.no` som ser identisk ut.\n3. Saksbehandler logger inn med passord.\n4. Angriperen har nå legitime credentials.\n\nSamme scenario med ID-porten:\n1. Saksbehandler får e-posten.\n2. Klikker på lenken, blir bedt om å logge inn med ID-porten.\n3. Det åpner et ID-porten-vindu, men det er feil URL-mønster, og BankID-vinduet vil ikke åpne fordi forespørselen ikke kan signeres for et ukjent domene.\n4. Angriperen får ingenting.\n\nDet er ikke umulig å phishe ID-porten-brukere, men listen er mye høyere. Det krever sosial manipulasjon der angriperen får brukeren til å selv navigere til riktig sted og deretter overlevere session-cookien, en mye mer komplisert operasjon.\n\n## Anbefaling\n\nFor en kommune som er i ferd med å velge bookingsystem: gjør pålogging med ID-porten + BankID til et absolutt krav. Det er gratis å bruke for offentlige aktører, det er kjent for innbyggerne, og det fjerner den enkleste angrepsvektoren før den oppstår.\n\nIngen annen enkeltbeslutning i en anskaffelse gir så mye sikkerhetsverdi per krone som denne.\n\nVil du vite mer om hvordan Digilist håndterer pålogging? Se [ID-porten og BankID for kommunal innlogging](/blogg/idporten-bankid-kommunal-innlogging) eller les videre om [cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem).\n';
const __vite_glob_0_53 = '---\nslug: realtime-varsler-driftsroller\ntitle: "Realtime-varsler: plattformen forteller før noen ringer"\ndescription: "En vaktmester som får telefon søndag morgen fordi noen står ute, er en kommune som mangler informasjonsflyt. Digilist fjerner samtalen før den starter."\ndate: 2026-05-25\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Drift"\ncover: "/images/blog/realtime_updates_hero_no.webp"\nkeywords: ["push-varsler", "driftsroller", "vaktmester", "renhold", "automatisk varsling", "outbox event bus"]\n---\n\nDet er et øyeblikk som gjentar seg i hver kommune: en innbygger har booket en lokale, kommer dit i tide, men finner døren låst. Hun ringer servicetorget, som ringer kulturkonsulenten, som ringer vaktmesteren. Tre samtaler, fem minutters frustrasjon, og en booking som starter dårlig. Den underliggende feilen er ikke menneskelig. Det er informasjon som ikke har flyttet seg automatisk. Det er nettopp den informasjonsflyten realtime-varslene er bygget for.\n\n## Tre lag av varsler, hvert med sitt formål\n\nDigilist sender varsler på tre forskjellige nivåer, og det er forskjellen mellom et bookingsystem som forsto driftshverdagen og et som fortalte saksbehandleren at hun fikk en e-post.\n\n### Innbyggervarsler\n\nNår en booking bekreftes, sendes:\n\n- **E-post-bekreftelse** med all info, kalenderfil, adresse, og bookingens unike kode for digital nøkkel.\n- **SMS-påminnelse** 24 timer før (kommunen velger om dette er aktivt).\n- **Push-varsel** dersom innbyggeren har Digilist-appen installert.\n\nVed endringer i bookingen (flytting, kansellering, anlegget blir blokkert av kommunen) får innbyggeren samme informasjon på samme tre kanaler. Hun trenger aldri å sjekke om noe har endret seg.\n\n### Driftsrollevarsler\n\nNår en booking bekreftes for et anlegg, sender Digilist automatisk pushvarsler til driftsrollene som er koblet til dette anlegget:\n\n- **Vaktmester:** «Booking 14:00–17:00 på Gymsalen Storsalen. Krever oppvarming, AV-utstyr, stoler oppstilt 50 personer.»\n- **Renhold:** «Etter-rengjøring 17:00, før neste booking 18:30.»\n- **Vekter:** «Booking forlater kl 17:30. Lås opp 13:45, lås ned 18:00.»\n\nHvert varsel inneholder konkrete oppgaver, ikke bare «det er en booking». Driftsrollen kan kvittere fra varselet («Bekreftet, jeg kommer») uten å åpne appen. Kvitteringen logges i bookingens audit-spor og er synlig for kulturkonsulenten.\n\n### Saksbehandlervarsler\n\nSaksbehandleren får varsel om hendelser som krever menneskelig vurdering, ikke om hver booking. Eksempler:\n\n- **Søknad om sesongleie utenfor regler:** krever skjønn.\n- **Refusjonsforespørsel:** krever vurdering av betingelser.\n- **Konfliktdeteksjon:** to søkere har søkt overlappende tid og automatreglene kan ikke avgjøre prioritet.\n\nSaksbehandlervarslene har konfigurerbar batching: en saksbehandler kan velge å få dem som live-pushvarsler, daglig sammendrag, eller bare når de logger inn. Standard er sammendrag, fordi 1 200 bookinger i måneden krever fokus.\n\n## Det vanskelige: transaksjonell garanti\n\nEt varselsystem som «som regel sender varsler» er verdiløst. Et som garanterer levering er forskjellen mellom et profesjonelt og et amatøraktig system. Digilist bruker et **outbox-mønster**: varselet skrives i samme transaksjon som mutasjonen som utløste det.\n\nKonkret:\n\n1. Booking bekreftes → DB-mutasjon.\n2. Varselposten skrives til `outboxEvents`-tabellen i samme transaksjon.\n3. Enten lagres _begge_ deler, eller _ingen_ av dem. Aldri en booking uten varsel.\n\nEn cron-jobb scanner outbox-tabellen og distribuerer varslene til abonnentene med backoff (30s → 60s → 120s → cap 5min). Hvis en mottaker er nede, holdes varselet i køen til det leveres. Etter tre forsøk uten lykke flyttes det til en `dead-letter`-kø som varsler kommunens driftsansvarlige.\n\nResultatet: ingen «event missed»-feil. Hvis en booking lagres, blir varslene levert, kanskje senere enn ønsket, men de blir levert, og det er etterprøvbart at de ble det.\n\n## Hvor varsler ikke kommer fra Digilist\n\nDet er fristende å tro at et bookingsystem skal håndtere _all_ kommunikasjon. Det er feil. Digilist sender varsler om:\n\n- Bookingstatus (bekreftet, kansellert, flyttet)\n- Driftsoppgaver knyttet til konkrete bookinger\n- Saksbehandling som krever menneskelig vurdering\n- Betalingsstatus og refusjoner\n\nDigilist sender _ikke_:\n\n- Markedsføring eller nyhetsbrev (det tilhører kommunens egen kanal)\n- Innbyggerundersøkelser (Kommunens egen plattform)\n- Generelle servicemeldinger (kommunens innbyggerportal)\n\nÅ holde varselkanalen smal og funksjonell øker leveringspresisjonen. Innbyggere som vet at en Digilist-melding alltid handler om en faktisk booking åpner dem alltid. Det er den motsatte effekten av en kanal som blir overbelastet med ukjent informasjon, der menneskene begynner å filtrere bort _alt_.\n\n## Hva kommunen kan rapportere\n\nHver varsel er en datapunkt. Kommunen kan rapportere:\n\n- Hvor lang tid det går fra booking-bekreftelse til at vaktmesteren kvitterer\n- Hvilke anlegg har høyest «ikke møtt»-rate hos driftsroller\n- Hvilke bookinger blir oftest endret etter første bekreftelse\n- Hvilken kanal (push / e-post / SMS) har høyest åpningsrate per persona\n\nDette er ikke surveillance. Det er driftsforbedring. Hvis et bestemt anlegg konsekvent har sen kvittering fra vaktmesteren, er det et signal om at driftsoppgaven er feilformulert, ikke at vaktmesteren er treg.\n\n';
const __vite_glob_0_54 = '---\nslug: saksbehandler-godkjenne-avvise-kommunisere\ntitle: "Saksbehandler: godkjenne, avvise og kommunisere på minutter"\ndescription: "Innboks for forespørsler, regelbasert auto-godkjenning, samtaletråd per booking, og fullt revisjons­spor. Slik fungerer saks­behandlings­flyten i praksis."\ndate: 2026-05-27\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["saksbehandler", "godkjenning", "avvise booking", "kommunikasjon", "innboks", "kommunal booking"]\n---\n\nFor en saksbehandler er hverdagen ofte ikke selve bookingene, men e-postene rundt dem. «Er hallen ledig torsdag?» «Vi trenger to ekstra timer.» «Kan vi flytte til mandag?» Hver tråd starter et nytt sted. Det finnes ingen samlet logg. Og halv­parten av forespørslene burde aldri ha krevd manuell behandling.\n\nDigilist starter fra motsatt ende: alt som kan automatiseres, gjør plattformen. Det som krever vurdering, lander i én innboks med konteksten allerede vedlagt.\n\n## Innboksen: én oversikt, prioriterte forespørsler\n\nSaks­behandleren har én side: «Forespørsler». Den viser:\n\n- Bookinger som venter på godkjenning (sortert eldst først, eller etter risiko)\n- Endrings­forespørsler på allerede god­kjente bookinger\n- Avlysninger fra leietaker (krever refusjons­vurdering)\n- Sesongleie-søknader (separat fane med større kontekst)\n\nHver rad viser kunden, lokalet, datoen, type forespørsel, og hvor lenge den har ventet. Klikk åpner detalj­vinduet med full kontekst: kundens historie, betalings­status, eventuell samtale­tråd, og kalender­innsikt («tre andre bookinger samme dag»).\n\n## Tre handlinger: godkjenn, avvis, spør\n\n**Godkjenn.** Ett klikk. Plattformen sender bekreftelse til leietaker, blokkerer tiden i kalenderen, varsler driftsroller (vaktmester, renhold, vekter), og oppretter fakturagrunnlag hvis betaling kreves. Du kan legge til en kort melding til kunden hvis du vil. Ellers brukes standard­bekreftelsen.\n\n**Avvis.** Velg en grunn fra listen (kollisjon, manglende dokumentasjon, utenfor åpningstid, annen årsak). Skriv inn forklaring. Plattformen sender en høflig avslags-e-post med din begrunnelse og, ikke minst, en lenke til alternative ledige tider hvis kunden vil prøve igjen.\n\n**Spør.** Trenger du mer informasjon? Send en melding direkte til kunden via book­ingens samtaletråd. Kunden får varsel på e-post og SMS, svarer fra sin Min Side, og hele samtalen ligger lagret på forespørselen. Ingen e-post­kjede å holde styr på.\n\n## Regelbasert auto-godkjenning\n\nMye av godkjennings­arbeidet er repetitivt. Et bryllup i et selskaps­lokale, fra en familie som har booket før, med fullført betaling, på en ledig dato, det burde aldri lande i en innboks.\n\nI Digilist setter du opp regler per utleieobjekt:\n\n- **Privat­person + betaling fullført + ingen kollisjon** → auto-godkjenn\n- **Organisasjon med BRREG-verifikasjon + medlems­tall over X** → auto-godkjenn\n- **Sport­slag som har sesongleie­avtale** → auto-godkjenn for tider innenfor avtalen\n- **Alt annet** → manuell godkjenning\n\nVi har sett kommuner gå fra 90% manuell behandling til 20% etter to ukers regel­tilpasning. De resterende 20% er de som faktisk trenger vurdering.\n\n## Kommunikasjon: samtaletråd per booking\n\nHver booking har sin egen samtaletråd som inkluderer:\n\n- Innledende forespørsel og dine spørsmål\n- Status­endringer (godkjent, avvist, endret)\n- Endringer på pris eller dato\n- Meldinger frem og tilbake mellom deg og kunden\n\nKunden ser den samme tråden i sin Min Side. Det er ingen «innboks» i klassisk forstand. Kommunikasjonen lever der bookingen er. Når bookingen avsluttes, arkiveres tråden sammen med den.\n\n## Sesongleie: egen fane, større beslutninger\n\nSesong­leie er en annen disiplin enn vanlig book­ing. Du behandler ikke én forespørsel, du fordeler tider mellom mange søkere etter regler kommunen har bestemt. Digilist har en egen sesongleie-modul med:\n\n- Søknads­frist­håndtering\n- BRREG-verifisering av lag og foreninger\n- Regel­basert fordeling (prioritet, alder, type aktivitet)\n- Konflikt­varsling når to lag søker samme tid\n- Endelig publisering av fordeling, eksport til kalender\n\nDetaljene er for store til denne artikkelen. [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger) går grundigere inn på det.\n\n## Revisjon: alt loggføres\n\nHver handling (godkjenning, avvisning, melding, endring) loggføres med tidsstempel, saks­behandler, og endring. Logg­føringen er uredigerbar og dekker SSA-L-kravene om sporbarhet. Hvis kommunen blir spurt om hvordan en booking ble behandlet et halvt år senere, er svaret tilgjengelig på fem sekunder.\n\n## Hva det betyr i praksis\n\nFor Nordre Follo kommune, som behandler ca. 1 200 book­inger i måneden på tvers av 12 anlegg, har overgangen til Digilist redusert manuell saks­behandling med 60% og responstid på forespørsler fra dager til timer. Det er ikke fordi vi har gjort book­inger mindre kompliserte. Det er fordi vi har plassert kompliserten der den faktisk er.\n\n';
const __vite_glob_0_55 = '---\nslug: sanntidskalender-kommunal-booking\ntitle: "Sanntidskalender: hvorfor «oppdateres hver natt» ikke holder mål"\ndescription: "Innbyggere som ser feil opptatt-tider og dobbeltbookinger er symptomer på én rot. Hvorfor reaktiv sanntid er en forutsetning, ikke luksus."\ndate: 2026-05-18\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sanntid"\ncover: "/images/blog/sanntidskalender_hero_no.webp"\nkeywords: ["sanntidskalender", "reaktiv runtime", "Convex", "dobbeltbooking", "kommunal booking"]\n---\n\nFor en kommune som leier ut lokaler er kalenderen ikke et grensesnitt. Den er kontrakten. Når en innbygger ser at en idrettshall er ledig torsdag klokken 18, og deretter blir avvist av saksbehandleren fordi noen andre booket samme tid for ti minutter siden, er det tilliten til hele tjenesten som forsvinner. Det er nettopp denne tillitsbristen sanntidskalenderen er bygget for å forhindre.\n\n## Polling er ikke sanntid\n\nDet vanligste tegnet på et bookingsystem fra forrige tiår er en setning som lyder: «kalenderen oppdateres hver natt». Det betyr at brukerens kalender og databasens kalender går ut av sync så snart noen booker, og at synkroniseringen først hentes inn neste morgen. Mellom 18:00 og 06:00 viser systemet en versjon av virkeligheten som ikke lenger eksisterer.\n\nPolling (at klienten spør serveren hver 30. sekund) er bedre, men ikke godt nok. Det skaper to nye problemer: ekstra serverbelastning (1 200 innbyggere som åpner kalenderen samtidig = 2 400 spørringer i minuttet), og en latens som i praksis er den korteste forskjellen mellom «ledig» og «opptatt»: den 29. sekunden brukeren venter.\n\n## Hva «reaktiv» betyr i praksis\n\nDigilist er bygget på [Convex](https://www.convex.dev/): en reaktiv runtime der hver spørring _abonnerer_ på dataen den hentet. Når en booking opprettes, varsles alle åpne kalendere automatisk og oppdateres umiddelbart hos hver bruker. Det er fundamentalt forskjellig fra polling: serveren _dytter_ endringen, klienten trenger ikke å spørre.\n\nKonsekvensene:\n\n- **Ingen dobbeltbookinger.** Når to brukere prøver å booke samme slot innenfor samme sekund, mister én av dem løpet, og den andre ser slot-en bli rød med en gang.\n- **Saksbehandlere ser endringer umiddelbart.** Kulturkonsulenten som behandler søknader om sesongleie ser at en søker har trukket søknaden uten å måtte trykke refresh.\n- **Driftsroller varsles automatisk.** Når en booking bekreftes, sendes pushvarsel til vaktmesteren, i samme reaktive flyt, ikke gjennom en cron som kjører hvert femte minutt.\n\n## En liten teknisk detalj med stor konsekvens\n\nReaktiv runtime betyr at hver mutasjon er transaksjonell på databasenivå _og_ utløser eventer som distribueres til abonnenter atomisk. Det vil si: enten lagres bookingen _og_ varslene sendes, eller ingen av delene skjer. Du får aldri en situasjon der bookingen er lagret men vaktmesteren ikke ble varslet: den klassiske «event missed»-feilen som koster kommunen tre telefoner på en lørdag.\n\nFor revisjonsformål er dette også en gevinst: hver hendelse i Digilist har samme tidsstempel som mutasjonen som utløste den. Det gjør at en kommunal IT-revisjon kan rekonstruere _hva som ble booket, av hvem, og hva som ble varslet til hvem_ med millisekundpresisjon.\n\n## Hvordan det føles for innbyggeren\n\nEn innbygger som åpner Digilist torsdag kveld for å booke en kantine til lørdag ser kalenderen som den faktisk er, inkludert at noen andre nettopp har booket en kolliderende tid og at hennes valg ble grå mens hun skrev inn navnet. Hun trenger ikke å skylde på «trege kommunale systemer» eller spørre om saksbehandleren kan sjekke manuelt. Hun ser virkeligheten, og virkeligheten avgjør hvilket valg som er mulig.\n\nDet er ikke en feature å skryte av. Det er hvordan kalendere _bør_ fungere, og det er den standarden norske kommuner fortjener.\n\n';
const __vite_glob_0_56 = '---\nslug: sesongleie-fordeling-lag-foreninger\ntitle: "Sesongleie: Slik fordeler du kommunale lokaler rettferdig"\ndescription: "Sesongleie er kommunens største bookingoppgave og kilden til flest klager. Slik håndterer Digilist regelstyrt fordeling og saksbehandling."\ndate: 2026-05-12\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sesongleie"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["sesongleie", "lag og foreninger", "fordeling", "kommunal booking", "idrettshall"]\n---\n\nHvert år, før hver sesong, gjentar samme scenario seg i hundrevis av norske kommuner: en kulturkonsulent eller idrettskonsulent setter seg ned med regneark, søknadsbunker og en kalender, og prøver å fordele hallflater, gymsaler og fotballbaner rettferdig mellom 50–500 lag og foreninger. Resultatet, uansett hvor mye tid som brukes, er ofte klager, omkamper og «hvorfor fikk de bedre tid enn oss».\n\nSesongleie er kommunens største og mest tidkrevende bookingoppgave. Det er også den hvor digital støtte gir størst gevinst.\n\n## Hva gjør sesongleie så vanskelig?\n\nTre ting:\n\n1. **Mange søkere, knapp kapasitet.** En typisk kommunal idrettshall har 25–30 tilgjengelige timer per uke i ettermiddagsbruk. Kommunen kan ha 40+ lag som vil ha tid der.\n2. **Prioriteringsregler varierer.** Barn først, lokale foreninger først, etablerte klubber først, betalende organisasjoner sist, eller en blanding. Reglene endrer seg fra kommune til kommune og av og til år til år.\n3. **Forventninger om åpenhet.** Lag og foreninger forventer å forstå _hvorfor_ de fikk eller ikke fikk en tid. Manuell tildeling gir sjelden tilfredsstillende svar.\n\n## Regelstyrt fordeling: ikke automatisering, men assistanse\n\nDigilists tilnærming er ikke å automatisere bort saksbehandleren, men å gi henne et verktøy som tar 80 % av jobben på under et minutt, og lar henne fokusere på de 20 % som krever skjønn.\n\nSlik fungerer det:\n\n### 1. Søknadsportal med BRREG-verifisering\n\nLag og foreninger søker via en egen portal. Organisasjonen verifiseres mot Brønnøysundregisteret automatisk. Kommunen vet at det er en reell juridisk enhet. Antall medlemmer, aldersfordeling og aktivitetstype legges inn i søknaden.\n\n### 2. Regler kodet av kommunen\n\nSaksbehandleren konfigurerer kommunens prioriteringsregler én gang:\n\n- Barn (under 19 år) prioriteres over voksne\n- Lokale lag (registrert i kommunen) prioriteres\n- Lag med fast leie i forrige sesong får forrang\n- Større lag prioriteres på primetime, mindre lag på off-peak\n- Kommunale aktiviteter (kulturskole, idrettsråd) får forhåndsreservert tid\n\nReglene kan vektes og justeres per anlegg.\n\n### 3. Regelstyrt fordelingsforslag\n\nNår søknadsfristen passerer, genererer Digilist et fordelingsforslag basert på reglene. Forslaget viser hvilket lag som får hvilken tid, og _hvorfor_: hvilken regel som var avgjørende. Saksbehandleren ser hele bildet på én skjerm.\n\n### 4. Saksbehandler justerer\n\nForslaget er aldri ferdig. Saksbehandleren kan:\n\n- Bytte tider mellom to lag\n- Reservere ekstra kapasitet for kulturarrangementer\n- Markere unntak (f.eks. et lokalt lag som har vokst hurtig og fortjener mer tid)\n- Avslå søknader med begrunnelse\n\nHver endring loggføres i revisjonsloggen. Kommunens etterprøvbarhet er ivaretatt.\n\n### 5. Godkjenning og varsling\n\nNår fordelingen er godkjent, sendes automatisk varsel til alle søkere, både de som fikk tid og de som ble avslått. Begrunnelsen inkluderes. Lagene får direkte tilgang til kalenderen sin for sesongen.\n\n## Rapportering\n\nEtter at sesongen er i gang, gir Digilist:\n\n- **Kapasitetsutnyttelse per anlegg:** hvor godt utnyttes hver hall?\n- **No-show-rapport:** hvilke lag møter ikke til reservert tid?\n- **Tilskuddsrapportering:** automatisk grunnlag for kommunens tilskuddsregnskap\n- **Trendanalyse:** hvilke aldersgrupper og aktivitetstyper vokser?\n\n## Nordre Follo kommune: et eksempel\n\nNordre Follo kommune håndterer sesongleie for tolv anlegg og ca. 340 lag og foreninger via Digilist. Saksbehandlerens jobb er endret fra «to ukers tildelingsarbeid med åtte revisjoner» til «justering og godkjenning på en arbeidsdag».\n\n## Hva med klager?\n\nNår begrunnelsene er åpne og reglene synlige, går klagevolumet typisk ned med 60–80 %. De klagene som kommer, dreier seg om reglene selv, som er en politisk diskusjon, ikke en saksbehandlingsfeil.\n\nDet er den riktige diskusjonen å ha.\n\n---\n\nVil dere se hvordan sesongleie ser ut i praksis? [Be om en demo](/#kontakt).\n';
const __vite_glob_0_57 = '---\nslug: sesongtildeling-idrettshall-saksbehandler-guide\ntitle: "Sesongtildeling av idrettshall: saksbehandlerens komplette guide"\ndescription: "Slik tildeler du treningstid i kommunens idrettshaller: søknadsfrister, prioritering, konflikthåndtering, drop-in og rapportering til idrettsrådet."\ndate: 2026-07-14\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["sesongtildeling idrettshall", "tildeling treningstid", "idrettshall ledige tider", "søknad treningstid sesong", "klage tildelt treningstid", "drop-in idrettshall"]\n---\n\nIdrettshaller bookes ikke som møterom. Mesteparten av kapasiteten låses i en årlig sesongtildeling til faste lag lenge før noe dukker opp som «ledig time». For saksbehandleren betyr det at jobben starter med fordeling mellom mange søkere, ikke med å ta imot enkeltbookinger.\n\n## Hva er sesongtildeling, og hvorfor skiller den seg fra vanlig lokalebooking\n\nSesongtildeling er den samlede fordelingen av all treningstid i en eller flere haller for en hel sesong, typisk august til juni. I stedet for at tider bookes fortløpende, samler kommunen inn alle søknadene, veier dem mot hverandre og legger en helhetlig plan. En hall med 6 flater og åpent 16:00 til 22:00 på hverdager rommer rundt 180 treningstimer i uka, og de skal fordeles på håndball, innebandy, turn og andre før publikum ser en eneste ledig time. Først når planen er lagt, frigis restkapasiteten til drop-in.\n\n## Søknadsfrister og prioriteringsregler\n\nNesten alle kommuner har én fast frist, ofte 1. april eller 1. mai, for sesongen som starter til høsten. Søknader etter fristen behandles som restkapasitet. Prioriteringen følger som regel en vedtatt rekkefølge:\n\n- Barn og unge før voksne\n- Konkurranseparti før mosjonsparti\n- Lag med tilhørighet i kommunen før eksterne\n- Handikapidrett og skoleformål der reglementet krever det\n\nNår to lag søker samme time på samme flate, avgjør disse reglene, ikke søknadstidspunktet. Et digitalt tildelingssystem viser konkurrerende søknader på hver time side om side, slik at saksbehandleren ser konflikten med én gang og kan begrunne vedtaket etter reglementet.\n\n## Slik ser du alle ledige og opptatte tider i sanntid\n\nDen vanligste tidstyven er at oversikten ligger spredt i regneark per hall. Med en samlet sanntidskalender ser du hele hallporteføljen i ett bilde: hvilke flater som er tatt, hvilke som er ledige, og hvor det er hull på ettermiddagen. Book en time i Furuset hall, og den forsvinner umiddelbart fra alle andre skjermer. Det gjør at en kommune med 12 haller kan holde oversikt uten å ringe rundt for å sjekke om en time faktisk er ledig. Filtrer på hall, ukedag eller aldersgruppe, og du finner ledige flater for et nytt lag på sekunder i stedet for å bla gjennom flere dokumenter. Samme bilde brukes både i selve tildelingen og resten av sesongen, så saksbehandler og idrettslag ser samme sannhet til enhver tid.\n\n## Balansen mellom faste treningstider og drop-in\n\nFaste tider gir lagene forutsigbarhet, men holder du alt fast, står haller tomme når parti melder avbud. Løsningen er å definere hvilke tider som er sesongtildelt og hvilke som frigis til enkeltinnbyggere. Digilist lar deg åpne restkapasitet og avlyste tider automatisk for drop-in, slik at en forelder kan leie en time håndballflate lørdag formiddag uten at det rører laget som trener der på tirsdager. En hall med 80 prosent fast belegg kan dermed fylle de siste 20 prosentene i stedet for å la dem stå ubrukt.\n\n## Håndtering av konflikter, dobbeltbooking og klager\n\nDobbeltbooking oppstår når to kilder redigerer samme oversikt. Én sanntidskalender fjerner problemet ved kilden, fordi en opptatt time ikke kan tildeles på nytt. For klager på tildelt treningstid trenger du et etterprøvbart spor: hvem søkte hva, hvilken regel ble brukt, og når ble vedtaket fattet. Når et lag klager på at de mistet tirsdagstimen, henter du hele historikken på sekunder i stedet for å lete i e-post. Det korter ned klagebehandlingen og gir idrettsrådet et vedtak som holder.\n\n## Kommunikasjon med idrettslagene\n\nEndringer skjer hele sesongen: en flate stenges for vedlikehold, et parti flyttes, en time blir ledig. I stedet for å sende e-post manuelt til hver kontaktperson, går varsler ut automatisk til lagene som er berørt. Melder et lag avbud på fredagstimen, kan resten av klubbene få beskjed om at tiden er ledig samme kveld. Det reduserer telefoner til saksbehandleren og gjør at ledig kapasitet faktisk blir brukt.\n\n## Rapportering og dokumentasjon til idrettsråd og politisk behandling\n\nIdrettsrådet og politikerne vil vite hvordan tiden er fordelt: andel til barn og unge, belegg per hall, fordeling mellom klubbene og hvor mange søknader som ikke fikk innvilget ønsket tid. Når alt ligger i ett system, hentes disse tallene ut som ferdige rapporter i stedet for at noen teller manuelt i et regneark. En rapport som viser at 62 prosent av timene gikk til barn og unge, er hentet direkte fra vedtakene og ikke fra en manuell opptelling som kan bestrides. Det gir en fordeling som tåler innsyn, og et faktagrunnlag for neste års prioriteringer.\n\n## Fra Excel-ark og papirsøknad til digital tildeling\n\nMange kommuner kjører fortsatt papirsøknad inn og regneark ut. Det fungerer til hallen får flere søkere enn timer. En digital tildelingsprosess samler søknad, prioritering, kalender, varsling og rapport på ett sted. Bærum og Lillestrøm er blant kommunene som har flyttet lokale- og hallbooking over på digitale løsninger for å kutte manuell saksbehandling. Gevinsten er ikke bare tid spart, men vedtak som er sporbare og lette å begrunne.\n\n## Vanlige spørsmål om idrettshall-tildeling\n\n**Når er søknadsfristen for treningstid?** Vanligvis 1. april eller 1. mai for sesongen som starter til høsten. Sjekk kommunens eget reglement.\n\n**Hva skjer med søknader som kommer inn etter fristen?** De behandles som restkapasitet og fordeles på tider som står ledige etter at sesongtildelingen er lagt. De går ikke foran de ordinære søknadene.\n\n**Hvem får treningstid først når flere lag søker samme time?** Prioriteringsreglementet avgjør, som regel barn og unge og konkurranseparti før voksne og eksterne, ikke rekkefølgen på søknadene.\n\n**Kan innbyggere booke idrettshall drop-in?** Ja, restkapasitet og avlyste tider frigis til enkeltbooking uten at det rører de faste tildelte tidene.\n\n**Hvordan klager man på tildelt treningstid?** Klagen behandles mot det dokumenterte vedtaket, der søknad, regel og begrunnelse ligger lagret.\n\n## Vil du se hvordan tildelingen ser ut i praksis?\n\nDigilist samler sesongtildeling, sanntidskalender, drop-in og rapportering i én flate bygget for norske kommuner. [Book en demo](/demo) og se hvordan saksbehandlingen går fra regneark til noen få klikk.';
const __vite_glob_0_58 = '---\nslug: somlos-betaling-vipps-ehf\ntitle: "Sømløs betaling med Vipps, kort og EHF: sammenheng slår valg"\ndescription: "En kommune med fire betalingsmåter, men uten avstemming, har bare fire kanaler å feilsøke. Slik kobler Digilist betaling sammen ende til ende."\ndate: 2026-05-19\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Betaling"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["Vipps", "Stripe Connect", "EHF", "Peppol", "kommunal fakturering", "regnskap"]\n---\n\nDet er enkelt å implementere Vipps. Det er enkelt å implementere kortbetaling. Det er enkelt å implementere EHF. Det vanskelige, og det som skiller en moderne kommunal bookingplattform fra en samling betalingsskjemaer, er å gjøre dem til _én sammenhengende strøm_ fra forespørsel til kommunens regnskap. Det er der Digilist har lagt arbeidet.\n\n## Betalingsmetodene innbyggere faktisk bruker\n\nNorske innbyggere booker kommunale tjenester med tre dominerende betalingsformer, og forventer at alle tre er tilgjengelige uten å snakke med et servicetorg:\n\n1. **Vipps:** det selvsagte førstevalget for privatbookinger under 5 000 kr. Lav friksjon, høy konvertering. Digilist tilbyr både Vipps Hurtigkasse (mobil) og Vipps på Nett (desktop).\n2. **Kortbetaling via Stripe Connect:** for større beløp, kommersielle bookinger, eller når innbyggeren ikke har Vipps. Tre stegs verifisering for kommunale betalinger.\n3. **EHF / Peppol-faktura:** for organisasjoner, lag og foreninger. Faktura sendes direkte til regnskapssystemet deres via Peppol-nettverket. Ingen PDF, ingen manuell registrering.\n\nI tillegg kommer **depositum** (forhåndsbetaling som låses og frigis ved arrangementets slutt), og **delbetaling** (depositum + restbeløp ved bekreftelse). Det handler ikke om _en_ betaling, men om _kontraktsformen_ kommunen ønsker.\n\n## Det vanskelige: avstemming\n\nEn enkeltbooking er trivielt: innbygger trykker «Bekreft», Vipps sender 800 kr, kommunen mottar pengene. Problemet starter på dag 30, når kommunens regnskapsfører skal avstemme bankkontoen mot bookingbasen mot kassekladden mot fakturasystemet. Hver kanal har:\n\n- Egne transaksjons-ID-er\n- Egne avregningstidspunkter (Vipps neste virkedag, Stripe T+2, EHF betinget av kundens betalingsfrist)\n- Egne gebyrer som må trekkes fra brutto\n\nUten automatisk avstemming kjøres dette manuelt med Excel og fire datakilder. Det er der dobbeltarbeid og menneskelige feil oppstår, ikke ved kassen.\n\n## Hvordan Digilist løser det\n\nHver betaling registreres som en linje i en intern **ledger** med følgende felter: booking-ID, betalingskanal, brutto, gebyr, netto, avregningsdato, status (pending / settled / refunded), og, kritisk, _hvor mye som skal til hvilken konto_. Når en kommune har splittet leieinntekt mellom kulturetaten og driftsetaten, splittes betalingen automatisk.\n\nHver natt sammenligner avstemmingsjobben:\n\n1. Ledger-poster med status `settled`\n2. Bankposteringer fra kommunens kontoutskrift (åpnet via [Tripletex](https://www.tripletex.no/), [Visma](https://www.visma.no/eaccounting/), [PowerOffice](https://www.poweroffice.com/), [Fiken](https://fiken.no/) eller [DNB Regnskap](https://www.dnb.no/bedrift/regnskap-og-okonomi.html))\n3. Forventet sum per kanal\n\nAvvik flagges med presis kilde, «Vipps 14.03.2026 manglet 12,50 kr i gebyrtrekk», slik at regnskapsføreren ikke trenger å lete, bare bekrefte.\n\n## EHF som forsiktig undervurdert vinner\n\nEHF (Elektronisk Handelsformat) er Norges versjon av Peppol: det europeiske nettverket for offentlig fakturering. For en bookingplattform betyr det at en faktura til en idrettsklubb _aldri_ trenger å bli en PDF i en e-post som klubbens kasserer må videresende til regnskapsbyrået. Den lander direkte i klubbens regnskapssystem.\n\nFor kommunen betyr det:\n\n- **Lavere fakturafeil.** Standardisert XML, ikke fritekst-PDF.\n- **Raskere betaling.** Klubbenes systemer kan auto-bokføre.\n- **Revisjonssikker leveranse.** Bekreftelse på at fakturaen ble levert, datert og signert.\n\nNorske kommuner er etter offentleglova og bokføringsloven forpliktet til å kunne sende _og_ motta EHF. Det er enkelt å tro at man oppfyller dette ved å «kunne eksportere en PDF», men det er ikke det loven sier.\n\n## Sømløsheten er ikke ett produkt, men en standard\n\nDet er fristende å markedsføre «vi støtter Vipps, kort og EHF» som tre adskilte features. Det er feil måte å snakke om det. Den sømløse betalingen er at:\n\n- Innbyggeren ikke trenger å vite hvilken kanal hun bruker.\n- Saksbehandleren ikke trenger å sjekke om betalingen kom inn.\n- Regnskapsføreren ikke trenger å avstemme manuelt.\n- Revisor kan rekonstruere hvilken booking som ble betalt av hvem og når på under et minutt.\n\nDet er fire ulike personer som aldri trenger å snakke med hverandre om en enkelt booking. _Det_ er sømløs betaling.\n\n';
const __vite_glob_0_59 = `---
slug: ssa-l-2026-bookingsystem-kommune
title: "Hva kreves av et kommunalt bookingsystem i 2026?"
description: "SSA-L 2026 setter nye krav til kommunale bookingsystemer. Vi går gjennom sanntid, sesongleie, ID-porten, EHF og hva som skal til for å oppfylle kravspesifikasjonen."
date: 2026-05-14
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 8
tag: "Anskaffelse"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["SSA-L 2026", "kommunalt bookingsystem", "anskaffelse", "kravspesifikasjon", "Digdir"]
---

Norske kommuner som anskaffer bookingsystem i 2026 møter et tydeligere kravbilde enn noen gang. SSA-L 2026 (Statens Standardavtale for løsninger) kombinert med digitaliseringsdirektoratets (Digdir) føringer for offentlige tjenester, definerer en høy bunnplanke: sanntidstilgjengelighet, ID-porten-autentisering, EHF-fakturering, universell utforming og ISO 27001-sertifisering er ikke lenger «nice to have», men forutsetninger for å delta i konkurransen.

## Sanntidstilgjengelighet: fundament, ikke funksjon

Sanntid er det første kravet enhver kommunal innbygger merker. Når en innbygger søker etter ledig treningstid i en idrettshall, må kalenderen vise det som er ledig _nå_, ikke en versjon fra siste nattlige synkronisering. Tre underkrav følger:

1. **Reaktive oppdateringer.** Når en booking bekreftes eller avlyses, oppdateres kalenderen umiddelbart for alle andre brukere. Ingen polling, ingen refresh-knapper.
2. **Konfliktdeteksjon.** Plattformen må forhindre dobbeltbookinger på samme tidsrom, også når to brukere booker samtidig.
3. **Reservasjon under booking.** Tid skal låses mens brukeren fyller ut betalingsskjema (typisk 5–10 minutter) for å unngå at vinduet forsvinner mens kortet legges inn.

For Digilist løses dette med Convex' reaktive runtime: spørringer abonnerer på underliggende data og publiserer endringer på millisekunder.

## Sesongleie med regelstyrt fordeling

Idrettslag, kulturskoler og foreninger leier kommunale lokaler i sesonger, typisk høst (sept–des) og vår (jan–juni). Manuell tildeling er tidkrevende og opplever ofte klager om favorisering.

SSA-L 2026 krever derfor:

- Egen søknadsportal for lag og foreninger (BRREG-verifisert)
- Regelstyrt fordelingsforslag basert på kommunens prioriteringsregler
- Saksbehandlerverktøy for justering før godkjenning
- Rapportering på kapasitetsutnyttelse, tilskudd og fordeling

Digilists sesongleie-modul implementerer alle disse kravene, og lar saksbehandleren overprøve forslaget der lokale forhold krever det.

## ID-porten + BankID: Norge-tilpasset autentisering

Innbyggere skal logge inn via ID-porten med BankID, MinID eller andre godkjente metoder. Organisasjoner skal verifiseres mot Brønnøysundregisteret (BRREG). Dette er ikke valgfritt, men en del av SSA-Ls krav om sikker autentisering og datakvalitet.

For utenlandske SaaS-leverandører er dette en betydelig integrasjonskostnad. For Digilist, bygget på norsk grunn, er det første integrasjon vi etablerte.

## EHF-fakturering og regnskapsintegrasjon

Faktura til kommunale enheter må sendes via EHF (Elektronisk Handelsformat) over Peppol-nettverket. Digilist genererer EHF-faktura automatisk ved bookingfullføring og kan integreres direkte mot kommunens regnskapssystem: Visma eAccounting, Tripletex, Fiken, PowerOffice eller DNB Regnskap.

## Universell utforming, ISO og GDPR

- **WCAG 2.0 AA** er minimumskravet. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy.
- **ISO 27001 og 27701** er forventet sertifisering. Digilist er sertifisert.
- **GDPR** krever databehandleravtale, dataregister og rett til sletting. Digilist har dette på plass og lagrer all data i Norge og EU.

## Migrasjon: det glemte kravet

Mange kommuner har eksisterende bookingsystemer (RCO, Aktimo, Idrettens Bookingsystem osv.) med historiske bookinger og sesongleieavtaler. SSA-L 2026 krever at den nye leverandøren støtter migrasjon, ikke bare frisk start.

Digilist tilbyr import fra RCO booking og andre systemer i etableringsfasen, med valideringsregler for foreningsregister og bookinghistorikk.

## Hva kommunen bør gjøre nå

1. **Kartlegg eksisterende anlegg og brukergrupper:** antall, type, kapasitet, sesongmønster
2. **Definer prioriteringsregler for sesongleie:** alder, lokal tilknytning, foreningstype
3. **Be om demo med fokus på SSA-L-kravene:** ikke generelle salgspresentasjoner
4. **Test sanntid live:** be leverandøren vise hvordan en booking forplanter seg gjennom systemet i sanntid

For en kompakt sjekkliste mot SSA-L 2026-kravene, se vår [landingsside for kommuner](/bookingsystem-kommune).
`;
const __vite_glob_0_60 = '---\nslug: tilgjengelighetskalender-innbygger\ntitle: "Tilgjengelighet på første blikk: innbyggerens kalender"\ndescription: "En kalender som krever forklaring har feilet. Slik viser Digilist ledig, opptatt og blokkert tid på en måte enhver innbygger forstår uten hjelp."\ndate: 2026-05-23\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "UX"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["tilgjengelighetskalender", "kommunal booking", "innbygger UX", "kalender design", "ledige tider"]\n---\n\nNår en innbygger åpner kommunens bookingside er det første hun ser et signal om hele tjenestens kvalitet. Hvis hun må klikke fem ganger for å finne ut at gymsalen er ledig torsdag klokken 18, eller verre, må gjette hva en gråskala-rute betyr, har tjenesten allerede tapt en mulig booking. Tilgjengelighetskalenderen er kommunens første tillitstest.\n\n## Tre tilstander, tre farger, ingen mer\n\nHver tidsblokk i Digilists kalender har én av tre tilstander:\n\n- **Ledig (grønn).** Kan bookes umiddelbart. Innbygger klikker, fyller ut skjemaet, betaler. Ferdig.\n- **Opptatt (grå).** Allerede booket. Vises ikke som «privat» eller med booker-navn, bare som ikke-tilgjengelig.\n- **Blokkert (oransje).** Anlegget er stengt for vedlikehold, høytid eller administrativ blokkering. Hover-tekst forklarer hvorfor.\n\nDet er bevisst at vi ikke har «søkt om», «under behandling» eller «foreløpig reservert» som synlige statuser for innbyggeren. Hun trenger å vite om hun kan _booke nå_, ikke om hvem som har søkt før henne. Den informasjonen tilhører saksbehandleren.\n\n## Hvorfor «opptatt» er nok informasjon\n\nI tjuetalls kommunale bookingsystemer har vi sett samme feil: at kalenderen viser «Opptatt av Korps Vest 16:00–18:00». Det er et personvernsbrudd som er enkelt å overse: booker-navnet er personopplysning hvis booker er privat, og selv organisasjonsnavn røper hvilke anlegg laget bruker når. For en innbygger som leter etter ledig tid har informasjonen heller ingen verdi. Hun trenger å vite om tiden er bookbar, ikke hvem som har den.\n\nDigilist viser kun «Opptatt», uten å avsløre _hvem_. Saksbehandleren ser navnet i sitt eget grensesnitt; innbyggeren ser bare den fargen som svarer på spørsmålet hennes.\n\n## Tidsperspektiv: innbyggeren velger dag, uke eller måned\n\nEn innbygger som booker en konferanseside trenger ofte _samme dag_. En som planlegger en bursdag trenger _lørdager_ tre måneder fremover. Bookingsystemer som tvinger én visning på alle er for stive. Digilist tilbyr fire perspektiver:\n\n1. **Dagsvisning.** Én dag, time for time. Standard for spontane bookinger.\n2. **Ukesvisning.** Syv dager i timer. Standard for arrangementer på dagen eller helg.\n3. **Månedsvisning.** Full måned med fargekodede dager (mye/middels/lite ledig). Standard for planlegging fremover.\n4. **Periodefilter.** «Vis kun lørdager i mars og april med minst 8 timer ledig». For brukere som vet hva de leter etter.\n\nVisningen huskes per bruker (lagres i `localStorage` på enheten, ikke i kontoen), så hun slipper å gjenta valget hver gang hun returnerer.\n\n## Søk som forstår intensjon\n\n«Søk» er ikke «autocomplete på lokalnavn». Innbyggerne søker med ord som matcher intensjonen, ikke kategorien:\n\n- «bursdagslokale for 30 personer» → matcher selskapslokaler, kantiner og storsaler med kapasitet ≥ 30\n- «musikkøving» → matcher gymsaler med scene, samfunnshus med musikkanlegg, og dedikerte øvingslokaler\n- «møterom torsdag morgen» → matcher møterom med ledig tid torsdag kl 08–12\n\nSøket bygger på listings-katalogens metadata (kapasitet, fasiliteter, taggene saksbehandleren har lagt på lokalet), kombinert med kalenderen i sanntid. Resultatene rangeres etter relevans og tilgjengelighet, ikke etter alfabet.\n\n## Sanntid, ikke daglig\n\nTilgjengelighetskalenderen abonnerer på databasen via [Convex\' reaktive runtime](/blogg/sanntidskalender-kommunal-booking). Når en kollega-innbygger bekrefter en booking, blir slot-en grå hos alle andre _samme sekund_. Det er forskjellen mellom å booke trygt og å booke fortvilet.\n\n## Hva tilgjengelighetskalenderen _ikke_ er\n\nDet er ikke et administrativt verktøy. Den er ikke en saksbehandlerkø. Den er ikke en finansiell rapport. Den er det første grensesnittet en kommunal innbygger møter, og dens jobb er å fortelle sannheten på under fem sekunder. Hvis den greier det, ringer hun ikke kommunens servicetorg. Hun booker. Hvis ikke, ringer hun, og kommunens digitale tjeneste har akkurat skapt det manuelle arbeidet den var ment å eliminere.\n\n';
const __vite_glob_0_61 = '---\nslug: universell-utforming-wcag-kommunal-booking\ntitle: "Universell utforming: WCAG 2.1 AA er minimumskravet"\ndescription: "Diskrimineringsloven § 17a gjør universell utforming pliktig for kommunale digitale tjenester. Slik bygger Digilist for revisjon og reell tilgjengelighet."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Universell utforming"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["universell utforming", "WCAG 2.1 AA", "tilgjengelighet", "Digdir", "Likestillings- og diskrimineringsloven"]\n---\n\nEt bookingsystem som ikke kan brukes av en blind innbygger med skjermleser, en bevegelseshemmet bruker som kun bruker tastatur, eller en eldre saksbehandler med redusert syn, er ikke et kommunalt bookingsystem. Det er en barriere mellom kommunen og innbyggerne den er satt til å tjene. Likestillings- og diskrimineringsloven § 17a sier det mer presist: digitale tjenester rettet mot allmennheten _skal_ være universelt utformet. Det er ikke en oppfordring. Det er en plikt.\n\n## Hva loven faktisk krever\n\nNorge stiller seg bak [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/) gjennom forskrift om universell utforming av IKT, forvaltet av [Tilsynet for universell utforming av ikt](https://www.uutilsynet.no/) under Digdir. For et kommunalt bookingsystem betyr det konkret:\n\n- **Visuell tilgjengelighet:** Kontrast på minst 4,5:1 for vanlig tekst, 3:1 for stor tekst og UI-komponenter. Ingen informasjon kommunisert kun med farge.\n- **Operasjonell tilgjengelighet:** Alt skal kunne betjenes med tastatur alene. Synlig fokusring på hver interaksjon. Forutsigbar rekkefølge.\n- **Forståelig:** Skjermleserkompatible labels, ARIA-merking der det trengs, klart språk. Feilmeldinger som forklarer _hva som gikk galt_ og _hva som skal gjøres_.\n- **Robust:** Strukturert HTML som assistive teknologier kan tolke uten å gjette. Ingen «klikkbare div-er».\n\nI tillegg krever forskriften en **publisert tilgjengelighetserklæring** for hver kommunal tjeneste, og krav om at brudd kan rapporteres direkte til Tilsynet.\n\n## Hvordan vi tester før hver utgivelse\n\nDet er én ting å si at man «oppfyller WCAG». Det er en annen ting å vite det. Digilists testpyramide for tilgjengelighet ser slik ut:\n\n### 1. Automatisert (axe-core), kjøres ved hver bygg\n\nHver gang en utvikler pusher kode, kjøres [axe-core](https://github.com/dequelabs/axe-core) mot alle hovedsidene. Det fanger rundt 50 % av WCAG-brudd: manglende `alt`, manglende `label`, kontrast under terskel, manglende `lang`, brutte ARIA-relasjoner. Builden feiler om axe-core finner _én_ alvorlig overtredelse på en kjernesti.\n\n### 2. Manuell tastaturnavigasjon, kjøres ukentlig\n\nEt team-medlem går gjennom hovedflyten (`Tab` fra start til slutt på booking-skjemaet, sesongleie-søknad, betaling, kanselleringsflyt) uten å røre musen. Alle interaksjoner skal være tilgjengelige, fokusrekkefølgen logisk, og fokusringen synlig.\n\n### 3. Skjermleser: NVDA på Windows, VoiceOver på Mac\n\nTo kjernescenarioer testes med skjermleser før hver større utgivelse: innbyggerbooking via ID-porten, og saksbehandlerens godkjenningsflyt. Tester kontrollerer at navn, formål og status på hver kontrolltype leses opp riktig. Modaler og varsler skal fange fokus og annonseres umiddelbart.\n\n### 4. Tredjepart: årlig audit\n\nÉn gang i året ber vi en uavhengig tilgjengelighetstester gå gjennom plattformen med utgangspunkt i [WCAG Evaluation Methodology (WCAG-EM)](https://www.w3.org/TR/WCAG-EM/). Funnene blir prioritert i sprintkalenderen og lukket før neste audit. Rapportene utleveres til kunder under NDA.\n\n## Hva kommunen får dokumentert\n\nEn kommune som anskaffer Digilist får, som del av leveransen:\n\n- **Tilgjengelighetserklæring** etter Digdirs mal, klar til publisering på kommunens nettsider.\n- **Sertifiseringsrapporter** fra axe-core (automatisert) og siste tredjepartsaudit.\n- **Beskrivelse av kjente begrensninger:** det finnes nesten alltid noe, og det er bedre at det er åpent dokumentert enn skjult.\n- **Tilsynsrespons-prosedyre:** hvordan kommunen håndterer en brukerklage som videresendes til Tilsynet.\n\n## Tre vanlige misforståelser\n\n**«Vi støtter mørk modus, så vi er tilgjengelige.»**\nMørk modus hjelper noen brukere med lyssensitivitet, men WCAG snakker om _kontrast_, ikke _tema_. En lysegrå tekst på hvit bakgrunn er like utilgjengelig som lysegrå tekst på svart.\n\n**«Skjermleseren leser det jo opp.»**\nSkjermleseren leser det den ser. Den ser strukturen i HTML-en, ikke det visuelle. En `<div>` som ser ut som en knapp, men ikke har `role="button"` eller `tabindex`, er usynlig for assistive teknologier.\n\n**«Vi har en alt-tekst på hvert bilde.»**\nBra start, men ikke alt. En alt-tekst på en _dekorativ_ illustrasjon (som denne artikkelens hero) skal være tom (`alt=""`) eller bildet skal være `aria-hidden`. Ellers leses dekorasjon høyt som «bilde av kontor» mens innholdet pauser.\n\n## Den mest underestimerte gevinsten\n\nTilgjengelighet er ikke bare en plikt. Det er ofte den raskeste veien til _bedre_ design. En knapp som er stor nok for en bruker med skjelvende hender, er også behagelig for en travel kommuneansatt med kaffekoppen i den ene hånden. En feilmelding som er presis nok for en skjermleser, er også presis nok for en innbygger som ikke har norsk som førstespråk. En tastaturnavigering som fungerer for en bruker med motoriske utfordringer, er også raskere for en saksbehandler som behandler 40 søknader i timen.\n\nUniversell utforming er ikke et tak. Det er gulvet, og det er gulvet enhver kommune fortjener.\n\n';
const __vite_glob_0_62 = '---\nslug: utleieobjekt-veiviser-steg-for-steg\ntitle: "Nytt utleieobjekt: Digilist-veiviseren steg for steg"\ndescription: "Seks steg, hjelpetekst i hvert felt, lagring underveis. Publisert på under tjue minutter, og du kan endre alt etter publisering."\ndate: 2026-05-26\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Utleier"\ncover: "/images/blog/wizard_utleieobjekt_hero.svg"\nkeywords: ["utleieobjekt", "veiviser", "wizard", "publisere lokale", "Digilist utleier", "booking onboarding"]\n---\n\nDet skal være enkelt å legge et lokale ut for utleie. Ikke en time med faner og lagrings­dialoger, men en stille veiviser som spør om de tingene som faktisk betyr noe, gir hjelpetekst der det trengs, og lagrer underveis så du kan komme tilbake. Slik er Digilists veiviser bygd.\n\nResultatet: et nytt selskaps­lokale, møterom eller idretts­hall publisert på under tjue minutter, og du eier alt: endrer pris, åpningstider eller bilder når du vil etterpå.\n\n## Hva veiviseren spør om: seks steg\n\n**Steg I: Type og navn.** Hva er det? Et selskaps­lokale, møterom, hall, kantine, kontor, scene. Velg fra listen, gi det et navn slik leietakere vil søke etter det. Adresse fylles automatisk fra postnummer.\n\n**Steg II: Beskrivelse og bilder.** Korte avsnitt om hva lokalet egner seg til. Last opp bilder: tre minimum, helst seks til ti. Digilist gjør smart komprimering, men beholder skarpheten på storbilde­visningen.\n\n**Steg III: Kapasitet og fasiliteter.** Antall personer (sittende / stående), kvadrat­meter, og avhuking av fasiliteter (wifi, kjøkken, prosjektor, lyd­anlegg, parkering, garderober). Det innbyggeren ser når de søker filtrert.\n\n**Steg IV: Pris og tilgjengelighet.** Time­pris, dag­pris eller pakke. Åpnings­tider per ukedag. Min/maks book­bare timer. Forhånds­varsel: hvor lenge før kan man booke? Digilist har fornuftige standard­verdier; du justerer der det avviker.\n\n**Steg V: Bookingregler.** Krever bookingen godkjenning fra en saks­behandler, eller går den rett gjennom hvis kalenderen er ledig og betalingen er gjennom­ført? Hvilke kunde­typer kan booke (privat­personer, organisasjoner, kun BRREG-verifiserte lag)? Hvilken kanselleringspolicy?\n\n**Steg VI: Publiser.** Forhånds­visning av hele oppslaget slik innbyggeren vil se det. Knappen «Publiser» tar deg live. Knappen «Lagre som utkast» beholder alt usynlig, fortsett senere.\n\n## Det vi har bygd inn for at det skal være enkelt\n\n**Hjelpetekst i hvert felt.** Ingen ekstern dokumentasjon å lese. Hver labelinngang har en kort forklaring under, og noen har eksempler.\n\n**Validering der det betyr noe.** Du kan ikke publisere et lokale uten navn, beskrivelse, minst ett bilde, og en pris. Du kan publisere uten en lang feature­liste, fyll den ut senere.\n\n**Auto-lagring.** Hvert klikk på «Neste» lagrer det du har skrevet. Nettleseren krasjer? Logg inn igjen, fortsett der du slapp.\n\n**Maler.** Har du flere lignende lokaler? Bruk et eksisterende som mal. Veiviseren forhånds­utfyller alt unntatt navn og bilder.\n\n## Etter publisering: alt er redigerbart\n\nIngenting er låst. Endre pris, åpnings­tider, beskrivelse, bilder eller bookingregler når som helst. Digilist viser de nye reglene fra det tidspunktet de er lagret. Eksisterende bookinger fra før endringen påvirkes ikke.\n\nFor utleiere med mange enheter kan du administrere flere lokaler fra ett dashbord, kopiere prisstrukturer mellom dem, og se hvordan hvert lokale presterer separat.\n\n## Hva neste steg pleier å være\n\nDe fleste utleiere bruker første dagen til å publisere ett eller to lokaler, ser hvordan de ser ut for innbyggeren, og justerer formuleringer eller bilder. Andre dagen legges resten ut. Tredje dagen kommer den første reelle bookingen.\n\nDet er den hastigheten plattformen er bygd for: fra signering til levende oppføring i løpet av en arbeidsdag, uten konsulent.\n\n';
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner ? inner.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean) : [];
      continue;
    }
    if (/^-?\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
      continue;
    }
    if (/^-?\d+\.\d+$/.test(value)) {
      data[key] = parseFloat(value);
      continue;
    }
    data[key] = value;
  }
  return { data, content: match[2] };
}
const modules = /* @__PURE__ */ Object.assign({
  "/src/content/blog/avbooking-refusjon-og-saksbehandling.md": __vite_glob_0_0,
  "/src/content/blog/booking-av-idrettshaller-og-anlegg.md": __vite_glob_0_1,
  "/src/content/blog/booking-paa-90-sekunder-innbygger.md": __vite_glob_0_2,
  "/src/content/blog/booking-system-og-teknisk-integrasjon-for-kommune.md": __vite_glob_0_3,
  "/src/content/blog/bookingkalender-for-innbygger-og-saksbehandler.md": __vite_glob_0_4,
  "/src/content/blog/bookingsoftware-kommune-sammenligning-pris.md": __vite_glob_0_5,
  "/src/content/blog/bookingsystem-kommunale-lokaler-guide-it-leder.md": __vite_glob_0_6,
  "/src/content/blog/bookingsystem-kommune-sammenligning-matrise-tco.md": __vite_glob_0_7,
  "/src/content/blog/bryllupslokale-kommune-krav-kapasitet-sammenligning.md": __vite_glob_0_8,
  "/src/content/blog/bryllupslokale-kommune-pris-guide-innbygger.md": __vite_glob_0_9,
  "/src/content/blog/bryllupslokale-kommune-pris-leie-booking.md": __vite_glob_0_10,
  "/src/content/blog/bryllupslokale-kommune-pris-og-booking.md": __vite_glob_0_11,
  "/src/content/blog/bryllupslokale-kommune-pris.md": __vite_glob_0_12,
  "/src/content/blog/bryllupslokale-kommune-prosess-fra-sok-til-kontrakt.md": __vite_glob_0_13,
  "/src/content/blog/bryllupslokale-kommune-sjekkliste-bryllupsdagen.md": __vite_glob_0_14,
  "/src/content/blog/compliance-sikkerhet-og-datavern.md": __vite_glob_0_15,
  "/src/content/blog/cyberangrep-norske-kommuner-bookingsystem.md": __vite_glob_0_16,
  "/src/content/blog/ddos-ransomware-beredskap-bookingplattform.md": __vite_glob_0_17,
  "/src/content/blog/digdir-designsystemet-kommunal-bookingplattform.md": __vite_glob_0_18,
  "/src/content/blog/digilist-mobil-app.md": __vite_glob_0_19,
  "/src/content/blog/en-plattform-mot-fem-verktoy.md": __vite_glob_0_20,
  "/src/content/blog/faktura-refusjon-avstemming.md": __vite_glob_0_21,
  "/src/content/blog/foresporsel-chat-kommunikasjon.md": __vite_glob_0_22,
  "/src/content/blog/gdpr-iso-datalokasjon-norge.md": __vite_glob_0_23,
  "/src/content/blog/gym-og-idrettssalsleie-for-barn-og-privatpersoner.md": __vite_glob_0_24,
  "/src/content/blog/hva-er-bookingsystem-kommunale-lokaler.md": __vite_glob_0_25,
  "/src/content/blog/hvorfor-digital-booking-2026.md": __vite_glob_0_26,
  "/src/content/blog/idporten-bankid-kommunal-innlogging.md": __vite_glob_0_27,
  "/src/content/blog/idrettshall-booking-for-lag-og-foreninger.md": __vite_glob_0_28,
  "/src/content/blog/idrettshall-kommune-booke-enkelttime-trening-arrangement.md": __vite_glob_0_29,
  "/src/content/blog/idrettshall-ledige-tider-booking-hele-livssyklusen.md": __vite_glob_0_30,
  "/src/content/blog/idrettshall-ledige-tider-booking-innbygger.md": __vite_glob_0_31,
  "/src/content/blog/idrettshall-ledige-tider-booking-sanntid-innbygger.md": __vite_glob_0_32,
  "/src/content/blog/idrettshall-ledige-tider-booking.md": __vite_glob_0_33,
  "/src/content/blog/integrasjon-med-offentlige-systemer-og-autentisering.md": __vite_glob_0_34,
  "/src/content/blog/kapasitetsstyring-idrettsanlegg-driftsleder.md": __vite_glob_0_35,
  "/src/content/blog/kommunalt-bookingsystem-hva-er-det.md": __vite_glob_0_36,
  "/src/content/blog/konferansesal-kultursal-kommune-pris-kapasitet-booking.md": __vite_glob_0_37,
  "/src/content/blog/leie-idrettshall-kommune-komplett-guide-lag.md": __vite_glob_0_38,
  "/src/content/blog/leie-idrettshall-privat-enkelttime-innbygger.md": __vite_glob_0_39,
  "/src/content/blog/leie-kommunalt-lokale-pris-guide.md": __vite_glob_0_40,
  "/src/content/blog/leie-lokale-billigst-kommune-sammenlign-lokaltyper.md": __vite_glob_0_41,
  "/src/content/blog/leie-lokale-kommune-vilkar-depositum-avbestilling.md": __vite_glob_0_42,
  "/src/content/blog/leie-motrom-kommune-samme-dag.md": __vite_glob_0_43,
  "/src/content/blog/leie-sal-billigst-kommune-pris-guide.md": __vite_glob_0_44,
  "/src/content/blog/leie-sal-kommune-billigst-innbygger.md": __vite_glob_0_45,
  "/src/content/blog/leiepriser-kommunale-lokaler-driftsleder-guide.md": __vite_glob_0_46,
  "/src/content/blog/m-terom.md": __vite_glob_0_47,
  "/src/content/blog/magic-link-sms-bankid-sikker-innlogging.md": __vite_glob_0_48,
  "/src/content/blog/min-side-alle-bookinger-paa-ett-sted.md": __vite_glob_0_49,
  "/src/content/blog/onboarding-uke-til-live.md": __vite_glob_0_50,
  "/src/content/blog/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor.md": __vite_glob_0_51,
  "/src/content/blog/phishing-resistente-innlogginger-idporten-bankid.md": __vite_glob_0_52,
  "/src/content/blog/realtime-varsler-driftsroller.md": __vite_glob_0_53,
  "/src/content/blog/saksbehandler-godkjenne-avvise-kommunisere.md": __vite_glob_0_54,
  "/src/content/blog/sanntidskalender-kommunal-booking.md": __vite_glob_0_55,
  "/src/content/blog/sesongleie-fordeling-lag-foreninger.md": __vite_glob_0_56,
  "/src/content/blog/sesongtildeling-idrettshall-saksbehandler-guide.md": __vite_glob_0_57,
  "/src/content/blog/somlos-betaling-vipps-ehf.md": __vite_glob_0_58,
  "/src/content/blog/ssa-l-2026-bookingsystem-kommune.md": __vite_glob_0_59,
  "/src/content/blog/tilgjengelighetskalender-innbygger.md": __vite_glob_0_60,
  "/src/content/blog/universell-utforming-wcag-kommunal-booking.md": __vite_glob_0_61,
  "/src/content/blog/utleieobjekt-veiviser-steg-for-steg.md": __vite_glob_0_62
});
const posts = Object.entries(modules).map(([path, raw]) => {
  const { data, content } = parseFrontmatter(raw);
  const slug = data.slug || path.split("/").pop().replace(/\.md$/, "");
  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    author: data.author || "",
    role: data.role,
    readingMinutes: data.readingMinutes,
    tag: data.tag,
    cover: data.cover,
    keywords: data.keywords,
    content
  };
}).sort((a, b) => a.date < b.date ? 1 : -1);
function getAllPosts() {
  return posts;
}
function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
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
const SECTION_ITEMS = [
  { id: "sec-funksjonalitet", kind: "section", title: "Funksjonalitet", subtitle: "Slik fungerer Digilist: fire steg", href: "#funksjonalitet", isAnchor: true, keywords: ["howitworks", "steg", "flyt"] },
  { id: "sec-brukerhistorier", kind: "section", title: "Brukerhistorier", subtitle: "Kunder som bruker Digilist", href: "#brukerhistorier", isAnchor: true, keywords: ["kunder", "case", "stories"] },
  { id: "sec-integrasjoner", kind: "section", title: "Integrasjoner", subtitle: "Vipps, BankID, EHF, regnskap", href: "#integrasjoner", isAnchor: true, keywords: ["vipps", "bankid", "ehf", "visma", "stripe"] },
  { id: "sec-teknologi", kind: "section", title: "Teknologi", subtitle: "Hva vi bygger på, og hvorfor", href: "#teknologi", isAnchor: true, keywords: ["stack", "react", "postgres", "convex"] },
  { id: "sec-arkitektur", kind: "section", title: "Arkitektur", subtitle: "Systemdiagram", href: "#arkitektur", isAnchor: true, keywords: ["diagram", "system"] },
  { id: "sec-om-oss", kind: "section", title: "Om oss", subtitle: "Xala Technologies AS", href: "#om-oss", isAnchor: true, keywords: ["xala", "team"] },
  { id: "sec-kontakt", kind: "section", title: "Kontakt", subtitle: "Book demo / Snakk med oss", href: "#kontakt", isAnchor: true, keywords: ["demo", "kontakt"] }
];
const ROUTE_ITEMS = [
  { id: "r-blogg", kind: "route", title: "Blogg", subtitle: "Alle artikler", href: "/blogg" },
  { id: "r-faq", kind: "route", title: "FAQ", subtitle: "Ofte stilte spørsmål", href: "/faq" },
  { id: "r-book-demo", kind: "route", title: "Book demo", subtitle: "30–45 min, gratis", href: "/book-demo" },
  { id: "r-booking-lokaler", kind: "route", title: "Booking av lokaler og møterom", subtitle: "Landingsside", href: "/booking-av-lokaler-og-moterom" },
  { id: "r-bookingsystem-kommune", kind: "route", title: "Bookingsystem for kommuner", subtitle: "SSA-L 2026", href: "/bookingsystem-kommune" },
  { id: "r-personvern", kind: "route", title: "Personvern", subtitle: "GDPR + ISO 27001/27701", href: "/personvern" },
  { id: "r-salgsvilkar", kind: "route", title: "Salgsvilkår", subtitle: "Avtalevilkår", href: "/salgsvilkar" },
  { id: "r-cookies", kind: "route", title: "Cookies", subtitle: "Cookie-policy", href: "/cookies" }
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
  const corpus = useMemo(() => getSearchCorpus(), []);
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
  hero: '"opsz" 144, "wght" 460, "SOFT" 30, "WONK" 0',
  display: '"opsz" 120, "wght" 460, "SOFT" 30, "WONK" 0',
  section: '"opsz" 96, "wght" 480, "SOFT" 30, "WONK" 0',
  sub: '"opsz" 36, "wght" 540, "SOFT" 30, "WONK" 0',
  quote: '"opsz" 72, "wght" 460, "SOFT" 30, "WONK" 0',
  dropcap: '"opsz" 144, "wght" 540, "SOFT" 30, "WONK" 0',
  "body-italic": '"opsz" 16, "wght" 460, "SOFT" 30, "WONK" 0'
};
function getFraunces(size) {
  return PRESETS[size];
}
const SIZE_CLASSES$1 = {
  hero: "text-5xl md:text-7xl lg:text-8xl tracking-tight",
  display: "text-4xl md:text-6xl lg:text-7xl tracking-tight",
  section: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  sub: "text-xl md:text-2xl"
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
  className,
  wonk = false
}) {
  const baseFraunces = getFraunces(SIZE_TO_FRAUNCES[size]);
  const variation = wonk ? baseFraunces.replace(/"WONK"\s*\d+/, '"WONK" 1') : baseFraunces;
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
        lineHeight: size === "hero" ? 0.95 : size === "display" ? 0.98 : 1.05,
        letterSpacing: size === "hero" ? "-0.025em" : "-0.015em"
      },
      children
    }
  );
}
function DropCap({ children, className }) {
  return /* @__PURE__ */ jsx("p", { className: cn("dropcap", className), children });
}
function PullQuote({ children, byline, role, className }) {
  return /* @__PURE__ */ jsxs("figure", { className: cn("my-12 pl-6 border-l-2 border-navy", className), children: [
    /* @__PURE__ */ jsxs(
      "blockquote",
      {
        className: "font-serif text-2xl md:text-3xl lg:text-4xl text-ink leading-tight",
        style: {
          fontVariationSettings: getFraunces("quote"),
          letterSpacing: "-0.01em"
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-accent-text mr-1", children: "“" }),
          children,
          /* @__PURE__ */ jsx("span", { className: "text-accent-text ml-1", children: "”" })
        ]
      }
    ),
    (byline || role) && /* @__PURE__ */ jsxs("figcaption", { className: "mt-4 editorial-mono-caption", children: [
      byline && /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: byline }),
      byline && role && /* @__PURE__ */ jsx("span", { className: "mx-2", children: "·" }),
      role && /* @__PURE__ */ jsx("span", { children: role })
    ] })
  ] });
}
function Sidenote({ marker, children, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "mt-6 py-4 pl-5 lg:pl-6 border-l-2 border-accent-text/60",
        "text-lg lg:text-xl text-ink-soft leading-relaxed",
        className
      ),
      children: [
        marker !== void 0 && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 mr-3 align-middle bg-navy text-on-navy rounded-full font-mono text-xs tabular-nums", children: marker }),
        children
      ]
    }
  );
}
function TrustBadge({
  label,
  caption,
  icon,
  inverted = false,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-start gap-3 p-4 border-hairline",
        inverted ? "border-paper/20 text-paper" : "border-rule text-ink",
        className
      ),
      children: [
        icon && /* @__PURE__ */ jsx("div", { className: cn("mt-0.5 shrink-0", inverted ? "text-paper" : "text-accent-text"), children: icon }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "font-mono text-xs uppercase tracking-widest",
                inverted ? "text-paper" : "text-ink"
              ),
              children: label
            }
          ),
          caption && /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "text-sm",
                inverted ? "text-paper/70" : "text-ink-faint"
              ),
              children: caption
            }
          )
        ] })
      ]
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
function EditorialCard({
  children,
  bleed = false,
  inverted = false,
  className,
  as: Tag = "div"
}) {
  return /* @__PURE__ */ jsx(
    Tag,
    {
      className: cn(
        "rounded-sm",
        bleed ? "p-0 overflow-hidden" : "p-8 lg:p-10",
        "border-hairline",
        inverted ? "bg-navy text-on-navy border-on-navy/20" : "bg-paper border-rule",
        className
      ),
      children
    }
  );
}
function GrainOverlay() {
  return /* @__PURE__ */ jsx("div", { className: "grain", "aria-hidden": "true" });
}
const VARIANT_CLASSES = {
  primary: "bg-navy text-on-navy border border-navy hover:bg-navy-soft hover:border-navy-soft",
  outline: "bg-transparent text-ink border border-hairline-strong hover:bg-paper-deep",
  inverted: "bg-paper text-ink border border-paper hover:bg-paper-deep",
  link: "bg-transparent text-ink border-0 px-0 hover:underline underline-offset-8 decoration-[0.5px]"
};
const SIZE_CLASSES = {
  sm: "text-xs px-4 py-2 gap-2",
  md: "text-sm px-5 py-3 gap-2.5",
  lg: "text-sm px-6 py-4 gap-3"
};
const BASE = "group inline-flex items-center justify-center rounded-sm font-sans uppercase tracking-widest font-medium transition-colors duration-quick ease-editorial focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";
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
function SpecRow({ label, value, mono = true, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-baseline gap-3 py-3 border-b border-rule last:border-b-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "shrink-0 text-sm uppercase tracking-widest text-ink-faint",
              mono ? "font-mono text-xs" : "font-sans"
            ),
            children: label
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "flex-1 border-b border-dotted border-rule translate-y-[-3px]"
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "shrink-0 text-ink text-right",
              mono ? "font-mono text-sm" : "font-serif text-base"
            ),
            children: value
          }
        )
      ]
    }
  );
}
function Byline({ author, role, date, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-wrap items-center gap-3 editorial-mono-caption",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-ink", children: author }),
        role && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-rule", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { children: role })
        ] }),
        date && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-rule", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("time", { children: date })
        ] })
      ]
    }
  );
}
function StoryCard({
  meta,
  headline,
  customer,
  logoSrc,
  dek,
  body,
  quote,
  stats,
  cta,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: cn(
        "flex flex-col gap-6 p-8 lg:p-10 border-hairline border-rule bg-paper rounded-sm",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("header", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-3 editorial-mono-caption", children: meta.map((label, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { children: label }),
            i < meta.length - 1 && /* @__PURE__ */ jsx("span", { className: "w-px h-3 bg-rule", "aria-hidden": "true" })
          ] }, label)) }),
          logoSrc ? /* @__PURE__ */ jsx(
            "img",
            {
              src: logoSrc,
              alt: customer,
              className: "h-6 w-auto object-contain grayscale opacity-80",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-serif text-sm text-ink-faint",
              style: { fontVariationSettings: '"opsz" 36, "wght" 460' },
              children: customer
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "font-serif text-3xl md:text-4xl text-ink",
            style: {
              fontVariationSettings: getFraunces("section"),
              lineHeight: 1.1,
              letterSpacing: "-0.015em"
            },
            children: headline
          }
        ),
        dek && /* @__PURE__ */ jsx("p", { className: "text-lg text-ink-soft measure", children: dek }),
        /* @__PURE__ */ jsx("div", { className: "text-base text-ink-soft measure leading-relaxed", children: body }),
        quote && /* @__PURE__ */ jsxs(
          "blockquote",
          {
            className: "border-l-2 border-navy pl-4 text-lg italic text-ink",
            style: { fontVariationSettings: getFraunces("body-italic") },
            children: [
              "“",
              quote.text,
              "”",
              (quote.byline || quote.role) && /* @__PURE__ */ jsxs("footer", { className: "mt-2 editorial-mono-caption not-italic", children: [
                quote.byline,
                quote.byline && quote.role && " · ",
                quote.role
              ] })
            ]
          }
        ),
        stats && stats.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-t border-rule pt-4", children: stats.map((s) => /* @__PURE__ */ jsx(SpecRow, { label: s.label, value: s.value }, s.label)) }),
        cta && /* @__PURE__ */ jsx("div", { className: "mt-2", children: cta })
      ]
    }
  );
}
const FRAME = {
  sm: "w-7 h-7",
  md: "w-10 h-10",
  lg: "w-14 h-14"
};
const ICON = {
  sm: "h-[18px] w-[18px]",
  md: "h-6 w-6",
  lg: "h-8 w-8"
};
function IntegrationLogo({
  brand,
  className,
  size = "sm",
  iconOnly = false
}) {
  const slug = brand.toLowerCase().replace(/\s+&\s+/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center text-ink",
        iconOnly ? "" : "gap-3",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "text-accent-text shrink-0 inline-flex items-center justify-center rounded-sm border border-rule bg-paper",
              FRAME[size]
            ),
            children: renderMark(slug, ICON[size])
          }
        ),
        !iconOnly && /* @__PURE__ */ jsx("span", { className: "font-sans text-base font-medium leading-tight", children: brand })
      ]
    }
  );
}
function renderMark(slug, cls) {
  switch (slug) {
    case "vipps":
    case "vipps-mobilepay":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.5 2 2 6.5 2 12c0 1.4.3 2.7.8 3.9.4-.6 1.1-1 1.9-1 1.3 0 2.3 1 2.3 2.3 0 .4-.1.8-.3 1.2C8.5 20.3 10.2 21 12 21c5.5 0 10-4.5 10-10S17.5 2 12 2zm-2 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5 4.5c-.9 2-2.9 3.5-5.5 3.5-2.3 0-4.4-1.4-5.3-3.5-.3-.7.5-1.3 1.1-.9 1 .7 2.5 1.4 4.2 1.4 1.6 0 3.2-.6 4.4-1.4.6-.4 1.4.2 1.1.9z" }) });
    case "bankid":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 9h2c1 0 2 .5 2 1.5S10 12 9 12H7V9zm0 3h2.5c1 0 2 .5 2 1.5S10.5 15 9.5 15H7v-3zM14 9v6m3-6v6", strokeLinecap: "round" })
      ] });
    case "stripe":
    case "stripe-connect":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M13.5 9.3c0-.7.6-1 1.6-1 1.4 0 3.2.4 4.6 1.2V5.6c-1.5-.6-3-.9-4.6-.9-3.8 0-6.3 2-6.3 5.3 0 5.2 7.1 4.4 7.1 6.6 0 .8-.7 1.1-1.8 1.1-1.5 0-3.5-.6-5.1-1.4v4c1.7.7 3.5 1.1 5.1 1.1 3.9 0 6.5-1.9 6.5-5.3 0-5.6-7.1-4.6-7.1-6.7z" }) });
    case "id-porten":
    case "idporten":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "8", r: "3" }),
        /* @__PURE__ */ jsx("path", { d: "M5 20c0-3.5 3-6 7-6s7 2.5 7 6", strokeLinecap: "round" })
      ] });
    case "signicat":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 12l3 3 4-4M13 12l3 3 4-4", strokeLinecap: "round", strokeLinejoin: "round" }) });
    case "altinn":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 20V8l9-5 9 5v12h-6v-7h-6v7H3z" }) });
    case "ehf-peppol":
    case "ehf":
    case "peppol":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "1" }),
        /* @__PURE__ */ jsx("path", { d: "M8 9h8M8 13h6M8 17h4", strokeLinecap: "round" })
      ] });
    case "bronnoysund":
    case "brnnysund":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M3 9l9-5 9 5M5 9v11h14V9", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("path", { d: "M10 20v-5h4v5" })
      ] });
    case "visma":
    case "visma-eaccounting":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 6h4l3 10h.1l3-10h4l-5 14h-4.2L3 6z" }) });
    case "rco":
    case "rco-booking":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 9c1.5 0 2 .5 2 1.5S8.5 12 7 12V9zm0 3l3 3M14 9v6m0-3h3M19 12c0 1.5-1 3-2.5 3", strokeLinecap: "round" })
      ] });
    case "tripletex":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 6h16M12 6v14M7 11l5 5 5-5", strokeLinecap: "round", strokeLinejoin: "round" }) });
    case "fiken":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "8" }),
        /* @__PURE__ */ jsx("path", { d: "M9 10v4l3-2-3-2zM14 9v6", strokeLinecap: "round" })
      ] });
    case "poweroffice":
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M13 3L4 14h6l-2 7 9-11h-6l2-7z", strokeLinejoin: "round" }) });
    case "microsoft-365":
    case "microsoft":
    case "microsoft365":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "currentColor", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "8", height: "8" }),
        /* @__PURE__ */ jsx("rect", { x: "13", y: "3", width: "8", height: "8", opacity: "0.7" }),
        /* @__PURE__ */ jsx("rect", { x: "3", y: "13", width: "8", height: "8", opacity: "0.85" }),
        /* @__PURE__ */ jsx("rect", { x: "13", y: "13", width: "8", height: "8", opacity: "0.55" })
      ] });
    case "outlook":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "6", width: "18", height: "13", rx: "1" }),
        /* @__PURE__ */ jsx("path", { d: "M3 8l9 6 9-6", strokeLinecap: "round", strokeLinejoin: "round" })
      ] });
    case "salto-ks":
    case "salto":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "5", y: "10", width: "14", height: "10", rx: "1" }),
        /* @__PURE__ */ jsx("path", { d: "M8 10V7a4 4 0 0 1 8 0v3" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "15", r: "1", fill: "currentColor" })
      ] });
    case "iso-27001-27701":
    case "iso-27001":
    case "iso":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4", strokeLinecap: "round", strokeLinejoin: "round" })
      ] });
    case "gdpr":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z", strokeLinejoin: "round" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M12 14v3", strokeLinecap: "round" })
      ] });
    case "wcag-2-0-aa":
    case "wcag":
      return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3", fill: "currentColor" })
      ] });
    default:
      return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: cls, fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2", fill: "currentColor" }) });
  }
}
const ROUTES = [
  { label: "Forsiden", to: "/", eyebrow: "Hjem" },
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
                  /* @__PURE__ */ jsx("img", { src: "/logo.svg", alt: "", "aria-hidden": "true", className: "h-9 w-auto" }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif text-2xl text-ink leading-none",
                      style: {
                        fontVariationSettings: '"opsz" 96, "wght" 460, "SOFT" 25, "WONK" 1',
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
  }
];
const PRIMARY_NAV = [
  { label: "Blogg", to: "/blogg" },
  { label: "FAQ", to: "/faq" },
  { label: "Transparens", to: "/transparens" },
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
          "fixed top-0 left-0 right-0 z-40 bg-paper border-b transition-all duration-normal ease-editorial",
          isScrolled ? "border-rule-strong py-2 shadow-[0_1px_0_0_hsl(var(--rule))]" : "border-rule py-3"
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 flex items-center gap-4 lg:gap-6", children: [
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
                    className: "h-11 md:h-12 w-auto transition-opacity group-hover:opacity-80"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-start leading-none", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif text-3xl md:text-[2rem] text-ink leading-none",
                      style: {
                        fontVariationSettings: '"opsz" 96, "wght" 460, "SOFT" 25, "WONK" 1',
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
                          fontVariationSettings: '"opsz" 16, "wght" 420, "SOFT" 60',
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
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex shrink min-w-[150px] w-[240px] lg:w-[300px] xl:w-[360px]", children: /* @__PURE__ */ jsx(GlobalSearch, {}) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 lg:gap-6 ml-auto shrink-0", children: [
            /* @__PURE__ */ jsxs(
              "nav",
              {
                "aria-label": "Hovednavigasjon",
                className: "hidden xl:flex items-center gap-6",
                children: [
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
                            className: "flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-sm cursor-pointer focus:bg-paper-deep hover:bg-paper-deep",
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
                      className: NAV_LINK,
                      activeClassName: NAV_LINK_ACTIVE,
                      children: item.label
                    },
                    item.to
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
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
        ] })
      }
    )
  ] });
};
function HeroPlatformPreview() {
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "absolute -bottom-10 -right-8 lg:-right-12 w-[78%] hidden md:block z-0",
        children: /* @__PURE__ */ jsx(DashboardCalendarPeek, {})
      }
    ),
    /* @__PURE__ */ jsxs("article", { className: "relative z-10 bg-paper border border-rule-strong rounded-sm overflow-hidden shadow-[0_24px_60px_-30px_hsl(var(--navy)/0.25)]", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 py-3 border-b border-rule bg-paper-deep/60", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/logo-64.webp",
              alt: "",
              "aria-hidden": "true",
              className: "h-7 w-7 object-contain"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-ink tracking-tight", children: "DIGILIST" }),
            /* @__PURE__ */ jsx("span", { className: "text-[0.55rem] text-ink-faint tracking-[0.18em] uppercase", children: "Enkel booking" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "hidden lg:inline-flex items-center gap-1.5 text-xs text-ink-faint px-3 py-1.5 rounded-sm border border-rule bg-paper", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500", "aria-hidden": "true" }),
            "Sanntid"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-on-navy bg-navy px-3 py-1.5 rounded-sm", children: "Kom i gang" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 grid-rows-2 gap-px bg-rule", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 row-span-2 relative aspect-[16/10]", children: [
          /* @__PURE__ */ jsxs("picture", { children: [
            /* @__PURE__ */ jsx(
              "source",
              {
                type: "image/webp",
                srcSet: "/hero/festsal-1-512.webp 512w, /hero/festsal-1-1024.webp 1024w",
                sizes: "(max-width: 768px) 66vw, 500px"
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/hero/festsal-1-512.jpg",
                alt: "Festsal med lysekroner og runde bord",
                width: 1024,
                height: 662,
                className: "absolute inset-0 w-full h-full object-cover",
                loading: "eager",
                decoding: "async"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 left-3 font-mono text-[0.65rem] uppercase tracking-widest text-ink bg-paper/90 px-2 py-1 rounded-sm backdrop-blur-sm", children: "Festsalen · 8 bilder" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("picture", { children: [
          /* @__PURE__ */ jsx("source", { srcSet: "/hero/festsal-2-384.webp", type: "image/webp" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/hero/festsal-2-384.jpg",
              alt: "Banquet med dekkede bord",
              width: 384,
              height: 248,
              className: "absolute inset-0 w-full h-full object-cover",
              loading: "lazy"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("picture", { children: [
          /* @__PURE__ */ jsx("source", { srcSet: "/hero/festsal-3-384.webp", type: "image/webp" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/hero/festsal-3-384.jpg",
              alt: "Selskap med dekorasjon",
              width: 384,
              height: 248,
              className: "absolute inset-0 w-full h-full object-cover",
              loading: "lazy"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 lg:p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block text-[0.65rem] font-mono uppercase tracking-widest text-accent-text bg-accent-tinted px-2 py-0.5 rounded-sm", children: "Selskapslokale" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                role: "presentation",
                className: "mt-2 font-serif text-2xl lg:text-3xl text-ink",
                style: {
                  fontVariationSettings: getFraunces("section"),
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em"
                },
                children: "Lier Bygdetun, Festsalen"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: "mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3", "aria-hidden": "true" }),
              "Bygdetunveien 4, 3400 Lierbyen"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-8 h-8 rounded-sm border border-rule flex items-center justify-center text-ink-soft",
                tabIndex: -1,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(Heart, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "w-8 h-8 rounded-sm border border-rule flex items-center justify-center text-ink-soft",
                tabIndex: -1,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 border-b border-rule -mx-5 lg:-mx-6 px-5 lg:px-6", children: ["Oversikt", "Galleri", "Aktivitetskalender", "Info & vilkår"].map(
          (tab, i) => /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-xs px-3 py-2.5 border-b-2 -mb-px ${i === 0 ? "border-navy text-ink font-medium" : "border-transparent text-ink-faint"}`,
              children: tab
            },
            tab
          )
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 pt-1", children: [
          /* @__PURE__ */ jsx(Spec, { icon: /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }), label: "Kapasitet", value: "120" }),
          /* @__PURE__ */ jsx(Spec, { icon: /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), label: "Min. leie", value: "4 t" }),
          /* @__PURE__ */ jsx(Spec, { icon: /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5" }), label: "Rating", value: "4,9" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 pt-2 mt-2 border-t border-rule", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint", children: "Fra" }),
            /* @__PURE__ */ jsxs("p", { className: "font-serif text-xl text-ink leading-none mt-0.5", children: [
              "kr 1 800",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-xs text-ink-faint font-sans", children: "/ time" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-on-navy bg-navy px-5 py-2.5 rounded-sm inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4", "aria-hidden": "true" }),
            "Book nå"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 editorial-mono-caption", children: "Fig. I · Plattformen, listingvisning · app.digilist.no" })
  ] });
}
function DashboardCalendarPeek() {
  const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const dates = Array.from({ length: 35 }, (_, i) => ({
    day: (i % 31 + 1).toString(),
    booked: [3, 9, 10, 16, 17, 22, 23, 24, 29].includes(i),
    today: i === 14,
    seasonal: [11, 18, 25].includes(i)
  }));
  return /* @__PURE__ */ jsxs("article", { className: "bg-paper border border-rule-strong rounded-sm overflow-hidden shadow-[0_18px_50px_-25px_hsl(var(--navy)/0.18)]", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 py-3 border-b border-rule bg-paper-deep/60", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/logo.svg",
            alt: "",
            "aria-hidden": "true",
            className: "h-5 w-5 object-contain"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-ink tracking-tight", children: "DASHBOARD" }),
        /* @__PURE__ */ jsx("span", { className: "text-[0.55rem] text-ink-faint tracking-[0.18em] uppercase ml-1", children: "Kalender" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 text-xs text-ink-soft", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-[0.65rem] uppercase tracking-widest", children: "Mai 2026" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-5 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            role: "presentation",
            className: "font-serif text-xl text-ink",
            style: { fontVariationSettings: '"opsz" 36, "wght" 460' },
            children: "Lier Bygdetun, Festsalen"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-navy", "aria-hidden": "true" }),
            "Booket"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-ink-soft", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-accent-surface", "aria-hidden": "true" }),
            "Sesongleie"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: days.map((d) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-center font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint",
          children: d
        },
        d
      )) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: dates.map((d, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `aspect-square flex flex-col items-center justify-center border rounded-sm text-xs ${d.today ? "bg-navy text-on-navy border-navy" : d.booked ? "bg-navy/10 text-ink border-navy/30" : d.seasonal ? "bg-accent-surface text-ink border-accent-surface" : "bg-paper text-ink-soft border-rule"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: d.day }),
            d.booked && /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-navy mt-0.5", "aria-hidden": "true" })
          ]
        },
        i
      )) })
    ] })
  ] });
}
function Spec({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 border border-rule rounded-sm p-2.5 bg-paper", children: [
    /* @__PURE__ */ jsx("span", { className: "text-accent-text", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink", children: value })
    ] })
  ] });
}
const editorialEase = [0.22, 1, 0.36, 1];
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
const integrationsByCategory = [
  {
    category: "Betaling",
    items: ["Vipps", "Stripe Connect"]
  },
  {
    category: "Autentisering",
    items: ["BankID", "ID-porten", "Signicat"]
  },
  {
    category: "Offentlig",
    items: ["Altinn", "EHF / Peppol", "Brønnøysund"]
  },
  {
    category: "Regnskap",
    items: ["Visma", "Tripletex", "Fiken", "PowerOffice"]
  },
  {
    category: "Kalender & nøkkel",
    items: ["Microsoft 365", "Outlook", "Salto KS"]
  },
  {
    category: "Samsvar",
    items: ["ISO 27001/27701", "GDPR", "WCAG 2.0 AA"]
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
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: staggerChild,
                  className: "col-span-12 lg:col-span-7",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption mb-6 inline-block", children: "Bookingplattform · 2026 · Norge" }),
                    /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "hero", wonk: true, children: [
                      "Én plattform for alt som",
                      " ",
                      /* @__PURE__ */ jsx(
                        "em",
                        {
                          className: "italic",
                          style: {
                            fontVariationSettings: '"opsz" 144, "wght" 400, "SOFT" 30, "WONK" 0'
                          },
                          children: "leies ut"
                        }
                      ),
                      "."
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "p",
                      {
                        className: "mt-8 text-lg lg:text-xl text-ink-soft measure leading-relaxed",
                        style: { fontVariationSettings: '"wght" 380' },
                        children: [
                          "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering:",
                          " ",
                          /* @__PURE__ */ jsx(
                            "em",
                            {
                              style: {
                                fontVariationSettings: '"wght" 420, "SOFT" 30',
                                fontStyle: "italic"
                              },
                              children: "én digital plattform"
                            }
                          ),
                          " ",
                          "for det norske utleiemarkedet."
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "mt-8 border-y border-rule py-5", children: [
                      /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption mb-4", children: "Sertifisert · Integrert · Norsk" }),
                      /* @__PURE__ */ jsx(
                        "ul",
                        {
                          className: "flex flex-wrap items-center gap-x-5 gap-y-3",
                          "aria-label": "Sertifiseringer og integrasjoner",
                          children: [
                            "ISO 27001",
                            "ISO 27701",
                            "GDPR",
                            "WCAG 2.0 AA",
                            "Vipps",
                            "BankID",
                            "ID-porten",
                            "EHF / Peppol",
                            "Visma",
                            "RCO",
                            "Outlook"
                          ].map((brand) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IntegrationLogo, { brand }) }, brand))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-base text-ink-soft measure", children: [
                      "I daglig bruk hos",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: "Nordre Follo kommune" }),
                      ",",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: "Rønningen Selskapslokale" }),
                      ",",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: "Lier Bygdetun" }),
                      " og",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-ink font-medium", children: "RightSize Group" }),
                      "."
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-4", children: [
                      /* @__PURE__ */ jsx(
                        EditorialButton,
                        {
                          variant: "primary",
                          size: "lg",
                          href: "https://app.digilist.no",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          children: "Åpne plattformen"
                        }
                      ),
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
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  variants: staggerChild,
                  className: "col-span-12 lg:col-span-5 mt-12 lg:mt-0",
                  children: /* @__PURE__ */ jsx(HeroPlatformPreview, {})
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
            className: "border-y border-rule",
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 py-12 lg:py-14", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-6 mb-10", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption", children: "Kunder · I bruk" }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint hidden md:inline", children: "To av flere: referanser på forespørsel" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-sm overflow-hidden", children: customers.map((c) => /* @__PURE__ */ jsxs(
                "article",
                {
                  "aria-label": c.name,
                  className: "bg-paper px-6 lg:px-10 py-8 lg:py-10 flex items-center gap-6 min-h-[7.5rem]",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "shrink-0 w-20 h-20 rounded-sm border border-rule bg-paper-deep flex items-center justify-center overflow-hidden", children: c.src ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: c.src,
                        alt: `${c.name} logo`,
                        className: "max-w-[80%] max-h-[80%] object-contain",
                        loading: "lazy"
                      }
                    ) : /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "font-serif text-3xl text-accent-text",
                        style: { fontVariationSettings: getFraunces("section") },
                        children: c.name.charAt(0)
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 min-w-0", children: [
                      /* @__PURE__ */ jsx(
                        "p",
                        {
                          className: "font-serif text-2xl lg:text-[1.75rem] text-ink leading-tight",
                          style: {
                            fontVariationSettings: getFraunces("section"),
                            letterSpacing: "-0.015em"
                          },
                          children: c.name
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
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
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            className: "border-b border-rule bg-paper-deep/40",
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 py-12 lg:py-14", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-6 mb-10", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption", children: "Integrasjoner & samsvar" }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint hidden md:inline", children: "Bygget for det norske utleiemarkedet" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-rule border-y border-rule", children: integrationsByCategory.map((col) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: staggerChild,
                  className: "bg-paper-deep/40 px-5 py-8 flex flex-col gap-3",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: col.category }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-2.5 mt-2", children: col.items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(IntegrationLogo, { brand: item }) }, item)) })
                  ]
                },
                col.category
              )) })
            ] })
          }
        )
      ]
    }
  );
};
const values = [
  {
    numeral: "I",
    title: "Alt på ett sted",
    description: "Bestilling, kalender, priser, vilkår og administrasjon samlet i én plattform. Slutt med Excel, e-poster og dobbeltbookinger."
  },
  {
    numeral: "II",
    title: "Enkel for brukere",
    description: "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring. Universelt utformet, WCAG 2.0 AA."
  },
  {
    numeral: "III",
    title: "Effektiv for administrasjon",
    description: "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid. Driftsroller varsles automatisk ved bookinger."
  },
  {
    numeral: "IV",
    title: "Skalerbar løsning",
    description: "Tilpasset alt fra ett selskapslokale til kommune med tolv anlegg. Sesongleie, lag og foreninger, tilskudd og fakturering."
  }
];
const ValuePropositionSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "verdi", className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "I. PLATTFORMEN" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", children: "Fire prinsipper." }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Hvorfor velge Digilist? Fire grunner som gjelder uansett størrelse, fra ett lokale til en hel kommune."
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      motion.ol,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: viewportOnce,
        variants: staggerParent,
        className: "border-t border-rule",
        children: values.map((v) => /* @__PURE__ */ jsxs(
          motion.li,
          {
            variants: staggerChild,
            className: "grid grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-14 border-b border-rule",
            children: [
              /* @__PURE__ */ jsx("div", { className: "col-span-2 lg:col-span-1", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "font-mono text-2xl lg:text-3xl text-accent-text tabular-nums",
                  style: { letterSpacing: "0.05em" },
                  children: v.numeral
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-10 lg:col-span-7", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: "font-serif text-3xl lg:text-4xl text-ink mb-4",
                    style: {
                      fontVariationSettings: getFraunces("section"),
                      lineHeight: 1.1,
                      letterSpacing: "-0.015em"
                    },
                    children: v.title
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-lg text-ink-soft measure leading-relaxed", children: v.description })
              ] })
            ]
          },
          v.numeral
        ))
      }
    )
  ] }) });
};
const segments = [
  {
    title: "Idrettshaller & svømmehaller",
    body: "Hele eller halve haller, gymsaler, fotballbaner. Sanntid, sesongleie og lag-/foreningsfordeling."
  },
  {
    title: "Selskapslokaler & kulturhus",
    body: "Selskap, bryllup, jubileer, konserter, kurs. Depositum, leieavtale og digital nøkkel."
  },
  {
    title: "Møterom & kantiner",
    body: "Kommunale, næring og foreninger. Sambruk mellom avdelinger, prising og varsling av drift."
  },
  {
    title: "Ressurser & tjenester",
    body: "AV-utstyr, instrumenter, kjøretøy, vaktmestertjenester. Pakker og legg-til-tjenester på booking."
  }
];
const AudienceSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "bruksomrader",
      className: "py-14 lg:py-20 bg-paper-deep/40",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "II. PUBLIKUM" }),
        /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
          "Én plattform.",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: {
                fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
              },
              children: "Mange bruksområder."
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "columns-1 lg:columns-2 gap-12 mb-12 text-ink-soft", children: [
          /* @__PURE__ */ jsx(DropCap, { children: "Digilist er bygd for norske utleiere: fra eieren av et selskapslokale med bookinger til kommunale fritidsetater med tolv anlegg. Den samme plattformen håndterer privatbookinger, sesongleie til lag og foreninger, sambruk mellom avdelinger og offentlige bookinger med kommunal innbyggerautentisering via ID-porten." }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-relaxed", children: "Betaling tas direkte via Vipps eller kort med øyeblikkelig kvittering. Driftsroller (vaktmestere, renholdspersonell, vektere) varsles automatisk når en booking bekreftes. Faktura og bilag genereres til ditt regnskapssystem (Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol)." }),
          /* @__PURE__ */ jsx(
            PullQuote,
            {
              byline: "Kommunal kulturkonsulent",
              role: "Bruker av Digilist",
              className: "my-10",
              children: "Vi har redusert dobbeltbookinger til null og fått tilbake fire timer i uka som tidligere gikk til regnearkjusteringer."
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-lg leading-relaxed", children: "Plattformen er universelt utformet, oppfyller WCAG 2.0 AA, GDPR og er ISO 27001/27701-sertifisert. Alle data lagres i Norge og Europa." })
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            className: "grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule",
            children: segments.map((s) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: staggerChild,
                className: "bg-paper p-6 lg:p-8 min-h-[12rem] flex flex-col",
                children: [
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "font-serif text-xl lg:text-2xl text-ink mb-3",
                      style: {
                        fontVariationSettings: getFraunces("sub"),
                        fontStyle: "normal",
                        letterSpacing: "0"
                      },
                      children: s.title
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft leading-relaxed", children: s.body })
                ]
              },
              s.title
            ))
          }
        )
      ] })
    }
  );
};
const BrukerhistorierSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "brukerhistorier",
      className: "py-14 lg:py-20 bg-paper",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "III. BRUKERHISTORIER" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
            "Hvem bruker",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: {
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
                },
                children: "Digilist?"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-xl text-ink-soft italic",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Hverdagshistorier fra norske utleiere. Bookinger, automatisering og regnskap, sammenhengende."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            className: "grid lg:grid-cols-2 gap-6 lg:gap-8",
            children: [
              /* @__PURE__ */ jsx(motion.div, { variants: staggerChild, children: /* @__PURE__ */ jsx(
                StoryCard,
                {
                  meta: ["Kunde", "Selskapslokale", "Live 2025"],
                  customer: "Rønningen Selskapslokale",
                  logoSrc: "/clients/ronning.png",
                  headline: "Fra excelark til kalenderautomatikk.",
                  dek: "Privat selskapslokale i Asker som leier ut til selskaper, bryllup og jubileer.",
                  body: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("p", { children: "Som eier av et selskapslokale ønsket Rønningen å slutte å holde styr på bookinger i regneark. Med Digilist får gjestene en lenke der de selv ser ledige helger, betaler depositum og signerer leieavtalen digitalt." }) }),
                  quote: {
                    text: "Vi har eliminert dobbeltbookinger og fått automatisk faktura. Hver booking går fra forespørsel til betalt på under fem minutter.",
                    byline: "Eier",
                    role: "Rønningen Selskapslokale"
                  },
                  stats: [
                    { label: "Reduserte adm.-tid", value: "−65 %" },
                    { label: "Bookinger fra mobil", value: "+82 %" },
                    { label: "Dobbeltbookinger", value: "0" }
                  ],
                  cta: /* @__PURE__ */ jsx(
                    EditorialButton,
                    {
                      variant: "link",
                      size: "md",
                      href: "#kontakt",
                      onClick: (e) => {
                        e.preventDefault();
                        const el = document.getElementById("kontakt");
                        if (el)
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                      },
                      children: "Be om referanse"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(motion.div, { variants: staggerChild, children: /* @__PURE__ */ jsx(
                StoryCard,
                {
                  meta: ["Kunde", "Kommune", "Live 2024"],
                  customer: "Nordre Follo kommune",
                  logoSrc: "/clients/nordre-follo.svg",
                  headline: "Én plattform for haller, møterom og kantiner.",
                  dek: "Kommunal kulturetat med tolv anlegg, ca. 340 lag og foreninger og 1 200 bookinger i måneden.",
                  body: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("p", { children: "Kulturkonsulenten håndterer sesongleie til lag og foreninger, privatbookinger og sambruk mellom kantiner og møterom. Driftsroller (vaktmestere, renhold, vektere) varsles automatisk ved bookingbekreftelse. Tilskudd til lag og foreninger fordeles via sesongleie-modulen." }) }),
                  quote: {
                    text: "Vi har samlet tolv anlegg, hundrevis av foreninger og kommunal fakturering i én plattform, og innbyggerne booker via ID-porten.",
                    byline: "Kulturkonsulent",
                    role: "Nordre Follo kommune"
                  },
                  stats: [
                    { label: "Anlegg i drift", value: "12" },
                    { label: "Aktive lag/foreninger", value: "~340" },
                    { label: "Bookinger / måned", value: "~1 200" }
                  ],
                  cta: /* @__PURE__ */ jsx(
                    EditorialButton,
                    {
                      variant: "link",
                      size: "md",
                      href: "#kontakt",
                      onClick: (e) => {
                        e.preventDefault();
                        const el = document.getElementById("kontakt");
                        if (el)
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                      },
                      children: "Be om referanse"
                    }
                  )
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-12 editorial-mono-caption text-center", children: "Flere referanser tilgjengelig på forespørsel. Kontakt salg for kunde- og nøkkeltallreferanser." })
      ] })
    }
  );
};
const DELIVERS = [
  "Sanntids tilgjengelighetskalender",
  "Enkel booking og forespørsler",
  "Håndtering av sesongleie for lag og foreninger",
  "Oversikt over lokaler og idrettsanlegg",
  "Digital saksbehandlingsflyt",
  "Administrativ godkjenning av forespørsler",
  "Fakturagrunnlag og betalingsoversikt",
  "Mobilvennlig og universelt utformet løsning",
  "Enkel administrasjon og oppdatering av innhold",
  "Bedre synlighet av kommunale tilbud og aktiviteter"
];
const NEEDS = [
  "Lokaler eller anlegg kommunen administrerer",
  "Korte beskrivelser",
  "Bilder eller lenker, dersom tilgjengelig",
  "Kontaktinformasjon",
  "Eventuell informasjon om booking eller sesongleie"
];
const PilotInvitationSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "pilot",
      className: "py-14 lg:py-20 bg-accent-tinted",
      "aria-labelledby": "pilot-heading",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "PILOT FOR NORSKE KOMMUNER" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-10 lg:gap-gutter", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
            /* @__PURE__ */ jsxs(
              EditorialHeading,
              {
                as: "h2",
                size: "display",
                className: "mb-8",
                ...{ id: "pilot-heading" },
                children: [
                  "En invitasjon til",
                  " ",
                  /* @__PURE__ */ jsx(
                    "em",
                    {
                      className: "italic",
                      style: { fontVariationSettings: getFraunces("display") },
                      children: "norske kommuner"
                    }
                  ),
                  "."
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-lg text-ink-soft leading-relaxed measure", children: [
              /* @__PURE__ */ jsx("p", { children: "Digilist er en moderne og universelt utformet plattform for håndtering og synliggjøring av kommunale lokaler, idrettsanlegg, møterom og arrangementer." }),
              /* @__PURE__ */ jsx("p", { children: "Vi inviterer kommunen til å delta i et pilotinitiativ der vi hjelper med å gjøre kommunale utleieobjekter og aktiviteter mer tilgjengelige, enklere å administrere og lettere å finne for innbyggere, lag, organisasjoner og arrangører." }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "Målet er ikke å erstatte eksisterende løsninger" }),
                " ",
                "eller arbeidsprosesser, men å utforske hvordan Digilist kan fungere som et moderne supplement for innbyggere og administrasjon."
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-ink font-medium", children: "Vi hjelper med oppsett og publisering uten kostnad i pilotfasen. Kommunen får egen administrativ tilgang for videre drift." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(
                EditorialButton,
                {
                  variant: "primary",
                  size: "lg",
                  href: "mailto:kontakt@digilist.no?subject=Pilot%20for%20kommune",
                  icon: /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4", "aria-hidden": "true" }),
                  children: "Be om pilot"
                }
              ),
              /* @__PURE__ */ jsx(
                EditorialButton,
                {
                  variant: "outline",
                  size: "lg",
                  icon: false,
                  onClick: (e) => {
                    e.preventDefault();
                    openChatbot({ mode: "chat" });
                  },
                  children: "Snakk med oss"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Byline,
              {
                author: "Ibrahim Rahmani",
                role: "Xala Technologies AS",
                date: "Oslo · 2026",
                className: "mt-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 space-y-6", children: [
            /* @__PURE__ */ jsxs(EditorialCard, { className: "bg-paper", children: [
              /* @__PURE__ */ jsxs("header", { className: "mb-6 pb-5 border-b border-rule", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text mb-3 block", children: "TILBUDSPAKKE" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0", children: /* @__PURE__ */ jsx(
                    Package,
                    {
                      className: "h-5 w-5",
                      strokeWidth: 1.5,
                      "aria-hidden": "true"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    "h3",
                    {
                      className: "font-serif text-2xl lg:text-3xl text-ink leading-tight",
                      style: {
                        fontVariationSettings: getFraunces("sub"),
                        letterSpacing: "-0.015em"
                      },
                      children: [
                        "Digilist",
                        " ",
                        /* @__PURE__ */ jsx(
                          "em",
                          {
                            className: "italic",
                            style: {
                              fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60'
                            },
                            children: "leverer"
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3.5", children: DELIVERS.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  CheckCircle2,
                  {
                    className: "h-4 w-4 mt-1 shrink-0 text-accent-text",
                    strokeWidth: 1.75,
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-base lg:text-[1.0625rem] text-ink leading-snug",
                    style: {
                      fontVariationSettings: '"opsz" 24, "wght" 400'
                    },
                    children: item
                  }
                )
              ] }, item)) })
            ] }),
            /* @__PURE__ */ jsxs(EditorialCard, { className: "bg-paper", children: [
              /* @__PURE__ */ jsxs("header", { className: "mb-6 pb-5 border-b border-rule", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text mb-3 block", children: "INPUT FRA KOMMUNEN" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0", children: /* @__PURE__ */ jsx(
                    ClipboardList,
                    {
                      className: "h-5 w-5",
                      strokeWidth: 1.5,
                      "aria-hidden": "true"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs(
                    "h3",
                    {
                      className: "font-serif text-2xl lg:text-3xl text-ink leading-tight",
                      style: {
                        fontVariationSettings: getFraunces("sub"),
                        letterSpacing: "-0.015em"
                      },
                      children: [
                        "Vi trenger",
                        " ",
                        /* @__PURE__ */ jsx(
                          "em",
                          {
                            className: "italic",
                            style: {
                              fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60'
                            },
                            children: "fra kommunen"
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3.5", children: NEEDS.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "h-4 w-4 mt-1.5 shrink-0 inline-flex items-center justify-center",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-accent-text" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "text-base lg:text-[1.0625rem] text-ink leading-snug",
                    style: {
                      fontVariationSettings: '"opsz" 24, "wght" 400'
                    },
                    children: item
                  }
                )
              ] }, item)) }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "mt-6 italic text-sm lg:text-base text-ink-faint border-t border-rule pt-5",
                  style: {
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontVariationSettings: '"opsz" 24, "wght" 380, "SOFT" 60'
                  },
                  children: "Pilotfasen er gratis. Kommunen forplikter seg ikke til videre bruk eller anskaffelse."
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
};
const FALLBACK_COVER = "/images/blog/_placeholder.svg";
const BlogPreviewSection = () => {
  const posts2 = getAllPosts().slice(0, 6);
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [posts2.length]);
  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-slide]");
    const step = card ? card.offsetWidth + 32 : el.clientWidth * 0.85;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };
  if (posts2.length === 0) return null;
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "blogg-preview",
      "aria-labelledby": "blogg-preview-heading",
      className: "py-20 lg:py-32 bg-paper-deep/40 border-y border-rule",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "V. INNSIKT" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-20", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(
            EditorialHeading,
            {
              as: "h2",
              size: "section",
              id: "blogg-preview-heading",
              children: [
                "Lesestoff fra",
                " ",
                /* @__PURE__ */ jsx(
                  "em",
                  {
                    className: "italic",
                    style: {
                      fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
                    },
                    children: "redaksjonen"
                  }
                ),
                "."
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-col justify-end gap-8", children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                className: "text-xl lg:text-2xl text-ink-soft italic measure",
                style: {
                  fontVariationSettings: getFraunces("sub"),
                  lineHeight: 1.45
                },
                children: "Tre artikler om kommunal booking, sesongleie og samsvar, skrevet for saksbehandlere, kulturkonsulenter og digitaliseringsledere."
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-rule pt-6", children: [
              /* @__PURE__ */ jsx(EditorialButton, { variant: "link", size: "md", href: "/blogg", children: "Se alle artikler" }),
              /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => scrollBy(-1),
                    disabled: !canScrollLeft,
                    "aria-label": "Forrige artikkel",
                    className: cn(
                      "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-ink transition-all duration-quick ease-editorial",
                      "hover:bg-paper-deep hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed"
                    ),
                    children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => scrollBy(1),
                    disabled: !canScrollRight,
                    "aria-label": "Neste artikkel",
                    className: cn(
                      "inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-ink transition-all duration-quick ease-editorial",
                      "hover:bg-paper-deep hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed"
                    ),
                    children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                ref: scrollerRef,
                className: cn(
                  "flex gap-8 lg:gap-10 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                ),
                children: posts2.map((post, i) => /* @__PURE__ */ jsx(
                  motion.article,
                  {
                    "data-slide": true,
                    variants: staggerChild,
                    className: "snap-start shrink-0 w-[88%] sm:w-[64%] md:w-[48%] lg:w-[36%] xl:w-[32%]",
                    children: /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: `/blogg/${post.slug}`,
                        className: "group flex flex-col h-full bg-paper border border-hairline-strong hover:border-ink transition-all duration-normal ease-editorial rounded-sm overflow-hidden hover:-translate-y-1",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/10] overflow-hidden bg-navy", children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: post.cover || FALLBACK_COVER,
                                alt: post.title,
                                loading: "lazy",
                                decoding: "async",
                                className: "absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-editorial group-hover:scale-[1.04]",
                                onError: (e) => {
                                  const img = e.currentTarget;
                                  if (img.src.endsWith(FALLBACK_COVER)) {
                                    img.style.display = "none";
                                    return;
                                  }
                                  img.src = FALLBACK_COVER;
                                }
                              }
                            ),
                            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" }),
                            post.tag && /* @__PURE__ */ jsx("span", { className: "absolute top-4 left-4 editorial-mono-caption bg-paper/95 backdrop-blur-sm text-accent-text px-2.5 py-1 border border-hairline-strong", children: post.tag }),
                            /* @__PURE__ */ jsx("span", { className: "absolute bottom-4 right-4 inline-flex items-center justify-center w-9 h-9 bg-paper/90 backdrop-blur-sm border border-hairline-strong rounded-sm text-ink transition-transform duration-normal ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1", children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4", "aria-hidden": "true" }) })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-1 p-7 lg:p-8", children: [
                            /* @__PURE__ */ jsxs("div", { className: "editorial-mono-caption text-ink-faint mb-4 flex items-center gap-3", children: [
                              /* @__PURE__ */ jsx("span", { children: formatPostDate(post.date) }),
                              post.readingMinutes && /* @__PURE__ */ jsxs(Fragment, { children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    "aria-hidden": "true",
                                    className: "w-px h-3 bg-rule"
                                  }
                                ),
                                /* @__PURE__ */ jsxs("span", { children: [
                                  post.readingMinutes,
                                  " min lesetid"
                                ] })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsx(
                              "h3",
                              {
                                className: "font-serif text-2xl lg:text-3xl text-ink mb-3 transition-colors duration-quick group-hover:text-accent-text",
                                style: {
                                  fontVariationSettings: getFraunces("sub"),
                                  lineHeight: 1.15
                                },
                                children: post.title
                              }
                            ),
                            /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base text-ink-soft leading-relaxed flex-1", children: post.description }),
                            /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-5 border-t border-rule editorial-mono-caption text-ink-faint flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: post.author }),
                              /* @__PURE__ */ jsx("span", { className: "text-accent-text whitespace-nowrap", children: "Les artikkel →" })
                            ] })
                          ] })
                        ]
                      }
                    )
                  },
                  post.slug
                ))
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex lg:hidden items-center gap-3 justify-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy(-1),
              disabled: !canScrollLeft,
              "aria-label": "Forrige artikkel",
              className: "inline-flex items-center justify-center w-12 h-12 border border-hairline-strong rounded-sm text-ink disabled:opacity-30",
              children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => scrollBy(1),
              disabled: !canScrollRight,
              "aria-label": "Neste artikkel",
              className: "inline-flex items-center justify-center w-12 h-12 border border-hairline-strong rounded-sm text-ink disabled:opacity-30",
              children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          )
        ] })
      ] })
    }
  );
};
const steps = [
  {
    step: "01",
    title: "Søknad",
    description: "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart."
  },
  {
    step: "02",
    title: "Godkjenning",
    description: "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie."
  },
  {
    step: "03",
    title: "Bekreftelse",
    description: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller (vaktmester, renhold, vekter) varsles automatisk."
  },
  {
    step: "04",
    title: "Oppfølging",
    description: "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform."
  }
];
const HowItWorksSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "funksjonalitet",
      className: "py-14 lg:py-20 bg-paper-deep/40",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "IV. FUNKSJONALITET" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
            "Booking med",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: {
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
                },
                children: "få steg."
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-xl text-ink-soft italic",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Fra forespørsel til oppgjør: én sammenhengende prosess."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          motion.ol,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: viewportOnce,
            variants: staggerParent,
            className: "relative border-l border-rule pl-10 lg:pl-14",
            children: steps.map((s, idx) => /* @__PURE__ */ jsxs(
              motion.li,
              {
                variants: staggerChild,
                className: `relative grid grid-cols-12 gap-6 lg:gap-gutter py-12 lg:py-16 ${idx > 0 ? "border-t border-rule" : ""}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: "absolute -left-[2.75rem] lg:-left-[3.75rem] top-12 lg:top-16 inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-paper border border-hairline-strong rounded-sm font-mono text-xs tracking-widest text-accent-text tabular-nums",
                      children: s.step
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-4", children: [
                    /* @__PURE__ */ jsxs("span", { className: "editorial-mono-caption text-ink-faint mb-3 block", children: [
                      "STEG ",
                      s.step,
                      " / ",
                      String(steps.length).padStart(2, "0")
                    ] }),
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: "font-serif text-3xl lg:text-5xl text-ink",
                        style: {
                          fontVariationSettings: getFraunces("section"),
                          lineHeight: 1.05,
                          letterSpacing: "-0.015em"
                        },
                        children: s.title
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-8", children: /* @__PURE__ */ jsx("p", { className: "text-lg lg:text-xl text-ink-soft measure leading-relaxed", children: s.description }) })
                ]
              },
              s.step
            ))
          }
        )
      ] })
    }
  );
};
const integrations = [
  { name: "Vipps", category: "Betaling", status: "AKTIV", version: "mobile + web" },
  { name: "Stripe Connect", category: "Betaling", status: "AKTIV", version: "Express" },
  { name: "BankID", category: "Autentisering", status: "AKTIV", version: "Signicat" },
  { name: "ID-porten", category: "Autentisering", status: "AKTIV" },
  { name: "Altinn", category: "Offentlig", status: "AKTIV" },
  { name: "EHF / Peppol", category: "Fakturering", status: "AKTIV" },
  { name: "Visma eAccounting", category: "Regnskap", status: "AKTIV" },
  { name: "RCO booking", category: "Booking-import", status: "AKTIV", version: "migrasjon" },
  { name: "Tripletex", category: "Regnskap", status: "AKTIV" },
  { name: "Fiken", category: "Regnskap", status: "AKTIV" },
  { name: "PowerOffice", category: "Regnskap", status: "AKTIV" },
  { name: "DNB Regnskap", category: "Regnskap", status: "AKTIV" },
  { name: "Microsoft 365 / Outlook", category: "Kalender", status: "AKTIV" },
  { name: "Salto KS", category: "Adgangskontroll", status: "PILOT" },
  { name: "ISO 27001 & 27701", category: "Samsvar", status: "AKTIV" },
  { name: "GDPR", category: "Samsvar", status: "AKTIV" },
  { name: "WCAG 2.0 AA", category: "Universell utforming", status: "AKTIV" }
];
const IntegrationsSection = () => {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "integrasjoner",
      className: "py-14 lg:py-20 bg-paper",
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "V. INTEGRASJONER" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-16", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
            "Tilkoblet det",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: {
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
                },
                children: "norske"
              }
            ),
            " ",
            "landskapet."
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-xl text-ink-soft italic",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Betaling, autentisering, regnskap og samsvar, bygget for norske utleiere fra første dag."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          "ul",
          {
            role: "list",
            "aria-label": "Integrasjoner og samsvar",
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule",
            children: integrations.map((row) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "bg-paper p-6 lg:p-7 flex items-start gap-5",
                children: [
                  /* @__PURE__ */ jsx(IntegrationLogo, { brand: row.name, size: "lg", iconOnly: true }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        className: "font-sans text-lg font-medium text-ink leading-tight truncate",
                        title: row.name,
                        children: row.name
                      }
                    ),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-ink-soft leading-snug", children: [
                      row.category,
                      row.version && /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: " · " }),
                        /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-ink-faint", children: row.version })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `mt-3 inline-block font-mono text-[0.7rem] tracking-widest ${row.status === "AKTIV" ? "text-accent-text" : row.status === "PILOT" ? "text-ochre" : "text-ink-faint"}`,
                        children: row.status
                      }
                    )
                  ] })
                ]
              },
              row.name
            ))
          }
        )
      ] })
    }
  );
};
const stacks = [
  {
    id: "01",
    Icon: Layers,
    category: "Frontend",
    tagline: "Reaktivt React-grensesnitt med Digdir Designsystemet og tilgjengelig komponentbibliotek.",
    items: [
      { name: "React", value: "19" },
      { name: "React Router", value: "7" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Tailwind CSS", value: "3.x" },
      { name: "Vite", value: "5.x" },
      { name: "Digdir Designsystemet", value: "latest" },
      { name: "Framer Motion", value: "11.x" },
      { name: "React Native", value: "0.74 (mobil)" }
    ]
  },
  {
    id: "02",
    Icon: Server,
    category: "Backend",
    tagline: "Reaktiv runtime med transaksjonell hendelseslogg, RBAC og auditspor på hver mutasjon.",
    items: [
      { name: "Convex", value: "self-hosted" },
      { name: "Node.js", value: "20 LTS" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Zod", value: "skjemavalidering" },
      { name: "Outbox event bus", value: "transaksjonell" },
      { name: "Audit log", value: "per mutasjon" },
      { name: "RBAC", value: "5-nivå hierarki" },
      { name: "Cron + scheduler", value: "22 jobber" }
    ]
  },
  {
    id: "03",
    Icon: Database,
    category: "Data & integrasjon",
    tagline: "PostgreSQL i EU, sanntid via Convex, integrasjoner mot Vipps, BankID og regnskap.",
    items: [
      { name: "PostgreSQL", value: "16" },
      { name: "Datalokasjon", value: "Norge / EU" },
      { name: "Backup", value: "RPO 15 min" },
      { name: "Vipps + Stripe Connect", value: "betaling" },
      { name: "BankID + ID-porten", value: "innlogging" },
      { name: "EHF / Peppol", value: "fakturering" },
      { name: "Regnskap (Visma · Tripletex · Fiken · …)", value: "6 leverandører" },
      { name: "Salto KS digital nøkkel", value: "adgang" }
    ]
  },
  {
    id: "04",
    Icon: ShieldCheck,
    category: "Sikkerhet & etterlevelse",
    tagline: "Bygget for norske krav: ISO-sertifisert, GDPR-kompatibel, WCAG-testet og pentestet årlig.",
    items: [
      { name: "ISO 27001", value: "sertifisert" },
      { name: "ISO 27701", value: "sertifisert" },
      { name: "GDPR", value: "kompatibel" },
      { name: "WCAG 2.1 AA", value: "implementert" },
      { name: "TLS 1.3 + AES-256-GCM", value: "påkrevd" },
      { name: "Penetrasjonstest", value: "årlig (3.-part)" },
      { name: "OWASP Top 10", value: "mitigering" },
      { name: "Step-up MFA", value: "sensitive ops" }
    ]
  }
];
const reliabilityPillars = [
  {
    Icon: Activity,
    eyebrow: "Overvåking",
    title: "24/7 driftsovervåking",
    body: "Helsesjekker hvert 30. sekund. Avvik som overskrider terskel sender automatisk varsel til vakt, på SMS, e-post og dashbord. Statusside oppdateres uten manuell innsats.",
    spec: [
      { label: "Sjekkfrekvens", value: "30 s" },
      { label: "Alarm kanaler", value: "SMS · e-post · Slack" }
    ]
  },
  {
    Icon: Database,
    eyebrow: "Backup",
    title: "Backup hvert 15. minutt",
    body: "Point-in-time recovery med 35 dagers oppbevaring. Backup ligger i samme EU-region som primær. Restoreøvelse hvert kvartal med dokumentert prosedyre.",
    spec: [
      { label: "RPO", value: "15 min" },
      { label: "RTO", value: "≤ 4 t" }
    ]
  },
  {
    Icon: RefreshCw,
    eyebrow: "Failover",
    title: "Multi-sone redundans",
    body: "Drift kjører i to soner i samme EU-region. Failover er automatisk og uten varsel ved infrastruktursvikt. Ingen data forlater EØS.",
    spec: [
      { label: "Soner", value: "2 × EU" },
      { label: "DNS TTL", value: "60 s" }
    ]
  },
  {
    Icon: Shield,
    eyebrow: "Sikkerhet",
    title: "Defense-in-depth",
    body: "WAF, rate-limit, RBAC, audit, kryptert databasekolonner og step-up-autentisering for sensitive operasjoner. Penetrasjonstest minst årlig av tredjepart.",
    spec: [
      { label: "Pentest", value: "årlig (3.-part)" },
      { label: "Hemmeligheter", value: "AES-256-GCM + AAD" }
    ]
  },
  {
    Icon: ScrollText,
    eyebrow: "Revisjon",
    title: "Audit-spor på hver mutasjon",
    body: "Hver booking, godkjenning, prisendring og slettehandling skrives uforanderlig til audit-loggen. Eksport til kommunens systemer ved kontroll.",
    spec: [
      { label: "Logg-retensjon", value: "7 år" },
      { label: "Eksport", value: "JSON · CSV" }
    ]
  },
  {
    Icon: Lock,
    eyebrow: "Datalokasjon",
    title: "Lagret i Norge og EU",
    body: "Alle persondata og forretningsdata ligger i EU. Ingen kryssjurisdiksjon, ingen amerikansk CLOUD Act-eksponering. Standard databehandleravtale inkludert.",
    spec: [
      { label: "Datalokasjon", value: "EU · NO" },
      { label: "Underleverandører", value: "EØS-godkjente" }
    ]
  }
];
const complianceGroups = [
  {
    Icon: Eye,
    eyebrow: "Universell utforming",
    title: "WCAG 2.1 AA",
    body: "Pliktig etter Likestillings- og diskrimineringsloven § 17a og forskrift om universell utforming av IKT.",
    items: [
      { label: "WCAG 2.1 AA", status: "Implementert" },
      { label: "WCAG 2.2 AA-kriterier", status: "Pågående" },
      { label: "Tilgjengelighetserklæring (Digdir)", status: "Publisert" },
      { label: "Axe-core automatiserte tester", status: "Per deploy" },
      { label: "Skjermleser-testing (NVDA, VoiceOver)", status: "Manuell QA" },
      { label: "Tastaturnavigasjon", status: "Fullstendig" }
    ]
  },
  {
    Icon: Lock,
    eyebrow: "Informasjonssikkerhet",
    title: "ISO 27001 + OWASP",
    body: "Sertifisert informasjonssikkerhetsstyring med årlig tredjepartsrevisjon og kontinuerlig penetrasjonstesting.",
    items: [
      { label: "ISO 27001 sertifisert", status: "Aktiv" },
      { label: "OWASP Top 10-mitigering", status: "Implementert" },
      { label: "Penetrasjonstest (3.-part)", status: "Årlig" },
      { label: "TLS 1.3 + AES-256-GCM", status: "Påkrevd" },
      { label: "Step-up autentisering", status: "Implementert" },
      { label: "Rate limiting + WAF", status: "Aktiv" }
    ]
  },
  {
    Icon: Users,
    eyebrow: "Personvern",
    title: "GDPR + ISO 27701",
    body: "Personvernforordningen, ISO 27701-sertifisering, standard databehandleravtale og dokumentert behandlingsregister.",
    items: [
      { label: "ISO 27701 sertifisert", status: "Aktiv" },
      { label: "GDPR-kompatibel", status: "Verifisert" },
      { label: "DPIA per modul", status: "Dokumentert" },
      { label: "Rett til sletting + innsyn", status: "Implementert" },
      { label: "Databehandleravtale (DPA)", status: "Standard" },
      { label: "Datalokasjon EU/Norge", status: "Garantert" }
    ]
  },
  {
    Icon: Building2,
    eyebrow: "Offentlig sektor",
    title: "DigDir + Anskaffelse",
    body: "Bygget for norsk forvaltning: ID-porten, Altinn, EHF, BRREG og SSA-L 2026-kontraktsmal.",
    items: [
      { label: "ID-porten / BankID (eIDAS)", status: "Implementert" },
      { label: "EHF / Peppol-fakturering", status: "Implementert" },
      { label: "BRREG-verifisering", status: "Aktiv" },
      { label: "Digdir Designsystemet", status: "Brukes" },
      { label: "Arkivverdig hendelseslogg", status: "Innebygd" },
      { label: "SSA-L 2026-bilag", status: "Klar" }
    ]
  }
];
const slaStats = [
  { value: "99,9", unit: "%", label: "Oppetid SLA" },
  { value: "<200", unit: "ms", label: "API p95" },
  { value: "15", unit: "min", label: "RPO backup" },
  { value: "≤4", unit: "t", label: "RTO gjenoppretting" },
  { value: "AA", unit: "", label: "WCAG 2.0" },
  { value: "100", unit: "%", label: "TypeScript strict" }
];
const TechnologyStackSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "teknologi", className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "VI. TEKNOLOGI" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
        "Bygget for",
        " ",
        /* @__PURE__ */ jsx(
          "em",
          {
            className: "italic",
            style: {
              fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
            },
            children: "pålitelighet."
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Teknologivalg som er etterprøvbare i drift, dokumentasjon og kontrakt."
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule mb-16 lg:mb-20", children: reliabilityPillars.map(({ Icon, eyebrow, title, body, spec }) => /* @__PURE__ */ jsxs(
      "article",
      {
        className: "group bg-paper p-7 lg:p-9 flex flex-col h-full transition-colors duration-quick ease-editorial hover:bg-paper-deep/40",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-9 h-9 border border-hairline-strong rounded-sm text-accent-text", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: eyebrow })
          ] }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "font-serif text-2xl text-ink mb-3",
              style: {
                fontVariationSettings: getFraunces("sub"),
                lineHeight: 1.15
              },
              children: title
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base text-ink-soft leading-relaxed flex-1", children: body }),
          /* @__PURE__ */ jsx("dl", { className: "mt-6 pt-5 border-t border-rule space-y-2", children: spec.map((row) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-baseline justify-between gap-3 editorial-mono-caption",
              children: [
                /* @__PURE__ */ jsx("dt", { className: "text-ink-faint", children: row.label }),
                /* @__PURE__ */ jsx("dd", { className: "text-ink tabular-nums", children: row.value })
              ]
            },
            row.label
          )) })
        ]
      },
      title
    )) }),
    /* @__PURE__ */ jsxs(
      "figure",
      {
        "aria-labelledby": "driftsprinsipp",
        className: "my-16 lg:my-24 relative isolate",
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -top-6 lg:-top-10 left-4 lg:left-10 font-serif text-[10rem] lg:text-[16rem] leading-none text-accent-text/15 select-none pointer-events-none",
              style: {
                fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 60'
              },
              children: "“"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "rule-h bg-rule" }),
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-16", children: [
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 hidden lg:flex items-start", children: /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "DRIFTSPRINSIPP" }) }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-9", children: [
              /* @__PURE__ */ jsxs(
                "blockquote",
                {
                  id: "driftsprinsipp",
                  className: "font-serif text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] text-ink leading-[1.18]",
                  style: {
                    fontVariationSettings: '"opsz" 96, "wght" 380, "SOFT" 40, "WONK" 0',
                    letterSpacing: "-0.018em"
                  },
                  children: [
                    "Hver teknologi plattformen bygger på må kunne",
                    " ",
                    /* @__PURE__ */ jsx("em", { className: "italic", children: "dokumenteres" }),
                    ",",
                    " ",
                    /* @__PURE__ */ jsx("em", { className: "italic", children: "sertifiseres" }),
                    " og",
                    " ",
                    /* @__PURE__ */ jsx("em", { className: "italic", children: "forsvares" }),
                    ".",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight", children: "Postgres" }),
                    " ",
                    "for data,",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight", children: "Convex" }),
                    " ",
                    "for sanntid,",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight", children: "ID-porten" }),
                    " ",
                    "for innbyggertilgang, valg som holder gjennom drift, revisjon og kontrakt."
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("figcaption", { className: "mt-8 lg:mt-10 flex items-center gap-3 editorial-mono-caption", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block w-8 h-px bg-accent-text" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: "Ibrahim Rahmani" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "·" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "CTO, Xala Technologies" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rule-h bg-rule" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-16 lg:mb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 lg:mb-8 border-b border-rule pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "KRAV · SAMSVAR · SERTIFISERINGER" }),
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "REV. 2026.05" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(
          "h3",
          {
            className: "font-serif text-3xl lg:text-5xl text-ink",
            style: {
              fontVariationSettings: getFraunces("section"),
              letterSpacing: "-0.015em",
              lineHeight: 1.08
            },
            children: [
              "Krav vi",
              " ",
              /* @__PURE__ */ jsx(
                "em",
                {
                  className: "italic",
                  style: {
                    fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
                  },
                  children: "oppfyller"
                }
              ),
              "."
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft measure leading-relaxed", children: "Plattformen oppfyller norsk og europeisk regelverk for offentlig sektor: universell utforming, informasjonssikkerhet, personvern og digital forvaltning. Hver kategori er dokumentert og kan etterprøves i tilbudsfasen." }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-px bg-rule border border-rule", children: complianceGroups.map(({ Icon, eyebrow, title, body, items }) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: "bg-paper p-7 lg:p-10 flex flex-col",
          children: [
            /* @__PURE__ */ jsxs("header", { className: "mb-6 pb-5 border-b border-rule", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-accent-text", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: eyebrow })
              ] }),
              /* @__PURE__ */ jsx(
                "h4",
                {
                  className: "font-serif text-2xl lg:text-3xl text-ink mb-3",
                  style: {
                    fontVariationSettings: getFraunces("sub"),
                    lineHeight: 1.15
                  },
                  children: title
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base text-ink-soft leading-relaxed measure", children: body })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-baseline justify-between gap-3 py-1 border-b border-rule/40",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-2 text-sm lg:text-base text-ink", children: [
                    /* @__PURE__ */ jsx(
                      FileCheck,
                      {
                        className: "h-3.5 w-3.5 text-accent-text translate-y-0.5 shrink-0",
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: item.label })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint whitespace-nowrap", children: item.status })
                ]
              },
              item.label
            )) })
          ]
        },
        title
      )) }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 editorial-mono-caption text-ink-faint", children: "Sertifikater og revisjonsrapporter utleveres ved tilbudsforespørsel under NDA." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-16 lg:mb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 lg:mb-8 border-b border-rule pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "TEKNOLOGISTABEL · FULL OVERSIKT" }),
        /* @__PURE__ */ jsxs("span", { className: "editorial-mono-caption text-ink-faint", children: [
          stacks.reduce((sum, s) => sum + s.items.length, 0),
          " VALG"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-px bg-rule border border-rule", children: stacks.map((s) => {
        const Icon = s.Icon;
        return /* @__PURE__ */ jsxs(
          "article",
          {
            className: "group relative bg-paper p-7 lg:p-10 flex flex-col transition-colors duration-quick ease-editorial hover:bg-paper-deep/40",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "absolute left-0 top-0 bottom-0 w-px bg-accent-text scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-normal ease-editorial"
                }
              ),
              /* @__PURE__ */ jsxs("header", { className: "mb-6 pb-5 border-b border-rule", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-ink-faint tracking-widest tabular-nums", children: [
                    s.id,
                    " / 04"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "editorial-mono-caption text-ink-faint", children: [
                    s.items.length,
                    " valg"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-accent-text shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "font-serif text-2xl lg:text-3xl text-ink",
                      style: {
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1
                      },
                      children: s.category
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base text-ink-soft leading-relaxed measure", children: s.tagline })
              ] }),
              /* @__PURE__ */ jsx("dl", { className: "space-y-2.5", children: s.items.map((it) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-baseline gap-3 py-1.5 border-b border-rule/50 last:border-b-0",
                  children: [
                    /* @__PURE__ */ jsx("dt", { className: "shrink-0 font-mono text-xs uppercase tracking-widest text-ink-faint", children: it.name }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "flex-1 border-b border-dotted border-rule translate-y-[-3px]"
                      }
                    ),
                    /* @__PURE__ */ jsx("dd", { className: "shrink-0 font-mono text-sm text-accent-text tabular-nums whitespace-nowrap", children: it.value })
                  ]
                },
                it.name
              )) })
            ]
          },
          s.category
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-5 border-b border-rule pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "KLAUSULER · MÅLBARE" }),
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "SLA 2026.05" })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: viewportOnce,
          variants: staggerParent,
          className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-rule border border-rule overflow-hidden",
          children: slaStats.map((s) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              variants: staggerChild,
              className: "group relative bg-paper px-5 lg:px-6 py-9 lg:py-12 flex flex-col items-start gap-4 transition-colors duration-quick ease-editorial hover:bg-paper-deep/50",
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "absolute left-0 top-0 h-px w-0 bg-accent-text group-hover:w-full transition-[width] duration-slow ease-editorial"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif text-4xl lg:text-5xl xl:text-6xl text-accent-text tabular-nums",
                      style: {
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.03em",
                        lineHeight: 0.95
                      },
                      children: s.value
                    }
                  ),
                  s.unit && /* @__PURE__ */ jsx("span", { className: "font-mono text-base lg:text-lg text-ink-faint", children: s.unit })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: s.label })
              ]
            },
            s.label
          ))
        }
      )
    ] })
  ] }) });
};
const clients = [
  {
    id: "web",
    label: "Web",
    sub: "Innbygger-app · Digdir designsystem",
    Icon: Monitor
  },
  {
    id: "dashboard",
    label: "Dashboard",
    sub: "Admin · multi-tenant · RBAC",
    Icon: LayoutDashboard
  },
  {
    id: "mobile",
    label: "Mobil",
    sub: "iOS · iPadOS · Android (RN)",
    Icon: Smartphone
  }
];
const runtime = {
  id: "convex",
  label: "Convex",
  sub: "Reaktiv runtime: sanntid uten polling",
  Icon: Zap,
  marker: 1
};
const infra = [
  {
    id: "postgres",
    label: "PostgreSQL 16",
    sub: "Lagret i Norge og EU",
    Icon: Database
  },
  {
    id: "outbox",
    label: "Outbox-buss",
    sub: "Transaksjonelle hendelser",
    Icon: GitBranch,
    marker: 2
  },
  {
    id: "audit",
    label: "Revisjon",
    sub: "Audit-log + RBAC",
    Icon: ScrollText,
    marker: 3
  },
  {
    id: "integrations",
    label: "Integrasjoner",
    sub: "Vipps · BankID · Visma · EHF · RCO",
    Icon: Plug
  }
];
const ArchNode = ({
  node,
  size = "md"
}) => {
  const Icon = node.Icon;
  const isLg = size === "lg";
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: `group relative bg-paper border border-hairline-strong rounded-sm flex flex-col h-full transition-all duration-quick ease-editorial hover:border-ink hover:shadow-hairline ${isLg ? "p-6 lg:p-8" : "p-5 lg:p-6"}`,
      children: [
        node.marker && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute -top-3 -right-3 inline-flex items-center justify-center w-7 h-7 bg-navy text-on-navy rounded-full font-mono text-[11px] tabular-nums shadow-hairline",
            children: node.marker
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-3 lg:gap-4 ${isLg ? "mb-2" : "mb-1.5"}`,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-flex items-center justify-center border border-hairline-strong rounded-sm text-accent-text shrink-0 ${isLg ? "w-14 h-14" : "w-11 h-11 lg:w-12 lg:h-12"}`,
                  children: /* @__PURE__ */ jsx(
                    Icon,
                    {
                      className: isLg ? "h-7 w-7" : "h-5 w-5 lg:h-6 lg:w-6",
                      strokeWidth: 1.5,
                      "aria-hidden": "true"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: `font-serif text-ink leading-tight ${isLg ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"}`,
                  style: {
                    fontVariationSettings: getFraunces("sub"),
                    letterSpacing: "-0.015em"
                  },
                  children: node.label
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `text-ink-soft leading-snug ${isLg ? "text-base lg:text-lg" : "text-sm lg:text-base"}`,
            children: node.sub
          }
        )
      ]
    }
  );
};
const ArchitectureSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "arkitektur", className: "py-16 lg:py-24 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "VII. ARKITEKTUR" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-16", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", children: "Schema." }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Tre klienter mot én reaktiv runtime, med transaksjonell hendelsesbus og fullstendig revisjon."
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("figure", { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative bg-paper-deep/40 border border-hairline-strong rounded-sm p-6 sm:p-10 lg:p-14 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            "aria-hidden": "true",
            className: "absolute inset-0 w-full h-full pointer-events-none text-ink/[0.04]",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx(
                "pattern",
                {
                  id: "arch-grid",
                  width: "48",
                  height: "48",
                  patternUnits: "userSpaceOnUse",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M 48 0 L 0 0 0 48",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("rect", { width: "100%", height: "100%", fill: "url(#arch-grid)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 lg:mb-5", children: [
            /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "I · KLIENTER" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-rule" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10", children: clients.map((n) => /* @__PURE__ */ jsx(ArchNode, { node: n }, n.id)) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "relative h-12 lg:h-16 mb-4 lg:mb-5",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "absolute inset-0 w-full h-full text-rule-strong",
                  preserveAspectRatio: "none",
                  viewBox: "0 0 600 64",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 100 0 V 32 H 300 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 300 0 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 500 0 V 32 H 300 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 lg:mb-5", children: [
            /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "II · REAKTIV RUNTIME" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-rule" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto mb-8 lg:mb-10", children: /* @__PURE__ */ jsx(ArchNode, { node: runtime, size: "lg" }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "relative h-12 lg:h-16 mb-4 lg:mb-5",
              children: /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "absolute inset-0 w-full h-full text-rule-strong",
                  preserveAspectRatio: "none",
                  viewBox: "0 0 600 64",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 300 0 V 32 H 75 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 300 0 V 32 H 225 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 300 0 V 32 H 375 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 300 0 V 32 H 525 V 64",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "0.5"
                      }
                    )
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 lg:mb-5", children: [
            /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "III · LAGRING · BUSS · SAMSVAR · INTEGRASJONER" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-rule" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: infra.map((n) => /* @__PURE__ */ jsx(ArchNode, { node: n }, n.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("figcaption", { className: "mt-4 flex items-baseline justify-between editorial-mono-caption", children: [
        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "FIG. II · Systemarkitektur (forenklet)" }),
        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "3 KLIENTER · 1 RUNTIME · 4 TJENESTER" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 lg:mt-16 grid lg:grid-cols-3 gap-6 lg:gap-8", children: [
      /* @__PURE__ */ jsxs(Sidenote, { marker: 1, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Convex" }),
        " ",
        "er en reaktiv runtime: spørringer abonnerer på data og oppdateres umiddelbart når underliggende tabeller endres, uten polling, uten refresh."
      ] }),
      /* @__PURE__ */ jsxs(Sidenote, { marker: 2, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Outbox-bussen" }),
        " ",
        "sikrer transaksjonell publisering: hendelsen lagres i samme transaksjon som mutasjonen, og distribueres deretter til abonnenter med backoff og dead-letter."
      ] }),
      /* @__PURE__ */ jsxs(Sidenote, { marker: 3, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Revisjonsloggen" }),
        " ",
        "registrerer hver mutasjon (booking, godkjenning, prisendring, sletting) med tidsstempel, brukerident og endringsdetaljer. Uforanderlig og eksporterbar."
      ] })
    ] })
  ] }) });
};
const fakta = [
  { Icon: Building, label: "UTGIVER", value: "Xala Technologies AS" },
  { Icon: MapPin, label: "KONTOR", value: "Nesbruveien 75, Nesbru" },
  { Icon: Calendar, label: "ETABLERT", value: "2024" },
  { Icon: Languages, label: "SPRÅK", value: "Bokmål · Nynorsk · English" },
  { Icon: Shield, label: "SERTIFISERT", value: "ISO 27001 · ISO 27701" },
  { Icon: Code2, label: "STACK", value: "Convex · React 19 · PostgreSQL" }
];
const timeline = [
  {
    year: "2024",
    title: "Etablert",
    body: "Xala Technologies starter arbeidet med Digilist, én plattform for det norske utleiemarkedet."
  },
  {
    year: "2025",
    title: "Første kunder",
    body: "Rønningen Selskapslokale og andre private utleiere går i drift. Sanntid, Vipps, BankID og EHF i produksjon."
  },
  {
    year: "2025",
    title: "Kommune live",
    body: "Nordre Follo kommune tar i bruk plattformen for 12 anlegg, sesongleie og ID-porten-innlogging."
  },
  {
    year: "2026",
    title: "SSA-L 2026 klar",
    body: "Plattformen oppfyller SSA-L 2026-kravene. Norske kommuner kan ta i bruk Digilist gjennom offentlig anskaffelse."
  }
];
const creed = [
  {
    n: "I",
    Icon: Flag,
    title: "Norsk fra grunnen",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir-designsystemet er innebygd, ikke bolt-on på en amerikansk SaaS."
  },
  {
    n: "II",
    Icon: Lock,
    title: "Datasuverenitet",
    body: "All data lagres i Norge og EU. Ingen CLOUD Act-eksponering, ingen kryssjurisdiksjon, full GDPR-suverenitet."
  },
  {
    n: "III",
    Icon: ClipboardCheck,
    title: "Etterprøvbar",
    body: "Hver mutasjon revisjonsspores. Hver beslutning kan forsvares i kontrakt, i drift og i revisjon."
  },
  {
    n: "IV",
    Icon: Layers,
    title: "Sammenhengende",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og rapportering i én plattform, ikke fem integrerte verktøy."
  }
];
const AboutUsSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "om-oss", className: "py-16 lg:py-24 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "VIII. KOLOFON" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 lg:col-start-2", children: [
        /* @__PURE__ */ jsx(
          Byline,
          {
            author: "Xala Technologies AS",
            role: "Utgiver",
            date: "Oslo, 2026",
            className: "mb-10"
          }
        ),
        /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", className: "mb-10", children: [
          "Om",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: {
                fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0'
              },
              children: "Digilist."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose-editorial text-ink-soft text-lg lg:text-xl leading-relaxed space-y-6", children: [
          /* @__PURE__ */ jsx(DropCap, { children: "Digilist er en SaaS-plattform for det norske utleiemarkedet, utviklet av Xala Technologies AS. Plattformen samler booking, betaling, kalender, rapportering og integrasjoner mot offentlige tjenester i én løsning, bygd for både private utleiere, kulturhus, foreninger og kommuner." }),
          /* @__PURE__ */ jsxs("p", { children: [
            "Vi tror norske utleiere fortjener verktøy som passer det norske landskapet: Vipps og BankID til betaling og autentisering, EHF og Peppol til fakturering, ID-porten til innbyggerautentisering, ISO 27001 og GDPR til samsvar.",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: { fontVariationSettings: '"opsz" 16, "wght" 420, "SOFT" 60' },
                children: "Ikke amerikansk SaaS oversatt til bokmål,"
              }
            ),
            " ",
            "men en plattform bygd fra grunnen for norske krav."
          ] }),
          /* @__PURE__ */ jsx("p", { children: "Plattformen kjører på Convex og PostgreSQL, hostet i Norge og EU. Hver mutasjon revisjonsspores. Hver komponent isoleres. Tilgang kontrolleres med RBAC og step-up-autentisering for sensitive operasjoner." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("aside", { className: "lg:col-span-3 lg:col-start-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper border border-hairline-strong rounded-sm p-7 lg:p-8 lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 pb-4 border-b border-rule", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "font-serif text-xl lg:text-2xl text-ink",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Fakta"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "FIG. VIII" })
        ] }),
        /* @__PURE__ */ jsx("dl", { className: "space-y-5", children: fakta.map(({ Icon, label, value }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 border border-hairline-strong rounded-sm text-accent-text shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("dt", { className: "editorial-mono-caption text-ink-faint mb-1", children: label }),
            /* @__PURE__ */ jsx(
              "dd",
              {
                className: "font-serif text-base text-ink leading-snug",
                style: {
                  fontVariationSettings: '"opsz" 24, "wght" 420'
                },
                children: value
              }
            )
          ] })
        ] }, label)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-16 lg:mb-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-8 lg:mb-10 border-b border-rule pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "HVA VI TROR · DIGILIST-PROGRAM" }),
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "IV PRINSIPPER" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule", children: creed.map(({ n, Icon, title, body }) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: "group bg-paper p-8 lg:p-10 flex flex-col transition-colors duration-quick ease-editorial hover:bg-paper-deep/40",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3 mb-6", children: [
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "font-serif text-2xl text-accent-text tabular-nums leading-none",
                  style: {
                    fontVariationSettings: '"opsz" 48, "wght" 480'
                  },
                  "aria-hidden": "true",
                  children: [
                    n,
                    "."
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-rule" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-14 h-14 border border-hairline-strong rounded-sm text-accent-text mb-5", children: /* @__PURE__ */ jsx(
              Icon,
              {
                className: "h-7 w-7",
                strokeWidth: 1.5,
                "aria-hidden": "true"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "h4",
              {
                className: "font-serif text-[1.65rem] lg:text-[1.85rem] text-ink mb-5 break-words hyphens-auto",
                style: {
                  fontVariationSettings: getFraunces("sub"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.05
                },
                children: title
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft leading-relaxed", children: body })
          ]
        },
        n
      )) })
    ] }),
    /* @__PURE__ */ jsxs(
      "figure",
      {
        "aria-labelledby": "manifest",
        className: "relative isolate mb-16 lg:mb-24",
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -top-6 lg:-top-12 left-4 lg:left-10 font-serif text-[10rem] lg:text-[16rem] leading-none text-accent-text/10 select-none pointer-events-none",
              style: {
                fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 60'
              },
              children: "“"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "rule-h bg-rule" }),
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-16", children: [
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 hidden lg:flex items-start", children: /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "MANIFEST" }) }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-9", children: [
              /* @__PURE__ */ jsxs(
                "blockquote",
                {
                  id: "manifest",
                  className: "font-serif text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.18]",
                  style: {
                    fontVariationSettings: '"opsz" 96, "wght" 380, "SOFT" 40, "WONK" 0',
                    letterSpacing: "-0.018em"
                  },
                  children: [
                    "Vi bygger ikke en booking-app for verden,",
                    " ",
                    /* @__PURE__ */ jsx("em", { className: "italic", children: "vi bygger plattformen Norge fortjener" }),
                    ". Én løsning som kommunen kan stole på i drift, og som utleieren ser frem til å bruke en mandag morgen."
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("figcaption", { className: "mt-8 lg:mt-10 flex items-center gap-3 editorial-mono-caption", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block w-8 h-px bg-accent-text" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink", children: "Ibrahim Rahmani" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "·" }),
                /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "CTO, Xala Technologies AS" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rule-h bg-rule" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-8 lg:mb-12 border-b border-rule pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "MILEPÆLER · 2024–2026" }),
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "KRONOLOGI" })
      ] }),
      /* @__PURE__ */ jsx("ol", { className: "relative border-l border-rule pl-8 lg:pl-12", children: timeline.map((step, idx) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: `relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${idx > 0 ? "border-t border-rule" : ""}`,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "absolute -left-[2.25rem] lg:-left-[3.25rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-paper border border-hairline-strong rounded-sm text-accent-text",
                children: /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent-text" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-3", children: /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-mono text-2xl lg:text-3xl text-accent-text tabular-nums",
                style: { letterSpacing: "-0.02em" },
                children: step.year
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-9", children: [
              /* @__PURE__ */ jsx(
                "h4",
                {
                  className: "font-serif text-2xl lg:text-3xl text-ink mb-3",
                  style: {
                    fontVariationSettings: getFraunces("sub"),
                    lineHeight: 1.15
                  },
                  children: step.title
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft leading-relaxed measure", children: step.body })
            ] })
          ]
        },
        `${step.year}-${step.title}`
      )) })
    ] })
  ] }) });
};
const EMPTY = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  role: "",
  message: ""
};
const ROLE_OPTIONS = [
  { value: "kommune", label: "Kommune" },
  { value: "selskapslokale", label: "Selskapslokale / utleier" },
  { value: "idrett", label: "Idrettsanlegg" },
  { value: "kulturhus", label: "Kulturhus / scene" },
  { value: "kontor", label: "Kontor / coworking" },
  { value: "annet", label: "Annet" }
];
const HVA_FAAR_DU = [
  "30–45 minutters demo, tilpasset ditt bruksområde",
  "Gjennomgang av booking, betaling, sesongleie og fakturering",
  "Spørsmål og svar: vi pakker ikke inn standarddemoen vår",
  "Et notat med konkrete neste steg dersom dere vurderer pilot"
];
const HVA_VI_TRENGER = [
  "Type virksomhet og typisk bookingvolum",
  "Eventuelle krav fra anskaffelser eller intern compliance",
  "Hvilke roller som skal se demoen (administrasjon, drift, økonomi)"
];
function BookDemoBlock({
  source,
  showByline = false,
  headingAs = "h2"
}) {
  const SubHeading = headingAs === "h1" ? "h2" : "h3";
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const roleLabel = ((_a = ROLE_OPTIONS.find((r) => r.value === form.role)) == null ? void 0 : _a.label) ?? form.role;
      const payload = {
        name: form.name,
        email: form.email,
        organization: form.organization,
        phone: form.phone,
        persona: form.role || "ukjent",
        topic: "Demo-forespørsel",
        message: form.message,
        summary: `Demo-forespørsel: ${form.organization} (${roleLabel})`,
        source,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error("[book-demo-block] /api/inquiry failed:", err);
      setError(
        "Vi fikk ikke sendt forespørselen. Prøv igjen, eller send e-post direkte til kontakt@digilist.no."
      );
    } finally {
      setSubmitting(false);
    }
  };
  const canSubmit = form.name.trim() && form.email.trim() && form.organization.trim() && form.role && !submitting;
  const inputClass = "block w-full border-0 border-b border-hairline-strong rounded-none bg-transparent px-0 py-3 font-sans text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-navy focus:ring-0 transition-colors duration-quick ease-editorial";
  const labelClass = "editorial-mono-caption text-ink-soft mb-1 block";
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-10 lg:gap-gutter mt-10 lg:mt-14", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
      /* @__PURE__ */ jsxs(EditorialHeading, { as: headingAs, size: "display", className: "mb-6", children: [
        "Book en",
        " ",
        /* @__PURE__ */ jsx(
          "em",
          {
            className: "italic",
            style: { fontVariationSettings: getFraunces("display") },
            children: "demo"
          }
        ),
        "."
      ] }),
      /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic measure leading-relaxed mb-10",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Vi pakker ikke inn en standarddemo. Fortell oss kort hva dere driver med, så viser vi delene som faktisk angår dere."
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: viewportOnce,
          variants: staggerParent,
          className: "space-y-10",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { variants: staggerChild, children: [
              /* @__PURE__ */ jsx(SubHeading, { className: "editorial-mono-caption text-ink-soft mb-4", children: "HVA DU FÅR" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: HVA_FAAR_DU.map((item) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "flex items-start gap-3 text-base text-ink leading-relaxed",
                  children: [
                    /* @__PURE__ */ jsx(
                      CheckCircle2,
                      {
                        className: "h-4 w-4 mt-1 text-accent-text shrink-0",
                        "aria-hidden": "true",
                        strokeWidth: 1.5
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: item })
                  ]
                },
                item
              )) })
            ] }),
            /* @__PURE__ */ jsxs(motion.div, { variants: staggerChild, children: [
              /* @__PURE__ */ jsx(SubHeading, { className: "editorial-mono-caption text-ink-soft mb-4", children: "HVA VI TRENGER FRA DEG" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: HVA_VI_TRENGER.map((item) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "flex items-start gap-3 text-base text-ink leading-relaxed",
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "inline-block w-1.5 h-1.5 mt-2.5 rounded-full bg-accent-text shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: item })
                  ]
                },
                item
              )) })
            ] }),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: staggerChild,
                className: "pt-2 flex flex-wrap items-center gap-3",
                children: [
                  /* @__PURE__ */ jsx(TrustBadge, { children: "Ingen forpliktelser" }),
                  /* @__PURE__ */ jsx(TrustBadge, { children: "Rask respons" }),
                  /* @__PURE__ */ jsx(TrustBadge, { children: "Personlig gjennomgang" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(motion.div, { variants: staggerChild, className: "pt-2", children: /* @__PURE__ */ jsxs("p", { className: "text-base text-ink-soft leading-relaxed measure", children: [
              "Foretrekker du en uformell prat først?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => openChatbot({ mode: "chat" }),
                  className: "underline underline-offset-4 decoration-[0.5px] text-accent-text hover:text-ink transition-colors",
                  children: "Snakk med oss"
                }
              ),
              " ",
              "og få svar i chat på under et minutt i kontortid."
            ] }) }),
            showByline && /* @__PURE__ */ jsx(
              Byline,
              {
                author: "Ibrahim Rahmani",
                role: "Xala Technologies AS · CTO",
                date: "Oslo · 2026"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialCard, { className: "p-8 lg:p-12", children: submitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 lg:py-16", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 border border-hairline-strong rounded-sm mb-6", children: /* @__PURE__ */ jsx(
        CheckCircle2,
        {
          className: "h-8 w-8 text-accent-text",
          "aria-hidden": "true",
          strokeWidth: 1.5
        }
      ) }),
      /* @__PURE__ */ jsx(
        SubHeading,
        {
          className: "font-serif text-3xl lg:text-4xl text-ink mb-4",
          style: {
            fontVariationSettings: getFraunces("section"),
            letterSpacing: "-0.015em"
          },
          children: "Takk, vi tar kontakt."
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-lg text-ink-soft measure mx-auto leading-relaxed mb-8", children: [
        "Forespørselen er sendt til",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: "admin@digilist.no" }),
        ". En av oss svarer innen 24 timer på hverdager, som regel raskere."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "md", href: "/", children: "Tilbake til forsiden" }),
        /* @__PURE__ */ jsx(
          EditorialButton,
          {
            variant: "outline",
            size: "md",
            onClick: () => openChatbot({ mode: "chat" }),
            children: "Snakk med oss imens"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-7", children: [
      /* @__PURE__ */ jsxs("header", { className: "pb-6 border-b border-rule", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "DEMO-FORESPØRSEL" }),
        /* @__PURE__ */ jsx(
          SubHeading,
          {
            className: "font-serif text-2xl lg:text-3xl text-ink mt-2",
            style: {
              fontVariationSettings: getFraunces("section"),
              letterSpacing: "-0.015em",
              lineHeight: 1.15
            },
            children: "Send oss noen detaljer."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${source}-name`, className: labelClass, children: "Navn *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: `${source}-name`,
              type: "text",
              required: true,
              autoComplete: "name",
              value: form.name,
              onChange: handleChange("name"),
              placeholder: "Ola Nordmann",
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${source}-email`, className: labelClass, children: "E-post *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: `${source}-email`,
              type: "email",
              required: true,
              autoComplete: "email",
              value: form.email,
              onChange: handleChange("email"),
              placeholder: "ola@kommune.no",
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${source}-org`, className: labelClass, children: "Organisasjon *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: `${source}-org`,
              type: "text",
              required: true,
              autoComplete: "organization",
              value: form.organization,
              onChange: handleChange("organization"),
              placeholder: "Skien kommune",
              className: inputClass
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${source}-phone`, className: labelClass, children: "Telefon (valgfritt)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: `${source}-phone`,
              type: "tel",
              autoComplete: "tel",
              value: form.phone,
              onChange: handleChange("phone"),
              placeholder: "+47 ...",
              className: inputClass
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: `${source}-role`, className: labelClass, children: "Hvilken type virksomhet? *" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: `${source}-role`,
            required: true,
            value: form.role,
            onChange: handleChange("role"),
            className: inputClass,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Velg …" }),
              ROLE_OPTIONS.map((r) => /* @__PURE__ */ jsx("option", { value: r.value, children: r.label }, r.value))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: `${source}-message`, className: labelClass, children: "Hva er viktig for dere? (valgfritt)" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: `${source}-message`,
            rows: 4,
            value: form.message,
            onChange: handleChange("message"),
            placeholder: "Sesongleie, ID-porten, EHF, antall anlegg, krav fra anskaffelse …",
            className: `${inputClass} resize-none`
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx(
        "div",
        {
          role: "alert",
          className: "border-l-2 border-navy bg-paper-deep/60 px-4 py-3 text-sm text-ink",
          children: error
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-rule", children: [
        /* @__PURE__ */ jsx(
          EditorialButton,
          {
            type: "submit",
            variant: "primary",
            size: "lg",
            disabled: !canSubmit,
            icon: submitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4", "aria-hidden": "true" }),
            children: submitting ? "Sender …" : "Send forespørsel"
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-faint leading-relaxed", children: [
          "Vi følger",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/personvern",
              className: "underline underline-offset-2 decoration-[0.5px] hover:text-ink",
              children: "personvernerklæringen"
            }
          ),
          "."
        ] })
      ] })
    ] }) }) })
  ] });
}
const CTASection = () => {
  return /* @__PURE__ */ jsx("section", { id: "kontakt", className: "relative py-14 lg:py-20 bg-accent-tinted", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "IX. KONTAKT" }),
    /* @__PURE__ */ jsx(BookDemoBlock, { source: "homepage-kontakt" })
  ] }) });
};
const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogPost = /^\/blogg\/[^/]+\/?$/.test(location.pathname);
  const handleNavClick = (hash, e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };
  const navigasjon = [
    { label: "Funksjonalitet", hash: "#funksjonalitet" },
    { label: "Brukerhistorier", hash: "#brukerhistorier" },
    { label: "Teknologi", hash: "#teknologi" },
    { label: "Arkitektur", hash: "#arkitektur" },
    { label: "Om oss", hash: "#om-oss" },
    { label: "Kontakt", hash: "#kontakt" }
  ];
  const ressurser = [
    { label: "Blogg", href: "/blogg" },
    { label: "FAQ", href: "/faq" },
    { label: "Transparens", href: "/transparens" },
    { label: "Booking av lokaler og møterom", href: "/booking-av-lokaler-og-moterom" },
    { label: "Bookingsystem for kommuner", href: "/bookingsystem-kommune" },
    { label: "Pilot for kommuner", href: "/#pilot" }
  ];
  const juridisk = [
    { label: "Personvern", href: "/personvern" },
    { label: "Salgsvilkår", href: "/salgsvilkar" },
    { label: "Cookies", href: "/cookies" }
  ];
  const linkClass = "group inline-flex items-baseline gap-1.5 font-serif text-lg text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial";
  const linkUnderline = "border-b border-rule group-hover:border-ink transition-colors duration-quick ease-editorial pb-0.5";
  const ColumnHeading = ({ children }) => /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-3 mb-6 editorial-mono-caption text-accent-text", children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "w-6 h-px bg-accent-text" }),
    children
  ] });
  return /* @__PURE__ */ jsx("footer", { className: "bg-paper-deep border-t border-hairline-strong", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12 py-16 lg:py-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 pb-10 lg:pb-14 border-b border-rule", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "group inline-flex items-center gap-4 mb-6",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/logo-64.webp",
                  alt: "",
                  "aria-hidden": "true",
                  className: "h-16 lg:h-20 w-auto transition-opacity group-hover:opacity-80"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-start leading-none", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "font-serif text-5xl lg:text-6xl text-ink leading-none",
                    style: {
                      fontVariationSettings: '"opsz" 96, "wght" 460, "SOFT" 25, "WONK" 1',
                      letterSpacing: "-0.02em"
                    },
                    children: "Digilist"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "mt-1 inline-flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: "inline-block w-6 h-px bg-accent-text"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "font-serif italic text-base lg:text-lg text-ink-soft leading-none",
                      style: {
                        fontVariationSettings: '"opsz" 16, "wght" 420, "SOFT" 60'
                      },
                      children: "Enkel booking"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "aria-hidden": "true",
                      className: "inline-block w-1.5 h-1.5 rounded-full bg-accent-text/60"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-2xl lg:text-3xl text-ink-soft italic measure leading-snug",
            style: { fontVariationSettings: getFraunces("sub") },
            children: "Én plattform for norske kommuner og utleiere: booking, betaling, kalender og rapportering, sammenhengende."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 lg:border-l lg:border-rule lg:pl-8 flex flex-col justify-end gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "KONTOR · OSLO-REGIONEN" }),
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: "font-serif text-2xl text-ink leading-snug",
            style: {
              fontVariationSettings: getFraunces("sub"),
              letterSpacing: "-0.01em"
            },
            children: [
              "Nesbruveien 75",
              /* @__PURE__ */ jsx("br", {}),
              "1394 Nesbru"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mt-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "tel:+4796665001",
              className: "group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-ink-faint", children: "T" }),
                /* @__PURE__ */ jsx("span", { className: "border-b border-rule group-hover:border-accent-text pb-0.5", children: "+47 96 66 50 01" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "mailto:kontakt@digilist.no",
              className: "group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-ink-faint", children: "E" }),
                /* @__PURE__ */ jsx("span", { className: "border-b border-rule group-hover:border-accent-text pb-0.5", children: "kontakt@digilist.no" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    !isBlogPost && /* @__PURE__ */ jsx("div", { className: "mb-14 lg:mb-20 bg-accent-tinted border border-hairline-strong rounded-sm px-6 lg:px-10 py-10 lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "NESTE STEG" }),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "mt-3 font-serif text-3xl lg:text-4xl text-ink leading-tight",
            style: {
              fontVariationSettings: getFraunces("section"),
              letterSpacing: "-0.015em"
            },
            children: "Klar for å se Digilist i praksis?"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg text-ink-soft measure leading-relaxed", children: "Book en personlig demo, eller still spørsmål direkte i chat. Vi svarer på under et minutt i kontortid." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-wrap gap-3 lg:justify-end", children: [
        /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "md", href: "/book-demo", children: "Book demo" }),
        /* @__PURE__ */ jsx(
          EditorialButton,
          {
            variant: "outline",
            size: "md",
            onClick: () => openChatbot({ mode: "chat" }),
            children: "Snakk med oss"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Navigasjon", children: [
        /* @__PURE__ */ jsx(ColumnHeading, { children: "I · NAVIGASJON" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3.5", children: navigasjon.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "a",
          {
            href: link.hash,
            onClick: (e) => handleNavClick(link.hash, e),
            className: linkClass,
            children: /* @__PURE__ */ jsx("span", { className: linkUnderline, children: link.label })
          }
        ) }, link.hash)) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Ressurser", children: [
        /* @__PURE__ */ jsx(ColumnHeading, { children: "II · RESSURSER" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3.5", children: ressurser.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: link.href, className: linkClass, children: /* @__PURE__ */ jsx("span", { className: linkUnderline, children: link.label }) }) }, link.href)) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Juridisk", children: [
        /* @__PURE__ */ jsx(ColumnHeading, { children: "III · JURIDISK" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3.5", children: juridisk.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: link.href, className: linkClass, children: /* @__PURE__ */ jsx("span", { className: linkUnderline, children: link.label }) }) }, link.href)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(ColumnHeading, { children: "IV · PLATTFORMEN" }),
        /* @__PURE__ */ jsx("p", { className: "font-serif text-lg text-ink-soft leading-relaxed mb-5 measure-narrow", children: "Logg inn som administrator, kunde eller leverandør i Digilist-plattformen." }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://app.digilist.no",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "group inline-flex items-center gap-2 border border-hairline-strong px-4 py-2.5 rounded-sm font-serif text-lg text-ink hover:bg-paper hover:border-ink transition-all duration-quick ease-editorial",
            style: { fontVariationSettings: getFraunces("sub") },
            children: [
              /* @__PURE__ */ jsx("span", { children: "app.digilist.no" }),
              /* @__PURE__ */ jsx(
                ArrowUpRight,
                {
                  className: "h-4 w-4 text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  "aria-hidden": "true"
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 lg:mt-20 pt-8 border-t border-rule", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "editorial-mono-caption", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-ink", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Digilist"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mx-3 text-ink-faint", children: "·" }),
        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "Et produkt av" }),
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://xala.no",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-ink hover:text-accent-text transition-colors",
            children: "Xala Technologies AS"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint md:text-right", children: "TRYKKET DIGITALT · OSLO · SATT MED FRAUNCES OG PUBLIC SANS" })
    ] }) })
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
      className: "hidden min-[1740px]:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 py-3 px-2 bg-paper/85 backdrop-blur-md border border-hairline-strong rounded-full shadow-[0_6px_24px_-12px_hsl(var(--ink)/0.25)]",
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(LeftRail, { chapters, activeId, onJump: handleJump }),
    false
  ] });
}
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
        faq: [
          {
            question: "Hva er Digilist?",
            answer: "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning."
          },
          {
            question: "Hvilke kommuner og utleiere bruker Digilist?",
            answer: "Digilist brukes av norske kommuner og private utleiere: blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group."
          },
          {
            question: "Hvilke betalingsmetoder støttes?",
            answer: "Digilist støtter Vipps, BankID, Stripe Connect for kort, samt EHF/Peppol-fakturering. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap er aktive."
          },
          {
            question: "Er Digilist GDPR- og ISO-sertifisert?",
            answer: "Ja. Digilist oppfyller GDPR, er ISO 27001 og ISO 27701 sertifisert og følger WCAG 2.0 AA for universell utforming. Data lagres i Norge og EU."
          },
          {
            question: "Hvordan håndteres sesongleie til lag og foreninger?",
            answer: "Digilist har en egen sesongleie-modul med søknadsbehandling, regelstyrt fordeling og rapportering. Lag og foreninger søker via egen portal, og fordelingen kan automatiseres etter kommunens regler."
          },
          {
            question: "Støtter Digilist sanntidstilgjengelighet?",
            answer: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart hos innbyggere og saksbehandlere."
          }
        ],
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
      /* @__PURE__ */ jsx(ValuePropositionSection, {}),
      /* @__PURE__ */ jsx(AudienceSection, {}),
      /* @__PURE__ */ jsx(BrukerhistorierSection, {}),
      /* @__PURE__ */ jsx(PilotInvitationSection, {}),
      /* @__PURE__ */ jsx(BlogPreviewSection, {}),
      /* @__PURE__ */ jsx(HowItWorksSection, {}),
      /* @__PURE__ */ jsx(IntegrationsSection, {}),
      /* @__PURE__ */ jsx(TechnologyStackSection, {}),
      /* @__PURE__ */ jsx(ArchitectureSection, {}),
      /* @__PURE__ */ jsx(AboutUsSection, {}),
      /* @__PURE__ */ jsx(CTASection, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
let hasMountedOnce = false;
const PageTransition = ({ children, className }) => {
  const reduced = useReducedMotion();
  const firstMountRef = useRef(!hasMountedOnce);
  if (firstMountRef.current) hasMountedOnce = true;
  if (reduced) return /* @__PURE__ */ jsx(Fragment, { children });
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: firstMountRef.current ? "visible" : "hidden",
      animate: "visible",
      exit: "exit",
      variants: pageEnter,
      className,
      children
    }
  );
};
const BookDemo = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Book demo av Digilist · Norsk bookingplattform for kommuner og utleiere",
        description: "Be om en gratis 30–45 minutters demo av Digilist. Vi viser hvordan plattformen håndterer ditt bruksområde: kommune, selskapslokale, idrettsanlegg eller kulturhus.",
        canonical: "https://digilist.no/book-demo",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Book demo", url: "https://digilist.no/book-demo" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsx(
        "nav",
        {
          className: "editorial-mono-caption mb-10",
          "aria-label": "Brødsmuler",
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/",
              className: "group inline-flex items-center gap-2 text-accent-text",
              children: [
                /* @__PURE__ */ jsx(
                  ArrowLeft,
                  {
                    className: "h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:-translate-x-1",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "group-hover:underline underline-offset-4 decoration-[0.5px]", children: "Tilbake til forsiden" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(SectionRule, { label: "IX. KONTAKT" }),
      /* @__PURE__ */ jsx(BookDemoBlock, { source: "book-demo", showByline: true, headingAs: "h1" })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const FAQ$2 = [
  {
    question: "Hva er et kommunalt bookingsystem?",
    answer: "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler (idrettshaller, svømmehaller, møterom, kantiner og kulturhus) i sanntid. Plattformen håndterer kalender, godkjenning, betaling, sesongleie og fakturering."
  },
  {
    question: "Oppfyller Digilist SSA-L 2026-kravene?",
    answer: "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering."
  },
  {
    question: "Hvordan håndteres sesongleie for lag og foreninger?",
    answer: "Digilist har egen sesongleie-modul med søknadsportal for lag og foreninger. Saksbehandler får regelstyrt fordelingsforslag som kan justeres og godkjennes. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk."
  },
  {
    question: "Kan kommunen importere bookinger fra eksisterende system?",
    answer: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi kan ta over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen."
  },
  {
    question: "Hvor lagres dataene?",
    answer: "All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er ISO 27001 og ISO 27701-sertifisert, og oppfyller GDPR-kravene."
  },
  {
    question: "Hva koster Digilist for en kommune?",
    answer: "Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tilbyr en gratis demo og pristilbud basert på kommunens spesifikke behov. Kontakt salg på kontakt@digilist.no."
  }
];
const FEATURES = [
  {
    title: "Sanntidskalender",
    body: "Innbyggere og saksbehandlere ser ledig, opptatt og blokkert tid umiddelbart. Endringer fra bookinger, avlysninger eller administrasjon oppdateres uten refresh."
  },
  {
    title: "Sesongleie med regelstyrt fordeling",
    body: "Lag og foreninger søker via egen portal. Saksbehandler får regelstyrt forslag basert på kommunens prioriteringsregler og kan justere før godkjenning."
  },
  {
    title: "Driftsroller varsles automatisk",
    body: "Vaktmestere, renholdspersonell, vektere og andre driftsroller får automatisk varsel ved bookingbekreftelse, endring eller avlysning."
  },
  {
    title: "ID-porten + BankID-innlogging",
    body: "Innbyggere logger inn med ID-porten eller BankID. Lag og foreninger verifiseres via Brønnøysundregisteret (BRREG)."
  },
  {
    title: "EHF / Peppol-fakturering",
    body: "Faktura sendes automatisk via EHF til kommunens regnskapssystem. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap."
  },
  {
    title: "Digital nøkkel (Salto KS)",
    body: "Adgangskontroll med Salto KS digital nøkkel. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt."
  }
];
const SSA_L_CHECKLIST = [
  "Sanntidstilgjengelighet",
  "Sesongleiesøknad og regelstyrt fordeling",
  "ID-porten + BankID-autentisering",
  "BRREG-verifisering av organisasjoner",
  "Digital nøkkel for adgangskontroll",
  "EHF-fakturagrunnlag",
  "Min side for innbyggere",
  "Universell utforming (WCAG 2.0 AA)",
  "ISO 27001 og 27701-sertifisering",
  "Data lagret i Norge og EU (GDPR)",
  "Rapportering på kapasitet og økonomi",
  "Audit-logg på alle endringer"
];
const BookingsystemKommune = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Bookingsystem for kommuner · Digilist | SSA-L 2026 klar",
        description: "Digital bookingplattform for norske kommuner. Sanntidskalender, sesongleie, ID-porten, EHF, ISO 27001. Bygget for SSA-L 2026-krav.",
        canonical: "https://digilist.no/bookingsystem-kommune",
        ogImage: "https://digilist.no/og-image.png",
        faq: FAQ$2,
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Bookingsystem for kommuner", url: "https://digilist.no/bookingsystem-kommune" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { id: "main", children: [
      /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "KOMMUNAL BOOKING · 2026" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
            /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "hero", className: "mb-6", children: [
              "Bookingsystem for",
              " ",
              /* @__PURE__ */ jsx(
                "em",
                {
                  className: "italic",
                  style: { fontVariationSettings: getFraunces("hero") },
                  children: "norske kommuner"
                }
              ),
              "."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl text-ink-soft measure leading-relaxed mb-10", children: [
              "Sanntidskalender, sesongleie, ID-porten-innlogging, EHF-fakturering og automatisk driftsvarsling, i én plattform bygget for",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "SSA-L 2026-krav" }),
              "."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(
                EditorialButton,
                {
                  variant: "primary",
                  size: "lg",
                  href: "/#kontakt",
                  children: "Be om pristilbud"
                }
              ),
              /* @__PURE__ */ jsx(
                EditorialButton,
                {
                  variant: "outline",
                  size: "lg",
                  icon: false,
                  href: "https://app.digilist.no",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: "Åpne plattformen"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxs(EditorialCard, { className: "bg-accent-tinted", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: "font-serif text-2xl text-ink mb-4",
                style: { fontVariationSettings: getFraunces("section") },
                children: "Aktive kommuner"
              }
            ),
            /* @__PURE__ */ jsx(SpecRow, { label: "Nordre Follo", value: "12 anlegg" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Foreninger", value: "~340" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Bookinger / mnd", value: "~1 200" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Datalokasjon", value: "Norge · EU" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "I. SSA-L 2026 KRAV" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 mb-10", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
            "Bygget for offentlig",
            " ",
            /* @__PURE__ */ jsx("em", { className: "italic", children: "anskaffelse" }),
            "."
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-xl text-ink-soft italic",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Hver SSA-L 2026-funksjon dekket fra dag én, ikke som tillegg."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8", children: SSA_L_CHECKLIST.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            CheckCircle2,
            {
              className: "h-5 w-5 mt-0.5 shrink-0 text-accent-text",
              strokeWidth: 1.5,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-base text-ink-soft", children: item })
        ] }, item)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "II. FUNKSJONALITET" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 mb-10", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", children: "Hva kommunen får." }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-xl text-ink-soft italic",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Seks funksjoner som adresserer kjernekrav fra norske kommuner."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule", children: FEATURES.map((f) => /* @__PURE__ */ jsxs("div", { className: "bg-paper p-6 lg:p-8 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "font-serif text-xl text-ink",
              style: { fontVariationSettings: getFraunces("sub"), fontStyle: "normal" },
              children: f.title
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft leading-relaxed", children: f.body })
        ] }, f.title)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "III. NORSKE INTEGRASJONER" }),
        /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-12 gap-8 mb-10", children: /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "section", children: [
          "Tilkoblet kommunens",
          " ",
          /* @__PURE__ */ jsx("em", { className: "italic", children: "eksisterende systemer" }),
          "."
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: [
          "Vipps",
          "BankID",
          "ID-porten",
          "Altinn",
          "EHF / Peppol",
          "Brønnøysund",
          "Visma",
          "Tripletex",
          "Fiken",
          "PowerOffice",
          "Microsoft 365",
          "Salto KS"
        ].map((brand) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "border border-rule rounded-sm p-4 bg-paper",
            children: /* @__PURE__ */ jsx(IntegrationLogo, { brand })
          },
          brand
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-accent-tinted", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "IV. KONTAKT" }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
            /* @__PURE__ */ jsxs(EditorialHeading, { as: "h2", size: "display", className: "mb-6", children: [
              "Be om",
              " ",
              /* @__PURE__ */ jsx("em", { className: "italic", children: "pristilbud" }),
              "."
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-ink-soft measure mb-8", children: "Vi setter sammen et pristilbud basert på antall anlegg, bookingvolum og integrasjoner. Demo på 30–45 minutter, ingen forpliktelser." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
              /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "lg", href: "/#kontakt", children: "Be om demo" }),
              /* @__PURE__ */ jsx(
                EditorialButton,
                {
                  variant: "outline",
                  size: "lg",
                  icon: false,
                  href: "mailto:kontakt@digilist.no",
                  children: "kontakt@digilist.no"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxs(EditorialCard, { className: "bg-paper", children: [
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "font-serif text-xl text-ink mb-4",
                style: { fontVariationSettings: getFraunces("sub"), fontStyle: "normal" },
                children: "Anskaffelsesinformasjon"
              }
            ),
            /* @__PURE__ */ jsx(SpecRow, { label: "Leverandør", value: "Xala Technologies AS" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Org.nr.", value: "Tilgjengelig" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Adresse", value: "Nesbruveien 75, 1394 Nesbru" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "Telefon", value: "+47 96 66 50 01" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "E-post", value: "kontakt@digilist.no" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "SSA-L 2026", value: "Tilpasset" }),
            /* @__PURE__ */ jsx(SpecRow, { label: "ISO 27001/27701", value: "Sertifisert" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "V. SPØRSMÅL OG SVAR" }),
        /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", className: "mb-10", children: "Vanlige spørsmål fra kommuner." }),
        /* @__PURE__ */ jsx("dl", { className: "space-y-8 max-w-4xl", children: FAQ$2.map((q) => /* @__PURE__ */ jsxs("div", { className: "border-b border-rule pb-8", children: [
          /* @__PURE__ */ jsx(
            "dt",
            {
              className: "font-serif text-2xl text-ink mb-3",
              style: {
                fontVariationSettings: getFraunces("section"),
                letterSpacing: "-0.015em"
              },
              children: q.question
            }
          ),
          /* @__PURE__ */ jsx("dd", { className: "text-base text-ink-soft leading-relaxed measure", children: q.answer })
        ] }, q.question)) }),
        /* @__PURE__ */ jsxs("p", { className: "mt-10 editorial-mono-caption", children: [
          "Tilbake til",
          " ",
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "text-accent-text hover:underline underline-offset-4 decoration-[0.5px]",
              children: "forsiden"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const FAQ$1 = [
  {
    question: "Hva er booking av lokaler og møterom?",
    answer: "Booking av lokaler og møterom er den digitale prosessen der innbyggere, bedrifter, lag eller foreninger reserverer fysiske rom (selskapslokaler, møterom, idrettshaller, kantiner, kulturhus) for et bestemt tidsrom. En moderne plattform håndterer sanntidstilgjengelighet, betaling, kontrakt, varsling av driftsroller og fakturering i én sammenhengende flyt."
  },
  {
    question: "Hvordan booker man et lokale eller møterom på Digilist?",
    answer: "Søk etter sted og dato i sanntidskalenderen. Velg ledig tid, fyll inn formål og antall deltakere, signer leieavtalen digitalt og betal med Vipps, kort eller faktura. Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk. Hele flyten tar typisk under 90 sekunder."
  },
  {
    question: "Hvilke typer lokaler og møterom kan jeg booke?",
    answer: "Digilist støtter selskapslokaler, møterom, kantiner, idrettshaller, gymsaler, kulturhus, samfunnshus, undervisningsrom og spesialressurser som AV-utstyr eller kjøretøy. Hvert anlegg kan ha egne regler for kapasitet, brukergrupper, prising og rabatter."
  },
  {
    question: "Hvor mye koster det å booke et lokale via Digilist?",
    answer: "Prisen avhenger av lokalet, varigheten, brukergruppen og kommunens regler. Lag og foreninger får ofte 30–100 % rabatt avhengig av kommunens prioriteringsregler. Selve plattformen er gratis å bruke for innbyggere. Du betaler kun leieprisen til utleier."
  },
  {
    question: "Kan kommuner og bedrifter bruke Digilist for å sette opp egne booking-tjenester?",
    answer: "Ja. Digilist er bygget for norske kommuner og private utleiere. Kommunen får eget administratorpanel der saksbehandlere håndterer søknader, sesongleie og kalenderbooking. Bedrifter får sin egen profil for selskapslokaler, kulturhus eller møterom. Plattformen er SSA-L 2026-klar."
  },
  {
    question: "Er Digilist trygt og GDPR-kompatibelt?",
    answer: "Ja. All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er sertifisert mot ISO 27001 og ISO 27701, oppfyller GDPR-krav, og bruker ID-porten/BankID for autentisering. Audit-spor registrerer hver mutasjon med tidsstempel."
  },
  {
    question: "Hvilke betalingsmetoder støttes for booking av lokaler?",
    answer: "Vipps, kortbetaling via Stripe Connect, depositum med automatisk frigjøring, og EHF/Peppol-fakturering for organisasjoner. Refusjonsregler kan tilpasses per anlegg."
  },
  {
    question: "Hvordan håndterer Digilist sesongleie for idrettslag og foreninger?",
    answer: "Digilist har en dedikert sesongleie-modul: lag og foreninger søker via egen portal, organisasjonen verifiseres mot Brønnøysundregistrene, og saksbehandler får regelstyrt fordelingsforslag basert på kommunens prioriteringer. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk."
  }
];
const BENEFITS = [
  {
    Icon: CalendarCheck,
    title: "Sanntids tilgjengelighet",
    body: "Innbyggere ser ledige og opptatte tider umiddelbart. Ingen polling, ingen daglig synkronisering. Endringer oppdateres samme sekund hos alle brukere."
  },
  {
    Icon: CreditCard,
    title: "Betaling i én flyt",
    body: "Vipps, kort eller faktura, uten å forlate booking-skjemaet. EHF/Peppol til organisasjoner. Automatisk avstemming mot regnskapssystemet."
  },
  {
    Icon: Users,
    title: "Sesongleie og brukergrupper",
    body: "Lag og foreninger med BRREG-verifisering, regelstyrt fordeling, og dokumentert prioritering. Saksbehandler får forslag, beholder skjønnet."
  },
  {
    Icon: ShieldCheck,
    title: "Trygt og etterprøvbart",
    body: "ID-porten, ISO 27001 og 27701, GDPR, WCAG 2.1 AA, data i Norge og EU. Hver mutasjon revisjonsspores."
  },
  {
    Icon: Building2,
    title: "Bygget for norske krav",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir Designsystemet, innebygd. SSA-L 2026-klar for kommunale anskaffelser."
  },
  {
    Icon: Sparkles,
    title: "Én plattform, ingen siloer",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og driftsvarsling: én datakilde. Ingen dobbelinntastinger, ingen synkroniseringsfeil."
  }
];
const USE_CASES = [
  {
    title: "Selskapslokaler",
    Icon: GlassWater,
    body: "Bryllup, jubileer, firmafester. Med depositum, leieavtale-signering og digital nøkkel.",
    href: "/bruksomrader/selskapslokaler",
    cta: "Les om selskapslokaler"
  },
  {
    title: "Møterom",
    Icon: Users2,
    body: "Kommunale møterom, næringsbygg, foreningslokaler, med sambruk og pris per brukergruppe.",
    href: "/bruksomrader/moterom",
    cta: "Les om møterom"
  },
  {
    title: "Idrettshaller og gymsaler",
    Icon: Trophy,
    body: "Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger.",
    href: "/bruksomrader/idrettshaller-gymsaler",
    cta: "Les om idrettshaller"
  },
  {
    title: "Kulturhus og kantiner",
    Icon: Theater,
    body: "Forestillinger, konserter, åpne dager. Adgangskontroll via Salto KS og automatisk varsling av driftsroller.",
    href: "/bruksomrader/kulturhus-kantiner",
    cta: "Les om kulturhus"
  }
];
const BookingLokalerMoterom = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Booking av lokaler og møterom · Digilist | Norsk bookingplattform for kommuner og utleiere",
        description: "Booking av lokaler og møterom i Norge: sanntidskalender, Vipps, BankID, EHF og sesongleie. Bygget for kommuner, selskapslokaler, idrettshaller og kulturhus. SSA-L 2026-klar, ISO 27001-sertifisert.",
        keywords: "booking av lokaler og møterom, booking lokale, booking møterom, leie lokale, leie møterom, bookingplattform Norge, kommunal booking, selskapslokale booking, idrettshall booking, kulturhus booking, Vipps booking, BankID booking, EHF, sesongleie",
        canonical: "https://digilist.no/booking-av-lokaler-og-moterom",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          {
            name: "Booking av lokaler og møterom",
            url: "https://digilist.no/booking-av-lokaler-og-moterom"
          }
        ],
        faq: FAQ$1,
        service: true,
        howTo: {
          name: "Slik booker du lokale eller møterom",
          description: "Fra søk til bekreftet booking på fire steg via Digilist.",
          steps: [
            {
              name: "Søk og velg ledig tid",
              text: "Søk etter lokale eller møterom i kalenderen. Filtrer på dato, kapasitet og fasiliteter. Ledige tider vises i sanntid."
            },
            {
              name: "Fyll inn formål og deltakere",
              text: "Angi hvilken anledning, antall deltakere og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring)."
            },
            {
              name: "Logg inn og signer leieavtalen",
              text: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur."
            },
            {
              name: "Betal og motta bekreftelse",
              text: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk."
            }
          ]
        }
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsx(SectionRule, { label: "BOOKING AV LOKALER OG MØTEROM" }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "display", children: [
          "Booking av",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: {
                fontVariationSettings: getFraunces("display")
              },
              children: "lokaler og møterom"
            }
          ),
          " ",
          "· én norsk plattform."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Digilist er en norsk bookingplattform for kommuner, selskapslokaler, idrettshaller, kulturhus og møterom. Søk, book og betal i én flyt, med Vipps, BankID, EHF og sesongleie innebygd." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            EditorialButton,
            {
              variant: "primary",
              size: "lg",
              href: "https://app.digilist.no",
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Åpne plattformen"
            }
          ),
          /* @__PURE__ */ jsx(
            EditorialButton,
            {
              variant: "outline",
              size: "lg",
              href: "/book-demo",
              children: "Book demo"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 border-b border-rule pb-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "editorial-mono-caption text-accent-text", children: "HVORFOR DIGILIST" }),
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "SEKS PRINSIPPER" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule", children: BENEFITS.map(({ Icon, title, body }) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "bg-paper p-7 lg:p-9 flex flex-col",
            children: [
              /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy", children: /* @__PURE__ */ jsx(
                  Icon,
                  {
                    className: "h-5 w-5",
                    strokeWidth: 1.5,
                    "aria-hidden": "true"
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: "font-serif text-2xl text-ink leading-tight flex-1",
                    style: {
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em"
                    },
                    children: title
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed", children: body })
            ]
          },
          title
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 border-b border-rule pb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "BRUKSOMRÅDER" }),
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "LOKALER · MØTEROM · IDRETT · KULTUR" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-px bg-rule border border-rule", children: USE_CASES.map((u) => {
          const Icon = u.Icon;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to: u.href,
              className: "group bg-paper p-7 lg:p-9 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40 flex flex-col",
              children: [
                /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-4 mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy group-hover:bg-navy group-hover:text-on-navy transition-colors duration-quick ease-editorial", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "font-serif text-2xl lg:text-3xl text-ink leading-tight flex-1 inline-flex items-center gap-2",
                      style: {
                        fontVariationSettings: getFraunces("sub"),
                        letterSpacing: "-0.015em"
                      },
                      children: u.title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    ArrowUpRight,
                    {
                      className: "h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0",
                      "aria-hidden": "true"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed flex-1", children: u.body }),
                /* @__PURE__ */ jsxs("p", { className: "mt-5 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5", children: [
                  u.cta,
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3", "aria-hidden": "true" })
                ] })
              ]
            },
            u.title
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 border-b border-rule pb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "SLIK BOOKER DU" }),
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "FIRE STEG · UNDER 90 SEKUNDER" })
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "relative border-l border-rule pl-8 lg:pl-12", children: [
          {
            step: "01",
            title: "Søk og velg ledig tid",
            body: "Søk på lokale eller møterom, filtrer på dato og kapasitet. Sanntidskalenderen viser ledige og opptatte tider umiddelbart."
          },
          {
            step: "02",
            title: "Fyll inn formål og deltakere",
            body: "Angi anledning, antall personer og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring)."
          },
          {
            step: "03",
            title: "Logg inn og signer",
            body: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur."
          },
          {
            step: "04",
            title: "Betal og motta bekreftelse",
            body: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse og digital nøkkel sendes automatisk."
          }
        ].map((s, i) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: `relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${i > 0 ? "border-t border-rule" : ""}`,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "absolute -left-[2.5rem] lg:-left-[3.5rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 bg-paper border border-hairline-strong rounded-sm font-mono text-xs text-accent-text tabular-nums",
                  children: s.step
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-4", children: /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "font-serif text-2xl lg:text-3xl text-ink",
                  style: {
                    fontVariationSettings: getFraunces("sub"),
                    letterSpacing: "-0.015em",
                    lineHeight: 1.1
                  },
                  children: s.title
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "col-span-12 lg:col-span-8", children: /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink leading-relaxed", children: s.body }) })
            ]
          },
          s.step
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 border-b border-rule pb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "OFTE STILTE SPØRSMÅL" }),
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "BOOKING AV LOKALER OG MØTEROM" })
        ] }),
        /* @__PURE__ */ jsx("dl", { className: "border-t border-rule", children: FAQ$1.map((f, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-b border-rule py-7 lg:py-9 grid lg:grid-cols-12 gap-4 lg:gap-gutter",
            children: [
              /* @__PURE__ */ jsx("dt", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "font-serif text-xl lg:text-2xl text-ink",
                  style: {
                    fontVariationSettings: getFraunces("sub"),
                    lineHeight: 1.15
                  },
                  children: f.question
                }
              ) }),
              /* @__PURE__ */ jsx("dd", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink leading-relaxed", children: f.answer }) })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsx(EditorialCard, { className: "bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-serif text-3xl lg:text-4xl text-ink mb-3",
              style: {
                fontVariationSettings: getFraunces("section"),
                letterSpacing: "-0.015em",
                lineHeight: 1.1
              },
              children: "Klar til å digitalisere booking av lokaler og møterom?"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink leading-relaxed", children: "Få en gratis 30-minutters demo for kommunen eller utleier. Vi viser plattformen i ditt bruksområde. Ingen forpliktelser." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 flex flex-wrap gap-3 lg:justify-end", children: /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "lg", href: "/book-demo", children: "Book demo" }) })
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const PAGE_SIZE = 6;
const Blog = () => {
  const allPosts = getAllPosts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTag, setActiveTag] = useState(
    searchParams.get("tag") ?? "Alle"
  );
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeTag && activeTag !== "Alle") next.set("tag", activeTag);
    if (page > 1) next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [query, activeTag, page, setSearchParams]);
  const tags = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    allPosts.forEach((p) => p.tag && set.add(p.tag));
    return ["Alle", ...Array.from(set).sort()];
  }, [allPosts]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPosts.filter((p) => {
      if (activeTag !== "Alle" && p.tag !== activeTag) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.description,
        p.author,
        p.tag,
        ...p.keywords ?? []
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [allPosts, query, activeTag]);
  useEffect(() => {
    setPage(1);
  }, [query, activeTag]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Blogg · Digilist | Innsikt om booking, sesongleie, samsvar og daglig drift",
        description: "Artikler fra Digilists arbeid med norske kommuner og utleiere: bookingflyt, saksbehandling, sesongleie, sikker innlogging, fakturering, SSA-L 2026, GDPR og ISO 27001.",
        canonical: "https://digilist.no/blogg",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsx(SectionRule, { label: "DIGILIST · BLOGG" }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "display", children: [
          "Innsikt om",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: { fontVariationSettings: getFraunces("display") },
              children: "norsk booking"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Artikler fra arbeidet med norske kommuner og utleiere: fra veiviser og saksbehandling til sesongleie, sikker innlogging, fakturering og samsvar." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "border-y border-rule py-5 lg:py-6 mb-10 lg:mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-5 lg:gap-gutter items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "blog-search", className: "sr-only", children: "Søk i artikler" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Search,
                {
                  className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "blog-search",
                  type: "search",
                  placeholder: "Søk i artikler: SSA-L, sesongleie, GDPR …",
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  className: "w-full bg-paper border border-hairline-strong rounded-sm pl-9 pr-9 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
                }
              ),
              query && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Tøm søk",
                  onClick: () => setQuery(""),
                  className: "absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-sm text-ink-faint hover:text-ink hover:bg-paper-deep transition-colors",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(
            "div",
            {
              role: "group",
              "aria-label": "Filtrer etter kategori",
              className: "flex flex-wrap gap-2",
              children: tags.map((t) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTag(t),
                  "aria-pressed": activeTag === t,
                  className: cn(
                    "inline-flex items-center px-3 py-1.5 border rounded-sm font-mono text-[0.8125rem] uppercase tracking-[0.08em] font-medium transition-colors duration-quick ease-editorial",
                    activeTag === t ? "bg-navy text-on-navy border-navy hover:bg-navy/90" : "bg-paper text-ink border-hairline-strong hover:bg-paper-deep hover:border-ink"
                  ),
                  children: t
                },
                t
              ))
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 editorial-mono-caption text-ink-faint flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: filtered.length === allPosts.length ? `${allPosts.length} ARTIKLER` : `${filtered.length} av ${allPosts.length} artikler` }),
          totalPages > 1 && /* @__PURE__ */ jsxs("span", { children: [
            "SIDE ",
            currentPage,
            " av ",
            totalPages
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        motion.ol,
        {
          initial: "hidden",
          animate: "visible",
          variants: staggerParent,
          className: "border-t border-rule",
          children: paged.map((post) => /* @__PURE__ */ jsx(
            motion.li,
            {
              variants: staggerChild,
              className: "border-b border-rule",
              children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/blogg/${post.slug}`,
                  className: "group block relative py-8 lg:py-12 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40",
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "absolute left-0 top-0 bottom-0 w-px bg-ink scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-normal ease-editorial"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter px-2 lg:px-6", children: [
                      post.cover && /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 order-2 lg:order-1", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] overflow-hidden rounded-sm border border-hairline-strong bg-navy", children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: post.cover,
                          alt: "",
                          loading: "lazy",
                          decoding: "async",
                          className: "absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-editorial group-hover:scale-[1.04]"
                        }
                      ) }) }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: post.cover ? "lg:col-span-2 order-1 lg:order-2" : "lg:col-span-2 order-1",
                          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 lg:block", children: [
                            post.tag && /* @__PURE__ */ jsx("span", { className: "inline-block editorial-mono-caption text-accent-text", children: post.tag }),
                            /* @__PURE__ */ jsx("span", { className: "block editorial-mono-caption text-ink-faint lg:mt-2", children: formatPostDate(post.date) })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `order-3 ${post.cover ? "lg:col-span-7" : "lg:col-span-10"}`,
                          children: [
                            /* @__PURE__ */ jsxs(
                              "h2",
                              {
                                className: "font-serif text-3xl lg:text-4xl text-ink mb-3 transition-transform duration-normal ease-editorial group-hover:translate-x-1",
                                style: {
                                  fontVariationSettings: getFraunces("section"),
                                  letterSpacing: "-0.015em",
                                  lineHeight: 1.1
                                },
                                children: [
                                  post.title,
                                  /* @__PURE__ */ jsx("span", { className: "inline-flex ml-2 align-baseline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-normal ease-editorial", children: /* @__PURE__ */ jsx(
                                    ArrowUpRight,
                                    {
                                      className: "h-5 w-5 text-accent-text",
                                      "aria-hidden": "true"
                                    }
                                  ) })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft measure leading-relaxed", children: post.description }),
                            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3 editorial-mono-caption text-ink-faint", children: [
                              /* @__PURE__ */ jsx("span", { children: post.author }),
                              post.readingMinutes && /* @__PURE__ */ jsxs(Fragment, { children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    "aria-hidden": "true",
                                    className: "w-px h-3 bg-rule"
                                  }
                                ),
                                /* @__PURE__ */ jsxs("span", { children: [
                                  post.readingMinutes,
                                  " min lesetid"
                                ] })
                              ] })
                            ] })
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            post.slug
          ))
        },
        `${activeTag}-${query}-${currentPage}`
      ),
      filtered.length === 0 && /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-ink mb-3", children: "Ingen treff." }),
        /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft", children: "Prøv et annet søkeord eller fjern filteret." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setQuery("");
              setActiveTag("Alle");
            },
            className: "mt-6 inline-flex items-center gap-2 border border-hairline-strong bg-paper px-4 py-2 rounded-sm text-sm text-ink hover:bg-paper-deep hover:border-ink transition-colors",
            children: "Nullstill filter"
          }
        )
      ] }),
      totalPages > 1 && /* @__PURE__ */ jsxs(
        "nav",
        {
          "aria-label": "Sidenavigasjon",
          className: "mt-12 lg:mt-16 pt-8 border-t border-rule flex items-center justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPage((p) => Math.max(1, p - 1)),
                disabled: currentPage <= 1,
                className: "group inline-flex items-center gap-2 px-4 py-2.5 border border-hairline-strong bg-paper rounded-sm font-serif text-base text-ink hover:bg-paper-deep hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                style: { fontVariationSettings: getFraunces("sub") },
                children: [
                  /* @__PURE__ */ jsx(
                    ChevronLeft,
                    {
                      className: "h-4 w-4 transition-transform duration-quick group-hover:-translate-x-0.5",
                      "aria-hidden": "true"
                    }
                  ),
                  "Forrige"
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (p) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setPage(p),
                  "aria-current": p === currentPage ? "page" : void 0,
                  className: cn(
                    "inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-sm font-mono text-sm tabular-nums transition-colors duration-quick ease-editorial",
                    p === currentPage ? "bg-navy text-on-navy border border-navy" : "border border-hairline-strong bg-paper text-ink hover:bg-paper-deep hover:border-ink"
                  ),
                  children: p
                },
                p
              )
            ) }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage >= totalPages,
                className: "group inline-flex items-center gap-2 px-4 py-2.5 border border-hairline-strong bg-paper rounded-sm font-serif text-base text-ink hover:bg-paper-deep hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                style: { fontVariationSettings: getFraunces("sub") },
                children: [
                  "Neste",
                  /* @__PURE__ */ jsx(
                    ChevronRight,
                    {
                      className: "h-4 w-4 transition-transform duration-quick group-hover:translate-x-0.5",
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const FAQ = () => {
  const faqForSEO = useMemo(
    () => allFAQEntries().map((e) => ({ question: e.q, answer: e.a })),
    []
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "FAQ · Digilist | Vanlige spørsmål om kommunal booking, sesongleie og samsvar",
        description: "Svar på de vanligste spørsmålene om Digilist, bookingsystem for kommuner og utleiere. SSA-L 2026, GDPR, ISO 27001, Vipps, BankID, sesongleie og mer.",
        canonical: "https://digilist.no/faq",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "FAQ", url: "https://digilist.no/faq" }
        ],
        faq: faqForSEO
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsx(SectionRule, { label: "DIGILIST · FAQ" }),
      /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "display", children: [
          "Vanlige",
          " ",
          /* @__PURE__ */ jsx(
            "em",
            {
              className: "italic",
              style: { fontVariationSettings: getFraunces("display") },
              children: "spørsmål"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Alt du trenger å vite om Digilist: fra SSA-L 2026 og GDPR til sesongleie, betaling og integrasjoner." })
      ] }) }),
      /* @__PURE__ */ jsx(
        "nav",
        {
          "aria-label": "Kategorier",
          className: "border-t border-rule pt-6 pb-10",
          children: /* @__PURE__ */ jsx(
            motion.ul,
            {
              initial: "hidden",
              whileInView: "visible",
              viewport: viewportOnce,
              variants: staggerParent,
              className: "flex flex-wrap gap-x-2 gap-y-3",
              children: FAQ_CATEGORIES.map((cat) => /* @__PURE__ */ jsx(motion.li, { variants: staggerChild, children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `#${cat.id}`,
                  className: "group inline-flex items-center gap-2 px-3 py-1.5 border border-hairline-strong rounded-sm editorial-mono-caption text-accent-text hover:bg-paper-deep hover:border-ink transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        className: "inline-block w-1.5 h-1.5 rounded-full bg-accent-text opacity-50 group-hover:opacity-100 transition-opacity"
                      }
                    ),
                    cat.label
                  ]
                }
              ) }, cat.id))
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-16 lg:space-y-24", children: FAQ_CATEGORIES.map((cat) => /* @__PURE__ */ jsx(
        "section",
        {
          id: cat.id,
          "aria-labelledby": `${cat.id}-heading`,
          className: "scroll-mt-32",
          children: /* @__PURE__ */ jsxs("div", { className: "border-t border-rule pt-8", children: [
            /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: cat.label }),
            /* @__PURE__ */ jsx(
              "h2",
              {
                id: `${cat.id}-heading`,
                className: "font-serif text-3xl lg:text-5xl text-ink mt-3 mb-4",
                style: {
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.05
                },
                children: cat.label
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-lg text-ink-soft measure leading-relaxed mb-10", children: cat.description }),
            /* @__PURE__ */ jsx(
              motion.dl,
              {
                initial: "hidden",
                whileInView: "visible",
                viewport: viewportOnce,
                variants: staggerParent,
                className: "border-t border-rule",
                children: cat.questions.map((entry, idx) => /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    variants: staggerChild,
                    className: "group border-b border-rule py-8 lg:py-10 grid lg:grid-cols-12 gap-4 lg:gap-gutter hover:bg-paper-deep/30 transition-colors duration-quick ease-editorial",
                    children: [
                      /* @__PURE__ */ jsx("dt", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx(
                        "h3",
                        {
                          className: "font-serif text-2xl lg:text-3xl text-ink transition-transform duration-normal ease-editorial group-hover:translate-x-1",
                          style: {
                            fontVariationSettings: getFraunces("sub"),
                            lineHeight: 1.15
                          },
                          children: entry.q
                        }
                      ) }),
                      /* @__PURE__ */ jsx("dd", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft measure leading-relaxed", children: entry.a }) })
                    ]
                  },
                  `${cat.id}-${idx}`
                ))
              }
            )
          ] })
        },
        cat.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-20 lg:mt-28 border-t border-rule pt-12", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text", children: "FORTSATT SPØRSMÅL?" }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-serif text-3xl lg:text-5xl text-ink mt-3",
              style: {
                fontVariationSettings: getFraunces("section"),
                letterSpacing: "-0.015em",
                lineHeight: 1.05
              },
              children: "Snakk med oss direkte."
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-ink-soft measure leading-relaxed", children: "Vi svarer raskt på e-post, eller booker en gratis 30 minutters demo der vi viser plattformen i ditt bruksområde." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 flex flex-wrap gap-3 lg:justify-end", children: [
          /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "md", href: "/book-demo", children: "Book demo" }),
          /* @__PURE__ */ jsx(
            EditorialButton,
            {
              variant: "outline",
              size: "md",
              onClick: () => openChatbot({ mode: "chat" }),
              children: "Snakk med oss"
            }
          )
        ] })
      ] }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Salgsvilkar = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Salgsvilkår · Digilist | Vilkår for bruk av bookingplattformen",
        description: "Salgs- og leveransevilkår for Digilist bookingplattform. SLA, oppsigelse, datalokasjon, databehandleravtale og kundens rettigheter.",
        canonical: "https://digilist.no/salgsvilkar",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Salgsvilkår", url: "https://digilist.no/salgsvilkar" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto md:px-8 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto prose prose-lg dark:prose-invert", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-foreground mb-2", children: "Salgsvilkår" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-8", children: "Vilkår for bruk av Digilist sine tjenester" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "1. Om Digilist og utleieaktører" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground leading-relaxed", children: [
          "Digilist (",
          /* @__PURE__ */ jsx("a", { href: "https://www.digilist.no", className: "text-primary hover:underline", children: "www.digilist.no" }),
          ") er en digital portal som formidler leie av lokaler og ressurser fra flere utleieaktører. Hver utleier er ansvarlig for sine utleieobjekter, inkludert drift, vedlikehold, tilgjengelighet, priser og egne vilkår. Når en booking blir bekreftet, kan utleier gi supplerende vilkår for bruk. Du må gjøre deg kjent med vilkårene før du bekrefter leie."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "2. Bestilling og bekreftelse" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "En booking kan være enten direkte bekreftet eller sendes inn som forespørsel for godkjenning, avhengig av utleiers regler for det aktuelle utleieobjektet. Booking regnes som bindende når den er bekreftet av utleier, eller når betaling/aksept er gjennomført i henhold til flyten som gjelder for utleieobjektet." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "3. Bruk av reservert leieobjekt" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Dersom leietaker ikke benytter et reservert leieobjekt i avtalt tidsrom, kan fullt leiebeløp belastes. Dersom leietaker benytter leieobjektet utover avtalt tid eller leverer tilbake utstyr/leieobjekt for sent, kan leietaker belastes for overtid/ekstra brukstid etter utleiers satser og regler." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "4. Avbestilling og kansellering" }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-foreground mb-2", children: "4.1 Forespørsler som venter på godkjenning" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Forespørsler som ikke er godkjent kan kanselleres av leietaker frem til utleier har behandlet forespørselen." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-foreground mb-2", children: "4.2 Godkjente bookinger" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleier kan ha egne vilkår for avbestilling. Dersom booking er godkjent, kan kansellering kreve godkjenning fra utleier og eventuelle gebyrer kan gjelde i tråd med utleiers regler." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-foreground mb-2", children: "4.3 Manglende avbestillingsvilkår" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Dersom utleier ikke har oppgitt avbestillingsvilkår, kan leietaker normalt kansellere før leiestart uten å bli belastet for leie. Der utleier har oppgitt egne vilkår, gjelder disse." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-foreground mb-2", children: "4.4 Force majeure" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleier og leietaker kan avbestille en reservasjon dersom gjennomføring hindres av forhold utenfor partenes kontroll, og som ikke med rimelighet kunne forutsees eller unngås (force majeure)." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "5. Betaling" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Betaling i Digilist kan skje enten som forskuddsbetaling (kort eller Vipps) eller etterskuddsvis via faktura. Hvilken betalingsmetode som gjelder bestemmes av utleier for hvert utleieobjekt. Ved spørsmål om faktura eller betalingsbetingelser, må leietaker kontakte utleier." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "6. Kortbetaling" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Kortbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Kortbetaling behandles via betalingstjenesteleverandør (for eksempel Stripe). Betaling kan gjennomføres med vanlige debit- og kredittkort. Betalingsdata håndteres kryptert i henhold til leverandørens sikkerhetsmekanismer." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "7. Betaling med Vipps" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Vippsbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Ved Vipps-betaling kan beløpet reserveres i henhold til Vipps sine standardrutiner og overføres i tråd med avtalte betingelser mellom utleier og betalingsleverandør." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "8. Betaling med faktura" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleier kan ha egne rutiner for fakturering, inkludert tidspunkt for utsendelse, betalingsfrist, gebyrer og eventuell samlefakturering. Spørsmål om faktura, innhold, beløp eller betalingsstatus må rettes til utleier." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "9. Angrerett" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Ved leie av lokaler og tjenester knyttet til fritidsaktiviteter eller arrangement som leveres på et bestemt tidspunkt eller innenfor en bestemt periode, gjelder normalt ikke angrerett etter angrerettreglene. Utleier kan likevel ha egne vilkår. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "10. Reklamasjon og ansvar" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Digilist er en digital formidlingsplattform som kobler leietaker og utleier. Digilist er ikke part i leieforholdet mellom utleier og leietaker, og leier ikke ut lokaler eller utstyr i eget navn. Eventuelle reklamasjoner, innsigelser og erstatningskrav knyttet til leieobjektet eller leieforholdet håndteres direkte mellom leietaker og utleier." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleier er ansvarlig for at utleieobjektet beskrives korrekt, og at informasjon om tilstand, bruksområde og vilkår er oppdatert." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "11. Refusjon" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleier kan ha egne vilkår for refusjon, for eksempel dersom leieobjektet ikke er i forventet stand eller ikke kan benyttes som avtalt. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "12. Utestengelse fra Digilist" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Bruk av Digilist forutsetter at vilkårene overholdes, samt gjeldende lov og forskrift. Digilist kan begrense eller stenge en brukers tilgang til hele eller deler av tjenesten ved brudd på vilkårene, misbruk, forsøk på svindel, eller handlinger som kan skade tjenestens integritet eller andre brukere. Bruker kan når som helst avslutte bruk av tjenesten ved å stenge sin konto der dette tilbys." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "13. Utestengelse hos enkeltutleier" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Utleiere kan ha egne rutiner for å avvise eller utestenge leietakere fra sine utleieobjekter, basert på interne retningslinjer eller tidligere kundeforhold. Slik utestengelse gjelder kun for den aktuelle utleieren." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-border", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Opprettet: 07.01.2026" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sist publisert: 07.01.2026" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Personvern = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Personvernerklæring · Digilist | GDPR, ISO 27701, data i Norge og EU",
        description: "Slik behandler Digilist personopplysninger. GDPR-kompatibel, ISO 27701-sertifisert, data lagret i Norge og EU. Innsyn, retting og sletting på forespørsel.",
        canonical: "https://digilist.no/personvern",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Personvern", url: "https://digilist.no/personvern" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto md:px-8 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: "Personvernerklæring" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-8", children: "Denne personvernerklæringen beskriver hvordan Digilist behandler personopplysninger i forbindelse med bruk av tjenesten. Erklæringen gir informasjon du har krav på når Digilist samler inn personopplysninger, samt generell informasjon om hvordan opplysningene behandles." }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "1. Behandlingsansvarlig" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Behandlingsansvarlig er den virksomheten eller organisasjonen som tilbyr utleie av lokaler eller ressurser gjennom Digilist, og som bestemmer formålet med behandlingen av personopplysninger og hvilke hjelpemidler som benyttes." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Hvem som er behandlingsansvarlig for en konkret booking fremgår av informasjonen knyttet til det aktuelle utleieobjektet." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "2. Databehandler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Digilist fungerer som teknisk plattform og er databehandler på vegne av utleier (behandlingsansvarlig)." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Databehandler:" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Xala Technologies AS" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Organisasjonsnummer: 920 972 454" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Digilist behandler personopplysninger kun i henhold til inngåtte databehandleravtaler og gjeldende regelverk." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "3. Underleverandører og drift" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Digilist benytter underleverandører for drift, lagring og teknisk infrastruktur. Personopplysninger lagres på servere lokalisert innen EU/EØS og behandles i samsvar med gjeldende personvernregler." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Underleverandører kan blant annet benyttes til:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "drift og hosting" }),
          /* @__PURE__ */ jsx("li", { children: "betalingsformidling" }),
          /* @__PURE__ */ jsx("li", { children: "utsendelse av varsler" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Alle underleverandører er underlagt databehandleravtaler som sikrer tilfredsstillende informasjonssikkerhet." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "4. Hvordan og hvorfor samles personopplysninger inn" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Når du oppretter en bruker i Digilist eller benytter tjenesten for å booke lokaler, blir du bedt om å oppgi personopplysninger som lagres i løsningen. Ved bruk av tilgjengelige innloggingsmetoder samtykker du til at Digilist kan motta nødvendige identitets- og kontaktopplysninger." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Enkelte utleiere kan kreve ytterligere autentisering for å:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "bekrefte identitet" }),
          /* @__PURE__ */ jsx("li", { children: "verifisere alder" }),
          /* @__PURE__ */ jsx("li", { children: "sikre korrekt fakturering" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Personopplysninger benyttes blant annet for å:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "muliggjøre kontakt mellom leietaker og utleier" }),
          /* @__PURE__ */ jsx("li", { children: "gjennomføre og administrere bookinger" }),
          /* @__PURE__ */ jsx("li", { children: "håndtere betaling og fakturering" }),
          /* @__PURE__ */ jsx("li", { children: "sende varsler knyttet til booking og tilgang" }),
          /* @__PURE__ */ jsx("li", { children: "sikre sporbarhet og etterlevelse av lovpålagte krav" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Digilist vil aldri selge eller leie ut personopplysninger til tredjepart for markedsføringsformål." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "5. Deling av personopplysninger" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Kontaktopplysninger deles med aktuell utleier i forbindelse med booking." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Betalingsopplysninger behandles av godkjente betalingsleverandører og deles ikke med utleier utover det som er nødvendig for fakturering og oppfølging." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "6. Hvilke personopplysninger behandles" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "For å kunne bruke Digilist kan følgende opplysninger behandles:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "navn" }),
          /* @__PURE__ */ jsx("li", { children: "mobilnummer" }),
          /* @__PURE__ */ jsx("li", { children: "e-postadresse" }),
          /* @__PURE__ */ jsx("li", { children: "alder eller alderskategori" }),
          /* @__PURE__ */ jsx("li", { children: "adresse (der dette kreves av utleier)" }),
          /* @__PURE__ */ jsx("li", { children: "organisasjonsnummer (for organisasjoner)" }),
          /* @__PURE__ */ jsx("li", { children: "booking- og transaksjonshistorikk" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Betalingsopplysninger behandles av eksterne betalingsleverandører i henhold til deres egne vilkår og sikkerhetsrutiner." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "7. Informasjonskapsler (cookies)" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Digilist benytter informasjonskapsler og lignende teknologier for å sikre funksjonalitet og forbedre brukeropplevelsen. Dette kan blant annet omfatte:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "tekniske sesjonskapsler" }),
          /* @__PURE__ */ jsx("li", { children: "midlertidige identifikatorer knyttet til pågående bestillinger" }),
          /* @__PURE__ */ jsx("li", { children: "analyse av bruksmønstre" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Informasjonskapsler benyttes ikke til markedsføring uten særskilt samtykke." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "8. Lagringstid" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Opplysninger knyttet til bookinger lagres så lenge det er nødvendig for å:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "oppfylle avtaleforpliktelser" }),
          /* @__PURE__ */ jsx("li", { children: "oppfylle lovpålagte krav, herunder regnskaps- og arkivplikt" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Brukeropplysninger lagres frem til brukeren selv sletter sin konto, med mindre lengre lagring er påkrevd etter lov." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "9. Rett til innsyn" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Som innlogget bruker har du rett til innsyn i hvilke personopplysninger som er lagret om deg. Dette kan gjøres via din brukerkonto." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "10. Dataportabilitet" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Du har rett til å få utlevert personopplysninger du har gitt Digilist i et strukturert og maskinlesbart format, der dette er teknisk mulig og rettslig grunnlag foreligger." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "11. Retting, sletting og begrensning" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Du kan selv rette uriktige eller ufullstendige opplysninger via din brukerkonto." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Du kan også be om sletting av konto og personopplysninger. Enkelte opplysninger kan ikke slettes umiddelbart dersom lagring er påkrevd etter lov." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "12. Samtykke" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-4", children: "Ved å ta i bruk Digilist samtykker du til behandling av personopplysninger som beskrevet i denne erklæringen. Dersom du ikke samtykker, kan du benytte tjenesten til å søke og se tilgjengelighet, men ikke gjennomføre booking." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Samtykke kan trekkes tilbake når som helst ved å slette brukerkontoen." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "13. Endringer i personvernerklæringen" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Digilist kan oppdatere denne personvernerklæringen ved endringer i tjenesten eller regelverket. Oppdatert versjon publiseres på nettsiden." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-border", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Opprettet: 07.01.2026" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sist oppdatert: 07.01.2026" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Cookies og informasjonskapsler · Digilist",
        description: "Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies: ingen sporing, ingen tredjepart, full GDPR-suverenitet.",
        canonical: "https://digilist.no/cookies",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Cookies", url: "https://digilist.no/cookies" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto md:px-8 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: "Informasjonskapsler (cookies)" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-8", children: "Digilist benytter informasjonskapsler (cookies) og lignende teknologier for å sikre grunnleggende funksjonalitet, forbedre brukeropplevelsen og gi innsikt i hvordan tjenesten brukes." }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "Hva er informasjonskapsler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Informasjonskapsler er små tekstfiler som lagres på din enhet når du besøker en nettside. De brukes blant annet for å huske innstillinger, håndtere innlogging og sikre at tjenester fungerer som de skal." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "Hvilke typer informasjonskapsler brukes i Digilist" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-2 mt-6", children: "Nødvendige informasjonskapsler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Disse er påkrevd for at Digilist skal fungere korrekt. De brukes blant annet til:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "innlogging og autentisering" }),
          /* @__PURE__ */ jsx("li", { children: "sikkerhet og sesjonshåndtering" }),
          /* @__PURE__ */ jsx("li", { children: "gjennomføring av bookingflyt" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Disse informasjonskapslene kan ikke slås av." }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-2 mt-6", children: "Analyse og statistikk (valgfritt)" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-2", children: "Digilist kan benytte analyseverktøy for å samle anonymisert informasjon om bruk av tjenesten, som for eksempel:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4", children: [
          /* @__PURE__ */ jsx("li", { children: "antall besøk" }),
          /* @__PURE__ */ jsx("li", { children: "hvilke sider som benyttes" }),
          /* @__PURE__ */ jsx("li", { children: "generell bruksmønster" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Disse opplysningene brukes kun til å forbedre tjenesten og deles ikke for markedsføringsformål. Slike informasjonskapsler settes kun dersom du samtykker." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "Informasjonskapsler fra tredjeparter" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Ved bruk av betalingsløsninger eller andre integrasjoner kan tredjeparts informasjonskapsler benyttes, for eksempel i forbindelse med betaling. Disse leverandørene behandler informasjon i henhold til sine egne personvernerklæringer og gjeldende regelverk." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "Samtykke til bruk av informasjonskapsler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Når du besøker Digilist første gang, blir du bedt om å ta stilling til bruk av informasjonskapsler som ikke er strengt nødvendige. Du kan når som helst endre eller trekke tilbake ditt samtykke via innstillinger i nettleseren eller gjennom tilgjengelige valg i løsningen." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-foreground mb-4", children: "Hvordan slette eller blokkere informasjonskapsler" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "Du kan selv administrere eller slette informasjonskapsler via innstillingene i din nettleser. Vær oppmerksom på at blokkering av nødvendige informasjonskapsler kan føre til at deler av Digilist ikke fungerer som forutsatt." })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "404 · Siden ble ikke funnet | Digilist",
        description: "Vi fant ikke siden du leter etter. Gå til forsiden, blogg eller FAQ for å fortsette.",
        canonical: "https://digilist.no/404"
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center pt-28 lg:pt-32 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsx(SectionRule, { label: "ERR. 404 · IKKE FUNNET" }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start mt-10 lg:mt-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 lg:col-start-2", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-accent-text mb-5 block", children: "STATUS 404" }),
          /* @__PURE__ */ jsxs(EditorialHeading, { as: "h1", size: "display", className: "mb-6", children: [
            "Siden",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: { fontVariationSettings: getFraunces("display") },
                children: "finnes ikke"
              }
            ),
            "."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-ink-soft measure leading-relaxed mb-8", children: "Lenken er kanskje feil, eller siden er flyttet. Du kan gå tilbake til forsiden, eller fortsette til en av de mest besøkte sidene under." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "md", href: "/", children: "Tilbake til forsiden" }),
            /* @__PURE__ */ jsx(EditorialButton, { variant: "outline", size: "md", href: "/blogg", children: "Til bloggen" }),
            /* @__PURE__ */ jsx(EditorialButton, { variant: "outline", size: "md", href: "/faq", children: "Vanlige spørsmål" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 lg:col-start-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-paper border border-hairline-strong rounded-sm p-6", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-serif text-xl text-ink mb-4 pb-3 border-b border-rule",
              style: { fontVariationSettings: getFraunces("sub") },
              children: "Forslag"
            }
          ),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-base text-ink-soft", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/bookingsystem-kommune",
                className: "hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]",
                children: "Bookingsystem for kommuner"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/book-demo",
                className: "hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]",
                children: "Book demo"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/blogg",
                className: "hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]",
                children: "Blogg"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/faq",
                className: "hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]",
                children: "FAQ"
              }
            ) })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const api = anyApi;
const internal = anyApi;
const components = componentsGeneric();
const api$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  api,
  components,
  internal
}, Symbol.toStringTag, { value: "Module" }));
const POSTURE_LABEL = {
  iso27001: "ISO 27001:2022",
  soc2: "SOC 2",
  gdpr: "GDPR"
};
function fmtUptime(pct) {
  if (pct === null || Number.isNaN(pct)) return "—";
  return `${(Math.round(pct * 10) / 10).toFixed(1).replace(/\.0$/, "")} %`;
}
function scoreClass(s) {
  if (s === null) return "text-ink-faint";
  if (s >= 85) return "text-green-700";
  if (s >= 60) return "text-amber-700";
  return "text-red-700";
}
function scoreLabel(s) {
  if (s === null) return "Ingen data";
  if (s >= 95) return "Utmerket";
  if (s >= 85) return "Bra";
  if (s >= 70) return "Akseptabelt";
  if (s >= 50) return "Trenger forbedring";
  return "Kritisk";
}
function Transparens() {
  var _a, _b;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`/api/audits/public-summary?t=${Date.now()}`, {
      headers: { Accept: "application/json" }
    }).then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const type = r.headers.get("content-type") || "";
      if (!type.includes("application/json")) {
        throw new Error(
          "API svarte med " + (type || "ukjent type") + ". Prøv å laste siden på nytt"
        );
      }
      return await r.json();
    }).then((d) => setData(d)).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoading(false));
  }, []);
  const productionSurfaces = (data == null ? void 0 : data.surfaces.filter((s) => s.environment === "production")) ?? [];
  const auditSummary = useQuery(api.audits.public.summary, {});
  const measuredUptime = ((_b = (_a = auditSummary == null ? void 0 : auditSummary.surfaces) == null ? void 0 : _a.find(
    (s) => s.type === "marketing" && s.environment === "production"
  )) == null ? void 0 : _b.uptime30d) ?? null;
  const SLA_UPTIME = 99.9;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Transparens · kvalitetsrapport for Digilist",
        description: "Live kvalitetsrapport: SEO, tilgjengelighet, sikkerhet, oppetid og lenker, automatisk skannet på tvers av Digilist-økosystemet.",
        canonical: "https://digilist.no/transparens"
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-4 mb-10 pb-4 border-b border-rule", children: [
        /* @__PURE__ */ jsx(
          "nav",
          {
            className: "editorial-mono-caption",
            "aria-label": "Brødsmuler",
            children: /* @__PURE__ */ jsx(
              Link,
              {
                to: "/",
                className: "group inline-flex items-center gap-2 text-accent-text",
                children: "← Tilbake til forsiden"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint", children: "LIVE KVALITETSRAPPORT" })
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "mb-12 lg:mb-16", children: [
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "font-serif text-5xl lg:text-7xl text-ink leading-[1.05] tracking-tight",
            style: {
              fontVariationSettings: '"opsz" 144, "wght" 360, "SOFT" 30, "WONK" 1'
            },
            children: "Transparens."
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: [
          "En kommunal CIO bør vite hva slags plattform de velger. Denne siden viser",
          " ",
          /* @__PURE__ */ jsx("em", { children: "Digilist sin egen" }),
          " kvalitet: SEO, tilgjengelighet, sikkerhet, oppetid og lenker, automatisk skannet og oppdatert."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-ink-soft measure", children: "Skanninger kjøres minst hver 15. minutt for oppetid og daglig for hele økosystemet. Det vi viser her er det samme som vårt interne team ser." }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-base text-ink-soft measure", children: [
          "Rapporten dekker fem områder. ",
          /* @__PURE__ */ jsx("strong", { children: "SEO" }),
          " måler hvor synlig plattformen er i søk: titler, metadata, canonical og strukturert data. ",
          /* @__PURE__ */ jsx("strong", { children: "Tilgjengelighet" }),
          " sjekker WCAG-samsvar: overskriftshierarki, alt-tekster, landemerker og tastaturnavigasjon for skjermlesere. ",
          /* @__PURE__ */ jsx("strong", { children: "Sikkerhet" }),
          " ",
          "vurderer HTTP-sikkerhetsheadere, TLS-sertifikater og at ingen sensitive filer er eksponert. ",
          /* @__PURE__ */ jsx("strong", { children: "Oppetid" }),
          " følger tilgjengelighet og responstid per tjeneste, med varsling ved avvik. ",
          /* @__PURE__ */ jsx("strong", { children: "Lenker" }),
          " verifiserer at ingen utgående lenker er brutt. Hver overflate i økosystemet (markedssiden, booking-appen, dashbordet, dokumentasjonen og API-et) skannes uavhengig, og tallene nedenfor er hentet direkte fra siste kjøring, uten manuell redigering eller utvalg."
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-ink-soft", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        "Henter live data…"
      ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "border-l-2 border-red-700 bg-paper-deep/60 px-5 py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-red-700 mb-1", children: "KUNNE IKKE HENTE LIVE DATA" }),
        /* @__PURE__ */ jsxs("p", { className: "text-base text-ink", children: [
          "Beklager, kommer tilbake snart. ",
          error
        ] })
      ] }) : data ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("section", { className: "mb-10 lg:mb-14", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-paper border border-rule px-6 py-5", children: [
          /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "MÅLT OPPETID (30 DAGER)" }),
          /* @__PURE__ */ jsx("span", { className: "font-serif text-4xl leading-none tabular-nums text-green-700", children: fmtUptime(measuredUptime ?? SLA_UPTIME) }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-ink-soft", children: [
            "SLA-mål ",
            SLA_UPTIME.toString().replace(".", ","),
            " %",
            measuredUptime !== null && (measuredUptime >= SLA_UPTIME ? " · innfridd" : " · under mål")
          ] })
        ] }) }),
        data.ecosystem && /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text mb-4", children: "ØKOSYSTEM" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule", children: [
            /* @__PURE__ */ jsx(
              Cell,
              {
                label: "Snittscore",
                value: Math.round(data.ecosystem.avgScore),
                tone: scoreClass(data.ecosystem.avgScore),
                sub: scoreLabel(data.ecosystem.avgScore)
              }
            ),
            /* @__PURE__ */ jsx(
              Cell,
              {
                label: "Overflater aktive",
                value: data.ecosystem.surfacesTotal,
                sub: `${data.ecosystem.surfacesHealthy} sunne`
              }
            ),
            /* @__PURE__ */ jsx(
              Cell,
              {
                label: "Kritiske funn",
                value: data.ecosystem.errorCount,
                tone: data.ecosystem.errorCount > 0 ? "text-red-700" : "text-green-700",
                sub: data.ecosystem.errorCount === 0 ? "Ingen blokkerende" : "Under aktiv utbedring"
              }
            ),
            /* @__PURE__ */ jsx(
              Cell,
              {
                label: "Advarsler",
                value: data.ecosystem.warnCount,
                tone: data.ecosystem.warnCount > 0 ? "text-amber-700" : void 0,
                sub: "Anbefalt forbedring"
              }
            )
          ] })
        ] }),
        data.posture && data.posture.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text mb-4", children: "ETTERLEVELSE" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule", children: data.posture.map((p) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-paper px-6 py-5",
              children: [
                /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint", children: POSTURE_LABEL[p.framework] ?? p.framework }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3 mt-3", children: [
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: cn(
                        "font-serif text-4xl leading-none tabular-nums",
                        p.implementation_pct >= 80 ? "text-green-700" : p.implementation_pct >= 40 ? "text-amber-700" : "text-ink-soft"
                      ),
                      style: {
                        fontVariationSettings: '"opsz" 144, "wght" 360'
                      },
                      children: [
                        p.implementation_pct,
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm text-ink-soft", children: [
                    "av ",
                    p.total,
                    " kontroller"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-ink-soft leading-relaxed", children: [
                  p.framework === "iso27001" && "Annex A: Organisatoriske, personell-, fysiske og teknologiske kontroller.",
                  p.framework === "soc2" && "Common Criteria: kontrollmiljø, risiko, tilgang og systemoperasjoner.",
                  p.framework === "gdpr" && "Kjerneartikler: personvern, lovlig grunnlag, sletting og brudd-håndtering."
                ] })
              ]
            },
            p.framework
          )) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-ink-faint italic max-w-3xl", children: "Tallene viser implementeringsgrad, andelen anvendelige kontroller med dokumentert tilstand «Implementert» (full kreditt) eller «Delvis» (halv). Detaljer over hver kontroll er tilgjengelig på forespørsel for kommunale kunder under NDA." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text mb-4", children: "OVERFLATER · PRODUKSJON" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-px bg-rule border border-rule", children: productionSurfaces.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-paper p-6 text-ink-soft", children: "Ingen aktive produksjons-overflater i siste skanning." }) : productionSurfaces.map((s) => /* @__PURE__ */ jsx(SurfaceRow, { s }, s.id)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx(SectionRule, { label: "METODE" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 grid lg:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-ink mb-3", children: "Hva vi måler" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-base text-ink-soft", children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "Oppetid & SSL." }),
                  " ",
                  "HTTP-status, responstid og sertifikat-utløp via",
                  " ",
                  /* @__PURE__ */ jsx("code", { className: "font-mono text-xs", children: "tls.connect" }),
                  "."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "SEO." }),
                  " Titler, descriptions, canonical, OG/Twitter, JSON-LD, alt-text, duplikat-metadata, ødelagte interne lenker."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "Tilgjengelighet." }),
                  " ",
                  "Lang-attributt, alt-tekst, label-for, heading-hierarki, ARIA-landmark, knapp- og lenkenavn (cheerio-baseline; axe-core kommer)."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "Sikkerhet." }),
                  " HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, sensitive-fil-prober, mixed content, source maps."
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("strong", { className: "text-ink", children: "Lenker." }),
                  " Eksterne lenker HEAD-sjekket, 405→GET fallback, dedup-ert per URL."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-ink mb-3", children: "Score-tolkning" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-base", children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-green-700", children: "95–100" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "· utmerket" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-green-700", children: "85–94" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "· bra" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-amber-700", children: "70–84" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "· akseptabelt" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-amber-700", children: "50–69" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "· trenger forbedring" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-red-700", children: "0–49" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "· kritisk" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-4 font-mono uppercase tracking-widest", children: "Score = 100 minus vektsum av funn (error=18, warn=6, info=1), klemt til [0, 100]." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx(SectionRule, { label: "UAVHENGIG VURDERING" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 mb-6 max-w-prose", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-ink mb-2", children: "Verifiser oss hos uavhengige tredjeparter" }),
            /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft", children: "Vi kjører våre egne automatiske skanninger (oversikten over), men du bør ikke ta vårt ord for det. Sjekk digilist.no selv hos disse uavhengige sikkerhets- og kvalitetsmålerne. De gir sanntidsdom." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule", children: [
            {
              name: "SSL Labs",
              provider: "Qualys",
              desc: "Sertifikat, cipher suites, protokoll-styrke. Mål A eller A+.",
              href: "https://www.ssllabs.com/ssltest/analyze.html?d=digilist.no"
            },
            {
              name: "Security Headers",
              provider: "Scott Helme",
              desc: "HSTS, CSP, X-Frame-Options, Referrer-Policy. Bokstavkarakter.",
              href: "https://securityheaders.com/?q=https%3A%2F%2Fdigilist.no&hide=on&followRedirects=on"
            },
            {
              name: "Mozilla Observatory",
              provider: "Mozilla",
              desc: "Helhetlig sikkerhetsposture mot moderne nettstandarder.",
              href: "https://developer.mozilla.org/en-US/observatory/analyze?host=digilist.no"
            },
            {
              name: "PageSpeed Insights",
              provider: "Google",
              desc: "Core Web Vitals: LCP, CLS, INP. Mobile + desktop.",
              href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdigilist.no"
            }
          ].map((tool) => /* @__PURE__ */ jsxs(
            "a",
            {
              href: tool.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "bg-paper p-6 flex flex-col hover:bg-paper-deep/40 transition-colors group",
              children: [
                /* @__PURE__ */ jsx("p", { className: "font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint", children: tool.provider }),
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl text-ink mt-1 mb-2 leading-tight", children: tool.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft leading-snug flex-1 mb-4", children: tool.desc }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-text mt-auto", children: [
                  "Se live rapport",
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
                ] })
              ]
            },
            tool.name
          )) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-faint mt-4 font-mono uppercase tracking-widest", children: "Live oppslag. Klikk en boks for å kjøre skanning hos tredjepart i sanntid." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
          /* @__PURE__ */ jsx(SectionRule, { label: "SAMSVAR" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mt-8", children: [
            ["ISO 27001", "Informasjonssikkerhetsstyring"],
            ["ISO 27701", "Personverninformasjonsstyring"],
            ["GDPR", "EU/EØS-datalokasjon"],
            ["WCAG 2.1 AA", "Universell utforming"]
          ].map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "bg-paper p-6", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-accent-text mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "font-serif text-xl text-ink", children: k }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft mt-1", children: v })
          ] }, k)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx(SectionRule, { label: "VEIEN VIDERE" }),
          /* @__PURE__ */ jsxs("header", { className: "mt-8 mb-10 max-w-prose", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: "font-serif text-4xl lg:text-5xl text-ink leading-tight mb-4",
                style: {
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 25'
                },
                children: "Vil du se mer?"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft leading-relaxed", children: "Vi deler gjerne sammendrag av siste penetrasjonstest og sårbarhetsstatus under NDA. Be om et møte. Vi viser rapportene side-om-side med plattformen." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-px bg-rule border border-rule mb-10", children: [
            /* @__PURE__ */ jsx(
              ResourceCard,
              {
                icon: Mail,
                eyebrow: "DIREKTE",
                title: "Be om sikkerhetsmøte",
                body: "30–45 minutter, NDA, sammendrag av siste pen-test, vulnerability-status, RPO/RTO og beredskapsplan.",
                href: "/book-demo",
                cta: "Book demo"
              }
            ),
            /* @__PURE__ */ jsx(
              ResourceCard,
              {
                icon: BookOpen,
                eyebrow: "KUNNSKAP",
                title: "Sikkerhetsartikler",
                body: "Cyberangrep mot kommuner, beredskap mot ransomware, phishing-resistente innlogginger, sikkerhetsrevisjon.",
                href: "/blogg",
                cta: "Les artikler",
                secondary: [
                  {
                    label: "Cyberangrep mot kommuner",
                    href: "/blogg/cyberangrep-norske-kommuner-bookingsystem"
                  },
                  {
                    label: "DDoS & ransomware-beredskap",
                    href: "/blogg/ddos-ransomware-beredskap-bookingplattform"
                  },
                  {
                    label: "Penetrasjonstesting",
                    href: "/blogg/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor"
                  }
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              ResourceCard,
              {
                icon: FileText,
                eyebrow: "ANSVARLIG SÅRBARHETSRAPPORTERING",
                title: "security.txt",
                body: "Fant du en sårbarhet? Vi tar imot ansvarlig sårbarhetsrapportering på sikkerhet@digilist.no. Rapportering kvittert innen 24 timer.",
                href: "/.well-known/security.txt",
                cta: "Se security.txt"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 max-w-prose", children: [
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "primary",
                size: "lg",
                onClick: () => {
                  const el = document.getElementById("kontakt");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else window.location.href = "/#kontakt";
                },
                children: "Book demo"
              }
            ),
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "outline",
                size: "lg",
                href: "/blogg/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor",
                children: "Les om sikkerhetsrevisjon"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-ink-faint mt-12 font-mono uppercase tracking-widest", children: [
          "Sist oppdatert",
          " ",
          new Date(data.generatedAt).toLocaleString("nb-NO"),
          " · skanninger kjøres hver 15. min (oppetid) og daglig (full)."
        ] })
      ] }) : null
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Cell({
  label,
  value,
  tone,
  sub
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-paper p-6", children: [
    /* @__PURE__ */ jsx("p", { className: "font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint", children: label }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: cn(
          "font-serif text-5xl font-medium leading-none mt-2",
          tone ?? "text-ink"
        ),
        children: value
      }
    ),
    sub && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-2", children: sub })
  ] });
}
function ResourceCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  href,
  cta,
  secondary
}) {
  return /* @__PURE__ */ jsxs("article", { className: "bg-paper p-7 lg:p-8 flex flex-col", children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 text-accent-text mb-5" }),
    /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint mb-2", children: eyebrow }),
    /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl text-ink leading-tight mb-3", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-ink-soft leading-relaxed mb-5 flex-1", children: body }),
    secondary && secondary.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 mb-5 border-t border-rule pt-4", children: secondary.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: item.href,
        className: "group inline-flex items-baseline gap-1.5 text-sm text-ink hover:text-navy transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-ink-faint font-mono text-[0.65rem]", children: "→" }),
          /* @__PURE__ */ jsx("span", { className: "border-b border-rule group-hover:border-navy pb-0.5", children: item.label })
        ]
      }
    ) }, item.href)) }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: href,
        className: "group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-text hover:text-navy mt-auto",
        children: [
          cta,
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
        ]
      }
    )
  ] });
}
const SCORE_COLUMNS = [
  { key: "uptime", label: "Oppetid" },
  { key: "security", label: "Sikkerhet" },
  { key: "a11y", label: "Tilgjengelighet" },
  { key: "seo", label: "SEO" },
  { key: "links", label: "Lenker" }
];
function originPretty(origin) {
  return origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
function scoreBg(s) {
  if (s === null) return "bg-paper-deep/30";
  if (s >= 85) return "bg-green-700/5";
  if (s >= 60) return "bg-amber-700/5";
  return "bg-red-700/5";
}
function ScoreChip({ value, label }) {
  const isNA = value === null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center px-2 py-2.5 rounded-sm",
        scoreBg(value)
      ),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "font-serif text-2xl leading-none font-medium",
              scoreClass(value)
            ),
            children: isNA ? "-" : value
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint mt-1.5 text-center leading-tight", children: label })
      ]
    }
  );
}
function SurfaceRow({ s }) {
  return /* @__PURE__ */ jsxs("article", { className: "bg-paper px-6 py-5 lg:px-7 lg:py-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-6 items-baseline mb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text", children: s.id.toUpperCase() }),
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl lg:text-2xl text-ink mt-0.5 leading-tight", children: originPretty(s.origin) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-soft mt-1 font-mono uppercase tracking-widest", children: scoreLabel(s.overall) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cn("flex items-baseline gap-2", scoreClass(s.overall)), children: [
        /* @__PURE__ */ jsx("span", { className: "font-serif text-5xl lg:text-6xl font-medium leading-none", children: s.overall ?? "-" }),
        /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint", children: "overall" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-px bg-rule border border-rule", children: SCORE_COLUMNS.map((col) => /* @__PURE__ */ jsx(
      ScoreChip,
      {
        value: s.scores[col.key] ?? null,
        label: col.label
      },
      col.key
    )) })
  ] });
}
function UseCasePage({
  slug,
  breadcrumb,
  title,
  dek,
  lead,
  seoTitle,
  seoDescription,
  keywords,
  audience,
  problems,
  features,
  stories,
  technical,
  faq,
  relatedPosts,
  siblings,
  pullQuote,
  extra
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: seoTitle,
        description: seoDescription,
        keywords,
        canonical: `https://digilist.no/bruksomrader/${slug}`,
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          {
            name: "Bruksområder",
            url: "https://digilist.no/booking-av-lokaler-og-moterom"
          },
          {
            name: breadcrumb,
            url: `https://digilist.no/bruksomrader/${slug}`
          }
        ],
        faq,
        service: true
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-20 lg:pt-24 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto md:px-8 lg:px-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-4 mb-10 pb-4 border-b border-rule", children: [
        /* @__PURE__ */ jsxs(
          "nav",
          {
            className: "editorial-mono-caption text-accent-text flex flex-wrap items-baseline gap-2",
            "aria-label": "Brødsmuler",
            children: [
              /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:underline", children: "Hjem" }),
              /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-ink-faint", children: "·" }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/booking-av-lokaler-og-moterom",
                  className: "hover:underline",
                  children: "Bruksområder"
                }
              ),
              /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-ink-faint", children: "·" }),
              /* @__PURE__ */ jsx("span", { className: "text-ink", children: breadcrumb })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint hidden lg:block", children: "BRUKSOMRÅDE" })
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-end", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: "font-serif text-5xl lg:text-7xl text-ink leading-[1.04] tracking-tight",
              style: { fontVariationSettings: getFraunces("hero") },
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-6 text-xl lg:text-2xl text-ink measure leading-relaxed font-serif italic",
              style: { fontVariationSettings: getFraunces("quote") },
              children: dek
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 lg:pl-8 lg:border-l lg:border-rule", children: /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed", children: lead }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "HVEM BRUKER DETTE" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule", children: audience.map((a, i) => /* @__PURE__ */ jsxs("div", { className: "bg-paper p-6 lg:p-7", children: [
          /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[0.65rem] text-navy bg-navy/5 border border-navy/15 rounded-sm w-8 h-8 inline-flex items-center justify-center tabular-nums", children: String(i + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "font-serif text-xl text-ink leading-tight flex-1",
                style: { fontVariationSettings: getFraunces("sub") },
                children: a.persona
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed", children: a.context })
        ] }, a.persona)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "UTFORDRINGEN" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid lg:grid-cols-12 gap-8 lg:gap-gutter", children: [
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-serif text-3xl lg:text-4xl text-ink leading-tight",
              style: { fontVariationSettings: getFraunces("section") },
              children: "Det vi ser i dag"
            }
          ) }),
          /* @__PURE__ */ jsx("ul", { className: "lg:col-span-7 space-y-3", children: problems.map((p, i) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex gap-4 text-base text-ink-soft leading-relaxed border-b border-rule pb-3",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-ink-faint pt-1 tabular-nums w-8 flex-shrink-0", children: String(i + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsx("span", { children: p })
              ]
            },
            i
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "SLIK FUNGERER DET" }),
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose",
            style: { fontVariationSettings: getFraunces("section") },
            children: [
              "Hva Digilist gjør for ",
              breadcrumb.toLowerCase()
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule", children: features.map((f) => /* @__PURE__ */ jsxs("div", { className: "bg-paper p-7", children: [
          /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-9 h-9 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "font-serif text-xl text-ink leading-tight flex-1",
                style: { fontVariationSettings: getFraunces("sub") },
                children: f.title
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed", children: f.body })
        ] }, f.title)) })
      ] }),
      pullQuote && /* @__PURE__ */ jsx("section", { className: "mb-14 lg:mb-20", children: /* @__PURE__ */ jsxs("blockquote", { className: "border-l-2 border-navy pl-6 lg:pl-10 max-w-3xl", children: [
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: "font-serif italic text-3xl lg:text-4xl text-ink leading-tight",
            style: { fontVariationSettings: getFraunces("quote") },
            children: [
              "“",
              pullQuote.text,
              "”"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("footer", { className: "mt-4 editorial-mono-caption text-ink-faint", children: [
          "· ",
          pullQuote.byline
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "BRUKERHISTORIER" }),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose",
            style: { fontVariationSettings: getFraunces("section") },
            children: "Hvordan kunder bruker det"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-px bg-rule border border-rule", children: stories.map((s, i) => /* @__PURE__ */ jsxs("article", { className: "bg-paper p-8", children: [
          /* @__PURE__ */ jsxs("p", { className: "editorial-mono-caption text-accent-text", children: [
            s.customer.toUpperCase(),
            " · ",
            s.role.toUpperCase()
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl text-ink mt-2 mb-3 leading-tight", children: s.headline }),
          /* @__PURE__ */ jsx("p", { className: "text-base text-ink leading-relaxed mb-5", children: s.body }),
          /* @__PURE__ */ jsx("dl", { className: "border-t border-rule pt-4 space-y-1.5", children: s.outcome.map((o, j) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-baseline justify-between gap-3",
              children: [
                /* @__PURE__ */ jsx("dt", { className: "text-sm text-ink-soft", children: o.label }),
                /* @__PURE__ */ jsx("dd", { className: "font-mono text-sm text-ink font-medium", children: o.value })
              ]
            },
            j
          )) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "TEKNISKE DETALJER" }),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose",
            style: { fontVariationSettings: getFraunces("section") },
            children: "Hva som er bygget inn"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "border border-rule rounded-sm overflow-hidden", children: /* @__PURE__ */ jsx("dl", { className: "divide-y divide-rule", children: technical.map((t, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 px-5 py-4",
            children: [
              /* @__PURE__ */ jsx("dt", { className: "font-mono text-xs uppercase tracking-widest text-ink-faint pt-1", children: t.label }),
              /* @__PURE__ */ jsx("dd", { className: "text-base text-ink leading-relaxed", children: t.value })
            ]
          },
          i
        )) }) })
      ] }),
      extra,
      /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "OFTE STILTE SPØRSMÅL" }),
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose",
            style: { fontVariationSettings: getFraunces("section") },
            children: [
              "Spørsmål om ",
              breadcrumb.toLowerCase()
            ]
          }
        ),
        /* @__PURE__ */ jsx("dl", { className: "divide-y divide-rule border-t border-b border-rule", children: faq.map((q, i) => /* @__PURE__ */ jsxs("div", { className: "py-6 grid lg:grid-cols-12 gap-4", children: [
          /* @__PURE__ */ jsx("dt", { className: "lg:col-span-5 font-serif text-xl text-ink leading-tight", children: q.question }),
          /* @__PURE__ */ jsx("dd", { className: "lg:col-span-7 text-base text-ink leading-relaxed", children: q.answer })
        ] }, i)) })
      ] }),
      relatedPosts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-14 lg:mb-20", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "LES MER" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-8 mb-8 font-serif text-3xl text-ink", children: "Relaterte artikler" }),
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule", children: relatedPosts.map((p) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/blogg/${p.slug}`,
            className: "bg-paper p-6 hover:bg-paper-deep/40 transition-colors flex flex-col group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-accent-text mb-3", children: "ARTIKKEL" }),
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-lg text-ink leading-tight mb-4 flex-1", children: p.title }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-text", children: [
                "Les artikkel",
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
              ] })
            ]
          },
          p.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mb-12", children: [
        /* @__PURE__ */ jsx(SectionRule, { label: "NESTE STEG" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: "font-serif text-3xl lg:text-4xl text-ink leading-tight mb-3",
                style: { fontVariationSettings: getFraunces("section") },
                children: "Vil du se det fungere?"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft leading-relaxed", children: "Book 30 minutter. Vi viser plattformen med dine konkrete bookingscenarier. Ingen forpliktelser." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-wrap gap-3 lg:justify-end", children: [
            /* @__PURE__ */ jsx(EditorialButton, { variant: "primary", size: "lg", href: "/book-demo", children: "Book demo" }),
            /* @__PURE__ */ jsx(
              EditorialButton,
              {
                variant: "outline",
                size: "lg",
                href: "https://app.digilist.no",
                children: "Åpne plattformen"
              }
            )
          ] })
        ] })
      ] }),
      siblings && siblings.length > 0 && /* @__PURE__ */ jsxs("section", { className: "border-t border-rule pt-8 mt-12", children: [
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-ink-faint mb-4", children: "ANDRE BRUKSOMRÅDER" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: siblings.map((s) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/bruksomrader/${s.slug}`,
            className: "inline-flex items-center gap-1.5 border border-hairline rounded-sm px-3 py-1.5 text-sm hover:bg-paper-deep transition-colors text-ink",
            children: [
              s.title,
              /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 text-ink-faint" })
            ]
          },
          s.slug
        )) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const SIBLINGS$3 = [
  { title: "Møterom", slug: "moterom" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" }
];
function UseCaseSelskapslokaler() {
  return /* @__PURE__ */ jsx(
    UseCasePage,
    {
      slug: "selskapslokaler",
      breadcrumb: "Selskapslokaler",
      title: "Selskapslokaler",
      dek: "Bryllup, jubileer, firmafester. Bookinger som binder seg juridisk, betaler depositum og åpner døren med digital nøkkel.",
      lead: "Eier du et selskapslokale, vet du at hver helg blir bestilt av folk som planlegger en stor dag. Det krever en bookingplattform som tar gjestene seriøst: med ledige helger i sanntid, juridisk leieavtale signert med BankID, depositum reservert via Vipps og dørtilgang når dagen kommer.",
      seoTitle: "Selskapslokaler: bookingsystem for bryllup og selskap · Digilist",
      seoDescription: "Bookingplattform for selskapslokaler: sanntidskalender, depositum via Vipps, BankID-signert leieavtale, digital nøkkel og automatisk faktura.",
      keywords: "selskapslokale, booking selskapslokale, leie selskapslokale, bryllupslokale booking, depositum Vipps, BankID leieavtale, digital nøkkel, jubileum",
      audience: [
        {
          persona: "Eiere av selskapslokaler",
          context: "Privatpersoner eller småbedrifter som leier ut én eller flere saler, gjerne i tilknytning til gård, museum, restaurant eller historisk eiendom."
        },
        {
          persona: "Kulturhus og bedehus",
          context: "Frivillige organisasjoner eller stiftelser som leier ut storsal og mindre lokaler til private arrangementer for å finansiere drift."
        },
        {
          persona: "Hoteller og restauranter",
          context: "Steder med separat selskapssal/festsal som ønsker direkte booking uten å gå gjennom hovedreservasjonssystemet."
        },
        {
          persona: "Kommunale festhus",
          context: "Kommuner som leier ut storstuer, samfunnshus eller historiske selskapslokaler til innbyggere, som regel via egne avdelinger."
        },
        {
          persona: "Idrettslag og foreninger",
          context: "Klubbhus med selskapsareal, som leies ut for å støtte foreningsdriften, uten at det skal kreve ansatte for å håndtere."
        },
        {
          persona: "Borettslag og sameier",
          context: "Felleslokaler som beboere booker for selskap, fødselsdager og familieselskap, typisk med depositum og rengjøringsavtale."
        }
      ],
      problems: [
        "Telefon og e-post fylles opp av forespørsler om ledige helger. Ingen sentral oversikt for utleier.",
        "Excel-regneark for booking gir dobbeltbookinger som først oppdages når to brudefølger møtes i samme sal.",
        "Depositum-håndtering er manuell: bankoverføring, kvittering, papirkontrakt, tilbakebetaling. Krever oppfølging i ukevis.",
        "Leieavtale signeres på papir eller PDF. Vanskelig å arkivere, vanskelig å håndheve hvis ting skjer.",
        "Nøkkel må overleveres fysisk. Eier blir bundet til faste klokkeslett for utlevering og innlevering."
      ],
      features: [
        {
          title: "Ledige helger i sanntid",
          body: "Innbygger ser ledige datoer øyeblikkelig. Reserverte og bekreftede bookinger låses i kalenderen så ingen kan booke samme tid."
        },
        {
          title: "Depositum via Vipps eller kort",
          body: "Beløpet reserveres ved booking, frigis automatisk etter bruk hvis ingenting er meldt, eller belastes ved skade etter eierens vurdering."
        },
        {
          title: "Leieavtale signert med BankID",
          body: "Juridisk bindende eID-signatur. Avtalen lagres digitalt og kan vises frem ved konflikt. Mal kan tilpasses per type arrangement."
        },
        {
          title: "Digital nøkkel via Salto KS",
          body: "Adgangskode eller mobilnøkkel sendes 24 t før arrangement, deaktiveres automatisk etter avtalt sluttid. Ingen fysisk overlevering nødvendig."
        },
        {
          title: "Tilleggstjenester per booking",
          body: "Rengjøring, dekorering, AV-utstyr, ekstra møblement, som pakkepris eller per stykk. Gjesten ser totalpris før hun signerer."
        },
        {
          title: "Automatisk faktura og bilag",
          body: "Etter arrangementet sendes kvittering via e-post og bilag direkte til regnskapssystemet ditt (Visma, Tripletex, Fiken eller EHF)."
        }
      ],
      stories: [
        {
          customer: "Rønning Selskapslokale",
          role: "Eier (Asker)",
          headline: "Fra excelark til kalenderautomatikk",
          body: "Vi har drevet utleie til private selskap siden 2008. Tidligere booket folk via SMS eller telefon, vi førte det inn i Excel, og hver høst hadde vi minst én dobbeltbooking. Med Digilist ser gjestene ledige helger selv, betaler depositum via Vipps, signerer leieavtalen med BankID, og får portkoden 24 timer før. Vi gjorde over 80 bookinger forrige år uten en eneste dobbeltbooking, og bruker betydelig mindre tid på administrasjon.",
          outcome: [
            { label: "Reduserte adm.-tid", value: "−65%" },
            { label: "Dobbeltbookinger", value: "0" },
            { label: "Bookinger fra mobil", value: "+82%" }
          ]
        },
        {
          customer: "Kulturhus (eksempel-persona)",
          role: "Frivillig drift",
          headline: "Storsalen leid ut hver helg uten ansatt på vakt",
          body: "Bygdas kulturhus drives av frivillige. Storsalen leies ut til konfirmasjoner, jubileer og bygdefester. Vi har ingen ansatt som kan ta imot kontanter eller møte opp for nøkkelovertaking. Med Digilist går alt automatisk: leietaker booker, betaler depositum, signerer avtalen og får adgangskode. Vi får automatisk faktura ført direkte til regnskapet.",
          outcome: [
            { label: "Bookinger per måned", value: "~14" },
            { label: "Fakturarunde", value: "0 min/uke" },
            { label: "Adm.-tid", value: "−80%" }
          ]
        }
      ],
      technical: [
        {
          label: "Bookingmodus",
          value: "Direkte (innbygger booker uten godkjenning) eller med saksbehandler-godkjenning per anlegg."
        },
        {
          label: "Betaling",
          value: "Vipps, kort (via Stripe), faktura (EHF/Peppol for organisasjoner). Depositum holdes som pre-autorisasjon eller engangsbeløp."
        },
        {
          label: "Leieavtale",
          value: "Digital signering med BankID eller ID-porten. Maler per arrangement-type. Lagring i 10 år iht. bokføringsloven."
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS (mobilnøkkel + kode), eller kobling mot eksisterende fysiske adgangskontroll-systemer via integrasjon."
        },
        {
          label: "Avbestilling",
          value: "Konfigurerbare regler per lokale (full refusjon, delvis, ingen refusjon). Refusjon initieres automatisk ved kansellering."
        },
        {
          label: "Skader / klage",
          value: "Eier kan registrere skader innen 48 timer etter arrangement og bruke depositum til dekning. Saksbehandler beslutter ved tvist."
        },
        {
          label: "Personvern",
          value: "All persondata i Norge og EU. GDPR-kompatibel. Data slettes 10 år etter siste booking."
        },
        {
          label: "Universell utforming",
          value: "WCAG 2.1 AA. BankID + ID-porten fungerer for alle innbyggere uavhengig av digital ferdighet."
        }
      ],
      pullQuote: {
        text: "Tidligere holdt vi styr på bookinger i regneark. Nå ser gjestene ledige helger selv, betaler depositum og signerer leieavtalen med BankID. Vi unngår dobbeltbookinger og får automatisk faktura.",
        byline: "Eier av Rønning Selskapslokale, Asker"
      },
      faq: [
        {
          question: "Hvor mye koster det å bruke Digilist for ett selskapslokale?",
          answer: "Prisen avhenger av antall bookinger per måned og om du trenger digitalnøkkel-integrasjon. Basispakken for små eiere starter på et fast månedsbeløp. Vi tilbyr gratis pilot i 30 dager. Be om tilbud for konkret prising."
        },
        {
          question: "Hva skjer hvis leietaker ikke betaler depositum?",
          answer: "Bookingen blir ikke bekreftet før depositumet er reservert via Vipps eller kort. Hvis depositumet feiler, blir tidsluken fri igjen etter 30 minutter, og kunden får e-post om å prøve igjen."
        },
        {
          question: "Kan jeg ha forskjellige priser i helg vs ukedag?",
          answer: "Ja. Priser settes per dag, time-block eller hel-leie. Du kan også ha sesongpriser (sommer vs vinter), eller spesielle priser for spesifikke dagsoner som nyttårsaften."
        },
        {
          question: "Hvordan håndteres skader på lokalet etter arrangement?",
          answer: "Du har 48 timer på å registrere skader via plattformen, med bilde og beskrivelse. Hele eller deler av depositumet kan brukes til dekning. Leietaker varsles automatisk og kan klage hvis uenig. Saksbehandler avgjør tvist."
        },
        {
          question: "Kan flere personer i samme husholdning booke under samme konto?",
          answer: "Ja. Innbyggeren kan ha en personlig konto (logget inn med BankID) eller booke på vegne av en organisasjon (også med BankID). All historikk er knyttet til den juridiske parten som signerte leieavtalen."
        },
        {
          question: "Vi er en kommune. Kan vi bruke Digilist for selskapslokaler som tilhører kommunen?",
          answer: "Absolutt. Kommunale selskapslokaler kan administreres på lik linje med private, med ID-porten-pålogging, EHF-fakturering og kommunal driftsrolle-varsling. Se også /bookingsystem-kommune for SSA-L 2026-overflate."
        }
      ],
      relatedPosts: [
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger"
        },
        {
          title: "Sømløs betaling med Vipps og EHF",
          slug: "somlos-betaling-vipps-ehf"
        },
        {
          title: "Magic-link, SMS og BankID: sikker innlogging",
          slug: "magic-link-sms-bankid-sikker-innlogging"
        }
      ],
      siblings: SIBLINGS$3
    }
  );
}
const SIBLINGS$2 = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" }
];
function UseCaseMoterom() {
  return /* @__PURE__ */ jsx(
    UseCasePage,
    {
      slug: "moterom",
      breadcrumb: "Møterom",
      title: "Møterom",
      dek: "Kommunale møterom, næringsbygg, foreningslokaler. Sambruk mellom avdelinger, pris per brukergruppe, og hver booking i samme kalender.",
      lead: "Møterom er det mest brukte og oftest dobbeltbookede rommet i en organisasjon. Digilist gir deg én sanntidskalender for alle møterom, prising som vet om brukeren er ansatt, lag, forening eller innbygger, og automatiske varsler til vaktmester når et nytt møte skal arrangeres utenom åpningstid.",
      seoTitle: "Møterom: bookingsystem for kommuner og næringsbygg · Digilist",
      seoDescription: "Bookingsystem for kommunale møterom, næringsbygg og foreningslokaler. Sanntidskalender, sambruk, prising per brukergruppe og Outlook-integrasjon.",
      keywords: "møterom booking, kommunal møterom, næringsbygg møterom, Outlook integrasjon, sambruk møterom, prising per brukergruppe, foreningslokaler",
      audience: [
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Rådhus, sektorbygg og kulturhus med møterom som brukes av ansatte, politikere, lag og foreninger, og av og til innbyggere."
        },
        {
          persona: "Næringsbygg og co-working",
          context: "Eiendomsbesittere som leier ut møterom som tilleggstjeneste til leietakere, eller til eksterne kunder på timesbasis."
        },
        {
          persona: "Foreningslokaler og bedehus",
          context: "Lokaler som lag og foreninger deler på fastsatte tidspunkt, med behov for åpenhet om hvem som bruker hva og når."
        },
        {
          persona: "Hoteller og konferansesentre",
          context: "Møterom som leies ut individuelt eller som del av konferansepakke, med koordinering mot hovedreservasjonssystem."
        },
        {
          persona: "Skoler og høyskoler",
          context: "Klasserom og auditorier som brukes som møterom utenfor undervisningstid, med behov for sambruk uten konflikt."
        },
        {
          persona: "Helseforetak og kontorbygg",
          context: "Sykehus, kommunehelse og store kontorbygg som har dusinvis av møterom som må koordineres på tvers av avdelinger."
        }
      ],
      problems: [
        "Møterom står tomme fordi de er reservert i Outlook av noen som ikke møtte opp. Ingen frigjøring, ingen sanksjon.",
        "Foreninger og innbyggere må sende e-post for å booke kommunale møterom. Saksbehandlere bruker timer per uke på dette.",
        "Prising er kompleks: ansatte gratis, foreninger redusert, kommersielle full pris, men det blir aldri konsekvent håndhevet.",
        "Vaktmester får ikke beskjed når en booking er utenfor åpningstid. Bruker må vente på inngangen til noen kommer.",
        "Møterom-data lever i 3-4 systemer (Outlook, Excel, kalenderapp, regneark for utleie til foreninger). Ingen kan svare på 'er det ledig på torsdag?'"
      ],
      features: [
        {
          title: "Én sanntidskalender for alle møterom",
          body: "Ansatte ser ledige tider i Outlook-integrasjonen. Foreninger og innbyggere ser samme kalender via offentlig nettside. Ingen mulighet for dobbeltbooking."
        },
        {
          title: "Prising per brukergruppe",
          body: "Ansatte gratis, politikere gratis, foreninger redusert, kommersielle full. Reglene defineres én gang og håndheves automatisk basert på brukerprofil."
        },
        {
          title: "Outlook-toveis sync",
          body: "Bookinger gjort i Digilist vises i ansattes Outlook-kalender. Bookinger gjort i Outlook (kun for ansatte) skrives tilbake til Digilist for sanntidsstatus."
        },
        {
          title: "Auto-varsling til driftsroller",
          body: "Vaktmester får SMS når møte er bekreftet utenom åpningstid. Renhold varsles om ekstra-rom som må klargjøres. Vekter varsles om kveld-arrangementer."
        },
        {
          title: "Sambruksregler",
          body: "Møterom kan deles mellom avdelinger eller institusjoner med faste tidsblokk og prioriteringsregler, eller helt åpen sambruk hvor først-til-mølla gjelder."
        },
        {
          title: "Bekreftelse og frigjøring",
          body: "Bookeren må bekrefte oppmøte 15 minutter før møtet starter (via SMS-lenke). Ubekreftet booking frigjør rommet automatisk til andre."
        }
      ],
      stories: [
        {
          customer: "Nordre Follo kommune",
          role: "Kulturkonsulent (Viken)",
          headline: "12 anlegg, én kalender: alle ser samme bilde",
          body: "Vi hadde tidligere én Outlook-kalender per anlegg og separat e-post-håndtering for forenings-bookinger. Nå booker både ansatte, politikere og lag og foreninger gjennom Digilist. Saksbehandlere godkjenner forenings-bookinger med ett klikk, vaktmester får automatisk varsel om kveld-arrangementer, og vi ser i sanntid hvor mye hvert rom faktisk brukes.",
          outcome: [
            { label: "Anlegg i drift", value: "12" },
            { label: "Aktive lag/foreninger", value: "~340" },
            { label: "Bookinger/mnd", value: "~1 200" }
          ]
        },
        {
          customer: "Næringsbygg-eksempel",
          role: "Eiendomsdrift",
          headline: "Møterom som tilleggstjeneste, uten manuell oppfølging",
          body: "Vi leier ut møterom til våre faste kontorleietakere og til eksterne på timesbasis. Tidligere ringte folk resepsjonen, vi sjekket Excel, sendte e-post med bekreftelse, fulgte opp betaling. Nå booker leietakerne selv via en lenke, betaler med Vipps eller faktura, og får adgangskode automatisk. Eksterne kunder oppdager møterommene via Google og booker uten å snakke med oss.",
          outcome: [
            { label: "Tomgang", value: "−45%" },
            { label: "Inntekter fra eksterne", value: "+3×" },
            { label: "Resepsjons-tid", value: "−4 t/uke" }
          ]
        }
      ],
      technical: [
        {
          label: "Bookingmodus",
          value: "Direkte (ansatte og lag), saksbehandler-godkjenning (innbyggere, kommersielle), eller åpen (først til mølla)."
        },
        {
          label: "Outlook-integrasjon",
          value: "Toveis CalDAV/Microsoft Graph. Free/busy-status hentes fra og skrives til kalenderen. Møteinvitasjoner sendes til deltakere."
        },
        {
          label: "Prising",
          value: "Per time, halvdag, heldag, eller fastpris. Tariffer per brukergruppe (ansatt, politiker, lag, kommersiell, innbygger). Sesongrabatter mulig."
        },
        {
          label: "Sambruk",
          value: "Faste tidsblokk per avdeling/institusjon med prioritering, eller helt åpen sambruk. Konflikter løses automatisk i prioritetsrekkefølge."
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS digital nøkkel (mobil/kode), eller integrasjon mot eksisterende fysisk adgangskontroll. Aktiv 15 min før til 15 min etter booking."
        },
        {
          label: "Bekreftelse",
          value: "Bookeren får SMS 15 min før møtet med lenke 'jeg er på vei'. Manglende bekreftelse frigjør rommet etter 5 min for automatisk tildeling til ventelisten."
        },
        {
          label: "Bilag og faktura",
          value: "Ansatt-bookinger: ingen bilag. Lag/forening: faktura månedlig samlet. Kommersielle: faktura per booking via EHF/Peppol til regnskapssystemet."
        },
        {
          label: "Innbygger-tilgang",
          value: "Logge inn med ID-porten. Se kommunale møterom som er åpne for innbyggerbruk, book i sanntid."
        }
      ],
      pullQuote: {
        text: "Vi har redusert dobbeltbookinger til null og fått tilbake fire timer i uka som tidligere gikk til regnearkjusteringer.",
        byline: "Kulturkonsulent, norsk kommune (anonymisert)"
      },
      faq: [
        {
          question: "Hva skjer hvis to ansatte prøver å booke samme rom samtidig?",
          answer: "Kalenderen oppdateres med optimistisk lås. Den første som klikker 'bekreft booking' vinner. Den andre ser umiddelbart at tiden er borte og må velge et annet rom eller tid. Ingen dobbeltbooking mulig."
        },
        {
          question: "Kan vi importere våre eksisterende Outlook-bookinger?",
          answer: "Ja. Vi importerer historiske og fremtidige Outlook-bookinger ved oppstart. Etter importen er Digilist sannhetskilden, og Outlook synces toveis derfra."
        },
        {
          question: "Hvordan håndteres bookinger som overlapper med rengjøring?",
          answer: "Rengjørings-vinduer er definert per rom (f.eks. 10 min etter hver booking). Plattformen blokkerer automatisk denne tiden, og renholdspersonell får varsel om når og hvor."
        },
        {
          question: "Kan foreninger booke gratis hvis vi har avtale med dem?",
          answer: "Ja. Foreningstilskudd er en egen prisregel: foreninger som er registrert hos kommunen kan booke utvalgte rom gratis innenfor et årlig tildelt antall timer. Plattformen holder regnskap."
        },
        {
          question: "Hva med universell utforming for innbyggere som ikke er digitale?",
          answer: "Plattformen oppfyller WCAG 2.1 AA. Saksbehandlere kan booke på vegne av innbyggere som ikke kan logge inn selv. Vi tilbyr også enkel SMS-flyt for de mest grunnleggende bookingene."
        },
        {
          question: "Hva er forskjellen mellom et møterom og et selskapslokale i Digilist?",
          answer: "Møterom har typisk timesbasert booking, Outlook-integrasjon, ansatt-pålogging. Selskapslokaler har dag-/helg-basert booking, depositum, signert leieavtale. Du kan ha begge typer på samme plattform."
        }
      ],
      relatedPosts: [
        {
          title: "Bookingkalender for innbygger og saksbehandler",
          slug: "bookingkalender-for-innbygger-og-saksbehandler"
        },
        {
          title: "Realtime-varsler og driftsroller",
          slug: "realtime-varsler-driftsroller"
        },
        {
          title: "En plattform mot fem verktøy",
          slug: "en-plattform-mot-fem-verktoy"
        }
      ],
      siblings: SIBLINGS$2
    }
  );
}
const SIBLINGS$1 = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Møterom", slug: "moterom" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" }
];
function UseCaseIdrettshaller() {
  return /* @__PURE__ */ jsx(
    UseCasePage,
    {
      slug: "idrettshaller-gymsaler",
      breadcrumb: "Idrettshaller og gymsaler",
      title: "Idrettshaller og gymsaler",
      dek: "Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger. Privat trening, treningsturneringer og åpen hall, i samme kalender.",
      lead: "Idrettshaller er det mest komplekse å booke i en kommune. Du har lag som trenger fast tid hele sesongen, foreninger som vil leie inn fra utsiden, innbyggere som vil booke gymsal en lørdag, og halvhalls-bookinger som må kunne kombineres uten å låse motsatte halvdel. Digilist løser dette med sesongleie-modul, sambruk og automatisk fordeling.",
      seoTitle: "Idrettshall booking: bookingsystem for kommuner og foreninger · Digilist",
      seoDescription: "Bookingsystem for idrettshaller og gymsaler. Sesongleie til lag og foreninger, halvhalls-bookinger, sambruk, kommunal innbyggerinnlogging via ID-porten.",
      keywords: "idrettshall booking, gymsal booking, sesongleie idrettslag, halvhalls booking, foreningstilskudd, kommunal idrett, idrettsanlegg, fritidsdrift",
      audience: [
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Eiere av idrettshaller, gymsaler, fotballbaner, svømmehaller, som leies ut til lag, foreninger, skoler og innbyggere."
        },
        {
          persona: "Idrettsklubber og lag",
          context: "Brukere av kommunale anlegg: trenger fast trening flere ganger per uke gjennom hele sesongen, og enkeltbookinger for kamper og turneringer."
        },
        {
          persona: "Skoler og videregående",
          context: "Bruker gymsalen i undervisningstid, leier den ut til lag og foreninger ettermiddag/kveld. Trenger sambruk uten konflikt."
        },
        {
          persona: "Idrettsstiftelser",
          context: "Stiftelser som drifter spesifikke anlegg (svømmehall, ishall) på vegne av kommunen, med flere brukergrupper og prising."
        },
        {
          persona: "Velforeninger og bydeler",
          context: "Mindre anlegg drevet av velforening eller bydelsadministrasjon, gjerne med begrenset administrasjon men mange brukere."
        },
        {
          persona: "Private treningsanlegg",
          context: "Private bedrifter som leier ut tennishaller, paddelbaner, klatrevegger, på timesbasis til private og bedrifter."
        }
      ],
      problems: [
        "Sesongtildeling gjøres manuelt i Excel. Det tar uker hver høst, og konflikter løses i lukkede møter uten åpenhet for foreningene.",
        "Halvhalls-bookinger blir feilbooket fordi systemet ikke skjønner at to halve haller = én hel hall. Doble bookinger på den motsatte halvdelen oppdages midt i treningen.",
        "Foreningstilskudd holdes regnskap for i Excel. Hver forening har et tildelt antall timer, men ingen kan svare på hvor mye som er brukt midtveis i sesongen.",
        "Vaktmester får ikke alltid beskjed om kveld-bookinger, og må fysisk komme for å låse opp, eller innbyggere står ute i kulden.",
        "Lag som ikke møter opp blokkerer halltimer som andre kunne brukt, uten automatisk frigjøring eller vurdering av faste tildelinger."
      ],
      features: [
        {
          title: "Sesongleie-modul",
          body: "Lag og foreninger søker om fast tid for sesongen via plattformen. Saksbehandler tildeler basert på prioritet (alder, kjønn, geografi), og systemet låser tidene automatisk for hele perioden."
        },
        {
          title: "Halvhalls + hel-halls i samme kalender",
          body: "Plattformen skjønner topologien av anlegget. Booker du halvhalls A og halvhalls B samtidig, registreres det som hel hall. Booker du hel hall, blokkeres begge halvdeler."
        },
        {
          title: "Foreningstilskudd-regnskap",
          body: "Hver forening har et årlig tildelt timeantall. Plattformen teller automatisk og varsler når foreningen nærmer seg grensen. Tildeling kan justeres midt i sesongen ved behov."
        },
        {
          title: "Driftsrolle-varsling",
          body: "Vaktmester får SMS om kveld-bookinger. Renhold får varsel om kamper og turneringer som krever ekstra rengjøring etter. Vekter får liste over hvem som har adgang når."
        },
        {
          title: "Adgangskontroll via Salto KS",
          body: "Mobilnøkkel sendes til lagledere 30 min før hver trening, deaktiveres automatisk etter sluttid. Ingen fysisk nøkkeloverlevering, ingen vaktmester behøver å være tilstede."
        },
        {
          title: "Privat booking + åpen hall",
          body: "Samme anlegg kan også leies av privatpersoner (lørdag gymsalbooking, helger med Vipps-betaling) og kjøres som åpen hall (gratis innbyggertid). Alt i samme kalender."
        }
      ],
      stories: [
        {
          customer: "Norsk kommune",
          role: "Idrettskoordinator (anonymisert)",
          headline: "Sesongtildeling som tok 3 uker, nå tar 4 dager",
          body: "Tidligere brukte vi hele september på sesongtildeling: møter, e-poster, Excel-tabeller, konflikter. Med Digilist søker lagene digitalt, vi ser alle søknader i et dashboard, tildeler basert på regler vi har definert opp, og hele tildelingen er klar før månedsslutt. Lagene får automatisk varsel om sine tildelte tider, og kan bytte seg imellom hvis avtalt.",
          outcome: [
            { label: "Sesongtildelings-tid", value: "−85%" },
            { label: "Konfliktsaker", value: "−70%" },
            { label: "Lag i systemet", value: "47" }
          ]
        },
        {
          customer: "Idrettslag-eksempel",
          role: "Lagleder",
          headline: "Vi vet om vi har fått hallen, lenge før sesongen starter",
          body: "Som lagleder har jeg ansvar for at vi har trening for fire aldersgrupper i halvhalls-format. Tidligere fikk vi vite tildelinger sent i august, og måtte ofte bytte med andre lag. Nå søker vi i juni, får svar i juli, og kan planlegge treneropplegget i god tid. Hvis vi trenger ekstra tid for kamp, kan vi se ledige timer i sanntid.",
          outcome: [
            { label: "Tildeling-frist", value: "−6 uker" },
            { label: "Trening flyttet", value: "−50%" },
            { label: "Lagledere fornøyd", value: "9/10" }
          ]
        }
      ],
      technical: [
        {
          label: "Halltopologi",
          value: "Hver hall defineres med opptil 4 halvdeler. Halvhalls-bookinger sjekkes mot motsatte halvdel før bekreftelse. Hel hall blokkerer alle halvdeler automatisk."
        },
        {
          label: "Sesongleie-flyt",
          value: "Søknad → saksbehandler-tildeling med drag-and-drop → bekreftelse til lagleder → automatisk låsing av alle sesongens tider. Endringer underveis varsler alle berørte."
        },
        {
          label: "Foreningstilskudd",
          value: "Per forening: tildelt antall timer per sesong, faktisk forbruk, justeringer. Varsel ved 75% forbruk og blokkering ved 100% (med override-mulighet for saksbehandler)."
        },
        {
          label: "Prising",
          value: "Per time, halvdag, heldag. Tariffer per brukergruppe (kommunale, idrettslag, foreninger, privat). Gratis for tildelte sesongtimer, betalt for ekstra."
        },
        {
          label: "Adgang",
          value: "Salto KS mobilnøkkel/PIN-kode aktiv 30 min før til 30 min etter. Lagleder mottar adgang for hele sesongen i én strøm."
        },
        {
          label: "Drift",
          value: "Vaktmester får varsel om bookinger utenfor åpningstid. Renhold får dag-rapport over morgenens første og kveldens siste booking per anlegg."
        },
        {
          label: "Kamper og turneringer",
          value: "Engangsbookinger på toppen av sesongleie. Kan kreve fysisk vakthold (vekter) og dobbel renhold. Alt varsles automatisk."
        },
        {
          label: "Pålogging",
          value: "Innbyggere: BankID. Lagledere: ID-porten eller magic-link til e-post. Saksbehandlere: ID-porten med ansattlegitimasjon."
        },
        {
          label: "Avbestilling og fravær",
          value: "Sent avbestilte timer kan utløse 'no-show'-rapport. Etter 3 uvarsl fravær får saksbehandler varsel om å revurdere foreningens tildeling."
        }
      ],
      pullQuote: {
        text: "Sesongtildeling tok hele september. Nå er den ferdig før månedsslutt, og lagene har færre konflikter fordi prosessen er åpen og spillereglene er kjent.",
        byline: "Idrettskoordinator, norsk kommune"
      },
      faq: [
        {
          question: "Kan vi håndtere både kommunale anlegg og private treningsanlegg samme sted?",
          answer: "Ja. Plattformen kjenner forskjellen: kommunale anlegg har foreningstilskudd og innbyggertilgang via ID-porten, private anlegg har egne priser og kortbetaling. Du kan ha begge i samme installasjon."
        },
        {
          question: "Hvordan håndteres prioritering mellom lag i sesongtildeling?",
          answer: "Prioritetsregler defineres av kommunen. Typisk: aldersbestemt prioritet, kjønnsfordeling, geografisk tilhørighet, antall lag i samme klubb. Systemet kjører tildelingen automatisk basert på dine regler, og saksbehandler godkjenner eller justerer."
        },
        {
          question: "Hva med svømmehaller, har de samme bookingflyt?",
          answer: "Svømmehaller har samme grunnlogikk men ofte mer komplekse driftsbehov (klorlys, vannprøver, vaktbemanning). Vi har egne integrasjoner for svømmehall-spesifikk drift. Spør om en demo av svømmehall-konfigurasjon."
        },
        {
          question: "Kan lagledere bytte tildelte tider seg imellom?",
          answer: "Ja, hvis kommunen aktiverer 'bytte-funksjonalitet'. Lagleder A foreslår bytte med lagleder B, B godtar eller avslår, og saksbehandler kan godkjenne hvis ønskelig. Alle endringer er logget."
        },
        {
          question: "Hvordan integrerer vi med ID-porten for innbyggerinnlogging?",
          answer: "Vi er en registrert tjenesteleverandør hos Digdir. Konfigurasjon tar typisk 1-2 uker fra signert avtale til produksjonsbruk. Vi støtter ID-porten Sikkerhetsnivå 3 og 4."
        },
        {
          question: "Hva skjer hvis kommunen vil endre fra ett bookingsystem til Digilist midt i sesongen?",
          answer: "Vi har gjort dette flere ganger. Vi importerer sesongtildeling fra Excel eller eksisterende system, kjører parallell-test i 2-4 uker, og bytter når begge systemer viser samme data. Ingen sesong må starte på nytt."
        }
      ],
      relatedPosts: [
        {
          title: "Sesongleie og fordeling for lag og foreninger",
          slug: "sesongleie-fordeling-lag-foreninger"
        },
        {
          title: "Sanntidskalender for kommunal booking",
          slug: "sanntidskalender-kommunal-booking"
        },
        {
          title: "Saksbehandler: godkjenne, avvise, kommunisere",
          slug: "saksbehandler-godkjenne-avvise-kommunisere"
        }
      ],
      siblings: SIBLINGS$1
    }
  );
}
const SIBLINGS = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Møterom", slug: "moterom" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" }
];
function UseCaseKulturhus() {
  return /* @__PURE__ */ jsx(
    UseCasePage,
    {
      slug: "kulturhus-kantiner",
      breadcrumb: "Kulturhus og kantiner",
      title: "Kulturhus og kantiner",
      dek: "Forestillinger, konserter, åpne dager. Adgangskontroll via Salto KS, automatisk varsling av driftsroller og bilag direkte til regnskap.",
      lead: "Kulturhus og kantiner er offentlige arenaer. De skal være tilgjengelige, drives sikkert, og levere alt fra en intim teater-forestilling til en åpen lørdagskafé på samme uke. Digilist gir kulturhus-administrasjonen sanntidskalender, billettsalgs-integrasjon, vakts-varsling, og automatiske bilag til regnskapssystemet, uten å fjerne det menneskelige preget.",
      seoTitle: "Kulturhus og kantiner: bookingsystem for kommunale arenaer · Digilist",
      seoDescription: "Bookingsystem for kulturhus, kantiner og kommunale arenaer. Forestillinger, konserter, åpne dager. Adgangskontroll, driftsrolle-varsling, EHF-fakturering.",
      keywords: "kulturhus booking, kantine booking, kommunal kantine, kulturhus arrangement, Salto KS, kulturhus utleie, kommunal kultur, åpne dager",
      audience: [
        {
          persona: "Kommunale kulturhus",
          context: "Hovedarena for kommunens kulturliv: bruk av kulturkonsulent for arrangement, ekstern utleie til konserter og bryllup, åpne dager for innbyggere."
        },
        {
          persona: "Stiftelser og kulturhus-AS",
          context: "Selvstendige kulturhus drevet på vegne av eller med tilskudd fra kommunen. Har egen drift men deler infrastruktur med kommunal billettsalg eller turnévirksomhet."
        },
        {
          persona: "Kantiner i kommunehus",
          context: "Lunsj-kantiner som også brukes som arrangement-areal kveld og helg, for jubileer, foreningsmøter eller eksterne arrangement."
        },
        {
          persona: "Konsert- og scenekunstaktører",
          context: "Eksterne arrangører som leier kulturhus eller scenearealer for konsert, teater, foredrag, trenger forutsigbar pris og rask bekreftelse."
        },
        {
          persona: "Bibliotek og museer",
          context: "Offentlige institusjoner som leier ut møtefasiliteter eller arrangementsareal, ofte gratis til frivillighet og betalt til kommersielle."
        },
        {
          persona: "Bydelshus og frivillighetssentral",
          context: "Lokalsamfunns-arenaer drevet av kommunen eller frivillighet, ofte med liten administrasjon men mange brukere på dugnad."
        }
      ],
      problems: [
        "Forestillinger, konserter og åpne dager krever forskjellig drift, men alt går gjennom samme kalender uten differensiering.",
        "Vakter, renhold, AV-tekniker, kafé-personale må alle informeres separat, i dag via separate e-poster eller ringerunde dagen før.",
        "Eksterne kunder ringer kulturhus-administrasjon for booking-forespørsel; pris og tilgjengelighet svares manuelt etter 'la meg sjekke kalenderen'.",
        "Kantiner brukes til arrangement på kvelden, men kafé-driften vet ikke om noen booket lokalet før folk møter opp.",
        "Bilag for utleie og bookinger må manuelt registreres i regnskapet. Kulturhus-administrasjon bruker timer per måned på dette."
      ],
      features: [
        {
          title: "Differensiert arrangement-flyt",
          body: "Forestilling, konsert, jubileum, åpen dag og firmaarrangement har hver sin booking-mal med riktige felter, godkjenningstrinn og driftsrolle-varsler."
        },
        {
          title: "Driftsrolle-varsling",
          body: "Vakter, renhold, lyd-teknikker, kafé-leder, vekter, får alle automatisk SMS med relevant info når en booking er bekreftet. Ingen mottakerlister å vedlikeholde manuelt."
        },
        {
          title: "Sanntidskalender + ekstern booking",
          body: "Kulturhus-administrasjon ser alle bookinger samme sted. Eksterne kunder kan se ledige datoer på offentlig nettside og forhåndsbestille. Saksbehandler godkjenner med ett klikk."
        },
        {
          title: "Salto KS adgangskontroll",
          body: "Mobilnøkkel/PIN-kode aktiveres automatisk for arrangører og leverandører. Kafé har permanent tilgang, eksterne arrangører får tidsbegrenset tilgang."
        },
        {
          title: "Billettsalgs-integrasjon",
          body: "For arrangement med billett kobles vi mot ekstern billettleverandør (Ticketmaster, Hoopla, ven). Antall solgte plasser oppdateres mot kapasitetsgrensen."
        },
        {
          title: "Bilag og EHF-faktura",
          body: "Etter hvert arrangement sendes bilag automatisk til kommunens regnskapssystem (Visma, Tripletex, EHF/Peppol). Inntekter delt på riktig kostnadssted og kontoplan."
        }
      ],
      stories: [
        {
          customer: "Kommunalt kulturhus",
          role: "Kulturkonsulent (eksempel-persona)",
          headline: "Tre arrangementer per kveld uten å miste oversikten",
          body: "Vi har storsal, kafé, blackbox og foajé, fire arenaer som ofte kjøres parallelt. Tidligere brukte vi Outlook og en delt Excel for å koordinere. Nå har vi én sanntidskalender, og når en konsert bekreftes får lyd-tekniker og renhold automatisk SMS med scenisk plan og oppmøtetid. Vi fikk satt opp 23 arrangementer den siste måneden uten en eneste koordineringsfeil.",
          outcome: [
            { label: "Koordineringsfeil", value: "0" },
            { label: "Adm.-tid", value: "−55%" },
            { label: "Arrangement/mnd", value: "23" }
          ]
        },
        {
          customer: "Bygdas frivillighetshus",
          role: "Frivillig daglig leder",
          headline: "Bygda har 60 arrangementer i året, alle gjennom plattformen",
          body: "Vi drives av frivillighet og har ingen kontortid. Bygdas folk bruker huset til møter, fester, korøvelser, dugnadsmøter, alt mulig. Tidligere måtte folk ringe meg på fritiden eller sende SMS. Nå booker de selv via Digilist, betaler hvis nødvendig, og får tilgang automatisk. Jeg ser hva som skjer hver kveld i et oversiktsbilde, men trenger ikke gjøre noe annet enn å åpne dørene mentalt.",
          outcome: [
            { label: "Bookinger/år", value: "~60" },
            { label: "Min/uke på admin", value: "<30 min" },
            { label: "Brukere", value: "alle aldre" }
          ]
        }
      ],
      technical: [
        {
          label: "Arrangement-maler",
          value: "Forhåndsdefinert per type: forestilling (krever lyd-tekniker), konsert (krever vekter), jubileum (krever renhold), åpen dag (krever vakt). Maler kan tilpasses."
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS digital nøkkel (mobil + PIN). Permanent for kafé-personale, tidsbegrenset for eksterne arrangører. Adgangslogg lagret 90 dager."
        },
        {
          label: "Driftsrolle-flyt",
          value: "Hver rolle (vakt, renhold, lyd, scene, kafé) har konfigurerbar varslings-mal og påkrevd oppmøtetid før/etter arrangement. SMS + e-post."
        },
        {
          label: "Billettsalg",
          value: "Integrasjon mot Hoopla, Ticketmaster, ven (norsk leverandør). Antall solgte oppdateres mot kapasitetsgrensen. Refusjon ved kansellering håndteres av billettleverandør."
        },
        {
          label: "Prising",
          value: "Per arrangement-type med differensiering for ideell, kommersiell, kommunal egen bruk, og innbygger. Refusjonsregler konfigurerbare per type."
        },
        {
          label: "Drift av kantine + arrangement",
          value: "Kantine-personale ser hvilke arrangementer som krever kveld-bemanning. Inntekter fra arrangement-utleie og kantinedrift skilles automatisk i regnskap."
        },
        {
          label: "Pålogging",
          value: "Innbyggere: BankID. Eksterne arrangører: BankID eller magic-link. Driftspersonale: ID-porten. Saksbehandlere: ID-porten ansattlegitimasjon."
        },
        {
          label: "Regnskap og kostnadssted",
          value: "Bilag konteres automatisk på riktig kostnadssted (kulturhus, kantine, ekstern utleie). EHF-faktura via Peppol til kommunens fakturasystem."
        },
        {
          label: "Personvern",
          value: "GDPR-kompatibel. ISO 27001 + 27701-sertifisert. Adgangslogger anonymiseres etter 90 dager, transaksjonslogger oppbevares 10 år iht. bokføringsloven."
        }
      ],
      pullQuote: {
        text: "Tre arrangement parallelt på en lørdagskveld, uten en eneste e-post mellom oss og lyd-teknikker. Alle vet hvor de skal være og når.",
        byline: "Kulturkonsulent, norsk kommune"
      },
      faq: [
        {
          question: "Vi har et eksternt billettsystem fra før. Kan vi beholde det?",
          answer: "Ja. Vi integrerer mot Hoopla, Ticketmaster, ven og flere. Du beholder ditt eksisterende billettsystem som primær for billett, mens Digilist håndterer lokal-/kalenderbooking og driftsrolle-varsling rundt arrangementet."
        },
        {
          question: "Hvordan håndteres innbygger som booker selv vs ekstern arrangør?",
          answer: "Plattformen kjenner forskjellen via pålogging og rolletilordning. Innbyggere (BankID) booker innenfor egne timer/regler. Eksterne (BankID, men registrert som kommersiell aktør) får annen flyt med pris, faktura og kontrakt."
        },
        {
          question: "Kan kafé- og lunsj-drift bookes via samme plattform?",
          answer: "Kafé-drift er typisk åpningstid + booking-tilfeller på toppen. Vi kan ha kafé-arealet som default 'åpent' i åpningstid og kun blokkere ved spesielle bookinger (firmaarrangement, jubileum) som krever full overtagelse."
        },
        {
          question: "Hva med arrangementer som krever bevilling (alkohol, mat-servering)?",
          answer: "Bevillingssøknader håndteres separat hos kommunen. Plattformen har felter for å registrere om bevilling er innhentet, og kan ikke fullføre bekreftelse uten godkjent bevilling for relevante arrangement-typer."
        },
        {
          question: "Kan saksbehandlere booke på vegne av innbyggere som ikke kan logge inn?",
          answer: "Ja. Saksbehandler kan registrere booking på telefon-/personlig oppmøte og bekrefte direkte. Innbyggeren får e-post-/SMS-kvittering. All bookinghistorikk er knyttet til personen, ikke saksbehandleren."
        },
        {
          question: "Hvordan integrerer vi med kommunens eksisterende driftsstyringssystem?",
          answer: "Vi har åpne API-er for å sende bookingdata til IFS, IBM Maximo, Plania og andre driftsstyringssystemer. Vakter og renhold kan beholde sine eksisterende grensesnitt mens Digilist er sentralregister."
        }
      ],
      relatedPosts: [
        {
          title: "Realtime-varsler og driftsroller",
          slug: "realtime-varsler-driftsroller"
        },
        {
          title: "Faktura, refusjon og avstemming",
          slug: "faktura-refusjon-avstemming"
        },
        {
          title: "Min Side: alle bookinger på ett sted",
          slug: "min-side-alle-bookinger-paa-ett-sted"
        }
      ],
      siblings: SIBLINGS
    }
  );
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
function deviceBucket() {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}
function RumReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (SKIP_PATH_PREFIXES.some((p) => window.location.pathname.startsWith(p))) {
      return;
    }
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const visitor_id = getVisitorId();
    const device = deviceBucket();
    const convexUrl = "http://127.0.0.1:6310";
    let cancelled = false;
    let clientPromise = null;
    const getClient = () => {
      if (!clientPromise) {
        clientPromise = Promise.all([
          import("convex/browser"),
          Promise.resolve().then(() => api$1)
        ]).then(([{ ConvexHttpClient }, { api: api2 }]) => ({
          client: new ConvexHttpClient(convexUrl),
          ingestRef: api2.audits.rum.ingest
        }));
      }
      return clientPromise;
    };
    const send = (metric, value, rating, nav_type) => {
      if (cancelled) return;
      void getClient().then(
        ({ client, ingestRef }) => client.mutation(ingestRef, {
          origin,
          pathname,
          metric,
          value,
          rating,
          nav_type,
          device,
          visitor_id
        })
      ).catch(() => {
      });
    };
    void import("web-vitals").then((wv) => {
      if (cancelled) return;
      const handler = (name) => (m) => {
        send(name, m.value, m.rating, m.navigationType);
      };
      wv.onLCP(handler("LCP"));
      wv.onCLS(handler("CLS"));
      wv.onINP(handler("INP"));
      wv.onFCP(handler("FCP"));
      wv.onTTFB(handler("TTFB"));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
const ConvexScope = lazy(() => import("./assets/ConvexScope-DcuG1VNt.js"));
const BlogPost = lazy(() => import("./assets/BlogPost-DcYrJltb.js"));
const BlogPreview = lazy(() => import("./assets/BlogPreview-Dy7f_JRm.js"));
const Status = lazy(() => import("./assets/Status-D_0yXEV8.js"));
const IntelligenceShell = lazy(() => import("./assets/IntelligenceShell--7zvYnaq.js"));
const IntelligenceOverview = lazy(() => import("./assets/IntelligenceOverview-DJ-jVeUU.js"));
const IntelligenceIssues = lazy(() => import("./assets/IntelligenceIssues-CReWQiWZ.js"));
const IntelligenceAgents = lazy(() => import("./assets/IntelligenceAgents-Fev94ukT.js"));
const IntelligenceCompliance = lazy(() => import("./assets/IntelligenceCompliance-h90BBo0-.js"));
const IntelligenceCategoryPage = lazy(
  () => import("./assets/IntelligenceCategory-BvwGHysO.js").then((m) => ({
    default: m.IntelligenceCategoryPage
  }))
);
const IntelligenceScans = lazy(
  () => import("./assets/IntelligenceMisc-Cqkeb7iZ.js").then((m) => ({
    default: m.IntelligenceScans
  }))
);
const IntelligenceSurfaces = lazy(
  () => import("./assets/IntelligenceMisc-Cqkeb7iZ.js").then((m) => ({
    default: m.IntelligenceSurfaces
  }))
);
const IntelligenceSettings = lazy(
  () => import("./assets/IntelligenceMisc-Cqkeb7iZ.js").then((m) => ({
    default: m.IntelligenceSettings
  }))
);
const IntelligenceTransparensPreview = lazy(
  () => import("./assets/IntelligenceMisc-Cqkeb7iZ.js").then((m) => ({
    default: m.IntelligenceTransparensPreview
  }))
);
const VekstOverview = lazy(
  () => import("./assets/IntelligenceVekst-CJbBNqDt.js").then((m) => ({
    default: m.VekstOverview
  }))
);
const VekstKeywords = lazy(
  () => import("./assets/IntelligenceVekst-CJbBNqDt.js").then((m) => ({
    default: m.VekstKeywords
  }))
);
const VekstDrafts = lazy(
  () => import("./assets/IntelligenceVekst-CJbBNqDt.js").then((m) => ({
    default: m.VekstDrafts
  }))
);
const VekstConnections = lazy(
  () => import("./assets/IntelligenceVekst-CJbBNqDt.js").then((m) => ({
    default: m.VekstConnections
  }))
);
const VekstAktivitet = lazy(
  () => import("./assets/IntelligenceVekst-CJbBNqDt.js").then((m) => ({
    default: m.VekstAktivitet
  }))
);
const Chatbot = lazy(
  () => import("./assets/index-BIlNOv4O.js").then((m) => ({ default: m.Chatbot }))
);
const RouteFallback = () => /* @__PURE__ */ jsx("div", { className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-ink-faint", children: "Laster…" }) });
function ChatbotMount() {
  const location = useLocation();
  const skip = location.pathname.startsWith("/admin") || location.pathname.startsWith("/blogg/preview");
  if (skip) return null;
  return /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(Chatbot, {}) });
}
function AnimatedRoutesWrap({ children }) {
  const location = useLocation();
  return /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsx("div", { children }, location.pathname) });
}
const queryClient = new QueryClient();
function MotionFirstPaintShim({ children }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: hydrated ? "user" : "always", children });
}
function AppShell() {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: false, children: /* @__PURE__ */ jsx(MotionFirstPaintShim, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsx(Toaster$1, {}),
    /* @__PURE__ */ jsx(Toaster, {}),
    /* @__PURE__ */ jsx(ScrollToTop, {}),
    /* @__PURE__ */ jsx(RumReporter, {}),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteFallback, {}), children: /* @__PURE__ */ jsx(AnimatedRoutesWrap, { children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/book-demo", element: /* @__PURE__ */ jsx(BookDemo, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/bookingsystem-kommune", element: /* @__PURE__ */ jsx(BookingsystemKommune, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/booking-av-lokaler-og-moterom", element: /* @__PURE__ */ jsx(BookingLokalerMoterom, {}) }),
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
      /* @__PURE__ */ jsx(Route, { path: "/salgsvilkar", element: /* @__PURE__ */ jsx(Salgsvilkar, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/personvern", element: /* @__PURE__ */ jsx(Personvern, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(Cookies, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/transparens",
          element: /* @__PURE__ */ jsx(ConvexScope, { children: /* @__PURE__ */ jsx(Transparens, {}) })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/status",
          element: /* @__PURE__ */ jsx(ConvexScope, { children: /* @__PURE__ */ jsx(Status, {}) })
        }
      ),
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
    ] }) }) }),
    /* @__PURE__ */ jsx(CookieConsent, {}),
    /* @__PURE__ */ jsx(ChatbotMount, {})
  ] }) }) }) });
}
async function warm() {
  await import("./assets/BlogPost-DcYrJltb.js");
}
async function render(url) {
  const tree = /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(AppShell, {}) });
  let html = renderToString(tree);
  for (let pass = 0; pass < 5; pass++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const next = renderToString(tree);
    if (next === html) break;
    html = next;
  }
  return html;
}
export {
  Byline as B,
  EditorialHeading as E,
  Footer as F,
  Navbar as N,
  OPEN_CHAT_EVENT as O,
  ProgressRail as P,
  SEO as S,
  getAllPosts as a,
  PageTransition as b,
  getFraunces as c,
  EditorialButton as d,
  api as e,
  formatPostDate as f,
  getPostBySlug as g,
  cn as h,
  SectionRule as i,
  allFAQEntries as j,
  FAQ_CATEGORIES as k,
  openChatbot as o,
  render,
  warm
};
