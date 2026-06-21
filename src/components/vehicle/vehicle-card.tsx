"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MapPin, Fuel, Gauge } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VehicleCardProps = {
  id: string;
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel: string;
  transmission: string;
  category: string;
  agency: string;
  available: boolean;
  className?: string;
};

export default function VehicleCard({
  id,
  image,
  brand,
  model,
  year,
  price,
  fuel,
  transmission,
  category,
  agency,
  available,
  className,
}: VehicleCardProps) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const t = useTranslations("vehicles");

  return (
    <Link href={`/${locale}/vehicle/${id}`} className={cn("block group", className)}>
      <Card hover className="overflow-hidden p-0">
        <div className="aspect-[16/10] bg-mowsil-gray relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-mowsil-gray to-gray-200 flex items-center justify-center text-mowsil-legend text-sm">
            {brand} {model}
          </div>
          {!available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="error">{t("unavailable")}</Badge>
            </div>
          )}
          <Badge variant="outline" className="absolute top-3 start-3 bg-white/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
        <CardBody className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-mowsil-navy text-base group-hover:text-mowsil-green transition-colors">
                {brand} {model}
              </h3>
              <p className="text-xs text-mowsil-legend mt-0.5">{year}</p>
            </div>
            <div className="text-end shrink-0">
              <p className="text-lg font-bold text-mowsil-green">
                {price} <span className="text-xs font-normal text-mowsil-legend">{t("perDay")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-mowsil-legend">
            <span className="flex items-center gap-1">
              <Fuel size={14} /> {fuel}
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={14} /> {transmission}
            </span>
          </div>
        </CardBody>
        <CardFooter className="px-4 py-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-mowsil-legend">
            <MapPin size={14} /> {agency}
          </span>
          <Button variant="primary" size="sm">
            {t("bookNow")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
