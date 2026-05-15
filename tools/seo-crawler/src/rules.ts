/**
 * SEO rules + scoring.
 *
 * Each rule inspects either a single PageSnapshot or the full crawl set and
 * emits zero or more findings. Rules are deterministic; the scoring is
 * just a sum of severity weights deducted from 100.
 */

import type { PageSnapshot } from "./parse";

export type Severity = "error" | "warn" | "info";

export interface Finding {
  url: string;
  rule: string;
  severity: Severity;
  message: string;
}

const SEVERITY_WEIGHT: Record<Severity, number> = {
  error: 18,
  warn: 6,
  info: 1,
};

const TITLE_MIN = 25;
const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 165;
const THIN_CONTENT_WORDS = 200;
const SLOW_LOAD_MS = 1500;

/** Per-page rules — depend only on a single snapshot. */
export function evaluatePage(p: PageSnapshot): Finding[] {
  const out: Finding[] = [];
  const push = (rule: string, severity: Severity, message: string) =>
    out.push({ url: p.url, rule, severity, message });

  if (p.status !== 200) {
    push("status", "error", `HTTP ${p.status}`);
    return out; // Don't keep evaluating a broken page
  }

  // Title
  if (!p.title) push("title.missing", "error", "Title is missing");
  else if (p.titleLength < TITLE_MIN)
    push(
      "title.short",
      "warn",
      `Title is ${p.titleLength} chars (recommend ${TITLE_MIN}+)`,
    );
  else if (p.titleLength > TITLE_MAX)
    push(
      "title.long",
      "warn",
      `Title is ${p.titleLength} chars (recommend ≤${TITLE_MAX})`,
    );

  // Description
  if (!p.description)
    push("description.missing", "error", "Meta description is missing");
  else if (p.descriptionLength < DESC_MIN)
    push(
      "description.short",
      "warn",
      `Description is ${p.descriptionLength} chars (recommend ${DESC_MIN}+)`,
    );
  else if (p.descriptionLength > DESC_MAX)
    push(
      "description.long",
      "warn",
      `Description is ${p.descriptionLength} chars (recommend ≤${DESC_MAX})`,
    );

  // Canonical
  if (!p.canonical)
    push("canonical.missing", "warn", "No canonical URL set");

  // H1
  if (p.h1.length === 0)
    push("h1.missing", "error", "No <h1> on page");
  else if (p.h1.length > 1)
    push(
      "h1.multiple",
      "warn",
      `${p.h1.length} <h1> tags (recommend exactly one)`,
    );

  // Lang
  if (!p.langAttr)
    push("lang.missing", "warn", "<html> has no lang attribute");

  // Open Graph
  if (!p.ogTitle || !p.ogDescription || !p.ogImage)
    push(
      "og.incomplete",
      "warn",
      "Open Graph metadata incomplete (title/description/image)",
    );
  if (!p.twitterCard)
    push("twitter.missing", "info", "No twitter:card meta tag");

  // Robots
  if (p.robotsMeta?.toLowerCase().includes("noindex"))
    push(
      "robots.noindex",
      "warn",
      "Page is marked noindex — intentional?",
    );

  // Structured data
  if (p.jsonLdTypes.length === 0)
    push(
      "structured.missing",
      "warn",
      "No JSON-LD structured data on page",
    );

  // Images
  if (p.imagesMissingAlt > 0)
    push(
      "image.alt",
      p.imagesMissingAlt > 3 ? "error" : "warn",
      `${p.imagesMissingAlt}/${p.imagesTotal} images missing alt text`,
    );

  // Thin content
  if (p.wordCount < THIN_CONTENT_WORDS)
    push(
      "content.thin",
      "warn",
      `Only ${p.wordCount} words on page (recommend ${THIN_CONTENT_WORDS}+)`,
    );

  // Performance
  if (p.loadMs > SLOW_LOAD_MS)
    push(
      "perf.slow",
      "warn",
      `Page took ${p.loadMs} ms to fetch (recommend <${SLOW_LOAD_MS} ms)`,
    );

  return out;
}

/** Site-wide rules — need the full crawl set. */
export function evaluateSite(snapshots: PageSnapshot[]): Finding[] {
  const out: Finding[] = [];
  const ok = snapshots.filter((s) => s.status === 200);

  // Duplicate titles
  const byTitle = new Map<string, string[]>();
  for (const s of ok) {
    if (!s.title) continue;
    const arr = byTitle.get(s.title) ?? [];
    arr.push(s.url);
    byTitle.set(s.title, arr);
  }
  for (const [title, urls] of byTitle) {
    if (urls.length > 1)
      for (const url of urls)
        out.push({
          url,
          rule: "title.duplicate",
          severity: "warn",
          message: `Title "${title}" is reused on ${urls.length} pages`,
        });
  }

  // Duplicate descriptions
  const byDesc = new Map<string, string[]>();
  for (const s of ok) {
    if (!s.description) continue;
    const arr = byDesc.get(s.description) ?? [];
    arr.push(s.url);
    byDesc.set(s.description, arr);
  }
  for (const [desc, urls] of byDesc) {
    if (urls.length > 1)
      for (const url of urls)
        out.push({
          url,
          rule: "description.duplicate",
          severity: "warn",
          message: `Description reused on ${urls.length} pages — "${desc.slice(0, 60)}…"`,
        });
  }

  // Broken internal links (from any crawled page to a URL we crawled and got non-200)
  const statusByUrl = new Map<string, number>();
  for (const s of snapshots) statusByUrl.set(s.url, s.status);
  for (const s of ok) {
    for (const target of s.internalLinks) {
      const status = statusByUrl.get(target);
      if (status !== undefined && status !== 200) {
        out.push({
          url: s.url,
          rule: "link.broken",
          severity: "error",
          message: `Internal link to ${target} returned ${status}`,
        });
      }
    }
  }

  return out;
}

export function score(findings: Finding[]): number {
  const penalty = findings.reduce(
    (sum, f) => sum + SEVERITY_WEIGHT[f.severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}

export function severityWeight(s: Severity): number {
  return SEVERITY_WEIGHT[s];
}
