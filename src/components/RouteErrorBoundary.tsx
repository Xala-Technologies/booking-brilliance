import React from "react";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";

/**
 * The last line of defence around the route tree.
 *
 * Every route except the homepage is React.lazy, and until now nothing caught
 * a lazy import that rejected: the error reached the root, React unmounted
 * the whole tree, and the visitor was left on a blank page with no nav to
 * click. lazyRoute() handles the common cause (a tab that outlived a deploy
 * asking for chunk names the current release no longer serves) by reloading
 * once. This boundary covers what is left: the reload already happened and
 * the chunk is still unreachable, or the page module itself threw while
 * rendering.
 *
 * It renders a small in-page message rather than nothing. Pages here each
 * render their own navbar, so a failed route takes the nav with it — hence
 * the fallback carries its own way out: reload, or back to the front page.
 * It resets on navigation, so a broken /blogg does not poison every route the
 * visitor tries afterwards.
 */

const COPY = {
  nb: {
    title: "Siden kunne ikke lastes",
    body: "Noe gikk galt da vi hentet denne siden. Last den inn på nytt, eller gå tilbake til forsiden.",
    reload: "Last inn på nytt",
    home: "Til forsiden",
    homeHref: "/",
  },
  en: {
    title: "This page could not be loaded",
    body: "Something went wrong while fetching this page. Reload it, or go back to the front page.",
    reload: "Reload",
    home: "Front page",
    homeHref: "/en",
  },
} as const;

type Props = {
  children: React.ReactNode;
  /** Changing this remounts the subtree — we pass the pathname. */
  resetKey: string;
};

class Boundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prev: Props) {
    // A new route deserves a fresh attempt; the old failure was about the old
    // chunk, not this one.
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  componentDidCatch(error: unknown) {
    // warn, not error: several geoqa journeys assert no-console-errors, and a
    // page that degraded gracefully should not also read as a broken one.
    console.warn("[route] failed to render", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const copy = COPY[localeFromPath(this.props.resetKey)];
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-2xl text-ink">{copy.title}</h1>
        <p className="max-w-prose text-sm text-ink-soft">{copy.body}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full border border-ink/20 px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            {copy.reload}
          </button>
          <a
            href={copy.homeHref}
            className="rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink transition-colors"
          >
            {copy.home}
          </a>
        </div>
      </div>
    );
  }
}

export default function RouteErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  return <Boundary resetKey={pathname}>{children}</Boundary>;
}
