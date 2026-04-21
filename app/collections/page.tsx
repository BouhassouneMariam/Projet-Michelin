import { CollectionCard } from "@/components/shared/CollectionCard";
import { listCollections } from "@/features/collections/collection.queries";

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rouge">
          Collections
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Personal lists with social proof
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </main>
  );
}
