import { Scale } from "lucide-react"
import { ItemType } from "../../_components/RecentDrops"
import { AuctionForm } from "./AuctionForm"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AuctionProps {
  item: ItemType
}

function NewAuctionModal(props: AuctionProps) {
  return (
    <>
      <DialogTitle>
        <Scale /> <p>Criar novo Leilão para o item - {props.item.name}</p>
      </DialogTitle>
      <AuctionForm item_id={props.item.id} />
    </>
  )
}

function AuctionDetails(props: AuctionProps) {
  return (
    <DialogTitle>
      <Scale /> <p>Deatlahes do Leilão</p>
    </DialogTitle>
  )
}

export function AuctionModalTrigger(props: AuctionProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "secondary-flat",
          size: "icon",
        })}
      >
        <Scale size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        {props.item.auction_id ? (
          <dl>
            <NewAuctionModal item={props.item} />
          </dl>
        ) : (
          <AuctionDetails item={props.item} />
        )}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
