/**
 * Product-idea agent. Turns the same research the blog agent runs on — the
 * ranked keyword clusters (real search demand), the published blog corpus
 * (what we already talk about), and the accumulated learnings — into concrete
 * product feature proposals. The orchestrating script files these as GitHub
 * issues so demand-driven ideas land in the backlog instead of a log line.
 */
import type { ContentAgentConfig } from "./config";
import { anthropic, type AnthropicCallResult } from "./generate";

export interface FeatureIdea {
  title: string; // concise, issue-ready
  problem: string; // the user/search problem it addresses
  proposal: string; // what to build
  evidence: string[]; // keyword clusters / content signals behind it
  audience: string; // persona
  impact: "high" | "medium" | "low";
  effort: "S" | "M" | "L";
  labels: string[];
}

export interface IdeationInput {
  clusters: { label: string; centroid_term: string; topic_summary: string; gap_score: number }[];
  corpus: { title: string; tag: string }[];
  learnings: string;
}

const IDEATE_SYSTEM = `Du er Digilists produktstrateg. Digilist er en kommunal SaaS-plattform for booking av lokaler (idrettshaller, møterom, kulturhus, gymsaler, selskapslokaler). Målgrupper: innbygger, saksbehandler, driftsleder, IT-leder, lag og foreninger.

Du får (a) hva folk faktisk søker etter (keyword-klynger med gap-score: høy gap = dårlig dekket i dag), (b) hva vi allerede skriver om (bloggkorpus), og (c) lærdommer fra systemet. Foreslå KONKRETE produktfunksjoner Digilist bør vurdere å bygge, forankret i reell søkeetterspørsel eller et innholds/produkt-gap.

Krav til hver idé:
- Konkret og byggbar, ikke en floskel. En utvikler skal forstå hva som skal lages.
- Knyttet til bevis: hvilken søkeklynge eller hvilket signal peker på behovet.
- Realistisk for en bookingplattform for norsk offentlig sektor (GDPR, ID-porten/BankID, universell utforming, SSA-L).
- Ikke foreslå noe vi åpenbart allerede har (kryss mot bloggkorpuset og vanlig plattformfunksjonalitet).
- Norsk bokmål. Ingen tankestrek som skilletegn.

Returner KUN gyldig JSON, en array, ingen forklaring:
[{"title":"<kort, issue-klar tittel>","problem":"<brukerproblemet>","proposal":"<hva som skal bygges>","evidence":["<klynge/signal>"],"audience":"<persona>","impact":"high|medium|low","effort":"S|M|L","labels":["<label>"]}]`;

function tryExtractJsonArray<T>(text: string): T[] | null {
  const m = text.match(/\[[\s\S]*\]/);
  if (!m) return null;
  try {
    const v = JSON.parse(m[0]);
    return Array.isArray(v) ? (v as T[]) : null;
  } catch {
    return null;
  }
}

export async function generateFeatureIdeas(
  cfg: ContentAgentConfig,
  input: IdeationInput,
  count = 5,
): Promise<{ ideas: FeatureIdea[]; call: AnthropicCallResult }> {
  const clusterLines = input.clusters
    .slice(0, 20)
    .map(
      (c) =>
        `- ${c.label} (sentralt: ${c.centroid_term}, gap: ${Math.round(c.gap_score)}) — ${c.topic_summary}`,
    )
    .join("\n");
  const corpusLines = input.corpus
    .slice(0, 40)
    .map((c) => `- ${c.title}${c.tag ? ` (${c.tag})` : ""}`)
    .join("\n");
  const userMessage = `${input.learnings ? `${input.learnings}\n\n` : ""}SØKEKLYNGER (etterspørsel; høy gap = dårlig dekket):
${clusterLines || "(ingen)"}

ALLEREDE PUBLISERT (unngå å foreslå det vi tydelig har):
${corpusLines || "(ingen)"}

Foreslå inntil ${count} konkrete produktfunksjoner som JSON-array.`;

  const call = await anthropic(cfg, {
    model: cfg.anthropicReviewModel, // best model — strategy quality matters
    systemPrompt: IDEATE_SYSTEM,
    userMessage,
    maxTokens: 4096,
  });
  const parsed = tryExtractJsonArray<FeatureIdea>(call.text) ?? [];
  // Keep only well-formed ideas.
  const ideas = parsed
    .filter((i) => i && typeof i.title === "string" && i.title.trim() && i.proposal)
    .slice(0, count)
    .map((i) => ({
      title: i.title.trim(),
      problem: i.problem ?? "",
      proposal: i.proposal ?? "",
      evidence: Array.isArray(i.evidence) ? i.evidence : [],
      audience: i.audience ?? "",
      impact: (["high", "medium", "low"].includes(i.impact) ? i.impact : "medium") as FeatureIdea["impact"],
      effort: (["S", "M", "L"].includes(i.effort) ? i.effort : "M") as FeatureIdea["effort"],
      labels: Array.isArray(i.labels) ? i.labels : [],
    }));
  return { ideas, call };
}
