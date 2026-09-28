"use client";

import type { ReactNode } from "react";

/**
 * Soft page enter — never gates visibility behind opacity:0.
 * A CSS keyframe runs once; content stays readable even if animation is skipped.
 */
export function PageFade({ children }: { children: ReactNode }) {
  return <div className="motion-page-enter">{children}</div>;
}
