import type { Metadata } from "next"
import { Poppins } from "next/font/google"

import NextAuthProvider from "./_providers/NextAuthProvider"
import QueryClientProvider from "./_providers/QueryClientProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import "./globals.css"

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Death Wish - Guilda",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          poppins.className,
          "h-screen overflow-hidden bg-primary-800"
        )}
      >
        <NextAuthProvider>
          <TooltipProvider>
            <QueryClientProvider>{children}</QueryClientProvider>
          </TooltipProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
