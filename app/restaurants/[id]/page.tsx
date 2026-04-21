import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Star } from "lucide-react";
import { BadgePill } from "@/components/shared/BadgePill";
import { getRestaurantById } from "@/features/restaurants/restaurant.queries";

export default async function RestaurantDetailPage({
  params
}: {
  params: { id: string };
}) {
  const restaurant = await getRestaurantById(params.id);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="pb-8">
      <section className="relative min-h-[48vh] overflow-hidden bg-ink text-white">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 flex min-h-[48vh] flex-col justify-between px-5 py-6">
          <Link
            href="/discover"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="space-y-3">
            <BadgePill icon={<Star size={14} />} tone="dark">
              {restaurant.award.replaceAll("_", " ")}
            </BadgePill>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight">
              {restaurant.name}
            </h1>
            <p className="flex items-center gap-2 text-sm text-white/75">
              <MapPin size={16} />
              {restaurant.district}, {restaurant.city}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 px-5 pt-6">
        <p className="max-w-3xl text-base leading-7 text-ink/70">
          {restaurant.description}
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
              Cuisine
            </p>
            <p className="mt-1 font-semibold">{restaurant.cuisine}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
              Budget
            </p>
            <p className="mt-1 font-semibold">{restaurant.priceLabel}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
              Social
            </p>
            <p className="mt-1 font-semibold">{restaurant.likesCount} likes</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-lg border border-ink/10 bg-white/60 px-3 py-2 text-xs font-semibold text-ink/70"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {restaurant.sourceUrl ? (
          <a
            href={restaurant.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
          >
            Michelin source
            <ExternalLink size={16} />
          </a>
        ) : null}
      </section>
    </main>
  );
}
