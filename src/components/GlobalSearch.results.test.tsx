// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GlobalSearch } from "./GlobalSearch";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The search panel must always contain a result that can be opened.
 *
 * A visitor searched, the panel rendered, and there was nothing in it to click:
 * for a query that matched nothing the whole answer was "Ingen treff for «x»"
 * plus a chat link, and even a matching query produced rows that nothing
 * outside React could identify as results — they are buttons in a list, and so
 * is half the navbar. `data-result` is the handle; the suggestions are the
 * destination when the words missed.
 */
function LocationProbe() {
  const { pathname } = useLocation();
  return <span data-testid="path">{pathname}</span>;
}

function type(input: HTMLInputElement, value: string) {
  const setValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  act(() => {
    setValue?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("GlobalSearch results", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <GlobalSearch />
          <Routes>
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const input = () =>
    container.querySelector('input[type="search"]') as HTMLInputElement;
  const firstResult = () =>
    container.querySelector("[data-result]") as HTMLButtonElement | null;

  it("marks every hit as a result", () => {
    type(input(), "vipps");
    expect(container.querySelectorAll("[data-result]").length).toBeGreaterThan(0);
  });

  it("offers a result to open even when the query matches nothing", () => {
    // The literal placeholder a runner types when no term was supplied — a
    // string the site cannot contain, which is exactly the dead end.
    type(input(), "{query}");
    expect(container.textContent).toContain("Ingen treff");
    expect(firstResult()).not.toBeNull();
  });

  it("opens a page when the first result is clicked", () => {
    type(input(), "{query}");
    const target = firstResult();
    act(() => {
      target?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const path = container.querySelector('[data-testid="path"]')?.textContent;
    expect(path).not.toBe("/");
    expect(path?.startsWith("/")).toBe(true);
  });

  it("still opens the highlighted hit on Enter, and no suggestion", () => {
    // ↵ on a query that matched nothing must stay inert: teleporting a visitor
    // to a page they did not ask for is worse than the dead end.
    type(input(), "{query}");
    act(() => {
      input().dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });
    expect(container.querySelector('[data-testid="path"]')?.textContent).toBe("/");
  });
});
