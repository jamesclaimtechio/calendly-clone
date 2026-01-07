/**
 * Event Details Component
 * 
 * Displays event information on the booking page.
 * Shows event name, duration, description, location, and host name.
 */

import { Clock, MapPin, User } from "lucide-react"
import { DURATION_LABELS, type DurationOption } from "@/lib/validations/events"
import type { PublicHost, PublicEventType } from "@/lib/queries/public"

interface EventDetailsProps {
  event: PublicEventType
  host: PublicHost
}

export function EventDetails({ event, host }: EventDetailsProps) {
  // Display name: prefer name, fallback to email username
  const displayName = host.name || host.email.split("@")[0]
  
  // Get duration label or format custom duration
  const durationLabel = 
    DURATION_LABELS[event.duration as DurationOption] || 
    `${event.duration} minutes`

  return (
    <div className="space-y-6">
      {/* Host Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {displayName}
          </p>
        </div>
      </div>

      {/* Event Name */}
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        {event.name}
      </h1>

      {/* Duration */}
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        <Clock className="h-5 w-5 flex-shrink-0" />
        <span>{durationLabel}</span>
      </div>

      {/* Location (optional) */}
      {event.location && (
        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <span>{event.location}</span>
        </div>
      )}

      {/* Description (optional) */}
      {event.description && (
        <div className="pt-4 border-t border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {event.description}
          </p>
        </div>
      )}
    </div>
  )
}
