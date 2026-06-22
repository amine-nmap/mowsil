import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import EditVehicleForm from "./form";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vehicles" });
  return { title: `${t("editTitle")} | MOWSIL` };
}

export default async function EditVehiclePage({ params }: Props) {
  const { locale, id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!vehicle) notFound();

  return <EditVehicleForm vehicle={vehicle} locale={locale} />;
}
