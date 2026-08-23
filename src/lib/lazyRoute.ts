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
 */

/** Only one reload per window — past that, treat the failure as real. */
const RELOAD_GUARD_MS = 10_000;
const RELOAD_KEY = "digilist:stale-chunk-reload";

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
 * On a stale-chunk failure the returned promise never settles, which holds
 * the Suspense fallback ("Laster…") on screen while the reload lands — the
 * visitor sees the page loading, not an error they have no time to read.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors React.lazy's own constraint
export function lazyRoute<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  win: ReloadWindow | null = browserWindow(),
): LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error: unknown) => {
      if (!recoverFromStaleChunk(error, win)) throw error;
      return new Promise<{ default: T }>(() => {});
    }),
  );
}
