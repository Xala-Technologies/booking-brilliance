// Loads /leie FAQ from src/content/leie.ts for scripts/prerender.mjs.
//
// Plain Node ESM cannot import the TypeScript module directly, so we read the
// FAQ_NB block at build time. The visible accordion and <SEO faq> on /leie
// both render rentCopy("nb").faq from the same file — this keeps the
// prerendered FAQPage JSON-LD from drifting again.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LEIE_FILE = join(__dirname, "..", "src", "content", "leie.ts");

const FAQ_ENTRY_RE =
  /question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;

function unescape(text) {
  return text.replace(/\\"/g, '"').replace(/\\n/g, "\n");
}

/**
 * @returns {Promise<Array<{ q: string, a: string }>>}
 */
export async function loadLeieFaqNb() {
  const raw = await readFile(LEIE_FILE, "utf-8");
  const start = raw.indexOf("const FAQ_NB:");
  if (start === -1) {
    throw new Error("src/content/leie.ts: const FAQ_NB not found");
  }
  const end = raw.indexOf("const GROUPS_EN:", start);
  if (end === -1) {
    throw new Error("src/content/leie.ts: FAQ_NB block boundary not found");
  }

  const block = raw.slice(start, end);
  const faq = [];
  let match;
  while ((match = FAQ_ENTRY_RE.exec(block)) !== null) {
    faq.push({ q: unescape(match[1]), a: unescape(match[2]) });
  }

  if (faq.length === 0) {
    throw new Error("src/content/leie.ts: parsed zero FAQ_NB entries");
  }

  return faq;
}
