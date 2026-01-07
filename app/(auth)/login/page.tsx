/**
 * Login Page
 * 
 * User authentication form with:
 * - Email and password fields
 * - Form validation with react-hook-form + Zod
 * - Generic error message for security
 * - Link to signup page
 */

"use client"

import { useState } from "react"
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
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
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
