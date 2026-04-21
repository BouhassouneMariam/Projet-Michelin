import { BudgetLevel } from "@prisma/client";
import { ok } from "@/lib/api-response";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || undefined;
  const budget = searchParams.get("budget") || undefined;
  const tag = searchParams.get("tag") || undefined;

  const restaurants = await listRestaurants({
    city,
    budget: budget && budget in BudgetLevel ? budget : undefined,
    tag
  });

  return ok({ restaurants });
}
