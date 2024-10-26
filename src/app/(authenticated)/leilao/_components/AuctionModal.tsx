import { Scale } from "lucide-react"
import { ItemType } from "../../_components/RecentDrops"
import { AuctionForm } from "./AuctionForm"
import { Button } from "@/components/ui/button"
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

function AuctionDetails() {
  return (
    <DialogTitle>
      <Scale /> <p>Deatlahes do Leilão</p>
    </DialogTitle>
  )
}

export function AuctionModalTrigger(props: AuctionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary-flat">
          <Scale size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        {props.item.auction_id == null ? (
          <AuctionDetails />
        ) : (
          <dl>
            <NewAuctionModal item={props.item} />
          </dl>
        )}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
