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
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-3">
        <BadgePill icon={<Layers3 size={14} />}>Collections</BadgePill>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-ink">
            Mes listes de restaurants
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-ink/60">
            Organisez vos découvertes culinaires en collections personnalisées.
            Partagez-les avec vos amis ou gardez-les privées.
          </p>
        </div>
      </div>

      {/* Liked collection (virtual) */}
      {likedCollection && likedCollection.items.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Heart size={16} className="fill-rouge text-rouge" />
            <h2 className="text-lg font-semibold text-ink">Mes coups de cœur</h2>
            <span className="rounded-lg bg-rouge/10 px-2 py-0.5 text-xs font-semibold text-rouge">
              {likedCollection.items.length}
            </span>
          </div>
          <CollectionCard collection={likedCollection} index={0} />
        </div>
      )}

      <CollectionList initialCollections={collections} />

      {/* Popular public collections */}
      {popularCollections.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Globe size={16} className="text-moss" />
            <h2 className="text-lg font-semibold text-ink">Collections populaires</h2>
            <span className="rounded-lg bg-moss/10 px-2 py-0.5 text-xs font-semibold text-moss">
              {popularCollections.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {popularCollections.map((collection, i) => (
              <CollectionCard key={collection.id} collection={collection} index={i} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
