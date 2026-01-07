"use client"

/**
 * Slot Picker Component
 * 
 * Container for fetching and displaying available time slots.
 * Handles loading, empty, and error states.
 */

import { useEffect, useState, useTransition } from "react"
import { Loader2, CalendarX } from "lucide-react"
import { format } from "date-fns"
import { SlotButton } from "./slot-button"
import { getAvailableSlotsBySlug } from "@/actions/slots"
import type { Slot } from "@/lib/slots/types"

interface SlotPickerProps {
  username: string
  eventSlug: string
  selectedDate: Date | null
  timezone: string
  selectedSlot: Slot | null
  onSlotSelect: (slot: Slot | null) => void
}

export function SlotPicker({
  username,
  eventSlug,
  selectedDate,
  timezone,
  selectedSlot,
  onSlotSelect,
}: SlotPickerProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  // Fetch slots when date or timezone changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      setHasFetched(false)
      setError(null)
      return
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd")

    startTransition(async () => {
      setError(null)
      try {
        const result = await getAvailableSlotsBySlug(
          username,
          eventSlug,
          dateStr,
          timezone
        )

        if (result.success) {
          setSlots(result.slots)
        } else {
          setError(result.error || "Failed to load slots")
          setSlots([])
        }
      } catch (err) {
        console.error("Error fetching slots:", err)
        setError("Failed to load available times")
        setSlots([])
      } finally {
        setHasFetched(true)
      }
    })

    // Clear selected slot when date/timezone changes
    onSlotSelect(null)
  }, [selectedDate, timezone, username, eventSlug, onSlotSelect])

  // No date selected state
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-3">
          <CalendarX className="h-6 w-6 text-[var(--color-text-muted)]" />
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">
          Select a date to see available times
        </p>
      </div>
    )
  }

  // Loading state
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-[var(--color-primary)] animate-spin mb-3" />
        <p className="text-[var(--color-text-muted)] text-sm">
          Loading available times...
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <CalendarX className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-red-600 text-sm font-medium mb-1">
          Unable to load times
        </p>
        <p className="text-[var(--color-text-muted)] text-xs">
          {error}
        </p>
      </div>
    )
  }

  // No slots available state
  if (hasFetched && slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center mb-3">
          <CalendarX className="h-6 w-6 text-[var(--color-text-muted)]" />
        </div>
        <p className="text-[var(--color-text-primary)] font-medium mb-1">
          No times available
        </p>
        <p className="text-[var(--color-text-muted)] text-sm">
          Try selecting a different date
        </p>
      </div>
    )
  }

  // Slots available state
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-text-secondary)] font-medium">
        {format(selectedDate, "EEEE, MMMM d")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {slots.map((slot) => (
          <SlotButton
            key={slot.startTimeUTC}
            slot={slot}
            isSelected={selectedSlot?.startTimeUTC === slot.startTimeUTC}
            onClick={() => onSlotSelect(slot)}
          />
        ))}
      </div>
    </div>
  )
}
