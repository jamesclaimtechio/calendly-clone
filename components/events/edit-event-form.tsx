/**
 * Edit Event Form Component
 * 
 * Form for editing an existing event type.
 * Pre-fills with current event data.
 * Client Component with react-hook-form + Zod validation.
 * Includes DOM value sync for browser automation compatibility.
 */

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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
    mode: "onChange", // Changed for better reactivity
    defaultValues: {
      id: event.id,
      name: event.name,
      duration: event.duration,
      description: event.description || "",
      location: event.location || "",
    },
  })

  // Register fields and get their refs
  const nameRegister = register("name")
  const descriptionRegister = register("description")
  const locationRegister = register("location")
  
  // Refs for DOM value sync (browser automation compatibility)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  const locationRef = useRef<HTMLInputElement | null>(null)

  // Sync DOM values with form state before submission
  const syncDOMValues = useCallback(() => {
    if (nameRef.current?.value) {
      setValue("name", nameRef.current.value, { shouldValidate: true })
    }
    if (descriptionRef.current?.value !== undefined) {
      setValue("description", descriptionRef.current.value, { shouldValidate: true })
    }
    if (locationRef.current?.value !== undefined) {
      setValue("location", locationRef.current.value, { shouldValidate: true })
    }
  }, [setValue])

  // Add native input listeners for browser automation compatibility
  useEffect(() => {
    const handleInput = (field: "name" | "description" | "location") => (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      setValue(field, target.value, { shouldValidate: true })
    }

    const nameEl = nameRef.current
    const descriptionEl = descriptionRef.current
    const locationEl = locationRef.current
    
    const nameHandler = handleInput("name")
    const descriptionHandler = handleInput("description")
    const locationHandler = handleInput("location")

    nameEl?.addEventListener("input", nameHandler)
    descriptionEl?.addEventListener("input", descriptionHandler)
    locationEl?.addEventListener("input", locationHandler)

    return () => {
      nameEl?.removeEventListener("input", nameHandler)
      descriptionEl?.removeEventListener("input", descriptionHandler)
      locationEl?.removeEventListener("input", locationHandler)
    }
  }, [setValue])

  const onFormSubmit = async (data: UpdateEventTypeInput) => {
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

  // Custom submit handler that syncs DOM values first
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    syncDOMValues()
    // Small delay to allow state update before validation
    await new Promise(resolve => setTimeout(resolve, 10))
    handleSubmit(onFormSubmit)(e)
  }, [syncDOMValues, handleSubmit])

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Hidden ID field */}
      <input type="hidden" {...register("id")} />

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="edit-name">Event Name *</Label>
        <Input
          id="edit-name"
          placeholder="e.g., 30 Minute Meeting"
          name={nameRegister.name}
          onChange={nameRegister.onChange}
          onBlur={nameRegister.onBlur}
          ref={(e) => {
            nameRegister.ref(e)
            nameRef.current = e
          }}
          defaultValue={event.name}
          aria-invalid={!!errors.name}
          data-testid="edit-event-name-input"
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
          <SelectTrigger data-testid="edit-event-duration-select">
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
          name={descriptionRegister.name}
          onChange={descriptionRegister.onChange}
          onBlur={descriptionRegister.onBlur}
          ref={(e) => {
            descriptionRegister.ref(e)
            descriptionRef.current = e
          }}
          defaultValue={event.description || ""}
          aria-invalid={!!errors.description}
          data-testid="edit-event-description-input"
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
          name={locationRegister.name}
          onChange={locationRegister.onChange}
          onBlur={locationRegister.onBlur}
          ref={(e) => {
            locationRegister.ref(e)
            locationRef.current = e
          }}
          defaultValue={event.location || ""}
          aria-invalid={!!errors.location}
          data-testid="edit-event-location-input"
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
