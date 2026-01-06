/**
 * Slug Generation Utilities
 * 
 * Handles URL-safe slug creation and uniqueness checking.
 * Used primarily for event type slugs.
 */

import { db } from "@/lib/db"

/**
 * Convert text to URL-safe slug
 * 
 * Examples:
 * - "30 Min Call" → "30-min-call"
 * - "Quick Chat!" → "quick-chat"
 * - "  Spaces  " → "spaces"
 * 
 * @param text - The text to slugify
 * @returns URL-safe slug string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for an event type
 * 
 * Checks if slug already exists for the user and appends
 * a number suffix if needed (-2, -3, etc.)
 * 
 * @param name - The event type name to generate slug from
 * @param userId - The user ID to check uniqueness against
 * @param excludeId - Optional event type ID to exclude (for updates)
 * @returns Unique slug string
 */
export async function generateUniqueSlug(
  name: string,
  userId: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(name)
  
  if (!baseSlug) {
    // Fallback if name produces empty slug
    return `event-${Date.now()}`
  }

  let slug = baseSlug
  let counter = 1

  // Keep checking until we find a unique slug
  while (true) {
    const existing = await db.eventType.findFirst({
      where: {
        userId,
        slug,
        // Exclude current event type when updating
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        // Include soft-deleted to prevent reusing their slugs
      },
      select: { id: true },
    })

    if (!existing) {
      return slug
    }

    // Slug exists, try with number suffix
    counter++
    slug = `${baseSlug}-${counter}`
  }
}
