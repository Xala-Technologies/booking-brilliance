/**
 * HTML report generator. Reads the latest run from SQLite and writes
 * tools/seo-crawler/reports/index.html.
 *
 *   tsx tools/seo-crawler/src/report.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openDb,
  latestRunId,
  runSummary,
  pagesForRun,
  findingsForRun,
} from "./db";

interface Args {
  db: string;
  out: string;
  runId?: number;
}

function defaultDbPath() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "reports", "seo.sqlite");
}

function defaultOutPath() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "reports", "index.html");
}

function parseArgs(argv: string[]): Args {
  const out: Args = { db: defaultDbPath(), out: defaultOutPath() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--db") out.db = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--run") out.runId = Number(argv[++i]);
  }
  return out;
}

export function generate(args: Args): string {
  const db = openDb(args.db);
  const id = args.runId ?? latestRunId(db);
  if (id === null) {
    db.close();
    throw new Error("No crawl runs found in DB. Run `pnpm seo:crawl` first.");
  }
  const summary = runSummary(db, id);
  if (!summary) throw new Error(`Run ${id} not found.`);
  const pages = pagesForRun(db, id);
  const findings = findingsForRun(db, id);
  db.close();

  const byRule = new Map<string, number>();
  for (const f of findings)
    byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
  const ruleRows = [...byRule.entries()].sort((a, b) => b[1] - a[1]);

  const findingsByUrl = new Map<string, typeof findings>();
  for (const f of findings) {
    const arr = findingsByUrl.get(f.url) ?? [];
    arr.push(f);
    findingsByUrl.set(f.url, arr);
  }

  const html = renderHtml({
    summary,
    pages,
    findings,
    ruleRows,
    findingsByUrl,
  });

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, html, "utf8");
  console.log(`[seo] wrote ${args.out}`);
  return args.out;
}

type ReportData = {
  summary: {
    id: number;
    started_at: string;
    origin: string;
    pages_total: number;
    findings_total: number;
    avg_score: number;
  };
  pages: ReturnType<typeof pagesForRun>;
  findings: ReturnType<typeof findingsForRun>;
  ruleRows: Array<[string, number]>;
  findingsByUrl: Map<string, ReturnType<typeof findingsForRun>>;
};

function renderHtml(data: ReportData): string {
  const { summary, pages, findings, ruleRows, findingsByUrl } = data;

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warn").length;
  const infos = findings.filter((f) => f.severity === "info").length;

  const recommendations = topRecommendations(ruleRows);

  return /* html */ `<!doctype html>
<html lang="nb">
<head>
<meta charset="utf-8">
<title>SEO-rapport · Digilist · ${esc(summary.started_at)}</title>
<style>
  :root {
    --paper: #FBF8F3;
    --paper-deep: #F4EFE6;
    --ink: #0A1228;
    --ink-soft: #424B66;
    --ink-faint: #6C7387;
    --navy: #1F2F6E;
    --rule: rgba(10, 18, 40, 0.12);
    --rule-strong: rgba(10, 18, 40, 0.24);
    --error: #B00020;
    --warn: #A57400;
    --info: #1F2F6E;
    --ok: #2D7A3A;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Public Sans", system-ui, sans-serif;
    background: var(--paper);
    color: var(--ink);
    line-height: 1.55;
  }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 3rem 1.25rem 5rem; }
  h1, h2, h3 {
    font-family: Fraunces, Georgia, serif;
    font-weight: 460;
    letter-spacing: -0.015em;
    margin: 0;
  }
  h1 { font-size: 3rem; line-height: 1.05; }
  h2 { font-size: 1.75rem; margin-top: 2.5rem; }
  h3 { font-size: 1.25rem; margin-top: 1.5rem; }
  .mono {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: var(--ink-faint);
  }
  .lede { color: var(--ink-soft); font-size: 1.1rem; max-width: 60ch; }
  .grid-4 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1px;
    background: var(--rule-strong);
    border: 1px solid var(--rule-strong);
    margin: 2rem 0;
  }
  .stat { background: var(--paper); padding: 1.25rem 1.5rem; }
  .stat .label { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 0.5rem; }
  .stat .value { font-family: Fraunces, Georgia, serif; font-size: 2.5rem; font-weight: 460; line-height: 1; }
  .stat .value.error { color: var(--error); }
  .stat .value.warn { color: var(--warn); }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.95rem; }
  th, td { text-align: left; padding: 0.65rem 0.5rem; border-bottom: 0.5px solid var(--rule); }
  th { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); font-weight: 500; }
  tr:hover td { background: var(--paper-deep); }
  td.url { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.78rem; word-break: break-all; }
  td.score { text-align: right; font-family: Fraunces, Georgia, serif; font-size: 1.15rem; font-weight: 460; }
  .score-ok { color: var(--ok); }
  .score-mid { color: var(--warn); }
  .score-bad { color: var(--error); }
  details { border-top: 0.5px solid var(--rule); padding: 1rem 0; }
  details summary { cursor: pointer; list-style: none; display: flex; align-items: baseline; gap: 1rem; }
  details summary::-webkit-details-marker { display: none; }
  summary .u { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.85rem; flex: 1; word-break: break-all; }
  summary .s { font-family: Fraunces, Georgia, serif; font-size: 1.2rem; }
  .badge {
    display: inline-block;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 2px;
    border: 0.5px solid currentColor;
  }
  .badge.error { color: var(--error); }
  .badge.warn { color: var(--warn); }
  .badge.info { color: var(--info); }
  .finding-list { margin: 0.75rem 0 0 0; padding: 0 0 0 1rem; }
  .finding-list li { margin-bottom: 0.35rem; }
  .reco { background: var(--paper-deep); border: 0.5px solid var(--rule-strong); border-radius: 2px; padding: 1.25rem 1.5rem; margin-top: 1rem; }
  .reco h3 { margin-top: 0; }
  .reco p { color: var(--ink-soft); margin: 0.35rem 0 0; }
  .small { font-size: 0.8rem; color: var(--ink-faint); }
  .pill-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
  .rule-pill {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.72rem;
    padding: 4px 10px;
    background: var(--paper-deep);
    border: 0.5px solid var(--rule-strong);
    border-radius: 999px;
  }
</style>
</head>
<body>
<div class="wrap">
  <p class="mono">DIGILIST · SEO-RAPPORT · KJØRSEL #${summary.id}</p>
  <h1>SEO-helse: ${summary.avg_score.toFixed(0)} / 100</h1>
  <p class="lede">
    Audit av <strong>${esc(summary.origin)}</strong> kjørt
    ${esc(summary.started_at)}. ${summary.pages_total} sider analysert
    mot 13 SEO-regler.
  </p>

  <div class="grid-4">
    <div class="stat"><div class="label">Sider</div><div class="value">${summary.pages_total}</div></div>
    <div class="stat"><div class="label">Funn (totalt)</div><div class="value">${summary.findings_total}</div></div>
    <div class="stat"><div class="label">Feil</div><div class="value error">${errors}</div></div>
    <div class="stat"><div class="label">Advarsler</div><div class="value warn">${warnings}</div></div>
  </div>

  <h2>Anbefalinger</h2>
  ${recommendations.map(r => `
    <div class="reco">
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.body)}</p>
    </div>
  `).join("")}

  <h2>Mest hyppige funn</h2>
  <table>
    <thead><tr><th>Regel</th><th>Antall</th></tr></thead>
    <tbody>
      ${ruleRows.map(([rule, count]) => `
        <tr><td><span class="rule-pill">${esc(rule)}</span></td><td class="score">${count}</td></tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Sider — sortert etter score</h2>
  <table>
    <thead>
      <tr>
        <th>Side</th>
        <th>Ord</th>
        <th>JSON-LD</th>
        <th>Status</th>
        <th>Last (ms)</th>
        <th style="text-align:right">Score</th>
      </tr>
    </thead>
    <tbody>
      ${pages.map(p => `
        <tr>
          <td class="url">${esc(stripOrigin(p.url, summary.origin))}</td>
          <td>${p.word_count}</td>
          <td class="small">${esc(p.json_ld_types || "—")}</td>
          <td>${p.status}</td>
          <td>${p.load_ms}</td>
          <td class="score ${scoreClass(p.score)}">${p.score}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Funn per side</h2>
  ${pages.map(p => {
    const arr = findingsByUrl.get(p.url) ?? [];
    if (arr.length === 0) return "";
    return `
      <details>
        <summary>
          <span class="s ${scoreClass(p.score)}">${p.score}</span>
          <span class="u">${esc(stripOrigin(p.url, summary.origin))}</span>
          <span class="small">${arr.length} funn</span>
        </summary>
        <ul class="finding-list">
          ${arr.map(f => `
            <li>
              <span class="badge ${f.severity}">${f.severity}</span>
              <span class="small mono">${esc(f.rule)}</span>
              — ${esc(f.message)}
            </li>
          `).join("")}
        </ul>
      </details>
    `;
  }).join("")}

  <p class="small" style="margin-top: 3rem; text-align: center;">
    DIGILIST SEO-CRAWLER · v1 · ${esc(summary.started_at)}
  </p>
</div>
</body>
</html>`;
}

function esc(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripOrigin(url: string, origin: string): string {
  if (url.startsWith(origin)) return url.slice(origin.length) || "/";
  return url;
}

function scoreClass(s: number): string {
  if (s >= 85) return "score-ok";
  if (s >= 60) return "score-mid";
  return "score-bad";
}

function topRecommendations(
  ruleRows: Array<[string, number]>,
): Array<{ title: string; body: string }> {
  const map: Record<string, { title: string; body: string }> = {
    "title.missing": {
      title: "Sett unike <title>-tagger på alle sider",
      body: "En manglende title svekker ranking og snippet-kvalitet. Sjekk SEO-komponenten din.",
    },
    "title.duplicate": {
      title: "Unngå duplikate titler på tvers av sider",
      body: "Hvert URL bør ha en distinkt title som matcher søke-intentet på den siden.",
    },
    "description.missing": {
      title: "Skriv meta-beskrivelser",
      body: "Google bruker description-en som snippet i SERP. Mangler den, blir snippet generert automatisk og typisk lavere CTR.",
    },
    "description.duplicate": {
      title: "Skriv unike meta-beskrivelser",
      body: "Duplikate descriptions signaliserer at sidene konkurrerer mot hverandre.",
    },
    "h1.missing": {
      title: "Hver side trenger nøyaktig én <h1>",
      body: "Sider uten H1 mister både tilgjengelighet og SEO-signal.",
    },
    "h1.multiple": {
      title: "Reduser til én <h1> per side",
      body: "Bruk <h2>/<h3> for underseksjoner. Flere H1-er forvirrer både skjermlesere og crawlere.",
    },
    "canonical.missing": {
      title: "Legg til canonical-URL",
      body: "Forhindrer duplikat-indeksering for sider med query-strings eller alternative paths.",
    },
    "structured.missing": {
      title: "Legg til Schema.org JSON-LD",
      body: "Rich-results krever strukturerte data: Article, FAQPage, BreadcrumbList, Organization, SoftwareApplication etc.",
    },
    "image.alt": {
      title: "Fyll inn alt-tekst på bilder",
      body: "Tilgjengelig for skjermlesere og essensielt for image SEO.",
    },
    "content.thin": {
      title: "Tynne sider — utvid innhold til ≥200 ord",
      body: "Sider med lite innhold rangeres lavt. Tilfør kontekst, FAQ eller relaterte lenker.",
    },
    "link.broken": {
      title: "Fiks interne lenker som returnerer feil",
      body: "Brutte interne lenker svekker crawl-budsjett og brukeropplevelse.",
    },
    "perf.slow": {
      title: "Optimaliser trege sider (Core Web Vitals)",
      body: "Server side rendering, bildekomprimering og bundle splitting reduserer initial last.",
    },
    "og.incomplete": {
      title: "Komplett Open Graph",
      body: "title + description + image gir bedre delinger på LinkedIn, Slack, Discord, X.",
    },
  };
  const out: Array<{ title: string; body: string }> = [];
  for (const [rule] of ruleRows.slice(0, 6)) {
    const r = map[rule];
    if (r) out.push(r);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  try {
    generate(args);
  } catch (err) {
    console.error("[seo:report]", err);
    process.exit(1);
  }
}
