import { type VariantProps, cva } from "class-variance-authority"
import { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-black/60 px-2 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black/40 text-neutral-50",
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
