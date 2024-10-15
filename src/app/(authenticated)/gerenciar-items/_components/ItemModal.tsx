import { Swords } from "lucide-react"
import { ItemForm } from "./ItemForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ItemModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle>
          <Swords /> <p>Adicionar Item</p>
        </DialogTitle>
        <dl>
          <ItemForm />
        </dl>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
