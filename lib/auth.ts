/**
 * Auth.js Full Configuration
 * 
 * This file contains the complete Auth.js configuration including:
 * - Prisma adapter for user lookup
 * - Credentials provider with bcrypt password validation
 * - JWT strategy (required for Credentials provider in Auth.js v5)
 * - Session callbacks to include user.id and user.username
 * 
 * NOTE: Auth.js v5 requires JWT strategy when using Credentials provider.
 * Database sessions are only supported with OAuth providers.
 * See: https://authjs.dev/concepts/session-strategies
 * 
 * This runs in Node.js runtime (not Edge) so we can use Prisma and bcrypt.
 */

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

import { db } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"

// Extend the types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    username?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // JWT required for Credentials provider
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize function - validates credentials and returns user
       * 
       * IMPORTANT: 
       * - Never throw errors, return null for invalid credentials
       * - Always use generic error message (don't reveal which field is wrong)
       * - Lowercase email before lookup for case-insensitive matching
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = (credentials.email as string).toLowerCase()
        const password = credentials.password as string

        // Find user by email (case-insensitive)
        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          // User not found or has no password (OAuth user)
          return null
        }

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          return null
        }

        // Return user object - include username for JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * JWT callback - adds custom fields to the JWT token
     * Called whenever a JWT is created or updated
     */
    async jwt({ token, user }) {
      if (user) {
        // First sign in - add user data to token
        token.id = user.id as string
        token.username = (user as { username?: string }).username ?? ""
      }
      return token
    },
    /**
     * Session callback - transfers JWT data to session
     * 
     * We need user.id for database queries (always filter by userId)
     * We need user.username for URL generation (/username/event-slug)
     */
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
        },
      }
    },
  },
})
