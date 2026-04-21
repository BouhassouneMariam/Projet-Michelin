import Link from "next/link";
import { Star } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/80 px-5 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-champagne">
            <Star size={18} fill="currentColor" />
          </span>
          <span className="truncate text-sm font-bold tracking-normal text-ink">
            Michelin Next Gen
          </span>
        </Link>
        <Link
          href="/discover"
          className="hidden h-10 items-center rounded-lg bg-rouge px-4 text-sm font-semibold text-white transition hover:bg-[#9d2626] sm:inline-flex"
        >
          Discover
        </Link>
      </div>
    </header>
  );
}
