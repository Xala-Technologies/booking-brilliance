/**
 * /admin/intelligence/issues — "Hva gikk galt" issue feed.
 * Click a row to open the AI fix recommendation drawer.
 */
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Loader2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUDIT_LABEL,
  AUTH_KEY,
  SURFACE_LABEL,
  type IntelligenceCtx,
  type IssueFeedItem,
} from "./intelligence-shared";

interface AiRecommendation {
  recommendation: string;
  model: string;
  generatedAt: string;
}

export default function IntelligenceIssues() {
  const { snap } = useOutletContext<IntelligenceCtx>();
  const [filter, setFilter] = useState<"all" | "error" | "warn" | "info">(
    "error",
  );
  const [surface, setSurface] = useState<string>("all");
  const [active, setActive] = useState<IssueFeedItem | null>(null);

  const issues = snap?.issues ?? [];
  const surfaces = useMemo(() => {
    const s = new Set<string>();
    for (const i of issues) s.add(i.surface);
    return Array.from(s).sort();
  }, [issues]);

  const visible = useMemo(
    () =>
      issues.filter(
        (i) =>
          (filter === "all" || i.severity === filter) &&
          (surface === "all" || i.surface === surface),
      ),
    [issues, filter, surface],
  );

  const counts = useMemo(
    () => ({
      all: issues.length,
      error: issues.filter((i) => i.severity === "error").length,
      warn: issues.filter((i) => i.severity === "warn").length,
      info: issues.filter((i) => i.severity === "info").length,
    }),
    [issues],
  );

  return (
    <div>
      <header className="mb-10">
        <p className="editorial-mono-caption text-accent-text mb-2">
          ISSUE-FEED
        </p>
        <h2
          className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
          style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
        >
          Hva gikk galt
        </h2>
        <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
          Issue-feed på tvers av økosystemet, rangert etter alvorlighetsgrad.
          Klikk en rad for AI-anbefaling om fiks — automatisk generert med
          kontekst fra hele systemet.
        </p>
      </header>

      <section className="mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {(
            [
              { key: "error", label: "Errors", tone: "text-red-700", sub: "Krever handling" },
              { key: "warn", label: "Warnings", tone: "text-amber-700", sub: "Anbefalt utbedring" },
              { key: "info", label: "Info", tone: undefined, sub: "Til kjennskap" },
              { key: "all", label: "Totalt", tone: undefined, sub: "Alle issues" },
            ] as const
          ).map((k) => (
            <button
              key={k.key}
              type="button"
              onClick={() => setFilter(k.key)}
              className={cn(
                "bg-paper p-6 lg:p-7 flex flex-col gap-2 text-left transition-colors",
                filter === k.key ? "ring-2 ring-navy ring-inset" : "hover:bg-paper-deep/40",
              )}
            >
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                {k.label}
              </p>
              <p
                className={cn(
                  "font-serif text-5xl lg:text-6xl font-medium leading-none mt-1",
                  k.tone ?? "text-ink",
                  counts[k.key] === 0 && "text-ink-faint",
                )}
              >
                {counts[k.key]}
              </p>
              <p className="text-xs text-ink mt-1">{k.sub}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-5 items-end justify-between border-b border-rule pb-3">
        <p className="editorial-mono-caption text-accent-text">
          {filter === "all" ? "ALLE ISSUES" : `${filter.toUpperCase()}-ISSUES`}{" "}
          · {visible.length} VISES
        </p>
        <div className="flex items-end gap-2">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-1">
              Overflate
            </p>
            <select
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              className="font-mono text-xs border border-hairline rounded-sm px-2 py-1.5 bg-paper text-ink"
            >
              <option value="all">Alle</option>
              {surfaces.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border border-rule rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/40">
            <tr>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink w-24">
                Severity
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Overflate
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Kategori
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Regel
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Detalj
              </th>
              <th className="text-right px-4 py-3 editorial-mono-caption text-ink w-24">
                Berørte
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Sist sett
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  Ingen issues på dette nivået — pent ryddet
                </td>
              </tr>
            ) : (
              visible.map((issue, i) => (
                <tr
                  key={`${issue.surface}-${issue.rule}-${i}`}
                  className="border-t border-rule hover:bg-paper-deep/40 cursor-pointer"
                  onClick={() => setActive(issue)}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-mono text-[0.6rem] tracking-widest px-2 py-1 border rounded-sm uppercase font-medium",
                        issue.severity === "error"
                          ? "text-red-700 border-red-700 bg-red-50 dark:bg-red-950/30"
                          : issue.severity === "warn"
                            ? "text-amber-700 border-amber-700 bg-amber-50 dark:bg-amber-950/30"
                            : "text-navy border-navy bg-paper-deep/60",
                      )}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink">
                    <div>{issue.surface}</div>
                    {issue.surfaceType && (
                      <div className="text-[0.6rem] text-ink-faint uppercase tracking-widest mt-0.5">
                        {SURFACE_LABEL[issue.surfaceType]}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{AUDIT_LABEL[issue.auditType]}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink">{issue.rule}</td>
                  <td className="px-4 py-3 text-ink leading-snug">
                    <span className="line-clamp-2">{issue.message}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-base tabular-nums text-ink">
                    {issue.affected}
                  </td>
                  <td className="px-4 py-3 font-mono text-[0.65rem] text-ink-soft">
                    {new Date(issue.lastSeen).toLocaleString("nb-NO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && <AiFixDrawer issue={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function AiFixDrawer({
  issue,
  onClose,
}: {
  issue: IssueFeedItem;
  onClose: () => void;
}) {
  const [recommendation, setRecommendation] = useState<AiRecommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRecommendation(null);
    const auth = localStorage.getItem(AUTH_KEY);
    fetch("/api/audits/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: `Basic ${auth}` } : {}),
      },
      body: JSON.stringify({
        rule: issue.rule,
        severity: issue.severity,
        message: issue.message,
        auditType: issue.auditType,
        surface: issue.surface,
        url: issue.url,
        affected: issue.affected,
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as AiRecommendation;
      })
      .then((data) => {
        if (!cancelled) setRecommendation(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [issue]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/40 flex justify-end"
      onClick={onClose}
    >
      <aside
        className="bg-paper w-full max-w-2xl h-full overflow-y-auto p-8 lg:p-10 shadow-2xl border-l border-hairline-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-rule">
          <div>
            <p className="editorial-mono-caption text-accent-text flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI-ANBEFALING
            </p>
            <h2 className="font-serif text-2xl text-ink mt-1 leading-tight">
              {issue.rule}
            </h2>
            <p className="text-sm text-ink-soft mt-1">
              {issue.surface} · {issue.auditType} ·{" "}
              <span
                className={cn(
                  "font-mono uppercase tracking-widest",
                  issue.severity === "error"
                    ? "text-red-700"
                    : issue.severity === "warn"
                      ? "text-amber-700"
                      : "text-navy",
                )}
              >
                {issue.severity}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 hover:bg-paper-deep text-ink-soft"
            aria-label="Lukk"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <section className="mb-6">
          <p className="editorial-mono-caption text-ink-soft mb-2">FAKTA</p>
          <dl className="text-sm">
            <div className="flex gap-3 py-1 border-b border-rule">
              <dt className="font-mono text-xs text-ink-faint w-24">Melding</dt>
              <dd className="flex-1 text-ink">{issue.message}</dd>
            </div>
            {issue.url && (
              <div className="flex gap-3 py-1 border-b border-rule">
                <dt className="font-mono text-xs text-ink-faint w-24">URL</dt>
                <dd className="flex-1 text-ink font-mono text-xs break-all">
                  {issue.url}
                </dd>
              </div>
            )}
            <div className="flex gap-3 py-1 border-b border-rule">
              <dt className="font-mono text-xs text-ink-faint w-24">Berørte</dt>
              <dd className="flex-1 text-ink">{issue.affected} sider</dd>
            </div>
          </dl>
        </section>

        <section>
          {loading ? (
            <div className="flex items-center gap-2 text-ink-soft">
              <Loader2 className="h-4 w-4 animate-spin" /> Henter AI-anbefaling…
            </div>
          ) : error ? (
            <div className="border-l-2 border-red-700 bg-paper-deep/60 px-4 py-3">
              <p className="editorial-mono-caption text-red-700 mb-1">
                AI-feil
              </p>
              <p className="text-sm text-ink">{error}</p>
            </div>
          ) : recommendation ? (
            <>
              <div className="prose prose-sm max-w-none text-ink">
                {renderMarkdown(recommendation.recommendation)}
              </div>
              <p className="mt-6 pt-4 border-t border-rule font-mono text-[0.65rem] tracking-widest text-ink-faint">
                Generert{" "}
                {new Date(recommendation.generatedAt).toLocaleString("nb-NO")} ·{" "}
                {recommendation.model}
              </p>
            </>
          ) : null}
        </section>
      </aside>
    </div>
  );
}

function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split(/\r?\n/);
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  const flushList = () => {
    if (listBuffer.length > 0) {
      out.push(
        <ul
          key={`ul-${out.length}`}
          className="my-3 list-disc list-inside text-sm text-ink space-y-1"
        >
          {listBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flushList();
      out.push(
        <h3
          key={`h-${out.length}`}
          className="font-serif text-lg text-ink mt-5 mb-2"
        >
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
    } else if (line === "") {
      flushList();
    } else {
      flushList();
      out.push(
        <p
          key={`p-${out.length}`}
          className="text-sm text-ink leading-relaxed my-2"
        >
          {line}
        </p>,
      );
    }
  }
  flushList();
  return out;
}
