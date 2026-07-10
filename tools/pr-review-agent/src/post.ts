/**
 * PR-review agent — the poster. Renders a ReviewVerdict as markdown and submits
 * it to GitHub as a COMMENT review (advisory only — never --approve, never
 * --request-changes that gates a merge, never a merge). A hidden marker lets us
 * detect our own prior review so re-runs don't duplicate.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { PullRequest, ReviewVerdict } from "./review";

const exec = promisify(execFile);
const MARKER = "<!-- digilist-pr-review -->";

function ghEnv(): NodeJS.ProcessEnv {
  return { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
}

const SEV_ICON: Record<string, string> = {
  blocker: "⛔",
  major: "🔴",
  minor: "🟡",
  nit: "💬",
};

/** Render the verdict as a GitHub-flavoured markdown review body. */
export function renderReview(pr: PullRequest, v: ReviewVerdict, model: string): string {
  const riskBadge = v.risk === "high" ? "🔴 Høy" : v.risk === "medium" ? "🟡 Middels" : "🟢 Lav";
  const lines: string[] = [
    MARKER,
    `## 🤖 Automatisk kode-review`,
    ``,
    v.summary,
    ``,
    `**Risiko:** ${riskBadge} · **Vurdering:** ${v.blocking ? "⛔ Bør adresseres før merge" : "✅ Ser greit ut å merge etter en titt"}`,
    ``,
  ];

  if (v.findings.length > 0) {
    lines.push(`### Funn (${v.findings.length})`, ``);
    for (const f of v.findings) {
      const loc = f.file ? ` \`${f.file}\`` : "";
      lines.push(`- ${SEV_ICON[f.severity] ?? "•"} **${f.severity}**${loc} — ${f.note}`);
    }
    lines.push(``);
  } else {
    lines.push(`### Funn`, ``, `Ingen vesentlige funn. 👍`, ``);
  }

  if (v.strengths.length > 0) {
    lines.push(`### Styrker`, ``, ...v.strengths.map((s) => `- ${s}`), ``);
  }
  if (v.tests) lines.push(`### Tester`, ``, v.tests, ``);

  lines.push(
    `---`,
    `_Rådgivende review av Digilist PR-review-agent (${model}). Ingen godkjenning/merge — et menneske bestemmer._`,
  );
  return lines.join("\n");
}

/** Has our agent already posted a review on this PR? (marker match). */
export async function alreadyReviewed(repoPath: string, number: number): Promise<boolean> {
  try {
    const { stdout } = await exec("gh", ["pr", "view", String(number), "--json", "reviews,comments"], {
      cwd: repoPath, env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024,
    });
    const j = JSON.parse(stdout) as { reviews?: { body?: string }[]; comments?: { body?: string }[] };
    const bodies = [...(j.reviews ?? []), ...(j.comments ?? [])].map((x) => x.body ?? "");
    return bodies.some((b) => b.includes(MARKER));
  } catch {
    return false;
  }
}

/** Post the review to GitHub as a COMMENT (advisory, non-gating). */
export async function postReview(repoPath: string, number: number, body: string): Promise<void> {
  await exec("gh", ["pr", "review", String(number), "--comment", "--body", body], {
    cwd: repoPath, env: ghEnv(), timeout: 40_000, maxBuffer: 16 * 1024 * 1024,
  });
}
