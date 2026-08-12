import { CalendarCheck } from "lucide-react";
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
import { PRICING_FACTS_EN } from "@/content/faq.en";

/**
 * The English homepage.
 *
 * NOT a translation of the Norwegian one. That page is ten sections built for a
 * Norwegian buyer — seasonal allocation to local clubs, SSA-L procurement,
 * ID-porten, EHF invoicing — and translating them would produce a page that is
 * both a lot of work and the wrong pitch. None of that vocabulary means
 * anything to someone reading from London or Toronto, and a page that opens
 * with a Norwegian procurement contract tells them this product is not for
 * them.
 *
 * So this page answers the three questions an international visitor actually
 * arrives with: what is it, is it for someone like me, and what does it cost.
 * Plus the one they would find out later and resent: how Norwegian is this
 * really? Answered honestly here rather than discovered in a sales call.
 *
 * The pricing cards are the same six claims as `/en/pricing`, read from
 * `faq.en.ts` — the policy has one source per language and the tests pin the
 * two languages to each other.
 */
export default function IndexEn() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Digilist · Booking software for venues that are rented out"
        description="One platform for renting out venues: real-time availability, self-service booking, payment and contracts. A subscription with no transaction fee and no share of your booking revenue."
        keywords="venue booking software, facility booking system, room rental platform, hall booking system, booking software no commission, venue management software"
        canonical="https://digilist.no/en"
        breadcrumbs={[{ name: "Home", url: "https://digilist.no/en" }]}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero — the problem in one sentence, because "booking platform"
              describes fifty products and none of them specifically. */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="DIGILIST" />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Stop answering{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      the same email
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist makes a venue bookable. People see what is free,
                    choose a date and pay — without anyone having to reply to
                    &ldquo;is Saturday available?&rdquo; for the hundredth time.
                    Halls, function rooms, meeting rooms, studios, community
                    buildings.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book a demo
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/en/pricing">
                      See pricing
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={CalendarCheck}
                    label="REAL-TIME AVAILABILITY · SELF-SERVICE BOOKING"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Who it is for. The second question every visitor has, and the one
              a generic feature list never answers. */}
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
                Built for whoever holds the calendar.
              </h2>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-gutter">
                {[
                  {
                    title: "One venue, run on the side",
                    body: "A community hall, a converted barn, a function room let out at weekends. Usually one person with the keys, the calendar and the inbox. Digilist has to earn its place in the first week, because nobody here has an implementation project.",
                  },
                  {
                    title: "Several venues, one operator",
                    body: "A chain, a parish with multiple halls, a club with courts and a clubhouse. Each site has its own calendar today and nobody has the whole picture. The price follows the number of venues, not how much you rent them out.",
                  },
                  {
                    title: "Public bodies",
                    body: "Sports halls, gyms and cultural venues rented to residents and local clubs, where allocation rules, invoicing and accessibility are legal requirements rather than preferences. This is where the platform started, and it shows.",
                  },
                ].map((seg) => (
                  <EditorialCard key={seg.title} className="h-full">
                    <div className="p-2 lg:p-6">
                      <h3 className="font-serif text-xl lg:text-2xl text-ink mb-3">
                        {seg.title}
                      </h3>
                      <p className="text-base text-ink-soft leading-relaxed">{seg.body}</p>
                    </div>
                  </EditorialCard>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing, up front. It is the differentiator and burying it would
              waste the strongest thing we can say. */}
          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="PRICING" />
              <h2
                className="font-serif text-3xl lg:text-4xl text-ink mb-4 mt-6"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                We take no share of what you earn.
              </h2>
              <p className="text-lg text-ink-soft measure leading-relaxed mb-8">
                Digilist is a subscription, not a commission. No transaction fee,
                no per-booking cost, no hidden charges. What you charge for a
                rental is yours.
              </p>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-gutter">
                {PRICING_FACTS_EN.slice(0, 4).map((fact) => (
                  <EditorialCard key={fact.title} className="h-full">
                    <div className="p-2 lg:p-6">
                      <h3 className="font-serif text-xl text-ink mb-2">{fact.title}</h3>
                      <p className="text-base text-ink-soft leading-relaxed">{fact.body}</p>
                    </div>
                  </EditorialCard>
                ))}
              </div>
              <div className="mt-8">
                <EditorialButton variant="outline" size="lg" href="/en/pricing">
                  How pricing works
                </EditorialButton>
              </div>
            </div>
          </section>

          {/* The honest note. A visitor finds this out eventually; better here
              than in a sales call after they have invested time. */}
          <section className="py-12 lg:py-16">
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
                    How Norwegian is this, really?
                  </h2>
                  <p className="text-base lg:text-lg text-ink leading-relaxed">
                    Digilist is built in Norway, and its deepest integrations are
                    Norwegian: the national digital identity services, the
                    European e-invoicing standard, and the local payment
                    providers. That is a genuine advantage for a Norwegian
                    customer and irrelevant to most others.
                  </p>
                  <p className="mt-4 text-base lg:text-lg text-ink leading-relaxed">
                    The booking, marketplace and payment flow underneath is not
                    country-specific. If you are outside Norway, tell us what
                    your market needs — we would rather be honest about a gap
                    than promise a fit that is not there.
                  </p>
                </div>
              </EditorialCard>
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
                      to judge from a demo — you find out in the busy month, when
                      three groups want the same room.
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
