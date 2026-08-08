import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Blog posts do not render tables.
 *
 * `.post-body` had no table styling at all, so a markdown table fell back to
 * the browser default inside a 68ch column: three columns of Norwegian prose
 * squeezed to unreadable width on desktop, and overflowing the viewport on
 * mobile. 30 of 192 published posts do this.
 *
 * Two shapes replace it, chosen from the data rather than from a setting:
 *
 *   numeric   → a bar chart. The figures are what the row is ABOUT, and a bar
 *               is read at a glance where a column of numbers is not.
 *   prose     → stacked blocks, one per row. 28 of the 30 tables are three
 *               columns of sentences; there is no chart of a sentence, and the
 *               reason those looked bad is that prose in a narrow column always
 *               will. Stacked, each row gets the full measure and the column
 *               header becomes its label, so nothing is lost on a phone.
 *
 * Cell contents are passed through as React nodes, never re-parsed, so links
 * and emphasis inside a cell survive. The numbers stay visible as text in both
 * shapes: tables earn citations from AI answer engines because their data is
 * extractable, and a chart that hides its figures in pixels would throw that
 * away to look nicer.
 */

/** The children of a `tr`, one entry per `th`/`td`, markdown intact. */
function cellsOf(row: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  const kids = isValidElement(row) ? (row as ReactElement<{ children?: ReactNode }>).props.children : null;
  Children.forEach(kids, (cell) => {
    if (isValidElement(cell)) out.push((cell as ReactElement<{ children?: ReactNode }>).props.children);
  });
  return out;
}

/** Every `tr` under a `thead`/`tbody`, flattened. */
function rowsOf(section: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  const kids = isValidElement(section) ? (section as ReactElement<{ children?: ReactNode }>).props.children : null;
  Children.forEach(kids, (row) => {
    if (isValidElement(row)) out.push(row);
  });
  return out;
}

/** Plain text of a React subtree — for measuring, never for rendering. */
function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

/**
 * A number a reader would recognise as one: 42, 1 200, 61 %, 4,5, kr 900.
 * Norwegian decimals use a comma and thousands use a space, so both count.
 */
function numberIn(text: string): number | null {
  const m = /-?\d[\d\s ]*(?:[.,]\d+)?/.exec(text.replace(/\s+/g, " ").trim());
  if (!m) return null;
  const n = Number(m[0].replace(/[\s ]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** The unit shown after a value, so the chart can label its axis honestly. */
function unitIn(text: string): string {
  if (/%/.test(text)) return "%";
  if (/\bkr\b|\bNOK\b/i.test(text)) return "kr";
  return "";
}

interface Parsed {
  headers: string[];
  rows: ReactNode[][];
}

/** Pull the header labels and body rows out of what react-markdown handed us. */
export function parseTable(children: ReactNode): Parsed {
  let headers: string[] = [];
  const rows: ReactNode[][] = [];
  Children.forEach(children, (section) => {
    if (!isValidElement(section)) return;
    const tag = (section as ReactElement).type;
    const isHead = tag === "thead";
    for (const row of rowsOf(section)) {
      const cells = cellsOf(row);
      if (isHead && !headers.length) headers = cells.map(textOf);
      else rows.push(cells);
    }
  });
  return { headers, rows };
}

/**
 * Is this table a set of measurements?
 *
 * Every body row must be a label followed by exactly one readable number, and
 * there must be at least two rows to compare. Anything looser turns a table of
 * deadlines ("3-6 uker før") into a bar chart of the number 3, which is worse
 * than the table it replaced.
 */
export function isChartable(parsed: Parsed): boolean {
  if (parsed.rows.length < 2) return false;
  return parsed.rows.every((cells) => {
    if (cells.length !== 2) return false;
    const label = textOf(cells[0]).trim();
    const value = textOf(cells[1]).trim();
    if (!label || !value) return false;
    if (numberIn(value) === null) return false;
    // The value cell must be MOSTLY the number, not a sentence containing one.
    return value.replace(/[-\d\s .,%]|kr|NOK/gi, "").length <= 2;
  });
}

function Bars({ parsed }: { parsed: Parsed }) {
  const points = parsed.rows.map((cells) => ({
    label: textOf(cells[0]).trim(),
    text: textOf(cells[1]).trim(),
    value: numberIn(textOf(cells[1])) ?? 0,
  }));
  const unit = unitIn(points.map((p) => p.text).join(" "));
  const max = Math.max(...points.map((p) => Math.abs(p.value)), 1);
  const caption = parsed.headers.length === 2 ? `${parsed.headers[0]} / ${parsed.headers[1]}` : "";

  return (
    <figure className="my-8">
      {caption && (
        <figcaption className="editorial-mono-caption text-accent-text mb-4">{caption}</figcaption>
      )}
      <ul className="flex flex-col gap-4 m-0 p-0 list-none">
        {points.map((p, i) => (
          <li key={`${p.label}-${i}`} className="list-none m-0 p-0">
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <span className="text-[0.95rem] leading-snug text-ink">{p.label}</span>
              <span className="text-[0.95rem] tabular-nums font-semibold text-ink whitespace-nowrap">
                {p.text}
              </span>
            </div>
            <div className="h-2 w-full rounded-sm overflow-hidden bg-paper-deep">
              <div
                className="h-full rounded-sm bg-[hsl(var(--accent-text))]"
                style={{ width: `${Math.max(2, (Math.abs(p.value) / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {unit && (
        <p className="editorial-mono-caption text-ink-soft mt-3 mb-0">Målt i {unit}</p>
      )}
    </figure>
  );
}

function Stacked({ parsed }: { parsed: Parsed }) {
  return (
    <div className="my-8 flex flex-col gap-5">
      {parsed.rows.map((cells, r) => (
        <div key={r} className="border-l-2 border-rule pl-5 py-1">
          {cells.map((cell, c) => {
            const label = parsed.headers[c] ?? "";
            const isTitle = c === 0;
            if (isTitle) {
              return (
                <p
                  key={c}
                  className="text-ink font-semibold text-[1.05rem] leading-snug m-0 mb-2"
                >
                  {cell}
                </p>
              );
            }
            return (
              <div key={c} className="mt-3 first:mt-0">
                {label && (
                  <span className="block editorial-mono-caption text-accent-text mb-1">{label}</span>
                )}
                <div className="text-[1.0625rem] leading-relaxed text-ink-soft">{cell}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Drop-in replacement for the `table` element in blog markdown. */
export default function BlogTable({ children }: { children?: ReactNode }) {
  const parsed = parseTable(children);
  if (!parsed.rows.length) return null;
  return isChartable(parsed) ? <Bars parsed={parsed} /> : <Stacked parsed={parsed} />;
}
