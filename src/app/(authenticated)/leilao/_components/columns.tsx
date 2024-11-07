"use client"

import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import Image from "next/image"
import { AuctionType } from "../page"
import { AuctionModal, getAuctionVariant } from "./AuctionModal"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<AuctionType>[] = [
  {
    accessorKey: "item_id",
    header: "Item",
    enableHiding: false,
    cell: ({ row }) => (
      <li className="flex items-center gap-2 px-0.5 py-2.5 text-sm first-of-type:pt-0 last-of-type:pb-0">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center">
          <Image alt="" height={40} src="/item-frame.svg" width={40} />
          <Image
            alt=""
            className="absolute"
            height={38}
            src="/crossbow.webp"
            width={38}
          />
        </div>
        <div className="flex h-10 flex-col justify-between overflow-hidden">
          <h2
            className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-none"
            title={row.original.item.name}
          >
            {row.original.item.name}
          </h2>
          <Badge className="h-5 w-max rounded font-normal" variant="neutral">
            {row.original.item.trait}
          </Badge>
        </div>
      </li>
    ),
  },
  {
    accessorKey: "current_max_bid",
    header: "Lance Máximo",
    cell: ({ row }) => <p>{row.original.current_max_bid ?? "-"}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { variant, translation } = getAuctionVariant(row.original)

      return <Badge variant={variant}>{translation}</Badge>
    },
  },
  {
    accessorKey: "end_time",
    header: "Termina Em",
    cell: ({ row }) => <p>{moment.utc(row.original.end_time).fromNow()}</p>,
  },
  {
    accessorKey: "details",
    header: "Detalhes",
    enableHiding: false,
    cell: ({ row }) => <AuctionModal auctionID={row.original.id} />,
  },
]
