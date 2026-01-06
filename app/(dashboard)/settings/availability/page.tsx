/**
 * Availability Settings Page
 * 
 * Server Component that fetches user availability and renders the form.
 * Includes timezone detection and selection.
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getAvailability } from "@/actions/availability"
import { AvailabilityForm } from "@/components/availability/availability-form"
import { TimezoneBanner } from "@/components/settings/timezone-banner"
import { TimezoneSelect } from "@/components/settings/timezone-select"

export default async function AvailabilitySettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const result = await getAvailability()

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load availability settings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Timezone Detection Banner (shows if timezone is default UTC) */}
      <TimezoneBanner currentTimezone={result.data.timezone} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Availability
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Set your weekly schedule for when you're available for meetings
          </p>
        </div>

        {/* Timezone Selector */}
        <TimezoneSelect currentTimezone={result.data.timezone} />
      </div>

      {/* Help Text */}
      <div className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] p-3 rounded-lg">
        <p>
          <strong>Note:</strong> All times are displayed in your selected timezone. 
          When someone books a meeting, they'll see the available times converted to their local timezone.
        </p>
      </div>

      {/* Form */}
      <AvailabilityForm 
        initialAvailability={result.data.availability}
        initialTimezone={result.data.timezone}
      />
    </div>
  )
}
