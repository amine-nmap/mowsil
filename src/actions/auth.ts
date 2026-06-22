"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export async function login(_prev: { error: string }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: "Email ou mot de passe incorrect" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "agency") {
    await supabase.auth.signOut();
    return { error: "Accès réservé aux agences partenaires" };
  }

  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .select("status")
    .eq("owner_id", authData.user.id)
    .maybeSingle();

  if (agencyError || !agency) {
    await supabase.auth.signOut();
    return { error: "Accès réservé aux agences partenaires" };
  }

  if (agency.status !== "active") {
    await supabase.auth.signOut();
    if (agency.status === "pending") {
      return { error: "Votre compte est en attente de validation par notre équipe" };
    }
    return { error: "Votre compte a été suspendu. Contactez le support." };
  }

  redirect(`/${routing.defaultLocale}/agence/dashboard`);
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect(`/${routing.defaultLocale}/agence/login`);
}

export async function createAccountFromBooking(
  bookingId: string,
  email: string,
  password: string,
): Promise<{ error: string; success: boolean }> {
  if (!email || !password || password.length < 8) {
    return { error: "Mot de passe requis (min 8 caractères)", success: false };
  }

  const supabase = await createServerSupabaseClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("client_email")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { error: "Réservation introuvable", success: false };
  if (booking.client_email !== email) return { error: "Email incorrect", success: false };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes("already")) {
      return { error: "Un compte existe déjà avec cet email", success: false };
    }
    return { error: "Erreur lors de la création du compte", success: false };
  }

  if (signUpData?.user) {
    await supabase.from("profiles").upsert({
      id: signUpData.user.id,
      email,
      role: "client",
    });
  }

  return { error: "", success: true };
}
