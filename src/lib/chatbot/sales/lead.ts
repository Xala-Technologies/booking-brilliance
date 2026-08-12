/**
 * The silent lead profile — what we have learned, without ever making the
 * visitor feel they are filling in a form.
 *
 * Two jobs:
 *
 *  1. **Stop re-asking.** The assistant must never ask for something the visitor
 *     already told it. Geir opened with "kulturhus, 80 personer, helger, bryllup"
 *     — a assistant that then asks "hva slags lokale har dere?" has stopped
 *     listening, and the visitor knows it.
 *  2. **Brief the human.** The handoff email currently describes a conversation.
 *     It should describe a LEAD, so whoever calls starts at minute ten of the
 *     relationship instead of minute zero.
 *
 * Extraction is deliberately conservative keyword matching, not a model call.
 * A wrong inference is worse than a missing one: acting on "you have 40 venues"
 * when they said one destroys trust instantly, while a blank field just means
 * the assistant asks. Everything here is pure and testable.
 */
import { buyingSignalsIn, detectObjections, painSignalsIn } from "./stage";


export interface LeadProfile {
  /** Private venue operator, municipality, sports club, unknown. */
  segment: "privat" | "kommune" | "lag-forening" | null;
  /** Distinct venues/buildings they rent out. */
  venues: number | null;
  /** Seated/standing capacity if stated. */
  capacity: number | null;
  /** What the venue is used for. */
  useCases: string[];
  /** When they rent — weekends, year-round, seasonal. */
  cadence: string | null;
  /** The tool they use today, if named. */
  currentTool: string | null;
  /** Concerns they raised, by objection id. */
  objections: string[];
  /** Buying-signal phrases they used. */
  signals: string[];
}

export const EMPTY_PROFILE: LeadProfile = {
  segment: null,
  venues: null,
  capacity: null,
  useCases: [],
  cadence: null,
  currentTool: null,
  objections: [],
  signals: [],
};

const USE_CASES: ReadonlyArray<[RegExp, string]> = [
  [/bryllup/i, "bryllup"],
  [/selskap|fest|jubileum|bursdag|konfirmasjon/i, "selskaper"],
  [/kunstutstilling|utstilling|galleri/i, "utstillinger"],
  [/konsert|forestilling|teater/i, "kultur"],
  [/møte|konferanse|kurs/i, "møter"],
  [/minnestund|begravelse/i, "minnestund"],
  [/trening|idrett|kamp/i, "idrett"],
];

const TOOLS: ReadonlyArray<[RegExp, string]> = [
  [/google\s*calendar|gcal/i, "Google Calendar"],
  [/outlook|microsoft 365|office 365/i, "Outlook/M365"],
  [/excel|regneark/i, "Excel/regneark"],
  [/rco/i, "RCO booking"],
  [/telefon|e-?post|mail/i, "telefon/e-post"],
];

/** Numbers written as words appear in real messages ("to lokaler"). */
const WORD_NUMBERS: Record<string, number> = {
  ett: 1, en: 1, én: 1, to: 2, tre: 3, fire: 4, fem: 5, seks: 6, sju: 7, syv: 7, åtte: 8, ni: 9, ti: 10,
};

function firstMatch(text: string, table: ReadonlyArray<[RegExp, string]>): string | null {
  for (const [re, label] of table) if (re.test(text)) return label;
  return null;
}

/**
 * Extract what the visitor has told us. Conservative by design — a null field
 * means "ask", which is cheap; a wrong field means "act on a fabrication", which
 * is not.
 */
