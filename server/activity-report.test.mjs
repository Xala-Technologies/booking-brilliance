/**
 * The report exists to make a broken bot distinguishable from a quiet one, so
 * the tests that matter are the ones about what it says when things are wrong —
 * not the arithmetic on a good day.
 */
import { describe, expect, it } from "vitest";
import { reportHtml, reportSubject, summariseActivity } from "./activity-report.mjs";

const chat = (at, over = {}) => ({
  at: `2026-08-12T${at}:00.000Z`,
  kind: "chat",
  cid: "c1",
  ip: "1.2.3.4",
  turn: "hva koster det?",
  ...over,
});

const turn = (at, over = {}) => ({
  at: `2026-08-12T${at}:00.000Z`,
  kind: "turn",
  cid: "c1",
  notify: "none",
  guard: false,
  interest: 0,
  ...over,
});

describe("summariseActivity", () => {
  it("reports an empty day as empty rather than as zeroes", () => {
    const report = summariseActivity([], "2026-08-12");
    expect(report.empty).toBe(true);
    expect(report.concerns).toEqual([]);
    expect(reportSubject(report)).toBe("[Chat] 2026-08-12 — ingen aktivitet");
    // The wording matters: the mail has to explain why it arrived with nothing
    // in it, or the reader learns to delete it unread and the signal is lost.
    expect(reportHtml(report)).toContain("Ingen skrev til chatboten");
  });

  it("counts conversations by id, not by message", () => {
    const report = summariseActivity(
      [chat("09:00"), chat("09:01"), chat("10:00", { cid: "c2" })],
      "2026-08-12",
    );
    expect(report.conversations).toBe(2);
    expect(report.questions).toBe(3);
  });

  it("falls back to IP for lines written before conversation ids existed", () => {
    const report = summariseActivity(
      [chat("09:00", { cid: undefined }), chat("09:05", { cid: undefined, ip: "9.9.9.9" })],
      "2026-08-12",
    );
    expect(report.conversations).toBe(2);
  });

  it("separates a captured contact from a merely qualified conversation", () => {
    const report = summariseActivity(
      [
        turn("09:00", { notify: "qualified", interest: 18 }),
        turn("09:02", { notify: "lead", interest: 40 }),
        turn("09:03"),
      ],
      "2026-08-12",
    );
    expect(report.qualified).toBe(1);
    expect(report.leads).toBe(1);
    expect(report.peakInterest).toBe(40);
    expect(report.notified.map((n) => n.kind)).toEqual(["qualified", "lead"]);
  });

  it("attaches the emailed summary to the notification it belongs to", () => {
    const report = summariseActivity(
      [
        turn("09:00", { notify: "lead", interest: 30 }),
        {
          at: "2026-08-12T09:00:01.000Z",
          kind: "inquiry",
          summary: "Privat utleier · Grand · Demo",
        },
      ],
      "2026-08-12",
    );
    expect(report.notified[0]?.summary).toBe("Privat utleier · Grand · Demo");
    expect(report.inquiries).toBe(1);
  });

  it("orders events by time even when the log is written out of order", () => {
    const report = summariseActivity([chat("11:00"), chat("09:00", { turn: "først" })], "2026-08-12");
    expect(report.questionsAsked[0]?.text).toBe("først");
  });

  it("drops empty questions rather than listing blank bullets", () => {
    const report = summariseActivity([chat("09:00", { turn: "   " })], "2026-08-12");
    expect(report.questionsAsked).toEqual([]);
    expect(report.questions).toBe(1);
  });
});

