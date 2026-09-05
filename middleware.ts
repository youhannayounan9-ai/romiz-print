import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("romiz_admin_token")?.value;

    // Check for valid admin cookie session
    if (!adminToken || adminToken !== "ROMIZ_ADMIN_SESSION_ACTIVE") {
      // If unauthorized, redirect user to the login page or customer account
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};