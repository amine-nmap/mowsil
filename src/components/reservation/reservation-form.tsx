"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import {
  Car, Calendar, Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft,
} from "lucide-react";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/components/ui/message";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  fuel_type: string;
  gearbox: string;
  deposit_amount: number | null;
  agencies?: { name: string; city: string } | null;
};

type Props = {
  vehicle: Vehicle;
  defaultStartDate: string;
  defaultEndDate: string;
  defaultStartTime: string;
  defaultEndTime: string;
};

type FormState = { error: string };

const initialState: FormState = { error: "" };

export default function ReservationForm({
  vehicle,
  defaultStartDate,
  defaultEndDate,
  defaultStartTime,
  defaultEndTime,
}: Props) {
  const t = useTranslations("reservation");
  const v = useTranslations("vehicles");
  const c = useTranslations("common");
  const router = useRouter();
  const params = useParams<{ vehicleId: string; locale: string }>();
  const isRtl = params.locale === "ar";

  const submitAction = async (prev: FormState, formData: FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const license = formData.get("license") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const birthDate = formData.get("birthDate") as string;
    const licenseIssueDate = formData.get("licenseIssueDate") as string;

    const fullName = `${firstName} ${lastName}`.trim();

    const result = await createBooking({
      vehicleId: vehicle.id,
      clientName: fullName,
      clientPhone: phone,
      clientEmail: email,
      clientLicenseNumber: license,
      birthDate: new Date(birthDate).toISOString(),
      licenseIssueDate: new Date(licenseIssueDate).toISOString(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      locale: params.locale,
    });

    if (result.error) return { error: result.error };

    if (result.success && result.bookingId) {
      router.push(`/${params.locale}/reservation/${result.bookingId}`);
      return { error: "" };
    }

    return { error: c("error") };
  };

  const [state, formAction, pending] = useActionState(submitAction, initialState);

  const days = defaultStartDate && defaultEndDate
    ? Math.max(1, Math.ceil(
        (new Date(defaultEndDate).getTime() - new Date(defaultStartDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ))
    : 1;

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-mowsil-navy hover:text-mowsil-green transition-colors mb-6"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {c("back")}
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-mowsil-navy">{t("title")}</h1>
          <p className="text-sm text-mowsil-legend mt-1">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardBody className="p-6">
                <form action={formAction} className="space-y-4">
                  {state?.error && (
                    <Message variant="error" className="text-sm">
                      <p>{state.error}</p>
                    </Message>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="firstName"
                      name="firstName"
                      label={t("formFirstName")}
                      placeholder={t("formFirstNamePlaceholder")}
                      required
                    />
                    <Input
                      id="lastName"
                      name="lastName"
                      label={t("formLastName")}
                      placeholder={t("formLastNamePlaceholder")}
                      required
                    />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    label={t("formEmail")}
                    type="email"
                    placeholder={t("formEmailPlaceholder")}
                    required
                  />
                  <Input
                    id="phone"
                    name="phone"
                    label={t("formPhone")}
                    type="tel"
                    placeholder={t("formPhonePlaceholder")}
                    required
                  />
                  <Input
                    id="license"
                    name="license"
                    label={t("formLicense")}
                    placeholder={t("formLicensePlaceholder")}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="birthDate"
                      name="birthDate"
                      label={t("formBirthDate")}
                      type="date"
                      required
                    />
                    <Input
                      id="licenseIssueDate"
                      name="licenseIssueDate"
                      label={t("formLicenseIssueDate")}
                      type="date"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="startDate"
                      name="startDate"
                      label={t("formStartDate")}
                      type="date"
                      defaultValue={defaultStartDate}
                      required
                    />
                    <Input
                      id="endDate"
                      name="endDate"
                      label={t("formEndDate")}
                      type="date"
                      defaultValue={defaultEndDate}
                      required
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full gap-2"
                    disabled={pending}
                  >
                    {pending ? (
                      <>
                        <Clock size={18} className="animate-spin" />
                        {c("loading")}
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        {t("formSubmit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-24">
              <CardBody className="p-5 space-y-4">
                <h2 className="font-bold text-mowsil-navy">{t("bookingFor")}</h2>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-mowsil-gray">
                  <Car size={20} className="text-mowsil-navy shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-mowsil-navy">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-xs text-mowsil-legend">{vehicle.year} · {vehicle.fuel_type} · {vehicle.gearbox}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-mowsil-gray">
                  <Calendar size={20} className="text-mowsil-navy shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-mowsil-navy">
                      {defaultStartDate || "À définir"} - {defaultEndDate || "À définir"}
                    </p>
                    <p className="text-xs text-mowsil-legend">{days} jour{days > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="border-t border-mowsil-card-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mowsil-legend">{v("perDay")}</span>
                    <span className="font-semibold">{vehicle.daily_price} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mowsil-legend">Durée</span>
                    <span className="font-semibold">{days} jour{days > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-mowsil-card-border pt-2">
                    <span>{t("totalPrice")}</span>
                    <span className="text-mowsil-green">{vehicle.daily_price * days} DH</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
