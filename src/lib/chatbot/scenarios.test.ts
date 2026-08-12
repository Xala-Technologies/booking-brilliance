/**
 * Plays every scenario through the SAME code path production uses.
 *
 * The suite has two jobs. The obvious one is regression: the conversation that
 * promised an offer it could not send must never behave that way again. The
 * more useful one is calibration — `SERIOUS_LEAD_SCORE` was an estimate, and
 * the only way to be confident in it is to run realistic conversations whose
 * answer a human already knows and check the code agrees.
 *
 * Nothing here touches the network. `decideTurn` is pure, so a hundred
 * scenarios cost milliseconds and no notification email ever reaches Digilist.
 */
import { describe, expect, it } from "vitest";
import { SERIOUS_LEAD_SCORE } from "./contact";
import { GUARD_SCENARIOS, SCENARIOS, type Scenario } from "./scenarios";
import { decideTurn, type TurnDecision } from "./turn";

/**
 * Replay a conversation turn by turn, exactly as the hook does — carrying the
 * "already notified" flags forward so one conversation yields at most one
 * notification.
 */
function play(scenario: Scenario): { decisions: TurnDecision[]; notifiedAt: number | null } {
  const decisions: TurnDecision[] = [];
  let leadFiled = false;
  let notified = false;
  let notifiedAt: number | null = null;

  for (let i = 0; i < scenario.turns.length; i++) {
    const isLast = i === scenario.turns.length - 1;
    const decision = decideTurn({
      userTurns: scenario.turns.slice(0, i + 1),
      reply: isLast && scenario.modelReply ? scenario.modelReply : "Godt spørsmål — kort svar her.",
      // Assume retrieval found something; the scenarios are about intent, not
      // about the FAQ index. `hitCount: 0` would force the CTA on every turn
      // and hide whether `needsHuman` is doing its job.
      hitCount: 2,
      leadAlreadyFiled: leadFiled,
      alreadyNotified: notified,
    });
    decisions.push(decision);
    if (decision.notify !== "none" && notifiedAt === null) notifiedAt = i;
    if (decision.notify === "lead") leadFiled = true;
    if (decision.notify !== "none") notified = true;
  }
  return { decisions, notifiedAt };
}

describe("scenario suite — does the assistant read visitors correctly?", () => {
  it.each(SCENARIOS.map((s) => [s.id, s] as const))("%s", (_id, scenario) => {
    const { notifiedAt } = play(scenario);
    const notified = notifiedAt !== null;
    expect(
      notified,
      `${scenario.who}\n  ${scenario.note}\n  expected notify=${scenario.expectNotify}, got ${notified}`,
    ).toBe(scenario.expectNotify);
  });

  it.each(SCENARIOS.filter((s) => s.expectEmail !== undefined).map((s) => [s.id, s] as const))(
    "%s captures the address",
    (_id, scenario) => {
      const { decisions } = play(scenario);
      expect(decisions[decisions.length - 1]?.contact.email).toBe(scenario.expectEmail ?? null);
    },
  );

  it("notifies EVERY serious visitor — a missed lead is the expensive failure", () => {
    const missed = SCENARIOS.filter((s) => s.kind === "serious" && play(s).notifiedAt === null);
    expect(missed.map((s) => s.id)).toEqual([]);
  });

  it("notifies NO bot and NO support request — a false lead trains people to ignore the inbox", () => {
    const noisy = SCENARIOS.filter(
      (s) => (s.kind === "bot" || s.kind === "support") && play(s).notifiedAt !== null,
    );
    expect(noisy.map((s) => s.id)).toEqual([]);
  });

  it("sends at most one notification per conversation", () => {
    for (const scenario of SCENARIOS) {
      const notifications = play(scenario).decisions.filter((d) => d.notify !== "none");
      expect(notifications.length, scenario.id).toBeLessThanOrEqual(1);
    }
  });

  it("tells the visitor whenever it notifies, and stays available", () => {
    for (const scenario of SCENARIOS.filter((s) => s.expectNotify)) {
      const { decisions, notifiedAt } = play(scenario);
      const text = decisions[notifiedAt as number]?.text ?? "";
      expect(text, scenario.id).toContain("rådgiver");
      expect(text, scenario.id).toMatch(/jeg er her|spør gjerne/i);
    }
  });
});

describe("false-action guard, end to end", () => {
  it.each(GUARD_SCENARIOS.map((s) => [s.id, s] as const))("%s", (_id, scenario) => {
    const { decisions } = play(scenario);
    const last = decisions[decisions.length - 1] as TurnDecision;
    expect(last.guardTripped, scenario.note).toBe(Boolean(scenario.expectGuard));
    if (scenario.expectGuard) {
      // The lie must not survive in any form.
      expect(last.text).not.toContain("sender tilbudet nå");
      expect(last.text).toContain("rådgiver");
    }
    if (scenario.expectEmail) expect(last.contact.email).toBe(scenario.expectEmail);
  });
});

/**
 * The calibration check.
 *
 * Not a pass/fail on one number but on the SEPARATION: every serious visitor
 * must clear the bar or trip `needsHuman`, and no bot or support request may
 * clear it. If those two sets ever overlap, no threshold works and the scoring
 * inputs need changing rather than the constant.
 */
describe("SERIOUS_LEAD_SCORE calibration", () => {
  const scored = SCENARIOS.map((s) => {
    const { decisions, notifiedAt } = play(s);
    return {
      id: s.id,
      kind: s.kind,
      // The score at the end of the conversation, which is what the last turn
      // would have been judged on.
      interest: decisions[decisions.length - 1]?.interest ?? 0,
      notified: notifiedAt !== null,
    };
  });

  it("prints the distribution so the threshold is a decision, not a guess", () => {
    const rows = [...scored].sort((a, b) => b.interest - a.interest);
    const table = rows
      .map((r) => `  ${String(r.interest).padStart(3)}  ${r.notified ? "NOTIFY" : "  —   "}  ${r.kind.padEnd(10)} ${r.id}`)
      .join("\n");
    console.info(`\nInterest scores (threshold ${SERIOUS_LEAD_SCORE}):\n${table}\n`);
    expect(rows.length).toBe(SCENARIOS.length);
  });

  it("keeps noise strictly below the bar", () => {
    const noise = scored.filter((r) => r.kind === "bot" || r.kind === "support");
    for (const r of noise) {
      expect(r.interest, `${r.id} scored ${r.interest}`).toBeLessThan(SERIOUS_LEAD_SCORE);
    }
  });

  it("leaves headroom — the bar is not sitting on top of a real conversation", () => {
    // A threshold one point above the highest bot is technically passing and
    // practically fragile. Anything under 10 points of margin is a warning that
    // the inputs, not the constant, need work.
    const highestNoise = Math.max(
      0,
      ...scored.filter((r) => r.kind === "bot" || r.kind === "support").map((r) => r.interest),
    );
    expect(SERIOUS_LEAD_SCORE - highestNoise, `highest noise scored ${highestNoise}`).toBeGreaterThanOrEqual(10);
  });
});
