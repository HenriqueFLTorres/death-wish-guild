import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toKebabCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
}
