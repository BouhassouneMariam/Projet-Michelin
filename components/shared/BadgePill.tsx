import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function BadgePill({
  children,
  icon,
  tone = "light"
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        tone === "light" &&
          "border border-ink/10 bg-white/60 text-ink/70 shadow-sm",
        tone === "dark" && "border border-white/20 bg-white/10 text-white/80"
      )}
    >
      {icon}
      {children}
    </span>
  );
}
