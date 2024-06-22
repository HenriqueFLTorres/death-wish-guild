import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { PlayerListItem } from "./PlayerListItem"

interface GroupCardProps {
  hasMe: boolean
}

function GroupCard(props: GroupCardProps) {
  const { hasMe } = props

  return (
    <li
      className="flex w-64 flex-col gap-4 rounded border-2 border-black/30 bg-black/60 from-primary-700/40 to-primary-500/40 p-3 backdrop-blur-xl data-[hasMe='true']:border-primary/50 data-[hasMe='true']:bg-gradient-to-b"
      data-hasMe={hasMe}
    >
      <div className="flex w-full justify-between">
        <h3 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 font-bold">
          Grupo 1 {hasMe ? "(Meu grupo)" : ""}
        </h3>

        <small>Cheio</small>
      </div>

      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage alt="" size={40} src="/avatar/variant-1.png" />
        </Avatar>
        <div className="flex flex-col text-left">
          <p className="text-xs text-neutral-400">Líder</p>
          <h4 className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 text-sm font-bold">
            Alan Bida
          </h4>
        </div>
      </div>

      <ol className="flex flex-col gap-1">
        <PlayerListItem />
        <PlayerListItem />
        <PlayerListItem />
        <PlayerListItem />
        <PlayerListItem />
      </ol>
    </li>
  )
}

export { GroupCard }
