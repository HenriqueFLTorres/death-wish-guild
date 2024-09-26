"use client"

import { BookCheck } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface FinishEventAlertProps {
  onAction: () => void
}

function FinishEventAlert(props: FinishEventAlertProps) {
  const { onAction } = props

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mt-auto">
          <BookCheck />
          Finalizar Evento
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalizar um Evento</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, cada membro definido como presente receberá uma
            quantia em DKPoints e terá o registro deste evento em seu perfil.
            Esta ação não pode ser revertida, deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { FinishEventAlert }
