import { Link } from "react-router-dom";
import {
  GlassWater,
  Users2,
  Trophy,
  Theater,
  ArrowUpRight,
  Search,
  CalendarCheck,
  Wallet,
  Warehouse,
  Cake,
  Presentation,
  Building2,
  Laptop,
  Dumbbell,
  Waves,
  Palette,
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
import {
  CategoryVisual,
  imageForSlug,
  bundledSrcSet,
} from "@/components/CategoryVisual";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { rentCopy } from "@/content/leie";
import { LinkOrText } from "@/components/LinkOrText";

const APP = "https://app.digilist.no";

// The hub links to a deep guide per category (/leie/<slug>). Each guide is an
// SEO landing page that funnels to the live platform via its own "finn ledig"
// CTA. Grouping mirrors the three ways people search: feiring, arbeid, aktivitet.
const Leie = () => {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const c = rentCopy(locale);
  const CATEGORY_GROUPS = c.groups;
  const STEPS = c.steps;
  const FAQ = c.faq;
  const STEP_ICONS = [Search, CalendarCheck, Wallet];
  // Icons pair with the translated items by their stable route, not by
  // position — the groups differ in length and a positional index would put
  // a swimming icon on a hobby club the first time a category moved.
  const ITEM_INDEX: Record<string, number> = {
    "/leie/selskapslokale": 0,
    "/leie/gaard": 1,
    "/leie/bursdagslokale": 2,
    "/leie/kulturhus": 3,
    "/leie/moterom": 4,
    "/leie/konferanselokale": 5,
    "/leie/kontorlokaler": 6,
    "/leie/coworking": 7,
    "/leie/idrettshall": 8,
    "/leie/padelbane": 9,
    "/leie/svommehall": 10,
    "/leie/hobbyklubb": 11,
  };
  const ITEM_ICONS = [GlassWater, Warehouse, Cake, Theater, Users2, Presentation, Building2, Laptop, Trophy, Dumbbell, Waves, Palette];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical={en ? "https://digilist.no/en/leie" : "https://digilist.no/leie"}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Leie", url: "https://digilist.no/leie" },
        ]}
        faq={c.faq}
        service
        howTo={{
          name: c.howToName,
          description: c.howToDescription,
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
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.ctaFind}
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="#slik">
                      {c.ctaHow}
                    </EditorialButton>
                  </div>
                  <p className="mt-4 editorial-mono-caption">
                    {c.rentOutPromptA}<em>{c.rentOutPromptEm}</em>{c.rentOutPromptB}{" "}
                    <Link
                      to={en ? "/en/bookingsystem-utleie" : "/bookingsystem-utleie"}
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      {c.rentOutLink}
                    </Link>
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={GlassWater}
                    label={c.visualLabel}
                    src="/images/cat/selskapslokale.jpg"
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
                  srcWebm="/videos/digilist-book-venue.webm"
                  src="/videos/digilist-book-venue.mp4"
                  poster="/videos/digilist-book-venue-poster.jpg"
                />
              </div>

              {/* Definition section - only for Norwegian */}
              {!en && (
                <div className="mb-14 lg:mb-20">
                  <h2
                    className="font-serif text-3xl lg:text-4xl text-ink mb-6"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                      lineHeight: 1.2,
                    }}
                  >
                    {c.definitionH2}
                  </h2>
                  <div className="space-y-4 max-w-3xl">
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {c.definitionP1}
                    </p>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {c.definitionP2}
                    </p>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {c.definitionP3}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Categories */}
              <div>
                <div className="flex items-baseline justify-between mb-8 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    {c.whatRule}
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    {c.whatKinds}
                  </span>
                </div>
                <div className="space-y-10 lg:space-y-14">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.label}>
                      <div className="flex items-baseline justify-between mb-4">
                        <h3 className="editorial-mono-caption text-ink">{group.label}</h3>
                        <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                          {group.meta}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                        {group.items.map((item) => {
                          const Icon = ITEM_ICONS[ITEM_INDEX[item.to] ?? 0];
                          const photo = imageForSlug(
                            item.to.split("/").filter(Boolean).pop() ?? "",
                          );
                          return (
                            <LinkOrText
                              en={en}
                              key={item.title}
                              to={item.to}
                              className="group bg-paper border border-rule rounded-2xl flex flex-col shadow-md transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-2xl hover:border-accent-text/40"
                            >
                              <div className="p-1.5 lg:p-2">
                                <div
                                  className="relative w-full overflow-hidden rounded-xl ring-1 ring-ink/10 bg-paper-deep"
                                  style={{ aspectRatio: "16 / 9" }}
                                >
                                  {photo ? (
                                    <img
                                      src={photo}
                                      srcSet={bundledSrcSet(photo)}
                                      sizes="(min-width: 640px) 45vw, 90vw"
                                      alt=""
                                      aria-hidden="true"
                                      className="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <CategoryVisual
                                      icon={Icon}
                                      aspect="16 / 9"
                                      variant="texture"
                                      className="!border-0 !rounded-none"
                                    />
                                  )}
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/0 to-ink/0"
                                  />
                                  <span className="absolute left-4 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-paper/90 backdrop-blur-sm border border-hairline-strong text-navy shadow-sm transition-transform duration-quick ease-editorial group-hover:-translate-y-0.5">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </div>
                              </div>
                              <div className="px-6 lg:px-7 pb-6 lg:pb-7 pt-1 flex flex-col flex-1">
                                <header className="flex items-center gap-3 mb-2">
                                  <h4
                                    className="font-serif text-2xl text-ink leading-tight flex-1"
                                    style={{
                                      fontVariationSettings: getFraunces("sub"),
                                      letterSpacing: "-0.015em",
                                    }}
                                  >
                                    {item.title}
                                  </h4>
                                  <ArrowUpRight
                                    className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                </header>
                                <p className="text-base text-ink leading-relaxed flex-1">
                                  {item.body}
                                </p>
                                <p className="mt-4 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                                  {c.readMore}
                                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                                </p>
                              </div>
                            </LinkOrText>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* How it works */}
              <div id="slik" className="scroll-mt-28">
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
                            <Icon className="h-6 w-6 text-accent-text" strokeWidth={1.5} aria-hidden="true" />
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

          <section className="py-12 lg:py-16 bg-paper border-t border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* FAQ */}
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
                {c.rentOutTail}{" "}
                <Link
                  to={en ? "/en/bookingsystem-utleie" : "/bookingsystem-utleie"}
                  className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                >
                  {c.rentOutLink}
                </Link>
              </p>
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
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.ctaFind}
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
};

export default Leie;
