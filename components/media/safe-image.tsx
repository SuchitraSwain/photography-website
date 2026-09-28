"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Soft charcoal blur used while images load or when LQIP is missing. */
export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Crect width='100%25' height='100%25' fill='%23333333' opacity='.45' filter='url(%23b)'/%3E%3C/svg%3E";

type SafeImageProps = ImageProps & {
  fallbackClassName?: string;
};

export function SafeImage({
  alt,
  className,
  fallbackClassName,
  onError,
  placeholder,
  blurDataURL,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const fill = "fill" in props && props.fill === true;

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt || "Image unavailable"}
        className={cn(
          "block bg-gradient-to-br from-secondary via-muted to-secondary",
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
      alt={alt}
      className={className}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? DEFAULT_BLUR_DATA_URL}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
