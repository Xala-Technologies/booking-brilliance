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
 * renderToString emits the real content. Repeat until the output stabilises
 * (covers nested lazy) or a small cap is hit. This runs at build time only,
 * so the extra passes cost nothing at runtime.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

// /status and /transparens nest two React.lazy boundaries (ConvexScope,
// then the page component inside it) — the retry loop below only
// discovers the *inner* lazy import once the outer one has already
// resolved, so it needs its own dynamic import() to be triggered and
// awaited before it can settle. Under load that sequential discovery
// sometimes ran past the retry budget while still mid-import, shipping
// an empty <div id="root"> and pushing the real content behind a full
// client-side hydration (observed LCP render-delay: ~6s). Importing
// these modules directly (bypassing React) primes Node's module cache
// up front, so both lazy boundaries resolve on their first real attempt
// instead of racing disk I/O.
const warmupImports = Promise.all([
  import("./components/ConvexScope"),
  import("./pages/Status"),
  import("./pages/Transparens"),
]);

export async function render(url: string): Promise<string> {
  await warmupImports;
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < 5; pass++) {
    // Let any dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const next = renderToString(tree);
    if (next === html) break;
    html = next;
  }
  return html;
}
