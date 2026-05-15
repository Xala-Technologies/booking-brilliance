import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import BookDemo from "./pages/BookDemo";
import BookingsystemKommune from "./pages/BookingsystemKommune";
import BookingLokalerMoterom from "./pages/BookingLokalerMoterom";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Salgsvilkar from "./pages/Salgsvilkar";
import Personvern from "./pages/Personvern";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import Transparens from "./pages/Transparens";
import UseCaseSelskapslokaler from "./pages/UseCaseSelskapslokaler";
import UseCaseMoterom from "./pages/UseCaseMoterom";
import UseCaseIdrettshaller from "./pages/UseCaseIdrettshaller";
import UseCaseKulturhus from "./pages/UseCaseKulturhus";
import IntelligenceShell from "./pages/admin/IntelligenceShell";
import IntelligenceOverview from "./pages/admin/IntelligenceOverview";
import IntelligenceIssues from "./pages/admin/IntelligenceIssues";
import IntelligenceAgents from "./pages/admin/IntelligenceAgents";
import { IntelligenceCategoryPage } from "./pages/admin/IntelligenceCategory";
import {
  IntelligenceScans,
  IntelligenceSurfaces,
  IntelligenceSettings,
  IntelligenceTransparensPreview,
} from "./pages/admin/IntelligenceMisc";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import { Chatbot } from "./components/chatbot";

const queryClient = new QueryClient();

/**
 * Router-agnostic app body. SSR (entry-server) and client (main.tsx) each
 * wrap this with their own Router (StaticRouter / BrowserRouter).
 */
export function AppShell() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/bookingsystem-kommune" element={<BookingsystemKommune />} />
            <Route path="/booking-av-lokaler-og-moterom" element={<BookingLokalerMoterom />} />
            <Route path="/blogg" element={<Blog />} />
            <Route path="/blogg/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/salgsvilkar" element={<Salgsvilkar />} />
            <Route path="/personvern" element={<Personvern />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/transparens" element={<Transparens />} />
            <Route path="/bruksomrader/selskapslokaler" element={<UseCaseSelskapslokaler />} />
            <Route path="/bruksomrader/moterom" element={<UseCaseMoterom />} />
            <Route path="/bruksomrader/idrettshaller-gymsaler" element={<UseCaseIdrettshaller />} />
            <Route path="/bruksomrader/kulturhus-kantiner" element={<UseCaseKulturhus />} />
            <Route path="/admin/intelligence" element={<IntelligenceShell />}>
              <Route index element={<IntelligenceOverview />} />
              <Route path="issues" element={<IntelligenceIssues />} />
              <Route path="scans" element={<IntelligenceScans />} />
              <Route
                path="uptime"
                element={
                  <IntelligenceCategoryPage
                    auditType="uptime"
                    title="Oppetid & SSL"
                    description="HTTP-status, responstid og TLS-sertifikatutløp per overflate."
                  />
                }
              />
              <Route
                path="seo"
                element={
                  <IntelligenceCategoryPage
                    auditType="seo"
                    title="SEO"
                    description="Titler, descriptions, canonical, OG/Twitter, JSON-LD, duplikater og ødelagte interne lenker."
                  />
                }
              />
              <Route
                path="wcag"
                element={
                  <IntelligenceCategoryPage
                    auditType="a11y"
                    title="WCAG / Tilgjengelighet"
                    description="Lang, alt-tekst, label-for, heading-hierarki, ARIA-landmark, knapp- og lenkenavn. axe-core via Playwright kommer i pass 2."
                  />
                }
              />
              <Route
                path="sikkerhet"
                element={
                  <IntelligenceCategoryPage
                    auditType="security"
                    title="Sikkerhet"
                    description="HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy + sensitive-file-prober og mixed-content."
                  />
                }
              />
              <Route
                path="ytelse"
                element={
                  <IntelligenceCategoryPage
                    auditType="performance"
                    title="Ytelse"
                    description="Lighthouse CI + Core Web Vitals (LCP, CLS, INP, FCP, TTFB). Krever ekstern runner."
                    placeholder
                  />
                }
              />
              <Route
                path="lenker"
                element={
                  <IntelligenceCategoryPage
                    auditType="links"
                    title="Lenker"
                    description="Eksterne lenker HEAD-sjekket på tvers av alle skannede sider."
                  />
                }
              />
              <Route path="overflater" element={<IntelligenceSurfaces />} />
              <Route path="agenter" element={<IntelligenceAgents />} />
              <Route
                path="transparens"
                element={<IntelligenceTransparensPreview />}
              />
              <Route
                path="innstillinger"
                element={<IntelligenceSettings />}
              />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
          <Chatbot />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
