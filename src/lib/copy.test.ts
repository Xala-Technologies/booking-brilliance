import { describe, expect, it } from "vitest";
import { copyKeys, t } from "./copy";

/**
 * The two dictionaries must stay in step. A key that exists in Norwegian and
 * not in English does not throw or render blank — it falls back to Norwegian,
 * which means a missing translation looks like a working page with one
 * stubbornly Norwegian sentence in it. That is exactly the failure mode a
 * person notices last and a test notices immediately.
 */
describe("copy dictionaries", () => {
  it("has the same keys in both languages", () => {
    const nb = copyKeys("nb").sort();
    const en = copyKeys("en").sort();
    const missingEn = nb.filter((k) => !en.includes(k));
    const extraEn = en.filter((k) => !nb.includes(k));
    expect(missingEn, "keys with no English translation").toEqual([]);
    expect(extraEn, "English keys with no Norwegian original").toEqual([]);
  });

  it("never returns an empty string", () => {
    for (const locale of ["nb", "en"] as const) {
      for (const key of copyKeys(locale)) {
        expect(t(locale, key).trim(), `${locale}.${key}`).not.toBe("");
      }
    }
  });

  it("actually differs between languages — a copied key is an untranslated one", () => {
    // Product names and a handful of shared words legitimately match; a large
    // overlap would mean someone pasted the Norwegian in.
    const identical = copyKeys("nb").filter((k) => t("nb", k) === t("en", k));
    // A handful legitimately match — 'FAQ', 'Cookies', and a standard name
    // like 'WCAG 2.1 AA' are the same word in both languages. The check is for
    // a LARGE overlap, which is what a paste-without-translating looks like.
    expect(identical.length, `identical strings: ${identical}`).toBeLessThan(6);
  });

  it("falls back rather than throwing on an unknown key", () => {
    expect(t("en", "does.not.exist")).toBe("does.not.exist");
  });
});
