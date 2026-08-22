import { Component, type ReactNode } from "react";

/**
 * Keeps one unreachable JS chunk from blanking the whole page.
 *
 * The homepage's below-the-fold sections are behind React.lazy (Index.tsx), so
 * each one is a separate hashed chunk fetched after the entry bundle. When one
 * of those fetches never completes — a connection dropped mid-load — the import
 * promise rejects and React.lazy rethrows the rejection through render. With no
 * boundary above it, the rejection reaches the root, React unmounts the entire
 * tree, and what the visitor is left with is an empty document: no navbar, no
 * hero, no links, under a correct <title>. The one section that failed to load
 * takes the nine that already had everything they needed down with it.
 *
 * geoqa #293 read exactly that from Narvik on digilist.no:
 * "TypeError: Failed to fetch dynamically imported module:
 * https://digilist.no/assets/AiAgentsSection-Telrs1Bb.js", and with it a blank
 * screenshot, zero words, zero <a> elements, and no visible <nav>.
 *
 * Dropping the failed subtree to null is the same thing the Suspense fallback
 * around it already does while the chunk is in flight, and it costs the visitor
 * only the sections that genuinely did not arrive.
 */
interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  // console.warn, not console.error: a chunk that did not arrive is a network
  // fact about one visit, not a defect in the build, and the journeys that
  // assert no-console-errors should not fail on someone's flaky connection.
  componentDidCatch(error: unknown) {
    console.warn("[chunk] a lazy section failed to load and was skipped", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
