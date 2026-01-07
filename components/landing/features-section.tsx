"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Video,
  Settings,
  Share2,
  ChevronRight,
} from "lucide-react"

const features = [
  {
    id: "calendars",
    icon: Calendar,
    title: "Connect your calendars",
    description: "",
    color: "#00D4FF",
  },
  {
    id: "availability",
    icon: Clock,
    title: "Add your availability",
    description: "",
    color: "#FFB74D",
  },
  {
    id: "conferencing",
    icon: Video,
    title: "Connect conferencing tools",
    description:
      "Sync your video conferencing tools and set preferences for in-person meetings or calls.",
    color: "#E040FB",
    active: true,
  },
  {
    id: "customize",
    icon: Settings,
    title: "Customize your event types",
    description: "",
    color: "#00D9A5",
  },
  {
    id: "share",
    icon: Share2,
    title: "Share your scheduling link",
    description: "",
    color: "#00D9A5",
  },
]

const conferenceTools = [
  {
    name: "Zoom",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#2D8CFF">
        <path d="M4.5 4.5h10.8c.6 0 1.2.6 1.2 1.2v8.1c0 .6-.6 1.2-1.2 1.2h-3l-3.6 3.6v-3.6H4.5c-.6 0-1.2-.6-1.2-1.2V5.7c0-.6.6-1.2 1.2-1.2zm13.2 3v4.5l3 2.25V5.25l-3 2.25z" />
      </svg>
    ),
  },
  {
    name: "Microsoft Teams",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24">
        <path fill="#5059C9" d="M19.5 5.5a2 2 0 11-4 0 2 2 0 014 0z" />
        <path
          fill="#5059C9"
          d="M20.5 8h-4.5a.5.5 0 00-.5.5v6a2.5 2.5 0 005 0v-6a.5.5 0 00-.5-.5z"
        />
        <path fill="#7B83EB" d="M11 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        <path
          fill="#7B83EB"
          d="M14 8H3a1 1 0 00-1 1v6a4 4 0 008 0V9a1 1 0 00-1-1z"
        />
      </svg>
    ),
  },
  {
    name: "Google Meet",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24">
        <path fill="#00832D" d="M12 11l4 2.5v5l-4-2.5z" />
        <path fill="#0066DA" d="M12 11l-4 2.5v5l4-2.5z" />
        <path fill="#E94235" d="M8 8.5v5l4 2.5v-5z" />
        <path fill="#2684FC" d="M16 8.5v5l-4 2.5v-5z" />
        <path fill="#00AC47" d="M12 6l-4 2.5 4 2.5 4-2.5z" />
        <path
          fill="#FFBA00"
          d="M17.5 7.5l2.5 2v5l-2.5 2v-2.5L16 13.5v-3l1.5-.5z"
        />
      </svg>
    ),
  },
  {
    name: "Webex",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#00BCF2" />
        <path
          fill="white"
          d="M8 10c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-4z"
        />
      </svg>
    ),
  },
]

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState("conferencing")

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background gradient shapes */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        <div className="absolute -right-20 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#E040FB] to-[#FF4081] opacity-80" />
        <div className="absolute bottom-20 right-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0069FF] opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left Column - Feature List */}
          <div className="flex-1 space-y-2">
            {features.map((feature) => {
              const isActive = activeFeature === feature.id
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`group flex w-full items-start gap-4 rounded-lg p-4 text-left transition-all ${
                    isActive ? "bg-transparent" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                      isActive ? "bg-[#E040FB]/20" : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? `${feature.color}20`
                        : undefined,
                    }}
                  >
                    <feature.icon
                      className={`h-5 w-5 transition-colors ${
                        isActive ? "text-[#E040FB]" : "text-[#476482]"
                      }`}
                      style={{ color: isActive ? feature.color : undefined }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold transition-colors ${
                        isActive ? "text-[#0B3558]" : "text-[#476482]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    {isActive && feature.description && (
                      <p className="mt-1 text-sm text-[#476482]">
                        {feature.description}
                      </p>
                    )}
                    {isActive && (
                      <div
                        className="mt-3 h-1 w-full rounded-full"
                        style={{ backgroundColor: feature.color }}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Column - Feature Visual */}
          <div className="relative flex-1">
            <div className="relative z-10 mx-auto max-w-md rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm">
              {/* Tabs */}
              <div className="mb-6 flex gap-4 border-b border-gray-100 pb-4">
                <span className="rounded-full bg-[#E8F4FD] px-4 py-1.5 text-sm font-medium text-primary">
                  Meeting location
                </span>
                <span className="text-sm font-medium text-[#0B3558]">
                  Video conferencing
                </span>
              </div>

              {/* Conference Tools List */}
              <div className="space-y-3">
                {conferenceTools.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 transition-all hover:border-gray-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {tool.logo}
                      <span className="font-semibold text-[#0B3558]">
                        {tool.name}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
