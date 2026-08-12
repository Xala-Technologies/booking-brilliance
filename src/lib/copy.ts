/**
 * Interface copy, per language.
 *
 * The English site is the Norwegian site with the language changed — same
 * components, same layout, same routes. That only works if the strings live
 * outside the components, so this is where the chrome's words go: the consent
 * banner, the navigation, the footer, the chat widget. Anything a visitor sees
 * on every page.
 *
 * **Not page body copy.** An article or a landing page is prose, not a bag of
 * labels, and forcing it through a key-value table produces the stilted
 * sentence-by-sentence translation that makes a site read as machine-made.
 * Those are translated as whole documents — the FAQ has `faq.en.ts`, and blog
 * posts have their own twin files.
 *
 * Keys are dotted and named for MEANING, not for the Norwegian words, so a
 * rewrite of the Norwegian does not orphan the key.
 */
import type { Locale } from "./i18n";

type Copy = Record<string, string>;

const nb: Copy = {
  // Consent — the first thing every visitor sees, and it was Norwegian on the
  // English site because it predates the translation entirely.
  // The region label is deliberately NOT the heading: a screen reader announces
  // the landmark before the heading, so "Consent to cookies" tells the listener
  // what the region is FOR, while the heading states what we do. Collapsing the
  // two lost that distinction and broke the test that pins it.
  "consent.regionLabel": "Samtykke til informasjonskapsler",
  "consent.title": "Vi bruker informasjonskapsler",
  "consent.body":
    "Nødvendige cookies gjør at nettsiden fungerer. Med ditt samtykke bruker vi i tillegg statistikk‑ og markedsføringscookies fra Google og Meta, slik at vi kan måle hvilke annonser som faktisk fører til en henvendelse. Du kan når som helst ombestemme deg.",
  "consent.readMoreIn": "Les mer i vår",
  "consent.cookiePolicy": "cookie-policy",
  "consent.privacyPolicy": "personvernerklæring",
  "consent.and": "og",
  "consent.acceptAll": "Godta alle",
  "consent.necessaryOnly": "Kun nødvendige",
  "consent.settings": "Innstillinger",
  "consent.readMore": "Les mer om cookies",
  "consent.analytics": "Analyse",
  "consent.analyticsHelp": "Hjelper oss å forstå hvordan siden brukes.",
  "consent.necessary": "Nødvendige",
  "consent.necessaryHelp": "Kreves for at nettsiden skal fungere. Kan ikke slås av.",
  "consent.save": "Lagre valg",

  // Chrome
  "nav.openPlatform": "Åpne plattformen",
  "nav.bookDemo": "Book demo",
  "nav.findVenues": "Finn ledige lokaler",
  "nav.talkToUs": "Snakk med oss",
  "nav.main": "Hovednavigasjon",
};

const en: Copy = {
  "consent.regionLabel": "Consent to cookies",
  "consent.title": "We use cookies",
  "consent.body":
    "Necessary cookies make the site work. With your consent we also use statistics and marketing cookies from Google and Meta, so we can measure which ads actually lead to an enquiry. You can change your mind at any time.",
  "consent.readMoreIn": "Read more in our",
  "consent.cookiePolicy": "cookie policy",
  "consent.privacyPolicy": "privacy statement",
  "consent.and": "and",
  "consent.acceptAll": "Accept all",
  "consent.necessaryOnly": "Necessary only",
  "consent.settings": "Settings",
  "consent.readMore": "Read more about cookies",
  "consent.analytics": "Analytics",
  "consent.analyticsHelp": "Helps us understand how the site is used.",
  "consent.necessary": "Necessary",
  "consent.necessaryHelp": "Required for the site to work. Cannot be turned off.",
  "consent.save": "Save choices",

  "nav.openPlatform": "Open the platform",
  "nav.bookDemo": "Book a demo",
  "nav.findVenues": "Find available venues",
  "nav.talkToUs": "Talk to us",
  "nav.main": "Main navigation",
};

const DICT: Record<Locale, Copy> = { nb, en };

/**
 * Look up a string.
 *
 * Falls back to Norwegian, then to the key itself. Never throws and never
 * renders empty: a missing translation should read as untranslated text, which
 * someone notices, rather than as a blank button, which looks like a broken
 * page and gets misdiagnosed.
 */
export function t(locale: Locale, key: string): string {
  return DICT[locale]?.[key] ?? nb[key] ?? key;
}

/** Every key, for the test that keeps the two languages in step. */
export function copyKeys(locale: Locale): string[] {
  return Object.keys(DICT[locale] ?? {});
}
