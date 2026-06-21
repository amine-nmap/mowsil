"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAgency } from "./auth";
import { revalidatePath } from "next/cache";

type AddVehicleInput = {
  brand: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  gearbox: string;
  dailyPrice: number;
  depositAmount: number | null;
  mileagePolicy: string;
  fuelPolicy: string;
  photoUrls: string[];
};

export async function addVehicle(input: AddVehicleInput) {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("vehicles").insert({
    agency_id: session.agency.id,
    brand: input.brand,
    model: input.model,
    year: input.year,
    category: input.category,
    fuel_type: input.fuelType,
    gearbox: input.gearbox,
    daily_price: input.dailyPrice,
    deposit_amount: input.depositAmount ?? null,
    mileage_policy: input.mileagePolicy,
    fuel_policy: input.fuelPolicy,
    photos: input.photoUrls,
    is_available: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/agence/dashboard");
  return { success: true };
}

export async function updateVehicle(vehicleId: string, input: Partial<AddVehicleInput>) {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .eq("agency_id", session.agency.id)
    .maybeSingle();

  if (!existing) return { error: "Véhicule introuvable" };

  const updateData: Record<string, unknown> = {};
  if (input.brand) updateData.brand = input.brand;
  if (input.model) updateData.model = input.model;
  if (input.year) updateData.year = input.year;
  if (input.category) updateData.category = input.category;
  if (input.fuelType) updateData.fuel_type = input.fuelType;
  if (input.gearbox) updateData.gearbox = input.gearbox;
  if (input.dailyPrice) updateData.daily_price = input.dailyPrice;
  if (input.depositAmount !== undefined) updateData.deposit_amount = input.depositAmount;
  if (input.mileagePolicy) updateData.mileage_policy = input.mileagePolicy;
  if (input.fuelPolicy) updateData.fuel_policy = input.fuelPolicy;
  if (input.photoUrls) updateData.photos = input.photoUrls;

  const { error } = await supabase.from("vehicles").update(updateData).eq("id", vehicleId);
  if (error) return { error: error.message };

  revalidatePath("/agence/dashboard");
  return { success: true };
}

export async function deleteVehicle(vehicleId: string) {
  const session = await requireAgency();
  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .eq("agency_id", session.agency.id)
    .maybeSingle();

  if (!existing) return { error: "Véhicule introuvable" };

  const { error } = await supabase
    .from("vehicles")
    .update({ is_available: false })
    .eq("id", vehicleId);

  if (error) return { error: error.message };

  revalidatePath("/agence/dashboard");
  return { success: true };
}

export async function uploadVehiclePhoto(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { url: null };

  const supabase = await createServerSupabaseClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `vehicle-${crypto.randomUUID()}-${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("vehicles-photos")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return { error: "Erreur lors de l'upload de la photo" };

  const { data: { publicUrl } } = supabase.storage.from("vehicles-photos").getPublicUrl(data.path);
  return { url: publicUrl };
}
