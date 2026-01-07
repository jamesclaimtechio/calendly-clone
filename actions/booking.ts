/**
 * Booking Server Actions
 * 
 * Server actions for creating and managing bookings.
 * These run on the server and can safely access the database.
 */

"use server"

import { db } from "@/lib/db"
import { createBookingSchema, type CreateBookingInput } from "@/lib/validations/booking"
import { addMinutes } from "date-fns"

// ============================================
// Types
// ============================================

/**
 * Result type for the createBooking action
 */
export type CreateBookingResult = 
  | { success: true; bookingId: string }
  | { success: false; error: string }

// ============================================
// Create Booking Action
// ============================================

/**
 * Create a new booking for an event type.
 * 
 * This action:
 * 1. Validates input with Zod
 * 2. Checks the event type exists and is not deleted
 * 3. Calculates end time from start time + duration
 * 4. Checks for overlapping bookings (race condition prevention)
 * 5. Creates the booking record
 * 
 * @param input - Booking creation input data
 * @returns Success with bookingId, or error message
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  try {
    // ----------------------------------------
    // Step 1: Validate input
    // ----------------------------------------
    const validationResult = createBookingSchema.safeParse(input)
    
    if (!validationResult.success) {
      // Return first validation error
      const firstError = validationResult.error.issues[0]
      return {
        success: false,
        error: firstError?.message || "Invalid booking data",
      }
    }
    
    const data = validationResult.data

    // ----------------------------------------
    // Step 2: Fetch event type and validate
    // ----------------------------------------
    const eventType = await db.eventType.findUnique({
      where: { id: data.eventTypeId },
      select: {
        id: true,
        duration: true,
        deletedAt: true,
        name: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Check if event type exists
    if (!eventType) {
      return {
        success: false,
        error: "This event type no longer exists.",
      }
    }

    // Check if event type is deleted (soft delete)
    if (eventType.deletedAt) {
      return {
        success: false,
        error: "This event type is no longer available for booking.",
      }
    }

    // ----------------------------------------
    // Step 3: Calculate start and end times
    // ----------------------------------------
    const startTimeUTC = new Date(data.startTimeUTC)
    const endTimeUTC = addMinutes(startTimeUTC, eventType.duration)

    // Validate that start time is in the future
    const now = new Date()
    if (startTimeUTC <= now) {
      return {
        success: false,
        error: "Cannot book a time slot in the past.",
      }
    }

    // ----------------------------------------
    // Step 4: Check for overlapping bookings
    // Race condition prevention: Check if slot is still available
    // ----------------------------------------
    const overlappingBooking = await db.booking.findFirst({
      where: {
        eventTypeId: data.eventTypeId,
        // Check for any overlap:
        // Existing booking starts before our end AND ends after our start
        startTime: { lt: endTimeUTC },
        endTime: { gt: startTimeUTC },
      },
      select: { id: true },
    })

    if (overlappingBooking) {
      return {
        success: false,
        error: "This time slot was just booked by someone else. Please select another time.",
      }
    }

    // ----------------------------------------
    // Step 5: Create the booking
    // ----------------------------------------
    const booking = await db.booking.create({
      data: {
        eventTypeId: data.eventTypeId,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        inviteeName: data.inviteeName,
        inviteeEmail: data.inviteeEmail,
        inviteeTimezone: data.inviteeTimezone,
        notes: data.inviteeNotes || null,
      },
      select: { id: true },
    })

    // ----------------------------------------
    // Success! Return the booking ID
    // ----------------------------------------
    return {
      success: true,
      bookingId: booking.id,
    }

  } catch (error) {
    // Log the error server-side for debugging
    console.error("Error creating booking:", error)
    
    // Return a generic error message to the client
    // Never expose internal error details to users
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}
