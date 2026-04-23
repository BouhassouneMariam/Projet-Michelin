import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { CollectionDto } from "@/types/api";
import type {
  CreateCollectionInput,
  UpdateCollectionInput,
  AddRestaurantToCollectionInput
} from "./collection.validation";

const collectionInclude = {
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
    },
    orderBy: {
      createdAt: "desc" as const
    }
  }
} satisfies Prisma.CollectionInclude;

type CollectionWithRelations = Prisma.CollectionGetPayload<{
  include: typeof collectionInclude;
}>;

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

/** List all collections owned by a user */
export async function listUserCollections(userId: string): Promise<CollectionDto[]> {
  const collections = await prisma.collection.findMany({
    where: { ownerId: userId },
    include: collectionInclude,
    orderBy: { updatedAt: "desc" }
  });

  return collections.map(toCollectionDto);
}

/** List popular public collections (from other users) */
export async function listPopularCollections(excludeUserId: string): Promise<CollectionDto[]> {
  const collections = await prisma.collection.findMany({
    where: {
      isPublic: true,
      ownerId: { not: excludeUserId }
    },
    include: collectionInclude,
    orderBy: { updatedAt: "desc" }
  });

  return collections.map(toCollectionDto);
}

/** Get a single collection by ID */
export async function getCollection(collectionId: string): Promise<CollectionDto | null> {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: collectionInclude
  });

  return collection ? toCollectionDto(collection) : null;
}

/** Create a new collection */
export async function createCollection(
  userId: string,
  input: CreateCollectionInput
): Promise<CollectionDto> {
  const collection = await prisma.collection.create({
    data: {
      title: input.title,
      description: input.description,
      coverUrl: input.coverUrl || null,
      isPublic: input.isPublic ?? true,
      ownerId: userId
    },
    include: collectionInclude
  });

  return toCollectionDto(collection);
}

/** Update a collection (only if owned by user) */
export async function updateCollection(
  collectionId: string,
  userId: string,
  input: UpdateCollectionInput
): Promise<CollectionDto | null> {
  const existing = await prisma.collection.findUnique({
    where: { id: collectionId }
  });

  if (!existing || existing.ownerId !== userId) {
    return null;
  }

  const updated = await prisma.collection.update({
    where: { id: collectionId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.coverUrl !== undefined && { coverUrl: input.coverUrl || null }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic })
    },
    include: collectionInclude
  });

  return toCollectionDto(updated);
}

/** Delete a collection (only if owned by user) */
export async function deleteCollection(
  collectionId: string,
  userId: string
): Promise<boolean> {
  const existing = await prisma.collection.findUnique({
    where: { id: collectionId }
  });

  if (!existing || existing.ownerId !== userId) {
    return false;
  }

  await prisma.collection.delete({
    where: { id: collectionId }
  });

  return true;
}

export type AddRestaurantResult =
  | { success: true }
  | { error: "collection_not_found" }
  | { error: "restaurant_not_found" }
  | { error: "already_in_collection" };

/** Add a restaurant to a collection */
export async function addRestaurantToCollection(
  collectionId: string,
  userId: string,
  input: AddRestaurantToCollectionInput
): Promise<AddRestaurantResult> {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId }
  });

  if (!collection || collection.ownerId !== userId) {
    return { error: "collection_not_found" };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: input.restaurantId }
  });

  if (!restaurant) {
    return { error: "restaurant_not_found" };
  }

  const existingItem = await prisma.collectionItem.findUnique({
    where: {
      collectionId_restaurantId: {
        collectionId,
        restaurantId: input.restaurantId
      }
    }
  });

  if (existingItem) {
    return { error: "already_in_collection" };
  }

  await prisma.collectionItem.create({
    data: {
      collectionId,
      restaurantId: input.restaurantId,
      note: input.note
    }
  });

  return { success: true };
}

/** Remove a restaurant from a collection */
export async function removeRestaurantFromCollection(
  collectionId: string,
  restaurantId: string,
  userId: string
): Promise<boolean> {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId }
  });

  if (!collection || collection.ownerId !== userId) {
    return false;
  }

  const item = await prisma.collectionItem.findUnique({
    where: {
      collectionId_restaurantId: {
        collectionId,
        restaurantId
      }
    }
  });

  if (!item) {
    return false;
  }

  await prisma.collectionItem.delete({
    where: { id: item.id }
  });

  return true;
}
