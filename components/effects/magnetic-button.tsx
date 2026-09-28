"use client";

import { motion, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Visual variant — styles come from parent via className */
  "aria-label"?: string;
};

/**
 * Primary CTA with magnetic pull (~20px) + arrow that slides on hover.
 * Remains a real link — keyboard focus works without magnetism.
 */
export function MagneticButton({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  const onMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const max = 20;
      x.set(Math.max(-max, Math.min(max, dx * 0.35)));
      y.set(Math.max(-max, Math.min(max, dy * 0.35)));
    },
    [x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div style={{ transform }} className="inline-flex">
      <Link
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        data-cursor="button"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(
          "group inline-flex h-12 items-center justify-center gap-2 px-8 text-[0.7rem] font-semibold tracking-[0.22em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2",
          className,
        )}
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}
