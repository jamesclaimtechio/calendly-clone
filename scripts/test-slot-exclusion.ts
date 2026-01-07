/**
 * Test that booked slots are excluded from availability
 */

import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function testSlotExclusion() {
  console.log("🧪 Testing Slot Exclusion\n")
  
  try {
    // Get the test event type and bookings
    const eventType = await db.eventType.findFirst({
      where: {
        user: {
          username: "testhost"
        }
      },
      include: {
        bookings: true,
        user: true
      }
    })

    if (!eventType) {
      console.error("❌ No event type found")
      return
    }

    console.log(`Event Type: ${eventType.name}`)
    console.log(`Host: ${eventType.user.username}`)
    console.log(`Host Timezone: ${eventType.user.timezone}`)
    console.log(`\nExisting Bookings:`)
    
    for (const booking of eventType.bookings) {
      console.log(`  - ${booking.id}`)
      console.log(`    Start: ${booking.startTime.toISOString()}`)
      console.log(`    End: ${booking.endTime.toISOString()}`)
    }

    // Test the overlap check that would be used in slot calculation
    const testDate = "2026-01-07"
    const testStartUTC = new Date("2026-01-07T18:30:00.000Z")
    const testEndUTC = new Date("2026-01-07T19:00:00.000Z")

    console.log(`\n🔍 Checking for overlap:`)
    console.log(`   Test slot: ${testStartUTC.toISOString()} to ${testEndUTC.toISOString()}`)

    const overlap = await db.booking.findFirst({
      where: {
        eventTypeId: eventType.id,
        startTime: { lt: testEndUTC },
        endTime: { gt: testStartUTC },
      }
    })

    if (overlap) {
      console.log(`✅ CORRECTLY BLOCKED: Found overlapping booking ${overlap.id}`)
    } else {
      console.log(`❌ ERROR: No overlap found, slot should have been blocked!`)
    }

  } catch (error) {
    console.error("Error:", error)
  } finally {
    await db.$disconnect()
  }
}

testSlotExclusion()
