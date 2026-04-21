"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { RestaurantDto } from "@/types/api";
import { cn } from "@/lib/cn";

export function MapView({ restaurants }: { restaurants: RestaurantDto[] }) {
  const cities = Array.from(new Set(restaurants.map((restaurant) => restaurant.city)));
  const [city, setCity] = useState(cities[0] || "Paris");

  const visible = useMemo(
    () =>
      restaurants.filter(
        (restaurant) =>
          restaurant.city === city &&
          restaurant.latitude !== null &&
          restaurant.longitude !== null
      ),
    [city, restaurants]
  );

  const bounds = useMemo(() => {
    const lats = visible.map((restaurant) => restaurant.latitude as number);
    const lngs = visible.map((restaurant) => restaurant.longitude as number);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs)
    };
  }, [visible]);

  function getPosition(restaurant: RestaurantDto) {
    const lat = restaurant.latitude as number;
    const lng = restaurant.longitude as number;
    const latRange = bounds.maxLat - bounds.minLat || 0.01;
    const lngRange = bounds.maxLng - bounds.minLng || 0.01;

    return {
      left: `${12 + ((lng - bounds.minLng) / lngRange) * 76}%`,
      top: `${14 + (1 - (lat - bounds.minLat) / latRange) * 72}%`
    };
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {cities.map((item) => (
            <button
              key={item}
              onClick={() => setCity(item)}
              className={cn(
                "h-10 rounded-lg border border-ink/10 bg-porcelain px-4 text-sm font-semibold text-ink/60",
                city === item && "border-ink bg-ink text-champagne"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-lg bg-[#d9ddcf]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,16,13,0.08)_1px,transparent_1px),linear-gradient(rgba(18,16,13,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_30%_40%,rgba(247,242,232,0.75),transparent_30%),radial-gradient(circle_at_75%_65%,rgba(178,45,45,0.16),transparent_26%)]" />

          {visible.map((restaurant) => {
            const position = getPosition(restaurant);

            return (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-rouge text-white shadow-premium transition hover:scale-105"
                style={position}
                title={restaurant.name}
              >
                <MapPin size={18} fill="currentColor" />
              </Link>
            );
          })}
        </div>
      </section>

      <aside className="space-y-3">
        {visible.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={`/restaurants/${restaurant.id}`}
            className="block rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm transition hover:bg-white"
          >
            <p className="text-sm font-semibold text-ink">{restaurant.name}</p>
            <p className="mt-1 text-xs text-ink/50">
              {restaurant.district} - {restaurant.award.replaceAll("_", " ")}
            </p>
          </Link>
        ))}
      </aside>
    </div>
  );
}
