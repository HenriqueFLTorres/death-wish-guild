import { BookCheck, House } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

function AlreadyOnboarded() {
  return (
    <section className="relative flex w-full max-w-screen-sm flex-col items-center justify-center gap-8 overflow-hidden rounded-lg bg-gradient-to-b from-secondary-600/40 to-secondary-400/40 p-4 pb-4 drop-shadow-md backdrop-blur-md">
      <header className="relative z-10 flex w-full items-center gap-4">
        <BookCheck size={48} />
        <h1 className="text-left text-3xl font-semibold drop-shadow">
          Você já foi registrado!
        </h1>
      </header>

      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-left">
          Parece que você já está registrado em nossa plataforma, caso deseja
          mudar suas informações contate-nos através do nosso grupo do discord.
        </p>

        <Link
          className={buttonVariants({ className: "relative z-10 w-full" })}
          href={"/"}
        >
          <House />
          Retornar a página principal
        </Link>
      </div>

      <Image
        alt=""
        className="pointer-events-none absolute z-0 h-full w-full scale-125"
        height={600}
        src="/groups-decals-small.png"
        width={600}
      />
    </section>
  )
}

export { AlreadyOnboarded }
