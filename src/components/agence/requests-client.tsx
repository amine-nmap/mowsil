"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import ExpiryTimer from "@/components/agence/expiry-timer";
import { completeBooking } from "@/actions/agency-bookings";

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

const statusKey: Record<string, string> = {
  en_attente: "pending",
  confirmee: "confirmed",
  refusee: "rejected",
  expiree: "expired",
  activee: "activated",
  terminee: "completed",
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
  const s = useTranslations("statuses");
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
            <h1 className="text-2xl font-bold text-mowsil-navy">{d("requestsTitle")}</h1>
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
              <p className="text-sm text-mowsil-legend">{d("emptyState")}</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-2">
            {sorted.map((booking) =>
              booking.status === "activee" ? (
                <ActiveBookingCard key={booking.id} booking={booking} locale={locale} isRtl={isRtl} />
              ) : (
                <Link key={booking.id} href={`/${locale}/agence/requests/${booking.id}`}>
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
                          {s(statusKey[booking.status] ?? booking.status)}
                        </Badge>
                        {isRtl ? <ArrowLeft size={16} className="text-mowsil-legend" /> : <ArrowRight size={16} className="text-mowsil-legend" />}
                      </div>
                    </div>
                  </Card>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveBookingCard({ booking, locale, isRtl }: { booking: Booking; locale: string; isRtl: boolean }) {
  const d = useTranslations("dashboard");
  const s = useTranslations("statuses");
  const [state, formAction, pending] = useActionState(completeBooking, { error: "", success: false });

  return (
    <Card className="p-4 border-mowsil-green/30">
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
          <Badge variant="default">{s("activated")}</Badge>
          <form action={formAction}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <Button variant="primary" size="sm" className="gap-1 text-xs" disabled={pending}>
              <CheckCircle size={14} />
              {pending ? "..." : d("closeBooking")}
            </Button>
          </form>
          {state?.error && <p className="text-xs text-mowsil-error">{state.error}</p>}
          {state?.success && <p className="text-xs text-mowsil-green">{d("completedSuccess")} ✓</p>}
        </div>
      </div>
    </Card>
  );
}
