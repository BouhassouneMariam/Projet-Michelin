"use client";

import { Layers3, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { CollectionDto } from "@/types/api";

export function CollectionCard({
  collection,
  index = 0
}: {
  collection: CollectionDto;
  index?: number;
}) {
  const firstImage = collection.coverUrl || collection.items[0]?.restaurant.imageUrl;
  const restaurantCount = collection.items.length;

  return (
    <Link href={`/collections/${collection.id}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: index * 0.06 }}
        className="group relative overflow-hidden rounded-xl border border-ink/8 bg-white/80 shadow-sm backdrop-blur transition-shadow hover:shadow-premium"
      >
        {/* Cover image */}
        <div className="relative h-40 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne to-porcelain">
              <Layers3 size={36} className="text-ink/20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold leading-tight text-white drop-shadow-sm">
                {collection.title}
              </h2>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {collection.isPublic ? (
                <Globe size={12} />
              ) : (
                <Lock size={12} />
              )}
              {collection.isPublic ? "Public" : "Privé"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {collection.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-ink/60">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {collection.owner.avatarUrl && (
                <img
                  src={collection.owner.avatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
                />
              )}
              <span className="text-xs font-medium text-ink/50">
                @{collection.owner.username}
              </span>
            </div>

            <span className="rounded-lg bg-porcelain px-2.5 py-1 text-xs font-semibold tabular-nums text-ink/60">
              {restaurantCount} {restaurantCount === 1 ? "spot" : "spots"}
            </span>
          </div>

          {/* Restaurant thumbnails strip */}
          {collection.items.length > 0 && (
            <div className="flex gap-1.5 overflow-hidden">
              {collection.items.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                >
                  {item.restaurant.imageUrl ? (
                    <img
                      src={item.restaurant.imageUrl}
                      alt={item.restaurant.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-champagne" />
                  )}
                </div>
              ))}
              {collection.items.length > 4 && (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-xs font-semibold text-ink/40">
                  +{collection.items.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
