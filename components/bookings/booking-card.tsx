/**
 * Booking Card Component
 * 
 * Displays individual booking details including event type,
 * date/time, and invitee information.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, Mail } from "lucide-react"
import { format } from "date-fns"
import type { UpcomingBooking } from "@/actions/booking"

interface BookingCardProps {
  booking: UpcomingBooking
}

export function BookingCard({ booking }: BookingCardProps) {
  const startDate = new Date(booking.startTime)
  const endDate = new Date(booking.endTime)
  
  // Format: "Monday, January 12, 2026"
  const dateStr = format(startDate, "EEEE, MMMM d, yyyy")
  
  // Format: "11:00 AM - 11:30 AM"
  const timeStr = `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Date/Time Column */}
          <div className="flex-shrink-0 sm:w-48">
            <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-medium">
              <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
              {dateStr}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[var(--color-text-secondary)] text-sm">
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
              {timeStr}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-[var(--color-border)]" />

          {/* Event & Invitee Info */}
          <div className="flex-1 min-w-0">
            {/* Event Type */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {booking.eventType.duration} min
              </span>
              <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                {booking.eventType.name}
              </h3>
            </div>

            {/* Invitee Details */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <User className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="truncate">{booking.inviteeName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Mail className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="truncate">{booking.inviteeEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
