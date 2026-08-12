/**
 * Turns a day of chatbot activity into something a person reads in ten seconds.
 *
 * The reason this exists is narrower than "reporting". Until now nothing about
 * the bot was persisted: a conversation that produced no lead left no trace, so
 * a quiet Sunday and a bot that had been throwing 503s for a week produced the
 * same evidence — nothing. That is the failure this project keeps paying for,
 * and the fix is not a dashboard but a mail that arrives every day, including
 * on the days it has nothing to say. **An empty report is the point**, not an
 * edge case: silence from a reporter that always speaks is itself a signal.
 *
 * Everything here is pure. The reading of the log and the sending of the mail
 * live in `daily-report.mjs`, so the summarising can be tested against
 * hand-written days without a file, a network, or a mail provider.
 */

/**
 * One line of the server's activity log.
 *
 * @typedef  {object} ActivityEvent
 * @property {string} at    ISO timestamp the server stamped on arrival.
 * @property {"chat"|"turn"|"inquiry"} kind
 *   `chat` — a question reached the bot. Logged BEFORE the model call, so a
 *   turn that crashed still counts; a log written only on success reports a
 *   healthy day for a broken one.
 *   `turn` — the browser's account of what it did with the answer.
 *   `inquiry` — something was actually emailed to Digilist.
 * @property {string} [cid]      Conversation id, joining a `chat` to its `turn`.
 * @property {string} [ip]
 * @property {string} [turn]     `chat`: what the visitor asked, server-truncated.
 * @property {number} [turns]    How many messages deep the conversation was.
 * @property {number} [interest] `turn`: the assistant's read of the visitor, 0-100.
 * @property {"none"|"lead"|"qualified"} [notify] `turn`: whether a human was told.
 * @property {boolean} [guard]   `turn`: whether the guardrails suppressed the reply.
 * @property {string[]} [rules]  `turn`: which rules fired.
 * @property {string} [degraded] `turn`: the degradation code, when /api/chat misbehaved.
 * @property {string} [source]   `inquiry` only.
 * @property {string} [topic]
 * @property {string} [email]
 * @property {string} [summary]
 */

/**
 * @typedef  {object} ActivityReport
 * @property {string}  date          The day reported, `YYYY-MM-DD`.
 * @property {boolean} empty         Nothing happened at all. Drives the "no activity" mail.
 * @property {number}  conversations Distinct conversations.
 * @property {number}  questions     Total questions asked.
 * @property {number}  leads         Conversations that handed over contact details.
 * @property {number}  qualified     Conversations judged worth a human's time.
 * @property {number}  inquiries     Emails that actually reached Digilist.
 * @property {number}  blocked       Replies the guardrails suppressed.
 * @property {Array<{rule: string, count: number}>} blockedByRule
 * @property {number}  degraded      Turns where /api/chat was degraded — the outage signal.
 * @property {number}  peakInterest  Highest score seen, so a near-miss is visible.
 * @property {Array<{at: string, text: string}>} questionsAsked
 * @property {Array<{at: string, kind: "lead"|"qualified", interest: number, summary: string}>} notified
 * @property {string[]} concerns     Things worth attention, in plain words. Empty on a clean day.
 */

/**
 * Above this share of degraded turns the problem is the endpoint, not a blip.
 * One bad turn in a hundred is the internet; one in four is an outage.
 */
const DEGRADED_SHARE_ALARM = 0.25;

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const k = key(item);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([rule, count]) => ({ rule, count }))
    .sort((a, b) => b.count - a.count || a.rule.localeCompare(b.rule));
}

