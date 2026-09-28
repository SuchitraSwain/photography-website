"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex h-[1.15rem] w-8 shrink-0 rounded-full border border-transparent bg-input/80"
      />
    );
  }

  return (
    <Switch
      aria-label="Toggle color theme"
      checked={resolvedTheme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
