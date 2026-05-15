/**
 * Writes a JSON snapshot of the current audit state. Consumed by the
 * static dashboard generator AND by /api/audits/state on the VPS.
 *
 *   tsx tools/site-intelligence/src/snapshot.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openDb,
  defaultDbPath,
  listTargets,
  latestRunsByTargetAndType,
  recentRuns,
  findingsForRun,
} from "./db";
import { TARGETS, findTarget } from "./targets";
import type { Target } from "./targets";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function defaultSnapshotPath(): string {
  return path.resolve(__dirname, "..", "reports", "state.json");
}

export interface EnrichedTarget {
  id: number;
  name: string;
  label: string;
  origin: string;
  description: string;
  is_active: number;
  /** Surface category — marketing / app / dashboard / docs / api / status. */
  type: Target["type"] | null;
  environment: Target["environment"] | null;
  indexable: boolean;
  requiresAuth: boolean;
  checks: Target["checks"];
}

export interface IssueFeedItem {
  surface: string;        // target.name
  surfaceLabel: string;
  surfaceType: Target["type"] | null;
  auditType: string;
  rule: string;
  severity: string;
  message: string;
  url: string;
  lastSeen: string;       // run started_at
  /** Number of pages this rule fires on in the latest run. */
  affected: number;
}

export interface Snapshot {
  generatedAt: string;
  targets: EnrichedTarget[];
  latest: ReturnType<typeof latestRunsByTargetAndType>;
  recent: ReturnType<typeof recentRuns>;
  topFindings: Array<{
    audit_type: string;
    rule: string;
    severity: string;
    count: number;
  }>;
  /** "What Went Wrong" issue feed — one row per (surface, audit, rule). */
  issues: IssueFeedItem[];
  /** Per-surface roll-up score for the Ecosystem Overview tile. */
  ecosystemSummary: {
    surfacesTotal: number;
    surfacesHealthy: number;
    surfacesWithErrors: number;
    errorCount: number;
    warnCount: number;
    infoCount: number;
    avgScore: number;
  };
}

