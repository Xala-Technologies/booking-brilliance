/**
 * SQLite store. Each `pnpm crawl` writes a fresh run row, then per-page rows
 * referencing the run. Queries scope to the latest run id for reports.
 */

import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import type { PageSnapshot } from "./parse";
import type { Finding } from "./rules";

export type Db = Database.Database;

export function openDb(file: string): Db {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);
  return db;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at  TEXT    NOT NULL,
  origin      TEXT    NOT NULL,
  pages_total INTEGER NOT NULL DEFAULT 0,
  findings_total INTEGER NOT NULL DEFAULT 0,
  avg_score   REAL    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pages (
  run_id      INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  url         TEXT    NOT NULL,
  status      INTEGER NOT NULL,
  load_ms     INTEGER NOT NULL,
  title       TEXT,
  description TEXT,
  canonical   TEXT,
  word_count  INTEGER NOT NULL DEFAULT 0,
  h1_count    INTEGER NOT NULL DEFAULT 0,
  json_ld_types TEXT NOT NULL DEFAULT '',
  internal_links INTEGER NOT NULL DEFAULT 0,
  external_links INTEGER NOT NULL DEFAULT 0,
  images_total INTEGER NOT NULL DEFAULT 0,
  images_missing_alt INTEGER NOT NULL DEFAULT 0,
  score       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (run_id, url)
);

CREATE TABLE IF NOT EXISTS findings (
  run_id   INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  url      TEXT    NOT NULL,
  rule     TEXT    NOT NULL,
  severity TEXT    NOT NULL,
  message  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS findings_run_idx ON findings(run_id);
CREATE INDEX IF NOT EXISTS findings_url_idx ON findings(run_id, url);
`;

export function startRun(db: Db, origin: string): number {
  const stmt = db.prepare(
    "INSERT INTO runs (started_at, origin) VALUES (?, ?)",
  );
  const info = stmt.run(new Date().toISOString(), origin);
  return Number(info.lastInsertRowid);
}

export function finishRun(
  db: Db,
  runId: number,
  pagesTotal: number,
  findingsTotal: number,
  avgScore: number,
): void {
  db.prepare(
    "UPDATE runs SET pages_total=?, findings_total=?, avg_score=? WHERE id=?",
  ).run(pagesTotal, findingsTotal, avgScore, runId);
}

export function insertPage(
  db: Db,
  runId: number,
  snap: PageSnapshot,
  scoreValue: number,
): void {
  db.prepare(
    `INSERT INTO pages (
      run_id, url, status, load_ms, title, description, canonical,
      word_count, h1_count, json_ld_types,
      internal_links, external_links, images_total, images_missing_alt, score
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    runId,
    snap.url,
    snap.status,
    snap.loadMs,
    snap.title,
    snap.description,
    snap.canonical,
    snap.wordCount,
    snap.h1.length,
    snap.jsonLdTypes.join(","),
    snap.internalLinks.length,
    snap.externalLinks.length,
    snap.imagesTotal,
    snap.imagesMissingAlt,
    scoreValue,
  );
}

export function insertFindings(
  db: Db,
  runId: number,
  findings: Finding[],
): void {
  if (findings.length === 0) return;
  const stmt = db.prepare(
    "INSERT INTO findings (run_id, url, rule, severity, message) VALUES (?,?,?,?,?)",
  );
  const insertMany = db.transaction((items: Finding[]) => {
    for (const f of items)
      stmt.run(runId, f.url, f.rule, f.severity, f.message);
  });
  insertMany(findings);
}

export function latestRunId(db: Db): number | null {
  const row = db
    .prepare("SELECT id FROM runs ORDER BY id DESC LIMIT 1")
    .get() as { id: number } | undefined;
  return row?.id ?? null;
}

export function runSummary(db: Db, runId: number) {
  return db
    .prepare("SELECT * FROM runs WHERE id = ?")
    .get(runId) as
    | {
        id: number;
        started_at: string;
        origin: string;
        pages_total: number;
        findings_total: number;
        avg_score: number;
      }
    | undefined;
}

export function pagesForRun(db: Db, runId: number) {
  return db
    .prepare(
      `SELECT * FROM pages WHERE run_id = ? ORDER BY score ASC, url ASC`,
    )
    .all(runId) as Array<{
    url: string;
    status: number;
    load_ms: number;
    title: string | null;
    description: string | null;
    canonical: string | null;
    word_count: number;
    h1_count: number;
    json_ld_types: string;
    internal_links: number;
    external_links: number;
    images_total: number;
    images_missing_alt: number;
    score: number;
  }>;
}

export function findingsForRun(db: Db, runId: number) {
  return db
    .prepare(
      `SELECT * FROM findings WHERE run_id = ? ORDER BY
       CASE severity WHEN 'error' THEN 0 WHEN 'warn' THEN 1 ELSE 2 END,
       url, rule`,
    )
    .all(runId) as Array<{
    url: string;
    rule: string;
    severity: "error" | "warn" | "info";
    message: string;
  }>;
}
