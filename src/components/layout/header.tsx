"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("navigation");
  const c = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const locale = pathname.split("/")[1];
  const otherLocale = locale === "fr" ? "ar" : "fr";

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/results`, label: t("results") },
    { href: `/${locale}/register`, label: t("register") },
    { href: `/${locale}/agence/dashboard`, label: t("dashboard") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mowsil-card-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold tracking-tight text-mowsil-navy"
          >
            MOWSIL
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isActive ? "text-mowsil-green" : "text-mowsil-navy hover:text-mowsil-green",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={`/${otherLocale}`}
              className="text-xs font-bold uppercase tracking-wider text-mowsil-legend hover:text-mowsil-navy transition-colors"
            >
              {locale === "fr" ? c("arabic") : c("french")}
            </Link>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              {t("login")}
            </Button>
            <button
              className="md:hidden p-2 text-mowsil-navy"
              onClick={() => setOpen(!open)}
              aria-label={c("menu")}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-mowsil-card-border bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-semibold py-2 transition-colors",
                    isActive ? "text-mowsil-green" : "text-mowsil-navy",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
