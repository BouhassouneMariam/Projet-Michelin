import { Globe, Heart, Layers3 } from "lucide-react";
import { BadgePill } from "@/components/shared/BadgePill";
import { CollectionList } from "@/components/collections/CollectionList";
import { listUserCollections, listPopularCollections } from "@/features/collections/collection.service";
import { getLikedCollection } from "@/features/social/social.service";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { CollectionCard } from "@/components/collections/CollectionCard";

export default async function CollectionsPage() {
  const [collections, likedCollection, popularCollections] = await Promise.all([
    listUserCollections(DEMO_USER_ID),
    getLikedCollection(DEMO_USER_ID),
    listPopularCollections(DEMO_USER_ID)
  ]);

  return (
    <main className="michelin-paper min-h-[calc(100dvh-68px)] px-5 pb-16 pt-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 space-y-4">
          <BadgePill icon={<Layers3 size={14} />}>Collections</BadgePill>
          <div className="space-y-3">
            <h1 className="text-4xl font-medium leading-tight text-ink sm:text-5xl">
              Mes listes de restaurants
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#4D4D4D]">
              Organisez vos découvertes culinaires en collections personnalisées.
              Partagez-les avec vos amis ou gardez-les privées.
            </p>
          </div>
        </div>

        {/* Liked collection (virtual) */}
        {likedCollection && likedCollection.items.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rouge/10">
                <Heart size={16} className="fill-rouge text-rouge" />
              </div>
              <h2 className="text-2xl font-medium text-ink">Mes coups de cœur</h2>
              <span className="rounded-full bg-rouge px-2.5 py-0.5 text-xs font-semibold text-white">
                {likedCollection.items.length}
              </span>
            </div>
            <CollectionCard collection={likedCollection} index={0} />
          </div>
        )}

        <CollectionList initialCollections={collections} />

        {/* Popular public collections */}
        {popularCollections.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss/10">
                <Globe size={16} className="text-moss" />
              </div>
              <h2 className="text-2xl font-medium text-ink">Collections populaires</h2>
              <span className="rounded-full bg-moss px-2.5 py-0.5 text-xs font-semibold text-white">
                {popularCollections.length}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {popularCollections.map((collection, i) => (
                <CollectionCard key={collection.id} collection={collection} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
