import { NextResponse } from "next/server"
import { user } from "@/../supabase/migrations/schema"
import { db } from "@/db"

export async function GET() {
  try {
    const users = await db.select().from(user)

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(null, { status: 500, statusText: "Server error." })
  }
}
