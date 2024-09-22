import { type VariantProps, cva } from "class-variance-authority"
import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-violet-600/20 border-violet-600/40",
        neutral: "bg-neutral-600/20 border-neutral-600/40",
        success: "bg-green-600/20 border-green-600/40",
        error: "bg-red-600/20 border-red-600/40",
        warning: "bg-amber-600/20 border-amber-600/40",
        sky: "bg-sky-600/20 border-sky-600/40",
      },
    },
    defaultVariants: {
      variant: "neutral",
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
