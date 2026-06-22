import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ReservationSuccess from "@/components/reservation/reservation-success";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return { title: `${t("successTitle")} | MOWSIL` };
}

export default async function ReservationSuccessPage({ params }: Props) {
  const { id } = await params;

  let booking: any;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("bookings")
      .select("*, vehicles(brand, model), agencies(name, city)")
      .eq("id", id)
      .maybeSingle();
    booking = data;
  } catch {
    booking = null;
  }

  if (!booking) notFound();

  return <ReservationSuccess booking={booking} />;
}