export function extractProfile(userTurns: readonly string[]): LeadProfile {
  const text = userTurns.join("\n");
  if (!text.trim()) return { ...EMPTY_PROFILE };

  // Segment. Municipal wording wins only when it describes THEM, not a question
  // about municipalities — so require a first-person-ish cue nearby.
  let segment: LeadProfile["segment"] = null;
  if (/\b(vi er en kommune|vår kommune|kommunen vår|vi i kommunen)\b/i.test(text)) segment = "kommune";
  else if (/\b(idrettslag|forening|klubb|lag og foreninger)\b/i.test(text)) segment = "lag-forening";
  else if (/\b(vi driver|vi leier ut|vårt lokale|vi eier|vi har et)\b/i.test(text)) segment = "privat";

  // Venue count: a digit or a written number immediately before the noun.
  let venues: number | null = null;
  const digit = text.match(/\b(\d+)\s+(lokale[rn]?|bygg|sal(?:er)?|anlegg)\b/i);
  if (digit) venues = Number(digit[1]);
  else {
    const word = text.match(/\b(ett|en|én|to|tre|fire|fem|seks|sju|syv|åtte|ni|ti)\s+(lokale[rn]?|bygg|sal(?:er)?|anlegg)\b/i);
    if (word) venues = WORD_NUMBERS[word[1].toLowerCase()] ?? null;
  }
  // "bare ett lokale" / "kun ett bygg" is the single strongest small-customer cue.
  if (venues === null && /\b(bare|kun)\s+(ett|et|én|en)\s+(lokale|bygg|sal)\b/i.test(text)) venues = 1;

  const cap = text.match(/\b(?:plass til|kapasitet(?:\s*på)?|rom for)\s*(?:ca\.?\s*)?(\d{1,4})\b/i)
    ?? text.match(/\b(\d{2,4})\s*(?:personer|gjester|plasser)\b/i);
  const capacity = cap ? Number(cap[1]) : null;

  const useCases = USE_CASES.filter(([re]) => re.test(text)).map(([, label]) => label);

  let cadence: string | null = null;
  if (/helg|fredag|lørdag|søndag|fre\s*til\s*søn/i.test(text)) cadence = "helgebasert";
  if (/hele året|året rundt|hele aret/i.test(text)) cadence = cadence ? `${cadence}, hele året` : "hele året";
  if (/sesong/i.test(text)) cadence = cadence ? `${cadence}, sesong` : "sesong";

  return {
    segment,
    venues,
    capacity,
    useCases,
    cadence,
    currentTool: firstMatch(text, TOOLS),
    objections: [],
    signals: [],
  };
}

/** The eight fields that matter, as a 0..1 fraction. Drives stage inference. */
export function profileCompleteness(p: LeadProfile): number {
  const filled = [
    p.segment !== null,
    p.venues !== null,
    p.capacity !== null,
    p.useCases.length > 0,
    p.cadence !== null,
    p.currentTool !== null,
    p.objections.length > 0,
    p.signals.length > 0,
  ].filter(Boolean).length;
  return filled / 8;
}

/**
 * What the assistant already knows — injected into the prompt so it CANNOT ask
 * again. This is the anti-"so what kind of venue do you have?" mechanism.
 */
export function renderKnownFacts(p: LeadProfile): string {
  const bits: string[] = [];
  if (p.segment) bits.push(`segment: ${p.segment}`);
  if (p.venues !== null) bits.push(`antall lokaler: ${p.venues}`);
  if (p.capacity !== null) bits.push(`kapasitet: ${p.capacity}`);
  if (p.useCases.length) bits.push(`brukes til: ${p.useCases.join(", ")}`);
  if (p.cadence) bits.push(`utleiemønster: ${p.cadence}`);
  if (p.currentTool) bits.push(`bruker i dag: ${p.currentTool}`);
  if (p.objections.length) bits.push(`bekymringer: ${p.objections.join(", ")}`);
  if (p.signals.length) bits.push(`kjøpssignaler: ${p.signals.join(", ")}`);
  return bits.length ? bits.join("\n") : "(ingenting ennå)";
}

