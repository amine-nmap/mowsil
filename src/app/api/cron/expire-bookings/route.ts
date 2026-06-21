import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.rpc("expire_stale_bookings");

    if (error) {
      console.error("Cron expire-bookings error:", error.message);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    const count = (data as number) ?? 0;
    console.log(`Cron expire-bookings: ${count} réservation(s) expirée(s)`);

    return Response.json({ success: true, expiredCount: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("Cron expire-bookings exception:", message);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
