import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mockVehicles, mockAgencies } from "@/data/mock";
import type { Metadata } from "next";
import ResultsClient from "@/components/vehicle/results-client";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    fuel?: string;
    transmission?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "بحث السيارات في وجدة | موصل" : "Rechercher un véhicule à Oujda | MOWSIL",
  };
}

export default async function ResultsPage({ searchParams }: Props) {
  const filters = await searchParams;
  let vehicles: any[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("vehicles").select("*, agencies(name, city)");

    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.fuel) {
      query = query.eq("fuel_type", filters.fuel);
    }
    if (filters.transmission) {
      query = query.eq("gearbox", filters.transmission);
    }
    if (filters.priceMin) {
      query = query.gte("daily_price", parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      query = query.lte("daily_price", parseInt(filters.priceMax));
    }

    const { data } = await query.order("daily_price", { ascending: true });
    vehicles = data ?? [];
  } catch {
    vehicles = mockVehicles
      .filter((v) => {
        const agency = mockAgencies.find((a) => a.id === v.agency_id);
        if (!agency || agency.status !== "active") return false;
        if (filters.fuel && v.fuel_type !== filters.fuel) return false;
        if (filters.transmission && v.gearbox !== filters.transmission) return false;
        if (filters.priceMin && v.daily_price < parseInt(filters.priceMin)) return false;
        if (filters.priceMax && v.daily_price > parseInt(filters.priceMax)) return false;
        return true;
      })
      .map((v) => ({
        ...v,
        agencies: mockAgencies.find((a) => a.id === v.agency_id),
      }))
      .sort((a, b) => a.daily_price - b.daily_price);
  }

  return <ResultsClient vehicles={vehicles} filters={filters} />;
}
