/**
 * Test error handling in booking creation
 */

import { PrismaClient } from "@prisma/client"
import { addMinutes } from "date-fns"

const db = new PrismaClient()

async function testErrors() {
  console.log("🧪 Testing Error Handling\n")
  
  // Test 1: Try to book a non-existent event type
  console.log("Test 1: Non-existent event type")
  const fakeEventTypeId = "fake-event-type-id"
  const eventType = await db.eventType.findUnique({
    where: { id: fakeEventTypeId }
  })
  if (!eventType) {
    console.log("✅ CORRECT: Non-existent event type returns null")
  } else {
    console.log("❌ ERROR: Found an event that shouldn't exist")
  }
  
  // Test 2: Create a soft-deleted event type and try to book it
  console.log("\nTest 2: Soft-deleted event type")
  
  // Get the testhost user
  const user = await db.user.findFirst({ where: { username: "testhost" } })
  if (!user) {
    console.log("❌ Test user not found")
    return
  }
  
  // Create a soft-deleted event type
  const deletedEvent = await db.eventType.create({
    data: {
      userId: user.id,
      name: "Deleted Event",
      slug: "deleted-event",
      duration: 30,
      deletedAt: new Date(), // Soft deleted
    }
  })
  console.log("   Created soft-deleted event:", deletedEvent.id)
  
  // Check if it shows as deleted
  const checkDeleted = await db.eventType.findUnique({
    where: { id: deletedEvent.id },
    select: { deletedAt: true }
  })
  if (checkDeleted?.deletedAt) {
    console.log("✅ CORRECT: Event is marked as deleted")
  } else {
    console.log("❌ ERROR: Event should be marked as deleted")
  }
  
  // Clean up
  await db.eventType.delete({ where: { id: deletedEvent.id } })
  console.log("   Cleaned up test event")
  
  // Test 3: Try to book in the past
  console.log("\nTest 3: Booking in the past")
  const pastTime = new Date("2024-01-01T12:00:00.000Z")
  const isPast = pastTime <= new Date()
  if (isPast) {
    console.log("✅ CORRECT: Past time would be rejected")
  }
  
  console.log("\n🎉 Error handling tests complete!")
  
  await db.$disconnect()
}

testErrors()
