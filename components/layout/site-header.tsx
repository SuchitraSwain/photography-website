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
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        overHero
          ? "border-white/10 bg-black/55 backdrop-blur-md"
          : "border-border/60 bg-background/85 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-4 px-6 lg:px-10">
        <Link
          href="/"
          className={cn(
            "font-mono-nav relative z-10 flex items-center gap-2.5 text-[0.82rem] font-medium tracking-[0.08em] uppercase transition-colors",
            overHero ? "text-white" : "text-foreground",
          )}
        >
          <span
            aria-hidden
            className="inline-block size-[9px] rounded-[2px] bg-accent shadow-[0_0_12px_rgba(108,155,242,0.8)]"
          />
          {brandName}
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
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
                  "font-mono-nav group relative text-[0.72rem] font-medium tracking-[0.14em] uppercase transition-colors",
                  overHero
                    ? "text-white/65 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                  active && (overHero ? "text-white" : "text-foreground"),
                )}
              >
                {label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px origin-left bg-accent transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
          <Link
            href="/booking"
            className={cn(
              "pill-cta",
              overHero && "border-white/25 text-white hover:border-accent/70 hover:text-accent",
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
                  className="font-mono-nav block py-3 text-[0.8rem] tracking-[0.14em] text-foreground uppercase"
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
