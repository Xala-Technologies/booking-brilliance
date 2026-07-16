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
 * the route's dynamic import(s) (rendering fallbacks); we wait for the
 * chunk to resolve; React.lazy caches the resolved module, so the next
 * renderToString emits the real content. Repeat until the output stabilises
 * and no longer shows a Suspense fallback (covers nested lazy), or a
 * wall-clock deadline is hit. The deadline (not a fixed pass count) matters:
 * a cold dynamic import() of an on-disk chunk is real file I/O + module
 * evaluation and can take longer than a couple of macrotask ticks, so a
 * small fixed pass count silently produced h1-less prerendered blog pages
 * for the first posts processed each build. This runs at build time only,
 * so the extra wait costs nothing at runtime.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

const SUSPENSE_FALLBACK_MARKER = "did not finish this Suspense boundary";

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (!html.includes(SUSPENSE_FALLBACK_MARKER)) {
      const next = renderToString(tree);
      if (next === html) break;
      html = next;
      continue;
    }
    // Let any dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, 10));
    html = renderToString(tree);
  }
  return html;
}
