/**
 * Bookings Page
 * 
 * Displays all upcoming bookings for the authenticated user (host).
 * Shows booking details including invitee info, date/time, and event type.
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUpcomingBookings } from "@/actions/booking"
import { BookingCard } from "@/components/bookings/booking-card"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarX } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BookingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const result = await getUpcomingBookings()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load bookings.</p>
      </div>
    )
  }

  const bookings = result.bookings

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Upcoming Bookings
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          View and manage your scheduled meetings
        </p>
      </div>

      {/* Bookings List or Empty State */}
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-[var(--color-text-muted)]/10 p-4 mb-6">
              <CalendarX className="h-12 w-12 text-[var(--color-text-muted)]" />
            </div>
            
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              No upcoming bookings
            </h2>
            
            <p className="text-[var(--color-text-secondary)] text-center max-w-md mb-6">
              When someone books a meeting with you, it will appear here.
              Share your booking link to start receiving appointments.
            </p>
            
            <Link href="/dashboard/events">
              <Button className="rounded-full">
                Manage Event Types
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Booking Count */}
          <p className="text-sm text-[var(--color-text-muted)]">
            {bookings.length} upcoming {bookings.length === 1 ? "booking" : "bookings"}
          </p>
          
          {/* Booking Cards */}
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
