/**
 * Booking Form Component
 * 
 * Form for invitee to enter their details (name, email, notes)
 * before confirming the booking.
 */

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  bookingFormSchema,
  type BookingFormInput,
} from "@/lib/validations/booking"
import type { Slot } from "@/lib/slots/types"

interface BookingFormProps {
  /** The date the invitee selected */
  selectedDate: Date
  /** The time slot the invitee selected */
  selectedSlot: Slot
  /** The invitee's timezone */
  timezone: string
  /** The event type ID for submission */
  eventTypeId: string
  /** Event name for display */
  eventName?: string
  /** Event duration for display */
  eventDuration?: number
  /** Host name for display */
  hostName?: string
  /** Called when form is submitted with valid data */
  onSubmit: (data: BookingFormInput) => Promise<void>
  /** Called when user wants to go back to slot selection */
  onBack: () => void
}

export function BookingForm({
  selectedDate,
  selectedSlot,
  timezone,
  eventTypeId,
  eventName,
  eventDuration,
  hostName,
  onSubmit,
  onBack,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      inviteeName: "",
      inviteeEmail: "",
      inviteeNotes: "",
    },
  })

  const handleFormSubmit = async (data: BookingFormInput) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Booking submission error:", error)
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format the selected date nicely
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")
  const formattedTimezone = timezone.replace(/_/g, " ")

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to time selection
      </button>

      {/* Selected Slot Summary */}
      <div className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg p-4">
        {eventName && (
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            {eventName}
          </h2>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Clock className="h-4 w-4" />
            <span>
              {selectedSlot.startTimeDisplay} – {selectedSlot.endTimeDisplay}
              {eventDuration && ` (${eventDuration} min)`}
            </span>
          </div>
          
          <p className="text-xs text-[var(--color-text-muted)]">
            {formattedTimezone}
          </p>
        </div>
        
        {hostName && (
          <p className="text-sm text-[var(--color-text-muted)] mt-3">
            Meeting with {hostName}
          </p>
        )}
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="inviteeName" className="text-[var(--color-text-primary)]">
            Your Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inviteeName"
            type="text"
            placeholder="John Doe"
            disabled={isSubmitting}
            {...register("inviteeName")}
            className={errors.inviteeName ? "border-red-500" : ""}
          />
          {errors.inviteeName && (
            <p className="text-sm text-red-500">{errors.inviteeName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="inviteeEmail" className="text-[var(--color-text-primary)]">
            Your Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="inviteeEmail"
            type="email"
            placeholder="john@example.com"
            disabled={isSubmitting}
            {...register("inviteeEmail")}
            className={errors.inviteeEmail ? "border-red-500" : ""}
          />
          {errors.inviteeEmail && (
            <p className="text-sm text-red-500">{errors.inviteeEmail.message}</p>
          )}
        </div>

        {/* Notes Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="inviteeNotes" className="text-[var(--color-text-primary)]">
            Additional Notes{" "}
            <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
          </Label>
          <Textarea
            id="inviteeNotes"
            placeholder="Please share anything that will help prepare for our meeting..."
            rows={3}
            disabled={isSubmitting}
            {...register("inviteeNotes")}
            className={errors.inviteeNotes ? "border-red-500" : ""}
          />
          {errors.inviteeNotes && (
            <p className="text-sm text-red-500">{errors.inviteeNotes.message}</p>
          )}
          <p className="text-xs text-[var(--color-text-muted)]">
            Max 500 characters
          </p>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Meeting"
          )}
        </Button>

        <p className="text-xs text-center text-[var(--color-text-muted)]">
          By scheduling, you agree to receive meeting communications via email.
        </p>
      </form>
    </div>
  )
}
