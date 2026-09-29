"use client";

import { useEffect, useRef, useState } from "react";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Desktop-only accent cursor — follows the pointer 1:1 (no spring lag).
 * Expands on interactive targets; shows "View" on [data-cursor="gallery"].
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<"default" | "button" | "gallery">("default");

  useEffect(() => {
    setEnabled(canUseCustomCursor());
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    document.documentElement.classList.add("has-custom-cursor");

    let visible = false;

    const applyMode = (mode: "default" | "button" | "gallery") => {
      if (modeRef.current === mode) return;
      modeRef.current = mode;
      root.dataset.mode = mode;
      if (labelRef.current) {
        labelRef.current.hidden = mode !== "gallery";
      }
    };

    const onMove = (e: MouseEvent) => {
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }

      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, [role='button'], input, textarea, select, label",
      );

      if (!target) {
        applyMode("default");
        return;
      }

      const cursorAttr = target.getAttribute("data-cursor");
      if (cursorAttr === "gallery") {
        applyMode("gallery");
      } else if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.tagName === "LABEL" ||
        target.getAttribute("role") === "button" ||
        cursorAttr === "button"
      ) {
        applyMode("button");
      } else {
        applyMode("default");
      }
    };

    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-mode="default"
      className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0 will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div className="cursor-core -translate-x-1/2 -translate-y-1/2">
        <span
          ref={labelRef}
          hidden
          className="font-mono-nav text-[0.55rem] font-medium tracking-[0.16em] text-background uppercase"
        >
          View
        </span>
      </div>
    </div>
  );
}
