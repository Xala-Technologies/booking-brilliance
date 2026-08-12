/**
 * What a route/hash change should scroll to.
 *
 * Extracted from ScrollToTop so the decision is testable without a DOM: the bug
 * below was a decision bug, and it survived in a component nobody could unit
 * test.
 *
 * THE BUG
 *
 * Every in-page FAQ anchor scrolled to the TOP of the page instead of to its
 * section. Measured on the live site: page at scrollY 800, click "Teknologi"
 * (target at 5631px), end at scrollY 0 with `location.hash === "#teknologi"`.
 *
 * Cause: the FAQ category nav uses plain `<a href="#teknologi">`, not a router
 * `<Link>`. A same-document hash navigation fires `hashchange` — which React
 * Router's `useLocation()` does not listen to. So the effect either never re-ran
 * or re-ran with a stale, empty hash, took the "no hash → go to top" branch, and
 * undid the browser's own anchor jump.
 *
 * It affected every anchor on the site, and it broke silently: the page moves,
 * so nothing looks frozen — you just land somewhere wrong and assume the link
 * was bad. That is also why the assistant's `/faq#samsvar` looked broken even
 * after it started emitting correct anchors.
 *
 * THE RULE
 *
 * Never scroll to top while a hash is present. The hash is an explicit request
 * for a position; overriding it is always wrong, and if the target element is
 * missing the honest response is to leave the scroll alone rather than yank the
 * reader somewhere they did not ask for.
 */

export type ScrollAction =
  /** Scroll the element matching the hash into view. */
  | { kind: "anchor"; id: string }
  /** Ordinary route change — go to the top. */
  | { kind: "top" }
  /** A hash is present but its element does not exist. Leave the page alone. */
  | { kind: "none" };

/**
 * Decide from the live hash, not from router state.
 *
 * `hash` should come from `window.location.hash` rather than `useLocation()`,
 * because a plain `<a href="#x">` updates the former and not necessarily the
 * latter — that mismatch is the bug.
 */
export function scrollActionFor(hash: string | undefined | null, elementExists: (id: string) => boolean): ScrollAction {
  const id = (hash ?? "").replace(/^#/, "").trim();
  if (!id) return { kind: "top" };
  // Decoded because a hash can arrive percent-encoded (e.g. Norwegian ids).
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    /* malformed escape — fall back to the raw value */
  }
  if (elementExists(decoded)) return { kind: "anchor", id: decoded };
  return { kind: "none" };
}
