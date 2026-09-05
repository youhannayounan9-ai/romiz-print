import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin sub-pages (/admin/quotes, /admin/products, /admin/settings)
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    const adminToken = request.cookies.get("romiz_admin_token")?.value;

    if (!adminToken || adminToken !== "ROMIZ_ADMIN_SESSION_ACTIVE") {
      // Send unauthenticated users back to /admin root login screen
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};