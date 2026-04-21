import { badRequest, ok } from "@/lib/api-response";
import { getRecommendations } from "@/features/recommendations/recommendation.service";
import { recommendationInputSchema } from "@/features/recommendations/recommendation.types";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = recommendationInputSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid recommendation payload");
  }

  const recommendations = await getRecommendations(parsed.data);

  return ok(recommendations);
}
