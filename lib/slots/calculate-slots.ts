/**
 * Slot Calculation Logic
 * 
 * Core functions for calculating available time slots.
 * Handles timezone conversions, availability matching, and booking conflicts.
 */

import { addMinutes } from "date-fns"
import { 
  parseTimeToUTC, 
  formatTimeInTimezone, 
  getDayOfWeekInTimezone,
  formatDateInTimezone,
  type DayOfWeekLower,
} from "@/lib/timezone"
import type { 
  Slot, 
  BookingSlotData,
} from "./types"
import type { TimeBlock } from "@/lib/types/availability"

/**
 * Availability input type - accepts either format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AvailabilityInput = any // Accept either format from DB

/**
 * Generate available slots for a given date
 * 
 * @param selectedDateStr - Date string (YYYY-MM-DD) in invitee's timezone context
 * @param duration - Event duration in minutes
 * @param hostTimezone - Host's IANA timezone
 * @param inviteeTimezone - Invitee's IANA timezone
 * @param availability - Host's weekly availability schedule
 * @param existingBookings - Array of existing bookings (startTime/endTime in UTC)
 * @returns Array of available Slot objects
 */
export function calculateSlotsForDate(
  selectedDateStr: string,
  duration: number,
  hostTimezone: string,
  inviteeTimezone: string,
  availability: AvailabilityInput,
  existingBookings: BookingSlotData[]
): Slot[] {
  const slots: Slot[] = []
  
  // Parse the selected date to get a UTC reference point
  // We'll use midnight invitee time as our starting reference
  const inviteeMidnightUTC = parseTimeToUTC(selectedDateStr, "00:00", inviteeTimezone)
  
  // Determine which host day this corresponds to
  // For the majority of the invitee's day, check the host's day
  const hostDay = getDayOfWeekInTimezone(inviteeMidnightUTC, hostTimezone)
  
  // Get availability blocks for this host day
  const dayAvailability = getAvailabilityForDay(availability, hostDay)
  
  if (!dayAvailability || dayAvailability.length === 0) {
    return [] // No availability for this day
  }
  
  // Get the host's date string for this day
  const hostDateStr = formatDateInTimezone(inviteeMidnightUTC, hostTimezone)
  
  // Generate potential slots from availability blocks
  for (const block of dayAvailability) {
    const blockSlots = generateSlotsFromBlock(
      hostDateStr,
      block,
      duration,
      hostTimezone,
      inviteeTimezone
    )
    slots.push(...blockSlots)
  }
  
  // Filter out slots that overlap with existing bookings
  const availableSlots = slots.filter(slot => 
    !hasBookingConflict(slot, existingBookings)
  )
  
  // Filter out slots in the past
  const now = new Date()
  const futureSlots = availableSlots.filter(slot => 
    new Date(slot.startTimeUTC) > now
  )
  
  return futureSlots
}

/**
 * Day availability structure as stored in the database
 * The database format has { enabled: boolean, blocks: TimeBlock[] }
 */
interface DayAvailabilityDB {
  enabled: boolean
  blocks: TimeBlock[]
}

/**
 * Weekly availability as stored in the database
 */
/**
 * Get availability blocks for a specific day
 * Handles both the old format (TimeBlock[] | null) and new format ({ enabled, blocks })
 */
function getAvailabilityForDay(
  availability: AvailabilityInput,
  day: DayOfWeekLower
): TimeBlock[] | null {
  const dayData = availability[day]
  
  // Handle null case
  if (dayData === null) {
    return null
  }
  
  // Handle array case (old format)
  if (Array.isArray(dayData)) {
    return dayData.length > 0 ? dayData : null
  }
  
  // Handle object case (new format with enabled flag)
  if (typeof dayData === 'object' && 'enabled' in dayData && 'blocks' in dayData) {
    const dbFormat = dayData as DayAvailabilityDB
    if (!dbFormat.enabled || dbFormat.blocks.length === 0) {
      return null
    }
    return dbFormat.blocks
  }
  
  return null
}

/**
 * Generate slot times from an availability block
 * 
 * @param hostDateStr - The host's date (YYYY-MM-DD)
 * @param block - Time block with start/end times
 * @param duration - Event duration in minutes
 * @param hostTimezone - Host's timezone
 * @param inviteeTimezone - Invitee's timezone for display
 * @returns Array of Slot objects
 */
function generateSlotsFromBlock(
  hostDateStr: string,
  block: TimeBlock,
  duration: number,
  hostTimezone: string,
  inviteeTimezone: string
): Slot[] {
  const slots: Slot[] = []
  
  // Parse block start and end times to UTC
  const blockStartUTC = parseTimeToUTC(hostDateStr, block.start, hostTimezone)
  const blockEndUTC = parseTimeToUTC(hostDateStr, block.end, hostTimezone)
  
  // Generate slots at duration intervals
  let slotStartUTC = blockStartUTC
  
  while (true) {
    const slotEndUTC = addMinutes(slotStartUTC, duration)
    
    // Slot must end before or at block end
    if (slotEndUTC > blockEndUTC) {
      break
    }
    
    // Create slot with display times in invitee timezone
    slots.push({
      startTimeUTC: slotStartUTC.toISOString(),
      endTimeUTC: slotEndUTC.toISOString(),
      startTimeDisplay: formatTimeInTimezone(slotStartUTC, inviteeTimezone),
      endTimeDisplay: formatTimeInTimezone(slotEndUTC, inviteeTimezone),
    })
    
    // Move to next slot
    slotStartUTC = slotEndUTC
  }
  
  return slots
}

/**
 * Check if a slot conflicts with any existing booking
 * 
 * Overlap logic: slot overlaps booking if:
 *   slot.start < booking.end AND slot.end > booking.start
 */
function hasBookingConflict(slot: Slot, bookings: BookingSlotData[]): boolean {
  const slotStart = new Date(slot.startTimeUTC)
  const slotEnd = new Date(slot.endTimeUTC)
  
  for (const booking of bookings) {
    // Check for overlap
    if (slotStart < booking.endTime && slotEnd > booking.startTime) {
      return true
    }
  }
  
  return false
}

/**
 * Check if a duration can fit in an availability block
 */
export function canDurationFitInBlock(block: TimeBlock, duration: number): boolean {
  const [startHours, startMinutes] = block.start.split(":").map(Number)
  const [endHours, endMinutes] = block.end.split(":").map(Number)
  
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  const blockDuration = endTotalMinutes - startTotalMinutes
  
  return blockDuration >= duration
}

/**
 * Calculate how many slots can fit in a time block
 */
export function countSlotsInBlock(block: TimeBlock, duration: number): number {
  const [startHours, startMinutes] = block.start.split(":").map(Number)
  const [endHours, endMinutes] = block.end.split(":").map(Number)
  
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  const blockDuration = endTotalMinutes - startTotalMinutes
  
  return Math.floor(blockDuration / duration)
}
