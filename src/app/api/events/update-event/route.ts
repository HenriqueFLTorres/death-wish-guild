import { eq, sql } from "drizzle-orm"
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

    const id = body.event.id

    const [{ insertedId }] = await db
      .update(events)
      .set({ ...body.event, groups: sql`${body.event.groups}::jsonb` })
      .where(eq(events.id, id))
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
