import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL == null ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY == null
  )
    throw new Error("Missing supabase credentials")

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
