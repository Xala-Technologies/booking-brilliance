/**
 * Tells the server what the browser decided about a turn.
 *
 * `/api/chat` already records that a question arrived. It cannot record what
 * happened next, because everything that matters — the guardrail verdict, the
 * interest score, whether a human was told — is decided in `decideTurn` after
 * the response comes back. Without this, the daily report can only count
 * messages, which is attendance rather than activity.
 *
 * Three constraints shape it:
 *
 * - **It must never delay or break a reply.** Fire-and-forget, and every
 *   failure is swallowed. A visitor's answer is not worth risking for a metric.
 * - **It must survive the tab closing.** The last turn of a conversation is
 *   often the one where someone types an address and leaves, so it uses
 *   `sendBeacon`, which the browser delivers after unload. `fetch` would be
 *   cancelled exactly on the turns worth knowing about.
 * - **It carries no message text.** The visitor's own words are already logged
 *   server-side by `/api/chat`; sending them twice would only widen the
 *   surface holding personal data.
 */
import type { TurnDecision } from "./turn";

export interface TurnBeacon {
  /** Conversation id, so the server can join this to the question it answers. */
  cid: string;
  /** How many messages deep the conversation was. */
  turns: number;
  /** The assistant's read of the visitor, 0-100. */
  interest: number;
  notify: "none" | "lead" | "qualified";
  /** Whether the guardrails suppressed the reply. */
  guard: boolean;
  /** Which rules fired — blocking and warning both, so trends are visible. */
  rules: string[];
  /** The degradation code when the endpoint misbehaved, else "". */
  degraded: string;
}

export const ACTIVITY_ENDPOINT = "/api/activity";

export function beaconFromDecision(
  cid: string,
  turnCount: number,
  decision: Pick<TurnDecision, "interest" | "notify" | "guardTripped" | "violations">,
): TurnBeacon {
  return {
    cid,
    turns: turnCount,
    interest: decision.interest,
    notify: decision.notify,
    guard: decision.guardTripped,
    rules: decision.violations.map((v) => v.rule),
    degraded: "",
  };
}

/** A turn that never got a usable answer. Reported so an outage is countable. */
export function beaconFromDegradation(cid: string, turnCount: number, code: string): TurnBeacon {
  return { cid, turns: turnCount, interest: 0, notify: "none", guard: false, rules: [], degraded: code };
}

/**
 * Send it. Returns whether it was handed off, for tests — nothing acts on it,
 * because a caller that reacted to a failed beacon would be exactly the coupling
 * this is meant to avoid.
 */
export function reportTurn(beacon: TurnBeacon): boolean {
  const body = JSON.stringify(beacon);
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      // Typed as JSON so the server's readJson accepts it. `sendBeacon` returns
      // false when the payload is over the browser's queue limit; a beacon this
      // small never is, but the fetch fallback covers it anyway.
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ACTIVITY_ENDPOINT, blob)) return true;
    }
    if (typeof fetch === "function") {
      void fetch(ACTIVITY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
      return true;
    }
  } catch {
    // Observability is never worth an exception in the reply path.
  }
  return false;
}
