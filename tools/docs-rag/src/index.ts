/**
 * docs-rag indexer.
 *
 * Walks apps/docs/src/content/docs/**, chunks each page by H2 sections
 * (with H3 splits when sections balloon), and emits a single JSON
 * index that the API server (server/index.mjs) loads at boot.
 *
 *   pnpm docs:index   →  apps/docs/dist-rag/docs-rag-index.json
 *
 * Index shape:
 *   {
 *     generatedAt: "2026-05-16T...",
 *     model: "tfidf" | "voyage-3-lite",
 *     chunks: [
 *       {
 *         id: "compliance/ssa-l#samsvarsmatrise",
 *         slug: "compliance/ssa-l",
 *         href: "/compliance/ssa-l/",
 *         pageTitle: "SSA-L 2026 sikkerhetsbilag",
 *         section: "Samsvarsmatrise",
 *         content: "<chunk body, ~600-900 tokens>",
 *         tokens: 723,
 *         embedding: number[] | null
 *       }
 *     ]
 *   }
 *
 * When VOYAGE_API_KEY is present each chunk also gets an `embedding`
 * vector — those are used for cosine-similarity retrieval server-side.
 * Without the key the index just ships chunks; the server falls back
 * to a TF-IDF retrieval pass it builds in memory at boot.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const DOCS_DIR = path.join(REPO_ROOT, "apps", "docs", "src", "content", "docs");
const OUT_DIR = path.join(REPO_ROOT, "apps", "docs", "dist-rag");
const OUT_FILE = path.join(OUT_DIR, "docs-rag-index.json");

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY ?? "";
const VOYAGE_MODEL = process.env.VOYAGE_MODEL ?? "voyage-3-lite";

// Rough char→token estimate (Latin alphabet, ~4 chars/token).
const TARGET_TOKENS = 700;
const MAX_TOKENS = 1100;

interface Chunk {
  id: string;
  slug: string;
  href: string;
  pageTitle: string;
  section: string;
  content: string;
  tokens: number;
  embedding: number[] | null;
}

interface Index {
  generatedAt: string;
  model: string;
  chunks: Chunk[];
}

function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { fm, body: m[2] };
}

function stripMdx(body: string): string {
  return body
    // Strip MDX import lines + JSX-like blocks
    .replace(/^import\s+.*$/gm, "")
    .replace(/<[A-Z][\w-]*\b[^>]*\/>/g, "")
    .replace(/<[A-Z][\w-]*\b[\s\S]*?<\/[A-Z][\w-]*>/g, "")
    // Collapse multi-blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fileToSlug(file: string): { slug: string; href: string } {
  const rel = path
    .relative(DOCS_DIR, file)
    .replace(/\\/g, "/")
    .replace(/\.(md|mdx)$/, "");
  const cleaned = rel.replace(/\/index$/, "");
  const slug = cleaned === "index" ? "" : cleaned;
  const href = "/" + (slug ? slug + "/" : "");
  return { slug, href };
}

function splitSections(body: string): Array<{ section: string; content: string }> {
  // Split on H2 headings. H1 not used (it lives in frontmatter title).
  const parts: Array<{ section: string; content: string }> = [];
  const re = /^##\s+(.+?)\s*$/gm;
  const indices: Array<{ idx: number; heading: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) indices.push({ idx: m.index, heading: m[1] });

  if (indices.length === 0) {
    // No H2s — treat whole body as one "Overview" section.
    parts.push({ section: "Oversikt", content: body.trim() });
    return parts;
  }

  // Pre-content (lede above the first H2)
  const lede = body.slice(0, indices[0].idx).trim();
  if (lede) parts.push({ section: "Oversikt", content: lede });

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].idx;
    const end = i + 1 < indices.length ? indices[i + 1].idx : body.length;
    const block = body.slice(start, end);
    const heading = indices[i].heading;
    // Drop the ## line itself from the chunk body.
    const inner = block.replace(/^##\s+.+\s*\n?/, "").trim();
    if (inner) parts.push({ section: heading, content: inner });
  }
  return parts;
}

function packChunks(
  sections: Array<{ section: string; content: string }>,
  pageTitle: string,
  slug: string,
  href: string,
): Chunk[] {
  const chunks: Chunk[] = [];
  for (const s of sections) {
    const tokens = estimateTokens(s.content);
    if (tokens <= MAX_TOKENS) {
      chunks.push({
        id: `${slug || "index"}#${slugify(s.section)}`,
        slug: slug || "index",
        href,
        pageTitle,
        section: s.section,
        content: s.content,
        tokens,
        embedding: null,
      });
      continue;
    }
    // Section too long — split by H3 then by paragraph until under TARGET.
    const subSections = splitByH3(s.content);
    let buf: string[] = [];
    let bufTokens = 0;
    let subIdx = 0;
    const flush = () => {
      if (buf.length === 0) return;
      const content = buf.join("\n\n").trim();
      if (!content) return;
      chunks.push({
        id: `${slug || "index"}#${slugify(s.section)}-${subIdx++}`,
        slug: slug || "index",
        href,
        pageTitle,
        section: s.section,
        content,
        tokens: estimateTokens(content),
        embedding: null,
      });
      buf = [];
      bufTokens = 0;
    };
    for (const sub of subSections) {
      const subTokens = estimateTokens(sub);
      if (bufTokens + subTokens > TARGET_TOKENS && buf.length > 0) flush();
      buf.push(sub);
      bufTokens += subTokens;
    }
    flush();
  }
  return chunks;
}

function splitByH3(content: string): string[] {
  const parts: string[] = [];
  const re = /^###\s+.+$/gm;
  const idx: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) idx.push(m.index);
  if (idx.length === 0) {
    // No H3, split by paragraph.
    return content.split(/\n{2,}/).filter((p) => p.trim());
  }
  if (idx[0] > 0) parts.push(content.slice(0, idx[0]).trim());
  for (let i = 0; i < idx.length; i++) {
    const end = i + 1 < idx.length ? idx[i + 1] : content.length;
    const piece = content.slice(idx[i], end).trim();
    if (piece) parts.push(piece);
  }
  return parts;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function embedWithVoyage(texts: string[]): Promise<number[][]> {
  if (!VOYAGE_API_KEY) return texts.map(() => []);
  const batches: number[][] = [];
  // Voyage API takes up to 128 inputs per call.
  for (let i = 0; i < texts.length; i += 64) {
    const batch = texts.slice(i, i + 64);
    const r = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VOYAGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: batch,
        model: VOYAGE_MODEL,
        input_type: "document",
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Voyage ${r.status}: ${err.slice(0, 200)}`);
    }
    const json = (await r.json()) as { data: Array<{ embedding: number[] }> };
    for (const item of json.data) batches.push(item.embedding);
  }
  return batches;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

async function build(): Promise<void> {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`docs dir not found: ${DOCS_DIR}`);
    process.exit(1);
  }
  const files = walk(DOCS_DIR);
  console.log(`docs-rag: walking ${files.length} files`);

  const chunks: Chunk[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { fm, body } = parseFrontmatter(raw);
    const pageTitle = fm.title || path.basename(file);
    const { slug, href } = fileToSlug(file);
    const cleaned = stripMdx(body);
    const sections = splitSections(cleaned);
    const pageChunks = packChunks(sections, pageTitle, slug, href);
    chunks.push(...pageChunks);
  }
  console.log(`docs-rag: chunked into ${chunks.length} sections`);

  let model = "tfidf";
  if (VOYAGE_API_KEY) {
    console.log(`docs-rag: embedding via Voyage (${VOYAGE_MODEL})…`);
    const texts = chunks.map(
      (c) => `${c.pageTitle} — ${c.section}\n\n${c.content}`,
    );
    const vectors = await embedWithVoyage(texts);
    for (let i = 0; i < chunks.length; i++) chunks[i].embedding = vectors[i];
    model = VOYAGE_MODEL;
    console.log(`docs-rag: embedded ${vectors.length} chunks`);
  } else {
    console.log("docs-rag: VOYAGE_API_KEY not set → server will use TF-IDF retrieval");
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const index: Index = {
    generatedAt: new Date().toISOString(),
    model,
    chunks,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2));
  const kb = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
  console.log(`docs-rag: wrote ${OUT_FILE} (${kb} kB)`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
