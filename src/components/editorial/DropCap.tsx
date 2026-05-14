import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropCapProps {
  children: ReactNode;
  className?: string;
}

export function DropCap({ children, className }: DropCapProps) {
  return <p className={cn("dropcap", className)}>{children}</p>;
}
