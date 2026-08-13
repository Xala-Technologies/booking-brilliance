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
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { securityCopy } from "@/content/sikkerhet";

const Sikkerhet = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = securityCopy(locale);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/sikkerhet" : "https://digilist.no/sikkerhet"}
        ogImage="https://digilist.no/og-image.png"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Sikkerhet og personvern", url: "https://digilist.no/sikkerhet" },
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
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  {c.lede.lead}
                  <strong className="text-ink">{c.lede.strong1}</strong>
                  {c.lede.mid}
                  <strong className="text-ink">{c.lede.strong2}</strong>
                  {c.lede.tail}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/#kontakt"}>
                    {c.ctaDemo}
                  </EditorialButton>
                  {/* Hidden in English: the only target is /teknologi, which
                      is still Norwegian. Pointing it at /en/faq instead would
                      make the button promise the technology page and deliver
                      something else — worse than not offering it. */}
                  {!en && (
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      icon={false}
                      href="/teknologi"
                    >
                      {c.ctaTech}
                    </EditorialButton>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {c.summaryHeading}
                  </h2>
                  {c.specs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.principlesRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.principlesH2}{" "}
                  <em className="italic">{c.principlesH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.principlesLede}
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {c.principles.map((item) => (
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
            <SectionRule label={c.areasRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.areasH2}
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.areasLede}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {c.areas.map((f) => (
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

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.faqRule} />
            <EditorialHeading as="h2" size="section" className="mb-10">
              {c.faqLede}
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {c.faq.map((q) => (
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
            {/* Two of the three targets now exist in English; /teknologi does
                not, so it is the only one still dropped here. */}
            <p className="mt-10 editorial-mono-caption">
              {en ? "See also" : "Se også"}{" "}
              <Link
                to={en ? "/en/bookingsystem-kommune" : "/bookingsystem-kommune"}
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {en ? "the booking system for municipalities" : "bookingsystem for kommuner"}
              </Link>{" "}
              {en ? "or" : "eller"}{" "}
              <Link
                to={en ? "/en/bookingsystem-utleie" : "/bookingsystem-utleie"}
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                {en ? "the booking system for venue rental" : "bookingsystem for utleie"}
              </Link>
              {!en && (
                <>
                  {" "}eller{" "}
                  <Link
                    to="/teknologi"
                    className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    teknologien bak
                  </Link>
                </>
              )}
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sikkerhet;
