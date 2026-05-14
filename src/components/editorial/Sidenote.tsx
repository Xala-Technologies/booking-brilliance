import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidenoteProps {
  marker?: string | number;
  children: ReactNode;
  className?: string;
}

export function Sidenote({ marker, children, className }: SidenoteProps) {
  return (
    <div
      className={cn(
        "mt-6 py-3 pl-4 border-l border-rule",
        "text-base text-ink-soft leading-relaxed measure-narrow",
        className
      )}
    >
      {marker !== undefined && (
        <span className="editorial-mono-caption text-accent-text mr-2">{marker}.</span>
      )}
      {children}
    </div>
  );
}
