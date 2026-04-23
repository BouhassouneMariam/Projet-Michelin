import { badRequest, ok, unauthorized } from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { createCollectionSchema } from "@/features/collections/collection.validation";
import {
  listUserCollections,
  createCollection
} from "@/features/collections/collection.service";

export async function GET() {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const collections = await listUserCollections(userId);

  return ok({ collections });
}

export async function POST(request: Request) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const json = await request.json().catch(() => null);
  const parsed = createCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid collection payload");
  }

  const collection = await createCollection(userId, parsed.data);

  return ok({ collection }, { status: 201 });
}
