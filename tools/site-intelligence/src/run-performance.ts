/**
 * Daily PSI scan — calls api.audits.performance.scan over HTTP so the
 * Convex deployment (which has PSI_API_KEY in its env) runs the
 * Lighthouse fetches against every indexable production HTML surface.
 *
 * Used by the digilist-audit.timer systemd unit. Output goes to
 * journalctl -u digilist-audit so failures show up alongside the
 * in-process auditors.
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

function parseTargetFlag(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--target" && argv[i + 1]) return argv[i + 1];
  }
  return undefined;
}

async function main(): Promise<void> {
  const client = new ConvexHttpClient(CONVEX_URL);
  const token = Buffer.from(ADMIN, "utf-8").toString("base64");
  const target = parseTargetFlag(process.argv.slice(2));
  console.log(
    `[psi] scanning${target ? ` target=${target}` : " all"} via ${CONVEX_URL}…`,
  );
  const result = (await client.action(api.audits.performance.scan, {
    adminToken: token,
    ...(target ? { target } : {}),
  })) as {
    scanned: number;
    results: Array<{
      target: string;
      status: string;
      score: number | null;
      findings: number;
      error?: string;
    }>;
  };
  let okCount = 0;
  for (const r of result.results) {
    if (r.status === "ok") {
      okCount++;
      console.log(
        `[psi] ✓ ${r.target.padEnd(10)} score=${r.score}  findings=${r.findings}`,
      );
    } else {
      console.error(
        `[psi] ✗ ${r.target.padEnd(10)} ${(r.error ?? "").slice(0, 200)}`,
      );
    }
  }
  console.log(`[psi] ${okCount}/${result.scanned} surfaces scanned ok`);

  // After PSI completes, scan ALL recent audit_runs (uptime, security,
  // performance, etc.) for regressions. This is the same logic the
  // orchestrator triggers — running it from here too means whichever
  // pipeline finishes last drives the alert state.
  try {
    const detected = (await client.mutation(api.audits.alerts.detectRegressions, {
      adminToken: token,
    })) as { opened: number; resolved: number; seeds: number };
    console.log(
      `[alerts] detect: ${detected.opened} opened/refreshed, ${detected.resolved} auto-resolved (${detected.seeds} active signals)`,
    );
    const sent = (await client.action(api.audits.alerts.notifyAlerts, {
      adminToken: token,
    })) as { slack: number; email: number; github: number; skipped: number };
    console.log(
      `[alerts] notify: slack=${sent.slack} email=${sent.email} github=${sent.github}`,
    );
  } catch (err) {
    console.error("[alerts] failed:", err instanceof Error ? err.message : err);
  }

  process.exit(okCount === result.scanned ? 0 : 1);
}

main().catch((e) => {
  console.error("[psi] fatal:", e);
  process.exit(1);
});
