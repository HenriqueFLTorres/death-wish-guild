import { UUID } from "crypto"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  EllipsisVertical,
  Gavel,
  Plus,
  RefreshCw,
  TextSearch,
  X,
} from "lucide-react"
import { millify } from "millify"
import moment from "moment"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { UseFormReturn, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { AuctionType } from "../page"
import { statusTypes } from "./columns"
import { ClassDisplay } from "./CreateAuction"
import { Avatar } from "@/components/ui/avatar"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { NumberInput } from "@/components/ui/number-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectUser } from "@/db/schema"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { RouterOutput, trpc } from "@/trpc-client/client"

interface AuctionModalProps {
  auctionID: string
}

const bidFormSchema = z.object({
  amount: z.number().min(0, "O lance deve ser maior que zero"),
})

type BidFormValues = z.infer<typeof bidFormSchema>

function AuctionModal(props: AuctionModalProps) {
  const { auctionID } = props

  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema),
  })

  const { data: auction, isLoading } = trpc.auctions.getAuction.useQuery({
    auctionID,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "secondary-flat",
          size: "icon",
        })}
      >
        <TextSearch size={16} />
      </DialogTrigger>
      {isLoading || auction == null ? (
        <div>Loading...</div>
      ) : (
        <AuctionContent auction={auction} form={form} isOpen={isOpen} />
      )}
    </Dialog>
  )
}

export { AuctionModal, getAuctionStatusVariant as getAuctionVariant }

interface AuctionContentProps {
  auction: AuctionType
  form: UseFormReturn<BidFormValues>
  isOpen: boolean
}

