/**
 * Calendar Day Component
 * 
 * Individual day cell in the calendar grid.
 * Handles different visual states: default, selected, disabled, today, overflow.
 */

"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CalendarDayProps {
  date: Date
  isSelected: boolean
  isDisabled: boolean
  isToday: boolean
  isCurrentMonth: boolean
  onClick: (date: Date) => void
}

export function CalendarDay({
  date,
  isSelected,
  isDisabled,
  isToday,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const dayNumber = format(date, "d")

  const handleClick = () => {
    if (!isDisabled) {
      onClick(date)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={format(date, "EEEE, MMMM d, yyyy")}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      className={cn(
        // Base styles
        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
        // Focus styles
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        
        // Default state (current month, not selected, not disabled)
        isCurrentMonth && !isSelected && !isDisabled && !isToday && [
          "text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-primary)]/10",
          "cursor-pointer",
        ],
        
        // Today indicator (but not selected)
        isToday && !isSelected && !isDisabled && [
          "text-[var(--color-primary)]",
          "font-bold",
          "ring-1 ring-[var(--color-primary)]",
          "hover:bg-[var(--color-primary)]/10",
          "cursor-pointer",
        ],
        
        // Selected state
        isSelected && [
          "bg-[var(--color-primary)]",
          "text-white",
          "hover:bg-[var(--color-primary)]/90",
          "cursor-pointer",
        ],
        
        // Disabled state (past dates or outside booking window)
        isDisabled && [
          "text-[var(--color-text-muted)]/50",
          "cursor-not-allowed",
          "hover:bg-transparent",
        ],
        
        // Overflow days (previous/next month) - shown but grayed out
        !isCurrentMonth && !isDisabled && [
          "text-[var(--color-text-muted)]/40",
          "hover:bg-transparent",
          "cursor-default",
        ],
        
        // Overflow days that are also disabled
        !isCurrentMonth && isDisabled && [
          "text-[var(--color-text-muted)]/20",
        ]
      )}
    >
      {dayNumber}
    </button>
  )
}
