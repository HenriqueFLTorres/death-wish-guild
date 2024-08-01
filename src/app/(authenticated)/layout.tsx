import Image from "next/image"
import { Sidebar } from "@/components/global/Sidebar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-12 pl-14">
      <Sidebar />
      {children}
      <Image
        alt=""
        className="pointer-events-none fixed -z-[1] min-h-screen scale-125 select-none object-cover blur"
        src="/background-decals.png"
        fill
      />
    </div>
  )
}
