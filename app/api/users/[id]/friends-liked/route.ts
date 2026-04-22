import { getFriendsLikedRestaurants } from "@/features/social/social.service";
import { ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const friendsLiked = await getFriendsLikedRestaurants(params.id);

  return ok({ friendsLiked });
}
