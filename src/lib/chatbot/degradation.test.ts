import { describe, expect, it } from "vitest";
import {
  degradationEmailBanner,
  degradationFromError,
  degradationFromResponse,
  degradationWarning,
  mergeDegradation,
} from "./degradation";

const AT = "2026-08-12T11:35:09.290Z";

describe("degradationFromResponse", () => {
  /**
   * The exact production failure. A 503 does not throw, so the old code fell
   * out of the try without entering the catch — and the catch was the only
   * place that logged. This is the case that ran silently for 20 days.
   */
  it("flags the 503 missing-key guard as not-configured", () => {
    const d = degradationFromResponse(503, false, AT);
    expect(d).toEqual({
      reason: "not-configured",
      detail:
        "/api/chat returned 503 — the server has no ANTHROPIC_API_KEY, so the assistant is switched off",
      at: AT,
    });
  });

  it.each([400, 401, 429, 500, 502])("flags HTTP %i as http-error", (status) => {
    const d = degradationFromResponse(status, false, AT);
    expect(d?.reason).toBe("http-error");
    expect(d?.detail).toContain(String(status));
  });

  // A 200 whose body has no `text` would otherwise render as the assistant
  // replying with nothing — a success by every check the old code made.
  it("flags a 200 with no text as empty-reply", () => {
    expect(degradationFromResponse(200, false, AT)?.reason).toBe("empty-reply");
  });

  it("returns null when the assistant actually answered", () => {
    expect(degradationFromResponse(200, true, AT)).toBeNull();
  });

  it("treats the whole 2xx range as success when text is present", () => {
    for (const status of [200, 201, 204, 299]) {
      expect(degradationFromResponse(status, true, AT)).toBeNull();
    }
  });
});

describe("degradationFromError", () => {
  it("classifies a thrown request as network and keeps the message", () => {
    const d = degradationFromError(new Error("Failed to fetch"), AT);
    expect(d.reason).toBe("network");
    expect(d.detail).toContain("Failed to fetch");
    expect(d.at).toBe(AT);
  });

  it("stringifies a non-Error throw rather than dropping it", () => {
    expect(degradationFromError("boom", AT).detail).toContain("boom");
  });
});

describe("operator-facing messages", () => {
  /**
   * The DEV gate is the bug, restated: the one environment where this mattered
   * was the only one that never logged. This pins that the warning text is
   * produced unconditionally — the caller must not re-introduce a gate.
   */
  it("names the consequence before the cause", () => {
    const w = degradationWarning(degradationFromResponse(503, false, AT)!);
    expect(w).toContain("DEGRADED");
    expect(w).toContain("answering from the local FAQ, not the assistant");
    expect(w).toContain("ANTHROPIC_API_KEY");
  });

  // The email banner is the artefact a human reads every time a lead arrives.
  // It has to say the answers are suspect, not just that a service is down.
  it("warns in Norwegian that the answers came from the FAQ", () => {
    const b = degradationEmailBanner(degradationFromResponse(503, false, AT)!);
    expect(b).toContain("ADVARSEL");
    expect(b).toContain("IKKE besvart av assistenten");
    expect(b).toContain("FAQ");
    expect(b).toContain("Les samtaleutdraget kritisk");
    expect(b).toContain("ANTHROPIC_API_KEY"); // the technical cause is carried too
  });
});

describe("mergeDegradation", () => {
  const first = degradationFromResponse(503, false, AT)!;
  const later = degradationFromError(new Error("offline"), "2026-08-12T11:40:00.000Z");

  /**
   * A conversation that degrades and then recovers still had FAQ answers at the
   * start — and the start is what decides whether the visitor keeps typing.
   * Letting a later success overwrite the record would erase the evidence.
   */
  it("keeps the FIRST degradation, so a recovery cannot erase it", () => {
    expect(mergeDegradation(first, null)).toBe(first);
    expect(mergeDegradation(first, later)).toBe(first);
  });

  it("records the first degradation when the conversation started healthy", () => {
    expect(mergeDegradation(null, later)).toBe(later);
  });

  it("stays null while nothing has gone wrong", () => {
    expect(mergeDegradation(null, null)).toBeNull();
  });
});
