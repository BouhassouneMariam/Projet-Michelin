"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MichelinBook } from "@/features/recommendations/components/MichelinBook";
import { NarrativeFilter } from "@/features/recommendations/components/NarrativeFilter";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import type { RestaurantDto } from "@/types/api";

type BookPhase = "closed" | "opening" | "open";
type RecommendationResult = {
  title: string;
  restaurants: RestaurantDto[];
};

type HomeBookExperienceProps = {
  startOpen?: boolean;
};

export function HomeBookExperience({
  startOpen = false
}: HomeBookExperienceProps) {
  const [phase, setPhase] = useState<BookPhase>(startOpen ? "open" : "closed");
  const [contentVisible, setContentVisible] = useState(startOpen);
  const [recommendations, setRecommendations] =
    useState<RecommendationResult | null>(null);
  const timersRef = useRef<number[]>([]);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (!recommendations || recommendations.restaurants.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 260);

    return () => window.clearTimeout(timer);
  }, [recommendations]);

  function openGuide() {
    if (phase !== "closed") {
      return;
    }

    setRecommendations(null);
    setPhase("opening");
    setContentVisible(true);
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [
      window.setTimeout(() => setPhase("open"), 2350)
    ];
  }

  const isClosed = phase === "closed";

  return (
    <main className="michelin-paper overflow-x-hidden">
      <div className="relative h-[calc(100dvh-68px)] px-5 md:px-8">
        {!startOpen ? (
          <motion.section
            className="michelin-home-copy"
            initial={false}
            animate={{
              opacity: isClosed ? 1 : 0,
              filter: isClosed ? "blur(0px)" : "blur(6px)"
            }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!isClosed}
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-[11px] font-semibold uppercase tracking-normal text-rouge"
            >
              Edition 2026 - Nouvelle generation
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="mt-5 max-w-[560px] space-y-3"
            >
              <h1 className="text-5xl font-medium leading-[0.96] text-ink sm:text-6xl lg:text-7xl">
                Ouvrez le Guide.
              </h1>
              <p className="text-4xl font-medium italic leading-tight text-rouge sm:text-5xl lg:text-6xl">
                Trouvez votre table.
              </p>
              <p className="mx-auto max-w-[440px] pt-3 text-base leading-7 text-[#4D4D4D] md:mx-0">
                Une selection Michelin personnalisee selon le moment,
                l'ambiance et vos envies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="mt-7 flex flex-col items-center gap-2 md:items-start"
            >
              <button
                type="button"
                onClick={openGuide}
                className="inline-flex h-[52px] min-w-[280px] items-center justify-center gap-3 rounded-full bg-ink px-7 text-sm font-semibold text-white shadow-[0_18px_34px_-20px_rgba(25,25,25,0.8)] transition hover:bg-[#000000] focus:outline-none focus:ring-2 focus:ring-rouge focus:ring-offset-2 sm:min-w-[340px]"
              >
                Touchez le livre pour commencer
                <ArrowRight size={18} />
              </button>
              <p className="text-sm font-medium text-[#757575]">
                Filtre narratif - 4 questions - selection Michelin
              </p>
            </motion.div>
          </motion.section>
        ) : null}

        <motion.section
          className="michelin-home-book-shell"
          initial={false}
          animate={{
            x: isClosed ? "-42%" : "-50%",
            y: "-50%",
            scale: isClosed ? 0.86 : 1
          }}
          transition={{
            duration: isClosed ? 0.75 : 1.55,
            ease: [0.2, 0.78, 0.18, 1]
          }}
        >
          <MichelinBook
            status={phase}
            contentVisible={contentVisible}
            onOpen={openGuide}
          >
            <NarrativeFilter
              immersive
              embedded
              onRecommendationsReady={setRecommendations}
              onRecommendationsReset={() => setRecommendations(null)}
            />
          </MichelinBook>
        </motion.section>
      </div>

      {recommendations ? (
        <section className="relative z-20 mx-auto w-full max-w-6xl px-5 pb-24 pt-12 md:px-8">
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="scroll-mt-6"
          >
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 h-1 w-[54px] rounded bg-rouge" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#999999]">
                  Selection personnalisee
                </p>
                <h2 className="mt-2 text-3xl font-medium leading-tight text-ink sm:text-4xl">
                  {recommendations.title}
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#4D4D4D]">
                Des adresses Michelin filtrees selon votre moment, votre
                ambiance et votre budget.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  compact
                />
              ))}
            </div>
          </motion.div>
        </section>
      ) : null}
    </main>
  );
}
