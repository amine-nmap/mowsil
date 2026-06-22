"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import VehicleCard from "@/components/vehicle/vehicle-card";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  fuel_type: string;
  gearbox: string;
  is_available: boolean;
  agencies?: { name: string; city: string } | null;
};

type Props = {
  vehicles: Vehicle[];
  filters: Record<string, string | undefined>;
};

const CATEGORIES = ["citadine", "berline", "suv", "prestige"];

export default function ResultsClient({ vehicles, filters }: Props) {
  const t = useTranslations("vehicles");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">{t("title")}</h1>
            <p className="text-sm text-mowsil-legend mt-1">
              {t("subtitle", { count: vehicles.length })}
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  const sp = new URLSearchParams();
                  Object.entries(filters).forEach(([k, v]) => {
                    if (v) sp.set(k, v);
                  });
                  if (isActive) sp.delete("category");
                  else sp.set("category", cat);
                  router.push(`/${params.locale}/results?${sp.toString()}`);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  isActive
                    ? "bg-mowsil-navy text-white border-mowsil-navy"
                    : "bg-white text-mowsil-navy border-mowsil-card-border hover:border-mowsil-navy"
                }`}
              >
                {t(cat)}
              </button>
            );
          })}
        </div>

        {vehicles.length === 0 ? (
          <div className="max-w-md mx-auto py-16">
            <Message variant="info">
              <p className="font-semibold">{t("noVehicles")}</p>
              <p className="text-sm mt-1">{t("modifySearch")}</p>
            </Message>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                id={v.id}
                image=""
                brand={v.brand}
                model={v.model}
                year={v.year}
                price={v.daily_price}
                fuel={v.fuel_type}
                transmission={v.gearbox}
                category=""
                agency={v.agencies?.name ?? ""}
                available={v.is_available}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
