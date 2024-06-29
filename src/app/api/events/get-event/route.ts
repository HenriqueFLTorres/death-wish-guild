import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { eventsTable } from "@/db/schema"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.id == null)
      return NextResponse.json(null, {
        status: 400,
        statusText: "Bad request.",
      })

    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, Number(body.id)))
      .limit(1)

    return NextResponse.json(event, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(null, { status: 500, statusText: "Server error." })
  }
}