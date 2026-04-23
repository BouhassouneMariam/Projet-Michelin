import type { RestaurantDto } from "@/types/api";
import { RestaurantCard } from "@/components/shared/RestaurantCard";

export default function RestaurantList({
  restaurants
}: {
  restaurants: RestaurantDto[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
