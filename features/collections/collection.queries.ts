import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { CollectionDto } from "@/types/api";

type CollectionWithRelations = Awaited<ReturnType<typeof getCollectionRecords>>[number];

async function getCollectionRecords() {
  return prisma.collection.findMany({
    include: {
      owner: true,
      items: {
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
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

function toCollectionDto(collection: CollectionWithRelations): CollectionDto {
  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    coverUrl: collection.coverUrl,
    isPublic: collection.isPublic,
    owner: {
      id: collection.owner.id,
      name: collection.owner.name,
      username: collection.owner.username,
      avatarUrl: collection.owner.avatarUrl,
      bio: collection.owner.bio,
      isAmbassador: collection.owner.isAmbassador
    },
    items: collection.items.map((item) => ({
      id: item.id,
      note: item.note,
      restaurant: toRestaurantDto(item.restaurant as RestaurantWithRelations)
    }))
  };
}

export async function listCollections() {
  const collections = await getCollectionRecords();
  return collections.map(toCollectionDto);
}
