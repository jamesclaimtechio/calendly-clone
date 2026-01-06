/**
 * Availability Server Actions
 * 
 * Server actions for managing user availability and timezone settings.
 * All actions enforce user ownership (IDOR prevention).
 */

"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  weeklyAvailabilitySchema,
  timezoneSchema,
  type WeeklyAvailabilityInput,
} from "@/lib/validations/availability"
import type { WeeklyAvailability, UserAvailabilityData } from "@/lib/types/availability"
import { DEFAULT_AVAILABILITY, DEFAULT_TIMEZONE } from "@/lib/constants/availability"

/**
 * Action result type for consistent error handling
 */
type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get current user's availability and timezone
 * 
 * Returns:
 * - availability: WeeklyAvailability object
 * - timezone: User's timezone string
 */
export async function getAvailability(): Promise<ActionResult<UserAvailabilityData>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        availability: true,
        timezone: true,
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Parse availability from JSON, fallback to default if null or invalid
    let availability: WeeklyAvailability
    try {
      availability = user.availability 
        ? (user.availability as unknown as WeeklyAvailability)
        : DEFAULT_AVAILABILITY
    } catch {
      availability = DEFAULT_AVAILABILITY
    }

    return {
      success: true,
      data: {
        availability,
        timezone: user.timezone || DEFAULT_TIMEZONE,
      },
    }
  } catch (error) {
    console.error("Get availability error:", error)
    return { success: false, error: "Failed to fetch availability" }
  }
}

/**
 * Update user's weekly availability schedule
 * 
 * Flow:
 * 1. Validate session
 * 2. Validate availability data with Zod
 * 3. Update User.availability JSON field
 * 4. Revalidate settings path
 */
export async function updateAvailability(
  input: WeeklyAvailabilityInput
): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Validate input
    const validationResult = weeklyAvailabilitySchema.safeParse(input)
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || "Invalid availability data"
      return { success: false, error }
    }

    // Update user's availability
    await db.user.update({
      where: { id: session.user.id },
      data: {
        availability: validationResult.data as object,
      },
    })

    // Revalidate settings pages
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/settings/availability")

    return { success: true }
  } catch (error) {
    console.error("Update availability error:", error)
    return { success: false, error: "Failed to update availability" }
  }
}

/**
 * Update user's timezone
 * 
 * Flow:
 * 1. Validate session
 * 2. Validate timezone string
 * 3. Update User.timezone field
 * 4. Revalidate settings path
 */
export async function updateTimezone(timezone: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Validate timezone
    const validationResult = timezoneSchema.safeParse(timezone)
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || "Invalid timezone"
      return { success: false, error }
    }

    // Update user's timezone
    await db.user.update({
      where: { id: session.user.id },
      data: {
        timezone: validationResult.data,
      },
    })

    // Revalidate settings pages
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard/settings/availability")

    return { success: true }
  } catch (error) {
    console.error("Update timezone error:", error)
    return { success: false, error: "Failed to update timezone" }
  }
}
