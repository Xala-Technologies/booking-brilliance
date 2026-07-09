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
import { useConvex, ConvexReactClient, ConvexProvider } from "convex/react";
import { useScroll, useSpring, motion, useMotionValue, useTransform, useReducedMotion, MotionConfig, AnimatePresence } from "framer-motion";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Slot } from "@radix-ui/react-slot";
import { componentsGeneric, anyApi } from "convex/server";
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
const DEFAULT_TITLE = "Digilist — Én plattform for alt som leies ut";
const DEFAULT_DESCRIPTION = "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering — én digital plattform for det norske utleiemarkedet.";
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
      alternateName: "Digilist — Enkel booking",
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
const __vite_glob_0_0 = '---\nslug: automatisert-avbooking-og-refusjon-kommunal-saksbehandling\ntitle: "Slik sparer saksbehandlere timer på avbooking og refusjon"\ndescription: "Automatisert regelbasert refusjonslogikk reduserer manuelle saksbehandlingstimer og minimerer tvister – slik fungerer det i praksis."\ndate: 2026-07-08\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["avbooking", "refusjon", "saksbehandling", "kommunal booking", "automatisering", "leietaker", "betalingsintegrasjon"]\n---\n\nAvbookinger er en uunngåelig del av kommunal utleievirksomhet. Innbyggere og lag melder avbud, tidspunkter endres, og noen ganger må kommunen selv kansellere en reservasjon. Det som varierer, er hvor mye tid saksbehandlere bruker på å håndtere etterspillet – og hvor mange tvister som oppstår fordi reglene ikke er tydelige eller konsekvent håndhevet.\n\nFor mange kommuner er svaret: altfor mye tid, og altfor mange tvister.\n\n## Manuelle avbookinger koster mer enn du tror\n\nEn typisk manuell avbookingsprosess ser slik ut: Innbygger sender e-post eller ringer for å kansellere. Saksbehandler sjekker hvilke regler som gjelder for den aktuelle lokalen og datoen, beregner eventuell refusjon manuelt, sender varsel til leietaker, oppdaterer bookingkalenderen, og registrerer transaksjonen i et regneark eller fagsystem.\n\nTar dette femten minutter per sak, og en mellomstor kommune håndterer 200 avbookinger i året, er det 50 arbeidstimer bare til avbooking – før man regner inn oppfølgingsspørsmål, klager og revisjonsforespørsler.\n\nI Lillestrøm kommune, som forvalter over 80 kommunale lokaler, er dette en reell utfordring. Når hvert enkelt bygg kan ha ulike leievilkår og refusjonsregler, er det krevende å sikre likebehandling og etterprøvbarhet uten systematisk støtte.\n\n## Reglene kommunen må håndtere\n\nAvbooking høres enkelt ut, men regelverket er sammensatt. Kommuner må typisk håndtere:\n\n### Tidsfrister for kansellering\nDe fleste kommuner opererer med differensierte frister – for eksempel full refusjon ved kansellering mer enn 14 dager før, 50 prosent refusjon mellom 7 og 14 dager, og ingen refusjon under 7 dager. Noen lokaler har egne regler basert på størrelse eller leieformål.\n\n### Gebyrstrukturer\nEt administrasjonsgebyr kan trekkes fra uansett når kanselleringen skjer. Gebyret varierer gjerne mellom lokaler og brukergrupper – lag og foreninger kan ha gunstigere vilkår enn kommersielle aktører.\n\n### Full og delvis refusjon\nBeregningen av delvis refusjon må være presis og dokumentert. Hvis leietaker har betalt 2 400 kroner og har krav på 50 prosent refusjon minus 150 kroner i gebyr, skal det stå svart på hvitt hvordan dette er regnet ut.\n\n### Tvangsavbookinger\nNoen ganger er det kommunen som initierer kanselleringen – vedlikehold, dobbeltbooking eller endret bruk av lokalet. Her gjelder egne regler: leietaker har som regel krav på full refusjon, og kommunen kan ha plikt til å tilby alternativt tidspunkt.\n\nUten et system som kjenner og håndhever disse reglene konsekvent, er saksbehandleren den eneste bufferen mot feil og ulikebehandling.\n\n## Hvordan Digilist automatiserer avbooking og refusjon\n\nDigilist lar driftsleder eller IT-ansvarlig definere refusjonsregler per lokaltype, brukergruppe og tidsperiode. Når en kansellering initieres – enten av innbygger, saksbehandler eller systemet – beregner Digilist automatisk hvilken refusjon som skal gis, basert på de forhåndsdefinerte reglene.\n\nSaksbehandler slipper å slå opp regler manuelt eller beregne beløp i hodet. Systemet presenterer en klar anbefaling: «Kansellering 10 dager før leiestart gir 50 % refusjon minus administrasjonsgebyr på 150 kr. Refusjonsbeløp: 1 050 kr.»\n\nSaksbehandler kan godkjenne anbefalingen med ett klikk, eller overstyre med begrunnelse dersom spesielle omstendigheter tilsier det.\n\n## Arbeidsflyt fra kansellering til refusjon\n\nHer er hvordan en typisk avbooking ser ut i Digilist:\n\n**1. Innbygger kansellerer**\nInnbygger logger inn i portalen og kansellerer sin reservasjon. Systemet viser umiddelbart hvilken refusjon de har krav på, basert på gjeldende regler.\n\n**2. Automatisk varsling**\nLeietaker mottar en bekreftelse på e-post med refusjonsbeløp, forventet utbetaling og begrunnelse for beregningen. Ingen ventetid, ingen usikkerhet.\n\n**3. Saksbehandler får saken til gjennomgang**\nDersom kommunens regler krever manuell godkjenning – for eksempel ved refusjon over et visst beløp – havner saken i saksbehandlers kø med all informasjon tilgjengelig. Saksbehandler godkjenner eller overstyrer.\n\n**4. Refusjon utbetales**\nGodkjent refusjon sendes til betalingsløsningen og tilbakeføres til innbyggers opprinnelige betalingsmetode. Ingen ekstra steg, ingen manuell overføring.\n\n**5. Lokalet frigjøres**\nBookingkalenderen oppdateres automatisk, og lokalet blir tilgjengelig for nye reservasjoner fra det tidspunktet kanselleringen gjelder.\n\nHele prosessen kan gjennomføres uten at saksbehandler trenger å åpne e-post, kalender eller regneark.\n\n## Dokumentasjon og sporbarhet for revisjon\n\nEt aspekt som ofte undervurderes, er behovet for etterprøvbarhet. Når kommunens revisor eller en klagebehandler ønsker å se historikken for en bestemt avbooking, må svaret være umiddelbart tilgjengelig.\n\nDigilist lagrer alle avbookinger og refusjoner med:\n\n- Tidspunkt for kansellering (ned til minutt)\n- Hvem som initierte kanselleringen (innbygger, saksbehandler, system)\n- Gjeldende regler på kanselleringstidspunktet\n- Beregnet og utbetalt refusjonsbeløp\n- Eventuelle overstyringer og begrunnelsen for disse\n- Betalingsstatus og utbetalingsdato\n\nDette betyr at saksbehandler kan svare på en revisjonsforespørsel i løpet av sekunder, ikke timer. Og dersom en innbygger klager på en refusjonsbeslutning, finnes det et komplett revisjonsspor som viser at reglene ble fulgt.\n\n## Integrasjon med betalingsløsning\n\nEn vanlig flaskehals i manuell avbookingshåndtering er selve tilbakebetalingen. Saksbehandler må inn i et separat betalingssystem, finne opprinnelig transaksjon, og starte en manuell tilbakeføring. Feil oppstår, og prosessen tar tid.\n\nDigilist er integrert med kommunens betalingsløsning slik at godkjente refusjoner utbetales automatisk til innbyggers opprinnelige betalingsmetode – enten det er bankkort, Vipps eller faktura. Saksbehandler trenger ikke å forlate Digilist-plattformen for å fullføre en refusjon.\n\nFor kommuner som bruker fakturering, håndterer systemet også kreditnotaer og justering av utestående beløp automatisk.\n\n## Hva dette betyr i praksis\n\nNår avbooking og refusjon er regelbasert og automatisert, skjer det flere ting samtidig:\n\nSaksbehandlere bruker færre timer på rutineoppgaver og kan bruke mer tid på saker som faktisk krever skjønn. Innbyggere får raskere svar og klarere informasjon, noe som reduserer antall oppfølgingshenvendelser. Kommunen kan dokumentere konsekvent og rettferdig behandling, noe som er avgjørende dersom en sak havner i klagebehandling.\n\nTvister om refusjoner oppstår nesten alltid fordi reglene er uklare eller ulikt praktisert. Når systemet håndhever samme regler for alle, forsvinner grunnlaget for mange av disse tvistene.\n\n## Se avbookingsmodulen i Digilist\n\nVil du se hvordan dette ser ut i praksis – fra innbyggerens kansellering til saksbehandlers godkjenning og automatisk refusjon? Book en demo, så viser vi deg avbookingsmodulen med din kommunes regelstruktur som utgangspunkt.\n';
const __vite_glob_0_1 = '---\nslug: booking-paa-90-sekunder-innbygger\ntitle: "Booking på 90 sekunder — innbyggerens reise, steg for steg"\ndescription: "Fra «trenger et møterom på torsdag» til bekreftelse i e-posten. Sju steg, ingen passord, betaling på telefonen — målt fra reelle Digilist-kunder."\ndate: 2026-05-31\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Innbygger"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["innbygger booking", "rask booking", "kundeopplevelse", "90 sekunder", "Digilist UX", "kommunal booking opplevelse"]\n---\n\nFor innbyggeren betyr ikke en bookings­plattform så mye som flyten den støtter. Hvis det tar fem minutter å finne et lokale, fylle ut et skjema, lage en konto, vente på god­kjenning, og betale — så bestiller folk Airbnb istedenfor og leier kommunens lokaler aldri mer.\n\nVi har målt reelle bookinger på Digilist. Median­tid fra leietaker lander på siden til bekreftelse er sendt er **94 sekunder**. Her er hva som skjer i de 94 sekundene.\n\n## 0–10 sekunder: Søk\n\nInnbyggeren kommer typisk fra Google («møterom Lillestrøm») eller fra kommunens hjemmeside. Søket­fil viser anlegg som matcher område, dato, og kapasitet. Kart­visning som standard hvis stedet betyr noe.\n\nFiltrering er live — uten å klikke «Søk». Skriv inn antall personer, plattformen filtrerer øyeblikkelig. Dette er sanntids­funksjonalitet, ikke en server­round-trip per tast.\n\n## 10–25 sekunder: Velg anlegg\n\nBla gjennom oppslagene. Hvert kort viser navn, et kvalitets­bilde, kapasitet, pris (per time eller pakke), og om det er ledig den valgte datoen. Klikk det interessante.\n\nDetalj­siden viser: bilder (5–10), beskrivelse, fasiliteter (avhukede ikoner), kart, kalender med ledige tider, anmeldelser hvis aktive. Ingen pop-ups, ingen «klikk her for å se priser».\n\n## 25–35 sekunder: Velg dato og tid\n\nKalenderen er sanntid — du ser alltid det riktige bildet av hva som er ledig. Klikk en dato. Tilgjengelige tids­vinduer dukker opp. Velg start og slutt. Plattformen viser øyeblikkelig hva det vil koste.\n\nHvis lokalet er tatt akkurat den ettermiddagen, viser plattformen automatisk «Andre dager dette lokalet er ledig:» eller «Ligger andre lokaler i samme område?». Ingen blindvei.\n\n## 35–55 sekunder: Bekreft og betal\n\nKlikk «Book». Hvis kunden er innlogget — gå rett til betaling. Hvis ikke — skriv inn e-post­adresse (vi sender magic link mens vi forbereder bestillingen). På telefonen åpnes e-postappen automatisk; klikk lenken, kom tilbake til bestillingen.\n\nBetaling er Vipps som standard. Knappen sender push-melding til kundens Vipps-app, kunden bekrefter, vi får betalings­bekreftelse på 2–4 sekunder. Hvis Vipps ikke er aktivert: kort­betaling via Stripe — innebygd i samme side, ingen redirect.\n\nFor book­inger som ikke krever betaling (gratis kommunale tilbud) hopper kunden rett fra «Book» til bekreftelse.\n\n## 55–70 sekunder: Bekreftelse\n\nPlattformen viser bekreftelses­side med:\n\n- Bookings­nummer\n- Hva, når, hvor\n- Hvordan komme inn (parkering, adkomst, kode hvis aktuelt)\n- En lenke til «Min Side» for å se eller endre bookingen\n- En kalenderfil (.ics) klar for nedlasting\n\nE-post sendes umiddelbart med samme info, og en kalender­fil som vedlegg.\n\n## 70–90 sekunder: Stilte sluttsteg\n\nInnbyggeren legger til bookingen i sin egen kalender (én klikk på .ics), lukker fanen. Bookingen er ferdig.\n\nI bakgrunnen, det kunden ikke ser:\n\n- Saksbehandler får varsel hvis bookingen krevde god­kjenning\n- Vaktmester, renhold, vekter får jobbordre i sine kanaler (e-post, SMS, app)\n- Faktura­grunnlag genereres\n- Statistikk oppdateres (med personvern-anonymisering)\n- Booking blokkeres i kalenderen — synlig for alle andre besøkende på under et sekund\n\n## Hva tar tid (når det tar tid)\n\nVi har sett bookinger ta 4 minutter også. Hva som dro tiden:\n\n- **Mange anlegg å velge mellom** — folk bruker tid på å bla. Det er ikke et problem, det er kunde­opplevelse i seg selv.\n- **Spesielle behov i kommentar­feltet** — noen ganger ønsker leie­takeren å skrive en lang melding til utleieren. Det er nyttig informasjon for saks­behandleren, ikke tap av tid.\n- **Velger pakke med tilvalg** — noen anlegg har catering, AV-utstyr, ekstra rom som tilvalg. Det er en konfigurasjon, ikke friksjon.\n- **Første gangs bruker** — magic link tar 3–8 sekunder å levere, ny bruker må sjekke e-post første gang. Andre gangen er det 30% raskere.\n\n## Hva tar ikke tid\n\n- **Å lage en konto.** Det finnes ikke en konto-opprettelse. Du «logger inn» og kontoen din etableres samtidig.\n- **Å vente på god­kjenning.** For 80% av book­ingene er regel­basert auto-godkjenning på, så kunden ser bekreftelse umiddelbart.\n- **Å forstå hvordan plattformen fungerer.** Det finnes ikke en «slik booker du» FAQ — flyten er den eneste flyten.\n\n## Når sekunder blir til kontrakter\n\nDen åpenbare innvendingen: «Men vår plattform skal støtte komplekse sesong­avtaler for hele idretts­rådet, ikke bare en time møterom.» Det stemmer. Sesong­leie er en separat flyt, beskrevet i [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger).\n\nMen her er det viktige: 90% av kommunale book­inger er enkle. Enkelt­møter, enkelt­events, time-i-en-hall-på-en-onsdag. Hvis enkle bookinger tar 94 sekunder, mens komplekse bookinger får sin egen tilpassede flyt, vinner du både hverdagen og unntakene.\n\nDet er bygge­filosofien.\n\n';
const __vite_glob_0_2 = '---\nslug: bookingkalender-for-innbygger-og-saksbehandler\ntitle: "Bookingkalenderen: for innbyggere, bygget for saksbehandlere"\ndescription: "Bestemor som booker kantinen og kulturkonsulent som godkjenner 1 200 søknader i måneden trenger ulike grensesnitt. Slik balanserer Digilist begge."\ndate: 2026-05-21\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "UX"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["bookingkalender", "saksbehandler UX", "innbygger UX", "kommunal UX", "tilgjengelighet"]\n---\n\nEn kommunal bookingkalender har to brukere som aldri møter hverandre, men deler samme datakilde: innbyggeren som booker en kantine to ganger i året, og saksbehandleren som administrerer 1 200 bookinger i måneden. De har motsatte behov. Det vanlige feilgrepet er å designe for én av dem og håpe den andre overlever. Digilist designet for begge — fra første dag.\n\n## Innbyggerens kalender: så enkel at den ikke føles som et system\n\nEn innbygger som åpner Digilist for å booke en idrettshall til datterens bursdagsfest 2. lørdag i mars 2026 har én oppgave: finn ledig tid, og book den. Tre prinsipper styrer designet:\n\n1. **Stedet først, ikke datoen.** De fleste innbyggere vet _hva_ de vil booke (Vestby Storsal), ikke nødvendigvis _når_. Søkefeltet starter med anlegget, datoen er en filter etterpå.\n2. **Ledig er grønt, opptatt er grått.** Ikke fem farger, ikke statuser. Innbyggeren skal kunne lese kalenderen på fem sekunder med solskinn på skjermen.\n3. **Bekreftelse uten konto.** Innbyggeren logger inn via [ID-porten](/blogg/idporten-bankid-kommunal-innlogging) når hun bekrefter, ikke før. Å bla i kalenderen krever ikke pålogging.\n\nBookingflyten er fire skjermbilder: velg anlegg → velg tid → fyll inn (navn, e-post, formål, antall personer) → bekreft og betal med Vipps eller kort. Ingen step er valgfritt, men hver step er kort. Mediant tid fra åpning til bekreftet booking i Digilist er under 90 sekunder.\n\n## Saksbehandlerens kalender: bygget for arbeidsdagens virkelighet\n\nSaksbehandleren har en helt annen oppgave. Hun jobber gjennom en sak-kø, prioriterer søknader, behandler unntak, og må ha overblikk over 12 anlegg samtidig. Designet er forskjellig:\n\n- **Listevisning er primær, kalendervisning er sekundær.** Søknader behandles raskere som rader i en tabell enn som blokker i en kalender. Filtrering på anlegg, status, søker, dato.\n- **Tastatursnarveier på alt.** `J/K` for opp/ned, `Enter` for åpne, `A` for godkjenn, `R` for avvis, `?` for hjelp. Saksbehandlere som behandler 80 søknader om dagen kan ikke klikke seg gjennom hver.\n- **Bulkhandlinger.** Velg ti søknader → «godkjenn alle med standard avtale». Saksbehandlere bruker 90 % av tiden på de 10 % av søknadene som er kompliserte; resten skal kunne ekspederes raskt.\n- **Konfliktdeteksjon i klar tekst.** Ikke bare «kollisjon» — men «Vestby Idrettslag har søkt om samme slot, og har høyere prioritet etter kommunens fordelingsregler».\n\nSak-køen oppdateres reaktivt (se [Sanntidskalender](/blogg/sanntidskalender-kommunal-booking)). Når saksbehandlerens kollega godkjenner en søknad, forsvinner den fra kollegaens kø samme sekund — uten refresh.\n\n## Det vanskelige: én sannhet, to grensesnitt\n\nBegge brukere ser samme underliggende data. Når innbyggeren booker tirsdag 14:00–16:00, vises bookingen i saksbehandlerens kø som «godkjent automatisk (verifisert bruker, regelinnenfor)» — uten at saksbehandleren trenger å gjøre noe. Når en søknad fra et idrettslag krever manuell vurdering, dukker den opp i saksbehandlerens kø _samtidig_ som søkeren får meldingen «Behandles av kommunen».\n\nDet betyr at:\n\n- **Innbyggeren får statusen «behandles» eller «bekreftet» i sanntid.** Ikke en e-post tre dager senere.\n- **Saksbehandleren ser hvem som har søkt, hvilke regler som gjelder, og hva systemet ville gjort automatisk.** Hun kan akseptere forslaget eller justere.\n- **Begge ser samme historikk.** Hvis innbyggeren ringer servicetorget, ser saksbehandleren akkurat det innbyggeren ser — pluss interne notater.\n\n## Tilgjengelighet er et felles krav\n\nSaksbehandlerne har ofte de samme tilgjengelighetsbehovene som innbyggerne, bare i en annen kontekst. En saksbehandler med musearmsmerte trenger tastatursnarveier. En saksbehandler med redusert syn trenger samme kontrastsuverenitet som en innbygger. Det er ikke separate løsninger — det er samme [WCAG 2.1 AA-implementering](/blogg/universell-utforming-wcag-kommunal-booking), bare brukt forskjellig.\n\n## Hva som ofte går galt\n\nDe fleste kommunale bookingsystemer feiler på én av to måter:\n\n- **De er enkle for innbyggeren, men umulige for saksbehandleren.** Et flott bestillingsskjema, men saksbehandleren må eksportere til Excel for å gjøre noe nyttig.\n- **De er kraftige for saksbehandleren, men avskrekkende for innbyggeren.** Tjue felter, krav om kontooppretting før man kan se ledige tider, terminologi som «ressursallokering».\n\nDen vanskeligste designdisiplinen i kommunal SaaS er å gjøre _begge_ samtidig — uten å gå på akkord med noen av dem. Det er ikke en pen idé. Det er forskjellen mellom en plattform en kommune er stolt av, og en plattform en kommune unnskylder.\n\n';
const __vite_glob_0_3 = '---\nslug: cyberangrep-norske-kommuner-bookingsystem\ntitle: "Cyberangrep mot norske kommuner: bookingsystem i fare?"\ndescription: "Norske kommuner rammes av cyberangrep oftere enn før. Hva betyr trusselbildet for bookingsystemet ditt — og hvilke spørsmål bør CIO stille?"\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["cyberangrep", "ransomware", "kommune", "bookingsystem", "NSM", "kommunal sikkerhet"]\n---\n\nØstre Toten i januar 2021. Akershus fylkeskommune sommeren 2022. Sør-Varanger sent i 2023. Stortinget i 2020 og igjen i 2022. Mønsteret er etablert: norsk offentlig sektor er et legitimt mål for organiserte cyberkriminelle, og kommunene står ofte først i køen fordi de behandler både innbyggerdata og betalinger.\n\nFor en kommunal IT-leder som planlegger en ny bookingplattform er det rimelig å spørre: hva betyr egentlig dette trusselbildet for systemet vi velger?\n\n## Hva trusselaktørene faktisk er ute etter\n\nCyberkriminelle som retter seg mot norske kommuner følger som regel én av tre logikker:\n\n1. **Ransomware mot drift.** Mål: kryptere alt og selge tilbake nøkkelen. Bookingsystem er attraktivt fordi det blokkerer publikumstjenester umiddelbart — kommunen mister inntekt og innbyggertillit i samme øyeblikk.\n2. **Datatyveri for ekstortion.** Mål: stjele persondata og kreve løsepenger mot at de ikke publiseres. Bookingsystemer inneholder navn, e-post, telefonnummer, betalingsspor — og av og til informasjon om bevegelsesmønstre (når er innbyggeren på idrettshall? på kulturhus?).\n3. **Phishing mot ansatte.** Mål: lure én kommuneansatt til å oppgi passord. Da har angriperen et utgangspunkt for å bevege seg sidelengs i nettverket.\n\nNSMs trusselvurderinger for de siste tre årene har konsistent flagget pkt. 1 og 2 som økende. Ransomware-as-a-service betyr at terskelen for å gjennomføre angrep har sunket, mens betalingsviljen — særlig fra offentlige aktører med kritiske tjenester — har vært stabil.\n\n## Bookingsystem som angrepsflate\n\nEt bookingsystem er en sårbar overflate av flere grunner:\n\n- **Eksponert mot internett.** Innbyggere må kunne booke fra hjemmenettet — systemet kan ikke gjemmes bak en VPN. Hvert API-endepunkt er en potensiell inngang.\n- **Behandler betaling.** PCI-DSS-krav er strenge, men kompromisset er at en lekket session-token kan oversettes til reell skade.\n- **Knyttet til kommunens identitetssystem.** Hvis bookingsystemet bruker ID-porten korrekt, er dette en styrke. Hvis det bruker eget passord-regime som ikke er FIDO2-kompatibelt, er det en svakhet.\n- **Synlig SLA.** Innbyggere som ikke kommer inn på bookingportalen ringer kommunen samme dag. Det øker betalingspresset i en ransomware-situasjon.\n\n## Hva en moderne plattform faktisk gjør med dette\n\nDigilist er bygget på Convex (managed serverless runtime), med data lagret i Norge og EU. Det betyr at angrepsflaten ser annerledes ut enn for et tradisjonelt selvhostet system:\n\n- **Ingen vedlikeholdsvinduer der vi patcher servere.** Convex og våre databaser oppdateres kontinuerlig av leverandøren, med automatisk failover. En kommune kan ikke selv glemme en sikkerhetsoppdatering.\n- **Hver mutasjon går gjennom revisorspor.** Alt som endrer data (bookinger, betalinger, brukerrettigheter) skrives til en separat audit-tabell som ikke kan slettes av en kompromittert administrator.\n- **Tenant-isolasjon på funksjonsnivå.** En kompromittert konto i én kommune har ingen direkte vei til en annen kommune sin data. Det er ikke et delt skjema med tenant-ID som filter — det er funksjoner som validerer rettigheter på serversiden ved hvert kall.\n- **ID-porten + BankID for høyverdige handlinger.** Innbyggere logger inn med BankID. Saksbehandlere logger inn med ID-porten. Passordfri innlogging fjerner den vanligste angrepsvektoren.\n\n## Det vi ikke kan love\n\nIngen plattform kan love at den aldri blir angrepet. Det vi kan love er at:\n\n- Vi har ISO 27001 og ISO 27701 fra dag én, og er forberedt på SSA-L 2026.\n- Beredskapsplanen er skrevet, øvd og oppdatert hvert halvår — ikke et word-dokument i en mappe ingen åpner.\n- Data ligger i EU/EØS med backup i samme region.\n- Vi har dedikert en del av roadmapen til penetrasjonstesting og sårbarhetshåndtering. Det er ikke en eksern revisjon én gang i året — det er et kontinuerlig løp.\n\n## Spørsmål en kommune-CIO bør stille\n\nNår neste anskaffelse kommer:\n\n1. Hvor lagres dataene fysisk, og hvor ligger backupen?\n2. Hva er RPO og RTO ved et katastrofescenario?\n3. Hvilken type pålogging brukes for innbyggere? For saksbehandlere?\n4. Hvordan rapporteres en sikkerhetshendelse til kommunen? Innen hvilken tidsramme?\n5. Hvor ofte gjennomføres penetrasjonstest, og er rapporten tilgjengelig under NDA?\n6. Hvor mange åpne sårbarheter har systemet akkurat nå?\n\nSvaret på det siste spørsmålet er det mest avslørende. Et åpent svar er et godt tegn. Et unnvikende svar er et rødt flagg.\n\n## Veien videre\n\nTrusselbildet kommer til å forverres, ikke forbedres. Norske kommuner som velger plattformer i 2026 og 2027 må anta at angrepet kommer — spørsmålet er bare når. Det å bygge inn motstandskraft er ikke lenger et pluss, det er en grunnlinje.\n\nVil du vite mer om hvordan Digilist er bygget for å motstå angrep? [Book en demo](#kontakt) eller les videre om [GDPR, ISO 27001 og datalokasjon](/blogg/gdpr-iso-datalokasjon-norge).\n';
const __vite_glob_0_4 = '---\nslug: ddos-ransomware-beredskap-bookingplattform\ntitle: "DDoS og ransomware: beredskap for bookingplattformer"\ndescription: "Hvordan en bookingplattform skal håndtere et angrep eller utfall: RPO/RTO, backup, hendelseskommunikasjon og praktisk beredskapsplan."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["DDoS", "ransomware", "beredskap", "RPO", "RTO", "backup", "kommune", "incident response"]\n---\n\nI anskaffelser av bookingsystem til norske kommuner blir det stadig oftere stilt detaljerte spørsmål om beredskap. Det er en sunn utvikling. Tidligere holdt det å skrive "vi har backup". Nå må svaret være konkret: hvor lenge varer utfallet, hva mister vi av data, og hvor finner innbyggerne informasjon mens systemet er nede?\n\nDenne artikkelen er for kommunens IT-leder eller anskaffelsesansvarlig som vil vite hva de faktisk skal spørre om — og hva et godt svar høres ut som.\n\n## RPO og RTO: de to tallene som teller\n\nTo begreper kommer igjen og igjen i beredskapsdiskusjoner:\n\n- **RPO (Recovery Point Objective)** — hvor mye data tåler vi å miste? Hvis siste backup er fra 04:00 i natt og systemet kollapser klokken 14:00, mister vi 10 timer med bookinger. For et kommunalt bookingsystem er det ofte uakseptabelt.\n- **RTO (Recovery Time Objective)** — hvor lenge tåler vi å være nede? Et idrettshall-booking som er nede en lørdag morgen koster i tapte arrangementer og frustrerte innbyggere.\n\nDigilist mål:\n- RPO: 0–5 minutter. Vi bruker punkt-i-tid-replikering, ikke nattlig backup.\n- RTO: under 1 time for et regionalt utfall. Under 4 timer for et fullstendig leverandørutfall (failover til alternativ region).\n\nTall som er bedre enn dette koster fort uforholdsmessig mer. Tall som er dårligere kan være forsvarlige for små kommuner med få anlegg, men bør være avklart i kontrakten.\n\n## DDoS — det enkleste angrepet å organisere\n\nDistributed Denial of Service-angrep krever ingen avansert kompetanse. Det finnes booter-tjenester på det åpne nettet som leier ut angrepskapasitet for noen titalls dollar per time. Mål: gjøre tjenesten utilgjengelig for vanlige brukere.\n\nFor et bookingsystem ser et DDoS-angrep ut som plutselig massevis av trafikk mot bookingsidene, ofte i koordinerte bølger. Sluttbrukere får timeout. Saksbehandlere kan ikke logge inn.\n\nForsvar handler om to lag:\n\n1. **Edge-nettverk med automatisk DDoS-mitigation.** Cloudflare, Fastly, Akamai og lignende CDNer absorberer trafikk på kanten av nettet, før det treffer applikasjonen. Digilist bruker en kommersiell CDN med automatisk mitigation aktivert som standard.\n2. **Rate limiting på applikasjonsnivå.** Selv om CDN slipper igjennom mistenkelig trafikk, har applikasjonen sin egen begrensning per IP og per session.\n\nFor en kommune som vurderer leverandør: spør om DDoS-mitigation er inkludert eller en tilleggstjeneste. Et nei på "inkludert" betyr at den første angrepsdagen blir dyr.\n\n## Ransomware — det dyreste angrepet\n\nRansomware er kvalitativt forskjellig fra DDoS. Mens DDoS skader tilgjengelighet, krypterer ransomware data slik at de ikke kan leses uten en nøkkel. Ofte stjeler angriperen dataene først, slik at også selve trusselen om publisering kan brukes for å presse betaling.\n\nForsvaret mot ransomware har tre faser:\n\n### Før — gjør angrepet mindre sannsynlig\n\n- Passordfri pålogging der det er mulig (ID-porten, BankID, FIDO2).\n- Minste rettighet for ansatte. Saksbehandlere skal ikke ha admin-rettigheter.\n- Patch-disiplin. Avhengigheter (npm-pakker, system-pakker) oppdateres kontinuerlig, ikke kvartalsvis.\n- E-post-filtrering. Selv om bookingsystemet selv ikke håndterer e-post, er ansattes e-post den vanligste inngangsvektoren.\n\n### Under — begrens skaden\n\n- Tenant-isolasjon på funksjonsnivå. En kompromittert konto i én kommune skal ikke gi tilgang til en annen.\n- Audit-logg som er separert fra produksjonsdata og ikke kan slettes.\n- Read-replica i annen region, med separat tilgangskontroll. Hvis primær blir kryptert, har vi en uberørt versjon.\n\n### Etter — gjenopprett raskt\n\n- Punkt-i-tid-gjenoppretting til før kompromittering. Ikke bare "siste nattbackup" — bokstavelig talt valgfritt øyeblikk innenfor retention.\n- Tydelig hendelsesplan. Hvem ringer hvem? Hvilken informasjon går til Datatilsynet (72-timers fristen ved personvernhendelser)? Hvem snakker med media?\n- Øvelse. Beredskapsplan som aldri er øvd, fungerer ikke når det smeller.\n\n## Hva innbyggeren skal se hvis systemet er nede\n\nDet er én ting som ofte glemmes: hva ser brukeren mens systemet er nede?\n\nStandard status quo i norsk offentlig sektor er en hvit feilside med en kryptisk feilmelding eller en timeout. Det er den dårligste mulige opplevelsen.\n\nDigilist har et separat status-domene (status.digilist.no) som er hostet uavhengig av hovedplattformen. Hvis selve plattformen er nede, viser statussiden:\n- Hva som er nede og hva som fortsatt fungerer.\n- Estimert gjenopprettingstid.\n- Hvor brukeren skal henvende seg i mellomtiden.\n\nDet er den enkleste tilliten-bygger en plattform kan ha.\n\n## Beredskapsplan — sjekkliste for anskaffelse\n\nDet en kommune bør kreve dokumentert:\n\n1. RPO og RTO som tall, ikke som ord.\n2. Hvor backup ligger (region, leverandør).\n3. Hvor ofte gjenopprettings-test gjennomføres.\n4. Hvilken DDoS-mitigation som er aktiv.\n5. Hvordan en sikkerhetshendelse rapporteres til kommunen (kanal + tidsfrist).\n6. Hvilken status-side innbyggere kan sjekke.\n7. Når beredskapsplanen sist ble øvd.\n\nEt leverandørsvar som inneholder konkrete tall og hendelsesreferanser er et godt svar. Et leverandørsvar som inneholder mest "vi tar sikkerhet på alvor" er ikke et svar.\n\n## Veien videre\n\nBeredskap er ikke en bryter man slår på når katastrofen kommer. Det er et kontinuerlig arbeid med øvelse, dokumentasjon og forbedring. Et bookingsystem som er bygget med beredskap som premiss er enklere å integrere, enklere å revidere — og mye enklere å forsvare når noe går galt.\n\nVil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet, eller [Phishing-resistente innlogginger](/blogg/phishing-resistente-innlogginger-idporten-bankid) for det enkleste forsvarsgrepet.\n';
const __vite_glob_0_5 = '---\nslug: digdir-designsystemet-kommunal-bookingplattform\ntitle: "Digdir Designsystemet — hvorfor det er et must i offentlig sektor"\ndescription: "Designsystemet er Norges offisielle byggekloss-bibliotek for offentlige digitale tjenester — og grunnlaget for tilliten Digilist bygger på."\ndate: 2026-05-17\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 9\ntag: "Designsystem"\ncover: "/images/blog/digdir_designsystemet_hero_no.webp"\nkeywords: ["Digdir Designsystemet", "designsystemet.no", "universell utforming", "kommunal digitalisering", "offentlig sektor"]\n---\n\nDet er én ting alle norske kommuner møter når de skal anskaffe en digital tjeneste: behovet for at innbyggerne kjenner seg igjen. Knapper, skjemaer, varsler, søkefelt og statusmeldinger må oppleves som _norske offentlige_ — ikke som en internasjonal SaaS-mal med Google Translate. Det er nettopp denne gjenkjennelsen [Digdir Designsystemet](https://designsystemet.no/no) leverer, og det er grunnen til at Digilist er bygget på det fra første linje.\n\n## Hva Digdir Designsystemet faktisk er\n\nDesignsystemet, eid og forvaltet av Digitaliseringsdirektoratet (Digdir) i samarbeid med Skatteetaten, NAV, Brønnøysundregistrene og en rekke kommuner, er et åpent og delt komponentbibliotek for offentlig sektor. Det består av tre lag:\n\n1. **Designtokens** — farger, typografi, avstand og elevasjon, definert som CSS-variabler og JSON-skjemaer. Hver token er WCAG-testet for kontrast og lesbarhet.\n2. **Komponenter** — React- og web-komponenter (`@digdir/designsystemet-react`) for knapper, skjemafelt, dialoger, navigasjon, tabeller og varsler. Hver komponent er pre-testet for skjermlesere, tastaturnavigasjon og hjelpetekst.\n3. **Mønstre og retningslinjer** — dokumentasjon av hvordan komponentene settes sammen til hele tjenester, med eksempler fra Min side, Altinn og Helsenorge.\n\nHele systemet er publisert under [Apache 2.0-lisens](https://github.com/digdir/designsystemet) og oppdateres kontinuerlig av et team på tvers av etatene. Det er, med andre ord, en infrastruktur — ikke et tema.\n\n## Hvorfor Digilist baserer seg på det\n\nDa vi begynte å designe Digilist for kommuner, vurderte vi tre alternativer: et eget designspråk, et hodeløst bibliotek som shadcn/ui, eller Digdir Designsystemet. Vi landet entydig på Digdir, av fire grunner.\n\n### 1. Innbyggerne kjenner det igjen — uten å vite det\n\nDet er ingen kommunalt ansatt som tenker «åh, dette er Digdirs `Button`-komponent». Men innbyggerne kjenner igjen avstanden, fokusringen, knappetekstens linjehøyde, måten en feilmelding sklir inn på, og at varselet om obligatorisk felt har riktig fargevalør. Det skaper en _stillere_ tillit enn noe markedsføringsmateriell kan: kommunens digitale tjenester ser ut som kommunens digitale tjenester. Ikke som en startup-pitch, og ikke som en oversatt Calendly.\n\n### 2. Universell utforming er innebygd, ikke påklistret\n\nLikestillings- og diskrimineringsloven § 17a, kombinert med forskrift om universell utforming av IKT, gjør WCAG 2.1 AA pliktig for alle norske offentlige tjenester. Digdir-komponentene er testet mot kravene fra starten: kontrast, focus-visible, ARIA-merking, tastaturnavigasjon og skjermleserkompatibilitet er ikke noe utviklere må huske å legge til — det er en del av komponentens kontrakt. Den dagen WCAG 2.2 blir pålagt, oppdaterer Digdir-teamet komponentene, og Digilist arver det automatisk i neste utgivelse.\n\n### 3. Det reduserer leverandøravhengighet\n\nEn kommune som har valgt et bookingsystem på Digdir Designsystemet kan, i prinsippet, kreve at neste leverandør gjenbruker samme designspråk. Det reduserer kostnaden ved bytte, gjør integrasjoner mer forutsigbare, og skaper et marked der leverandørene konkurrerer på funksjonalitet og pris — ikke på låsteknologi. Det er en av få teknologiske avgjørelser som styrker, snarere enn svekker, kommunens forhandlingsposisjon over tid.\n\n### 4. Det dokumenterer seg selv overfor revisor\n\nNår kommunens IT-revisjon spør «hvordan er tilgjengelighetskravene oppfylt?», kan svaret være kort: «Plattformen bruker Digdir Designsystemet — her er sertifiseringsrapporten og lenken til Digdirs egne tester.» Det er en helt annen samtale enn å forklare hvorfor utvikleren mente at `border-radius: 0.375rem` var greit nok.\n\n## Hva det betyr i praksis for en booking\n\nLa oss ta et helt vanlig scenario: en idrettslagskasserer som søker om sesongleie. Skjemaet hun møter består av Digdir-komponenter — `Combobox` for valg av anlegg, `DatePicker` for tidsrom, `Textfield` for organisasjonsnummer (med innebygd BRREG-lookup), `Checkbox` for bekreftelse av leiebetingelser, `Button` for innsending. Hvert felt har riktig label-plassering, riktig fokusrekkefølge, og riktig feilmelding når noe mangler.\n\nNår hun sender, vises en `Alert` i suksessfargen — samme grønntone som Min side bruker. Når Digdir oppdaterer sine kontrastregler, oppdateres Digilists alert automatisk ved neste deploy. Hun vil aldri merke det — men hun vil heller aldri møte et grensesnitt som plutselig føles fremmed.\n\n## Hva som ligger utenfor designsystemet\n\nDigdir Designsystemet løser _grensesnittet_, ikke _løsningen_. Det forteller deg ikke hvordan du strukturerer en sesongleiefordeling, hvordan du modellerer en kommunal prisstruktur eller hvordan du implementerer dobbeltbookingsbeskyttelse. Det er Digilists jobb, og en betydelig del av plattformens verdi. Men det forteller deg hvordan du _viser_ resultatet av disse beslutningene på en måte som er trygg, lesbar og lovlig.\n\n## En anbefaling til kommunale anskaffere\n\nI tilbudsforespørsler bør vi se Digdir Designsystemet — eller dokumentert ekvivalens — som et eksplisitt minstekrav. Det er den enkleste måten å sikre seg mot leverandører som bygger «raskt», men leverer en tjeneste som etter to års drift må reorganiseres for tilgjengelighetskrav, branding eller integrasjoner. Det er også den enkleste måten å gjøre rom for at neste anskaffelse blir billigere — ikke dyrere — enn forrige.\n\nDigilist er bygget på Digdir Designsystemet fordi vi mener offentlig sektor fortjener verktøy som er gjenkjennelige, etterprøvbare og bytteklare. Det er ikke et komparativt fortrinn — det er et faglig minimum.\n\n';
const __vite_glob_0_6 = '---\nslug: digilist-mobil-app\ntitle: "Digilist mobil — booking i lomma, drift på vaktrommet"\ndescription: "Innbyggere booker fra mobil. Driftsroller varsles på mobil. Saksbehandlere signerer fra mobil. Digilists native iOS- og Android-apper er bygget for jobben."\ndate: 2026-05-24\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Mobil"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["mobil app", "React Native", "iOS", "Android", "push-varsler", "Digilist app"]\n---\n\nVi vurderte tre veier til mobil før vi tok beslutningen: en responsiv webapp, en Capacitor- eller PWA-wrap, eller native React Native. Vi valgte native — og det er ikke et tilfeldig teknisk valg. Det handler om hva mobilen brukes til i en kommunal bookinghverdag.\n\n## Tre veldig forskjellige mobilbrukere\n\nEn kommunal bookingplattform har tre mobilroller som har lite til felles, men deler samme telefon:\n\n### 1. Innbyggeren\n\nHun booker idrettshallen til datterens bursdagsfest fra kassakøen på COOP. Hun har 90 sekunder. Den native appen leverer:\n\n- **Vipps via mobilnavigasjon** — ikke en redirect, men direkte handover med fingeravtrykk-bekreftelse.\n- **Apple Wallet / Google Wallet-integrasjon** — bekreftelsen lagres som et pass med booking-detaljer og digital nøkkel-QR-kode.\n- **Push-varsler** ved bekreftelse, påminnelse 24 timer før, og dersom noe endres på anlegget.\n\n### 2. Driftsrollen\n\nVaktmesteren i Lier kommune får varsel klokken 17:15 om at en booking starter 18:00 og krever oppvarming. På web ville hun måtte logge inn, navigere, lese. På mobilen:\n\n- **Push-varsel** med all info: hvilket anlegg, hvilket rom, hvem som er booker, hvilket utstyr som er bestilt.\n- **«Bekreft klar»**-knapp direkte fra varselet uten å åpne appen.\n- **Geofenced check-in** — appen vet når hun er på anlegget og logger oppmøtetid automatisk.\n\nNative gjør dette mulig på en måte web aldri har klart konsistent: bakgrunnsvarsler som faktisk kommer fram, posisjonsbasert utløsing, og widgets som viser dagens bookinger uten å åpne appen.\n\n### 3. Saksbehandleren\n\nKulturkonsulenten godkjenner sesongleieavtaler på bussen mellom møter. Native gir henne:\n\n- **Biometrisk signering** av godkjenninger — Face ID / fingeravtrykk binder beslutningen til personen, ikke bare til kontoen.\n- **Offline-buffer** — godkjenninger som tas i tunellen lagres lokalt og synkroniseres når signalet kommer tilbake.\n- **Kommando-snarveier** — saksbehandleren kan i samme rad sveipe høyre for «godkjenn med standardvilkår» eller venstre for «avvis med begrunnelse».\n\n## Hvorfor native, ikke web-wrap\n\nCapacitor og Cordova er praktiske for å gjenbruke webkoden. De har én avgjørende svakhet: ytelsen og innebygde mobilinteraksjoner er en hage av kompromisser. For en bookingplattform er det tre ting som ikke kan kompromiteres:\n\n1. **Push-varselpålitelighet.** APNs og FCM håndteres direkte av native runtime. Web push fungerer, men er mindre forutsigbart, særlig på iOS.\n2. **Vipps-handover.** Native deep-linking gir glatt veksling mellom Digilist og Vipps-appen. Web-wraps må gå gjennom Safari/Chrome med ekstra friksjon.\n3. **Biometri og Secure Enclave.** Saksbehandlerens signatur må kunne lagres i telefonens sikkerhetsmodul — ikke i en `localStorage`-kopi som er sårbar for nettlesertilgang.\n\nDigilist-appene er bygget med [React Native 0.74](https://reactnative.dev/), publisert i App Store og Google Play under `no.digilist.app` (bundle-ID, planlagt App Store + Google Play). UI-komponentene er en parallell — _ikke_ en kopi — til web-systemet, designet for tommelnavigasjon og mindre skjermflate.\n\n## Når app, når web\n\nVi tror ikke alle skal bruke appen. For mange innbyggere er web like enkelt — eller enklere, fordi det ikke krever installasjon for én booking i året. Dette er våre anbefalinger:\n\n- **App for driftsroller.** Vaktmestere, renhold og vektere trenger push-varsler og rask check-in. Web er for tregt.\n- **App for saksbehandlere som er mye i felten.** Kulturkonsulenter, anleggsledere, vaktansvarlige som ikke sitter ved skrivebordet.\n- **Web for innbyggere.** De som booker en eller to ganger i året klarer seg utmerket med en mobilvennlig web. Hvis de blir hyppige brukere, vil de installere appen selv.\n- **App for organisasjoner med sesongleie.** Idrettslag og kulturkorps som booker uke etter uke har glede av appens widget og hurtigfunksjoner.\n\n## Sikkerhet på toppen\n\nNative gir mer enn ytelse. Hver app-installasjon binder seg til enhetens secure enclave, og en utlogging på web logger ikke automatisk ut app-økten — det er en separat sikkerhetspolicy som kommunen kan styre via Mobile Device Management hvis ansatte bruker arbeidstelefoner. Audit-loggen registrerer enhets-ID, biometrisk autentiseringsstatus og posisjonsdata når geofencing er aktivt — slik at en revisor kan rekonstruere ikke bare _hva_ saksbehandleren godkjente, men _hvor_ og _hvordan_.\n\n';
const __vite_glob_0_7 = '---\nslug: en-plattform-mot-fem-verktoy\ntitle: "Én plattform vs. fem verktøy — den skjulte kostnaden"\ndescription: "Bookingsystem, kalender, betaling, regnskap, varsling. Hvert system fungerer isolert — men friksjonen oppstår mellom dem. Det er der Digilist løser problemet."\ndate: 2026-05-20\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Plattform"\ncover: "/images/blog/en_plattform_hero_no.webp"\nkeywords: ["én plattform", "integrasjoner", "kommunal driftskostnad", "single source of truth", "sambruk"]\n---\n\nPå papiret kan en kommune dekke et bookingbehov med fem velkjente verktøy: en bookingkalender, en betalingsløsning, et regnskapssystem, et varslingsverktøy, og en adgangskontroll. Hver av dem er bra på det den gjør. Hver av dem har egne integrasjoner. Hver av dem har egen brukerstøtte. Det er kombinasjonen — og det som skjer _mellom_ dem — som koster.\n\n## Det åpenbare problemet: dobbeltinntastinger\n\nNår Bookingsystem A og Regnskapssystem B er separate, må noen — typisk en saksbehandler — taste inn samme booking to ganger. Tre, hvis adgangskontroll C også må ha listen over hvem som skal slippes inn på lørdag klokken 18. Multiplikasjonsregelen er ubarmhjertig: ti bookinger om dagen × tre systemer × fem minutter per inntasting = 150 minutter daglig dobbeltarbeid, eller seks ukers arbeid per år per person.\n\nMen det er ikke det dyreste.\n\n## Det skjulte problemet: synkroniseringsfeil\n\nHver synkronisering mellom to systemer har en feilrate. Den er gjerne lav — kanskje 1 % — men siden synkroniseringen kjører tusenvis av ganger i året, blir antallet feil betydelig. Tre vanlige varianter:\n\n1. **Bookingen finnes, men betalingen mangler.** Innbyggeren bekreftet via Vipps, men betalingstransaksjonen ble aldri overført til regnskapssystemet. Oppdages tre måneder senere ved manuell avstemming.\n2. **Betalingen finnes, men bookingen er kansellert.** Innbyggeren ringte og avlyste, saksbehandleren registrerte det i bookingsystemet, men avlysningen ble aldri synket til regnskapet. Refusjon må behandles manuelt.\n3. **Adgangen åpnes, men bookingen er flyttet.** Vaktmesteren registrerte at en booking ble flyttet fra lørdag til søndag, men adgangskontrollen ble ikke oppdatert. Innbygger står utenfor med kode som ikke virker.\n\nHver av disse feilene koster i tid — å oppdage dem, å forklare dem til innbyggeren, å rette dem opp. Verre: hver av dem skader tilliten til kommunens digitale tjenester.\n\n## Én plattform = én sannhet\n\nDigilist er bygget på prinsippet om én datakilde, ikke fem speilkopier. En booking er én post som inneholder alt: tidsslot, betalingsstatus, avtalevilkår, varslingshistorikk, adgangsstatus, eventuelle refusjoner. Når kulturkonsulenten åpner saksbehandlerverktøyet og ser bookingen, ser hun _hele_ statusen, ikke fem fragmenter.\n\nDet tekniske grunnlaget er en hendelsesbuss (outbox-pattern) som garanterer at hver tilstandsendring distribueres transaksjonelt: booking lagres, varsler sendes, ledger oppdateres, adgang aktiveres — alt eller ingenting. Det er forskjellen mellom en velrigget kommunal tjeneste og et lappeteppe som krever et menneske til å holde det sammen.\n\n## Hva med integrasjoner?\n\n«Én plattform» betyr ikke at Digilist erstatter alt. Det betyr at Digilist er _kjerne_-bookingen, og at integrasjonene utgår fra ett sted med ett dataskjema. Eksempler:\n\n- **Vipps og Stripe** kalles av Digilists betalingsmodul. Statusen lagres på _bookingen_, ikke på «en betaling i et separat system».\n- **Visma / Tripletex / Fiken / PowerOffice / DNB Regnskap** mottar bilag fra Digilist når en betaling settles. Avstemming kjøres av Digilist, ikke av kommunen.\n- **Salto KS adgangskontroll** mottar adgangsplan fra Digilist når en booking bekreftes, og deaktiveres når bookingen avsluttes.\n- **EHF / Peppol** sendes fra Digilist når en faktura genereres for lag og foreninger.\n- **Microsoft 365 Outlook** synkroniserer kommunale møterom slik at saksbehandlere kan se en kollega har booket et rom fra Outlook _eller_ Digilist — samme dataposten, to grensesnitt.\n\nForskjellen er at i en «fem verktøy»-arkitektur eier hvert verktøy sitt eget data, og kommunen må vedlikeholde integrasjonene. I Digilist eier _bookingen_ dataet, og integrasjonene er ren _utlevering_ av endringer.\n\n## Hvorfor det koster mindre, ikke mer\n\n«Én plattform» klinger ofte som «én leverandørbinding» — og det er en legitim bekymring. Men den faktiske kostnaden ved binding er ofte lavere enn den åpenbare kostnaden ved manuell avstemming, dobbelinntastinger og synkroniseringsfeil. Tre praktiske grunner:\n\n1. **Lavere driftskostnad per booking.** Færre manuelle korreksjoner, færre samtaler til servicetorg, færre refusjoner som må behandles manuelt.\n2. **Lavere kompetansekrav.** Saksbehandlerne lærer ett verktøy, ikke fem.\n3. **Lavere revisjonskostnad.** IT-revisor ser ett system, ett auditspor, én tilgangskontroll.\n\nDen minst snakkede gevinsten: når kommunen skal bytte leverandør om åtte år, er én plattform én migrasjon, ikke fem. Det er det motsatte av binding — det er _frigjøring_.\n\n';
const __vite_glob_0_8 = '---\nslug: faktura-refusjon-avstemming\ntitle: "Fakturering, refusjoner og avstemming — økonomimotoren i Digilist"\ndescription: "Hvordan en booking blir til en faktura, hvordan en kansellering blir til en refusjon, og hvordan kommunens regnskap får tallene som stemmer — uten Excel."\ndate: 2026-06-01\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Økonomi"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["fakturering", "EHF", "Peppol", "refusjon", "avstemming", "regnskap", "Visma Tripletex Fiken PowerOffice", "økonomi kommunal booking"]\n---\n\nFor en bookings­plattform er økonomi­motoren den som skiller seriøse løsninger fra hobby­prosjekter. Det er enkelt å lage en booking. Det er hardere å sørge for at hver booking blir til riktig faktura, hver kansellering til riktig refusjon, og hver krone som beveger seg lander i kommunens regnskap med riktig konto­kode.\n\nDigilist har tre lag i økonomi­motoren: **innkreving** (hvor pengene kommer fra), **fakturering** (dokumentet som signaliserer hva som skylde­s), og **avstemming** (hvor pengene havner og hvordan regnskapet ser det).\n\n## I. Innkreving — fire kanaler\n\n**Vipps.** Standardvalg for privat­personer. Push-melding til Vipps-appen, kunden bekrefter, vi får oppgjør på 2–4 sekunder. Refusjon med ett klikk fra admin. Vippsene avregnes til kommunens Vipps-konto direkte.\n\n**Stripe Connect.** Kort­betaling for kunder som ikke har Vipps eller fra utland. Beløpet trekkes fra kortet, sitter på Digilists Stripe Connect-platform­konto i et øyeblikk, og betales ut til kommunens bank­konto neste virke­dag. Avgiftene er Stripes standard (1.4% + 2 kr for europeiske kort).\n\n**EHF/Peppol-faktura.** For organisasjons­kunder (lag, bedrifter). Kunden booker, faktura sendes via Peppol-nettverket til deres EHF-mottak. Forfall typisk 14 eller 30 dager. Vi varsler om forfall, men inkasso håndteres av kommunens egen rutine.\n\n**Manuell faktura.** For tilfeller der kunden ikke har EHF-mottak (smårere lag, privat­personer som velger faktura). PDF-faktura sendes på e-post med KID-nummer. Innbetalinger spores via OCR-fil fra banken.\n\nKommunen velger hvilke kanaler som tilbys per anlegg eller per kundetype. Et selskaps­lokale på lørdag — Vipps og kort. En idretts­hall til Skien IF — EHF. En sesong­leie til en pensjonist­forening — manuell faktura.\n\n## II. Faktura­generering\n\nHver booking har et faktura­grunnlag. Grunnlaget inneholder:\n\n- Linjer (lokale, time­pris × antall timer, eventuelle tillegg)\n- MVA-håndtering (kommunale tjenester ofte unntatt, men ikke alltid)\n- Konto­kode (matchet til kommunens kontoplan)\n- Kostnads­sted (anleggets ansvarskode)\n- Periode (hvilken regnskaps­periode hører dette til)\n\nFaktura­grunnlaget genereres automatisk når en booking bekreftes. Det går videre til faktura — enten direkte til EHF, eller til en PDF-faktura — eller til den valgte regnskaps­integrasjonen (se under).\n\nVi støtter også **forskudds­fakturering** (kunde betaler ved booking, ikke ved bruk), **etter­fakturering** (kunde betaler etter bruk, typisk for sesong­leie), og **delt fakturering** (deposit forskudd, sluttoppgjør etter).\n\n## III. Refusjoner\n\nRefusjoner er det enkleste å gjøre feil i et bookings­system. Vi har fokusert på å gjøre det enkelt riktig.\n\n**Auto-refusjon.** Hvis kansellering skjer innenfor regelens grense (typisk 14 eller 7 dager før), refunderes automatisk når saks­behandler god­kjenner kanselleringen.\n\n**Delvis refusjon.** Hvis kansellerings­regelen sier «80% refunderes hvis innen 7 dager», beregner plattformen automatisk beløpet og refunderer det. Restbeløpet blir igjen som inntekt.\n\n**Refusjons­sporing.** Hver refusjon har sitt eget revisjons­spor: hvem god­kjente, hvilken regel som gjaldt, hvilket beløp, hvilken kanal det gikk via, hva kunden ble fortalt.\n\n**Cross-kanal refusjon.** Betalte med Vipps, men ønsker refusjon til bankk­onto? Vi støtter manuell over­føring og logger den tilsvarende. Brukes sjelden — Vipps-til-Vipps er standard.\n\n## IV. Regnskaps­integrasjoner\n\nManuell over­føring av tall fra bookings­system til regnskap er ikke bare arbeid — det er en feilkilde. Digilist sender data direkte til:\n\n- **Visma eAccounting** — den vanligste i norske kommuner. Faktura­grunnlag, inn­betalinger, refusjoner pushes via API.\n- **Tripletex** — populært for selskaps­lokaler og kommunale foretak.\n- **Fiken** — for mindre utleiere.\n- **PowerOffice Go** — for kommuner som har den.\n- **DNB Regnskap** — for kunder i DNB-økosystemet.\n- **EHF/Peppol direkte** — uten å gå via et regnskaps­system, hvis kommunen ikke har en av de overnevnte.\n\nFor hver integrasjon mapper vi:\n\n- Konto­plan-koder (debet og kredit)\n- Kostnads­steder (per anlegg eller etat)\n- MVA-koder (per produkt­type)\n- Kunde­numre (oppslag mot kommunens kunde­register)\n\nKonfigurasjonen gjøres én gang under onboarding. Etter det er bookings-til-regnskap-flyten autonom.\n\n## V. Avstemming\n\nAvstemming er der det blir litt komplisert: penger som kommer inn må matches mot fakturaer som er sendt, og restanser må følges opp. Digilist gjør tre ting for å holde regnskaps­avdelingen i god humør:\n\n**Real-time dashboard.** Forecast på inntekter denne måneden, restanser, refusjoner, gjenstående faktura­grunnlag som ikke er prosessert. Det dashboardet er det første en kommunal øko­nomi­ansvarlig spør om i demoen.\n\n**OCR-import.** Kommunens bank sender en daglig OCR-fil med innbetalinger. Digilist matcher den mot åpne fakturaer og merker dem som betalt. Manuell håndtering trengs kun for mismatch — typisk når en kunde har betalt feil beløp.\n\n**Måneds­rapporter.** Den 1. i hver måned genereres en rapport over forrige måneds inntekter per anlegg, refusjoner, restanser, og MVA-spesifikasjon. Klar til revisor.\n\n## Hva sliter et bookings­system mest med?\n\nKomplekse betalings­flyter med kombinasjoner. Eksempel: et lag bestiller sesong­leie for hele vinteren, betaler 30% forskudd nå, resten faktureres månedlig, og hvis de avlyser en enkelt­time refunderes time­pris automatisk fra forskuddet.\n\nVi har bygd modulen som håndterer dette med [Pricing v2-arkitekturen](/blogg/somlos-betaling-vipps-ehf) som beskrives mer detaljert der. Kort fortalt: hver bookings-line-item har sin egen livssyklus, kan flyttes mellom forskudd og etter­fakturering, og inntekts­føres på riktig periode automatisk.\n\nDet er ikke magisk. Det er disiplinert datamodellering, og det er forskjellen mellom et bookings­system som passer til en mat­butikk og et som tåler en kommune.\n\n';
const __vite_glob_0_9 = '---\nslug: foresporsel-chat-kommunikasjon\ntitle: "Forespørsel og chat — leietaker og utleier i Digilist"\ndescription: "To kanaler, samme dataspor: en strukturert forespørsel for nye bookinger, og en samtaletråd per booking for alt etterpå. Ingen tapte e-poster, ingen siloer."\ndate: 2026-05-28\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Kommunikasjon"\ncover: "/images/blog/digilist_app_hero_no.webp"\nkeywords: ["forespørsel", "chat", "kommunikasjon", "samtaletråd", "booking inquiry", "Digilist messaging"]\n---\n\n«Kan vi snakke om en booking?» er fortsatt det vanligste spørs­målet en leietaker stiller. Noen ganger handler det om en endring. Andre ganger om en kapasitets­avklaring før de bestiller. Atter andre om et spesielt arrangement som ikke helt passer i standard­bookings­flyten.\n\nDigilist deler dette i to klare flyter: **forespørsel** (før en booking finnes) og **chat** (etter at en booking finnes). Begge ligger som samtaletråder i plattformen — ikke i noens e-postinnboks.\n\n## Forespørsel — strukturert henvendelse før booking\n\nPå hvert utleieobjekt finnes knappen «Send forespørsel». Den åpner et skjema med:\n\n- **Hva slags arrangement?** (privat selskap, møte, trening, kurs, annet)\n- **Anslått antall deltakere**\n- **Ønsket dato og tid** (med kalender­hjelp som viser tilgjengelighet)\n- **Spesielle behov?** (rigging, AV-utstyr, catering, parkering)\n- **Kontakt­informasjon**\n\nNår forespørselen sendes, lander den i saks­behandlerens innboks som en uvanlig henvendelse — ikke en bookings­forespørsel som krever god­kjenning av en eksisterende booking, men en åpen samtale før det er noen booking i det hele tatt.\n\nSaksbehandleren kan svare med:\n\n- En direkte bekreftelse («Ja, det går fint. Vil du booke nå?» med lenke til prefylt bookings­skjema)\n- En motforespørsel («Vi har plass torsdag istedenfor onsdag. Passer det?»)\n- Et avslag med begrunnelse\n- Eller bare flere spørsmål via samtaletråden\n\nHele utvekslingen ligger lagret. Når en booking til slutt opprettes, kobles forespørselen automatisk til bookingen som «opphavet».\n\n## Chat — samtaletråd per booking\n\nNår en booking eksisterer, har den sin egen samtaletråd. Både leietaker og utleier ser:\n\n- Innledende booking­detaljer\n- Status­endringer (god­kjent, endret, kansellert)\n- Meldinger frem og tilbake\n- Tilkoblede dokumenter (kontrakter, kvitteringer, vedlegg)\n\nLeietaker ser tråden via Min Side. Utleier ser den på bookingen i admin. Begge får varsel — e-post som standard, SMS hvis aktivert — når den andre sender en melding.\n\nHva slags meldinger? «Vi blir to ekstra personer.» «Kan vi komme inn 30 minutter tidligere for å rigge?» «Hvor er parkering?» «Bekreftelse på at vi fikk depositum tilbake?» Alt det som tidligere gikk via personlig e-post og raskt forsvant ut av syne.\n\n## Hvorfor ikke bare e-post?\n\nE-post fungerer — for én person, en enkelt samtale. Den faller fra hverandre når:\n\n- Flere saks­behandlere må bytte på å svare (tråden er låst til én innboks)\n- Lederen vil se status på alle pågående saker (det krever tilgang til 12 forskjellige innbokser)\n- Du må finne tilbake til hva som ble avtalt for seks måneder siden (e-poster er slettet, søk­bare, eller arkivert ulikt)\n- Du skal demonstrere overfor revisor at riktig prosedyre ble fulgt (det finnes ikke noe spor av regelen, bare en e-post)\n\nNår kommunikasjonen lever på selve bookingen er den:\n\n- **Tilgjengelig for vikarer** uten å gi tilgang til personlige innbokser\n- **Sporbar** — hver melding tids­stemplet, ingen «den e-posten ble nok slettet»\n- **Søkbar på tvers** — vis meg alle samtaler med Skien IF siste år\n- **Knyttet til datavarmen** — du ser meldingen i kontekst av bookingen, ikke som en abstrakt e-postkjede\n\n## Hva med eksterne kanaler?\n\nTelefon og personlig e-post forsvinner ikke. Men i Digilist-modellen brukes de som inn­gangs­punkter, ikke som arbeidsverktøy. Får du en telefon­samtale om en booking? Opprett en notat i samtaletråden («Telefonsamtale 14. mai — avtalt to ekstra timer»). Får du en personlig e-post? Lim teksten inn i tråden.\n\nPå den måten samles all kontekst i samme datastruktur, uansett hvor den startet.\n\n## Sikkerhet og personvern\n\nSamtaletråder lagres kryptert. Personidentifiserende informasjon (PII) som telefonn­ummer og e-post­adresse vises kun til personer med rolle som krever det. Når en kunde ber om å bli slettet etter GDPR, anonymiseres samtale­trådene — innholdet beholdes for revisjons­spor, men koblingen til personen fjernes.\n\n## I praksis — én jobb mindre\n\nSaks­behandlere som har gått over fra e-post-basert kommunikasjon til Digilist sier oftest at det merkes på to ting: telefonen ringer mindre fordi leietakerne ser status selv i Min Side, og man slutter å bruke morgenen på å lete etter «hva ble det egentlig avtalt der?». Det er en liten endring i hverdagen som blir til en stor endring over et år.\n\n';
const __vite_glob_0_10 = '---\nslug: gdpr-iso-datalokasjon-norge\ntitle: "GDPR, ISO 27001 og datalokasjon: hva kommuner må vite"\ndescription: "Norske kommuner stiller stadig høyere krav til persondata. Hva datalokasjon i Norge og EU dekker — og hva sertifiseringer faktisk ikke gjør."\ndate: 2026-05-10\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Samsvar"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["GDPR", "ISO 27001", "datalokasjon", "personvern", "kommune", "SaaS"]\n---\n\nNorske kommuner som bytter ut interne fagsystemer mot SaaS-plattformer møter en sjekkliste av begreper: GDPR, ISO 27001, ISO 27701, databehandleravtale, dataregister, datalokasjon, schrems II. Listen kan virke skremmende, men kravene henger sammen — og en leverandør som tar dem på alvor kan vise nøyaktig hvordan hver enkelt del er løst.\n\n## Hvorfor datalokasjon er det første spørsmålet\n\nNorske kommuner behandler personopplysninger om innbyggere, ansatte og foreninger. GDPR-artikkel 44 og påfølgende artikler regulerer overføring av personopplysninger ut av EØS. Etter Schrems II-dommen (2020) er det i praksis svært vanskelig å overføre personopplysninger til USA — selv via standardklausuler — uten ytterligere risikobegrensende tiltak.\n\nFor SaaS-tjenester betyr dette tre praktiske krav:\n\n1. **Data lagres i EU/EØS.** Helst i Norge for å unngå selv minimal kompleksitet rundt overføring.\n2. **Backup og redundans er også innenfor EU/EØS.** Det hjelper ikke at primærdata ligger i Oslo hvis backup går til AWS US-East.\n3. **Underleverandører er kartlagt.** Kommunen må vite hvilke tredjeparts-leverandører som behandler data — Stripe, Vipps, e-postutsender osv.\n\nDigilist lagrer all kundedata i Norge og EU. Convex-instansen er hostet i EU-regioner, og PostgreSQL-clustre kjører i Norge eller EU. Backup følger samme regel.\n\n## ISO 27001 — hva sertifiseringen faktisk dekker\n\nISO 27001 er en standard for informasjonssikkerhetsstyringssystem (ISMS). Sertifiseringen betyr at en uavhengig revisor har verifisert at organisasjonen:\n\n- Har dokumentert sikkerhetspolicyer og prosedyrer\n- Identifiserer og behandler risiko systematisk\n- Har tilgangsstyring, logging og hendelseshåndtering\n- Har avtaler med underleverandører som dekker sikkerhetskrav\n- Gjennomfører regelmessige revisjoner og forbedrer kontinuerlig\n\n**Det ISO 27001 ikke alltid betyr:** at hver enkelt komponent i tjenesten er sikker. Sertifiseringen er om _systemet_ for å håndtere sikkerhet, ikke om _produktet_ i seg selv. En grundig kommune bør derfor be om både sertifikatet OG penetrasjonstestrapporter for selve produktet.\n\n## ISO 27701 — personvernsutvidelsen\n\nISO 27701 utvider ISO 27001 med spesifikke personvernkontroller — kartlegging av personopplysningsbehandling, registreredes rettigheter, samtykkehåndtering og databehandleravtaler. For en SaaS-leverandør som behandler kommunale persondata er ISO 27701 et tydelig signal om personvernmodenhet.\n\nDigilist er sertifisert mot både ISO 27001 og ISO 27701.\n\n## Databehandleravtale (DPA) — det viktigste dokumentet\n\nNår kommunen tar i bruk en SaaS-tjeneste, blir kommunen behandlingsansvarlig og SaaS-leverandøren databehandler. GDPR krever en skriftlig databehandleravtale (DPA) som regulerer:\n\n- Formål med behandlingen\n- Type personopplysninger som behandles\n- Varighet av behandlingen\n- Sikkerhetstiltak\n- Underdatabehandlere (sub-processors)\n- Plikter ved sikkerhetsbrudd og innsynsbegjæringer\n- Sletting eller tilbakelevering av data ved avslutning\n\nDigilists standard DPA er tilgjengelig før kontraktsinngåelse, ikke etter. Det er et tegn å være oppmerksom på — en leverandør som «sender DPA senere» har sjelden tenkt grundig gjennom personvern.\n\n## Dataregister og rett til sletting\n\nGDPR krever at kommunen som behandlingsansvarlig har oversikt over hvilke personopplysninger som behandles, hvor de er, og kan slette dem på forespørsel.\n\nFor Digilist betyr dette praktisk:\n\n- Hver innbygger har et innbyggerprofil-objekt som inneholder alle deres data\n- Sletting på forespørsel går gjennom et eget endepunkt som rydder data fra alle tabeller\n- Audit-loggen anonymiseres (ikke slettes — den må bevares for andre formål) etter rettferdig periode\n\n## Audit-logg og etterprøvbarhet\n\nGDPR krever at behandlingsansvarlig kan dokumentere _hva som er gjort, av hvem, når_. Digilist har en gjennomgående audit-logg som registrerer hver mutasjon i systemet — hvem som booket, hvem som godkjente, hvem som slettet, og når. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.\n\n## WCAG 2.0 AA — universell utforming\n\nForskrift om universell utforming av IKT-løsninger pålegger kommuner å oppfylle WCAG 2.0 AA. Dette gjelder også SaaS-tjenester som tilbys til innbyggere. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Vi publiserer tilgjengelighetserklæring (a11y statement) i samsvar med Digdirs mal.\n\n## Hva kommunen bør be om i anskaffelsen\n\n1. ISO 27001-sertifikat (kopi)\n2. ISO 27701-sertifikat (kopi) — eller minimum dokumentasjon av personvern-modenhet\n3. Penetrasjonstestrapport, ikke eldre enn 12 måneder\n4. Standard databehandleravtale med vedlegg over underdatabehandlere\n5. Beskrivelse av datalokasjon for primær- og backup-data\n6. Tilgjengelighetserklæring (WCAG-status)\n7. Prosedyrer for sikkerhetsbrudd og innsynsbegjæringer\n\nFor Digilist finner du alle disse dokumentene i vår [personvernerklæring](/personvern) og kontaktbar leverandørdokumentasjon — be om dem på [kontakt@digilist.no](mailto:kontakt@digilist.no).\n';
const __vite_glob_0_11 = '---\nslug: hvorfor-digital-booking-2026\ntitle: "Hvorfor digital booking er påkrevd for kommuner i 2026"\ndescription: "Innbyggerforventninger, anskaffelsesregelverk og kostnadspress peker samme vei: 2026 er året kommunale bookingsystemer ble påkrevd, ikke valgfritt."\ndate: 2026-05-22\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Strategi"\ncover: "/images/blog/digital_booking_importance_hero_no.webp"\nkeywords: ["digital booking", "kommunal digitalisering", "SSA-L 2026", "innbyggertjenester", "Digdir"]\n---\n\nI 2015 var en digital bookingkalender hos en kommune en hyggelig ekstra. I 2020 ble den et konkurransefortrinn mellom kommuner som skulle tiltrekke seg innbyggere. I 2026 er den noe annet: en _forutsetning_ — både for å oppfylle regelverk, for å holde driftskostnader nede, og for å møte innbyggernes minste forventning. Tre krefter har skjøvet utviklingen, og ingen av dem reverserer seg.\n\n## Krav 1: Innbyggernes forventning er ikke lenger til forhandling\n\nDen gjennomsnittlige norske innbyggeren booker bord på restaurant via mobilen, tannlegen via [Helsenorge.no](https://www.helsenorge.no/), pakkelevering via PostNord-appen, og barnepass via en privat plattform. Når hun skal booke kommunens kantine til søsterens 50-årsdag og blir møtt av et PDF-skjema som må fylles ut, scannes, og sendes til en kommunal e-post som besvares i løpet av 5–10 virkedager, er det ikke et nostalgisk irritasjonsmoment. Det er en signal om at kommunen ikke leverer på samme nivå som resten av samfunnet.\n\n[Difi/Digdirs innbyggerundersøkelse](https://www.digdir.no/) viser at over 70 % av norske innbyggere forventer at kommunale tjenester er digitale på samme nivå som banktjenester. Det er ikke en politisk preferanse — det er det implisitte servicenivået innbyggerne sammenligner med.\n\n## Krav 2: Anskaffelsesregelverket er strammet inn\n\n[SSA-L 2026](/blogg/ssa-l-2026-bookingsystem-kommune) — Statens Standardavtale for løsninger — definerer hva et offentlig anskaffet IT-system skal levere. For bookingsystemer betyr det konkret:\n\n- Sanntidstilgjengelighet (ikke nattlig synkronisering)\n- ID-porten og BankID-autentisering på nivå Substansiell eller Høyt\n- EHF/Peppol-fakturering for organisasjoner\n- BRREG-verifisering av lag og foreninger\n- Universell utforming etter WCAG 2.1 AA (krav fra [Likestillings- og diskrimineringsloven § 17a](/blogg/universell-utforming-wcag-kommunal-booking))\n- ISO 27001 og ISO 27701-sertifisering\n- Audit-spor på hver mutasjon (krav fra arkivloven og GDPR)\n- Datalokasjon i Norge eller EU ([GDPR + ISO 27001](/blogg/gdpr-iso-datalokasjon-norge))\n\nEn kommune som anskaffer bookingsystem i 2026 _uten_ å oppfylle disse kravene har et juridisk problem, ikke et teknisk problem.\n\n## Krav 3: Kostnadspresset gjør det irrasjonelt å la være\n\nDen klassiske misforståelsen er at digitalisering er en _kostnad_ kommunen kan velge bort. Regnestykket fra de tjue norske kommunene som har digitalisert booking i de siste fem årene viser det motsatte. Tre poster:\n\n- **Saksbehandlertid:** Manuell booking via e-post og telefon koster typisk 8–15 minutter per booking. Digital selvbetjening tar 30–60 sekunder, og 90 % av bookingene krever ingen menneskelig involvering. En kommune med 1 200 bookinger i måneden frigjør i størrelsesorden 150 timer saksbehandlertid per måned.\n- **Refusjon og feilrettinger:** Manuelle bookinger har en feilrate på 8–12 % (dobbeltbookinger, gale tider, glemte avlysninger). Digitale systemer ligger på under 0,5 %. Hver feil koster i snitt 45 minutter å rette opp.\n- **Driftsvarsling:** Manuelle bookinger krever telefonkjede til vaktmester, renhold og vekter. Digital varsling skjer automatisk. Direkte besparelse i overtid, særlig på helg.\n\nSett over fem år er den totale besparelsen for en mellomstor kommune typisk høyere enn investeringen i et bookingsystem — uten å regne med innbyggerverdien.\n\n## Hva 2026 _ikke_ er\n\nDet er en feilslutning at digital booking betyr «innbyggerportal». Booking er bare _grensesnittet_; den reelle digitaliseringen ligger lenger ned i stacken:\n\n- **Fra siloer til sammenheng.** Bookingen må snakke med betaling, fakturering, regnskap, adgangskontroll og driftsvarsling.\n- **Fra synkronisering til sanntid.** Reaktiv runtime, ikke nattlige jobber.\n- **Fra ansatte til regler.** Sesongleie-fordeling som bygger på dokumenterte prioriteringsregler, ikke saksbehandlerens skjønn.\n- **Fra PDF til EHF.** Standardiserte, etterprøvbare leveranser, ikke fritekst-fakturaer.\n\nEn kommune som har en bookingkalender på nettsiden, men håndterer alt annet manuelt, er ikke _digitalisert_. Den er _online_. Forskjellen er betydelig.\n\n## Hva 2026 _er_\n\nDet er året da terskelen flyttet seg. Innbyggerne forventer det. Regelverket krever det. Regnestykket favoriserer det. Det er ikke lenger en politisk avgjørelse om kommunen skal digitalisere booking — det er et spørsmål om _hvordan_, og _hvor raskt_.\n\nDen beste tilnærmingen er ikke å vente på en stor anskaffelse. Det er å starte med en pilot på ett anlegg, bygge tillit i organisasjonen, og skalere når innbyggerne — og saksbehandlerne — har sett at det fungerer. Det er nettopp den modellen [Digilists pilotprogram](/#pilot) er bygget for.\n\n';
const __vite_glob_0_12 = '---\nslug: idporten-bankid-kommunal-innlogging\ntitle: "ID-porten og BankID — pålitelig innlogging i kommunale tjenester"\ndescription: "ID-porten er Norges felles innloggingsløsning for offentlig sektor. Slik integrerer Digilist ID-porten og BankID — uten å håndtere passord."\ndate: 2026-05-16\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Integrasjoner"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["ID-porten", "BankID", "eIDAS", "Signicat", "BRREG", "kommunal innlogging", "autentisering"]\n---\n\nFor en kommune er innloggingen til en digital tjeneste ofte det første reelle møtet mellom innbygger og forvaltning. Den må være trygg nok til at sensitive operasjoner kan utføres, enkel nok til at en bestemor kan booke en kantine til 80-årsdagen, og rettskraftig nok til at en signert leiekontrakt holder i en domstol. I Norge løses alle tre kravene i samme grep: [ID-porten](https://www.idporten.no/), forvaltet av Digitaliseringsdirektoratet (Digdir).\n\n## Hva ID-porten gjør, kort fortalt\n\nID-porten er en _felles innloggingsproxy_ for offentlig sektor. Når en innbygger trykker «Logg inn» på en kommunal tjeneste, sendes hun videre til ID-porten, som tilbyr fire eID-er:\n\n- **BankID** (mobilapp eller kodebrikke) — det vanligste valget, levert av bankene i fellesskap.\n- **BankID på mobil** (SIM-basert) — en eldre, men fortsatt brukt variant.\n- **MinID** — Skatteetatens eID for personer uten BankID.\n- **Buypass** — et alternativ, særlig brukt av helsesektoren.\n\nEtter vellykket pålogging signerer ID-porten en SAML- eller OpenID Connect-respons og sender brukeren tilbake til den kommunale tjenesten med verifisert identitet. eID-nivået (Substansiell eller Høyt iht. [eIDAS-forordningen](https://en.wikipedia.org/wiki/EIDAS)) ligger i responsen, så tjenesten kan kreve nivå Høyt for handlinger med kontraktsmessige konsekvenser.\n\nDet er Digdir som har avtale med eID-leverandørene. Kommunen avtaler ikke direkte med BankID — det forenkler både drift og juss.\n\n## Hvordan Digilist kobler det sammen\n\nDet finnes tre vanlige integrasjonsmodeller mot ID-porten: direkte mot Digdirs OpenID Connect-endepunkt, via [Signicat](https://www.signicat.com/) som mellomledd, eller via en kommunal IDP som allerede har avtale (Active Directory + FEIDE for ansatte, ID-porten for innbyggere). Digilist støtter alle tre, men anbefaler Signicat-modellen for innbyggertilgang:\n\n1. **Reduserer driftsoverhead.** Signicat har levert ID-porten-integrasjoner siden 2007 og holder oversikten over sertifikater, fornyelser og protokollendringer.\n2. **Gjør BankID på mobil enklere.** Signicat tilbyr en kraftig redirect-flyt som fungerer på alle norske mobilbankidvarianter uten ekstra konfigurasjon.\n3. **Forenkler revisjonsspor.** Signicat lagrer signaturer på en standardisert måte — kommunens datatilsyn får én leverandørkontakt for hele eID-stakken.\n\nInnloggingsflyten er overraskende kort fra innbyggerens perspektiv:\n\n> Trykk «Logg inn» → BankID-app → bekreft → tilbake i Digilist, ferdig.\n\n## Hva med lag og foreninger?\n\nID-porten verifiserer _personer_, ikke _organisasjoner_. Når et idrettslag skal søke om sesongleie, trenger vi mer enn at signatøren har BankID — vi trenger å vite at hun har lov til å signere på vegne av laget. Digilist løser det med [Brønnøysundregistrene (BRREG)](https://www.brreg.no/):\n\n1. Søker logger inn med BankID via ID-porten.\n2. Digilist henter signatørens rolle i BRREG via personnummer (med samtykke).\n3. Hvis personen er registrert som leder, nestleder, daglig leder eller styremedlem med signaturrett i den oppgitte organisasjonen, kobles søknaden til foreningen.\n4. Hvis ikke, vises en feilmelding som forklarer at signatøren må be om delegert tilgang eller logge inn med korrekt rolle.\n\nResultatet: kommunen vet at hver sesongleieavtale er signert av noen med faktisk fullmakt, ikke bare av noen som hadde tilfeldig tilgang til lagets postkasse.\n\n## Hva med ansatte i kommunen?\n\nSaksbehandlerne logger ikke inn med ID-porten — de er allerede pålogget kommunens egen [FEIDE](https://www.feide.no/)-baserte identitetsstyring. Digilist kobler seg på via SAML 2.0 mot kommunens IdP og henter rolle, organisasjon og avdeling. RBAC-modellen i Digilist mapper FEIDE-rollene til lokale tillatelser:\n\n- `kulturkonsulent` → kan godkjenne søknader, justere fordeling\n- `vaktmester` → kan se aktive bookinger, varsles automatisk\n- `kommunal_administrator` → kan endre regler, anlegg, priser\n\nNår en ansatt slutter, fjernes vedkommende fra kommunens IdP — og Digilist arver tilgangsbortfallet automatisk på neste innlogging. Ingen «glemte ansatt-kontoer» som flyter rundt i revisjonen.\n\n## Hva med innbyggere som ikke har BankID?\n\nDet er en mindre, men reell gruppe. Digilist tilbyr to fallback-flyter for kommuner som ønsker det:\n\n- **MinID** for innbyggere uten BankID — fortsatt eID, men nivå Substansiell i stedet for Høyt.\n- **Saksbehandlerassistert booking** — innbygger ringer kommunens servicetorg, og en ansatt utfører bookingen på vegne av personen med dokumentert samtykke. Bookingen lagres med både innbyggerens og saksbehandlerens identitet.\n\nResultatet: ingen innbygger er teknisk utelukket fra å bruke kommunens tjenester.\n\n## Når ID-porten ikke fungerer\n\nSjeldnere enn man tror, men det skjer — typisk når en innbygger har BankID, men passordbeskyttelsen er mistet, eller når banken har planlagt vedlikehold. Digilist viser da en klar feilmelding med Digdirs kontaktinformasjon for ID-porten-support, og logger feilen som en innbyggerhendelse for kommunens servicetorg. Det er Digdirs ansvar å bringe ID-porten tilbake — kommunens ansvar er å informere innbyggerne, og det er Digilists ansvar å gjøre den informasjonen forståelig.\n\n## Hvorfor det betyr noe\n\nID-porten er den enkleste måten en kommune kan dele tillit med innbyggerne sine på. Bestemoren som booker kantinen bryr seg ikke om eIDAS-nivåer eller SAML-signaturer — hun bryr seg om at det føles trygt og at lenken til kommunen vises i topplinjen mens hun logger inn. Det er nettopp den følelsen ID-porten leverer, og det er nettopp den følelsen Digilist er bygget for å bevare.\n\n';
const __vite_glob_0_13 = '---\nslug: digitalisert-tildeling-idrettshaller-lag-foreninger\ntitle: "Idrettshall-tildeling på dager, ikke uker – slik gjør du det"\ndescription: "Lær hvordan digitalisert tildeling av kommunale idrettshaller gir lag og foreninger raskere svar og full oversikt over sesongleie på én plass."\ndate: 2026-07-08\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Lag og foreninger"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["idrettshall booking", "kommunale lokaler tildeling", "sesongleie idrettshall", "lag og foreninger booking", "kalenderbasert booking", "kommunal utleie", "dobbeltbooking"]\n---\n\nHvert år, gjerne i august og september, starter den samme runden: trenere og lagledere sender inn søknader om hallid til kommunen, venter i ukevis på svar, ringer saksbehandlere for status og ender opp med å planlegge sesongstart uten å vite hvilke tider laget faktisk får. Det er ikke mangel på vilje som skaper problemet – det er manuelle prosesser som ikke er laget for volumet av søknader kommunen mottar.\n\nDenne artikkelen forklarer hvordan digitalisert tildeling endrer hverdagen for lag, foreninger og kommunen selv.\n\n---\n\n## Hvorfor manuell tildeling koster alle parter tid\n\nNår en kommune håndterer søknader om hallid manuelt, betyr det som regel e-post, regneark og telefoner frem og tilbake. Saksbehandleren må samle inn søknader, sjekke mot eksisterende bookinger, avklare prioriteringer etter kommunens tildelingsregler, sende tilbakemelding og følge opp eventuelle konflikter.\n\nFor et lag betyr det uker med usikkerhet. Det er vanskelig å bestille trenere, melde på cuper eller kommunisere med foreldre når du ikke vet hvilke tider laget trener på.\n\nFor kommunen betyr det at saksbehandlingskapasiteten spises opp av koordineringsarbeid som i stor grad kan automatiseres. I travle perioder kan behandlingstiden for en søknad ligge på to til tre uker – ikke fordi saken er komplisert, men fordi køen er lang og verktøyene er manuelle.\n\n### Konsekvenser som akkumuleres\n\n- **Dobbeltbookinger** oppstår når to saksbehandlere ikke har oppdatert oversikt i sanntid\n- **Lagledere** bruker tid på oppfølging fremfor aktivitet\n- **Driftsledere** ved hallene vet ikke alltid hvem som har bestilt hva til hvilken tid\n- **Dokumentasjon** som forsikringsbevis og organisasjonsnummer etterspørres manuelt for hvert søknadsrunde\n\n---\n\n## Slik fungerer automatisert, kalenderbasert booking med sesongleie\n\nEt digitalt bookingsystem for kommunale idrettshaller er bygget rundt én felles kalender som viser tilgjengelighet i sanntid. Lag og foreninger logger inn, ser hvilke tider som er ledige og sender søknad direkte i systemet – uten å måtte vente på at noen skal svare på e-post for å finne ut om hallen er opptatt.\n\nDet sentrale er skillet mellom **engangsbooking** og **sesongleie**. For organiserte lag er sesongleie det viktigste: laget søker om en fast ukentlig tid gjennom hele sesongen, for eksempel mandager fra 18.00 til 20.00 fra september til april. Systemet legger dette inn som en gjentakende reservasjon og blokkerer tidspunktene automatisk for øvrige søkere.\n\n### Hva systemet håndterer automatisk\n\n1. **Tilgjengelighetskontroll**: Systemet sjekker om den ønskede tiden er ledig for hele perioden\n2. **Prioritering etter kommunens regler**: Barn og unge, kommunale lag, størrelse på organisasjon – prioriteringskriteriene legges inn én gang og brukes konsekvent\n3. **Varsler og statusoppdateringer**: Lagleder får automatisk beskjed når søknaden er mottatt, til behandling og vedtatt\n4. **Dokumenthåndtering**: Nødvendige vedlegg lastes opp én gang og knyttes til organisasjonen, ikke til hver enkelt søknad\n\n---\n\n## Eksempel: 48 timer i stedet for tre uker\n\nLillestrøm Fotballklubb har tre lag som søker om hallid til vintertrening. Tidligere sendte lagleder e-post til kommunen, fikk en bekreftelse på at søknaden var mottatt, og ventet deretter i gjennomsnittlig tre uker på tildeling. I noen tilfeller kom tildelingen så sent at sesongplanen allerede var satt opp med feil tider, noe som krevde ny runde med koordinering.\n\nMed et digitalt bookingsystem fyller lagleder inn søknaden i et skjema, velger ønskede tider i kalenderen og laster opp gyldig forsikringsbevis. Systemet kontrollerer automatisk at tidene er ledige og sender søknaden til saksbehandlerkøen med all nødvendig dokumentasjon allerede på plass.\n\nSaksbehandleren trenger ikke etterspørre vedlegg, ringe for avklaringer eller sjekke manuelle regneark. Resultatet er at Lillestrøm Fotballklubb får tilbakemelding innen 48 timer. Lagleder kan bekrefte treningstider til foreldre og trenere allerede første uke i august – ikke i slutten av september.\n\n---\n\n## Det du trenger i ett bookingsystem\n\nIkke alle digitale løsninger er like godt egnet for kommunal tildeling til lag og foreninger. Her er funksjonaliteten som faktisk gjør en forskjell:\n\n### Tilgjengelighetsoversikt i sanntid\n\nLagledere skal kunne se hvilke tider som er ledige uten å måtte ta kontakt med kommunen. Kalenderen må vise bookede, reserverte og ledige tider, og oppdateres umiddelbart når en tildeling er gjort.\n\n### Dokumenthåndtering knyttet til organisasjonen\n\nLag og foreninger skal slippe å laste opp forsikringsbevis, vedtekter og organisasjonsnummer ved hver søknad. Disse dokumentene knyttes til laget i systemet og brukes på tvers av alle søknader, med varsler når dokumenter nærmer seg utløpsdato.\n\n### E-signering av tildelingsavtaler\n\nNår kommunen tildeler hallid, bør selve avtalen signeres digitalt direkte i systemet. Det eliminerer papirpost, e-postvedlegg og manuell arkivering. Begge parter har til enhver tid tilgang til signert dokumentasjon.\n\n### Støtte for sesongleie og gjentakende reservasjoner\n\nSystemet må håndtere ukentlige gjentakelser over en sesong, inkludert unntak for helligdager, hallavstengning og cuper. Endringer i enkeltdatoer skal ikke kreve at hele søknaden behandles på nytt.\n\n---\n\n## Færre dobbeltbookinger, mindre koordinering\n\nEt av de mest konkrete gevinstene ved digitalisert tildeling er at driftsleder ved hallen og saksbehandleren i kommunen jobber mot den samme kalenderen. Det betyr at en tildeling gjort av saksbehandleren umiddelbart er synlig for driftsleder, og omvendt.\n\nI manuelt drevne systemer oppstår dobbeltbookinger fordi informasjonen finnes på to eller flere steder som ikke er synkronisert: kommunens regneark, driftslederens eget system og lagenes egne oversikter. Å rydde opp i en dobbeltbooking krever telefoner, omrokkeringer og frustrerte trenere.\n\nMed ett felles system finnes hallens kalender kun ett sted. Systemet nekter automatisk å opprette en booking i en allerede opptatt tid, uansett hvem som gjør bestillingen.\n\n### Redusert administrasjonsbyrde i praksis\n\nEn saksbehandler som tidligere brukte fire til fem dager i uken på å behandle søknader manuelt i høysesong, kan med et digitalt system bruke mesteparten av den tiden på faktiske vedtak og prioriteringsvurderinger – ikke på å samle inn vedlegg og sjekke kalenderkollisjoner.\n\nFor lag og foreninger betyr det raskere svar, mer forutsigbar planlegging og langt mindre tid brukt på å følge opp kommunen.\n\n---\n\n## Kom i gang med Digilist\n\nDigilist er et bookingsystem laget for kommunal tildeling av lokaler til lag og foreninger. Systemet håndterer sesongleie, dokumentasjon, e-signering og kalenderbasert oversikt i én løsning – for både saksbehandler, driftsleder og lagleder.\n\nØnsker du å se hvordan det fungerer i praksis for din kommune eller ditt lag?\n\n**[Book en demo med Digilist](https://www.digilist.no/demo)** – vi viser deg hele flyten fra søknad til signert tildelingsavtale, og svarer på spørsmål tilpasset din situasjon.\n';
const __vite_glob_0_14 = '---\nslug: magic-link-sms-bankid-sikker-innlogging\ntitle: "Magic link, SMS og BankID — tre sikre innloggingsmåter"\ndescription: "Magic link på e-post, engangskode på SMS, eller BankID via ID-porten. Tre sikre innloggingsmåter — én plattform. Kommunen bestemmer hvilken som kreves."\ndate: 2026-05-29\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sikkerhet"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["magic link", "passordløs innlogging", "SMS innlogging", "BankID", "ID-porten", "passwordless authentication", "kommunal innlogging"]\n---\n\nPassord var en feilbeslutning av Internett. For en bookings­plattform for kommunale lokaler er det også en barriere — innbyggeren skal bestille en bryllups­lokale, ikke administrere et SaaS-system. Hver glemt passord-tilbake­stilling er en kunde som forsvant.\n\nDigilist støtter tre passordløse innloggings­metoder, og kommunen bestemmer hvilke som kreves for hvilke flyter.\n\n## I. Magic link på e-post\n\nSkriv inn e-post­adressen din. Vi sender en lenke. Klikk på lenken — du er innlogget i 30 dager (kan justeres per kommune).\n\n**Når brukes det.** Standard for privat­personer som booker selskaps­lokaler, møterom eller idretts­haller hvor det ikke kreves identitets­verifikasjon. 80% av book­ingene faller i denne kategorien.\n\n**Hvor sikkert er det.** Sikkert nok for low-risk bookinger. Lenken er kryptografisk signert, gyldig i 15 minutter, og kan kun brukes én gang. Den havner i samme innboks som kunden allerede bruker — som er kontoen de uansett ville mistet hvis noen hadde tilgang.\n\n**Tekniske detaljer.** JWT-signert token med kort levetid. Sendes via Resend (ikke SMTP-direkte). E-postene leveres med en gjennomsnittlig latens på 3–8 sekunder. Forsvinner lenken i spam? Klikk «Send på nytt».\n\n## II. SMS-engangskode\n\nSkriv inn mobil­nummer. Du får en 6-sifret kode på SMS. Skriv inn koden, du er innlogget.\n\n**Når brukes det.** For brukere uten norsk e-post­adresse, eller hvor kommunen ønsker en sterkere bekreftelse på telefonnummer enn på e-post. Også standard på mobil-først arrange­menter der det er enklere å taste en kode enn å bytte til e-postappen.\n\n**Hvor sikkert er det.** Sterkere enn passord, svakere enn BankID. SMS er ikke kryptert mellom operatører, så det er ikke egnet for høy-risk operasjoner. Men for «logg inn for å se min booking» — fullt tilstrekkelig.\n\n**Tekniske detaljer.** Koden er 6 sifre, gyldig i 5 minutter, maks 3 forsøk før blokkering i 30 minutter. Telefonn­ummer valideres mot E.164-format og verifiseres mot kjente VOIP-tjenester (vi tillater ikke engangs­numre fra burner-tjenester).\n\n## III. BankID via ID-porten\n\nKlikk «Logg inn med ID-porten». Du sendes til ID-porten, autentiserer med BankID, og blir sendt tilbake til Digilist autentisert.\n\n**Når brukes det.** Krevd for sesong­leie-søknader (lag og foreninger må kunne identifisere personlig signatar), for kontrakter som krever digital signatur, og som standard for organisasjons­kontoer. Kommunen kan kreve det også for vanlige bookinger hvis ønskelig.\n\n**Hvor sikkert er det.** Sterkeste sivile autentiserings­metode i Norge. Vi bruker det også som identifikator når kunden senere skal signere kontrakt — én autentisering, hele løpet ID-verifisert.\n\n**Tekniske detaljer.** OIDC-flyt via Signicat (eller direkte ID-porten for større kommuner). Vi mottar `sub` (pseudonymisert ID), navn, fødselsdato og e-post — ingen fødselsnummer lagres i Digilist. Sesjons­varighet 8 timer, krever ny autentisering etter det.\n\n## Hva velger en kommune?\n\nVi anbefaler en lagdelt strategi:\n\n| Operasjon | Krav |\n|---|---|\n| Bla i tilgjengelige lokaler | Ingen innlogging |\n| Send forespørsel | Magic link (e-post) |\n| Book et standard lokale | Magic link eller SMS |\n| Book et anlegg med tilgangs­kontroll (nøkkel) | SMS eller BankID |\n| Søke om sesong­leie | BankID |\n| Signere kontrakt | BankID |\n| Administrere organisasjons­konto | BankID |\n\nDette balanserer brukervennlig­het mot tillit. En innbygger som booker barnebursdagsfest skal ikke trenge BankID. En lag­leder som forplikter organisasjonen til sesong­leie burde.\n\n## Onboarding-friksjon — målt på tvers\n\nVi har data fra kommuner som har brukt Digilist over 18 måneder. Med passordløs innlogging:\n\n- **Konvertering fra forespørsel til fullført booking:** 73% (industri­snitt for kommunale tjenester med passord: 41%)\n- **Drop-off på innloggings­steget:** 4% (industri­snitt: 22%)\n- **Andel innbyggere som booker mer enn én gang:** 58% (industri­snitt: 19%)\n\nTallene forteller én ting tydelig: når innlogging slutter å være en hindring, blir gjenkjøps­andelen høyere. Ikke fordi tjenesten er bedre — fordi den ikke kaster ut folk.\n\n## Hva med eldre brukere?\n\nFrykten er reell: «Hva med folk som ikke bruker e-post på telefonen?» Svaret i praksis: de som har problemer med passord, har større problemer med passord enn med magic link. Magic link på desktop fungerer slik:\n\n1. Skriv inn e-post på din PC\n2. Åpne e-post-programmet ditt på samme PC\n3. Klikk lenken — du er innlogget i samme nettleser-fane\n\nDet krever ikke at brukeren forstår OAuth, OTP, eller noe annet. Det krever bare at de kan åpne sin egen e-post. Som de uansett allerede gjør.\n\nFor de få som virkelig sliter — der har kommunen alltid telefon­support som backup. Disse er en liten gruppe, men plattformen er designet for at de ikke skal stenges ute.\n\n## Sikkerhet bak kulissene\n\nAlle innloggings­hendelser logges. Mistenkelig aktivitet (mange forsøk fra ulike IP-adresser, store geografiske hopp innen kort tid) trigger automatisk konto­låsing og e-postvarsel til brukeren. Vi har ikke selv noensinne hatt et innbrudd i en plattform­konto — passordløs design fjerner hele angreps­overflaten der passord blir lekt fra andre tjenester og prøvd hos oss.\n\n';
const __vite_glob_0_15 = '---\nslug: min-side-alle-bookinger-paa-ett-sted\ntitle: "Min Side — alle bookinger, samtaler og kvitteringer på ett sted"\ndescription: "Kommende bookinger, fullførte, samtaletråder med utleier, kvitteringer og kalender­integrasjon — alt samlet et sted innbyggeren faktisk kan finne tilbake til."\ndate: 2026-06-02\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 5\ntag: "Innbygger"\ncover: "/images/blog/minside_hero.svg"\nkeywords: ["Min Side", "innbygger dashboard", "bookings historikk", "kvittering", "kalenderintegrasjon", "selvbetjening", "Digilist UX"]\n---\n\nDet vanligste support-spørs­målet hos kommunens servicetorg er ikke «hvordan booker jeg?» — det er «hvor finner jeg igjen bookingen min?». Den ble bekreftet på e-post for tre uker siden. E-posten er borte. Bekreftelses­linken er glemt. Personen vil bare endre tids­punktet en time.\n\nMin Side i Digilist løser den problemstillingen ved å eksistere på samme adresse hver gang, å være tilgjengelig uten passord, og å samle absolutt alt en innbygger har gjort i plattformen på samme sted.\n\n## Hvordan innbyggeren finner Min Side\n\nTre veier:\n\n1. **`booking.kommune.no/minside`** — direkte URL, fungerer alltid\n2. **Knappen «Min Side»** i toppmenyen, synlig når innlogget\n3. **«Se mine bookinger»** i hver bekreftelses- og påminnelses-e-post\n\nHvis innbyggeren ikke er innlogget, trigges magic link automatisk. Skriv e-post, klikk lenke i e-post, du er på Min Side. Ingen passord-glemt-flyt.\n\n## Hva Min Side viser\n\nTre faner:\n\n### Kommende bookinger\n\nListe over alt som ligger framover i tid. For hver:\n\n- Lokale (navn, bilde, adresse, kart-lenke)\n- Dato og tid\n- Bookings­nummer\n- Status (bekreftet, venter på god­kjenning, foreslått endring)\n- Aksjoner: vis detaljer, send melding, endre, kanseller\n\n«Endre» åpner et skjema som lar kunden foreslå ny tid. Hvis utleier har auto-god­kjenning av endringer på, gjennomføres den umiddelbart. Hvis ikke, sendes endrings­forespørsel til saksbehandler.\n\n### Fullførte\n\nBooking­shistorikk — alt som er ferdig. For hver kan kunden:\n\n- Laste ned kvittering (PDF)\n- Be om kopi av faktura hvis det var en organisasjons­booking\n- Lese tilbake samtale­tråden\n- Skrive en anmeldelse hvis kommunen har det aktivert\n\nHistorikken går så langt tilbake som GDPR-policy­en tillater — typisk 36 måneder for vanlige bookinger, lengre for organisasjons­bookinger som er knyttet til kontrakter.\n\n### Søknader og avtaler\n\nFor sesong­leie og lengre­varige avtaler. Lag og foreninger ser her:\n\n- Status på sesong­leie-søknaden (innsendt, under behandling, god­kjent, avvist)\n- Tildelte tider når fordelingen er publisert\n- Avtaler de er knyttet til (digitalt signert via BankID)\n- Endrings­logger på avtalene\n\n## Samtaletråder — én pr. booking\n\nHver booking har sin egen samtale­tråd (se [Forespørsel og chat](/blogg/forespørsel-chat-kommunikasjon)). Fra Min Side ser kunden alle samtaler de har hatt, ordnet etter siste aktivitet. Klikk en samtale — du er i tråden, klar til å svare.\n\nUlest melding fra saks­behandler? Min Side har et lite tall-merke i navigasjonen, og kunden får e-post + push-varsel hvis den har installert plattformen som PWA på telefonen.\n\n## Kalender­integrasjon\n\nHver booking har en «Legg til i kalender»-knapp som genererer en .ics-fil. Klikker kunden den på telefonen, åpnes telefon­ens kalender­app med book­ingen prefylt. På desktop laster .ics-filen ned og kan importeres til Google Calendar, Outlook, Apple Calendar.\n\nVi vurderer abonnement-feed (kunden abonnerer på alle sine bookinger som en levende kalender), men det er foreløpig ikke prioritert — folk klager ikke på .ics-modellen.\n\n## Kvitteringer og fakturaer\n\nFor book­inger med betaling lagres:\n\n- **Kvittering** (PDF, alltid tilgjengelig) — viser hva som ble betalt, når, og hvordan\n- **Faktura** (PDF, hvis organisasjons­booking) — EHF-formatet for digital arkivering hvis kunden trenger det\n- **Refusjons­bekreftelse** (hvis aktuelt) — viser når og hvordan beløp ble tilbakeført\n\nInnbygger­regnskap er ofte etter­spurt rundt skatte­oppgjør (treningsavgift for barn osv.) — å ha en oversikt på ett sted gjør den jobben dramatisk enklere.\n\n## Personvern på Min Side\n\nDet innbyggeren ser om seg selv:\n\n- Sine egne bookinger og samtaler\n- Sin profil (navn, e-post, telefon — endrebart)\n- Sin betalingshistorikk\n- Sine preferanser (varsler, kalender­integrasjon)\n\nDet innbyggeren ikke ser:\n\n- Andre kunders data\n- Saks­behandlerens interne notater\n- Plattformens audit-logger\n\n«Last ned mine data» og «slett kontoen min» finnes som knapper. GDPR-retten håndteres direkte i grensesnittet, ikke via en e-post til support.\n\n## Tilgjengelighet\n\nMin Side er WCAG 2.1 AA-kompatibel:\n\n- Tastatur­navigerbar\n- Skjermleser­vennlig (Aria-roller, semantisk HTML)\n- 4.5:1-kontrast minimum\n- Skalerer til 200% uten tap av funksjonalitet\n- Responsive helt ned til 320 px bredde\n\nHvorfor det betyr noe: en del av kundebasen for kommunale book­inger er eldre eller har funksjons­nedsettelser. Tilgjengelig­hets-arbeid er ikke en juridisk avkrysnings­oppgave — det er hvordan man gjør tjenesten reell for alle.\n\n## Det enkle prinsippet bak\n\nMin Side er bygd på antakelsen om at innbyggeren ikke skal måtte huske hvordan plattformen fungerer. Hver gang de kommer tilbake, skal det være den samme adressen, samme layout, alle tidligere bookinger der de forventer dem. Det bygger den ene egenskapen som gjør at folk kommer tilbake: forutsigbarhet.\n';
const __vite_glob_0_16 = '---\nslug: onboarding-uke-til-live\ntitle: "Onboarding for nye kunder — fra signering til live på en uke"\ndescription: "Fem dager, fem milepæler. Ingen konsulent, ingen prosjektrigging — bare en sekvens som er bygget for at en kommune eller utleier skal komme live uten å miste fart."\ndate: 2026-05-30\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Onboarding"\ncover: "/images/blog/onboarding_hero.svg"\nkeywords: ["onboarding", "implementering", "go-live", "Digilist onboarding", "kommunal SaaS", "raskt i drift"]\n---\n\n«Hvor lang tid tar det å komme live?» er det første spørs­målet en kommune stiller. Det andre er: «Hvor mye av oss krever det?»\n\nBegge svar er kortere enn dere tror. Hovedgrunnen er at Digilist har bygget onboarding som et produkt, ikke som et konsulent­prosjekt. Den følger en bestemt sekvens, har klare milepæler, og forutsetter ingen tekniske personer på deres side.\n\nHer er hvordan en typisk uke ser ut.\n\n## Dag 1 — Signering og kick-off (1 time)\n\nAvtalen er signert, kommunen har en konto­ansvarlig hos oss, og dere har valgt:\n\n- Hvilke anlegg som skal med i første lansering (vi anbefaler maks 5–10 til å starte)\n- Hvilken juridisk enhet som er kunde (kommune­etat, foretak, kommune­selskap)\n- Hvilke roller som trenger admin-tilgang (typisk 2–4 personer)\n\nKick-off-møtet er 30 minutter. Vi går gjennom planen for uken, dere får tilganger, vi avtaler check-in-møter dag 3 og dag 5. Det er det.\n\n## Dag 2 — Konfigurasjon (2 timer dere · 3 timer oss)\n\nPlattformen er provisjonert. Dere logger inn for første gang og:\n\n- Last opp logo, sett farger om dere har en visuell profil\n- Sett organisasjons­detaljer (org.nr, adresse, kontakt)\n- Velg betalings­leverandører (Vipps, Stripe, EHF/Peppol) — vi setter opp koblingene\n- Inviter saks­behandlere og admins med deres e-postadresser\n\nVi tar oss av alt det tekniske: domene­oppsett (`booking.kommune.no`), e-postdomene-verifisering, integrasjons­kontoer.\n\n## Dag 3 — Innhold (4 timer dere · 1 time oss)\n\nDette er den eneste dagen som krever en seriøs arbeids­innsats fra deres side. Hvert anlegg får opprettet en oppføring med veiviseren (se [Slik legger du til et nytt utleieobjekt](/blogg/utleieobjekt-veiviser-steg-for-steg)). For 8–10 anlegg tar det ca. 30 minutter per anlegg første gang, eller mindre hvis dere har en mal å kopiere fra.\n\nHvis dere har data i et eksisterende system (RCO Booking, Excel-ark, en gammel webside) tilbyr vi importer:\n\n- **RCO-migrasjon.** Vi har en standard import som tar bygg, åpningstider, priser og pågående sesong­avtaler ut av RCO.\n- **Excel-import.** Last opp en .xlsx med kolonne­strukturen vi sender — anlegg, kapasitet, fasiliteter, åpningstider.\n- **Manuell oppretting.** Veiviseren, anlegg for anlegg.\n\nMøtet dag 3 er 30 minutter for å avklare spørsmål som dukker opp underveis.\n\n## Dag 4 — Test (3 timer dere · 2 timer oss)\n\nNå går plattformen i en stille modus — domenet svarer, alt fungerer, men den er ikke annonsert offentlig. Vi gjør sammen:\n\n- **Test-bookinger.** Saksbehandler oppretter en booking som privat­person (med Magic link). Plattformen sender bekreftelse. Kalender oppdateres. Faktura­grunnlag genereres.\n- **Driftsroller.** Vaktmester får e-post + SMS-varsel. Stemmer detaljene?\n- **Betalings­flyt.** En test-booking med Vipps-betaling. 1 krone, vi refunderer etterpå.\n- **Sesongleie.** Hvis dere skal bruke den, en test-søknad fra et fiktivt lag.\n- **Mobil.** Alt på iPhone og Android.\n\nEventuelle bugs eller justeringer fikses samme dag. Vi har en hot­fix-rutine for go-live-uker som leverer endringer innen 4 timer.\n\n## Dag 5 — Go-live (1 time dere)\n\nKnappen «Aktiver offentlig» trykkes. Plattformen er live på `booking.kommune.no` (eller deres valgte domene). Vi kjører sammen gjennom:\n\n- Sjekkliste for at alle anlegg er publisert\n- Bekreftelse på at SEO-data er i orden (sitemap submitted)\n- Test av siste e-post-flyt\n- Avtale om første ukes oppfølging\n\nResten av dagen sender dere selv en kort kommunikasjon til relevante interessenter — innbyggere via nettside/sosiale medier, lag og foreninger via e-post, kommune­ansatte via internt nyhetsbrev. Vi har maler.\n\n## Uke 2 — Stabilisering, ikke implementasjon\n\nUke 2 er ikke en del av onboarding — den er en del av drift. Men det er typisk når:\n\n- Første reelle book­ing fra innbygger kommer inn (oftest dag 1 av uke 2)\n- Saksbehandler oppdager noen flyter de vil justere (vi ringer kunde­ansvarlig)\n- Dere starter å se Plausible-statistikk på hva som faktisk skjer\n- Reglene for auto-god­kjenning kalibreres basert på reelle data\n\nVi har en check-in dag 10. Etter det er vi i normal support-modus.\n\n## Hva som ikke står på listen\n\n**Tilpasset utvikling.** Vi gjør ikke kundespesifikk koding under onboarding. Plattformen har konfigurer­ings­valg som dekker 95% av kommuner; resten holdes til etter at dere er live.\n\n**Migrasjon av historiske bookinger.** Vi importerer fram­tidige sesong­leier og pågående avtaler, men ikke hver eneste historisk booking fra 2019. Erfaringen er at det skaper mer støy enn verdi.\n\n**Custom integrasjoner.** Hvis dere trenger en kobling vi ikke har, vurderes det etter go-live. Standard-integrasjonene (Vipps, BankID, ID-porten, Visma, Tripletex, Fiken, EHF) er på plass dag én.\n\n## Hva en uke faktisk gir\n\nEtter onboarding har dere:\n\n- En live, offentlig bookings­plattform\n- 5–10 anlegg som tar imot bookinger\n- Saks­behandlere som er trent på flyten\n- Betalings­strøm fra Vipps og kort til kommune­konto\n- Faktura­grunnlag til regnskap (EHF eller direkte integrasjon)\n- En tjeneste innbyggere kan bruke på telefonen, uten passord\n\nFor en ordinær kommune med 12 anlegg er det 30+ timer å investere fra deres side over fem dager. Sammenlignet med et tradisjonelt SaaS-implementasjons­prosjekt på 3–6 måneder er det forskjellen mellom å bygge en bro og å gå over en eksisterende.\n\n';
const __vite_glob_0_17 = '---\nslug: penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor\ntitle: "Penetrasjonstesting: hva en SaaS-leverandør skal levere"\ndescription: "Hva betyr egentlig at en SaaS-leverandør er sikker? Pen-test, sårbarhetshåndtering og supply-chain — sjekkliste for kommunal anskaffelse."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Sikkerhet"\ncover: "/images/blog/gdpr_iso27001_hero_no.webp"\nkeywords: ["penetrasjonstesting", "pen-test", "sikkerhetsrevisjon", "supply chain", "Dependabot", "Snyk", "anskaffelse"]\n---\n\nNår en norsk kommune skal velge ny SaaS-leverandør, dukker spørsmålet om sikkerhet alltid opp — men ofte med altfor brede formuleringer. "Leverandøren skal følge gjeldende sikkerhetsstandarder." Hva betyr det egentlig? Hva er forskjellen mellom en leverandør som faktisk gjør arbeidet og en som har sertifikatet på veggen?\n\nDenne artikkelen er en praktisk guide for kommunens IT-leder eller anskaffelsesansvarlig: hva penetrasjonstesting og sikkerhetsrevisjon faktisk skal innebære, og hvilke spørsmål du bør stille.\n\n## Penetrasjonstest, sårbarhetsskanning og kodevurdering\n\nTre forskjellige aktiviteter blir ofte slått sammen under "sikkerhetstesting":\n\n- **Sårbarhetsskanning (Vulnerability scanning).** Automatisert verktøy som leter etter kjente sårbarheter. Rimelig, kjøres ofte (helst daglig). Verktøy: OWASP ZAP, Nessus, Qualys.\n- **Penetrasjonstest (Penetration test).** Manuell, av en sikkerhetsekspert som forsøker å bryte inn. Mer grundig, men dyrere. Bør kjøres minst én gang per år, og ved større endringer.\n- **Kodevurdering (Code review / SAST).** Statisk analyse av kildekoden. Skal være integrert i utviklerflyten, ikke en kvartalsvis aktivitet.\n\nEt godt sikkerhetsprogram har alle tre. En leverandør som bare har ett, dekker bare deler av angrepsflaten.\n\n## Hva en penetrasjonstest faktisk gir\n\nEn typisk leveranse fra en penetrasjonstest:\n- Rapport med funn, klassifisert etter alvorlighetsgrad (kritisk / høy / middels / lav).\n- Detaljert beskrivelse av hver sårbarhet med stegene for å reprodusere.\n- Anbefalt utbedring.\n- Etterprøving etter at utbedringen er gjennomført.\n\nEn kommune som signerer NDA bør ha rett til å se sammendraget av siste pen-test før kontraktssignering. Et leverandørsvar som er "vi gjør pen-test men kan ikke dele resultater" er et rødt flagg. Et leverandørsvar som er "her er sammendraget under NDA, vi har stengt alle kritiske funn og kan dokumentere det" er det riktige svaret.\n\n## Sårbarhetshåndtering — den daglige delen\n\nPen-test er punktnedslag. Den daglige sikkerheten handler om kontinuerlig sårbarhetshåndtering. Dette er hva en moderne SaaS-leverandør faktisk gjør (eller skal gjøre):\n\n### Avhengighetsoppdateringer\n\nEt typisk moderne system har 500+ tredjeparts-avhengigheter (npm-pakker, system-pakker, container-images). Nye sårbarheter publiseres daglig.\n\n- **GitHub Dependabot** eller **Snyk** overvåker hvilke avhengigheter som har CVE-er.\n- Kritiske CVE-er blir patchet innen 48 timer.\n- Høy-alvorlighetsgrad blir patchet innen 7 dager.\n- Resten følger normal cadens (ukentlig).\n\nEn leverandør som ikke kan svare på "hvor mange sårbarheter har du åpne akkurat nå?" har sannsynligvis ikke et fungerende program.\n\n### Supply chain — der angrepene kommer fra nå\n\nSupply chain-angrep er der angriperen kompromitterer en tredjeparts-pakke som mange systemer bruker. Eksempler: SolarWinds (2020), node-ipc (2022), xz-utils (2024).\n\nForsvar:\n- Pakke-pinning. Bruk eksakte versjoner, ikke "latest".\n- Lockfile-validering. Bekreft at den installerte versjonen samsvarer med det som er testet.\n- Builds i isolerte miljøer.\n- Signaturverifikasjon der det er tilgjengelig.\n\nFor en kommune i en anskaffelse: spør hva leverandøren gjør med supply chain. Et tomt svar er en advarsel.\n\n### Hemmelighetsskanning\n\nGitHub Secret Scanning, truffleHog eller lignende verktøy som leter etter ved et uhell innsjekkede API-nøkler. Et team som bruker disse vil oppdage et lekket Stripe-nøkkel innen minutter, ikke uker.\n\n## Bug bounty og ansvarlig sårbarhetsrapportering\n\nStørre SaaS-leverandører tilbyr bug bounty: en betalingsstruktur for at eksterne forskere skal rapportere sårbarheter ansvarlig. Mindre leverandører har minst en `security.txt`-fil med kontaktinformasjon for sikkerhetsforskere.\n\nHvis en leverandør ikke har en kanal for å motta sårbarhetsrapporter fra eksterne, betyr det at en forsker som finner noe må enten varsle leverandøren via vanlige kanaler (som ofte ignoreres) eller publisere funnet — i verste fall sammen med eksploiten.\n\nSjekk om leverandøren har `https://digilist.no/.well-known/security.txt`. Hvis ikke, spør hvorfor.\n\n## ISO 27001 vs faktisk arbeid\n\nISO 27001-sertifisering betyr at en uavhengig revisor har bekreftet at organisasjonen har et fungerende informasjonssikkerhetsstyringssystem (ISMS) på revisjonstidspunktet. Det betyr ikke at systemet ikke har sårbarheter.\n\nSertifisering er en grunnlinje, ikke et endepunkt. En leverandør med ISO 27001 og en aktiv pen-test-rapport er det du vil ha. En leverandør med bare ISO 27001 og ingen pen-test, har klart en revisjon — ikke nødvendigvis bygget et sikkert system.\n\n## Sjekkliste — det du bør spørre om i anskaffelse\n\nFor å gjøre dette praktisk, her er en konkret liste:\n\n1. **Penetrasjonstest** — Hvor ofte? Hvem utfører? Kan vi se sammendraget under NDA?\n2. **Sårbarhetshåndtering** — Hvor mange åpne sårbarheter har dere akkurat nå? Hva er SLA for kritisk / høy?\n3. **Avhengighetsoppdateringer** — Dependabot / Snyk / annet? Hvor ofte oppdateres avhengigheter?\n4. **Supply chain** — Hvilke tiltak? Lockfile-validering? Pinning?\n5. **Hemmelighetsskanning** — Aktiv? Hvilket verktøy?\n6. **Sikkerhetshendelse-rapportering** — `security.txt`? Bug bounty? Responstid?\n7. **ISO 27001** — Når sist revidert? Hvilket revisjonsfirma?\n8. **Kodevurdering** — SAST i CI? Hvilken dekning?\n\nEt leverandørtilbud bør kunne svare på alle åtte uten ekstra spørreruner. Hvis svarene er vage eller "vi kommer tilbake til deg", er det informasjon i seg selv.\n\n## Hva Digilist gjør\n\nFor ordens skyld:\n\n- Pen-test gjennomføres årlig av eksternt firma. Sammendrag er tilgjengelig under NDA for kommuner i anskaffelse.\n- Dependabot er aktivt på alle repositorier. Kritiske CVE-er har 48-timers SLA. Status er offentlig på et internt sikkerhetsdashboard.\n- Supply chain: pakkene er pinned, lockfile-validering ved hver deploy, npm audit i CI.\n- `security.txt` ligger på `digilist.no/.well-known/security.txt`.\n- ISO 27001 fra dag én. ISO 27701 på samme spor.\n- SAST integrert i CI gjennom typecheck + linting + dependency-scanning.\n\nDet er ikke en garanti mot angrep. Det er et fungerende program som gjør angrep dyrere for angriperen og raskere å oppdage for oss.\n\n## Veien videre\n\nSikkerhetsrevisjon er ikke et engangsarbeid. Det er et kontinuerlig program. En leverandør som forstår dette, er en leverandør du kan stole på over tid.\n\nVil du lese videre? Se [Cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem) for trusselbildet eller [DDoS og ransomware: beredskap](/blogg/ddos-ransomware-beredskap-bookingplattform) for hva som skjer hvis angrepet kommer.\n';
const __vite_glob_0_18 = '---\nslug: phishing-resistente-innlogginger-idporten-bankid\ntitle: "Phishing-resistente innlogginger med ID-porten og BankID"\ndescription: "Passordbaserte innlogginger phishes hver dag. Derfor er ID-porten og BankID det enkleste forsvarsgrepet en norsk kommune kan gjøre."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sikkerhet"\ncover: "/images/blog/integrations_idporten_hero_no.webp"\nkeywords: ["phishing", "ID-porten", "BankID", "FIDO2", "innlogging", "kommune", "MFA"]\n---\n\nStatistisk sett er passord-phishing den enkleste måten å bryte seg inn i en organisasjon på. Det krever ikke avanserte verktøy, ingen sero-days. Det krever bare at én ansatt klikker på riktig lenke og taster inn passordet på en falsk side. NSM og Mnemonic har konsistent flagget dette som den dominerende inngangsvektoren for cyberhendelser i norsk offentlig sektor.\n\nDen gode nyheten: phishing-resistente innloggingsteknologier finnes, er gratis å bruke for kommuner, og er allerede integrert i de fleste norske offentlige tjenester. Den enda bedre nyheten: et bookingsystem som velger riktig pålogging fra dag én lukker den vanligste angrepsvektoren før den åpnes.\n\n## Hvorfor passord ikke kan vinne\n\nEt passord er et delt hemmelig — brukeren kjenner det, og serveren kjenner det. Det betyr at hvis brukeren oppgir hemmeligheten på feil sted (en phishing-side), så vinner angriperen.\n\nTo-faktor med SMS hjelper noe. To-faktor med authenticator-app hjelper mer. Men begge har et grunnleggende problem: en angriper som lurer brukeren til å taste inn både passord og engangskode på samme falske side, vinner fortsatt.\n\nPhishing-resistent autentisering løser dette problemet ved å koble innloggingen til selve nettstedet brukeren besøker. Det er ikke noe brukeren *kan oppgi*. Det er kryptografisk knyttet til opprinnelsen.\n\n## ID-porten og BankID — phishing-resistent i praksis\n\nNår en norsk innbygger logger inn med BankID på en bookingside, skjer følgende:\n1. Bookingsiden ber ID-porten om en innlogging.\n2. ID-porten viser et BankID-vindu hos banken som leverer BankID.\n3. Brukeren autentiserer seg i BankID-appen eller med kodebrikke.\n4. ID-porten gir bookingsiden en signert token om at brukeren er den de utgir seg for å være.\n\nDet kritiske er steg 1 og 4: bookingsiden snakker direkte med ID-porten, og ID-porten signerer en token til *akkurat det opprinnelses-domenet*. En phishing-side på `digiIist.no` (med stor I) kan ikke be om en token til seg selv fordi ID-porten ikke kjenner det domenet.\n\nDette er kvalitativt forskjellig fra passord-phishing. Selv om brukeren *forsøker* å bli phisket, klarer ikke angriperen å oversette en BankID-pålogging til tilgang på sin egen falske side.\n\n## Hva med saksbehandlere?\n\nInnbyggere bruker BankID. Saksbehandlere — kulturkonsulenter, idrettskoordinatorer, vaktmestere — har behov for noe litt annet:\n- De logger inn ofte (flere ganger per dag).\n- De jobber fra kommunens nett, ikke hjemmefra.\n- De har behov for rollebaserte tilganger som varierer.\n\nDigilist tilbyr to spor for ansatte:\n\n1. **ID-porten med ansattlegitimasjon.** Den enkleste varianten — saksbehandleren har allerede en bekreftet identitet hos ID-porten, og bruker den.\n2. **Magic-link på e-post + SMS-bekreftelse.** For roller som ikke har ID-porten, eller for nye ansatte før ID-porten er provisjonert.\n\nBegge er phishing-resistente. Begge fungerer uten passord.\n\n## "FIDO2" — det teknologien heter\n\nFor dem som vil ha bakgrunnen: phishing-resistent autentisering bygger på FIDO2-standarden, som er bygget rundt offentlig-nøkkel-kryptografi i stedet for delte hemmeligheter. ID-porten og BankID er begge FIDO-kompatible.\n\nPraktisk betyr det at en kommune som velger en plattform som bygger på ID-porten + BankID, automatisk får dette forsvaret — uten å måtte forstå standarden i detalj. Det er en av få beslutninger der det enkleste valget også er det sikreste.\n\n## Hva som faktisk skjer i et phishing-forsøk\n\nEt tenkt scenario med passordbasert innlogging:\n1. Saksbehandler får en e-post: "Klikk her for å bekrefte din konto på bookingsystemet."\n2. Lenken går til `bookingsystem-bekreft.no` som ser identisk ut.\n3. Saksbehandler logger inn med passord.\n4. Angriperen har nå legitime credentials.\n\nSamme scenario med ID-porten:\n1. Saksbehandler får e-posten.\n2. Klikker på lenken, blir bedt om å logge inn med ID-porten.\n3. Det åpner et ID-porten-vindu — men det er feil URL-mønster, og BankID-vinduet vil ikke åpne fordi forespørselen ikke kan signeres for et ukjent domene.\n4. Angriperen får ingenting.\n\nDet er ikke umulig å phishe ID-porten-brukere, men listen er mye høyere. Det krever sosial manipulasjon der angriperen får brukeren til å selv navigere til riktig sted og deretter overlevere session-cookien — en mye mer komplisert operasjon.\n\n## Anbefaling\n\nFor en kommune som er i ferd med å velge bookingsystem: gjør pålogging med ID-porten + BankID til et absolutt krav. Det er gratis å bruke for offentlige aktører, det er kjent for innbyggerne, og det fjerner den enkleste angrepsvektoren før den oppstår.\n\nIngen annen enkeltbeslutning i en anskaffelse gir så mye sikkerhetsverdi per krone som denne.\n\nVil du vite mer om hvordan Digilist håndterer pålogging? Se [ID-porten og BankID for kommunal innlogging](/blogg/idporten-bankid-kommunal-innlogging) eller les videre om [cyberangrep mot norske kommuner](/blogg/cyberangrep-norske-kommuner-bookingsystem).\n';
const __vite_glob_0_19 = '---\nslug: realtime-varsler-driftsroller\ntitle: "Realtime-varsler: plattformen forteller før noen ringer"\ndescription: "En vaktmester som får telefon søndag morgen fordi noen står ute, er en kommune som mangler informasjonsflyt. Digilist fjerner samtalen før den starter."\ndate: 2026-05-25\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Drift"\ncover: "/images/blog/realtime_updates_hero_no.webp"\nkeywords: ["push-varsler", "driftsroller", "vaktmester", "renhold", "automatisk varsling", "outbox event bus"]\n---\n\nDet er et øyeblikk som gjentar seg i hver kommune: en innbygger har booket en lokale, kommer dit i tide, men finner døren låst. Hun ringer servicetorget, som ringer kulturkonsulenten, som ringer vaktmesteren. Tre samtaler, fem minutters frustrasjon, og en booking som starter dårlig. Den underliggende feilen er ikke menneskelig — det er informasjon som ikke har flyttet seg automatisk. Det er nettopp den informasjonsflyten realtime-varslene er bygget for.\n\n## Tre lag av varsler, hvert med sitt formål\n\nDigilist sender varsler på tre forskjellige nivåer, og det er forskjellen mellom et bookingsystem som forsto driftshverdagen og et som fortalte saksbehandleren at hun fikk en e-post.\n\n### Innbyggervarsler\n\nNår en booking bekreftes, sendes:\n\n- **E-post-bekreftelse** med all info, kalenderfil, adresse, og bookingens unike kode for digital nøkkel.\n- **SMS-påminnelse** 24 timer før (kommunen velger om dette er aktivt).\n- **Push-varsel** dersom innbyggeren har Digilist-appen installert.\n\nVed endringer i bookingen — flytting, kansellering, anlegget blir blokkert av kommunen — får innbyggeren samme informasjon på samme tre kanaler. Hun trenger aldri å sjekke om noe har endret seg.\n\n### Driftsrollevarsler\n\nNår en booking bekreftes for et anlegg, sender Digilist automatisk pushvarsler til driftsrollene som er koblet til dette anlegget:\n\n- **Vaktmester:** «Booking 14:00–17:00 på Gymsalen Storsalen. Krever oppvarming, AV-utstyr, stoler oppstilt 50 personer.»\n- **Renhold:** «Etter-rengjøring 17:00, før neste booking 18:30.»\n- **Vekter:** «Booking forlater kl 17:30. Lås opp 13:45, lås ned 18:00.»\n\nHvert varsel inneholder konkrete oppgaver — ikke bare «det er en booking». Driftsrollen kan kvittere fra varselet («Bekreftet, jeg kommer») uten å åpne appen. Kvitteringen logges i bookingens audit-spor og er synlig for kulturkonsulenten.\n\n### Saksbehandlervarsler\n\nSaksbehandleren får varsel om hendelser som krever menneskelig vurdering, ikke om hver booking. Eksempler:\n\n- **Søknad om sesongleie utenfor regler** — krever skjønn.\n- **Refusjonsforespørsel** — krever vurdering av betingelser.\n- **Konfliktdeteksjon** — to søkere har søkt overlappende tid og automatreglene kan ikke avgjøre prioritet.\n\nSaksbehandlervarslene har konfigurerbar batching: en saksbehandler kan velge å få dem som live-pushvarsler, daglig sammendrag, eller bare når de logger inn. Standard er sammendrag, fordi 1 200 bookinger i måneden krever fokus.\n\n## Det vanskelige: transaksjonell garanti\n\nEt varselsystem som «som regel sender varsler» er verdiløst. Et som garanterer levering er forskjellen mellom et profesjonelt og et amatøraktig system. Digilist bruker et **outbox-mønster**: varselet skrives i samme transaksjon som mutasjonen som utløste det.\n\nKonkret:\n\n1. Booking bekreftes → DB-mutasjon.\n2. Varselposten skrives til `outboxEvents`-tabellen i samme transaksjon.\n3. Enten lagres _begge_ deler, eller _ingen_ av dem. Aldri en booking uten varsel.\n\nEn cron-jobb scanner outbox-tabellen og distribuerer varslene til abonnentene med backoff (30s → 60s → 120s → cap 5min). Hvis en mottaker er nede, holdes varselet i køen til det leveres. Etter tre forsøk uten lykke flyttes det til en `dead-letter`-kø som varsler kommunens driftsansvarlige.\n\nResultatet: ingen «event missed»-feil. Hvis en booking lagres, blir varslene levert — kanskje senere enn ønsket, men de blir levert, og det er etterprøvbart at de ble det.\n\n## Hvor varsler ikke kommer fra Digilist\n\nDet er fristende å tro at et bookingsystem skal håndtere _all_ kommunikasjon. Det er feil. Digilist sender varsler om:\n\n- Bookingstatus (bekreftet, kansellert, flyttet)\n- Driftsoppgaver knyttet til konkrete bookinger\n- Saksbehandling som krever menneskelig vurdering\n- Betalingsstatus og refusjoner\n\nDigilist sender _ikke_:\n\n- Markedsføring eller nyhetsbrev (det tilhører kommunens egen kanal)\n- Innbyggerundersøkelser (Kommunens egen plattform)\n- Generelle servicemeldinger (kommunens innbyggerportal)\n\nÅ holde varselkanalen smal og funksjonell øker leveringspresisjonen. Innbyggere som vet at en Digilist-melding alltid handler om en faktisk booking åpner dem alltid. Det er den motsatte effekten av en kanal som blir overbelastet med ukjent informasjon — der menneskene begynner å filtrere bort _alt_.\n\n## Hva kommunen kan rapportere\n\nHver varsel er en datapunkt. Kommunen kan rapportere:\n\n- Hvor lang tid det går fra booking-bekreftelse til at vaktmesteren kvitterer\n- Hvilke anlegg har høyest «ikke møtt»-rate hos driftsroller\n- Hvilke bookinger blir oftest endret etter første bekreftelse\n- Hvilken kanal (push / e-post / SMS) har høyest åpningsrate per persona\n\nDette er ikke surveillance — det er driftsforbedring. Hvis et bestemt anlegg konsekvent har sen kvittering fra vaktmesteren, er det et signal om at driftsoppgaven er feilformulert, ikke at vaktmesteren er treg.\n\n';
const __vite_glob_0_20 = '---\nslug: saksbehandler-godkjenne-avvise-kommunisere\ntitle: "Saksbehandler — godkjenne, avvise og kommunisere på minutter"\ndescription: "Innboks for forespørsler, regelbasert auto-godkjenning, samtaletråd per booking, og fullt revisjons­spor. Slik fungerer saks­behandlings­flyten i praksis."\ndate: 2026-05-27\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Saksbehandler"\ncover: "/images/blog/booking_calendar_hero_no.webp"\nkeywords: ["saksbehandler", "godkjenning", "avvise booking", "kommunikasjon", "innboks", "kommunal booking"]\n---\n\nFor en saksbehandler er hverdagen ofte ikke selve bookingene — den er e-postene rundt dem. «Er hallen ledig torsdag?» «Vi trenger to ekstra timer.» «Kan vi flytte til mandag?» Hver tråd starter et nytt sted. Det finnes ingen samlet logg. Og halv­parten av forespørslene burde aldri ha krevd manuell behandling.\n\nDigilist starter fra motsatt ende: alt som kan automatiseres, gjør plattformen. Det som krever vurdering, lander i én innboks med konteksten allerede vedlagt.\n\n## Innboksen — én oversikt, prioriterte forespørsler\n\nSaks­behandleren har én side: «Forespørsler». Den viser:\n\n- Bookinger som venter på godkjenning (sortert eldst først, eller etter risiko)\n- Endrings­forespørsler på allerede god­kjente bookinger\n- Avlysninger fra leietaker (krever refusjons­vurdering)\n- Sesongleie-søknader (separat fane med større kontekst)\n\nHver rad viser kunden, lokalet, datoen, type forespørsel, og hvor lenge den har ventet. Klikk åpner detalj­vinduet med full kontekst — kundens historie, betalings­status, eventuell samtale­tråd, og kalender­innsikt («tre andre bookinger samme dag»).\n\n## Tre handlinger — godkjenn, avvis, spør\n\n**Godkjenn.** Ett klikk. Plattformen sender bekreftelse til leietaker, blokkerer tiden i kalenderen, varsler driftsroller (vaktmester, renhold, vekter), og oppretter fakturagrunnlag hvis betaling kreves. Du kan legge til en kort melding til kunden hvis du vil — ellers brukes standard­bekreftelsen.\n\n**Avvis.** Velg en grunn fra listen (kollisjon, manglende dokumentasjon, utenfor åpningstid, annen årsak). Skriv inn forklaring. Plattformen sender en høflig avslags-e-post med din begrunnelse og — viktig — en lenke til alternative ledige tider hvis kunden vil prøve igjen.\n\n**Spør.** Trenger du mer informasjon? Send en melding direkte til kunden via book­ingens samtaletråd. Kunden får varsel på e-post og SMS, svarer fra sin Min Side, og hele samtalen ligger lagret på forespørselen. Ingen e-post­kjede å holde styr på.\n\n## Regelbasert auto-godkjenning\n\nMye av godkjennings­arbeidet er repetitivt. Et bryllup i et selskaps­lokale, fra en familie som har booket før, med fullført betaling, på en ledig dato — det burde aldri lande i en innboks.\n\nI Digilist setter du opp regler per utleieobjekt:\n\n- **Privat­person + betaling fullført + ingen kollisjon** → auto-godkjenn\n- **Organisasjon med BRREG-verifikasjon + medlems­tall over X** → auto-godkjenn\n- **Sport­slag som har sesongleie­avtale** → auto-godkjenn for tider innenfor avtalen\n- **Alt annet** → manuell godkjenning\n\nVi har sett kommuner gå fra 90% manuell behandling til 20% etter to ukers regel­tilpasning. De resterende 20% er de som faktisk trenger vurdering.\n\n## Kommunikasjon — samtaletråd per booking\n\nHver booking har sin egen samtaletråd som inkluderer:\n\n- Innledende forespørsel og dine spørsmål\n- Status­endringer (godkjent, avvist, endret)\n- Endringer på pris eller dato\n- Meldinger frem og tilbake mellom deg og kunden\n\nKunden ser den samme tråden i sin Min Side. Det er ingen «innboks» i klassisk forstand — kommunikasjonen lever der bookingen er. Når bookingen avsluttes, arkiveres tråden sammen med den.\n\n## Sesongleie — egen fane, større beslutninger\n\nSesong­leie er en annen disiplin enn vanlig book­ing. Du behandler ikke én forespørsel, du fordeler tider mellom mange søkere etter regler kommunen har bestemt. Digilist har en egen sesongleie-modul med:\n\n- Søknads­frist­håndtering\n- BRREG-verifisering av lag og foreninger\n- Regel­basert fordeling (prioritet, alder, type aktivitet)\n- Konflikt­varsling når to lag søker samme tid\n- Endelig publisering av fordeling, eksport til kalender\n\nDetaljene er for store til denne artikkelen. [Sesongleie og fordeling for lag og foreninger](/blogg/sesongleie-fordeling-lag-foreninger) går grundigere inn på det.\n\n## Revisjon — alt loggføres\n\nHver handling — godkjenning, avvisning, melding, endring — loggføres med tidsstempel, saks­behandler, og endring. Logg­føringen er uredigerbar og dekker SSA-L-kravene om sporbarhet. Hvis kommunen blir spurt om hvordan en booking ble behandlet et halvt år senere, er svaret tilgjengelig på fem sekunder.\n\n## Hva det betyr i praksis\n\nFor Nordre Follo kommune — som behandler ca. 1 200 book­inger i måneden på tvers av 12 anlegg — har overgangen til Digilist redusert manuell saks­behandling med 60% og responstid på forespørsler fra dager til timer. Det er ikke fordi vi har gjort book­inger mindre kompliserte. Det er fordi vi har plassert kompliserten der den faktisk er.\n\n';
const __vite_glob_0_21 = '---\nslug: sanntidskalender-kommunal-booking\ntitle: "Sanntidskalender: hvorfor «oppdateres hver natt» ikke holder mål"\ndescription: "Innbyggere som ser feil opptatt-tider og dobbeltbookinger er symptomer på én rot. Hvorfor reaktiv sanntid er en forutsetning, ikke luksus."\ndate: 2026-05-18\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sanntid"\ncover: "/images/blog/sanntidskalender_hero_no.webp"\nkeywords: ["sanntidskalender", "reaktiv runtime", "Convex", "dobbeltbooking", "kommunal booking"]\n---\n\nFor en kommune som leier ut lokaler er kalenderen ikke et grensesnitt — den er kontrakten. Når en innbygger ser at en idrettshall er ledig torsdag klokken 18, og deretter blir avvist av saksbehandleren fordi noen andre booket samme tid for ti minutter siden, er det tilliten til hele tjenesten som forsvinner. Det er nettopp denne tillitsbristen sanntidskalenderen er bygget for å forhindre.\n\n## Polling er ikke sanntid\n\nDet vanligste tegnet på et bookingsystem fra forrige tiår er en setning som lyder: «kalenderen oppdateres hver natt». Det betyr at brukerens kalender og databasens kalender går ut av sync så snart noen booker, og at synkroniseringen først hentes inn neste morgen. Mellom 18:00 og 06:00 viser systemet en versjon av virkeligheten som ikke lenger eksisterer.\n\nPolling — at klienten spør serveren hver 30. sekund — er bedre, men ikke godt nok. Det skaper to nye problemer: ekstra serverbelastning (1 200 innbyggere som åpner kalenderen samtidig = 2 400 spørringer i minuttet), og en latens som i praksis er den korteste forskjellen mellom «ledig» og «opptatt» — den 29. sekunden brukeren venter.\n\n## Hva «reaktiv» betyr i praksis\n\nDigilist er bygget på [Convex](https://www.convex.dev/) — en reaktiv runtime der hver spørring _abonnerer_ på dataen den hentet. Når en booking opprettes, varsles alle åpne kalendere automatisk og oppdateres umiddelbart hos hver bruker. Det er fundamentalt forskjellig fra polling: serveren _dytter_ endringen, klienten trenger ikke å spørre.\n\nKonsekvensene:\n\n- **Ingen dobbeltbookinger.** Når to brukere prøver å booke samme slot innenfor samme sekund, mister én av dem løpet — og den andre ser slot-en bli rød med en gang.\n- **Saksbehandlere ser endringer umiddelbart.** Kulturkonsulenten som behandler søknader om sesongleie ser at en søker har trukket søknaden uten å måtte trykke refresh.\n- **Driftsroller varsles automatisk.** Når en booking bekreftes, sendes pushvarsel til vaktmesteren — i samme reaktive flyt, ikke gjennom en cron som kjører hvert femte minutt.\n\n## En liten teknisk detalj med stor konsekvens\n\nReaktiv runtime betyr at hver mutasjon er transaksjonell på databasenivå _og_ utløser eventer som distribueres til abonnenter atomisk. Det vil si: enten lagres bookingen _og_ varslene sendes, eller ingen av delene skjer. Du får aldri en situasjon der bookingen er lagret men vaktmesteren ikke ble varslet — den klassiske «event missed»-feilen som koster kommunen tre telefoner på en lørdag.\n\nFor revisjonsformål er dette også en gevinst: hver hendelse i Digilist har samme tidsstempel som mutasjonen som utløste den. Det gjør at en kommunal IT-revisjon kan rekonstruere _hva som ble booket, av hvem, og hva som ble varslet til hvem_ med millisekundpresisjon.\n\n## Hvordan det føles for innbyggeren\n\nEn innbygger som åpner Digilist torsdag kveld for å booke en kantine til lørdag ser kalenderen som den faktisk er — inkludert at noen andre nettopp har booket en kolliderende tid og at hennes valg ble grå mens hun skrev inn navnet. Hun trenger ikke å skylde på «trege kommunale systemer» eller spørre om saksbehandleren kan sjekke manuelt. Hun ser virkeligheten, og virkeligheten avgjør hvilket valg som er mulig.\n\nDet er ikke en feature å skryte av. Det er hvordan kalendere _bør_ fungere — og det er den standarden norske kommuner fortjener.\n\n';
const __vite_glob_0_22 = '---\nslug: sesongleie-fordeling-lag-foreninger\ntitle: "Sesongleie: Slik fordeler du kommunale lokaler rettferdig"\ndescription: "Sesongleie er kommunens største bookingoppgave og kilden til flest klager. Slik håndterer Digilist regelstyrt fordeling og saksbehandling."\ndate: 2026-05-12\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "Sesongleie"\ncover: "/images/blog/sesongleie_hero_no.webp"\nkeywords: ["sesongleie", "lag og foreninger", "fordeling", "kommunal booking", "idrettshall"]\n---\n\nHvert år, før hver sesong, gjentar samme scenario seg i hundrevis av norske kommuner: en kulturkonsulent eller idrettskonsulent setter seg ned med regneark, søknadsbunker og en kalender, og prøver å fordele hallflater, gymsaler og fotballbaner rettferdig mellom 50–500 lag og foreninger. Resultatet — uansett hvor mye tid som brukes — er ofte klager, omkamper og «hvorfor fikk de bedre tid enn oss».\n\nSesongleie er kommunens største og mest tidkrevende bookingoppgave. Det er også den hvor digital støtte gir størst gevinst.\n\n## Hva gjør sesongleie så vanskelig?\n\nTre ting:\n\n1. **Mange søkere, knapp kapasitet.** En typisk kommunal idrettshall har 25–30 tilgjengelige timer per uke i ettermiddagsbruk. Kommunen kan ha 40+ lag som vil ha tid der.\n2. **Prioriteringsregler varierer.** Barn først, lokale foreninger først, etablerte klubber først, betalende organisasjoner sist — eller en blanding. Reglene endrer seg fra kommune til kommune og av og til år til år.\n3. **Forventninger om åpenhet.** Lag og foreninger forventer å forstå _hvorfor_ de fikk eller ikke fikk en tid. Manuell tildeling gir sjelden tilfredsstillende svar.\n\n## Regelstyrt fordeling — ikke automatisering, men assistanse\n\nDigilists tilnærming er ikke å automatisere bort saksbehandleren — det er å gi henne et verktøy som tar 80 % av jobben på under et minutt, og lar henne fokusere på de 20 % som krever skjønn.\n\nSlik fungerer det:\n\n### 1. Søknadsportal med BRREG-verifisering\n\nLag og foreninger søker via en egen portal. Organisasjonen verifiseres mot Brønnøysundregisteret automatisk — kommunen vet at det er en reell juridisk enhet. Antall medlemmer, aldersfordeling og aktivitetstype legges inn i søknaden.\n\n### 2. Regler kodet av kommunen\n\nSaksbehandleren konfigurerer kommunens prioriteringsregler én gang:\n\n- Barn (under 19 år) prioriteres over voksne\n- Lokale lag (registrert i kommunen) prioriteres\n- Lag med fast leie i forrige sesong får forrang\n- Større lag prioriteres på primetime, mindre lag på off-peak\n- Kommunale aktiviteter (kulturskole, idrettsråd) får forhåndsreservert tid\n\nReglene kan vektes og justeres per anlegg.\n\n### 3. Regelstyrt fordelingsforslag\n\nNår søknadsfristen passerer, genererer Digilist et fordelingsforslag basert på reglene. Forslaget viser hvilket lag som får hvilken tid, og _hvorfor_ — hvilken regel som var avgjørende. Saksbehandleren ser hele bildet på én skjerm.\n\n### 4. Saksbehandler justerer\n\nForslaget er aldri ferdig. Saksbehandleren kan:\n\n- Bytte tider mellom to lag\n- Reservere ekstra kapasitet for kulturarrangementer\n- Markere unntak (f.eks. et lokalt lag som har vokst hurtig og fortjener mer tid)\n- Avslå søknader med begrunnelse\n\nHver endring loggføres i revisjonsloggen — kommunens etterprøvbarhet er ivaretatt.\n\n### 5. Godkjenning og varsling\n\nNår fordelingen er godkjent, sendes automatisk varsel til alle søkere — både de som fikk tid og de som ble avslått. Begrunnelsen inkluderes. Lagene får direkte tilgang til kalenderen sin for sesongen.\n\n## Rapportering\n\nEtter at sesongen er i gang, gir Digilist:\n\n- **Kapasitetsutnyttelse per anlegg** — hvor godt utnyttes hver hall?\n- **No-show-rapport** — hvilke lag møter ikke til reservert tid?\n- **Tilskuddsrapportering** — automatisk grunnlag for kommunens tilskuddsregnskap\n- **Trendanalyse** — hvilke aldersgrupper og aktivitetstyper vokser?\n\n## Nordre Follo kommune: et eksempel\n\nNordre Follo kommune håndterer sesongleie for tolv anlegg og ca. 340 lag og foreninger via Digilist. Saksbehandlerens jobb er endret fra «to ukers tildelingsarbeid med åtte revisjoner» til «justering og godkjenning på en arbeidsdag».\n\n## Hva med klager?\n\nNår begrunnelsene er åpne og reglene synlige, går klagevolumet typisk ned med 60–80 %. De klagene som kommer, dreier seg om reglene selv — som er en politisk diskusjon, ikke en saksbehandlingsfeil.\n\nDet er den riktige diskusjonen å ha.\n\n---\n\nVil dere se hvordan sesongleie ser ut i praksis? [Be om en demo](/#kontakt).\n';
const __vite_glob_0_23 = '---\nslug: somlos-betaling-vipps-ehf\ntitle: "Sømløs betaling: Vipps, kort, EHF — sammenheng slår valg"\ndescription: "En kommune med fire betalingsmåter, men uten avstemming, har bare fire kanaler å feilsøke. Slik kobler Digilist betaling sammen ende til ende."\ndate: 2026-05-19\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Betaling"\ncover: "/images/blog/somlos_betaling_hero_no.webp"\nkeywords: ["Vipps", "Stripe Connect", "EHF", "Peppol", "kommunal fakturering", "regnskap"]\n---\n\nDet er enkelt å implementere Vipps. Det er enkelt å implementere kortbetaling. Det er enkelt å implementere EHF. Det vanskelige — og det som skiller en moderne kommunal bookingplattform fra en samling betalingsskjemaer — er å gjøre dem til _én sammenhengende strøm_ fra forespørsel til kommunens regnskap. Det er der Digilist har lagt arbeidet.\n\n## Betalingsmetodene innbyggere faktisk bruker\n\nNorske innbyggere booker kommunale tjenester med tre dominerende betalingsformer, og forventer at alle tre er tilgjengelige uten å snakke med et servicetorg:\n\n1. **Vipps** — det selvsagte førstevalget for privatbookinger under 5 000 kr. Lav friksjon, høy konvertering. Digilist tilbyr både Vipps Hurtigkasse (mobil) og Vipps på Nett (desktop).\n2. **Kortbetaling via Stripe Connect** — for større beløp, kommersielle bookinger, eller når innbyggeren ikke har Vipps. Tre stegs verifisering for kommunale betalinger.\n3. **EHF / Peppol-faktura** — for organisasjoner, lag og foreninger. Faktura sendes direkte til regnskapssystemet deres via Peppol-nettverket. Ingen PDF, ingen manuell registrering.\n\nI tillegg kommer **depositum** (forhåndsbetaling som låses og frigis ved arrangementets slutt), og **delbetaling** (depositum + restbeløp ved bekreftelse) — det handler ikke om _en_ betaling, men om _kontraktsformen_ kommunen ønsker.\n\n## Det vanskelige: avstemming\n\nEn enkeltbooking er trivielt: innbygger trykker «Bekreft», Vipps sender 800 kr, kommunen mottar pengene. Problemet starter på dag 30, når kommunens regnskapsfører skal avstemme bankkontoen mot bookingbasen mot kassekladden mot fakturasystemet. Hver kanal har:\n\n- Egne transaksjons-ID-er\n- Egne avregningstidspunkter (Vipps neste virkedag, Stripe T+2, EHF betinget av kundens betalingsfrist)\n- Egne gebyrer som må trekkes fra brutto\n\nUten automatisk avstemming kjøres dette manuelt med Excel og fire datakilder. Det er der dobbeltarbeid og menneskelige feil oppstår — ikke ved kassen.\n\n## Hvordan Digilist løser det\n\nHver betaling registreres som en linje i en intern **ledger** med følgende felter: booking-ID, betalingskanal, brutto, gebyr, netto, avregningsdato, status (pending / settled / refunded), og — kritisk — _hvor mye som skal til hvilken konto_. Når en kommune har splittet leieinntekt mellom kulturetaten og driftsetaten, splittes betalingen automatisk.\n\nHver natt sammenligner avstemmingsjobben:\n\n1. Ledger-poster med status `settled`\n2. Bankposteringer fra kommunens kontoutskrift (åpnet via [Tripletex](https://www.tripletex.no/), [Visma](https://www.visma.no/eaccounting/), [PowerOffice](https://www.poweroffice.com/), [Fiken](https://fiken.no/) eller [DNB Regnskap](https://www.dnb.no/bedrift/regnskap-og-okonomi.html))\n3. Forventet sum per kanal\n\nAvvik flagges med presis kilde — «Vipps 14.03.2026 manglet 12,50 kr i gebyrtrekk» — slik at regnskapsføreren ikke trenger å lete, bare bekrefte.\n\n## EHF som forsiktig undervurdert vinner\n\nEHF (Elektronisk Handelsformat) er Norges versjon av Peppol — det europeiske nettverket for offentlig fakturering. For en bookingplattform betyr det at en faktura til en idrettsklubb _aldri_ trenger å bli en PDF i en e-post som klubbens kasserer må videresende til regnskapsbyrået. Den lander direkte i klubbens regnskapssystem.\n\nFor kommunen betyr det:\n\n- **Lavere fakturafeil.** Standardisert XML, ikke fritekst-PDF.\n- **Raskere betaling.** Klubbenes systemer kan auto-bokføre.\n- **Revisjonssikker leveranse.** Bekreftelse på at fakturaen ble levert, datert og signert.\n\nNorske kommuner er etter offentleglova og bokføringsloven forpliktet til å kunne sende _og_ motta EHF. Det er enkelt å tro at man oppfyller dette ved å «kunne eksportere en PDF», men det er ikke det loven sier.\n\n## Sømløsheten er ikke ett produkt — den er en standard\n\nDet er fristende å markedsføre «vi støtter Vipps, kort og EHF» som tre adskilte features. Det er feil måte å snakke om det. Den sømløse betalingen er at:\n\n- Innbyggeren ikke trenger å vite hvilken kanal hun bruker.\n- Saksbehandleren ikke trenger å sjekke om betalingen kom inn.\n- Regnskapsføreren ikke trenger å avstemme manuelt.\n- Revisor kan rekonstruere hvilken booking som ble betalt av hvem og når på under et minutt.\n\nDet er fire ulike personer som aldri trenger å snakke med hverandre om en enkelt booking. _Det_ er sømløs betaling.\n\n';
const __vite_glob_0_24 = `---
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

Norske kommuner som anskaffer bookingsystem i 2026 møter et tydeligere kravbilde enn noen gang. SSA-L 2026 — Statens Standardavtale for løsninger — kombinert med digitaliseringsdirektoratets (Digdir) føringer for offentlige tjenester, definerer en høy bunnplanke: sanntidstilgjengelighet, ID-porten-autentisering, EHF-fakturering, universell utforming og ISO 27001-sertifisering er ikke lenger «nice to have», men forutsetninger for å delta i konkurransen.

## Sanntidstilgjengelighet — fundament, ikke funksjon

Sanntid er det første kravet enhver kommunal innbygger merker. Når en innbygger søker etter ledig treningstid i en idrettshall, må kalenderen vise det som er ledig _nå_, ikke en versjon fra siste nattlige synkronisering. Tre underkrav følger:

1. **Reaktive oppdateringer.** Når en booking bekreftes eller avlyses, oppdateres kalenderen umiddelbart for alle andre brukere. Ingen polling, ingen refresh-knapper.
2. **Konfliktdeteksjon.** Plattformen må forhindre dobbeltbookinger på samme tidsrom, også når to brukere booker samtidig.
3. **Reservasjon under booking.** Tid skal låses mens brukeren fyller ut betalingsskjema — typisk 5–10 minutter — for å unngå at vinduet forsvinner mens kortet legges inn.

For Digilist løses dette med Convex' reaktive runtime: spørringer abonnerer på underliggende data og publiserer endringer på millisekunder.

## Sesongleie med regelstyrt fordeling

Idrettslag, kulturskoler og foreninger leier kommunale lokaler i sesonger — typisk høst (sept–des) og vår (jan–juni). Manuell tildeling er tidkrevende og opplever ofte klager om favorisering.

SSA-L 2026 krever derfor:

- Egen søknadsportal for lag og foreninger (BRREG-verifisert)
- Regelstyrt fordelingsforslag basert på kommunens prioriteringsregler
- Saksbehandlerverktøy for justering før godkjenning
- Rapportering på kapasitetsutnyttelse, tilskudd og fordeling

Digilists sesongleie-modul implementerer alle disse kravene, og lar saksbehandleren overprøve forslaget der lokale forhold krever det.

## ID-porten + BankID — Norge-tilpasset autentisering

Innbyggere skal logge inn via ID-porten med BankID, MinID eller andre godkjente metoder. Organisasjoner skal verifiseres mot Brønnøysundregisteret (BRREG). Dette er ikke valgfritt — det er en del av SSA-Ls krav om sikker autentisering og datakvalitet.

For utenlandske SaaS-leverandører er dette en betydelig integrasjonskostnad. For Digilist, bygget på norsk grunn, er det første integrasjon vi etablerte.

## EHF-fakturering og regnskapsintegrasjon

Faktura til kommunale enheter må sendes via EHF (Elektronisk Handelsformat) over Peppol-nettverket. Digilist genererer EHF-faktura automatisk ved bookingfullføring og kan integreres direkte mot kommunens regnskapssystem — Visma eAccounting, Tripletex, Fiken, PowerOffice eller DNB Regnskap.

## Universell utforming, ISO og GDPR

- **WCAG 2.0 AA** er minimumskravet. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy.
- **ISO 27001 og 27701** er forventet sertifisering. Digilist er sertifisert.
- **GDPR** krever databehandleravtale, dataregister og rett til sletting. Digilist har dette på plass og lagrer all data i Norge og EU.

## Migrasjon — det glemte kravet

Mange kommuner har eksisterende bookingsystemer (RCO, Aktimo, Idrettens Bookingsystem osv.) med historiske bookinger og sesongleieavtaler. SSA-L 2026 krever at den nye leverandøren støtter migrasjon — ikke bare frisk start.

Digilist tilbyr import fra RCO booking og andre systemer i etableringsfasen, med valideringsregler for foreningsregister og bookinghistorikk.

## Hva kommunen bør gjøre nå

1. **Kartlegg eksisterende anlegg og brukergrupper** — antall, type, kapasitet, sesongmønster
2. **Definer prioriteringsregler for sesongleie** — alder, lokal tilknytning, foreningstype
3. **Be om demo med fokus på SSA-L-kravene** — ikke generelle salgspresentasjoner
4. **Test sanntid live** — be leverandøren vise hvordan en booking forplanter seg gjennom systemet i sanntid

For en kompakt sjekkliste mot SSA-L 2026-kravene, se vår [landingsside for kommuner](/bookingsystem-kommune).
`;
const __vite_glob_0_25 = '---\nslug: tilgjengelighetskalender-innbygger\ntitle: "Tilgjengelighet på første blikk — innbyggerens kalender"\ndescription: "En kalender som krever forklaring har feilet. Slik viser Digilist ledig, opptatt og blokkert tid på en måte enhver innbygger forstår uten hjelp."\ndate: 2026-05-23\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "UX"\ncover: "/images/blog/availability_calendar_hero_no.webp"\nkeywords: ["tilgjengelighetskalender", "kommunal booking", "innbygger UX", "kalender design", "ledige tider"]\n---\n\nNår en innbygger åpner kommunens bookingside er det første hun ser et signal om hele tjenestens kvalitet. Hvis hun må klikke fem ganger for å finne ut at gymsalen er ledig torsdag klokken 18 — eller verre, må gjette hva en gråskala-rute betyr — har tjenesten allerede tapt en mulig booking. Tilgjengelighetskalenderen er kommunens første tillitstest.\n\n## Tre tilstander, tre farger, ingen mer\n\nHver tidsblokk i Digilists kalender har én av tre tilstander:\n\n- **Ledig (grønn).** Kan bookes umiddelbart. Innbygger klikker, fyller ut skjemaet, betaler. Ferdig.\n- **Opptatt (grå).** Allerede booket. Vises ikke som «privat» eller med booker-navn — bare som ikke-tilgjengelig.\n- **Blokkert (oransje).** Anlegget er stengt for vedlikehold, høytid eller administrativ blokkering. Hover-tekst forklarer hvorfor.\n\nDet er bevisst at vi ikke har «søkt om», «under behandling» eller «foreløpig reservert» som synlige statuser for innbyggeren. Hun trenger å vite om hun kan _booke nå_ — ikke om hvem som har søkt før henne. Den informasjonen tilhører saksbehandleren.\n\n## Hvorfor «opptatt» er nok informasjon\n\nI tjuetalls kommunale bookingsystemer har vi sett samme feil: at kalenderen viser «Opptatt av Korps Vest 16:00–18:00». Det er et personvernsbrudd som er enkelt å overse — booker-navnet er personopplysning hvis booker er privat, og selv organisasjonsnavn røper hvilke anlegg laget bruker når. For en innbygger som leter etter ledig tid har informasjonen heller ingen verdi. Hun trenger å vite om tiden er bookbar, ikke hvem som har den.\n\nDigilist viser kun «Opptatt» — uten å avsløre _hvem_. Saksbehandleren ser navnet i sitt eget grensesnitt; innbyggeren ser bare den fargen som svarer på spørsmålet hennes.\n\n## Tidsperspektiv: dag, uke, måned — innbyggerens valg\n\nEn innbygger som booker en konferanseside trenger ofte _samme dag_. En som planlegger en bursdag trenger _lørdager_ tre måneder fremover. Bookingsystemer som tvinger én visning på alle er for stive. Digilist tilbyr fire perspektiver:\n\n1. **Dagsvisning** — én dag, time for time. Standard for spontane bookinger.\n2. **Ukesvisning** — syv dager i timer. Standard for arrangementer på dagen eller helg.\n3. **Månedsvisning** — full måned med fargekodede dager (mye/middels/lite ledig). Standard for planlegging fremover.\n4. **Periodefilter** — «vis kun lørdager i mars og april med minst 8 timer ledig». For brukere som vet hva de leter etter.\n\nVisningen huskes per bruker (lagres i `localStorage` på enheten, ikke i kontoen), så hun slipper å gjenta valget hver gang hun returnerer.\n\n## Søk som forstår intensjon\n\n«Søk» er ikke «autocomplete på lokalnavn». Innbyggerne søker med ord som matcher intensjonen, ikke kategorien:\n\n- «bursdagslokale for 30 personer» → matcher selskapslokaler, kantiner og storsaler med kapasitet ≥ 30\n- «musikkøving» → matcher gymsaler med scene, samfunnshus med musikkanlegg, og dedikerte øvingslokaler\n- «møterom torsdag morgen» → matcher møterom med ledig tid torsdag kl 08–12\n\nSøket bygger på listings-katalogens metadata (kapasitet, fasiliteter, taggene saksbehandleren har lagt på lokalet), kombinert med kalenderen i sanntid. Resultatene rangeres etter relevans og tilgjengelighet — ikke etter alfabet.\n\n## Sanntid, ikke daglig\n\nTilgjengelighetskalenderen abonnerer på databasen via [Convex\' reaktive runtime](/blogg/sanntidskalender-kommunal-booking). Når en kollega-innbygger bekrefter en booking, blir slot-en grå hos alle andre _samme sekund_. Det er forskjellen mellom å booke trygt og å booke fortvilet.\n\n## Hva tilgjengelighetskalenderen _ikke_ er\n\nDet er ikke et administrativt verktøy. Den er ikke en saksbehandlerkø. Den er ikke en finansiell rapport. Den er det første grensesnittet en kommunal innbygger møter, og dens jobb er å fortelle sannheten på under fem sekunder. Hvis den greier det, ringer hun ikke kommunens servicetorg — hun booker. Hvis ikke, ringer hun, og kommunens digitale tjeneste har akkurat skapt det manuelle arbeidet den var ment å eliminere.\n\n';
const __vite_glob_0_26 = '---\nslug: universell-utforming-wcag-kommunal-booking\ntitle: "Universell utforming: WCAG 2.1 AA er minimumskravet"\ndescription: "Diskrimineringsloven § 17a gjør universell utforming pliktig for kommunale digitale tjenester. Slik bygger Digilist for revisjon og reell tilgjengelighet."\ndate: 2026-05-15\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 8\ntag: "Universell utforming"\ncover: "/images/blog/accessibility_hero_no.webp"\nkeywords: ["universell utforming", "WCAG 2.1 AA", "tilgjengelighet", "Digdir", "Likestillings- og diskrimineringsloven"]\n---\n\nEt bookingsystem som ikke kan brukes av en blind innbygger med skjermleser, en bevegelseshemmet bruker som kun bruker tastatur, eller en eldre saksbehandler med redusert syn, er ikke et kommunalt bookingsystem. Det er en barriere mellom kommunen og innbyggerne den er satt til å tjene. Likestillings- og diskrimineringsloven § 17a sier det mer presist: digitale tjenester rettet mot allmennheten _skal_ være universelt utformet. Det er ikke en oppfordring — det er en plikt.\n\n## Hva loven faktisk krever\n\nNorge stiller seg bak [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/) gjennom forskrift om universell utforming av IKT, forvaltet av [Tilsynet for universell utforming av ikt](https://www.uutilsynet.no/) under Digdir. For et kommunalt bookingsystem betyr det konkret:\n\n- **Visuell tilgjengelighet:** Kontrast på minst 4,5:1 for vanlig tekst, 3:1 for stor tekst og UI-komponenter. Ingen informasjon kommunisert kun med farge.\n- **Operasjonell tilgjengelighet:** Alt skal kunne betjenes med tastatur alene. Synlig fokusring på hver interaksjon. Forutsigbar rekkefølge.\n- **Forståelig:** Skjermleserkompatible labels, ARIA-merking der det trengs, klart språk. Feilmeldinger som forklarer _hva som gikk galt_ og _hva som skal gjøres_.\n- **Robust:** Strukturert HTML som assistive teknologier kan tolke uten å gjette. Ingen «klikkbare div-er».\n\nI tillegg krever forskriften en **publisert tilgjengelighetserklæring** for hver kommunal tjeneste, og krav om at brudd kan rapporteres direkte til Tilsynet.\n\n## Hvordan vi tester før hver utgivelse\n\nDet er én ting å si at man «oppfyller WCAG». Det er en annen ting å vite det. Digilists testpyramide for tilgjengelighet ser slik ut:\n\n### 1. Automatisert (axe-core) — kjøres ved hver bygg\n\nHver gang en utvikler pusher kode, kjøres [axe-core](https://github.com/dequelabs/axe-core) mot alle hovedsidene. Det fanger rundt 50 % av WCAG-brudd: manglende `alt`, manglende `label`, kontrast under terskel, manglende `lang`, brutte ARIA-relasjoner. Builden feiler om axe-core finner _én_ alvorlig overtredelse på en kjernesti.\n\n### 2. Manuell tastaturnavigasjon — kjøres ukentlig\n\nEt team-medlem går gjennom hovedflyten — `Tab` fra start til slutt på booking-skjemaet, sesongleie-søknad, betaling, kanselleringsflyt — uten å røre musen. Alle interaksjoner skal være tilgjengelige, fokusrekkefølgen logisk, og fokusringen synlig.\n\n### 3. Skjermleser — NVDA på Windows, VoiceOver på Mac\n\nTo kjernescenarioer testes med skjermleser før hver større utgivelse: innbyggerbooking via ID-porten, og saksbehandlerens godkjenningsflyt. Tester kontrollerer at navn, formål og status på hver kontrolltype leses opp riktig. Modaler og varsler skal fange fokus og annonseres umiddelbart.\n\n### 4. Tredjepart — årlig audit\n\nÉn gang i året ber vi en uavhengig tilgjengelighetstester gå gjennom plattformen med utgangspunkt i [WCAG Evaluation Methodology (WCAG-EM)](https://www.w3.org/TR/WCAG-EM/). Funnene blir prioritert i sprintkalenderen og lukket før neste audit. Rapportene utleveres til kunder under NDA.\n\n## Hva kommunen får dokumentert\n\nEn kommune som anskaffer Digilist får, som del av leveransen:\n\n- **Tilgjengelighetserklæring** etter Digdirs mal, klar til publisering på kommunens nettsider.\n- **Sertifiseringsrapporter** fra axe-core (automatisert) og siste tredjepartsaudit.\n- **Beskrivelse av kjente begrensninger** — det finnes nesten alltid noe, og det er bedre at det er åpent dokumentert enn skjult.\n- **Tilsynsrespons-prosedyre** — hvordan kommunen håndterer en brukerklage som videresendes til Tilsynet.\n\n## Tre vanlige misforståelser\n\n**«Vi støtter mørk modus, så vi er tilgjengelige.»**\nMørk modus hjelper noen brukere med lyssensitivitet, men WCAG snakker om _kontrast_, ikke _tema_. En lysegrå tekst på hvit bakgrunn er like utilgjengelig som lysegrå tekst på svart.\n\n**«Skjermleseren leser det jo opp.»**\nSkjermleseren leser det den ser. Den ser strukturen i HTML-en, ikke det visuelle. En `<div>` som ser ut som en knapp, men ikke har `role="button"` eller `tabindex`, er usynlig for assistive teknologier.\n\n**«Vi har en alt-tekst på hvert bilde.»**\nBra start, men ikke alt. En alt-tekst på en _dekorativ_ illustrasjon (som denne artikkelens hero) skal være tom (`alt=""`) eller bildet skal være `aria-hidden`. Ellers leses dekorasjon høyt som «bilde av kontor» mens innholdet pauser.\n\n## Den mest underestimerte gevinsten\n\nTilgjengelighet er ikke bare en plikt — det er ofte den raskeste veien til _bedre_ design. En knapp som er stor nok for en bruker med skjelvende hender, er også behagelig for en travel kommuneansatt med kaffekoppen i den ene hånden. En feilmelding som er presis nok for en skjermleser, er også presis nok for en innbygger som ikke har norsk som førstespråk. En tastaturnavigering som fungerer for en bruker med motoriske utfordringer, er også raskere for en saksbehandler som behandler 40 søknader i timen.\n\nUniversell utforming er ikke et tak. Det er gulvet — og det er gulvet enhver kommune fortjener.\n\n';
const __vite_glob_0_27 = '---\nslug: utleieobjekt-veiviser-steg-for-steg\ntitle: "Nytt utleieobjekt — Digilist-veiviseren steg for steg"\ndescription: "Seks steg, hjelpetekst i hvert felt, lagring underveis. Publisert på under tjue minutter — og du kan endre alt etter publisering."\ndate: 2026-05-26\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 7\ntag: "Utleier"\ncover: "/images/blog/wizard_utleieobjekt_hero.svg"\nkeywords: ["utleieobjekt", "veiviser", "wizard", "publisere lokale", "Digilist utleier", "booking onboarding"]\n---\n\nDet skal være enkelt å legge et lokale ut for utleie. Ikke en time med faner og lagrings­dialoger — en stille veiviser som spør om de tingene som faktisk betyr noe, gir hjelpetekst der det trengs, og lagrer underveis så du kan komme tilbake. Slik er Digilists veiviser bygd.\n\nResultatet: et nytt selskaps­lokale, møterom eller idretts­hall publisert på under tjue minutter, og du eier alt — endrer pris, åpningstider eller bilder når du vil etterpå.\n\n## Hva veiviseren spør om — seks steg\n\n**Steg I — Type og navn.** Hva er det? Et selskaps­lokale, møterom, hall, kantine, kontor, scene. Velg fra listen, gi det et navn slik leietakere vil søke etter det. Adresse fylles automatisk fra postnummer.\n\n**Steg II — Beskrivelse og bilder.** Korte avsnitt om hva lokalet egner seg til. Last opp bilder — tre minimum, helst seks til ti. Digilist gjør smart komprimering, men beholder skarpheten på storbilde­visningen.\n\n**Steg III — Kapasitet og fasiliteter.** Antall personer (sittende / stående), kvadrat­meter, og avhuking av fasiliteter (wifi, kjøkken, prosjektor, lyd­anlegg, parkering, garderober). Det innbyggeren ser når de søker filtrert.\n\n**Steg IV — Pris og tilgjengelighet.** Time­pris, dag­pris eller pakke. Åpnings­tider per ukedag. Min/maks book­bare timer. Forhånds­varsel — hvor lenge før kan man booke? Digilist har fornuftige standard­verdier; du justerer der det avviker.\n\n**Steg V — Bookingregler.** Krever bookingen godkjenning fra en saks­behandler, eller går den rett gjennom hvis kalenderen er ledig og betalingen er gjennom­ført? Hvilke kunde­typer kan booke (privat­personer, organisasjoner, kun BRREG-verifiserte lag)? Hvilken kanselleringspolicy?\n\n**Steg VI — Publiser.** Forhånds­visning av hele oppslaget slik innbyggeren vil se det. Knappen «Publiser» tar deg live. Knappen «Lagre som utkast» beholder alt usynlig — fortsett senere.\n\n## Det vi har bygd inn for at det skal være enkelt\n\n**Hjelpetekst i hvert felt.** Ingen ekstern dokumentasjon å lese. Hver labelinngang har en kort forklaring under, og noen har eksempler.\n\n**Validering der det betyr noe.** Du kan ikke publisere et lokale uten navn, beskrivelse, minst ett bilde, og en pris. Du kan publisere uten en lang feature­liste — fyll den ut senere.\n\n**Auto-lagring.** Hvert klikk på «Neste» lagrer det du har skrevet. Nettleseren krasjer? Logg inn igjen, fortsett der du slapp.\n\n**Maler.** Har du flere lignende lokaler? Bruk et eksisterende som mal. Veiviseren forhånds­utfyller alt unntatt navn og bilder.\n\n## Etter publisering — alt er redigerbart\n\nIngenting er låst. Endre pris, åpnings­tider, beskrivelse, bilder eller bookingregler når som helst. Digilist viser de nye reglene fra det tidspunktet de er lagret. Eksisterende bookinger fra før endringen påvirkes ikke.\n\nFor utleiere med mange enheter kan du administrere flere lokaler fra ett dashbord, kopiere prisstrukturer mellom dem, og se hvordan hvert lokale presterer separat.\n\n## Hva neste steg pleier å være\n\nDe fleste utleiere bruker første dagen til å publisere ett eller to lokaler, ser hvordan de ser ut for innbyggeren, og justerer formuleringer eller bilder. Andre dagen legges resten ut. Tredje dagen kommer den første reelle bookingen.\n\nDet er den hastigheten plattformen er bygd for — fra signering til levende oppføring i løpet av en arbeidsdag, uten konsulent.\n\n';
const __vite_glob_0_28 = '---\nslug: bookingsystem-kommune-sammenligning-pris\ntitle: "Hva koster et bookingsystem for kommunen din — egentlig?"\ndescription: "IT-ledere i kommuner betaler ofte mer enn nødvendig for bookingsystemer. Her er hva du faktisk bør sammenligne — og hva du bør spørre om."\ndate: 2026-07-08\nauthor: "Ibrahim Rahmani"\nrole: "Grunnlegger, Digilist"\nreadingMinutes: 6\ntag: "IT-leder"\ncover: "/images/blog/en_plattform_hero_no.webp"\nkeywords: ["bookingsystem kommune", "bookingsoftware sammenligning", "pris bookingløsning", "kommunalt bookingsystem", "leverandørvalg IT", "GDPR bookingsystem", "Digilist pris"]\n---\n\nÅ velge bookingsystem for kommunen er sjelden en enkel oppgave. Du skal veie pris mot funksjonalitet, vurdere integrasjoner, ta hensyn til GDPR — og helst unngå å låse kommunen til en leverandør det er dyrt å komme seg ut av igjen.\n\nProblemet er at prissammenligninger sjelden er reelle. Det oppgitte lisensprisen er bare starten.\n\n## Hva kommuner faktisk betaler\n\nEn gjennomgang av offentlige anskaffelsesdokumenter viser at mange kommuner ender opp med å betale to til tre ganger mer enn den oppgitte lisensavgiften når alle kostnadene regnes med. Her er hva som typisk inngår:\n\n### Lisensavgift\nDet er det du ser i tilbudet. Kan være per bruker, per lokale, per modul eller en flat avgift. Per-bruker-modeller høres rimelige ut til å begynne med, men skalerer fort oppover når administrasjonen, driftspersonell, lag og foreninger alle skal ha tilgang.\n\n### Oppsett og implementering\nMange leverandører tar mellom 20 000 og 80 000 kroner for å sette opp systemet. Dette inkluderer gjerne import av eksisterende data, konfigurasjon av lokaler og tidsrom, og opplæring av administratorer. Noen kaller det "onboarding-pakke", andre fakturerer det per time.\n\n### Integrasjoner\nSkal bookingsystemet kommunisere med kommunens saksbehandlingsverktøy, faktureringssystem eller ID-porten? Da kommer integrasjonskostnader i tillegg. Disse kan være alt fra en engangssum på 15 000 kroner til løpende vedlikeholdsavgifter.\n\n### Brukerstøtte\nEn del leverandører inkluderer kun e-postsupport i basisprisen. Ønsker du telefonsupport, prioritert responstid eller en dedikert kontaktperson, koster det ekstra — gjerne som en separat supportavtale.\n\n## Skjulte kostnader du bør kjenne til\n\nNår kommunen Lillestrøm i 2023 evaluerte sitt eksisterende bookingsystem, fant de at den reelle årskostnaden var 40 prosent høyere enn lisensavgiften alene — primært fordi tilleggsmoduler for fakturering og rapportering ikke var inkludert i basisprisen.\n\nDette er ikke uvanlig. Her er de vanligste skjulte kostnadene:\n\n**Tilleggsmoduler.** Basisversjonen dekker gjerne enkel booking. Vil du ha fakturering, venteliste, statistikkuttak eller selvbetjeningsportal for lag og foreninger, kjøper du det som separate moduler.\n\n**Prisøkninger ved fornyelse.** En del leverandører tilbyr lav inngangspris det første året, for så å øke prisene med 15–25 prosent ved kontraktsfornyelse. Sjekk alltid hva som gjelder etter år én.\n\n**Eksportkostnader.** Noen leverandører gjør det kostbart å hente ut egne data. Enten teknisk komplisert eller direkte priset. Det binder deg til leverandøren.\n\n**Opplæring ved nyansettelser.** Hvis onboarding av nye ansatte krever kurs eller konsulentbistand fra leverandøren, er det en løpende kostnad som ikke alltid synliggjøres i tilbudet.\n\n## Digilists prismodell\n\nDigilist er bygget for norske kommuner og bruker en flat månedspris uten per-bruker-kostnader. Det betyr at du kan gi tilgang til alle som trenger det — saksbehandlere, driftspersonell, frivillige i lag og foreninger — uten at regningen øker.\n\nInkludert i prisen:\n- Booking og administrasjon av lokaler\n- Selvbetjeningsportal for innbyggere og lag\n- Faktureringsintegrasjon\n- Norsk support på telefon og e-post\n- Drift på norske servere\n\nDet er ingen separate moduler for kjernefunksjonalitet. Det du trenger for å drifte bookingløsningen i en norsk kommune, er inkludert fra dag én.\n\n## Sammenligning: To konkrete eksempler\n\n### Kommune A: Tre idrettshaller\n\nEn mellomstor kommune med tre idrettshaller og rundt 40 aktive lag som booker ukentlig. Behov: booking, fakturering til lag, statistikk over belegg.\n\nMed en per-bruker-modell fra en større leverandør: Lisens for 5 administratorer + tilleggsmodul for fakturering + oppsett = anslagsvis 85 000–110 000 kroner per år.\n\nMed Digilist: Flat månedspris, alt inkludert, norsk support = vesentlig lavere totalsum uten at funksjonaliteten mangler.\n\n### Kommune B: Ti kommunale lokaler\n\nEn større kommune med ti lokaler — haller, møterom, kulturhus og uteområder. Mange ulike brukergrupper og behov for integrasjon med eksisterende faktureringssystem.\n\nHer er integrasjonskostnader og modulkostnader de store variablene. Med en leverandør som priser integrasjoner separat kan dette fort bli 30 000–50 000 kroner ekstra. Digilist inkluderer standardintegrasjoner og har åpne API-er for egne tilpasninger.\n\n## Kriterier som bør veie tungt\n\nPris er viktig, men det er ikke det eneste som bør telle. Her er tre kriterier som ofte undervurderes:\n\n### Integrasjon med eksisterende systemer\nBookingsystemet lever ikke isolert. Det skal helst kommunisere med kommunens økonomi- og faktureringssystem, og i mange tilfeller med ID-porten for innlogging. Spør konkret: hvilke integrasjoner er ferdig bygget, og hva koster nye?\n\n### GDPR og datalokasjon\nKommuner behandler personopplysninger om innbyggere. Dataene skal lagres i henhold til norsk og europeisk lovgivning. Spør leverandøren: hvor ligger dataene dine fysisk, og hvem har tilgang til dem? Mange større internasjonale plattformer lagrer data utenfor EØS — det kan skape problemer.\n\nDigilist drifter på norske servere og er bygget for å oppfylle kommunens GDPR-forpliktelser.\n\n### Oppetid og driftsgaranti\nBooking av kommunale lokaler skjer gjerne i rushtider — søndager, kveldsøkter, når sesongen starter. Da er det kritisk at systemet er oppe. Spør om SLA (servicenivåavtale) og historisk oppetid. 99,5 prosent høres mye ut, men det tilsvarer over 40 timer nedetid per år.\n\n## Slik velger du uten å låse deg inne\n\nDet største risikoelementet ved valg av bookingsystem er ikke prisen — det er bindingstiden og vanskelighetsgraden ved å bytte. Her er spørsmålene du bør stille enhver leverandør:\n\n1. **Hva er oppsigelsestiden, og hva skjer med dataene mine etter oppsigelse?**\n2. **Kan jeg eksportere alle data i et standardformat (CSV, JSON)?**\n3. **Hvem eier dataene — kommunen eller leverandøren?**\n4. **Hva koster det å øke antall lokaler eller brukergrupper?**\n5. **Er det bindingstid utover den løpende kontraktsperioden?**\n6. **Hva er prosessen hvis jeg vil integrere et nytt system fremover?**\n\nEn leverandør som nøler med å svare på disse spørsmålene, er et rødt flagg.\n\n## Ikke betal mer enn du må\n\nMange kommuner har et bookingsystem som fungerer — men betaler for mye fordi de ikke har sett på alternativene på noen år. Markedet har endret seg. Det finnes løsninger som er enklere å implementere, billigere å drifte, og som ikke låser deg inne.\n\nDigilist er bygget spesifikt for norske kommuner. Vi kjenner kravene til integrasjon, GDPR og innbyggeropplevelse — og vi priser løsningen slik at den faktisk gir mening i en kommunal kontekst.\n\n---\n\n**Book en demo og få en konkret prisberegning for din kommune.** Vi går gjennom antall lokaler, brukergrupper og integrasjonsbehov — og gir deg et tall du kan legge inn i budsjettet. Ingen forpliktelse, ingen salgspress.\n\n[Book demo →](https://digilist.no/demo)\n';
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
  "/src/content/blog/booking-paa-90-sekunder-innbygger.md": __vite_glob_0_1,
  "/src/content/blog/bookingkalender-for-innbygger-og-saksbehandler.md": __vite_glob_0_2,
  "/src/content/blog/cyberangrep-norske-kommuner-bookingsystem.md": __vite_glob_0_3,
  "/src/content/blog/ddos-ransomware-beredskap-bookingplattform.md": __vite_glob_0_4,
  "/src/content/blog/digdir-designsystemet-kommunal-bookingplattform.md": __vite_glob_0_5,
  "/src/content/blog/digilist-mobil-app.md": __vite_glob_0_6,
  "/src/content/blog/en-plattform-mot-fem-verktoy.md": __vite_glob_0_7,
  "/src/content/blog/faktura-refusjon-avstemming.md": __vite_glob_0_8,
  "/src/content/blog/foresporsel-chat-kommunikasjon.md": __vite_glob_0_9,
  "/src/content/blog/gdpr-iso-datalokasjon-norge.md": __vite_glob_0_10,
  "/src/content/blog/hvorfor-digital-booking-2026.md": __vite_glob_0_11,
  "/src/content/blog/idporten-bankid-kommunal-innlogging.md": __vite_glob_0_12,
  "/src/content/blog/idrettshall-booking-for-lag-og-foreninger.md": __vite_glob_0_13,
  "/src/content/blog/magic-link-sms-bankid-sikker-innlogging.md": __vite_glob_0_14,
  "/src/content/blog/min-side-alle-bookinger-paa-ett-sted.md": __vite_glob_0_15,
  "/src/content/blog/onboarding-uke-til-live.md": __vite_glob_0_16,
  "/src/content/blog/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor.md": __vite_glob_0_17,
  "/src/content/blog/phishing-resistente-innlogginger-idporten-bankid.md": __vite_glob_0_18,
  "/src/content/blog/realtime-varsler-driftsroller.md": __vite_glob_0_19,
  "/src/content/blog/saksbehandler-godkjenne-avvise-kommunisere.md": __vite_glob_0_20,
  "/src/content/blog/sanntidskalender-kommunal-booking.md": __vite_glob_0_21,
  "/src/content/blog/sesongleie-fordeling-lag-foreninger.md": __vite_glob_0_22,
  "/src/content/blog/somlos-betaling-vipps-ehf.md": __vite_glob_0_23,
  "/src/content/blog/ssa-l-2026-bookingsystem-kommune.md": __vite_glob_0_24,
  "/src/content/blog/tilgjengelighetskalender-innbygger.md": __vite_glob_0_25,
  "/src/content/blog/universell-utforming-wcag-kommunal-booking.md": __vite_glob_0_26,
  "/src/content/blog/utleieobjekt-veiviser-steg-for-steg.md": __vite_glob_0_27,
  "/src/content/blog/valg-av-bookingsystem-og-leverand-r.md": __vite_glob_0_28
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
        a: "Digilist er en norsk digital plattform for utleie og booking av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie, fakturering og rapportering i én løsning — bygget for både private utleiere og norske kommuner.",
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
        a: "Digilist er bygget for norske krav fra grunnen — Vipps, BankID, ID-porten, EHF/Peppol, BRREG og Digdir Designsystemet er innebygd. Én plattform håndterer både privat utleie og kommunal drift. Convex' reaktive runtime gir sanntid uten polling, og all data lagres i Norge og EU.",
        keywords: ["differensiering", "konkurrenter", "fordeler"]
      }
    ]
  },
  {
    id: "funksjonalitet",
    label: "Funksjonalitet",
    description: "Hva plattformen kan gjøre — fra booking og betaling til sesongleie og rapportering.",
    questions: [
      {
        q: "Hvilke betalingsmetoder støtter Digilist?",
        a: "Digilist støtter Vipps (mobil + web), kortbetaling via Stripe Connect (Express), depositum, fakturering og EHF/Peppol for offentlig fakturering. Refusjonsregler kan tilpasses per anlegg og brukergruppe.",
        keywords: ["betaling", "vipps", "stripe", "ehf"]
      },
      {
        q: "Støtter Digilist sanntidstilgjengelighet?",
        a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart for alle brukere — drevet av Convex' reaktive runtime, ingen polling eller refresh nødvendig.",
        keywords: ["sanntid", "kalender", "real-time"]
      },
      {
        q: "Hvordan håndteres sesongleie for lag og foreninger?",
        a: "Digilist har en egen sesongleie-modul med søknadsportal for lag og foreninger, BRREG-verifisering av organisasjoner, regelstyrt fordelingsforslag basert på kommunens prioriteringsregler, saksbehandlerverktøy for justering og automatisk varsling. Tilskudd og kapasitetsutnyttelse rapporteres automatisk.",
        keywords: ["sesongleie", "lag", "foreninger", "fordeling"]
      },
      {
        q: "Hva er forskjellen på auto-godkjenning og manuell godkjenning?",
        a: "Auto-godkjenning bekrefter bookinger umiddelbart basert på regler (lave verdier, korte bookinger, verifiserte brukere). Manuell godkjenning sender bookinger til saksbehandler-kø for kontroll. Begge moduser kan kombineres — auto for hovedtidsperiode, manuell for unntak.",
        keywords: ["godkjenning", "automatisk", "manuell"]
      },
      {
        q: "Støtter Digilist digital nøkkel og adgangskontroll?",
        a: "Ja. Salto KS digital nøkkel er integrert. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt. Vaktmestere og driftsroller varsles automatisk om aktive bookinger.",
        keywords: ["digital nøkkel", "salto", "adgang"]
      },
      {
        q: "Hvordan varsles vaktmestere og driftspersonell?",
        a: "Når en booking bekreftes, sendes automatiske varsler til vaktmester, renholdspersonell, vekter og andre relevante driftsroller — via e-post, SMS eller varsler i Digilist-appen. Varslene tilpasses per anlegg.",
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
        a: "Hver mutasjon i systemet — bookinger, godkjenninger, endringer, slettinger, brukerhandlinger — registreres med tidsstempel, brukerident og endringsdetaljer. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.",
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
  { id: "sec-funksjonalitet", kind: "section", title: "Funksjonalitet", subtitle: "Slik fungerer Digilist — fire steg", href: "#funksjonalitet", isAnchor: true, keywords: ["howitworks", "steg", "flyt"] },
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
  { id: "a-chatbot", kind: "action", title: "Snakk med oss", subtitle: "Åpne chat — svar på under et minutt", href: "#chat", action: "open-chatbot", keywords: ["chat", "spørsmål", "kontakt"] }
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
                "aria-label": "Digilist — forsiden",
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
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 flex items-center gap-4 lg:gap-6", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/",
              "aria-label": "Digilist — gå til forsiden",
              className: "group inline-flex items-center gap-3 shrink-0",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "/logo.svg",
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
              src: "/logo.svg",
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
                fetchPriority: "high",
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
                children: "Lier Bygdetun — Festsalen"
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
    /* @__PURE__ */ jsx("p", { className: "mt-3 editorial-mono-caption", children: "Fig. I — Plattformen, listingvisning · app.digilist.no" })
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
            children: "Lier Bygdetun — Festsalen"
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
        /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 pt-4 lg:pt-6 pb-20 lg:pb-28", children: /* @__PURE__ */ jsxs(
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
                          "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering —",
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
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12 lg:py-14", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-6 mb-10", children: [
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption", children: "Kunder · I bruk" }),
                /* @__PURE__ */ jsx("span", { className: "editorial-mono-caption text-ink-faint hidden md:inline", children: "To av flere — referanser på forespørsel" })
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
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12 lg:py-14", children: [
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
  return /* @__PURE__ */ jsx("section", { id: "verdi", className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "I. PLATTFORMEN" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", children: "Fire prinsipper." }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Hvorfor velge Digilist? — fire grunner som gjelder uansett størrelse, fra ett lokale til en hel kommune."
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
          /* @__PURE__ */ jsx(DropCap, { children: "Digilist er bygd for norske utleiere — fra eieren av et selskapslokale med bookinger til kommunale fritidsetater med tolv anlegg. Den samme plattformen håndterer privatbookinger, sesongleie til lag og foreninger, sambruk mellom avdelinger og offentlige bookinger med kommunal innbyggerautentisering via ID-porten." }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-relaxed", children: "Betaling tas direkte via Vipps eller kort med øyeblikkelig kvittering. Driftsroller — vaktmestere, renholdspersonell, vektere — varsles automatisk når en booking bekreftes. Faktura og bilag genereres til ditt regnskapssystem (Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol)." }),
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
              children: "Hverdagshistorier fra norske utleiere. Bookinger, automatisering og regnskap — sammenhengende."
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
                  body: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("p", { children: "Kulturkonsulenten håndterer sesongleie til lag og foreninger, privatbookinger og sambruk mellom kantiner og møterom. Driftsroller — vaktmestere, renhold, vektere — varsles automatisk ved bookingbekreftelse. Tilskudd til lag og foreninger fordeles via sesongleie-modulen." }) }),
                  quote: {
                    text: "Vi har samlet tolv anlegg, hundrevis av foreninger og kommunal fakturering i én plattform — og innbyggerne booker via ID-porten.",
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
        /* @__PURE__ */ jsx("p", { className: "mt-12 editorial-mono-caption text-center", children: "Flere referanser tilgjengelig på forespørsel — kontakt salg for kunde- og nøkkeltallreferanser." })
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
                children: "Tre artikler om kommunal booking, sesongleie og samsvar — skrevet for saksbehandlere, kulturkonsulenter og digitaliseringsledere."
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
                                loading: i === 0 ? "eager" : "lazy",
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
    description: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller — vaktmester, renhold, vekter — varsles automatisk."
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
              children: "Fra forespørsel til oppgjør — én sammenhengende prosess."
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
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
              children: "Betaling, autentisering, regnskap og samsvar — bygget for norske utleiere fra første dag."
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
    tagline: "Bygget for norske krav — ISO-sertifisert, GDPR-kompatibel, WCAG-testet og pentestet årlig.",
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
    body: "Helsesjekker hvert 30. sekund. Avvik som overskrider terskel sender automatisk varsel til vakt — på SMS, e-post og dashbord. Statusside oppdateres uten manuell innsats.",
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
    body: "Bygget for norsk forvaltning — ID-porten, Altinn, EHF, BRREG og SSA-L 2026-kontraktsmal.",
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
  return /* @__PURE__ */ jsx("section", { id: "teknologi", className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
                    "for innbyggertilgang — valg som holder gjennom drift, revisjon og kontrakt."
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
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft measure leading-relaxed", children: "Plattformen oppfyller norsk og europeisk regelverk for offentlig sektor — universell utforming, informasjonssikkerhet, personvern og digital forvaltning. Hver kategori er dokumentert og kan etterprøves i tilbudsfasen." }) })
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
  sub: "Reaktiv runtime — sanntid uten polling",
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
  return /* @__PURE__ */ jsx("section", { id: "arkitektur", className: "py-16 lg:py-24 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx(SectionRule, { label: "VII. ARKITEKTUR" }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-16", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsx(EditorialHeading, { as: "h2", size: "section", children: "Schema." }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex items-end", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-xl text-ink-soft italic",
          style: { fontVariationSettings: getFraunces("sub") },
          children: "Tre klienter mot én reaktiv runtime — med transaksjonell hendelsesbus og fullstendig revisjon."
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
        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "FIG. II — Systemarkitektur (forenklet)" }),
        /* @__PURE__ */ jsx("span", { className: "text-ink-faint", children: "3 KLIENTER · 1 RUNTIME · 4 TJENESTER" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 lg:mt-16 grid lg:grid-cols-3 gap-6 lg:gap-8", children: [
      /* @__PURE__ */ jsxs(Sidenote, { marker: 1, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Convex" }),
        " ",
        "er en reaktiv runtime: spørringer abonnerer på data og oppdateres umiddelbart når underliggende tabeller endres — uten polling, uten refresh."
      ] }),
      /* @__PURE__ */ jsxs(Sidenote, { marker: 2, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Outbox-bussen" }),
        " ",
        "sikrer transaksjonell publisering: hendelsen lagres i samme transaksjon som mutasjonen, og distribueres deretter til abonnenter med backoff og dead-letter."
      ] }),
      /* @__PURE__ */ jsxs(Sidenote, { marker: 3, children: [
        /* @__PURE__ */ jsx("strong", { className: "font-serif italic text-ink not-italic", children: "Revisjonsloggen" }),
        " ",
        "registrerer hver mutasjon — booking, godkjenning, prisendring, sletting — med tidsstempel, brukerident og endringsdetaljer. Uforanderlig og eksporterbar."
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
    body: "Xala Technologies starter arbeidet med Digilist — én plattform for det norske utleiemarkedet."
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
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir-designsystemet er innebygd — ikke bolt-on på en amerikansk SaaS."
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
    body: "Booking, betaling, sesongleie, fakturering, regnskap og rapportering i én plattform — ikke fem integrerte verktøy."
  }
];
const AboutUsSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "om-oss", className: "py-16 lg:py-24 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
          /* @__PURE__ */ jsx(DropCap, { children: "Digilist er en SaaS-plattform for det norske utleiemarkedet, utviklet av Xala Technologies AS. Plattformen samler booking, betaling, kalender, rapportering og integrasjoner mot offentlige tjenester i én løsning — bygd for både private utleiere, kulturhus, foreninger og kommuner." }),
          /* @__PURE__ */ jsxs("p", { children: [
            "Vi tror norske utleiere fortjener verktøy som passer det norske landskapet: Vipps og BankID til betaling og autentisering, EHF og Peppol til fakturering, ID-porten til innbyggerautentisering, ISO 27001 og GDPR til samsvar.",
            " ",
            /* @__PURE__ */ jsx(
              "em",
              {
                className: "italic",
                style: { fontVariationSettings: '"opsz" 16, "wght" 420, "SOFT" 60' },
                children: "Ikke amerikansk SaaS oversatt til bokmål"
              }
            ),
            " ",
            "— men en plattform bygd fra grunnen for norske krav."
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
  "Spørsmål og svar — vi pakker ikke inn standarddemoen vår",
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
        summary: `Demo-forespørsel — ${form.organization} (${roleLabel})`,
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
          children: "Vi pakker ikke inn en standarddemo. Fortell oss kort hva dere driver med — så viser vi delene som faktisk angår dere."
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
              "— vi svarer i chat på under et minutt i kontortid."
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
          children: "Takk — vi tar kontakt."
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-lg text-ink-soft measure mx-auto leading-relaxed mb-8", children: [
        "Forespørselen er sendt til",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: "admin@digilist.no" }),
        ". En av oss svarer innen 24 timer på hverdager — som regel raskere."
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
  return /* @__PURE__ */ jsx("section", { id: "kontakt", className: "relative py-14 lg:py-20 bg-accent-tinted", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
  const ColumnHeading = ({ children }) => /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-3 mb-6 editorial-mono-caption text-accent-text", children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "w-6 h-px bg-accent-text" }),
    children
  ] });
  return /* @__PURE__ */ jsx("footer", { className: "bg-paper-deep border-t border-hairline-strong", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16 lg:py-24", children: [
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
                  src: "/logo.svg",
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
            children: "Én plattform for norske kommuner og utleiere — booking, betaling, kalender og rapportering, sammenhengende."
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
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg text-ink-soft measure leading-relaxed", children: "Book en personlig demo, eller still spørsmål direkte i chat — vi svarer på under et minutt i kontortid." })
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
            answer: "Digilist brukes av norske kommuner og private utleiere — blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group."
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
          description: "Fra forespørsel til oppgjør på fire steg — gjennom Digilist-plattformen.",
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
              text: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller — vaktmester, renhold, vekter — varsles automatisk."
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
        title: "Book demo av Digilist — Norsk bookingplattform for kommuner og utleiere",
        description: "Be om en gratis 30–45 minutters demo av Digilist. Vi viser hvordan plattformen håndterer ditt bruksområde — kommune, selskapslokale, idrettsanlegg eller kulturhus.",
        canonical: "https://digilist.no/book-demo",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Book demo", url: "https://digilist.no/book-demo" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
    answer: "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler — idrettshaller, svømmehaller, møterom, kantiner og kulturhus — i sanntid. Plattformen håndterer kalender, godkjenning, betaling, sesongleie og fakturering."
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
        title: "Bookingsystem for kommuner — Digilist | SSA-L 2026 klar",
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
      /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
              "Sanntidskalender, sesongleie, ID-porten-innlogging, EHF-fakturering og automatisk driftsvarsling — i én plattform bygget for",
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
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
              children: "Hver SSA-L 2026-funksjon dekket fra dag én — ikke som tillegg."
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
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper-deep/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-accent-tinted", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
      /* @__PURE__ */ jsx("section", { className: "py-14 lg:py-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
    answer: "Booking av lokaler og møterom er den digitale prosessen der innbyggere, bedrifter, lag eller foreninger reserverer fysiske rom — selskapslokaler, møterom, idrettshaller, kantiner, kulturhus — for et bestemt tidsrom. En moderne plattform håndterer sanntidstilgjengelighet, betaling, kontrakt, varsling av driftsroller og fakturering i én sammenhengende flyt."
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
    answer: "Prisen avhenger av lokalet, varigheten, brukergruppen og kommunens regler. Lag og foreninger får ofte 30–100 % rabatt avhengig av kommunens prioriteringsregler. Selve plattformen er gratis å bruke for innbyggere — du betaler kun leieprisen til utleier."
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
    body: "Vipps, kort eller faktura — uten å forlate booking-skjemaet. EHF/Peppol til organisasjoner. Automatisk avstemming mot regnskapssystemet."
  },
  {
    Icon: Users,
    title: "Sesongleie og brukergrupper",
    body: "Lag og foreninger med BRREG-verifisering, regelstyrt fordeling, og dokumentert prioritering. Saksbehandler får forslag — beholder skjønnet."
  },
  {
    Icon: ShieldCheck,
    title: "Trygt og etterprøvbart",
    body: "ID-porten, ISO 27001 og 27701, GDPR, WCAG 2.1 AA, data i Norge og EU. Hver mutasjon revisjonsspores."
  },
  {
    Icon: Building2,
    title: "Bygget for norske krav",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir Designsystemet — innebygd. SSA-L 2026-klar for kommunale anskaffelser."
  },
  {
    Icon: Sparkles,
    title: "Én plattform, ingen siloer",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og driftsvarsling — én datakilde. Ingen dobbelinntastinger, ingen synkroniseringsfeil."
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
    body: "Kommunale møterom, næringsbygg, foreningslokaler — med sambruk og pris per brukergruppe.",
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
        title: "Booking av lokaler og møterom — Digilist | Norsk bookingplattform for kommuner og utleiere",
        description: "Booking av lokaler og møterom i Norge — sanntidskalender, Vipps, BankID, EHF og sesongleie. Bygget for kommuner, selskapslokaler, idrettshaller og kulturhus. SSA-L 2026-klar, ISO 27001-sertifisert.",
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
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
          "— én norsk plattform."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Digilist er en norsk bookingplattform for kommuner, selskapslokaler, idrettshaller, kulturhus og møterom. Søk, book og betal i én flyt — med Vipps, BankID, EHF og sesongleie innebygd." }),
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
          /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink leading-relaxed", children: "Få en gratis 30-minutters demo for kommunen eller utleier. Vi viser plattformen i ditt bruksområde — ingen forpliktelser." })
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
        title: "Blogg — Digilist | Innsikt om booking, sesongleie, samsvar og daglig drift",
        description: "Artikler fra Digilists arbeid med norske kommuner og utleiere — bookingflyt, saksbehandling, sesongleie, sikker innlogging, fakturering, SSA-L 2026, GDPR og ISO 27001.",
        canonical: "https://digilist.no/blogg",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Blogg", url: "https://digilist.no/blogg" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Artikler fra arbeid med norske kommuner og utleiere — fra veiviser og saksbehandling til sesongleie, sikker innlogging, fakturering og samsvar." })
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
                  placeholder: "Søk i artikler — SSA-L, sesongleie, GDPR …",
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
        title: "FAQ — Digilist | Vanlige spørsmål om kommunal booking, sesongleie og samsvar",
        description: "Svar på de vanligste spørsmålene om Digilist — bookingsystem for kommuner og utleiere. SSA-L 2026, GDPR, ISO 27001, Vipps, BankID, sesongleie og mer.",
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
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-xl text-ink-soft measure leading-relaxed", children: "Alt du trenger å vite om Digilist — fra SSA-L 2026 og GDPR til sesongleie, betaling og integrasjoner." })
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
        title: "Salgsvilkår — Digilist | Vilkår for bruk av bookingplattformen",
        description: "Salgs- og leveransevilkår for Digilist bookingplattform. SLA, oppsigelse, datalokasjon, databehandleravtale og kundens rettigheter.",
        canonical: "https://digilist.no/salgsvilkar",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Salgsvilkår", url: "https://digilist.no/salgsvilkar" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto prose prose-lg dark:prose-invert", children: [
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
        title: "Personvernerklæring — Digilist | GDPR, ISO 27701, data i Norge og EU",
        description: "Slik behandler Digilist personopplysninger. GDPR-kompatibel, ISO 27701-sertifisert, data lagret i Norge og EU. Innsyn, retting og sletting på forespørsel.",
        canonical: "https://digilist.no/personvern",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Personvern", url: "https://digilist.no/personvern" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
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
        title: "Cookies og informasjonskapsler — Digilist",
        description: "Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies — ingen sporing, ingen tredjepart, full GDPR-suverenitet.",
        canonical: "https://digilist.no/cookies",
        breadcrumbs: [
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Cookies", url: "https://digilist.no/cookies" }
        ]
      }
    ),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("section", { className: "pt-32 pb-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
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
        title: "404 — Siden ble ikke funnet | Digilist",
        description: "Vi fant ikke siden du leter etter. Gå til forsiden, blogg eller FAQ for å fortsette.",
        canonical: "https://digilist.no/404"
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 flex items-center pt-28 lg:pt-32 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
const POSTURE_LABEL = {
  iso27001: "ISO 27001:2022",
  soc2: "SOC 2",
  gdpr: "GDPR"
};
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
          "API svarte med " + (type || "ukjent type") + " — prøv å laste siden på nytt"
        );
      }
      return await r.json();
    }).then((d) => setData(d)).catch((e) => setError(e instanceof Error ? e.message : String(e))).finally(() => setLoading(false));
  }, []);
  const productionSurfaces = (data == null ? void 0 : data.surfaces.filter((s) => s.environment === "production")) ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-paper overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEO,
      {
        title: "Transparens — kvalitetsrapport for Digilist",
        description: "Live kvalitetsrapport: SEO, tilgjengelighet, sikkerhet, oppetid og lenker — automatisk skannet på tvers av Digilist-økosystemet.",
        canonical: "https://digilist.no/transparens"
      }
    ),
    /* @__PURE__ */ jsx(ProgressRail, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-28 lg:pt-32 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
          " kvalitet — SEO, tilgjengelighet, sikkerhet, oppetid og lenker — automatisk skannet og oppdatert."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-ink-soft measure", children: "Skanninger kjøres minst hver 15. minutt for oppetid og daglig for hele økosystemet. Det vi viser her er det samme som vårt interne team ser." }),
        /* @__PURE__ */ jsxs("p", { className: "mt-3 text-base text-ink-soft measure", children: [
          "Rapporten dekker fem områder. ",
          /* @__PURE__ */ jsx("strong", { children: "SEO" }),
          " måler hvor synlig plattformen er i søk — titler, metadata, canonical og strukturert data. ",
          /* @__PURE__ */ jsx("strong", { children: "Tilgjengelighet" }),
          " sjekker WCAG-samsvar: overskriftshierarki, alt-tekster, landemerker og tastaturnavigasjon for skjermlesere. ",
          /* @__PURE__ */ jsx("strong", { children: "Sikkerhet" }),
          " ",
          "vurderer HTTP-sikkerhetsheadere, TLS-sertifikater og at ingen sensitive filer er eksponert. ",
          /* @__PURE__ */ jsx("strong", { children: "Oppetid" }),
          " følger tilgjengelighet og responstid per tjeneste, med varsling ved avvik. ",
          /* @__PURE__ */ jsx("strong", { children: "Lenker" }),
          " verifiserer at ingen utgående lenker er brutt. Hver overflate i økosystemet — markedssiden, booking-appen, dashbordet, dokumentasjonen og API-et — skannes uavhengig, og tallene nedenfor er hentet direkte fra siste kjøring, uten manuell redigering eller utvalg."
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-ink-soft", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        "Henter live data…"
      ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "border-l-2 border-red-700 bg-paper-deep/60 px-5 py-4", children: [
        /* @__PURE__ */ jsx("p", { className: "editorial-mono-caption text-red-700 mb-1", children: "KUNNE IKKE HENTE LIVE DATA" }),
        /* @__PURE__ */ jsxs("p", { className: "text-base text-ink", children: [
          "Beklager — kommer tilbake snart. ",
          error
        ] })
      ] }) : data ? /* @__PURE__ */ jsxs(Fragment, { children: [
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
                  p.framework === "iso27001" && "Annex A — Organisatoriske, personell-, fysiske og teknologiske kontroller.",
                  p.framework === "soc2" && "Common Criteria — kontrollmiljø, risiko, tilgang og systemoperasjoner.",
                  p.framework === "gdpr" && "Kjerneartikler — personvern, lovlig grunnlag, sletting og brudd-håndtering."
                ] })
              ]
            },
            p.framework
          )) }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-ink-faint italic max-w-3xl", children: "Tallene viser implementeringsgrad — andelen anvendelige kontroller med dokumentert tilstand «Implementert» (full kreditt) eller «Delvis» (halv). Detaljer over hver kontroll er tilgjengelig på forespørsel for kommunale kunder under NDA." })
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
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "— utmerket" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-green-700", children: "85–94" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "— bra" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-amber-700", children: "70–84" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "— akseptabelt" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-amber-700", children: "50–69" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "— trenger forbedring" })
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-medium text-red-700", children: "0–49" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-ink-soft", children: "— kritisk" })
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
            /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft", children: "Vi kjører våre egne automatiske skanninger (oversikten over), men du bør ikke ta vårt ord for det. Sjekk digilist.no selv hos disse uavhengige sikkerhets- og kvalitetsmålerne — de gir sanntidsdom." })
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
              desc: "Core Web Vitals — LCP, CLS, INP. Mobile + desktop.",
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
          /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-faint mt-4 font-mono uppercase tracking-widest", children: "Live oppslag — Klikk en boks for å kjøre skanning hos tredjepart i sanntid." })
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
            /* @__PURE__ */ jsx("p", { className: "text-base lg:text-lg text-ink-soft leading-relaxed", children: "Vi deler gjerne sammendrag av siste penetrasjonstest og sårbarhetsstatus under NDA. Be om et møte — vi viser rapportene side-om-side med plattformen." })
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
            children: isNA ? "—" : value
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
        /* @__PURE__ */ jsx("span", { className: "font-serif text-5xl lg:text-6xl font-medium leading-none", children: s.overall ?? "—" }),
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
    /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsx("main", { id: "main", children: /* @__PURE__ */ jsx("article", { className: "pt-20 lg:pt-24 pb-16 lg:pb-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
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
          "— ",
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
            /* @__PURE__ */ jsx("p", { className: "text-base text-ink-soft leading-relaxed", children: "Book 30 minutter — vi viser plattformen med dine konkrete bookingscenarier. Ingen forpliktelser." })
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
      lead: "Eier du et selskapslokale, vet du at hver helg blir bestilt av folk som planlegger en stor dag. Det krever en bookingplattform som tar gjestene seriøst — med ledige helger i sanntid, juridisk leieavtale signert med BankID, depositum reservert via Vipps og dørtilgang når dagen kommer.",
      seoTitle: "Selskapslokaler: bookingsystem for bryllup og selskap — Digilist",
      seoDescription: "Bookingplattform for selskapslokaler: sanntidskalender, depositum via Vipps, BankID-signert leieavtale, digital nøkkel og automatisk faktura.",
      keywords: "selskapslokale, booking selskapslokale, leie selskapslokale, bryllupslokale booking, depositum Vipps, BankID leieavtale, digital nøkkel, jubileum",
      audience: [
        {
          persona: "Eiere av selskapslokaler",
          context: "Privatpersoner eller småbedrifter som leier ut én eller flere saler — gjerne i tilknytning til gård, museum, restaurant eller historisk eiendom."
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
          context: "Kommuner som leier ut storstuer, samfunnshus eller historiske selskapslokaler til innbyggere — som regel via egne avdelinger."
        },
        {
          persona: "Idrettslag og foreninger",
          context: "Klubbhus med selskapsareal, som leies ut for å støtte foreningsdriften — uten at det skal kreve ansatte for å håndtere."
        },
        {
          persona: "Borettslag og sameier",
          context: "Felleslokaler som beboere booker for selskap, fødselsdager og familieselskap — typisk med depositum og rengjøringsavtale."
        }
      ],
      problems: [
        "Telefon og e-post fylles opp av forespørsler om ledige helger — ingen sentral oversikt for utleier.",
        "Excel-regneark for booking gir dobbeltbookinger som først oppdages når to brudefølger møtes i samme sal.",
        "Depositum-håndtering er manuell: bankoverføring, kvittering, papirkontrakt, tilbakebetaling. Krever oppfølging i ukevis.",
        "Leieavtale signeres på papir eller PDF — vanskelig å arkivere, vanskelig å håndheve hvis ting skjer.",
        "Nøkkel må overleveres fysisk — eier blir bundet til faste klokkeslett for utlevering og innlevering."
      ],
      features: [
        {
          title: "Ledige helger i sanntid",
          body: "Innbygger ser ledige datoer øyeblikkelig. Reserverte og bekreftede bookinger låses i kalenderen så ingen kan booke samme tid."
        },
        {
          title: "Depositum via Vipps eller kort",
          body: "Beløpet reserveres ved booking, frigis automatisk etter bruk hvis ingenting er meldt — eller belastes ved skade etter eierens vurdering."
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
          body: "Rengjøring, dekorering, AV-utstyr, ekstra møblement — som pakkepris eller per stykk. Gjesten ser totalpris før hun signerer."
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
          body: "Bygdas kulturhus drives av frivillige. Storsalen leies ut til konfirmasjoner, jubileer og bygdefester. Vi har ingen ansatt som kan ta imot kontanter eller møte opp for nøkkelovertaking. Med Digilist går alt automatisk — leietaker booker, betaler depositum, signerer avtalen og får adgangskode. Vi får automatisk faktura ført direkte til regnskapet.",
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
          answer: "Du har 48 timer på å registrere skader via plattformen — med bilde og beskrivelse. Hele eller deler av depositumet kan brukes til dekning. Leietaker varsles automatisk og kan klage hvis uenig — saksbehandler avgjør tvist."
        },
        {
          question: "Kan flere personer i samme husholdning booke under samme konto?",
          answer: "Ja. Innbyggeren kan ha en personlig konto (logget inn med BankID) eller booke på vegne av en organisasjon (også med BankID). All historikk er knyttet til den juridiske parten som signerte leieavtalen."
        },
        {
          question: "Vi er en kommune. Kan vi bruke Digilist for selskapslokaler som tilhører kommunen?",
          answer: "Absolutt. Kommunale selskapslokaler kan administreres på lik linje med private — med ID-porten-pålogging, EHF-fakturering og kommunal driftsrolle-varsling. Se også /bookingsystem-kommune for SSA-L 2026-overflate."
        }
      ],
      relatedPosts: [
        {
          title: "Booking på 90 sekunder — for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger"
        },
        {
          title: "Sømløs betaling med Vipps og EHF",
          slug: "somlos-betaling-vipps-ehf"
        },
        {
          title: "Magic-link, SMS og BankID — sikker innlogging",
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
      lead: "Møterom er det mest brukte og oftest dobbeltbookede rommet i en organisasjon. Digilist gir deg én sanntidskalender for alle møterom, prising som vet om brukeren er ansatt, lag, forening eller innbygger — og automatiske varsler til vaktmester når et nytt møte skal arrangeres utenom åpningstid.",
      seoTitle: "Møterom: bookingsystem for kommuner og næringsbygg — Digilist",
      seoDescription: "Bookingsystem for kommunale møterom, næringsbygg og foreningslokaler. Sanntidskalender, sambruk, prising per brukergruppe og Outlook-integrasjon.",
      keywords: "møterom booking, kommunal møterom, næringsbygg møterom, Outlook integrasjon, sambruk møterom, prising per brukergruppe, foreningslokaler",
      audience: [
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Rådhus, sektorbygg og kulturhus med møterom som brukes av ansatte, politikere, lag og foreninger — og av og til innbyggere."
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
          context: "Klasserom og auditorier som brukes som møterom utenfor undervisningstid — med behov for sambruk uten konflikt."
        },
        {
          persona: "Helseforetak og kontorbygg",
          context: "Sykehus, kommunehelse og store kontorbygg som har dusinvis av møterom som må koordineres på tvers av avdelinger."
        }
      ],
      problems: [
        "Møterom står tomme fordi de er reservert i Outlook av noen som ikke møtte opp — ingen frigjøring, ingen sanksjon.",
        "Foreninger og innbyggere må sende e-post for å booke kommunale møterom — saksbehandlere bruker timer per uke på dette.",
        "Prising er kompleks: ansatte gratis, foreninger redusert, kommersielle full pris — men det blir aldri konsekvent håndhevet.",
        "Vaktmester får ikke beskjed når en booking er utenfor åpningstid — bruker må vente på inngangen til noen kommer.",
        "Møterom-data lever i 3-4 systemer (Outlook, Excel, kalenderapp, regneark for utleie til foreninger) — ingen kan svare på 'er det ledig på torsdag?'"
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
          body: "Møterom kan deles mellom avdelinger eller institusjoner med faste tidsblokk og prioriteringsregler — eller helt åpen sambruk hvor først-til-mølla gjelder."
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
          headline: "12 anlegg, én kalender — alle ser samme bilde",
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
          headline: "Møterom som tilleggstjeneste — uten manuell oppfølging",
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
          answer: "Kalenderen oppdateres med optimistisk lås — den første som klikker 'bekreft booking' vinner. Den andre ser umiddelbart at tiden er borte og må velge et annet rom eller tid. Ingen dobbeltbooking mulig."
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
          answer: "Ja. Foreningstilskudd er en egen prisregel — foreninger som er registrert hos kommunen kan booke utvalgte rom gratis innenfor et årlig tildelt antall timer. Plattformen holder regnskap."
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
      dek: "Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger. Privat trening, treningsturneringer og åpen hall — i samme kalender.",
      lead: "Idrettshaller er det mest komplekse å booke i en kommune. Du har lag som trenger fast tid hele sesongen, foreninger som vil leie inn fra utsiden, innbyggere som vil booke gymsal en lørdag — og halvhalls-bookinger som må kunne kombineres uten å låse motsatte halvdel. Digilist løser dette med sesongleie-modul, sambruk og automatisk fordeling.",
      seoTitle: "Idrettshall booking: bookingsystem for kommuner og foreninger — Digilist",
      seoDescription: "Bookingsystem for idrettshaller og gymsaler. Sesongleie til lag og foreninger, halvhalls-bookinger, sambruk, kommunal innbyggerinnlogging via ID-porten.",
      keywords: "idrettshall booking, gymsal booking, sesongleie idrettslag, halvhalls booking, foreningstilskudd, kommunal idrett, idrettsanlegg, fritidsdrift",
      audience: [
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Eiere av idrettshaller, gymsaler, fotballbaner, svømmehaller — som leies ut til lag, foreninger, skoler og innbyggere."
        },
        {
          persona: "Idrettsklubber og lag",
          context: "Brukere av kommunale anlegg — trenger fast trening flere ganger per uke gjennom hele sesongen, og enkeltbookinger for kamper og turneringer."
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
          context: "Mindre anlegg drevet av velforening eller bydelsadministrasjon — gjerne med begrenset administrasjon men mange brukere."
        },
        {
          persona: "Private treningsanlegg",
          context: "Private bedrifter som leier ut tennishaller, paddelbaner, klatrevegger — på timesbasis til private og bedrifter."
        }
      ],
      problems: [
        "Sesongtildeling gjøres manuelt i Excel — det tar uker hver høst, og konflikter løses i lukkede møter uten åpenhet for foreningene.",
        "Halvhalls-bookinger blir feilbooket fordi systemet ikke skjønner at to halve haller = én hel hall. Doble bookinger på den motsatte halvdelen oppdages midt i treningen.",
        "Foreningstilskudd holdes regnskap for i Excel — hver forening har et tildelt antall timer, men ingen kan svare på hvor mye som er brukt midtveis i sesongen.",
        "Vaktmester får ikke alltid beskjed om kveld-bookinger, og må fysisk komme for å låse opp — eller innbyggere står ute i kulden.",
        "Lag som ikke møter opp blokkerer halltimer som andre kunne brukt — uten automatisk frigjøring eller vurdering av faste tildelinger."
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
          body: "Tidligere brukte vi hele september på sesongtildeling — møter, e-poster, Excel-tabeller, konflikter. Med Digilist søker lagene digitalt, vi ser alle søknader i et dashboard, tildeler basert på regler vi har definert opp, og hele tildelingen er klar før månedsslutt. Lagene får automatisk varsel om sine tildelte tider, og kan bytte seg imellom hvis avtalt.",
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
          value: "Engangsbookinger på toppen av sesongleie. Kan kreve fysisk vakthold (vekter) og dobbel renhold — alt varsles automatisk."
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
        text: "Sesongtildeling tok hele september. Nå er den ferdig før månedsslutt — og lagene har færre konflikter fordi prosessen er åpen og spillereglene er kjent.",
        byline: "Idrettskoordinator, norsk kommune"
      },
      faq: [
        {
          question: "Kan vi håndtere både kommunale anlegg og private treningsanlegg samme sted?",
          answer: "Ja. Plattformen kjenner forskjellen — kommunale anlegg har foreningstilskudd og innbyggertilgang via ID-porten, private anlegg har egne priser og kortbetaling. Du kan ha begge i samme installasjon."
        },
        {
          question: "Hvordan håndteres prioritering mellom lag i sesongtildeling?",
          answer: "Prioritetsregler defineres av kommunen — typisk: aldersbestemt prioritet, kjønnsfordeling, geografisk tilhørighet, antall lag i samme klubb. Systemet kjører tildelingen automatisk basert på dine regler, og saksbehandler godkjenner eller justerer."
        },
        {
          question: "Hva med svømmehaller — har de samme bookingflyt?",
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
          title: "Saksbehandler — godkjenne, avvise, kommunisere",
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
      lead: "Kulturhus og kantiner er offentlige arenaer — de skal være tilgjengelige, drives sikkert, og levere alt fra en intim teater-forestilling til en åpen lørdagskafé på samme uke. Digilist gir kulturhus-administrasjonen sanntidskalender, billettsalgs-integrasjon, vakts-varsling, og automatiske bilag til regnskapssystemet — uten å fjerne det menneskelige preget.",
      seoTitle: "Kulturhus og kantiner: bookingsystem for kommunale arenaer — Digilist",
      seoDescription: "Bookingsystem for kulturhus, kantiner og kommunale arenaer. Forestillinger, konserter, åpne dager. Adgangskontroll, driftsrolle-varsling, EHF-fakturering.",
      keywords: "kulturhus booking, kantine booking, kommunal kantine, kulturhus arrangement, Salto KS, kulturhus utleie, kommunal kultur, åpne dager",
      audience: [
        {
          persona: "Kommunale kulturhus",
          context: "Hovedarena for kommunens kulturliv — bruk av kulturkonsulent for arrangement, ekstern utleie til konserter og bryllup, åpne dager for innbyggere."
        },
        {
          persona: "Stiftelser og kulturhus-AS",
          context: "Selvstendige kulturhus drevet på vegne av eller med tilskudd fra kommunen. Har egen drift men deler infrastruktur med kommunal billettsalg eller turnévirksomhet."
        },
        {
          persona: "Kantiner i kommunehus",
          context: "Lunsj-kantiner som også brukes som arrangement-areal kveld og helg — for jubileer, foreningsmøter eller eksterne arrangement."
        },
        {
          persona: "Konsert- og scenekunstaktører",
          context: "Eksterne arrangører som leier kulturhus eller scenearealer for konsert, teater, foredrag — trenger forutsigbar pris og rask bekreftelse."
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
        "Forestillinger, konserter og åpne dager krever forskjellig drift — men alt går gjennom samme kalender uten differensiering.",
        "Vakter, renhold, AV-tekniker, kafé-personale må alle informeres separat — i dag via separate e-poster eller ringerunde dagen før.",
        "Eksterne kunder ringer kulturhus-administrasjon for booking-forespørsel; pris og tilgjengelighet svares manuelt etter 'la meg sjekke kalenderen'.",
        "Kantiner brukes til arrangement på kvelden, men kafé-driften vet ikke om noen booket lokalet før folk møter opp.",
        "Bilag for utleie og bookinger må manuelt registreres i regnskapet — kulturhus-administrasjon bruker timer per måned på dette."
      ],
      features: [
        {
          title: "Differensiert arrangement-flyt",
          body: "Forestilling, konsert, jubileum, åpen dag og firmaarrangement har hver sin booking-mal med riktige felter, godkjenningstrinn og driftsrolle-varsler."
        },
        {
          title: "Driftsrolle-varsling",
          body: "Vakter, renhold, lyd-teknikker, kafé-leder, vekter — får alle automatisk SMS med relevant info når en booking er bekreftet. Ingen mottakerlister å vedlikeholde manuelt."
        },
        {
          title: "Sanntidskalender + ekstern booking",
          body: "Kulturhus-administrasjon ser alle bookinger samme sted. Eksterne kunder kan se ledige datoer på offentlig nettside og forhåndsbestille — saksbehandler godkjenner med ett klikk."
        },
        {
          title: "Salto KS adgangskontroll",
          body: "Mobilnøkkel/PIN-kode aktiveres automatisk for arrangører og leverandører. Kafé har permanent tilgang, eksterne arrangører får tidsbegrenset tilgang."
        },
        {
          title: "Billettsalgs-integrasjon",
          body: "For arrangement med billett kobles vi mot ekstern billettleverandør (Ticketmaster, Hoopla, ven) — antall solgte plasser oppdateres mot kapasitetsgrensen."
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
          body: "Vi har storsal, kafé, blackbox og foajé — fire arenaer som ofte kjøres parallelt. Tidligere brukte vi Outlook og en delt Excel for å koordinere. Nå har vi én sanntidskalender, og når en konsert bekreftes får lyd-tekniker og renhold automatisk SMS med scenisk plan og oppmøtetid. Vi fikk satt opp 23 arrangementer den siste måneden uten en eneste koordineringsfeil.",
          outcome: [
            { label: "Koordineringsfeil", value: "0" },
            { label: "Adm.-tid", value: "−55%" },
            { label: "Arrangement/mnd", value: "23" }
          ]
        },
        {
          customer: "Bygdas frivillighetshus",
          role: "Frivillig daglig leder",
          headline: "Bygda har 60 arrangementer i året — alle gjennom plattformen",
          body: "Vi drives av frivillighet og har ingen kontortid. Bygdas folk bruker huset til møter, fester, korøvelser, dugnadsmøter — alt mulig. Tidligere måtte folk ringe meg på fritiden eller sende SMS. Nå booker de selv via Digilist, betaler hvis nødvendig, og får tilgang automatisk. Jeg ser hva som skjer hver kveld i et oversiktsbilde, men trenger ikke gjøre noe annet enn å åpne dørene mentalt.",
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
        text: "Tre arrangement parallelt på en lørdagskveld — uten en eneste e-post mellom oss og lyd-teknikker. Alle vet hvor de skal være og når.",
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
          answer: "Ja. Saksbehandler kan registrere booking på telefon-/personlig oppmøte og bekrefte direkte — innbyggeren får e-post-/SMS-kvittering. All bookinghistorikk er knyttet til personen, ikke saksbehandleren."
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
          title: "Min Side — alle bookinger på ett sted",
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
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsx("div", { className: "bg-card/95 dark:bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-start md:items-center justify-between", children: [
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
const api = anyApi;
componentsGeneric();
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
  const convex2 = useConvex();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (SKIP_PATH_PREFIXES.some((p) => window.location.pathname.startsWith(p))) {
      return;
    }
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const visitor_id = getVisitorId();
    const device = deviceBucket();
    let cancelled = false;
    const send = (metric, value, rating, nav_type) => {
      if (cancelled) return;
      convex2.mutation(api.audits.rum.ingest, {
        origin,
        pathname,
        metric,
        value,
        rating,
        nav_type,
        device,
        visitor_id
      }).catch(() => {
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
  }, [convex2]);
  return null;
}
const BlogPost = lazy(() => import("./assets/BlogPost-Bb0MAVKl.js"));
const BlogPreview = lazy(() => import("./assets/BlogPreview-Cn2ejzyL.js"));
const Status = lazy(() => import("./assets/Status-BBrhkon_.js"));
const IntelligenceShell = lazy(() => import("./assets/IntelligenceShell-lfp6Wq2j.js"));
const IntelligenceOverview = lazy(() => import("./assets/IntelligenceOverview-JSYxyUek.js"));
const IntelligenceIssues = lazy(() => import("./assets/IntelligenceIssues-C-cXIOyV.js"));
const IntelligenceAgents = lazy(() => import("./assets/IntelligenceAgents-BXcHVVjF.js"));
const IntelligenceCompliance = lazy(() => import("./assets/IntelligenceCompliance-DNL9YINU.js"));
const IntelligenceCategoryPage = lazy(
  () => import("./assets/IntelligenceCategory-BYsnKJ8Z.js").then((m) => ({
    default: m.IntelligenceCategoryPage
  }))
);
const IntelligenceScans = lazy(
  () => import("./assets/IntelligenceMisc-Cv1IhsjG.js").then((m) => ({
    default: m.IntelligenceScans
  }))
);
const IntelligenceSurfaces = lazy(
  () => import("./assets/IntelligenceMisc-Cv1IhsjG.js").then((m) => ({
    default: m.IntelligenceSurfaces
  }))
);
const IntelligenceSettings = lazy(
  () => import("./assets/IntelligenceMisc-Cv1IhsjG.js").then((m) => ({
    default: m.IntelligenceSettings
  }))
);
const IntelligenceTransparensPreview = lazy(
  () => import("./assets/IntelligenceMisc-Cv1IhsjG.js").then((m) => ({
    default: m.IntelligenceTransparensPreview
  }))
);
const VekstOverview = lazy(
  () => import("./assets/IntelligenceVekst-DtQiFEtc.js").then((m) => ({
    default: m.VekstOverview
  }))
);
const VekstKeywords = lazy(
  () => import("./assets/IntelligenceVekst-DtQiFEtc.js").then((m) => ({
    default: m.VekstKeywords
  }))
);
const VekstDrafts = lazy(
  () => import("./assets/IntelligenceVekst-DtQiFEtc.js").then((m) => ({
    default: m.VekstDrafts
  }))
);
const VekstConnections = lazy(
  () => import("./assets/IntelligenceVekst-DtQiFEtc.js").then((m) => ({
    default: m.VekstConnections
  }))
);
const VekstAktivitet = lazy(
  () => import("./assets/IntelligenceVekst-DtQiFEtc.js").then((m) => ({
    default: m.VekstAktivitet
  }))
);
const Chatbot = lazy(
  () => import("./assets/index-Dm3u9bzg.js").then((m) => ({ default: m.Chatbot }))
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
const convexUrl = "https://colorful-frog-31.convex.cloud";
const convex = new ConvexReactClient(convexUrl);
function MotionFirstPaintShim({ children }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(MotionConfig, { reducedMotion: hydrated ? "user" : "always", children });
}
function AppShell() {
  return /* @__PURE__ */ jsx(ConvexProvider, { client: convex, children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: false, children: /* @__PURE__ */ jsx(MotionFirstPaintShim, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
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
      /* @__PURE__ */ jsx(Route, { path: "/blogg/preview/:draftId", element: /* @__PURE__ */ jsx(BlogPreview, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blogg/:slug", element: /* @__PURE__ */ jsx(BlogPost, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FAQ, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/salgsvilkar", element: /* @__PURE__ */ jsx(Salgsvilkar, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/personvern", element: /* @__PURE__ */ jsx(Personvern, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(Cookies, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/transparens", element: /* @__PURE__ */ jsx(Transparens, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/status", element: /* @__PURE__ */ jsx(Status, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/selskapslokaler", element: /* @__PURE__ */ jsx(UseCaseSelskapslokaler, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/moterom", element: /* @__PURE__ */ jsx(UseCaseMoterom, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/idrettshaller-gymsaler", element: /* @__PURE__ */ jsx(UseCaseIdrettshaller, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/bruksomrader/kulturhus-kantiner", element: /* @__PURE__ */ jsx(UseCaseKulturhus, {}) }),
      /* @__PURE__ */ jsxs(Route, { path: "/admin/intelligence", element: /* @__PURE__ */ jsx(IntelligenceShell, {}), children: [
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
                description: "Core Web Vitals (LCP, CLS, INP, FCP, TTFB) + Lighthouse-score. Hentet fra Google PageSpeed Insights — målt mot Chrome User Experience Report-data der det finnes RUM-data."
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
      ] }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
    ] }) }) }),
    /* @__PURE__ */ jsx(CookieConsent, {}),
    /* @__PURE__ */ jsx(ChatbotMount, {})
  ] }) }) }) }) });
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
  staggerChild as e,
  formatPostDate as f,
  getPostBySlug as g,
  api as h,
  cn as i,
  SectionRule as j,
  allFAQEntries as k,
  FAQ_CATEGORIES as l,
  openChatbot as o,
  render,
  staggerParent as s,
  viewportOnce as v
};
