import Image from "next/image"

export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Image
        alt=""
        className="fixed -z-[1] object-cover opacity-50 blur"
        src="/background-3.png"
        fill
      />
    </>
  )
}
