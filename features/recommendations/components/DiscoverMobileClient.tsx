"use client";

import { useState } from "react";
import { MobileNarrativeFilter } from "./MobileNarrativeFilter";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import type { RestaurantDto } from "@/types/api";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export function DiscoverMobileClient({ initialQuestions }: { initialQuestions: any[] }) {
  const [recommendations, setRecommendations] = useState<{
    title: string;
    restaurants: RestaurantDto[];
  } | null>(null);

  if (!recommendations) {
    return (
      <MobileNarrativeFilter 
        initialQuestions={initialQuestions} 
        onRecommendationsReady={setRecommendations} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F7] pb-32">
      {/* Results Header */}
      <div className="bg-rouge px-6 pb-12 pt-16 text-white rounded-b-[40px] shadow-lg">
        <button 
          onClick={() => setRecommendations(null)}
          className="flex items-center gap-2 text-sm font-bold opacity-80"
        >
          <ArrowLeft size={18} />
          Retour au quiz
        </button>
        <h1 className="mt-6 text-3xl font-bold leading-tight">
          {recommendations.title}
        </h1>
        <p className="mt-2 text-white/70 text-sm">
          Voici les restaurants Michelin qui correspondent parfaitement à vos envies du moment.
        </p>
      </div>

      {/* Results List */}
      <main className="px-6 -mt-6">
        <div className="grid gap-6">
          {recommendations.restaurants.map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <RestaurantCard restaurant={restaurant} />
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setRecommendations(null)}
          className="mt-12 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-rouge py-4 font-bold text-rouge transition active:scale-95"
        >
          <RefreshCcw size={20} />
          Refaire le test
        </button>
      </main>
    </div>
  );
}
