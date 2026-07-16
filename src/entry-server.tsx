/**
 * SSR entry. Imported by scripts/prerender.mjs at build time. Renders the
 * AppShell with a StaticRouter so each route produces a string of HTML that
 * we can inject into the SPA shell. The client bundle still hydrates on
 * top of that HTML — this is just to give crawlers + AI scrapers the full
 * content without executing JS.
 *
 * renderToString is synchronous and renders React.lazy Suspense fallbacks
 * (our "Laster…" shell) instead of the real component, so lazily-imported
 * route pages like BlogPost would prerender with NO <h1>/<main>/content,
 * invisible to crawlers and a11y auditors. renderToPipeableStream's
 * onAllReady callback waits for every Suspense boundary — including the
 * route's dynamic import() — to actually resolve before we read the output,
 * which is deterministic regardless of how long the chunk takes to load.
 */
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { PassThrough } from "node:stream";
import { AppShell } from "./App";

export function render(url: string): Promise<string> {
  const tree = (
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>
  );
  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(tree, {
      onAllReady() {
        const chunks: Buffer[] = [];
        const writable = new PassThrough();
        writable.on("data", (chunk) => chunks.push(chunk));
        writable.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        writable.on("error", reject);
        pipe(writable);
      },
      onError: reject,
    });
  });
}
