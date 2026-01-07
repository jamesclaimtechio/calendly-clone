/**
 * Slot Type Definitions
 * 
 * Types for time slot calculation and display.
 */

/**
 * A single available time slot
 */
export interface Slot {
  /** ISO string in UTC for booking storage */
  startTimeUTC: string
  /** ISO string in UTC for booking storage */
  endTimeUTC: string
  /** Formatted time string for display in invitee timezone (e.g., "9:00 AM") */
  startTimeDisplay: string
  /** Formatted time string for display in invitee timezone (e.g., "9:30 AM") */
  endTimeDisplay: string
}

/**
 * Input for slot calculation
 */
export interface SlotCalculationInput {
  /** The event type ID to calculate slots for */
  eventTypeId: string
  /** The selected date as ISO string (in invitee timezone context) */
  selectedDate: string
  /** The invitee's timezone (IANA format, e.g., "America/New_York") */
  inviteeTimezone: string
}

/**
 * Result from slot calculation
 */
export interface SlotCalculationResult {
  /** Whether the calculation was successful */
  success: boolean
  /** Array of available slots (empty if none available) */
  slots: Slot[]
  /** Error message if calculation failed */
  error?: string
}

/**
 * Host data needed for slot calculation
 */
export interface HostSlotData {
  id: string
  timezone: string
  availability: {
    monday: { start: string; end: string }[] | null
    tuesday: { start: string; end: string }[] | null
    wednesday: { start: string; end: string }[] | null
    thursday: { start: string; end: string }[] | null
    friday: { start: string; end: string }[] | null
    saturday: { start: string; end: string }[] | null
    sunday: { start: string; end: string }[] | null
  }
}

/**
 * Event type data needed for slot calculation
 */
export interface EventTypeSlotData {
  id: string
  duration: number // in minutes
  userId: string
}

/**
 * Booking data for overlap checking
 */
export interface BookingSlotData {
  id: string
  startTime: Date
  endTime: Date
}
