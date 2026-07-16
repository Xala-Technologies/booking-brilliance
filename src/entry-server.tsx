/**
 * SSR entry. Imported by scripts/prerender.mjs at build time. Renders the
 * AppShell with a StaticRouter so each route produces a string of HTML that
 * we can inject into the SPA shell. The client bundle still hydrates on
 * top of that HTML — this is just to give crawlers + AI scrapers the full
 * content without executing JS.
 *
 * renderToString is synchronous and renders React.lazy Suspense fallbacks
 * (our "Laster…" shell) instead of the real component — so lazily-imported
 * route pages like BlogPost would prerender with NO <h1>/<main>/content,
 * invisible to crawlers and a11y auditors. To fix this without giving up
 * client-side code-splitting, we render in a loop: the first pass triggers
 * the route's dynamic import(s) (rendering fallbacks); we await a macrotask
 * so the chunk resolves; React.lazy caches the resolved module, so the next
 * renderToString emits the real content. Repeat while the fallback marker is
 * still present, up to a generous cap — not just until two passes happen to
 * render identically, since a slow import() can produce the same fallback
 * output on consecutive passes and stop the loop before the chunk resolves
 * (this silently shipped several blog posts with no article body at all).
 * This runs at build time only, so the extra passes cost nothing at runtime.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

// RouteFallback's placeholder text (see App.tsx) — its presence means a
// lazy route chunk hasn't resolved yet and this pass isn't the real content.
const LOADING_MARKER = "Laster…";

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < 20 && html.includes(LOADING_MARKER); pass++) {
    // Let any dynamic import() kicked off during the last render resolve —
    // a real (if small) delay, since a cold import() reads/compiles from
    // disk and a 0ms timeout doesn't wait for that I/O to finish.
    await new Promise((resolve) => setTimeout(resolve, 10));
    html = renderToString(tree);
  }
  return html;
}
