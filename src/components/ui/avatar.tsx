"use client"

import {
  Image as AvatarImageBase,
  Fallback,
  Root,
} from "@radix-ui/react-avatar"

import Image from "next/image"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"
import { cn } from "@/lib/utils"

const Avatar = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    ref={ref}
    {...props}
  />
))
Avatar.displayName = Root.displayName

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarImageBase>,
  Omit<ComponentPropsWithoutRef<typeof AvatarImageBase>, "height" | "width"> & {
    size: number
  }
>(({ className, src, alt, size, ...props }, ref) => (
  <AvatarImageBase ref={ref} src={src} asChild>
    <Image
      alt={alt ?? ""}
      className={cn("aspect-square h-full w-full", className)}
      height={size}
      src={src ?? ""}
      width={size}
      {...props}
    />
  </AvatarImageBase>
))
AvatarImage.displayName = AvatarImageBase.displayName

const AvatarFallback = forwardRef<
  ElementRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback
    className={cn(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className
    )}
    ref={ref}
    {...props}
  />
))
AvatarFallback.displayName = Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
