"use client"

import {
  Corner,
  Root,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  Viewport,
} from "@radix-ui/react-scroll-area"
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"

import { cn } from "@/lib/utils"

const ScrollArea = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, ref) => (
  <Root
    className={cn("relative overflow-hidden", className)}
    ref={ref}
    {...props}
  >
    <Viewport className="h-full w-full rounded-[inherit]">{children}</Viewport>
    <ScrollBar />
    <Corner />
  </Root>
))
ScrollArea.displayName = Root.displayName

const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaScrollbar
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    orientation={orientation}
    ref={ref}
    {...props}
  >
    <ScrollAreaThumb className="relative flex-1 rounded-full bg-neutral-600" />
  </ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
