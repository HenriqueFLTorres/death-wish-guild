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
      <DialogTrigger asChild>
        <Button variant="outline">Novo Lance</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Novo Lance</DialogTitle>
        <AuctionForm />
      </DialogContent>
    </Dialog>
  )
}
