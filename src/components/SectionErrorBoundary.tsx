import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Keeps one failed subtree from taking the whole page down with it.
 *
 * The homepage's below-the-fold sections are React.lazy chunks (see
 * pages/Index.tsx). A lazy import that *rejects* — chunk 404 after a redeploy,
 * a filtered or flaky network, a proxy that drops the connection — throws
 * somewhere <Suspense> cannot help: Suspense handles the *pending* promise, not
 * a rejected one. With no error boundary above it, the error reaches the root
 * and React unmounts the whole tree, so one missing section chunk turns a fully
 * prerendered page into an empty <div id="root">.
 *
 * Measured on digilist.no from a Narvik egress (geoqa #295): one section chunk
 * failed to fetch ("Failed to fetch dynamically imported module:
 * .../AiAgentsSection-*.js") and the page went from prerendered content to 0
 * links, 0 words and no visible <nav>. The navbar, hero and marketplace tiles
 * are eagerly imported and had already rendered — they were unmounted along
 * with everything else.
 *
 * Catching here bounds the damage to the sections this wraps: navigation, hero
 * and the rest of the page stay on screen and stay navigable.
 */
interface SectionErrorBoundaryProps {
  children: ReactNode;
  /** Rendered in place of the failed subtree. Defaults to nothing at all. */
  fallback?: ReactNode;
  /** Names the subtree in the console warning, so the log says which one died. */
  label?: string;
}

interface SectionErrorBoundaryState {
  failed: boolean;
}

class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { failed: true };
  }

  // console.warn, not console.error: the page this leaves behind is a working
  // page, and an error-level log would report it as a broken one to anything
  // reading the console (our own audits included). The message is still there
  // for anyone debugging a missing section.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(
      `[SectionErrorBoundary] ${this.props.label ?? "section"} failed to render; the rest of the page is unaffected.`,
      error,
      info.componentStack,
    );
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default SectionErrorBoundary;
