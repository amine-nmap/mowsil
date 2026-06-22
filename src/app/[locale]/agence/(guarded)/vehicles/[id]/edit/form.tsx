"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, ArrowRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardBody } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import { updateVehicle } from "@/actions/vehicles";

const CATEGORIES = ["Citadine", "Berline", "SUV", "Prestige"];

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel_type: string;
  gearbox: string;
  daily_price: number;
  deposit_amount: number | null;
  mileage_policy: string;
  fuel_policy: string;
  photos: string[];
  is_available: boolean;
};

type Props = {
  vehicle: Vehicle;
  locale: string;
};

export default function EditVehicleForm({ vehicle, locale }: Props) {
  const t = useTranslations("vehicles");
  const c = useTranslations("common");
  const router = useRouter();
  const isRtl = locale === "ar";

  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [year, setYear] = useState(String(vehicle.year));
  const [category, setCategory] = useState(vehicle.category);
  const [fuelType, setFuelType] = useState(vehicle.fuel_type);
  const [gearbox, setGearbox] = useState(vehicle.gearbox);
  const [dailyPrice, setDailyPrice] = useState(String(vehicle.daily_price));
  const [depositAmount, setDepositAmount] = useState(vehicle.deposit_amount ? String(vehicle.deposit_amount) : "");
  const [mileagePolicy, setMileagePolicy] = useState(vehicle.mileage_policy);
  const [fuelPolicy, setFuelPolicy] = useState(vehicle.fuel_policy);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);

    const result = await updateVehicle(vehicle.id, {
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year) || vehicle.year,
      category,
      fuelType,
      gearbox,
      dailyPrice: parseInt(dailyPrice) || vehicle.daily_price,
      depositAmount: depositAmount ? parseInt(depositAmount) : null,
      mileagePolicy,
      fuelPolicy,
    });

    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
    setTimeout(() => router.push(`/${locale}/agence/vehicles`), 1500);
  }

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-mowsil-navy hover:text-mowsil-green transition-colors mb-6"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {c("back")}
        </button>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-mowsil-green/10 flex items-center justify-center">
                <Car size={20} className="text-mowsil-green" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-mowsil-navy">{t("editTitle")}</h1>
                <p className="text-sm text-mowsil-legend">{vehicle.brand} {vehicle.model}</p>
              </div>
            </div>

            {error && (
              <Message variant="error" className="mb-4">
                <p>{error}</p>
              </Message>
            )}

            {success && (
              <Message variant="success" className="mb-4">
                <p>{c("success")}</p>
              </Message>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="brand" label={t("brand")} value={brand} onChange={(e) => setBrand(e.target.value)} required />
                <Input id="model" label={t("model")} value={model} onChange={(e) => setModel(e.target.value)} required />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input id="year" label={t("year")} type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                <Select id="category" label={t("category")} value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
                <Select id="fuelType" label={t("fuel")} value={fuelType} onChange={(e) => setFuelType(e.target.value)} options={["Essence", "Diesel", "Hybride", "Électrique"].map((v) => ({ value: v, label: v }))} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select id="gearbox" label={t("transmission")} value={gearbox} onChange={(e) => setGearbox(e.target.value)} options={[t("manual"), t("automatic")].map((v) => ({ value: v === t("manual") ? "Manuelle" : "Automatique", label: v }))} />
                <Input id="mileagePolicy" label={t("mileage")} value={mileagePolicy} onChange={(e) => setMileagePolicy(e.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="dailyPrice" label={t("dailyPrice")} type="number" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} required />
                <Input id="depositAmount" label={t("deposit")} type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
              </div>

              <Input id="fuelPolicy" label={t("fuelPolicy")} value={fuelPolicy} onChange={(e) => setFuelPolicy(e.target.value)} />

              <div className="flex items-center gap-3 pt-4">
                <Button variant="primary" size="lg" className="gap-2" disabled={pending}>
                  <Save size={18} />
                  {pending ? "..." : c("save")}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => router.push(`/${locale}/agence/vehicles`)}>
                  {c("cancel")}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
