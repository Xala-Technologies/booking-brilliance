import { cn } from "@/lib/utils";

interface MastheadProps {
  volume?: string;
  issue?: string;
  city?: string;
  className?: string;
}

export function Masthead({
  volume = "VOL. 2026",
  issue = "UTGAVE 05",
  city = "OSLO",
  className,
}: MastheadProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4 border-b border-rule",
        className
      )}
    >
      <span className="editorial-mono-caption">Digilist</span>
      <div className="hidden md:flex items-center gap-6 editorial-mono-caption">
        <span>{volume}</span>
        <span className="w-px h-3 bg-rule" aria-hidden="true" />
        <span>{issue}</span>
        <span className="w-px h-3 bg-rule" aria-hidden="true" />
        <span>{city}</span>
      </div>
      <span className="editorial-mono-caption">
        {new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}
      </span>
    </div>
  );
}
