"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function RemoveRestaurantButton({
  collectionId,
  restaurantId
}: {
  collectionId: string;
  restaurantId: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function remove() {
    if (busy) return;
    setBusy(true);

    try {
      const response = await fetch(
        `/api/collections/${collectionId}/restaurants/${restaurantId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        router.refresh(); // Reload to reflect changes
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        remove();
      }}
      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink/60 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-rouge"
      aria-label="Remove from collection"
    >
      <Trash2 size={14} />
    </button>
  );
}
