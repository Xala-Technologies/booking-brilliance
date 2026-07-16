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
 * (covers nested lazy) or a cap is hit. This runs at build time only, so
 * the extra passes cost nothing at runtime.
 *
 * The first ever render of a given lazy chunk in the process is the
 * expensive one (cold dynamic import() of that chunk, competing with the
 * CPU cost of re-running renderToString on this ~1MB SSR bundle each
 * pass) — measured at 30-36 passes to resolve. Every later render of the
 * same lazy component resolves on pass 0 since React.lazy caches it. The
 * cap below has margin over that measured cold-start cost.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

// Two consecutive passes can be byte-identical while BOTH are still the
// unresolved Suspense fallback (e.g. the chunk load spans more than one
// macrotask) — that false "stabilized" match was baking the loading
// skeleton (no <h1>) into the static file. Treat "still showing the
// fallback" as never stable so the loop keeps retrying up to the cap.
const isUnresolvedSuspense = (out: string): boolean =>
  out.includes("did not finish this Suspense boundary") ||
  out.includes(">Laster…<");

export async function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  let html = renderToString(tree);
  for (let pass = 0; pass < 60; pass++) {
    // Let any dynamic import() kicked off during the last render resolve.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const next = renderToString(tree);
    if (next === html && !isUnresolvedSuspense(next)) break;
    html = next;
  }
  return html;
}
