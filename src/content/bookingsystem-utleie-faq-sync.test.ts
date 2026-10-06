import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { operatorCopy } from "./bookingsystem-utleie";

/**
 * The prerendered FAQPage must equal the visible FAQ on /bookingsystem-utleie,
 * in both locales. Google requires structured data to match on-page text.
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

describe.each([
  ["nb", "/bookingsystem-utleie"],
  ["en", "/en/bookingsystem-utleie"],
] as const)("bookingsystem-utleie %s FAQ matches prerender", (locale, route) => {
  const block = faqBlockFor(route);
  const entries = operatorCopy(locale).faq;

  it("has every question, verbatim", () => {
    const missing = entries
      .map(({ question }) => question)
      .filter((q) => !block.includes(q));
    expect(
      missing,
      `questions missing from scripts/prerender.mjs for ${route}: ${missing.join(" | ")}`,
    ).toEqual([]);
  });

  it("has the same entry count as the page", () => {
    const count = (block.match(/\bq: "/g) ?? []).length;
    expect(count, `prerender lists ${count} entries, page shows ${entries.length}`)
      .toBe(entries.length);
  });
});
