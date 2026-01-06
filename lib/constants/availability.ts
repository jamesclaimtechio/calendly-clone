/**
 * Availability Constants
 * 
 * Default values and constants for user availability settings.
 */

import type { DayOfWeek, WeeklyAvailability } from "@/lib/types/availability"

/**
 * Days of the week in order
 */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

/**
 * Display labels for days of the week
 */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

/**
 * Default time block for enabled days (9 AM - 5 PM)
 */
export const DEFAULT_TIME_BLOCK = {
  start: "09:00",
  end: "17:00",
}

/**
 * Default availability for new users
 * Monday-Friday: 9:00 AM - 5:00 PM
 * Saturday-Sunday: Not available
 */
export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  monday: [{ start: "09:00", end: "17:00" }],
  tuesday: [{ start: "09:00", end: "17:00" }],
  wednesday: [{ start: "09:00", end: "17:00" }],
  thursday: [{ start: "09:00", end: "17:00" }],
  friday: [{ start: "09:00", end: "17:00" }],
  saturday: null,
  sunday: null,
}

/**
 * Default timezone for new users
 * Will be overwritten by browser detection on first setup
 */
export const DEFAULT_TIMEZONE = "UTC"
