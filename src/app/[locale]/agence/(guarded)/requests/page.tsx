import { getAgencyBookings } from "@/actions/dashboard";
import { requireAgency } from "@/actions/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AgencyRequestsClient from "@/components/agence/requests-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: `${t("requestsTitle")} | MOWSIL` };
}

export default async function AgencyRequestsPage() {
  await requireAgency();
  const bookings = await getAgencyBookings();

  return <AgencyRequestsClient bookings={bookings} />;
}
