import { useState, useEffect } from "react";
import { X, Cookie, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { applyConsent, initAnalytics, saveConsent } from "@/lib/analytics";

/**
 * The consent banner, and the only thing that may grant marketing storage.
 *
 * It used to write `localStorage["cookie-consent"]` and stop there — nothing
 * anywhere read the value back. Harmless while the site ran only Plausible,
 * which needs no consent; not harmless the moment a Google or Meta tag exists.
 * Every path now ends in `applyConsent`, including the decline paths, because
 * a recorded denial is itself the signal Google Consent Mode needs.
 */
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Re-applies a stored decision to the ad platforms on every load, and
    // returns true only when there is no decision to apply.
    if (initAnalytics()) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const decide = (analytics: "granted" | "denied", marketing: "granted" | "denied") => {
    applyConsent(saveConsent(analytics, marketing));
    setIsVisible(false);
  };

  const acceptCookies = () => decide("granted", "granted");
  // "Only necessary" declines measurement AND marketing. Closing the banner
  // without choosing is the same as declining — silence is never consent.
  const rejectCookies = () => decide("denied", "denied");
  const acceptAnalyticsOnly = () => decide("granted", "denied");

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Samtykke til informasjonskapsler"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up pointer-events-none"
    >
      <div className="container mx-auto md:px-8 lg:px-12 max-w-6xl">
        <div className="bg-card/95 dark:bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl p-6 md:p-8 pointer-events-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Left: Icon and Content */}
            <div className="flex gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">Vi bruker informasjonskapsler</h3>
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Nødvendige cookies gjør at nettsiden fungerer. Med ditt samtykke bruker vi i tillegg
                  statistikk‑ og markedsføringscookies fra Google og Meta, slik at vi kan måle hvilke
                  annonser som faktisk fører til en henvendelse. Du kan når som helst ombestemme deg.
                  Les mer i vår{" "}
                  <Link to="/cookies" className="text-primary hover:underline font-medium">
                    cookie-policy
                  </Link>
                  {" "}og{" "}
                  <Link to="/personvern" className="text-primary hover:underline font-medium">
                    personvernerklæring
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={rejectCookies}
                className="w-full sm:w-auto"
              >
                Kun nødvendige
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={acceptAnalyticsOnly}
                className="w-full sm:w-auto"
              >
                Kun statistikk
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={acceptCookies}
                className="w-full sm:w-auto shadow-lg shadow-primary/30"
              >
                Godta alle
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={rejectCookies}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Lukk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
