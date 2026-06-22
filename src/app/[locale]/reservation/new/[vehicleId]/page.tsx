import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getVehicleWithAgency } from "@/data/mock";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ReservationForm from "@/components/reservation/reservation-form";

type Props = {
  params: Promise<{ vehicleId: string; locale: string }>;
  searchParams: Promise<{ dateDebut?: string; dateFin?: string; heureDebut?: string; heureFin?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, vehicleId } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  let name = "";
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("vehicles").select("brand, model").eq("id", vehicleId).maybeSingle();
    if (data) name = `${data.brand} ${data.model}`;
  } catch { /* ignore */ }
  return { title: name ? `${name} | ${t("title")} | MOWSIL` : `${t("title")} | MOWSIL` };
}

export default async function NewReservationPage({ params, searchParams }: Props) {
  const { vehicleId } = await params;
  const { dateDebut, dateFin, heureDebut, heureFin } = await searchParams;

  let vehicle: any;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("vehicles")
      .select("*, agencies(name, city)")
      .eq("id", vehicleId)
      .maybeSingle();
    vehicle = data;
  } catch {
    vehicle = getVehicleWithAgency(vehicleId);
  }

  if (!vehicle) notFound();

  return (
    <ReservationForm
      vehicle={vehicle}
      defaultStartDate={dateDebut ?? ""}
      defaultEndDate={dateFin ?? ""}
      defaultStartTime={heureDebut ?? ""}
      defaultEndTime={heureFin ?? ""}
    />
  );
}
