"use client"

/**
 * Slot Button Component
 * 
 * Individual time slot button for the booking page.
 * Displays the slot time and handles selection.
 */

import { cn } from "@/lib/utils"
import type { Slot } from "@/lib/slots/types"

interface SlotButtonProps {
  slot: Slot
  isSelected: boolean
  onClick: () => void
}

export function SlotButton({ slot, isSelected, onClick }: SlotButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-3 px-4 text-sm font-medium rounded-sm border transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        isSelected
          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
          : "bg-white text-[var(--color-primary)] border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
      )}
      aria-pressed={isSelected}
      aria-label={`Select ${slot.startTimeDisplay} to ${slot.endTimeDisplay}`}
    >
      {slot.startTimeDisplay}
    </button>
  )
}
