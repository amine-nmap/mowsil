import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MOWSIL — Find it. Book it. Drive it.",
  description: "Premier agrégateur de location de voitures de confiance à Oujda — transparent, local, instantané.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${inter.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
