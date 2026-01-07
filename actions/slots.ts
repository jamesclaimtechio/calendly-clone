"use server"

/**
 * Slot Server Actions
 * 
 * Server actions for fetching available time slots.
 * These are PUBLIC actions - no authentication required.
 */

import { db } from "@/lib/db"
import { calculateSlotsForDate } from "@/lib/slots/calculate-slots"
import type { SlotCalculationResult, BookingSlotData } from "@/lib/slots/types"
import type { WeeklyAvailability } from "@/lib/types/availability"
import { getStartOfDayInTimezone, getEndOfDayInTimezone } from "@/lib/timezone"

/**
 * Get available slots for a specific event type and date
 * 
 * @param eventTypeId - The event type ID
 * @param selectedDate - Date string (YYYY-MM-DD) in invitee's timezone context
 * @param inviteeTimezone - Invitee's IANA timezone
 * @returns SlotCalculationResult with available slots or error
 */
export async function getAvailableSlots(
  eventTypeId: string,
  selectedDate: string,
  inviteeTimezone: string
): Promise<SlotCalculationResult> {
  try {
    // Validate input
    if (!eventTypeId || !selectedDate || !inviteeTimezone) {
      return {
        success: false,
        slots: [],
        error: "Missing required parameters",
      }
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(selectedDate)) {
      return {
        success: false,
        slots: [],
        error: "Invalid date format. Expected YYYY-MM-DD",
      }
    }

    // Fetch event type with host data
    const eventType = await db.eventType.findFirst({
      where: {
        id: eventTypeId,
        deletedAt: null, // Only non-deleted events
      },
      select: {
        id: true,
        duration: true,
        userId: true,
        user: {
          select: {
            id: true,
            timezone: true,
            availability: true,
          },
        },
      },
    })

    if (!eventType) {
      return {
        success: false,
        slots: [],
        error: "Event type not found",
      }
    }

    const host = eventType.user
    
    // Parse availability from JSON
    const hostAvailability = host.availability as unknown as WeeklyAvailability | null
    
    if (!hostAvailability) {
      return {
        success: true,
        slots: [], // No availability configured
      }
    }

    // Calculate date range for booking query (in UTC)
    // We need to query bookings for the entire day in the invitee's timezone
    const dayStartUTC = getStartOfDayInTimezone(selectedDate, inviteeTimezone)
    const dayEndUTC = getEndOfDayInTimezone(selectedDate, inviteeTimezone)

    // Fetch existing bookings for this event type in the date range
    const existingBookings = await db.booking.findMany({
      where: {
        eventTypeId: eventTypeId,
        startTime: {
          gte: dayStartUTC,
          lte: dayEndUTC,
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    })

    // Transform bookings to the expected format
    const bookingsForSlotCalc: BookingSlotData[] = existingBookings.map(b => ({
      id: b.id,
      startTime: b.startTime,
      endTime: b.endTime,
    }))

    // Calculate available slots
    const slots = calculateSlotsForDate(
      selectedDate,
      eventType.duration,
      host.timezone || "UTC",
      inviteeTimezone,
      hostAvailability,
      bookingsForSlotCalc
    )

    return {
      success: true,
      slots,
    }
  } catch (error) {
    console.error("Error calculating available slots:", error)
    return {
      success: false,
      slots: [],
      error: "Failed to calculate available slots",
    }
  }
}

/**
 * Get available slots for an event type by username and slug
 * This is a convenience function for public booking pages
 * 
 * @param username - Host's username
 * @param eventSlug - Event type slug
 * @param selectedDate - Date string (YYYY-MM-DD) in invitee's timezone context
 * @param inviteeTimezone - Invitee's IANA timezone
 * @returns SlotCalculationResult with available slots or error
 */
export async function getAvailableSlotsBySlug(
  username: string,
  eventSlug: string,
  selectedDate: string,
  inviteeTimezone: string
): Promise<SlotCalculationResult> {
  try {
    // Find the event type by username and slug
    const eventType = await db.eventType.findFirst({
      where: {
        slug: eventSlug,
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
      },
    })

    if (!eventType) {
      return {
        success: false,
        slots: [],
        error: "Event type not found",
      }
    }

    // Delegate to the main function
    return getAvailableSlots(eventType.id, selectedDate, inviteeTimezone)
  } catch (error) {
    console.error("Error fetching slots by slug:", error)
    return {
      success: false,
      slots: [],
      error: "Failed to fetch available slots",
    }
  }
}
