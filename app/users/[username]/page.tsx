import { notFound, redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";
import {
  listPopularCollections,
  listVisibleUserCollections
} from "@/features/collections/collection.service";
import {
  isFollowingUser,
  getVisibleUserProfileByUsername
} from "@/features/users/user.service";
import { getCurrentUserId } from "@/lib/auth";

export default async function PublicProfilePage({
  params
}: {
  params: { username: string };
}) {
  const viewerUserId = getCurrentUserId();
  const profile = await getVisibleUserProfileByUsername(params.username, viewerUserId);

  if (!profile) {
    notFound();
  }

  if (viewerUserId && viewerUserId === profile.id) {
    redirect("/profile");
  }

  const [collections, popularCollections, initialIsFollowing] = await Promise.all([
    listVisibleUserCollections(profile.id, viewerUserId),
    listPopularCollections(viewerUserId ?? profile.id),
    viewerUserId ? isFollowingUser(viewerUserId, profile.id) : Promise.resolve(false)
  ]);

  return (
    <ProfileClient
      profile={profile}
      collections={collections}
      likedCollection={null}
      popularCollections={popularCollections}
      followingCollections={[]}
      isOwnProfile={false}
      canFollow={Boolean(viewerUserId)}
      initialIsFollowing={initialIsFollowing}
    />
  );
}