function AuctionContent(props: AuctionContentProps) {
  const { auction, form, isOpen } = props

  const auctionID = auction.id

  const { toast } = useToast()

  const currentAmount = useWatch({ control: form.control, name: "amount" })

  const { data: bidHistory = [], refetch } =
    trpc.auctions.getBidHistory.useQuery(
      {
        auctionID,
      },
      { enabled: isOpen }
    )

  const { data: session } = useSession()
  const userDKP = session?.user?.points

  const { variant, translation } = getAuctionStatusVariant(auction)

  const utils = trpc.useUtils()
  const forceAuction = trpc.auctions.forceAuction.useMutation({
    onSettled: async () => await utils.auctions.invalidate(),
  })
  const cancelAuction = trpc.auctions.cancelAuction.useMutation({
    onSettled: async () => await utils.auctions.invalidate(),
  })
  const deleteAuction = trpc.auctions.deleteAuction.useMutation({
    onSettled: async () => {
      await utils.auctions.invalidate()
    },
  })
  const endAuction = trpc.auctions.endAuction.useMutation({
    onSettled: async () => await utils.auctions.invalidate(),
  })
  const { mutate: placeBid } = trpc.auctions.placeBid.useMutation({
    onMutate: async (newBid) => {
      await utils.guild.getMessageOfTheDay.cancel()

      const previousBidHistory = utils.auctions.getBidHistory.getData({
        auctionID,
      })

      const user = session?.user
      if (user == null || user.id == null) return
      utils.auctions.getBidHistory.setData({ auctionID }, (prev = []) => [
        {
          user: user as SelectUser,
          amount: newBid.amount,
          user_id: user.id as string,
          bidded_at: new Date().toISOString(),
          id: crypto.randomUUID() as UUID,
        },
        ...prev,
      ])
      utils.auctions.getAuctions.setData(undefined, (prev = []) =>
        prev.map((auction) =>
          auction.id === auctionID
            ? { ...auction, current_max_bid: newBid.amount }
            : auction
        )
      )

      return { previousBidHistory }
    },
    onSettled: async () => await utils.auctions.getBidHistory.invalidate(),
    onSuccess: () => form.reset({ amount: undefined }),
    onError: async (error, __, context) => {
      utils.auctions.getBidHistory.setData(
        { auctionID },
        context?.previousBidHistory
      )

      await utils.auctions.getAuction.invalidate({ auctionID })

      const errorMessage = errorsToMessage[error.message]
      toast({
        title: "Erro ao colocar lance",
        description:
          errorMessage == null
            ? "Ocorreu um erro ao colocar o lance, tente novamente"
            : errorMessage,
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: BidFormValues) => {
    placeBid({
      auctionID,
      amount: values.amount,
    })
  }

  return (
    <DialogContent className="flex min-w-[45rem] flex-col gap-4">
      <header className="flex gap-4">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <Image alt="" height={96} src="/item-frame.svg" width={96} />
          <Image
            alt=""
            className="absolute"
            height={90}
            src="/crossbow.webp"
            width={90}
          />
        </div>
        <div className="flex flex-col gap-1">
          <DialogTitle>
            <h2 className="text-xl">{auction.item.name}</h2>
          </DialogTitle>
          <p className="text-neutral-400">{auction.item.trait}</p>
          <div className="flex gap-1 pt-1 text-zinc-300">
            {auction.class_type?.map((classes) => (
              <ClassDisplay onlyIcon={true} userClass={classes} />
            ))}
          </div>
        </div>
        {session?.user.role === "ADMIN" && (
          <div className="flex flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8">
                <EllipsisVertical size={16} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="divide-y divide-zinc-800 p-1">
                  <p className="p-1">Ações</p>
                  <div>
                    {auction.start_time > new Date().toISOString() ? (
                      <div
                        className="flex cursor-pointer p-1"
                        onClick={() =>
                          forceAuction.mutate({ auctionID: auction.id })
                        }
                      >
                        <p>Abrir Leilão</p>
                      </div>
                    ) : (
                      <p className="p-1 text-zinc-500">Abrir Leilão</p>
                    )}
                    <p className="p-1 text-zinc-500">Re-abrir Leilão</p>
                    {auction.status === "OPEN" ? (
                      <div
                        className="flex cursor-pointer p-1"
                        onClick={() =>
                          endAuction.mutate({ auctionID: auction.id })
                        }
                      >
                        Finalizar Leilão
                      </div>
                    ) : (
                      <p className="p-1 text-zinc-500">Finalizar Leilão</p>
                    )}
                    {auction.status !== "CANCELED" ? (
                      <div
                        className="flex cursor-pointer p-1"
                        onClick={() =>
                          cancelAuction.mutate({ auctionID: auction.id })
                        }
                      >
                        Cancelar Leilão
                      </div>
                    ) : (
                      <p className="p-1 text-zinc-500">Cancelar Leilão</p>
                    )}

                    {session?.user.role === "ADMIN" && (
                      <div
                        className="flex cursor-pointer p-1"
                        onClick={() =>
                          deleteAuction.mutate({ auctionID: auction.id })
                        }
                      >
                        Deletar
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>

      <dl className="grid grid-cols-3 items-center justify-items-center gap-4 border-b pb-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&_dt]:text-sm [&_dt]:text-neutral-500">
        <div>
          <dt>Início do leilão</dt>
          <dd className="flex justify-center gap-2">
            {moment.utc(auction.start_time).fromNow()}
          </dd>
        </div>
        <div>
          <dt>Termino do leilão</dt>
          <dd className="flex justify-center gap-2">
            {moment.utc(auction.end_time).fromNow()}
          </dd>
        </div>
        <div>
          <dd>
            <Badge variant={variant}>{translation}</Badge>
          </dd>
        </div>
      </dl>

      <div>
        {auction.status === "OPEN" && (
          <div className="flex flex-col gap-4">
            <header className="flex justify-between gap-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Gavel size={24} />
                Lances recentes ({bidHistory.length})
              </h3>

              <div className="flex flex-col gap-2">
                <p className="text-end text-xs text-neutral-300">
                  Meu DKP Disponível: {millify(userDKP ?? 0)}
                </p>

                <div className="ml-auto flex items-end gap-3">
                  <Form {...form}>
                    <form
                      className="flex gap-3"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <NumberInput
                              className={cn(
                                "w-36",
                                form.formState.errors.amount &&
                                  "border-red-500 bg-red-500/20"
                              )}
                              defaultValue={
                                auction.current_max_bid !== null
                                  ? auction.current_max_bid + 5
                                  : 0
                              }
                              maxValue={userDKP}
                              minValue={auction.initial_bid}
                              step={5}
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="h-8"
                        disabled={
                          !form.formState.isValid ||
                          form.formState.isSubmitting ||
                          currentAmount <= (auction.current_max_bid ?? 0)
                        }
                        type="submit"
                        variant="primary-flat"
                      >
                        <Plus size={16} /> Colocar Lance
                      </Button>
                    </form>
                  </Form>
                  <Button
                    size="icon"
                    variant="secondary-flat"
                    onClick={() => refetch()}
                  >
                    <RefreshCw size={16} />
                  </Button>
                </div>
              </div>
            </header>

            <BidHistoryTable auctionId={auction.id} bidHistory={bidHistory} />
          </div>
        )}
        {auction.status === "CANCELED" && (
          <div className="flex justify-center gap-2">
            <h3>Leilão Cancelado</h3>
          </div>
        )}
        {auction.status === "FINISHED" && (
          <div className="flex justify-center">
            {bidHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <h3>Sem Vencedor</h3>
                <h2 className="text-zinc-400">
                  O item retornará para o bando da Guild
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <h3>Vencedor</h3>
                <div className="flex items-center justify-center gap-3">
                  <Avatar
                    fallbackText={bidHistory[0].user.name}
                    size={40}
                    src={bidHistory[0].user.image}
                  />
                  <p className="text-base font-semibold">
                    {bidHistory[0].user.name}
                  </p>
                  <p className="flex justify-self-end text-sm">
                    ${millify(bidHistory[0].amount)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  )
}

type BidHistoryReturn = RouterOutput["auctions"]["getBidHistory"]

interface BidHistoryTableProps {
  bidHistory: BidHistoryReturn
  auctionId: string
}

function BidHistoryTable(props: BidHistoryTableProps) {
  const { bidHistory, auctionId } = props

  const utils = trpc.useUtils()
  const deleteBid = trpc.auctions.deleteBid.useMutation({
    onSettled: async () => await utils.auctions.invalidate(),
  })
  const [hover, setHover] = useState(false)
  const [indexn, setIndexn] = useState<number>()
  return (
    <ScrollArea className="h-full">
      <ol className="flex max-h-[10rem] flex-col gap-6">
        {bidHistory.map((bid, index) => (
          <li
            className="relative grid grid-cols-3 items-center justify-items-center"
            key={index}
            onMouseLeave={() => (setHover(false), setIndexn(undefined))}
            onMouseOver={() => (setHover(true), setIndexn(index))}
          >
            <div className="flex items-center gap-3 justify-self-start">
              <Avatar
                fallbackText={bid.user.name}
                size={32}
                src={bid.user.image}
              />
              <p className="text-sm font-semibold">{bid.user.name}</p>
            </div>

            <p className="text-sm">${millify(bid.amount)}</p>

            <p className="text-sm">
              {moment.utc(bid.bidded_at).local().fromNow()}
            </p>
            {hover && index === indexn && (
              <X
                className="absolute right-7 text-zinc-400"
                size={14}
                onClick={() =>
                  deleteBid.mutate({ auctionID: auctionId, bidId: bid.id })
                }
              />
            )}
          </li>
        ))}
      </ol>
    </ScrollArea>
  )
}

const getAuctionStatusVariant = (auction: statusTypes) => {
  const status = getStatus(auction)
  return {
    variant: statusToVariant[status],
    translation: statusToText[status],
  }
}
export const getStatus = (auction: AuctionType) => {
  const localTime = new Date(Date.now()).toISOString()

  if (auction.status === "OPEN") {
    if (auction.start_time > localTime && auction.end_time > localTime) {
      return "PENDING"
    }
    if (auction.start_time < localTime && auction.end_time > localTime) {
      return "OPEN"
    }
    if (auction.start_time < localTime && auction.end_time < localTime) {
      return "AWAITING"
    }
  } else if (auction.status === "FINISHED") {
    return auction.status
  }
  return "CANCELED"
}
interface auctionStatus {
  status: "PENDING" | "OPEN" | "AWAITING" | "FINISHED" | "CANCELED"
}

const statusToText: Record<auctionStatus["status"], string> = {
  OPEN: "Aberto",
  PENDING: "Pendente",
  AWAITING: "Aguardando",
  FINISHED: "Finalizado",
  CANCELED: "Cancelado",
}

const statusToVariant: Record<auctionStatus["status"], BadgeProps["variant"]> =
  {
    OPEN: "success",
    PENDING: "warning",
    AWAITING: "sky",
    FINISHED: "primary",
    CANCELED: "error",
  }

const errorsToMessage: Record<string, string> = {
  INSUFFICIENT_POINTS:
    "Você não possui pontos suficientes para colocar o lance",
  NOT_ALLOWED_CLASS:
    "Você não possui permissão para colocar lance nesse leilão",
  INVALID_BID_AMOUNT:
    "Ooops, parece que alguém já colocou um lance maior que o seu",
}
