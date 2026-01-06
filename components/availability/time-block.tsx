/**
 * Time Block Component
 * 
 * A single time block with start and end time inputs.
 * Used within DaySchedule for each available time period.
 */

"use client"

import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TimeBlockProps {
  index: number
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onRemove: () => void
  canRemove: boolean
  error?: string
}

export function TimeBlock({
  index,
  start,
  end,
  onStartChange,
  onEndChange,
  onRemove,
  canRemove,
  error,
}: TimeBlockProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Input
          type="time"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-32"
          aria-label={`Start time for block ${index + 1}`}
        />
        <span className="text-[var(--color-text-muted)]">to</span>
        <Input
          type="time"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-32"
          aria-label={`End time for block ${index + 1}`}
        />
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-[var(--color-text-muted)] hover:text-destructive"
            aria-label="Remove time block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
