import { NarrativeFilter } from "@/features/recommendations/components/NarrativeFilter";

export default function DiscoverPage() {
  return (
    <main className="px-5 pb-8 pt-6">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rouge">
          Narrative filter
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Find the right table for tonight
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-ink/60">
          Four quick choices, a real backend recommendation, and a list that
          can move directly into a personal collection.
        </p>
      </div>

      <NarrativeFilter />
    </main>
  );
}
