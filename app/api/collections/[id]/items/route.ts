import { z } from "zod";
import {
  badRequest,
  conflict,
  notFound,
  ok,
  unauthorized
} from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { addRestaurantToCollection } from "@/features/collections/collection.service";

const addItemSchema = z.object({
  restaurantId: z.string().min(1),
  note: z.string().optional()
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const json = await request.json().catch(() => null);
  const parsed = addItemSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid collection item payload");
  }

  const result = await addRestaurantToCollection(params.id, userId, parsed.data);

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
