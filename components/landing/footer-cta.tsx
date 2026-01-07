"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FooterCta() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = email ? `?email=${encodeURIComponent(email)}` : ""
    router.push(`/signup${params}`)
  }

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#03233F] lg:text-5xl">
            Power up your scheduling
          </h2>
          <p className="mt-4 text-lg text-[#476482]">
            Join millions of professionals who trust Calendly for their
            scheduling needs.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 flex-1 rounded-full border-gray-300 px-5 text-base"
              />
              <Button type="submit" size="lg" className="h-12 px-8">
                Get started
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
