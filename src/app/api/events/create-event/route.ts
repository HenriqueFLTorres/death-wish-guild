import { NextResponse } from "next/server"
import { events } from "@/../supabase/migrations/schema"
import { db } from "@/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.event == null)
      return NextResponse.json(
        { insertedId: null },
        { status: 400, statusText: "Bad request." }
      )

    const [{ insertedId }] = await db
      .insert(events)
      .values({
        ...body.event,
        startTime: new Date(body.event.startTime),
      })
      .returning({ insertedId: events.id })

    return NextResponse.json({ insertedId }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { insertedId: null },
      { status: 500, statusText: "Server error." }
    )
  }
}
