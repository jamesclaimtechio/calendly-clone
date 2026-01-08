/**
 * Create Event Form Component
 * 
 * Form for creating a new event type.
 * Client Component with react-hook-form + Zod validation.
 * Includes DOM value sync for browser automation compatibility.
 */

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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
    mode: "onChange", // Changed for better reactivity
    defaultValues: {
      name: "",
      duration: 30,
      description: "",
      location: "",
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
    const handleInput = (field: keyof CreateEventTypeInput) => (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      setValue(field, field === "duration" ? parseInt(target.value) : target.value, { shouldValidate: true })
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

  const onFormSubmit = async (data: CreateEventTypeInput) => {
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
          name={nameRegister.name}
          onChange={nameRegister.onChange}
          onBlur={nameRegister.onBlur}
          ref={(e) => {
            nameRegister.ref(e)
            nameRef.current = e
          }}
          aria-invalid={!!errors.name}
          data-testid="event-name-input"
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
          <SelectTrigger data-testid="event-duration-select">
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
          name={descriptionRegister.name}
          onChange={descriptionRegister.onChange}
          onBlur={descriptionRegister.onBlur}
          ref={(e) => {
            descriptionRegister.ref(e)
            descriptionRef.current = e
          }}
          aria-invalid={!!errors.description}
          data-testid="event-description-input"
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
          name={locationRegister.name}
          onChange={locationRegister.onChange}
          onBlur={locationRegister.onBlur}
          ref={(e) => {
            locationRegister.ref(e)
            locationRef.current = e
          }}
          aria-invalid={!!errors.location}
          data-testid="event-location-input"
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
