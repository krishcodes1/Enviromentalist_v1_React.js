import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip middleware for static assets, API routes, and auth routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/public") ||
    req.nextUrl.pathname.startsWith("/onboarding") || // Always allow access to onboarding
    req.nextUrl.pathname.startsWith("/auth") || // Skip auth routes to prevent redirect loops
    req.nextUrl.pathname.startsWith("/community/create") || // Skip community create route
    req.nextUrl.pathname === "/community/create-community" || // Explicitly allow community creation page
    req.nextUrl.pathname.startsWith("/(main)/community/create-community") || // Allow the route in the (main) group
    req.nextUrl.pathname.startsWith("/post/") // Skip all post routes
  ) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Only check if session exists, don't do any database queries
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access protected routes, redirect to auth
    if (!session && !req.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // If session exists and trying to access auth pages, redirect to onboarding
    if (session && req.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's any error in the middleware, just continue
    return res
  }
}

export const config = {
  matcher: [
    // Match all paths except static assets
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
