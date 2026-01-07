"use client"

import { ChevronLeft, ChevronRight, Clock, Video } from "lucide-react"

const currentMonth = new Date().toLocaleString("default", { month: "long" })
const currentYear = new Date().getFullYear()

// Generate calendar days for display
const generateCalendarDays = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const startingDay = firstDay.getDay()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const days: (number | null)[] = []

  // Add empty slots for days before the 1st
  for (let i = 0; i < startingDay; i++) {
    days.push(null)
  }

  // Add the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

const calendarDays = generateCalendarDays()
const today = new Date().getDate()

const timeSlots = ["9:00am", "9:30am", "10:00am", "10:30am", "11:00am"]

export function MockCalendar() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Floating shadow effect */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-primary/10" />

      {/* Main card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#03233F]">Jane Doe</p>
              <p className="text-xs text-[#667085]">30 Minute Meeting</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Calendar Side */}
          <div className="flex-1 border-b border-gray-100 p-4 md:border-b-0 md:border-r">
            {/* Month Navigation */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#03233F]">
                {currentMonth} {currentYear}
              </h3>
              <div className="flex gap-1">
                <button className="rounded p-1 hover:bg-gray-100">
                  <ChevronLeft className="h-4 w-4 text-[#476482]" />
                </button>
                <button className="rounded p-1 hover:bg-gray-100">
                  <ChevronRight className="h-4 w-4 text-[#476482]" />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="mb-2 grid grid-cols-7 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="text-xs font-medium text-[#667085]">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  className={`aspect-square rounded-full text-sm transition-colors ${
                    day === null
                      ? ""
                      : day === today
                        ? "bg-primary font-semibold text-white"
                        : day > today && day < today + 7
                          ? "font-medium text-[#03233F] hover:bg-primary/10"
                          : "text-[#667085]"
                  }`}
                  disabled={day === null || day < today}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Side */}
          <div className="w-full p-4 md:w-40">
            <p className="mb-3 text-xs font-medium text-[#667085]">
              Available times
            </p>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              {timeSlots.map((time, index) => (
                <button
                  key={time}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                    index === 1
                      ? "border-primary bg-primary text-white"
                      : "border-primary/30 text-primary hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-gray-100 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs text-[#667085]">
            <Clock className="h-3.5 w-3.5" />
            <span>30 min</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#667085]">
            <Video className="h-3.5 w-3.5" />
            <span>Zoom</span>
          </div>
        </div>
      </div>
    </div>
  )
}
