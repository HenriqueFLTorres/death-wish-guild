import type { UniqueIdentifier } from "@dnd-kit/core"
import { Sword } from "lucide-react"
import Image from "next/image"
import { type HTMLAttributes, forwardRef, memo } from "react"

interface PlayerListItemProps extends HTMLAttributes<HTMLDivElement> {
  id: UniqueIdentifier
  isPlaceholder: boolean
}

const PlayerListItemComponent = forwardRef<HTMLDivElement, PlayerListItemProps>(
  (props, ref) => {
    const { id, isPlaceholder, ...otherProps } = props

    if (isPlaceholder)
      return (
        <div
          className="flex h-8 w-full rounded-full bg-pink-400/10"
          id={id}
          ref={ref}
          aria-hidden
        />
      )

    return (
      <div
        className="relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-full border-2 border-black/10 bg-black/20 px-2 py-1"
        ref={ref}
        {...otherProps}
      >
        <Image
          alt=""
          className="relative z-10 h-6 w-6 rounded-full object-cover"
          height={24}
          src="/avatar/variant-1.png"
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
          SpamTaxota
        </p>

        {id}

        <Sword className="relative z-10 ml-auto fill-white" size={20} />

        <span
          className="absolute right-0 z-[0] h-full w-24 translate-x-1/2 bg-red-900/50 blur-lg"
          aria-hidden
        />
      </div>
    )
  }
)
PlayerListItemComponent.displayName = "PlayerListItem"

const PlayerListItem = memo(PlayerListItemComponent)

export { PlayerListItem }
