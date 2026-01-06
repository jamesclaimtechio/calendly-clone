/**
 * Create Event Dialog Component
 * 
 * Modal wrapper for the create event form.
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
import { CreateEventForm } from "./create-event-form"

interface CreateEventDialogProps {
  children: ReactNode
}

export function CreateEventDialog({ children }: CreateEventDialogProps) {
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
            Create Event Type
          </DialogTitle>
        </DialogHeader>
        <CreateEventForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
