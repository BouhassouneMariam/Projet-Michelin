import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function Header() {
  const userId = getCurrentUserId();
  const navItems = [
    { href: "/discover", label: "Decouvrir" },
    { href: "/map", label: "Map" }
  ];

  return (
    <header className="relative z-40 bg-porcelain/80 px-5 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
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

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="inline-flex h-10 items-center rounded px-3 text-xs font-semibold uppercase tracking-normal text-ink transition hover:text-rouge focus:outline-none focus:ring-2 focus:ring-rouge focus:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {userId ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="inline-flex h-10 items-center rounded bg-rouge px-3 text-xs font-semibold uppercase tracking-normal text-white transition hover:bg-[#9d2626]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
