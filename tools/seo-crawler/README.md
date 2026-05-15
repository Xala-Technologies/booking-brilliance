# SEO Crawler

Internal, on-demand SEO auditor for digilist.no. Plain HTTP + Cheerio (the
site is pre-rendered, so Playwright isn't needed yet). Stores runs in SQLite,
generates a self-contained HTML report.

## Usage

```bash
pnpm seo:crawl           # default origin https://digilist.no
pnpm seo:report          # write reports/index.html from latest run
pnpm seo:open            # open reports/index.html in the browser
pnpm seo:test            # parser + scoring tests
```

Custom origin, extra seeds, custom DB:

```bash
pnpm seo:crawl -- --origin https://staging.digilist.no \
                  --seed https://staging.digilist.no/some/orphan-page \
                  --db ./tools/seo-crawler/reports/staging.sqlite
```

## What it checks (13 rules)

Per-page:
- **status** — HTTP error
- **title.missing / .short / .long** — title quality
- **description.missing / .short / .long** — meta description quality
- **canonical.missing** — canonical URL set
- **h1.missing / .multiple** — exactly one H1
- **lang.missing** — `<html lang>` attribute
- **og.incomplete** — OG title + description + image
- **twitter.missing** — twitter:card
- **robots.noindex** — flags noindex (intentional?)
- **structured.missing** — JSON-LD present
- **image.alt** — alt text on images
- **content.thin** — ≥200 words
- **perf.slow** — fetch time

Site-wide:
- **title.duplicate / description.duplicate** — uniqueness
- **link.broken** — internal links to known-broken URLs

## Scoring

Each page starts at 100. Findings deduct severity weight:

| Severity | Weight |
|---|---|
| error | 18 |
| warn  | 6 |
| info  | 1 |

Score is floored at 0.

## Architecture

```
src/
  parse.ts      Pure HTML → PageSnapshot
  rules.ts      PageSnapshot + Site → Findings + score
  fetcher.ts    Polite HTTP fetcher, rate-limited
  sitemap.ts    /sitemap.xml + sitemap-index walker
  robots.ts     robots.txt parser (Disallow only)
  db.ts         SQLite store (better-sqlite3)
  crawl.ts      Orchestrator + CLI
  report.ts     HTML report generator + CLI
  __tests__/    Vitest specs for parse + rules
```

## Future upgrades

- Swap Fetcher for a Playwright variant when crawling `app.digilist.no`
  (auth + JS-rendered pages).
- Lighthouse CI integration for perf/a11y scores.
- Trend graphs (multiple runs over time) — requires a dashboard route or
  a static report-index page.
- Sitemap generation diff (find URLs in robots vs sitemap mismatch).
