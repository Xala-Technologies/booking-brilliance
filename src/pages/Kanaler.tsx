import { Link2, Wand2, FileCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { channelsCopy } from "@/content/kanaler";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const CHANNELS = ["Airbnb", "Booking.com", "Bookup", "Eventum", "Finn"];

const Kanaler = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = channelsCopy(locale);
  const SYNC_BENEFITS = c.benefits;
  // Icons are presentation, not copy, so they stay here and pair with the
  // translated steps by position. Putting them in the content module would
  // make every translator's file import from lucide-react.
  const STEP_ICONS = [Link2, Wand2, FileCheck];
  const FAQ = c.faq;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/kanaler" : "https://digilist.no/kanaler"}
        ogImage="https://digilist.no/og-image.png"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Kanaler & synk", url: "https://digilist.no/kanaler" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        {/* Hero */}
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
                  {c.ledeA}
                  <strong className="text-ink">{c.ledeStrong}</strong>
                  {c.ledeB}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href={en ? "/en/book-demo" : "/book-demo"}>
                    {c.ctaDemo}
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
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    {c.yourChannels}
                  </h2>
                  {c.specs.map((spec) => (
                    <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        {/* I. Two-way sync */}
        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.syncRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.syncH2}{" "}
                  <em className="italic">{c.syncH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.syncLede}
                </p>
              </div>
            </div>

            {/* Channel chips → hub */}
            <div className="rounded-lg border border-rule bg-paper p-8 lg:p-10 shadow-[0_14px_44px_-26px_rgba(10,18,40,0.4)] mb-10">
              <p className="editorial-mono-caption text-ink-faint text-center">
                Dine kanaler
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {CHANNELS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 shadow-[0_1px_2px_rgba(10,18,40,0.06)] px-4 py-2 text-sm font-medium text-ink"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="my-6 flex flex-col items-center gap-1.5 text-accent-text">
                <RefreshCw className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                <span className="editorial-mono-caption">Toveis synk · sanntid</span>
              </div>
              <div className="rounded-md border border-accent-text/30 bg-gradient-to-b from-paper to-paper-deep shadow-[inset_0_1px_0_hsl(0_0%_100%/0.5),0_2px_6px_-1px_rgba(10,18,40,0.12),0_14px_30px_-16px_rgba(10,18,40,0.3)] px-5 py-5 text-center">
                <p className="editorial-mono-caption text-accent-text">Digilist</p>
                <p
                  className="mt-1.5 font-serif text-xl lg:text-2xl text-ink"
                  style={{ letterSpacing: "-0.015em", lineHeight: 1.15 }}
                >
                  Én kalender, alltid oppdatert
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {SYNC_BENEFITS.map((item) => (
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

        {/* II. AI-agent import */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.importRule} />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  {c.importH2}{" "}
                  <em className="italic">{c.importH2em}</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  {c.importLede}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {c.steps.map(({ title, body }, i) => {
                const Icon = STEP_ICONS[i];
                return (
                <div
                  key={title}
                  className="group border border-rule rounded-sm bg-paper p-6 lg:p-7 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 shrink-0 inline-flex items-center justify-center bg-accent-text/10 ring-1 ring-accent-text/25 rounded-md text-accent-text transition-transform duration-normal ease-editorial group-hover:scale-105">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3
                      className="font-serif text-xl text-ink"
                      style={{ fontVariationSettings: getFraunces("sub"), letterSpacing: "-0.01em" }}
                    >
                      {title}
                    </h3>
                    <span className="ml-auto font-mono text-[0.7rem] tracking-widest text-ink-faint">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="text-base text-ink-soft leading-relaxed">{body}</p>
                </div>
              );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="editorial-mono-caption text-ink-faint">Kilder</span>
              {["Finn", "Airbnb", "Booking.com", "Eventum", c.allSources].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        {/* FAQ */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label={c.faqRule} />
            <EditorialHeading as="h2" size="section" className="mb-10">
              {c.faqLede}
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Kanaler;
