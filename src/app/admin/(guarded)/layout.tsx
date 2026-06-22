import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LayoutDashboard, Building2, Calendar, Receipt, QrCode, LogOut } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { adminLocale } from "@/lib/admin-locale";

const t = adminLocale;
const navItems = [
  { href: "/admin/dashboard", label: t.dashboard, icon: LayoutDashboard },
  { href: "/admin/agencies", label: t.agencies, icon: Building2 },
  { href: "/admin/bookings", label: t.bookings, icon: Calendar },
  { href: "/admin/reconciliation", label: t.reconciliation, icon: Receipt },
  { href: "/admin/qr-stickers", label: t.qrStickers, icon: QrCode },
];

export default async function AdminGuardedLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") redirect("/admin/login");

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="fixed inset-y-0 left-0 z-30 w-56 bg-[#0A2540] flex flex-col">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
          <div className="w-7 h-7 rounded bg-[#00C896] flex items-center justify-center text-[#0A2540] font-bold text-xs">
            M
          </div>
          <span className="text-white font-bold text-lg tracking-tight">MOWSIL</span>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <form action="/api/admin-logout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
            >
              <LogOut size={18} />
              {t.logout}
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-56 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
