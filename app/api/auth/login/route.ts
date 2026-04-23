import { z } from "zod";
import { badRequest, ok, unauthorized } from "@/lib/api-response";
import {loginWithUsername} from "@/features/users/auth.service";


const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return badRequest("Invalid login payload");
  }

  const user = await loginWithUsername(parsed.data.username, parsed.data.password);

  if (!user) {
    return unauthorized("Invalid username or password");
  }

  const response = ok({ user });

  response.cookies.set("michelin_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
