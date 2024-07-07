import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.id == null)
      return NextResponse.json(
        { updatedId: null },
        { status: 400, statusText: "Bad request." }
      )

    const [{ updatedId }] = await db
      .update(users)
      .set({
        isBoarded: true,
        class: body.class,
        displayName: body.displayName,
      })
      .where(eq(users.id, body.id))
      .returning({ updatedId: users.id })

    return NextResponse.json({ updatedId }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { updatedId: null },
      { status: 500, statusText: "Server error." }
    )
  }
}
