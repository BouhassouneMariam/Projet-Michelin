import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProfile } from "@/features/users/user.service";
import {
  listFollowingCollections,
  listPopularCollections,
  listUserCollections
} from "@/features/collections/collection.service";
import { getLikedCollection } from "@/features/social/social.service";

export const metadata = {
  title: "Mon Profil | Michelin",
  description: "Consultez et modifiez votre profil",
};

export default async function ProfilePage() {
  const userId = getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const [profile, collections, likedCollection, popularCollections, followingCollections] = await Promise.all([
    getUserProfile(userId),
    listUserCollections(userId),
    getLikedCollection(userId),
    listPopularCollections(userId),
    listFollowingCollections(userId)
  ]);

  if (!profile) {
    redirect("/login");
  }

  return (
    <ProfileClient
      profile={profile}
      collections={collections}
      likedCollection={likedCollection}
      popularCollections={popularCollections}
      followingCollections={followingCollections}
      isOwnProfile={true}
    />
  );
}
