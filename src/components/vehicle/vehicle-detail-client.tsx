"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  MapPin, Fuel, Gauge, Calendar, Shield, CheckCircle,
  ArrowLeft, ArrowRight, Snowflake, Bluetooth, Navigation,
  Car, Users, Clock, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Message } from "@/components/ui/message";
import VehicleGallery from "@/components/vehicle/vehicle-gallery";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  fuel_type: string;
  gearbox: string;
  deposit_amount: number | null;
  mileage_policy: string | null;
  fuel_policy: string | null;
  photos: string[];
  is_available: boolean;
  agencies?: { name: string; city: string; address: string | null; phone: string | null };
};

type Props = {
  vehicle: Vehicle;
};

export default function VehicleDetailClient({ vehicle }: Props) {
  const v = useTranslations("vehicles");
  const c = useTranslations("common");
  const params = useParams<{ id: string; locale: string }>();
  const searchParams = useSearchParams();
  const isRtl = params.locale === "ar";

  const dateDebut = searchParams.get("dateDebut") ?? "";
  const dateFin = searchParams.get("dateFin") ?? "";
  const heureDebut = searchParams.get("heureDebut") ?? "";
  const heureFin = searchParams.get("heureFin") ?? "";

  const bookingUrl = `/${params.locale}/reservation/new/${params.id}?dateDebut=${dateDebut}&dateFin=${dateFin}&heureDebut=${heureDebut}&heureFin=${heureFin}`;

  const specRows = [
    { icon: Fuel, label: v("fuel"), value: vehicle.fuel_type },
    { icon: Gauge, label: v("transmission"), value: vehicle.gearbox },
    { icon: Calendar, label: v("mileage"), value: vehicle.mileage_policy ?? v("unlimited") },
    { icon: Shield, label: v("deposit"), value: vehicle.deposit_amount ? `${vehicle.deposit_amount} DH` : v("depositNone") },
    { icon: Car, label: v("category"), value: v("citadine") },
    { icon: Users, label: v("seats", { count: 5 }), value: "5" },
  ];

  return (
    <div className="min-h-screen bg-mowsil-gray">
      {/* Hero */}
      <section className="relative bg-mowsil-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mowsil-navy via-[#0D2E4A] to-[#0A2540]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,150,0.08),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href={`/${params.locale}/results`}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {v("backToResults")}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  {vehicle.fuel_type}
                </Badge>
                <Badge variant="success">
                  {v("agencyVerified")}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-white/60 mt-2">{vehicle.year} · {vehicle.gearbox}</p>
            </div>
            <div className="text-end">
              <p className="text-4xl sm:text-5xl font-bold text-mowsil-green">
                {vehicle.daily_price}
              </p>
              <p className="text-white/60 text-sm">{v("perDay")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery */}
            <VehicleGallery photos={vehicle.photos} brand={vehicle.brand} model={vehicle.model} />

            {/* Specs */}
            <Card>
              <CardBody className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {specRows.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-mowsil-gray">
                      <item.icon size={18} className="text-mowsil-navy shrink-0" />
                      <div>
                        <p className="text-xs text-mowsil-legend">{item.label}</p>
                        <p className="text-sm font-semibold text-mowsil-navy">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-bold text-mowsil-navy text-sm mb-2">{v("includedOptions")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Snowflake, label: v("airConditioning") },
                      { icon: Bluetooth, label: v("bluetooth") },
                      { icon: Navigation, label: v("gps") },
                    ].map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-mowsil-navy bg-mowsil-gray rounded-full px-3 py-1.5"
                      >
                        <opt.icon size={14} /> {opt.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold text-mowsil-navy text-sm mb-2">{v("description")}</h3>
                  <p className="text-sm text-mowsil-body leading-relaxed">
                    {vehicle.brand} {vehicle.model}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Transparency */}
            <Card>
              <CardBody className="p-5 space-y-4">
                <h3 className="font-bold text-mowsil-navy flex items-center gap-2">
                  <Info size={16} /> {v("transparency")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-3 rounded-lg bg-mowsil-gray">
                    <p className="text-xs text-mowsil-legend">{v("fuel")}</p>
                    <p className="text-sm font-semibold text-mowsil-navy">{vehicle.fuel_policy ?? v("fullToFull")}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-mowsil-gray">
                    <p className="text-xs text-mowsil-legend">{v("minAge")}</p>
                    <p className="text-sm font-semibold text-mowsil-navy">{v("ageValue")}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-mowsil-gray">
                    <p className="text-xs text-mowsil-legend">{v("licenseRequired")}</p>
                    <p className="text-sm font-semibold text-mowsil-navy">{v("minLicenseYear")}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-mowsil-gray">
                    <p className="text-xs text-mowsil-legend">{v("mileage")}</p>
                    <p className="text-sm font-semibold text-mowsil-navy">{vehicle.mileage_policy ?? v("unlimited")}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Agency */}
            <Card>
              <CardBody className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-mowsil-navy/5 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-mowsil-navy" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-mowsil-navy">{vehicle.agencies?.name ?? v("partnerAgency")}</p>
                      <Badge variant="success">{v("agencyVerified")}</Badge>
                    </div>
                    <p className="text-xs text-mowsil-legend mt-1">{vehicle.agencies?.address ?? v("oujdaMorocco")}</p>
                    {vehicle.agencies?.phone && (
                      <p className="text-xs text-mowsil-legend mt-0.5">{vehicle.agencies.phone}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-mowsil-legend">
                      <Clock size={14} />
                      <span>{v("hours")}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card>
                <CardBody className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-mowsil-green">
                      {vehicle.daily_price} <span className="text-sm font-normal text-mowsil-legend">{v("perDay")}</span>
                    </p>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${vehicle.is_available ? 'text-mowsil-green' : 'text-amber-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${vehicle.is_available ? 'bg-mowsil-green' : 'bg-amber-400'}`} />
                      {vehicle.is_available ? v("available") : v("unavailable")}
                    </span>
                  </div>

                  <div className="border-t border-mowsil-card-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mowsil-legend">{v("deposit")}</span>
                      <span className="font-semibold text-mowsil-navy">
                        {vehicle.deposit_amount ? `${vehicle.deposit_amount} DH` : v("depositNone")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mowsil-legend">{v("fuelPolicy")}</span>
                      <span className="font-semibold text-mowsil-navy">{vehicle.fuel_policy ?? v("fullToFull")}</span>
                    </div>
                  </div>

                  <Message variant="info" className="text-xs">
                    <p>{v("ageRequirement")}</p>
                  </Message>

                  <Link href={bookingUrl}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full gap-2 text-base"
                      disabled={!vehicle.is_available}
                    >
                      <CheckCircle size={20} />
                      {v("bookNow")}
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-mowsil-legend">
                    {v("paymentInfo")}
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
