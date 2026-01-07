"use client"

/**
 * Selected Slot Confirm Component
 * 
 * Displays the selected date/time and a confirm button.
 * Shows when a slot is selected to proceed to booking form.
 */

import { format } from "date-fns"
import { Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Slot } from "@/lib/slots/types"

interface SelectedSlotConfirmProps {
  selectedDate: Date
  selectedSlot: Slot
  onConfirm: () => void
  timezone: string
}

export function SelectedSlotConfirm({
  selectedDate,
  selectedSlot,
  onConfirm,
  timezone,
}: SelectedSlotConfirmProps) {
  return (
    <div className="mt-6 p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
          <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] mt-0.5">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {selectedSlot.startTimeDisplay} – {selectedSlot.endTimeDisplay}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {timezone.replace(/_/g, " ")}
          </p>
        </div>
      </div>
      
      <Button
        onClick={onConfirm}
        className="w-full mt-4 rounded-full"
        size="lg"
      >
        Confirm
      </Button>
    </div>
  )
}
