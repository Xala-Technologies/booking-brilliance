/**
 * Tiny persistent state for the PR-review agent: which PR head commit we last
 * reviewed, so re-runs skip unchanged PRs but re-review when new commits land.
 * A single gitignored JSON file (survives the VPS `git reset --hard`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "..", "state");
const FILE = path.join(DIR, "reviews.json");

interface Reviewed {
  headOid: string;
  url: string;
  reviewed_at: string;
  blocking: boolean;
}

export class ReviewStore {
  private data: Record<string, Reviewed>;
  private constructor(data: Record<string, Reviewed>) {
    this.data = data;
  }
  static load(): ReviewStore {
    try {
      return new ReviewStore(JSON.parse(fs.readFileSync(FILE, "utf-8")));
    } catch {
      return new ReviewStore({});
    }
  }
  /** True if we already reviewed this exact head commit. */
  reviewedAt(key: string, headOid: string): boolean {
    return this.data[key]?.headOid === headOid;
  }
  record(key: string, r: Reviewed): void {
    this.data[key] = r;
  }
  save(): void {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FILE, `${JSON.stringify(this.data, null, 2)}\n`, "utf-8");
  }
}
