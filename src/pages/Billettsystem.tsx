import {
  Ticket,
  Percent,
  Gift,
  BadgePercent,
  QrCode,
  Wallet,
  BarChart3,
  RefreshCcw,
  Share2,
  CalendarPlus,
  ScanLine,
  Banknote,
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
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { CategoryVisual } from "@/components/CategoryVisual";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { ticketCopy } from "@/content/billettsystem";

const APP = "https://app.digilist.no";

export default function Billettsystem() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = ticketCopy(locale);
  const FEATURES = c.features;
  const STEPS = c.steps;
  const FAQ = c.faq;
  // Icons are presentation and pair with the translated entries by position.
  const FEATURE_ICONS = [Ticket, BadgePercent, Percent, Gift, Wallet, QrCode, BarChart3, Banknote, RefreshCcw];
  const STEP_ICONS = [CalendarPlus, BadgePercent, Share2, ScanLine];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/billettsystem" : "https://digilist.no/billettsystem"}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Billettsystem", url: "https://digilist.no/billettsystem" },
        ]}
        service
        faq={c.faq}
        howTo={{
          name: c.howToName,
          description:
            c.howToDescription,
          steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={c.rule} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    {c.h1}{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      {c.h1em}
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {c.lede}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/book-demo"}>
                      {c.ctaDemo}
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.ctaOpen}
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Ticket}
                    label={c.visualLabel}
                    src="/images/cat/konsert.jpg"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>

              {/* Explainer video */}
              <div className="mb-14 lg:mb-20">
                <VideoPlaceholder
                  label={c.filmLabel}
                  caption={c.filmCaption}
                />
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Features */}
              <div>
                <div className="flex items-baseline justify-between mb-8 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    {c.whatRule}
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                    {c.whatKinds}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {FEATURES.map((f, fi) => {
                    const Icon = FEATURE_ICONS[fi];
                    return (
                      <div key={f.title} className="bg-paper p-7">
                        <header className="flex items-center gap-3 mb-3">
                          <span className="flex-shrink-0 w-11 h-11 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3
                            className="font-serif text-2xl text-ink leading-tight flex-1"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {f.title}
                          </h3>
                        </header>
                        <p className="text-base text-ink leading-relaxed">
                          {f.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* How it works */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    {c.howRule}
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.howKinds}
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {STEPS.map((s, i) => {
                    const Icon = STEP_ICONS[i];
                    return (
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
                            className="font-serif text-2xl lg:text-3xl text-ink inline-flex items-center gap-3"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            <Icon
                              className="h-6 w-6 text-accent-text"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            {s.title}
                          </h3>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                          <p className="text-base lg:text-lg text-ink leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* FAQ */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    {c.faqRule}
                  </h2>
                </div>
                <dl className="divide-y divide-rule border-b border-rule">
                  {FAQ.map((q, i) => (
                    <div key={i} className="py-6 grid lg:grid-cols-12 gap-4">
                      <dt className="lg:col-span-5 font-serif text-xl text-ink leading-tight">
                        {q.question}
                      </dt>
                      <dd className="lg:col-span-7 text-base text-ink leading-relaxed">
                        {q.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
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
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
