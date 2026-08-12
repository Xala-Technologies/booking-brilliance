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
import { PRICING_FACTS_EN, pricingFaqEn } from "@/content/faq.en";

/**
 * The English pricing page.
 *
 * Structurally identical to `Priser.tsx` on purpose — same page, other
 * language — so a change to one shows up plainly when diffing both. What
 * differs is the source: this reads `faq.en.ts`, whose pricing answers are
 * pinned against the Norwegian originals by `pricing.en.test.ts`.
 *
 * No figures here either. The claim that must never soften across languages is
 * "we take no share of what you earn"; "low fees" would be the weakest version
 * of the strongest thing we have, and the tests fail on it.
 */
export default function Pricing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Pricing: a subscription, with no transaction fee | Digilist"
        description="Digilist takes no share of your booking revenue. Subscription tiers set by venues and needs, tailored pricing for small and private operators, and 6 months free for the first 100 customers."
        keywords="booking system pricing, venue booking software cost, no commission booking system, no transaction fee booking, booking platform subscription"
        canonical="https://digilist.no/en/pricing"
        breadcrumbs={[
          { name: "Home", url: "https://digilist.no/en" },
          { name: "Pricing", url: "https://digilist.no/en/pricing" },
        ]}
        faq={pricingFaqEn().map((f) => ({ question: f.q, answer: f.a }))}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero — the differentiator first, because it is the answer to the
              question people actually arrive with. */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="PRICING" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    We take no share of what{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      you earn
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist is a subscription, not a commission. You pay to use
                    the platform and the administration panel — no transaction
                    fee, no per-booking cost, and no hidden charges. What you
                    charge for a rental is yours.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Get a quote for your setup
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/en/faq">
                      Read the full FAQ
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Receipt}
                    label="SUBSCRIPTION · NO COMMISSION"
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
                How the price works.
              </h2>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-gutter">
                {PRICING_FACTS_EN.map((fact) => (
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
                    Why there is no price list
                  </h2>
                  <p className="text-base lg:text-lg text-ink leading-relaxed">
                    The gap between a community hall with one room and a county
                    authority with twenty-two schools is wide enough that any
                    single figure is either too high for one or meaningless to
                    the other. We publish everything that decides the price
                    instead, and give a concrete quote after a short
                    conversation. Tell us how many venues, what they are used
                    for, and roughly how many rentals a year — and you have a
                    number.
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
                Common questions about price.
              </h2>
              <div className="grid gap-4">
                {pricingFaqEn().map((item) => (
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
                      The first 100 customers get 6 months free.
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      No lock-in during the trial. A booking system is impossible
                      to judge properly from a demo — you find out in May, when
                      three clubs want the same hall.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Get started
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
