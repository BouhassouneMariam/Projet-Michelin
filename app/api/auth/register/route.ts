import { z } from "zod";
import { badRequest, conflict, ok } from "@/lib/api-response";
import { register } from "@/features/users/auth.service";

const registerSchema = z.object({
  name: z.string().trim().min(1),
  username: z.string().trim().min(3),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid register payload");
  }

  const user = await register(
    parsed.data.name,
    parsed.data.username,
    parsed.data.password
  );

  if (!user) {
    return conflict("Username already exists");
  }

  const response = ok({ user }, { status: 201 });

  response.cookies.set("michelin_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
