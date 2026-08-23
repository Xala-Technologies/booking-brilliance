import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import {
  fallbackSuggestions,
  getSearchCorpus,
  searchCorpus,
  KIND_LABEL,
  type SearchItem,
} from "@/lib/search/corpus";
import { openChatbot } from "@/lib/chatbot/open";
import { cn } from "@/lib/utils";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

/**
 * Editorial global search — mirrors @digilist/ds SmartSearchBox interaction:
 * inline input + ⌘K hint + dropdown panel with tip chips (empty) or scored
 * results (typing) + keyboard navigation (↑/↓/↵/Esc).
 */

type Tip = { id: string; label: string; href?: string; action?: () => void };

/**
 * Built per language rather than at module scope, because a module-level
 * constant is evaluated once at import — before any locale exists — so the
 * labels would be frozen in whichever language happened to be compiled in.
 */
const tipGroupsFor = (locale: "nb" | "en"): Array<{ id: string; label: string; tips: Tip[] }> => [
  {
    id: "snarveier",
    label: t(locale, "search.shortcuts"),
    tips: [
      { id: "t-demo", label: t(locale, "nav.bookDemo"), href: "/book-demo" },
      { id: "t-chat", label: t(locale, "nav.talkToUs"), action: () => openChatbot({ mode: "chat" }) },
      { id: "t-blogg", label: t(locale, "search.blog"), href: "/blogg" },
      { id: "t-faq", label: "FAQ", href: "/faq" },
    ],
  },
  {
    id: "populare-sok",
    label: t(locale, "search.popular"),
    tips: [
      { id: "p-sesongleie", label: "Sesongleie" },
      { id: "p-vipps", label: "Vipps" },
      { id: "p-ssa-l", label: "SSA-L 2026" },
      { id: "p-bankid", label: "BankID" },
      { id: "p-ehf", label: "EHF" },
      { id: "p-kommune", label: "Kommune" },
    ],
  },
];

/**
 * One row in the panel — a hit, or a suggestion when nothing matched.
 *
 * `data-result` is the row's public handle. Everything else in the panel (the
 * tip chips, the chat link, the keyboard legend) is chrome, and from outside
 * React there was no way to tell a result apart from any of it: the rows are
 * buttons in a list, and so is half the navbar. Anything that has to find "the
 * results" — an automated journey that searches and then opens the first hit,
 * a browser extension, a test — had to guess at position instead.
 */
