/**
 * Timezone Utilities
 * 
 * Helper functions for timezone detection, formatting, and listing.
 * Uses Intl API for browser-native timezone support.
 */

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
