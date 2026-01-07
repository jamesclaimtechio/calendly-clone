import { PrismaClient } from "@prisma/client"
import { fromZonedTime } from "date-fns-tz"

const db = new PrismaClient()

async function testSlotFetch() {
  // Simulate what the slot action does
  const selectedDate = "2026-01-07"
  const inviteeTimezone = "Asia/Dubai"
  
  // Calculate day range in UTC
  const [year, month, day] = selectedDate.split("-").map(Number)
  
  // Start of day in invitee timezone, converted to UTC
  const startOfDayZoned = new Date(year, month - 1, day, 0, 0, 0, 0)
  const dayStartUTC = fromZonedTime(startOfDayZoned, inviteeTimezone)
  
  // End of day in invitee timezone, converted to UTC
  const endOfDayZoned = new Date(year, month - 1, day, 23, 59, 59, 999)
  const dayEndUTC = fromZonedTime(endOfDayZoned, inviteeTimezone)
  
  console.log("📅 Selected Date (in invitee TZ):", selectedDate)
  console.log("🌍 Invitee Timezone:", inviteeTimezone)
  console.log("\n🔍 Query Range (UTC):")
  console.log("   Start:", dayStartUTC.toISOString())
  console.log("   End:", dayEndUTC.toISOString())
  
  // Get event type ID
  const eventType = await db.eventType.findFirst({
    where: { user: { username: "testhost" } }
  })
  
  if (!eventType) {
    console.log("No event type found")
    return
  }
  
  console.log("\n📋 Event Type:", eventType.name, "(ID:", eventType.id, ")")
  
  // The booking we created
  console.log("\n📌 Our Booking:")
  console.log("   Start: 2026-01-07T18:30:00.000Z")
  console.log("   End: 2026-01-07T19:00:00.000Z")
  
  // Check if booking is in range
  const bookingStart = new Date("2026-01-07T18:30:00.000Z")
  const isInRange = bookingStart >= dayStartUTC && bookingStart <= dayEndUTC
  console.log("\n❓ Is booking in query range?", isInRange ? "YES" : "NO")
  
  // Fetch bookings with the same query as the action
  const existingBookings = await db.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      startTime: {
        gte: dayStartUTC,
        lte: dayEndUTC,
      },
    },
  })
  
  console.log("\n📦 Bookings found by query:", existingBookings.length)
  for (const b of existingBookings) {
    console.log("   -", b.id)
    console.log("     Start:", b.startTime.toISOString())
    console.log("     End:", b.endTime.toISOString())
  }
  
  await db.$disconnect()
}

testSlotFetch()
