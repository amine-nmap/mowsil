import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AgencyOnboardingForm from "@/components/agence/agency-onboarding-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agencies" });
  return { title: `${t("registerTitle")} | MOWSIL` };
}

export default function RegisterPage() {
  return <AgencyOnboardingForm />;
}
