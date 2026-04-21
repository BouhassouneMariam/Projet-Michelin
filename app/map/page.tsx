import { MapView } from "@/features/map/MapView";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

export default async function MapPage() {
  const restaurants = await listRestaurants({ mapReady: true, limit: 200 });

  return (
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rouge">
          Map
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Restaurants by city
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-ink/60">
          A lightweight map substitute for the hackathon: real coordinates,
          visual pins, no external map token.
        </p>
      </div>

      <MapView restaurants={restaurants} />
    </main>
  );
}
