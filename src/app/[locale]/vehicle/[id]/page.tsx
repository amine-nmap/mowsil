import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getVehicleWithAgency } from "@/data/mock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VehicleDetailClient from "@/components/vehicle/vehicle-detail-client";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  let vehicle: any;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("vehicles")
      .select("*, agencies(name)")
      .eq("id", id)
      .maybeSingle();
    vehicle = data;
  } catch {
    vehicle = getVehicleWithAgency(id);
  }

  if (!vehicle) return { title: "Véhicule introuvable | MOWSIL" };

  const title =
    locale === "ar"
      ? `${vehicle.brand} ${vehicle.model} للإيجار في وجدة | موصل`
      : `${vehicle.brand} ${vehicle.model} à louer à Oujda | MOWSIL`;

  const description = `Louez une ${vehicle.brand} ${vehicle.model} à Oujda dès ${vehicle.daily_price} DH/jour. ${vehicle.fuel_type} · ${vehicle.gearbox}. Année ${vehicle.year}.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;

  let vehicle: any;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("vehicles")
      .select("*, agencies(name, city, address, phone)")
      .eq("id", id)
      .maybeSingle();
    vehicle = data;
  } catch {
    vehicle = getVehicleWithAgency(id);
  }

  if (!vehicle) notFound();

  return <VehicleDetailClient vehicle={vehicle} />;
}
