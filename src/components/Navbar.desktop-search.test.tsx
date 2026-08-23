// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Navbar from "./Navbar";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The search box was `hidden md:flex lg:hidden` — visible only in the narrow
 * md–lg band — on the assumption that the desktop assistant rail replaced it
 * at `lg+`. The rail is a chat panel, not a search box, so every real desktop
 * width had no way to search the site. Its wrapper must not re-acquire a
 * `hidden` at any desktop breakpoint.
 */
describe("Navbar search box on desktop", () => {
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

  it("does not hide the search box at lg, xl or 2xl", () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>,
      );
    });

    const input = container.querySelector('input[type="search"]');
    expect(input).not.toBeNull();

    const wrapper = input?.closest("div.hidden");
    expect(wrapper).not.toBeNull();
    const classes = (wrapper?.className ?? "").split(/\s+/);
    expect(classes).toContain("md:flex");
    for (const breakpoint of ["lg", "xl", "2xl"]) {
      expect(classes).not.toContain(`${breakpoint}:hidden`);
    }
  });
});
