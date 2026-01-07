/**
 * Calendar Component
 * 
 * Interactive calendar for date selection.
 * Shows a month grid with navigation, past dates disabled.
 */

"use client"

import { useState } from "react"
import { startOfMonth } from "date-fns"
import { CalendarHeader } from "./calendar-header"
import { CalendarDay } from "./calendar-day"
import {
  getCalendarDays,
  isBookableDate,
  isToday,
  isCurrentMonth,
  isSameDay,
  canNavigatePrevious,
  canNavigateNext,
  getNextMonth,
  getPreviousMonth,
  WEEKDAY_NAMES,
  MAX_BOOKING_DAYS,
} from "@/lib/calendar-utils"

interface CalendarProps {
  /**
   * Callback when a date is selected
   */
  onDateSelect?: (date: Date) => void
  
  /**
   * Currently selected date (controlled)
   */
  selectedDate?: Date | null
  
  /**
   * Maximum days in the future that can be booked
   */
  maxBookingDays?: number
}

export function Calendar({
  onDateSelect,
  selectedDate: controlledSelectedDate,
  maxBookingDays = MAX_BOOKING_DAYS,
}: CalendarProps) {
  // Current displayed month (starts with current month)
  const [displayedMonth, setDisplayedMonth] = useState(() => startOfMonth(new Date()))
  
  // Internal selected date state (for uncontrolled usage)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null)
  
  // Use controlled or internal selected date
  const selectedDate = controlledSelectedDate !== undefined 
    ? controlledSelectedDate 
    : internalSelectedDate

  // Get all days for the calendar grid
  const calendarDays = getCalendarDays(displayedMonth)

  // Navigation handlers
  const handlePreviousMonth = () => {
    if (canNavigatePrevious(displayedMonth)) {
      setDisplayedMonth(getPreviousMonth(displayedMonth))
    }
  }

  const handleNextMonth = () => {
    if (canNavigateNext(displayedMonth, maxBookingDays)) {
      setDisplayedMonth(getNextMonth(displayedMonth))
    }
  }

  // Date selection handler
  const handleDateClick = (date: Date) => {
    // Only allow clicking dates that are in the current month and bookable
    if (!isCurrentMonth(date, displayedMonth)) return
    if (!isBookableDate(date, maxBookingDays)) return
    
    // Update internal state if not controlled
    if (controlledSelectedDate === undefined) {
      setInternalSelectedDate(date)
    }
    
    // Call callback
    onDateSelect?.(date)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header with month navigation */}
      <CalendarHeader
        currentMonth={displayedMonth}
        canGoPrevious={canNavigatePrevious(displayedMonth)}
        canGoNext={canNavigateNext(displayedMonth, maxBookingDays)}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_NAMES.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs font-medium text-[var(--color-text-muted)] uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const inCurrentMonth = isCurrentMonth(date, displayedMonth)
          const isDateBookable = isBookableDate(date, maxBookingDays)
          
          // A date is disabled if:
          // 1. It's not bookable (past or too far in future)
          // 2. It's not in the current month (overflow days)
          const isDisabled = !isDateBookable || !inCurrentMonth
          
          // Check if this date is selected
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
          
          return (
            <CalendarDay
              key={index}
              date={date}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isToday={isToday(date)}
              isCurrentMonth={inCurrentMonth}
              onClick={handleDateClick}
            />
          )
        })}
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-xs text-center text-[var(--color-text-muted)]">
        Select a date to see available times
      </p>
    </div>
  )
}
