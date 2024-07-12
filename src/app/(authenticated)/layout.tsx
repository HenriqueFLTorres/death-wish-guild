import Image from "next/image"
import { Navbar } from "@/components/global/Navbar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Image
        alt=""
        className="pointer-events-none fixed -z-[1] min-h-screen select-none object-cover blur"
        src="/background-blur.png"
        fill
      />
    </>
  )
}
