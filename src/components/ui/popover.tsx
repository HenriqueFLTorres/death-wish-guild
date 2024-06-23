"use client"

import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"

import { cn } from "@/lib/utils"

const Popover = Root

const PopoverTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <Trigger
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-secondary bg-secondary-600 px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </Trigger>
))
PopoverTrigger.displayName = Trigger.displayName

const PopoverContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <Portal>
    <Content
      align={align}
      className={cn(
        "z-50 w-full rounded-md border border-secondary bg-secondary-600 p-4 text-neutral-50 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </Portal>
))
PopoverContent.displayName = Content.displayName

export { Popover, PopoverContent, PopoverTrigger }
