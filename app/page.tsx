import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSceneClient } from "@/components/3d/HeroSceneClient";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { BadgePill } from "@/components/shared/BadgePill";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";
import {getCurrentUserId} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function HomePage() {

  const restaurants = await listRestaurants({ city: "Paris" });
  const highlights = restaurants.slice(0, 3);

  return (
    <main className="space-y-8 pb-8">
      <section className="relative min-h-[78vh] overflow-hidden bg-ink text-porcelain">
        <div className="absolute inset-x-0 bottom-0 top-[44%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 opacity-90">
          <HeroSceneClient />
        </div>

        <div className="relative z-10 flex min-h-[78vh] flex-col justify-end px-5 pb-8 pt-24">
          <div className="max-w-xl space-y-5">
            <BadgePill icon={<Sparkles size={14} />} tone="dark">
              Michelin curated for your next plan
            </BadgePill>
            <div className="space-y-3">
              <h1 className="max-w-[11ch] text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl">
                Michelin Next Gen
              </h1>
              <p className="max-w-md text-base leading-7 text-porcelain/75">
                Build personal restaurant collections, discover the right table
                for the moment, and see what your friends already saved.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/discover"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-rouge px-5 text-sm font-semibold text-white shadow-premium transition hover:bg-[#9d2626]"
              >
                Start discovery
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-12 items-center rounded-lg border border-white/20 px-5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                View collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rouge">
              Paris now
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Demo-ready picks
            </h2>
          </div>
          <Link href="/map" className="text-sm font-semibold text-moss">
            Map
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />
          ))}
        </div>
      </section>
    </main>
  );
}
