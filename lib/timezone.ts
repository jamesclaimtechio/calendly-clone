/**
 * Timezone Utilities
 * 
 * Helper functions for timezone detection, formatting, listing, and conversion.
 * Uses Intl API for browser-native timezone support and date-fns-tz for conversions.
 */

import { format } from "date-fns"
import { toZonedTime, fromZonedTime } from "date-fns-tz"

/**
 * Day of week type matching our availability schema
 */
export type DayOfWeekLower = 
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"

/**
 * Timezone option for select dropdowns
 */
export interface TimezoneOption {
  value: string      // IANA timezone name (e.g., "America/New_York")
  label: string      // Formatted label (e.g., "America/New York (UTC-5)")
  region: string     // Region for grouping (e.g., "America")
  offset: number     // Offset in minutes for sorting
}

/**
 * Get current UTC offset for a timezone
 * Returns offset string like "+05:00" or "-08:00"
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    })
    
    const parts = formatter.formatToParts(now)
    const offsetPart = parts.find((p) => p.type === "timeZoneName")
    
    if (offsetPart?.value) {
      // Convert "GMT-5" to "UTC-5" format
      return offsetPart.value.replace("GMT", "UTC")
    }
    
    return "UTC"
  } catch {
    return "UTC"
  }
}

/**
 * Get offset in minutes for sorting
 */
function getOffsetMinutes(timezone: string): number {
  try {
    const now = new Date()
    const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
    const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
    return (tzDate.getTime() - utcDate.getTime()) / 60000
  } catch {
    return 0
  }
}

/**
 * Format timezone name for display
 * "America/New_York" → "New York"
 */
function formatCity(timezone: string): string {
  const parts = timezone.split("/")
  const city = parts[parts.length - 1]
  return city.replace(/_/g, " ")
}

/**
 * Format timezone label for display
 * "America/New_York" → "America/New York (UTC-5)"
 */
export function formatTimezoneLabel(timezone: string): string {
  const offset = getTimezoneOffset(timezone)
  const parts = timezone.split("/")
  
  if (parts.length === 1) {
    return `${timezone} (${offset})`
  }
  
  const region = parts[0]
  const city = formatCity(timezone)
  
  return `${region}/${city} (${offset})`
}

/**
 * Detect browser's timezone
 * Returns IANA timezone name
 */
export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

/**
 * Get list of all supported timezones
 * Grouped by region and sorted by offset
 */
export function getTimezoneList(): TimezoneOption[] {
  try {
    const timezones = Intl.supportedValuesOf("timeZone")
    
    const options: TimezoneOption[] = timezones.map((tz) => {
      const parts = tz.split("/")
      const region = parts[0] || "Other"
      
      return {
        value: tz,
        label: formatTimezoneLabel(tz),
        region,
        offset: getOffsetMinutes(tz),
      }
    })
    
    // Sort by offset, then alphabetically
    return options.sort((a, b) => {
      if (a.offset !== b.offset) {
        return a.offset - b.offset
      }
      return a.label.localeCompare(b.label)
    })
  } catch {
    // Fallback for older browsers
    return [
      { value: "UTC", label: "UTC (UTC+0)", region: "UTC", offset: 0 },
      { value: "America/New_York", label: "America/New York (UTC-5)", region: "America", offset: -300 },
      { value: "America/Los_Angeles", label: "America/Los Angeles (UTC-8)", region: "America", offset: -480 },
      { value: "Europe/London", label: "Europe/London (UTC+0)", region: "Europe", offset: 0 },
      { value: "Europe/Paris", label: "Europe/Paris (UTC+1)", region: "Europe", offset: 60 },
      { value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+9)", region: "Asia", offset: 540 },
    ]
  }
}

/**
 * Get timezones grouped by region
 */
export function getTimezonesByRegion(): Record<string, TimezoneOption[]> {
  const timezones = getTimezoneList()
  
  return timezones.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = []
    }
    acc[tz.region].push(tz)
    return acc
  }, {} as Record<string, TimezoneOption[]>)
}

