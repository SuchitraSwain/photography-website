"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/** 2px fixed accent bar — fills with page scroll progress. */
export function ScrollProgress() {
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, { stiffness: 120, damping: 28, mass: 0.2 });

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? window.scrollY / max : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] bg-transparent"
    >
      <motion.div
        className="h-full origin-left bg-accent"
        style={{ scaleX }}
      />
    </div>
  );
}
