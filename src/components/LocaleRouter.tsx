import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LOCALE_CHOICE_KEY,
  browserLanguages,
  preferredLocale,
  shouldAutoRedirect,
  shouldOfferSwitch,
  type Locale,
} from "@/lib/i18n";

function storedLocale(): Locale | null {
  try {
    const v = localStorage.getItem(LOCALE_CHOICE_KEY);
    return v === "en" || v === "nb" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Sends a visitor to their own language, in the one way that cannot cost us the
 * Norwegian rankings.
 *
 * **Homepage: redirect. Everywhere else: offer.**
 *
 * Googlebot crawls with an English `Accept-Language` and runs JavaScript. A
 * redirect that fired on every page would bounce it off /priser, /faq and 335
 * Norwegian blog posts toward English versions that mostly do not exist —
 * deindexing the site that earns every visitor we have today, in order to serve
 * a market we have not entered yet. Redirecting only the homepage is the
 * behaviour Google documents as acceptable, and it catches the case that
 * actually matters: someone in the UK or Canada arriving at digilist.no.
 *
 * On a deep page the visitor gets a dismissible bar instead. They may have been
 * sent that exact link by a colleague, and moving them without asking loses the
 * page they came for.
 *
 * `replace: true` on the redirect keeps the wrong-language URL out of history,
 * so Back does not bounce them straight into the redirect again.
 */
export function LocaleRouter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const input = {
      pathname,
      preferred: preferredLocale(browserLanguages()),
      stored: storedLocale(),
    };
    const to = shouldAutoRedirect(input);
    if (to) {
      navigate(to, { replace: true });
      return;
    }
    setOffer(shouldOfferSwitch(input));
  }, [pathname, navigate]);

  if (!offer || dismissed) return null;

  const english = offer.startsWith("/en");

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 border-t border-rule bg-paper/95 backdrop-blur px-4 py-3"
      role="region"
      aria-label={english ? "Language" : "Språk"}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink">
          {english
            ? "This page is also available in English."
            : "Denne siden finnes også på norsk."}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to={offer}
            onClick={() => {
              try {
                localStorage.setItem(LOCALE_CHOICE_KEY, english ? "en" : "nb");
              } catch {
                // Preference lost, navigation kept.
              }
            }}
            className="text-sm font-medium underline underline-offset-4"
          >
            {english ? "Read in English" : "Les på norsk"}
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-sm text-ink-soft hover:text-ink"
          >
            {english ? "Dismiss" : "Lukk"}
          </button>
        </div>
      </div>
    </div>
  );
}
