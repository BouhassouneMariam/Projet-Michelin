import { notFound, ok, unauthorized } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { removeRestaurantFromCollection } from "@/features/collections/collection.service";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; restaurantId: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const removed = await removeRestaurantFromCollection(
    params.id,
    params.restaurantId,
    userId
  );

  if (!removed) {
    return notFound("Restaurant not found in this collection");
  }

  return ok({ success: true });
}
