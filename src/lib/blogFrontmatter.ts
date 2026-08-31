// Shared by src/lib/posts.ts (browser, metadata only) and the
// `virtual:blog-meta` Vite plugin (vite.config.ts, Node build-time). Kept
// dependency-free (no glob, no fs) so it's safe to import from both.

export interface BlogFrontmatter {
  slug: string;
  title: string;
  /** SERP / og:title when it must differ from the visible H1 (≤60 chars). */
  seoTitle?: string;
  description: string;
  /** When true, the article H1 lives in the markdown body (below the lead), not in the header. */
  h1InBody?: boolean;
  date: string;
  /** Last-substantially-updated date (ISO), for the Article schema's dateModified. */
  updated?: string;
  author: string;
  role?: string;
  readingMinutes?: number;
  tag?: string;
  cover?: string;
  keywords?: string[];
  /**
   * Which language the post is written in. Absent means Norwegian.
   *
   * Absence rather than a required field on purpose: 335 posts predate the
   * English blog, and a migration that rewrote every one of them to add
   * `lang: nb` would be 335 diffs of pure noise — and would break the moment
   * one was missed.
   */
  lang?: "nb" | "en";
  /**
   * English posts only: the slug of the Norwegian post this translates.
   *
   * The pairing lives on the TRANSLATION, so publishing one never edits the
   * original. That matters when the agent writes both — a run that produced
   * the English twin and then failed while rewriting the Norwegian frontmatter
   * would leave the original corrupted for a post that was already live.
   */
  translationOf?: string;
}

export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: string = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : [];
      continue;
    }
    if (/^-?\d+$/.test(value)) {
      data[key] = parseInt(value, 10);
      continue;
    }
    if (/^-?\d+\.\d+$/.test(value)) {
      data[key] = parseFloat(value);
      continue;
    }
    if (value === "true" || value === "false") {
      data[key] = value === "true";
      continue;
    }
    data[key] = value;
  }
  return { data, content: match[2] };
}

/** Derives a post's frontmatter fields from a raw .md file's contents. */
export function extractFrontmatter(path: string, raw: string): BlogFrontmatter {
  const { data } = parseFrontmatter(raw);
  const slug =
    (data.slug as string) ||
    path
      .split("/")
      .pop()!
      .replace(/\.md$/, "");
  return {
    slug,
    title: (data.title as string) || "",
    seoTitle: (data.seoTitle as string | undefined) || undefined,
    description: (data.description as string) || "",
    h1InBody: data.h1InBody === true ? true : undefined,
    date: data.date ? new Date(data.date as string).toISOString().slice(0, 10) : "",
    updated: data.updated
      ? new Date(data.updated as string).toISOString().slice(0, 10)
      : undefined,
    author: (data.author as string) || "",
    role: data.role as string | undefined,
    readingMinutes: data.readingMinutes as number | undefined,
    tag: data.tag as string | undefined,
    cover: data.cover as string | undefined,
    keywords: data.keywords as string[] | undefined,
    lang: data.lang === "en" ? "en" : undefined,
    translationOf: (data.translationOf as string | undefined) || undefined,
  };
}
