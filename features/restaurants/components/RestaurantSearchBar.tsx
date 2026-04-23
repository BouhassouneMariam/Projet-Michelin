"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { RestaurantDto } from "@/types/api";

type RestaurantsResponse = {
  restaurants: RestaurantDto[];
};

export default function RestaurantSearchBar() {
  const router = useRouter();
  const [restaurantList, setRestaurantList] = useState<RestaurantDto[]>([]);
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return [];
    }

    return restaurantList
      .filter((restaurant) =>
        restaurant.name.toLowerCase().startsWith(normalizedSearch)
      )
      .slice(0, 6);
  }, [restaurantList, search]);

  useEffect(() => {
    async function loadRestaurants() {
      const response = await fetch("/api/restaurants?limit=200");
      const data = (await response.json()) as RestaurantsResponse;

      setRestaurantList(data.restaurants);
    }

    loadRestaurants();
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSearch = search.trim();

    if (!normalizedSearch) {
      return;
    }

    setSearch("");
    router.push(`/restaurants?search=${encodeURIComponent(normalizedSearch)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative hidden w-full max-w-sm md:block"
    >
      <div className="flex h-10 items-center gap-2 rounded-lg border border-ink/10 bg-white/80 px-3 shadow-sm">
        <Search size={16} className="text-ink/40" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un restaurant"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
        />
      </div>

      {filteredList.length > 0 ? (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-premium">
          {filteredList.map((restaurant) => (
            <li key={restaurant.id} className="border-b border-ink/5 last:border-b-0">
              <Link
                href={`/restaurants/${restaurant.id}`}
                onClick={() => setSearch("")}
                className="block px-4 py-3 transition hover:bg-porcelain"
              >
                <p className="text-sm font-semibold text-ink">{restaurant.name}</p>
                <p className="mt-1 text-xs text-ink/45">
                  {[restaurant.city, restaurant.country].filter(Boolean).join(", ")}
                </p>
              </Link>
            </li>
          ))}
          <li className="border-t border-ink/10 bg-porcelain/50">
            <Link
              href={`/restaurants?search=${encodeURIComponent(search.trim())}`}
              onClick={() => setSearch("")}
              className="block px-4 py-3 text-sm font-semibold text-rouge transition hover:bg-porcelain"
            >
              Voir tous les resultats
            </Link>
          </li>
        </ul>
      ) : null}
    </form>
  );
}
