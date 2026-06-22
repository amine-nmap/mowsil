"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./admin-auth";

export type ReconciliationRow = {
  month: string;
  monthLabel: string;
  totalBookings: number;
  totalRevenue: number;
  commission: number;
  bookings: Array<{
    id: string;
    client_name: string;
    client_email: string;
    vehicle_name: string;
    agency_name: string;
    daily_price: number;
    total_days: number;
    total_amount: number;
    commission: number;
    start_date: string;
    end_date: string;
    status: string;
  }>;
};

const COMMISSION_RATE = 0.05;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export async function getReconciliationData(year: number, month: number): Promise<{ data: ReconciliationRow | null; error?: string }> {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, client_name, client_email, status, start_date, end_date, vehicle_id, vehicles(brand, model, daily_price, agencies(name))")
    .in("status", ["activee", "terminee"])
    .gte("start_date", startDate)
    .lte("start_date", endDate)
    .order("start_date", { ascending: false });

  if (error) return { data: null, error: error.message };
  if (!bookings || bookings.length === 0) return { data: null };

  const monthLabel = new Date(year, month - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const rows: ReconciliationRow["bookings"] = bookings.map((b) => {
    const vehicle = Array.isArray(b.vehicles) ? b.vehicles[0] : b.vehicles;
    const agency = vehicle?.agencies ? (Array.isArray(vehicle.agencies) ? vehicle.agencies[0] : vehicle.agencies) : null;
    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : "—";
    const dailyPrice = vehicle?.daily_price ?? 0;
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = totalDays * dailyPrice;

    return {
      id: b.id,
      client_name: b.client_name,
      client_email: b.client_email,
      vehicle_name: vehicleName,
      agency_name: agency?.name ?? "—",
      daily_price: dailyPrice,
      total_days: totalDays,
      total_amount: totalAmount,
      commission: Math.round(totalAmount * COMMISSION_RATE),
      start_date: formatDate(b.start_date),
      end_date: formatDate(b.end_date),
      status: b.status,
    };
  });

  const totalRevenue = rows.reduce((sum, r) => sum + r.total_amount, 0);
  const totalCommission = rows.reduce((sum, r) => sum + r.commission, 0);

  return {
    data: {
      month: `${year}-${String(month).padStart(2, "0")}`,
      monthLabel,
      totalBookings: rows.length,
      totalRevenue,
      commission: totalCommission,
      bookings: rows,
    },
  };
}

export async function getAvailableMonths() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();

  const { data } = await supabase
    .from("bookings")
    .select("start_date")
    .in("status", ["activee", "terminee"])
    .order("start_date", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  const latest = new Date(data[0].start_date);
  return { year: latest.getFullYear(), month: latest.getMonth() + 1 };
}
