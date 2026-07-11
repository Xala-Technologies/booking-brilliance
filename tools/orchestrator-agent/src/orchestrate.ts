/**
 * The reasoning stage - the CTO's judgement. Given the gathered FleetState, it
 * asks the best model (Opus, via the shared runClaudeAgent so it can consult the
 * codebase graph + docs) to decide what matters now: which specialist should
 * own each non-Todo item, a suggested priority/severity, and any blockers that
 * need the human. It returns a structured plan { assignments, blockers, summary }.
 *
 * buildReasoningPrompt + parsePlan are pure so they can be unit-tested with no
 * network.
 */
import { runClaudeAgent } from "../../content-agent/src/claude-agent";
import type { ContentAgentConfig } from "../../content-agent/src/config";
import type { FleetState } from "./state";

/** The specialists the CTO can route work to. */
export const SPECIALISTS = [
  "content-agent",
  "improvements-agent",
  "pr-review-agent",
  "e2e-agent",
  "docs-rag",
  "cto",
] as const;
export type Specialist = (typeof SPECIALISTS)[number];

export interface Assignment {
  item: string; // Linear identifier (e.g. XAL-123) or a short label
  specialist: string;
  priority?: string; // Urgent | High | Normal | Low, or P0..P3
  severity?: string; // critical | major | minor
  rationale?: string;
  promote?: boolean; // recommend moving into the approval queue (autopilot only)
}

export interface Blocker {
  item: string;
  question: string; // exactly what the human needs to answer
}

export interface Plan {
  assignments: Assignment[];
  blockers: Blocker[];
  summary: string;
}

export const EMPTY_PLAN: Plan = { assignments: [], blockers: [], summary: "" };

const SYSTEM = `Du er teknisk sjef (CTO) for Digilist, en kommunal SaaS-bookingplattform. Du styrer en flåte av spesialistagenter:
- content-agent: blogg og markedsinnhold.
- improvements-agent: analyserer koden, foreslår og bygger forbedringer (analyze/prepare/implement).
- pr-review-agent: gjennomgår åpne PR-er.
- e2e-agent: ende-til-ende-tester av produktet.
- docs-rag: dokumentasjon og kunnskapsoppslag.

Du får en FLÅTETILSTAND (Linear-saker, Open Brain, åpne PR-er). Todo-køen drives allerede automatisk mot PR, så IKKE tildel Todo-saker. Fokuser på ALT ANNET:
- Hvilken spesialist bør eie hver sak som IKKE er i Todo, og hvorfor.
- Foreslått prioritet (Urgent/High/Normal/Low) og alvorlighet (critical/major/minor).
- Ekte blokkeringer som trenger et menneske: still ETT presist sporsmål per blokkering.
- promote=true kun for saker du mener burde godkjennes (flyttes til Todo). Dette skjer bare i autopilot.

Vær kortfattet og konkret. Norsk bokmål, ingen tankestrek som skilletegn.

Returner KUN gyldig JSON, ingenting annet:
{"summary":"kort situasjonsvurdering","assignments":[{"item":"XAL-123 eller kort etikett","specialist":"improvements-agent","priority":"High","severity":"major","rationale":"kort","promote":false}],"blockers":[{"item":"XAL-124","question":"presist sporsmål"}]}`;

function issueLine(i: FleetState["issues"][number]): string {
  const flags = [i.hasGoal ? "har-mål" : "mangler-mål", ...i.labels].join(", ");
  return `- ${i.identifier} [${i.stateName} · ${i.priorityLabel}] ${i.title.slice(0, 80)}${flags ? ` (${flags})` : ""}`;
}

/** Render the FleetState into the reasoning prompt (pure). */
export function buildReasoningPrompt(state: FleetState): string {
  const nonTodo = state.issues.filter((i) => i.stateName.toLowerCase() !== "todo");
  const prLines = state.prs.map(
    (p) =>
      `- ${p.repo}#${p.number} "${p.title.slice(0, 70)}" [${p.isDraft ? "draft" : "open"}${p.reviewDecision ? ` · ${p.reviewDecision}` : ""}] sjekker ${p.checks.passed}✓/${p.checks.failed}✗/${p.checks.pending}…`,
  );
  return [
    `FLÅTETILSTAND (${state.generatedAt})`,
    ``,
    `TODO (drives allerede mot PR, ${state.todo.length} sak(er) - IKKE tildel disse):`,
    ...state.todo.map((i) => `- ${i.identifier} [${i.priorityLabel}] ${i.title.slice(0, 80)}`),
    ``,
    `ANDRE SAKER (${nonTodo.length}):`,
    ...(nonTodo.length ? nonTodo.map(issueLine) : ["- (ingen)"]),
    ``,
    `ÅPNE PR-ER (${state.prs.length}):`,
    ...(prLines.length ? prLines : ["- (ingen)"]),
    ``,
    `OPEN BRAIN: ${state.brain.items} emner, ${state.brain.verdicts} vurderinger, ${state.brain.prepared} forberedte brancher.`,
    state.brain.learnings.length ? `Lærdommer: ${state.brain.learnings.slice(0, 6).join(" | ")}` : "",
    ``,
    `Vurder situasjonen, tildel spesialister til ikke-Todo-saker, flagg blokkeringer. Siste melding skal være KUN JSON-objektet.`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

/** Extract the plan JSON from the model's reply (pure, tolerant). */
export function parsePlan(text: string): Plan {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { ...EMPTY_PLAN, summary: text.trim().slice(0, 400) };
  let raw: unknown;
  try {
    raw = JSON.parse(m[0]);
  } catch {
    return { ...EMPTY_PLAN, summary: text.trim().slice(0, 400) };
  }
  const obj = (raw ?? {}) as Record<string, unknown>;
  const assignments: Assignment[] = Array.isArray(obj.assignments)
    ? (obj.assignments as Record<string, unknown>[])
        .filter((a) => a && typeof a.item === "string" && typeof a.specialist === "string")
        .map((a) => ({
          item: String(a.item),
          specialist: String(a.specialist),
          priority: typeof a.priority === "string" ? a.priority : undefined,
          severity: typeof a.severity === "string" ? a.severity : undefined,
          rationale: typeof a.rationale === "string" ? a.rationale : undefined,
          promote: a.promote === true,
        }))
    : [];
  const blockers: Blocker[] = Array.isArray(obj.blockers)
    ? (obj.blockers as Record<string, unknown>[])
        .filter((b) => b && typeof b.question === "string")
        .map((b) => ({ item: typeof b.item === "string" ? b.item : "", question: String(b.question) }))
    : [];
  const summary = typeof obj.summary === "string" ? obj.summary : "";
  return { assignments, blockers, summary };
}

/** Run the Opus reasoning pass over the fleet state and return a parsed plan. */
export async function orchestrate(state: FleetState, cfg: ContentAgentConfig): Promise<Plan> {
  const model = process.env.CTO_REASON_MODEL || cfg.anthropicReviewModel || "claude-opus-4-8";
  const prompt = buildReasoningPrompt(state);
  const r = await runClaudeAgent({
    prompt,
    systemPrompt: SYSTEM,
    model,
    maxTurns: 20,
    idleMin: 10,
    timeoutMin: 12,
    label: "cto-reason",
  });
  return parsePlan(r.text);
}
