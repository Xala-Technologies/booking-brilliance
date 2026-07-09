/** Read-only: list published blog drafts with their extracted slug so we can
 * see duplicates (same slug, multiple _id) and mangled Norwegian slugs. */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
if (!URL || !ADMIN) throw new Error("need VITE_CONVEX_URL + ADMIN_BASIC_AUTH");
const client = new ConvexHttpClient(URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

interface D { _id: string; channel: string; title: string; frontmatter_json: string; published_url: string | null; body: string; }

function slug(d: D): string {
  if (d.published_url) { const m = d.published_url.match(/\/blogg\/([^/?#]+)/); if (m) return m[1] + "  [url]"; }
  try { const fm = JSON.parse(d.frontmatter_json) as { slug?: string }; if (fm.slug) return fm.slug + "  [fm]"; } catch {}
  const y = d.body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (y) { const l = y[1].split(/\r?\n/).find((x) => /^slug:/.test(x)); if (l) return l.replace(/^slug:\s*/, "").replace(/^["']|["']$/g, "").trim() + "  [yaml]"; }
  return d.title.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) + "  [title-kebab]";
}

const snap = (await client.query(api.content.state.snapshot, { adminToken: token })) as { drafts: { published: D[] } };
const pub = snap.drafts.published.filter((d) => d.channel === "blog");
console.log(`published blog drafts: ${pub.length}\n`);
const bySlug = new Map<string, D[]>();
for (const d of pub) { const s = slug(d).replace(/\s+\[.*/, ""); (bySlug.get(s) ?? bySlug.set(s, []).get(s)!).push(d); }
console.log("=== slug → count (source) ===");
for (const d of pub) console.log(`  ${slug(d)}`);
console.log("\n=== DUPLICATE slugs (same slug, multiple drafts) ===");
let dups = 0;
for (const [s, arr] of bySlug) if (arr.length > 1) { dups++; console.log(`  ${s}  ×${arr.length}  ids=[${arr.map((a) => a._id.slice(-6)).join(", ")}]`); }
console.log(`\n${dups} duplicated slug(s); ${pub.length} drafts → ${bySlug.size} unique slugs`);
console.log("\n=== MANGLED slugs (contain -r-/-  from ø/å/æ, or leading/double dashes) ===");
for (const [s] of bySlug) if (/leverand-r|m-terom|-{2,}|niti|kj-p|-r-og|forel-/.test(s) || /(^|-)-|--/.test(s)) console.log(`  ${s}`);
