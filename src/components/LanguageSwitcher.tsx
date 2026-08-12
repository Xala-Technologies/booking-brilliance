import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  LOCALE_CHOICE_KEY,
  LOCALE_LABEL,
  alternatePath,
  localeFromPath,
  type Locale,
} from "@/lib/i18n";

/**
 * The link to this page in the other language.
 *
 * Renders NOTHING when the current page has no translation. A switcher that is
 * always visible has to send the visitor somewhere when the page they are on
 * does not exist in the other language — either to a 404 or to the other
 * homepage, and both are worse than the button not being there. Its absence is
 * honest: this page is not translated yet.
 *
 * Clicking stores the choice. That is the whole point of storing it: from then
 * on the automatic redirect must never overrule them, in either direction.
 * Someone who deliberately clicked "Norsk" and gets dragged back to English on
 * their next visit experiences a broken site, not a helpful one.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { pathname } = useLocation();
  const other = alternatePath(pathname);
  if (!other) return null;

  const target: Locale = localeFromPath(pathname) === "nb" ? "en" : "nb";

  const remember = () => {
    try {
      localStorage.setItem(LOCALE_CHOICE_KEY, target);
    } catch {
      // A blocked localStorage costs the visitor a remembered preference, not
      // the navigation. Never let it stop the link.
    }
  };

  return (
    <Link
      to={other}
      onClick={remember}
      className={`inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors ${className}`}
      hrefLang={target === "en" ? "en" : "nb-NO"}
      aria-label={`Switch to ${LOCALE_LABEL[target]}`}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      {LOCALE_LABEL[target]}
    </Link>
  );
}
