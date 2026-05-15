/**
 * HTML → SEO snapshot.
 *
 * Pure function: takes raw HTML + the canonical URL it came from, returns
 * a structured `PageSnapshot`. No I/O — easy to unit-test.
 */

import * as cheerio from "cheerio";

export interface PageSnapshot {
  url: string;
  status: number;
  loadMs: number;

  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;

  h1: string[];
  h2: string[];

  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;

  robotsMeta: string | null;
  langAttr: string | null;

  internalLinks: string[];
  externalLinks: string[];
  imagesMissingAlt: number;
  imagesTotal: number;

  jsonLdTypes: string[];

  wordCount: number;
  htmlSize: number;
}

export function parseSeo(
  html: string,
  pageUrl: string,
  status: number,
  loadMs: number,
  origin: string,
): PageSnapshot {
  const $ = cheerio.load(html);

  // --- meta basics ---
  const title = $("head > title").text().trim() || null;
  const description =
    $('head meta[name="description"]').attr("content")?.trim() || null;
  const canonical =
    $('head link[rel="canonical"]').attr("href")?.trim() || null;

  // Accept either name= or property= for og:* and twitter:* — Twitter's
  // spec is name= but most CMSes (and Digilist) use property= for consistency
  // with OpenGraph. Both are widely accepted by crawlers.
  const metaAttr = (key: string) =>
    $(`head meta[name="${key}"], head meta[property="${key}"]`)
      .first()
      .attr("content")
      ?.trim() || null;

  const ogTitle = metaAttr("og:title");
  const ogDescription = metaAttr("og:description");
  const ogImage = metaAttr("og:image");
  const twitterCard = metaAttr("twitter:card");

  const robotsMeta =
    $('head meta[name="robots"]').attr("content")?.trim() || null;
  const langAttr = $("html").attr("lang")?.trim() || null;

  // --- headings ---
  const h1: string[] = [];
  $("h1").each((_, el) => {
    const t = $(el).text().trim();
    if (t) h1.push(t);
  });
  const h2: string[] = [];
  $("h2").each((_, el) => {
    const t = $(el).text().trim();
    if (t) h2.push(t);
  });

  // --- links ---
  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();
  $("a[href]").each((_, el) => {
    const raw = $(el).attr("href")?.trim();
    if (!raw) return;
    if (raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
      return;
    }
    let abs: string;
    try {
      abs = new URL(raw, pageUrl).href;
    } catch {
      return;
    }
    if (isSameOrigin(abs, origin)) {
      internalLinks.add(stripHash(abs));
    } else {
      externalLinks.add(abs);
    }
  });

  // --- images ---
  // Only flag images with NO alt attribute at all. alt="" is WCAG-correct
  // for decorative images and is intentional; flagging it produces noise.
  let imagesTotal = 0;
  let imagesMissingAlt = 0;
  $("img").each((_, el) => {
    imagesTotal++;
    const alt = $(el).attr("alt");
    if (alt === undefined) imagesMissingAlt++;
  });

  // --- JSON-LD ---
  const jsonLdTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      collectTypes(parsed, jsonLdTypes);
    } catch {
      // skip malformed
    }
  });

  // --- text length (rough but stable) ---
  // Drop scripts/styles/noscript, then collapse whitespace and count words.
  $("script, style, noscript, svg").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").filter(Boolean).length : 0;

  return {
    url: pageUrl,
    status,
    loadMs,

    title,
    titleLength: title?.length ?? 0,
    description,
    descriptionLength: description?.length ?? 0,
    canonical,

    h1,
    h2,

    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,

    robotsMeta,
    langAttr,

    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
    imagesMissingAlt,
    imagesTotal,

    jsonLdTypes: [...new Set(jsonLdTypes)],

    wordCount,
    htmlSize: html.length,
  };
}

function isSameOrigin(absUrl: string, origin: string): boolean {
  try {
    return new URL(absUrl).origin === origin;
  } catch {
    return false;
  }
}

function stripHash(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.href;
  } catch {
    return url;
  }
}

function collectTypes(node: unknown, sink: string[]): void {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, sink);
    return;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const t = obj["@type"];
    if (typeof t === "string") sink.push(t);
    else if (Array.isArray(t)) {
      for (const x of t) if (typeof x === "string") sink.push(x);
    }
    // Walk known nested fields
    for (const key of Object.keys(obj)) {
      if (key === "@type" || key === "@context") continue;
      collectTypes(obj[key], sink);
    }
  }
}
