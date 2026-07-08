/**
 * Auto-publish blog drafts — the "autopublish" half of the daily blog agent.
 *
 * The content-agent's generate phase creates blog drafts as status="pending".
 * This approves + publishes every pending (or approved) blog draft so the daily
 * pipeline can ship them without a human gate:
 *
 *   content:all (generate 3)  →  auto-publish-blogs  →  content:sync  →  commit → deploy
 *
 * Publishing = flip status to published + stamp the /blogg URL (Convex is the
 * source of truth; content:sync pulls the markdown into the repo). Idempotent:
 * already-published drafts are skipped.
 *
 * Env: VITE_CONVEX_URL (or CONVEX_URL) + ADMIN_BASIC_AUTH.
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
if (!CONVEX_URL || !ADMIN) {
  console.error("[auto-publish] VITE_CONVEX_URL and ADMIN_BASIC_AUTH required.");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

async function main() {
  let published = 0;
  // Pending → approve first; approved → publish. Both statuses get published.
  for (const status of ["pending", "approved"]) {
    const rows = (await client.query(api.content.drafts.listByStatus, {
      adminToken: token,
      status,
    })) as Array<{ _id: string; channel: string; title: string }>;
    const blogs = rows.filter((r) => r.channel === "blog");
    for (const d of blogs) {
      try {
        if (status === "pending") {
          await client.mutation(api.content.drafts.approve, {
            adminToken: token,
            id: d._id as never,
            reviewer: "daily-agent",
          });
        }
        const r = (await client.action(api.content.publish.publish, {
          adminToken: token,
          id: d._id as never,
          reviewer: "daily-agent",
        })) as { ok: boolean; externalUrl?: string; error?: string };
        if (r.ok) {
          console.log(`[auto-publish] ✓ ${d.title} → ${r.externalUrl ?? "ok"}`);
          published++;
        } else {
          console.warn(`[auto-publish] ✗ ${d.title}: ${r.error}`);
        }
      } catch (e) {
        console.warn(
          `[auto-publish] ✗ ${d.title}: ${e instanceof Error ? e.message : e}`,
        );
      }
    }
  }
  console.log(`[auto-publish] published ${published} blog draft(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
