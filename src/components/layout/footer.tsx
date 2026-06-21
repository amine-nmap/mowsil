"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("home");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  return (
    <footer className="bg-mowsil-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href={`/${locale}`} className="text-xl font-bold tracking-tight">
              MOWSIL
            </Link>
            <p className="mt-3 text-sm text-white/70 max-w-xs leading-relaxed">
              {t("footerTagline")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-mowsil-green mb-3">
              {t("footerContact")}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{t("footerAddress")}</li>
              <li>{t("footerEmail")}</li>
              <li>{t("footerWhatsApp")}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-mowsil-green mb-3">
              {t("footerLegal")}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {t("footerLegalNotice")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {t("footerTerms")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">
                  {t("footerPrivacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          {t("footerRights")}
        </div>
      </div>
    </footer>
  );
}
