"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function CollectionActions({
  collectionId,
  initialTitle,
  initialDescription,
  initialIsPublic
}: {
  collectionId: string;
  initialTitle: string;
  initialDescription: string | null;
  initialIsPublic: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  // Edit form state
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cette collection ?")) return;
    setBusy(true);

    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        router.push("/collections");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          isPublic
        })
      });

      if (res.ok) {
        setIsEditing(false);
        setOpen(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
            <button
              onClick={() => {
                setIsEditing(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-ink transition hover:bg-porcelain text-left"
            >
              <Pencil size={16} className="text-ink/60" />
              Modifier
            </button>
            <button
              onClick={() => {
                setOpen(false);
                handleDelete();
              }}
              disabled={busy}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-rouge transition hover:bg-rouge/5 text-left"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </>
      )}

      {/* Edit Modal (simple inline for now) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => setIsEditing(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-porcelain p-6 shadow-2xl sm:rounded-3xl">
            <h2 className="mb-6 text-xl font-semibold text-ink">
              Modifier la collection
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink/70">Nom</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border-none bg-white p-3.5 text-ink ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-inset focus:ring-rouge"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink/70">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 w-full resize-none rounded-xl border-none bg-white p-3.5 text-ink ring-1 ring-inset ring-ink/10 focus:ring-2 focus:ring-inset focus:ring-rouge"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublicEdit"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-ink/20 text-rouge focus:ring-rouge"
                />
                <label htmlFor="isPublicEdit" className="text-sm text-ink/70">
                  Collection publique
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={busy || !title.trim()}
                  className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50"
                >
                  {busy ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
