import { Avatar } from "@/components/ui/avatar"
import { SelectUser } from "@/db/schema"

function Ranking({
  playersByPoints,
  typeScore,
  PositionRankingMember,
  user,
}: {
  playersByPoints: SelectUser[]
  typeScore: string
  PositionRankingMember: string | undefined
  user: SelectUser
}) {
  return (
    <div className="px-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#C4A747]">#1</h1>
            <div className="flex gap-2">
              <Avatar
                fallbackText="imagem avatar"
                size={40}
                src="/avatar/variant-1.png"
              />
              <div>
                <h2 className="text-sm font-semibold">
                  {playersByPoints[0].name}
                </h2>
                <p className="text-xs">{playersByPoints[0].class}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">{typeScore}</p>
            <h2 className="text-xs font-semibold">
              {playersByPoints[0].points}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#C0C0C0]">#2</h1>
            <div className="flex gap-2">
              <Avatar
                fallbackText="imagem avatar"
                size={40}
                src="/avatar/variant-1.png"
              />
              <div>
                <h2 className="text-sm font-semibold">
                  {playersByPoints[1].name}
                </h2>
                <p className="text-xs">{playersByPoints[1].class}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">{typeScore}</p>
            <h2 className="text-xs font-semibold">
              {playersByPoints[1].points}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#CD7F32]">#3</h1>
            <div className="flex gap-2">
              <Avatar
                fallbackText="imagem avatar"
                size={40}
                src="/avatar/variant-1.png"
              />
              <div>
                <h2 className="text-sm font-semibold">
                  {playersByPoints[2].name}
                </h2>
                <p className="text-xs">{playersByPoints[2].class}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">{typeScore}</p>
            <h2 className="text-xs font-semibold">
              {playersByPoints[2].points}
            </h2>
          </div>
        </div>
      </div>
      <hr className="my-5 border-neutral-800" />
      <div className="mb-3 grid grid-cols-2">
        <div className="flex items-center gap-3">
          <h1
            className={`text-xl font-semibold ${getClassByPosition(Number(PositionRankingMember))}`}
          >
            #{PositionRankingMember}
          </h1>
          <div className="flex gap-2">
            <Avatar
              fallbackText="imagem avatar"
              size={40}
              src="/avatar/variant-1.png"
            />
            <div>
              <h2 className="text-sm font-semibold">{user.name}</h2>
              <p className="text-xs">{user.class}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs">{typeScore}</p>
          <h2 className="text-xs font-semibold">{user.points}</h2>
        </div>
      </div>
    </div>
  )
}

export { Ranking }

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
