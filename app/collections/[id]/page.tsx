import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Globe, Lock, MapPin, Search } from "lucide-react";
import { BadgePill } from "@/components/shared/BadgePill";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { CollectionActions } from "@/components/collections/CollectionActions";
import { ShareCollectionButton } from "@/components/collections/ShareCollectionButton";
import { RemoveRestaurantButton } from "@/components/collections/RemoveRestaurantButton";
import { getCollection } from "@/features/collections/collection.service";
import { getUserLikedRestaurantIds, getLikedCollection } from "@/features/social/social.service";
import { getCurrentUserId } from "@/lib/auth";

export default async function CollectionDetailPage({
  params
}: {
  params: { id: string };
}) {
  const userId = getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  let collection;
  
  if (params.id === "__liked__") {
    collection = await getLikedCollection(userId);
  } else {
    collection = await getCollection(params.id);
  }

  if (!collection) {
    notFound();
  }

  if (!collection.isPublic && collection.owner.id !== userId) {
    notFound();
  }

  const likedIds = await getUserLikedRestaurantIds(userId);
  const likedSet = new Set(likedIds);
  
  const isOwner = params.id !== "__liked__" && collection.owner.id === userId;
  const firstImage = collection.coverUrl || collection.items[0]?.restaurant.imageUrl;

  return (
    <main className="pb-8">
      <section className="relative min-h-[40vh] overflow-hidden bg-ink text-white">
        {firstImage ? (
          <img
            src={firstImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-moss/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        
        <div className="relative z-10 flex min-h-[40vh] flex-col justify-between px-5 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/collections"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur transition hover:bg-white/20"
              aria-label="Back to collections"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2">
              {(collection.isPublic || isOwner || params.id === "__liked__") && (
                <ShareCollectionButton collection={collection} />
              )}
              {isOwner && (
                <CollectionActions
                  collectionId={collection.id}
                  initialTitle={collection.title}
                  initialDescription={collection.description}
                  initialCoverUrl={collection.coverUrl}
                  initialIsPublic={collection.isPublic}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill
                icon={collection.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                tone="dark"
              >
                {collection.isPublic ? "Public" : "Privé"}
              </BadgePill>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {collection.items.length} {collection.items.length === 1 ? "spot" : "spots"}
              </span>
            </div>
            
            <div>
              <h1 className="text-4xl font-semibold leading-tight drop-shadow-sm">
                {collection.title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                <img
                  src={collection.owner.avatarUrl || ""}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                />
                <span className="font-medium">Par {collection.owner.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        {collection.description && (
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/70">
            {collection.description}
          </p>
        )}

        {collection.items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collection.items.map((item) => (
              <div key={item.id} className="relative">
                {isOwner && (
                  <RemoveRestaurantButton
                    collectionId={collection.id}
                    restaurantId={item.restaurant.id}
                  />
                )}
                <RestaurantCard
                  restaurant={item.restaurant}
                  initialLiked={likedSet.has(item.restaurant.id)}
                />
                {item.note && (
                  <div className="mt-2 rounded-lg bg-porcelain p-3 text-sm text-ink/80 italic">
                    <span className="font-semibold not-italic">Note:</span> {item.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-porcelain text-ink/40">
              <Search size={24} />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-ink">
              Cette collection est vide
            </h3>
            <p className="mb-6 max-w-sm text-sm text-ink/60">
              Explorez les recommandations pour ajouter des restaurants à cette liste.
            </p>
            {isOwner && (
              <Link
                href="/discover"
                className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Découvrir des restaurants
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
