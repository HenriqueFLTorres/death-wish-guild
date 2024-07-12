import { NextResponse } from "next/server"
import { events } from "@/../supabase/migrations/schema"
import { db } from "@/db"

export async function GET() {
  try {
    const eventsData = await db.select().from(events)

    return NextResponse.json(eventsData, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(null, { status: 500, statusText: "Server error." })
  }
}
