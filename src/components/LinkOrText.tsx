import { Link } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * A link in Norwegian, plain text in English.
 *
 * Several pages suggest venue types whose landing pages stay Norwegian on
 * purpose — nobody searches in English to rent a Norwegian function room, and
 * 38 thin English duplicates would land on a site Google already declines to
 * index 147 URLs of.
 *
 * The label is still useful to an English reader ("function rooms fit 30–150
 * guests"); only the destination is not. Rendering it as text keeps the
 * information and drops the way out of the language, which is better than
 * either linking into Norwegian or hiding the answer.
 */
export function LinkOrText({
  en,
  to,
  className,
  children,
}: {
  en: boolean;
  to: string;
  className?: string;
  children: ReactNode;
}) {
  if (en) return <span className={className}>{children}</span>;
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
