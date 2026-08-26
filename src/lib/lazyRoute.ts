import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * React.lazy for route chunks, with recovery from a stale deploy.
 *
 * deploy.sh ships each build as its own release directory and flips
 * `current` to it atomically, so the moment a deploy lands the previous
 * release's hashed files stop being served. A tab that was opened before the
 * flip is still running the OLD entry bundle, which asks for chunk names that
 * only existed in the old release:
 *
 *   GET /assets/Blog-BuR9BW3m.js        404
 *   TypeError: Failed to fetch dynamically imported module:
 *              https://digilist.no/assets/Blog-BuR9BW3m.js
 *
 * Every route in App.tsx except the homepage is lazy, and the route-level
 * Suspense had no error boundary above it — so this rejection reached the
 * root and React unmounted the whole tree. Clicking "Blogg" in an
 * hours-old tab gave a blank page and nothing to click.
 *
 * The fix is a full document load: index.html is served `no-cache`, so a
 * reload picks up the current release's entry bundle and its chunk names,
 * and the same click then works. We reload at most once per 10s window
 * (recorded in sessionStorage) so a chunk that is genuinely unfetchable —
 * an offline visitor, a blocked request — surfaces as an error to the
 * boundary instead of reloading in a loop.
 *
 * Anything that is not a chunk-fetch failure is rethrown untouched: a page
 * whose module throws while evaluating is a real bug and must not be
 * papered over with a reload.
 *
 * A stale deploy is not the only way that import rejects, though, and the
 * two failures that are left both used to end on a page with nothing on it
 * — see RETRY_DELAY_MS and RELOAD_GRACE_MS below.
 */

/** Only one reload per window — past that, treat the failure as real. */
const RELOAD_GUARD_MS = 10_000;

/**
 * Try the chunk once more before assuming the release moved under us.
 *
 * The import can also reject because the request never reached the server —
 * one flaky hop, a dropped connection — and Chrome words that failure exactly
 * like a deleted chunk, so it landed on the stale-deploy path above. A chunk
 * that failed on the wire is usually still sitting there; the URL is hashed
 * and served immutable, so a second GET is free when it works and one extra
 * 404 when it does not.
 */
const RETRY_DELAY_MS = 400;

/**
 * How long the Suspense fallback may hold for a reload we asked for.
 *
 * index.html is `no-cache`, so a reload that is going to land lands well
 * inside this and the visitor never sees the timer. Past it the reload is not
 * coming — the network is still down, the navigation was refused — and a
 * promise that never settles is a "Laster…" that never ends: geoqa #351
 * caught a visitor stranded there after clicking a search result, with no
 * heading on the page and nothing to click. Rejecting instead hands the route
 * to RouteErrorBoundary, which renders a heading, a reload button and a link
 * back to the front page.
 */
const RELOAD_GRACE_MS = 8_000;

const RELOAD_KEY = "digilist:stale-chunk-reload";

/** setTimeout as a promise — used for both waits above. */
const after = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** The bits of `window` this needs, so tests can pass a fake. */
export type ReloadWindow = {
  location: { reload: () => void };
  sessionStorage: Pick<Storage, "getItem" | "setItem">;
};

/**
 * Did this import fail because the file isn't there, rather than because the
 * module blew up? Each engine words it differently, hence the alternation:
 * Chrome "Failed to fetch dynamically imported module", Firefox "error
 * loading dynamically imported module", Safari "Importing a module script
 * failed". Vite's preload helper adds the CSS variant.
 */
export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|unable to preload css/i.test(
    message,
  );
}

/**
 * Reload once to pick up the current release. Returns false when the caller
 * should rethrow instead: not a stale chunk, no window (SSR prerender), we
 * already reloaded moments ago, or sessionStorage is unavailable — without
 * somewhere to record the attempt there is nothing stopping a reload loop.
 */
export function recoverFromStaleChunk(
  error: unknown,
  win: ReloadWindow | null,
): boolean {
  if (!win || !isStaleChunkError(error)) return false;

  const now = Date.now();
  try {
    const last = Number(win.sessionStorage.getItem(RELOAD_KEY));
    if (Number.isFinite(last) && last > 0 && now - last < RELOAD_GUARD_MS) {
      return false;
    }
    win.sessionStorage.setItem(RELOAD_KEY, String(now));
  } catch {
    return false;
  }

  win.location.reload();
  return true;
}

/** The real window, or null under the SSR prerender (and in tests). */
const browserWindow = (): ReloadWindow | null =>
  typeof window === "undefined" ? null : window;

/**
 * Drop-in replacement for React.lazy on route-level imports.
 *
 * A chunk-fetch failure is retried once, because the commonest cause after a
 * stale deploy is a request that never arrived. Only if the retry fails too
 * do we reload for the current release, and the fallback ("Laster…") holds
 * while that reload lands — the visitor sees the page loading, not an error
 * they have no time to read. If it has not landed inside RELOAD_GRACE_MS it
 * is not going to, so the error goes to the boundary rather than leaving the
 * route suspended for good.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors React.lazy's own constraint
export function lazyRoute<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  win: ReloadWindow | null = browserWindow(),
): LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error: unknown) => {
      // Not a fetch failure: a module that threw while evaluating is a real
      // bug, and retrying it only throws it twice.
      if (!isStaleChunkError(error)) throw error;
      return after(RETRY_DELAY_MS)
        .then(factory)
        .catch((retryError: unknown) => {
          if (!recoverFromStaleChunk(retryError, win)) throw retryError;
          return after(RELOAD_GRACE_MS).then<{ default: T }>(() => {
            throw retryError;
          });
        });
    }),
  );
}
