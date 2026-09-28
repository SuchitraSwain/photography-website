"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Soft page enter via CSS — no opacity:0 resting state after mount,
 * and no Framer setState cycle that flashes content.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return <div className="motion-page-enter">{children}</div>;
}
