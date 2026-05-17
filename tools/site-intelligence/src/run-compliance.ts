/**
 * Nightly compliance collection — calls api.compliance.collectors:collectAll
 * over HTTP so the Convex deployment runs every automated collector
 * (TLS expiry, audit-findings rollup, alert MTTR, uptime SLA) and
 * reconciles control statuses from the freshly written evidence.
 *
 * Mounted into the digilist-audit.timer systemd unit alongside
 * run-performance.ts so the whole compliance + audit picture refreshes
 * in one nightly window.
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const CONVEX_URL = process.env.CONVEX_URL ?? process.env.VITE_CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";

if (!CONVEX_URL) {
  console.error("CONVEX_URL not set.");
  process.exit(1);
}
if (!ADMIN) {
  console.error("ADMIN_BASIC_AUTH not set.");
  process.exit(1);
}

async function main(): Promise<void> {
  const client = new ConvexHttpClient(CONVEX_URL);
  const token = Buffer.from(ADMIN, "utf-8").toString("base64");
  console.log(`[compliance] collecting via ${CONVEX_URL}…`);
  const result = (await client.action(api.compliance.collectors.collectAll, {
    adminToken: token,
  })) as {
    started_at: string;
    results: Array<{
      collector: string;
      status: string;
      controls_evidenced: number;
    }>;
    reconciled: number;
  };
  for (const r of result.results) {
    console.log(
      `[compliance]   ${r.collector.padEnd(20)} → ${r.status.padEnd(6)} · ${r.controls_evidenced} evidenced`,
    );
  }
  console.log(`[compliance] reconciled ${result.reconciled} control(s).`);
}

main().catch((err) => {
  console.error("[compliance] failed:", err);
  process.exit(1);
});
