/**
 * 404 Page for Invalid Username
 * 
 * Shown when a user visits /[username] with a non-existent username.
 */

import Link from "next/link"
import { UserX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-tertiary)]">
      <div className="text-center px-4">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-text-muted)]/10 flex items-center justify-center">
          <UserX className="h-10 w-10 text-[var(--color-text-muted)]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          User Not Found
        </h1>

        {/* Description */}
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md">
          The user you're looking for doesn't exist or may have been removed.
          Please check the URL and try again.
        </p>

        {/* Action */}
        <Link href="/">
          <Button className="rounded-full">
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
