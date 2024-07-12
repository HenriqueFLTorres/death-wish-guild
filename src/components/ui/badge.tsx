import { type VariantProps, cva } from "class-variance-authority"
import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-primary-400 border-primary-600 to-primary-600 text-white",
        default: "bg-black/40 text-neutral-50 border-black/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
