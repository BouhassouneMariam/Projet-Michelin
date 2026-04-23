import { getFollowingLikedRestaurants } from "@/features/social/social.service";
import { ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const followingLiked = await getFollowingLikedRestaurants(params.id);

  return ok({ followingLiked });
}
