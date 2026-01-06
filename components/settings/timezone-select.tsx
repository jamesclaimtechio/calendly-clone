/**
 * Timezone Select Component
 * 
 * Dropdown selector for user timezone with region grouping.
 * Auto-saves on change via server action.
 */

"use client"

import { useState, useMemo } from "react"
import { Globe, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateTimezone } from "@/actions/availability"
import { getTimezonesByRegion, formatTimezoneLabel } from "@/lib/timezone"

interface TimezoneSelectProps {
  currentTimezone: string
  onTimezoneChange?: (timezone: string) => void
}

export function TimezoneSelect({ 
  currentTimezone,
  onTimezoneChange,
}: TimezoneSelectProps) {
  const [timezone, setTimezone] = useState(currentTimezone)
  const [isSaving, setIsSaving] = useState(false)

  // Get timezones grouped by region
  const timezonesByRegion = useMemo(() => getTimezonesByRegion(), [])

  // Sort regions for consistent display
  const sortedRegions = useMemo(() => {
    return Object.keys(timezonesByRegion).sort()
  }, [timezonesByRegion])

  const handleChange = async (newTimezone: string) => {
    setTimezone(newTimezone)
    setIsSaving(true)

    const result = await updateTimezone(newTimezone)

    setIsSaving(false)

    if (result.success) {
      toast.success("Timezone updated successfully!")
      onTimezoneChange?.(newTimezone)
    } else {
      // Revert on error
      setTimezone(currentTimezone)
      toast.error(result.error || "Failed to update timezone")
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">Timezone:</span>
      </div>

      <Select value={timezone} onValueChange={handleChange} disabled={isSaving}>
        <SelectTrigger className="w-[320px]">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select timezone">
              {formatTimezoneLabel(timezone)}
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {sortedRegions.map((region) => (
            <SelectGroup key={region}>
              <SelectLabel className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                {region}
              </SelectLabel>
              {timezonesByRegion[region].map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
