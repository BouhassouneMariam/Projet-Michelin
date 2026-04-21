import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, ok } from "@/lib/api-response";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { listCollections } from "@/features/collections/collection.queries";

const createCollectionSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
});

export async function GET() {
  const collections = await listCollections();

  return ok({ collections });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = createCollectionSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid collection payload");
  }

  const collection = await prisma.collection.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      isPublic: parsed.data.isPublic ?? true,
      ownerId: DEMO_USER_ID
    }
  });

  return ok({ collection }, { status: 201 });
}
