import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/posts";

/**
 * This description is written verbatim into <meta name="description">,
 * og:description and twitter:description at build time (scripts/prerender.mjs).
 * A description over ~160 chars gets truncated by Google and other consumers.
 */
describe("leie-selskapslokale-bryllup-fest meta description", () => {
  it("is under 160 characters", () => {
    const post = getAllPosts().find((p) => p.slug === "leie-selskapslokale-bryllup-fest");
    expect(post).toBeDefined();
    expect(post!.description.length).toBeLessThan(160);
  });
});
