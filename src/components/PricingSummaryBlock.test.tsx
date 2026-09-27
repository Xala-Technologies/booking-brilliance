// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { formatPriceKr } from "@/content/pricing";
import { PricingSummaryBlock } from "./PricingSummaryBlock";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function render(path: string) {
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <PricingSummaryBlock />
      </MemoryRouter>,
    );
  });
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

describe("PricingSummaryBlock", () => {
  it("renders the three locked monthly prices from pricing.ts", () => {
    render("/blogg/test-post");
    const text = container.textContent ?? "";

    expect(text).toContain(formatPriceKr(490));
    expect(text).toContain(formatPriceKr(790));
    expect(text).toContain(formatPriceKr(1290));
    expect(text).toContain("Small");
    expect(text).toContain("Medium");
    expect(text).toContain("Large");
  });

  it("links kommune and custom setups to /book-demo, same as /priser", () => {
    render("/blogg/test-post");
    const link = container.querySelector('a[href="/book-demo"]');
    expect(link?.textContent).toBe("kontakt oss");
  });

  it("links to /priser off the pricing page", () => {
    render("/blogg/test-post");
    const link = container.querySelector('a[href="/priser"]');
    expect(link?.textContent).toContain("Les mer om priser");
  });

  it("omits the self-link on /priser", () => {
    render("/priser");
    expect(container.querySelector('a[href="/priser"]')).toBeNull();
  });

  it("renders nothing on English routes", () => {
    render("/en/priser");
    expect(container.textContent?.trim()).toBe("");
  });
});
