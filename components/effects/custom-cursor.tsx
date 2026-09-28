"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  // Fine pointer + hover capability (excludes phones/tablets); not a CSS breakpoint
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Desktop-only custom cursor. pointer-events: none — never blocks clicks.
 * Expands on buttons; shows "View" on [data-cursor="gallery"].
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"default" | "button" | "gallery">("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 380, damping: 32, mass: 0.45 });
  const y = useSpring(mouseY, { stiffness: 380, damping: 32, mass: 0.45 });

  useEffect(() => {
    const ok = canUseCustomCursor();
    setEnabled(ok);
    if (!ok) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, [role='button']",
      );
      if (!target) {
        setMode("default");
        return;
      }
      const cursorAttr = target.getAttribute("data-cursor");
      if (cursorAttr === "gallery") {
        setMode("gallery");
      } else if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.getAttribute("role") === "button" ||
        cursorAttr === "button"
      ) {
        setMode("button");
      } else {
        setMode("default");
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  const expanded = mode === "button" || mode === "gallery";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-white bg-white"
        animate={{
          width: expanded ? 56 : 8,
          height: expanded ? 56 : 8,
          backgroundColor:
            mode === "gallery" ? "rgba(255,255,255,0.12)" : "#ffffff",
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {mode === "gallery" ? (
          <span className="text-[0.55rem] font-semibold tracking-[0.18em] text-white uppercase">
            View
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
