"use client";

import { useTranslations } from "next-intl";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const t = useTranslations("home");
  const params = useParams<{ locale?: string }>();
  const isRtl = params?.locale === "ar";

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-mowsil-navy">
      <div className="absolute inset-0 bg-gradient-to-br from-mowsil-navy via-[#0D2E4A] to-[#0A2540]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,150,0.08),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto pt-12 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-mowsil-green animate-pulse" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Oujda, Maroc
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight whitespace-pre-line">
            {t("heroTitle")}
          </h1>

          <p className="text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full max-w-md">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
              <Search size={18} />
              {t("heroCta")}
            </Button>
          </div>

          <p className="text-xs text-white/40 flex items-center gap-1.5">
            {isRtl ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            {t("heroNote")}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
