import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AgenceGuardedLayout({ children, params }: Props) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect(`/${locale}/agence/login`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "agency") {
    redirect(`/${locale}/agence/login`);
  }

  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .select("status")
    .eq("owner_id", authData.user.id)
    .maybeSingle();

  if (agencyError || !agency || agency.status !== "active") {
    redirect(`/${locale}/agence/login`);
  }

  return <>{children}</>;
}
