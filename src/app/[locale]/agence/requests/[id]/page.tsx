import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAgency } from "@/actions/auth";
import { notFound } from "next/navigation";
import RequestDetailClient from "@/components/agence/request-detail-client";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function RequestDetailPage({ params }: Props) {
  const { id } = await params;
  await requireAgency();

  const supabase = await createServerSupabaseClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, vehicles!inner(*, agencies!inner(*))")
    .eq("id", id)
    .maybeSingle();

  if (!booking) notFound();

  return <RequestDetailClient booking={booking} />;
}
