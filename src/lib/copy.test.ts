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
    // Keys whose two languages are the same string BY DESIGN, each with its
    // reason. This was a count threshold ("fewer than 6 identical"), which
    // meant every legitimately-identical key spent budget that a genuinely
    // untranslated one would then slip in under. An allowlist keeps the signal
    // exact: a new identical key fails until someone says why it is allowed.
    const SHARED_BY_DESIGN: Record<string, string> = {
      "hero.trust2.sub": "a standard name, identical in both",
      "footer.faq": "'FAQ' is the same word in both",
      "footer.cookies": "'Cookies' is the same word in both",
      "cap.perPerson": "'m² per person' — a unit, identical in both",
      "cap.perPersonShort": "'per person.' — a unit, identical in both",
      "cap.for": "'for' is the same word in both",
      "pilot.role": "a registered company name",
      "pilot.date": "a place name and a year",
      "price.per": "'per' is the same word in both",
      // Norwegian place names. Listed one by one rather than exempting the
      // whole calc.city.* family, because calc.city.annet is NOT a place name
      // — it is "Annet / mindre sted" / "Elsewhere / a smaller place", and a
      // prefix rule would have let that one go untranslated unnoticed.
      "calc.city.oslo": "a Norwegian place name",
      "calc.city.bergen": "a Norwegian place name",
      "calc.city.trondheim": "a Norwegian place name",
      "calc.city.stavanger": "a Norwegian place name",
      "calc.city.kristiansand": "a Norwegian place name",
      "calc.city.tromso": "a Norwegian place name",
      "calc.city.drammen": "a Norwegian place name",
      "calc.city.baerum": "a Norwegian place name",
      "status.h1": "'Status.' is the same word in both",
      "status.type.app": "'App' is the same word in both",
      "status.type.api": "an initialism, identical in both",
      "status.type.status": "'Status' is the same word in both",
      "tr.areaSeo": "an initialism, identical in both",
      "tr.col.seo": "an initialism, identical in both",
      "tr.m.seo": "an initialism, identical in both",
    };

    const identical = copyKeys("nb")
      .filter((k) => t("nb", k) === t("en", k))
      .filter((k) => !(k in SHARED_BY_DESIGN));

    expect(
      identical,
      `identical in both languages and not allowlisted — translate them, or ` +
        `add them to SHARED_BY_DESIGN with a reason: ${identical.join(", ")}`,
    ).toEqual([]);
  });

  it("falls back rather than throwing on an unknown key", () => {
    expect(t("en", "does.not.exist")).toBe("does.not.exist");
  });
});

/**
 * Every key a component asks for must exist.
 *
 * `t()` falls back to the KEY when a translation is missing, which is right for
 * a missing translation and terrible for a missing key: the page renders the
 * literal string "footer.firmafest_og_julebord" to a visitor. That shipped —
 * 37 keys at once, from a bulk rename that outran the dictionary — and neither
 * tsc nor 737 tests noticed, because a string is a valid string.
 */
describe("no component asks for a key that does not exist", () => {
  it("every t(locale, ...) and labelKey resolves", async () => {
    const { readFileSync, readdirSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const p = join(dir, e);
        return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
      });
    const defined = new Set([...copyKeys("nb"), ...copyKeys("en")]);
    const missing = new Set<string>();
    for (const file of walk("src")) {
      const src = readFileSync(file, "utf-8");
      for (const re of [/t\(locale,\s*"([a-z][\w.]+)"\)/g, /labelKey:\s*"([a-z][\w.]+)"/g]) {
        for (const m of src.matchAll(re)) if (!defined.has(m[1] as string)) missing.add(`${m[1]} (${file})`);
      }
    }
    expect([...missing], "keys used in components but absent from copy.ts").toEqual([]);
  });
});
