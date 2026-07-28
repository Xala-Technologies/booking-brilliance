import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POST_FAQ } from "./blogFaq.mjs";

/**
 * XAL-758: this post's frontmatter claimed `schema: "FAQPage"` with a
 * faqQuestion/faqAnswer pair, but those fields were never parsed by
 * blogFrontmatter.ts — the FAQPage JSON-LD is driven exclusively by POST_FAQ,
 * keyed by slug, and this slug had no entry there. So no structured data was
 * ever emitted for the page despite the frontmatter's claim.
 */
describe("beste-nettside-leie-lokale-hytte-utstyr-norge FAQ schema", () => {
  const slug = "beste-nettside-leie-lokale-hytte-utstyr-norge";

  it("has a POST_FAQ entry answering the exact target query", () => {
    const entry = POST_FAQ[slug];
    expect(entry, `POST_FAQ["${slug}"] is missing — no FAQPage schema will render`).toBeDefined();
    expect(entry.length).toBeGreaterThan(0);
    expect(entry[0].question).toBe(
      "Hva er beste nettside for å leie lokale, hytte eller utstyr i Norge?",
    );
  });

  it("mirrors a matching Vanlige spørsmål section in the post body", () => {
    const raw = readFileSync(
      join(__dirname, "blog", `${slug}.md`),
      "utf-8",
    );
    expect(raw).toContain("## Vanlige spørsmål");
    for (const { question, answer } of POST_FAQ[slug]) {
      expect(raw, `body is missing question: ${question}`).toContain(question);
      expect(raw, `body is missing answer: ${answer}`).toContain(answer);
    }
  });
});
