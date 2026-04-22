"use client";

import { useState } from "react";
import { Plus, Layers3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CollectionCard } from "./CollectionCard";
import type { CollectionDto } from "@/types/api";

export function CollectionList({
  initialCollections
}: {
  initialCollections: CollectionDto[];
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true
  });
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim() || formData.title.trim().length < 2) return;

    setCreating(true);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const { collection } = await response.json();
        setCollections((prev) => [collection, ...prev]);
        setFormData({ title: "", description: "", isPublic: true });
        setShowForm(false);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Create button / form */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleCreate}
            className="overflow-hidden rounded-xl border border-ink/10 bg-white/80 p-5 shadow-sm backdrop-blur"
          >
            <h3 className="mb-4 text-lg font-semibold text-ink">
              Nouvelle collection
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="collection-title"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                >
                  Nom
                </label>
                <input
                  id="collection-title"
                  type="text"
                  required
                  minLength={2}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ma nouvelle liste..."
                  className="w-full rounded-lg border border-ink/10 bg-porcelain px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-rouge focus:outline-none focus:ring-2 focus:ring-rouge/20"
                />
              </div>

              <div>
                <label
                  htmlFor="collection-description"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                >
                  Description
                </label>
                <textarea
                  id="collection-description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Un petit mot sur cette collection..."
                  className="w-full resize-none rounded-lg border border-ink/10 bg-porcelain px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-rouge focus:outline-none focus:ring-2 focus:ring-rouge/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/70">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isPublic: e.target.checked
                      }))
                    }
                    className="h-4 w-4 rounded border-ink/20 accent-rouge"
                  />
                  Collection publique
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-rouge px-4 text-sm font-semibold text-white transition hover:bg-[#9d2626] disabled:opacity-50"
              >
                <Plus size={16} />
                {creating ? "Création..." : "Créer"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 rounded-lg px-4 text-sm font-semibold text-ink/50 transition hover:bg-ink/5"
              >
                Annuler
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(true)}
            className="group flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-ink/15 bg-white/40 px-5 py-5 text-sm font-semibold text-ink/50 transition hover:border-rouge/30 hover:bg-white/60 hover:text-rouge"
          >
            <Plus
              size={18}
              className="transition-transform group-hover:rotate-90"
            />
            Créer une collection
          </motion.button>
        )}
      </AnimatePresence>

      {/* Collection grid */}
      {collections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection, i) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink/15 py-16 text-center">
          <Layers3 size={40} className="text-ink/20" />
          <p className="text-sm font-medium text-ink/40">
            Aucune collection pour le moment
          </p>
        </div>
      )}
    </div>
  );
}
