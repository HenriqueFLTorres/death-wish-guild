import { zodResolver } from "@hookform/resolvers/zod"
import { Gavel, Plus, RefreshCw, TextSearch } from "lucide-react"
import { millify } from "millify"
import moment from "moment"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { UseFormReturn, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { AuctionType } from "../page"
import { Avatar } from "@/components/ui/avatar"
import { BadgeProps } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { NumberInput } from "@/components/ui/number-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectUser } from "@/db/schema"
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

  const utils = trpc.useUtils()
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
    onError: async (_, __, context) => {
      utils.auctions.getBidHistory.setData(
        { auctionID },
        context?.previousBidHistory
      )
      await utils.auctions.getAuction.invalidate({ auctionID })
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
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-4 border-b pb-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&_dt]:text-sm [&_dt]:text-neutral-500">
        <div>
          <dt>Início do leilão</dt>
          <dd className="flex gap-2">
            {moment.utc(auction.start_time).fromNow()}
          </dd>
        </div>
        <div>
          <dt>Termino do leilão</dt>
          <dd className="flex items-center gap-2">
            {moment.utc(auction.end_time).fromNow()}
          </dd>
        </div>
      </dl>

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
                      currentAmount < (auction.current_max_bid ?? 0)
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

        <BidHistoryTable bidHistory={bidHistory} />
      </div>
    </DialogContent>
  )
}

type BidHistoryReturn = RouterOutput["auctions"]["getBidHistory"]

interface BidHistoryTableProps {
  bidHistory: BidHistoryReturn
}

function BidHistoryTable(props: BidHistoryTableProps) {
  const { bidHistory } = props

  return (
    <ScrollArea className="h-full">
      <ol className="flex max-h-[10rem] flex-col gap-3">
        {bidHistory.map((bid, index) => (
          <li
            className="grid grid-cols-3 items-center justify-items-center pt-3 first:pt-0"
            key={index}
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
          </li>
        ))}
      </ol>
    </ScrollArea>
  )
}

const getAuctionStatusVariant = (status: AuctionType["status"]) => {
  return {
    variant: statusToVariant[status],
    translation: statusToText[status],
  }
}

const statusToText: Record<AuctionType["status"], string> = {
  OPEN: "Aberto",
  FINISHED: "Finalizado",
  CANCELED: "Cancelado",
}

const statusToVariant: Record<AuctionType["status"], BadgeProps["variant"]> = {
  OPEN: "success",
  FINISHED: "primary",
  CANCELED: "error",
}
