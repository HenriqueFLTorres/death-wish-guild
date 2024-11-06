import { Plus } from "lucide-react"
import { AuctionForm } from "./NewAuctionForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function NewAuction() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="absolute bottom-5 right-5 h-10 w-10 rounded-full p-1">
          <Plus className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Novo item</DialogTitle>
        <AuctionForm item_id="1" />
      </DialogContent>
    </Dialog>
  )
}
