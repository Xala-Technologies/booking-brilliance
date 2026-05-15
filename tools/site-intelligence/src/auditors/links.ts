/**
 * External link checker. Pulls all external links from the target's pages
 * (collected via parseSeo) and HEAD-checks each one. Findings on non-2xx.
 *
 * Limits: HEAD only, follows redirects, dedupes URLs, 8s timeout per link.
 * Some hosts return 403 to HEAD-requests by policy (e.g. LinkedIn). We
 * don't flag those as broken — only 4xx that aren't 401/403.
 */

import * as cheerio from "cheerio";
import type { Target } from "../targets";
import type { AuditFinding, AuditResult, Severity } from "../types";
import { SEVERITY_WEIGHT } from "../types";
import { Fetcher } from "../fetcher";
import { discoverUrls } from "../discover";

const STRICT_ERR_CODES = new Set([404, 410, 502, 503, 504]);

export async function runLinkAudit(target: Target): Promise<AuditResult> {
  const fetcher = new Fetcher();
  const findings: AuditFinding[] = [];

  // Collect external links per source URL so findings stay attributable.
  const externalByPage = new Map<string, Set<string>>();
  const urls = await discoverUrls(target.origin, target.seeds);
  for (const url of urls) {
    const fp = await fetcher.fetch(url);
    if (!fp.contentType?.includes("text/html")) continue;
    if (fp.status !== 200) continue;
    const links = extractExternal(fp.html, fp.url, target.origin);
    if (links.length === 0) continue;
    externalByPage.set(fp.url, new Set(links));
  }

  // Dedupe across pages so we don't HEAD the same URL 30 times
  const checked = new Map<string, number>();
  const allExternals = new Set<string>();
  for (const set of externalByPage.values())
    for (const link of set) allExternals.add(link);

  for (const link of allExternals) {
    const head = await fetcher.fetch(link, "HEAD");
    // Some hosts disallow HEAD — fall back to GET to confirm
    if (head.status === 405 || head.status === 0) {
      const get = await fetcher.fetch(link, "GET");
      checked.set(link, get.status);
    } else {
      checked.set(link, head.status);
    }
  }

  // Per-page findings
  const pages: AuditResult["pages"] = [];
  for (const [pageUrl, links] of externalByPage) {
    const broken: AuditFinding[] = [];
    for (const link of links) {
      const status = checked.get(link) ?? 0;
      if (status === 0) {
        broken.push({
          url: pageUrl,
          rule: "links.unreachable",
          severity: "warn",
          message: `Could not reach ${link}`,
        });
      } else if (STRICT_ERR_CODES.has(status)) {
        broken.push({
          url: pageUrl,
          rule: "links.broken",
          severity: "error",
          message: `${link} returned ${status}`,
        });
      } else if (status >= 400 && status !== 401 && status !== 403) {
        broken.push({
          url: pageUrl,
          rule: "links.client-error",
          severity: "warn",
          message: `${link} returned ${status}`,
        });
      } else if (status >= 500) {
        broken.push({
          url: pageUrl,
          rule: "links.server-error",
          severity: "warn",
          message: `${link} returned ${status}`,
        });
      }
    }
    findings.push(...broken);
    pages.push({
      url: pageUrl,
      score: scoreFindings(broken),
      metrics: { externalLinks: links.size, broken: broken.length },
    });
  }

  return { auditType: "links", pages, findings };
}

function scoreFindings(findings: AuditFinding[]): number {
  const penalty = findings.reduce(
    (s, f) => s + SEVERITY_WEIGHT[f.severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}

function extractExternal(
  html: string,
  pageUrl: string,
  origin: string,
): string[] {
  const $ = cheerio.load(html);
  const out = new Set<string>();
  $("a[href]").each((_, el) => {
    const raw = $(el).attr("href")?.trim();
    if (!raw) return;
    if (
      raw.startsWith("#") ||
      raw.startsWith("mailto:") ||
      raw.startsWith("tel:")
    )
      return;
    let abs: string;
    try {
      abs = new URL(raw, pageUrl).href;
    } catch {
      return;
    }
    try {
      if (new URL(abs).origin === origin) return;
    } catch {
      return;
    }
    out.add(stripHash(abs));
  });
  return [...out];
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
