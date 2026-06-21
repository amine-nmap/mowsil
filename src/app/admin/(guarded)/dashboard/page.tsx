import { Shield, Users, Car, Calendar } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/actions/admin-auth";
import { getAgenciesStats } from "@/actions/admin-agencies";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminLocale } from "@/lib/admin-locale";

const t = adminLocale;

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await getAgenciesStats();

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">{t.dashboard}</h1>
            <p className="text-sm text-mowsil-legend mt-1">
              {t.connectedAs} {session.name ?? session.user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: t.statsAgencies, value: stats.totalAgencies },
            { icon: Car, label: t.statsVehicles, value: stats.totalVehicles },
            { icon: Calendar, label: t.statsBookings, value: stats.totalBookings },
            { icon: Shield, label: t.statsPending, value: stats.pendingAgencies },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardBody className="p-4 text-center">
                <stat.icon size={20} className="mx-auto text-mowsil-green mb-2" />
                <p className="text-2xl font-bold text-mowsil-navy">{stat.value}</p>
                <p className="text-xs text-mowsil-legend">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/agencies">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-5">
                <Building2Icon />
                <h2 className="font-bold text-mowsil-navy mt-3">{t.agencies}</h2>
                <p className="text-xs text-mowsil-legend mt-1">{t.filterPending} : {stats.pendingAgencies}</p>
              </CardBody>
            </Card>
          </Link>
          <Link href="/admin/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="p-5">
                <CalendarIcon />
                <h2 className="font-bold text-mowsil-navy mt-3">{t.bookings}</h2>
                <p className="text-xs text-mowsil-legend mt-1">{t.statsBookings} : {stats.totalBookings}</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Building2Icon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
