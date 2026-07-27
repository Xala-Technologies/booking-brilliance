import { describe, expect, it } from "vitest";
import { getPostBySlug } from "@/lib/postContent";
import { POST_FAQ } from "./blogFaq.mjs";

/**
 * XAL-739: AI answer engines weren't citing Digilist for "hva koster det å
 * leie et selskapslokale eller møterom" — pins the published answer page so a
 * future edit can't silently drop the query match or desync the FAQPage
 * schema (scripts/prerender.mjs) from the answer text the reader actually sees.
 */
describe("XAL-739 AEO answer page", () => {
  const slug = "hva-koster-det-a-leie-selskapslokale-eller-moterom";
  const query = "Hva koster det å leie et selskapslokale eller møterom?";

  it("title matches the target query verbatim", () => {
    const post = getPostBySlug(slug);
    expect(post, `post ${slug} should exist`).toBeDefined();
    expect(post!.title).toBe(query);
  });

  it("FAQ entry's question matches the target query, and its answer appears in the article body", () => {
    const post = getPostBySlug(slug);
    const faq = POST_FAQ[slug];
    expect(faq, `POST_FAQ should have an entry for ${slug}`).toBeDefined();
    expect(faq![0].question).toBe(query);
    expect(post!.content).toContain(faq![0].answer);
  });
});
