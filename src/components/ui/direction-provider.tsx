"use client";

import { useEffect, type ReactNode } from "react";
import { useParams } from "next/navigation";

export default function DirectionProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale || "fr";
  const isRtl = locale === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRtl]);

  return <>{children}</>;
}
