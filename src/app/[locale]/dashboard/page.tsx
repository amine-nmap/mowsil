import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ClientDashboard from "./client-dashboard";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: `${t("title")} | MOWSIL` };
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user ?? null;

  if (!user?.email) {
    return (
      <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
        <ClientDashboard bookings={[]} email={null} />
      </div>
    );
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, vehicles(brand, model, agencies(name))")
    .eq("client_email", user.email)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <ClientDashboard bookings={bookings ?? []} email={user.email} />
    </div>
  );
}
