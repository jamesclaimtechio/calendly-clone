/**
 * Next.js Middleware
 * 
 * Protects dashboard routes by checking authentication.
 * Uses the edge-compatible auth config (no Prisma, no bcrypt).
 * 
 * Flow:
 * 1. Request to /dashboard/* intercepted
 * 2. Check for valid session token
 * 3. If no session → Redirect to /login
 * 4. If session valid → Allow request to continue
 * 
 * Also handles:
 * - Redirecting logged-in users away from /login and /signup to /dashboard
 */

import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  /*
   * Match all paths except:
   * - API routes (handled separately)
   * - Static files (_next/static, favicon.ico, etc.)
   * - Public assets (images, etc.)
   * 
   * We include auth pages (/login, /signup) so the authorized callback
   * can redirect logged-in users to dashboard.
   */
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
}
