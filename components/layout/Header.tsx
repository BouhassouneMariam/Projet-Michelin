import Link from "next/link";
import { getCurrentUserId, isAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { Logo } from "./Logo";
import RestaurantSearchBar from "@/features/restaurants/components/RestaurantSearchBar";

export async function Header() {
  const userId = getCurrentUserId();
  const isUserAdmin = await isAdmin();
  
  const navItems = [
    { href: "/discover", label: "Decouvrir" },
    { href: "/map", label: "Map" },
    { href: "/collections", label: "Collections" },
    ...(isUserAdmin ? [{ href: "/admin", label: "Admin" }] : [])
  ];

  return (
    <header className="relative z-40 bg-porcelain/80 px-5 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between gap-4">
        <Logo />

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
          <RestaurantSearchBar/>
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
