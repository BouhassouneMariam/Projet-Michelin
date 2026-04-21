"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { RestaurantDto } from "@/types/api";
import { cn } from "@/lib/cn";

export function MapView({ restaurants }: { restaurants: RestaurantDto[] }) {
  const mapReadyRestaurants = useMemo(
    () =>
      restaurants.filter(
        (restaurant) =>
          restaurant.latitude !== null && restaurant.longitude !== null
      ),
    [restaurants]
  );
  const cities = Array.from(
    new Set(mapReadyRestaurants.map((restaurant) => restaurant.city))
  );
  const [city, setCity] = useState(cities[0] || "Paris");

  const visible = useMemo(
    () =>
      mapReadyRestaurants.filter((restaurant) => restaurant.city === city),
    [city, mapReadyRestaurants]
  );

  const bounds = useMemo(() => {
    if (visible.length === 0) {
      return {
        minLat: 0,
        maxLat: 1,
        minLng: 0,
        maxLng: 1
      };
    }

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
          {cities.length > 0 ? (
            cities.map((item) => (
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
            ))
          ) : (
            <p className="text-sm font-medium text-ink/60">
              No geolocated restaurants available yet.
            </p>
          )}
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-lg bg-[#d9ddcf]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,16,13,0.08)_1px,transparent_1px),linear-gradient(rgba(18,16,13,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_30%_40%,rgba(247,242,232,0.75),transparent_30%),radial-gradient(circle_at_75%_65%,rgba(178,45,45,0.16),transparent_26%)]" />

          {visible.length > 0 ? (
            visible.map((restaurant) => {
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
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <p className="max-w-sm text-sm font-medium leading-6 text-ink/60">
                The imported Michelin dataset does not include coordinates.
                Add geolocated restaurants to make this map richer.
              </p>
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-3">
        {visible.length > 0 ? (
          visible.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="block rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm transition hover:bg-white"
            >
              <p className="text-sm font-semibold text-ink">
                {restaurant.name}
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {[restaurant.district, restaurant.city].filter(Boolean).join(", ")}{" "}
                - {restaurant.award.replaceAll("_", " ")}
              </p>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-5 text-sm leading-6 text-ink/60">
            No pins for this city yet. The demo seed still includes a few
            geolocated restaurants for the map.
          </div>
        )}
      </aside>
    </div>
  );
}
