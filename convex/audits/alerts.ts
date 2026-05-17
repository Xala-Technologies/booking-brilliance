/**
 * Regression alerting — "don't slip".
 *
 * Pattern:
 *   1. detectRegressions (mutation) compares the latest audit_run for
 *      each (target, audit_type) with the run before it. Three signals:
 *         - score-drop:    avg_score fell by ≥ SCORE_DROP_THRESHOLD pts
 *         - new-error:     an error-severity finding appeared this run
 *                          that wasn't in the previous run for the same
 *                          (target, audit_type, rule)
 *         - uptime-down:   audit_type === "uptime" AND avg_score < 50
 *      Each match creates or updates an alert row (deduped by
 *      fingerprint). Resolved alerts are reopened if the signal returns.
 *
 *   2. notifyAlerts (action) reads recently-opened alerts that haven't
 *      been routed yet and fans them out to whichever sinks are configured
 *      via Convex env vars:
 *        - SLACK_WEBHOOK_URL  → POST to Slack incoming-webhook
 *        - RESEND_API_KEY     → email via Resend
 *        - GITHUB_TOKEN + GITHUB_ISSUE_REPO → open a GitHub issue
 *      Each sink that succeeds is appended to `notified_sinks` so we
 *      never double-send.
 *
 *   3. resolveAlerts (mutation) closes alerts whose underlying finding
 *      / score-drop no longer triggers in the latest run.
 *
 * Called from:
 *   - convex/audits/runs.ts:finishRun (after every run completes)
 *   - convex/audits/performance.ts (after each PSI scan)
 *   - tools/site-intelligence/src/run-performance.ts (manual triggers)
 */
