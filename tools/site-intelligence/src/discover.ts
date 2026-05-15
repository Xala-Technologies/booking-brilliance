/** URL discovery for a target — sitemap walking + seed merging. */

import * as cheerio from "cheerio";

export async function discoverUrls(
  origin: string,
  seeds: string[] = [],
): Promise<string[]> {
  const out = new Set<string>([origin]);
  for (const s of seeds) out.add(s);

  try {
    await walkSitemap(`${origin}/sitemap.xml`, out);
  } catch {
    // sitemap may not exist on some targets — silently skip
  }

  return [...out];
}

async function walkSitemap(sitemapUrl: string, sink: Set<string>): Promise<void> {
  let xml: string;
  try {
    const res = await fetch(sitemapUrl);
    if (!res.ok) return;
    xml = await res.text();
  } catch {
    return;
  }

  const $ = cheerio.load(xml, { xmlMode: true });

  const indexLocs = $("sitemapindex > sitemap > loc");
  if (indexLocs.length > 0) {
    for (const el of indexLocs.toArray()) {
      const loc = $(el).text().trim();
      if (loc) await walkSitemap(loc, sink);
    }
    return;
  }

  $("urlset > url > loc").each((_, el) => {
    const loc = $(el).text().trim();
    if (loc) sink.add(loc);
  });
}
