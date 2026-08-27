import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
  Byline,
  PullQuote,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { venuesCopy } from "@/content/lokaler-til-leie";
import { LinkOrText } from "@/components/LinkOrText";

const UPDATED = "23. juli 2026";

const LokalerTilLeie = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = venuesCopy(locale);
  const HOWTO_STEPS = c.steps;
  const GUIDANCE = c.guidance;
  const FAQ = c.faq;
  const LOKALTYPER = c.types;
  const BYER = c.cities;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/lokaler-til-leie" : "https://digilist.no/lokaler-til-leie"}
        ogImage="https://digilist.no/og-image.png"
        ogType="article"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Lokaler til leie", url: "https://digilist.no/lokaler-til-leie" },
        ]}
        howTo={{
          name: "Slik finner og velger du et lokale til leie",
          description:
            "Seks steg for å finne, sammenligne og booke riktig lokale til arrangementet ditt.",
          steps: HOWTO_STEPS.map((s) => ({ name: s.name, text: s.text })),
        }}
        article={{
          headline: c.articleHeadline,
          description:
            "En praktisk guide til å finne lokaler til leie i Norge: lokaltyper, kapasitet, prisintervaller, når du bør booke, og hvordan du booker på nett.",
          datePublished: "2026-07-23",
          dateModified: "2026-07-23",
          author: "Ibrahim Rahmani",
          authorRole: c.authorRole,
          articleSection: c.articleSection,
          keywords: ["lokaler til leie", "leie lokale", "booke lokale"],
        }}
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
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-6">
                  {c.ledeA}
                  <strong className="text-ink">{c.ledeStrong}</strong>
                  {c.ledeB}
                </p>
                <Byline author="Ibrahim Rahmani" role="Grunnlegger, Digilist" date={`Sist oppdatert ${UPDATED}`} className="mb-10" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.ctaFind}
                  </EditorialButton>
                  <EditorialButton variant="outline" size="lg" icon={false} href="/leie">
                    {c.ctaTypes}
                  </EditorialButton>
                </div>
              </div>
              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {c.forRenters}
                  </h2>
                  {c.renterSpecs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                  <SpecRow label="Betaling" value="Vipps · kort" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.stepsRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.stepsH2}{" "}
                  <em className="italic">{c.stepsH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.stepsLede}
                </p>
              </div>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
              {HOWTO_STEPS.map((s, i) => (
                <li key={s.name} className="bg-paper p-6 lg:p-8 flex flex-col gap-2">
                  <span className="editorial-mono-caption text-accent-text">
                    Steg {i + 1}
                  </span>
                  <h3
                    className="font-serif text-xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {s.name}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.priceRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.priceH2}{" "}
                  <em className="italic">{c.priceH2em}</em>?
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.priceLede}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto border border-rule">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-paper-tinted border-b border-rule">
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Lokaltype</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk kapasitet</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk prisintervall</th>
                  </tr>
                </thead>
                <tbody>
                  {GUIDANCE.map((g) => (
                    <tr key={g.type} className="border-b border-rule last:border-0">
                      <td className="p-4 text-base text-ink">{g.type}</td>
                      <td className="p-4 text-base text-ink-soft">{g.cap}</td>
                      <td className="p-4 text-base text-ink-soft">{g.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-ink-soft measure">
              {c.priceNote}
            </p>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <PullQuote>
              {c.pullQuote}
            </PullQuote>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.typesRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.typesH2}{" "}
                  <em className="italic">{c.typesH2em}</em>?
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {/* Every target is a Norwegian-query landing page that stays
                  Norwegian by design, so these render as labels in English. */}
              {LOKALTYPER.map((t) => (
                <LinkOrText
                  en={en}
                  key={t.to}
                  to={t.to}
                  className="group bg-paper p-6 flex items-start justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span>
                    <span className="block text-base text-ink group-hover:text-accent-text">
                      {t.label}
                    </span>
                    <span className="block text-sm text-ink-soft mt-1">{t.desc}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 mt-1 text-ink-soft group-hover:text-accent-text group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </LinkOrText>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.cityRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.cityH2}{" "}
                  <em className="italic">{c.cityH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.cityLede}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
              {/* The city pages are Norwegian only for the same reason. */}
              {BYER.map((b) => (
                <LinkOrText
                  en={en}
                  key={b.to}
                  to={b.to}
                  className="group bg-paper p-6 flex items-center justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span className="text-base text-ink group-hover:text-accent-text">
                    {b.label}
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

        <PilotInvitationSection />

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
              {c.operatorPrompt}{" "}
              <Link
                to={en ? "/en/bookingsystem-utleie" : "/bookingsystem-utleie"}
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {c.operatorLink}
              </Link>{" "}
              {c.orGoTo}{" "}
              <LinkOrText
                en={en}
                to="/leie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {c.overviewLink}
              </LinkOrText>
              .
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

export default LokalerTilLeie;
