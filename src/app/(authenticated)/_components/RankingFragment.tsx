import Link from "next/link"
import { ReactNode } from "react"
import { Avatar } from "@/components/ui/avatar"
import { SelectUser } from "@/db/schema"
import { PATHS } from "@/lib/constants/paths"
import { cn, translateGameClass } from "@/lib/utils"

interface RankingFragmentProps extends SelectUser {
  rank: number | string
  children: ReactNode
}

function RankingFragment(props: RankingFragmentProps) {
  const { id, class: gameClass, children, name, image, rank } = props

  return (
    <li className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0">
      <p
        className={cn(
          "mr-1 text-xl font-semibold",
          getClassByPosition(Number(rank))
        )}
      >
        #{rank}
      </p>

      <Avatar fallbackText={name} src={image} />
      <div className="flex flex-col gap-2 leading-none">
        <Link
          className={cn("hover:underline focus-visible:underline")}
          href={PATHS.MEMBRO.ID({ UUID: id })}
          target="_blank"
        >
          <h3 className="text-base font-semibold">{name}</h3>
        </Link>
        <p className="flex items-center gap-2">
          {translateGameClass(gameClass)}
        </p>
      </div>

      {children}
    </li>
  )
}

export { RankingFragment }

function getClassByPosition(position: number) {
  switch (position) {
    case 1:
      return "text-[#C4A747]"
    case 2:
      return "text-[#C0C0C0]"
    case 3:
      return "text-[#CD7F32]"
    default:
      return "text-neutral-400"
  }
}
