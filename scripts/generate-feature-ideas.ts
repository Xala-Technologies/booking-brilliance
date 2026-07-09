/**
 * Feature-idea agent → Linear (or GitHub).
 *
 * Runs the same research the blog agent runs on (ranked keyword clusters +
 * published blog corpus + accumulated learnings) through the product-strategy
 * model to propose concrete features, then files each into a dedicated Linear
 * project (or GitHub issues), deduped against what it already filed. Idempotent:
 * re-running only files genuinely new ideas, so it converges instead of spamming.
 *
 * Target (CONTENT_IDEAS_TARGET): "linear" | "github" | "both" | "auto" (default
 * auto = Linear if LINEAR_API_KEY is set, else GitHub if GITHUB_TOKEN is set,
 * else a safe dry run that only prints).
 *
 * Env:
 *   ANTHROPIC_API_KEY, VITE_CONVEX_URL (or CONVEX_URL), ADMIN_BASIC_AUTH
 *   Linear:  LINEAR_API_KEY, LINEAR_TEAM_KEY (e.g. "DIG"; optional → first team),
 *            CONTENT_IDEAS_LINEAR_PROJECT (default "Agent-forslag: produktfunksjoner")
 *   GitHub:  GITHUB_TOKEN (issues:write), GITHUB_REPOSITORY ("owner/repo"),
 *            CONTENT_IDEAS_LABEL (default "content-idea")
 *   CONTENT_IDEAS_PER_RUN (default 4)
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { loadConfig } from "../tools/content-agent/src/config";
import { generateFeatureIdeas, type FeatureIdea } from "../tools/content-agent/src/ideate";
import { buildLearnings, readPublishedCorpus } from "../tools/content-agent/src/memory";

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
const PER_RUN = Number(process.env.CONTENT_IDEAS_PER_RUN ?? 4) || 4;

const LINEAR_KEY = process.env.LINEAR_API_KEY ?? "";
const LINEAR_TEAM_KEY = process.env.LINEAR_TEAM_KEY ?? "";
const LINEAR_PROJECT = process.env.CONTENT_IDEAS_LINEAR_PROJECT ?? "Agent-forslag: produktfunksjoner";

const GH_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? "";
const GH_REPO = process.env.GITHUB_REPOSITORY ?? "";
const GH_LABEL = process.env.CONTENT_IDEAS_LABEL ?? "content-idea";

const target = (process.env.CONTENT_IDEAS_TARGET ?? "auto").toLowerCase();

if (!CONVEX_URL || !ADMIN) {
  console.error("[ideas] VITE_CONVEX_URL and ADMIN_BASIC_AUTH required.");
  process.exit(1);
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim();

function bodyMarkdown(idea: FeatureIdea): string {
  return [
    idea.problem && `**Problem**\n${idea.problem}`,
    idea.proposal && `**Forslag**\n${idea.proposal}`,
    idea.audience && `**Målgruppe:** ${idea.audience}`,
    `**Impact:** ${idea.impact}  ·  **Effort:** ${idea.effort}`,
    idea.evidence.length &&
      `**Bevis (søkeetterspørsel / signal)**\n${idea.evidence.map((e) => `- ${e}`).join("\n")}`,
    `\n---\n_Auto-foreslått av Digilists content/idea-agent ut fra søkeetterspørsel og innholdsdekning. Vurder, avslå eller planlegg._`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ── Linear (GraphQL) ─────────────────────────────────────────────────────────

async function linear<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { Authorization: LINEAR_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await r.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`linear: ${json.errors.map((e) => e.message).join("; ")}`);
  return json.data as T;
}

async function fileToLinear(ideas: FeatureIdea[]): Promise<void> {
  // 1. Resolve the team (by key, or the first one).
  const { teams } = await linear<{ teams: { nodes: { id: string; key: string; name: string }[] } }>(
    `query { teams(first: 50) { nodes { id key name } } }`,
  );
  const team =
    (LINEAR_TEAM_KEY && teams.nodes.find((t) => t.key === LINEAR_TEAM_KEY)) || teams.nodes[0];
  if (!team) throw new Error("linear: no team found");

  // 2. Find or create the dedicated project.
  const { projects } = await linear<{ projects: { nodes: { id: string; name: string; url: string }[] } }>(
    `query { projects(first: 100) { nodes { id name url } } }`,
  );
  let project = projects.nodes.find((p) => norm(p.name) === norm(LINEAR_PROJECT));
  if (!project) {
    const res = await linear<{ projectCreate: { success: boolean; project: { id: string; name: string; url: string } } }>(
      `mutation($input: ProjectCreateInput!) { projectCreate(input: $input) { success project { id name url } } }`,
      { input: { name: LINEAR_PROJECT, teamIds: [team.id], description: "Auto-foreslåtte produktfunksjoner fra content/idea-agenten." } },
    );
    project = res.projectCreate.project;
    console.log(`[ideas] created Linear project "${project.name}" → ${project.url}`);
  }

  // 3. Dedup against issues already in the project.
  const { issues } = await linear<{ issues: { nodes: { title: string }[] } }>(
    `query($id: ID!) { issues(filter: { project: { id: { eq: $id } } }, first: 250) { nodes { title } } }`,
    { id: project.id },
  );
  const existing = new Set(issues.nodes.map((i) => norm(i.title)));

  let filed = 0;
  let skipped = 0;
  for (const idea of ideas) {
    if (existing.has(norm(idea.title))) {
      console.log(`[ideas] linear skip (already in project): ${idea.title}`);
      skipped++;
      continue;
    }
    const res = await linear<{ issueCreate: { success: boolean; issue: { identifier: string; url: string } } }>(
      `mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { identifier url } } }`,
      { input: { teamId: team.id, projectId: project.id, title: idea.title, description: bodyMarkdown(idea) } },
    );
    if (res.issueCreate.success) {
      console.log(`[ideas] linear ✓ ${res.issueCreate.issue.identifier} ${idea.title}`);
      existing.add(norm(idea.title));
      filed++;
    } else {
      console.warn(`[ideas] linear ✗ ${idea.title}`);
    }
  }
  console.log(`[ideas] linear done — ${filed} filed, ${skipped} already present (project "${project.name}").`);
}

// ── GitHub (REST) ────────────────────────────────────────────────────────────

async function gh(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

async function fileToGitHub(ideas: FeatureIdea[]): Promise<void> {
  // Ensure the label exists.
  if ((await gh(`/repos/${GH_REPO}/labels/${encodeURIComponent(GH_LABEL)}`)).status !== 200) {
    await gh(`/repos/${GH_REPO}/labels`, {
      method: "POST",
      body: JSON.stringify({ name: GH_LABEL, color: "5319e7", description: "Auto-proposed by the content/idea agent" }),
    });
  }
  const existing = new Set<string>();
  const r = await gh(`/repos/${GH_REPO}/issues?state=open&labels=${encodeURIComponent(GH_LABEL)}&per_page=100`);
  if (r.ok) for (const i of (await r.json()) as { title: string }[]) existing.add(norm(i.title));

  let filed = 0;
  let skipped = 0;
  for (const idea of ideas) {
    if (existing.has(norm(idea.title))) {
      console.log(`[ideas] github skip (already open): ${idea.title}`);
      skipped++;
      continue;
    }
    const labels = [GH_LABEL, ...idea.labels.filter((l) => l && l !== GH_LABEL)].slice(0, 6);
    const res = await gh(`/repos/${GH_REPO}/issues`, {
      method: "POST",
      body: JSON.stringify({ title: idea.title, body: bodyMarkdown(idea), labels }),
    });
    if (res.ok) {
      const created = (await res.json()) as { number: number };
      console.log(`[ideas] github ✓ #${created.number} ${idea.title}`);
      existing.add(norm(idea.title));
      filed++;
    } else {
      console.warn(`[ideas] github ✗ ${idea.title}: HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
    }
  }
  console.log(`[ideas] github done — ${filed} filed, ${skipped} already open.`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const cfg = loadConfig();
  const client = new ConvexHttpClient(CONVEX_URL);
  const token = Buffer.from(ADMIN, "utf-8").toString("base64");

  const snap = (await client.query(api.content.state.snapshot, { adminToken: token })) as {
    clusters: Array<{
      label: string;
      centroid_term: string;
      topic_summary: string;
      coverage: { gap_score: number } | null;
    }>;
  };
  const clusters = snap.clusters
    .map((c) => ({
      label: c.label,
      centroid_term: c.centroid_term,
      topic_summary: c.topic_summary,
      gap_score: c.coverage?.gap_score ?? 100,
    }))
    .sort((a, b) => b.gap_score - a.gap_score);
  const corpus = readPublishedCorpus(cfg).map((c) => ({ title: c.title, tag: c.tag }));
  const learnings = buildLearnings(cfg).context;

  const { ideas, call } = await generateFeatureIdeas(cfg, { clusters, corpus, learnings }, PER_RUN);
  console.log(`[ideas] generated ${ideas.length} idea(s) (model ${call.model}, $${call.costUsd.toFixed(3)})`);
  if (ideas.length === 0) return;

  const wantLinear = target === "linear" || target === "both" || (target === "auto" && LINEAR_KEY);
  const wantGitHub = target === "github" || target === "both" || (target === "auto" && !LINEAR_KEY && GH_TOKEN);

  if (wantLinear && LINEAR_KEY) await fileToLinear(ideas);
  else if (wantLinear) console.warn("[ideas] target wants Linear but LINEAR_API_KEY is unset.");

  if (wantGitHub && GH_TOKEN && GH_REPO) await fileToGitHub(ideas);
  else if (wantGitHub) console.warn("[ideas] target wants GitHub but GITHUB_TOKEN/GITHUB_REPOSITORY is unset.");

  if (!wantLinear && !wantGitHub) {
    console.log("[ideas] no tracker configured — dry run. Ideas:");
    for (const i of ideas) console.log(`  • ${i.title} [${i.impact}/${i.effort}] — ${i.proposal.slice(0, 80)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
