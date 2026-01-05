/**
 * Authentication Server Actions
 * 
 * Server actions for signup and login flows.
 * These run on the server and handle database operations.
 */

"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { AuthError } from "next-auth"

import { db } from "@/lib/db"
import { signIn } from "@/lib/auth"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth"

/**
 * Default availability for new users
 * Mon-Fri 9:00-17:00, weekends disabled
 */
const DEFAULT_AVAILABILITY = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "09:00", end: "17:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" },
}

/**
 * Action result type for consistent error handling
 */
type ActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof SignUpInput, string>>
}

/**
 * Sign Up Action
 * 
 * Creates a new user account and automatically signs them in.
 * 
 * Flow:
 * 1. Validate input with Zod
 * 2. Check email uniqueness
 * 3. Check username uniqueness
 * 4. Hash password with bcrypt (10 rounds)
 * 5. Create user with default availability
 * 6. Auto sign-in
 * 7. Redirect to dashboard
 */
export async function signUp(input: SignUpInput): Promise<ActionResult> {
  try {
    // 1. Validate input
    const validationResult = signUpSchema.safeParse(input)
    
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof SignUpInput, string>> = {}
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as keyof SignUpInput
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      return { success: false, fieldErrors }
    }

    const { email, password, username } = validationResult.data

    // 2. Check email uniqueness
    const existingEmail = await db.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingEmail) {
      return {
        success: false,
        fieldErrors: { email: "This email is already in use" },
      }
    }

    // 3. Check username uniqueness
    const existingUsername = await db.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (existingUsername) {
      return {
        success: false,
        fieldErrors: { username: "This username is already taken" },
      }
    }

    // 4. Hash password with bcrypt (10 rounds per .cursorrules Rule #6)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. Create user with default availability
    await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        availability: DEFAULT_AVAILABILITY,
      },
    })

    // 6. Auto sign-in
    // Use try-catch for signIn as it throws on redirect
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
    } catch (error) {
      // signIn throws NEXT_REDIRECT on success, which is expected
      if (error instanceof AuthError) {
        return {
          success: false,
          error: "Failed to sign in after registration. Please try logging in.",
        }
      }
      throw error
    }

  } catch (error) {
    // Handle Prisma unique constraint violation (race condition)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const target = (error as { meta?: { target?: string[] } }).meta?.target
      if (target?.includes("email")) {
        return {
          success: false,
          fieldErrors: { email: "This email is already in use" },
        }
      }
      if (target?.includes("username")) {
        return {
          success: false,
          fieldErrors: { username: "This username is already taken" },
        }
      }
    }

    console.error("Sign up error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }

  // 7. Redirect to dashboard (outside try-catch to allow redirect to work)
  redirect("/dashboard")
}
