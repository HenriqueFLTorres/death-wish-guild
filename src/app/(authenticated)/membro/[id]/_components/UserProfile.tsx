"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Copy } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { EditUserForm, editProfileSchema } from "./EditUserForm"
import { getIconByClass } from "@/app/(authenticated)/eventos/[id]/_components/PlayerListItem"
import { Discord } from "@/components/icons/Discord"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SelectUser } from "@/db/schema"
import { translateGameClass } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

function UserProfile() {
  const { data } = useSession()
  const { id } = useParams<{ id: string }>()

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
  })

  const { reset } = form

  const { data: user } = trpc.getUser.useQuery(
    { userID: id },
    {
      onSuccess: (data) =>
        reset({
          class: data.class,
          name: data.name ?? "",
          image: data.image,
        }),
    }
  )

  const { mutate: updateUser } = trpc.updateUserInfo.useMutation()

  if (user == null) return null

  const ClassIcon = getIconByClass(user.class)
  const isMyProfile = data?.user.id === id

  const onSubmit = (data: z.infer<typeof editProfileSchema>) => updateUser(data)

  return (
    <section className="relative col-span-2 flex w-full max-w-3xl flex-col gap-8 overflow-hidden rounded-lg border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-900/50 p-4 text-neutral-100 shadow-xl">
      <div className="relative z-10 flex w-full gap-4">
        <Avatar
          className="[&>span]:text-xl"
          fallbackText={user.name}
          size={92}
          src={user.image}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl">{user?.name}</h1>
          <Badge className="w-max">{user?.role}</Badge>

          <span className="flex items-center gap-2 text-sm">
            <ClassIcon className="fill-white" />
            {translateGameClass(user.class)}
          </span>
        </div>

        <div className="ml-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <Discord />
              {user.name}
            </span>
            <Button size="icon" variant="secondary-flat">
              <Copy size={16} />
            </Button>
          </div>
          <InvitedBy invitedBy={user.invitedBy} />
        </div>
      </div>

      <Image
        alt=""
        className="fade-to-bottom absolute top-0 w-full scale-110 object-cover opacity-50 blur-xl"
        height={200}
        src="/background-3.png"
        width={400}
      />

      {isMyProfile ? <EditUserForm form={form} onSubmit={onSubmit} /> : null}

      <hr className="border-neutral-800" />
    </section>
  )
}

export { UserProfile }

interface InvitedByProps {
  invitedBy: SelectUser
}

function InvitedBy(props: InvitedByProps) {
  const { invitedBy } = props

  if (invitedBy == null) return null

  return (
    <dl className="flex flex-col items-end gap-2 text-end">
      <dt className="text-sm text-neutral-400">convidado por</dt>
      <dt className="flex items-center gap-2 font-bold">
        <Avatar fallbackText="" size={24} src={invitedBy.image} />
        {invitedBy.name}
      </dt>
    </dl>
  )
}