describe("concerns — the part a human acts on", () => {
  it("names degraded turns, because a silent outage is the failure this replaces", () => {
    const report = summariseActivity(
      [turn("09:00", { degraded: "http-503" }), turn("09:01")],
      "2026-08-12",
    );
    expect(report.degraded).toBe(1);
    expect(report.concerns.join(" ")).toContain("reservefunksjonen");
  });

  it("escalates when degradation is most of the day, not just present", () => {
    const report = summariseActivity(
      [turn("09:00", { degraded: "http-503" }), turn("09:01", { degraded: "http-503" })],
      "2026-08-12",
    );
    expect(report.concerns.some((c) => c.includes("/api/chat"))).toBe(true);
  });

  it("does not raise the share alarm on a mostly-healthy day", () => {
    const events = [turn("09:00", { degraded: "http-503" }), ...Array.from({ length: 9 }, (_, i) => turn(`10:0${i}`))];
    const report = summariseActivity(events, "2026-08-12");
    expect(report.concerns.some((c) => c.includes("/api/chat"))).toBe(false);
  });

  it("reports suppressed replies with the rule that suppressed them", () => {
    const report = summariseActivity(
      [
        turn("09:00", { guard: true, rules: ["false-action"] }),
        turn("09:05", { guard: true, rules: ["false-action", "invented-link"] }),
      ],
      "2026-08-12",
    );
    expect(report.blocked).toBe(2);
    expect(report.blockedByRule).toEqual([
      { rule: "false-action", count: 2 },
      { rule: "invented-link", count: 1 },
    ]);
  });

  it("flags a busy day that told nobody anything", () => {
    const events = Array.from({ length: 10 }, (_, i) => chat(`09:0${i}`, { cid: `c${i}` }));
    const report = summariseActivity([...events, turn("09:30")], "2026-08-12");
    expect(report.concerns.some((c) => c.includes("ingen varsler"))).toBe(true);
  });

  it("stays quiet about a quiet day with no notifications", () => {
    const report = summariseActivity([chat("09:00"), turn("09:00")], "2026-08-12");
    expect(report.concerns).toEqual([]);
  });

  it("flags questions that produced no reported answer at all", () => {
    // The shape of a bot that is answering nobody, or of a beacon blocked by an
    // ad blocker. Either way a human should know rather than read "5 questions"
    // and assume five answers.
    const report = summariseActivity([chat("09:00"), chat("09:01")], "2026-08-12");
    expect(report.concerns.some((c) => c.includes("ingen svar"))).toBe(true);
  });
});

describe("rendering", () => {
  it("marks a subject with concerns so it stands out in the inbox", () => {
    const clean = summariseActivity([chat("09:00"), turn("09:00", { notify: "lead" })], "2026-08-12");
    expect(reportSubject(clean).startsWith("[Chat]")).toBe(true);
    expect(reportSubject(clean)).toContain("1 lead");

    const bad = summariseActivity([chat("09:00"), turn("09:00", { degraded: "http-503" })], "2026-08-12");
    expect(reportSubject(bad).startsWith("[!] ")).toBe(true);
  });

  it("names qualified conversations in the subject even without a lead", () => {
    const report = summariseActivity([chat("09:00"), turn("09:00", { notify: "qualified" })], "2026-08-12");
    expect(reportSubject(report)).toContain("1 kvalifisert");
  });

  it("escapes visitor text — the questions are untrusted input in an HTML mail", () => {
    const report = summariseActivity(
      [chat("09:00", { turn: '<img src=x onerror="alert(1)"> & "quoted"' })],
      "2026-08-12",
    );
    const html = reportHtml(report);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
  });

  it("renders every section when there is something to put in it", () => {
    const report = summariseActivity(
      [
        chat("09:00"),
        turn("09:00", { notify: "lead", interest: 30, guard: true, rules: ["false-action"] }),
      ],
      "2026-08-12",
    );
    const html = reportHtml(report);
    expect(html).toContain("Varslet");
    expect(html).toContain("Stoppede svar");
    expect(html).toContain("Spørsmål");
    expect(html).toContain("Verdt å se på");
  });

  it("omits empty sections instead of printing bare headings", () => {
    const html = reportHtml(summariseActivity([turn("09:00")], "2026-08-12"));
    expect(html).not.toContain("Varslet");
    expect(html).not.toContain("Verdt å se på");
  });

  it("survives a timestamp it cannot parse rather than printing undefined", () => {
    const report = summariseActivity([chat("09:00", { at: "" })], "2026-08-12");
    expect(reportHtml(report)).toContain("--:--");
  });
});
