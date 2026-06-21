import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReservationSuccess from "@/components/reservation/reservation-success";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

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
