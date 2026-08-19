import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * BRAND_MENTIONS is a list of LINKS, and it exists twice.
 *
 * `src/components/SEO.tsx` renders it into the JSON-LD the client hydrates;
 * `scripts/prerender.mjs` carries its own copy, because the JSON-LD has to be
 * in the HTML before any JavaScript runs. Every page on digilist.no carries
 * both, so a bad URL here is a dead link on the whole site at once — not on
 * one page — and it is invisible to a human reading the page, because these
 * URLs only appear inside a <script type="application/ld+json">.
 *
 * That is how https://peppol.eu survived: the apex has no DNS A record, while
 * the peppol.eu SUBdomains the docs link (docs., directory.) resolve fine, so
 * the dead apex read as obviously correct to anyone eyeballing it. geoqa found
 * it from the outside, by resolving the page's links (issue #299).
 *
 * Nothing checked that the two copies agreed either, so a fix applied to one
 * would silently leave the other serving the dead URL to crawlers.
 */
function brandMentionUrls(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const start = src.indexOf("const BRAND_MENTIONS = [");
  expect(start, `no BRAND_MENTIONS in ${file}`).toBeGreaterThan(-1);
  const end = src.indexOf("\n];", start);
  expect(end, `unterminated BRAND_MENTIONS in ${file}`).toBeGreaterThan(-1);
  return [...src.slice(start, end).matchAll(/url:\s*"([^"]+)"/g)].map(
    (m) => m[1],
  );
}

const COPIES = {
  "src/components/SEO.tsx": brandMentionUrls("src/components/SEO.tsx"),
  "scripts/prerender.mjs": brandMentionUrls("scripts/prerender.mjs"),
};

describe("BRAND_MENTIONS URLs", () => {
  it("are the same list in both copies", () => {
    const [client, prerender] = Object.values(COPIES);
    expect(client.length).toBeGreaterThan(0);
    expect(prerender).toEqual(client);
  });

  describe.each(Object.entries(COPIES))("%s", (_file, urls) => {
    // The apex, exactly — https://docs.peppol.eu and https://directory.peppol.eu
    // are real hosts and stay allowed.
    it("does not link the peppol.eu apex, which does not resolve", () => {
      expect(urls.filter((u) => /^https?:\/\/peppol\.eu(\/|$)/.test(u))).toEqual(
        [],
      );
    });

    it("are absolute https URLs with a host", () => {
      for (const url of urls) {
        expect(url, `${url} is not an absolute https URL`).toMatch(
          /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$)/,
        );
      }
    });
  });
});
