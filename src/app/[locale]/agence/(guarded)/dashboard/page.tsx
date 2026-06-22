import { getDashboardData } from "@/actions/dashboard";
import { requireAgency } from "@/actions/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AgencyDashboardClient from "@/components/agence/dashboard-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: `${t("title")} | MOWSIL` };
}

export default async function AgencyDashboardPage() {
  const session = await requireAgency();
  const data = await getDashboardData();

  return <AgencyDashboardClient data={data} agency={session.agency} />;
}
