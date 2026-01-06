/**
 * Events Page
 * 
 * Lists all event types for the authenticated user.
 * Server Component for data fetching.
 */

import { Plus } from "lucide-react"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getEventTypes } from "@/actions/events"
import { Button } from "@/components/ui/button"
import { EventList } from "@/components/events/event-list"
import { CreateEventDialog } from "@/components/events/create-event-dialog"
import { EventsEmptyStateClient } from "./events-empty-state-client"

export default async function EventsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const result = await getEventTypes()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load event types.</p>
      </div>
    )
  }

  const events = result.data || []
  const username = session.user.username || session.user.email?.split("@")[0] || "user"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Event Types
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Create and manage your scheduling links
          </p>
        </div>

        {events.length > 0 && (
          <CreateEventDialog>
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              New Event Type
            </Button>
          </CreateEventDialog>
        )}
      </div>

      {/* Content */}
      {events.length === 0 ? (
        <EventsEmptyStateClient />
      ) : (
        <EventList events={events} username={username} />
      )}
    </div>
  )
}
