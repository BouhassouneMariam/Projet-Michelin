import { getRestaurantById } from "@/features/restaurants/restaurant.queries";
import { notFound, ok } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const restaurant = await getRestaurantById(params.id);

  if (!restaurant) {
    return notFound("Restaurant not found");
  }

  return ok({ restaurant });
}
