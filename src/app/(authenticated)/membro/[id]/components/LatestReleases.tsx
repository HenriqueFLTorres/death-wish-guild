import Image from "next/image"
function LatestReleases() {
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="flex gap-1">
          <div className="relative grid h-10 w-10 place-items-center">
            <Image
              alt=""
              height={40}
              src="/item-frame.svg"
              width={40}
              unoptimized
            />
            <Image
              alt=""
              className="absolute"
              height={38}
              src="/crossbow.webp"
              width={38}
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              Queen Bellandir's Annihilation Crossbow
            </h2>
            <p className="text-xs text-neutral-400">Heavy Attack Chance</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="text-neutral-400">realizado a </p>
          <p>37 minutos atrás</p>
        </div>
      </div>
      <hr className="my-2 border-neutral-800" />
    </div>
  )
}

export { LatestReleases }
