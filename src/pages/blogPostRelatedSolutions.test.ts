import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { getAllPosts } from "@/lib/posts";
import { relatedSolutions } from "@/pages/BlogPost";

const SOLUTION_PAGES: Array<{ href: string; match: RegExp }> = [
  { href: "/bookingsystem-kommune", match: /kommun|bookingsystem|it-leder|anbud|ssa-l|innkjøp|leverand/i },
  { href: "/bruksomrader/idrettshaller-gymsaler", match: /idrettshall|gymsal|sesong|hall|forening|trening|anlegg/i },
  { href: "/bruksomrader/moterom", match: /m(ø|o)terom|mote-?rom/i },
  { href: "/bruksomrader/selskapslokaler", match: /selskapslokale|bryllup|fest|selskap/i },
  { href: "/bruksomrader/kulturhus-kantiner", match: /kulturhus|kantine|konferanse|kultursal|arrangement/i },
];

function wouldHaveMatchedBeforeFallback(post: {
  slug: string;
  title: string;
  tag?: string;
  keywords?: string[];
}): boolean {
  const hay = [post.slug, post.title, post.tag ?? "", ...(post.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return SOLUTION_PAGES.some((s) => s.match.test(hay));
}

describe("relatedSolutions", () => {
  it("returns nothing when no SOLUTION_PAGES pattern matches", () => {
    const post = {
      slug: "leie-verktoy-og-maskiner-feil-vi-ser",
      title: "Leie verktøy og maskiner: fem feil vi ser",
      tag: "Privatperson",
      keywords: ["leie verktøy og maskiner"],
    };
    expect(relatedSolutions(post)).toEqual([]);
  });

  it("returns matched solution links unchanged (max two)", () => {
    const post = {
      slug: "system-for-innbyggere-booke-idrettshall-kommune",
      title: "System for innbyggere å booke idrettshall i kommunen",
      tag: "Kommune",
      keywords: ["idrettshall", "kommune"],
    };
    expect(relatedSolutions(post)).toEqual([
      { href: "/bookingsystem-kommune", labelKey: "blog.crumbMunicipal" },
      { href: "/bruksomrader/idrettshaller-gymsaler", labelKey: "blog.crumbHalls" },
    ]);
  });

  it("lists slugs that previously hit the generic fallback", () => {
    const fallbackSlugs = getAllPosts()
      .filter((p) => !wouldHaveMatchedBeforeFallback(p))
      .map((p) => p.slug)
      .sort();
    expect(fallbackSlugs).toContain("leie-verktoy-og-maskiner-feil-vi-ser");
    expect(fallbackSlugs).toContain("cateringbestilling-hva-er-med");
  });
});

describe("BlogPost Relevante løsninger aside (SSR)", () => {
  it("omits the aside and generic venue link when nothing matches", async () => {
    const route = "/blogg/leie-verktoy-og-maskiner-feil-vi-ser";
    const html = await render(route);
    expect(html).not.toContain('aria-label="Relevante løsninger"');
    expect(html).not.toContain("/booking-av-lokaler-og-moterom");
  });

  it("still renders the aside for a matching post", async () => {
    const route = "/blogg/system-for-innbyggere-booke-idrettshall-kommune";
    const html = await render(route);
    expect(html).toContain('aria-label="Relevante løsninger"');
    expect(html).toContain("/bruksomrader/idrettshaller-gymsaler");
  });
});
