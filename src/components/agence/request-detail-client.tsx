"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, Clock, Calendar,
  User, Phone, Mail, IdCard, Car,
  ArrowLeft, ArrowRight,
} from "lucide-react";
import { acceptBooking, rejectBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import ExpiryTimer from "@/components/agence/expiry-timer";

type Booking = {
  id: string;
  vehicle_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  client_license_number: string;
  start_date: string;
  end_date: string;
  status: string;
  unique_code: string | null;
  expires_at: string | null;
  created_at: string;
  vehicles: {
    brand: string;
    model: string;
    year: number;
    daily_price: number;
    fuel_type: string;
    gearbox: string;
    agencies: { name: string };
  } | null;
};

type Props = {
  booking: Booking;
};

const statusLabel: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  refusee: "Refusée",
  expiree: "Expirée",
  activee: "Activée",
  terminee: "Terminée",
};

export default function RequestDetailClient({ booking }: Props) {
  const router = useRouter();
  const v = useTranslations("vehicles");

  async function handleAccept() {
    const result = await acceptBooking(booking.id);
    if (result.error) return;
    router.refresh();
  }

  async function handleReject() {
    const result = await rejectBooking(booking.id);
    router.refresh();
  }

  const isPending = booking.status === "en_attente";

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-mowsil-navy hover:text-mowsil-green transition-colors mb-6"
        >
          Retour
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">Détail de la demande</h1>
            <p className="text-sm text-mowsil-legend mt-1">
              Réservation #{booking.id.slice(0, 8)}
            </p>
          </div>
          <Badge
            variant={
              booking.status === "en_attente" ? "warning"
              : booking.status === "confirmee" || booking.status === "activee" ? "success"
              : booking.status === "refusee" || booking.status === "expiree" ? "error"
              : "outline"
            }
          >
            {statusLabel[booking.status] ?? booking.status}
          </Badge>
        </div>

        {booking.expires_at && isPending && (
          <Card className="mb-6">
            <CardBody className="p-4 flex items-center gap-3">
              <Clock size={20} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-mowsil-navy">Temps restant pour répondre</p>
                <ExpiryTimer expiresAt={booking.expires_at} />
              </div>
            </CardBody>
          </Card>
        )}

        {booking.unique_code && (
          <Card className="mb-6 border-mowsil-green/30">
            <CardBody className="p-5 text-center">
              <p className="text-xs text-mowsil-legend uppercase tracking-wider mb-1">Code de retrait</p>
              <p className="text-3xl font-bold text-mowsil-green tracking-widest">
                {booking.unique_code}
              </p>
            </CardBody>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <Card>
            <CardBody className="p-5 space-y-4">
              <h2 className="font-bold text-mowsil-navy flex items-center gap-2">
                <User size={16} /> Client
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-mowsil-legend shrink-0" />
                  <span className="text-mowsil-navy font-semibold">{booking.client_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-mowsil-legend shrink-0" />
                  <span className="text-mowsil-navy">{booking.client_phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-mowsil-legend shrink-0" />
                  <span className="text-mowsil-navy">{booking.client_email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard size={16} className="text-mowsil-legend shrink-0" />
                  <span className="text-mowsil-navy">{booking.client_license_number}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5 space-y-4">
              <h2 className="font-bold text-mowsil-navy flex items-center gap-2">
                <Calendar size={16} /> Période
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-mowsil-legend shrink-0" />
                  <div>
                    <p className="text-mowsil-legend text-xs">Début</p>
                    <p className="text-mowsil-navy font-semibold">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-mowsil-legend shrink-0" />
                  <div>
                    <p className="text-mowsil-legend text-xs">Fin</p>
                    <p className="text-mowsil-navy font-semibold">
                      {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="mb-8">
          <CardBody className="p-5 space-y-4">
            <h2 className="font-bold text-mowsil-navy flex items-center gap-2">
              <Car size={16} /> Véhicule
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-mowsil-navy">
                  {booking.vehicles?.brand} {booking.vehicles?.model} ({booking.vehicles?.year})
                </p>
                <p className="text-sm text-mowsil-legend">
                  {booking.vehicles?.fuel_type} · {booking.vehicles?.gearbox} · {booking.vehicles?.agencies?.name}
                </p>
              </div>
              <div className="text-end">
                <p className="text-2xl font-bold text-mowsil-green">
                  {booking.vehicles?.daily_price} <span className="text-sm font-normal text-mowsil-legend">{v("perDay")}</span>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {isPending && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={handleAccept}
            >
              <CheckCircle size={18} />
              Accepter la réservation
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="w-full gap-2"
              onClick={handleReject}
            >
              <XCircle size={18} />
              Refuser la réservation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
