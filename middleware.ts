import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/login", "/register"];
const protectedPages = ["/collections", "/social"];

function isProtectedPage(pathname: string) {
  return protectedPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
}

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("michelin_user_id")?.value;
  const { pathname } = request.nextUrl;

  if (userId && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!userId && isProtectedPage(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/collections/:path*", "/social/:path*"]
};
