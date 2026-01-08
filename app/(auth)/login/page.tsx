/**
 * Login Page
 * 
 * User authentication form with:
 * - Email and password fields
 * - Form validation with react-hook-form + Zod
 * - Generic error message for security
 * - Link to signup page
 * - DOM value sync for browser automation compatibility
 */

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Changed from onBlur for better reactivity
  })

  // Register fields and get their refs
  const emailRegister = register("email")
  const passwordRegister = register("password")
  
  // Refs for DOM value sync (browser automation compatibility)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  // Sync DOM values with form state before submission
  // This fixes browser automation compatibility issues
  const syncDOMValues = useCallback(() => {
    if (emailRef.current?.value) {
      setValue("email", emailRef.current.value, { shouldValidate: true })
    }
    if (passwordRef.current?.value) {
      setValue("password", passwordRef.current.value, { shouldValidate: true })
    }
  }, [setValue])

  // Add native input listeners for browser automation compatibility
  useEffect(() => {
    const handleInput = (field: "email" | "password") => (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value) {
        setValue(field, target.value, { shouldValidate: true })
      }
    }

    const emailEl = emailRef.current
    const passwordEl = passwordRef.current
    
    const emailHandler = handleInput("email")
    const passwordHandler = handleInput("password")

    emailEl?.addEventListener("input", emailHandler)
    passwordEl?.addEventListener("input", passwordHandler)

    return () => {
      emailEl?.removeEventListener("input", emailHandler)
      passwordEl?.removeEventListener("input", passwordHandler)
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const result = await login(data)

      // If we get here without redirect, there was an error
      if (!result.success && result.error) {
        setServerError(result.error)
      }
    } catch {
      // Redirect errors are expected on success
      // Any other error is unexpected
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Custom submit handler that syncs DOM values first
  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    syncDOMValues()
    // Small delay to allow state update before validation
    await new Promise(resolve => setTimeout(resolve, 10))
    handleSubmit(onSubmit)(e)
  }, [syncDOMValues, handleSubmit])

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
          Welcome back
        </CardTitle>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Sign in to your account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
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
              name={emailRegister.name}
              onChange={emailRegister.onChange}
              onBlur={emailRegister.onBlur}
              ref={(e) => {
                emailRegister.ref(e)
                emailRef.current = e
              }}
              aria-invalid={!!errors.email}
              data-testid="email-input"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              name={passwordRegister.name}
              onChange={passwordRegister.onChange}
              onBlur={passwordRegister.onBlur}
              ref={(e) => {
                passwordRegister.ref(e)
                passwordRef.current = e
              }}
              aria-invalid={!!errors.password}
              data-testid="password-input"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* Signup Link */}
          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
