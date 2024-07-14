"use client"

import {
  BookLock,
  CircleAlert,
  LayoutDashboard,
  type LucideIcon,
  Users,
} from "lucide-react"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"

import { useSession } from "next-auth/react"
import { Avatar } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavegationLink = {
  icon: LucideIcon
  label: string
  path: string
  isAdmin: boolean
}

const links: NavegationLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    isAdmin: false,
  },
  {
    icon: Users,
    label: "Grupos",
    path: "/grupos",
    isAdmin: false,
  },
  // {
  //   icon: Crown,
  //   label: "Ranking",
  //   path: "/ranking",
  // },
  // {
  //   icon: Backpack,
  //   label: "Gerenciar Items",
  //   path: "/gerenciar-items",
  // },
  // {
  //   icon: Scale,
  //   label: "Leilão",
  //   path: "/leilao",
  // },
  // {
  //   icon: ScrollText,
  //   label: "Log de Eventos",
  //   path: "/log-de-eventos",
  // },
  {
    icon: BookLock,
    label: "Admin Dashboard",
    path: "/admin",
    isAdmin: true,
  },
]

const Navbar = () => {
  const { data: session, status } = useSession()

  if (status === "unauthenticated") redirect("/auth/signin")

  const isUserAdmin = session?.user.role === "ADMIN"

  return (
    <>
      <div className="flex w-full items-center justify-center bg-gradient-to-r from-neutral-900 to-neutral-800">
        <nav className="flex h-16 w-full max-w-screen-xl items-center justify-around">
          <ul className="flex gap-3">
            {links.map((props) => (
              <NavLink isUserAdmin={isUserAdmin} key={props.label} {...props} />
            ))}
          </ul>

          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Avatar
                className="border-2 border-primary object-cover drop-shadow-[0_0_4px_#7B53A7]"
                fallbackText={session.user.name}
                src={session.user.image}
              />

              <a href="/api/auth/signout">Deslogar</a>
            </div>
          ) : (
            <a href="/auth/signin">Logar</a>
          )}
        </nav>
      </div>
      {session?.user.isBoarded === false ? <NotBoardedWarning /> : null}
    </>
  )
}

export { Navbar }

interface NavLinkProps extends NavegationLink {
  isUserAdmin: boolean
}

function NavLink(props: NavLinkProps) {
  const { icon: Icon, label, path, isAdmin, isUserAdmin } = props

  const pathname = usePathname()

  if (isAdmin && !isUserAdmin) return null

  const isInPath =
    (path === "/" && pathname === "/") ||
    (pathname.includes(path) && path !== "/")

  return (
    <li key={label}>
      <Link
        className={cn(
          buttonVariants({
            variant: isInPath ? "default" : "secondary",
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
  )
}

function NotBoardedWarning() {
  return (
    <div className="fixed top-20 flex items-center gap-3 rounded-md border border-amber-400 bg-amber-400/20 px-3 py-2 backdrop-blur">
      <CircleAlert className="stroke-amber-400" size={24} />
      <p className="text-sm">
        Você ainda não terminou o seu registro e terás acesso limitado à
        plataforma,{" "}
        <Link className="underline" href="/auth/onboarding">
          clique aqui
        </Link>{" "}
        para finaliza-lo
      </p>
    </div>
  )
}
