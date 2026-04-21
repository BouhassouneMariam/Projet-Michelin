import { FriendshipStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { FriendsLikedDto, UserDto } from "@/types/api";

export async function listFriendsLiked(userId: string): Promise<FriendsLikedDto> {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { receiverId: userId }]
    }
  });

  const friendIds = friendships.map((friendship) =>
    friendship.requesterId === userId ? friendship.receiverId : friendship.requesterId
  );

  if (friendIds.length === 0) {
    return [];
  }

  const likes = await prisma.restaurantLike.findMany({
    where: {
      userId: {
        in: friendIds
      }
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
    const user = {
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
