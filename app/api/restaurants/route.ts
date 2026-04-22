import { BudgetLevel, MichelinAward } from "@prisma/client";
import { ok } from "@/lib/api-response";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

const DEFAULT_LIMIT = 80;
const MAX_LIMIT = 200;

function parseLimit(value: string | null) {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || undefined;
  const country = searchParams.get("country") || undefined;
  const budget = searchParams.get("budget") || undefined;
  const award = searchParams.get("award") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const search = searchParams.get("search") || undefined;
  const mapReady = searchParams.get("mapReady") === "true";
  const limit = parseLimit(searchParams.get("limit"));

  const restaurants = await listRestaurants({
    city,
    country,
    budget: budget && budget in BudgetLevel ? budget : undefined,
    award: award && award in MichelinAward ? award : undefined,
    tag,
    search,
    limit,
    mapReady
  });

  return ok({
    restaurants,
    meta: {
      count: restaurants.length,
      limit
    }
  });
}
