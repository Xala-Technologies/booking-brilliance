// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RouteErrorBoundary from "./RouteErrorBoundary";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Every route below the homepage is React.lazy. Before this boundary a route
 * chunk that would not load threw all the way to the root, React unmounted the
 * tree, and the visitor got a blank page with nothing to click — the same
 * failure as geoqa #291, but for the whole page rather than one section.
 */
function Boom(): never {
  throw new Error(
    "Failed to fetch dynamically imported module: /assets/Blog-BuR9BW3m.js",
  );
}

function Nav() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate("/priser")}>
      videre
    </button>
  );
}

describe("RouteErrorBoundary", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  function tree(start: string) {
    return (
      <MemoryRouter initialEntries={[start]}>
        <nav aria-label="Hovedmeny">
          <a href="/">Digilist</a>
        </nav>
        <Nav />
        <RouteErrorBoundary>
          <Routes>
            <Route path="/blogg" element={<Boom />} />
            <Route path="/en/blogg" element={<Boom />} />
            <Route path="/priser" element={<h1>Priser</h1>} />
          </Routes>
        </RouteErrorBoundary>
      </MemoryRouter>
    );
  }

  it("keeps the page usable when a route will not render", async () => {
    await act(async () => root.render(tree("/blogg")));

    expect(container.textContent).toContain("Siden kunne ikke lastes");
    // Whatever the app renders outside the boundary is untouched. In the real
    // tree each page owns its own navbar, so the fallback also has to offer
    // its own way back — see the "Til forsiden" link.
    expect(container.querySelector("nav")).not.toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("speaks English on an /en route", async () => {
    await act(async () => root.render(tree("/en/blogg")));

    expect(container.textContent).toContain("This page could not be loaded");
  });

  it("recovers on the next navigation instead of staying broken", async () => {
    await act(async () => root.render(tree("/blogg")));
    expect(container.textContent).toContain("Siden kunne ikke lastes");

    await act(async () => {
      container.querySelector("button")!.click();
    });

    expect(container.textContent).toContain("Priser");
    expect(container.textContent).not.toContain("Siden kunne ikke lastes");
  });

  it("renders its children untouched when the route is fine", async () => {
    await act(async () => root.render(tree("/priser")));

    expect(container.textContent).toContain("Priser");
    expect(console.warn).not.toHaveBeenCalled();
  });
});
