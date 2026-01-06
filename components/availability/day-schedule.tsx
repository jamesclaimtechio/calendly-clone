/**
 * Day Schedule Component
 * 
 * A single day row with toggle switch and time blocks.
 * Manages enabled/disabled state and multiple time blocks per day.
 */

"use client"

import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { TimeBlock } from "./time-block"
import { DAY_LABELS } from "@/lib/constants/availability"
import type { DayOfWeek, TimeBlock as TimeBlockType } from "@/lib/types/availability"

interface DayScheduleProps {
  day: DayOfWeek
  enabled: boolean
  blocks: TimeBlockType[]
  onToggle: (enabled: boolean) => void
  onBlockChange: (index: number, field: "start" | "end", value: string) => void
  onAddBlock: () => void
  onRemoveBlock: (index: number) => void
  errors?: Record<number, string>
}

export function DaySchedule({
  day,
  enabled,
  blocks,
  onToggle,
  onBlockChange,
  onAddBlock,
  onRemoveBlock,
  errors,
}: DayScheduleProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#E5E7EB] last:border-b-0">
      {/* Day Label + Toggle */}
      <div className="flex items-center gap-3 w-32 shrink-0">
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${DAY_LABELS[day]}`}
        />
        <span className={`text-sm font-medium ${enabled ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
          {DAY_LABELS[day]}
        </span>
      </div>

      {/* Time Blocks */}
      <div className="flex-1">
        {enabled ? (
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <TimeBlock
                key={index}
                index={index}
                start={block.start}
                end={block.end}
                onStartChange={(value) => onBlockChange(index, "start", value)}
                onEndChange={(value) => onBlockChange(index, "end", value)}
                onRemove={() => onRemoveBlock(index)}
                canRemove={blocks.length > 1}
                error={errors?.[index]}
              />
            ))}
            
            {/* Add Block Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddBlock}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add time block
            </Button>
          </div>
        ) : (
          <span className="text-sm text-[var(--color-text-muted)] italic">
            Unavailable
          </span>
        )}
      </div>
    </div>
  )
}
