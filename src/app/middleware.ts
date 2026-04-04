// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Public routes that do NOT require authentication
  const publicPaths = ["/", "/login", "/signup", "/api/auth"]; // add any other public pages

  // 2. Check if current path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 3. Get auth token/session from cookie (adjust based on your auth method)
  const token =
    request.cookies.get("auth-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value; // if using NextAuth

  // If trying to access protected route without token → redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access login/signup → redirect to dashboard
  if (
    isPublicPath &&
    token &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Important: Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
