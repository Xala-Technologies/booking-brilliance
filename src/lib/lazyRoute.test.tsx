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
    // React logs every boundary-caught error itself; keep the run readable.
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

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
    const Page = lazyRoute(() => Promise.reject(STALE), win);

    await render(<Page />);

    expect(reload).toHaveBeenCalledTimes(1);
    // The fallback holds while the document reloads — the visitor sees the
    // page loading, not an error flashing past.
    expect(container.textContent).toContain("Laster…");
    expect(errors).toEqual([]);
  });

  it("does not reload twice for the same stale deploy", async () => {
    const { win, reload } = fakeWindow();

    const First = lazyRoute(() => Promise.reject(STALE), win);
    await render(<First />);
    expect(reload).toHaveBeenCalledTimes(1);

    // A second failure moments later means the reload did not fix it. Reloading
    // again would loop the tab, so the error goes to the boundary instead.
    const Second = lazyRoute(() => Promise.reject(STALE), win);
    await render(<Second />);

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

    expect(errors.some(isStaleChunkError)).toBe(true);
  });
});
