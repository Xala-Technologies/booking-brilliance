/**
 * Emails one day of chatbot activity, every day, whether or not there was any.
 *
 *   node daily-report.mjs                 # yesterday
 *   node daily-report.mjs --date 2026-08-11
 *   node daily-report.mjs --dry-run       # print the mail, send nothing
 *
 * Runs on the VPS under a systemd timer, as loose files with bare `node` — the
 * same shape as index.mjs, so it has no dependencies and no build step.
 *
 * Two decisions worth defending:
 *
 * **It sends on empty days.** That is the whole point. Before this, a day with
 * no leads produced no evidence of any kind, so a quiet Sunday and a bot that
 * had been answering 503s for a week looked identical from the outside. A
 * reporter that only speaks when it has news teaches you nothing from silence.
 *
 * **It exits non-zero when the mail fails.** systemd then marks the unit failed,
 * which is visible. Swallowing a send failure would leave the one mechanism that
 * proves the bot is alive quietly dead — the exact failure it exists to catch.
 */
import { readFileSync, readdirSync, unlinkSync } from "node:fs";
import { expiredLogs, reportHtml, reportSubject, summariseActivity } from "./activity-report.mjs";

const ACTIVITY_DIR = process.env.CHAT_ACTIVITY_DIR || "/var/www/digilist-activity";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const MAIL_FROM = process.env.MAIL_FROM || "Digilist <onboarding@resend.dev>";
const NOTIFY_TO = process.env.NOTIFY_TO || "post@digilist.no";
// Visitor questions are personal data with no reason to outlive the report
// that summarised them. Four weeks is enough to look back at a bad week.
const KEEP_DAYS = Number(process.env.CHAT_ACTIVITY_KEEP_DAYS || 28);
const NOTIFY_CC = (process.env.NOTIFY_CC || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function safeList() {
  try {
    return readdirSync(ACTIVITY_DIR);
  } catch {
    return [];
  }
}

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

/** Yesterday in UTC — the report runs after midnight for the day just ended. */
function yesterday() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Read one day's log.
 *
 * A missing file means no activity, which is a real answer and must not be an
 * error — the first day this ever runs, the file will not exist. A malformed
 * line is skipped rather than fatal: a half-written line from a crash must not
 * cost the whole day's report.
 */
function readDay(date) {
  let raw;
  try {
    raw = readFileSync(`${ACTIVITY_DIR}/${date}.jsonl`, "utf8");
  } catch {
    return [];
  }
  const events = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      // Skipped, not fatal.
    }
  }
  return events;
}

async function send(subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: MAIL_FROM, to: [NOTIFY_TO], cc: NOTIFY_CC, subject, html }),
  });
  // Checked, because the identical unchecked call in index.mjs silently
  // disarmed chat notifications for a day.
  if (!res.ok) throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Delete logs past the retention window. Never fatal — the mail matters more. */
function prune(today) {
  let names;
  try {
    names = readdirSync(ACTIVITY_DIR);
  } catch {
    return [];
  }
  const gone = [];
  for (const name of expiredLogs(names, today, KEEP_DAYS)) {
    try {
      unlinkSync(`${ACTIVITY_DIR}/${name}`);
      gone.push(name);
    } catch (e) {
      console.error(`could not delete ${name}:`, e?.message || e);
    }
  }
  return gone;
}

async function main() {
  const date = arg("--date") || yesterday();
  const report = summariseActivity(readDay(date), date);
  const subject = reportSubject(report);
  const html = reportHtml(report);

  if (process.argv.includes("--dry-run")) {
    console.log(subject);
    console.log(html);
    console.log(`would delete: ${expiredLogs(safeList(), new Date().toISOString().slice(0, 10), KEEP_DAYS).join(", ") || "nothing"}`);
    return;
  }
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set — cannot send the daily report");

  await send(subject, html);
  console.log(`sent: ${subject}`);

  // After the send, never before: a prune that ran first and then failed to
  // mail would destroy the day it was meant to report on.
  const gone = prune(new Date().toISOString().slice(0, 10));
  if (gone.length) console.log(`pruned ${gone.length} log(s) past ${KEEP_DAYS} days: ${gone.join(", ")}`);
}

main().catch((e) => {
  console.error("daily-report failed:", e?.message || e);
  process.exit(1);
});
