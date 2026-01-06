/**
 * Edit Event Form Component
 * 
 * Form for editing an existing event type.
 * Pre-fills with current event data.
 * Client Component with react-hook-form + Zod validation.
 */

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  updateEventTypeSchema,
  DURATION_OPTIONS,
  DURATION_LABELS,
  type UpdateEventTypeInput,
} from "@/lib/validations/events"
import { updateEventType, type EventType } from "@/actions/events"

interface EditEventFormProps {
  event: EventType
  onSuccess?: () => void
}

export function EditEventForm({ event, onSuccess }: EditEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateEventTypeInput>({
    resolver: zodResolver(updateEventTypeSchema),
    defaultValues: {
      id: event.id,
      name: event.name,
      duration: event.duration,
      description: event.description || "",
      location: event.location || "",
    },
  })

  const onSubmit = async (data: UpdateEventTypeInput) => {
    setIsSubmitting(true)

    try {
      const result = await updateEventType(data)

      if (!result.success) {
        toast.error(result.error || "Failed to update event type")
        return
      }

      toast.success("Event type updated successfully")
      onSuccess?.()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hidden ID field */}
      <input type="hidden" {...register("id")} />

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="edit-name">Event Name *</Label>
        <Input
          id="edit-name"
          placeholder="e.g., 30 Minute Meeting"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Duration Field */}
      <div className="space-y-2">
        <Label htmlFor="edit-duration">Duration *</Label>
        <Select
          defaultValue={event.duration.toString()}
          onValueChange={(value) => setValue("duration", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((duration) => (
              <SelectItem key={duration} value={duration.toString()}>
                {DURATION_LABELS[duration]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-sm text-destructive">{errors.duration.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          placeholder="Brief description of this event type..."
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Label htmlFor="edit-location">Location</Label>
        <Input
          id="edit-location"
          placeholder="e.g., Zoom, Google Meet, Phone"
          {...register("location")}
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
