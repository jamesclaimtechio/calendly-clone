/**
 * Booking Confirmation Component
 * 
 * Displays confirmation details after a successful booking.
 * Shows event name, host, date/time in invitee's timezone, and invitee info.
 */

import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  FileText,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DURATION_LABELS, type DurationOption } from "@/lib/validations/events"
import type { BookingConfirmation } from "@/lib/queries/booking"

interface BookingConfirmationProps {
  booking: BookingConfirmation
}

/**
 * Format date in a nice, readable format
 * e.g., "Wednesday, January 7, 2026"
 */
function formatConfirmationDate(date: Date, timezone: string): string {
  const zonedDate = toZonedTime(date, timezone)
  return format(zonedDate, "EEEE, MMMM d, yyyy")
}

/**
 * Format time in 12-hour format
 * e.g., "10:30 PM"
 */
function formatConfirmationTime(date: Date, timezone: string): string {
  const zonedDate = toZonedTime(date, timezone)
  return format(zonedDate, "h:mm a")
}

/**
 * Get duration display label
 */
function getDurationLabel(duration: number): string {
  if (duration in DURATION_LABELS) {
    return DURATION_LABELS[duration as DurationOption]
  }
  return `${duration} minutes`
}

export function BookingConfirmationDisplay({ booking }: BookingConfirmationProps) {
  const { host, eventType, inviteeTimezone } = booking
  
  // Format display values using invitee's timezone
  const displayDate = formatConfirmationDate(booking.startTime, inviteeTimezone)
  const startTime = formatConfirmationTime(booking.startTime, inviteeTimezone)
  const endTime = formatConfirmationTime(booking.endTime, inviteeTimezone)
  const durationLabel = getDurationLabel(eventType.duration)
  
  // Host display name
  const hostDisplayName = host.name || host.username || host.email.split("@")[0]

  return (
    <div className="max-w-lg mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          You&apos;re Scheduled!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          A calendar invitation has been sent to your email address.
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="mb-6 border-[var(--color-border)] shadow-sm">
        <CardContent className="p-6">
          {/* Event Name */}
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            {eventType.name}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            with {hostDisplayName}
          </p>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  {displayDate}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[var(--color-text-primary)] font-medium">
                  {startTime} - {endTime}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {inviteeTimezone} ({durationLabel})
                </p>
              </div>
            </div>

            {/* Location (if set) */}
            {eventType.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[var(--color-text-primary)]">
                    {eventType.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invitee Info Card */}
      <Card className="mb-6 border-[var(--color-border)] shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">
            Your Information
          </h3>
          
          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-primary)]">
                {booking.inviteeName}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-primary)]">
                {booking.inviteeEmail}
              </span>
            </div>

            {/* Notes (if provided) */}
            {booking.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-[var(--color-border)]">
                <FileText className="h-4 w-4 text-[var(--color-text-muted)] mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                    Additional notes
                  </p>
                  <p className="text-[var(--color-text-primary)] text-sm">
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add to Calendar Button - Placeholder for Chunk 6.4 */}
      <div className="text-center">
        <Button
          variant="outline"
          className="rounded-full border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
          disabled
        >
          <Download className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          Coming soon
        </p>
      </div>
    </div>
  )
}
