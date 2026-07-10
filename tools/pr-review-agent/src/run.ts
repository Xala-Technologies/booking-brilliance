/**
 * pr-review:run — the autonomous PR-review agent. Finds open pull requests in
 * the Digilist repos, reviews each with Claude (best model, on the Max
 * subscription), and posts an advisory COMMENT review to GitHub. Closes the
 * self-improving loop: the implement agent opens PRs, this agent reviews them.
 *
 * Safety: reviews are advisory COMMENTs only — never approve, request-changes,
 * or merge. Dedupes on PR head commit (re-reviews only when new commits land)
 * and on our own hidden marker. --dry-run prints the review and posts nothing.
 *
 * Env: LLM_PROVIDER=claude-cli (Max, no key) · GH_TOKEN · DIGILIST_REPO_PATH ·
 *   PR_REVIEW_ONLY_AGENT=1 (only review agent/* branches). Flags: --dry-run,
 *   --limit N (PRs per repo), --all (include drafts), --repo <label>,
 *   --pr N (review one specific PR, bypassing the open-list — for manual runs).
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { loadConfig } from "../../content-agent/src/config";
import { alreadyReviewed, postReview, renderReview } from "./post";
import { reviewPr } from "./review";
import { ReviewStore } from "./store";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nowIso = () => new Date().toISOString();

function ghEnv(): NodeJS.ProcessEnv {
  return { ...process.env, GITHUB_TOKEN: process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "" };
}

interface Repo {
  label: string;
  path: string;
}

/** The repos we review PRs in — booking-brilliance (this checkout) + Digilist. */
function repos(): Repo[] {
  const out: Repo[] = [{ label: "booking-brilliance", path: path.resolve(__dirname, "..", "..", "..") }];
  const digilist = process.env.DIGILIST_REPO_PATH ?? "/root/Digilist";
  if (fs.existsSync(path.join(digilist, ".git"))) out.push({ label: "digilist", path: digilist });
  return out;
}

interface OpenPr {
  number: number;
  headRefName: string;
  headRefOid: string;
  isDraft: boolean;
  author: string;
}

async function listOpenPrs(repoPath: string, limit: number): Promise<OpenPr[]> {
  try {
    const { stdout } = await exec(
      "gh",
      ["pr", "list", "--state", "open", "--limit", String(limit), "--json",
        "number,headRefName,headRefOid,isDraft,author"],
      { cwd: repoPath, env: ghEnv(), timeout: 30_000, maxBuffer: 16 * 1024 * 1024 },
    );
    const arr = JSON.parse(stdout) as Array<Record<string, unknown>>;
    return arr.map((p) => ({
      number: p.number as number,
      headRefName: (p.headRefName as string) ?? "",
      headRefOid: (p.headRefOid as string) ?? "",
      isDraft: Boolean(p.isDraft),
      author: (p.author as { login?: string })?.login ?? "",
    }));
  } catch (e) {
    console.warn(`[pr-review] cannot list PRs in ${repoPath}: ${String(e).slice(0, 160)}`);
    return [];
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const includeDrafts = args.includes("--all");
  const onlyAgent = process.env.PR_REVIEW_ONLY_AGENT === "1";
  const li = args.indexOf("--limit");
  const limit = li >= 0 ? Number(args[li + 1]) || 20 : 20;
  const ri = args.indexOf("--repo");
  const onlyRepo = ri >= 0 ? args[ri + 1] : "";
  const pi = args.indexOf("--pr");
  const onePr = pi >= 0 ? Number(args[pi + 1]) : 0;

  const cfg = loadConfig();
  const store = ReviewStore.load();
  const targets = repos().filter((r) => !onlyRepo || r.label === onlyRepo);
  console.log(`[pr-review] scanning ${targets.map((r) => r.label).join(", ")}${dryRun ? " (dry run)" : ""}`);

  let reviewed = 0;
  for (const repo of targets) {
    const prs = onePr
      ? [{ number: onePr, headRefName: "", headRefOid: `manual-${onePr}`, isDraft: false, author: "" }]
      : await listOpenPrs(repo.path, limit);
    for (const pr of prs) {
      if (pr.isDraft && !includeDrafts) continue;
      if (onlyAgent && !pr.headRefName.startsWith("agent/")) continue;
      const key = `${repo.label}#${pr.number}`;
      if (store.reviewedAt(key, pr.headRefOid)) {
        console.log(`  · ${key} unchanged since last review — skip`);
        continue;
      }
      // Cross-machine guard: if our marker is already on this exact head, adopt it.
      if (!dryRun && (await alreadyReviewed(repo.path, pr.number))) {
        store.record(key, { headOid: pr.headRefOid, url: "", reviewed_at: nowIso(), blocking: false });
        console.log(`  · ${key} already has our review — adopt & skip`);
        continue;
      }

      try {
        console.log(`  ⚙ reviewing ${key} (${pr.headRefName})…`);
        const { pr: full, verdict, model } = await reviewPr(cfg, repo.path, pr.number);
        const body = renderReview(full, verdict, model);
        if (dryRun) {
          console.log(`\n----- ${key} — ${full.title} -----\n${body}\n`);
        } else {
          await postReview(repo.path, pr.number, body);
          store.record(key, { headOid: pr.headRefOid, url: full.url, reviewed_at: nowIso(), blocking: verdict.blocking });
          console.log(`  ✓ posted review on ${key} — risk=${verdict.risk} blocking=${verdict.blocking} (${verdict.findings.length} findings)`);
        }
        reviewed++;
      } catch (e) {
        console.error(`  ✗ ${key}: ${String(e).slice(0, 200)}`);
      }
    }
  }
  if (!dryRun) store.save();
  console.log(`[pr-review] done — ${reviewed} PR(s) reviewed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
