import { conflict, notFound, ok, unauthorized } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { likeRestaurant, unlikeRestaurant } from "@/features/social/social.service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const result = await likeRestaurant(userId, params.id);

  if ("error" in result) {
    switch (result.error) {
      case "restaurant_not_found":
        return notFound("Restaurant not found");
      case "already_liked":
        return conflict("You already liked this restaurant");
    }
  }

  return ok({ success: true }, { status: 201 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const result = await unlikeRestaurant(userId, params.id);

  if ("error" in result) {
    return notFound("Like not found");
  }

  return ok({ success: true });
}
