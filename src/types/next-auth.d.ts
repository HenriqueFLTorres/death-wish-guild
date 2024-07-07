import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      email: string
      isBoarded: boolean
      role: "ADMIN" | "MODERATOR" | "MEMBER"
      displayName: string
      class: "DPS" | "RANGED_DPS" | "TANK" | "SUPPORT"
    } & DefaultSession["user"]
  }
}
