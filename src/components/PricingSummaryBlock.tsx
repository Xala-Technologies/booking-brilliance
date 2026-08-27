import { Link, useLocation } from "react-router-dom";
import { getFraunces } from "@/lib/fonts";
import { localeFromPath } from "@/lib/i18n";

/**
 * Universal pricing summary for all marketing pages and blog posts.
 *
 * This block appears after the main content and before the closing CTA on every
 * marketing page and blog. The wording is locked and matches the live /priser
 * page. It explains the subscription model and the 6-month free offer.
 *
 * On /priser itself, it still shows the heading and body but omits the CTA link
 * to avoid a self-link. The full /priser page retains its long-form content.
 */
export function PricingSummaryBlock() {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const isPricingPage = location.pathname === "/priser" || location.pathname === "/en/priser";

  // Norwegian-first by design. English mirror is a future expansion point.
  if (locale === "en") {
    return null;
  }

  return (
    <section
      aria-labelledby="pricing-summary-heading"
      className="py-12 lg:py-16 bg-paper border-t border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
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
        <div className="space-y-4 max-w-3xl">
          <p className="text-base lg:text-lg text-ink leading-relaxed">
            Digilist er et abonnement, ikke en provisjon. Du betaler for å bruke
            plattformen og administrasjonspanelet. Ingen transaksjonsavgift, ingen
            kostnad per booking, og ingen andel av det du leier ut for.
          </p>
          <p className="text-base lg:text-lg text-ink leading-relaxed">
            Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Mindre
            aktører får egne tilpassede priser. De 100 første kundene får 6 måneder
            gratis, uten binding.
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
      </div>
    </section>
  );
}
