import {
  Backpack,
  Crown,
  LayoutDashboard,
  type LucideIcon,
  Scale,
  ScrollText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavegationLink = {
  icon: LucideIcon;
  label: string;
};

const links: NavegationLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    icon: Users,
    label: "Grupos",
  },
  {
    icon: Crown,
    label: "Ranking",
  },
  {
    icon: Backpack,
    label: "Gerenciar Items",
  },
  {
    icon: Scale,
    label: "Leilão",
  },
  {
    icon: ScrollText,
    label: "Log de Eventos",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-neutral-950">
      <nav className="bg-gradient-to-r from-neutral-900 to-neutral-800 h-16 w-full flex items-center justify-around">
        <ul className="flex gap-3">
          {links.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Button variant={label === "Grupos" ? "default" : "secondary"}>
                <Icon className="stroke-neutral-100" />
                <span className="text-with-gradient font-medium">{label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
