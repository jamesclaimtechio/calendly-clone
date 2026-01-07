/**
 * Test the actual slot calculation that the app performs
 */

import { PrismaClient } from "@prisma/client"
import { calculateSlotsForDate } from "../lib/slots/calculate-slots"
import { getStartOfDayInTimezone, getEndOfDayInTimezone } from "../lib/timezone"
import type { WeeklyAvailability } from "../lib/types/availability"
import type { BookingSlotData } from "../lib/slots/types"

const db = new PrismaClient()

async function testActualSlots() {
  console.log("🧪 Testing Actual Slot Calculation\n")
  
  const selectedDate = "2026-01-07"
  const inviteeTimezone = "Asia/Dubai"
  
  // Fetch event type with host data (same as action)
  const eventType = await db.eventType.findFirst({
    where: {
      deletedAt: null,
      user: { username: "testhost" }
    },
    select: {
      id: true,
      duration: true,
      user: {
        select: {
          timezone: true,
          availability: true,
        },
      },
    },
  })
  
  if (!eventType) {
    console.log("❌ Event type not found")
    return
  }
  
  console.log("📋 Event Type Duration:", eventType.duration, "min")
  console.log("🌍 Host Timezone:", eventType.user.timezone)
  console.log("🌍 Invitee Timezone:", inviteeTimezone)
  
  const hostAvailability = eventType.user.availability as unknown as WeeklyAvailability
  console.log("\n📅 Host Wednesday Availability:", JSON.stringify(hostAvailability.wednesday))
  
  // Calculate date range for booking query (in UTC)
  const dayStartUTC = getStartOfDayInTimezone(selectedDate, inviteeTimezone)
  const dayEndUTC = getEndOfDayInTimezone(selectedDate, inviteeTimezone)
  
  console.log("\n🔍 Booking Query Range (UTC):")
  console.log("   Start:", dayStartUTC.toISOString())
  console.log("   End:", dayEndUTC.toISOString())
  
  // Fetch existing bookings for this event type in the date range
  const existingBookings = await db.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      startTime: {
        gte: dayStartUTC,
        lte: dayEndUTC,
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  })
  
  console.log("\n📦 Existing Bookings Found:", existingBookings.length)
  for (const b of existingBookings) {
    console.log("   -", b.id)
    console.log("     Start:", b.startTime.toISOString())
    console.log("     End:", b.endTime.toISOString())
  }
  
  // Transform bookings to the expected format
  const bookingsForSlotCalc: BookingSlotData[] = existingBookings.map(b => ({
    id: b.id,
    startTime: b.startTime,
    endTime: b.endTime,
  }))
  
  // Calculate available slots
  const slots = calculateSlotsForDate(
    selectedDate,
    eventType.duration,
    eventType.user.timezone || "UTC",
    inviteeTimezone,
    hostAvailability,
    bookingsForSlotCalc
  )
  
  console.log("\n📋 Available Slots:", slots.length)
  for (const slot of slots.slice(0, 10)) { // Show first 10
    console.log(`   - ${slot.startTimeDisplay} to ${slot.endTimeDisplay}`)
    console.log(`     UTC: ${slot.startTimeUTC}`)
  }
  
  // Check if the booked slot appears
  const bookedSlotTime = "2026-01-07T18:30:00.000Z"
  const hasBookedSlot = slots.some(s => s.startTimeUTC === bookedSlotTime)
  
  console.log("\n❓ Does the booked slot (18:30 UTC / 10:30 PM Dubai) appear?", hasBookedSlot ? "YES ❌ BUG!" : "NO ✅ CORRECT!")
  
  await db.$disconnect()
}

testActualSlots()