/** Summarise one day. `events` may be in any order and may be empty. */
export function summariseActivity(events, date) {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));
  const chats = sorted.filter((e) => e.kind === "chat");
  const turns = sorted.filter((e) => e.kind === "turn");
  const inquiries = sorted.filter((e) => e.kind === "inquiry");

  // A conversation is a cid. Lines predating the cid fall back to the IP, which
  // over-merges two visitors behind one NAT but never invents traffic — the
  // safe direction for a number a human will act on.
  const ids = new Set(chats.map((e) => e.cid || `ip:${e.ip ?? "?"}`));

  const notifying = turns.filter((e) => e.notify === "lead" || e.notify === "qualified");
  const blockedTurns = turns.filter((e) => e.guard === true);
  const degradedTurns = turns.filter((e) => Boolean(e.degraded));

  const concerns = [];
  if (degradedTurns.length) {
    concerns.push(
      `${degradedTurns.length} svar kom fra reservefunksjonen — chat-endepunktet svarte ikke normalt.`,
    );
  }
  if (turns.length && degradedTurns.length / turns.length >= DEGRADED_SHARE_ALARM) {
    concerns.push("Over en fjerdedel av svarene var degraderte. Sjekk /api/chat.");
  }
  if (blockedTurns.length) {
    concerns.push(
      `${blockedTurns.length} svar ble stoppet av sikkerhetsreglene før de nådde besøkende.`,
    );
  }
  // A day full of conversation that told nobody anything is not automatically
  // wrong — most visitors are browsing — but it is the shape a broken
  // notification path also takes, so it gets said out loud rather than assumed.
  if (chats.length >= 10 && notifying.length === 0) {
    concerns.push(
      `${chats.length} spørsmål, ingen varsler. Verdt en titt hvis noen av dem så seriøse ut.`,
    );
  }
  if (chats.length && turns.length === 0) {
    concerns.push(
      "Spørsmål kom inn, men nettleseren rapporterte ingen svar. Enten er beacon-en blokkert, eller så feilet svarene.",
    );
  }

  return {
    date,
    empty: sorted.length === 0,
    conversations: ids.size,
    questions: chats.length,
    leads: turns.filter((e) => e.notify === "lead").length,
    qualified: turns.filter((e) => e.notify === "qualified").length,
    inquiries: inquiries.length,
    blocked: blockedTurns.length,
    blockedByRule: countBy(
      blockedTurns.flatMap((e) => e.rules ?? []),
      (rule) => rule,
    ),
    degraded: degradedTurns.length,
    peakInterest: turns.reduce((max, e) => Math.max(max, e.interest ?? 0), 0),
    questionsAsked: chats
      .filter((e) => (e.turn ?? "").trim().length > 0)
      .map((e) => ({ at: e.at, text: (e.turn ?? "").trim() })),
    notified: notifying.map((e) => ({
      at: e.at,
      kind: e.notify,
      interest: e.interest ?? 0,
      summary:
        inquiries.find((i) => i.at >= e.at)?.summary ??
        (e.notify === "lead" ? "kontaktinfo oppgitt i chatten" : "kvalifisert samtale"),
    })),
    concerns,
  };
}

/**
 * The subject line, which is the only part most days get read.
 *
 * It leads with what a person would act on. A clean day says so plainly rather
 * than dressing itself up, because the day this mail matters most is the day
 * its subject is boring and the reader notices it arrived at all.
 */
export function reportSubject(report) {
  if (report.empty) return `[Chat] ${report.date} — ingen aktivitet`;
  const parts = [];
  if (report.leads) parts.push(`${report.leads} lead`);
  if (report.qualified) parts.push(`${report.qualified} kvalifisert`);
  parts.push(`${report.questions} spørsmål`);
  const flag = report.concerns.length ? "[!] " : "";
  return `${flag}[Chat] ${report.date} — ${parts.join(", ")}`;
}

function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const clock = (at) => (at.slice(11, 16) || "--:--");

