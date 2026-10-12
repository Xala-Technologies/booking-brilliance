import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { getAllPosts } from "@/lib/posts";
import {
  hidesRelevanteLosningerAside,
  relatedSolutions,
  solutionPagePatterns,
  type BlogPostSolutionMeta,
} from "@/lib/blogRelatedSolutions";

function matchesSolutionPage(post: BlogPostSolutionMeta): boolean {
  const hay = [post.slug, post.title, post.tag ?? "", ...(post.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return solutionPagePatterns().some((s) => s.match.test(hay));
}

describe("hidesRelevanteLosningerAside", () => {
  it("is true for Privatperson tag", () => {
    expect(
      hidesRelevanteLosningerAside({
        slug: "cateringbestilling-hva-er-med",
        title: "Cateringbestilling",
        tag: "Privatperson",
      }),
    ).toBe(true);
  });

  it("is true when slug/title/keywords match tool, service or equipment topics", () => {
    expect(
      hidesRelevanteLosningerAside({
        slug: "leie-verktoy-og-maskiner-feil-vi-ser",
        title: "Leie verktøy og maskiner",
        tag: "Utleier",
        keywords: ["leie maskiner verktøy"],
      }),
    ).toBe(true);
  });

  it("is false for other fallback posts", () => {
    expect(
      hidesRelevanteLosningerAside({
        slug: "barnebursdag-i-bekreftelsen",
        title: "Barnebursdag i bekreftelsen",
        tag: "Utleier",
      }),
    ).toBe(false);
  });
});

describe("relatedSolutions", () => {
  it("returns nothing for hidden fallback posts (tools and Privatperson catering)", () => {
    expect(
      relatedSolutions({
        slug: "leie-verktoy-og-maskiner-feil-vi-ser",
        title: "Leie verktøy og maskiner: fem feil vi ser",
        tag: "Privatperson",
        keywords: ["leie verktøy og maskiner"],
      }),
    ).toEqual([]);
    expect(
      relatedSolutions({
        slug: "cateringbestilling-hva-er-med",
        title: "Cateringbestilling: hva er med, hva er tilvalg?",
        tag: "Privatperson",
        keywords: ["cateringbestilling"],
      }),
    ).toEqual([]);
  });

  it("links other fallback posts directly to /bookingsystem-utleie", () => {
    expect(
      relatedSolutions({
        slug: "barnebursdag-i-bekreftelsen",
        title: "Barnebursdag i bekreftelsen",
        tag: "Utleier",
      }),
    ).toEqual([
      {
        href: "/bookingsystem-utleie",
        labelKey: "footer.bookingsystem_for_utleie",
      },
    ]);
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
});

describe("BlogPost Relevante løsninger aside (SSR)", () => {
  it("omits the aside for hidden fallback posts", async () => {
    for (const slug of [
      "leie-verktoy-og-maskiner-feil-vi-ser",
      "cateringbestilling-hva-er-med",
    ]) {
      const html = await render(`/blogg/${slug}`);
      expect(html).not.toContain('aria-label="Relevante løsninger"');
    }
  });

  it("renders fallback aside linking to /bookingsystem-utleie", async () => {
    const html = await render("/blogg/barnebursdag-i-bekreftelsen");
    expect(html).toContain('aria-label="Relevante løsninger"');
    expect(html).toContain("/bookingsystem-utleie");
    expect(html).not.toContain("/booking-av-lokaler-og-moterom");
  });

  it("still renders pattern-matched links unchanged", async () => {
    const route = "/blogg/system-for-innbyggere-booke-idrettshall-kommune";
    const html = await render(route);
    expect(html).toContain('aria-label="Relevante løsninger"');
    expect(html).toContain("/bruksomrader/idrettshaller-gymsaler");
  });
});

describe("relatedSolutions slug inventory", () => {
  it("partitions no-match posts into hidden vs utleie fallback", () => {
    const noMatch = getAllPosts().filter((p) => !matchesSolutionPage(p));
    const hidden = noMatch.filter((p) => hidesRelevanteLosningerAside(p)).map((p) => p.slug);
    const utleieFallback = noMatch
      .filter((p) => !hidesRelevanteLosningerAside(p))
      .map((p) => p.slug);
    expect(hidden).toContain("leie-verktoy-og-maskiner-feil-vi-ser");
    expect(hidden).toContain("cateringbestilling-hva-er-med");
    expect(utleieFallback).toContain("barnebursdag-i-bekreftelsen");
    expect(hidden.length + utleieFallback.length).toBe(noMatch.length);
  });
});
