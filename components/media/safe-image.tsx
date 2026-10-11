"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Soft charcoal blur used while images load or when LQIP is missing. */
export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230b101a'/%3E%3Crect width='100%25' height='100%25' fill='%231a2438' opacity='.7' filter='url(%23b)'/%3E%3C/svg%3E";

type SafeImageProps = ImageProps & {
  fallbackClassName?: string;
};

function isVercelBlobUrl(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  return (
    src.includes(".public.blob.vercel-storage.com") ||
    src.includes(".blob.vercel-storage.com")
  );
}

export function SafeImage({
  alt,
  className,
  fallbackClassName,
  onError,
  onLoad,
  placeholder,
  blurDataURL,
  unoptimized,
  src,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const fill = "fill" in props && props.fill === true;
  const blobSrc = isVercelBlobUrl(src);
  // Large gallery originals time out Next's image optimizer — serve directly.
  const skipOptimize = unoptimized ?? blobSrc;

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt || "Image unavailable"}
        className={cn(
          "block animate-pulse bg-gradient-to-br from-[#0b101a] via-[#152035] to-[#0b101a]",
          fill && "absolute inset-0",
          !fill && "h-full w-full min-h-[12rem]",
          fallbackClassName,
          className,
        )}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={skipOptimize}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
      className={cn("bg-[#0b101a]", className)}
      onLoad={onLoad}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
