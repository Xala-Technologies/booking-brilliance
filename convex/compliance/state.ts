/**
 * Compliance state — read-only queries for the admin dashboard.
 *
 * `dashboard` returns everything the /etterlevelse page needs in one
 * shot: controls (with rolled-up evidence counts), risks, assets, RoPA,
 * plus per-framework implementation totals. Mirrors the
 * audits/state.snapshot pattern so the page can rely on a single query.
 *
 * `summary` is a thin public projection — only counts per framework,
 * no control text or evidence details. Safe to render on /transparens.
 */
import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../auth";

interface FrameworkSummary {
  framework: string;
  total: number;
  by_status: Record<string, number>;
  implementation_pct: number;
}

export const dashboard = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const [controls, evidence, risks, assets, ropa] = await Promise.all([
      ctx.db.query("compliance_controls").collect(),
      ctx.db.query("compliance_evidence").collect(),
      ctx.db.query("compliance_risks").collect(),
      ctx.db.query("compliance_assets").collect(),
      ctx.db.query("processing_activities").collect(),
    ]);

    // evidence-by-control rollup
    const evidenceByControl = new Map<string, typeof evidence>();
    for (const e of evidence) {
      const arr = evidenceByControl.get(e.control_ref) ?? [];
      arr.push(e);
      evidenceByControl.set(e.control_ref, arr);
    }

    const controlsWithEvidence = controls.map((c) => {
      const ev = evidenceByControl.get(c.ref) ?? [];
      const latestEv = ev
        .slice()
        .sort((a, b) => b.collected_at.localeCompare(a.collected_at))[0];
      return {
        ...c,
        evidence_count: ev.length,
        latest_evidence: latestEv
          ? {
              title: latestEv.title,
              status: latestEv.status,
              collected_at: latestEv.collected_at,
              source: latestEv.source,
            }
          : null,
      };
    });

    // per-framework summary
    const frameworks = ["iso27001", "soc2", "gdpr"];
    const summaries: FrameworkSummary[] = frameworks.map((f) => {
      const subset = controls.filter((c) => c.framework === f);
      const by_status: Record<string, number> = {
        implemented: 0,
        partial: 0,
        missing: 0,
        not_applicable: 0,
        planned: 0,
      };
      for (const c of subset) {
        by_status[c.status] = (by_status[c.status] ?? 0) + 1;
      }
      const applicable = subset.length - (by_status.not_applicable ?? 0);
      const credit =
        (by_status.implemented ?? 0) + 0.5 * (by_status.partial ?? 0);
      const implementation_pct =
        applicable === 0 ? 0 : Math.round((credit / applicable) * 100);
      return {
        framework: f,
        total: subset.length,
        by_status,
        implementation_pct,
      };
    });

    return {
      controls: controlsWithEvidence,
      evidence: evidence.slice().sort((a, b) =>
        b.collected_at.localeCompare(a.collected_at),
      ),
      risks: risks.slice().sort((a, b) => b.inherent_score - a.inherent_score),
      assets,
      processing_activities: ropa,
      summaries,
    };
  },
});

// Public, no-auth — used by /transparens trust posture banner.
// Returns only top-level percentages; no control text.
export const publicSummary = query({
  args: {},
  handler: async (ctx) => {
    const controls = await ctx.db.query("compliance_controls").collect();
    const frameworks = ["iso27001", "soc2", "gdpr"];
    return frameworks.map((f) => {
      const subset = controls.filter((c) => c.framework === f);
      const by_status: Record<string, number> = {
        implemented: 0,
        partial: 0,
        missing: 0,
        not_applicable: 0,
        planned: 0,
      };
      for (const c of subset) {
        by_status[c.status] = (by_status[c.status] ?? 0) + 1;
      }
      const applicable = subset.length - (by_status.not_applicable ?? 0);
      const credit =
        (by_status.implemented ?? 0) + 0.5 * (by_status.partial ?? 0);
      const implementation_pct =
        applicable === 0 ? 0 : Math.round((credit / applicable) * 100);
      return { framework: f, implementation_pct, total: subset.length };
    });
  },
});
