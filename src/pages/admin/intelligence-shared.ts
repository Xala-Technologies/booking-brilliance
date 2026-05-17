/**
 * Shared types + auth helper for the /admin/intelligence dashboard family.
 *
 * Keeps the multi-page shell, the per-module pages, and the agent chat
 * speaking a single vocabulary. Snapshot fetching lives in the parent
 * shell and propagates via outlet context.
 */

export type AuditType =
  | "uptime"
  | "seo"
  | "a11y"
  | "security"
  | "links"
  | "performance"
  | "vulns";

export type SurfaceType =
  | "marketing"
  | "app"
  | "dashboard"
  | "docs"
  | "api"
  | "status";

export type Environment = "production" | "staging" | "preview";

export interface Target {
  id: number;
  name: string;
  label: string;
  origin: string;
  description: string;
  is_active: number;
  type: SurfaceType | null;
  environment: Environment | null;
  indexable: boolean;
  requiresAuth: boolean;
  checks: AuditType[];
}

export interface LatestRun {
  id: number;
  target_id: number;
  target_name: string;
  target_label: string;
  target_origin: string;
  audit_type: AuditType;
  started_at: string;
  finished_at: string | null;
  pages_scanned: number;
  findings_total: number;
  avg_score: number;
  trigger: string;
  status: string;
}

export interface RecentRun {
  id: number;
  target_name: string;
  target_label: string;
  audit_type: AuditType;
  started_at: string;
  finished_at: string | null;
  pages_scanned: number;
  findings_total: number;
  avg_score: number;
  status: string;
  trigger: string;
}

export interface TopFinding {
  audit_type: AuditType;
  rule: string;
  severity: "error" | "warn" | "info";
  count: number;
}

export interface IssueFeedItem {
  surface: string;
  surfaceLabel: string;
  surfaceType: SurfaceType | null;
  auditType: AuditType;
  rule: string;
  severity: "error" | "warn" | "info";
  message: string;
  url: string;
  lastSeen: string;
  affected: number;
}

export interface EcosystemSummary {
  surfacesTotal: number;
  surfacesHealthy: number;
  surfacesWithErrors: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  avgScore: number;
}

export interface Snapshot {
  generatedAt: string;
  targets: Target[];
  latest: LatestRun[];
  recent: RecentRun[];
  topFindings: TopFinding[];
  issues?: IssueFeedItem[];
  ecosystemSummary?: EcosystemSummary;
}

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  tier?: "expert" | "standard";
}

export const AUTH_KEY = "digilist-admin-basic-auth-v1";

/**
 * Read the admin token used by Convex mutations/queries. Returns "" when
 * not logged in (Convex will reject the call). Components pass this as
 * the `adminToken` arg on every call — see convex/auth.ts.
 */
export function adminToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_KEY) ?? "";
}

/**
 * Single source of truth for the ecosystem KPIs shown on the header
 * badges, the sidebar mini-KPI, the Oversikt tile strip, and any
 * future panel. ALL surface-rollup numbers should be computed once in
 * Convex (convex/audits/state.ts:snapshot's ecosystemSummary) and read
 * via this helper — no per-component re-derivation, no drift.
 *
 * Returns null when the snapshot hasn't loaded yet.
 */
export interface EcosystemKpis {
  /** Rounded average score across every active surface's latest audits */
  avgScore: number;
  /** Number of active surfaces */
  surfacesTotal: number;
  /** Active surfaces whose latest scans have zero error-severity findings */
  surfacesHealthy: number;
  /** Active surfaces with one or more error findings */
  surfacesWithErrors: number;
  /** Total error-severity findings across all surfaces */
  errorCount: number;
  /** Total warn-severity findings */
  warnCount: number;
  /** Total info-severity findings (lowest priority) */
  infoCount: number;
  /** Health bucket — drives the global tone (banner color, badge tint) */
  health: "good" | "warn" | "bad";
}

export function getEcosystemKpis(
  snap: { ecosystemSummary?: EcosystemSummary } | null | undefined,
): EcosystemKpis | null {
  const s = snap?.ecosystemSummary;
  if (!s) return null;
  return {
    avgScore: Math.round(s.avgScore),
    surfacesTotal: s.surfacesTotal,
    surfacesHealthy: s.surfacesHealthy,
    surfacesWithErrors: s.surfacesWithErrors,
    errorCount: s.errorCount,
    warnCount: s.warnCount,
    infoCount: s.infoCount,
    health:
      s.errorCount > 0 || s.avgScore < 60
        ? "bad"
        : s.avgScore < 85 || s.warnCount > 0
          ? "warn"
          : "good",
  };
}

export const AUDIT_LABEL: Record<AuditType, string> = {
  uptime: "Oppetid",
  seo: "SEO",
  a11y: "Tilgjengelighet",
  security: "Sikkerhet",
  links: "Lenker",
  performance: "Ytelse",
  vulns: "Sårbarheter",
};

export const ENV_LABEL: Record<Environment, string> = {
  production: "Produksjon",
  staging: "Pre-prod",
  preview: "Forhåndsvisning",
};

export const SURFACE_LABEL: Record<SurfaceType, string> = {
  marketing: "Markedsføring",
  app: "App",
  dashboard: "Dashbord",
  docs: "Dokumentasjon",
  api: "API",
  status: "Status",
};

export function getAuth(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEY);
}

export function scoreClass(s: number | null): string {
  if (s === null) return "text-ink-faint";
  if (s >= 85) return "text-green-700 dark:text-green-400";
  if (s >= 60) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

export interface IntelligenceCtx {
  snap: Snapshot | null;
  loading: boolean;
  refresh: () => Promise<void>;
  running: string | null;
  runScan: (target?: string) => Promise<void>;
}
