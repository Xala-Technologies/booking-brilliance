import { Building2 } from "lucide-react";
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
import AboutUsSection from "@/components/AboutUsSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

export default function OmOss() {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={t(locale, "about.title")}
        description={t(locale, "about.description")}
        keywords="om digilist, xala technologies, norsk bookingplattform, leverandør bookingsystem, digilist selskap, nesbru"
        canonical={locale === "en" ? "https://digilist.no/en/om-oss" : "https://digilist.no/om-oss"}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Om oss", url: "https://digilist.no/om-oss" },
        ]}
        aboutPage
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={t(locale, "about.label")} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    {t(locale, "about.h1")}{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      {t(locale, "about.h1em")}
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {t(locale, "about.lede")}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      {t(locale, "nav.bookDemo")}
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/teknologi">
                      {t(locale, "about.techCta")}
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Building2}
                    label="XALA TECHNOLOGIES AS · NESBRU"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Relocated colophon — the Fakta / manifest content, now on a
              focused, indexable URL instead of buried in the homepage scroll. */}
          <AboutUsSection />

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
                      {t(locale, "about.ctaHeading")}
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {t(locale, "about.ctaBody")}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
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
