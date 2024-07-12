"use client"

import { Indicator, Root } from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"
import { cn } from "@/lib/utils"

const Checkbox = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-black/50 ring-offset-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-900",
      className
    )}
    ref={ref}
    {...props}
  >
    <Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4 stroke-white" />
    </Indicator>
  </Root>
))
Checkbox.displayName = Root.displayName

export { Checkbox }
