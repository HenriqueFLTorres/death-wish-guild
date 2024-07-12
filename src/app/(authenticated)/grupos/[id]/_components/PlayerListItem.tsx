import { Cross, Shield, Sword } from "lucide-react"
import Image from "next/image"
import { type HTMLAttributes, forwardRef, memo } from "react"
import { RangedDPS } from "@/components/icons/RangedDPS"
import type { SelectUser } from "@/db/schema"
import { cn } from "@/lib/utils"

type PlayerListItemProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> &
  Pick<SelectUser, "name" | "class" | "image" | "id">

const PlayerListItemComponent = forwardRef<HTMLDivElement, PlayerListItemProps>(
  (props, ref) => {
    const { name, class: gameRole, image, className, ...otherProps } = props

    const ClassIcon = getIconByClass(gameRole)

    return (
      <div
        className={cn(
          "relative flex h-8 shrink-0 items-center gap-2 overflow-hidden rounded-full border-2 border-black/10 bg-black/20 px-2 py-1",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <Image
          alt=""
          className="relative z-10 h-6 w-6 rounded-full object-cover"
          height={24}
          src={image ?? ""}
          width={24}
        />

        <Image
          alt=""
          className="absolute left-2 z-0 blur-md"
          height={36}
          src="/avatar/variant-1.png"
          width={36}
        />

        <p className="text-with-gradient relative z-10 bg-gradient-to-b from-white to-neutral-300 text-sm font-medium">
          {name}
        </p>

        <span className="relative z-10 ml-auto grid shrink-0 place-items-center">
          <ClassIcon className="fill-white" size={20} />
        </span>

        <span
          className={cn(
            "absolute right-0 z-[0] h-full w-24 translate-x-1/2 blur-lg",
            getClassColor(gameRole)
          )}
          aria-hidden
        />
      </div>
    )
  }
)
PlayerListItemComponent.displayName = "PlayerListItem"

const PlayerListItem = memo(PlayerListItemComponent)

export { PlayerListItem }

export function getIconByClass(gameClass: SelectUser["class"]) {
  switch (gameClass) {
    case "DPS":
      return Sword
    case "RANGED_DPS":
      return RangedDPS
    case "TANK":
      return Shield
    case "SUPPORT":
      return Cross
    default:
      return Sword
  }
}

export function getClassColor(gameClass: SelectUser["class"]) {
  switch (gameClass) {
    case "DPS":
      return "bg-red-700/50"
    case "RANGED_DPS":
      return "bg-purple-700/50"
    case "TANK":
      return "bg-sky-700/50"
    case "SUPPORT":
      return "bg-emerald-700/50"
    default:
      return "bg-red-700/50"
  }
}
