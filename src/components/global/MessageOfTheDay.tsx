import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Edit2, OctagonAlert } from "lucide-react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Form, FormField, FormItem, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

interface MessageOfTheDayProps {
  isMouseOver: boolean
  isAdmin: boolean
}

const editMessageSchema = z.object({ message_of_the_day: z.string().nullish() })

function MessageOfTheDay(props: MessageOfTheDayProps) {
  const { isMouseOver, isAdmin } = props

  const [isEditOpen, setIsEditOpen] = useState(false)

  const form = useForm<z.infer<typeof editMessageSchema>>({
    resolver: zodResolver(editMessageSchema),
  })

  const utils = trpc.useUtils()

  const { data: messageOfTheDay } = trpc.guild.getMessageOfTheDay.useQuery(
    undefined,
    { onSuccess: (data) => form.reset({ message_of_the_day: data }) }
  )

  const { mutate: updateMessage } =
    trpc.guild.updateMessageOfTheDay.useMutation({
      onMutate: async (newMessage) => {
        await utils.guild.getMessageOfTheDay.cancel()

        const previousMessage = utils.guild.getMessageOfTheDay.getData()

        utils.guild.getMessageOfTheDay.setData(
          undefined,
          newMessage.message_of_the_day
        )

        return { previousMessage }
      },
      onError: (_, __, context) => {
        utils.guild.getMessageOfTheDay.setData(
          undefined,
          context?.previousMessage
        )
      },
      onSuccess: () => setIsEditOpen(false),
    })

  const onSubmit = (values: z.infer<typeof editMessageSchema>) => {
    updateMessage({ message_of_the_day: values.message_of_the_day })
  }

  return (
    <div
      className="flex w-full min-w-[calc(16rem-1.5rem)] -translate-x-full flex-col items-center gap-3 rounded-lg border border-black/60 bg-black/40 p-3 opacity-0 transition-[opacity,_transform] duration-300 hover:z-10 data-[isover=true]:translate-x-0 data-[isover=true]:opacity-100"
      data-isover={isMouseOver}
    >
      <OctagonAlert size={24} />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "absolute right-2 top-2",
              isAdmin ? "flex" : "hidden"
            )}
            size="icon"
            variant="secondary-flat"
          >
            <Edit2 size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Editar Mensagem da Guilda</DialogTitle>
          <DialogDescription className="text-sm text-neutral-300">
            Edite a mensagem que aparece na sidebar do site. Salve vazia para
            remover a mensagem.
          </DialogDescription>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="message_of_the_day"
                render={({ field }) => (
                  <FormItem>
                    <Textarea {...field} value={field.value ?? ""} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose>
                  <Button variant="secondary-flat">Cancelar</Button>
                </DialogClose>
                <Button type="submit" variant="primary-flat">
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <p className="whitespace-pre-wrap text-center text-sm font-medium text-neutral-100">
        {messageOfTheDay}
      </p>
    </div>
  )
}

export { MessageOfTheDay }
