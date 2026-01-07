/**
 * Booking Confirmation Page
 * 
 * Displays booking details after successful booking creation.
 * Route: /[username]/[eventSlug]/confirmation?bookingId=xxx
 */

import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBookingById, validateBookingOwnership } from "@/lib/queries/booking"
import { BookingConfirmationDisplay } from "@/components/public/booking-confirmation"

interface ConfirmationPageProps {
  params: Promise<{
    username: string
    eventSlug: string
  }>
  searchParams: Promise<{
    bookingId?: string
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
  searchParams,
}: ConfirmationPageProps): Promise<Metadata> {
  const { username } = await params
  const { bookingId } = await searchParams

  if (!bookingId) {
    return {
      title: "Booking Not Found",
      description: "The requested booking could not be found.",
    }
  }

  const booking = await getBookingById(bookingId)

  if (!booking) {
    return {
      title: "Booking Not Found",
      description: "The requested booking could not be found.",
    }
  }

  const hostName = booking.host.name || booking.host.username || username

  return {
    title: `Confirmed: ${booking.eventType.name} with ${hostName}`,
    description: `Your meeting with ${hostName} is confirmed.`,
  }
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { username, eventSlug } = await params
  const { bookingId } = await searchParams

  // If no bookingId in URL, show 404
  if (!bookingId) {
    notFound()
  }

  // Fetch booking with event type and host data
  const booking = await getBookingById(bookingId)

  // If booking not found, show 404
  if (!booking) {
    notFound()
  }

  // Validate that booking belongs to this username/eventSlug
  // This prevents accessing other users' bookings via guessed IDs
  if (!validateBookingOwnership(booking, username, eventSlug)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href={`/${booking.host.username}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {booking.host.name || booking.host.username}
        </Link>

        {/* Confirmation Content */}
        <BookingConfirmationDisplay booking={booking} />

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
