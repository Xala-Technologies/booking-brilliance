/**
 * Chat degradation — telling the difference between "the assistant answered"
 * and "the assistant was unreachable and the FAQ answered instead".
 *
 * WHY THIS EXISTS
 *
 * `useChatbot` has two paths: call `/api/chat` (the Claude proxy), and if that
 * is unreachable, fall back to local keyword retrieval over `content/faq.ts`.
 * The fallback is genuinely useful — a visitor still gets a correct answer
 * rather than an error. The problem was that nothing, anywhere, said it had
 * happened.
 *
 * On 2026-07-23 the server's ANTHROPIC_API_KEY was removed. `/api/chat` began
 * returning 503 `{"error":"Chat is not configured"}`. Every visitor from that
 * day on got keyword-matched FAQ entries verbatim — fluent, correct Norwegian
 * that looked exactly like a working assistant. It ran that way for 20 days.
 * The lead it cost: a named venue operator asked three times whether Digilist
 * suits a single-venue business, got three canned answers that never addressed
 * it, and escalated to the contact form to ask a human.
 *
 * Two things made it invisible, and both are fixed here:
 *
 *  1. **A 503 does not throw.** `fetch` resolves; `res.ok` is false; the code
 *     fell out of the `try` without entering the `catch`. The `catch` was the
 *     only place that logged, and it logged only under `import.meta.env.DEV`.
 *     So the exact failure that occurred produced no output in ANY environment
 *     — not production, not a developer's console.
 *  2. **Nothing carried the fact downstream.** The inquiry email is the one
 *     artefact a human reads every time. It described the conversation without
 *     saying which system produced it.
 *
 * The rule this encodes: a fallback that nobody can observe is indistinguishable
 * from the primary path working. Degrading is fine. Degrading quietly is not.
 *
 * Pure — no fetch, no React, no DOM. `useChatbot` supplies the inputs.
 */

/** Why the assistant did not answer. Ordered roughly by how actionable it is. */
export type DegradationReason =
  /** The server has no ANTHROPIC_API_KEY — /api/chat answers 503. An operator fix. */
  | "not-configured"
  /** The endpoint answered, but not with a usable reply (4xx/5xx). */
  | "http-error"
  /** The request never completed — offline, DNS, CORS, proxy down. */
  | "network"
  /** HTTP 200 with no `text` field — a contract break between client and server. */
  | "empty-reply";

export interface ChatDegradation {
  reason: DegradationReason;
  /** One line naming the concrete cause, for logs and the lead email. */
  detail: string;
  /** ISO timestamp of the first degraded turn in this conversation. */
  at: string;
}

/** HTTP 503 from `/api/chat` is specifically the missing-key guard in server/index.mjs. */
const NOT_CONFIGURED_STATUS = 503;

/**
 * Classify a completed `/api/chat` response. Returns null when the assistant
 * genuinely answered.
 *
 * `hasText` must be whether the parsed body carried a non-empty `text` — a 200
 * with an empty body is a failure that would otherwise render as the assistant
 * saying nothing.
 */
export function degradationFromResponse(
  status: number,
  hasText: boolean,
  at: string,
): ChatDegradation | null {
  if (status === NOT_CONFIGURED_STATUS) {
    return {
      reason: "not-configured",
      detail:
        "/api/chat returned 503 — the server has no ANTHROPIC_API_KEY, so the assistant is switched off",
      at,
    };
  }
  if (status < 200 || status >= 300) {
    return { reason: "http-error", detail: `/api/chat returned HTTP ${status}`, at };
  }
  if (!hasText) {
    return {
      reason: "empty-reply",
      detail: "/api/chat returned 200 with no text field",
      at,
    };
  }
  return null;
}

/** Classify a thrown request — the path that never reached a response at all. */
export function degradationFromError(err: unknown, at: string): ChatDegradation {
  const message = err instanceof Error ? err.message : String(err);
  return { reason: "network", detail: `/api/chat unreachable — ${message}`, at };
}

/**
 * The line written to the browser console on every degraded turn.
 *
 * Deliberately NOT gated on `import.meta.env.DEV`. The DEV gate is what made the
 * 20-day outage silent: the one environment where it mattered was the one that
 * never logged. A console warning on a marketing site costs nothing.
 */
export function degradationWarning(d: ChatDegradation): string {
  return `[chatbot] DEGRADED — answering from the local FAQ, not the assistant. ${d.detail}`;
}

/**
 * The banner shown at the top of the lead email.
 *
 * Norwegian, because the people reading these leads work in Norwegian, and
 * blunt, because its whole job is to be impossible to skim past. It names the
 * consequence ("the answers came from the FAQ") rather than the mechanism —
 * whoever opens the email at 08:00 needs to know the conversation is suspect,
 * not to debug an HTTP status.
 */
export function degradationEmailBanner(d: ChatDegradation): string {
  return (
    `ADVARSEL: Denne samtalen ble IKKE besvart av assistenten. ` +
    `Svarene kom fra den lokale FAQ-en (nøkkelordsøk), så de er trolig generiske ` +
    `og svarer kanskje ikke på det kunden faktisk spurte om. ` +
    `Les samtaleutdraget kritisk. Teknisk årsak: ${d.detail}`
  );
}

/**
 * Keep the FIRST degradation of a conversation.
 *
 * A conversation that starts degraded and later recovers is still a conversation
 * whose early answers came from the FAQ, and those early answers are the ones
 * that shape whether the visitor keeps typing. Reporting only the latest state
 * would let a recovery erase the evidence.
 */
export function mergeDegradation(
  existing: ChatDegradation | null,
  next: ChatDegradation | null,
): ChatDegradation | null {
  return existing ?? next;
}
