"use client"

/**
 * Timezone Selector Component
 * 
 * Dropdown for invitees to select their timezone.
 * Auto-detects browser timezone on mount.
 */

import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTimezonesByRegion, formatTimezoneLabel } from "@/lib/timezone"

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const timezonesByRegion = getTimezonesByRegion()
  
  // Sort regions alphabetically, but put common ones first
  const priorityRegions = ["America", "Europe", "Asia", "Australia", "Pacific"]
  const sortedRegions = Object.keys(timezonesByRegion).sort((a, b) => {
    const aIndex = priorityRegions.indexOf(a)
    const bIndex = priorityRegions.indexOf(b)
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-[var(--color-text-muted)]" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[280px] text-sm border-[var(--color-border)]">
          <SelectValue placeholder="Select timezone">
            {formatTimezoneLabel(value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {sortedRegions.map((region) => (
            <SelectGroup key={region}>
              <SelectLabel className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                {region}
              </SelectLabel>
              {timezonesByRegion[region].map((tz) => (
                <SelectItem key={tz.value} value={tz.value} className="text-sm">
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
