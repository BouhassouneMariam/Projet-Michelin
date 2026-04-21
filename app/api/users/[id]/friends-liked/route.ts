import { listFriendsLiked } from "@/features/social/social.queries";
import { ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const friendsLiked = await listFriendsLiked(params.id);

  return ok({ friendsLiked });
}
