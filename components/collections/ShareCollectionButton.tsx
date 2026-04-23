"use client";

import { useState } from "react";
import { Share2, Check, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ShareCollectionButton({ collection }: { collection: any }) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  async function handleCopyLink() {
    const url = `${window.location.origin}/collections/${collection.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }

  async function handleDownloadImage() {
    setGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Card dimensions (Instagram story/post size friendly)
      const width = 1080;
      const height = 1600;
      canvas.width = width;
      canvas.height = height;

      // 1. Background
      ctx.fillStyle = "#12100d"; // Ink color
      ctx.fillRect(0, 0, width, height);

      // 2. Draw helper for rounded images
      const drawRoundedImage = (img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      };

      // 3. Load Images
      const imageUrls = collection.items.slice(0, 4).map((it: any) => it.restaurant.imageUrl);
      const images = await Promise.all(
        imageUrls.map((url: string) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => reject();
          });
        }).filter(Boolean)
      );

      // 4. Draw Image Grid (2x2)
      const padding = 60;
      const gap = 24;
      const gridY = 320;
      const imgSize = (width - padding * 2 - gap) / 2;

      images.forEach((img, i) => {
        const x = padding + (i % 2) * (imgSize + gap);
        const y = gridY + Math.floor(i / 2) * (imgSize + gap);
        drawRoundedImage(img, x, y, imgSize, imgSize, 30);
      });

      // 5. Text content
      // Title
      ctx.fillStyle = "#f3eee2"; // Champagne color
      ctx.font = "bold 72px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(collection.title.toUpperCase(), width / 2, 180);

      // Subtitle
      ctx.fillStyle = "rgba(243, 238, 226, 0.6)";
      ctx.font = "32px sans-serif";
      ctx.fillText(`UNE COLLECTION DE ${collection.owner.name.toUpperCase()}`, width / 2, 240);

      // Footer - Box for better visibility
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, height - 200, width, 200);

      // Footer - URL
      ctx.fillStyle = "#bd2333"; // Rouge Michelin
      ctx.font = "bold 42px sans-serif";
      ctx.fillText(`michelin.app/collections/${collection.id}`, width / 2, height - 100);

      // Michelin Star Icon (optional)
      const starImg = new Image();
      starImg.src = "/icons/Etoile_Michelin-1.png";
      await new Promise((r) => { starImg.onload = r; });
      ctx.drawImage(starImg, width / 2 - 40, 40, 80, 80);

      // 6. Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `collection-${collection.title}.png`;
      link.href = dataUrl;
      link.click();
      
      setShowMenu(false);
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Erreur lors de la génération. Certains serveurs d'images peuvent bloquer l'accès direct.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        title="Partager cette collection"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur transition",
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
              onClick={handleCopyLink}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-porcelain"
            >
              <span>Copier le lien</span>
              {copied ? <Check size={16} className="text-moss" /> : <Share2 size={16} className="text-ink/30" />}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={generating}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-porcelain disabled:opacity-50"
            >
              <span>{generating ? "Génération..." : "Télécharger l'image"}</span>
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="text-ink/30" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
