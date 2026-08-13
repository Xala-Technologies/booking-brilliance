// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { LOCALE_CHOICE_KEY } from "@/lib/i18n";
import { UNTRANSLATED_PATH } from "@/lib/untranslated-fixture";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * These tests exist because of a specific failure, not for coverage.
 *
 * The switcher was written, imported into the Navbar, and never actually
 * rendered. 482 tests passed, `tsc` passed, and lint reported the unused import
 * only as a warning among forty others — so the site shipped bilingual with no
 * way for a visitor to switch. It was caught by a person asking "where is the
 * language toggle?", which is the worst way to find something.
 *
 * So the first test here does not check behaviour at all. It checks that the
 * component reaches the page.
 */

let container: HTMLDivElement;
let root: Root;

function render(ui: React.ReactNode, path: string) {
  act(() => {
    root.render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  localStorage.clear();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("LanguageSwitcher is actually on the page", () => {
  it("renders in the Footer on a translated page", () => {
    // The bug, pinned. If the element is removed from the Footer's JSX again,
    // this fails — which nothing did last time.
    render(<Footer />, "/blogg");
    const links = [...container.querySelectorAll("a")].filter(
      (a) => a.getAttribute("href") === "/en/blogg",
    );
    expect(links.length, "no link to the English page in the footer").toBeGreaterThan(0);
  });

  it("is absent from the Footer on a page with no translation", () => {
    render(<Footer />, UNTRANSLATED_PATH);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs.filter((h) => h?.startsWith("/en"))).toEqual([]);
  });
});

describe("LanguageSwitcher behaviour", () => {
  it("links to the other language and names it in that language", () => {
    render(<LanguageSwitcher />, "/blogg");
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/en/blogg");
    expect(link?.textContent).toContain("English");
    expect(link?.getAttribute("hreflang")).toBe("en");
  });

  it("points back to Norwegian from the English page", () => {
    render(<LanguageSwitcher />, "/en/blogg");
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/blogg");
    expect(link?.textContent).toContain("Norsk");
  });

  it("renders nothing at all when the page has no translation", () => {
    // Deliberate: a switcher that is always visible must send the visitor
    // somewhere when the page has no twin — a 404 or the other homepage, both
    // worse than the button not being there.
    render(<LanguageSwitcher />, UNTRANSLATED_PATH);
    expect(container.querySelector("a")).toBeNull();
  });

  it("remembers the choice, so the auto-redirect can never overrule it", () => {
    render(<LanguageSwitcher />, "/blogg");
    act(() => {
      container.querySelector("a")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(localStorage.getItem(LOCALE_CHOICE_KEY)).toBe("en");
  });
});

describe("the English nav does not drop the visitor back into Norwegian", () => {
  it("links only to pages that exist in English", () => {
    // The dead end this fixes: on /en the shared navbar rendered the Norwegian
    // one — Finn, Løsninger, Blogg, FAQ, Transparens — all pointing at
    // Norwegian pages, so clicking anything left English immediately.
    render(<Navbar />, "/en");
    const hrefs = [...container.querySelectorAll("a")]
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/"));
    const norwegianOnly = hrefs.filter(
      (h) => !h.startsWith("/en") && h !== "/book-demo" && h !== "/",
    );
    expect(norwegianOnly, `English nav links into Norwegian: ${norwegianOnly}`).toEqual([]);
  });

  it("keeps the full Norwegian nav on Norwegian pages", () => {
    render(<Navbar />, "/blogg");
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/blogg");
    expect(hrefs).toContain("/faq");
  });
});
