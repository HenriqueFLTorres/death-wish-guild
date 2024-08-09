import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SelectUser } from "@/db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toKebabCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
}

export function translateGameClass(gameClass: SelectUser["class"]) {
  switch (gameClass) {
    case "DPS":
      return "DPS"
    case "RANGED_DPS":
      return "DPS Ranged"
    case "SUPPORT":
      return "Suporte"
    case "TANK":
      return "Tank"
    default:
      throw new Error("Invalid in-game class")
  }
}
