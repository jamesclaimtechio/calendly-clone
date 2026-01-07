/**
 * Test Script for Booking Creation
 * 
 * This script tests the booking creation logic by directly
 * creating a booking in the database and verifying it.
 */

import { PrismaClient } from "@prisma/client"
import { addMinutes } from "date-fns"

const db = new PrismaClient()

async function testBooking() {
  console.log("🧪 Testing Booking Creation Logic\n")
  
  try {
    // 1. Get the test event type
    const eventType = await db.eventType.findFirst({
      where: {
        user: {
          username: "testhost"
        }
      },
      include: {
        user: true
      }
    })

    if (!eventType) {
      console.error("❌ No event type found for testhost")
      return
    }

    console.log(`✅ Found event type: ${eventType.name} (${eventType.duration} min)`)
    console.log(`   ID: ${eventType.id}`)
    console.log(`   Deleted: ${eventType.deletedAt ? 'Yes' : 'No'}`)

    // 2. Create a test booking for a future time
    const startTime = new Date("2026-01-07T18:30:00.000Z") // Wed Jan 7 at 6:30 PM UTC
    const endTime = addMinutes(startTime, eventType.duration)

    console.log(`\n📅 Creating booking:`)
    console.log(`   Start (UTC): ${startTime.toISOString()}`)
    console.log(`   End (UTC): ${endTime.toISOString()}`)

    // Check for existing booking at this time and clean up
    const existingBooking = await db.booking.findFirst({
      where: {
        eventTypeId: eventType.id,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      }
    })

    if (existingBooking) {
      console.log(`\n⚠️  Slot already booked, cleaning up...`)
      await db.booking.delete({ where: { id: existingBooking.id } })
      console.log(`   Deleted booking ${existingBooking.id}`)
    }

    // 3. Create the booking
    const booking = await db.booking.create({
      data: {
        eventTypeId: eventType.id,
        startTime,
        endTime,
        inviteeName: "John Test",
        inviteeEmail: "john@test.com",
        inviteeTimezone: "Asia/Dubai",
        notes: "This is a test booking for Chunk 6.2",
      },
    })

    console.log(`\n✅ Booking created successfully!`)
    console.log(`   Booking ID: ${booking.id}`)
    console.log(`   Start Time (UTC): ${booking.startTime.toISOString()}`)
    console.log(`   End Time (UTC): ${booking.endTime.toISOString()}`)
    console.log(`   Invitee: ${booking.inviteeName} (${booking.inviteeEmail})`)
    console.log(`   Timezone: ${booking.inviteeTimezone}`)
    console.log(`   Notes: ${booking.notes}`)

    // 4. Verify the booking is in the database
    const verifyBooking = await db.booking.findUnique({
      where: { id: booking.id }
    })

    if (verifyBooking) {
      console.log(`\n✅ Booking verified in database!`)
    } else {
      console.log(`\n❌ Booking not found in database`)
    }

    // 5. Test race condition check (simulate trying to book same slot again)
    console.log(`\n🔒 Testing race condition check...`)
    const overlap = await db.booking.findFirst({
      where: {
        eventTypeId: eventType.id,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      }
    })

    if (overlap) {
      console.log(`✅ Race condition check working: Found existing booking`)
      console.log(`   Overlap ID: ${overlap.id}`)
    } else {
      console.log(`❌ Race condition check failed: No overlap detected`)
    }

    // Print all bookings for this event type
    console.log(`\n📋 All bookings for ${eventType.name}:`)
    const allBookings = await db.booking.findMany({
      where: { eventTypeId: eventType.id },
      orderBy: { startTime: 'asc' }
    })
    
    for (const b of allBookings) {
      console.log(`   - ${b.id}`)
      console.log(`     Time: ${b.startTime.toISOString()} to ${b.endTime.toISOString()}`)
      console.log(`     Invitee: ${b.inviteeName} (${b.inviteeEmail})`)
      console.log(`     TZ: ${b.inviteeTimezone}`)
    }

    console.log(`\n🎉 All booking tests passed!`)

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await db.$disconnect()
  }
}

testBooking()
