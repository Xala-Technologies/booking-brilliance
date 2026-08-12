import { Link } from "react-router-dom";
import {
  GlassWater,
  TreePine,
  Dumbbell,
  Music,
  PartyPopper,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { getFraunces } from "@/lib/fonts";
import { SectionHeader } from "@/components/SectionHeader";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { bundledSrcSet, bundledWebpSrcSet } from "@/components/CategoryVisual";

interface Tile {
  titleKey: string;
  tagKey: string;
  to: string;
  image: string;
  Icon: LucideIcon;
}

// The five consumer marketplaces (the "Finn" menu). Homepage counterpart to
// the kommune/platform content below, so digilist.no covers both audiences.
// Exported so tests can confirm every tile's webp srcset entry is actually
// committed (see src/lib/webp-sources.test.ts).
export const TILES: Tile[] = [
  {
    titleKey: "market.tile.venues",
    tagKey: "market.tile.venues.tag",
    to: "/leie",
    image: "/images/cat/selskapslokale.jpg",
    Icon: GlassWater,
  },
  {
    titleKey: "market.tile.stays",
    tagKey: "market.tile.stays.tag",
    to: "/overnatting",
    image: "/images/cat/hytte.jpg",
    Icon: TreePine,
  },
  {
    titleKey: "market.tile.sport",
    tagKey: "market.tile.sport.tag",
    to: "/leie/idrettshall",
    image: "/images/cat/idrettshall.jpg",
    Icon: Dumbbell,
  },
  {
    titleKey: "market.tile.events",
    tagKey: "market.tile.events.tag",
    to: "/arrangementer",
    image: "/images/cat/konsert.jpg",
    Icon: Music,
  },
  {
    titleKey: "market.tile.equipment",
    tagKey: "market.tile.equipment.tag",
    to: "/utstyr",
    image: "/images/cat/festutstyr.jpg",
    Icon: PartyPopper,
  },
  {
    titleKey: "market.tile.services",
    tagKey: "market.tile.services.tag",
    to: "/tjenester",
    image: "/images/cat/dekor.jpg",
    Icon: Sparkles,
  },
];


/** Keep a link inside the visitor's language. Every route is mirrored. */
function localeHref(href: string, locale: "nb" | "en"): string {
  if (locale !== "en" || !href.startsWith("/") || href.startsWith("/en")) return href;
  return href === "/" ? "/en" : `/en${href}`;
}

const MarketplaceSection = () => {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <section id="marketplace" className="py-10 lg:py-14 bg-paper">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label={t(locale, "market.label")}
          intro={t(locale, "market.intro")}
        >
          {t(locale, "market.headline")}{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            {t(locale, "market.headlineEm")}
          </em>
          .
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {TILES.map((tile) => {
            const Icon = tile.Icon;
            return (
              <Link
                key={tile.to}
                to={localeHref(tile.to, locale)}
                className="group block rounded-2xl border border-rule bg-paper p-1.5 lg:p-2 shadow-md transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-2xl hover:border-accent-text/40"
              >
                <div
                  className="relative overflow-hidden rounded-xl ring-1 ring-ink/10"
                  style={{ aspectRatio: "16 / 10" }}
                >
                <picture>
                  <source
                    type="image/webp"
                    srcSet={bundledWebpSrcSet(tile.image)}
                    sizes="(min-width: 640px) 45vw, 90vw"
                  />
                  <img
                    src={tile.image}
                    srcSet={bundledSrcSet(tile.image)}
                    sizes="(min-width: 640px) 45vw, 90vw"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5"
                />
                <div className="absolute inset-0 p-4 lg:p-5 flex flex-col justify-between">
                  <span className="self-start inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-navy shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3
                      className="font-serif text-2xl lg:text-3xl text-white leading-tight"
                      style={{
                        fontVariationSettings: getFraunces("sub"),
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {t(locale, tile.titleKey)}
                    </h3>
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-white/70">
                      {t(locale, tile.tagKey)}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-white">
                      Finn
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
