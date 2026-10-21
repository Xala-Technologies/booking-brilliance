import { Link, useLocation } from "react-router-dom";
import { formatPriceKr, PRIVATE_PLANS } from "@/content/pricing";
import { getFraunces } from "@/lib/fonts";
import { localeFromPath } from "@/lib/i18n";

function privatePlansInlineSummary(): string {
  const formatted = PRIVATE_PLANS.map(
    (plan) =>
      `${plan.name} (${formatPriceKr(plan.priceKr)}, ${plan.venues.replace(/\.$/, "")})`,
  );
  if (formatted.length <= 1) return formatted[0] ?? "";
  return `${formatted.slice(0, -1).join(", ")} og ${formatted[formatted.length - 1]}`;
}

function PricingSummaryHeading() {
  return (
    <h2
      id="pricing-summary-heading"
      className="font-serif text-3xl lg:text-4xl text-ink mb-6"
      style={{
        fontVariationSettings: getFraunces("section"),
        letterSpacing: "-0.015em",
        lineHeight: 1.2,
      }}
    >
      Hva Digilist koster — og hva vi ikke tar
    </h2>
  );
}

function PricingSummaryBody({ isPricingPage }: { isPricingPage: boolean }) {
  return (
    <>
      <div className="space-y-4 max-w-3xl">
        <p className="text-base lg:text-lg text-ink leading-relaxed">
          Digilist er et abonnement, ikke en provisjon. Du betaler for å bruke
          plattformen og administrasjonspanelet. Ingen transaksjonsavgift, ingen
          kostnad per booking, og ingen andel av det du leier ut for.
        </p>
        <p className="text-base lg:text-lg text-ink leading-relaxed">
          Private utleiere har tre publiserte månedsplaner: {privatePlansInlineSummary()}.
          Kommune og skreddersøm:{" "}
          <Link
            to="/book-demo"
            className="text-accent-text underline underline-offset-4 hover:text-ink transition-colors"
          >
            kontakt oss
          </Link>
          . De 100 første kundene får 6 måneder gratis, uten binding.
        </p>
      </div>
      {!isPricingPage && (
        <p className="mt-6">
          <Link
            to="/priser"
            className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px] text-base lg:text-lg"
          >
            Les mer om priser →
          </Link>
        </p>
      )}
    </>
  );
}

/**
 * Universal pricing summary for all marketing pages and blog posts.
 *
 * Wording is locked to match /priser. On /priser itself the self-link is omitted.
 *
 * `variant="inline"` drops the full-bleed `<section>`/`container` wrapper
 * (center-aligned, with its own `mx-auto` + `md:px-8 lg:px-12` padding) for a
 * plain block capped at the blog body's own `max-w-[68ch]` — used when a post
 * marks `<!-- price-block: shared -->` mid-article, inside the `.post-body`
 * column. Without this variant the full-width section's heading and border
 * land at the container's padded edge, not the narrower body column's edge,
 * so the two visibly misalign (e.g. at 1366px the section's left edge sits at
 * x=96 against the body's x=48). The footer usage after `</article>` keeps
 * the default `variant="section"`, where that full-bleed width is correct.
 */
export function PricingSummaryBlock({
  variant = "section",
}: { variant?: "section" | "inline" } = {}) {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const isPricingPage = location.pathname === "/priser" || location.pathname === "/en/priser";

  if (locale === "en") {
    return null;
  }

  if (variant === "inline") {
    return (
      <div aria-labelledby="pricing-summary-heading" className="max-w-[68ch] py-10 border-t border-rule">
        <PricingSummaryHeading />
        <PricingSummaryBody isPricingPage={isPricingPage} />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="pricing-summary-heading"
      className="py-12 lg:py-16 bg-paper border-t border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <PricingSummaryHeading />
        <PricingSummaryBody isPricingPage={isPricingPage} />
      </div>
    </section>
  );
}
