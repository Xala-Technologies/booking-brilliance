import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
  IntegrationLogo,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { municipalCopy } from "@/content/bookingsystem-kommune";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";

const BookingsystemKommune = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = municipalCopy(locale);
  const FAQ = c.faq;
  const FEATURES = c.features;
  const SSA_L_CHECKLIST = c.checklist;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        canonical={en ? "https://digilist.no/en/bookingsystem-kommune" : "https://digilist.no/bookingsystem-kommune"}
        ogImage="https://digilist.no/og-image.png"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Bookingsystem for kommuner", url: "https://digilist.no/bookingsystem-kommune" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.rule} />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  {c.h1}{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    {c.h1em}
                  </em>
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  {c.ledeA}
                  <strong className="text-ink">{c.ledeStrong}</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    href={en ? "/en/book-demo" : "/#kontakt"}
                  >
                    {c.ctaQuote}
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.ctaOpen}
                  </EditorialButton>
                </div>
              </div>

              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  {/* First sub-heading after the hero <h1> → must be h2, not
                      h3, or it skips a level (H1→H3) and trips a11y.heading.skip. */}
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {c.activeHeading}
                  </h2>
                  {c.activeSpecs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.ssaRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.ssaH2}{" "}
                  <em className="italic">{c.ssaH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.ssaLede}
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {SSA_L_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-base text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.featureRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.featureH2}
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.featureLede}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-paper p-6 lg:p-8 flex flex-col gap-3">
                  <h3
                    className="font-serif text-xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.integrationRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.integrationH2}{" "}
                  <em className="italic">{c.integrationH2em}</em>.
                </EditorialHeading>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
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
                "Salto KS",
              ].map((brand) => (
                <div
                  key={brand}
                  className="border border-rule rounded-sm p-4 bg-paper"
                >
                  <IntegrationLogo brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-accent-tinted">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.contactRule} />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="display" className="mb-6">
                  Be om{" "}
                  <em className="italic">pristilbud</em>.
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure mb-8">
                  {c.contactLede}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/#kontakt"}>
                    {c.ctaDemo}
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="mailto:kontakt@digilist.no"
                  >
                    kontakt@digilist.no
                  </EditorialButton>
                </div>
              </div>
              <div className="lg:col-span-5">
                <EditorialCard className="bg-paper">
                  <h3
                    className="font-serif text-xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {c.procurementHeading}
                  </h3>
                  {c.procurementSpecs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.faqRule} />
            <EditorialHeading as="h2" size="section" className="mb-10">
              {c.faqH2}
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {FAQ.map((q) => (
                <div key={q.question} className="border-b border-rule pb-8">
                  <dt
                    className="font-serif text-2xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {q.question}
                  </dt>
                  <dd className="text-base text-ink-soft leading-relaxed measure">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-base text-ink-soft measure">
              {/* Points at a Norwegian blog post, so it is Norwegian-only. The
                  English twin of that post will make this linkable again. */}
              {!en && (
                <>
                  Klar for å gå i gang? Se{" "}
                  <Link
                    to="/blogg/hvordan-digitalisere-booking-kommunale-lokaler"
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    hvordan digitalisere booking av kommunale lokaler
                  </Link>{" "}
                  for den konkrete prosessen, steg for steg.
                </>
              )}
            </p>
            <p className="mt-6 editorial-mono-caption">
              {c.backTo}{" "}
              <Link
                to={en ? "/en" : "/"}
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {c.frontPage}
              </Link>
            </p>
          </div>
        </section>

        {/* Pricing summary block */}
        <PricingSummaryBlock />
      </main>

      <Footer />
    </div>
  );
};

export default BookingsystemKommune;
