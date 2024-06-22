import {
  Backpack,
  Crown,
  LayoutDashboard,
  type LucideIcon,
  Scale,
  ScrollText,
  Users,
} from "lucide-react"

import Link from "next/link"
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
    path: "/leilão",
  },
  {
    icon: ScrollText,
    label: "Log de Eventos",
    path: "/log-de-eventos",
  },
]

const Navbar = () => (
  <nav className="flex h-16 w-full items-center justify-around bg-gradient-to-r from-neutral-900 to-neutral-800">
    <ul className="flex gap-3">
      {links.map(({ icon: Icon, label, path }) => (
        <li key={label}>
          <Link
            className={cn(
              buttonVariants({
                variant: label === "Grupos" ? "default" : "secondary",
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
  </nav>
)

export { Navbar }
