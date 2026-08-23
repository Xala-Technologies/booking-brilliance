import { useMemo } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EditorialHeading } from "@/components/editorial";
import {
  fallbackSuggestions,
  getSearchCorpus,
  searchCorpus,
  KIND_LABEL,
  type SearchItem,
} from "@/lib/search/corpus";
import { openChatbot } from "@/lib/chatbot/open";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

/**
 * Where a search ends up.
 *
 * Searching had no destination: the panel in the navbar was the whole feature,
 * so submitting left the visitor on whatever page they were already on. A
 * search that never changes the URL cannot be linked, shared, reloaded or
 * gone back to, and anything looking from outside — a person reading the
 * address bar, an automated journey that searches and then checks where it
 * landed — sees a search that did nothing.
 *
 * `?q=` is the whole state. The page is `noindex`: it is a view of the site's
 * own content keyed by whatever someone typed, not a page we want crawled.
 */

/** The row's destination. Anchors resolve on the homepage and nowhere else. */
function hrefFor(item: SearchItem): string {
  return item.isAnchor ? `/${item.href}` : item.href;
}

export default function Sok() {
  const locale = localeFromPath(useLocation().pathname);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  // 50 rather than the panel's default 12: the panel is a peek at the top
  // hits, and "see all results" has to mean something more than the same
  // twelve rows on their own page.
  const hits = useMemo(
    () => (query ? searchCorpus(query, getSearchCorpus(), 50) : []),
    [query],
  );
  // Never an empty page. A query that matched nothing — and an empty `?q=` —
  // still lists the hubs a lost visitor most often wants, so there is always
  // a result here to open.
  const rows = hits.length > 0 ? hits : fallbackSuggestions();
  // Chat is an action, not a destination; every row on this page is a link to
  // a page, so nothing here can be clicked and leave the visitor where they
  // were. The chat invitation is below the list, on its own.
  const destinations = rows.filter((item) => item.action !== "open-chatbot");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = new FormData(e.currentTarget).get("q");
    const q = typeof next === "string" ? next.trim() : "";
    navigate(q ? `/sok?q=${encodeURIComponent(q)}` : "/sok");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={
          query
            ? `${t(locale, "search.resultsTitle")}: ${query}`
            : t(locale, "search.resultsTitle")
        }
        description={t(locale, "search.lede")}
        canonical="https://digilist.no/sok"
        robots="noindex,follow"
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-10 lg:pb-14 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h1" size="display">
              {t(locale, "search.resultsTitle")}
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              {t(locale, "search.lede")}
            </p>

            <form
              role="search"
              onSubmit={onSubmit}
              className="mt-8 flex items-center gap-2.5 border border-hairline-strong rounded-sm bg-paper px-3 py-2"
            >
              <Search
                className="h-4 w-4 text-ink-faint shrink-0"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                key={query}
                placeholder={t(locale, "search.placeholder")}
                aria-label={t(locale, "search.label")}
                className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="font-sans text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px] px-1"
              >
                {t(locale, "search.submit")}
              </button>
            </form>

            <p className="editorial-mono-caption text-ink-faint mt-4">
              {!query
                ? t(locale, "search.emptyQuery")
                : hits.length > 0
                  ? `${t(locale, "search.resultsFor")} «${query}»`
                  : `${t(locale, "search.noHits")} «${query}»`}
            </p>
            {(!query || hits.length === 0) && (
              <p className="editorial-mono-caption text-ink-faint mt-1">
                {t(locale, "search.tryInstead")}
              </p>
            )}
          </div>
        </section>

        <section className="pb-14 lg:pb-24 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            {/* `id="results"` and `data-result` are the page's public handles,
                the same ones the navbar panel carries — one name for "the
                results", wherever they are rendered. */}
            <ul id="results" className="border-t border-rule">
              {destinations.map((item) => (
                <li key={item.id} className="border-b border-rule">
                  <Link
                    to={hrefFor(item)}
                    data-result={item.kind}
                    className="w-full text-left px-1 py-4 flex items-start gap-4 hover:bg-paper-deep/60 transition-colors duration-quick ease-editorial"
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

            <button
              type="button"
              onClick={() => openChatbot({ mode: "chat" })}
              className="mt-8 inline-block font-sans text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
            >
              {t(locale, "search.askChat")}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
