import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function checkAvailability() {
  const user = await db.user.findFirst({
    where: { username: "testhost" }
  })
  
  if (!user) {
    console.log("User not found")
    return
  }
  
  console.log("User:", user.username)
  console.log("Timezone:", user.timezone)
  console.log("Availability:", JSON.stringify(user.availability, null, 2))
  
  await db.$disconnect()
}

checkAvailability()
