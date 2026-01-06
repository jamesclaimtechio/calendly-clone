/**
 * Event Card Component
 * 
 * Displays a single event type with its details and actions.
 * Includes edit, copy link, and delete functionality.
 */

"use client"

import { Clock, Link as LinkIcon, MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DURATION_LABELS, type DurationOption } from "@/lib/validations/events"
import { EditEventDialog } from "./edit-event-dialog"
import { DeleteEventDialog } from "./delete-event-dialog"
import type { EventType } from "@/actions/events"

interface EventCardProps {
  event: EventType
  username: string
}

export function EventCard({ event, username }: EventCardProps) {
  const durationLabel = DURATION_LABELS[event.duration as DurationOption] || `${event.duration} minutes`
  const bookingUrl = `/${username}/${event.slug}`

  const handleCopyLink = async () => {
    const fullUrl = `${window.location.origin}${bookingUrl}`
    
    try {
      await navigator.clipboard.writeText(fullUrl)
      toast.success("Link copied to clipboard!")
    } catch {
      // Fallback for browsers that don't support clipboard API
      toast.error("Failed to copy link. Please copy manually.")
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
            {event.name}
          </CardTitle>
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditEventDialog event={event}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </EditEventDialog>
              
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DeleteEventDialog eventId={event.id} eventName={event.name}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DeleteEventDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Clock className="h-4 w-4" />
          <span>{durationLabel}</span>
        </div>

        {/* Booking URL */}
        <div className="flex items-center gap-2 text-sm">
          <LinkIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-primary)] truncate">
            {bookingUrl}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
