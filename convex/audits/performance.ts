/**
 * Performance auditor backed by Google PageSpeed Insights API (free,
 * no auth required for public use). Replaces the "Under arbeid"
 * placeholder on /admin/intelligence/ytelse.
 *
 * What it does:
 *   1. For every indexable production HTML surface (marketing, docs,
 *      status), calls PSI for mobile strategy.
 *   2. Parses Lighthouse perf score + the five Core Web Vitals
 *      (LCP, CLS, INP, FCP, TTFB).
 *   3. Writes one audit_run per surface with type="performance".
 *   4. Emits one finding per CWV metric in the needs-improvement
 *      or poor band so the dashboard's Hva-gikk-galt feed surfaces them.
 *
 * Trigger:
 *   - Cron: add to the daily content/audit timer
 *   - Manual: `convex.action(api.audits.performance.scan, { adminToken })`
 *
 * Env (Convex deployment):
 *   PSI_API_KEY  — optional; without it PSI rate-limits anonymous calls
 *                  to ~25k/day shared, which is more than enough for
 *                  our 3 surfaces × 1 strategy × 1 run/day = 3 calls.
 *                  Set via `npx convex env set PSI_API_KEY <key>` to be
 *                  safe in case Google ever tightens.
 */
import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { requireAdmin } from "../auth";
import { TARGETS } from "./targets";

interface PSIResponse {
  lighthouseResult?: {
    categories: {
      performance?: { score: number | null };
      accessibility?: { score: number | null };
      "best-practices"?: { score: number | null };
      seo?: { score: number | null };
    };
    audits: Record<
      string,
      {
        numericValue?: number;
        displayValue?: string;
        score?: number | null;
      }
    >;
  };
  loadingExperience?: {
    metrics?: {
      INTERACTION_TO_NEXT_PAINT_MS?: {
        percentile: number;
        category: string;
      };
    };
  };
}

interface CWVMetrics {
  lcp_ms: number | null;
  cls: number | null;
  inp_ms: number | null;
  fcp_ms: number | null;
  ttfb_ms: number | null;
  perf_score: number | null;
  a11y_score: number | null;
  bp_score: number | null;
  seo_score: number | null;
}

// Web.dev / Lighthouse-aligned thresholds.
function band(metric: "lcp" | "cls" | "inp", value: number): "good" | "needs-improvement" | "poor" {
  if (metric === "lcp") {
    if (value < 2500) return "good";
    if (value < 4000) return "needs-improvement";
    return "poor";
  }
  if (metric === "cls") {
    if (value < 0.1) return "good";
    if (value < 0.25) return "needs-improvement";
    return "poor";
  }
  // inp
  if (value < 200) return "good";
  if (value < 500) return "needs-improvement";
  return "poor";
}

function severityFor(b: "good" | "needs-improvement" | "poor"): "error" | "warn" | null {
  if (b === "poor") return "error";
  if (b === "needs-improvement") return "warn";
  return null;
}

