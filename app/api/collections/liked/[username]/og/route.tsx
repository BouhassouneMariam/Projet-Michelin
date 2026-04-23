import { ImageResponse } from "next/og";
import { getCurrentUserId } from "@/lib/auth";
import { getLikedCollectionByUsername } from "@/features/social/social.service";
import { renderCollectionShareImage } from "@/features/collections/share-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { username: string } }
) {
  const collection = await getLikedCollectionByUsername(params.username);
  const userId = getCurrentUserId();

  if (!collection || (!collection.isPublic && collection.owner.id !== userId)) {
    return new Response("Collection not found", { status: 404 });
  }

  return new ImageResponse(renderCollectionShareImage(collection), {
    width: 1200,
    height: 630,
  });
}
