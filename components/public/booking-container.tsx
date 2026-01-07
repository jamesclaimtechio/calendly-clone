/**
 * Booking Container Component
 * 
 * Container for the booking flow: calendar, slot selection, and booking form.
 * Manages state for timezone, date selection, slot selection, and step navigation.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar } from "./calendar"
import { TimezoneSelector } from "./timezone-selector"
import { SlotPicker } from "./slot-picker"
import { SelectedSlotConfirm } from "./selected-slot-confirm"
import { BookingForm } from "./booking-form"
import { detectBrowserTimezone } from "@/lib/timezone"
import { createBooking } from "@/actions/booking"
import type { Slot } from "@/lib/slots/types"
import type { BookingFormInput } from "@/lib/validations/booking"

type BookingStep = "slot-selection" | "booking-form"

interface BookingContainerProps {
  username: string
  eventSlug: string
  eventTypeId: string
  /** Optional event name for display in booking form */
  eventName?: string
  /** Optional event duration for display in booking form */
  eventDuration?: number
  /** Optional host name for display in booking form */
  hostName?: string
}

export function BookingContainer({
  username,
  eventSlug,
  eventTypeId,
  eventName,
  eventDuration,
  hostName,
}: BookingContainerProps) {
  const router = useRouter()
  const [step, setStep] = useState<BookingStep>("slot-selection")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timezone, setTimezone] = useState<string>("UTC") // Default until browser detection
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // Detect browser timezone on mount (client-side only)
  useEffect(() => {
    const detectedTz = detectBrowserTimezone()
    setTimezone(detectedTz)
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Clear slot selection when date changes
    setSelectedSlot(null)
  }

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone)
    // Clear slot selection when timezone changes (times have shifted)
    setSelectedSlot(null)
  }

  // Use useCallback to avoid re-creating the function on every render
  const handleSlotSelect = useCallback((slot: Slot | null) => {
    setSelectedSlot(slot)
  }, [])

  const handleConfirm = () => {
    // Move to booking form step
    setStep("booking-form")
  }

  const handleBackToSlotSelection = () => {
    // Go back to slot selection step
    setStep("slot-selection")
  }

  const handleFormSubmit = async (formData: BookingFormInput) => {
    // Prepare full submission data
    const submissionData = {
      eventTypeId,
      startTimeUTC: selectedSlot!.startTimeUTC,
      inviteeName: formData.inviteeName,
      inviteeEmail: formData.inviteeEmail,
      inviteeNotes: formData.inviteeNotes,
      inviteeTimezone: timezone,
    }

    // Call the createBooking server action
    const result = await createBooking(submissionData)

    if (result.success) {
      // Show success toast
      toast.success("Meeting scheduled successfully!")
      
      // Redirect to confirmation page
      // Note: Chunk 6.3 will create the actual confirmation page
      // For now, redirect to a placeholder URL with the booking ID
      router.push(`/${username}/${eventSlug}/confirmation?bookingId=${result.bookingId}`)
    } else {
      // Show error toast with the friendly message
      toast.error(result.error)
    }
  }

  // Render booking form step
  if (step === "booking-form" && selectedDate && selectedSlot) {
    return (
      <BookingForm
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        timezone={timezone}
        eventTypeId={eventTypeId}
        eventName={eventName}
        eventDuration={eventDuration}
        hostName={hostName}
        onSubmit={handleFormSubmit}
        onBack={handleBackToSlotSelection}
      />
    )
  }

  // Render slot selection step (default)
  return (
    <div className="space-y-6">
      {/* Timezone Selector */}
      <div className="flex justify-end">
        <TimezoneSelector
          value={timezone}
          onChange={handleTimezoneChange}
        />
      </div>

      {/* Calendar */}
      <div className="bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)] p-6">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Slot Picker */}
      <div className="bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border)] p-6">
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
          {selectedDate ? "Available Times" : "Select a Date"}
        </h3>
        <SlotPicker
          username={username}
          eventSlug={eventSlug}
          selectedDate={selectedDate}
          timezone={timezone}
          selectedSlot={selectedSlot}
          onSlotSelect={handleSlotSelect}
        />
      </div>

      {/* Confirm Selection */}
      {selectedDate && selectedSlot && (
        <SelectedSlotConfirm
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          timezone={timezone}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
