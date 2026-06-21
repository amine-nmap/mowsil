"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type ConflictCheckInput = {
  vehicleId: string;
  startDate: string;
  endDate: string;
  excludeBookingId?: string;
};

export async function findConflictingBookings({
  vehicleId,
  startDate,
  endDate,
  excludeBookingId,
}: ConflictCheckInput) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("bookings")
    .select("id, start_date, end_date, status")
    .eq("vehicle_id", vehicleId)
    .in("status", ["en_attente", "confirmee", "activee"])
    .lt("start_date", endDate)
    .gt("end_date", startDate);

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId);
  }

  const { data, error } = await query;

  if (error) throw new Error("Erreur de vérification de disponibilité");
  return data ?? [];
}

export async function isVehicleAvailable(input: ConflictCheckInput) {
  const conflicts = await findConflictingBookings(input);
  return conflicts.length === 0;
}
