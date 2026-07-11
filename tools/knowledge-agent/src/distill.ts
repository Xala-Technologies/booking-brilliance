/**
 * Distillation — the DISTILL half of capture -> distill -> inject. A capable
 * Opus agent reviews the raw signals, mines repo patterns via codebase-memory,
 * and pulls current industry best practice + latest stack docs/trends via web
 * search, then emits concrete, provenance-tracked, deduped learnings across the
 * six sources. When a tech trend implies an upgrade (e.g. a new TS/React major)
 * it flags an advisory improvement so the fleet proposes its own evolution.
 *
 * This module holds the DETERMINISTIC, testable pieces: the prompt contract, the
 * parser, and apply/demote logic. The agent call + Linear filing live in the CLI
 * (learning-run.ts) so the units here need no network.
 */
import { OpenBrain, type Learning, type LearningType, type Signal } from "../../improvements-agent/src/brain";
import { normStatement, upsertLearning } from "./knowledge";

const LEARNING_TYPES: LearningType[] = [
  "repo-pattern",
  "best-practice",
  "mistake",
  "user-feedback",
  "content-signal",
  "tech-trend",
];

/** One learning as the distiller must emit it. */
export interface DistilledLearning {
  type: LearningType;
  statement: string;
  why: string;
  applies_to: string[];
  source_ref: string;
  confidence: number;
  /** For tech-trend: when set, an advisory upgrade issue should be filed. */
  upgrade?: {
    title: string;
    goal: string; // the /loop goal body
    rationale: string;
  };
}

export interface DistillOutput {
  learnings: DistilledLearning[];
  /** Statements to demote (no longer apply). Matched by normalized statement. */
  demote?: string[];
}

/** The stacks the distiller must keep current — drives the web-search prompt. */
export const STACK_WATCH = [
  "TypeScript",
  "Convex",
  "React",
  "Vite",
  "Node.js",
  "WCAG / a11y",
  "web security (OWASP)",
];

export function buildDistillPrompt(input: {
  signals: Signal[];
  existing: Learning[];
  allowWeb: boolean;
  repoPath: string;
}): string {
  const signalsText = input.signals.length
    ? input.signals
        .map((s, i) => `${i + 1}. [${s.kind} · ${s.agent}] ${s.text} (kilde: ${s.source_ref})`)
        .join("\n")
    : "(ingen nye rå-signaler denne kjøringen)";
  const existingText = input.existing.length
    ? input.existing
        .slice(0, 60)
        .map((l) => `- [${l.type}] ${l.statement}`)
        .join("\n")
    : "(tom kunnskapsbase)";

  return `Du er kunnskaps-destillereren for Digilist agent-flåten. Målet ditt: gjøre rå-signaler + repo-mønstre + bransjepraksis + siste stack-nytt om til KONKRETE, handlingsrettede, deduprede lærdommer som injiseres i alle agentene.

Seks kilder (dekk alle relevante):
1. repo-mønstre: hvordan denne kodebasen faktisk gjør ting (bruk codebase-memory: search_graph / get_code_snippet / get_architecture).
2. bransjepraksis (best-practice): etablerte prinsipper for stacken.
3. egne feil (mistake): fra rå-signalene under (review-er som ba om endringer, blokkerte kjøringer, falske positiver).
4. bruker-tilbakemelding (user-feedback): fra rå-signalene.
5. innholdssignaler (content-signal): fra rå-signalene.
6. teknologitrender (tech-trend): ${input.allowWeb ? "bruk WebSearch/docs for å oppdage nye major-versjoner, deprecations og skifter i beste praksis for: " + STACK_WATCH.join(", ") + "." : "web er avslått denne kjøringen. Hopp over trend-research, bruk kun det du vet sikkert."}

RÅ-SIGNALER Å DESTILLERE:
${signalsText}

EKSISTERENDE LÆRDOMMER (IKKE dupliser; forbedre/dedupliser mot disse; foreslå demote for de som ikke lenger gjelder):
${existingText}

Repo å inspisere: ${input.repoPath}

Krav til hver lærdom:
- statement: én setning, handlingsrettet, presis. Norsk bokmål, ingen tankestrek.
- why: kort begrunnelse/bevis. ALDRI dikt opp. Hver lærdom må spores til et signal, en fil/symbol, eller en navngitt kilde/URL.
- applies_to: liste med agent-navn (pr-review, improvements, implement, content, e2e), domener (security, a11y, convex, react, seo) eller path-glober. Bruk ["*"] bare når den gjelder hele flåten.
- source_ref: eksakt kilde (signal-kilde, fil:symbol, eller URL). Aldri tom.
- confidence: 0..1. Vær ærlig; lavt for spekulativt.
- Kun for tech-trend som TILSIER en oppgradering (f.eks. ny TS-major): sett "upgrade" med { title, goal, rationale }, en rådgivende oppgraderingsjobb flåten kan foreslå.

Ikke fabrikkér. Hvis en kilde er tynn, hopp over den heller enn å gjette. Maks ~15 lærdommer per kjøring; kvalitet over kvantitet.

Svar til SLUTT med KUN ett JSON-objekt på denne formen (ingen tekst etter):
{"learnings":[{"type":"...","statement":"...","why":"...","applies_to":["..."],"source_ref":"...","confidence":0.0,"upgrade":{"title":"...","goal":"...","rationale":"..."}}],"demote":["gammel statement som ikke lenger gjelder"]}`;
}

