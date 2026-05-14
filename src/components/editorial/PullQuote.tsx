import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";

interface PullQuoteProps {
  children: ReactNode;
  byline?: string;
  role?: string;
  className?: string;
}

export function PullQuote({ children, byline, role, className }: PullQuoteProps) {
  return (
    <figure className={cn("my-12 pl-6 border-l-2 border-navy", className)}>
      <blockquote
        className="font-serif text-2xl md:text-3xl lg:text-4xl text-ink leading-tight"
        style={{
          fontVariationSettings: getFraunces("quote"),
          letterSpacing: "-0.01em",
        }}
      >
        <span className="text-accent-text mr-1">&ldquo;</span>
        {children}
        <span className="text-accent-text ml-1">&rdquo;</span>
      </blockquote>
      {(byline || role) && (
        <figcaption className="mt-4 editorial-mono-caption">
          {byline && <span className="text-ink-soft">{byline}</span>}
          {byline && role && <span className="mx-2">·</span>}
          {role && <span>{role}</span>}
        </figcaption>
      )}
    </figure>
  );
}