function ResultRow({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: SearchItem;
  active: boolean;
  onSelect: () => void;
  onHover?: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        data-result={item.kind}
        onClick={onSelect}
        onMouseEnter={onHover}
        aria-selected={active}
        className={cn(
          "w-full text-left px-4 py-3 flex items-start gap-4 transition-colors duration-quick ease-editorial",
          active ? "bg-paper-deep" : "hover:bg-paper-deep/60",
        )}
      >
        <span className="font-mono text-[0.65rem] tracking-widest text-accent-text mt-0.5 min-w-[60px]">
          {KIND_LABEL[item.kind]}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-sans text-base text-ink leading-snug truncate">
            {item.title}
          </span>
          {item.subtitle && (
            <span className="block text-sm text-ink-soft leading-snug mt-0.5 line-clamp-2">
              {item.subtitle}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function GlobalSearch() {
  const locale = localeFromPath(useLocation().pathname);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // -1 is "the visitor has not picked a row yet", and it is why ↵ has
  // somewhere to go. With the first hit pre-highlighted, ↵ always meant "open
  // hit #1", so submitting a search could not lead to the results page — the
  // search had no destination of its own at all. ↓ still lands on the first
  // hit, and ↵ on a highlighted row still opens it.
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // Deferred until the user actually opens search — every page mounts this
  // component (it's in the Navbar), so building the ~150-item corpus (blog
  // posts + FAQ entries) up front cost hydration time on every page view
  // for a feature most visits never use.
  const corpus = useMemo(() => (open ? getSearchCorpus() : []), [open]);
  const results = useMemo(
    () => (query.trim() ? searchCorpus(query, corpus) : []),
    [query, corpus],
  );
  // A query that matches nothing is still a visitor who wants something. The
  // panel used to answer them with one sentence and a chat link, so the search
  // had no destination in it at all.
  const suggestions = useMemo(
    () => (query.trim() && results.length === 0 ? fallbackSuggestions() : []),
    [query, results],
  );

  // Click outside → close
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // ⌘K / Ctrl-K → open + focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIdx(-1);
  }, [query]);

  const selectItem = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    if (item.action === "open-chatbot") {
      openChatbot({ mode: "chat" });
      return;
    }
    if (item.isAnchor) {
      // In-page anchor — only meaningful on homepage
      if (location.pathname === "/") {
        const el = document.querySelector(item.href);
        if (el)
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", item.href);
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
      return;
    }
    navigate(item.href);
  };

  /**
   * Submitting the search — ↵ with no row highlighted, or the search button.
   *
   * Everything the panel offers is a jump straight to one page, so before this
   * there was no URL that meant "I searched for x": submitting left the
   * visitor exactly where they were, on a page that says nothing about their
   * search. `/sok?q=` is that URL, and it can be linked, reloaded and gone
   * back to like any other page.
   */
  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/sok?q=${encodeURIComponent(q)}`);
  };

  const onTip = (tip: Tip) => {
    setOpen(false);
    if (tip.action) {
      tip.action();
      return;
    }
    if (tip.href) {
      navigate(tip.href);
      return;
    }
    // Pure search seed — keep the panel open but populate query
    setQuery(tip.label);
    setOpen(true);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      // A row the visitor actually highlighted takes ↵ over. Otherwise ↵
      // submits the search and lands on its results page — which is what ↵ in
      // a search box means everywhere else. Handled here rather than left to
      // the form's implicit submission so the behaviour does not depend on
      // which element happens to be focused inside the box.
      const item = results[selectedIdx];
      if (item) selectItem(item);
      else submitSearch();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  const showTips = !query.trim();

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] xl:max-w-[480px]"
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className={cn(
          "flex items-center gap-2.5 border border-hairline-strong rounded-sm bg-paper px-3 py-2 transition-colors duration-quick ease-editorial",
          open ? "border-navy" : "hover:border-ink",
        )}
      >
        <button
          type="submit"
          aria-label={t(locale, "search.submit")}
          className="text-ink-faint hover:text-ink shrink-0 leading-none"
        >
          <Search className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={t(locale, "search.placeholder")}
          aria-label={t(locale, "search.label")}
          className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none min-w-0"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Tøm søk"
            className="text-ink-faint hover:text-ink text-lg leading-none px-1"
          >
            ×
          </button>
        ) : (
          <kbd
            // Only where the box is wide enough to spare the room: at `xl`
            // the navbar shares the centre column with the inline nav, so the
            // hint would eat the placeholder. The shortcut still works.
            className="hidden 2xl:inline-flex items-center font-mono text-[0.65rem] tracking-widest text-ink-faint border border-rule rounded-sm px-1.5 py-0.5"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        )}
      </form>

      {open && (
        <div
          role="dialog"
          aria-label="Søkeresultater"
          className="absolute left-0 right-0 min-w-[20rem] mt-2 bg-paper border border-hairline-strong rounded-sm shadow-2xl max-h-[70vh] overflow-y-auto z-50"
        >
          {showTips ? (
            <div className="p-4 space-y-5">
              {tipGroupsFor(locale).map((group) => (
                <div key={group.id}>
                  <p className="editorial-mono-caption text-ink-faint mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tips.map((tip) => (
                      <button
                        key={tip.id}
                        type="button"
                        onClick={() => onTip(tip)}
                        className="font-sans text-xs px-3 py-1.5 border border-rule rounded-full text-ink hover:bg-paper-deep hover:border-ink transition-colors duration-quick ease-editorial"
                      >
                        {tip.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="editorial-mono-caption text-ink-faint pt-2 border-t border-rule">
                <span className="font-mono">↑↓</span> bla ·{" "}
                <span className="font-mono">↵</span> velg ·{" "}
                <span className="font-mono">esc</span> lukk
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-1">
              <div className="px-4 pt-4 pb-3 text-center">
                <p className="text-base text-ink-soft">
                  Ingen treff for «{query}».
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    openChatbot({ mode: "chat" });
                  }}
                  className="mt-3 inline-block font-sans text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                >
                  Spør oss direkte i chat ↗
                </button>
              </div>
              <p className="editorial-mono-caption text-ink-faint px-4 pt-3 pb-1 border-t border-rule">
                {t(locale, "search.tryInstead")}
              </p>
              {/* Not keyboard-selectable, and deliberately: ↵ opens the
                  highlighted hit, and a suggestion is not one. Nothing the
                  visitor asked for should be reachable by pressing Enter on a
                  query that matched none of it. */}
              <ul role="listbox" className="py-1">
                {suggestions.map((item) => (
                  <ResultRow
                    key={item.id}
                    item={item}
                    active={false}
                    onSelect={() => selectItem(item)}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="py-1">
              <ul role="listbox">
                {results.map((item, i) => (
                  <ResultRow
                    key={item.id}
                    item={item}
                    active={i === selectedIdx}
                    onSelect={() => selectItem(item)}
                    onHover={() => setSelectedIdx(i)}
                  />
                ))}
              </ul>
              {/* The panel shows the top hits; this is the same search as a
                  page. Outside the listbox on purpose — it is not one of the
                  options ↑↓ walks. */}
              <button
                type="button"
                onClick={submitSearch}
                className="w-full text-left px-4 py-3 border-t border-rule font-sans text-xs uppercase tracking-widest text-accent-text hover:bg-paper-deep/60 transition-colors duration-quick ease-editorial"
              >
                {t(locale, "search.seeAll")} «{query}» →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
