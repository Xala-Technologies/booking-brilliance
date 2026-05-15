export type Severity = "error" | "warn" | "info";

export type AuditType =
  | "uptime"     // HTTP status, response time, SSL expiry — all surfaces
  | "seo"        // metadata, sitemap, robots, schema — indexable only
  | "a11y"       // axe-baseline (cheerio) — all surfaces
  | "security"   // headers, sensitive files, mixed content — all surfaces
  | "links"      // broken external links — public surfaces
  | "performance" // Lighthouse CI (deferred — needs runner)
  | "vulns";     // npm audit / dependabot import (deferred)

export interface AuditFinding {
  url: string;
  rule: string;
  severity: Severity;
  message: string;
}

export interface PageScore {
  url: string;
  score: number;
  metrics?: Record<string, unknown>;
}

export interface AuditResult {
  auditType: AuditType;
  pages: PageScore[];
  findings: AuditFinding[];
}

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  error: 18,
  warn: 6,
  info: 1,
};
