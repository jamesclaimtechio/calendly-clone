/**
 * Availability Form Component
 * 
 * Main form for editing weekly availability schedule.
 * Uses local state for form management and calls server action on save.
 */

"use client"

import { useState, useMemo } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DaySchedule } from "./day-schedule"
import { updateAvailability } from "@/actions/availability"
import { DAYS_OF_WEEK, DEFAULT_TIME_BLOCK } from "@/lib/constants/availability"
import type { 
  WeeklyAvailability, 
  DayOfWeek, 
  TimeBlock as TimeBlockType 
} from "@/lib/types/availability"

interface AvailabilityFormProps {
  initialAvailability: WeeklyAvailability
  initialTimezone: string
}

// Helper to convert time string to minutes for comparison
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Validate a single time block
function validateBlock(block: TimeBlockType): string | undefined {
  if (timeToMinutes(block.end) <= timeToMinutes(block.start)) {
    return "End time must be after start time"
  }
  return undefined
}

export function AvailabilityForm({ 
  initialAvailability,
  initialTimezone: _initialTimezone, // Timezone handled in Chunk 4.3
}: AvailabilityFormProps) {
  const [availability, setAvailability] = useState<WeeklyAvailability>(initialAvailability)
  const [isSaving, setIsSaving] = useState(false)

  // Check if all days are disabled
  const allDaysDisabled = useMemo(() => {
    return DAYS_OF_WEEK.every((day) => availability[day] === null)
  }, [availability])

  // Validate all blocks and collect errors
  const errors = useMemo(() => {
    const result: Record<DayOfWeek, Record<number, string>> = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {},
    }

    DAYS_OF_WEEK.forEach((day) => {
      const blocks = availability[day]
      if (blocks) {
        blocks.forEach((block, index) => {
          const error = validateBlock(block)
          if (error) {
            result[day][index] = error
          }
        })
      }
    })

    return result
  }, [availability])

  // Check if form has validation errors
  const hasErrors = useMemo(() => {
    return DAYS_OF_WEEK.some((day) => Object.keys(errors[day]).length > 0)
  }, [errors])

  // Toggle day on/off
  const handleToggle = (day: DayOfWeek, enabled: boolean) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: enabled ? [{ ...DEFAULT_TIME_BLOCK }] : null,
    }))
  }

  // Update a specific block field
  const handleBlockChange = (
    day: DayOfWeek,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setAvailability((prev) => {
      const blocks = prev[day]
      if (!blocks) return prev

      const newBlocks = [...blocks]
      newBlocks[index] = { ...newBlocks[index], [field]: value }

      return {
        ...prev,
        [day]: newBlocks,
      }
    })
  }

  // Add a new time block to a day
  const handleAddBlock = (day: DayOfWeek) => {
    setAvailability((prev) => {
      const blocks = prev[day]
      if (!blocks) return prev

      return {
        ...prev,
        [day]: [...blocks, { ...DEFAULT_TIME_BLOCK }],
      }
    })
  }

  // Remove a time block from a day
  const handleRemoveBlock = (day: DayOfWeek, index: number) => {
    setAvailability((prev) => {
      const blocks = prev[day]
      if (!blocks || blocks.length <= 1) return prev

      const newBlocks = blocks.filter((_, i) => i !== index)

      return {
        ...prev,
        [day]: newBlocks,
      }
    })
  }

  // Save the availability
  const handleSave = async () => {
    if (hasErrors) {
      toast.error("Please fix validation errors before saving")
      return
    }

    setIsSaving(true)
    const result = await updateAvailability(availability)
    setIsSaving(false)

    if (result.success) {
      toast.success("Availability saved successfully!")
    } else {
      toast.error(result.error || "Failed to save availability")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning when all days disabled */}
        {allDaysDisabled && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              You have no available times set. No one will be able to book meetings with you.
            </p>
          </div>
        )}

        {/* Day Schedules */}
        <div className="divide-y divide-[#E5E7EB]">
          {DAYS_OF_WEEK.map((day) => {
            const blocks = availability[day]
            const enabled = blocks !== null

            return (
              <DaySchedule
                key={day}
                day={day}
                enabled={enabled}
                blocks={enabled ? blocks : []}
                onToggle={(value) => handleToggle(day, value)}
                onBlockChange={(index, field, value) =>
                  handleBlockChange(day, index, field, value)
                }
                onAddBlock={() => handleAddBlock(day)}
                onRemoveBlock={(index) => handleRemoveBlock(day, index)}
                errors={errors[day]}
              />
            )
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || hasErrors}
            className="rounded-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
