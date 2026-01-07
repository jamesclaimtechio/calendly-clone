/**
 * Public Page Query Functions
 * 
 * Database queries for public-facing pages.
 * These do NOT require authentication.
 */

import { db } from "@/lib/db"

/**
 * Host data returned from getHostByUsername
 */
export interface PublicHost {
  id: string
  username: string
  name: string | null
  email: string
}

/**
 * Event type data for public display
 */
export interface PublicEventType {
  id: string
  name: string
  slug: string
  duration: number
  description: string | null
  location: string | null
}

/**
 * Get a host by username (case-insensitive)
 * 
 * @param username - The username from URL params
 * @returns Host data or null if not found
 */
export async function getHostByUsername(
  username: string
): Promise<PublicHost | null> {
  try {
    // Case-insensitive lookup using lowercase comparison
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error fetching host by username:", error)
    return null
  }
}

/**
 * Get all active (non-deleted) event types for a host
 * 
 * @param userId - The host's user ID
 * @returns Array of event types
 */
export async function getEventTypesForHost(
  userId: string
): Promise<PublicEventType[]> {
  try {
    const eventTypes = await db.eventType.findMany({
      where: {
        userId,
        deletedAt: null, // Only non-deleted events
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
      },
      orderBy: {
        createdAt: "asc", // Oldest first for consistent ordering
      },
    })

    return eventTypes
  } catch (error) {
    console.error("Error fetching event types for host:", error)
    return []
  }
}

/**
 * Get a specific event type by username and slug
 * 
 * @param username - The host's username
 * @param slug - The event type slug
 * @returns Event type with host data or null if not found
 */
export async function getEventTypeBySlug(
  username: string,
  slug: string
): Promise<(PublicEventType & { user: PublicHost }) | null> {
  try {
    const eventType = await db.eventType.findFirst({
      where: {
        slug,
        deletedAt: null,
        user: {
          username: {
            equals: username.toLowerCase(),
            mode: "insensitive",
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return eventType
  } catch (error) {
    console.error("Error fetching event type by slug:", error)
    return null
  }
}
