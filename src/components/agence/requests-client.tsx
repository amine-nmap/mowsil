"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import ExpiryTimer from "@/components/agence/expiry-timer";

type Booking = {
  id: string;
  vehicle_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  start_date: string;
  end_date: string;
  status: string;
  unique_code: string | null;
  expires_at: string | null;
  created_at: string;
  vehicles: { brand: string; model: string } | null;
};

type Props = {
  bookings: Booking[];
};

const statusBadge: Record<string, "warning" | "success" | "error" | "outline" | "default"> = {
  en_attente: "warning",
  confirmee: "success",
  refusee: "error",
  expiree: "outline",
  activee: "default",
  terminee: "outline",
};

const statusLabel: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  refusee: "Refusée",
  expiree: "Expirée",
  activee: "Activée",
  terminee: "Terminée",
};

const statusOrder: Record<string, number> = {
  en_attente: 0,
  confirmee: 1,
  activee: 2,
  terminee: 3,
  refusee: 4,
  expiree: 5,
};

export default function AgencyRequestsClient({ bookings }: Props) {
  const d = useTranslations("dashboard");
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";
  const isRtl = locale === "ar";

  const sorted = [...bookings].sort(
    (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99),
  );

  const pendingCount = bookings.filter((b) => b.status === "en_attente").length;

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">Demandes de réservation</h1>
            <p className="text-sm text-mowsil-legend mt-1">
              {pendingCount > 0
                ? `${pendingCount} demande${pendingCount > 1 ? "s" : ""} en attente`
                : "Toutes les demandes"}
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardBody className="p-8 text-center">
              <p className="text-sm text-mowsil-legend">Aucune réservation pour le moment</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-2">
            {sorted.map((booking) => (
              <Link
                key={booking.id}
                href={`/${locale}/agence/requests/${booking.id}`}
              >
                <Card hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-mowsil-navy">
                          {booking.vehicles?.brand} {booking.vehicles?.model}
                        </p>
                        <p className="text-xs text-mowsil-legend">
                          {booking.client_name} · {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.expires_at && booking.status === "en_attente" && (
                        <ExpiryTimer expiresAt={booking.expires_at} />
                      )}
                      <Badge variant={statusBadge[booking.status] ?? "outline"}>
                        {statusLabel[booking.status] ?? booking.status}
                      </Badge>
                      {isRtl ? <ArrowLeft size={16} className="text-mowsil-legend" /> : <ArrowRight size={16} className="text-mowsil-legend" />}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
