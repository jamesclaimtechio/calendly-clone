/**
 * Public Host Profile Page
 * 
 * Displays a host's profile and their available event types.
 * This is a PUBLIC page - no authentication required.
 * 
 * Route: /[username]
 */

import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getHostByUsername, getEventTypesForHost } from "@/lib/queries/public"
import { HostProfile } from "@/components/public/host-profile"

interface Props {
  params: Promise<{ username: string }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const host = await getHostByUsername(username)

  if (!host) {
    return {
      title: "User Not Found",
    }
  }

  const displayName = host.name || host.email.split("@")[0]

  return {
    title: `Book a meeting with ${displayName}`,
    description: `Schedule a meeting with ${displayName} using their booking page.`,
  }
}

export default async function HostProfilePage({ params }: Props) {
  const { username } = await params

  // Fetch host by username (case-insensitive)
  const host = await getHostByUsername(username)

  // 404 if host not found
  if (!host) {
    notFound()
  }

  // Fetch active event types for this host
  const eventTypes = await getEventTypesForHost(host.id)

  return <HostProfile host={host} eventTypes={eventTypes} />
}
