/**
 * Booking Query Functions
 * 
 * Database queries for booking-related pages.
 * These do NOT require authentication (used for public confirmation pages).
 */

import { db } from "@/lib/db"

/**
 * Booking confirmation data returned from getBookingById
 */
export interface BookingConfirmation {
  id: string
  startTime: Date
  endTime: Date
  inviteeName: string
  inviteeEmail: string
  inviteeTimezone: string
  notes: string | null
  createdAt: Date
  eventType: {
    id: string
    name: string
    slug: string
    duration: number
    description: string | null
    location: string | null
  }
  host: {
    id: string
    username: string
    name: string | null
    email: string
  }
}

/**
 * Get a booking by ID with event type and host details
 * 
 * Used for confirmation pages to display booking information.
 * 
 * @param bookingId - The booking ID from URL params
 * @returns Booking with event type and host data, or null if not found
 */
export async function getBookingById(
  bookingId: string
): Promise<BookingConfirmation | null> {
  try {
    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        inviteeName: true,
        inviteeEmail: true,
        inviteeTimezone: true,
        notes: true,
        createdAt: true,
        eventType: {
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
        },
      },
    })

    if (!booking) {
      return null
    }

    // Flatten the user data from eventType.user to host
    return {
      id: booking.id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      inviteeName: booking.inviteeName,
      inviteeEmail: booking.inviteeEmail,
      inviteeTimezone: booking.inviteeTimezone,
      notes: booking.notes,
      createdAt: booking.createdAt,
      eventType: {
        id: booking.eventType.id,
        name: booking.eventType.name,
        slug: booking.eventType.slug,
        duration: booking.eventType.duration,
        description: booking.eventType.description,
        location: booking.eventType.location,
      },
      host: booking.eventType.user,
    }
  } catch (error) {
    console.error("Error fetching booking by ID:", error)
    return null
  }
}

/**
 * Validate that a booking belongs to a specific username and event slug
 * 
 * Security check to ensure URL params match the booking.
 * 
 * @param booking - The booking to validate
 * @param username - Expected username from URL
 * @param eventSlug - Expected event slug from URL
 * @returns true if booking matches URL params
 */
export function validateBookingOwnership(
  booking: BookingConfirmation,
  username: string,
  eventSlug: string
): boolean {
  // Case-insensitive username comparison
  const usernameMatches = 
    booking.host.username.toLowerCase() === username.toLowerCase()
  
  // Exact slug match
  const slugMatches = booking.eventType.slug === eventSlug

  return usernameMatches && slugMatches
}
