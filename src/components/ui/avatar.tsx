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
  useState,
} from "react"

import { cn } from "@/lib/utils"

const Avatar = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> &
    AvatarImageProps & { fallbackText: string | undefined | null }
>(({ className, size = 40, fallbackText, src, alt, style, ...props }, ref) => (
  <Root
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      className
    )}
    key={src}
    ref={ref}
    style={{ width: size, height: size, ...style }}
  >
    <AvatarImage
      alt={alt}
      fallbackText={fallbackText}
      size={size}
      src={src}
      {...props}
    />
    <AvatarFallback>{getInitials(fallbackText)}</AvatarFallback>
  </Root>
))
Avatar.displayName = Root.displayName

const getInitials = (name: string | undefined | null) => {
  if (name == null || name === "") return ""

  const isSingleWord = name.replace(/[^a-zA-Z@.]/g, " ").split(" ").length === 1
  if (isSingleWord) return name.slice(0, 3)

  return name
    .replace(/[^a-zA-Z ]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 3)
}

const AvatarFallback = forwardRef<
  ElementRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback
    className={cn(
      "flex h-full w-full shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-secondary-400 to-secondary-600 text-xs",
      className
    )}
    ref={ref}
    {...props}
  />
))
AvatarFallback.displayName = Fallback.displayName

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error"

interface AvatarImageProps
  extends Omit<
    ComponentPropsWithoutRef<typeof AvatarImageBase>,
    "height" | "width" | "src" | "alt"
  > {
  src: string | null | undefined
  alt?: string | null | undefined
  fallbackImage?: string
  fallbackText: string | null | undefined
  size?: number
}

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarImageBase>,
  AvatarImageProps
>(
  (
    { className, src, alt, size = 40, fallbackImage, fallbackText, ...props },
    ref
  ) => {
    const [imageSource, setImageSource] = useState(src)

    const fallbackAlt = fallbackText == null ? null : `${fallbackText} logo`

    const onLoadingStatusChange = (status: ImageLoadingStatus) => {
      if (status === "error") {
        setImageSource(fallbackImage)
      }
    }

    return (
      <AvatarImageBase
        alt={alt ?? fallbackAlt ?? undefined}
        ref={ref}
        src={imageSource ?? undefined}
        asChild
        onLoadingStatusChange={onLoadingStatusChange}
      >
        <Image
          alt={alt ?? fallbackAlt ?? ""}
          className={cn("aspect-square h-full w-full object-cover", className)}
          height={size}
          src={imageSource ?? ""}
          width={size}
          onError={(event) => {
            if (imageSource !== fallbackImage) setImageSource(fallbackImage)
            if (props.onError) props.onError(event)
          }}
          {...props}
        />
      </AvatarImageBase>
    )
  }
)
AvatarImage.displayName = AvatarImageBase.displayName

export { Avatar }
