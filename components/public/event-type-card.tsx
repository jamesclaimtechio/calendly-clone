/**
 * Public Event Type Card
 * 
 * Displays an event type as a clickable card on the host's public profile.
 * Links to the booking page for that event type.
 */

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DURATION_LABELS, type DurationOption } from "@/lib/validations/events"
import type { PublicEventType } from "@/lib/queries/public"

interface EventTypeCardProps {
  event: PublicEventType
  username: string
}

export function EventTypeCard({ event, username }: EventTypeCardProps) {
  const durationLabel = 
    DURATION_LABELS[event.duration as DurationOption] || 
    `${event.duration} minutes`

  return (
    <Link href={`/${username}/${event.slug}`}>
      <Card className="group hover:shadow-md hover:border-[var(--color-primary)] transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {/* Event Name */}
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {event.name}
              </h3>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Clock className="h-4 w-4" />
                <span>{durationLabel}</span>
              </div>

              {/* Description (if present) */}
              {event.description && (
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>

            {/* Arrow indicator */}
            <ArrowRight className="h-5 w-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
