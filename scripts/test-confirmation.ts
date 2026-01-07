/**
 * Test Confirmation Page - Create a new booking and print the URL
 */

import { PrismaClient } from "@prisma/client"
import { addMinutes, addDays } from "date-fns"

const db = new PrismaClient()

async function createTestBooking() {
  console.log("🧪 Creating Test Booking for Confirmation Page\n")

  // Get testhost event type
  const eventType = await db.eventType.findFirst({
    where: {
      slug: "quick-chat",
      user: {
        username: "testhost"
      }
    },
    include: {
      user: true
    }
  })

  if (!eventType) {
    console.error("❌ Event type not found. Run seed script first.")
    process.exit(1)
  }

  // Create a booking 3 days from now at 2:00 PM UTC
  const startTime = addDays(new Date(), 3)
  startTime.setHours(14, 0, 0, 0)
  const endTime = addMinutes(startTime, eventType.duration)

  const booking = await db.booking.create({
    data: {
      eventTypeId: eventType.id,
      startTime,
      endTime,
      inviteeName: "Chunk 6.3 Test User",
      inviteeEmail: "chunk63@test.com",
      inviteeTimezone: "America/New_York",
      notes: "This is a test note for the confirmation page"
    }
  })

  console.log("✅ Booking created!")
  console.log(`   ID: ${booking.id}`)
  console.log(`   Start: ${booking.startTime.toISOString()}`)
  console.log(`   End: ${booking.endTime.toISOString()}`)
  console.log(`   Name: ${booking.inviteeName}`)
  console.log(`   Email: ${booking.inviteeEmail}`)
  console.log(`   Timezone: ${booking.inviteeTimezone}`)
  console.log(`   Notes: ${booking.notes}\n`)

  console.log("🔗 Confirmation URL:")
  console.log(`   http://localhost:3000/${eventType.user.username}/${eventType.slug}/confirmation?bookingId=${booking.id}\n`)

  await db.$disconnect()
}

createTestBooking()
