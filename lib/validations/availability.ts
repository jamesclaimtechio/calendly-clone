/**
 * Availability Validation Schemas
 * 
 * Zod schemas for validating availability data.
 * Used by server actions for input validation.
 */

import { z } from "zod"

/**
 * Time format regex: HH:mm (24-hour format)
 * Valid: 00:00 to 23:59
 */
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

/**
 * Parse time string to minutes since midnight for comparison
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Schema for a single time block
 * Validates:
 * - Start and end are in HH:mm format
 * - End time is after start time
 */
export const timeBlockSchema = z
  .object({
    start: z
      .string()
      .regex(TIME_REGEX, "Start time must be in HH:mm format (e.g., 09:00)"),
    end: z
      .string()
      .regex(TIME_REGEX, "End time must be in HH:mm format (e.g., 17:00)"),
  })
  .refine(
    (data) => timeToMinutes(data.end) > timeToMinutes(data.start),
    { message: "End time must be after start time" }
  )

/**
 * Schema for a day's schedule
 * Either null (day off) or an array of time blocks
 */
export const dayScheduleSchema = z
  .array(timeBlockSchema)
  .min(1, "Day must have at least one time block if enabled")
  .nullable()

/**
 * Schema for weekly availability
 * All 7 days with their schedules
 */
export const weeklyAvailabilitySchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
})

export type WeeklyAvailabilityInput = z.input<typeof weeklyAvailabilitySchema>

/**
 * Get list of valid IANA timezone names
 * Uses Intl API for dynamic, up-to-date list
 */
function getValidTimezones(): string[] {
  try {
    return Intl.supportedValuesOf("timeZone")
  } catch {
    // Fallback for older environments
    return ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London"]
  }
}

/**
 * Schema for timezone validation
 * Validates against IANA timezone database
 */
export const timezoneSchema = z
  .string()
  .min(1, "Timezone is required")
  .refine(
    (tz) => getValidTimezones().includes(tz),
    { message: "Invalid timezone" }
  )

export type TimezoneInput = z.input<typeof timezoneSchema>
