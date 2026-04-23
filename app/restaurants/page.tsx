import RestaurantList from "@/features/restaurants/RestaurantList";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

export default async function RestaurantsPage({
  searchParams
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const search = searchParams?.search?.trim() || undefined;
  const restaurants = await listRestaurants({
    search,
    limit: 200
  });

  return (
    <main className="px-5 py-6 md:px-8">
      <div className="mx-auto max-w-[1760px] space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-ink">
            {search ? `Resultats pour "${search}"` : "Tous les restaurants"}
          </h1>
          <p className="text-sm text-ink/55">
            {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""}
          </p>
        </div>

        <RestaurantList restaurants={restaurants} />
      </div>
    </main>
  );
}
