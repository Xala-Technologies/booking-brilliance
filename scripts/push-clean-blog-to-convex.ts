/**
 * Reverse sync: push the cleaned local blog markdown back into Convex draft
 * bodies, so Convex (the source content:sync reads from) matches the de-em-dashed
 * files. Without this, the daily-blogs workflow's content:sync would overwrite
 * the cleaned markdown with the old em-dash Convex content. Safe to delete after.
 *
 * Env: VITE_CONVEX_URL (or CONVEX_URL) + ADMIN_BASIC_AUTH.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "..", "src", "content", "blog");
const URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
if (!URL || !ADMIN) throw new Error("need VITE_CONVEX_URL + ADMIN_BASIC_AUTH");

const client = new ConvexHttpClient(URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

interface DraftDoc {
  _id: string;
  channel: string;
  title: string;
  body: string;
  frontmatter_json: string;
  published_url: string | null;
}

function extractSlug(d: DraftDoc): string | null {
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
  const yaml = d.body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (yaml) {
    const line = yaml[1].split(/\r?\n/).find((l) => /^slug:\s*/.test(l));
    if (line) return line.replace(/^slug:\s*/, "").replace(/^["']|["']$/g, "").trim();
  }
  return null;
}

async function main() {
  const snap = (await client.query(api.content.state.snapshot, {
    adminToken: token,
  })) as { drafts: { published: DraftDoc[] } };
  const published = snap.drafts.published.filter((d) => d.channel === "blog");
  console.log(`[reverse-sync] ${published.length} published blog draft(s)`);

  let updated = 0;
  let same = 0;
  let missing = 0;
  for (const d of published) {
    const slug = extractSlug(d);
    if (!slug) continue;
    const file = path.join(BLOG_DIR, `${slug}.md`);
    if (!fs.existsSync(file)) {
      missing++;
      continue;
    }
    const md = fs.readFileSync(file, "utf-8");
    // Only update when the cleaned file differs (i.e. had em-dashes removed).
    if (md.replace(/—/g, "").length === (d.body ?? "").replace(/—/g, "").length &&
        !/—/.test(md) && /—/.test(d.body ?? "")) {
      // fall through to update (file clean, convex dirty)
    }
    if (!/—/.test(md) && /—/.test(d.body ?? "")) {
      await client.mutation(api.content.drafts.edit, {
        adminToken: token,
        id: d._id as never,
        body: md,
      });
      console.log(`[reverse-sync] ✓ ${slug}`);
      updated++;
    } else {
      same++;
    }
  }
  console.log(
    `[reverse-sync] done — ${updated} updated, ${same} already clean, ${missing} no local file`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
