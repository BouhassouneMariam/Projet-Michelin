"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function LikeButton({
  restaurantId,
  initialLiked = false,
  initialCount = 0
}: {
  restaurantId: string;
  initialLiked?: boolean;
  initialCount?: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);

    const wasLiked = liked;

    // Optimistic update
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/like`, {
        method: wasLiked ? "DELETE" : "POST"
      });

      if (!response.ok) {
        // Revert on failure
        setLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : c - 1));
      }
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={busy}
      className="group/like inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
      aria-label={liked ? "Retirer le like" : "Liker ce restaurant"}
    >
      <Heart
        size={15}
        className={`transition-all duration-200 ${
          liked
            ? "scale-110 fill-rouge text-rouge"
            : "scale-100 text-ink/40 group-hover/like:text-rouge/60"
        }`}
      />
      <span className={liked ? "text-rouge" : "text-ink/60"}>
        {count}
      </span>
    </button>
  );
}
