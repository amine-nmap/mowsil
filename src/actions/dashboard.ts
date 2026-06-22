"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAgency } from "@/lib/auth-helpers";

export async function getDashboardData() {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { data: agencyVehicles } = await supabase
    .from("vehicles")
    .select("id, brand, model, daily_price, is_available")
    .eq("agency_id", session.agency.id);

  const vehicleIds = agencyVehicles?.map((v) => v.id) ?? [];

  let pendingBookings: any[] = [];
  let confirmedBookings: any[] = [];
  let activeBookings: any[] = [];
  let completedBookings: any[] = [];
  let expiredBookings: any[] = [];

  if (vehicleIds.length > 0) {
    const { data: allBookings } = await supabase
      .from("bookings")
      .select("*, vehicles!inner(brand, model)")
      .in("vehicle_id", vehicleIds)
      .order("created_at", { ascending: false });

    if (allBookings) {
      pendingBookings = allBookings.filter((b) => b.status === "en_attente");
      confirmedBookings = allBookings.filter((b) => b.status === "confirmee");
      activeBookings = allBookings.filter((b) => b.status === "activee");
      completedBookings = allBookings.filter((b) => b.status === "terminee");
      expiredBookings = allBookings.filter((b) => b.status === "expiree");
    }
  }

  const totalEarnings = completedBookings.reduce((sum, b) => {
    const vehicle = agencyVehicles?.find((v) => v.id === b.vehicle_id);
    if (!vehicle) return sum;
    const days = Math.ceil(
      (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return sum + vehicle.daily_price * days;
  }, 0);

  return {
    agency: session.agency,
    stats: {
      totalVehicles: agencyVehicles?.length ?? 0,
      pendingCount: pendingBookings.length,
      activeCount: activeBookings.length,
      completedCount: completedBookings.length,
      totalEarnings,
    },
    recentBookings: [
      ...pendingBookings.map((b) => ({ ...b, priority: 0 })),
      ...confirmedBookings.map((b) => ({ ...b, priority: 1 })),
    ]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10),
    pendingBookings: pendingBookings.slice(0, 5),
    vehicles: agencyVehicles ?? [],
  };
}

export async function getAgencyBookings() {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id")
    .eq("agency_id", session.agency.id);

  const vehicleIds = vehicles?.map((v) => v.id) ?? [];
  if (vehicleIds.length === 0) return [];

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, vehicles!inner(brand, model)")
    .in("vehicle_id", vehicleIds)
    .order("created_at", { ascending: false });

  return bookings ?? [];
}

export async function getAgencyVehicles() {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("agency_id", session.agency.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}
