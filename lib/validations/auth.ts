/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for signup, login, and username validation.
 * These schemas are used both client-side (form validation) and server-side.
 */

import { z } from "zod"

/**
 * Username validation rules (from .cursorrules Rule #5):
 * - Lowercase only
 * - Alphanumeric + hyphens
 * - 3-30 characters
 * - Cannot start or end with hyphen
 */
const usernameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    usernameRegex,
    "Username can only contain lowercase letters, numbers, and hyphens (cannot start or end with hyphen)"
  )
  .transform((val) => val.toLowerCase())

/**
 * Sign Up Schema
 * 
 * Validates:
 * - email: valid email format
 * - password: minimum 8 characters
 * - username: 3-30 chars, lowercase alphanumeric + hyphens
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  username: usernameSchema,
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Login Schema
 * 
 * Validates:
 * - email: valid email format
 * - password: non-empty
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Username check schema (for API validation)
 */
export const usernameCheckSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .transform((val) => val.toLowerCase()),
})
