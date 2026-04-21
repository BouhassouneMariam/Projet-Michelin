import { Layers3 } from "lucide-react";
import { RestaurantCard } from "./RestaurantCard";
import type { CollectionDto } from "@/types/api";

export function CollectionCard({ collection }: { collection: CollectionDto }) {
  const firstItem = collection.items[0];

  return (
    <article className="rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-rouge">
            <Layers3 size={14} />
            {collection.owner.username}
          </p>
          <h2 className="mt-2 truncate text-2xl font-semibold text-ink">
            {collection.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            {collection.description}
          </p>
        </div>
        <span className="rounded-lg bg-porcelain px-3 py-2 text-xs font-semibold text-ink/60">
          {collection.items.length} spots
        </span>
      </div>

      {firstItem ? (
        <RestaurantCard restaurant={firstItem.restaurant} compact />
      ) : (
        <div className="rounded-lg border border-dashed border-ink/20 p-6 text-sm text-ink/50">
          Empty collection
        </div>
      )}
    </article>
  );
}
