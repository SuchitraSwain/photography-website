"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * Scroll reveal without flicker:
 * - Above-fold on mount → stay visible (no hide→show)
 * - Below-fold → hide offscreen, then animate in once when scrolled into view
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  ...props
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  // boot: visible | static: above-fold, stay put | hidden: below-fold | shown: animated in
  const [mode, setMode] = useState<"boot" | "static" | "hidden" | "shown">(
    "boot",
  );

  useLayoutEffect(() => {
    if (reduceMotion) {
      setMode("static");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const onScreen =
      rect.top < window.innerHeight * 0.85 && rect.bottom > 40;
    setMode(onScreen ? "static" : "hidden");
  }, [reduceMotion]);

  useEffect(() => {
    if (mode === "hidden" && inView) setMode("shown");
  }, [mode, inView]);

  const hidden = mode === "hidden";

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
      transition={
        mode === "shown"
          ? { duration: 0.55, delay, ease: EASE }
          : { duration: 0 }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.1,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [mode, setMode] = useState<"boot" | "static" | "hidden" | "shown">(
    "boot",
  );

  useLayoutEffect(() => {
    if (reduceMotion) {
      setMode("static");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const onScreen =
      rect.top < window.innerHeight * 0.85 && rect.bottom > 40;
    setMode(onScreen ? "static" : "hidden");
  }, [reduceMotion]);

  useEffect(() => {
    if (mode === "hidden" && inView) setMode("shown");
  }, [mode, inView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        mode === "hidden" ? "hidden" : mode === "shown" ? "show" : "rest"
      }
      variants={{
        rest: {},
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.04,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        rest: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
