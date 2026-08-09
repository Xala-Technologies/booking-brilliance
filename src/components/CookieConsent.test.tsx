// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CookieConsent from "./CookieConsent";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * XAL-1053: the banner's outer wrapper is `fixed bottom-0 left-0 right-0`,
 * spanning the full width of the viewport. Without `pointer-events-none` on
 * that wrapper, its transparent padding silently intercepts clicks meant for
 * whatever page content sits underneath it (e.g. the blog index's first post
 * row), even though nothing is visibly there.
 */
describe("CookieConsent doesn't block clicks on the page behind it", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it("keeps the full-bleed outer wrapper pointer-events-none once the banner appears", () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <CookieConsent />
        </MemoryRouter>,
      );
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const region = document.querySelector(
      '[aria-label="Samtykke til informasjonskapsler"]',
    );
    expect(region).not.toBeNull();
    expect(region!.className).toMatch(/\bpointer-events-none\b/);
  });

  it("keeps the visible card itself clickable", () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <CookieConsent />
        </MemoryRouter>,
      );
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const acceptButton = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Godta alle"),
    );
    expect(acceptButton).toBeTruthy();
    const card = acceptButton!.closest(".rounded-2xl");
    expect(card).not.toBeNull();
    expect(card!.className).toMatch(/\bpointer-events-auto\b/);
  });
});
