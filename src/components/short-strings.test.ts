import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Norwegian words too short for `check:english` to see.
 *
 * That checker reads the built HTML and flags *runs* of Norwegian function
 * words, which is the right shape for prose and blind to a two-word control
 * label. It reported /en/book-demo as clean while the required venue-type
 * select on that page showed "Velg …" — on the form an English visitor has to
 * submit to become a lead.
 *
 * So this checks the source instead: no bare Norwegian string literal may sit
 * in a component's JSX. The list is the short UI words the prose checker
 * cannot reach, not a dictionary — anything longer is already covered.
 */
const SHORT_NORWEGIAN = [
  "Velg", "Lukk", "Neste", "Forrige", "Søk", "Send", "Avbryt", "Lagre",
  "Tilbake", "Meny", "Åpne", "Les mer", "Vis alle", "Se alle", "Hjem",
  "Kontakt oss", "Last ned", "Prøv igjen", "Laster", "Ingen treff",
];

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return tsxFiles(p);
    return e.name.endsWith(".tsx") && !e.name.includes(".test.") ? [p] : [];
  });
}

describe("short Norwegian UI words never reach a shared component", () => {
  const files = [...tsxFiles("src/components"), ...tsxFiles("src/pages")];

  for (const word of SHORT_NORWEGIAN) {
    it(`"${word}" is not a bare JSX literal anywhere`, () => {
      // A JSX text node, i.e. the word alone on its own line between tags.
      const asJsxText = new RegExp(`^\\s*${word}\\s*(…|\\.\\.\\.)?\\s*$`);
      const offenders = files.filter((f) => {
        const src = readFileSync(f, "utf8");
        // Only components that render in both languages can leak; a page still
        // awaiting translation is Norwegian on purpose and is not the bug.
        if (!src.includes('from "@/lib/copy"')) return false;
        return src.split("\n").some((line) => asJsxText.test(line));
      });
      expect(offenders, `hardcoded "${word}" in: ${offenders.join(", ")}`).toEqual([]);
    });
  }
});
