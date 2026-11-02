// Loads Oslo city-page SEO + FAQ from src/content/lokalerByer.ts for
// scripts/prerender.mjs. The visible FAQ and <SEO faq> on /lokaler-til-leie/oslo
// render BYER.oslo.faq from the same file — this keeps FAQPage JSON-LD in sync.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BYER_FILE = join(__dirname, "..", "src", "content", "lokalerByer.ts");

const FAQ_ENTRY_RE =
  /question:\s*"((?:[^"\\]|\\.)*)"\s*,\s*answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;

function unescape(text) {
  return text.replace(/\\"/g, '"').replace(/\\n/g, "\n");
}

async function loadOsloBlock() {
  const raw = await readFile(BYER_FILE, "utf-8");
  const start = raw.indexOf("  oslo: {");
  if (start === -1) {
    throw new Error("src/content/lokalerByer.ts: oslo entry not found");
  }
  const end = raw.indexOf("\n  bergen: {", start);
  if (end === -1) {
    throw new Error("src/content/lokalerByer.ts: oslo block boundary not found");
  }
  return raw.slice(start, end);
}

/**
 * @returns {Promise<{ title: string, description: string, faq: Array<{ q: string, a: string }> }>}
 */
export async function loadOsloPrerenderMeta() {
  const block = await loadOsloBlock();

  const titleMatch = block.match(/^\s*title:\s*"((?:[^"\\]|\\.)*)"/m);
  if (!titleMatch) {
    throw new Error("src/content/lokalerByer.ts: oslo.title not found");
  }

  const descMatch = block.match(
    /^\s*description:\s*\n\s*"((?:[^"\\]|\\.)*)"/m,
  );
  if (!descMatch) {
    throw new Error("src/content/lokalerByer.ts: oslo.description not found");
  }

  const faqStart = block.indexOf("faq: [");
  if (faqStart === -1) {
    throw new Error("src/content/lokalerByer.ts: oslo.faq not found");
  }
  const faqBlock = block.slice(faqStart);

  const faq = [];
  let match;
  while ((match = FAQ_ENTRY_RE.exec(faqBlock)) !== null) {
    faq.push({ q: unescape(match[1]), a: unescape(match[2]) });
  }

  if (faq.length === 0) {
    throw new Error("src/content/lokalerByer.ts: parsed zero oslo FAQ entries");
  }

  return {
    title: unescape(titleMatch[1]),
    description: unescape(descMatch[1]),
    faq,
  };
}
