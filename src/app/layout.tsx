import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import Image from "next/image"

import QueryClientProvider from "./_providers/QueryClientProvider"
import { Navbar } from "@/components/global/Navbar"
import { cn } from "@/lib/utils"
import "./globals.css"

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          "flex flex-col items-center gap-12 bg-neutral-900"
        )}
      >
        <QueryClientProvider>
          <Navbar />
          {children}
        </QueryClientProvider>
        <Image
          alt=""
          className="fixed -z-[1] object-cover blur"
          src={"/background-blur.png"}
          fill
        />
      </body>
    </html>
  )
}
