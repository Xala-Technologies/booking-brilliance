import { describe, it, expect } from "vitest";
import { parseSeo } from "../parse";

const ORIGIN = "https://digilist.no";

const HTML_FULL = `<!doctype html>
<html lang="nb">
<head>
  <title>Digilist — bookingplattform for norske kommuner</title>
  <meta name="description" content="En SaaS-plattform for booking, betaling og sesongleie i kommunal sektor.">
  <link rel="canonical" href="https://digilist.no/">
  <meta property="og:title" content="Digilist">
  <meta property="og:description" content="Plattform for kommuner.">
  <meta property="og:image" content="https://digilist.no/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Digilist"}</script>
</head>
<body>
  <h1>Velkommen</h1>
  <h2>Funksjoner</h2>
  <p>${"En setning. ".repeat(60)}</p>
  <a href="/blogg">Blogg</a>
  <a href="https://example.com">Ekstern</a>
  <img src="/a.png" alt="Eksempel">
  <img src="/b.png">
</body>
</html>`;

describe("parseSeo", () => {
  it("extracts title, description, canonical, OG, robots, lang", () => {
    const s = parseSeo(HTML_FULL, ORIGIN, 200, 42, ORIGIN);
    expect(s.title).toBe("Digilist — bookingplattform for norske kommuner");
    expect(s.titleLength).toBe(s.title!.length);
    expect(s.description).toContain("SaaS-plattform");
    expect(s.canonical).toBe("https://digilist.no/");
    expect(s.ogTitle).toBe("Digilist");
    expect(s.ogImage).toBe("https://digilist.no/og.png");
    expect(s.twitterCard).toBe("summary_large_image");
    expect(s.langAttr).toBe("nb");
  });

  it("collects headings", () => {
    const s = parseSeo(HTML_FULL, ORIGIN, 200, 0, ORIGIN);
    expect(s.h1).toEqual(["Velkommen"]);
    expect(s.h2).toEqual(["Funksjoner"]);
  });

  it("classifies internal vs external links", () => {
    const s = parseSeo(HTML_FULL, ORIGIN, 200, 0, ORIGIN);
    expect(s.internalLinks).toContain("https://digilist.no/blogg");
    expect(s.externalLinks).toContain("https://example.com/");
  });

  it("counts images missing alt", () => {
    const s = parseSeo(HTML_FULL, ORIGIN, 200, 0, ORIGIN);
    expect(s.imagesTotal).toBe(2);
    expect(s.imagesMissingAlt).toBe(1);
  });

  it("extracts JSON-LD @type values", () => {
    const s = parseSeo(HTML_FULL, ORIGIN, 200, 0, ORIGIN);
    expect(s.jsonLdTypes).toContain("Organization");
  });

  it("counts words in body, ignoring script/style", () => {
    const html = `
      <html><body>
        <p>en to tre fire fem</p>
        <script>const x = "ikke tell meg";</script>
        <style>body { color: red; }</style>
      </body></html>`;
    const s = parseSeo(html, ORIGIN, 200, 0, ORIGIN);
    expect(s.wordCount).toBe(5);
  });

  it("handles malformed JSON-LD gracefully", () => {
    const html = `
      <html><body>
        <script type="application/ld+json">{not valid json}</script>
      </body></html>`;
    const s = parseSeo(html, ORIGIN, 200, 0, ORIGIN);
    expect(s.jsonLdTypes).toEqual([]);
  });

  it("skips hash/mailto/tel links", () => {
    const html = `<a href="#kontakt">x</a><a href="mailto:a@b.no">y</a><a href="tel:+47">z</a>`;
    const s = parseSeo(html, ORIGIN, 200, 0, ORIGIN);
    expect(s.internalLinks).toEqual([]);
    expect(s.externalLinks).toEqual([]);
  });

  it("strips URL fragments before bucketing internal links", () => {
    const html = `<a href="/faq#q-5">x</a><a href="/faq#q-9">y</a>`;
    const s = parseSeo(html, ORIGIN, 200, 0, ORIGIN);
    expect(s.internalLinks).toEqual(["https://digilist.no/faq"]);
  });
});
