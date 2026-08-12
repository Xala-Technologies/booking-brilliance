import { describe, expect, it } from "vitest";
import { scrollActionFor } from "./scroll-target";

const exists = (...ids: string[]) => (id: string) => ids.includes(id);
const none = () => false;

describe("scrollActionFor", () => {
  it("goes to the top on an ordinary route change", () => {
    expect(scrollActionFor("", none)).toEqual({ kind: "top" });
    expect(scrollActionFor(undefined, none)).toEqual({ kind: "top" });
    expect(scrollActionFor(null, none)).toEqual({ kind: "top" });
    expect(scrollActionFor("#", none)).toEqual({ kind: "top" });
    expect(scrollActionFor("#   ", none)).toEqual({ kind: "top" });
  });

  it("targets the anchor when the element exists", () => {
    expect(scrollActionFor("#teknologi", exists("teknologi"))).toEqual({ kind: "anchor", id: "teknologi" });
    expect(scrollActionFor("samsvar", exists("samsvar"))).toEqual({ kind: "anchor", id: "samsvar" });
  });

  /**
   * THE BUG, as a rule. Measured on the live site: page at scrollY 800, click
   * the "Teknologi" FAQ anchor (section at 5631px), land at scrollY 0 with
   * location.hash === "#teknologi". A hash is an explicit request for a
   * position — overriding it with "go to top" is always wrong.
   */
  it("NEVER returns 'top' while a hash is present", () => {
    for (const hash of ["#teknologi", "#samsvar", "#priser", "#does-not-exist"]) {
      expect(scrollActionFor(hash, exists("teknologi", "samsvar", "priser")).kind, hash).not.toBe("top");
    }
  });

  /**
   * A hash whose target is missing must leave the page alone. Yanking the
   * reader to the top is the very behaviour being fixed, and it is worse than
   * doing nothing: it looks like the link "worked" and took them somewhere.
   */
  it("does nothing when the hash names an element that does not exist", () => {
    expect(scrollActionFor("#q-27", none)).toEqual({ kind: "none" });
    expect(scrollActionFor("#gone", exists("teknologi"))).toEqual({ kind: "none" });
  });

  it("decodes a percent-encoded hash", () => {
    expect(scrollActionFor("#samsvar%20og%20sikkerhet", exists("samsvar og sikkerhet"))).toEqual({
      kind: "anchor",
      id: "samsvar og sikkerhet",
    });
  });

  it("falls back to the raw value on a malformed escape rather than throwing", () => {
    expect(() => scrollActionFor("#%E0%A4%A", none)).not.toThrow();
    expect(scrollActionFor("#%E0%A4%A", exists("%E0%A4%A")).kind).toBe("anchor");
  });

  // The seven anchors the chatbot is now allowed to emit must all route.
  it("routes every real FAQ anchor", () => {
    const real = ["produkt", "funksjonalitet", "kommune", "samsvar", "teknologi", "priser", "support"];
    for (const id of real) {
      expect(scrollActionFor(`#${id}`, exists(...real))).toEqual({ kind: "anchor", id });
    }
  });
});
