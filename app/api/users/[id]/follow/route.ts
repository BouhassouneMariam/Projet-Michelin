import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { followUser, unfollowUser } from "@/features/users/user.service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    return unauthorized("Authentication required");
  }

  const result = await followUser(currentUserId, params.id);

  if (result === "cannot_follow_self") {
    return badRequest("You cannot follow yourself");
  }

  if (result === "user_not_found") {
    return badRequest("User not found");
  }

  return ok({ success: true, isFollowing: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    return unauthorized("Authentication required");
  }

  await unfollowUser(currentUserId, params.id);

  return ok({ success: true, isFollowing: false });
}
