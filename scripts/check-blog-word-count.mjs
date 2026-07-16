// Guards against SEO's "content.thin" rule: every published blog post's
// markdown body must carry at least 200 words. Run as part of `pnpm build`
// so a thin or accidentally-empty post fails the build instead of shipping.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const MIN_WORDS = 200;

function bodyOf(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[2] : raw;
}

function wordCount(md) {
  return md.split(/\s+/).filter(Boolean).length;
}

async function main() {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md"));
  const thin = [];
  for (const file of files) {
    const raw = await fs.readFile(join(CONTENT_DIR, file), "utf-8");
    const words = wordCount(bodyOf(raw));
    if (words < MIN_WORDS) thin.push({ file, words });
  }

  if (thin.length > 0) {
    console.error(
      `\n✗ ${thin.length} blog post(s) have fewer than ${MIN_WORDS} words in the body (content.thin risk):`,
    );
    for (const { file, words } of thin) {
      console.error(`  - ${file}: ${words} words`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`✓ All ${files.length} blog posts have at least ${MIN_WORDS} words in the body.`);
}

main().catch((err) => {
  console.error("check-blog-word-count failed:", err?.message ?? err);
  process.exit(1);
});
