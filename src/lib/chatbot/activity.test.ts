import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ACTIVITY_ENDPOINT,
  beaconFromDecision,
  beaconFromDegradation,
  reportTurn,
} from "./activity";

const decision = {
  interest: 22,
  notify: "qualified" as const,
  guardTripped: true,
  violations: [
    { rule: "false-action", severity: "block" as const, detail: "" },
    { rule: "too-long", severity: "warn" as const, detail: "" },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("beacon payloads", () => {
  it("carries the decision and no message text", () => {
    const beacon = beaconFromDecision("c1", 3, decision);
    expect(beacon).toEqual({
      cid: "c1",
      turns: 3,
      interest: 22,
      notify: "qualified",
      guard: true,
      rules: ["false-action", "too-long"],
      degraded: "",
    });
    // The point of the rule, stated as a test: no free text may ride along.
    expect(JSON.stringify(beacon)).not.toMatch(/[æøå]|\s\w+\s\w+\s\w+\s/);
  });

  it("reports a degraded turn so an outage is countable, not invisible", () => {
    expect(beaconFromDegradation("c1", 2, "http-503")).toMatchObject({
      degraded: "http-503",
      notify: "none",
      guard: false,
    });
  });
});

describe("reportTurn", () => {
  it("prefers sendBeacon, which survives the tab closing", () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal("navigator", { sendBeacon });
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    expect(reportTurn(beaconFromDecision("c1", 1, decision))).toBe(true);
    expect(sendBeacon).toHaveBeenCalledWith(ACTIVITY_ENDPOINT, expect.any(Blob));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back to keepalive fetch when sendBeacon refuses the payload", () => {
    vi.stubGlobal("navigator", { sendBeacon: () => false });
    const fetchSpy = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    vi.stubGlobal("fetch", fetchSpy);

    expect(reportTurn(beaconFromDecision("c1", 1, decision))).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      ACTIVITY_ENDPOINT,
      expect.objectContaining({ keepalive: true }),
    );
  });

  it("falls back when the browser has no sendBeacon at all", () => {
    vi.stubGlobal("navigator", {});
    const fetchSpy = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    vi.stubGlobal("fetch", fetchSpy);
    expect(reportTurn(beaconFromDecision("c1", 1, decision))).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("swallows a rejected fetch — a metric must never surface as an error", async () => {
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    expect(() => reportTurn(beaconFromDecision("c1", 1, decision))).not.toThrow();
    // Give the rejected promise a tick to become unhandled if it were going to.
    await new Promise((r) => setTimeout(r, 0));
  });

  it("swallows a throwing sendBeacon rather than breaking the reply", () => {
    vi.stubGlobal("navigator", {
      sendBeacon: () => {
        throw new Error("blocked by extension");
      },
    });
    vi.stubGlobal("fetch", vi.fn());
    expect(reportTurn(beaconFromDecision("c1", 1, decision))).toBe(false);
  });

  it("reports failure when the environment offers no transport", () => {
    vi.stubGlobal("navigator", undefined);
    vi.stubGlobal("fetch", undefined);
    expect(reportTurn(beaconFromDecision("c1", 1, decision))).toBe(false);
  });
});
