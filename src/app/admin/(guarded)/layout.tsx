import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function AdminGuardedLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
