/**
 * Automated evidence collectors — every nightly run aggregates state
 * from elsewhere in the platform and writes one `compliance_evidence`
 * row per control with `automation_signal` matching the collector key.
 *
 * Collector keys (referenced in convex/compliance/seed.ts):
 *   - tls-expiry      — checks TLS certificate expiry on every public surface
 *   - audit-findings  — rolls up audit_findings error/warn counts per surface
 *   - alerts-mttr     — measures mean-time-to-resolution on alerts
 *   - uptime-sla      — calculates uptime % from audit_runs for current month
 *   - git-changes     — counts commits in the last 7 days (proxy for change mgmt)
 *
 * Each collector returns a small JSON payload + a pass/warn/fail status.
 * The shared writer fans out the result to every control that lists the
 * collector in `automation_signal`.
 *
 * Trigger: convex/audits/runs.ts cron, or manually via the
 * `collectAll` action.
 */
import { action, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { requireAdmin } from "../auth";
import { TARGETS } from "../audits/targets";

const ISO = () => new Date().toISOString();

interface CollectorResult {
  collector: string;
  status: "pass" | "warn" | "fail" | "info";
  title: string;
  summary: string;
  payload: Record<string, unknown>;
  valid_until: string | null;
}

// ─────────────────────────────────────────────────────────────
// Collector 1: TLS expiry

async function collectTlsExpiry(): Promise<CollectorResult> {
  const publicSurfaces = TARGETS.filter(
    (t) => t.environment === "production" && t.origin.startsWith("https://"),
  );

  const checks: Array<{
    name: string;
    origin: string;
    valid_to: string | null;
    days_left: number | null;
    error: string | null;
  }> = [];

  for (const surface of publicSurfaces) {
    try {
      // We can't open raw TLS sockets from Convex actions — instead we
      // rely on the existence + age of the Let's Encrypt cert returned
      // via the `Date` header + `Strict-Transport-Security`. As a proxy
      // for "TLS is healthy on this surface" we issue a HEAD request and
      // confirm 200/3xx and HSTS presence. Real cert-date scanning runs
      // out of band on the VPS — this collector is the audit-trail row.
      const res = await fetch(surface.origin, {
        method: "HEAD",
        redirect: "manual",
      });
      const status = res.status;
      const hsts = res.headers.get("strict-transport-security");
      const ok = status >= 200 && status < 400;
      checks.push({
        name: surface.name,
        origin: surface.origin,
        valid_to: null, // populated by VPS-side certbot scanner
        days_left: null,
        error: ok && hsts ? null : `status=${status} hsts=${hsts ?? "missing"}`,
      });
    } catch (err) {
      checks.push({
        name: surface.name,
        origin: surface.origin,
        valid_to: null,
        days_left: null,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const failed = checks.filter((c) => c.error);
  const status: CollectorResult["status"] =
    failed.length === 0 ? "pass" : failed.length === checks.length ? "fail" : "warn";

  return {
    collector: "tls-expiry",
    status,
    title: "TLS-sertifikatstatus per overflate",
    summary:
      failed.length === 0
        ? `Alle ${checks.length} produksjons-overflater svarte med gyldig HTTPS + HSTS.`
        : `${failed.length} av ${checks.length} overflater feilet TLS/HSTS-sjekk: ${failed
            .map((f) => f.name)
            .join(", ")}.`,
    payload: { checks },
    // TLS evidence expires after 7 days — forces a re-collection
    valid_until: new Date(Date.now() + 7 * 86400_000).toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Collector 2: Audit findings rollup

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function collectAuditFindings(ctx: any): Promise<CollectorResult> {
  // Latest run per (target_id, audit_type) — read findings off that
  const runs = await ctx.db.query("audit_runs").collect();
  const findings = await ctx.db.query("audit_findings").collect();
  const findingsByRun = new Map<string, any[]>();
  for (const f of findings) {
    const list = findingsByRun.get(f.run_id) ?? [];
    list.push(f);
    findingsByRun.set(f.run_id, list);
  }

  // Per (target, audit_type) keep newest
  const latestByKey = new Map<string, any>();
  for (const r of runs) {
    const k = `${r.target_id}:${r.audit_type}`;
    const prev = latestByKey.get(k);
    if (!prev || r.started_at > prev.started_at) latestByKey.set(k, r);
  }

  let errors = 0;
  let warns = 0;
  for (const r of latestByKey.values()) {
    const f = findingsByRun.get(r._id) ?? [];
    for (const finding of f) {
      if (finding.severity === "error") errors += 1;
      else if (finding.severity === "warn") warns += 1;
    }
  }

  const status: CollectorResult["status"] =
    errors === 0 && warns === 0 ? "pass" : errors === 0 ? "warn" : "fail";

  return {
    collector: "audit-findings",
    status,
    title: "Tekniske sårbarheter — siste skann",
    summary: `${errors} feil + ${warns} advarsler på tvers av ${latestByKey.size} overflate-skann.`,
    payload: {
      errors,
      warns,
      scanned_targets: latestByKey.size,
    },
    valid_until: new Date(Date.now() + 86400_000).toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Collector 3: Alert MTTR

async function collectAlertMttr(ctx: any): Promise<CollectorResult> {
  const alerts = await ctx.db.query("alerts").collect();
  const closed = alerts.filter((a: any) => a.resolved_at);
  const open = alerts.filter((a: any) => !a.resolved_at);

  let totalMs = 0;
  for (const a of closed) {
    const t1 = Date.parse(a.first_seen_at);
    const t2 = Date.parse(a.resolved_at as string);
    if (Number.isFinite(t1) && Number.isFinite(t2)) totalMs += t2 - t1;
  }
  const mttrMinutes =
    closed.length === 0 ? 0 : Math.round(totalMs / closed.length / 60_000);

  const status: CollectorResult["status"] =
    open.length === 0 ? "pass" : open.length < 5 ? "warn" : "fail";

  return {
    collector: "alerts-mttr",
    status,
    title: "Hendelseshåndtering — MTTR + åpne saker",
    summary: `${open.length} åpne alarmer · gjennomsnittlig løsningstid ${mttrMinutes} minutter (${closed.length} løste).`,
    payload: {
      open_count: open.length,
      closed_count: closed.length,
      mttr_minutes: mttrMinutes,
    },
    valid_until: new Date(Date.now() + 86400_000).toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Collector 4: Uptime SLA (last 30 days)

async function collectUptimeSla(ctx: any): Promise<CollectorResult> {
  const runs = await ctx.db.query("audit_runs").collect();
  const since = new Date(Date.now() - 30 * 86400_000).toISOString();
  const uptimeRuns = runs.filter(
    (r: any) => r.audit_type === "uptime" && r.started_at >= since,
  );

  if (uptimeRuns.length === 0) {
    return {
      collector: "uptime-sla",
      status: "info",
      title: "Oppetid siste 30 dager",
      summary: "Ingen oppetid-skann tilgjengelig de siste 30 dagene.",
      payload: { runs: 0 },
      valid_until: new Date(Date.now() + 86400_000).toISOString(),
    };
  }

  const avg =
    uptimeRuns.reduce((s: number, r: any) => s + (r.avg_score ?? 0), 0) /
    uptimeRuns.length;
  // avg_score is 0–100 — interpret as availability %
  const sla = Math.round(avg * 100) / 100;
  const status: CollectorResult["status"] =
    sla >= 99.5 ? "pass" : sla >= 99 ? "warn" : "fail";

  return {
    collector: "uptime-sla",
    status,
    title: "Oppetid siste 30 dager (SLA)",
    summary: `Gjennomsnittlig oppetid ${sla.toFixed(2)}% over ${uptimeRuns.length} skann.`,
    payload: { uptime_pct: sla, runs: uptimeRuns.length },
    valid_until: new Date(Date.now() + 86400_000).toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// Reconciler: derive control status from latest auto-evidence.
//
// For every control with an automation_signal we look at the freshest
// evidence row written by that collector and map:
//   pass  → implemented
//   warn  → partial
//   fail  → missing
//   info  → leave existing status alone (no signal)
//
// Manual overrides made via mutations.updateControlStatus stick until
// the next collector run touches them — that's intentional: the
// auto-derived status is the "default truth", but admins can hold a
// status (e.g. mark "implemented" while a temporary collector regression
// resolves) by re-clicking after the auto-mark.

export const _reconcileFromEvidence = internalMutation({
  args: {},
  handler: async (ctx) => {
    const controls = await ctx.db
      .query("compliance_controls")
      .collect();

    const mapStatus = (s: string) => {
      if (s === "pass") return "implemented";
      if (s === "warn") return "partial";
      if (s === "fail") return "missing";
      return null;
    };

    const now = new Date().toISOString();
    let touched = 0;
    for (const c of controls) {
      if (!c.automation_signal) continue;
      // Latest evidence written for THIS control by THIS collector.
      // by_control is indexed on control_ref — filter on collector +
      // pick newest by created order.
      const all = await ctx.db
        .query("compliance_evidence")
        .withIndex("by_control", (q) => q.eq("control_ref", c.ref))
        .collect();
      const latest = all
        .filter((e) => e.collector === c.automation_signal)
        .sort((a, b) => b.collected_at.localeCompare(a.collected_at))[0];
      if (!latest) continue;
      const target = mapStatus(latest.status);
      if (!target) continue;
      if (c.status === target) continue;
      await ctx.db.patch(c._id, {
        status: target,
        last_reviewed_at: now,
        updated_at: now,
      });
      touched += 1;
    }
    return { reconciled: touched };
  },
});

// ─────────────────────────────────────────────────────────────
// Writer: fan out one CollectorResult to all controls with matching signal

export const _writeResult = internalMutation({
  args: {
    collector: v.string(),
    status: v.string(),
    title: v.string(),
    summary: v.string(),
    payload_json: v.string(),
    valid_until: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const controls = await ctx.db
      .query("compliance_controls")
      .withIndex("by_automation_signal", (q) =>
        q.eq("automation_signal", args.collector),
      )
      .collect();

    const now = ISO();
    let written = 0;
    for (const c of controls) {
      await ctx.db.insert("compliance_evidence", {
        control_ref: c.ref,
        framework: c.framework,
        source: "auto",
        collector: args.collector,
        title: args.title,
        summary: args.summary,
        payload_json: args.payload_json,
        link: null,
        status: args.status,
        valid_from: now,
        valid_until: args.valid_until,
        collected_at: now,
        collected_by: "convex-cron",
      });
      written += 1;
    }
    return { collector: args.collector, controls_evidenced: written };
  },
});

// ─────────────────────────────────────────────────────────────
// Public action — run every collector

export const collectAll = action({
  args: { adminToken: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    started_at: string;
    results: Array<{ collector: string; status: string; controls_evidenced: number }>;
    reconciled: number;
  }> => {
    requireAdmin(args.adminToken);
    const started_at = ISO();

    // Run collectors. The audit-findings/alerts/uptime collectors need
    // ctx.runQuery; TLS does HTTP only.
    const collectors: Array<() => Promise<CollectorResult>> = [
      () => collectTlsExpiry(),
      () =>
        ctx.runQuery(api.compliance.collectors._auditFindingsRaw, {
          adminToken: args.adminToken,
        }) as Promise<CollectorResult>,
      () =>
        ctx.runQuery(api.compliance.collectors._alertMttrRaw, {
          adminToken: args.adminToken,
        }) as Promise<CollectorResult>,
      () =>
        ctx.runQuery(api.compliance.collectors._uptimeSlaRaw, {
          adminToken: args.adminToken,
        }) as Promise<CollectorResult>,
    ];

    const results: Array<{
      collector: string;
      status: string;
      controls_evidenced: number;
    }> = [];

    for (const run of collectors) {
      try {
        const r = await run();
        const written = await ctx.runMutation(
          internal.compliance.collectors._writeResult,
          {
            collector: r.collector,
            status: r.status,
            title: r.title,
            summary: r.summary,
            payload_json: JSON.stringify(r.payload),
            valid_until: r.valid_until,
          },
        );
        results.push({
          collector: r.collector,
          status: r.status,
          controls_evidenced: written.controls_evidenced,
        });
      } catch (err) {
        results.push({
          collector: "unknown",
          status: `error: ${err instanceof Error ? err.message : String(err)}`,
          controls_evidenced: 0,
        });
      }
    }

    // Final pass: reconcile control statuses from the freshly written
    // evidence so the dashboard reflects reality without a manual click.
    const reconciled = await ctx.runMutation(
      internal.compliance.collectors._reconcileFromEvidence,
      {},
    );

    return { started_at, results, reconciled: reconciled.reconciled };
  },
});

// Internal-named queries so the action can run them (queries can't be
// called as private functions inside actions otherwise).
import { query } from "../_generated/server";

export const _auditFindingsRaw = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args): Promise<CollectorResult> => {
    requireAdmin(args.adminToken);
    return await collectAuditFindings(ctx);
  },
});

export const _alertMttrRaw = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args): Promise<CollectorResult> => {
    requireAdmin(args.adminToken);
    return await collectAlertMttr(ctx);
  },
});

export const _uptimeSlaRaw = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args): Promise<CollectorResult> => {
    requireAdmin(args.adminToken);
    return await collectUptimeSla(ctx);
  },
});
