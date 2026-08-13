import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { teknologiFaq } from "./teknologi";

/**
 * The prerendered FAQ must equal the rendered one, in both languages.
 *
 * `scripts/prerender.mjs` carries its own copy of this FAQ, because the
 * JSON-LD has to be in the HTML before any JavaScript runs — that copy is what
 * a crawler indexes. Google requires the structured data to match the visible
 * text; if they drift, the page goes from earning a rich result to carrying a
 * structured-data violation.
 *
 * Both copies previously said "keep byte-for-byte identical" in a comment and
 * nothing checked it. A comment is not a mechanism, and this one was about to
 * be asked to hold across a translation — the exact moment such a rule breaks.
 */
const PRERENDER = readFileSync("scripts/prerender.mjs", "utf8");

function faqBlockFor(route: string): string {
  const at = PRERENDER.indexOf(`route: "${route}"`);
  expect(at, `no prerender entry for ${route}`).toBeGreaterThan(-1);
  const faqAt = PRERENDER.indexOf("faq: [", at);
  const end = PRERENDER.indexOf("],", faqAt);
  expect(faqAt).toBeGreaterThan(-1);
  return PRERENDER.slice(faqAt, end);
}

// English is absent on purpose: /en/teknologi is not published yet, because
// the three sections behind that page (1,082 lines of prose in components)
// are still Norwegian. The EN bank exists and is translated; it gets a
// prerender entry and a row here the moment the page is actually English.
describe.each([["nb", "/teknologi"]] as const)("%s FAQ is identical in the prerender", (locale, route) => {
  const block = faqBlockFor(route);
  const entries = teknologiFaq(locale);

  it("has every question and answer, verbatim", () => {
    const missing = entries.flatMap(({ q, a }) =>
      [q, a].filter((text) => !block.includes(text)),
    );
    expect(
      missing,
      `not byte-identical in scripts/prerender.mjs for ${route}: ${missing.join(" | ")}`,
    ).toEqual([]);
  });

  it("has no extra entries the page does not show", () => {
    const count = (block.match(/\{ q: /g) ?? []).length;
    expect(count, `prerender lists ${count} entries, page shows ${entries.length}`)
      .toBe(entries.length);
  });
});
