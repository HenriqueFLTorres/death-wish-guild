"use client"

import {
  Backpack,
  Crown,
  LayoutDashboard,
  type LucideIcon,
  Scale,
  ScrollText,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSession } from "next-auth/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavegationLink = {
  icon: LucideIcon
  label: string
  path: string
}

const links: NavegationLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Users,
    label: "Grupos",
    path: "/grupos",
  },
  {
    icon: Crown,
    label: "Ranking",
    path: "/ranking",
  },
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

const Navbar = () => {
  const { data: session, status } = useSession()

  const pathname = usePathname()

  return (
    <div className="flex w-full items-center justify-center bg-gradient-to-r from-neutral-900 to-neutral-800">
      <nav className="flex h-16 w-full max-w-screen-xl items-center justify-around">
        <ul className="flex gap-3">
          {links.map(({ icon: Icon, label, path }) => (
            <li key={label}>
              <Link
                className={cn(
                  buttonVariants({
                    variant: pathname.includes(path) ? "default" : "secondary",
                  })
                )}
                href={path}
              >
                <Icon className="stroke-neutral-100" />
                <span className="text-with-gradient bg-gradient-to-b from-white to-neutral-300 font-semibold">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <Image
              alt={`${session?.user?.name} logo`}
              className="h-10 w-10 rounded-full border-2 border-primary object-cover drop-shadow-[0_0_4px_#7B53A7]"
              height={40}
              src={session?.user?.image ?? "/avatar/variant-1.png"}
              width={40}
            />

            <a href="/api/auth/signout">Deslogar</a>
          </div>
        ) : (
          <a href="/auth/signin">Logar</a>
        )}
      </nav>
    </div>
  )
}

export { Navbar }
