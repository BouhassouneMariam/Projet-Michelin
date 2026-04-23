"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareCollectionButton({ collectionId }: { collectionId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;

    const url = `${window.location.origin}/collections/${collectionId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }

  return (
    <button
      onClick={handleShare}
      title="Partager cette collection"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
    >
      {copied ? <Check size={20} className="text-moss" /> : <Share2 size={20} />}
    </button>
  );
}
