"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Lock, MoreHorizontal } from "lucide-react";

export function LikedCollectionActions({
  initialIsPublic,
}: {
  initialIsPublic: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      const response = await fetch("/api/collections/__liked__", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic }),
      });

      if (response.ok) {
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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
            <button
              onClick={() => {
                setIsEditing(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-porcelain"
            >
              {isPublic ? (
                <Globe size={16} className="text-ink/60" />
              ) : (
                <Lock size={16} className="text-ink/60" />
              )}
              Modifier la confidentialité
            </button>
          </div>
        </>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsPublic(initialIsPublic);
              setIsEditing(false);
            }}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-porcelain p-6 shadow-2xl sm:rounded-3xl">
            <h2 className="mb-2 text-xl font-semibold text-ink">
              Confidentialité des coups de cœur
            </h2>
            <p className="mb-6 text-sm text-ink/60">
              Si cette collection est publique, elle devient partageable comme les autres collections.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-inset ring-ink/10">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-ink/20 text-rouge focus:ring-rouge"
                />
                <span className="text-sm text-ink/80">Coups de cœur publics</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPublic(initialIsPublic);
                    setIsEditing(false);
                  }}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={busy}
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
