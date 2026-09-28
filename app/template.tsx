"use client";

import { PageFade } from "@/components/motion/page-transition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
