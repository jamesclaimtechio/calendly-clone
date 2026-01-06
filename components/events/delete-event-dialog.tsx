/**
 * Delete Event Dialog Component
 * 
 * Confirmation dialog for deleting an event type.
 * Uses AlertDialog for destructive action pattern.
 */

"use client"

import { useState, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteEventType } from "@/actions/events"

interface DeleteEventDialogProps {
  eventId: string
  eventName: string
  children: ReactNode
}

export function DeleteEventDialog({
  eventId,
  eventName,
  children,
}: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteEventType(eventId)

      if (!result.success) {
        toast.error(result.error || "Failed to delete event type")
        return
      }

      toast.success("Event type deleted successfully")
      setOpen(false)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{eventName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the event
            type from your account.
            <br />
            <br />
            <strong>Note:</strong> This will not cancel any existing bookings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
