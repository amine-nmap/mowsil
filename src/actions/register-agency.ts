"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type RegisterInput = {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  coordinates: { lat: number; lng: number };
  openingHours: string;
  fleetSize: number;
  facadePhotoUrl: string | null;
  password: string;
};

export async function registerAgency(input: RegisterInput) {
  const supabase = await createServerSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { role: "agency", full_name: input.companyName },
    },
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes("already")) {
      return { error: "Un compte avec cet email existe déjà" };
    }
    return { error: "Erreur lors de la création du compte" };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    role: "agency",
    full_name: input.companyName,
    phone: input.phone,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: "Erreur lors de la création du profil" };
  }

  const { error: agencyError } = await supabase.from("agencies").insert({
    owner_id: authData.user.id,
    name: input.companyName,
    city: "Oujda",
    phone: input.phone,
    email: input.email,
    address: input.address,
    coordinates: input.coordinates,
    opening_hours: { schedule: input.openingHours },
    facade_photo_url: input.facadePhotoUrl,
    status: "pending",
  });

  if (agencyError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: "Erreur lors de la création de l'agence" };
  }

  return { success: true };
}

export async function uploadFacadePhoto(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { url: null };

  const supabase = await createServerSupabaseClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `agency-${crypto.randomUUID()}-${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("agencies-facades")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: "Erreur lors de l'upload de la photo" };

  const {
    data: { publicUrl },
  } = supabase.storage.from("agencies-facades").getPublicUrl(data.path);

  return { url: publicUrl };
}
