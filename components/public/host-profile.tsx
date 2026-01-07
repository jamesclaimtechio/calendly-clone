/**
 * Host Profile Component
 * 
 * Displays host information and their available event types.
 * Used on the public /[username] page.
 */

import { Calendar, User } from "lucide-react"
import { EventTypeCard } from "./event-type-card"
import type { PublicHost, PublicEventType } from "@/lib/queries/public"

interface HostProfileProps {
  host: PublicHost
  eventTypes: PublicEventType[]
}

export function HostProfile({ host, eventTypes }: HostProfileProps) {
  // Display name: prefer name, fallback to email username
  const displayName = host.name || host.email.split("@")[0]

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Host Header */}
      <div className="text-center mb-10">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <User className="h-10 w-10 text-[var(--color-primary)]" />
        </div>

        {/* Host Name */}
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {displayName}
        </h1>

        {/* Subtitle */}
        <p className="text-[var(--color-text-secondary)] mt-1">
          Select an event to schedule a meeting
        </p>
      </div>

      {/* Event Types List */}
      {eventTypes.length > 0 ? (
        <div className="space-y-4">
          {eventTypes.map((event) => (
            <EventTypeCard
              key={event.id}
              event={event}
              username={host.username}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-[var(--color-bg-tertiary)] rounded-lg">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)] opacity-50" />
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
            No booking options available
          </h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            This user hasn't set up any event types yet.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Powered by{" "}
          <span className="font-medium text-[var(--color-primary)]">
            Calendly Clone
          </span>
        </p>
      </div>
    </div>
  )
}
