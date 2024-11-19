"use client"

import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useOrganization,
  useSession,
} from "@clerk/nextjs"
import {
  Backpack,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  type LucideIcon,
  Scale,
  ScrollText,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useState } from "react"
import { MessageOfTheDay } from "./MessageOfTheDay"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc-client/client"

type NavegationLink = {
  icon: LucideIcon
  label: string
  path: string
}

const links: NavegationLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: CalendarDays,
    label: "Eventos",
    path: "/eventos",
  },
  {
    icon: Users,
    label: "Membros",
    path: "/membros",
  },
  // {
  //   icon: Crown,
  //   label: "Ranking",
  //   path: "/ranking",
  // },
  {
    icon: Backpack,
    label: "Gerenciar Items",
    path: "/gerenciar-items",
  },
  {
    icon: Scale,
    label: "Leilão",
    path: "/leilao",
  },
  {
    icon: ScrollText,
    label: "Log de Eventos",
    path: "/log-de-eventos",
  },
]

const Sidebar = () => {
  const [isMouseOver, setIsMouseOver] = useState(false)

  const { session } = useSession()
  const { data: eventsCount = 0 } = trpc.events.getTodaysEventsCount.useQuery()

  return (
    <aside
      className={cn(
        "fixed left-0 z-50 flex h-screen w-14 flex-col items-center justify-between border-r border-black/40 bg-black/40 pb-4 backdrop-blur-md transition-[width] duration-300",
        { "w-64": isMouseOver }
      )}
      onMouseLeave={() => setIsMouseOver(false)}
      onMouseOver={() => setIsMouseOver(true)}
    >
      <div className="relative flex w-full flex-col items-center overflow-x-clip px-2.5 pt-4">
        <Image
          alt=""
          className={cn(
            "absolute z-[-1] h-64 w-full -translate-y-full scale-125 opacity-40 blur-xl transition-transform duration-300",
            {
              "translate-y-0": isMouseOver,
            }
          )}
          height={64}
          src="/death-wish-logo.png"
          width={64}
        />

        <Image
          alt="death wish logo"
          className={cn(
            "mb-3 h-9 w-9 rounded transition-[width,_height] duration-300",
            {
              "h-16 w-16": isMouseOver,
            }
          )}
          height={64}
          src="/death-wish-logo.png"
          width={64}
        />

        <h2
          className="mb-0 h-0 w-full overflow-hidden text-center text-base font-semibold text-white opacity-0 drop-shadow-md transition-all duration-300 data-[isover=true]:mb-3 data-[isover=true]:h-5 data-[isover=true]:opacity-100"
          data-isover={isMouseOver}
        >
          DeathWish
        </h2>

        <Button
          className="relative mb-3 h-9 w-9 overflow-hidden border-2 p-0 duration-300 data-[isover=true]:h-10 data-[isover=true]:w-full"
          data-isover={isMouseOver}
        >
          <span
            className="absolute transition-transform duration-300 data-[isover=true]:translate-y-6"
            data-isover={isMouseOver}
          >
            {eventsCount}
          </span>
          <span
            className="absolute flex -translate-y-6 items-center gap-3 transition-transform duration-300 data-[isover=true]:translate-y-0"
            data-isover={isMouseOver}
          >
            <CalendarRange size={24} /> {eventsCount} Eventos hoje
          </span>
        </Button>

        <MessageOfTheDay
          isAdmin={session?.user.publicMetadata?.role === "ADMIN"}
          isMouseOver={isMouseOver}
        />
      </div>

      <ul className="absolute top-1/2 flex w-full -translate-y-1/3 flex-col gap-3 px-2.5">
        {links.map((props) => (
          <NavLink isMouseOver={isMouseOver} key={props.label} {...props} />
        ))}
      </ul>

      <div className="flex w-full flex-col items-start gap-4 overflow-hidden px-1">
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <div className="flex items-center gap-2 px-2">
          <SignedIn>
            <UserButton
              appearance={{
                elements: { userButtonTrigger: "[&>span]:flex-row-reverse" },
              }}
              showName
            />
          </SignedIn>
        </div>

        <OrganizationSwitcher />
      </div>
    </aside>
  )
}

export { Sidebar }

interface NavLinkProps extends NavegationLink {
  isMouseOver: boolean
}

function NavLink(props: NavLinkProps) {
  const { icon: Icon, label, path, isMouseOver } = props

  const pathname = usePathname()

  const isInPath =
    (path === "/" && pathname === "/") ||
    (pathname.includes(path) && path !== "/")

  return (
    <li className="w-full" key={label}>
      <Link
        className={cn(
          buttonVariants({
            variant: isInPath ? "primary" : "secondary",
            className:
              "h-9 w-full justify-start overflow-hidden p-0 px-1.5 duration-300",
          }),
          { "px-2.5": isMouseOver }
        )}
        href={path}
      >
        <Icon className="shrink-0 stroke-neutral-100" size={20} />
        <span className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 font-semibold">
          {label}
        </span>
      </Link>
    </li>
  )
}
