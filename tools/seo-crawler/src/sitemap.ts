/**
 * Sitemap discovery. Reads sitemap.xml (and recursively sitemap-index files)
 * and returns the set of unique URLs to crawl.
 */

import * as cheerio from "cheerio";

export async function loadSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const out = new Set<string>();
  await walk(sitemapUrl, out);
  return [...out];
}

async function walk(sitemapUrl: string, sink: Set<string>): Promise<void> {
  let xml: string;
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) {
      console.warn(`[sitemap] ${sitemapUrl} returned ${res.status}`);
      return;
    }
    xml = await res.text();
  } catch (err) {
    console.warn(`[sitemap] failed to fetch ${sitemapUrl}:`, err);
    return;
  }

  const $ = cheerio.load(xml, { xmlMode: true });

  // sitemap index?
  const indexLocs = $("sitemapindex > sitemap > loc");
  if (indexLocs.length > 0) {
    for (const el of indexLocs.toArray()) {
      const loc = $(el).text().trim();
      if (loc) await walk(loc, sink);
    }
    return;
  }

  // regular urlset
  $("urlset > url > loc").each((_, el) => {
    const loc = $(el).text().trim();
    if (loc) sink.add(loc);
  });
}
