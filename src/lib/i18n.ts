/**
 * Locale, derived from the URL and nothing else.
 *
 * Digilist is Norwegian, and the site has been `lang="nb-NO"` with no hreflang,
 * no `/en` routes and no English content at all. The ambition is a booking
 * platform for Norway *and* beyond, and a site that cannot be read outside
 * Norway is a hard ceiling on that.
 *
 * ── Two rules this module exists to enforce ─────────────────────────────
 *
 * **1. A URL is one language, always.** `/en/pricing` is English for everyone,
 * forever; `/priser` is Norwegian for everyone, forever. Content is never
 * swapped based on who is asking — a page whose language depends on the visitor
 * cannot be linked, cached or crawled, and showing Googlebot something other
 * than the visitor sees is cloaking.
 *
 * Visitors ARE sent to their own language, but by REDIRECT rather than by
 * swapping content, and only from the homepage. See `preferredLocale` and
 * `shouldAutoRedirect` below for why the distinction is not pedantry: it is the
 * difference between a UK visitor landing in English and Googlebot being
 * bounced off every Norwegian page on the site.
 *
 * **2. A locale exists for a page only when that page is actually translated.**
 * Mirroring all 90 routes under `/en` before the content exists would publish
 * Norwegian text on English URLs. Google treats that as duplicate, low-quality
 * content — it would actively damage the ranking the translation is meant to
 * win. So `TRANSLATED` is a whitelist that grows as pages are written, and
 * `hreflangFor` emits a pair only for entries in it.
 */

export type Locale = "nb" | "en";

export const DEFAULT_LOCALE: Locale = "nb";
export const LOCALES: readonly Locale[] = ["nb", "en"];

/** The `lang` attribute and `og:locale` value for each locale. */
export const HTML_LANG: Record<Locale, string> = { nb: "nb-NO", en: "en" };
export const OG_LOCALE: Record<Locale, string> = { nb: "nb_NO", en: "en_US" };

/** What the language switcher calls each one, in its own language. */
export const LOCALE_LABEL: Record<Locale, string> = { nb: "Norsk", en: "English" };

export const SITE_ORIGIN = "https://digilist.no";

/**
 * Pages that exist in both languages, as `nb path → en path`.
 *
 * Deliberately explicit rather than a `/en` + path rule, because the English
 * paths should read as English: `/priser` pairs with `/en/pricing`, not
 * `/en/priser`. A Norwegian word in an English URL is a small thing that makes
 * a site feel machine-translated.
 *
 * ADD A PAGE HERE ONLY ONCE ITS ENGLISH VERSION IS WRITTEN. An entry with no
 * translation behind it produces an hreflang pointing at Norwegian text, which
 * is worse than having no English page at all.
 */
/**
 * Paths whose ENGLISH COPY has actually been written.
 *
 * Every route is now mirrored under `/en`, so `/en/anything` renders — but it
 * renders the Norwegian component until that page's copy is translated. This
 * set is what separates "the route exists" from "the page is in English", and
 * three things hang off it: hreflang is emitted only for these, the language
 * switcher only offers these, and every other `/en/*` page is served
 * `noindex` so Google never sees a Norwegian page at an English URL and files
 * the pair as duplicate content.
 *
 * Adding a page here is the last step of translating it, not the first.
 */
export const TRANSLATED_PATHS: ReadonlySet<string> = new Set([
  "/",
  "/priser",
  "/faq",
  "/om-oss",
  "/book-demo",
  "/cookies",
  "/tilgjengelighet",
  "/personvern",
  "/salgsvilkar",
  "/sikkerhet",
  "/verktoy/kapasitetskalkulator",
  "/verktoy/leiepriskalkulator",
  "/verktoy",
  "/kanaler",
  "/ai-agenter",
  "/bookingsystem-kommune",
  "/bookingsystem-utleie",
  "/billettsystem",
  "/lokaler-til-leie",
  "/booking-av-lokaler-og-moterom",
  "/leie",
  "/status",
  "/transparens",
  "/blogg",
  // "/priser" and "/faq" were listed here, and it was not true. The bespoke
  // English pages were deleted in favour of the mirror, which renders the
  // NORWEGIAN components at those URLs — so the site was declaring two
  // indexable English pages that served Norwegian prose, which is the exact
  // duplicate-content risk this whitelist exists to prevent. Their data now
  // switches by locale; they go back on the list when the prose does too.
]);

/** `nb path → en path`, derived. The English site mirrors the Norwegian slugs. */
export const TRANSLATED: Readonly<Record<string, string>> = Object.fromEntries(
  [...TRANSLATED_PATHS].map((p) => [p, p === "/" ? "/en" : `/en${p}`]),
);

/**
 * Whether an English URL should be indexed.
 *
 * False for a mirrored route whose copy is still Norwegian. Serving that page
 * `noindex` is the difference between a staged translation and a site that
 * tells Google it has ninety English pages when it has four.
 */
