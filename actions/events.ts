/**
 * Event Type Server Actions
 * 
 * CRUD operations for event types.
 * All actions enforce user ownership (IDOR prevention).
 * Uses soft delete for event types.
 */

"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateUniqueSlug } from "@/lib/slug"
import {
  createEventTypeSchema,
  updateEventTypeSchema,
  type CreateEventTypeInput,
  type UpdateEventTypeInput,
} from "@/lib/validations/events"

/**
 * Action result type for consistent error handling
 */
type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Event type data returned from queries
 */
export type EventType = {
  id: string
  name: string
  slug: string
  duration: number
  description: string | null
  location: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Create a new event type
 * 
 * Flow:
 * 1. Validate session
 * 2. Validate input with Zod
 * 3. Generate unique slug from name
 * 4. Create record with userId
 * 5. Revalidate dashboard
 */
export async function createEventType(
  input: CreateEventTypeInput
): Promise<ActionResult<EventType>> {
  try {
    // 1. Validate session
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // 2. Validate input
    const validationResult = createEventTypeSchema.safeParse(input)
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || "Invalid input"
      return { success: false, error }
    }

    const { name, duration, description, location } = validationResult.data

    // 3. Generate unique slug
    const slug = await generateUniqueSlug(name, session.user.id)

    // 4. Create record
    const eventType = await db.eventType.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        duration,
        description: description ?? null,
        location: location ?? null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // 5. Revalidate dashboard
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/events")

    return { success: true, data: eventType }
  } catch (error) {
    console.error("Create event type error:", error)
    return { success: false, error: "Failed to create event type" }
  }
}

/**
 * Get all event types for the current user
 * 
 * Excludes soft-deleted event types.
 * Orders by createdAt DESC (newest first).
 */
export async function getEventTypes(): Promise<ActionResult<EventType[]>> {
  try {
    // Validate session
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Query with userId filter and exclude deleted
    const eventTypes = await db.eventType.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null, // Exclude soft-deleted
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: eventTypes }
  } catch (error) {
    console.error("Get event types error:", error)
    return { success: false, error: "Failed to fetch event types" }
  }
}

/**
 * Get a single event type by ID
 * 
 * Verifies ownership before returning.
 */
export async function getEventType(
  id: string
): Promise<ActionResult<EventType>> {
  try {
    // Validate session
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Query with ownership check
    const eventType = await db.eventType.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!eventType) {
      return { success: false, error: "Event type not found" }
    }

    return { success: true, data: eventType }
  } catch (error) {
    console.error("Get event type error:", error)
    return { success: false, error: "Failed to fetch event type" }
  }
}

/**
 * Update an existing event type
 * 
 * Flow:
 * 1. Validate session
 * 2. Validate input
 * 3. Verify ownership
 * 4. If name changed, generate new unique slug (unless slug manually provided)
 * 5. Update record
 * 6. Revalidate dashboard
 */
export async function updateEventType(
  input: UpdateEventTypeInput
): Promise<ActionResult<EventType>> {
  try {
    // 1. Validate session
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // 2. Validate input
    const validationResult = updateEventTypeSchema.safeParse(input)
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || "Invalid input"
      return { success: false, error }
    }

    const { id, name, slug, duration, description, location } = validationResult.data

    // 3. Verify ownership
    const existing = await db.eventType.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!existing) {
      return { success: false, error: "Event type not found" }
    }

    // 4. Handle slug generation
    let newSlug = slug
    if (name && name !== existing.name && !slug) {
      // Name changed and no manual slug provided - generate new slug
      newSlug = await generateUniqueSlug(name, session.user.id, id)
    }

    // 5. Update record
    const eventType = await db.eventType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(duration !== undefined && { duration }),
        ...(description !== undefined && { description }),
        ...(location !== undefined && { location }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        duration: true,
        description: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // 6. Revalidate dashboard
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/events")

    return { success: true, data: eventType }
  } catch (error) {
    console.error("Update event type error:", error)
    return { success: false, error: "Failed to update event type" }
  }
}

/**
 * Soft delete an event type
 * 
 * Sets deletedAt timestamp instead of hard deleting.
 * This preserves data for existing bookings.
 */
export async function deleteEventType(
  id: string
): Promise<ActionResult> {
  try {
    // Validate session
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify ownership
    const existing = await db.eventType.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!existing) {
      return { success: false, error: "Event type not found" }
    }

    // Soft delete - set deletedAt
    await db.eventType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    // Revalidate dashboard
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/events")

    return { success: true }
  } catch (error) {
    console.error("Delete event type error:", error)
    return { success: false, error: "Failed to delete event type" }
  }
}
