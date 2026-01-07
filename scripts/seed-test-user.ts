/**
 * Quick seed script to create a test user for browser testing
 * Run with: npx ts-node --esm scripts/seed-test-user.ts
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Check if test user already exists
  const existing = await prisma.user.findFirst({
    where: { username: "testhost" }
  })

  if (existing) {
    console.log("✅ Test user already exists:")
    console.log(`   Email: ${existing.email}`)
    console.log(`   Username: ${existing.username}`)
    return
  }

  // Create test user
  const hashedPassword = await bcrypt.hash("password123", 10)
  
  const user = await prisma.user.create({
    data: {
      email: "testhost@example.com",
      username: "testhost",
      password: hashedPassword,
      name: "Test Host",
      timezone: "America/New_York",
      availability: {
        monday: { enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
        tuesday: { enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
        wednesday: { enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
        thursday: { enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
        friday: { enabled: true, blocks: [{ start: "09:00", end: "17:00" }] },
        saturday: { enabled: false, blocks: [] },
        sunday: { enabled: false, blocks: [] },
      },
    },
  })

  console.log("✅ Created test user:")
  console.log(`   ID: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Username: ${user.username}`)

  // Create a test event type
  const eventType = await prisma.eventType.create({
    data: {
      name: "Quick Chat",
      slug: "quick-chat",
      duration: 30,
      description: "A quick 30-minute chat to discuss anything!",
      location: "Google Meet",
      userId: user.id,
    },
  })

  console.log("\n✅ Created test event type:")
  console.log(`   Name: ${eventType.name}`)
  console.log(`   Slug: ${eventType.slug}`)
  console.log(`   Duration: ${eventType.duration} minutes`)
  console.log(`\n🔗 Public profile URL: http://localhost:3000/testhost`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
