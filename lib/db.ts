/**
 * Prisma Database Client Singleton
 * 
 * Uses singleton pattern to prevent connection pool exhaustion
 * during development with hot module reloading.
 * 
 * Usage: import { db } from "@/lib/db"
 */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}
