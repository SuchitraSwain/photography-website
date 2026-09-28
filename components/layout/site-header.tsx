"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

type SiteHeaderProps = {
  brandName: string;
};

export function SiteHeader({ brandName }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/80 bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-4 px-6 lg:px-10">
        <Link
          href="/"
          className={cn(
            "font-display text-lg tracking-[0.28em] uppercase transition-colors sm:text-xl",
            overHero ? "text-white" : "text-foreground",
          )}
        >
          {brandName}
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative text-[0.7rem] tracking-[0.22em] uppercase transition-colors",
                  overHero
                    ? "text-white/70 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                  active && (overHero ? "text-white" : "text-foreground"),
                )}
              >
                {label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px origin-left bg-brass transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
          <Link
            href="/booking"
            className={cn(
              "inline-flex h-9 items-center px-4 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-transform duration-300 hover:scale-[1.03] motion-reduce:hover:scale-100",
              overHero
                ? "bg-white text-black hover:bg-white/90"
                : "bg-foreground text-background hover:opacity-90",
            )}
          >
            Book
          </Link>
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "lg:hidden",
            overHero && "text-white hover:bg-white/10 hover:text-white",
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </Button>
      </div>

      <nav
        id="mobile-nav"
        className={cn(
          "border-t border-border bg-background lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        aria-label="Primary mobile"
      >
        <ul className="mx-auto flex max-w-[100rem] flex-col px-6 py-5">
          {[...NAV_LINKS, { href: "/booking", label: "Book" }].map(
            ({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-3 text-sm tracking-[0.18em] text-foreground uppercase"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}
