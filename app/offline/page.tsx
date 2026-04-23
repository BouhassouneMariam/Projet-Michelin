import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[calc(100dvh-68px)] items-center justify-center px-5 py-12">
      <section className="w-full max-w-3xl border border-[#E8E1D8] bg-[#F7F2E8] px-6 py-10 shadow-[0_20px_60px_rgba(18,16,13,0.08)] sm:px-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rouge/10 text-rouge">
            <WifiOff size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rouge">
              Mode hors ligne
            </p>
            <h1 className="mt-1 text-3xl font-medium text-ink sm:text-4xl">
              Le Guide attend le reseau
            </h1>
          </div>
        </div>

        <p className="max-w-2xl text-base leading-7 text-[#5E564F]">
          L&apos;application est bien installee, mais cette page a besoin d&apos;une
          connexion pour charger les donnees Michelin les plus recentes. Tu peux
          revenir a l&apos;accueil ou reessayer des que le reseau revient.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded bg-rouge px-5 text-sm font-semibold text-white transition hover:bg-[#9d2626]"
          >
            Retour a l&apos;accueil
          </Link>
          <Link
            href="/discover"
            className="inline-flex h-11 items-center justify-center rounded border border-[#D8D0C6] bg-white/70 px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Reouvrir la decouverte
          </Link>
        </div>
      </section>
    </main>
  );
}
