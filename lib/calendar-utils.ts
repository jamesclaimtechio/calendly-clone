/**
 * Calendar Utility Functions
 * 
 * Helper functions for calendar date manipulation.
 * Uses date-fns for reliable date handling.
 */

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
  addMonths,
  addDays,
} from "date-fns"

/**
 * Maximum number of days in the future that can be booked
 */
export const MAX_BOOKING_DAYS = 60

/**
 * Day names for calendar header (Sunday first - US standard)
 */
export const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/**
 * Get all days to display in a calendar month grid.
 * Includes overflow days from previous and next months to fill the grid.
 * 
 * @param date - Any date within the target month
 * @returns Array of dates representing the full calendar grid
 */
export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  
  // Start from Sunday of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  
  // End on Saturday of the week containing the last day of the month
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
}

/**
 * Format a date as "Month Year" (e.g., "January 2026")
 * 
 * @param date - Date to format
 * @returns Formatted month and year string
 */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy")
}

/**
 * Check if a date is in the past (before today)
 * 
 * @param date - Date to check
 * @returns true if the date is before today
 */
export function isPastDate(date: Date): boolean {
  const today = startOfDay(new Date())
  return isBefore(date, today)
}

/**
 * Check if a date is today
 * 
 * @param date - Date to check
 * @returns true if the date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Check if a date is within the booking window (not past and within max days)
 * 
 * @param date - Date to check
 * @param maxDays - Maximum days in the future (default: MAX_BOOKING_DAYS)
 * @returns true if the date can be booked
 */
export function isBookableDate(date: Date, maxDays: number = MAX_BOOKING_DAYS): boolean {
  const today = startOfDay(new Date())
  const maxDate = addDays(today, maxDays)
  
  // Date must be today or later, and within the max booking window
  return !isBefore(date, today) && isBefore(date, addDays(maxDate, 1))
}

/**
 * Check if a date belongs to the currently displayed month
 * 
 * @param date - Date to check
 * @param currentMonth - The month being displayed
 * @returns true if the date is in the current month
 */
export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth)
}

/**
 * Check if we can navigate to the previous month
 * (Can't go before the current month)
 * 
 * @param displayedMonth - The currently displayed month
 * @returns true if previous month navigation is allowed
 */
export function canNavigatePrevious(displayedMonth: Date): boolean {
  const currentMonth = startOfMonth(new Date())
  const displayed = startOfMonth(displayedMonth)
  
  // Can go back if displayed month is after current month
  return !isBefore(displayed, currentMonth) && !isSameDay(displayed, currentMonth)
}

/**
 * Check if we can navigate to the next month
 * (Can't go beyond the booking window)
 * 
 * @param displayedMonth - The currently displayed month
 * @param maxDays - Maximum days in the future (default: MAX_BOOKING_DAYS)
 * @returns true if next month navigation is allowed
 */
export function canNavigateNext(displayedMonth: Date, maxDays: number = MAX_BOOKING_DAYS): boolean {
  const today = startOfDay(new Date())
  const maxDate = addDays(today, maxDays)
  const nextMonth = addMonths(displayedMonth, 1)
  const nextMonthStart = startOfMonth(nextMonth)
  
  // Can go forward if the start of next month is before or at the max date
  return isBefore(nextMonthStart, addDays(maxDate, 1))
}

/**
 * Get the next month
 * 
 * @param date - Current date
 * @returns First day of the next month
 */
export function getNextMonth(date: Date): Date {
  return startOfMonth(addMonths(date, 1))
}

/**
 * Get the previous month
 * 
 * @param date - Current date
 * @returns First day of the previous month
 */
export function getPreviousMonth(date: Date): Date {
  return startOfMonth(addMonths(date, -1))
}

// Re-export isSameDay for convenience
export { isSameDay }
