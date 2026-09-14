import { Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
import { PRICING_FACTS, PRICING_FAQ } from "@/content/pricing";
import { PRICING_FACTS_EN, pricingFaqEn } from "@/content/faq.en";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";
import { PrivatePricingPlans } from "@/components/PrivatePricingPlans";

export default function Priser() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const facts = en ? PRICING_FACTS_EN : PRICING_FACTS;
  const faq = en ? pricingFaqEn() : PRICING_FAQ;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={t(locale, "pricing.title")}
        description={t(locale, "pricing.description")}
        keywords={t(locale, "pricing.keywords")}
        canonical="https://digilist.no/priser"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Priser", url: "https://digilist.no/priser" },
        ]}
        faq={faq.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={t(locale, "pricing.label")} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    {t(locale, "pricing.h1")}
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {t(locale, "pricing.lede")}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      {t(locale, "pricing.cta")}
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/#kontakt">
                      {t(locale, "pricing.contactCta")}
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Receipt}
                    label={t(locale, "pricing.visual")}
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                {t(locale, "pricing.plansHeading")}
              </h2>
              <p className="text-base lg:text-lg text-ink-soft leading-relaxed measure-wide mb-8">
                {t(locale, "pricing.plansLede")}
              </p>
              <PrivatePricingPlans />
              <p className="mt-8 text-base text-ink-soft leading-relaxed measure-wide">
                {t(locale, "pricing.mvaNote")}{" "}
                <Link
                  to={en ? "/en/salgsvilkar" : "/salgsvilkar"}
                  className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
                >
                  {t(locale, "pricing.termsLink")}
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="py-12 lg:py-16">
            <div className="container mx-auto md:px-8 lg:px-12">
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-4"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                {t(locale, "pricing.kommuneHeading")}
              </h2>
              <p className="text-base lg:text-lg text-ink leading-relaxed measure-wide">
                {t(locale, "pricing.kommuneBody")}{" "}
                <Link
                  to="/book-demo"
                  className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
                >
                  Book demo
                </Link>{" "}
                eller{" "}
                <Link
                  to="/book-demo"
                  className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
                >
                  kontakt oss
                </Link>
                . Se også{" "}
                <Link
                  to={en ? "/en/bookingsystem-kommune" : "/bookingsystem-kommune"}
                  className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
                >
                  bookingsystem for kommuner
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-8"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                {t(locale, "pricing.howHeading")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-gutter">
                {facts.map((fact) => (
                  <EditorialCard key={fact.title} className="h-full">
                    <div className="p-2 lg:p-6">
                      <h3 className="font-serif text-xl lg:text-2xl text-ink mb-3">
                        {fact.title}
                      </h3>
                      <p className="text-base text-ink-soft leading-relaxed">
                        {fact.body}
                      </p>
                    </div>
                  </EditorialCard>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-12 lg:pb-16">
            <div className="container mx-auto md:px-8 lg:px-12">
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-8"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                {t(locale, "pricing.faqHeading")}
              </h2>
              <div className="grid gap-4">
                {faq.map((item) => (
                  <EditorialCard key={item.q}>
                    <div className="p-2 lg:p-6">
                      <h3 className="font-serif text-lg lg:text-xl text-ink mb-2">
                        {item.q}
                      </h3>
                      <p className="text-base text-ink-soft leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </EditorialCard>
                ))}
              </div>
            </div>
          </section>

          <section className="pb-12 lg:pb-16">
            <div className="container mx-auto md:px-8 lg:px-12">
              <EditorialCard className="bg-paper-deep/40">
                <div className="p-2 lg:p-6 measure-wide">
                  <h2
                    className="font-serif text-2xl lg:text-3xl text-ink mb-4"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {t(locale, "pricing.legalHeading")}
                  </h2>
                  <p className="text-base lg:text-lg text-ink leading-relaxed">
                    {t(locale, "pricing.legalBody")}{" "}
                    <Link
                      to={en ? "/en/salgsvilkar" : "/salgsvilkar"}
                      className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
                    >
                      {t(locale, "pricing.termsLink")}
                    </Link>
                    .
                  </p>
                </div>
              </EditorialCard>
            </div>
          </section>

          <PricingSummaryBlock />
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