/**
 * Get common timezones for quick selection
 */
export function getCommonTimezones(): TimezoneOption[] {
  const common = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Dubai",
    "Australia/Sydney",
    "Pacific/Auckland",
  ]
  
  const all = getTimezoneList()
  return all.filter((tz) => common.includes(tz.value))
}

// ============================================
// TIMEZONE CONVERSION HELPERS (for slot calculation)
// ============================================

/**
 * Convert a UTC Date to a specific timezone
 * @param utcDate - Date object in UTC
 * @param timezone - Target IANA timezone
 * @returns Date object representing the time in the target timezone
 */
export function toTimezone(utcDate: Date, timezone: string): Date {
  return toZonedTime(utcDate, timezone)
}

/**
 * Convert a zoned Date to UTC
 * @param zonedDate - Date object in a specific timezone
 * @param timezone - The timezone of the zonedDate
 * @returns Date object in UTC
 */
export function toUTC(zonedDate: Date, timezone: string): Date {
  return fromZonedTime(zonedDate, timezone)
}

/**
 * Format a time for display in a specific timezone
 * @param utcDate - Date object in UTC
 * @param timezone - Target IANA timezone
 * @param formatStr - date-fns format string (default: "h:mm a")
 * @returns Formatted time string
 */
export function formatTimeInTimezone(
  utcDate: Date, 
  timezone: string, 
  formatStr: string = "h:mm a"
): string {
  const zonedDate = toZonedTime(utcDate, timezone)
  return format(zonedDate, formatStr)
}

/**
 * Get the day of week for a date in a specific timezone
 * @param utcDate - Date object in UTC
 * @param timezone - Target IANA timezone
 * @returns Lowercase day name (e.g., "monday")
 */
export function getDayOfWeekInTimezone(utcDate: Date, timezone: string): DayOfWeekLower {
  const zonedDate = toZonedTime(utcDate, timezone)
  const dayIndex = zonedDate.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  const days: DayOfWeekLower[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]
  
  return days[dayIndex]
}

/**
 * Parse a time string (HH:mm) on a specific date in a timezone and return UTC
 * @param dateStr - Date string (YYYY-MM-DD) representing the day
 * @param timeStr - Time string in 24h format (HH:mm)
 * @param timezone - The timezone context
 * @returns UTC Date object
 */
export function parseTimeToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string
): Date {
  // Create a date string in the format that can be parsed
  const [hours, minutes] = timeStr.split(":").map(Number)
  const [year, month, day] = dateStr.split("-").map(Number)
  
  // Create date in the target timezone
  const zonedDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
  
  // Convert to UTC
  return fromZonedTime(zonedDate, timezone)
}

/**
 * Get the start of day for a date in a specific timezone, returned as UTC
 * @param dateStr - Date string (YYYY-MM-DD)
 * @param timezone - The timezone context
 * @returns UTC Date representing start of day (00:00) in that timezone
 */
export function getStartOfDayInTimezone(dateStr: string, timezone: string): Date {
  return parseTimeToUTC(dateStr, "00:00", timezone)
}

/**
 * Get the end of day for a date in a specific timezone, returned as UTC
 * @param dateStr - Date string (YYYY-MM-DD)
 * @param timezone - The timezone context
 * @returns UTC Date representing end of day (23:59:59) in that timezone
 */
export function getEndOfDayInTimezone(dateStr: string, timezone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  const zonedDate = new Date(year, month - 1, day, 23, 59, 59, 999)
  return fromZonedTime(zonedDate, timezone)
}

/**
 * Format a date string (YYYY-MM-DD) in a specific timezone from a UTC date
 * @param utcDate - Date object in UTC
 * @param timezone - Target IANA timezone
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateInTimezone(utcDate: Date, timezone: string): string {
  const zonedDate = toZonedTime(utcDate, timezone)
  return format(zonedDate, "yyyy-MM-dd")
}
