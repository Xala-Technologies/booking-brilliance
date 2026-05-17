/**
 * Real-User Monitoring (RUM) — Web Vitals beacons from real visitors.
 *
 * Counterpart to the synthetic Lighthouse / PSI metrics on the Ytelse
 * page: this is what actual users on actual networks experience,
 * sampled live. Each `<RumReporter>` mount fires up to 5 beacons per
 * page load (one per metric) via navigator.sendBeacon.
 *
 * Privacy: no PII. visitor_id is random per-session, not persisted
 * across tabs. We bucket device into mobile/desktop only — no UA string,
 * no IP. GDPR-defensible without consent.
 */
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../auth";

// Allowlist of origins that may send beacons. Beacons from unknown
// origins are rejected (don't write to DB) to prevent random web
// pages from polluting our metrics.
const ALLOWED_ORIGINS = new Set([
  "digilist.no",
  "www.digilist.no",
  "docs.digilist.no",
  "status.digilist.no",
  "app.digilist.no",
  "dashboard.digilist.no",
  "dev.digilist.no",
  "dashboard.dev.digilist.no",
  // Local dev (Vite default + alt)
  "localhost",
]);

// Map hostnames → surface name (matches convex/audits/targets.ts catalog).
const HOST_TO_SURFACE: Record<string, string> = {
  "digilist.no": "marketing",
  "www.digilist.no": "marketing",
  "dev.digilist.no": "marketing-dev",
  "docs.digilist.no": "docs",
  "status.digilist.no": "status",
  "app.digilist.no": "app",
  "dashboard.digilist.no": "dashboard",
  "dashboard.dev.digilist.no": "dashboard-dev",
};

const VALID_METRICS = new Set(["LCP", "CLS", "INP", "FCP", "TTFB"]);
const VALID_DEVICES = new Set(["mobile", "desktop"]);
const VALID_RATINGS = new Set(["good", "needs-improvement", "poor"]);

/**
 * Public ingestion endpoint — no admin auth. The beacon arrives from
 * the visitor's browser. We validate origin + payload shape and silently
 * drop garbage so the table never accepts arbitrary writes.
 */
export const ingest = mutation({
  args: {
    origin: v.string(),
    pathname: v.string(),
    metric: v.string(),
    value: v.number(),
    rating: v.string(),
    nav_type: v.optional(v.string()),
    device: v.string(),
    visitor_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Origin allowlist
    let hostname = "";
    try {
      hostname = new URL(args.origin).hostname.replace(/^www\./, "");
    } catch {
      return { ok: false, reason: "bad-origin" };
    }
    const fullHost = new URL(args.origin).hostname;
    if (!ALLOWED_ORIGINS.has(fullHost) && !ALLOWED_ORIGINS.has(hostname)) {
      return { ok: false, reason: "origin-not-allowed" };
    }
    const surface = HOST_TO_SURFACE[fullHost] ?? HOST_TO_SURFACE[hostname];
    if (!surface) return { ok: false, reason: "no-surface" };

    // Payload validation
    if (!VALID_METRICS.has(args.metric)) {
      return { ok: false, reason: "bad-metric" };
    }
    if (!VALID_DEVICES.has(args.device)) {
      return { ok: false, reason: "bad-device" };
    }
    if (!VALID_RATINGS.has(args.rating)) {
      return { ok: false, reason: "bad-rating" };
    }
    if (
      typeof args.value !== "number" ||
      !isFinite(args.value) ||
      args.value < 0 ||
      args.value > 60_000
    ) {
      return { ok: false, reason: "bad-value" };
    }
    if (args.visitor_id.length < 8 || args.visitor_id.length > 64) {
      return { ok: false, reason: "bad-visitor-id" };
    }
    if (args.pathname.length > 200) {
      return { ok: false, reason: "path-too-long" };
    }

    await ctx.db.insert("rum_events", {
      surface,
      pathname: args.pathname.slice(0, 200),
      metric: args.metric,
      value: args.value,
      rating: args.rating,
      nav_type: args.nav_type,
      device: args.device,
      visitor_id: args.visitor_id.slice(0, 64),
      received_at: new Date().toISOString(),
    });
    return { ok: true };
  },
});

/**
 * Admin query — returns p75 + sample count per (surface, metric, device)
 * over the past N days. Powers the "Lab vs RUM" split on the Ytelse page.
 */
export const summary = query({
  args: {
    adminToken: v.string(),
    sinceDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminToken);
    const cutoff = new Date(
      Date.now() - (args.sinceDays ?? 7) * 86_400_000,
    ).toISOString();

    const rows = await ctx.db
      .query("rum_events")
      .withIndex("by_received")
      .order("desc")
      .take(5000); // ~700/day per metric, 5 metrics, so ≈ enough for 1d at modest traffic

    // Bucket: (surface, metric, device) → number[]
    type Key = string;
    const buckets = new Map<Key, number[]>();
    for (const r of rows) {
      if (r.received_at < cutoff) continue;
      const k = `${r.surface}::${r.metric}::${r.device}`;
      const arr = buckets.get(k) ?? [];
      arr.push(r.value);
      buckets.set(k, arr);
    }

    const result: Array<{
      surface: string;
      metric: string;
      device: string;
      sampleCount: number;
      p50: number;
      p75: number;
      p95: number;
    }> = [];
    for (const [k, values] of buckets) {
      const [surface, metric, device] = k.split("::");
      values.sort((a, b) => a - b);
      const p = (q: number) => {
        const idx = Math.min(
          values.length - 1,
          Math.floor(values.length * q),
        );
        return Math.round(values[idx]);
      };
      result.push({
        surface,
        metric,
        device,
        sampleCount: values.length,
        p50: p(0.5),
        p75: p(0.75),
        p95: p(0.95),
      });
    }
    return result.sort((a, b) =>
      a.surface === b.surface
        ? a.metric.localeCompare(b.metric)
        : a.surface.localeCompare(b.surface),
    );
  },
});
