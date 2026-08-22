// @vitest-environment jsdom
import { act, lazy, Suspense } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LazySectionBoundary from "./LazySectionBoundary";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * geoqa #291 (run_1787135986789_narvik-desktop-browse-92, https://digilist.no):
 * a below-the-fold homepage chunk failed to fetch, the rejection reached the
 * root uncaught, and React unmounted everything — the "has navigation" check
 * saw no visible nav, the page had 0 links, and the screenshot was blank.
 * The nav must survive a chunk that will not load.
 */
describe("LazySectionBoundary", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    // React logs every boundary-caught error itself; keep the run readable.
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it("keeps the surrounding nav mounted when a lazy chunk fails to fetch", async () => {
    const BrokenSection = lazy(() =>
      Promise.reject(
        new Error(
          "Failed to fetch dynamically imported module: /assets/AiAgentsSection-Telrs1Bb.js",
        ),
      ),
    );

    await act(async () => {
      root.render(
        <div>
          <nav aria-label="Hovedmeny">
            <a href="/blogg">Blogg</a>
          </nav>
          <main>
            <LazySectionBoundary>
              <Suspense fallback={null}>
                <BrokenSection />
              </Suspense>
            </LazySectionBoundary>
          </main>
        </div>,
      );
    });

    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelectorAll("a").length).toBe(1);
    expect(console.warn).toHaveBeenCalled();
  });

  it("renders its children untouched when nothing throws", async () => {
    const WorkingSection = lazy(() =>
      Promise.resolve({ default: () => <p>seksjon</p> }),
    );

    await act(async () => {
      root.render(
        <LazySectionBoundary>
          <Suspense fallback={null}>
            <WorkingSection />
          </Suspense>
        </LazySectionBoundary>,
      );
    });

    expect(container.textContent).toContain("seksjon");
  });
});
