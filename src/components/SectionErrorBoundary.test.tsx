// @vitest-environment jsdom
import { Suspense, act, lazy } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SectionErrorBoundary from "./SectionErrorBoundary";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * geoqa #295: from a Narvik egress the homepage's AiAgentsSection chunk failed
 * to fetch, and the page did not lose that section — it lost everything. The
 * run read 0 <a> elements and no visible <nav> on a page whose navbar and hero
 * are eagerly imported and had already rendered, because the rejected import()
 * threw past <Suspense> to the root and React unmounted the whole tree.
 *
 * The boundary's whole job is that the eagerly-rendered page survives a chunk
 * that never arrives, so that is what these assert.
 */
const failingLazy = () =>
  lazy(() => Promise.reject(new Error("Failed to fetch dynamically imported module")));

describe("SectionErrorBoundary", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    // React logs a caught error itself; keep the suite output readable.
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it("keeps the rest of the page rendered when a lazy chunk fails to load", async () => {
    const Broken = failingLazy();

    await act(async () => {
      root.render(
        <div>
          <nav>
            <a href="/leie">Leie</a>
            <a href="/priser">Priser</a>
          </nav>
          <SectionErrorBoundary label="homepage sections">
            <Suspense fallback={null}>
              <Broken />
            </Suspense>
          </SectionErrorBoundary>
        </div>,
      );
    });

    expect(container.querySelector("nav")).not.toBeNull();
    expect(container.querySelectorAll("a")).toHaveLength(2);
  });

  it("renders the fallback in place of the failed subtree", async () => {
    const Broken = failingLazy();

    await act(async () => {
      root.render(
        <SectionErrorBoundary label="footer" fallback={<p>fallback</p>}>
          <Suspense fallback={null}>
            <Broken />
          </Suspense>
        </SectionErrorBoundary>,
      );
    });

    expect(container.textContent).toBe("fallback");
  });

  it("renders its children untouched when nothing fails", async () => {
    await act(async () => {
      root.render(
        <SectionErrorBoundary label="footer">
          <p>real content</p>
        </SectionErrorBoundary>,
      );
    });

    expect(container.innerHTML).toBe("<p>real content</p>");
  });
});
