import { BudgetLevel, MichelinAward, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toRestaurantDto,
  type RestaurantWithRelations
} from "@/features/restaurants/restaurant.queries";
import type { RestaurantDto } from "@/types/api";
import type { RecommendationInput } from "./recommendation.types";

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

const awardWeights: Record<MichelinAward, number> = {
  SELECTED: 2,
  BIB_GOURMAND: 4,
  ONE_STAR: 6,
  TWO_STARS: 8,
  THREE_STARS: 10,
  GREEN_STAR: 7
};

function isBudget(value: string | undefined): value is BudgetLevel {
  return Boolean(value && Object.values(BudgetLevel).includes(value as BudgetLevel));
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function reasonFor(restaurant: RestaurantDto, matchedTags: string[]) {
  const city = restaurant.district
    ? `${restaurant.district}, ${restaurant.city}`
    : restaurant.city;
  const tagText = matchedTags.length > 0 ? matchedTags.slice(0, 2).join(" + ") : "Michelin";

  return `${tagText} pick in ${city}`;
}

export async function getRecommendations(input: RecommendationInput) {
  const requestedTags = [
    input.occasion,
    ...input.vibes
  ]
    .filter(Boolean)
    .map((value) => normalizeSlug(String(value)));

  const where: Prisma.RestaurantWhereInput = {};

  if (input.city) {
    where.city = { equals: input.city, mode: "insensitive" };
  }

  if (isBudget(input.budget)) {
    where.budget = input.budget;
  }

  if (input.district) {
    where.district = { contains: input.district, mode: "insensitive" };
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: restaurantInclude,
    take: 80
  });

  const scored = restaurants
    .map((restaurant: RestaurantWithRelations) => {
      const dto = toRestaurantDto(restaurant);
      const restaurantTagSlugs = new Set(dto.tags.map((tag) => tag.slug));
      const matchedTags = requestedTags.filter((slug) => restaurantTagSlugs.has(slug));
      const budgetScore = input.budget === dto.budget ? 8 : 0;
      const socialScore = Math.min(dto.likesCount * 2, 8);
      const districtScore =
        input.district &&
        dto.district?.toLowerCase().includes(input.district.toLowerCase())
          ? 4
          : 0;
      const score =
        matchedTags.length * 12 +
        budgetScore +
        socialScore +
        districtScore +
        awardWeights[dto.award as MichelinAward];

      return {
        ...dto,
        score,
        matchReason: reasonFor(dto, matchedTags)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    title: buildRecommendationTitle(input),
    restaurants: scored
  };
}

function buildRecommendationTitle(input: RecommendationInput) {
  const occasion = input.occasion ? normalizeSlug(input.occasion).replace("-", " ") : "moment";
  const city = input.city || "your city";
  const vibe = input.vibes[0] ? normalizeSlug(input.vibes[0]).replace("-", " ") : "Michelin";

  return `A ${vibe} selection for your ${occasion} in ${city}`;
}
