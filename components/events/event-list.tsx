/**
 * Event List Component
 * 
 * Displays a grid of event type cards.
 * Server Component - receives data from parent.
 */

import { EventCard } from "./event-card"
import type { EventType } from "@/actions/events"

interface EventListProps {
  events: EventType[]
  username: string
}

export function EventList({ events, username }: EventListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} username={username} />
      ))}
    </div>
  )
}
