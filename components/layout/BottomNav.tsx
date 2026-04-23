"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, Users, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/features/users/AuthProvider";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/discover", label: "Découverte", icon: Compass },
  { href: "/map", label: "Map", icon: Map },
  { href: "/social", label: "Social", icon: Users },
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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/5 bg-white/80 px-2 pb-6 pt-2 backdrop-blur-xl md:hidden">
      <div className={cn(
        "mx-auto grid max-w-sm gap-1",
        isAuthenticated ? "grid-cols-5" : "grid-cols-4"
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
                "flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all duration-300",
                active ? "text-rouge scale-110" : "text-ink/40"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={cn(
                "transition-opacity",
                active ? "opacity-100" : "opacity-70"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
