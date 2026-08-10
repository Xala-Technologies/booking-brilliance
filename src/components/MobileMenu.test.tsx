// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MobileMenu } from "./MobileMenu";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * XAL-1156: the drawer is always mounted (only translated off-screen when
 * closed), so its decorative logo <img> fetches on every page load whether
 * or not a visitor ever opens the menu. It must use the same 2.4KB
 * logo-64.webp Navbar/Footer already use for this mark, not the 147KB
 * logo.svg, which wasted ~108KB of transfer on every page.
 */
describe("MobileMenu logo asset", () => {
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
  });

  it("renders the drawer's decorative logo as logo-64.webp, not logo.svg", () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <MobileMenu />
        </MemoryRouter>,
      );
    });

    const img = container.querySelector('img[alt=""]');
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/logo-64.webp");
  });
});
