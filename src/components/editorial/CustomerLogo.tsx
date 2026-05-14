import { cn } from "@/lib/utils";

interface CustomerLogoProps {
  name: string;
  sector?: string;
  src?: string;
  status?: string;
  className?: string;
}

export function CustomerLogo({
  name,
  sector,
  src,
  status,
  className,
}: CustomerLogoProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 py-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-8 w-auto object-contain grayscale opacity-80"
            loading="lazy"
          />
        ) : (
          <span
            className="font-serif text-xl text-ink"
            style={{ fontVariationSettings: '"opsz" 48, "wght" 480' }}
          >
            {name}
          </span>
        )}
        {status && (
          <span className="editorial-mono-caption px-2 py-0.5 border border-rule rounded-sm">
            {status}
          </span>
        )}
      </div>
      {sector && <span className="editorial-mono-caption">{sector}</span>}
    </div>
  );
}
