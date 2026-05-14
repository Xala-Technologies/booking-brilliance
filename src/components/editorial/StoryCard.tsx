import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";
import { SpecRow } from "./SpecRow";

interface StoryStat {
  label: string;
  value: string;
}

interface StoryCardProps {
  meta: string[];
  headline: string;
  customer: string;
  logoSrc?: string;
  dek?: string;
  body: ReactNode;
  quote?: { text: string; byline?: string; role?: string };
  stats?: StoryStat[];
  cta?: ReactNode;
  className?: string;
}

export function StoryCard({
  meta,
  headline,
  customer,
  logoSrc,
  dek,
  body,
  quote,
  stats,
  cta,
  className,
}: StoryCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-6 p-8 lg:p-10 border-hairline border-rule bg-paper rounded-sm",
        className
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 editorial-mono-caption">
          {meta.map((label, i) => (
            <span key={label} className="flex items-center gap-3">
              <span>{label}</span>
              {i < meta.length - 1 && (
                <span className="w-px h-3 bg-rule" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={customer}
            className="h-6 w-auto object-contain grayscale opacity-80"
            loading="lazy"
          />
        ) : (
          <span
            className="font-serif text-sm text-ink-faint"
            style={{ fontVariationSettings: '"opsz" 36, "wght" 460' }}
          >
            {customer}
          </span>
        )}
      </header>

      <h3
        className="font-serif text-3xl md:text-4xl text-ink"
        style={{
          fontVariationSettings: getFraunces("section"),
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
        }}
      >
        {headline}
      </h3>

      {dek && <p className="text-lg text-ink-soft measure">{dek}</p>}

      <div className="text-base text-ink-soft measure leading-relaxed">{body}</div>

      {quote && (
        <blockquote
          className="border-l-2 border-navy pl-4 text-lg italic text-ink"
          style={{ fontVariationSettings: getFraunces("body-italic") }}
        >
          &ldquo;{quote.text}&rdquo;
          {(quote.byline || quote.role) && (
            <footer className="mt-2 editorial-mono-caption not-italic">
              {quote.byline}
              {quote.byline && quote.role && " · "}
              {quote.role}
            </footer>
          )}
        </blockquote>
      )}

      {stats && stats.length > 0 && (
        <div className="border-t border-rule pt-4">
          {stats.map((s) => (
            <SpecRow key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}

      {cta && <div className="mt-2">{cta}</div>}
    </article>
  );
}
