import { MapClient } from "@/features/map/MapClient";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

export default async function MapPage() {
  const restaurants = await listRestaurants({ mapReady: true, limit: 5000 });

  return (
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rouge">
          Map
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Michelin around you
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-ink/60">
          Explore geolocated Michelin picks with city, award and budget filters.
        </p>
      </div>

      <MapClient restaurants={restaurants} />
    </main>
  );
}
