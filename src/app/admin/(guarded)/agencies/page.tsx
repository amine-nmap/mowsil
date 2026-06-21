"use client";

import { useEffect, useState, useActionState } from "react";
import { getAllAgencies, activateAgency, suspendAgency } from "@/actions/admin-agencies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminLocale } from "@/lib/admin-locale";
import type { BadgeVariant } from "@/components/ui/badge";

const t = adminLocale;

type Agency = {
  id: string;
  name: string;
  email: string | null;
  city: string;
  status: "pending" | "active" | "suspended";
  created_at: string;
};

const FILTERS = [
  { key: "all", label: t.filterAll },
  { key: "pending", label: t.filterPending },
  { key: "active", label: t.filterActive },
  { key: "suspended", label: t.filterSuspended },
] as const;

const STATUS_BADGE: Record<string, BadgeVariant> = {
  pending: "warning",
  active: "success",
  suspended: "error",
};

const STATUS_LABEL: Record<string, string> = {
  pending: t.filterPending,
  active: t.filterActive,
  suspended: t.filterSuspended,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminAgenciesPage() {
  const [filter, setFilter] = useState("all");
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllAgencies(filter)
      .then(setAgencies)
      .catch(() => setAgencies([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-mowsil-navy mb-6">{t.agencies}</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
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
      ) : agencies.length === 0 ? (
        <p className="text-mowsil-legend text-sm">{t.noAgencies}</p>
      ) : (
        <div className="bg-white rounded-xl border border-mowsil-card-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mowsil-card-border bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colName}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colEmail}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colCity}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colStatus}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colDate}</th>
                <th className="text-left px-4 py-3 font-semibold text-mowsil-navy whitespace-nowrap">{t.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id} className="border-b border-mowsil-card-border last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-mowsil-navy whitespace-nowrap">{agency.name}</td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{agency.email ?? "—"}</td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{agency.city}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[agency.status] ?? "default"}>
                      {STATUS_LABEL[agency.status] ?? agency.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-mowsil-body whitespace-nowrap">{formatDate(agency.created_at)}</td>
                  <td className="px-4 py-3">
                    <AgencyRowActions agencyId={agency.id} currentStatus={agency.status} />
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

function AgencyRowActions({ agencyId, currentStatus }: { agencyId: string; currentStatus: string }) {
  const action = currentStatus === "pending" ? activateAgency : suspendAgency;
  const isPendingStatus = currentStatus === "pending";
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="agencyId" value={agencyId} />
      <Button
        variant={isPendingStatus ? "primary" : "secondary"}
        size="sm"
        disabled={pending}
        className="text-xs"
      >
        {pending ? "..." : (isPendingStatus ? t.activateBtn : t.suspendBtn)}
      </Button>
      {state?.success && <span className="text-mowsil-green text-xs ml-2">{t.agencyActivated}</span>}
      {state?.success === false && <span className="text-red-500 text-xs ml-2">{t.agencyError}</span>}
    </form>
  );
}
