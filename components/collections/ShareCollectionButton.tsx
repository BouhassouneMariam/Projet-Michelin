"use client";

import { useState } from "react";
import { Check, Copy, Send, Share2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ShareCollectionButton({
  collection,
  title,
  shareUrl,
}: {
  collection?: {
    id?: string;
    title?: string;
  } | null;
  title?: string;
  shareUrl?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const resolvedTitle = title ?? collection?.title ?? "Collection Michelin";
  const resolvedShareUrl =
    shareUrl ??
    (typeof window !== "undefined" && collection?.id
      ? `${window.location.origin}/collections/${collection.id}`
      : "");

  async function handleCopyLink() {
    if (!resolvedShareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedShareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  }

  async function handleShare() {
    if (!resolvedShareUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: resolvedTitle,
          text: `Découvrez ma collection Michelin : ${resolvedTitle}`,
          url: resolvedShareUrl,
        });
        setShowMenu(false);
        return;
      }

      await handleCopyLink();
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Failed to share", error);
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        title="Partager cette collection"
        disabled={!resolvedShareUrl}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-50",
          showMenu ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20"
        )}
      >
        <Share2 size={20} />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-ink/10 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2">
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-porcelain"
            >
              <span>Partager</span>
              <Send size={16} className="text-ink/30" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-porcelain"
            >
              <span>{copied ? "Lien copié" : "Copier le lien"}</span>
              {copied ? (
                <Check size={16} className="text-moss" />
              ) : (
                <Copy size={16} className="text-ink/30" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
