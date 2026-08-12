import { describe, expect, it } from "vitest";
import { getAllPosts, postsForLocale, translatedPost } from "./posts";

describe("blog locale", () => {
  it("treats a post with no lang as Norwegian", () => {
    // 335 posts predate the English blog. A migration adding `lang: nb` to
    // every one would be pure diff noise and would break the moment one was
    // missed, so absence means Norwegian.
    const nb = postsForLocale("nb");
    expect(nb.length).toBeGreaterThan(300);
    expect(nb.every((p) => p.lang !== "en")).toBe(true);
  });

  it("keeps English posts out of the Norwegian index and vice versa", () => {
    // The two blogs share a directory. Listing everything on /blogg would put
    // English articles in a Norwegian index — worse for a reader than having
    // no English blog, and worse for search than either.
    const nb = postsForLocale("nb");
    const en = postsForLocale("en");
    expect(nb.length + en.length).toBe(getAllPosts().length);
    expect(nb.some((p) => en.includes(p))).toBe(false);
  });

  it("has no unpaired English post — a translation with no original", () => {
    for (const post of postsForLocale("en")) {
      expect(post.translationOf, `${post.slug} has no translationOf`).toBeTruthy();
      expect(translatedPost(post), `${post.slug} points at a missing original`).not.toBeNull();
    }
  });

  it("pairs in both directions when a twin exists", () => {
    for (const en of postsForLocale("en")) {
      const nb = translatedPost(en);
      if (!nb) continue;
      expect(translatedPost(nb)?.slug).toBe(en.slug);
    }
  });
});
