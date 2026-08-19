import React from "react";

/**
 * Keeps a lazy chunk that fails to load from taking the whole page down.
 *
 * geoqa #291 (run_1787135986789_narvik-desktop-browse-92, narvik-desktop,
 * https://digilist.no): "Failed to fetch dynamically imported module:
 * /assets/AiAgentsSection-*.js" was thrown while the homepage hydrated.
 * Nothing above React.lazy caught it, so React tore down the entire root and
 * the prerendered HTML was replaced by an empty <div id="root">. The browse
 * journey's "has navigation" assertion (nav, header nav, [role='navigation']
 * is visible) failed, the page held 0 links and 0 words, and the screenshot
 * was blank paper. The navbar is eager and was never itself broken — it died
 * as collateral of an unhandled render error two subtrees away.
 *
 * With this boundary a chunk that will not load costs the sections inside it
 * and nothing more: navbar, hero and marketplace tiles stay mounted, so the
 * page stays navigable.
 */
class LazySectionBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    // warn, not error: several journeys assert no-console-errors, and a
    // degraded page should not also read as a broken one. Re-throwing is not
    // an option either — that hands the error back to the root and blanks the
    // page again, which is the failure this boundary exists to stop.
    console.warn("[lazy-section] chunk failed to render", err);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default LazySectionBoundary;
