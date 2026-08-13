// Every internal link on the site, checked against the real route table.
//
// A 200 proves nothing here: unknown paths fall through to the SPA shell, which
// renders NotFound client-side. That is how /en/blog sat broken in the English
// nav through every curl-based check — the server redirect worked, the in-app
// <Link> did not, and only the route table can tell them apart.
import { promises as fs } from "node:fs";
import { join } from "node:path";

const routeSrc = await fs.readFile("src/App.tsx", "utf-8");
// Paths are relative inside SiteRoutes and mounted at both "/" and "/en".
const routes = [...routeSrc.matchAll(/path="([^"*]+)"/g)].map((m) => m[1]).filter((p) => p !== "/");
const hasIndex = /<Route index/.test(routeSrc);

const dynamic = routes.filter((r) => r.includes(":"));
const staticRoutes = new Set(routes.filter((r) => !r.includes(":")));

function known(path) {
  const p = path.replace(/[?#].*$/, "").replace(/\/$/, "") || "/";
  if (p === "/" || p === "/en") return hasIndex;
  const rel = p.startsWith("/en/") ? p.slice(4) : p.slice(1);
  if (staticRoutes.has(rel)) return true;
  // A dynamic route matches if the segment counts line up.
  return dynamic.some((d) => {
    const a = d.split("/"), b = rel.split("/");
    return a.length === b.length && a.every((seg, i) => seg.startsWith(":") || seg === b[i]);
  });
}

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

const files = await walk("dist");
const broken = new Map();
for (const f of files) {
  const html = await fs.readFile(f, "utf-8");
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = m[1];
    if (/^\/(assets|images|fonts)\//.test(href)) continue;
    if (/\.(png|jpg|jpeg|webp|svg|ico|xml|txt|json|webmanifest|pdf|js|css)$/i.test(href)) continue;
    if (known(href)) continue;
    const page = f.replace("dist", "").replace("/index.html", "") || "/";
    if (!broken.has(href)) broken.set(href, new Set());
    broken.get(href).add(page);
  }
}

console.log(`check-links: ${files.length} page(s), ${routes.length} route(s), ${broken.size} link target(s) with no route\n`);
for (const [href, pages] of [...broken.entries()].sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  ${href}  — on ${pages.size} page(s): ${[...pages].slice(0, 3).join(", ")}`);
}
if (process.env.CHECK_LINKS_STRICT === "1" && broken.size) process.exit(1);
