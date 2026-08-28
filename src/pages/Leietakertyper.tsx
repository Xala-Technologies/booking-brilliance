import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { leietakertyperCopy } from "@/content/leietakertyper";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";

const Leietakertyper = () => {
  const c = leietakertyperCopy();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical="https://digilist.no/leietakertyper"
        ogImage="https://digilist.no/images/blog/leietakertyper.webp"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Leietakertyper", url: "https://digilist.no/leietakertyper" },
        ]}
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.rule} />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  {c.h1}
                </EditorialHeading>

                <div className="max-w-4xl space-y-5 text-lg text-ink-soft leading-relaxed mb-10">
                  {c.lede.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <EditorialButton variant="primary" size="lg" href="/#kontakt">
                  {c.ctaDemo}
                </EditorialButton>
              </div>

              <div className="lg:col-span-4">
                <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden border border-rule">
                  <img
                    src="/images/blog/leietakertyper.webp"
                    alt="Pris etter type: fire radio-alternativer (privat, næring, offentlig, visning) med orange fokus på visning"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.whatH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.whatP1}</p>
                  <p>{c.whatP2}</p>
                  <p>{c.whatP3}</p>
                  <p>
                    <Link
                      to={c.whatLinkUrl}
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      {c.whatLinkText}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.fourTypesH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>
                    <strong className="text-ink">Privat.</strong> {c.fourTypesP1.split(". ").slice(1).join(". ")}
                  </p>
                  <p>
                    <strong className="text-ink">Næring.</strong> {c.fourTypesP2.split(". ").slice(1).join(". ")}
                  </p>
                  <p>
                    <strong className="text-ink">Offentlig.</strong> {c.fourTypesP3.split(". ").slice(1).join(". ")}
                  </p>
                  <p>
                    <strong className="text-ink">Visning.</strong> {c.fourTypesP4.split(". ").slice(1).join(". ")}
                  </p>
                  <p>{c.fourTypesP5}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.researchH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.researchP1}</p>
                  {c.researchP2.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.notMunicipalH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.notMunicipalP1}</p>
                  <p>{c.notMunicipalP2}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.sameRuleH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.sameRuleP1}</p>
                  <p>{c.sameRuleP2}</p>
                  <p>{c.sameRuleP3}</p>
                </div>
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

            <div className="mt-10">
              <p className="editorial-mono-caption mb-4">{c.relatedHeading}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {c.related.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group inline-flex items-center gap-2 text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    {link.label}
                    <ArrowRight
                      className="h-4 w-4 text-accent-text group-hover:translate-x-0.5 transition-transform"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PricingSummaryBlock />
      </main>

      <Footer />
    </div>
  );
};

export default Leietakertyper;
