/**
 * Timezone Detection Banner
 * 
 * Shows when user's timezone is set to default "UTC".
 * Prompts user to confirm or change their detected timezone.
 */

"use client"

import { useState, useEffect } from "react"
import { Globe, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { updateTimezone } from "@/actions/availability"
import { detectBrowserTimezone, formatTimezoneLabel } from "@/lib/timezone"

interface TimezoneBannerProps {
  currentTimezone: string
  onTimezoneConfirmed?: (timezone: string) => void
}

export function TimezoneBanner({ 
  currentTimezone,
  onTimezoneConfirmed,
}: TimezoneBannerProps) {
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Detect browser timezone on mount
  useEffect(() => {
    const detected = detectBrowserTimezone()
    setDetectedTimezone(detected)
  }, [])

  // Don't show if:
  // - Already dismissed
  // - Timezone is not default UTC
  // - Detected timezone is same as current
  // - Still detecting
  if (
    isDismissed ||
    currentTimezone !== "UTC" ||
    !detectedTimezone ||
    detectedTimezone === currentTimezone
  ) {
    return null
  }

  const handleConfirm = async () => {
    if (!detectedTimezone) return

    setIsSaving(true)
    const result = await updateTimezone(detectedTimezone)
    setIsSaving(false)

    if (result.success) {
      toast.success("Timezone updated successfully!")
      onTimezoneConfirmed?.(detectedTimezone)
      setIsDismissed(true)
    } else {
      toast.error(result.error || "Failed to update timezone")
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--color-primary)]/10 rounded-full">
          <Globe className="h-5 w-5 text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            We detected your timezone
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Is <span className="font-medium">{formatTimezoneLabel(detectedTimezone)}</span> correct?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          disabled={isSaving}
          className="text-[var(--color-text-secondary)]"
        >
          <X className="h-4 w-4 mr-1" />
          No, I'll choose
        </Button>
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={isSaving}
          className="rounded-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Yes, use this
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
