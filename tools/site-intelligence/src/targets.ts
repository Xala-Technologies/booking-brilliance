/**
 * Inventory of every Digilist-owned surface monitored by the ecosystem
 * intelligence center. Each surface declares its type, environment,
 * indexability, auth posture, and which checks should run.
 *
 * The orchestrator gates audit execution on `target.checks` so we never
 * run SEO on /api or expect a sitemap on /dashboard.
 */

import type { AuditType } from "./types";

export type SurfaceType =
  | "marketing"
  | "app"
  | "dashboard"
  | "docs"
  | "api"
  | "status";

export type Environment = "production" | "staging" | "preview";

export interface Target {
  /** Stable identifier, used as DB key + CLI flag value. */
  name: string;
  /** Display label shown in the dashboard. */
  label: string;
  /** Origin (no trailing slash). */
  origin: string;
  /** Free-text description for the dashboard. */
  description: string;
  /** Product category — drives default check set + dashboard grouping. */
  type: SurfaceType;
  /** production | staging | preview. */
  environment: Environment;
  /** Should crawlers see this surface (controls SEO expectations). */
  indexable: boolean;
  /** Auth wall on the main surface (true → skip SEO + content audits). */
  requiresAuth: boolean;
  /** Audit types enabled for this surface. */
  checks: AuditType[];
  /** Master toggle — false skips this target entirely. */
  active: boolean;
  /** Optional URLs to crawl in addition to sitemap-discovered ones. */
  seeds?: string[];
}

export const TARGETS: Target[] = [
  {
    name: "marketing",
    label: "Marketing — digilist.no",
    origin: "https://digilist.no",
    description: "Public marketing site, blog, FAQ, landing pages.",
    type: "marketing",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: ["uptime", "seo", "a11y", "security", "links"],
    active: true,
  },
  {
    name: "marketing-dev",
    label: "Staging marketing — dev.digilist.no",
    origin: "https://dev.digilist.no",
    description: "Pre-production marketing site (mirror of digilist.no).",
    type: "marketing",
    environment: "staging",
    indexable: false,
    requiresAuth: false,
    // Staging must NOT be indexed — uptime + security + a11y still apply.
    // Hidden from public transparency by env=staging (Transparens filter).
    checks: ["uptime", "a11y", "security", "links"],
    active: false,
  },
  {
    name: "app",
    label: "App — app.digilist.no",
    origin: "https://app.digilist.no",
    description: "Production app — public surfaces only (login, signup).",
    type: "app",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    // SEO is partial on app (login/signup pages); skip for now.
    // Drop `links` — link auditor false-positives on auth-gated pages.
    checks: ["uptime", "security"],
    active: true,
    seeds: ["https://app.digilist.no/login", "https://app.digilist.no/signup"],
  },
  {
    name: "docs",
    label: "Docs — docs.digilist.no",
    origin: "https://docs.digilist.no",
    // Hidden from public transparency until docs site is rebuilt (currently
    // returns 403 — see DOCS-001 ticket). Will flip active=true once published.
    description: "Public documentation (under rebuild — see DOCS-001).",
    type: "docs",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: ["uptime", "seo", "a11y", "security", "links"],
    active: false,
  },
  {
    name: "dashboard",
    label: "Dashboard — dashboard.digilist.no",
    origin: "https://dashboard.digilist.no",
    description: "Tenant admin — public surfaces only.",
    type: "dashboard",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    // a11y on auth-gated SPA login is not representative; real WCAG scoring
    // requires Playwright + axe-core on authenticated app shell — see INTEL-002.
    checks: ["uptime", "security"],
    active: true,
    seeds: ["https://dashboard.digilist.no/login"],
  },
  {
    name: "api",
    label: "API — api.digilist.no",
    origin: "https://api.digilist.no",
    description: "Public API surface — health, auth endpoints.",
    type: "api",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    checks: ["uptime", "security"],
    active: true,
  },
  {
    name: "status",
    label: "Status — status.digilist.no",
    origin: "https://status.digilist.no",
    description: "Public status page.",
    type: "status",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: ["uptime", "security"],
    active: false,
  },
];

export function activeTargets(): Target[] {
  return TARGETS.filter((t) => t.active);
}

export function findTarget(name: string): Target | undefined {
  return TARGETS.find((t) => t.name === name);
}
