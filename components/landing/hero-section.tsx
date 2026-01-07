"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Clock } from "lucide-react"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Background gradient shapes */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#0069FF] to-[#00D4FF] opacity-90" />
        <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#E040FB] to-[#FF4081] opacity-80" />
        <div className="absolute bottom-0 right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0069FF] opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left Column - Copy */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#0B3558] lg:text-7xl">
              Easy
              <br />
              scheduling
              <br />
              ahead
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#476482] lg:text-xl">
              Join 20 million professionals who easily book meetings with the #1
              scheduling tool.
            </p>

            {/* Signup Buttons */}
            <div className="mt-8 flex max-w-sm flex-col gap-3">
              <Button
                size="lg"
                className="h-14 w-full gap-3 rounded-md text-base font-medium"
                onClick={() => router.push("/signup")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full gap-3 rounded-md border-2 border-[#0B3558] text-base font-medium text-[#0B3558] hover:bg-gray-50"
                onClick={() => router.push("/signup")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M0 0h11.4v11.4H0z" />
                  <path fill="#00A4EF" d="M0 12.6h11.4V24H0z" />
                  <path fill="#7FBA00" d="M12.6 0H24v11.4H12.6z" />
                  <path fill="#FFB900" d="M12.6 12.6H24V24H12.6z" />
                </svg>
                Sign up with Microsoft
              </Button>
            </div>

            {/* Divider */}
            <div className="my-6 flex max-w-sm items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-medium text-[#667085]">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Email signup link */}
            <p className="text-sm text-[#476482]">
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up free with email.
              </Link>{" "}
              No credit card required
            </p>
          </div>

          {/* Right Column - Workflow Card */}
          <div className="relative flex-1">
            <div className="relative z-10 mx-auto max-w-lg rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
              <h3 className="mb-8 text-xl font-semibold text-[#0B3558] lg:text-2xl">
                Reduce no-shows and stay on track
              </h3>

              <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {/* Text Reminder Card */}
                <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-[#E8F4FD] px-3 py-1 text-xs font-medium text-primary">
                      Workflow
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F4FD]">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Clock className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <h4 className="mb-3 font-semibold text-[#0B3558]">
                    Send text reminder
                  </h4>
                  <div className="mb-3 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm text-[#476482]">
                    24 hours before event starts
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#476482]">
                    <div className="h-0.5 w-3 border-l border-dashed border-gray-300" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span className="text-[#476482]">Send text to invitees</span>
                  </div>
                </div>

                {/* Email Reminder Card */}
                <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-[#E8F4FD] px-3 py-1 text-xs font-medium text-primary">
                      Workflow
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F4FD]">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Clock className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <h4 className="mb-3 font-semibold text-[#0B3558]">
                    Send follow-up email
                  </h4>
                  <div className="mb-3 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm text-[#476482]">
                    2 hours after event ends
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#476482]">
                    <div className="h-0.5 w-3 border-l border-dashed border-gray-300" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-[#476482]">Send email to invitees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
