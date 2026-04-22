import { badRequest, forbidden, notFound, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { updateCollectionSchema } from "@/features/collections/collection.validation";
import {
  getCollection,
  updateCollection,
  deleteCollection
} from "@/features/collections/collection.service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const collection = await getCollection(params.id);

  if (!collection) {
    return notFound("Collection not found");
  }

  return ok({ collection });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json().catch(() => null);
  const parsed = updateCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid update payload");
  }

  const collection = await updateCollection(params.id, DEMO_USER_ID, parsed.data);

  if (!collection) {
    return forbidden("Collection not found or you are not the owner");
  }

  return ok({ collection });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteCollection(params.id, DEMO_USER_ID);

  if (!deleted) {
    return forbidden("Collection not found or you are not the owner");
  }

  return ok({ success: true });
}
