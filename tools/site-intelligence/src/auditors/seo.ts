/** Wraps the existing seo-crawler parse + rules logic for a single target. */

import { parseSeo } from "../../../seo-crawler/src/parse";
import { evaluatePage, evaluateSite, score } from "../../../seo-crawler/src/rules";
import type { Target } from "../targets";
import type { AuditResult } from "../types";
import { Fetcher } from "../fetcher";
import { discoverUrls } from "../discover";

export async function runSeoAudit(target: Target): Promise<AuditResult> {
  const fetcher = new Fetcher();
  const urls = await discoverUrls(target.origin, target.seeds);

  const snaps = [];
  const seen = new Set<string>();
  for (const url of urls) {
    const fp = await fetcher.fetch(url);
    if (!fp.contentType?.includes("text/html")) continue;
    if (seen.has(fp.url)) continue;
    seen.add(fp.url);
    snaps.push(
      parseSeo(fp.html, fp.url, fp.status, fp.loadMs, target.origin),
    );
  }

  const findings = [];
  for (const s of snaps) findings.push(...evaluatePage(s));
  findings.push(...evaluateSite(snaps));

  // Per-page scoring
  const findingsByUrl = new Map<string, typeof findings>();
  for (const f of findings) {
    const arr = findingsByUrl.get(f.url) ?? [];
    arr.push(f);
    findingsByUrl.set(f.url, arr);
  }

  return {
    auditType: "seo",
    pages: snaps.map((s) => ({
      url: s.url,
      score: score(findingsByUrl.get(s.url) ?? []),
      metrics: {
        title: s.title,
        titleLength: s.titleLength,
        description: s.description,
        descriptionLength: s.descriptionLength,
        h1Count: s.h1.length,
        jsonLdTypes: s.jsonLdTypes,
        wordCount: s.wordCount,
        loadMs: s.loadMs,
        internalLinks: s.internalLinks.length,
        externalLinks: s.externalLinks.length,
      },
    })),
    findings: findings.map((f) => ({
      url: f.url,
      rule: f.rule,
      severity: f.severity,
      message: f.message,
    })),
  };
}
