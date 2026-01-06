/**
 * Edit Event Dialog Component
 * 
 * Modal wrapper for the edit event form.
 * Client Component for managing dialog state.
 */

"use client"

import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditEventForm } from "./edit-event-form"
import type { EventType } from "@/actions/events"

interface EditEventDialogProps {
  event: EventType
  children: ReactNode
}

export function EditEventDialog({ event, children }: EditEventDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-text-primary)]">
            Edit Event Type
          </DialogTitle>
        </DialogHeader>
        <EditEventForm event={event} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
