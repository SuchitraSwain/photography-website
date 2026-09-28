"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/types/content";

type LightboxProps = {
  image: GalleryImage | null;
  position: number;
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const SWIPE_THRESHOLD = 50;

export function Lightbox({
  image,
  position,
  total,
  open,
  onOpenChange,
  onPrevious,
  onNext,
}: LightboxProps) {
  const pointerStartX = useRef<number | null>(null);

  function handlePointerDown(event: React.PointerEvent) {
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(event: React.PointerEvent) {
    if (pointerStartX.current === null) {
      return;
    }

    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (delta > SWIPE_THRESHOLD) {
      onPrevious();
    } else if (delta < -SWIPE_THRESHOLD) {
      onNext();
    }
  }

  if (!image) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-dvh max-h-none w-screen max-w-none gap-0 rounded-none border-0 bg-black/95 p-0 text-white sm:max-w-none"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onPrevious();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            onNext();
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <DialogTitle className="sr-only">{image.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {image.alt}. Image {position + 1} of {total}.
        </DialogDescription>

        <Image
          key={image._id}
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          priority
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
          className="object-contain p-14 sm:p-16"
        />

        <DialogClose
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-full bg-black/45 p-3 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X aria-hidden="true" className="size-5" />
        </DialogClose>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={onPrevious}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={onNext}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pt-14 pb-5 text-center">
          <p className="text-sm font-medium">{image.title}</p>
          <p className="mt-1 text-xs text-white/70">
            {position + 1} / {total}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
