import {
  badRequest,
  forbidden,
  notFound,
  ok,
  unauthorized
} from "@/lib/api-response";
import { getCurrentUserId } from "@/lib/auth";
import { updateCollectionSchema } from "@/features/collections/collection.validation";
import {
  getCollection,
  updateCollection,
  deleteCollection
} from "@/features/collections/collection.service";
import {
  getLikedCollection,
  updateLikedCollectionVisibility
} from "@/features/social/social.service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (params.id === "__liked__") {
    const userId = getCurrentUserId();

    if (!userId) {
      return unauthorized();
    }

    const collection = await getLikedCollection(userId);

    if (!collection) {
      return notFound("Collection not found");
    }

    return ok({ collection });
  }

  const collection = await getCollection(params.id);
  const userId = getCurrentUserId();

  if (!collection) {
    return notFound("Collection not found");
  }

  if (!collection.isPublic && collection.owner.id !== userId) {
    return forbidden("This collection is private");
  }

  return ok({ collection });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const json = await request.json().catch(() => null);
  const parsed = updateCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid update payload");
  }

  if (params.id === "__liked__") {
    if (parsed.data.isPublic === undefined) {
      return badRequest("Invalid update payload");
    }

    const collection = await updateLikedCollectionVisibility(
      userId,
      parsed.data.isPublic
    );

    if (!collection) {
      return notFound("Collection not found");
    }

    return ok({ collection });
  }

  const collection = await updateCollection(params.id, userId, parsed.data);

  if (!collection) {
    return forbidden("Collection not found or you are not the owner");
  }

  return ok({ collection });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getCurrentUserId();

  if (!userId) {
    return unauthorized();
  }

  const deleted = await deleteCollection(params.id, userId);

  if (!deleted) {
    return forbidden("Collection not found or you are not the owner");
  }

  return ok({ success: true });
}