import { v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { api } from "../_generated/api";
import { requireAdmin } from "../auth";

const SCORE_DROP_THRESHOLD = 15; // points
const ALERT_KIND = {
  scoreDrop: "score-drop",
  newError: "new-error",
  uptimeDown: "uptime-down",
} as const;

const AUDIT_LABEL_NO: Record<string, string> = {
  uptime: "Oppetid",
  seo: "SEO",
  a11y: "Tilgjengelighet",
  security: "Sikkerhet",
  links: "Lenker",
  performance: "Ytelse (mobil)",
  performance_desktop: "Ytelse (desktop)",
};
function auditTypeLabel(t: string): string {
  return AUDIT_LABEL_NO[t] ?? t;
}

interface AlertSeed {
  kind: string;
  surface: string;
  audit_type: string;
  rule?: string;
  severity: "error" | "warn";
  title: string;
  detail: string;
  fingerprint: string;
}

const ISO = () => new Date().toISOString();

/**
 * Walks every (target, audit_type) and compares the latest 2 finished
 * runs to detect regressions. Returns the alerts it opened/updated so
 * the calling action can fan them out to notification sinks.
 */
export const detectRegressions = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    // Pull the 200 most recent runs — enough to have at least 2 per
    // (target, audit_type) pair for our small surface count.
    const runs = await ctx.db
      .query("audit_runs")
      .withIndex("by_started")
      .order("desc")
      .take(400);

    // Group by (target_id, audit_type), keep newest two of each.
    const groups = new Map<
      string,
      Array<typeof runs[number]>
    >();
    for (const r of runs) {
      if (r.status === "running") continue;
      const key = `${r.target_id}::${r.audit_type}`;
      const arr = groups.get(key) ?? [];
      if (arr.length < 2) {
        arr.push(r);
        groups.set(key, arr);
      }
    }

    const targets = await ctx.db.query("audit_targets").collect();
    const targetById = new Map(targets.map((t) => [t._id, t]));
    const seeds: AlertSeed[] = [];

    for (const [, [latest, previous]] of groups) {
      if (!latest) continue;
      const target = targetById.get(latest.target_id);
      if (!target) continue;
      const surface = target.name;
      const auditType = latest.audit_type;

      // Signal 1 — score drop ≥ threshold
      if (previous && previous.avg_score > 0) {
        const drop = previous.avg_score - latest.avg_score;
        if (drop >= SCORE_DROP_THRESHOLD) {
          seeds.push({
            kind: ALERT_KIND.scoreDrop,
            surface,
            audit_type: auditType,
            severity: drop >= 30 ? "error" : "warn",
            title: `${target.label}: ${auditTypeLabel(auditType)}-poeng falt ${drop.toFixed(0)} poeng`,
            detail: `Tidligere: ${previous.avg_score.toFixed(0)} → Nå: ${latest.avg_score.toFixed(0)} (${ISO().slice(0, 10)})`,
            fingerprint: `score-drop::${surface}::${auditType}`,
          });
        }
      }

      // Signal 2 — uptime down (special-cased because uptime is binary)
      if (auditType === "uptime" && latest.avg_score < 50) {
        seeds.push({
          kind: ALERT_KIND.uptimeDown,
          surface,
          audit_type: auditType,
          severity: "error",
          title: `${target.label} er nede`,
          detail: `Oppetidsskanning ga score ${latest.avg_score.toFixed(0)} kl. ${new Date(latest.started_at).toLocaleString("nb-NO")}`,
          fingerprint: `uptime-down::${surface}`,
        });
      }

      // Signal 3 — new error findings (set difference)
      const latestFindings = await ctx.db
        .query("audit_findings")
        .withIndex("by_run", (q) => q.eq("run_id", latest._id))
        .collect();
      const previousFindings = previous
        ? await ctx.db
            .query("audit_findings")
            .withIndex("by_run", (q) => q.eq("run_id", previous._id))
            .collect()
        : [];
      const prevRuleSet = new Set(
        previousFindings.filter((f) => f.severity === "error").map((f) => f.rule),
      );
      const newErrors = latestFindings.filter(
        (f) => f.severity === "error" && !prevRuleSet.has(f.rule),
      );
      // Group by rule, take one alert per rule per (target, audit_type)
      const byRule = new Map<string, typeof newErrors[number]>();
      for (const f of newErrors) {
        if (!byRule.has(f.rule)) byRule.set(f.rule, f);
      }
      for (const [rule, sample] of byRule) {
        seeds.push({
          kind: ALERT_KIND.newError,
          surface,
          audit_type: auditType,
          rule,
          severity: "error",
          title: `${target.label}: ny ${auditTypeLabel(auditType)}-feil · ${rule}`,
          detail: sample.message.slice(0, 400),
          fingerprint: `new-error::${surface}::${auditType}::${rule}`,
        });
      }
    }

    // Upsert seeds into alerts table.
    const opened: string[] = [];
    const now = ISO();
    for (const seed of seeds) {
      const existing = await ctx.db
        .query("alerts")
        .withIndex("by_fingerprint", (q) =>
          q.eq("fingerprint", seed.fingerprint),
        )
        .first();
      if (existing) {
        // Already open and active — just bump count + last_seen.
        if (existing.resolved_at) {
          // Reopened after being resolved → notify again
          await ctx.db.patch(existing._id, {
            resolved_at: null,
            last_seen_at: now,
            occurrence_count: existing.occurrence_count + 1,
            notified_sinks: "[]",
            // refresh title/detail in case the wording moved
            title: seed.title,
            detail: seed.detail,
          });
          opened.push(existing._id);
        } else {
          // Refresh title/detail on every tick so copy changes (e.g.
          // Norwegian-isation) propagate to existing open rows without
          // waiting for them to resolve + reopen.
          await ctx.db.patch(existing._id, {
            last_seen_at: now,
            occurrence_count: existing.occurrence_count + 1,
            title: seed.title,
            detail: seed.detail,
          });
        }
      } else {
        const id = await ctx.db.insert("alerts", {
          kind: seed.kind,
          surface: seed.surface,
          audit_type: seed.audit_type,
          rule: seed.rule,
          severity: seed.severity,
          title: seed.title,
          detail: seed.detail,
          fingerprint: seed.fingerprint,
          first_seen_at: now,
          last_seen_at: now,
          occurrence_count: 1,
          resolved_at: null,
          notified_sinks: "[]",
        });
        opened.push(id);
      }
    }

    // Auto-resolve: any open alert whose fingerprint wasn't in `seeds`
    // and whose last_seen_at is older than 6 hours → mark resolved.
    const sixHoursAgo = new Date(Date.now() - 6 * 3_600_000).toISOString();
    const seedFps = new Set(seeds.map((s) => s.fingerprint));
    const openAlerts = await ctx.db
      .query("alerts")
      .withIndex("by_resolved", (q) => q.eq("resolved_at", null))
      .collect();
    let resolved = 0;
    for (const a of openAlerts) {
      if (seedFps.has(a.fingerprint)) continue;
      if (a.last_seen_at >= sixHoursAgo) continue;
      await ctx.db.patch(a._id, { resolved_at: now });
      resolved++;
    }

    return { opened: opened.length, resolved, seeds: seeds.length };
  },
});

