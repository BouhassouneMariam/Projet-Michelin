import { badRequest, conflict, notFound, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { addRestaurantToCollectionSchema } from "@/features/collections/collection.validation";
import { addRestaurantToCollection } from "@/features/collections/collection.service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json().catch(() => null);
  const parsed = addRestaurantToCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid payload: restaurantId is required");
  }

  const result = await addRestaurantToCollection(params.id, DEMO_USER_ID, parsed.data);

  if ("error" in result) {
    switch (result.error) {
      case "collection_not_found":
        return notFound("Collection not found");
      case "restaurant_not_found":
        return notFound("Restaurant not found");
      case "already_in_collection":
        return conflict("Restaurant already exists in this collection");
    }
  }

  return ok({ success: true }, { status: 201 });
}
