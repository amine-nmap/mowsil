"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle, Clock, Car, Mail, User, ArrowLeft, ArrowRight,
} from "lucide-react";
import { createAccountFromBooking } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";

type Vehicle = { brand: string; model: string };
type Agency = { name: string; city: string };

type Booking = {
  id: string;
  client_name: string;
  client_email: string;
  start_date: string;
  end_date: string;
  status: string;
  expires_at: string | null;
  vehicles: Vehicle | null;
  agencies: Agency | null;
};

type Props = {
  booking: Booking;
};

function ExpiryTimer({ expiresAt }: { expiresAt: string }) {
  const t = useTranslations("reservation");

  function computeDisplay(): [string, boolean] {
    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return [t("timerExpired"), true];

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return [t("timeRemaining", { hours, minutes }), false];
    return [t("minutesRemaining", { minutes }), false];
  }

  const [display, setDisplay] = useState(computeDisplay()[0]);
  const [expired, setExpired] = useState(computeDisplay()[1]);

  const update = useCallback(() => {
    const [text, isExpired] = computeDisplay();
    setExpired(isExpired);
    setDisplay(text);
  }, [expiresAt, t]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, [update]);

  if (expired) {
    return <span className="text-mowsil-error font-bold">{display}</span>;
  }

  return <span className="font-mono font-bold text-mowsil-navy text-lg">{display}</span>;
}

type AccountFormState = { error: string; success: boolean };

const initialAccountState: AccountFormState = { error: "", success: false };

function CreateAccountForm({ bookingId, clientEmail }: { bookingId: string; clientEmail: string }) {
  const t = useTranslations("reservation");
  const [state, formAction, pending] = useActionState(
    async (_prev: AccountFormState, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      return createAccountFromBooking(bookingId, email, password);
    },
    initialAccountState,
  );

  if (state.success) {
    return (
      <Message variant="success" className="text-sm">
        <p>{t("accountCreated")}</p>
      </Message>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <Message variant="error" className="text-sm">
          <p>{state.error}</p>
        </Message>
      )}
      <Input
        id="accountEmail"
        name="email"
        type="email"
        label="Email"
        defaultValue={clientEmail}
        required
      />
      <Input
        id="accountPassword"
        name="password"
        type="password"
        label={t("passwordLabel")}
        placeholder="••••••••"
        minLength={8}
        required
      />
      <Button
        variant="secondary"
        size="sm"
        className="w-full gap-2"
        disabled={pending}
      >
        <User size={16} />
        {t("createAccountButton")}
      </Button>
    </form>
  );
}

export default function ReservationSuccess({ booking }: Props) {
  const t = useTranslations("reservation");
  const params = useParams<{ locale: string }>();
  const isRtl = params.locale === "ar";

  const vehicleName = booking.vehicles
    ? `${booking.vehicles.brand} ${booking.vehicles.model}`
    : "Véhicule";

  const agencyName = booking.agencies?.name ?? "Agence partenaire";

  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full px-4 py-16">
        <Card>
          <CardBody className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-mowsil-green/10 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-mowsil-green" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-mowsil-navy mb-2">
                {t("successTitle")}
              </h1>
              <p className="text-sm text-mowsil-body leading-relaxed">
                {t("successSubtitle")}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-amber-800 font-semibold mb-2">
                <Clock size={18} />
                {booking.expires_at && <ExpiryTimer expiresAt={booking.expires_at} />}
              </div>
              <p className="text-xs text-amber-700">
                {t("timeRemaining", { hours: 2, minutes: 0 })}
              </p>
            </div>

            <div className="bg-mowsil-gray rounded-lg p-4 space-y-3 text-sm text-start">
              <div className="flex items-center gap-3">
                <Car size={16} className="text-mowsil-navy shrink-0" />
                <div>
                  <p className="font-semibold text-mowsil-navy">{vehicleName}</p>
                  <p className="text-xs text-mowsil-legend">{agencyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-mowsil-navy shrink-0" />
                <div>
                  <p className="font-semibold text-mowsil-navy">
                    {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-mowsil-navy shrink-0" />
                <span className="text-mowsil-legend">{booking.client_email}</span>
              </div>
            </div>

            <Message variant="info" className="text-xs text-start">
              <div className="flex items-start gap-2">
                <Mail size={14} className="shrink-0 mt-0.5" />
                <p>{t("emailNotice")}</p>
              </div>
            </Message>

            <hr className="border-mowsil-card-border" />

            <div className="text-start">
              <h3 className="font-bold text-mowsil-navy text-sm mb-1">
                {t("createAccountTitle")}
              </h3>
              <p className="text-xs text-mowsil-legend mb-4">
                {t("createAccountSubtitle")}
              </p>
              <CreateAccountForm bookingId={booking.id} clientEmail={booking.client_email} />
            </div>

            <div>
              <Link href={`/${params.locale}/`}>
                <Button variant="primary" size="lg" className="w-full gap-2">
                  {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                  {t("backToHome")}
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}