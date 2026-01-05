/**
 * Dashboard Home Page
 * 
 * Main landing page for authenticated users.
 * Displays welcome message and will show event types in future modules.
 */

import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Link as LinkIcon } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  // Get display name: prefer name, fallback to username, then email
  const displayName = session?.user?.name 
    || session?.user?.username 
    || session?.user?.email?.split("@")[0] 
    || "there"

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

      {/* Quick Stats (Placeholder) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
              Event Types
            </CardTitle>
            <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">0</div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Create your first event type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
              Upcoming Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">0</div>
            <p className="text-xs text-[var(--color-text-muted)]">
              No upcoming meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
              Your Booking Link
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[var(--color-primary)] truncate">
              calendly.com/{session?.user?.username || "username"}
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Share with others
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Event Types List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
            Your Event Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No event types yet</p>
            <p className="text-sm">Create your first event type to start accepting bookings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
