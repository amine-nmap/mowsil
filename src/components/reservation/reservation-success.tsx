"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle, Clock, Car, ArrowLeft, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

type Booking = {
  id: string;
  client_name: string;
  client_email: string;
  start_date: string;
  end_date: string;
  status: string;
  vehicles: { brand: string; model: string } | null;
};

type Props = {
  booking: Booking;
};

export default function ReservationSuccess({ booking }: Props) {
  const t = useTranslations("reservation");
  const params = useParams<{ locale: string }>();
  const isRtl = params.locale === "ar";

  const vehicleName = booking.vehicles
    ? `${booking.vehicles.brand} ${booking.vehicles.model}`
    : "Véhicule";

  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardBody className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-mowsil-green/10 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-mowsil-green" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-mowsil-navy mb-2">
                Demande envoyée !
              </h1>
              <p className="text-sm text-mowsil-body leading-relaxed">
                Votre demande pour la <strong>{vehicleName}</strong> a bien été transmise.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Clock size={16} />
                En attente de confirmation
              </div>
              <p>
                L&apos;agence a <strong>2 heures</strong> pour confirmer votre réservation.
                Vous recevrez un email dès que votre demande sera traitée.
              </p>
            </div>

            <div className="bg-mowsil-gray rounded-lg p-4 space-y-2 text-sm text-start">
              <div className="flex justify-between">
                <span className="text-mowsil-legend">Email</span>
                <span className="font-semibold text-mowsil-navy">{booking.client_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mowsil-legend">Dates</span>
                <span className="font-semibold text-mowsil-navy">
                  {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mowsil-legend">Statut</span>
                <span className="font-semibold text-amber-500">En attente</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-mowsil-legend mb-4">
                Un email de confirmation vous sera envoyé dès que l&apos;agence aura
                validé votre demande.
              </p>
              <Link href={`/${params.locale}/results`}>
                <Button variant="primary" size="lg" className="gap-2">
                  {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                  Retour aux véhicules
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-mowsil-legend">
            Vous pouvez également créer un compte MOWSIL pour suivre vos réservations.
          </p>
        </div>
      </div>
    </div>
  );
}
