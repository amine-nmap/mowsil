import { getAgencyVehicles } from "@/actions/dashboard";
import { requireAgency } from "@/lib/auth-helpers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import DeleteVehicleButton from "@/components/agence/delete-vehicle-button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vehicles" });
  return { title: `${t("myFleet")} | MOWSIL` };
}

export default async function FleetPage({ params }: Props) {
  const { locale } = await params;
  const session = await requireAgency();
  const vehicles = await getAgencyVehicles();
  const t = await getTranslations({ locale, namespace: "vehicles" });
  const s = await getTranslations({ locale, namespace: "statuses" });

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">{t("myFleet")}</h1>
            <p className="text-sm text-mowsil-legend mt-1">{session.agency.name}</p>
          </div>
          <Link href={`/${locale}/agence/vehicles/add`}>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus size={16} />
              {t("addTitle")}
            </Button>
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <Card>
            <CardBody className="p-8 text-center">
              <p className="text-sm text-mowsil-legend mb-4">{t("noVehiclesFleet")}</p>
              <Link href={`/${locale}/agence/vehicles/add`}>
                <Button variant="primary" size="sm" className="gap-2">
                  <Plus size={16} />
                  {t("addTitle")}
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-mowsil-card-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mowsil-card-border bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-mowsil-navy">{t("vehicle")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-mowsil-navy">{t("year")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-mowsil-navy">{t("category")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-mowsil-navy">{t("price")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-mowsil-navy">{t("status")}</th>
                  <th className="text-right px-4 py-3 font-semibold text-mowsil-navy">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v: any) => (
                  <tr key={v.id} className="border-b border-mowsil-card-border last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-mowsil-navy">{v.brand} {v.model}</td>
                    <td className="px-4 py-3 text-mowsil-body">{v.year}</td>
                    <td className="px-4 py-3 text-mowsil-body">{v.category}</td>
                    <td className="px-4 py-3 text-mowsil-body">{t("pricePerDayCompact", { price: v.daily_price })}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${v.is_available ? "bg-mowsil-success-bg text-mowsil-green" : "bg-red-50 text-mowsil-error"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.is_available ? "bg-mowsil-green" : "bg-mowsil-error"}`} />
                        {v.is_available ? t("available") : t("unavailable")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DeleteVehicleButton vehicleId={v.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
