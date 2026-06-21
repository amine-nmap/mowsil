"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Car, Settings, Gauge, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import PhotoUploader from "@/components/agence/photo-uploader";
import { addVehicle, uploadVehiclePhoto } from "@/actions/vehicles";

const CATEGORIES = ["Citadine", "Berline", "SUV", "Prestige"];

type StepData = {
  brand: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  gearbox: string;
  dailyPrice: number;
  depositAmount: string;
  mileagePolicy: string;
  fuelPolicy: string;
  photos: File[];
};

const defaultData: StepData = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "Citadine",
  fuelType: "Essence",
  gearbox: "Manuelle",
  dailyPrice: 0,
  depositAmount: "",
  mileagePolicy: "Illimité",
  fuelPolicy: "Plein à plein",
  photos: [],
};

export default function VehicleForm() {
  const t = useTranslations("vehicles");
  const c = useTranslations("common");
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const isRtl = params?.locale === "ar";

  const [step, setStep] = useState(0);
  const [data, setData] = useState<StepData>(defaultData);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canNext = useCallback(() => {
    if (step === 0) return data.brand.length > 0 && data.model.length > 0 && data.year > 2000;
    if (step === 1) return data.dailyPrice > 0;
    if (step === 2) return true;
    if (step === 3) return data.photos.length >= 3;
    return false;
  }, [step, data]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    setError("");

    try {
      const photoUrls: string[] = [];
      for (const file of data.photos) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadVehiclePhoto(fd);
        if (result.error) { setError(result.error); setSubmitting(false); return; }
        if (result.url) photoUrls.push(result.url);
      }

      const result = await addVehicle({
        brand: data.brand,
        model: data.model,
        year: data.year,
        category: data.category,
        fuelType: data.fuelType,
        gearbox: data.gearbox,
        dailyPrice: data.dailyPrice,
        depositAmount: data.depositAmount ? parseInt(data.depositAmount) : null,
        mileagePolicy: data.mileagePolicy,
        fuelPolicy: data.fuelPolicy,
        photoUrls,
      });

      if (result.error) { setError(result.error); setSubmitting(false); return; }

      router.push(`/${params?.locale ?? "fr"}/agence/dashboard`);
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
      setSubmitting(false);
    }
  }, [data, params?.locale, router]);

  const steps = [
    { key: "identity", icon: Car, title: "Marque & Modèle" },
    { key: "pricing", icon: Settings, title: "Prix & Carburant" },
    { key: "policy", icon: Gauge, title: "Politique" },
    { key: "photos", icon: Camera, title: "Photos" },
  ];

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-mowsil-navy">{t("addTitle")}</h1>
          <p className="text-sm text-mowsil-legend mt-1">{t("addSubtitle")}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? "bg-mowsil-green text-white" : "bg-white border border-mowsil-card-border text-mowsil-legend"}`}>
                <s.icon size={16} />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${i <= step ? "text-mowsil-green" : "text-mowsil-legend"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full h-1 bg-white rounded-full overflow-hidden mb-6">
          <div className="h-full bg-mowsil-green rounded-full transition-all duration-500" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
        </div>

        <Card>
          <CardBody className="p-6 sm:p-8">
            {error && <Message variant="error" className="mb-4"><p>{error}</p></Message>}

            {step === 0 && (
              <div className="space-y-4">
                <Input label={t("brand")} placeholder={t("brandPlaceholder")} value={data.brand} onChange={(e) => setData({ ...data, brand: e.target.value })} required />
                <Input label={t("model")} placeholder={t("modelPlaceholder")} value={data.model} onChange={(e) => setData({ ...data, model: e.target.value })} required />
                <Input label={t("year")} type="number" min={2000} max={new Date().getFullYear() + 1} value={data.year} onChange={(e) => setData({ ...data, year: parseInt(e.target.value) || 0 })} required />
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-mowsil-navy">Catégorie</label>
                  <select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green">
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-mowsil-navy">Carburant</label>
                  <select value={data.fuelType} onChange={(e) => setData({ ...data, fuelType: e.target.value })} className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green">
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-mowsil-navy">Transmission</label>
                  <select value={data.gearbox} onChange={(e) => setData({ ...data, gearbox: e.target.value })} className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green">
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>
                <Input label={t("dailyPrice")} type="number" min={1} placeholder={t("dailyPricePlaceholder")} value={data.dailyPrice || ""} onChange={(e) => setData({ ...data, dailyPrice: parseInt(e.target.value) || 0 })} required />
                <Input label="Caution (DH, optionnel)" type="number" min={0} placeholder="3000" value={data.depositAmount} onChange={(e) => setData({ ...data, depositAmount: e.target.value })} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-mowsil-navy">Kilométrage</label>
                  <select value={data.mileagePolicy} onChange={(e) => setData({ ...data, mileagePolicy: e.target.value })} className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green">
                    <option value="Illimité">Illimité</option>
                    <option value="200 km/jour inclus">200 km/jour inclus</option>
                    <option value="250 km/jour inclus">250 km/jour inclus</option>
                    <option value="150 km/jour inclus">150 km/jour inclus</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-mowsil-navy">Politique carburant</label>
                  <select value={data.fuelPolicy} onChange={(e) => setData({ ...data, fuelPolicy: e.target.value })} className="w-full rounded-lg border border-mowsil-card-border px-3.5 py-2.5 text-sm text-mowsil-navy bg-white focus:outline-none focus:ring-2 focus:ring-mowsil-green/30 focus:border-mowsil-green">
                    <option value="Plein à plein">Plein à plein</option>
                    <option value="Remise identique">Remise identique</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-mowsil-navy">{t("photosMin")}</label>
                <PhotoUploader
                  multiple
                  value={data.photos}
                  onChange={(files) => setData({ ...data, photos: files as File[] })}
                />
                <p className="text-xs text-mowsil-legend">{data.photos.length}/3 photos ajoutées</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-mowsil-card-border">
              <Button variant="ghost" size="sm" className="gap-2" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {c("back")}
              </Button>

              {step < 3 ? (
                <Button variant="primary" size="sm" className="gap-2" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                  {c("next")}
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Button>
              ) : (
                <Button variant="primary" size="sm" className="gap-2" disabled={submitting || data.photos.length < 3} onClick={onSubmit}>
                  {submitting ? "..." : t("addButton")}
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
