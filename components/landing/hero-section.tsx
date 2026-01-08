"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, Video, ChevronLeft, ChevronRight, Globe } from "lucide-react"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20">
      {/* Background gradient shapes - positioned on right side */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[60%] overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#0069FF] to-[#00D4FF] opacity-90 md:h-[600px] md:w-[600px]" />
        <div className="absolute right-10 top-32 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-[#E040FB] to-[#FF4081] opacity-85 md:h-[450px] md:w-[450px]" />
        <div className="absolute -bottom-10 right-40 h-[280px] w-[280px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#0069FF] opacity-75 md:h-[350px] md:w-[350px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          {/* Left Column - Copy */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0B3558] sm:text-5xl md:text-6xl lg:text-7xl">
              Easy
              <br />
              scheduling
              <br />
              ahead
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#476482] sm:text-lg md:text-xl">
              Join 20 million professionals who easily book meetings with the #1
              scheduling tool.
            </p>

            {/* Signup Buttons */}
            <div className="mt-8 flex max-w-sm flex-col gap-3">
              <Button
                size="lg"
                className="h-14 w-full gap-3 rounded-lg text-base font-medium"
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
                className="h-14 w-full gap-3 rounded-lg border-2 border-[#0B3558] text-base font-medium text-[#0B3558] hover:bg-gray-50"
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
                className="font-medium text-primary underline hover:no-underline"
              >
                Sign up free with email.
              </Link>{" "}
              No credit card required
            </p>
          </div>

          {/* Right Column - Mock Booking Interface */}
          <div className="flex-1">
            <MockBookingCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function MockBookingCard() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const calendarDays = [
    [30, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 1, 2, 3],
  ]
  const availableDays = [16, 17, 18, 19, 22, 23, 24, 25, 30, 31]
  const selectedDay = 22

  const timeSlots = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"]
  const selectedTime = "11:00am"

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur-sm md:p-6">
      <h3 className="mb-5 text-lg font-semibold text-[#0B3558] md:text-xl">
        Share your booking page
      </h3>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        {/* Left Panel - Event Details */}
        <div className="flex-shrink-0 border-b pb-4 sm:w-36 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
          {/* Company Logo */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0069FF]">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-[#0B3558]">
              ACME Inc.
            </span>
          </div>

          {/* Host Avatar */}
          <div className="mb-3 h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-amber-200 to-amber-400">
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-amber-800">
              FS
            </div>
          </div>

          {/* Host Name */}
          <p className="text-xs text-[#476482]">Fatima Sy</p>

          {/* Event Title */}
          <h4 className="mt-1 text-base font-semibold text-[#0B3558]">
            Client Check-in
          </h4>

          {/* Event Details */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[#476482]">
              <Clock className="h-3.5 w-3.5" />
              <span>30 min</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#476482]">
              <Video className="h-3.5 w-3.5" />
              <span>Zoom</span>
            </div>
          </div>

          {/* Placeholder lines */}
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-gray-100" />
            <div className="h-1.5 w-3/4 rounded bg-gray-100" />
            <div className="h-1.5 w-1/2 rounded bg-gray-100" />
          </div>
        </div>

        {/* Middle Panel - Calendar */}
        <div className="min-w-0 flex-1">
          <h5 className="mb-3 text-sm font-semibold text-[#0B3558]">
            Select a Date & Time
          </h5>

          {/* Month Navigation */}
          <div className="mb-3 flex items-center justify-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-[#0B3558]">July 2024</span>
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-3">
            {/* Day Headers */}
            <div className="mb-1.5 grid grid-cols-7 gap-0.5 text-center">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-medium uppercase text-[#667085]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-0.5">
                {week.map((day, dayIndex) => {
                  const isAvailable = availableDays.includes(day)
                  const isSelected = day === selectedDay
                  const isCurrentMonth =
                    (weekIndex === 0 && day > 20) ||
                    (weekIndex === 4 && day < 10)
                      ? false
                      : true

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] sm:h-7 sm:w-7 ${
                        isSelected
                          ? "bg-[#0069FF] font-semibold text-white"
                          : isAvailable && isCurrentMonth
                            ? "font-medium text-[#0069FF] hover:bg-blue-50"
                            : isCurrentMonth
                              ? "text-[#0B3558]"
                              : "text-gray-300"
                      }`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Timezone */}
          <div className="mt-3">
            <p className="mb-0.5 text-[10px] font-medium text-[#667085]">
              Time zone
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#476482]">
              <Globe className="h-3.5 w-3.5" />
              <span>Eastern time - US & Canada</span>
              <ChevronRight className="h-2.5 w-2.5 rotate-90" />
            </div>
          </div>
        </div>

        {/* Right Panel - Time Slots */}
        <div className="flex-shrink-0 border-t pt-3 sm:w-24 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <p className="mb-2 text-xs font-medium text-[#0B3558]">
            Monday, July 22
          </p>

          <div className="flex flex-wrap gap-1.5 sm:flex-col">
            {timeSlots.map((time) => {
              const isSelected = time === selectedTime

              return (
                <div key={time} className="flex gap-1">
                  <button
                    className={`rounded border px-2 py-1.5 text-[11px] font-medium transition-all ${
                      isSelected
                        ? "border-[#0069FF] bg-[#0069FF] text-white"
                        : "border-[#0069FF] text-[#0069FF] hover:bg-blue-50"
                    }`}
                  >
                    {time}
                  </button>
                  {isSelected && (
                    <button className="rounded bg-[#0B3558] px-2 py-1.5 text-[11px] font-medium text-white">
                      Confirm
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
