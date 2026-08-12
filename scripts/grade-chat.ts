/**
 * Grades what the assistant actually SAYS, against the real model.
 *
 * The vitest scenario suite proves that given a conversation, the right thing
 * happens — a lead is filed, a bot is ignored, a false promise is suppressed.
 * It never calls the model, so it cannot tell you whether the replies are any
 * good. Every incident on this project has been about a reply.
 *
 * This is the other half. It walks every scenario through the live `/api/chat`
 * endpoint with the real prompt, and grades each reply with the same
 * `guardrails.ts` that runs in the browser.
 *
 * DELIBERATELY NOT IN CI. It costs API credits per run and needs the network,
 * so it is a thing you run before shipping a prompt change, not on every push.
 *
 *   pnpm chat:grade                    # every scenario, against production
 *   pnpm chat:grade -- --limit 5       # a quick pass
 *   pnpm chat:grade -- --id kommune-anskaffelse
 *   pnpm chat:grade -- --endpoint http://localhost:8787/api/chat
 *
 * Exit code is 1 when any reply has a BLOCKING violation, so it can gate a
 * release without anyone reading the table.
 */
import { buildLLMContext } from "../src/lib/chatbot/rag";
import { retrieve } from "../src/lib/chatbot/rag";
import { describeViolations, blocking, gradeReply, type Violation } from "../src/lib/chatbot/guardrails";
import { GUARD_SCENARIOS, SCENARIOS, SCENARIOS_BATCH_2, SCENARIOS_BATCH_3, type Scenario } from "../src/lib/chatbot/scenarios";

const ALL: Scenario[] = [...SCENARIOS, ...SCENARIOS_BATCH_2, ...SCENARIOS_BATCH_3, ...GUARD_SCENARIOS];

interface Args {
  endpoint: string;
  limit: number;
  id: string | null;
  delayMs: number;
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | null => {
    const i = argv.indexOf(flag);
    return i !== -1 && argv[i + 1] ? (argv[i + 1] as string) : null;
  };
  return {
    endpoint: get("--endpoint") ?? "https://digilist.no/api/chat",
    limit: Number(get("--limit") ?? ALL.length),
    id: get("--id"),
    // The endpoint is rate-limited and this is not a load test.
    delayMs: Number(get("--delay") ?? 700),
  };
}

interface Row {
  id: string;
  kind: string;
  turn: string;
  reply: string;
  violations: Violation[];
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Replay one scenario and grade the reply to its FINAL turn.
 *
 * Only the last turn is graded, but every earlier turn is sent so the model
 * sees the real conversation. Grading turn one of a three-turn scenario would
 * be grading a different, easier problem.
 */
async function runScenario(scenario: Scenario, args: Args): Promise<Row | null> {
  const history: { role: string; text: string }[] = [];
  for (const turn of scenario.turns.slice(0, -1)) history.push({ role: "user", text: turn });
  const finalTurn = scenario.turns[scenario.turns.length - 1] as string;

  const hits = retrieve(finalTurn, 3);
  const ctx = buildLLMContext(finalTurn, hits, history, []);

  const res = await fetch(args.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: ctx.system, messages: ctx.messages, hits }),
  });

  let reply: string | undefined;
  try {
    reply = ((await res.json()) as { text?: string })?.text;
  } catch {
    reply = undefined;
  }

  if (!res.ok || !reply) {
    // A degraded endpoint must not read as a clean run. This is the exact
    // failure that hid a 20-day outage.
    return {
      id: scenario.id,
      kind: scenario.kind,
      turn: finalTurn,
      reply: `(no reply — HTTP ${res.status})`,
      violations: [{ rule: "no-reply", severity: "block", detail: `endpoint returned ${res.status}` }],
    };
  }

  return {
    id: scenario.id,
    kind: scenario.kind,
    turn: finalTurn,
    reply,
    violations: gradeReply({
      reply,
      allowedPages: [],
      sourcesHadPrice: hits.some((h) => /\d[\d\s.,]*\s*(kr|kroner|nok)/i.test(h.a)),
    }),
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const chosen = (args.id ? ALL.filter((s) => s.id === args.id) : ALL).slice(0, args.limit);

  if (!chosen.length) {
    console.error(`No scenario matched. Known ids:\n  ${ALL.map((s) => s.id).join("\n  ")}`);
    process.exit(2);
  }

  console.log(`Grading ${chosen.length} scenario(s) against ${args.endpoint}\n`);
  const rows: Row[] = [];

  for (const [i, scenario] of chosen.entries()) {
    process.stdout.write(`  [${i + 1}/${chosen.length}] ${scenario.id} … `);
    try {
      const row = await runScenario(scenario, args);
      if (row) {
        rows.push(row);
        console.log(describeViolations(row.violations));
      }
    } catch (err) {
      rows.push({
        id: scenario.id,
        kind: scenario.kind,
        turn: "",
        reply: "",
        violations: [{ rule: "threw", severity: "block", detail: String(err).slice(0, 120) }],
      });
      console.log(`✗ threw: ${String(err).slice(0, 80)}`);
    }
    await sleep(args.delayMs);
  }

  // ── scorecard ──────────────────────────────────────────────────────────
  const withBlocking = rows.filter((r) => blocking(r.violations).length > 0);
  const withWarnings = rows.filter(
    (r) => blocking(r.violations).length === 0 && r.violations.length > 0,
  );

  const byRule = new Map<string, number>();
  for (const row of rows) for (const v of row.violations) byRule.set(v.rule, (byRule.get(v.rule) ?? 0) + 1);

  console.log(`\n${"─".repeat(72)}`);
  console.log(`clean ${rows.length - withBlocking.length - withWarnings.length}/${rows.length}   warnings ${withWarnings.length}   BLOCKING ${withBlocking.length}`);
  if (byRule.size) {
    console.log("\nby rule:");
    for (const [rule, n] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(3)}  ${rule}`);
    }
  }

  if (withBlocking.length) {
    console.log(`\n${"─".repeat(72)}\nBLOCKING — these replies would be suppressed in production:\n`);
    for (const row of withBlocking) {
      console.log(`  ${row.id}  (${row.kind})`);
      console.log(`    visitor:  ${row.turn.slice(0, 100)}`);
      console.log(`    reply:    ${row.reply.replace(/\n/g, " ").slice(0, 160)}`);
      for (const v of blocking(row.violations)) console.log(`    ✗ ${v.rule}: ${v.detail}`);
      console.log("");
    }
  }

  process.exit(withBlocking.length ? 1 : 0);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
