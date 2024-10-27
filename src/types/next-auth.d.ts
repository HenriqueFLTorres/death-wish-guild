import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      email: string
      is_recruited: boolean
      is_boarded: boolean
      role: "ADMIN" | "MODERATOR" | "MEMBER"
      username: string
      class: "DPS" | "RANGED_DPS" | "TANK" | "SUPPORT"
      points: number
    } & DefaultSession["user"]
  }
}
