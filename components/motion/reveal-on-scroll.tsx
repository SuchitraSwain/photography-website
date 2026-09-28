"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll reveal that never leaves content stuck invisible.
 * Starts visible; plays a one-shot keyframe when entering the viewport.
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    // Safety: if already in view (or IO glitches), reveal immediately
    const rect = node.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) {
      setPlay(true);
      observer.disconnect();
    }

    // Absolute fallback — never leave content waiting forever
    const timeout = window.setTimeout(() => setPlay(true), 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn("motion-reveal", play && "motion-reveal-play", className)}
      style={{ "--motion-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
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
  const [play, setPlay] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setPlay(true);
      observer.disconnect();
    }

    const timeout = window.setTimeout(() => setPlay(true), 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn(
        "motion-stagger",
        play && "motion-stagger-play",
        className,
      )}
      style={{ "--stagger": `${stagger}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("motion-stagger-item", className)}>{children}</div>;
}