/** 0-100. Buying signals dominate; knowing who they are is the multiplier. */
export function interestScore(p: LeadProfile): number {
  const signal = Math.min(p.signals.length, 3) * 20; // 0-60
  const known = Math.round(profileCompleteness(p) * 30); // 0-30
  const objection = p.objections.length > 0 ? 10 : 0; // engaged enough to object
  return Math.min(100, signal + known + objection);
}

/**
 * The briefing the human gets instead of a raw transcript.
 *
 * The email already carries the conversation; what it lacks is a read on it.
 * This is the difference between "here is what was said" and "here is who this
 * is, what they are worried about, and how to open the call".
 */
export function buildBriefing(p: LeadProfile, org?: string, name?: string): string {
  const lines: string[] = [];
  const who = [name, org].filter(Boolean).join(" — ");
  lines.push(`LEAD${who ? `: ${who}` : ""}`);
  if (p.segment) lines.push(`- Segment: ${p.segment}`);
  if (p.venues !== null) lines.push(`- Antall lokaler: ${p.venues}${p.venues === 1 ? " (liten kunde — prisbekymring sannsynlig)" : ""}`);
  if (p.capacity !== null) lines.push(`- Kapasitet: ca. ${p.capacity} personer`);
  if (p.useCases.length) lines.push(`- Brukes til: ${p.useCases.join(", ")}`);
  if (p.cadence) lines.push(`- Utleiemønster: ${p.cadence}`);
  if (p.currentTool) lines.push(`- Bruker i dag: ${p.currentTool}`);
  if (p.objections.length) lines.push(`- Innvendinger: ${p.objections.join(", ")}`);
  if (p.signals.length) lines.push(`- Kjøpssignaler: ${p.signals.join(", ")}`);
  lines.push(`- Interesse: ${interestScore(p)}/100`);
  lines.push(`- Anbefalt åpning: ${recommendedOpening(p)}`);
  return lines.join("\n");
}

/** The first sentence the human should say. Concrete beats generic. */
export function recommendedOpening(p: LeadProfile): string {
  if (p.objections.includes("too-small") || p.venues === 1) {
    return "Bekreft først at ett lokale er helt greit og at prisen ikke ligner en kommunes, før noe annet.";
  }
  if (p.objections.includes("price")) {
    return "Start med å plassere dem prismessig ut fra hva de faktisk trenger, ikke med prismodellen.";
  }
  if (p.objections.includes("existing-tool") && p.currentTool) {
    return `Spør hva som koster mest tid i ${p.currentTool} i dag — ikke snakk verktøyet ned.`;
  }
  if (p.currentTool) return `Spør hvordan ${p.currentTool} fungerer for dem i dag, og hvor det ryker.`;
  return "Spør hvordan de håndterer forespørsler og kalender i dag.";
}

/**
 * The profile with its behavioural half filled in.
 *
 * `extractProfile` reads FACTS out of the text — segment, venues, capacity,
 * cadence, tool. It always returns `objections: []` and `signals: []`, because
 * those come from cue matching rather than extraction, and they were being
 * added separately inside `buildLLMContext`.
 *
 * That split silently broke `interestScore`, which weights signals at up to 60
 * points and objections at 10. Scoring a bare `extractProfile` result could
 * never exceed 30 — so the notification threshold of 45 was UNREACHABLE and
 * every lead was being caught by keyword matching instead. Found by running
 * realistic conversations and printing the scores, which is the only reason
 * anyone would notice: the behaviour looked correct throughout.
 *
 * Anything that scores or renders a lead must use this, not `extractProfile`.
 */
export function enrichProfile(userTurns: readonly string[]): LeadProfile {
  const all = userTurns.join("\n");
  return {
    ...extractProfile(userTurns),
    objections: detectObjections(all).map((o) => o.id),
    // Pain counts as a buying signal because that is what it is: an implied
    // need stated as a symptom. Someone who has counted the hours lost to
    // manual booking is further along than someone asking what it costs.
    signals: [...buyingSignalsIn(all), ...painSignalsIn(all)],
  };
}
