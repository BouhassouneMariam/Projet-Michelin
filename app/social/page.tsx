import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { BadgePill } from "@/components/shared/BadgePill";
import { getCurrentUserId } from "@/lib/auth";
import { getFriendsLikedRestaurants, getUserLikedRestaurantIds } from "@/features/social/social.service";

export default async function SocialPage() {
  const userId = getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const [friendsLiked, likedIds] = await Promise.all([
    getFriendsLikedRestaurants(userId),
    getUserLikedRestaurantIds(userId)
  ]);
  const likedSet = new Set(likedIds);

  return (
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-3">
        <BadgePill icon={<Users size={14} />}>Friends signal</BadgePill>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-ink">
            What your circle saved
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-ink/60">
            This is the social layer for the demo: likes from accepted friends
            become context on top of Michelin expertise.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {friendsLiked.map((item) => (
          <div key={item.restaurant.id} className="space-y-2">
            <RestaurantCard restaurant={item.restaurant} initialLiked={likedSet.has(item.restaurant.id)} />
            <p className="px-1 text-sm font-medium text-ink/60">
              Liked by {item.likedBy.map((user) => user.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

