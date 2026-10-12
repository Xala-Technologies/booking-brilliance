/** Commercial landing pages linked from blog posts when slug/title/tag/keywords match. */
const SOLUTION_PAGES: Array<{ href: string; labelKey: string; match: RegExp }> = [
  { href: "/bookingsystem-kommune", labelKey: "blog.crumbMunicipal", match: /kommun|bookingsystem|it-leder|anbud|ssa-l|innkjøp|leverand/i },
  { href: "/bruksomrader/idrettshaller-gymsaler", labelKey: "blog.crumbHalls", match: /idrettshall|gymsal|sesong|hall|forening|trening|anlegg/i },
  { href: "/bruksomrader/moterom", labelKey: "blog.crumbMeeting", match: /m(ø|o)terom|mote-?rom/i },
  { href: "/bruksomrader/selskapslokaler", labelKey: "blog.crumbFunction", match: /selskapslokale|bryllup|fest|selskap/i },
  { href: "/bruksomrader/kulturhus-kantiner", labelKey: "blog.crumbCulture", match: /kulturhus|kantine|konferanse|kultursal|arrangement/i },
];

const FALLBACK_UTLEIE = {
  href: "/bookingsystem-utleie",
  labelKey: "footer.bookingsystem_for_utleie",
} as const;

/** Tool, service and equipment topics in slug, title or keywords (not tag). */
const TOOL_SERVICE_EQUIPMENT_TOPIC =
  /verktøy|verktoy|maskin|catering|band|utstyr/i;

export type BlogPostSolutionMeta = {
  slug: string;
  title: string;
  tag?: string;
  keywords?: string[];
};

function solutionHaystack(post: BlogPostSolutionMeta): string {
  return [post.slug, post.title, post.tag ?? "", ...(post.keywords ?? [])]
    .join(" ")
    .toLowerCase();
}

/**
 * When no SOLUTION_PAGES pattern matches, omit «Relevante løsninger» for
 * Privatperson posts and for tool/service/equipment topics.
 */
export function hidesRelevanteLosningerAside(post: BlogPostSolutionMeta): boolean {
  if (post.tag === "Privatperson") return true;
  const topicHay = [post.slug, post.title, ...(post.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return TOOL_SERVICE_EQUIPMENT_TOPIC.test(topicHay);
}

export function relatedSolutions(
  post: BlogPostSolutionMeta,
): Array<{ href: string; labelKey: string }> {
  const hay = solutionHaystack(post);
  const hits = SOLUTION_PAGES.filter((s) => s.match.test(hay)).map(
    ({ href, labelKey }) => ({ href, labelKey }),
  );
  if (hits.length) return hits.slice(0, 2);
  if (hidesRelevanteLosningerAside(post)) return [];
  return [{ ...FALLBACK_UTLEIE }];
}

/** For tests and PR reporting: posts with no pattern match. */
export function solutionPagePatterns(): ReadonlyArray<{ match: RegExp }> {
  return SOLUTION_PAGES;
}
