/**
 * Dashboard Home Page
 * 
 * Main landing page for authenticated users.
 * Displays welcome message and quick overview.
 */

import { auth } from "@/lib/auth"
import { getEventTypes } from "@/actions/events"
import { getUpcomingBookings } from "@/actions/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Link as LinkIcon, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  
  // Get display name: prefer name, fallback to username, then email
  const displayName = session?.user?.name 
    || session?.user?.username 
    || session?.user?.email?.split("@")[0] 
    || "there"

  // Fetch event types count and upcoming bookings in parallel
  const [eventsResult, bookingsResult] = await Promise.all([
    getEventTypes(),
    getUpcomingBookings(),
  ])
  
  const eventCount = eventsResult.success ? (eventsResult.data?.length || 0) : 0
  const bookingCount = bookingsResult.success ? bookingsResult.count : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Welcome, {displayName}!
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Manage your scheduling links and bookings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/events">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
                Event Types
              </CardTitle>
              <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{eventCount}</div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {eventCount === 0 ? "Create your first event type" : "Manage your event types"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bookings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
                Upcoming Bookings
              </CardTitle>
              <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{bookingCount}</div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {bookingCount === 0 ? "No upcoming meetings" : `${bookingCount} upcoming meeting${bookingCount === 1 ? "" : "s"}`}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
              Your Booking Link
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[var(--color-primary)] truncate">
              /{session?.user?.username || "username"}
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Share with others
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/events">
            <Button className="rounded-full">
              {eventCount === 0 ? "Create your first event type" : "Manage Event Types"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
