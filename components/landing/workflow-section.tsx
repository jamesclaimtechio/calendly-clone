import Link from "next/link"
import { Button } from "@/components/ui/button"

export function WorkflowSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Decorative curved shape at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[800px] -translate-x-1/2">
        <div className="absolute bottom-0 h-full w-full rounded-t-[100%] bg-gradient-to-r from-[#00D9A5] to-[#00B8D4] opacity-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-[#0B3558] lg:text-6xl">
            Calendly makes
            <br />
            scheduling simple
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#476482] lg:text-xl">
            Calendly&apos;s easy enough for individual users, and powerful
            enough to meet the needs of enterprise organizations — including 86%
            of the Fortune 500 companies.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-8">
            <Link href="/signup">Sign up for free</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
