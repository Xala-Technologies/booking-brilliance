// @vitest-environment jsdom
import { Suspense, act, lazy } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChunkErrorBoundary } from "./ChunkErrorBoundary";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * geoqa #293: a lazy homepage section whose chunk never arrived rejected, the
 * rejection reached the root with no boundary in the way, and digilist.no came
 * back blank — no <nav>, no links, zero words. The rest of the page had already
 * loaded and rendered fine; it was thrown away with the section that failed.
 */
describe("ChunkErrorBoundary", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it("keeps the rest of the page when a lazy chunk fails to load", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const Unreachable = lazy(() =>
      Promise.reject(
        new TypeError(
          "Failed to fetch dynamically imported module: /assets/AiAgentsSection-Telrs1Bb.js",
        ),
      ),
    );

    await act(async () => {
      root.render(
        <div>
          <nav aria-label="Navigasjon">
            <a href="/leie">Leie</a>
          </nav>
          <ChunkErrorBoundary>
            <Suspense fallback={null}>
              <Unreachable />
            </Suspense>
          </ChunkErrorBoundary>
        </div>,
      );
    });

    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });

  it("renders its children untouched when nothing fails", async () => {
    await act(async () => {
      root.render(
        <ChunkErrorBoundary>
          <p>Én plattform for alt som leies ut</p>
        </ChunkErrorBoundary>,
      );
    });

    expect(container.textContent).toContain("Én plattform for alt som leies ut");
  });
});
