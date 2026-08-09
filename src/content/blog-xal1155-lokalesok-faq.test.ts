import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_FAQ } from "./blogFaq.mjs";

/**
 * XAL-1155: pins the "lokalesøk" orientation post's FAQPage schema
 * (POST_FAQ, consumed by scripts/prerender.mjs and SEO.tsx) to the answer
 * text the reader actually sees in the article body, so a future edit to
 * either side can't silently desync them.
 */
describe("lokalesok-definisjoner-lokaletyper-priser FAQ schema", () => {
  const slug = "lokalesok-definisjoner-lokaletyper-priser";

  it("has a POST_FAQ entry answering the target query", () => {
    const entry = POST_FAQ[slug];
    expect(entry, `POST_FAQ["${slug}"] is missing — no FAQPage schema will render`).toBeDefined();
    expect(entry.length).toBeGreaterThan(0);
    expect(entry[0].question).toBe("Hva er lokalesøk?");
  });

  it("mirrors a matching Vanlige spørsmål section in the post body", () => {
    const raw = readFileSync(join(__dirname, "blog", `${slug}.md`), "utf-8");
    expect(raw).toContain("## Vanlige spørsmål");
    for (const { question, answer } of POST_FAQ[slug]) {
      expect(raw, `body is missing question: ${question}`).toContain(question);
      expect(raw, `body is missing answer: ${answer}`).toContain(answer);
    }
  });
});
