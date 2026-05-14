import { cn } from "@/lib/utils";

interface BylineProps {
  author: string;
  role?: string;
  date?: string;
  className?: string;
}

export function Byline({ author, role, date, className }: BylineProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 editorial-mono-caption",
        className
      )}
    >
      <span className="text-ink">{author}</span>
      {role && (
        <>
          <span className="w-px h-3 bg-rule" aria-hidden="true" />
          <span>{role}</span>
        </>
      )}
      {date && (
        <>
          <span className="w-px h-3 bg-rule" aria-hidden="true" />
          <time>{date}</time>
        </>
      )}
    </div>
  );
}
