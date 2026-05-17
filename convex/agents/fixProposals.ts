/**
 * Foreslå fiks — AI fix proposals for audit findings + regression alerts.
 *
 * Closed-loop flow:
 *   1. Admin clicks "Foreslå fiks" on a finding/alert in the dashboard
 *   2. `propose` action picks the right specialist agent by audit_type
 *      (sikkerhet/seo/wcag/ytelse) and calls Anthropic with structured
 *      context: finding metadata + surface origin + production HTML
 *      (so the agent sees the actual rendered page).
 *   3. The agent returns a JSON proposal: rationale, files_touched,
 *      diff, verification steps, risk.
 *   4. Stored in fix_proposals. Admin reviews. Future: Accept opens a
 *      PR via GitHub API.
 *
 * The agent system prompts mirror src/pages/admin/IntelligenceAgents.tsx
 * but constrained to JSON output for parseability.
 */
import { v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { api } from "../_generated/api";
import { requireAdmin } from "../auth";

const ISO = () => new Date().toISOString();

const AGENT_FOR_AUDIT: Record<string, "sikkerhet" | "seo" | "wcag" | "ytelse" | "triage"> = {
  security: "sikkerhet",
  seo: "seo",
  a11y: "wcag",
  links: "seo", // broken links are SEO-adjacent
  uptime: "triage",
  performance: "ytelse",
  performance_desktop: "ytelse",
};

const AGENT_PROMPTS: Record<string, string> = {
  sikkerhet: `Du er Digilists Chief Security Strategist. Output kun gyldig JSON i denne strukturen:

{
  "rationale": "1-3 setninger som forklarer hvorfor dette er en risiko (OWASP-ID, NSM-prinsipp, eller ISO-kontroll der relevant)",
  "files_touched": ["server/index.mjs", "nginx-config", "src/components/X.tsx"],
  "diff": "Konkret kodeendring som unified diff ELLER konfig-snippet (header-syntax, nginx-block, eller systemd-unit). Bruk faktiske Digilist-paths og verdier.",
  "verification": "Hvordan operatør verifiserer at fiksen virker (verktøy, kommando, forventet output)",
  "risk": "low | med | high — hvor risikabel selve fiksen er å deployere"
}

Aldri returner placeholder som '...' eller 'TODO'. Hvis du ikke kan foreslå konkret diff, returner en konkret manuell-prosedyre i diff-feltet.`,

  seo: `Du er Digilists Head of Search Strategy. Output kun gyldig JSON:

{
  "rationale": "Hvorfor dette skader rangering eller AI-search-synlighet (keyword-volum, KD, CTR-norm)",
  "files_touched": ["src/pages/X.tsx", "scripts/prerender.mjs", "apps/docs/astro.config.mjs"],
  "diff": "Konkret kode-endring eller meta-tag/JSON-LD-snippet med faktisk innhold (ikke 'fyll inn beskrivelse')",
  "verification": "Search Console-query, PageSpeed-metric, eller schema.org-validator forventet output",
  "risk": "low | med | high"
}`,

  wcag: `Du er Digilists Accessibility Lead. Output kun gyldig JSON:

{
  "rationale": "Hvilken WCAG 2.2 AA-kontroll dette bryter (f.eks. 1.4.3 Contrast, 2.4.6 Headings)",
  "files_touched": ["src/components/X.tsx"],
  "diff": "Konkret JSX-endring (legg til aria-label, alt-tekst, lang-attributt, etc.) — faktisk Digilist-tekst, ikke 'lorem'",
  "verification": "axe-core regel-id, Playwright-test, eller manuell skjermleser-flyt",
  "risk": "low | med | high"
}`,

  ytelse: `Du er Digilists Performance Engineer. Output kun gyldig JSON:

{
  "rationale": "Hvilken CWV-metrikk dette påvirker (LCP/CLS/INP) og bidragsfaktor (font, image, JS bundle)",
  "files_touched": ["index.html", "vite.config.ts", "src/components/X.tsx", "public/hero/X.webp"],
  "diff": "Konkret preload-tag, lazy import, manualChunks-regel, eller bilde-konvertering. Bruk Digilists faktiske filer.",
  "verification": "PSI-score-mål, web-vitals-måling, eller Lighthouse-audit-id",
  "risk": "low | med | high"
}`,

  triage: `Du er Digilists Senior Quality Triage. Output kun gyldig JSON:

{
  "rationale": "Hva som har slått ut og hvilken specialistagent burde fikse det",
  "files_touched": [],
  "diff": "Manuelt-prosedyre-anbefaling (ssh til VPS, sjekk logger, restart digilist-api, etc.)",
  "verification": "Hvordan vite at uptime er gjenopprettet",
  "risk": "low | med | high"
}`,
};

interface ParsedProposal {
  rationale: string;
  files_touched: string[];
  diff: string;
  verification: string;
  risk: "low" | "med" | "high";
}

function parseProposal(raw: string): ParsedProposal | null {
  // Strip code fences if Claude wrapped them
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
  try {
    const j = JSON.parse(cleaned);
    if (typeof j.rationale !== "string") return null;
    if (typeof j.diff !== "string") return null;
    return {
      rationale: String(j.rationale).slice(0, 2000),
      files_touched: Array.isArray(j.files_touched)
        ? j.files_touched.map(String).slice(0, 20)
        : [],
      diff: String(j.diff).slice(0, 8000),
      verification: String(j.verification ?? "").slice(0, 1000),
      risk: ["low", "med", "high"].includes(j.risk) ? j.risk : "med",
    };
  } catch {
    return null;
  }
}

/**
 * Public action — called from the dashboard. Takes a finding (or alert)
 * reference and surface details, calls Anthropic, persists the result.
 */
export const propose = action({
  args: {
    adminToken: v.string(),
    finding_ref: v.string(),
    surface: v.string(),
    audit_type: v.string(),
    rule: v.optional(v.string()),
    message: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    id: string;
    agent: string;
    rationale: string;
    files_touched: string[];
    diff: string;
    verification: string;
    risk: string;
    cost_usd: number;
  }> => {
    requireAdmin(args.adminToken);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY not set on the Convex deployment. Run `npx convex env set ANTHROPIC_API_KEY <key>`.",
      );
    }

    const agent = AGENT_FOR_AUDIT[args.audit_type] ?? "triage";
    const system = AGENT_PROMPTS[agent];

    const userMessage = [
      `Audit-funn på Digilist:`,
      ``,
      `Overflate: ${args.surface}`,
      `Audit-type: ${args.audit_type}`,
      args.rule ? `Regel: ${args.rule}` : "",
      args.url ? `URL: ${args.url}` : "",
      ``,
      `Funn-melding:`,
      args.message,
      ``,
      `Gi en konkret fiks-proposal som JSON-objekt. Ingen prosa utenfor JSON.`,
    ]
      .filter(Boolean)
      .join("\n");

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!apiRes.ok) {
      const body = await apiRes.text();
      throw new Error(
        `Anthropic ${apiRes.status}: ${body.slice(0, 300)}`,
      );
    }

    const data = (await apiRes.json()) as {
      content: Array<{ type: string; text?: string }>;
      model: string;
      usage: { input_tokens: number; output_tokens: number };
    };
    const raw = data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("");
    const parsed = parseProposal(raw);
    if (!parsed) {
      throw new Error(
        `Agent returned unparseable proposal — first 200 chars: ${raw.slice(0, 200)}`,
      );
    }

    // Anthropic pricing for Sonnet 4.6 — cached value (approx)
    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;
    const costUsd =
      (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;

    const id = await ctx.runMutation(
      api.agents.fixProposals.persist,
      {
        adminToken: args.adminToken,
        finding_ref: args.finding_ref,
        surface: args.surface,
        audit_type: args.audit_type,
        rule: args.rule,
        agent_slug: agent,
        model: data.model,
        rationale: parsed.rationale,
        files_touched: JSON.stringify(parsed.files_touched),
        diff: parsed.diff,
        verification: parsed.verification,
        risk: parsed.risk,
        cost_usd: costUsd,
        tokens_in: inputTokens,
        tokens_out: outputTokens,
      },
    );
    return { id, agent, ...parsed, cost_usd: costUsd };
  },
});

