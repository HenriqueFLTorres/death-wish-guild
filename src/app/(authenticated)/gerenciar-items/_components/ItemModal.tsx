import { Swords } from "lucide-react"
import { useState } from "react"
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle>
          <Swords /> <p>Adicionar Item</p>
        </DialogTitle>
        <dl>
          <ItemForm setIsOpen={setIsOpen} />
        </dl>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
