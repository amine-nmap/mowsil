import { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import DirectionProvider from "@/components/ui/direction-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <DirectionProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
