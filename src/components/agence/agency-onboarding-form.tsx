"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import {
  Building2, MapPin, ShieldCheck, CheckCircle,
  ArrowLeft, ArrowRight, AlertCircle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import PhotoUploader from "@/components/agence/photo-uploader";
import { registerAgency, uploadFacadePhoto } from "@/actions/register-agency";
import {
  step1Schema, step2Schema, step3Schema,
  type Step1Data, type Step2Data, type Step3Data,
} from "@/lib/validation/agency-onboarding";

const LocationPicker = dynamic(
  () => import("@/components/agence/location-picker"),
  { ssr: false, loading: () => <div className="h-[250px] rounded-lg bg-mowsil-gray flex items-center justify-center text-sm text-mowsil-legend">Carte en chargement...</div> },
);

const steps = [
  { key: "identity", icon: Building2 },
  { key: "info", icon: MapPin },
  { key: "security", icon: ShieldCheck },
  { key: "success", icon: CheckCircle },
];

type FormState = {
  step: number;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
};

export default function AgencyOnboardingForm() {
  const t = useTranslations("agencies");
  const c = useTranslations("common");
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const isRtl = params?.locale === "ar";

  const [formState, setFormState] = useState<FormState>({
    step: 0,
    step1: { companyName: "", city: "Oujda", phone: "", email: "" },
    step2: { address: "", coordinates: { lat: 34.6814, lng: -1.9086 }, openingHours: "9:00-21:00", fleetSize: 1, facadePhoto: null },
    step3: { password: "", passwordConfirm: "", acceptCgu: false },
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(
      formState.step === 0
        ? step1Schema
        : formState.step === 1
          ? step2Schema
          : step3Schema,
    ),
    defaultValues: {
      ...formState.step1,
      ...formState.step2,
      ...formState.step3,
      acceptCgu: false,
    },
    mode: "onChange",
  }) as any;

  const formErrors = errors as Record<string, { message?: string } | undefined>;

  const progress = (formState.step / (steps.length - 1)) * 100;

  const onNext = useCallback(async () => {
    const valid = await trigger();
    if (!valid) return;

    if (formState.step < 2) {
      setFormState((prev) => ({
        ...prev,
        step: prev.step + 1,
        [prev.step === 0 ? "step1" : "step2"]: getValues(),
      }));
    }
  }, [formState.step, trigger, getValues]);

  const onBack = useCallback(() => {
    if (formState.step > 0) {
      setFormState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  }, [formState.step]);

  const onSubmit = useCallback(async () => {
    const valid = await trigger();
    if (!valid) return;

    setSubmitting(true);
    setError("");

    try {
      const data = {
        ...formState.step1,
        ...getValues(),
      } as unknown as Step1Data & Step2Data & Step3Data;

      let facadePhotoUrl: string | null = null;
      if (data.facadePhoto) {
        const fd = new FormData();
        fd.append("file", data.facadePhoto);
        const uploadResult = await uploadFacadePhoto(fd) as { url?: string; error?: string };
        if (uploadResult.error) {
          setError(uploadResult.error);
          setSubmitting(false);
          return;
        }
        facadePhotoUrl = uploadResult.url ?? null;
      }

      const result = await registerAgency({
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        coordinates: data.coordinates,
        openingHours: data.openingHours,
        fleetSize: data.fleetSize,
        facadePhotoUrl,
        password: data.password,
      });

      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      setFormState((prev) => ({ ...prev, step: 3 }));
    } catch {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.");
      setSubmitting(false);
    }
  }, [formState, getValues, trigger]);

  if (formState.step === 3) {
    return (
      <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-mowsil-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-mowsil-green" />
          </div>
          <h1 className="text-2xl font-bold text-mowsil-navy mb-3">
            {t("successTitle")}
          </h1>
          <p className="text-sm text-mowsil-body leading-relaxed max-w-sm mx-auto">
            {t("successMessage")}
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={() => router.push(`/${params?.locale ?? "fr"}`)}
          >
            {c("search")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-mowsil-navy">{t("registerTitle")}</h1>
          <p className="text-sm text-mowsil-legend mt-1">{t("registerSubtitle")}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i <= formState.step
                      ? "bg-mowsil-green text-white"
                      : "bg-white border border-mowsil-card-border text-mowsil-legend"
                  }`}
                >
                  <s.icon size={16} />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  i <= formState.step ? "text-mowsil-green" : "text-mowsil-legend"
                }`}>
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-mowsil-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardBody className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-mowsil-navy mb-6">
              {t(`step${formState.step + 1}Title`)}
            </h2>

            {error && (
              <Message variant="error" className="mb-4 text-sm">
                <p>{error}</p>
              </Message>
            )}

            {formState.step === 0 && (
              <div className="space-y-4">
                <Input
                  id="companyName"
                  label={t("companyName")}
                  placeholder={t("companyNamePlaceholder")}
                  error={formErrors.companyName?.message}
                  {...register("companyName")}
                />
                <Input
                  id="city"
                  label={t("city")}
                  value="Oujda"
                  disabled
                />
                <Input
                  id="phone"
                  label={t("phone")}
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  error={formErrors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  id="email"
                  label={t("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  error={formErrors.email?.message}
                  {...register("email")}
                />
              </div>
            )}

            {formState.step === 1 && (
              <div className="space-y-4">
                <Input
                  id="address"
                  label={t("address")}
                  placeholder={t("addressPlaceholder")}
                  error={formErrors.address?.message}
                  {...register("address")}
                />

                <Controller
                  control={control}
                  name="coordinates"
                  render={({ field }) => (
                    <LocationPicker
                      value={field.value}
                      onChange={(coord) => field.onChange(coord)}
                    />
                  )}
                />

                <div className="space-y-1.5">
                  <label htmlFor="openingHours" className="block text-sm font-bold text-mowsil-navy">
                    <Clock size={16} className="inline align-text-bottom me-1" />
                    {t("hours")}
                  </label>
                  <select
                    id="openingHours"
                    className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green transition-all duration-200"
                    {...register("openingHours")}
                  >
                    <option value="9:00-12:00,14:00-18:00">9h-12h · 14h-18h (lun-ven)</option>
                    <option value="9:00-12:00,14:00-17:00">9h-12h · 14h-17h (lun-sam)</option>
                    <option value="9:00-21:00">9h-21h (lun-sam)</option>
                    <option value="9:00-18:00">9h-18h (lun-ven)</option>
                    <option value="8:00-22:00">8h-22h (7j/7)</option>
                    <option value="24h/24">24h/24</option>
                  </select>
                  {formErrors.openingHours && (
                    <p className="text-xs text-mowsil-error">{formErrors.openingHours.message}</p>
                  )}
                </div>

                <Input
                  id="fleetSize"
                  label={t("fleetSize")}
                  type="number"
                  min="1"
                  placeholder={t("fleetSizePlaceholder")}
                  error={formErrors.fleetSize?.message}
                  {...register("fleetSize", { valueAsNumber: true })}
                />

                <Controller
                  control={control}
                  name="facadePhoto"
                  render={({ field }) => (
                    <PhotoUploader
                      value={field.value}
                      onChange={(f) => field.onChange(f)}
                    />
                  )}
                />
              </div>
            )}

            {formState.step === 2 && (
              <div className="space-y-4">
                <Input
                  id="password"
                  label={t("password")}
                  type="password"
                  error={formErrors.password?.message}
                  {...register("password")}
                />
                <Input
                  id="passwordConfirm"
                  label={t("passwordConfirm")}
                  type="password"
                  error={formErrors.passwordConfirm?.message}
                  {...register("passwordConfirm")}
                />

                <Controller
                  control={control}
                  name="acceptCgu"
                  render={({ field }) => (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-mowsil-card-border text-mowsil-green focus:ring-mowsil-green"
                      />
                      <span className="text-sm text-mowsil-body leading-relaxed">
                        {t("acceptCgu")}
                      </span>
                    </label>
                  )}
                />
                {formErrors.acceptCgu && (
                  <p className="text-xs text-mowsil-error flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.acceptCgu.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-mowsil-card-border">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                disabled={formState.step === 0}
                onClick={onBack}
              >
                {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {c("back")}
              </Button>

              {formState.step < 2 ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2"
                  onClick={onNext}
                >
                  {c("next")}
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2"
                  disabled={submitting || !!formErrors.acceptCgu}
                  onClick={onSubmit}
                >
                  {submitting ? "Inscription en cours..." : t("submit")}
                  {!submitting && <CheckCircle size={16} />}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
