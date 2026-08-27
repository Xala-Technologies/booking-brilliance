import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Users,
  Building2,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Users2,
  Theater,
  GlassWater,
} from "lucide-react";
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
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { bookingCopy } from "@/content/booking-lokaler";
import { LinkOrText } from "@/components/LinkOrText";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";

const BookingLokalerMoterom = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = bookingCopy(locale);
  const FAQ = c.faq;
  const BENEFITS = c.benefits;
  const USE_CASES = c.useCases;
  const BENEFIT_ICONS = [CalendarCheck, CreditCard, Users, ShieldCheck, Building2, Sparkles];
  const USE_CASE_ICONS = [GlassWater, Users2, Trophy, Theater];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description="Bookingsystem for lokaler og møterom: sanntidskalender, Vipps, BankID, EHF og sesongleie. For kommuner, selskapslokaler, idrettshaller og kulturhus."
        keywords="lokaler bookingsystem, bookingsystem for lokaler, bookingsystem lokaler, booking av lokaler og møterom, booking lokale, booking møterom, leie lokale, leie møterom, bookingplattform Norge, kommunal booking, selskapslokale booking, idrettshall booking, kulturhus booking, Vipps booking, BankID booking, EHF, sesongleie"
        canonical={en ? "https://digilist.no/en/booking-av-lokaler-og-moterom" : "https://digilist.no/booking-av-lokaler-og-moterom"}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          {
            name: c.crumb,
            url: "https://digilist.no/booking-av-lokaler-og-moterom",
          },
        ]}
        faq={c.faq}
        service
        howTo={{
          name: c.howToName,
          description: c.howToDescription,
          steps: c.howToSteps.map((s) => ({ name: s.name, text: s.text })),
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={c.rule} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    {c.h1}{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings: getFraunces("display"),
                      }}
                    >
                      {c.h1em}
                    </em>{" "}
                    · én norsk plattform.
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {c.lede}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href="https://app.digilist.no"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.ctaOpen}
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href={en ? "/en/book-demo" : "/book-demo"}
                    >
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Benefits grid */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  {/* Real <h2> (styled as the caption) so the benefit-card
                      <h3>s below don't skip straight from the hero <h1>
                      (H1→H3) and trip a11y.heading.skip. */}
                  <h2 className="editorial-mono-caption text-accent-text">
                    {c.whyRule}
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.whyKinds}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {BENEFITS.map(({ title, body }, bi) => {
                    const Icon = BENEFIT_ICONS[bi];
                    return (
                    <article
                      key={title}
                      className="bg-paper p-7 lg:p-9 flex flex-col"
                    >
                      <header className="flex items-center gap-3 mb-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy">
                          <Icon
                            className="h-5 w-5"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </span>
                        <h3
                          className="font-serif text-2xl text-ink leading-tight flex-1"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                          }}
                        >
                          {title}
                        </h3>
                      </header>
                      <p className="text-base text-ink leading-relaxed">
                        {body}
                      </p>
                    </article>
                  );
                  })}
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Use cases */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    {c.useRule}
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.useKinds}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
                  {USE_CASES.map((u, i) => {
                    const Icon = USE_CASE_ICONS[i];
                    return (
                      <Link
                        key={u.title}
                        to={u.href}
                        className="group bg-paper p-7 lg:p-9 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40 flex flex-col"
                      >
                        <header className="flex items-center gap-4 mb-4">
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy group-hover:bg-navy group-hover:text-on-navy transition-colors duration-quick ease-editorial">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3
                            className="font-serif text-2xl lg:text-3xl text-ink leading-tight flex-1 inline-flex items-center gap-2"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {u.title}
                          </h3>
                          <ArrowUpRight
                            className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                        </header>
                        <p className="text-base text-ink leading-relaxed flex-1">
                          {u.body}
                        </p>
                        <p className="mt-5 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                          {u.cta}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* How it works */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    {c.howRule}
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.howKinds}
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {c.steps.map((s, i) => (
                    <li
                      key={s.step}
                      className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${i > 0 ? "border-t border-rule" : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[2.5rem] lg:-left-[3.5rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 bg-paper border border-hairline-strong rounded-sm font-mono text-xs text-accent-text tabular-nums"
                      >
                        {s.step}
                      </span>
                      <div className="col-span-12 lg:col-span-4">
                        <h3
                          className="font-serif text-2xl lg:text-3xl text-ink"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                            lineHeight: 1.1,
                          }}
                        >
                          {s.title}
                        </h3>
                      </div>
                      <div className="col-span-12 lg:col-span-8">
                        <p className="text-base lg:text-lg text-ink leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* FAQ inline */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    {c.faqRule}
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.faqKinds}
                  </span>
                </div>
                <dl className="border-t border-rule">
                  {FAQ.map((f, idx) => (
                    <div
                      key={idx}
                      className="border-b border-rule py-7 lg:py-9 grid lg:grid-cols-12 gap-4 lg:gap-gutter"
                    >
                      <dt className="lg:col-span-5">
                        <h3
                          className="font-serif text-xl lg:text-2xl text-ink"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            lineHeight: 1.15,
                          }}
                        >
                          {f.question}
                        </h3>
                      </dt>
                      <dd className="lg:col-span-7">
                        <p className="text-base lg:text-lg text-ink leading-relaxed">
                          {f.answer}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-10 editorial-mono-caption">
                  {c.seeAlso}{" "}
                  <Link to={en ? "/en/bookingsystem-utleie" : "/bookingsystem-utleie"} className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]">{c.operatorLink}</Link>
                  ,{" "}
                  <Link to={en ? "/en/bookingsystem-kommune" : "/bookingsystem-kommune"} className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]">{c.municipalLink}</Link>{" "}
                  {c.orWord}{" "}
                  <LinkOrText en={en} to="/leie" className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]">{c.allVenuesLink}</LinkOrText>.
                </p>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Closing CTA */}
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
                      {c.ctaHeading}
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {c.ctaBody}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/book-demo"}>
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>

          {/* Pricing summary block */}
          <PricingSummaryBlock />
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BookingLokalerMoterom;
