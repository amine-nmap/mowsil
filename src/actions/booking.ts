"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isVehicleAvailable, findConflictingBookings } from "./availability";
import { generateOujCode } from "@/lib/ouj-code";

type CreateBookingInput = {
  vehicleId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientLicenseNumber: string;
  startDate: string;
  endDate: string;
};

function validateBookingInput(input: CreateBookingInput): string | null {
  if (!input.clientName || input.clientName.length < 2)
    return "Nom complet requis (min 2 caractères)";
  if (!input.clientPhone || input.clientPhone.length < 8)
    return "Numéro de téléphone invalide";
  if (!input.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.clientEmail))
    return "Email invalide";
  if (!input.clientLicenseNumber || input.clientLicenseNumber.length < 5)
    return "Numéro de permis requis";
  if (!input.startDate || !input.endDate)
    return "Dates de location requises";
  if (new Date(input.endDate) <= new Date(input.startDate))
    return "La date de fin doit être après la date de début";
  return null;
}

export async function createBooking(input: CreateBookingInput) {
  const validationError = validateBookingInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createServerSupabaseClient();

  const available = await isVehicleAvailable({
    vehicleId: input.vehicleId,
    startDate: input.startDate,
    endDate: input.endDate,
  });

  if (!available) {
    return {
      error:
        "Ce véhicule n'est plus disponible pour les dates sélectionnées. Veuillez modifier votre recherche.",
    };
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      vehicle_id: input.vehicleId,
      client_name: input.clientName,
      client_phone: input.clientPhone,
      client_email: input.clientEmail,
      client_license_number: input.clientLicenseNumber,
      start_date: input.startDate,
      end_date: input.endDate,
      status: "en_attente",
      expires_at: expiresAt.toISOString(),
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "Conflit de réservation. Ce véhicule est déjà réservé pour ces dates.",
      };
    }
    return { error: "Erreur lors de la création de la réservation" };
  }

  if (!data) return { error: "Erreur lors de la création de la réservation" };

  return { success: true, bookingId: data.id };
}

export async function acceptBooking(bookingId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchError || !booking) return { error: "Réservation introuvable" };
  if (booking.status !== "en_attente")
    return { error: "Cette réservation n'est plus en attente" };

  const conflicts = await findConflictingBookings({
    vehicleId: booking.vehicle_id,
    startDate: booking.start_date,
    endDate: booking.end_date,
    excludeBookingId: bookingId,
  });

  if (conflicts.length > 0) {
    return { error: "Conflit de dates avec une autre réservation" };
  }

  if (new Date(booking.expires_at!) < new Date()) {
    await supabase
      .from("bookings")
      .update({ status: "expiree" })
      .eq("id", bookingId);
    return { error: "Le délai de 2 heures est dépassé. Réservation expirée." };
  }

  const code = generateOujCode();

  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status: "confirmee",
      unique_code: code,
    })
    .eq("id", bookingId);

  if (updateError) return { error: "Erreur lors de l'acceptation" };

  return { success: true, code };
}

export async function rejectBooking(bookingId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { error: "Réservation introuvable" };
  if (booking.status !== "en_attente")
    return { error: "Cette réservation n'est plus en attente" };

  const { error } = await supabase
    .from("bookings")
    .update({ status: "refusee" })
    .eq("id", bookingId);

  if (error) return { error: "Erreur lors du refus" };

  return { success: true };
}

export async function activateBooking(code: string) {
  const supabase = await createServerSupabaseClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("unique_code", code.toUpperCase())
    .maybeSingle();

  if (fetchError || !booking) return { error: "Code invalide" };
  if (booking.status !== "confirmee")
    return { error: "Cette réservation n'est pas confirmée" };

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "activee" })
    .eq("id", booking.id);

  if (updateError) return { error: "Erreur lors de l'activation" };

  return { success: true, booking };
}
