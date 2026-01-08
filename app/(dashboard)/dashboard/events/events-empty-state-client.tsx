/**
 * Events Empty State Client Component
 * 
 * Client wrapper for the empty state to handle dialog trigger.
 */

"use client"

import { useState } from "react"
import { Calendar, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateEventForm } from "@/components/events/create-event-form"

export function EventsEmptyStateClient() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <>
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
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your first event type
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--color-text-primary)]">
              Create Event Type
            </DialogTitle>
          </DialogHeader>
          <CreateEventForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
