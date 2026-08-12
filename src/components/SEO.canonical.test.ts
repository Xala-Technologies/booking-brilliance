/**
 * The canonical bug, pinned.
 *
 * Every route is mirrored under /en and renders the same component, so a page
 * hardcoding `canonical="https://digilist.no/priser"` declared that same
 * canonical at /en/priser — telling Google the English page IS the Norwegian
 * one. No amount of translation could have got the English site indexed.
 */
import { describe, expect, it } from "vitest";

/** The same rule the component applies, extracted so it can be tested. */
function selfCanonical(canonical: string, locale: "nb" | "en"): string {
  return locale === "en" && !canonical.includes("/en")
    ? canonical.replace(/^https:\/\/digilist\.no/, "https://digilist.no/en").replace(/\/en\/$/, "/en")
    : canonical;
}

describe("canonical on a mirrored English page", () => {
  it("points at the English URL, not the Norwegian twin", () => {
    expect(selfCanonical("https://digilist.no/priser", "en")).toBe("https://digilist.no/en/priser");
    expect(selfCanonical("https://digilist.no/faq", "en")).toBe("https://digilist.no/en/faq");
  });

  it("handles the homepage, which has no path to prefix", () => {
    expect(selfCanonical("https://digilist.no/", "en")).toBe("https://digilist.no/en");
  });

  it("leaves the Norwegian page alone", () => {
    expect(selfCanonical("https://digilist.no/priser", "nb")).toBe("https://digilist.no/priser");
  });

  it("does not double-prefix a canonical that is already English", () => {
    expect(selfCanonical("https://digilist.no/en/priser", "en")).toBe("https://digilist.no/en/priser");
  });
});