export function isIndexableEnglish(pathname: string): boolean {
  const path = normalise(pathname);
  if (localeFromPath(path) !== "en") return true;
  // English blog posts are real English prose. TRANSLATED_PATHS lists ROUTES,
  // so a post's nb twin (/blogg/<slug>) can never appear in it — which made
  // every English article `noindex` while robots.txt allowed /en/blogg and the
  // sitemap listed it. Only posts written in English get an /en/blogg/ URL.
  if (/^\/en\/blogg\/.+/.test(path)) return true;
  const nb = path === "/en" ? "/" : path.slice(3);
  return TRANSLATED_PATHS.has(nb);
}

/** The reverse map, built once. */
const EN_TO_NB: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(TRANSLATED).map(([nb, en]) => [en, nb]),
);

/** Strip a trailing slash so `/en/` and `/en` are the same page. */
function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

/**
 * Which locale a path is in.
 *
 * `/en` and anything beneath it is English; everything else is Norwegian. The
 * prefix check is on a path SEGMENT, so a Norwegian page that happens to start
 * with those letters — `/enkeltlokale` — is not mistaken for English.
 */
export function localeFromPath(pathname: string): Locale {
  const path = normalise(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "nb";
}

/**
 * The same page in the other locale, or null when it has no translation.
 *
 * Null is the honest answer and callers must handle it: the language switcher
 * hides itself rather than linking to a 404, and `hreflangFor` emits nothing
 * rather than claiming a translation that does not exist.
 */
export function alternatePath(pathname: string): string | null {
  const path = normalise(pathname);
  return TRANSLATED[path] ?? EN_TO_NB[path] ?? null;
}

export interface Hreflang {
  hrefLang: string;
  href: string;
}

/**
 * The hreflang set for a page: both languages plus `x-default`.
 *
 * Returns an empty array for an untranslated page. A lone self-referencing
 * hreflang tells a crawler nothing, and a pair pointing at an untranslated page
 * actively tells it something false.
 *
 * `x-default` points at Norwegian: this is a Norwegian company, and a visitor
 * with no language preference should land on the market we actually serve.
 */
export function hreflangFor(pathname: string): Hreflang[] {
  const path = normalise(pathname);
  const other = alternatePath(path);
  if (!other) return [];
  const locale = localeFromPath(path);
  const nb = locale === "nb" ? path : other;
  const en = locale === "en" ? path : other;
  return [
    { hrefLang: "nb-NO", href: `${SITE_ORIGIN}${nb}` },
    { hrefLang: "en", href: `${SITE_ORIGIN}${en}` },
    { hrefLang: "x-default", href: `${SITE_ORIGIN}${nb}` },
  ];
}

/** Every path that should be rendered and listed in the sitemap, both locales. */
export function translatedPaths(): string[] {
  return Object.values(TRANSLATED);
}

// ── Blog posts pair by frontmatter, not by this map ────────────────────────

/** Where each locale's blog lives. */
export const BLOG_BASE: Record<Locale, string> = { nb: "/blogg", en: "/en/blogg" };

/**
 * The blog is paired from post frontmatter, never from `TRANSLATED`.
 *
 * Every post is written in both languages, so the pairing is hundreds of
 * entries and grows daily. Keeping it in a hand-maintained map would guarantee
 * it goes stale, and a stale hreflang is worse than none: it promises a crawler
 * a translation that may have been renamed or never published.
 *
 * Each post declares `lang` and, on the English one, `translationOf` — the
 * Norwegian slug it mirrors. The Norwegian post carries nothing, so publishing
 * a translation never requires editing the original.
 */
export interface PostLocale {
  slug: string;
  lang: Locale;
  /** English posts only: the `slug` of the Norwegian post this translates. */
  translationOf?: string;
}

export function blogPath(slug: string, lang: Locale): string {
  return `${BLOG_BASE[lang]}/${slug}`;
}

/**
 * hreflang for one blog post, given the whole set.
 *
 * Empty when the post has no twin — a post whose translation has not been
 * written yet, or an English post whose Norwegian original was deleted.
 */
export function blogHreflang(post: PostLocale, all: readonly PostLocale[]): Hreflang[] {
  const nbSlug = post.lang === "nb" ? post.slug : post.translationOf;
  if (!nbSlug) return [];
  const en = all.find((p) => p.lang === "en" && p.translationOf === nbSlug);
  const nb = all.find((p) => p.lang === "nb" && p.slug === nbSlug);
  if (!en || !nb) return [];
  return [
    { hrefLang: "nb-NO", href: `${SITE_ORIGIN}${blogPath(nb.slug, "nb")}` },
    { hrefLang: "en", href: `${SITE_ORIGIN}${blogPath(en.slug, "en")}` },
    { hrefLang: "x-default", href: `${SITE_ORIGIN}${blogPath(nb.slug, "nb")}` },
  ];
}

/** Norwegian posts with no English twin yet — the translation backlog. */
export function untranslatedPosts(all: readonly PostLocale[]): string[] {
  const translated = new Set(
    all.filter((p) => p.lang === "en" && p.translationOf).map((p) => p.translationOf as string),
  );
  return all.filter((p) => p.lang === "nb" && !translated.has(p.slug)).map((p) => p.slug);
}


// ── Automatic locale, done in the one way that cannot cost us the rankings ──

/**
 * The locale this visitor's browser is asking for.
 *
 * `navigator.languages` in order, first recognised wins. Anything Norwegian —
 * `nb`, `nn`, or bare `no` — is Norwegian; everything else is English, because
 * English is the only other language the site has. A German visitor gets
 * English rather than nothing.
 *
 * Returns null when there is no navigator at all (SSR, prerender), so callers
 * cannot accidentally treat "unknown" as "English" during the server render and
 * bake the wrong language into static HTML.
 */
export function browserLanguages(): readonly string[] | null {
  // `window`, NOT `navigator`. Node 22 ships a global `navigator` whose
  // `language` is "en-US", so a `typeof navigator === "undefined"` guard passes
  // during the prerender and every static page gets built as though the visitor
  // were English. `window` is the signal that actually distinguishes a browser.
  if (typeof window === "undefined" || typeof navigator === "undefined") return null;
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

export function preferredLocale(languages: readonly string[] | null): Locale | null {
  if (!languages || languages.length === 0) return null;
  for (const raw of languages) {
    const tag = String(raw).toLowerCase();
    if (tag.startsWith("nb") || tag.startsWith("nn") || tag === "no" || tag.startsWith("no-")) {
      return "nb";
    }
    // Any other recognisable language tag means "not Norwegian", and English is
    // the only alternative we publish.
    if (/^[a-z]{2}(-|$)/.test(tag)) return "en";
  }
  return null;
}

/** Where a remembered choice is stored. A stored choice always wins. */
export const LOCALE_CHOICE_KEY = "digilist-locale";

export interface AutoRedirectInput {
  /** The path being visited. */
  pathname: string;
  /** What the browser asks for, or null when unknown. */
  preferred: Locale | null;
  /** A locale the visitor picked before, if any. */
  stored: Locale | null;
}

/**
 * Whether to send this visitor to the other language, and where.
 *
 * **Homepage: redirect only with an explicit choice, or to Norwegian.**
 *
 * digilist.no is a Norwegian product. Many visitors in Norway run browsers set
 * to `en-US` or `en-GB`, and auto-sending them to `/en` on every homepage visit
 * is the bug we hear about as "I always get English". Browser language alone
 * must therefore never redirect *to* English — only a stored `digilist-locale`
 * choice may do that.
 *
 * We still redirect Norwegian-preferring visitors off `/en` back to `/`, and we
 * still honour a stored choice in both directions.
 *
 * Googlebot crawls with an English `Accept-Language` and executes JavaScript.
 * A redirect that fired on every page would bounce it off `/priser`, `/faq`
 * and all 335 Norwegian blog posts to English equivalents that mostly do not
 * exist — deindexing the Norwegian site, which is the one currently earning
 * every visitor we have, in order to serve a market we have not entered yet.
 * Redirecting only the homepage is the behaviour Google documents as
 * acceptable, and limiting *outbound* redirects to explicit choices or a
 * Norwegian browser preference keeps that protection intact.
 */
export function shouldAutoRedirect(input: AutoRedirectInput): string | null {
  const path = normalise(input.pathname);
  if (path !== "/" && path !== "/en") return null;

  const current = localeFromPath(path);

  // Remembered choice always wins in both directions.
  if (input.stored === "en" && current === "nb") return alternatePath(path);
  if (input.stored === "nb" && current === "en") return alternatePath(path);

  // Browser preference alone: only pull Norwegian speakers off the English homepage.
  // Never auto-redirect to English — digilist.no defaults to Norwegian regardless
  // of whether the visitor's OS/browser is set to English (common in Norway).
  if (!input.stored && input.preferred === "nb" && current === "en") {
    return alternatePath(path);
  }

  return null;
}

/**
 * Whether to offer the translation as a banner rather than a redirect.
 *
 * True on a translated deep page the visitor is reading in the wrong language.
 * Offering beats redirecting here: the visitor may have been sent this exact
 * link by a colleague, and moving them without asking loses the page they came
 * for.
 */
export function shouldOfferSwitch(input: AutoRedirectInput): string | null {
  const path = normalise(input.pathname);
  if (path === "/" || path === "/en") return null;
  if (input.stored) return null;
  if (!input.preferred) return null;
  if (input.preferred === localeFromPath(path)) return null;
  return alternatePath(path);
}
