"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, type ReactNode } from "react";

/**
 * Site-wide smooth scroll via Lenis + rAF.
 * Falls back to native scroll when prefers-reduced-motion is set.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onPreferenceChange = () => {
      if (media.matches) {
        cancelAnimationFrame(rafId);
        document.documentElement.classList.remove("lenis");
        lenis.destroy();
      }
    };
    media.addEventListener("change", onPreferenceChange);

    return () => {
      media.removeEventListener("change", onPreferenceChange);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis");
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
