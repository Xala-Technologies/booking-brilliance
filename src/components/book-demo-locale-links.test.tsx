// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Navbar from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import Footer from "./Footer";
import BookingsystemUtleie from "@/pages/BookingsystemUtleie";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function renderAt(path: string, ui: React.ReactElement) {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        {ui}
      </MemoryRouter>,
    );
  });
}

function bookDemoHrefs(): string[] {
  return [...container.querySelectorAll('a[href="/book-demo"], a[href="/en/book-demo"]')]
    .map((el) => el.getAttribute("href") ?? "");
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("book-demo links respect locale", () => {
  it("Navbar EN nav points Book demo at /en/book-demo", () => {
    renderAt("/en/bookingsystem-utleie", <Navbar />);
    const link = container.querySelector('a[href="/en/book-demo"]');
    expect(link?.textContent?.trim()).toBe("Book demo");
    expect(container.querySelector('a[href="/book-demo"]')).toBeNull();
  });

  it("Navbar NB nav keeps Book demo at /book-demo", () => {
    renderAt("/bookingsystem-utleie", <Navbar />);
    const link = container.querySelector('a[href="/book-demo"]');
    expect(link?.textContent?.trim()).toBe("Book demo");
    expect(container.querySelector('a[href="/en/book-demo"]')).toBeNull();
  });

  it("MobileMenu EN drawer and footer CTA use /en/book-demo", () => {
    renderAt("/en/bookingsystem-utleie", <MobileMenu />);
    const links = bookDemoHrefs();
    expect(links).toContain("/en/book-demo");
    expect(links.filter((h) => h === "/en/book-demo").length).toBeGreaterThanOrEqual(2);
    expect(links).not.toContain("/book-demo");
  });

  it("MobileMenu NB drawer keeps /book-demo", () => {
    renderAt("/bookingsystem-utleie", <MobileMenu />);
    const links = bookDemoHrefs();
    expect(links.every((h) => h === "/book-demo")).toBe(true);
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it("Footer EN CTA strip points Book demo at /en/book-demo", () => {
    renderAt("/en/bookingsystem-utleie", <Footer />);
    const link = container.querySelector('a[href="/en/book-demo"]');
    expect(link?.textContent?.trim()).toBe("Book demo");
    expect(container.querySelector('a[href="/book-demo"]')).toBeNull();
  });

  it("Footer NB CTA strip keeps Book demo at /book-demo", () => {
    renderAt("/bookingsystem-utleie", <Footer />);
    const link = container.querySelector('a[href="/book-demo"]');
    expect(link?.textContent?.trim()).toBe("Book demo");
    expect(container.querySelector('a[href="/en/book-demo"]')).toBeNull();
  });

  it("BookingsystemUtleie EN page CTAs use /en/book-demo", () => {
    renderAt("/en/bookingsystem-utleie", <BookingsystemUtleie />);
    const links = bookDemoHrefs();
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.every((h) => h === "/en/book-demo")).toBe(true);
  });

  it("BookingsystemUtleie NB page CTAs keep /book-demo", () => {
    renderAt("/bookingsystem-utleie", <BookingsystemUtleie />);
    const links = bookDemoHrefs();
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.every((h) => h === "/book-demo")).toBe(true);
  });
});
