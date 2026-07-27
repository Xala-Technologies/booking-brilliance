// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import SEO from "./SEO";

// Silences React's "not configured to support act()" warning outside of a
// testing-library setup.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * SEO.tsx's hydration effect used to clear only its own previous
 * `[data-seo="true"]` scripts before re-injecting the JSON-LD graph, so the
 * prerendered `data-prerendered="true"` copy baked in by scripts/prerender.mjs
 * was never removed — every hydration doubled the Organization/WebSite/etc.
 * structured data in the live DOM.
 */
function ldJsonScripts() {
  return document.head.querySelectorAll('script[type="application/ld+json"]');
}

describe("SEO hydration keeps a single ld+json script", () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.head.innerHTML = "";
  });

  it("removes the prerendered script on first hydration instead of doubling it", () => {
    const prerendered = document.createElement("script");
    prerendered.setAttribute("type", "application/ld+json");
    prerendered.setAttribute("data-prerendered", "true");
    prerendered.textContent = "[]";
    document.head.appendChild(prerendered);

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<SEO title="Test page" />);
    });

    expect(ldJsonScripts().length).toBe(1);
    expect(document.head.contains(prerendered)).toBe(false);
  });

  it("stays at one script across repeated hydration renders", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(<SEO title="First" />);
    });
    expect(ldJsonScripts().length).toBe(1);

    act(() => {
      root.render(<SEO title="Second" />);
    });
    expect(ldJsonScripts().length).toBe(1);
  });
});
