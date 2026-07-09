/**
 * One-off cleanup: the published blog drafts in Convex accumulated duplicates
 * (the same topic generated up to 9× while the commit/deploy pipeline was
 * broken and posts never landed on disk to mark the topic "covered"). This
 * collapses each slug to a single survivor:
 *
 *   - Non-mangled slug: keep the newest draft, reject the rest.
 *   - Mangled slug (Norwegian ø/å/æ lost to '-', e.g. "m-terom"): reject ALL,
 *     because the fixed markdown file is being renamed on disk to the correct
 *     slug and we don't want sync recreating the mangled file.
 *
 * "Reject" just flips status→rejected (content:sync only pulls `published`),
 * so the live site — served from committed src/content/blog/*.md — is untouched.
 *
 * DRY RUN by default. Pass --apply to execute.
 *
 * Env: VITE_CONVEX_URL (or CONVEX_URL) + ADMIN_BASIC_AUTH.
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
if (!URL || !ADMIN) throw new Error("need VITE_CONVEX_URL + ADMIN_BASIC_AUTH");
const APPLY = process.argv.includes("--apply");

const client = new ConvexHttpClient(URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

interface D {
  _id: string;
  channel: string;
  title: string;
  frontmatter_json: string;
  published_url: string | null;
  body: string;
  created_at: string;
}

function slugOf(d: D): string {
  if (d.published_url) {
    const m = d.published_url.match(/\/blogg\/([^/?#]+)/);
    if (m) return m[1];
  }
  try {
    const fm = JSON.parse(d.frontmatter_json) as { slug?: string };
    if (fm.slug) return fm.slug;
  } catch {
    /* ignore */
  }
  const y = d.body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (y) {
    const l = y[1].split(/\r?\n/).find((x) => /^slug:/.test(x));
    if (l) return l.replace(/^slug:\s*/, "").replace(/^["']|["']$/g, "").trim();
  }
  return "";
}

// Slugs whose Norwegian characters were mangled to '-'. Reject every draft for
// these; the corrected files are renamed on disk.
const MANGLED = new Set([
  "booking-av-m-terom-og-kulturhus",
  "valg-av-bookingsystem-og-leverand-r",
]);

async function main() {
  const snap = (await client.query(api.content.state.snapshot, {
    adminToken: token,
  })) as { drafts: { published: D[] } };
  const pub = snap.drafts.published.filter((d) => d.channel === "blog");

  const bySlug = new Map<string, D[]>();
  for (const d of pub) {
    const s = slugOf(d);
    if (!bySlug.has(s)) bySlug.set(s, []);
    bySlug.get(s)!.push(d);
  }

  const toReject: { d: D; reason: string }[] = [];
  for (const [slug, arr] of bySlug) {
    arr.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); // newest first
    if (MANGLED.has(slug)) {
      for (const d of arr) toReject.push({ d, reason: `mangled slug (${slug})` });
    } else {
      for (const d of arr.slice(1))
        toReject.push({ d, reason: `duplicate of ${slug}` });
    }
  }

  console.log(
    `${pub.length} published → ${bySlug.size} unique slugs; ` +
      `keeping ${bySlug.size - MANGLED.size} survivor(s), rejecting ${toReject.length}\n`,
  );
  for (const { d, reason } of toReject) {
    console.log(`  ${APPLY ? "reject" : "would reject"}  ${d._id.slice(-6)}  ${reason}`);
    if (APPLY) {
      await client.mutation(api.content.drafts.reject, {
        adminToken: token,
        id: d._id as never,
        reviewer: "dedup-cleanup",
        note: reason,
      });
    }
  }
  console.log(
    `\n${APPLY ? "Applied" : "DRY RUN"} — ${toReject.length} rejected. ` +
      (APPLY ? "" : "Re-run with --apply to execute."),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
