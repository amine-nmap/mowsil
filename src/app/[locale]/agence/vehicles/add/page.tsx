import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import VehicleForm from "@/components/agence/vehicle-form";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vehicles" });
  return { title: `${t("addTitle")} | MOWSIL` };
}

export default function AddVehiclePage() {
  return <VehicleForm />;
}
