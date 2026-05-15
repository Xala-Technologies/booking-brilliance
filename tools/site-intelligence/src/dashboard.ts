/**
 * Generates a self-contained HTML dashboard from the latest audit state.
 *
 *   tsx tools/site-intelligence/src/dashboard.ts
 *
 * Lands at tools/site-intelligence/reports/index.html.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSnapshot, type Snapshot } from "./snapshot";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function defaultOutPath(): string {
  return path.resolve(__dirname, "..", "reports", "index.html");
}

export function generate(out = defaultOutPath()): string {
  const snap = buildSnapshot();
  const html = render(snap);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, "utf8");
  return out;
}

function esc(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreClass(s: number): string {
  if (s >= 85) return "ok";
  if (s >= 60) return "mid";
  return "bad";
}

const AUDIT_TYPES = ["seo", "a11y", "security", "links"] as const;
const AUDIT_LABEL: Record<string, string> = {
  seo: "SEO",
  a11y: "Tilgjengelighet",
  security: "Sikkerhet",
  links: "Lenker",
};

function render(snap: Snapshot): string {
  const targetCards = snap.targets
    .map((t) => {
      const runs = snap.latest.filter((r) => r.target_id === t.id);
      const scores = AUDIT_TYPES.map((type) => {
        const r = runs.find((x) => x.audit_type === type);
        return { type, score: r?.avg_score ?? null, runId: r?.id };
      });
      const overall =
        scores.filter((s) => s.score !== null).length === 0
          ? null
          : Math.round(
              scores
                .filter((s) => s.score !== null)
                .reduce((sum, s) => sum + (s.score as number), 0) /
                scores.filter((s) => s.score !== null).length,
            );

      return `
        <article class="target-card" data-target="${esc(t.name)}">
          <header>
            <span class="mono">${esc(t.name).toUpperCase()}</span>
            <span class="status ${t.is_active ? "active" : "inactive"}">${t.is_active ? "ACTIVE" : "INAKTIV"}</span>
          </header>
          <h2>${esc(t.label)}</h2>
          <p class="small">${esc(t.description || t.origin)}</p>
          <div class="overall ${overall === null ? "none" : scoreClass(overall)}">
            <span class="num">${overall === null ? "—" : overall}</span>
            <span class="lbl">overall</span>
          </div>
          <div class="audit-row">
            ${scores
              .map(
                (s) => `
              <div class="audit-cell ${s.score === null ? "none" : scoreClass(s.score)}">
                <span class="mono">${esc(AUDIT_LABEL[s.type])}</span>
                <span class="num">${s.score === null ? "—" : Math.round(s.score)}</span>
              </div>`,
              )
              .join("")}
          </div>
          <footer class="small">
            <button class="run-btn" type="button" data-target="${esc(t.name)}">Kjør skanning</button>
          </footer>
        </article>`;
    })
    .join("");

  const recentRows = snap.recent
    .map(
      (r) => `
    <tr>
      <td class="mono">${esc(r.target_name)}</td>
      <td class="mono">${esc(AUDIT_LABEL[r.audit_type] || r.audit_type)}</td>
      <td>${esc(r.started_at)}</td>
      <td>${r.pages_scanned}</td>
      <td>${r.findings_total}</td>
      <td class="score ${scoreClass(r.avg_score)}">${Math.round(r.avg_score)}</td>
      <td class="mono">${esc(r.status)}</td>
    </tr>`,
    )
    .join("");

  const topFindings = snap.topFindings
    .map(
      (f) => `
    <tr>
      <td><span class="badge ${f.severity}">${f.severity}</span></td>
      <td class="mono">${esc(f.audit_type)}</td>
      <td class="mono">${esc(f.rule)}</td>
      <td class="num">${f.count}</td>
    </tr>`,
    )
    .join("");

  return /* html */ `<!doctype html>
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Digilist Site Intelligence Dashboard</title>
<style>
  :root {
    --paper:#FBF8F3; --paper-deep:#F4EFE6; --ink:#0A1228;
    --ink-soft:#424B66; --ink-faint:#6C7387;
    --navy:#1F2F6E; --rule:rgba(10,18,40,0.12); --rule-strong:rgba(10,18,40,0.24);
    --ok:#2D7A3A; --mid:#A57400; --bad:#B00020; --none:#9CA3AF;
  }
  *{box-sizing:border-box;}
  body{margin:0;font-family:"Public Sans",system-ui,sans-serif;background:var(--paper);color:var(--ink);line-height:1.55;}
  .wrap{max-width:1280px;margin:0 auto;padding:2.5rem 1.5rem 5rem;}
  h1{font-family:Fraunces,Georgia,serif;font-weight:460;letter-spacing:-0.015em;font-size:3rem;line-height:1.05;margin:0;}
  h2{font-family:Fraunces,Georgia,serif;font-weight:460;letter-spacing:-0.01em;font-size:1.5rem;margin:0 0 0.5rem;}
  h3{font-family:Fraunces,Georgia,serif;font-weight:460;font-size:1.25rem;margin:2.5rem 0 1rem;}
  .lede{color:var(--ink-soft);font-size:1.05rem;max-width:62ch;}
  .mono{font-family:"JetBrains Mono",ui-monospace,monospace;letter-spacing:0.08em;text-transform:uppercase;font-size:0.7rem;color:var(--ink-faint);}
  .small{font-size:0.85rem;color:var(--ink-faint);}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:var(--rule-strong);border:1px solid var(--rule-strong);margin:1.5rem 0 2.5rem;}
  .target-card{background:var(--paper);padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:0.6rem;}
  .target-card header{display:flex;justify-content:space-between;align-items:center;}
  .target-card .status.active{color:var(--ok);}
  .target-card .status.inactive{color:var(--ink-faint);}
  .target-card .status{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:0.6rem;letter-spacing:0.08em;}
  .overall{display:flex;align-items:baseline;gap:0.5rem;margin-top:0.5rem;}
  .overall .num{font-family:Fraunces,Georgia,serif;font-size:3rem;font-weight:460;line-height:1;}
  .overall .lbl{font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-faint);}
  .overall.ok .num{color:var(--ok);}
  .overall.mid .num{color:var(--mid);}
  .overall.bad .num{color:var(--bad);}
  .overall.none .num{color:var(--none);}
  .audit-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:0.5px solid var(--rule);margin-top:0.5rem;}
  .audit-cell{background:var(--paper);padding:0.5rem 0.65rem;display:flex;flex-direction:column;gap:0.15rem;}
  .audit-cell .num{font-family:Fraunces,Georgia,serif;font-size:1.25rem;font-weight:460;}
  .audit-cell.ok .num{color:var(--ok);}
  .audit-cell.mid .num{color:var(--mid);}
  .audit-cell.bad .num{color:var(--bad);}
  .audit-cell.none .num{color:var(--none);}
  .run-btn{appearance:none;background:var(--navy);color:var(--paper);border:none;border-radius:2px;padding:0.55rem 1rem;font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;font-family:"Public Sans",system-ui,sans-serif;}
  .run-btn:hover{opacity:0.9;}
  table{width:100%;border-collapse:collapse;margin-top:0.75rem;font-size:0.92rem;}
  th,td{text-align:left;padding:0.55rem 0.4rem;border-bottom:0.5px solid var(--rule);}
  th{font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-faint);font-weight:500;}
  td.score{text-align:right;font-family:Fraunces,Georgia,serif;font-size:1.05rem;font-weight:460;}
  td.score.ok{color:var(--ok);}td.score.mid{color:var(--mid);}td.score.bad{color:var(--bad);}
  td.num{text-align:right;font-family:Fraunces,Georgia,serif;font-size:1.05rem;}
  .badge{display:inline-block;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;border-radius:2px;border:0.5px solid currentColor;}
  .badge.error{color:var(--bad);} .badge.warn{color:var(--mid);} .badge.info{color:var(--navy);}
  .links{margin-top:3rem;display:flex;gap:1rem;flex-wrap:wrap;}
  .links a{color:var(--navy);text-decoration:none;border-bottom:0.5px solid var(--rule-strong);padding-bottom:2px;font-size:0.9rem;}
  .links a:hover{border-bottom-color:var(--navy);}
</style>
</head>
<body>
<div class="wrap">
  <p class="mono">DIGILIST · SITE INTELLIGENCE · OPPDATERT ${esc(snap.generatedAt)}</p>
  <h1>Quality &amp; Compliance Command Center</h1>
  <p class="lede">
    Overvåker SEO, tilgjengelighet, sikkerhet og lenker på tvers av Digilist-økosystemet.
    Klikk «Kjør skanning» for å trigge en ny audit-runde mot et mål.
  </p>

  <h3>Mål</h3>
  <div class="grid">${targetCards}</div>

  <h3>Siste skanninger</h3>
  <table>
    <thead><tr><th>Mål</th><th>Type</th><th>Startet</th><th>Sider</th><th>Funn</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>${recentRows || `<tr><td colspan="7" class="small">Ingen skanninger ennå — kjør <code>pnpm audit:all</code></td></tr>`}</tbody>
  </table>

  <h3>Mest hyppige funn (tvers av siste skanninger)</h3>
  <table>
    <thead><tr><th>Severity</th><th>Audit</th><th>Regel</th><th>Antall</th></tr></thead>
    <tbody>${topFindings || `<tr><td colspan="4" class="small">Ingen funn å vise.</td></tr>`}</tbody>
  </table>

  <h3>Eksterne kontroller</h3>
  <div class="links">
    <a href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console ↗</a>
    <a href="https://plausible.io/digilist.no" target="_blank" rel="noopener">Plausible ↗</a>
    <a href="https://securityheaders.com/?q=https://digilist.no" target="_blank" rel="noopener">Security Headers ↗</a>
    <a href="https://www.ssllabs.com/ssltest/analyze.html?d=digilist.no" target="_blank" rel="noopener">SSL Labs ↗</a>
    <a href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fdigilist.no" target="_blank" rel="noopener">Rich Results Test ↗</a>
    <a href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdigilist.no" target="_blank" rel="noopener">PageSpeed Insights ↗</a>
  </div>
</div>

<script>
  // Static HTML — the "run scan" button shows the CLI command to run.
  // Live web dashboard replaces this with a POST to /api/audits/run.
  document.querySelectorAll(".run-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-target");
      alert(\`Kjør i terminalen:\\n\\n  pnpm audit:all -- --target \${t}\\n\\nDeretter:\\n  pnpm audit:dashboard\\n\\n(Live re-run kommer i pass 2.)\`);
    });
  });
</script>
</body>
</html>`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = generate();
  console.log(`[dashboard] wrote ${out}`);
}