export function buildSnapshot(): Snapshot {
  const db = openDb();
  // Always upsert every declared surface — that way the dashboard renders
  // an empty INAKTIV tile for surfaces that have never been scanned (e.g.
  // api.digilist.no) instead of dropping them silently.
  const upsertStmt = db.prepare(
    `INSERT INTO targets (name, label, origin, description, is_active)
     VALUES (?,?,?,?,?)
     ON CONFLICT(name) DO UPDATE SET
       label = excluded.label,
       origin = excluded.origin,
       description = excluded.description,
       is_active = excluded.is_active`,
  );
  for (const t of TARGETS) {
    upsertStmt.run(t.name, t.label, t.origin, t.description, t.active ? 1 : 0);
  }
  const targetRows = listTargets(db);

  // Enrich DB rows with the runtime Target metadata that lives in targets.ts
  // (type / environment / indexable / requiresAuth / checks).
  const enrichedTargets: EnrichedTarget[] = targetRows.map((row) => {
    const def = findTarget(row.name);
    return {
      ...row,
      type: def?.type ?? null,
      environment: def?.environment ?? null,
      indexable: def?.indexable ?? false,
      requiresAuth: def?.requiresAuth ?? false,
      checks: def?.checks ?? [],
    };
  });

  // Only show latest runs for audit types currently in the target's checks[].
  // If we previously ran `links` on app but then dropped it, the old run shouldn't
  // keep poisoning the surface's overall score.
  const allLatest = latestRunsByTargetAndType(db);
  const checksByTarget = new Map<string, Set<string>>();
  for (const t of TARGETS) {
    checksByTarget.set(t.name, new Set(t.checks));
  }
  const latest = allLatest.filter((r) => {
    const allowed = checksByTarget.get(r.target_name);
    if (!allowed) return true; // unknown target — pass through
    return allowed.has(r.audit_type);
  });

  // Aggregate top findings + build the per-surface issue feed
  const top: Snapshot["topFindings"] = [];
  const issues: IssueFeedItem[] = [];

  for (const run of latest) {
    const rows = findingsForRun(db, run.id);
    const surfaceDef = findTarget(run.target_name);
    // (rule × url) → keep most recent example for the issue feed
    const ruleKey = (r: { rule: string }) => r.rule;
    const ruleSamples = new Map<
      string,
      { sample: typeof rows[number]; severity: string; affected: Set<string> }
    >();
    for (const r of rows) {
      const k = ruleKey(r);
      const cur = ruleSamples.get(k);
      if (cur) {
        cur.affected.add(r.url);
      } else {
        ruleSamples.set(k, {
          sample: r,
          severity: r.severity,
          affected: new Set([r.url]),
        });
      }
    }
    for (const [rule, { sample, severity, affected }] of ruleSamples) {
      top.push({
        audit_type: run.audit_type,
        rule,
        severity,
        count: affected.size,
      });
      issues.push({
        surface: run.target_name,
        surfaceLabel: run.target_label,
        surfaceType: surfaceDef?.type ?? null,
        auditType: run.audit_type,
        rule,
        severity,
        message: sample.message,
        url: sample.url,
        lastSeen: run.started_at,
        affected: affected.size,
      });
    }
  }

  const severityRank = (s: string) =>
    s === "error" ? 0 : s === "warn" ? 1 : 2;
  top.sort(
    (a, b) =>
      severityRank(a.severity) - severityRank(b.severity) || b.count - a.count,
  );
  issues.sort(
    (a, b) =>
      severityRank(a.severity) - severityRank(b.severity) ||
      b.affected - a.affected ||
      a.surface.localeCompare(b.surface),
  );

  // Ecosystem roll-up — one number per surface, average across latest runs
  const surfaceScores = new Map<string, number[]>();
  const surfaceErrorCount = new Map<string, number>();
  let errorCount = 0;
  let warnCount = 0;
  let infoCount = 0;
  for (const run of latest) {
    const arr = surfaceScores.get(run.target_name) || [];
    arr.push(run.avg_score);
    surfaceScores.set(run.target_name, arr);
  }
  for (const issue of issues) {
    if (issue.severity === "error") {
      errorCount += issue.affected;
      surfaceErrorCount.set(
        issue.surface,
        (surfaceErrorCount.get(issue.surface) || 0) + issue.affected,
      );
    } else if (issue.severity === "warn") {
      warnCount += issue.affected;
    } else {
      infoCount += issue.affected;
    }
  }
  const surfacesTotal = enrichedTargets.filter((t) => t.is_active).length;
  const surfacesWithErrors = Array.from(surfaceErrorCount.values()).filter(
    (n) => n > 0,
  ).length;
  const avgScore =
    surfaceScores.size === 0
      ? 0
      : Array.from(surfaceScores.values())
          .map((arr) => arr.reduce((s, x) => s + x, 0) / arr.length)
          .reduce((s, x) => s + x, 0) / surfaceScores.size;

  const snap: Snapshot = {
    generatedAt: new Date().toISOString(),
    targets: enrichedTargets,
    latest,
    recent: recentRuns(db, 30),
    topFindings: top.slice(0, 30),
    issues: issues.slice(0, 200),
    ecosystemSummary: {
      surfacesTotal,
      surfacesHealthy: surfacesTotal - surfacesWithErrors,
      surfacesWithErrors,
      errorCount,
      warnCount,
      infoCount,
      avgScore,
    },
  };
  db.close();
  return snap;
}

export function writeSnapshot(out = defaultSnapshotPath()): string {
  const snap = buildSnapshot();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(snap, null, 2), "utf8");
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = writeSnapshot();
  console.log(`[snapshot] wrote ${out}`);
  void defaultDbPath;
}
