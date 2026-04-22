import { notFound, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { removeRestaurantFromCollection } from "@/features/collections/collection.service";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; restaurantId: string } }
) {
  const removed = await removeRestaurantFromCollection(
    params.id,
    params.restaurantId,
    DEMO_USER_ID
  );

  if (!removed) {
    return notFound("Restaurant not found in this collection");
  }

  return ok({ success: true });
}
