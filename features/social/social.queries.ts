import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { FollowingLikedDto, UserDto } from "@/types/api";

export async function listFollowingLiked(userId: string): Promise<FollowingLikedDto> {
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId
    },
    select: {
      followedId: true
    }
  });

  const followedIds = follows.map((follow) => follow.followedId);

  if (followedIds.length === 0) {
    return [];
  }

  const likes = await prisma.restaurantLike.findMany({
    where: {
      userId: {
        in: followedIds
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
