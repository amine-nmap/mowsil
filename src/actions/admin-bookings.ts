"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./admin-auth";

export async function getAllBookings(statusFilter?: string) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("bookings")
    .select("id, client_name, client_email, status, unique_code, start_date, end_date, created_at, vehicle_id, vehicles(brand, model, agency_id, agencies(name))")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBookingsStats() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const statuses = ["en_attente", "confirmee", "refusee", "expiree", "activee", "terminee"] as const;

  const counts: Record<string, number> = {};
  for (const status of statuses) {
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
    counts[status] = count ?? 0;
  }

  return counts;
}
