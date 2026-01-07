/**
 * Event Booking Page
 * 
 * Public page for booking a specific event type.
 * Route: /[username]/[eventSlug]
 */

import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getEventTypeBySlug } from "@/lib/queries/public"
import { EventDetails } from "@/components/public/event-details"
import { BookingContainer } from "@/components/public/booking-container"
import { DURATION_LABELS, type DurationOption } from "@/lib/validations/events"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface EventPageProps {
  params: Promise<{
    username: string
    eventSlug: string
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { username, eventSlug } = await params
  const data = await getEventTypeBySlug(username, eventSlug)

  if (!data) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    }
  }

  const hostName = data.user.name || data.user.email.split("@")[0]
  const durationLabel =
    DURATION_LABELS[data.duration as DurationOption] ||
    `${data.duration} minutes`

  return {
    title: `${data.name} - ${hostName}`,
    description:
      data.description ||
      `Book a ${durationLabel} meeting with ${hostName}`,
  }
}

export default async function EventBookingPage({ params }: EventPageProps) {
  const { username, eventSlug } = await params
  
  // Fetch event type with host data
  const data = await getEventTypeBySlug(username, eventSlug)

  // If not found, event is deleted, or doesn't belong to user → 404
  if (!data) {
    notFound()
  }

  const { user: host, ...event } = data

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href={`/${host.username}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {host.name || host.username}
        </Link>

        {/* Main Content */}
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12">
          {/* Left Column: Event Details */}
          <div className="md:border-r md:border-[var(--color-border)] md:pr-8 lg:pr-12">
            <EventDetails event={event} host={host} />
          </div>

          {/* Right Column: Booking (Calendar + Slots) */}
          <div>
            <BookingContainer
              username={host.username || username}
              eventSlug={event.slug}
              eventTypeId={event.id}
              eventName={event.name}
              eventDuration={event.duration}
              hostName={host.name || host.email.split("@")[0]}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Powered by{" "}
            <span className="font-medium text-[var(--color-primary)]">
              Calendly Clone
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
