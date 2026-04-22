"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Armchair,
  Check,
  CircleDollarSign,
  Flame,
  Gem,
  Heart,
  Loader2,
  MapPin,
  Sparkles,
  Utensils,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import type { RestaurantDto } from "@/types/api";
import { cn } from "@/lib/cn";

type QuestionKey = "occasion" | "vibe" | "budget" | "city";

type Option = {
  value: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

type Question = {
  key: QuestionKey;
  label: string;
  question: string;
  intro: string;
  options: Option[];
};

const questions: Question[] = [
  {
    key: "occasion",
    label: "Occasion",
    question: "C'est pour quelle occasion ?",
    intro:
      "Tournons la premiere page. Le Guide commence par le moment que vous voulez vivre.",
    options: [
      {
        value: "date",
        label: "A deux",
        detail: "Une table intime, precise, memorisable.",
        icon: Heart
      },
      {
        value: "friends",
        label: "En groupe",
        detail: "Un lieu vivant, facile a partager.",
        icon: Users
      },
      {
        value: "special",
        label: "Occasion speciale",
        detail: "Une table qui marque le moment.",
        icon: Sparkles
      },
      {
        value: "casual",
        label: "Juste manger",
        detail: "Une adresse juste bonne, sans ceremonie.",
        icon: Utensils
      }
    ]
  },
  {
    key: "vibe",
    label: "Ambiance",
    question: "Quelle ambiance vous attire ?",
    intro:
      "Le decor compte autant que l'assiette. Choisissez le ton de la soiree.",
    options: [
      {
        value: "cosy",
        label: "Cosy",
        detail: "Chaleureux, calme, proche.",
        icon: Armchair
      },
      {
        value: "trendy",
        label: "Trendy",
        detail: "Actuel, vibrant, a raconter.",
        icon: Flame
      },
      {
        value: "luxe",
        label: "Luxe",
        detail: "Service, precision, grande experience.",
        icon: Gem
      },
      {
        value: "chill",
        label: "Chill",
        detail: "Simple, bon, sans pression.",
        icon: Sparkles
      }
    ]
  },
  {
    key: "budget",
    label: "Budget",
    question: "Quel budget envisagez-vous ?",
    intro: "Du plaisir accessible a la grande table, on ajuste la selection.",
    options: [
      {
        value: "MEDIUM",
        label: "Modere",
        detail: "Une sortie maitrisee, mais premium.",
        icon: CircleDollarSign
      },
      {
        value: "HIGH",
        label: "Eleve",
        detail: "Pour se faire plaisir sans compromis.",
        icon: CircleDollarSign
      },
      {
        value: "LUXURY",
        label: "Exception",
        detail: "Une adresse qui marque une occasion.",
        icon: CircleDollarSign
      }
    ]
  },
  {
    key: "city",
    label: "Ville",
    question: "Dans quelle ville chercher ?",
    intro:
      "Derniere page. La recommandation partira d'une vraie base Michelin geolocalisee.",
    options: [
      {
        value: "Paris",
        label: "Paris",
        detail: "La ville la plus complete pour votre demo.",
        icon: MapPin
      },
      {
        value: "Tokyo",
        label: "Tokyo",
        detail: "Haute densite, selections tres fortes.",
        icon: MapPin
      },
      {
        value: "London",
        label: "London",
        detail: "Scene moderne et lisible.",
        icon: MapPin
      },
      {
        value: "New York",
        label: "New York",
        detail: "Parfait pour montrer le cote lifestyle.",
        icon: MapPin
      }
    ]
  }
];

type Answers = Partial<Record<QuestionKey, string>>;

type NarrativeFilterProps = {
  immersive?: boolean;
  embedded?: boolean;
  onRecommendationsReady?: (payload: {
    title: string;
    restaurants: RestaurantDto[];
  }) => void;
  onRecommendationsReset?: () => void;
};

const PAGE_TRANSITION_DURATION_MS = 340;

function buildPayload(answers: Answers) {
  return {
    occasion: answers.occasion || "date",
    vibes: [answers.vibe || "cosy"],
    budget: answers.budget || "HIGH",
    city: answers.city || "Paris"
  };
}

export function NarrativeFilter({
  immersive = false,
  embedded = false,
  onRecommendationsReady,
  onRecommendationsReset
}: NarrativeFilterProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [turning, setTurning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [title, setTitle] = useState("Votre selection Michelin apparaitra ici");
  const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[step];
  const leftQuestion = currentQuestion;
  const rightQuestion = currentQuestion;
  const progress = ((step + 1) / questions.length) * 100;
  const rightProgress = progress;

  async function runRecommendation(nextAnswers: Answers) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildPayload(nextAnswers))
      });

      if (!response.ok) {
        throw new Error("Recommendation request failed");
      }

      const data = (await response.json()) as {
        title: string;
        restaurants: RestaurantDto[];
      };

      setTitle(data.title);
      setRestaurants(data.restaurants);
      setFinished(true);
      onRecommendationsReady?.({
        title: data.title,
        restaurants: data.restaurants
      });
    } catch {
      setError("Impossible de generer la selection pour le moment.");
    } finally {
      setLoading(false);
      setTurning(false);
    }
  }

  function choose(option: Option) {
    if (turning || loading) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: option.value
    };

    setAnswers(nextAnswers);
    setTurning(true);

    window.setTimeout(() => {
      if (step === questions.length - 1) {
        void runRecommendation(nextAnswers);
        return;
      }

      setStep((current) => current + 1);
      setTurning(false);
    }, PAGE_TRANSITION_DURATION_MS);
  }

  function goBack() {
    if (turning || loading) {
      return;
    }

    if (finished) {
      setFinished(false);
      setRestaurants([]);
      setError(null);
      setStep(questions.length - 1);
      onRecommendationsReset?.();
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  }

  function reset() {
    if (loading) {
      return;
    }

    setStep(0);
    setAnswers({});
    setFinished(false);
    setRestaurants([]);
    setTitle("Votre selection Michelin apparaitra ici");
    setError(null);
    onRecommendationsReset?.();
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl",
        immersive && "px-0",
        embedded && "flex h-full max-w-none flex-col"
      )}
    >
      {!embedded ? (
        <div
          className={cn(
            "flex items-center gap-4",
            immersive ? "mb-4" : "mb-5"
          )}
        >
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-[#DDDDDD] bg-white text-ink shadow-[0_1px_12px_rgba(204,204,204,0.72)] transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-rouge focus:ring-offset-2"
            aria-label="Revenir a la page precedente"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#DDDDDD]">
            <motion.div
              className="h-full bg-rouge"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#757575]">
            {step + 1}/{questions.length}
          </span>
        </div>
      ) : null}

      <section
        className={cn(
          "relative px-0",
          embedded
            ? "flex min-h-0 flex-1 flex-col overflow-hidden pb-0"
            : immersive
              ? "pb-0"
              : "pb-10"
        )}
        style={{ perspective: "2400px" }}
      >
        <motion.div
          className={cn(
            "mx-auto grid grid-cols-1 md:grid-cols-2",
            embedded
              ? "michelin-embedded-open-book h-full min-h-0 flex-1 overflow-hidden rounded-lg"
              : "michelin-open-book"
          )}
          animate={{
            scale: turning ? 0.992 : 1,
            y: turning ? -2 : 0
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={
            embedded
              ? undefined
              : { minHeight: immersive ? "min(62dvh, 590px)" : "560px" }
          }
        >
          <div
            className={cn(
              "michelin-book-page michelin-book-page-left flex flex-col",
              embedded
                ? "michelin-embedded-page min-h-0 overflow-hidden p-5 sm:p-6"
                : "p-6 sm:p-9"
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rouge">
                Chapitre {step + 1}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#757575]">
                {leftQuestion.label}
              </span>
            </div>

            <div className="mb-6 border-t border-[#DDDDDD]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${step}-${finished}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ delay: turning ? 0.18 : 0.04, duration: 0.32 }}
                className="flex flex-1 flex-col"
              >
                <h1
                  className={cn(
                    "michelin-book-question-title leading-tight text-ink",
                    embedded
                      ? "text-3xl sm:text-[2.45rem]"
                      : "text-3xl sm:text-4xl"
                  )}
                >
                  {finished ? "Votre chapitre est pret." : leftQuestion.question}
                </h1>

                <p
                  className={cn(
                    "michelin-book-question-intro text-[#4D4D4D]",
                    embedded ? "mt-4 text-sm leading-6" : "mt-5 text-base leading-7"
                  )}
                >
                  {finished
                    ? "Le Guide a compose une shortlist avec vos criteres. Vous pouvez ouvrir une fiche, garder une adresse ou recommencer."
                    : leftQuestion.intro}
                </p>

                <div className="mt-auto pt-8">
                  <div className="michelin-guide-signature flex items-center gap-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-rouge"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2l2.6 6.9L22 10l-5.5 4.7L18.2 22 12 18l-6.2 4 1.7-7.3L2 10l7.4-1.1z" />
                    </svg>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#6F675F]">
                      Le Guide Michelin
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 text-center text-xs italic text-[#999999]">
              - {step * 2 + 1} -
            </div>
          </div>

          <div
            className={cn(
              "michelin-book-page michelin-book-page-right relative flex flex-col",
              embedded
                ? "michelin-embedded-page min-h-0 overflow-hidden p-5 sm:p-6"
                : "p-6 sm:p-9"
            )}
          >
            {embedded ? (
              <div className="mb-5 flex items-center gap-4">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#DDDDDD]">
                  <motion.div
                    className="h-full bg-rouge"
                    initial={false}
                    animate={{ width: `${rightProgress}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#757575]">
                  {step + 1}/{questions.length}
                </span>
              </div>
            ) : null}

            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#757575]">
                Vos choix
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rouge">
                {finished ? "Resultat" : `${rightQuestion.options.length} options`}
              </span>
            </div>

            <div className="mb-6 border-t border-[#DDDDDD]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${step}-${finished}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex min-h-0 flex-1 flex-col",
                  embedded ? "gap-2.5 overflow-hidden" : "gap-3"
                )}
              >
                {finished ? (
                  <div className="flex flex-1 flex-col justify-center rounded border border-[#E8E8E8] bg-white/70 p-5 text-center">
                    <Check className="mx-auto text-rouge" size={28} />

                    <h2 className="mt-4 text-xl font-semibold text-ink">
                      Selection generee
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#4D4D4D]">
                      {restaurants.length} restaurants correspondent a votre
                      moment.
                    </p>

                    <Button onClick={reset} variant="secondary" className="mt-5">
                      Recommencer
                    </Button>
                  </div>
                ) : (
                  rightQuestion.options.map((option, index) => {
                    const Icon = option.icon;
                    const selected =
                      answers[rightQuestion.key] === option.value;

                    return (
                      <motion.button
                        type="button"
                        key={option.value}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.05 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => choose(option)}
                        disabled={turning || loading}
                        className={cn(
                          "group flex items-center rounded border border-[#DDDDDD] bg-white/75 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:border-rouge hover:bg-white disabled:opacity-55",
                          embedded
                            ? "min-h-[58px] gap-3 px-3 py-2.5"
                            : "min-h-[76px] gap-4 px-4 py-3",
                          selected && "border-rouge bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "flex shrink-0 items-center justify-center rounded bg-[#F5F4F2] text-rouge",
                            embedded ? "h-9 w-9" : "h-11 w-11"
                          )}
                        >
                          <Icon size={embedded ? 18 : 20} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block font-medium text-ink",
                              embedded ? "text-lg" : "text-base"
                            )}
                          >
                            {option.label}
                          </span>

                          {!embedded ? (
                            <span className="mt-1 block text-sm leading-5 text-[#757575]">
                              {option.detail}
                            </span>
                          ) : null}
                        </span>

                        {turning && selected ? (
                          <Loader2
                            size={18}
                            className="shrink-0 animate-spin text-rouge"
                          />
                        ) : (
                          <span className="shrink-0 text-rouge opacity-0 transition group-hover:opacity-100">
                            <Check size={18} />
                          </span>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 text-center text-xs italic text-[#999999]">
              - {step * 2 + 2} -
            </div>

            <AnimatePresence>
              {turning ? (
                <motion.div
                  className="michelin-quick-page-effect"
                  initial={{ opacity: 0, x: "-42%" }}
                  animate={{ opacity: [0, 1, 0], x: "72%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {!embedded ? (
          <p
            className={cn(
              "text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#757575]",
              immersive ? "mt-4" : "mt-6"
            )}
          >
            Touchez une reponse pour continuer le Guide
          </p>
        ) : null}
      </section>

      {!immersive ? (
        <section className="space-y-4 pb-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 h-1 w-[54px] rounded bg-rouge" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999999]">
                Resultat
              </p>

              <h2 className="mt-1 text-2xl font-medium text-ink">{title}</h2>
            </div>

            {loading ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#757575]">
                <Loader2 size={16} className="animate-spin" />
                Generation en cours
              </span>
            ) : null}
          </div>

          {error ? (
            <div className="rounded border border-rouge/30 bg-white p-5 text-sm font-medium text-rouge shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {error}
            </div>
          ) : null}

          {restaurants.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : !error ? (
            <div className="rounded border border-dashed border-[#CCCCCC] bg-white/65 p-6 text-sm leading-6 text-[#757575]">
              Repondez aux pages du Guide pour faire apparaitre une selection
              issue de l'API recommandations, Prisma et PostgreSQL.
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
