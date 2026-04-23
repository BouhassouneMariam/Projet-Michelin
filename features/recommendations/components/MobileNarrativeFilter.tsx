"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { RestaurantDto } from "@/types/api";

type Option = {
  value: string;
  label: string;
  iconName?: string;
};

type Question = {
  key: string;
  label: string;
  question: string;
  options: Option[];
};

type MobileNarrativeFilterProps = {
  initialQuestions: Question[];
  onRecommendationsReady: (data: { title: string; restaurants: RestaurantDto[] }) => void;
};

export function MobileNarrativeFilter({
  initialQuestions,
  onRecommendationsReady,
}: MobileNarrativeFilterProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Header
  const router = useRouter();

  const currentQuestion = initialQuestions[step];
  const progress = ((step + 1) / initialQuestions.length) * 100;

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  }

  async function handleContinue() {
    const currentAnswer = answers[currentQuestion.key];
    if (!currentAnswer) return;

    if (step < initialQuestions.length - 1) {
      setStep(step + 1);
    } else {
      // Finish
      setLoading(true);
      try {
        const payload = {
          occasion: answers["occasion"] || "date",
          budget: answers["budget"] || "HIGH",
          city: answers["city"] || "Paris",
          vibes: Object.entries(answers)
            .filter(([key]) => !["occasion", "budget", "city"].includes(key))
            .map(([_, v]) => v)
        };

        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        onRecommendationsReady(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  function toggleOption(value: string) {
    setAnswers({ ...answers, [currentQuestion.key]: value });
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-rouge text-white">
      {/* Progress Bar */}
      <div className="flex gap-1.5 px-6 pt-14">
        {initialQuestions.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              i <= step ? "bg-white" : "bg-white/30"
            )} 
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button 
          onClick={handleBack}
          className="p-2 opacity-80 hover:opacity-100 transition active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Content */}
      <main className="flex flex-1 flex-col px-8">
        <p className="text-lg font-medium opacity-80">
          Question <span className="text-2xl font-bold opacity-100">{step + 1}</span>/{initialQuestions.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6"
          >
            <h2 className="text-4xl font-bold leading-tight">
              {currentQuestion.question}
            </h2>

            <div className="mt-10 grid gap-3 max-h-[45vh] overflow-y-auto no-scrollbar pb-10">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.key] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 px-6 py-5 transition-all duration-200",
                      selected 
                        ? "bg-white text-rouge border-white shadow-lg scale-[1.02]" 
                        : "bg-transparent border-white/20 hover:border-white/40"
                    )}
                  >
                    <span className="text-lg font-bold">{option.label}</span>
                    {selected && <Check size={20} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-8 pb-12 pt-4">
        <button
          onClick={handleContinue}
          disabled={!answers[currentQuestion.key] || loading}
          className={cn(
            "flex h-16 w-full items-center justify-center rounded-2xl text-lg font-bold transition-all duration-300",
            answers[currentQuestion.key]
              ? "bg-white text-rouge shadow-xl active:scale-95"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : step === initialQuestions.length - 1 ? (
            "Voir ma sélection"
          ) : (
            "Continuer"
          )}
        </button>
      </footer>
    </div>
  );
}
