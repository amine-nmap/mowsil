"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAgency } from "./auth";
import { sendReceipt } from "@/lib/email";

const OUJ_CODE_REGEX = /^OUJ-[A-Z0-9]{4}-[A-Z0-9]{2}$/;

export async function activateBookingByCode(_prev: { error: string; success: boolean }, formData: FormData) {
  const session = await requireAgency();
  const code = (formData.get("code") as string)?.trim().toUpperCase() ?? "";

  if (!code) return { error: "Code requis", success: false };
  if (!OUJ_CODE_REGEX.test(code)) return { error: "Format invalide (OUJ-XXXX-XX)", success: false };

  const supabase = await createServerSupabaseClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*, vehicles(agency_id, agencies!inner(owner_id))")
    .eq("unique_code", code)
    .maybeSingle();

  if (fetchError || !booking) return { error: "Code invalide", success: false };

  const agencyOwnerId = (booking.vehicles as any)?.agencies?.owner_id;
  if (agencyOwnerId !== session.user.id) return { error: "Ce code ne correspond pas à vos véhicules", success: false };

  if (booking.status !== "confirmee") return { error: "Cette réservation n'est pas en statut confirmée", success: false };

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "activee" })
    .eq("id", booking.id);

  if (updateError) return { error: "Erreur lors de l'activation", success: false };

  return { error: "", success: true };
}

export async function completeBooking(_prev: { error: string; success: boolean }, formData: FormData) {
  const session = await requireAgency();
  const bookingId = formData.get("bookingId") as string;

  if (!bookingId) return { error: "Identifiant requis", success: false };

  const supabase = await createServerSupabaseClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*, vehicles(agency_id, agencies!inner(owner_id))")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchError || !booking) return { error: "Réservation introuvable", success: false };

  const agencyOwnerId = (booking.vehicles as any)?.agencies?.owner_id;
  if (agencyOwnerId !== session.user.id) return { error: "Accès refusé", success: false };

  if (booking.status !== "activee") return { error: "Seules les locations en cours peuvent être clôturées", success: false };

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "terminee" })
    .eq("id", bookingId);

  if (updateError) return { error: "Erreur lors de la clôture", success: false };

  await supabase
    .from("vehicles")
    .update({ is_available: true })
    .eq("id", booking.vehicle_id);

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("brand, model, daily_price, agencies(name)")
    .eq("id", booking.vehicle_id)
    .maybeSingle();

  if (vehicle) {
    const agency = (vehicle.agencies as unknown as { name: string }[])?.at(0);
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyPrice = vehicle.daily_price ?? 0;
    const totalAmount = totalDays * dailyPrice;

    await sendReceipt({
      to: booking.client_email,
      firstName: booking.client_name.split(" ")[0],
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      agencyName: agency?.name ?? "Agence partenaire",
      startDate: start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      endDate: end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      totalDays,
      dailyPrice,
      totalAmount,
    });
  }

  return { error: "", success: true };
}
