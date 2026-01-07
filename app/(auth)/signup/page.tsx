/**
 * Sign Up Page
 * 
 * User registration form with:
 * - Email, password, username fields
 * - Real-time username availability check
 * - Form validation with react-hook-form + Zod
 * - Server action for user creation
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth"
import { signUp } from "@/actions/auth"

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  })

  const usernameValue = watch("username")

  // Debounced username availability check
  const checkUsername = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle")
      setUsernameMessage(null)
      return
    }

    setUsernameStatus("checking")
    setUsernameMessage(null)

    try {
      const response = await fetch(
        `/api/username/check?username=${encodeURIComponent(username)}`
      )
      const data = await response.json()

      if (data.available) {
        setUsernameStatus("available")
        setUsernameMessage("Username is available")
      } else {
        setUsernameStatus(data.message?.includes("format") ? "invalid" : "taken")
        setUsernameMessage(data.message || "Username is not available")
      }
    } catch {
      setUsernameStatus("idle")
      setUsernameMessage(null)
    }
  }, [])

  // Debounce username check (300ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (usernameValue) {
        checkUsername(usernameValue)
      } else {
        setUsernameStatus("idle")
        setUsernameMessage(null)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [usernameValue, checkUsername])

  const onSubmit = async (data: SignUpInput) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const result = await signUp(data)

      // If we get here without redirect, there was an error
      if (!result.success) {
        if (result.error) {
          setServerError(result.error)
        }
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            if (message) {
              setError(field as keyof SignUpInput, { message })
            }
          })
        }
      }
    } catch {
      // Redirect errors are expected on success
      // Any other error is unexpected
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUsernameIcon = () => {
    switch (usernameStatus) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      case "available":
        return <Check className="h-4 w-4 text-green-600" />
      case "taken":
      case "invalid":
        return <X className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {/* Calendly Logo */}
        <Link href="/" className="mx-auto mb-4 block">
          <Image
            src="/calendly-logo.png"
            alt="Calendly"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <CardTitle className="text-2xl font-bold text-[var(--color-text-primary)]">
          Create your account
        </CardTitle>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Get started with your scheduling link
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {serverError}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                autoComplete="username"
                {...register("username")}
                aria-invalid={!!errors.username}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getUsernameIcon()}
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              This will be your booking URL: calendly.com/
              <span className="font-medium">
                {usernameValue || "username"}
              </span>
            </p>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
            {!errors.username && usernameMessage && (
              <p
                className={`text-sm ${
                  usernameStatus === "available"
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {usernameMessage}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isSubmitting || usernameStatus === "taken" || usernameStatus === "invalid"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