/** Extract the last JSON object from the agent transcript and validate it into a
 *  DistillOutput. Returns empty output on any parse failure (never throws). */
export function parseDistilled(text: string): DistillOutput {
  const obj = extractLastJsonObject(text);
  if (!obj || typeof obj !== "object") return { learnings: [] };
  const raw = obj as { learnings?: unknown; demote?: unknown };
  const learnings: DistilledLearning[] = Array.isArray(raw.learnings)
    ? raw.learnings.map(coerceLearning).filter((l): l is DistilledLearning => l !== null)
    : [];
  const demote = Array.isArray(raw.demote)
    ? raw.demote.filter((d): d is string => typeof d === "string" && d.trim().length > 0)
    : [];
  return { learnings, demote };
}

function coerceLearning(x: unknown): DistilledLearning | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const type = String(o.type ?? "");
  const statement = String(o.statement ?? "").trim();
  if (!LEARNING_TYPES.includes(type as LearningType) || statement.length < 8) return null;
  const applies_to = Array.isArray(o.applies_to)
    ? o.applies_to.map((a) => String(a).trim()).filter(Boolean)
    : [];
  const conf = Number(o.confidence);
  const learning: DistilledLearning = {
    type: type as LearningType,
    statement,
    why: String(o.why ?? "").trim(),
    applies_to: applies_to.length ? applies_to : ["*"],
    source_ref: String(o.source_ref ?? "").trim(),
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : 0.5,
  };
  // Only honour a well-formed upgrade suggestion on a tech-trend.
  if (learning.type === "tech-trend" && o.upgrade && typeof o.upgrade === "object") {
    const u = o.upgrade as Record<string, unknown>;
    const title = String(u.title ?? "").trim();
    const goal = String(u.goal ?? "").trim();
    if (title && goal) {
      learning.upgrade = { title, goal, rationale: String(u.rationale ?? "").trim() };
    }
  }
  return learning;
}

/** Best-effort: find and parse the last balanced `{...}` block in the text. */
function extractLastJsonObject(text: string): unknown {
  const end = text.lastIndexOf("}");
  if (end < 0) return null;
  let depth = 0;
  for (let i = end; i >= 0; i--) {
    const c = text[i];
    if (c === "}") depth++;
    else if (c === "{") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(i, end + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export interface ApplyResult {
  upserted: Learning[];
  demoted: string[];
  upgrades: DistilledLearning[]; // learnings carrying an upgrade suggestion
}

/**
 * Apply a distill output to the store: upsert (deduped/compounded) each learning,
 * demote statements that no longer apply, and collect any upgrade suggestions.
 * Does NOT save or file to Linear — the caller decides that (so it stays pure
 * and testable). Reject learnings with an empty source_ref (never fabricate).
 */
export function applyDistilled(store: OpenBrain, output: DistillOutput, now: string): ApplyResult {
  const upserted: Learning[] = [];
  const upgrades: DistilledLearning[] = [];
  for (const d of output.learnings) {
    if (!d.source_ref) continue; // provenance is mandatory
    const l = upsertLearning(store, d, now);
    upserted.push(l);
    if (d.upgrade) upgrades.push(d);
  }

  const demoted: string[] = [];
  for (const stmt of output.demote ?? []) {
    const norm = normStatement(stmt);
    const rec = store.knowledge.find((l) => normStatement(l.statement) === norm);
    if (rec && rec.status !== "demoted") {
      rec.status = "demoted";
      rec.updated_at = now;
      store.upsertLearning(rec);
      demoted.push(rec.statement);
    }
  }
  return { upserted, demoted, upgrades };
}

/** Render an upgrade suggestion as a runnable /loop goal for Linear (advisory —
 *  the human Todo gate decides whether it ever runs). */
export function upgradeGoalMarkdown(u: NonNullable<DistilledLearning["upgrade"]>, sourceRef: string): string {
  return [
    `**Rådgivende oppgradering foreslått av kunnskapsagenten** (fra en observert teknologitrend).`,
    ``,
    `## Mål`,
    u.goal,
    ``,
    `## Begrunnelse`,
    u.rationale || "(ingen)",
    ``,
    `## Kilde`,
    sourceRef,
    ``,
    `## Kjør som Claude-loop (på en ny branch, aldri main)`,
    "```",
    `/loop ${u.goal}`,
    "```",
    ``,
    `---`,
    `_Auto-arkivert av Digilist kunnskapsagent. Dette er et FORSLAG i Backlog. Flytt til Todo først når et menneske har vurdert det._`,
  ].join("\n");
}
