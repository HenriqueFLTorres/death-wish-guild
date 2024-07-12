import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { user } from "@/../supabase/migrations/schema"
import { db } from "@/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.id == null)
      return NextResponse.json(
        { updatedId: null },
        { status: 400, statusText: "Bad request." }
      )

    const [{ updatedId }] = await db
      .update(user)
      .set({
        is_boarded: true,
        class: body.class,
        display_name: body.display_name,
      })
      .where(eq(user.id, body.id))
      .returning({ updatedId: user.id })

    return NextResponse.json({ updatedId }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { updatedId: null },
      { status: 500, statusText: "Server error." }
    )
  }
}
