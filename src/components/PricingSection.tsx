import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  EditorialHeading,
  SectionRule,
  EditorialButton,
  EditorialCard,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { revealUp, viewportOnce } from "@/lib/motion";
import { TRANSLATED, localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

/**
 * Pricing on the homepage, for both audiences.
 *
 * The homepage had no pricing section at all — not a single mention of price —
 * while price was the most common thing anyone asked the assistant. Search
 * Console says why that matters in both directions: over the last period,
 * renting-a-venue queries took 53% of clicks and booking-system queries 27%,
 * so neither audience is a rounding error and a single price story would be
 * wrong for half the people who arrive.
 *
 * Hence two columns rather than a tier table. We publish no figures — the span
 * between a grendehus with one hall and a county with twenty-two schools makes
 * any single number wrong for nearly everyone — so what is published is the
 * thing that decides the number, said differently for each audience.
 *
 * The commercial facts here are the ones already in `content/pricing.ts` and
 * the FAQ, which the assistant also answers from. One source of truth, so a
 * change of policy cannot leave a stale claim behind on a surface someone
 * forgot about.
 */
export function PricingSection() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const href = (path: string) => (en ? (TRANSLATED[path] ?? path) : path);

  const assurances = [
    t(locale, "homePricing.noFee"),
    t(locale, "homePricing.noHidden"),
    t(locale, "homePricing.included"),
  ];

  const columns = [
    {
      label: t(locale, "homePricing.privateLabel"),
      title: t(locale, "homePricing.privateTitle"),
      body: t(locale, "homePricing.privateBody"),
    },
    {
      label: t(locale, "homePricing.publicLabel"),
      title: t(locale, "homePricing.publicTitle"),
      body: t(locale, "homePricing.publicBody"),
    },
  ];

  return (
    <section
      id="priser"
      className="py-14 lg:py-20 bg-paper border-y border-rule"
      aria-labelledby="home-pricing-heading"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label={t(locale, "homePricing.rule")} />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section" {...({ id: "home-pricing-heading" } as object)}>
              {t(locale, "homePricing.h2")}{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: getFraunces("section") }}
              >
                {t(locale, "homePricing.h2em")}
              </em>
              .
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className="text-lg text-ink-soft leading-relaxed">
              {t(locale, "homePricing.lede")}
            </p>
          </div>
        </div>

        {/* Two audiences, side by side. */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-gutter mb-8">
          {columns.map((col) => (
            <motion.div
              key={col.label}
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <EditorialCard className="h-full">
                <div className="p-2 lg:p-6">
                  <span className="editorial-mono-caption text-accent-text">
                    {col.label}
                  </span>
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink mt-3 mb-3"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {col.title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">
                    {col.body}
                  </p>
                </div>
              </EditorialCard>
            </motion.div>
          ))}
        </div>

        {/* The three claims that separate us, kept short — the pricing page
            carries the full argument. */}
        <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
          {assurances.map((a) => (
            <li key={a} className="inline-flex items-center gap-2 text-base text-ink">
              <Check className="h-4 w-4 text-accent-text shrink-0" aria-hidden="true" />
              {a}
            </li>
          ))}
        </ul>

        {/* The launch offer. Deliberately last: it is the reason to act now,
            not the reason to trust the pricing. */}
        <EditorialCard className="bg-accent-tinted">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
            <div className="lg:col-span-8">
              <span className="editorial-mono-caption text-accent-text inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t(locale, "homePricing.offerEyebrow")}
              </span>
              <h3
                className="font-serif text-2xl lg:text-3xl text-ink mt-3 mb-3"
                style={{
                  fontVariationSettings: getFraunces("sub"),
                  letterSpacing: "-0.015em",
                }}
              >
                {t(locale, "homePricing.offerTitle")}
              </h3>
              <p className="text-base lg:text-lg text-ink leading-relaxed">
                {t(locale, "homePricing.offerBody")}
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
              <EditorialButton variant="primary" size="lg" href={href("/book-demo")}>
                {t(locale, "homePricing.ctaDemo")}
              </EditorialButton>
            </div>
          </div>
        </EditorialCard>

        <p className="mt-8 text-base text-ink-soft leading-relaxed measure-wide">
          {t(locale, "homePricing.whyNoList")}
        </p>

        <p className="mt-6">
          <Link
            to={href("/priser")}
            className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
          >
            {t(locale, "homePricing.ctaPrices")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
