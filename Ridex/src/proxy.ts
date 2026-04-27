import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_ROUTES = ["/"];
const PUBLIC_APIS = ["/api/auth", "/api/user/me"]; // Added /api/user/me

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
   /\.(png|jpg|jpeg|svg|ico|gif)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public APIs (auth endpoints)
  if (PUBLIC_APIS.some(api => pathname.startsWith(api))) {
    return NextResponse.next();
  }

  // Check authentication for all other routes
  const session = await auth();
  
  if (!session) {
    // For API routes, return 401 JSON
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }
    // For page routes, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role-based access control for page routes only (not API)
  if (!pathname.startsWith("/api")) {
    const role = session.user.role;
    
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    if (pathname.startsWith("/partner") && role !== "partner") {
      if (pathname.startsWith("/partner/onboarding")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Allow all other requests (including authenticated API calls)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};