/**
 * List unresolved alerts for the dashboard.
 */
export const listOpen = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    return await ctx.db
      .query("alerts")
      .withIndex("by_resolved", (q) => q.eq("resolved_at", null))
      .order("desc")
      .take(100);
  },
});

/**
 * Manual resolution — admin marks an alert as resolved (e.g. after
 * fixing the underlying issue and not wanting to wait for auto-resolve).
 */
export const resolve = mutation({
  args: { adminToken: v.string(), id: v.id("alerts") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.patch(args.id, { resolved_at: ISO() });
    return { ok: true };
  },
});

/**
 * Notify configured sinks about any alerts that haven't been routed yet.
 * Reads env at call-time (SLACK_WEBHOOK_URL, RESEND_API_KEY, GITHUB_TOKEN
 * + GITHUB_ISSUE_REPO). Each successful sink is appended to
 * `notified_sinks` so retries don't double-send.
 */
export const notifyAlerts = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);

    const open = (await ctx.runQuery(api.audits.alerts.listOpen, {
      adminToken: args.adminToken,
    })) as Array<{
      _id: string;
      kind: string;
      surface: string;
      audit_type: string;
      severity: string;
      title: string;
      detail: string;
      fingerprint: string;
      notified_sinks: string;
    }>;

    const slackUrl = process.env.SLACK_WEBHOOK_URL ?? "";
    const resendKey = process.env.RESEND_API_KEY ?? "";
    const emailTo = process.env.ALERTS_EMAIL_TO ?? "";
    const ghToken = process.env.GITHUB_TOKEN ?? "";
    const ghRepo = process.env.GITHUB_ISSUE_REPO ?? ""; // "owner/repo"

    const sent = { slack: 0, email: 0, github: 0, skipped: 0 };

    // Resend's free tier caps at 5 req/s. Sleep 250ms between alerts
    // to stay comfortably under that and also keep Slack/GitHub APIs
    // friendly. Backoff cumulative across alerts.
    const pace = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, ms));

    let i = 0;
    for (const a of open) {
      if (i++ > 0) await pace(250);
      const already = new Set<string>(JSON.parse(a.notified_sinks || "[]"));
      const nowSinks = new Set(already);

      // Slack
      if (slackUrl && !already.has("slack")) {
        try {
          const r = await fetch(slackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `${a.severity === "error" ? ":rotating_light:" : ":warning:"} *${a.title}*\n${a.detail}\n_surface: \`${a.surface}\` · audit: \`${a.audit_type}\` · kind: \`${a.kind}\`_`,
            }),
          });
          if (r.ok) {
            nowSinks.add("slack");
            sent.slack++;
          }
        } catch {
          /* sink unreachable; try again next tick */
        }
      }

      // Email via Resend — uses the verified noreply@digilist.no sender
      // so Convex doesn't need its own domain verification. Reply-to is
      // set to the alert email itself so a human can reply if needed.
      if (resendKey && emailTo && !already.has("email")) {
        try {
          const subjectPrefix =
            a.severity === "error" ? "🚨 KRITISK" : "⚠️ ADVARSEL";
          const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Digilist Intelligence <noreply@digilist.no>",
              to: emailTo.split(",").map((s) => s.trim()),
              reply_to: emailTo,
              subject: `${subjectPrefix} · ${a.title}`,
              html: `
                <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
                  <p style="font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: ${a.severity === "error" ? "#b91c1c" : "#b45309"}; margin: 0 0 8px;">
                    ${a.severity === "error" ? "KRITISK" : "ADVARSEL"} · ${a.kind.toUpperCase()}
                  </p>
                  <h1 style="font-family: Georgia, serif; font-size: 22px; line-height: 1.3; color: #0A1228; margin: 0 0 12px;">${a.title}</h1>
                  <p style="color: #2d3142; font-size: 15px; line-height: 1.5; margin: 0 0 20px;">${a.detail}</p>
                  <table style="font-family: monospace; font-size: 12px; color: #4a4a4a; margin-bottom: 24px;">
                    <tr><td style="padding-right:12px;">Overflate:</td><td><code>${a.surface}</code></td></tr>
                    <tr><td style="padding-right:12px;">Skanning:</td><td><code>${a.audit_type}</code></td></tr>
                    <tr><td style="padding-right:12px;">Type:</td><td><code>${a.kind}</code></td></tr>
                  </table>
                  <a href="https://digilist.no/admin/intelligence" style="display: inline-block; background: #0A1228; color: white; text-decoration: none; padding: 10px 18px; border-radius: 2px; font-family: monospace; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">Åpne kommandosentralen →</a>
                  <p style="font-family: monospace; font-size: 10px; color: #a0a0a0; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                    Digilist Intelligence Center · automatisk varsel
                  </p>
                </div>`,
              text: `${a.title}\n\n${a.detail}\n\nOverflate: ${a.surface}\nSkanning: ${a.audit_type}\nType: ${a.kind}\n\nÅpne: https://digilist.no/admin/intelligence`,
            }),
          });
          if (r.ok) {
            nowSinks.add("email");
            sent.email++;
          } else {
            const body = await r.text();
            console.error("[resend]", r.status, body.slice(0, 200));
          }
        } catch (err) {
          console.error("[resend] fetch failed", err);
        }
      }

      // GitHub issue
      if (ghToken && ghRepo && !already.has("github") && a.severity === "error") {
        try {
          const r = await fetch(
            `https://api.github.com/repos/${ghRepo}/issues`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghToken}`,
                "Content-Type": "application/json",
                Accept: "application/vnd.github+json",
              },
              body: JSON.stringify({
                title: `[intelligence] ${a.title}`,
                body: `${a.detail}\n\n---\n\n- surface: \`${a.surface}\`\n- audit_type: \`${a.audit_type}\`\n- kind: \`${a.kind}\`\n- fingerprint: \`${a.fingerprint}\`\n\nView in dashboard: https://digilist.no/admin/intelligence/issues`,
                labels: ["intelligence-alert", a.audit_type, a.severity],
              }),
            },
          );
          if (r.ok) {
            nowSinks.add("github");
            sent.github++;
          }
        } catch {
          /* ignore */
        }
      }

      // Persist updated sink set so we don't re-notify on next tick.
      if (nowSinks.size !== already.size) {
        await ctx.runMutation(api.audits.alerts.markNotified, {
          adminToken: args.adminToken,
          // a._id arrived as a plain string from the listOpen query —
          // cast it back into the typed Id<"alerts"> for the mutation
          // arg validator. (The TS Parameters<> indirection didn't
          // round-trip cleanly through the codegen.)
          id: a._id as unknown as import("../_generated/dataModel").Id<"alerts">,
          sinks: Array.from(nowSinks),
        });
      } else if (nowSinks.size === 0) {
        sent.skipped++;
      }
    }

    return sent;
  },
});

export const markNotified = mutation({
  args: {
    adminToken: v.string(),
    id: v.id("alerts"),
    sinks: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    await ctx.db.patch(args.id, {
      notified_sinks: JSON.stringify(args.sinks),
    });
    return { ok: true };
  },
});
