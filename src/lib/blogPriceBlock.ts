/**
 * Splits a blog post's markdown body at the `<!-- price-block: shared -->`
 * marker so `BlogPost.tsx` can render the shared `PricingSummaryBlock`
 * inline, exactly where the author placed the marker, instead of only ever
 * at the foot of the article.
 *
 * Matching is case-insensitive and tolerant of extra whitespace inside the
 * comment (`<!--price-block:shared-->`, `<!-- PRICE-BLOCK: SHARED -->`, …),
 * but intentionally naive about markdown structure: it does not parse fenced
 * code blocks, so a marker written literally inside a ``` fence would still
 * be treated as a split point. No post does this today; if one ever needs
 * to show the marker as a code sample, this function needs a fence-aware
 * scan before the regex search below.
 */
const PRICE_MARKER_RE = /<!--\s*price-block:\s*shared\s*-->/i;
const PRICE_MARKER_RE_GLOBAL = /<!--\s*price-block:\s*shared\s*-->/gi;

export interface SplitBodyAtPriceBlock {
  /** Markdown before the first marker (or the whole body, if none). */
  bodyBefore: string;
  /** Markdown after the first marker, with any further markers stripped. */
  bodyAfter: string;
  /** Whether a marker was found at all. */
  hasInlinePriceBlock: boolean;
}

/** Splits `markdown` at the first `price-block: shared` marker. Only the
 * first marker becomes a split point; any later marker in the remaining
 * text is a leftover (e.g. a duplicated marker) and is stripped rather than
 * rendered as literal HTML-comment text. */
export function splitBodyAtPriceBlock(markdown: string): SplitBodyAtPriceBlock {
  const markerIndex = markdown.search(PRICE_MARKER_RE);
  if (markerIndex < 0) {
    return { bodyBefore: markdown, bodyAfter: "", hasInlinePriceBlock: false };
  }
  const match = markdown.match(PRICE_MARKER_RE)!;
  const bodyBefore = markdown.slice(0, markerIndex).trimEnd();
  const bodyAfter = markdown
    .slice(markerIndex + match[0].length)
    .replace(PRICE_MARKER_RE_GLOBAL, "")
    // A stripped marker can leave behind the blank lines that separated it
    // from its neighbors (e.g. "Middle.\n\n<marker>\n\nAfter." → "Middle.\n\n\n\nAfter."
    // once just the marker is removed) — collapse those back to a single
    // markdown paragraph break.
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { bodyBefore, bodyAfter, hasInlinePriceBlock: true };
}
