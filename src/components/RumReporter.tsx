/**
 * Real-User Monitoring beacon emitter.
 *
 * Mounted once at the App root. Subscribes to web-vitals' onLCP/onCLS/
 * onINP/onFCP/onTTFB and fires a Convex mutation per metric. Beacons are
 * fire-and-forget; no error UI, no retries — the goal is to be invisible.
 *
 * Privacy:
 *   - No PII collected
 *   - visitor_id is random per-session, only in sessionStorage
 *   - device is coarse-bucket (mobile/desktop) from a viewport check
 *   - origin + pathname are sent so we can group by surface; admin URLs
 *     are skipped (we don't track our own usage of the dashboard)
 *
 * Performance: web-vitals' callbacks fire on the relevant lifecycle
 * events (LCP on paint, CLS/INP on hidden, FCP/TTFB on load). All
 * deferred — none block first paint.
 */
import { useEffect } from "react";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

const VISITOR_KEY = "digilist-rum-visitor-v1";
const SKIP_PATH_PREFIXES = ["/admin/", "/blogg/preview/"];

function getVisitorId(): string {
  if (typeof sessionStorage === "undefined") return crypto.randomUUID();
  let id = sessionStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    try {
      sessionStorage.setItem(VISITOR_KEY, id);
    } catch {
      /* ignore (private mode etc) */
    }
  }
  return id;
}

function deviceBucket(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

export default function RumReporter() {
  const convex = useConvex();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (SKIP_PATH_PREFIXES.some((p) => window.location.pathname.startsWith(p))) {
      return;
    }
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const visitor_id = getVisitorId();
    const device = deviceBucket();

    let cancelled = false;
    const send = (metric: string, value: number, rating: string, nav_type?: string) => {
      if (cancelled) return;
      // Fire-and-forget. Errors are silenced — RUM is best-effort.
      convex
        .mutation(api.audits.rum.ingest, {
          origin,
          pathname,
          metric,
          value,
          rating,
          nav_type,
          device,
          visitor_id,
        })
        .catch(() => {
          /* silent */
        });
    };

    // Dynamic import so web-vitals isn't in the critical chunk.
    void import("web-vitals").then((wv) => {
      if (cancelled) return;
      const handler = (name: string) => (m: {
        value: number;
        rating: string;
        navigationType?: string;
      }) => {
        send(name, m.value, m.rating, m.navigationType);
      };
      wv.onLCP(handler("LCP"));
      wv.onCLS(handler("CLS"));
      wv.onINP(handler("INP"));
      wv.onFCP(handler("FCP"));
      wv.onTTFB(handler("TTFB"));
    });

    return () => {
      cancelled = true;
    };
  }, [convex]);

  return null;
}
