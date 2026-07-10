# PR-review agent

An autonomous reviewer for the Digilist fleet. It finds open pull requests,
reviews the diff with Claude (best model, on the Max subscription), and posts an
**advisory `COMMENT` review** to GitHub. It closes the self-improving loop: the
[improvements agent](../improvements-agent) opens PRs, this agent reviews them.

## What it does

1. Lists open PRs in `booking-brilliance` (this repo) and `Digilist`
   (`DIGILIST_REPO_PATH`) via `gh pr list`.
2. For each PR not yet reviewed at its current head commit: pulls the diff +
   metadata and asks Claude for a senior review (correctness, security/RBAC,
   a11y, performance, tests, does-it-do-what-it-says).
3. Renders the structured verdict as markdown and posts it with
   `gh pr review --comment`.

## Safety

- **Advisory only.** It posts a `COMMENT` review — never `--approve`,
  `--request-changes`, or a merge. A human still decides.
- **Diff-based & read-only.** It reviews the patch; it does not run the code.
- **Idempotent.** Dedupes on the PR head commit (re-reviews only when new
  commits land) and on a hidden marker in its own prior review.
- `--dry-run` prints the review and posts nothing.

## Run

```bash
# LLM_PROVIDER=claude-cli uses the Max login (no ANTHROPIC_API_KEY)
pnpm pr-review:run -- --dry-run          # preview, post nothing
pnpm pr-review:run                       # review + post
pnpm pr-review:run -- --repo digilist --limit 10
```

Env: `GH_TOKEN` (repo access) · `DIGILIST_REPO_PATH` · `PR_REVIEW_ONLY_AGENT=1`
(only review `agent/*` branches). Flags: `--dry-run`, `--limit N`, `--all`
(include drafts), `--repo <label>`.

## On the VPS

`vps-pr-review-runner.sh` is invoked by `digilist-pr-review.timer`; state lives
in `state/reviews.json` (gitignored, survives `git reset --hard`).
