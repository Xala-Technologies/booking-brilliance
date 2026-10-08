import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { TRANSLATED_PATHS } from "@/lib/i18n";

const EN_ROUTES = [...TRANSLATED_PATHS].map((p) => (p === "/" ? "/en" : `/en${p}`));

/** Body/nav CTAs must not point at NB /book-demo; the language switcher may. */
function leakedNbBookDemoAnchors(html: string): string[] {
  const leaks: string[] = [];
  const re = /<a\b[^>]*\bhref=["']\/book-demo["'][^>]*>/gi;
  for (const match of html.matchAll(re)) {
    const tag = match[0];
    if (/\bhrefLang=/.test(tag)) continue;
    leaks.push(tag);
  }
  return leaks;
}

describe("English translated pages do not link to /book-demo", () => {
  it.each(EN_ROUTES)("SSR %s has no leaked href=\"/book-demo\"", async (route) => {
    const html = await render(route);
    const leaks = leakedNbBookDemoAnchors(html);
    expect(leaks, `leaked Norwegian book-demo link on ${route}`).toEqual([]);
  });
});
