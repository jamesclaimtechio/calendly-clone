/**
 * Username Availability Check API
 * 
 * GET /api/username/check?username=johndoe
 * 
 * Returns:
 * - { available: true } if username is available
 * - { available: false, message: "..." } if taken or invalid
 */

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { usernameSchema } from "@/lib/validations/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { available: false, message: "Username is required" },
        { status: 400 }
      )
    }

    // Validate username format
    const result = usernameSchema.safeParse(username)
    
    if (!result.success) {
      const error = result.error.issues[0]?.message || "Invalid username format"
      return NextResponse.json(
        { available: false, message: error },
        { status: 200 } // Return 200 so client can show the error message
      )
    }

    const normalizedUsername = result.data

    // Check if username exists in database
    const existingUser = await db.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Username is already taken" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { available: true },
      { status: 200 }
    )
  } catch (error) {
    console.error("Username check error:", error)
    return NextResponse.json(
      { available: false, message: "Unable to check username" },
      { status: 500 }
    )
  }
}
