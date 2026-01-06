/**
 * Availability Type Definitions
 * 
 * Types for user availability schedule stored in User.availability JSON field.
 * Availability times are stored in the host's local timezone (not UTC).
 */

/**
 * Days of the week as used in availability
 */
export type DayOfWeek = 
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

/**
 * A single time block representing available hours
 * Times are in 24-hour format: "HH:mm"
 */
export interface TimeBlock {
  start: string  // e.g., "09:00"
  end: string    // e.g., "17:00"
}

/**
 * Schedule for a single day
 * - null means the day is completely unavailable
 * - Array of TimeBlock for available periods
 */
export type DaySchedule = TimeBlock[] | null

/**
 * Weekly availability schedule
 * Each day maps to its schedule (null for unavailable, array for time blocks)
 */
export interface WeeklyAvailability {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

/**
 * User availability data returned from server actions
 */
export interface UserAvailabilityData {
  availability: WeeklyAvailability
  timezone: string
}
