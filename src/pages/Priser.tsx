import { Receipt } from "lucide-react";
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
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

/**
 * The pricing page.
 *
 * There was no such page, on a product whose pricing IS the differentiator. A
 * visitor who wanted to know what Digilist costs had to ask the chatbot or fill
 * in a form, and an ad click had nowhere to land — /priser fell through to the
 * 404 page.
 *
 * No numbers here on purpose. We publish no price list, because the span
 * between a grendehus with one hall and a county with twenty-two schools makes
 * any single figure wrong for nearly everyone reading it. What IS published is
 * everything that decides the figure, and the one thing competitors do that we
 * do not: take a share of what the customer earns.
 *
 * The facts come from `content/pricing.ts`, which the chatbot, the FAQ page and
 * this page all read. One source, so a change in policy cannot leave a stale
 * claim behind on a surface someone forgot about.
 */
export default function Priser() {
  // The mirror renders this component at /en/priser too, so the content and
  // the metadata both follow the URL. Before this it was the Norwegian page at
  // an English address — and TRANSLATED_PATHS claimed otherwise, which made it
  // indexable.
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const facts = en ? PRICING_FACTS_EN : PRICING_FACTS;
  const faq = en ? pricingFaqEn() : PRICING_FAQ;
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Priser: abonnement uten transaksjonsgebyr | Digilist"
        description="Digilist tar ingen andel av bookinginntektene dine. Abonnement etter antall anlegg og behov, tilpasset pris for små og private aktører, og 6 måneder gratis for de 100 første kundene."
        keywords="digilist pris, hva koster digilist, bookingsystem pris, bookingsystem uten provisjon, transaksjonsgebyr booking, abonnement bookingsystem"
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
          {/* Hero — the differentiator first, because it is the answer to the
              question people actually arrive with. */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="PRISER" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Vi tar ingen andel av det{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      du leier ut for
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist er et abonnement, ikke en provisjon. Du betaler for
                    å bruke plattformen og administrasjonspanelet — ingen
                    transaksjonsavgift, ingen kostnad per booking, og ingen
                    skjulte gebyrer. Leier du ut salen for 6 000 kroner, er de
                    6 000 kronene dine.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Få pris for ditt oppsett
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/faq">
                      Se hele FAQ-en
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Receipt}
                    label="ABONNEMENT · INGEN PROVISJON"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* The facts, as a list rather than a tier table — we publish no
              figures, so a three-column price grid would be theatre. */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto md:px-8 lg:px-12">
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-8"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                Slik fungerer prisen.
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

          {/* Why there is no price list. Saying nothing here reads as hiding
              something, which is the opposite of the page's whole argument. */}
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
                    Hvorfor vi ikke har en prisliste
                  </h2>
                  <p className="text-base lg:text-lg text-ink leading-relaxed">
                    Spennet mellom et grendehus med én sal og en fylkeskommune
                    med tjueto skoler er så stort at ett tall enten blir for høyt
                    for den ene eller meningsløst for den andre. Vi har heller
                    valgt å publisere alt som avgjør prisen, og gi et konkret
                    tilbud etter en kort samtale. Fortell oss hvor mange lokaler
                    det gjelder, hva de brukes til, og omtrent hvor mange utleier
                    det blir i året — så har du et tall.
                  </p>
                </div>
              </EditorialCard>
            </div>
          </section>

          {/* FAQ — the same entries the chatbot answers from. */}
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
                Vanlige spørsmål om pris.
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
                      De 100 første kundene får 6 måneder gratis.
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Ingen binding i prøveperioden. Et bookingsystem er umulig å
                      vurdere ordentlig på en demo — du finner det ut i mai, når
                      tre lag vil ha samme hall.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Kom i gang
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
