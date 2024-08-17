import Image from "next/image"
function ActivityHistory() {
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="flex gap-2">
          <Image
            alt=""
            className="flex shrink-0 object-contain"
            height={40}
            src="/event-icon/blood-mushroom-gathering.png"
            width={40}
            unoptimized
          />
          <div>
            <h2 className="font-semibold">Blood Mushroom Gathering</h2>
            <div className="flex gap-2">
              <Image
                alt=""
                height={16}
                src="/event-indicator/guild.png"
                width={16}
              />
              <p className="text-sm">Conflict</p>
            </div>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="text-neutral-400">finalizado a </p>
          <p>37 minutos atrás</p>
        </div>
      </div>
      <hr className="my-2 border-neutral-800" />
    </div>
  )
}

export { ActivityHistory }
