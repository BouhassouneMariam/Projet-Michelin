"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import type { RestaurantDto } from "@/types/api";
import { cn } from "@/lib/cn";

const occasions = [
  { label: "Date", value: "date" },
  { label: "Friends", value: "friends" },
  { label: "Solo", value: "solo" }
];

const vibes = [
  { label: "Cosy", value: "cosy" },
  { label: "Trendy", value: "trendy" },
  { label: "Luxury", value: "luxe" },
  { label: "Chill", value: "chill" }
];

const budgets = [
  { label: "$$", value: "MEDIUM" },
  { label: "$$$", value: "HIGH" },
  { label: "$$$$", value: "LUXURY" }
];

const cities = ["Paris", "Tokyo", "London", "New York"];

export function NarrativeFilter() {
  const [occasion, setOccasion] = useState("date");
  const [vibe, setVibe] = useState("cosy");
  const [budget, setBudget] = useState("HIGH");
  const [city, setCity] = useState("Paris");
  const [title, setTitle] = useState("Your Michelin shortlist appears here");
  const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
  const [loading, setLoading] = useState(false);

  const payload = useMemo(
    () => ({
      occasion,
      vibes: [vibe],
      budget,
      city
    }),
    [budget, city, occasion, vibe]
  );

  async function submit() {
    setLoading(true);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        title: string;
        restaurants: RestaurantDto[];
      };

      setTitle(data.title);
      setRestaurants(data.restaurants);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
      <section className="rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm backdrop-blur">
        <div className="space-y-5">
          <Question title="With who?">
            <Segmented
              value={occasion}
              options={occasions}
              onChange={setOccasion}
            />
          </Question>

          <Question title="Ambiance?">
            <Segmented value={vibe} options={vibes} onChange={setVibe} />
          </Question>

          <Question title="Budget?">
            <Segmented value={budget} options={budgets} onChange={setBudget} />
          </Question>

          <Question title="City?">
            <div className="grid grid-cols-2 gap-2">
              {cities.map((item) => (
                <button
                  key={item}
                  onClick={() => setCity(item)}
                  className={cn(
                    "h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-semibold text-ink/60 transition",
                    city === item && "border-ink bg-ink text-champagne"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </Question>

          <Button className="w-full" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Generate selection
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
              Result
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{title}</h2>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-8 text-sm leading-6 text-ink/60"
          >
            Pick a context, run the filter, then save a restaurant into your
            default collection. The API uses Prisma and PostgreSQL behind the
            scenes.
          </motion.div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Question({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-11 rounded-lg border border-ink/10 bg-porcelain px-2 text-sm font-semibold text-ink/60 transition",
            value === option.value && "border-ink bg-ink text-champagne"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
