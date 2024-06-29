import { NextResponse } from "next/server"
import { db } from "@/db"
import { eventsTable } from "@/db/schema"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.event == null)
      return NextResponse.json(
        { insertedId: null },
        { status: 400, statusText: "Bad request." }
      )

    const [{ insertedId }] = await db
      .insert(eventsTable)
      .values({ ...body.event, start_time: new Date(body.event.start_time) })
      .returning({ insertedId: eventsTable.id })

    return NextResponse.json({ insertedId }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { insertedId: null },
      { status: 500, statusText: "Server error." }
    )
  }
}
