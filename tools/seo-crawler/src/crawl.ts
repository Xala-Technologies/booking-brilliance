/**
 * Crawl orchestrator. Usage:
 *   tsx tools/seo-crawler/src/crawl.ts --origin https://digilist.no
 *
 * Default origin: https://digilist.no. Sitemap is taken from /sitemap.xml on
 * the origin. Additional seed URLs can be passed with --seed (repeatable).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { Fetcher } from "./fetcher";
import { loadSitemapUrls } from "./sitemap";
import { loadRobots, isAllowed } from "./robots";
import { parseSeo, type PageSnapshot } from "./parse";
import { evaluatePage, evaluateSite, score, type Finding } from "./rules";
import {
  openDb,
  startRun,
  insertPage,
  insertFindings,
  finishRun,
} from "./db";

interface CliArgs {
  origin: string;
  seeds: string[];
  db: string;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = {
    origin: "https://digilist.no",
    seeds: [],
    db: defaultDbPath(),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--origin") out.origin = argv[++i];
    else if (a === "--seed") out.seeds.push(argv[++i]);
    else if (a === "--db") out.db = argv[++i];
  }
  return out;
}

function defaultDbPath() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "reports", "seo.sqlite");
}

export async function run(args: CliArgs): Promise<void> {
  const origin = args.origin.replace(/\/$/, "");
  console.log(`[seo] origin: ${origin}`);

  const robots = await loadRobots(origin);
  if (robots.disallows.length > 0)
    console.log(`[seo] robots.txt disallows: ${robots.disallows.join(", ")}`);
  else console.log(`[seo] robots.txt: allow all`);

  // Discover URLs
  const sitemapUrl = `${origin}/sitemap.xml`;
  const fromSitemap = await loadSitemapUrls(sitemapUrl);
  console.log(`[seo] sitemap URLs: ${fromSitemap.length}`);

  const seeds = [origin, ...args.seeds, ...fromSitemap];
  const queue = [
    ...new Set(seeds.map((u) => normalizeUrl(u, origin)).filter(Boolean)),
  ] as string[];

  const allowed = queue.filter((u) => {
    const path = new URL(u).pathname;
    return isAllowed(robots, path);
  });
  console.log(`[seo] queued: ${allowed.length} URLs (post robots.txt filter)`);

  const fetcher = new Fetcher();
  const snapshots: PageSnapshot[] = [];
  let i = 0;
  for (const url of allowed) {
    i++;
    const fp = await fetcher.fetch(url);
    if (!fp.contentType || !fp.contentType.includes("text/html")) {
      console.log(`  [${i}/${allowed.length}] skip (non-HTML) ${url}`);
      continue;
    }
    const snap = parseSeo(fp.html, fp.url, fp.status, fp.loadMs, origin);
    snapshots.push(snap);
    const lbl =
      snap.status === 200
        ? "OK "
        : snap.status === 0
          ? "ERR"
          : String(snap.status);
    console.log(
      `  [${i}/${allowed.length}] ${lbl}  ${snap.loadMs}ms  ${snap.url}`,
    );
  }

  // Evaluate
  const findings: Finding[] = [];
  for (const snap of snapshots) {
    findings.push(...evaluatePage(snap));
  }
  findings.push(...evaluateSite(snapshots));

  // Score per page
  const findingsByUrl = new Map<string, Finding[]>();
  for (const f of findings) {
    const arr = findingsByUrl.get(f.url) ?? [];
    arr.push(f);
    findingsByUrl.set(f.url, arr);
  }
  const pageScores = new Map<string, number>();
  for (const snap of snapshots) {
    pageScores.set(snap.url, score(findingsByUrl.get(snap.url) ?? []));
  }

  // Persist
  const db = openDb(args.db);
  const runId = startRun(db, origin);
  for (const snap of snapshots) {
    insertPage(db, runId, snap, pageScores.get(snap.url) ?? 0);
  }
  insertFindings(db, runId, findings);
  const avg =
    snapshots.length === 0
      ? 0
      : [...pageScores.values()].reduce((a, b) => a + b, 0) / snapshots.length;
  finishRun(db, runId, snapshots.length, findings.length, avg);
  db.close();

  console.log(
    `\n[seo] run #${runId} done — ${snapshots.length} pages, ${findings.length} findings, avg score ${avg.toFixed(1)}`,
  );
  console.log(`[seo] db: ${args.db}`);
  console.log(`[seo] run \`pnpm seo:report\` to generate the HTML report`);
}

function normalizeUrl(raw: string, origin: string): string | null {
  try {
    const u = new URL(raw, origin);
    u.hash = "";
    // Drop trailing slash except for root, to align with the prerender output
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.replace(/\/+$/, "");
    }
    return u.href;
  } catch {
    return null;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  run(args).catch((err) => {
    console.error("[seo] fatal:", err);
    process.exit(1);
  });
}
