import { Sword } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

function PlayerListItem() {
  return (
    <li className="relative flex w-full items-center gap-2 overflow-hidden rounded-full border-2 border-black/10 bg-black/20 px-2 py-1">
      <Avatar className="relative z-10 h-6 w-6">
        <AvatarImage alt="" size={24} src="/avatar/variant-1.png" />
      </Avatar>

      <Image
        alt=""
        className="absolute left-2 z-0 blur-md"
        height={36}
        src="/avatar/variant-1.png"
        width={36}
      />

      <p className="text-with-gradient relative z-10 bg-gradient-to-b from-white to-neutral-300 text-sm font-medium">
        SpamTaxota
      </p>

      <Sword className="relative z-10 ml-auto fill-white" size={20} />

      <span
        className="absolute right-0 z-[0] h-full w-24 translate-x-1/2 bg-red-900/50 blur-lg"
        aria-hidden
      />
    </li>
  )
}

export { PlayerListItem }
