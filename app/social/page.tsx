"use client";

import { Users, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SocialPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F7] pb-32">
      <header className="px-6 py-8">
        <h1 className="text-3xl font-bold text-ink">Social</h1>
        <p className="mt-2 text-ink/50">Connectez-vous avec la communauté Michelin.</p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-rouge/10 scale-150" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
            <Users size={40} className="text-rouge" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-ink">Arrive bientôt !</h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Nous préparons une nouvelle façon de partager vos collections, de suivre vos amis et de découvrir les tables préférées des ambassadeurs Michelin.
        </p>

        <div className="mt-10 grid w-full gap-4">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-porcelain">
              <Sparkles size={20} className="text-rouge" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Suivez vos amis</p>
              <p className="text-xs text-ink/40">Découvrez leurs nouvelles trouvailles.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-porcelain">
              <MessageCircle size={20} className="text-rouge" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Partagez vos avis</p>
              <p className="text-xs text-ink/40">Échangez sur vos expériences culinaires.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
