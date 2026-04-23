"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/features/users/AuthProvider";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/map", label: "Map", icon: Map },
  { href: "/profile", label: "Profil", icon: User }
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const visibleItems = items.filter(item => {
    if (item.href === "/profile") return isAuthenticated;
    return true;
  });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-porcelain/90 px-2 py-2 backdrop-blur-xl md:hidden">
      <div className={cn(
        "mx-auto grid max-w-sm gap-1",
        isAuthenticated ? "grid-cols-4" : "grid-cols-3"
      )}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-ink/50 transition",
                active && "bg-ink text-champagne"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
