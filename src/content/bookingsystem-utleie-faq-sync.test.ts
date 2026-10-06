import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { operatorCopy } from "./bookingsystem-utleie";

/**
 * The prerendered FAQPage must equal the visible FAQ on /bookingsystem-utleie,
 * in both locales. Google requires structured data to match on-page text.
 */
const PRERENDER = readFileSync("scripts/prerender.mjs", "utf8");

/** Strip [label](url) to label — same as BookingsystemUtleie faqAnswerPlain. */
function faqAnswerPlain(answer: string): string {
  return answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function routeBlock(route: string): string {
  const at = PRERENDER.indexOf(`route: "${route}"`);
  expect(at, `no prerender entry for ${route}`).toBeGreaterThan(-1);
  const end = PRERENDER.indexOf("\n  },", at);
  expect(end, `unterminated block for ${route}`).toBeGreaterThan(-1);
  return PRERENDER.slice(at, end);
}

function prerenderedFAQ(route: string): Array<{ q: string; a: string }> {
  const block = routeBlock(route);
  const faqStart = block.indexOf("faq: [");
  expect(faqStart, `no FAQ block for ${route}`).toBeGreaterThan(-1);
  const faq = block.slice(faqStart);
  return [...faq.matchAll(/q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => ({
      q: m[1].replace(/\\"/g, '"'),
      a: m[2].replace(/\\"/g, '"'),
    }),
  );
}

function prerenderedDateModified(route: string): string | undefined {
  const block = routeBlock(route);
  const match = /dateModified:\s*"([^"]+)"/.exec(block);
  return match?.[1];
}

describe.each([
  ["nb", "/bookingsystem-utleie", "2026-10-06"],
  ["en", "/en/bookingsystem-utleie", undefined],
] as const)("bookingsystem-utleie %s FAQ matches prerender", (locale, route, dateModified) => {
  it("has the same question and answer pairs as the page", () => {
    const pageFaq = operatorCopy(locale).faq.map(({ question, answer }) => ({
      q: question,
      a: faqAnswerPlain(answer),
    }));
    expect(prerenderedFAQ(route)).toEqual(pageFaq);
  });

  it("has the same dateModified as the page", () => {
    expect(prerenderedDateModified(route)).toBe(dateModified);
  });
});
