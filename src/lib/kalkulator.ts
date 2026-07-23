/**
 * Pure calculation logic for the free tools (/verktoy/*). Honest by design:
 * every number is a RANGE derived from the same GUIDANCE pointers used across
 * the site (lokalerByer.ts), adjusted by transparent, labelled factors — never
 * a fabricated exact price. The capacity math uses stated, standard planning
 * ratios. No network, no data source beyond these public pointers.
 */

export interface Lokaltype {
  key: string;
  label: string;
  priceLow: number; // kr, base range (matches GUIDANCE)
  priceHigh: number;
  unit: string; // "dag" | "arrangement" | "time"
  capMin: number;
  capMax: number; // 0 = open (idrettshall: lag/grupper)
  link: string; // relevant /leie/* page
}

// Same pointers as GUIDANCE in src/content/lokalerByer.ts — kept honest + in sync.
export const LOKALTYPER: Lokaltype[] = [
  { key: "selskapslokale", label: "Selskapslokale / festlokale", priceLow: 5000, priceHigh: 30000, unit: "dag", capMin: 30, capMax: 150, link: "/leie/selskapslokale" },
  { key: "grendehus", label: "Grendehus / foreningslokale", priceLow: 1000, priceHigh: 5000, unit: "dag", capMin: 40, capMax: 120, link: "/leie/kulturhus" },
  { key: "moterom", label: "Møterom", priceLow: 300, priceHigh: 2500, unit: "dag", capMin: 4, capMax: 20, link: "/leie/moterom" },
  { key: "konferanselokale", label: "Konferanselokale", priceLow: 2000, priceHigh: 15000, unit: "dag", capMin: 20, capMax: 200, link: "/leie/konferanselokale" },
  { key: "kulturhus", label: "Kulturhus / storsal", priceLow: 3000, priceHigh: 20000, unit: "arrangement", capMin: 50, capMax: 400, link: "/leie/kulturhus" },
  { key: "idrettshall", label: "Idrettshall", priceLow: 200, priceHigh: 1500, unit: "time", capMin: 0, capMax: 0, link: "/leie/idrettshall" },
];

// City price factors — a rough, honest pointer (bigger/pressured markets cost more).
export const BYER = [
  { key: "oslo", label: "Oslo", factor: 1.15 },
  { key: "bergen", label: "Bergen", factor: 1.05 },
  { key: "trondheim", label: "Trondheim", factor: 1.0 },
  { key: "stavanger", label: "Stavanger", factor: 1.05 },
  { key: "kristiansand", label: "Kristiansand", factor: 0.95 },
  { key: "tromso", label: "Tromsø", factor: 1.0 },
  { key: "drammen", label: "Drammen", factor: 0.9 },
  { key: "baerum", label: "Bærum", factor: 1.05 },
  { key: "annet", label: "Annet / mindre sted", factor: 0.85 },
];

export interface PriceInput {
  lokaltype: string;
  gjester: number;
  by: string;
  helg: boolean;
  hoysesong: boolean;
}

export interface PriceEstimate {
  low: number;
  high: number;
  unit: string;
  typeLabel: string;
  link: string;
  factors: string[];
}

function roundKr(v: number): number {
  if (v < 1000) return Math.max(50, Math.round(v / 50) * 50);
  return Math.round(v / 100) * 100;
}

export function pct(factor: number): string {
  const p = Math.round((factor - 1) * 100);
  return `${p >= 0 ? "+" : ""}${p}%`;
}

export function estimatePrice(inp: PriceInput): PriceEstimate | null {
  const t = LOKALTYPER.find((x) => x.key === inp.lokaltype);
  if (!t) return null;
  const by = BYER.find((x) => x.key === inp.by) ?? BYER[BYER.length - 1];
  const factors: string[] = [`${by.label} (${pct(by.factor)})`];
  let f = by.factor;
  if (inp.helg) {
    f *= 1.15;
    factors.push("Helg (+15%)");
  } else {
    f *= 0.95;
    factors.push("Hverdag (−5%)");
  }
  if (inp.hoysesong) {
    f *= 1.1;
    factors.push("Høysesong mai–sep (+10%)");
  } else {
    factors.push("Lavsesong (0%)");
  }
  let low = t.priceLow * f;
  const high = t.priceHigh * f;
  // If we know the guest count, nudge the low end up when the party fills the room.
  if (t.capMax > 0 && inp.gjester > 0) {
    const pos = Math.min(1, Math.max(0, (inp.gjester - t.capMin) / Math.max(1, t.capMax - t.capMin)));
    low = low + (high - low) * pos * 0.4;
    factors.push(`${inp.gjester} gjester`);
  }
  return { low: roundKr(low), high: roundKr(high), unit: t.unit, typeLabel: t.label, link: t.link, factors };
}

/** Lokaltyper whose capacity fits the guest count (open-capacity types always qualify). */
export function suitableTypes(gjester: number): Lokaltype[] {
  if (!gjester || gjester <= 0) return [];
  return LOKALTYPER.filter((t) => t.capMax === 0 || (gjester >= Math.floor(t.capMin * 0.5) && gjester <= t.capMax));
}

// Standard, stated planning ratios (m² per person) by seating layout.
export const OPPSETT = [
  { key: "middag", label: "Sittende middag (runde bord)", low: 1.5, high: 2.0 },
  { key: "mingling", label: "Mingling / stående mottakelse", low: 0.8, high: 1.0 },
  { key: "klasserom", label: "Klasserom / kurs (bord + stoler)", low: 2.0, high: 2.5 },
  { key: "kino", label: "Kino / teater (stolrader)", low: 0.8, high: 1.2 },
];

// Occasion → the layout most people use for it (a suggestion the user can change).
export const ARRANGEMENT = [
  { key: "bryllup", label: "Bryllup", oppsett: "middag" },
  { key: "konfirmasjon", label: "Konfirmasjon", oppsett: "middag" },
  { key: "firmafest", label: "Firmafest / julebord", oppsett: "middag" },
  { key: "mote", label: "Møte", oppsett: "klasserom" },
  { key: "konferanse", label: "Konferanse", oppsett: "kino" },
  { key: "mingling", label: "Mingling / mottakelse", oppsett: "mingling" },
];

export interface CapInput {
  gjester: number;
  oppsett: string;
}

export interface CapEstimate {
  areaLow: number;
  areaHigh: number;
  ratioLow: number;
  ratioHigh: number;
  oppsettLabel: string;
  types: Lokaltype[];
}

export function estimateCapacity(inp: CapInput): CapEstimate | null {
  const o = OPPSETT.find((x) => x.key === inp.oppsett);
  if (!o || !inp.gjester || inp.gjester <= 0) return null;
  return {
    areaLow: Math.round(inp.gjester * o.low),
    areaHigh: Math.round(inp.gjester * o.high),
    ratioLow: o.low,
    ratioHigh: o.high,
    oppsettLabel: o.label,
    types: suitableTypes(inp.gjester),
  };
}

export function kr(v: number): string {
  return v.toLocaleString("nb-NO");
}
