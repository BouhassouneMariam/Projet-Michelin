import { badRequest, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { createCollectionSchema } from "@/features/collections/collection.validation";
import {
  listUserCollections,
  createCollection
} from "@/features/collections/collection.service";

export async function GET() {
  const collections = await listUserCollections(DEMO_USER_ID);

  return ok({ collections });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = createCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid collection payload");
  }

  const collection = await createCollection(DEMO_USER_ID, parsed.data);

  return ok({ collection }, { status: 201 });
}
