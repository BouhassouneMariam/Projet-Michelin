import { conflict, notFound, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { likeRestaurant, unlikeRestaurant } from "@/features/social/social.service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const result = await likeRestaurant(DEMO_USER_ID, params.id);

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
  const result = await unlikeRestaurant(DEMO_USER_ID, params.id);

  if ("error" in result) {
    return notFound("Like not found");
  }

  return ok({ success: true });
}
