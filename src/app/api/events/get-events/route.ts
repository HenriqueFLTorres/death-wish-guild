import { NextResponse } from "next/server"
import { db } from "@/db"
import { eventsTable } from "@/db/schema"

export async function GET() {
  try {
    const events = await db.select().from(eventsTable)

    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(null, { status: 500, statusText: "Server error." })
  }
}
