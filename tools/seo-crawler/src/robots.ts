/**
 * Minimal robots.txt parser scoped to a single User-agent (we only ever
 * crawl as ourselves). Supports `Disallow` (most common) — enough to be a
 * good neighbour while auditing our own site.
 */

export interface RobotsRules {
  allowAll: boolean;
  disallows: string[];
}

export async function loadRobots(origin: string): Promise<RobotsRules> {
  const url = origin.replace(/\/$/, "") + "/robots.txt";
  try {
    const res = await fetch(url);
    if (!res.ok) return { allowAll: true, disallows: [] };
    const txt = await res.text();
    return parseRobots(txt);
  } catch {
    return { allowAll: true, disallows: [] };
  }
}

export function parseRobots(text: string): RobotsRules {
  const lines = text.split(/\r?\n/);
  const disallows: string[] = [];
  let inWildcard = false;
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.+)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      inWildcard = value === "*";
    } else if (inWildcard && key === "disallow") {
      if (value) disallows.push(value);
    }
  }
  return {
    allowAll: disallows.length === 0,
    disallows,
  };
}

export function isAllowed(rules: RobotsRules, path: string): boolean {
  if (rules.allowAll) return true;
  for (const rule of rules.disallows) {
    if (rule === "/") return false;
    if (path.startsWith(rule)) return false;
  }
  return true;
}
