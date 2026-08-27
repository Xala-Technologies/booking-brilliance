import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";
import PageTransition from "@/components/PageTransition";
import { SectionRule, EditorialHeading } from "@/components/editorial";
import {
  fallbackSuggestions,
  getSearchCorpus,
  searchCorpus,
  KIND_LABEL,
  type SearchItem,
} from "@/lib/search/corpus";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { getFraunces } from "@/lib/fonts";

/**
 * The page search sends you to.
 *
 * Search had no destination: GlobalSearch was a dropdown and nothing else, so
 * pressing ↵ on a query that matched nothing did literally nothing (the
 * handler returned early on an empty result set) and a visitor who wanted to
 * see everything for a term had nowhere to go. geoqa #324 measured the same
 * gap from outside — no URL on the site ever matched search|sok|resultat.
 *
 * Deliberately `noindex, follow`: an internal search results page is thin,
 * infinitely variable content, and Google asks for exactly these to be kept
 * out of the index. `follow` because the hits themselves are real pages worth
 * crawling.
 *
 * The route is registered relatively in SiteRoutes, so this serves /sok and
 * /en/sok from one component, like every other page.
 */
export default function Sok() {
  const locale = localeFromPath(useLocation().pathname);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  // Built per render rather than memoised on `open` the way GlobalSearch does
  // it: arriving here IS the intent to search, so there is nothing to defer.
  const corpus = useMemo(() => getSearchCorpus(), []);
  const results = useMemo(
    () => (query.trim() ? searchCorpus(query, corpus) : []),
    [query, corpus],
  );
  const suggestions = query.trim() && results.length === 0 ? fallbackSuggestions() : [];

  const prefix = locale === "en" ? "/en" : "";
  /** Anchors ("#faq") only resolve on the homepage; send those there. */
  const hrefFor = (item: SearchItem) =>
    item.isAnchor ? `${prefix || "/"}${item.href}` : `${prefix}${item.href}`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={t(locale, "sokPage.title")}
        description={t(locale, "sokPage.description")}
        canonical={`https://digilist.no${prefix}/sok`}
        robots="noindex, follow"
      />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={`DIGILIST · ${t(locale, "sokPage.eyebrow")}`} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    {t(locale, "sokPage.h1")}{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      {query.trim() || t(locale, "sokPage.h1em")}
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {query.trim()
                      ? `${results.length} ${t(locale, results.length === 1 ? "sokPage.hit" : "sokPage.hits")}`
                      : t(locale, "sokPage.lede")}
                  </p>
                </div>
              </div>

              {/* A real form, so ↵ works here as well as in the navbar panel
                  and the query stays in the URL — a search you cannot link to
                  is a search you cannot share or come back to. */}
              <form
                role="search"
                className="border-t border-rule pt-6 pb-10 max-w-[640px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = new FormData(e.currentTarget).get("q");
                  setParams(
                    typeof value === "string" && value.trim() ? { q: value.trim() } : {},
                  );
                }}
              >
                <label htmlFor="sok-q" className="editorial-mono-caption text-ink-faint">
                  {t(locale, "sokPage.inputLabel")}
                </label>
                <div className="mt-2 flex gap-3">
                  <input
                    id="sok-q"
                    name="q"
                    type="search"
                    defaultValue={query}
                    key={query}
                    placeholder={t(locale, "search.placeholder")}
                    className="flex-1 border border-hairline-strong rounded-sm bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-faint focus:border-navy focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-sm bg-navy px-5 py-2 font-mono text-xs uppercase tracking-widest text-on-navy hover:bg-navy-soft transition-colors"
                  >
                    {t(locale, "sokPage.submit")}
                  </button>
                </div>
              </form>

              {query.trim() && results.length > 0 && (
                <ul className="border-t border-rule divide-y divide-rule">
                  {results.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={hrefFor(item)}
                        data-result={item.kind}
                        className="block py-4 px-1 flex items-start gap-4 hover:bg-paper-deep/60 transition-colors duration-quick ease-editorial"
                      >
                        <span className="font-mono text-[0.65rem] tracking-widest text-accent-text mt-1 min-w-[60px]">
                          {KIND_LABEL[item.kind]}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-sans text-base text-ink leading-snug">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="block text-sm text-ink-soft leading-snug mt-0.5">
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {suggestions.length > 0 && (
                <div className="border-t border-rule pt-6">
                  <p className="text-ink-soft measure">
                    {t(locale, "sokPage.noHits")}
                  </p>
                  <p className="mt-6 editorial-mono-caption text-ink-faint">
                    {t(locale, "search.tryInstead")}
                  </p>
                  <ul className="mt-3 divide-y divide-rule">
                    {suggestions.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={hrefFor(item)}
                          data-result={item.kind}
                          className="block py-3 px-1 text-ink hover:text-accent-text transition-colors"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Pricing summary block */}
          <PricingSummaryBlock />
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
