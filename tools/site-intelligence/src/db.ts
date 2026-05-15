/**
 * Unified SQLite store for all auditors and targets.
 * Path: tools/site-intelligence/reports/intelligence.sqlite
 */

import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import type {
  AuditFinding,
  AuditType,
  PageScore,
  Severity,
} from "./types";

export type Db = Database.Database;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function defaultDbPath(): string {
  return path.resolve(__dirname, "..", "reports", "intelligence.sqlite");
}

export function openDb(file = defaultDbPath()): Db {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS targets (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL UNIQUE,
  label       TEXT NOT NULL,
  origin      TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS audit_runs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  target_id      INTEGER NOT NULL REFERENCES targets(id) ON DELETE CASCADE,
  audit_type     TEXT NOT NULL,
  started_at     TEXT NOT NULL,
  finished_at    TEXT,
  pages_scanned  INTEGER NOT NULL DEFAULT 0,
  findings_total INTEGER NOT NULL DEFAULT 0,
  avg_score      REAL    NOT NULL DEFAULT 0,
  trigger        TEXT    NOT NULL DEFAULT 'cli',
  status         TEXT    NOT NULL DEFAULT 'running'
);

CREATE TABLE IF NOT EXISTS audit_pages (
  run_id        INTEGER NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  score         INTEGER NOT NULL,
  metrics_json  TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (run_id, url)
);

CREATE TABLE IF NOT EXISTS audit_findings (
  run_id    INTEGER NOT NULL REFERENCES audit_runs(id) ON DELETE CASCADE,
  url       TEXT NOT NULL,
  rule      TEXT NOT NULL,
  severity  TEXT NOT NULL,
  message   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS findings_run_idx     ON audit_findings(run_id);
CREATE INDEX IF NOT EXISTS findings_severity_idx ON audit_findings(severity);
CREATE INDEX IF NOT EXISTS runs_target_type_idx ON audit_runs(target_id, audit_type);
CREATE INDEX IF NOT EXISTS runs_status_idx      ON audit_runs(status);
`;

// ─────────────────────────────────────────────────────────────
// targets

export function upsertTarget(
  db: Db,
  target: {
    name: string;
    label: string;
    origin: string;
    description?: string;
    isActive?: boolean;
  },
): number {
  db.prepare(
    `INSERT INTO targets (name, label, origin, description, is_active)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET
       label = excluded.label,
       origin = excluded.origin,
       description = excluded.description,
       is_active = excluded.is_active`,
  ).run(
    target.name,
    target.label,
    target.origin,
    target.description ?? "",
    target.isActive === false ? 0 : 1,
  );
  const row = db
    .prepare("SELECT id FROM targets WHERE name = ?")
    .get(target.name) as { id: number };
  return row.id;
}

export function listTargets(db: Db) {
  return db
    .prepare("SELECT * FROM targets ORDER BY id")
    .all() as Array<{
    id: number;
    name: string;
    label: string;
    origin: string;
    description: string;
    is_active: number;
  }>;
}

// ─────────────────────────────────────────────────────────────
// runs

export function startRun(
  db: Db,
  targetId: number,
  auditType: AuditType,
  trigger: "cli" | "dashboard" | "cron" = "cli",
): number {
  const info = db
    .prepare(
      `INSERT INTO audit_runs (target_id, audit_type, started_at, trigger, status)
       VALUES (?, ?, ?, ?, 'running')`,
    )
    .run(targetId, auditType, new Date().toISOString(), trigger);
  return Number(info.lastInsertRowid);
}

export function finishRun(
  db: Db,
  runId: number,
  summary: { pages: number; findings: number; avgScore: number; status?: "ok" | "error" },
): void {
  db.prepare(
    `UPDATE audit_runs SET
       finished_at    = ?,
       pages_scanned  = ?,
       findings_total = ?,
       avg_score      = ?,
       status         = ?
     WHERE id = ?`,
  ).run(
    new Date().toISOString(),
    summary.pages,
    summary.findings,
    summary.avgScore,
    summary.status ?? "ok",
    runId,
  );
}

export function insertPages(db: Db, runId: number, pages: PageScore[]): void {
  if (pages.length === 0) return;
  const stmt = db.prepare(
    "INSERT INTO audit_pages (run_id, url, score, metrics_json) VALUES (?,?,?,?)",
  );
  const tx = db.transaction((rows: PageScore[]) => {
    for (const p of rows)
      stmt.run(runId, p.url, p.score, JSON.stringify(p.metrics ?? {}));
  });
  tx(pages);
}

export function insertFindings(
  db: Db,
  runId: number,
  findings: AuditFinding[],
): void {
  if (findings.length === 0) return;
  const stmt = db.prepare(
    "INSERT INTO audit_findings (run_id, url, rule, severity, message) VALUES (?,?,?,?,?)",
  );
  const tx = db.transaction((rows: AuditFinding[]) => {
    for (const f of rows) stmt.run(runId, f.url, f.rule, f.severity, f.message);
  });
  tx(findings);
}

// ─────────────────────────────────────────────────────────────
// reads (dashboard / API)

export interface LatestRunRow {
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

/** Latest run per (target_id, audit_type). */
export function latestRunsByTargetAndType(db: Db): LatestRunRow[] {
  return db
    .prepare(
      `WITH latest AS (
         SELECT target_id, audit_type, MAX(id) AS max_id
         FROM audit_runs
         GROUP BY target_id, audit_type
       )
       SELECT
         r.id, r.target_id, t.name AS target_name, t.label AS target_label,
         t.origin AS target_origin,
         r.audit_type, r.started_at, r.finished_at,
         r.pages_scanned, r.findings_total, r.avg_score, r.trigger, r.status
       FROM audit_runs r
       JOIN latest l ON l.max_id = r.id
       JOIN targets t ON t.id = r.target_id
       ORDER BY t.id, r.audit_type`,
    )
    .all() as LatestRunRow[];
}

export function findingsForRun(db: Db, runId: number) {
  return db
    .prepare(
      `SELECT * FROM audit_findings WHERE run_id = ? ORDER BY
       CASE severity WHEN 'error' THEN 0 WHEN 'warn' THEN 1 ELSE 2 END,
       url, rule`,
    )
    .all(runId) as Array<{
    url: string;
    rule: string;
    severity: Severity;
    message: string;
  }>;
}

export function pagesForRun(db: Db, runId: number) {
  return db
    .prepare(
      "SELECT * FROM audit_pages WHERE run_id = ? ORDER BY score ASC, url ASC",
    )
    .all(runId) as Array<{
    url: string;
    score: number;
    metrics_json: string;
  }>;
}

export function recentRuns(db: Db, limit = 20) {
  return db
    .prepare(
      `SELECT r.id, t.name AS target_name, t.label AS target_label,
              r.audit_type, r.started_at, r.finished_at,
              r.pages_scanned, r.findings_total, r.avg_score, r.status, r.trigger
       FROM audit_runs r JOIN targets t ON t.id = r.target_id
       ORDER BY r.id DESC LIMIT ?`,
    )
    .all(limit) as Array<{
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
  }>;
}
