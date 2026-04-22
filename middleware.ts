import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/register"];
const protectedPages = ["/", "/discover", "/collections", "/social", "/map"];

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("michelin_user_id")?.value;
  const { pathname } = request.nextUrl;

  if (userId && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }

  if (!userId && protectedPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/discover", "/collections", "/social", "/map"]
};
