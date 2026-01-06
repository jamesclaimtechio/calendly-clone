/**
 * Empty State Component
 * 
 * Displayed when user has no event types.
 * Encourages user to create their first event type.
 */

import { Calendar } from "lucide-react"

interface EmptyStateProps {
  onCreateClick: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-[var(--color-primary)]/10 p-4 mb-6">
        <Calendar className="h-12 w-12 text-[var(--color-primary)]" />
      </div>
      
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
        No event types yet
      </h2>
      
      <p className="text-[var(--color-text-secondary)] text-center max-w-md mb-6">
        Create your first event type to start accepting bookings. 
        Share your booking link and let others schedule time with you.
      </p>
      
      <button
        onClick={onCreateClick}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-primary)]/90 transition-colors"
      >
        Create your first event type
      </button>
    </div>
  )
}
