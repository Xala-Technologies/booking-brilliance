/**
 * PR-review agent — the poster. Renders a ReviewVerdict as markdown and submits
 * it to GitHub as a review. The review EVENT reflects the verdict:
 *   - blocker finding      → REQUEST_CHANGES (a proper change request)
 *   - clean / only minor   → APPROVE
 *   - otherwise (major…)   → COMMENT (advisory)
 * The agent NEVER merges — approval is a review state, not a merge. A hidden
 * marker lets us detect our own prior review so re-runs don't duplicate.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { PullRequest, ReviewVerdict } from "./review";

const exec = promisify(execFile);
const MARKER = "<!-- digilist-pr-review -->";

export type ReviewEvent = "approve" | "request-changes" | "comment";

/** Map a verdict to a GitHub review event. Gated: when verdicts are disabled we
 *  only ever COMMENT (advisory). Blocker → change request; major → comment;
 *  otherwise (clean / minor / nit) → approve. */
export function verdictEvent(v: ReviewVerdict, allowVerdicts: boolean): ReviewEvent {
  if (!allowVerdicts) return "comment";
  if (v.blocking || v.findings.some((f) => f.severity === "blocker")) return "request-changes";
  if (v.findings.some((f) => f.severity === "major") || v.risk === "high") return "comment";
  return "approve";
}

/**
 * gh token for REVIEW actions. GitHub blocks approving/requesting-changes on
 * your OWN PR, and the implement agent authors PRs with GH_TOKEN — so set
 * PR_REVIEW_GH_TOKEN to a DIFFERENT identity (a bot account's PAT or a GitHub
 * App token that's a collaborator) and formal approvals work on the agent's own
 * PRs too. Falls back to GH_TOKEN (self-authored → graceful comment + label).
 */
function ghEnv(): NodeJS.ProcessEnv {
  const token = process.env.PR_REVIEW_GH_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
  return { ...process.env, GITHUB_TOKEN: token };
}

/** Verdict labels — machine-readable conclusion, applied even when a formal
 *  approve/request-changes is blocked (e.g. self-authored PR). */
const VERDICT_LABELS: Record<ReviewEvent, { name: string; color: string }> = {
  approve: { name: "agent: approved", color: "0e8a16" },
  "request-changes": { name: "agent: changes-requested", color: "d93f0b" },
  comment: { name: "agent: reviewed", color: "5319e7" },
};

/** Tag the PR with the verdict label (create-if-missing), removing the others. */
async function setVerdictLabel(repo: string, number: number, event: ReviewEvent): Promise<void> {
  if (process.env.PR_REVIEW_LABELS === "0") return;
  const target = VERDICT_LABELS[event];
  await exec("gh", ["label", "create", target.name, "--repo", repo, "--color", target.color, "--force"], {
    env: ghEnv(), timeout: 20_000,
  }).catch(() => {});
  await exec("gh", ["pr", "edit", String(number), "--repo", repo, "--add-label", target.name], {
    env: ghEnv(), timeout: 20_000,
  }).catch(() => {});
  for (const other of Object.values(VERDICT_LABELS)) {
    if (other.name === target.name) continue;
    await exec("gh", ["pr", "edit", String(number), "--repo", repo, "--remove-label", other.name], {
      env: ghEnv(), timeout: 20_000,
    }).catch(() => {});
  }
}

const SEV_ICON: Record<string, string> = {
  blocker: "⛔",
  major: "🔴",
  minor: "🟡",
  nit: "💬",
};

/** Render the verdict as a GitHub-flavoured markdown review body. */
export function renderReview(pr: PullRequest, v: ReviewVerdict, model: string, event: ReviewEvent = "comment", isUpdate = false): string {
  const riskBadge = v.risk === "high" ? "🔴 Høy" : v.risk === "medium" ? "🟡 Middels" : "🟢 Lav";
  const eventLabel =
    event === "request-changes" ? "🔴 Endringer forespurt (blocker)" :
    event === "approve" ? "🟢 Godkjent (rådgivende — ingen auto-merge)" :
    "💬 Kommentar (rådgivende)";
  const lines: string[] = [
    MARKER,
    `## 🤖 Automatisk kode-review${isUpdate ? " — oppdatert etter nye commits" : ""}`,
    ``,
    v.summary,
    ``,
    `**Risiko:** ${riskBadge} · **Konklusjon:** ${eventLabel}`,
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
export async function alreadyReviewed(repo: string, number: number): Promise<boolean> {
  try {
    const { stdout } = await exec("gh", ["pr", "view", String(number), "--repo", repo, "--json", "reviews,comments"], {
      env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024,
    });
    const j = JSON.parse(stdout) as { reviews?: { body?: string }[]; comments?: { body?: string }[] };
    const bodies = [...(j.reviews ?? []), ...(j.comments ?? [])].map((x) => x.body ?? "");
    return bodies.some((b) => b.includes(MARKER));
  } catch {
    return false;
  }
}

/** Post the review to GitHub with the given event. Never merges. Falls back to
 *  a COMMENT if approve/request-changes is rejected (e.g. can't review own PR,
 *  or the token lacks the permission). */
export async function postReview(repo: string, number: number, body: string, event: ReviewEvent = "comment"): Promise<ReviewEvent> {
  const flag = event === "approve" ? "--approve" : event === "request-changes" ? "--request-changes" : "--comment";
  let posted: ReviewEvent = event;
  try {
    await exec("gh", ["pr", "review", String(number), "--repo", repo, flag, "--body", body], {
      env: ghEnv(), timeout: 40_000, maxBuffer: 16 * 1024 * 1024,
    });
  } catch (e) {
    if (event === "comment") throw e;
    // GitHub blocks approving/requesting-changes on your own PR (and needs write
    // perms). Fall back to an advisory comment so the review still lands — the
    // verdict is still explicit in the body + the label below.
    await exec("gh", ["pr", "review", String(number), "--repo", repo, "--comment", "--body", body], {
      env: ghEnv(), timeout: 40_000, maxBuffer: 16 * 1024 * 1024,
    });
    console.warn(`[pr-review] ${repo}#${number}: ${event} rejected (${String(e).slice(0, 80)}) — posted as comment + label`);
    posted = "comment";
  }
  // Label always reflects the intended verdict (works even when formal approval
  // is blocked), so the conclusion is first-class + filterable on every PR.
  await setVerdictLabel(repo, number, event);
  return posted;
}
