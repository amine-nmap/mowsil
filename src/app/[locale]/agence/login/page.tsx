import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import LoginForm from "@/components/agence/login-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "navigation" });
  return { title: `${t("login")} | MOWSIL` };
}

export default function AgencyLoginPage() {
  return <LoginForm />;
}
