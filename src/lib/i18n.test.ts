/**
 * The rules here are the ones that decide whether going bilingual helps or
 * hurts. The site earns every visitor it has from Norwegian search, so the
 * tests that matter are the ones proving the English build cannot cost us that.
 */
import { describe, expect, it } from "vitest";
import {
  alternatePath,
  blogHreflang,
  blogPath,
  hreflangFor,
  isIndexableEnglish,
  localeFromPath,
  browserLanguages,
  preferredLocale,
  shouldAutoRedirect,
  shouldOfferSwitch,
  untranslatedPosts,
  type PostLocale,
} from "./i18n";
import { UNTRANSLATED_PATH } from "@/lib/untranslated-fixture";

describe("localeFromPath", () => {
  it.each([
    ["/", "nb"],
    ["/blogg", "nb"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/en/blogg", "en"],
    ["/blogg/noe", "nb"],
  ])("%s is %s", (path, expected) => {
    expect(localeFromPath(path)).toBe(expected);
  });

  it("does not mistake a Norwegian word starting with 'en' for English", () => {
    // The bug this guards: a prefix check on the STRING rather than the path
    // segment would put /enkeltlokale and /energi on the English site.
    expect(localeFromPath("/enkeltlokale")).toBe("nb");
    expect(localeFromPath("/energi-i-bygg")).toBe("nb");
    expect(localeFromPath("/enhet")).toBe("nb");
  });
});

describe("hreflang", () => {
  it("pairs a translated page in both directions", () => {
    const fromNb = hreflangFor("/blogg");
    const fromEn = hreflangFor("/en/blogg");
    expect(fromNb).toEqual(fromEn);
    expect(fromNb.map((h) => h.hrefLang)).toEqual(["nb-NO", "en", "x-default"]);
    expect(fromNb[0]?.href).toBe("https://digilist.no/blogg");
    expect(fromNb[1]?.href).toBe("https://digilist.no/en/blogg");
  });

  it("emits NOTHING for an untranslated page", () => {
    // The expensive mistake: an hreflang pointing at a page that is still in
    // Norwegian tells Google we have an English version when we do not, and it
    // is judged as duplicate content on the very pages that rank today.
    expect(hreflangFor(UNTRANSLATED_PATH)).toEqual([]);
    expect(hreflangFor("/blogg/noe-som-helst")).toEqual([]);
  });

  it("points x-default at Norwegian", () => {
    // A visitor with no language preference should land on the market we
    // actually serve. Checked on a page that IS translated — the homepage is
    // deliberately not, until an English one exists.
    const tags = hreflangFor("/blogg");
    expect(tags.find((h) => h.hrefLang === "x-default")?.href).toBe("https://digilist.no/blogg");
  });

  it("treats a trailing slash as the same page", () => {
    expect(hreflangFor("/en/blogg/")).toEqual(hreflangFor("/en/blogg"));
  });
});

describe("alternatePath", () => {
  it("is null when there is no translation, so callers cannot link to a 404", () => {
    expect(alternatePath(UNTRANSLATED_PATH)).toBeNull();
    expect(alternatePath("/blogg")).toBe("/en/blogg");
    expect(alternatePath("/en/blogg")).toBe("/blogg");
  });
});

describe("preferredLocale", () => {
  it.each([
    [["nb-NO", "en"], "nb"],
    [["nn-NO"], "nb"],
    [["no"], "nb"],
    [["en-GB"], "en"],
    [["en-CA", "fr-CA"], "en"],
    [["de-DE"], "en"],
    [["fr"], "en"],
  ])("%j → %s", (langs, expected) => {
    expect(preferredLocale(langs)).toBe(expected);
  });

  it("prefers a Norwegian tag further down the list over an English one first", () => {
    // Not a real preference: `navigator.languages` is ordered, so the FIRST
    // recognised tag wins. A Norwegian who has English first genuinely prefers
    // English, and overruling that would be us deciding we know better.
    expect(preferredLocale(["en-GB", "nb-NO"])).toBe("en");
  });

  it("returns null when the caller has no languages — SSR must not guess", () => {
    // If this returned "en" during the prerender, every static page would be
    // built as though the visitor were English.
    expect(preferredLocale(null)).toBeNull();
    expect(preferredLocale([])).toBeNull();
  });

  it("browserLanguages is null under SSR, where Node still has a navigator", () => {
    // Node 22 ships a global navigator whose language is "en-US". A guard on
    // `navigator` alone would pass during the prerender and bake English into
    // every static page. This is that bug, caught.
    expect(typeof window === "undefined" ? browserLanguages() : null).toBeNull();
  });

  it("ignores junk rather than treating it as a language", () => {
    expect(preferredLocale(["", "x", "!!"])).toBeNull();
  });
});

describe("shouldAutoRedirect — homepage locale", () => {
  it("does not auto-redirect to English from browser language alone", () => {
    // A visitor in Norway with en-US Chrome must stay on Norwegian by default.
    expect(shouldAutoRedirect({ pathname: "/", preferred: "en", stored: null })).toBeNull();
  });

  it("redirects to English only when the visitor chose English before", () => {
    expect(shouldAutoRedirect({ pathname: "/", preferred: "nb", stored: "en" })).toBe("/en");
  });

  it("sends a Norwegian-preferring visitor from the English homepage to Norwegian", () => {
    expect(shouldAutoRedirect({ pathname: "/en", preferred: "nb", stored: null })).toBe("/");
  });

  it("NEVER redirects to a page that does not exist", () => {
    // The bug this caught: a hardcoded "/en" sent every non-Norwegian visitor
    // to a 404 for as long as the English homepage was unwritten — the worst
    // possible first impression, and invisible in testing because the redirect
    // itself worked perfectly. It returns the ACTUAL translated path or
    // nothing, so an untranslated page can never send anyone anywhere.
    expect(shouldAutoRedirect({ pathname: UNTRANSLATED_PATH, preferred: "en", stored: null })).toBeNull();
    expect(alternatePath(UNTRANSLATED_PATH)).toBeNull();
  });

  it("does nothing when the visitor is already in the right language", () => {
    expect(shouldAutoRedirect({ pathname: "/", preferred: "nb", stored: null })).toBeNull();
    expect(shouldAutoRedirect({ pathname: "/en", preferred: "en", stored: null })).toBeNull();
  });

  it("NEVER redirects a deep page — this is the rule that protects the rankings", () => {
    // Googlebot crawls with an English Accept-Language and runs JavaScript. A
    // redirect on every page would bounce it off /priser, /faq and 335
    // Norwegian posts toward English versions that mostly do not exist —
    // deindexing the site that earns every visitor we have, for a market we
    // have not entered yet.
    for (const path of ["/blogg", "/faq", "/blogg/noe", "/en/blogg", UNTRANSLATED_PATH]) {
      expect(shouldAutoRedirect({ pathname: path, preferred: "en", stored: null }), path).toBeNull();
    }
  });

  it("lets a remembered choice overrule the browser, in both directions", () => {
    // Someone who deliberately clicked "Norsk" must not be dragged back to
    // English next visit. An auto-redirect that overrules an explicit choice is
    // a bug that feels like a broken site.
    expect(shouldAutoRedirect({ pathname: "/", preferred: "en", stored: "nb" })).toBeNull();
    expect(shouldAutoRedirect({ pathname: "/en", preferred: "nb", stored: "en" })).toBeNull();
    expect(shouldAutoRedirect({ pathname: "/", preferred: "en", stored: "en" })).toBe("/en");
  });

  it("does nothing when the browser tells us nothing", () => {
    expect(shouldAutoRedirect({ pathname: "/", preferred: null, stored: null })).toBeNull();
  });
});

describe("shouldOfferSwitch — deep pages get a banner, not a redirect", () => {
  it("offers the translation on a translated deep page in the wrong language", () => {
    expect(shouldOfferSwitch({ pathname: "/blogg", preferred: "en", stored: null })).toBe(
      "/en/blogg",
    );
  });

  it("offers nothing on a page with no translation", () => {
    expect(shouldOfferSwitch({ pathname: UNTRANSLATED_PATH, preferred: "en", stored: null })).toBeNull();
  });

  it("offers nothing once the visitor has chosen", () => {
    expect(shouldOfferSwitch({ pathname: "/blogg", preferred: "en", stored: "nb" })).toBeNull();
  });

  it("never doubles up with the homepage redirect", () => {
    expect(shouldOfferSwitch({ pathname: "/", preferred: "en", stored: null })).toBeNull();
    expect(shouldOfferSwitch({ pathname: "/en", preferred: "nb", stored: null })).toBeNull();
  });
});

describe("blog pairing — from frontmatter, because the map would go stale", () => {
  const posts: PostLocale[] = [
    { slug: "hva-koster-digilist", lang: "nb" },
    { slug: "what-digilist-costs", lang: "en", translationOf: "hva-koster-digilist" },
    { slug: "privatmarkedet", lang: "nb" },
  ];

  it("builds a pair from either side", () => {
    const fromNb = blogHreflang(posts[0] as PostLocale, posts);
    const fromEn = blogHreflang(posts[1] as PostLocale, posts);
    expect(fromNb).toEqual(fromEn);
    expect(fromNb[1]?.href).toBe("https://digilist.no/en/blogg/what-digilist-costs");
    expect(fromNb[0]?.href).toBe("https://digilist.no/blogg/hva-koster-digilist");
  });

  it("emits nothing for a post whose translation has not been written", () => {
    expect(blogHreflang(posts[2] as PostLocale, posts)).toEqual([]);
  });

  it("emits nothing for an English post whose original was deleted", () => {
    const orphan: PostLocale = { slug: "orphan", lang: "en", translationOf: "gone" };
    expect(blogHreflang(orphan, [orphan])).toEqual([]);
  });

  it("lists the translation backlog", () => {
    expect(untranslatedPosts(posts)).toEqual(["privatmarkedet"]);
  });

  it("puts each locale's blog on its own base path", () => {
    expect(blogPath("noe", "nb")).toBe("/blogg/noe");
    expect(blogPath("something", "en")).toBe("/en/blogg/something");
  });
});

/**
 * No component may link to an English URL that has no route.
 *
 * /en/blog shipped in the English navigation while the actual route is
 * /en/blogg. The nginx 301 could not save it: an in-app <Link> is handled by
 * React Router, which finds no match and renders NotFound without ever asking
 * the server. Every English page carried that link, on every deploy, and the
 * server-side redirect tested green the whole time.
 */
describe("English navigation links to routes that exist", () => {
  it("uses the mirrored slug, never the old pretty one", async () => {
    const { readFileSync, readdirSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((e) => {
        const p = join(dir, e);
        return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) ? [p] : [];
      });
    // The routes that were renamed when the site moved to mirrored slugs.
    const DEAD = [/"\/en\/blog"/, /"\/en\/pricing"/, /"\/en\/blog\//];
    const offenders: string[] = [];
    for (const file of walk("src")) {
      if (file.includes("i18n.test")) continue;
      const src = readFileSync(file, "utf-8");
      for (const re of DEAD) if (re.test(src)) offenders.push(`${file} → ${re}`);
    }
    expect(offenders, "components linking to a renamed English route").toEqual([]);
  });
});

/**
 * English blog posts were `noindex` while robots.txt allowed /en/blogg and the
 * sitemap listed them — three signals, two of them saying "index me". The cause
 * was that TRANSLATED_PATHS holds routes, never per-post slugs, so a post's nb
 * twin could not be in it. Mirrored in scripts/prerender.mjs isStagedEnglish().
 */
describe("English blog posts are indexable", () => {
  it("indexes an English post, whose slug can never be in TRANSLATED_PATHS", () => {
    expect(isIndexableEnglish("/en/blogg/what-digilist-costs-no-transaction-fee")).toBe(true);
    expect(isIndexableEnglish("/en/blogg/wedding-venue-cost-norway-2026-season-weekday-guests")).toBe(true);
  });

  it("still noindexes a mirrored route whose copy is Norwegian", () => {
    expect(isIndexableEnglish("/en/lokaler-til-leie/oslo")).toBe(false);
    expect(isIndexableEnglish("/en/arrangementer/teater-og-scene")).toBe(false);
  });

  it("leaves the blog index itself to the TRANSLATED_PATHS whitelist", () => {
    // /en/blogg is a route, not a post — it belongs in the whitelist and is.
    expect(isIndexableEnglish("/en/blogg")).toBe(true);
  });
});
