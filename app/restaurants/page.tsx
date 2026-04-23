import Link from "next/link";
import {MapPin} from "lucide-react";
import RestaurantList from "@/features/restaurants/RestaurantList";
import {listRestaurants} from "@/features/restaurants/restaurant.queries";

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
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-ink">
                            {search ? `Resultats pour "${search}"` : "Tous les restaurants"}
                        </h1>
                        <p className="text-sm text-ink/55">
                            {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    <Link
                        href={`/map?search=${encodeURIComponent(search ?? "")}`}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-rouge shadow-sm transition hover:bg-porcelain"
                        aria-label="Voir sur la carte"
                        title="Voir sur la carte"
                    >
                        <MapPin size={18}/>
                    </Link>
                </div>

                <RestaurantList restaurants={restaurants}/>
            </div>
        </main>
    );
}