export const persist = mutation({
  args: {
    adminToken: v.string(),
    finding_ref: v.string(),
    surface: v.string(),
    audit_type: v.string(),
    rule: v.optional(v.string()),
    agent_slug: v.string(),
    model: v.string(),
    rationale: v.string(),
    files_touched: v.string(),
    diff: v.string(),
    verification: v.string(),
    risk: v.string(),
    cost_usd: v.number(),
    tokens_in: v.number(),
    tokens_out: v.number(),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db.insert("fix_proposals", {
      finding_ref: args.finding_ref,
      surface: args.surface,
      audit_type: args.audit_type,
      rule: args.rule,
      agent_slug: args.agent_slug,
      model: args.model,
      rationale: args.rationale,
      files_touched: args.files_touched,
      diff: args.diff,
      verification: args.verification,
      risk: args.risk,
      status: "proposed",
      reviewer_notes: null,
      cost_usd: args.cost_usd,
      tokens_in: args.tokens_in,
      tokens_out: args.tokens_out,
      created_at: ISO(),
      reviewed_at: null,
      reviewed_by: null,
    });
  },
});

export const updateStatus = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("fix_proposals"),
    status: v.string(), // "accepted" | "rejected" | "applied"
    note: v.optional(v.string()),
    reviewer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.patch(args.id, {
      status: args.status,
      reviewer_notes: args.note ?? null,
      reviewed_at: ISO(),
      reviewed_by: args.reviewer ?? "admin",
    });
    return { ok: true };
  },
});

export const listForFinding = query({
  args: { adminToken: v.string(), finding_ref: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db
      .query("fix_proposals")
      .withIndex("by_finding_ref", (q) =>
        q.eq("finding_ref", args.finding_ref),
      )
      .order("desc")
      .take(5);
  },
});

export const listOpen = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db
      .query("fix_proposals")
      .withIndex("by_status", (q) => q.eq("status", "proposed"))
      .order("desc")
      .take(50);
  },
});
