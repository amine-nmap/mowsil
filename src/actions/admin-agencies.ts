"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./admin-auth";

export async function getAllAgencies(filter?: string) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  let query = supabase
    .from("agencies")
    .select("id, name, email, city, status, created_at, owner_id")
    .order("created_at", { ascending: false });

  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function activateAgency(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const agencyId = formData.get("agencyId") as string;
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("agencies")
    .update({ status: "active" })
    .eq("id", agencyId);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "" };
}

export async function suspendAgency(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const agencyId = formData.get("agencyId") as string;
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("agencies")
    .update({ status: "suspended" })
    .eq("id", agencyId);
  if (error) return { success: false, message: error.message };
  return { success: true, message: "" };
}

export async function getAgenciesStats() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { count: totalAgencies } = await supabase
    .from("agencies")
    .select("*", { count: "exact", head: true });

  const { count: pendingAgencies } = await supabase
    .from("agencies")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: totalVehicles } = await supabase
    .from("vehicles")
    .select("*", { count: "exact", head: true });

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  return {
    totalAgencies: totalAgencies ?? 0,
    pendingAgencies: pendingAgencies ?? 0,
    totalVehicles: totalVehicles ?? 0,
    totalBookings: totalBookings ?? 0,
  };
}
