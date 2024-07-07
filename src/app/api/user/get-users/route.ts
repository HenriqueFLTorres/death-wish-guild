import { NextResponse } from "next/server"
import { db } from "@/db"
import { users as usersTable } from "@/db/schema"

export async function GET() {
  try {
    const users = await db.select().from(usersTable)

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(null, { status: 500, statusText: "Server error." })
  }
}
