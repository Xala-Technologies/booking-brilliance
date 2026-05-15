/**
 * SSR entry. Imported by scripts/prerender.mjs at build time. Renders the
 * AppShell with a StaticRouter so each route produces a string of HTML that
 * we can inject into the SPA shell. The client bundle still hydrates on
 * top of that HTML — this is just to give crawlers + AI scrapers the full
 * content without executing JS.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
  );
}
