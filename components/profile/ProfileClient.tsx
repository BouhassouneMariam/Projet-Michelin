"use client";

import { useState } from "react";
import { Users, UserPlus, Heart } from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CollectionList } from "@/components/collections/CollectionList";
import { UserProfileDto } from "@/features/users/user.service";
import { CollectionDto } from "@/types/api";
import Image from "next/image";

interface ProfileClientProps {
  profile: UserProfileDto;
  collections: CollectionDto[];
  likedCollection: CollectionDto | null;
  isOwnProfile: boolean;
}

export function ProfileClient({
  profile: initialProfile,
  collections,
  likedCollection,
  isOwnProfile,
}: ProfileClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <main className="michelin-paper min-h-[calc(100dvh-68px)] px-5 pb-16 pt-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Profile Header */}
        <div className="mb-12 space-y-6">
          <div className="flex gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-rouge to-pink-500 md:h-32 md:w-32">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white md:text-4xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h1 className="text-3xl font-medium text-ink md:text-4xl">
                  {profile.name}
                </h1>
                <p className="text-lg text-[#666666]">@{profile.username}</p>
                {profile.isAmbassador && (
                  <div className="mt-2 inline-block rounded-full bg-rouge/10 px-3 py-1 text-sm font-medium text-rouge">
                    Ambassadeur Michelin
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4D4D4D]">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center md:p-6">
              <div className="text-2xl font-bold text-rouge md:text-3xl">
                {profile.collectionsCount}
              </div>
              <p className="text-sm text-[#666666]">Collections</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center md:p-6">
              <div className="flex items-center justify-center gap-2">
                <Users size={20} className="text-moss" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-moss md:text-3xl">
                    {profile.followersCount}
                  </div>
                  <p className="text-xs text-[#666666]">Abonnés</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center md:p-6">
              <div className="flex items-center justify-center gap-2">
                <UserPlus size={20} className="text-bleu" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-bleu md:text-3xl">
                    {profile.followingCount}
                  </div>
                  <p className="text-xs text-[#666666]">Abonnements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {isOwnProfile && (
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full rounded-lg border-2 border-rouge bg-white px-6 py-2 font-medium text-rouge transition hover:bg-rouge hover:text-white md:w-auto"
            >
              Modifier mon profil
            </button>
          )}
        </div>

        {/* Liked Collection */}
        {likedCollection && likedCollection.items.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rouge/10">
                <Heart size={16} className="fill-rouge text-rouge" />
              </div>
              <h2 className="text-2xl font-medium text-ink">Mes coups de cœur</h2>
              <span className="rounded-full bg-rouge px-2.5 py-0.5 text-xs font-semibold text-white">
                {likedCollection.items.length}
              </span>
            </div>
          </div>
        )}

        {/* Collections */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-ink">Collections</h2>
          <p className="mt-1 text-sm text-[#666666]">
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </p>
        </div>

        {collections.length > 0 ? (
          <CollectionList initialCollections={collections} />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-[#666666]">
              {isOwnProfile
                ? "Vous n'avez pas encore créé de collections."
                : "Cet utilisateur n'a pas encore créé de collections."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && isOwnProfile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => setProfile(updated)}
        />
      )}
    </main>
  );
}
