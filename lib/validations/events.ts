/**
 * Event Type Validation Schemas
 * 
 * Zod schemas for validating event type data.
 * Used by server actions and forms.
 */

import { z } from "zod"

/**
 * Available duration options (in minutes)
 * Shared between validation and UI components
 */
export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const

export type DurationOption = (typeof DURATION_OPTIONS)[number]

/**
 * Duration display labels for UI
 */
export const DURATION_LABELS: Record<DurationOption, string> = {
  15: "15 minutes",
  30: "30 minutes",
  45: "45 minutes",
  60: "1 hour",
  90: "1.5 hours",
  120: "2 hours",
}

/**
 * Schema for creating a new event type
 */
export const createEventTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  duration: z
    .number()
    .refine(
      (val) => DURATION_OPTIONS.includes(val as DurationOption),
      { message: "Please select a valid duration" }
    ),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(200, "Location must be 200 characters or less")
    .optional()
    .nullable(),
})

export type CreateEventTypeInput = z.input<typeof createEventTypeSchema>

/**
 * Schema for updating an existing event type
 * All fields optional except id
 */
export const updateEventTypeSchema = z.object({
  id: z.string().min(1, "Event type ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    )
    .optional(),
  duration: z
    .number()
    .refine(
      (val) => DURATION_OPTIONS.includes(val as DurationOption),
      { message: "Please select a valid duration" }
    )
    .optional(),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(200, "Location must be 200 characters or less")
    .optional()
    .nullable(),
})

export type UpdateEventTypeInput = z.input<typeof updateEventTypeSchema>
