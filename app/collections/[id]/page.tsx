import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Globe, Lock, Search } from "lucide-react";
import { BadgePill } from "@/components/shared/BadgePill";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { CollectionActions } from "@/components/collections/CollectionActions";
import { LikedCollectionActions } from "@/components/collections/LikedCollectionActions";
import { ShareCollectionButton } from "@/components/collections/ShareCollectionButton";
import { RemoveRestaurantButton } from "@/components/collections/RemoveRestaurantButton";
import { getCollection } from "@/features/collections/collection.service";
import { getUserLikedRestaurantIds, getLikedCollection } from "@/features/social/social.service";
import { getCurrentUserId } from "@/lib/auth";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const userId = getCurrentUserId();

  if (params.id === "__liked__") {
    return {
      title: "Mes coups de cœur | Michelin Next Gen",
      description: "Retrouvez tous les restaurants aimés dans votre collection privée.",
    };
  }

  const collection = await getCollection(params.id);

  if (!collection) {
    return { title: "Collection non trouvée" };
  }

  if (!collection.isPublic && collection.owner.id !== userId) {
    return { title: "Collection non trouvée" };
  }

  const collectionUrl = getAbsoluteUrl(`/collections/${collection.id}`);
  const ogImageUrl = getAbsoluteUrl(`/api/collections/${collection.id}/og`);
  const description =
    collection.description || `Une collection de ${collection.owner.name}`;

  return {
    title: `${collection.title} | Michelin Next Gen`,
    description,
    alternates: { canonical: collectionUrl },
    openGraph: {
      title: collection.title,
      description,
      url: collectionUrl,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Aperçu de la collection ${collection.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: collection.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = getCurrentUserId();
  const isLikedCollection = params.id === "__liked__";

  let collection;
  if (isLikedCollection) {
    if (!userId) {
      redirect("/login");
    }
    collection = await getLikedCollection(userId);
  } else {
    collection = await getCollection(params.id);
  }

  if (!collection) {
    notFound();
  }

  const isOwner = Boolean(userId && collection.owner.id === userId);
  const canManageCollection = isOwner && !isLikedCollection;

  if (!isLikedCollection && !collection.isPublic && !isOwner) {
    if (!userId) {
      redirect("/login");
    }
    notFound();
  }

  const likedIds = userId ? await getUserLikedRestaurantIds(userId) : [];
  const likedSet = new Set(likedIds);
  const firstImage = collection.coverUrl || collection.items[0]?.restaurant.imageUrl;
  const publicShareUrl = isLikedCollection
    ? getAbsoluteUrl(`/collections/liked/${collection.owner.username}`)
    : getAbsoluteUrl(`/collections/${collection.id}`);

  return (
    <main className="pb-8">
      <section className="relative min-h-[40vh] overflow-hidden bg-ink text-white">
        {firstImage ? (
          <img
            src={firstImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-moss/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <div className="relative z-10 flex min-h-[40vh] flex-col justify-between px-5 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/collections"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur transition hover:bg-white/20"
              aria-label="Back to collections"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2">
              {collection.isPublic && (
                <ShareCollectionButton
                  title={collection.title}
                  shareUrl={publicShareUrl}
                />
              )}
              {isLikedCollection && isOwner && (
                <LikedCollectionActions initialIsPublic={collection.isPublic} />
              )}
              {canManageCollection && (
                <CollectionActions
                  collectionId={collection.id}
                  initialTitle={collection.title}
                  initialDescription={collection.description}
                  initialCoverUrl={collection.coverUrl}
                  initialIsPublic={collection.isPublic}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill
                icon={collection.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                tone="dark"
              >
                {collection.isPublic ? "Public" : "Privé"}
              </BadgePill>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {collection.items.length} {collection.items.length === 1 ? "spot" : "spots"}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-semibold leading-tight drop-shadow-sm">
                {collection.title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                <img
                  src={collection.owner.avatarUrl || ""}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                />
                <Link
                  href={`/users/${collection.owner.username}`}
                  className="font-medium transition hover:text-white"
                >
                  Par {collection.owner.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        {collection.description && (
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink/70">
            {collection.description}
          </p>
        )}

        {collection.items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {collection.items.map((item) => (
              <div key={item.id} className="relative">
                {canManageCollection && (
                  <RemoveRestaurantButton
                    collectionId={collection.id}
                    restaurantId={item.restaurant.id}
                  />
                )}
                <RestaurantCard
                  restaurant={item.restaurant}
                  initialLiked={likedSet.has(item.restaurant.id)}
                />
                {item.note && (
                  <div className="mt-2 rounded-lg bg-porcelain p-3 text-sm text-ink/80 italic">
                    <span className="font-semibold not-italic">Note:</span> {item.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-porcelain text-ink/40">
              <Search size={24} />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-ink">
              Cette collection est vide
            </h3>
            <p className="mb-6 max-w-sm text-sm text-ink/60">
              Explorez les recommandations pour ajouter des restaurants à cette liste.
            </p>
            {canManageCollection && (
              <Link
                href="/discover"
                className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Découvrir des restaurants
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
