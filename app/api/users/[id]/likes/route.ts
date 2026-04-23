import { getUserLikedRestaurantIds } from "@/features/social/social.service";
import { ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const likedIds = await getUserLikedRestaurantIds(params.id);

  return ok({ likedIds });
}
