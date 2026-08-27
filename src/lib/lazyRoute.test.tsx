// @vitest-environment jsdom
import React, { act, Suspense } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isStaleChunkError, lazyRoute, type ReloadWindow } from "./lazyRoute";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * A tab open across a deploy runs the old entry bundle, which asks for chunk
 * names the current release no longer has:
 *   GET /assets/Blog-BuR9BW3m.js → 404
 * Every route but the homepage is lazy, so this took the whole tree down and
 * clicking "Blogg" landed on a blank page.
 */
const STALE = new Error(
  "Failed to fetch dynamically imported module: https://digilist.no/assets/Blog-BuR9BW3m.js",
);

function fakeWindow() {
  const store = new Map<string, string>();
  const reload = vi.fn();
  const win: ReloadWindow = {
    location: { reload },
    sessionStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
  };
  return { win, reload };
}

/** Stands in for RouteErrorBoundary: records what reached it. */
class Catcher extends React.Component<
  { children: React.ReactNode; onError: (e: unknown) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? <p>feilside</p> : this.props.children;
  }
}

describe("isStaleChunkError", () => {
  it("matches how each engine words a missing chunk", () => {
    for (const message of [
      "Failed to fetch dynamically imported module: https://digilist.no/assets/Blog-BuR9BW3m.js",
      "error loading dynamically imported module: /assets/PageTransition-DzqVeFND.js",
      "Importing a module script failed.",
      "Unable to preload CSS for /assets/Blog-BuR9BW3m.css",
    ]) {
      expect(isStaleChunkError(new Error(message)), message).toBe(true);
    }
  });

  it("does not match a page module that threw on its own", () => {
    expect(isStaleChunkError(new TypeError("x is not a function"))).toBe(false);
    expect(isStaleChunkError(undefined)).toBe(false);
  });
});

describe("lazyRoute", () => {
  let container: HTMLDivElement;
  let root: Root;
  let errors: unknown[];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    errors = [];
    // The recovery waits on timers now — the retry before the reload, and the
    // grace the fallback holds for a reload that may never land. Faking them
    // keeps the suite instant and lets a test sit at each stage.
    vi.useFakeTimers();
    // React logs every boundary-caught error itself; keep the run readable.
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  /** Let a wait elapse and React re-render on what it settled into. */
  async function advance(ms: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  }

  async function render(node: React.ReactNode) {
    await act(async () => {
      root.render(
        <Catcher onError={(e) => errors.push(e)}>
          <Suspense fallback={<p>Laster…</p>}>{node}</Suspense>
        </Catcher>,
      );
    });
  }

  it("renders the page when the chunk loads", async () => {
    const { win, reload } = fakeWindow();
    const Page = lazyRoute(
      () => Promise.resolve({ default: () => <h1>Blogg</h1> }),
      win,
    );

    await render(<Page />);

    expect(container.textContent).toContain("Blogg");
    expect(reload).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
  });

  it("reloads once and stays suspended when the chunk is gone", async () => {
    const { win, reload } = fakeWindow();
    const factory = vi.fn(() => Promise.reject(STALE));
    const Page = lazyRoute(factory, win);

    await render(<Page />);
    // The retry comes first: one failed GET is not yet evidence the release
    // moved, so nothing is reloaded on the strength of it.
    expect(reload).not.toHaveBeenCalled();

    await advance(500);

    expect(factory).toHaveBeenCalledTimes(2);
    expect(reload).toHaveBeenCalledTimes(1);
    // The fallback holds while the document reloads — the visitor sees the
    // page loading, not an error flashing past.
    expect(container.textContent).toContain("Laster…");
    expect(errors).toEqual([]);
  });

  it("retries a chunk that only failed on the wire", async () => {
    const { win, reload } = fakeWindow();
    // geoqa #351: the request for the route's chunk failed at the network
    // level, Chrome worded it exactly like a deleted chunk, and the visitor
    // got a reload instead of the page. The file was there the whole time.
    let attempt = 0;
    const Page = lazyRoute(() => {
      attempt += 1;
      return attempt === 1
        ? Promise.reject(STALE)
        : Promise.resolve({ default: () => <h1>Lokaler til leie</h1> });
    }, win);

    await render(<Page />);
    await advance(500);

    expect(container.textContent).toContain("Lokaler til leie");
    expect(reload).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
  });

  it("stops holding the fallback when the reload never lands", async () => {
    const { win, reload } = fakeWindow();
    const Page = lazyRoute(() => Promise.reject(STALE), win);

    await render(<Page />);
    await advance(500);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("Laster…");

    // The reload was asked for and the document is still here, so it is not
    // coming: the network is down or the navigation was refused. Suspending
    // for good would leave a spinner and no heading on screen forever, which
    // is how #351 ended. The boundary gets it instead, and it renders one.
    await advance(9_000);

    expect(container.textContent).toContain("feilside");
    expect(errors.map(String).join()).toContain("Blog-BuR9BW3m.js");
  });

  it("does not reload twice for the same stale deploy", async () => {
    const { win, reload } = fakeWindow();

    const First = lazyRoute(() => Promise.reject(STALE), win);
    await render(<First />);
    await advance(500);
    expect(reload).toHaveBeenCalledTimes(1);

    // A second failure moments later means the reload did not fix it. Reloading
    // again would loop the tab, so the error goes to the boundary instead.
    const Second = lazyRoute(() => Promise.reject(STALE), win);
    await render(<Second />);
    await advance(500);

    expect(reload).toHaveBeenCalledTimes(1);
    expect(errors.map(String).join()).toContain("Blog-BuR9BW3m.js");
    expect(container.textContent).toContain("feilside");
  });

  it("rethrows a real error instead of reloading", async () => {
    const { win, reload } = fakeWindow();
    const Page = lazyRoute(
      () => Promise.reject(new TypeError("Cannot read properties of undefined")),
      win,
    );

    await render(<Page />);

    expect(reload).not.toHaveBeenCalled();
    expect(errors.map(String).join()).toContain(
      "Cannot read properties of undefined",
    );
  });

  it("never touches window during the SSR prerender", async () => {
    const Page = lazyRoute(() => Promise.reject(STALE), null);

    await render(<Page />);
    await advance(500);

    expect(errors.some(isStaleChunkError)).toBe(true);
  });
});
