import { ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { CategoryVisual } from "@/components/CategoryVisual";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import TechnologyStackSection from "@/components/TechnologyStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { teknologiFaq } from "@/content/teknologi";

const APP = "https://app.digilist.no";

export default function Teknologi() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const faq = teknologiFaq(locale);
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={t(locale, "tech.title")}
        description={t(locale, "tech.description")}
        keywords="digilist teknologi, bookingsystem arkitektur, convex, postgresql, iso 27001, gdpr, wcag, id-porten, ehf peppol, datalagring norge, sikkerhet bookingsystem"
        canonical={en ? "https://digilist.no/en/teknologi" : "https://digilist.no/teknologi"}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Teknologi", url: "https://digilist.no/teknologi" },
        ]}
        service
        faq={faq.map((e) => ({ question: e.q, answer: e.a }))}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={t(locale, "tech.rule")} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    {t(locale, "tech.h1")}{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      {t(locale, "tech.h1em")}
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {t(locale, "tech.lede")}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/book-demo"}>
                      {t(locale, "nav.bookDemo")}
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t(locale, "nav.openPlatform")}
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={ShieldCheck}
                    label="ISO 27001 · GDPR · WCAG 2.1 AA"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Relocated platform content — the same sections, now on a focused,
              indexable URL instead of buried in the homepage scroll. */}
          <TechnologyStackSection />
          <ArchitectureSection />
          <IntegrationsSection />

          {/* FAQ — visible copy mirrors the FAQPage schema above */}
          <section
            id="faq"
            aria-labelledby="teknologi-faq-heading"
            className="py-16 lg:py-24 bg-paper border-t border-rule"
          >
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={t(locale, "tech.faqRule")} />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14 items-end">
                <div className="lg:col-span-7">
                  <EditorialHeading
                    as="h2"
                    size="section"
                    id="teknologi-faq-heading"
                  >
                    {t(locale, "tech.faqH2")}{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      {t(locale, "tech.faqH2em")}
                    </em>
                    .
                  </EditorialHeading>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-6 lg:items-end">
                  <p className="text-lg text-ink-soft leading-relaxed lg:text-right">
                    {t(locale, "tech.faqLede")}
                  </p>
                  <EditorialButton variant="link" size="md" href={en ? "/en/faq" : "/faq"}>
                    {t(locale, "tech.seeAll")}
                  </EditorialButton>
                </div>
              </div>
              <FAQAccordion items={faq} />
            </div>
          </section>

          {/* Closing CTA */}
          <section className="pb-20 lg:pb-28 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <EditorialCard className="bg-paper-deep/40">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
                  <div className="lg:col-span-8">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      {t(locale, "tech.ctaHeading")}
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {t(locale, "tech.ctaBody")}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/book-demo"}>
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
