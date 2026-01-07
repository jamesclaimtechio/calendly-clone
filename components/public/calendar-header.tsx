/**
 * Calendar Header Component
 * 
 * Displays month/year and navigation arrows.
 */

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatMonthYear } from "@/lib/calendar-utils"

interface CalendarHeaderProps {
  currentMonth: Date
  canGoPrevious: boolean
  canGoNext: boolean
  onPreviousMonth: () => void
  onNextMonth: () => void
}

export function CalendarHeader({
  currentMonth,
  canGoPrevious,
  canGoNext,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Previous Month Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        disabled={!canGoPrevious}
        aria-label="Previous month"
        className="h-8 w-8 rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Month and Year Display */}
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        {formatMonthYear(currentMonth)}
      </h2>

      {/* Next Month Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        disabled={!canGoNext}
        aria-label="Next month"
        className="h-8 w-8 rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
