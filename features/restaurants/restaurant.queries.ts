import { BudgetLevel, MichelinAward, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RestaurantDto } from "@/types/api";

const restaurantInclude = {
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
} satisfies Prisma.RestaurantInclude;

export type RestaurantWithRelations = Prisma.RestaurantGetPayload<{
  include: typeof restaurantInclude;
}>;

export function toRestaurantDto(
  restaurant: RestaurantWithRelations
): RestaurantDto {
  return {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    city: restaurant.city,
    district: restaurant.district,
    country: restaurant.country,
    address: restaurant.address,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    imageUrl: restaurant.imageUrl,
    cuisine: restaurant.cuisine,
    chefName: restaurant.chefName,
    priceLabel: restaurant.priceLabel,
    budget: restaurant.budget,
    award: restaurant.award,
    sourceUrl: restaurant.sourceUrl,
    likesCount: restaurant._count.likes,
    tags: restaurant.tags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      type: tag.type
    }))
  };
}

function isBudget(value: string): value is BudgetLevel {
  return Object.values(BudgetLevel).includes(value as BudgetLevel);
}

function isAward(value: string): value is MichelinAward {
  return Object.values(MichelinAward).includes(value as MichelinAward);
}

export async function listRestaurants(filters: {
  city?: string;
  country?: string;
  budget?: string;
  award?: string;
  tag?: string;
  search?: string;
  limit?: number;
  mapReady?: boolean;
} = {}) {
  const where: Prisma.RestaurantWhereInput = {};

  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  if (filters.country) {
    where.country = { equals: filters.country, mode: "insensitive" };
  }

  if (filters.budget && isBudget(filters.budget)) {
    where.budget = filters.budget;
  }

  if (filters.award && isAward(filters.award)) {
    where.award = filters.award;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { city: { contains: filters.search, mode: "insensitive" } },
      { country: { contains: filters.search, mode: "insensitive" } },
      { cuisine: { contains: filters.search, mode: "insensitive" } }
    ];
  }

  if (filters.mapReady) {
    where.latitude = { not: null };
    where.longitude = { not: null };
  }

  if (filters.tag) {
    where.tags = {
      some: {
        tag: {
          slug: filters.tag
        }
      }
    };
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: restaurantInclude,
    orderBy: [{ award: "desc" }, { name: "asc" }],
    take: filters.limit
  });

  return restaurants.map(toRestaurantDto);
}

export async function getRestaurantById(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: restaurantInclude
  });

  return restaurant ? toRestaurantDto(restaurant) : null;
}
