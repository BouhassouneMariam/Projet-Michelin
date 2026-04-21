import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, ok } from "@/lib/api-response";

const addItemSchema = z.object({
  restaurantId: z.string().min(1),
  note: z.string().optional()
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json().catch(() => null);
  const parsed = addItemSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid collection item payload");
  }

  const item = await prisma.collectionItem.upsert({
    where: {
      collectionId_restaurantId: {
        collectionId: params.id,
        restaurantId: parsed.data.restaurantId
      }
    },
    update: {
      note: parsed.data.note
    },
    create: {
      collectionId: params.id,
      restaurantId: parsed.data.restaurantId,
      note: parsed.data.note
    }
  });

  return ok({ item }, { status: 201 });
}
