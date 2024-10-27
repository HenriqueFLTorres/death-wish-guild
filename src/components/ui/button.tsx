import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center gap-2 justify-center border whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300 ease-in-out transition-all",
  {
    variants: {
      variant: {
        primary: "border-primary primary-button",
        "primary-flat": "border-primary-400 bg-primary-600",
        secondary: "border-secondary secondary-button",
        "secondary-flat": "bg-neutral-800 border-neutral-700 border",
        outline: "border-secondary",
        ghost: "border-none",
        destructive:
          "bg-red-900 text-red-200 border-transparent shadow-sm hover:bg-red-900/80",
      },
      size: {
        default: "h-10 px-3 py-2",
        icon: "h-8 w-8 rounded",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
