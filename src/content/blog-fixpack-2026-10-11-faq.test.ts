import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_FAQ } from "./blogFaq.mjs";

const slugs = [
  "leie-verktoy-og-maskiner-feil-vi-ser",
  "cateringbestilling-hva-er-med",
] as const;

describe("fix pack 2026-10-11 FAQ body ↔ POST_FAQ", () => {
  for (const slug of slugs) {
    it(`${slug}: visible body FAQ matches POST_FAQ (${POST_FAQ[slug]?.length ?? 0} pairs)`, () => {
      const entry = POST_FAQ[slug];
      expect(entry, `POST_FAQ["${slug}"] is missing`).toBeDefined();
      expect(entry!.length).toBe(5);

      const raw = readFileSync(join(__dirname, "blog", `${slug}.md`), "utf-8");
      expect(raw).toContain("## Ofte stilte spørsmål");
      for (const { question, answer } of entry!) {
        expect(raw, `body is missing question: ${question}`).toContain(question);
        expect(raw, `body is missing answer: ${answer}`).toContain(answer);
      }
    });
  }
});
