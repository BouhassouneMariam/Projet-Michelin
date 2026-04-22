"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, Layers3, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CollectionOption = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  items: Array<{ restaurant: { id: string } }>;
};

export function AddToCollectionModal({
  restaurantId,
  open,
  onClose
}: {
  restaurantId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/collections");
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections);

        // Pre-mark collections that already contain this restaurant
        const alreadyIn = new Set<string>();
        for (const c of data.collections as CollectionOption[]) {
          if (c.items.some((item) => item.restaurant.id === restaurantId)) {
            alreadyIn.add(c.id);
          }
        }
        setAdded(alreadyIn);
      }
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (open) {
      fetchCollections();
    }
  }, [open, fetchCollections]);

  async function handleAdd(collectionId: string) {
    setAdding(collectionId);
    setError(null);

    try {
      const response = await fetch(
        `/api/collections/${collectionId}/restaurants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restaurantId })
        }
      );

      if (response.ok) {
        setAdded((prev) => new Set(prev).add(collectionId));
      } else if (response.status === 409) {
        setAdded((prev) => new Set(prev).add(collectionId));
        setError("Ce restaurant est déjà dans cette collection");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setAdding(null);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            className="relative w-full max-w-md overflow-hidden rounded-t-2xl bg-porcelain shadow-premium sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
              <div className="flex items-center gap-2">
                <Layers3 size={18} className="text-rouge" />
                <h2 className="text-lg font-semibold text-ink">
                  Ajouter à une collection
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto px-5 py-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-ink/30" />
                </div>
              ) : collections.length === 0 ? (
                <div className="py-12 text-center">
                  <Layers3 size={36} className="mx-auto mb-3 text-ink/20" />
                  <p className="text-sm text-ink/50">
                    Aucune collection. Créez-en une d&apos;abord !
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {collections.map((collection) => {
                    const isAdded = added.has(collection.id);
                    const isAdding = adding === collection.id;

                    return (
                      <button
                        key={collection.id}
                        onClick={() => !isAdded && handleAdd(collection.id)}
                        disabled={isAdded || isAdding}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition hover:bg-white/60 disabled:cursor-default disabled:opacity-70"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink/5">
                          {isAdding ? (
                            <Loader2 size={16} className="animate-spin text-rouge" />
                          ) : isAdded ? (
                            <Check size={16} className="text-moss" />
                          ) : (
                            <Plus size={16} className="text-ink/40" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">
                            {collection.title}
                          </p>
                          <p className="truncate text-xs text-ink/40">
                            {collection.items.length} spots •{" "}
                            {collection.isPublic ? "Public" : "Privé"}
                          </p>
                        </div>

                        {isAdded && (
                          <span className="shrink-0 text-xs font-medium text-moss">
                            Ajouté
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="border-t border-ink/8 px-5 py-3">
                <p className="text-xs font-medium text-rouge">{error}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
