import { ok } from "@/lib/api-response";

export async function POST() {
  const response = ok({ success: true });

  response.cookies.set("michelin_user_id", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
