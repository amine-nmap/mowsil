import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export async function getAgencySession() {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "agency") return null;

  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", authData.user.id)
    .maybeSingle();

  if (agencyError || !agency || agency.status !== "active") return null;

  return { user: authData.user, agency };
}

export async function requireAgency() {
  const session = await getAgencySession();
  if (!session) redirect(`/${routing.defaultLocale}/agence/login`);
  return session;
}
