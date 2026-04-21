"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkCheck, BookmarkPlus, Heart, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { DEFAULT_COLLECTION_ID } from "@/lib/demo-user";
import type { RestaurantDto } from "@/types/api";

export function RestaurantCard({
  restaurant,
  compact = false
}: {
  restaurant: RestaurantDto;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveToCollection() {
    setSaving(true);

    try {
      const response = await fetch(`/api/collections/${DEFAULT_COLLECTION_ID}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          restaurantId: restaurant.id
        })
      });

      if (response.ok) {
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="overflow-hidden rounded-lg border border-ink/10 bg-white/70 shadow-sm backdrop-blur"
    >
      <Link href={`/restaurants/${restaurant.id}`} className="block">
        <div className={compact ? "h-44" : "h-56"}>
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-champagne" />
          )}
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/restaurants/${restaurant.id}`}>
                <h3 className="truncate text-lg font-semibold text-ink">
                  {restaurant.name}
                </h3>
              </Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink/50">
                <MapPin size={14} />
                <span className="truncate">
                  {restaurant.district}, {restaurant.city}
                </span>
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-ink px-2 py-1 text-xs font-semibold text-champagne">
              <Star size={12} fill="currentColor" />
              {restaurant.award.replaceAll("_", " ")}
            </span>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-ink/60">
            {restaurant.matchReason || restaurant.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-lg border border-ink/10 bg-porcelain px-2.5 py-1 text-xs font-semibold text-ink/60"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink/60">
            <Heart size={15} />
            {restaurant.likesCount}
          </span>
          <button
            onClick={saveToCollection}
            disabled={saving || saved}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-rouge px-3 text-sm font-semibold text-white transition hover:bg-[#9d2626] disabled:bg-moss"
          >
            {saved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
