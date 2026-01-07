/**
 * Booking Form Validation Schemas
 * 
 * Zod schemas for validating booking form input (client-side)
 * and booking creation (server-side).
 */

import { z } from "zod"

// ============================================
// Helper: Validate IANA timezone
// ============================================

/**
 * Check if a string is a valid IANA timezone
 * Uses Intl API which is available in Node.js and modern browsers
 */
function isValidTimezone(tz: string): boolean {
  try {
    // Attempt to use the timezone - if invalid, Intl will throw
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  } catch {
    return false
  }
}

// ============================================
// Client-Side Schema (Booking Form)
// ============================================

/**
 * Schema for the booking form fields
 */
export const bookingFormSchema = z.object({
  inviteeName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  
  inviteeEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be 255 characters or less")
    .toLowerCase()
    .trim(),
  
  inviteeNotes: z
    .string()
    .max(500, "Notes must be 500 characters or less")
    .optional()
    .transform(val => val?.trim() || ""),
})

/**
 * Type for the booking form input (what react-hook-form uses)
 */
export type BookingFormInput = z.input<typeof bookingFormSchema>

/**
 * Type for the validated booking form data (after Zod transforms)
 */
export type BookingFormData = z.output<typeof bookingFormSchema>

// ============================================
// Server-Side Schema (Create Booking Action)
// ============================================

/**
 * Schema for the full booking creation request (server-side validation)
 * Validates all fields needed to create a booking in the database.
 */
export const createBookingSchema = z.object({
  eventTypeId: z
    .string()
    .min(1, "Event type is required"),
  
  startTimeUTC: z
    .string()
    .min(1, "Start time is required")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Start time must be a valid ISO date string"
    ),
  
  inviteeName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  
  inviteeEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be 255 characters or less")
    .toLowerCase()
    .trim(),
  
  inviteeNotes: z
    .string()
    .max(500, "Notes must be 500 characters or less")
    .optional()
    .transform(val => val?.trim() || ""),
  
  inviteeTimezone: z
    .string()
    .min(1, "Timezone is required")
    .refine(
      (val) => isValidTimezone(val),
      "Invalid timezone. Please select a valid timezone."
    ),
})

/**
 * Type for the booking creation input (what the server action receives)
 */
export type CreateBookingInput = z.input<typeof createBookingSchema>

/**
 * Type for the validated booking creation data (after Zod transforms)
 */
export type CreateBookingData = z.output<typeof createBookingSchema>

// ============================================
// Legacy Type (kept for backwards compatibility)
// ============================================

/**
 * Full booking submission data (form data + slot data)
 * @deprecated Use CreateBookingInput instead
 */
export interface BookingSubmissionData {
  eventTypeId: string
  startTimeUTC: string
  inviteeName: string
  inviteeEmail: string
  inviteeNotes?: string
  inviteeTimezone: string
}
