/**
 * Auth.js Edge-Compatible Configuration
 * 
 * This file contains configuration that can run in Edge runtime (middleware).
 * DO NOT import Prisma, bcrypt, or other Node.js-only modules here.
 * 
 * The full auth config in auth.ts extends this with Prisma adapter and providers.
 */

import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    // signUp is not a standard Auth.js page, handled separately
  },
  callbacks: {
    /**
     * Authorized callback for middleware
     * Runs on every request to protected routes
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup")

      if (isOnDashboard) {
        // Protect dashboard routes - redirect to login if not authenticated
        if (isLoggedIn) return true
        return false // Redirect to signIn page
      }

      if (isOnAuthPage) {
        // Redirect to dashboard if already logged in
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      // Allow all other routes (public pages like /[username])
      return true
    },
  },
  providers: [], // Providers added in auth.ts (requires Node.js runtime)
} satisfies NextAuthConfig
