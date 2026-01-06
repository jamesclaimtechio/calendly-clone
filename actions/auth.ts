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
import { signIn, signOut } from "@/lib/auth"
import { signUpSchema, loginSchema, type SignUpInput, type LoginInput } from "@/lib/validations/auth"
import { DEFAULT_AVAILABILITY, DEFAULT_TIMEZONE } from "@/lib/constants/availability"

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

    // 5. Create user with default availability and timezone
    await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        availability: DEFAULT_AVAILABILITY as object,
        timezone: DEFAULT_TIMEZONE,
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

/**
 * Login Action Result
 */
type LoginResult = {
  success: boolean
  error?: string
}

/**
 * Login Action
 * 
 * Authenticates a user with email and password.
 * 
 * SECURITY: Always returns generic "Invalid email or password" error
 * to prevent user enumeration attacks.
 * 
 * Flow:
 * 1. Validate input with Zod
 * 2. Call signIn("credentials") with redirect: false
 * 3. Handle errors with generic message
 * 4. Redirect to dashboard on success
 */
export async function login(input: LoginInput): Promise<LoginResult> {
  try {
    // 1. Validate input
    const validationResult = loginSchema.safeParse(input)
    
    if (!validationResult.success) {
      // Return generic error for invalid input
      return { 
        success: false, 
        error: "Please enter a valid email and password" 
      }
    }

    const { email, password } = validationResult.data

    // 2. Call signIn with redirect: false to handle manually
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

  } catch (error) {
    // 3. Handle AuthError - return generic message for security
    if (error instanceof AuthError) {
      // SECURITY: Never reveal which field is wrong
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    // Re-throw NEXT_REDIRECT errors (these are expected on success)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    console.error("Login error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }

  // 4. Redirect to dashboard on success
  redirect("/dashboard")
}

/**
 * Logout Action
 * 
 * Clears the user session and redirects to login page.
 * Called from dashboard via form action.
 */
export async function logout() {
  await signOut({ redirectTo: "/login" })
}
