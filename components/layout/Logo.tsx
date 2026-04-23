"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Logo() {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2"
      onClick={() => {
        if (pathname === "/") {
          window.dispatchEvent(new CustomEvent("reset-book"));
        }
      }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-rouge shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2.6 6.9L22 10l-5.5 4.7L18.2 22 12 18l-6.2 4 1.7-7.3L2 10l7.4-1.1z" />
        </svg>
      </span>

      <span className="truncate text-lg font-medium tracking-normal text-ink">
        Le Guide Michelin
      </span>
    </Link>
  );
}
