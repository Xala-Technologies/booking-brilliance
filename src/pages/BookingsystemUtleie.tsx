import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
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
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { operatorCopy } from "@/content/bookingsystem-utleie";
import { LinkOrText } from "@/components/LinkOrText";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";

const BookingsystemUtleie = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = operatorCopy(locale);
  const FAQ = c.faq;
  const FEATURES = c.features;
  const WHY_UTLEIE = c.why;
  const LOKALTYPER = c.types;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/bookingsystem-utleie" : "https://digilist.no/bookingsystem-utleie"}
        ogImage="https://digilist.no/og-image.png"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Bookingsystem utleie", url: "https://digilist.no/bookingsystem-utleie" },
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
                <p className="text-lg text-ink-soft mb-6 leading-relaxed">
                  {c.openingScene}
                </p>
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
                  <strong className="text-ink">{c.ledeStrong}</strong>
                  {c.ledeB}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/#kontakt"}>
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
                  {/* First sub-heading after the hero <h1> → must be h2, not h3,
                      or it skips a level (H1→H3) and trips a11y.heading.skip. */}
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {c.forOperators}
                  </h2>
                  {c.operatorSpecs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.definitionRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.definitionH2}
                </EditorialHeading>
              </div>
            </div>
            <div className="max-w-4xl space-y-5 text-lg text-ink-soft leading-relaxed">
              <p>{c.definitionP1}</p>
              <p>{c.definitionP2}</p>
              <p>{c.definitionP3}</p>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.whyRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.whyH2}{" "}
                  <em className="italic">{c.whyH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.whyLede}
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {WHY_UTLEIE.map((item) => (
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

            <div className="mt-14 max-w-4xl">
              <h2
                className="font-serif text-3xl text-ink mb-6"
                style={{ fontVariationSettings: getFraunces("section") }}
              >
                {c.linkedResourcesH2}
              </h2>
              <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                <p>{c.linkedResourcesP1}</p>
                <p>{c.linkedResourcesP2}</p>
                <p>{c.linkedResourcesP3}</p>
                <p>
                  Se også{" "}
                  <Link
                    to={en ? "/en/bruksomrader/kulturhus-kantiner" : "/bruksomrader/kulturhus-kantiner"}
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    kulturhus og kantiner
                  </Link>
                  ,{" "}
                  <Link
                    to={en ? "/en/priser" : "/priser"}
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    priser
                  </Link>{" "}
                  og{" "}
                  <Link
                    to={en ? "/en/book-demo" : "/book-demo"}
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    book en demo
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.typesRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.typesH2}{" "}
                  <em className="italic">{c.typesH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.typesLede}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-rule border border-rule">
              {/* Every target is a Norwegian-query landing page that stays
                  Norwegian by design, so in English these render as labels.
                  The list of venue types is still the useful information;
                  twelve links out of the language is not. */}
              {LOKALTYPER.map((t) => (
                <LinkOrText
                  en={en}
                  key={t.to}
                  to={t.to}
                  className="group bg-paper p-5 lg:p-6 flex items-center justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span className="text-base text-ink group-hover:text-accent-text">
                    {t.label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent-text group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </LinkOrText>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
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
                "Altinn",
                "EHF / Peppol",
                "Brønnøysund",
                "Visma",
                "Tripletex",
                "Fiken",
                "PowerOffice",
                "Microsoft 365",
                "Google Calendar",
                "Salto KS",
              ].map((brand) => (
                <div key={brand} className="border border-rule rounded-sm p-4 bg-paper">
                  <IntegrationLogo brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.kommuneRule} />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section" className="mb-6">
                  {c.kommuneH2}
                </EditorialHeading>
                <p className="text-lg text-ink-soft leading-relaxed measure">
                  {c.kommuneBody}
                  <Link
                    to={en ? "/en/bookingsystem-kommune" : "/bookingsystem-kommune"}
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    {c.kommuneLinkText}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

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
                    {c.supplierHeading}
                  </h3>
                  {c.supplierSpecs.map((spec) => (
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
            <p className="mt-10 editorial-mono-caption">
              {c.seeAlso}{" "}
              <Link
                to={en ? "/en/bookingsystem-kommune" : "/bookingsystem-kommune"}
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {c.municipalLink}
              </Link>{" "}
              {c.orBackTo}{" "}
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

export default BookingsystemUtleie;
