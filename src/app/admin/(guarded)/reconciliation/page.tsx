"use client";

import { useEffect, useState, useCallback } from "react";
import { getReconciliationData, getAvailableMonths } from "@/actions/admin-reconciliation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminLocale } from "@/lib/admin-locale";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { BadgeVariant } from "@/components/ui/badge";
import type { ReconciliationRow } from "@/actions/admin-reconciliation";

const t = adminLocale;

const STATUS_BADGE: Record<string, BadgeVariant> = {
  activee: "success",
  terminee: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  activee: t.statusActivee,
  terminee: t.statusTerminee,
};

export default function AdminReconciliationPage() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [data, setData] = useState<ReconciliationRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailableMonths().then(({ year, month }) => {
      setCurrentYear(year);
      setCurrentMonth(month);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getReconciliationData(currentYear, currentMonth)
      .then((res) => setData(res.data ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    const now = new Date();
    const nextM = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextY = currentMonth === 12 ? currentYear + 1 : currentYear;
    if (nextY > now.getFullYear() || (nextY === now.getFullYear() && nextM > now.getMonth() + 1)) return;
    setCurrentYear(nextY);
    setCurrentMonth(nextM);
  };

  const exportCsv = useCallback(() => {
    if (!data) return;
    const headers = ["Client", "Email", "Véhicule", "Agence", "Début", "Fin", "Statut", "Prix/jour DH", "Jours", "Total DH", "Commission DH"];
    const rows = data.bookings.map((b) => [
      `"${b.client_name}"`,
      `"${b.client_email}"`,
      `"${b.vehicle_name}"`,
      `"${b.agency_name}"`,
      `"${b.start_date}"`,
      `"${b.end_date}"`,
      `"${STATUS_LABEL[b.status] ?? b.status}"`,
      b.daily_price,
      b.total_days,
      b.total_amount,
      b.commission,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-mowsil-${data.month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">Réconciliation</h1>
            <p className="text-sm text-mowsil-legend mt-1">{t.recSubtitle}</p>
          </div>
          <p className="text-xs text-mowsil-legend bg-white px-3 py-1.5 rounded-full border border-mowsil-card-border">
            {t.recCommissionRate}
          </p>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl border border-mowsil-card-border p-4 mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={20} className="text-mowsil-navy" />
          </button>
          <span className="font-bold text-mowsil-navy text-lg capitalize">
            {data?.monthLabel ?? `${currentYear}-${String(currentMonth).padStart(2, "0")}`}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight size={20} className="text-mowsil-navy" />
          </button>
        </div>

        {loading ? (
          <p className="text-mowsil-legend text-sm">{t.loading}</p>
        ) : !data ? (
          <div className="bg-white rounded-xl border border-mowsil-card-border p-8 text-center">
            <p className="text-mowsil-legend text-sm">{t.recNoData}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-mowsil-card-border p-4 text-center">
                <p className="text-2xl font-bold text-mowsil-navy">{data.totalBookings}</p>
                <p className="text-xs text-mowsil-legend">{t.recBookings}</p>
              </div>
              <div className="bg-white rounded-xl border border-mowsil-card-border p-4 text-center">
                <p className="text-2xl font-bold text-mowsil-navy">{data.totalRevenue.toLocaleString()} DH</p>
                <p className="text-xs text-mowsil-legend">{t.recRevenue}</p>
              </div>
              <div className="bg-white rounded-xl border border-mowsil-card-border p-4 text-center">
                <p className="text-2xl font-bold text-mowsil-green">{data.commission.toLocaleString()} DH</p>
                <p className="text-xs text-mowsil-legend">{t.recCommission}</p>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                <Download size={14} className="mr-1" />
                {t.recExportCsv}
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-mowsil-card-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mowsil-card-border bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colClient}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colVehicle}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colAgency}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colDates}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.recColDays}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.recColTotal}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.recColCommission}</th>
                    <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map((row) => (
                    <tr key={row.id} className="border-b border-mowsil-card-border last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">
                        {row.client_name}<br />
                        <span className="text-xs text-mowsil-legend">{row.client_email}</span>
                      </td>
                      <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{row.vehicle_name}</td>
                      <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{row.agency_name}</td>
                      <td className="px-4 py-3 text-mowsil-body whitespace-nowrap text-xs">
                        {row.start_date} — {row.end_date}
                      </td>
                      <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{row.total_days}</td>
                      <td className="px-4 py-3 font-mono font-bold text-mowsil-navy whitespace-nowrap">{row.total_amount}</td>
                      <td className="px-4 py-3 font-mono font-bold text-mowsil-green whitespace-nowrap">{row.commission}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[row.status] ?? "default"}>
                          {STATUS_LABEL[row.status] ?? row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-mowsil-navy bg-gray-50/80">
                    <td colSpan={4} className="px-4 py-3 font-bold text-mowsil-navy text-right">{t.recBookings} : {data.totalBookings}</td>
                    <td className="px-4 py-3 font-bold text-mowsil-navy">—</td>
                    <td className="px-4 py-3 font-bold text-mowsil-navy">{data.totalRevenue.toLocaleString()} DH</td>
                    <td className="px-4 py-3 font-bold text-mowsil-green">{data.commission.toLocaleString()} DH</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
