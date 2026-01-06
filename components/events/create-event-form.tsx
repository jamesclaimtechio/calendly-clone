/**
 * Create Event Form Component
 * 
 * Form for creating a new event type.
 * Client Component with react-hook-form + Zod validation.
 */

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

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
  createEventTypeSchema,
  DURATION_OPTIONS,
  DURATION_LABELS,
  type CreateEventTypeInput,
} from "@/lib/validations/events"
import { createEventType } from "@/actions/events"

interface CreateEventFormProps {
  onSuccess?: () => void
}

export function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateEventTypeInput>({
    resolver: zodResolver(createEventTypeSchema),
    defaultValues: {
      name: "",
      duration: 30,
      description: "",
      location: "",
    },
  })

  const onSubmit = async (data: CreateEventTypeInput) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const result = await createEventType(data)

      if (!result.success) {
        setServerError(result.error || "Failed to create event type")
        return
      }

      // Success - reset form and notify parent
      reset()
      onSuccess?.()
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {serverError}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Event Name *</Label>
        <Input
          id="name"
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
        <Label htmlFor="duration">Duration *</Label>
        <Select
          defaultValue="30"
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
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
            Creating...
          </>
        ) : (
          "Create Event Type"
        )}
      </Button>
    </form>
  )
}
