"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Car, Copy, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BookingVehicle = { brand: string; model: string } | null;
type BookingAgency = { name: string } | null;

type Booking = {
  id: string;
  client_email: string;
  start_date: string;
  end_date: string;
  status: string;
  unique_code: string | null;
  created_at: string;
  vehicles: BookingVehicle;
  agencies: BookingAgency;
};

const STATUS_MAP: Record<string, { key: string; variant: "warning" | "success" | "error" | "outline" | "default" }> = {
  en_attente: { key: "pending", variant: "warning" },
  confirmee: { key: "confirmed", variant: "success" },
  refusee: { key: "rejected", variant: "error" },
  expiree: { key: "expired", variant: "outline" },
  activee: { key: "activated", variant: "default" },
  terminee: { key: "completed", variant: "outline" },
};

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 text-mowsil-green font-bold text-lg tracking-widest font-mono hover:underline"
    >
      {code}
      {copied ? <Check size={16} className="text-mowsil-green" /> : <Copy size={16} className="text-mowsil-navy" />}
    </button>
  );
}

type Props = {
  bookings: Booking[];
  email: string | null;
};

export default function ClientDashboard({ bookings, email }: Props) {
  const d = useTranslations("dashboard");
  const s = useTranslations("statuses");
  const params = useParams<{ locale: string }>();
  const isRtl = params.locale === "ar";

  if (!email) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-mowsil-gray flex items-center justify-center mx-auto">
          <Car size={32} className="text-mowsil-legend" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-mowsil-navy mb-2">{d("title")}</h1>
          <p className="text-sm text-mowsil-body">{d("loginPrompt")}</p>
        </div>
        <Link href={`/${params.locale}/agence/login`}>
          <Button variant="primary" size="lg" className="gap-2">
            {d("loginButton")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mowsil-navy">{d("title")}</h1>
        <p className="text-sm text-mowsil-legend mt-1">{d("subtitle")}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center space-y-6 py-16">
          <div className="w-16 h-16 rounded-full bg-mowsil-gray flex items-center justify-center mx-auto">
            <Car size={32} className="text-mowsil-legend" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-mowsil-navy mb-1">{d("emptyState")}</h2>
            <p className="text-sm text-mowsil-body">{d("emptyStateDesc")}</p>
          </div>
          <Link href={`/${params.locale}/results`}>
            <Button variant="primary" size="lg" className="gap-2">
              {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              {d("bookNow")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const statusInfo = STATUS_MAP[booking.status] ?? { key: "pending", variant: "warning" as const };
            const vehicleName = booking.vehicles
              ? `${booking.vehicles.brand} ${booking.vehicles.model}`
              : "Véhicule";
            const agencyName = booking.agencies?.name ?? "";

            return (
              <Card key={booking.id}>
                <CardBody className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-mowsil-navy text-base">{vehicleName}</h3>
                        {agencyName && (
                          <span className="text-xs text-mowsil-legend">— {agencyName}</span>
                        )}
                      </div>
                      <p className="text-sm text-mowsil-legend">
                        {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={statusInfo.variant}>{s(statusInfo.key)}</Badge>
                  </div>

                  {(booking.status === "confirmee" || booking.status === "activee") && booking.unique_code && (
                    <div className="mt-4 pt-4 border-t border-mowsil-card-border flex items-center justify-between">
                      <span className="text-xs text-mowsil-legend font-semibold uppercase tracking-wider">
                        {d("codeLabel")}
                      </span>
                      <CopyCode code={booking.unique_code} />
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
