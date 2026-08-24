import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BRAND_MENTIONS, entityLD } from "@/content/entity.mjs";

/**
 * BRAND_MENTIONS is a list of LINKS, on every page of digilist.no at once.
 *
 * A bad URL here is a dead link on the whole site, and it is invisible to a
 * human reading the page, because these URLs only appear inside a
 * <script type="application/ld+json">. That is how https://peppol.eu survived:
 * the apex has no DNS A record, while the peppol.eu SUBdomains the docs link
 * (docs., directory.) resolve fine, so the dead apex read as obviously correct
 * to anyone eyeballing it. geoqa found it from the outside, by resolving the
 * page's links (issue #299).
 *
 * This test used to compare two copies of the list — one in
 * `src/components/SEO.tsx`, one in `scripts/prerender.mjs` — because the
 * JSON-LD has to exist in the HTML before any JavaScript runs AND after
 * hydration replaces it. The copies are gone: both now build from
 * `src/content/entity.mjs`, so there is one list to check. The second half of
 * this file pins that consolidation, so the duplication cannot come back
 * unnoticed.
 */
describe("BRAND_MENTIONS URLs", () => {
  const urls = BRAND_MENTIONS.map((m) => m.url);

  it("is a non-empty list", () => {
    expect(urls.length).toBeGreaterThan(0);
  });

  // The apex, exactly — https://docs.peppol.eu and https://directory.peppol.eu
  // are real hosts and stay allowed.
  it("does not link the peppol.eu apex, which does not resolve", () => {
    expect(urls.filter((u) => /^https?:\/\/peppol\.eu(\/|$)/.test(u))).toEqual([]);
  });

  it("are absolute https URLs with a host", () => {
    for (const url of urls) {
      expect(url, `${url} is not an absolute https URL`).toMatch(
        /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$)/,
      );
    }
  });
});

/**
 * The entity graph must not be written twice.
 *
 * Two copies is how the prerendered SoftwareApplication ended up advertising a
 * bare `price: "0"` while the hydrated one carried a priceSpecification — the
 * same @id describing itself two ways depending on whether JavaScript had run.
 * An answer engine reading both surfaces of digilist.no saw two Digilists.
 */
describe("the entity graph has one source", () => {
  const COPIES = ["src/components/SEO.tsx", "scripts/prerender.mjs"];

  for (const file of COPIES) {
    it(`${file} builds it from src/content/entity.mjs`, () => {
      const src = readFileSync(file, "utf8");
      expect(src, `${file} no longer imports the shared entity`).toMatch(
        /import \{[^}]*entityLD[^}]*\} from "[^"]*content\/entity\.mjs"/,
      );
      // A second literal graph in either file is the drift starting again.
      expect(src.includes('"@type": "SoftwareApplication"')).toBe(false);
      expect(src.includes("const BRAND_MENTIONS = [")).toBe(false);
    });
  }
});

/**
 * The nodes that ground the entity. These are the fields an answer engine uses
 * to decide that "Digilist" the query and Digilist the company are the same
 * thing, and each was missing when the AI Overview for our own brand name
 * cited everyone but us.
 */
describe("Organization identifies a real, checkable company", () => {
  const org = entityLD("nb")[0];

  it("states the registered legal name, not just the brand", () => {
    expect(org.name).toBe("Digilist");
    expect(org.legalName).toBe("Xala Technologies AS");
  });

  it("does not claim to be its own parent", () => {
    // `parentOrganization: Xala Technologies AS` on a node whose legalName IS
    // Xala Technologies AS declared a second entity that is the parent of
    // itself. legalName says the same true thing without inventing a company.
    expect(org.parentOrganization).toBeUndefined();
  });

  it("carries the address, the org.nr. and a way to reach a human", () => {
    expect(org.address.streetAddress).toBe("Nesbruveien 75");
    expect(org.address.postalCode).toBe("1394");
    expect(org.identifier.value).toBe("920972454");
    expect(org.email).toBe("kontakt@digilist.no");
  });

  it("answers 'what is Digilist' in its own description", () => {
    expect(org.description).toMatch(/^Digilist er /);
  });

  it("links the official company register", () => {
    expect(org.sameAs).toContain(
      "https://virksomhet.brreg.no/nb/oppslag/enheter/920972454",
    );
  });
});

describe("the entity describes itself the same way everywhere", () => {
  it("Organization, WebSite and SoftwareApplication share one description", () => {
    const [org, site, software] = entityLD("nb");
    expect(site.description).toBe(org.description);
    expect(software.description).toBe(org.description);
  });

  it("the description does not change from page to page", () => {
    // It used to be the current route's <meta name="description">, so the one
    // #software entity described itself differently on all ~460 URLs.
    const [, , a] = entityLD("nb");
    const [, , b] = entityLD("nb");
    expect(a.description).toBe(b.description);
  });

  it("an English page gets the English wording, same entity", () => {
    const [nb] = entityLD("nb");
    const [en] = entityLD("en");
    expect(en["@id"]).toBe(nb["@id"]);
    expect(en.description).toMatch(/^Digilist is /);
  });
});
