"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookmarkPlus, Loader2, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AddToCollectionModal } from "@/components/collections/AddToCollectionModal";
import { LikeButton } from "@/components/shared/LikeButton";
import type { RestaurantDto } from "@/types/api";

export function RestaurantCard({
  restaurant,
  compact = false,
  initialLiked = false
}: {
  restaurant: RestaurantDto;
  compact?: boolean;
  initialLiked?: boolean;
}) {
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [authPromptVisible, setAuthPromptVisible] = useState(false);
  const [checkingCollections, setCheckingCollections] = useState(false);
  const promptTimerRef = useRef<number | null>(null);
  const [isLogged,setIsLogged] =useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (promptTimerRef.current) {
        window.clearTimeout(promptTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/collections");

        if (response.status === 401) {
          setIsLogged(false);
          return;
        }

        if (response.ok) {
          setIsLogged(true);
        }
      } catch {
        setIsLogged(false);
      }
    }

    checkAuth();
  }, []);
  function showAuthPrompt() {
    setAuthPromptVisible(true);

    if (promptTimerRef.current) {
      window.clearTimeout(promptTimerRef.current);
    }

    promptTimerRef.current = window.setTimeout(() => {
      setAuthPromptVisible(false);
    }, 3600);
  }

  async function openCollectionModal() {
    if (checkingCollections) {
      return;
    }

    setCheckingCollections(true);

    try {
      const response = await fetch("/api/collections");

      if (response.status === 401) {
        showAuthPrompt();
        return;
      }

      if (response.ok) {
        setCollectionModalOpen(true);
      }
    } catch {
      showAuthPrompt();
    } finally {
      setCheckingCollections(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="relative overflow-hidden rounded-lg border border-ink/10 bg-white/70 shadow-sm backdrop-blur"
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
          <LikeButton
            restaurantId={restaurant.id}
            initialLiked={initialLiked}
            initialCount={restaurant.likesCount}
            onAuthRequired={showAuthPrompt}
            isLogged={isLogged}
          />
          {isLogged &&<button
            onClick={openCollectionModal}
            disabled={checkingCollections}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-rouge px-3 text-sm font-semibold text-white transition hover:bg-[#9d2626] disabled:opacity-70"
          >
            {checkingCollections ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <BookmarkPlus size={16} />
            )}
            Save
          </button>}
        </div>
      </div>

      {authPromptVisible ? (
        <div className="absolute bottom-[72px] right-4 z-20 max-w-[220px] rounded-lg border border-ink/10 bg-white px-3 py-2 text-xs font-medium leading-5 text-ink shadow-premium">
          Connectez-vous pour aimer ou sauvegarder ce restaurant.
          <Link
            href="/login"
            prefetch={false}
            className="ml-1 font-semibold text-rouge underline-offset-2 hover:underline"
          >
            Se connecter
          </Link>
        </div>
      ) : null}

       <AddToCollectionModal
        restaurantId={restaurant.id}
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
      />
    </motion.article>
  );
}