/** The mail body. Plain HTML — it is read in an inbox, not a browser. */
export function reportHtml(report) {
  if (report.empty) {
    return `
      <h2 style="margin:0 0 8px;font:600 16px system-ui">Ingen aktivitet ${esc(report.date)}</h2>
      <p style="margin:0;font:14px/1.6 system-ui;color:#444">
        Ingen skrev til chatboten i dag. Denne e-posten kommer uansett, slik at en
        stille dag ser annerledes ut enn en dag der rapporten uteble.
      </p>`;
  }

  const row = (label, value) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#666">${esc(label)}</td>
         <td style="padding:4px 0;font-variant-numeric:tabular-nums;font-weight:600">${value}</td></tr>`;

  const concerns = report.concerns.length
    ? `<div style="margin:16px 0;padding:12px 14px;background:#fff6ed;border-left:3px solid #c2703a">
         <div style="font:600 13px system-ui;margin-bottom:6px">Verdt å se på</div>
         <ul style="margin:0;padding-left:18px;font:14px/1.6 system-ui;color:#333">
           ${report.concerns.map((c) => `<li>${esc(c)}</li>`).join("")}
         </ul>
       </div>`
    : "";

  const notified = report.notified.length
    ? `<h3 style="margin:24px 0 8px;font:600 14px system-ui">Varslet</h3>
       <ul style="margin:0;padding-left:18px;font:14px/1.6 system-ui">
         ${report.notified
           .map(
             (n) =>
               `<li><strong>${clock(n.at)}</strong> · ${n.kind === "lead" ? "kontaktinfo" : "kvalifisert"} · score ${n.interest} — ${esc(n.summary)}</li>`,
           )
           .join("")}
       </ul>`
    : "";

  const blocked = report.blockedByRule.length
    ? `<h3 style="margin:24px 0 8px;font:600 14px system-ui">Stoppede svar</h3>
       <ul style="margin:0;padding-left:18px;font:14px/1.6 system-ui">
         ${report.blockedByRule.map((b) => `<li>${esc(b.rule)} — ${b.count}</li>`).join("")}
       </ul>`
    : "";

  const asked = report.questionsAsked.length
    ? `<h3 style="margin:24px 0 8px;font:600 14px system-ui">Spørsmål</h3>
       <ol style="margin:0;padding-left:20px;font:13px/1.7 system-ui;color:#333">
         ${report.questionsAsked
           .map((q) => `<li><span style="color:#888">${clock(q.at)}</span> ${esc(q.text)}</li>`)
           .join("")}
       </ol>`
    : "";

  return `
    <h2 style="margin:0 0 12px;font:600 16px system-ui">Chatbot ${esc(report.date)}</h2>
    <table style="border-collapse:collapse;font:14px system-ui">
      ${row("Samtaler", report.conversations)}
      ${row("Spørsmål", report.questions)}
      ${row("Leads (kontaktinfo)", report.leads)}
      ${row("Kvalifiserte samtaler", report.qualified)}
      ${row("E-poster sendt", report.inquiries)}
      ${row("Stoppede svar", report.blocked)}
      ${row("Degraderte svar", report.degraded)}
      ${row("Høyeste interessescore", report.peakInterest)}
    </table>
    ${concerns}${notified}${blocked}${asked}`;
}

/**
 * Which log files to delete, given the filenames present and today's date.
 *
 * Visitor questions are personal data. The moment they are written to disk they
 * need an end date, and "we will clean it up later" is how a marketing site ends
 * up holding two years of what people typed into a chat box. Kept separate and
 * pure so the rule can be tested without a filesystem — a deletion routine you
 * cannot test is one you will be afraid to run.
 *
 * Anything that does not look like a dated log is left alone. Deleting a file
 * you did not recognise is never the safe move.
 *
 * @param {string[]} filenames  Directory listing.
 * @param {string}   today      `YYYY-MM-DD`.
 * @param {number}   keepDays   How many days back to keep, inclusive of today.
 * @returns {string[]} Filenames safe to delete, oldest first.
 */
export function expiredLogs(filenames, today, keepDays) {
  const cutoff = new Date(`${today}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - (keepDays - 1));
  const oldest = cutoff.toISOString().slice(0, 10);
  return filenames
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(name))
    .filter((name) => name.slice(0, 10) < oldest)
    .sort();
}
