"use client";

import { Search, Compass, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import type { RestaurantDto } from "@/types/api";

type MobileHomeProps = {
  restaurants: RestaurantDto[];
};

export function MobileHome({ restaurants }: MobileHomeProps) {
  // Extract featured content
  const featuredRestaurants = restaurants.slice(0, 5);
  const parisRestaurants = restaurants.filter(r => r.city === "Paris").slice(0, 6);

  const articles = [
    {
      id: 1,
      title: "Tour du monde des restaurants les plus originaux",
      time: "5 min",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "La liste complète des restaurants étoilés",
      time: "3 min",
      image: "",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F7] pb-24 md:hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <h1 className="text-3xl font-bold text-ink">Accueil</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95">
          <Search size={20} className="text-ink" />
        </button>
      </header>

      {/* Discovery Hero Card */}
      <section className="px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-rouge px-8 py-10 text-white shadow-xl">
          {/* Abstract pattern decoration */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold">Découverte</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Répondez à quelques questions et trouvez le restaurant idéal pour satisfaire vos envies.
            </p>
            <Link 
              href="/discover"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#E31E44] text-sm font-bold shadow-lg transition active:scale-[0.98] active:brightness-95"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Articles / À la Une */}
      <section className="mt-10">
        <div className="flex items-center justify-between px-6 mb-4">
          <h3 className="text-xl font-bold text-ink">À la Une</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {articles.map((article) => (
            <div key={article.id} className="relative min-w-[280px] h-[200px] flex-shrink-0 overflow-hidden rounded-3xl shadow-sm bg-porcelain">
              {article.image ? (
                <>
                  <img src={article.image} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-porcelain">
                  <span className="text-5xl text-rouge opacity-10">✽</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-bold leading-tight">{article.title}</p>
                <p className="mt-1 text-[10px] opacity-70 flex items-center gap-1">
                  <Compass size={10} /> {article.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurants à Paris */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-6 mb-4">
          <h3 className="text-xl font-bold text-ink">Restaurants à Paris</h3>
          <Link href="/map?search=Paris" className="text-xs font-bold text-rouge">Tout voir</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {parisRestaurants.map((restaurant) => (
            <Link 
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="relative min-w-[240px] flex-shrink-0 group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-porcelain">
                {restaurant.imageUrl ? (
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="h-full w-full object-cover transition duration-500 group-active:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-4xl text-rouge opacity-20">✽</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-ink truncate pr-2">{restaurant.name}</h4>
                  <div className="flex text-[8px] text-rouge">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="opacity-80">✽</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-ink/50 mt-1 uppercase font-bold tracking-wider">
                  {restaurant.city}, {restaurant.country}
                </p>
                <div className="mt-1 flex items-center justify-between">
                   <p className="text-[10px] text-ink/40">
                    {restaurant.budget} • {restaurant.cuisine}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
