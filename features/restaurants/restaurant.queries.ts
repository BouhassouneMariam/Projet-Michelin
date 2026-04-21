import { BudgetLevel, Prisma } from "@prisma/client";
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

export async function listRestaurants(filters: {
  city?: string;
  budget?: string;
  tag?: string;
} = {}) {
  const where: Prisma.RestaurantWhereInput = {};

  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  if (filters.budget && isBudget(filters.budget)) {
    where.budget = filters.budget;
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
    orderBy: [{ award: "desc" }, { name: "asc" }]
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