async function fetchPSI(
  url: string,
  apiKey: string | undefined,
  strategy: "mobile" | "desktop" = "mobile",
): Promise<CWVMetrics & { raw: string }> {
  const params = new URLSearchParams({ url, strategy });
  for (const cat of ["performance", "accessibility", "best-practices", "seo"]) {
    params.append("category", cat);
  }
  if (apiKey) params.set("key", apiKey);
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
  const r = await fetch(endpoint);
  if (!r.ok) {
    const body = await r.text();
    throw new Error(
      `PSI ${r.status} for ${url}: ${body.slice(0, 200)}`,
    );
  }
  const data = (await r.json()) as PSIResponse;
  const lh = data.lighthouseResult;
  const cats = lh?.categories;
  const a = lh?.audits ?? {};
  const inp =
    data.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT_MS?.percentile ??
    null;
  return {
    lcp_ms: a["largest-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    inp_ms: inp,
    fcp_ms: a["first-contentful-paint"]?.numericValue ?? null,
    ttfb_ms: a["server-response-time"]?.numericValue ?? null,
    perf_score:
      cats?.performance?.score != null
        ? Math.round(cats.performance.score * 100)
        : null,
    a11y_score:
      cats?.accessibility?.score != null
        ? Math.round(cats.accessibility.score * 100)
        : null,
    bp_score:
      cats?.["best-practices"]?.score != null
        ? Math.round(cats["best-practices"]!.score! * 100)
        : null,
    seo_score:
      cats?.seo?.score != null ? Math.round(cats.seo.score * 100) : null,
    raw: "",
  };
}

export const scan = action({
  args: {
    adminToken: v.string(),
    /**
     * Optional single-surface scope. When omitted, audits every
     * production HTML surface (marketing, docs, status).
     */
    target: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const apiKey = process.env.PSI_API_KEY;

    // Scan every active surface. PSI works against auth-gated pages
    // (it just measures the public login/signup splash) and staging,
    // so users get an honest read on every subdomain. The `api` surface
    // is the only one we still skip because PSI returns garbage on
    // non-HTML endpoints — no Largest Contentful Paint, no Cumulative
    // Layout Shift, just network errors.
    const candidates = TARGETS.filter(
      (t) => t.active && t.type !== "api",
    ).filter((t) => (args.target ? t.name === args.target : true));

    const results: Array<{
      target: string;
      status: "ok" | "error";
      score: number | null;
      findings: number;
      error?: string;
    }> = [];

    // We measure mobile AND desktop. The mobile profile is the strict
    // Lighthouse signal (Moto G4 + slow 4G); desktop reflects what
    // kommune buyers on laptops actually experience. Each strategy
    // lands as its own audit_run with a distinct audit_type so the
    // Ytelse page can show both columns side-by-side.
    const STRATEGIES = [
      { strategy: "mobile" as const, auditType: "performance" },
      { strategy: "desktop" as const, auditType: "performance_desktop" },
    ];

    for (const target of candidates) {
     for (const { strategy, auditType } of STRATEGIES) {
      // Start an audit_run so the dashboard's history view picks it up.
      let runId: Awaited<ReturnType<typeof ctx.runMutation>> | null = null;
      try {
        const start = await ctx.runMutation(api.audits.runs.startRun, {
          adminToken: args.adminToken,
          target_name: target.name,
          audit_type: auditType,
          trigger: "dashboard",
        });
        runId = start.id as Awaited<ReturnType<typeof ctx.runMutation>>;
      } catch (e) {
        results.push({
          target: `${target.name} (${strategy})`,
          status: "error",
          score: null,
          findings: 0,
          error: `startRun failed: ${String(e).slice(0, 120)}`,
        });
        continue;
      }

      try {
        const m = await fetchPSI(target.origin, apiKey, strategy);
        const findings: Array<{
          rule: string;
          severity: "error" | "warn";
          message: string;
        }> = [];
        // Severity → Norwegian label for the finding body
        const sevLabel = (s: "error" | "warn") =>
          s === "error" ? "kritisk" : "trenger forbedring";
        if (m.lcp_ms !== null) {
          const sev = severityFor(band("lcp", m.lcp_ms));
          if (sev) {
            findings.push({
              rule: "cwv.lcp",
              severity: sev,
              message: `LCP ${(m.lcp_ms / 1000).toFixed(2)}s (${sevLabel(sev)} — mål <2,5s)`,
            });
          }
        }
        if (m.cls !== null) {
          const sev = severityFor(band("cls", m.cls));
          if (sev) {
            findings.push({
              rule: "cwv.cls",
              severity: sev,
              message: `CLS ${m.cls.toFixed(3)} (${sevLabel(sev)} — mål <0,1)`,
            });
          }
        }
        if (m.inp_ms !== null) {
          const sev = severityFor(band("inp", m.inp_ms));
          if (sev) {
            findings.push({
              rule: "cwv.inp",
              severity: sev,
              message: `INP ${m.inp_ms}ms (${sevLabel(sev)} — mål <200ms). Real-user-data fra Chrome User Experience Report.`,
            });
          }
        }
        // Lighthouse Performance score itself as an info-level finding
        // when under 90 — gives a single per-surface signal for the
        // overview grid.
        if (m.perf_score !== null && m.perf_score < 90) {
          findings.push({
            rule: "lighthouse.performance",
            severity: m.perf_score < 50 ? "error" : "warn",
            message: `Lighthouse Ytelse-score ${m.perf_score}/100 (mål ≥90).`,
          });
        }

        // One audit_pages row holding all numeric metrics for this strategy
        await ctx.runMutation(api.audits.runs.addPage, {
          adminToken: args.adminToken,
          run_id: runId as Awaited<ReturnType<typeof ctx.runMutation>>,
          url: target.origin,
          score: m.perf_score ?? 0,
          metrics_json: JSON.stringify({
            strategy,
            lcp_ms: m.lcp_ms,
            cls: m.cls,
            inp_ms: m.inp_ms,
            fcp_ms: m.fcp_ms,
            ttfb_ms: m.ttfb_ms,
            scores: {
              performance: m.perf_score,
              accessibility: m.a11y_score,
              best_practices: m.bp_score,
              seo: m.seo_score,
            },
          }),
        });

        for (const f of findings) {
          await ctx.runMutation(api.audits.runs.addFinding, {
            adminToken: args.adminToken,
            run_id: runId as Awaited<ReturnType<typeof ctx.runMutation>>,
            url: target.origin,
            rule: f.rule,
            severity: f.severity,
            message: f.message,
          });
        }

        await ctx.runMutation(api.audits.runs.finishRun, {
          adminToken: args.adminToken,
          id: runId as Awaited<ReturnType<typeof ctx.runMutation>>,
          status: "ok",
          pages_scanned: 1,
          findings_total: findings.length,
          avg_score: m.perf_score ?? 0,
        });

        results.push({
          target: `${target.name} (${strategy})`,
          status: "ok",
          score: m.perf_score,
          findings: findings.length,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await ctx.runMutation(api.audits.runs.finishRun, {
          adminToken: args.adminToken,
          id: runId as Awaited<ReturnType<typeof ctx.runMutation>>,
          status: "error",
          pages_scanned: 0,
          findings_total: 0,
          avg_score: 0,
        });
        results.push({
          target: `${target.name} (${strategy})`,
          status: "error",
          score: null,
          findings: 0,
          error: msg.slice(0, 160),
        });
      }
     } // end strategy loop
    }

    return { scanned: results.length, results };
  },
});
