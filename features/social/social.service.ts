import { FriendshipStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { FriendsLikedDto, UserDto } from "@/types/api";

export type LikeResult =
  | { success: true }
  | { error: "restaurant_not_found" }
  | { error: "already_liked" };

export type UnlikeResult =
  | { success: true }
  | { error: "not_liked" };

/** Like a restaurant */
export async function likeRestaurant(
  userId: string,
  restaurantId: string
): Promise<LikeResult> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId }
  });

  if (!restaurant) {
    return { error: "restaurant_not_found" };
  }

  const existing = await prisma.restaurantLike.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId
      }
    }
  });

  if (existing) {
    return { error: "already_liked" };
  }

  await prisma.restaurantLike.create({
    data: {
      userId,
      restaurantId
    }
  });

  return { success: true };
}

/** Unlike a restaurant */
export async function unlikeRestaurant(
  userId: string,
  restaurantId: string
): Promise<UnlikeResult> {
  const existing = await prisma.restaurantLike.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId
      }
    }
  });

  if (!existing) {
    return { error: "not_liked" };
  }

  await prisma.restaurantLike.delete({
    where: { id: existing.id }
  });

  return { success: true };
}

/** Get restaurants liked by the friends of a given user */
export async function getFriendsLikedRestaurants(
  userId: string
): Promise<FriendsLikedDto> {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { receiverId: userId }]
    }
  });

  const friendIds = friendships.map((f) =>
    f.requesterId === userId ? f.receiverId : f.requesterId
  );

  if (friendIds.length === 0) {
    return [];
  }

  const likes = await prisma.restaurantLike.findMany({
    where: {
      userId: { in: friendIds }
    },
    include: {
      user: true,
      restaurant: {
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const grouped = new Map<
    string,
    {
      restaurant: RestaurantWithRelations;
      likedBy: UserDto[];
    }
  >();

  for (const like of likes) {
    const current = grouped.get(like.restaurantId);
    const user: UserDto = {
      id: like.user.id,
      name: like.user.name,
      username: like.user.username,
      avatarUrl: like.user.avatarUrl,
      bio: like.user.bio,
      isAmbassador: like.user.isAmbassador
    };

    if (current) {
      current.likedBy.push(user);
    } else {
      grouped.set(like.restaurantId, {
        restaurant: like.restaurant as RestaurantWithRelations,
        likedBy: [user]
      });
    }
  }

  return Array.from(grouped.values()).map((item) => ({
    restaurant: toRestaurantDto(item.restaurant),
    likedBy: item.likedBy
  }));
}

/** Get the set of restaurant IDs liked by a user */
export async function getUserLikedRestaurantIds(
  userId: string
): Promise<string[]> {
  const likes = await prisma.restaurantLike.findMany({
    where: { userId },
    select: { restaurantId: true }
  });

  return likes.map((l) => l.restaurantId);
}

type LikedCollectionOwner = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  isAmbassador: boolean;
  likedCollectionIsPublic: boolean;
};

async function buildLikedCollection(user: LikedCollectionOwner) {
  const likes = await prisma.restaurantLike.findMany({
    where: { userId: user.id },
    include: {
      restaurant: {
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    id: "__liked__",
    title: "Mes coups de cœur",
    description: "Tous les restaurants que j'ai aimés.",
    coverUrl: likes[0]?.restaurant.imageUrl ?? null,
    isPublic: user.likedCollectionIsPublic,
    owner: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isAmbassador: user.isAmbassador
    },
    items: likes.map((like) => ({
      id: like.id,
      note: null,
      restaurant: toRestaurantDto(
        like.restaurant as RestaurantWithRelations
      )
    }))
  } satisfies import("@/types/api").CollectionDto;
}

/** Build a virtual "Liked" collection from the user's likes */
export async function getLikedCollection(
  userId: string
): Promise<import("@/types/api").CollectionDto | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      isAmbassador: true,
      likedCollectionIsPublic: true
    }
  });

  if (!user) return null;

  return buildLikedCollection(user);
}

export async function getLikedCollectionByUsername(
  username: string
): Promise<import("@/types/api").CollectionDto | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      isAmbassador: true,
      likedCollectionIsPublic: true
    }
  });

  if (!user) return null;

  return buildLikedCollection(user);
}

export async function updateLikedCollectionVisibility(
  userId: string,
  isPublic: boolean
): Promise<import("@/types/api").CollectionDto | null> {
  await prisma.user.update({
    where: { id: userId },
    data: { likedCollectionIsPublic: isPublic }
  });

  return getLikedCollection(userId);
}
