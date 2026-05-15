/**
 * Cheerio-based a11y baseline. Not a replacement for axe-core (that comes in
 * pass 2 with Playwright), but catches common regressions quickly:
 *   - missing lang on <html>
 *   - <img> without alt attribute (decorative alt="" is OK)
 *   - form inputs without labels (no associated <label for>, no aria-label)
 *   - heading hierarchy skips (h1 → h3 without h2)
 *   - missing landmark structure (<main>, <nav>, <footer>)
 *   - links with no accessible name (empty text + no aria-label/title)
 *   - buttons with no accessible name
 *   - duplicate id attributes (a11y + DOM hazard)
 */

import * as cheerio from "cheerio";
import type { Target } from "../targets";
import type { AuditFinding, AuditResult, Severity } from "../types";
import { SEVERITY_WEIGHT } from "../types";
import { Fetcher } from "../fetcher";
import { discoverUrls } from "../discover";

export async function runA11yAudit(target: Target): Promise<AuditResult> {
  const fetcher = new Fetcher();
  const urls = await discoverUrls(target.origin, target.seeds);

  const pages: AuditResult["pages"] = [];
  const findings: AuditFinding[] = [];

  const seen = new Set<string>();
  for (const url of urls) {
    const fp = await fetcher.fetch(url);
    if (!fp.contentType?.includes("text/html")) continue;
    if (fp.status !== 200) continue;
    if (seen.has(fp.url)) continue;
    seen.add(fp.url);

    const pf = evaluateA11y(fp.html, fp.url);
    findings.push(...pf);
    pages.push({
      url: fp.url,
      score: scoreFindings(pf),
      metrics: { findings: pf.length },
    });
  }

  return { auditType: "a11y", pages, findings };
}

function scoreFindings(findings: AuditFinding[]): number {
  const penalty = findings.reduce(
    (s, f) => s + SEVERITY_WEIGHT[f.severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}

export function evaluateA11y(html: string, pageUrl: string): AuditFinding[] {
  const $ = cheerio.load(html);
  const out: AuditFinding[] = [];
  const push = (rule: string, severity: Severity, message: string) =>
    out.push({ url: pageUrl, rule, severity, message });

  // 1. lang
  if (!$("html").attr("lang"))
    push("a11y.lang", "error", "<html> missing lang attribute");

  // 2. images without alt attribute (alt="" is intentional/decorative)
  let imgsNoAlt = 0;
  $("img").each((_, el) => {
    if ($(el).attr("alt") === undefined) imgsNoAlt++;
  });
  if (imgsNoAlt > 0)
    push(
      "a11y.image.alt",
      imgsNoAlt > 3 ? "error" : "warn",
      `${imgsNoAlt} image(s) missing alt attribute`,
    );

  // 3. inputs without labels
  let unlabeled = 0;
  $("input, textarea, select").each((_, el) => {
    const $el = $(el);
    const type = ($el.attr("type") || "").toLowerCase();
    if (type === "hidden" || type === "submit" || type === "button") return;
    const id = $el.attr("id");
    const hasLabelFor = id ? $(`label[for="${id}"]`).length > 0 : false;
    const ariaLabel = $el.attr("aria-label");
    const ariaLabelledBy = $el.attr("aria-labelledby");
    const wrappedLabel = $el.parents("label").length > 0;
    if (!hasLabelFor && !ariaLabel && !ariaLabelledBy && !wrappedLabel)
      unlabeled++;
  });
  if (unlabeled > 0)
    push(
      "a11y.form.label",
      "error",
      `${unlabeled} form control(s) without a label`,
    );

  // 4. heading hierarchy
  const headings: number[] = [];
  $("h1,h2,h3,h4,h5,h6").each((_, el) => {
    const lvl = parseInt(el.tagName.slice(1), 10);
    if (!Number.isNaN(lvl)) headings.push(lvl);
  });
  let skips = 0;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) skips++;
  }
  if (skips > 0)
    push(
      "a11y.heading.skip",
      "warn",
      `${skips} heading level skip(s) (e.g. h2 → h4)`,
    );

  // 5. landmarks
  if ($("main").length === 0)
    push("a11y.landmark.main", "warn", "No <main> landmark");
  if ($("nav").length === 0)
    push("a11y.landmark.nav", "info", "No <nav> landmark");
  if ($("footer").length === 0)
    push("a11y.landmark.footer", "info", "No <footer> landmark");

  // 6. links with no accessible name
  let unnamedLinks = 0;
  $("a[href]").each((_, el) => {
    const $el = $(el);
    if ($el.attr("aria-hidden") === "true") return;
    const text = $el.text().trim();
    const aria = $el.attr("aria-label");
    const title = $el.attr("title");
    if (!text && !aria && !title) unnamedLinks++;
  });
  if (unnamedLinks > 0)
    push(
      "a11y.link.name",
      "error",
      `${unnamedLinks} link(s) without accessible name`,
    );

  // 7. buttons with no accessible name
  let unnamedButtons = 0;
  $("button").each((_, el) => {
    const $el = $(el);
    if ($el.attr("aria-hidden") === "true") return;
    const text = $el.text().trim();
    const aria = $el.attr("aria-label");
    const title = $el.attr("title");
    if (!text && !aria && !title) unnamedButtons++;
  });
  if (unnamedButtons > 0)
    push(
      "a11y.button.name",
      "error",
      `${unnamedButtons} button(s) without accessible name`,
    );

  // 8. duplicate IDs
  const idCounts = new Map<string, number>();
  $("[id]").each((_, el) => {
    const id = $(el).attr("id");
    if (!id) return;
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  });
  const dupes = [...idCounts.entries()].filter(([, n]) => n > 1);
  if (dupes.length > 0)
    push(
      "a11y.id.duplicate",
      "warn",
      `${dupes.length} duplicate id(s): ${dupes
        .slice(0, 5)
        .map(([id]) => `#${id}`)
        .join(", ")}`,
    );

  // 9. skip-to-main
  const hasSkipLink = $("a[href^='#']")
    .toArray()
    .some((el) =>
      /skip|hopp|main/i.test($(el).text().trim() + " " + ($(el).attr("class") || "")),
    );
  if (!hasSkipLink)
    push("a11y.skip-link", "info", "No visible skip-to-main link");

  return out;
}
