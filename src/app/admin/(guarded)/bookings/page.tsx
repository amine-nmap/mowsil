"use client";

import { useEffect, useState } from "react";
import { getAllBookings } from "@/actions/admin-bookings";
import { Badge } from "@/components/ui/badge";
import { adminLocale } from "@/lib/admin-locale";
import type { BadgeVariant } from "@/components/ui/badge";

const t = adminLocale;

type Booking = {
  id: string;
  client_name: string;
  client_email: string;
  status: string;
  unique_code: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  vehicles: any;
};

const STATUS_FILTERS = [
  { key: "all", label: t.filterAllStatuses },
  { key: "en_attente", label: t.statusEnAttente },
  { key: "confirmee", label: t.statusConfirmee },
  { key: "refusee", label: t.statusRefusee },
  { key: "expiree", label: t.statusExpiree },
  { key: "activee", label: t.statusActivee },
  { key: "terminee", label: t.statusTerminee },
] as const;

const STATUS_BADGE: Record<string, BadgeVariant> = {
  en_attente: "warning",
  confirmee: "success",
  refusee: "error",
  expiree: "default",
  activee: "success",
  terminee: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  en_attente: t.statusEnAttente,
  confirmee: t.statusConfirmee,
  refusee: t.statusRefusee,
  expiree: t.statusExpiree,
  activee: t.statusActivee,
  terminee: t.statusTerminee,
};

function getVehicleName(vehicles: any): string {
  if (!vehicles) return "—";
  const v = Array.isArray(vehicles) ? vehicles[0] : vehicles;
  return v ? `${v.brand ?? ""} ${v.model ?? ""}`.trim() || "—" : "—";
}

function getAgencyName(vehicles: any): string {
  if (!vehicles) return "—";
  const v = Array.isArray(vehicles) ? vehicles[0] : vehicles;
  if (!v?.agencies) return "—";
  const a = Array.isArray(v.agencies) ? v.agencies[0] : v.agencies;
  return a?.name ?? "—";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatDateRange(start: string, end: string) {
  return `${formatDate(start)} — ${formatDate(end)}`;
}

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllBookings(filter)
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-mowsil-navy mb-6">{t.bookings}</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
              filter === f.key
                ? "bg-mowsil-navy text-white"
                : "bg-white text-mowsil-legend border border-mowsil-card-border hover:border-mowsil-navy"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-mowsil-legend text-sm">Chargement...</p>
      ) : bookings.length === 0 ? (
        <p className="text-mowsil-legend text-sm">{t.noBookings}</p>
      ) : (
        <div className="bg-white rounded-xl border border-mowsil-card-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mowsil-card-border bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colCode}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colClient}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colVehicle}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colAgency}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colStatus}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colDates}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-mowsil-card-border last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-mowsil-navy whitespace-nowrap">
                    {booking.unique_code ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">
                    {booking.client_name}<br />
                    <span className="text-xs text-mowsil-legend">{booking.client_email}</span>
                  </td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">
                    {getVehicleName(booking.vehicles)}
                  </td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">
                    {getAgencyName(booking.vehicles)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[booking.status] ?? "default"}>
                      {STATUS_LABEL[booking.status] ?? booking.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap text-xs">
                    {formatDateRange(booking.start_date, booking.end_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
