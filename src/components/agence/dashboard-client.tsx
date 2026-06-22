"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import {
  Car, Clock, Play, CheckCircle,
  Plus, KeyRound, DollarSign, ArrowRight, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";
import ExpiryTimer from "@/components/agence/expiry-timer";
import { activateBookingByCode } from "@/actions/agency-bookings";

type DashboardData = {
  agency: { id: string; name: string };
  stats: {
    totalVehicles: number;
    pendingCount: number;
    activeCount: number;
    completedCount: number;
    totalEarnings: number;
  };
  pendingBookings: Array<{
    id: string;
    client_name: string;
    start_date: string;
    end_date: string;
    created_at: string;
    expires_at: string;
    vehicles: { brand: string; model: string };
  }>;
  vehicles: Array<{ id: string; brand: string; model: string; daily_price: number; is_available: boolean }>;
};

type Props = {
  data: DashboardData;
  agency: { id: string; name: string };
};

export default function AgencyDashboardClient({ data }: Props) {
  const d = useTranslations("dashboard");
  const s = useTranslations("statuses");
  const c = useTranslations("common");
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">{d("title")}</h1>
            <p className="text-sm text-mowsil-legend mt-1">{d("subtitle")}</p>
          </div>
          <form action={`/${locale}/agence/login`} method="post">
            <Button variant="ghost" size="sm" type="submit">
              {c("logout")}
            </Button>
          </form>
        </div>

        <div className="grid gap-4 sm:grid-cols-5 mb-8">
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <Car size={20} className="text-mowsil-navy" />
              <div>
                <p className="text-2xl font-bold text-mowsil-navy">{data.stats.totalVehicles}</p>
                <p className="text-xs text-mowsil-legend">{d("statsVehicles")}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <Clock size={20} className="text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-amber-500">{data.stats.pendingCount}</p>
                <p className="text-xs text-mowsil-legend">{d("statsPending")}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <Play size={20} className="text-mowsil-green" />
              <div>
                <p className="text-2xl font-bold text-mowsil-green">{data.stats.activeCount}</p>
                <p className="text-xs text-mowsil-legend">{d("statsActive")}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <CheckCircle size={20} className="text-mowsil-legend" />
              <div>
                <p className="text-2xl font-bold text-mowsil-navy">{data.stats.completedCount}</p>
                <p className="text-xs text-mowsil-legend">{d("statsCompleted")}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <DollarSign size={20} className="text-mowsil-green" />
              <div>
                <p className="text-2xl font-bold text-mowsil-green">{data.stats.totalEarnings} DH</p>
                <p className="text-xs text-mowsil-legend">{d("totalEarnings")}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-mowsil-navy">{d("requestsTitle")}</h2>
                  {data.stats.pendingCount > 0 && (
                    <Badge variant="warning">{data.stats.pendingCount} {d("pendingRequests")}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardBody className="p-5">
                {data.pendingBookings.length === 0 ? (
                  <p className="text-sm text-mowsil-legend text-center py-6">
                    {d("noPendingRequests")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.pendingBookings.map((req) => {
                      const statusKey = "en_attente";
                      return (
                        <Link
                          key={req.id}
                          href={`/${locale}/agence/requests/${req.id}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-mowsil-gray hover:bg-mowsil-card-border/50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-semibold text-mowsil-navy">
                              {req.vehicles?.brand} {req.vehicles?.model}
                            </p>
                            <p className="text-xs text-mowsil-legend">
                              {req.client_name} · {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {req.expires_at && <ExpiryTimer expiresAt={req.expires_at} expiredLabel={s("expired")} />}
                            <Badge variant="warning">{s("pending")}</Badge>
                            {isRtl ? <ArrowLeft size={16} className="text-mowsil-legend" /> : <ArrowRight size={16} className="text-mowsil-legend" />}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {data.stats.pendingCount > 0 && (
                  <div className="mt-4 text-center">
                    <Link
                      href={`/${locale}/agence/requests`}
                      className="text-sm font-semibold text-mowsil-green hover:underline"
                    >
                      {d("viewAllRequests")}
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-mowsil-navy">{d("fleetTitle")}</h2>
                  <Link href={`/${locale}/agence/vehicles`} className="text-xs font-semibold text-mowsil-green hover:underline">
                    {c("seeMore")}
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-5">
                {data.vehicles.length === 0 ? (
                  <>
                    <p className="text-sm text-mowsil-legend mb-4">{d("noVehicles")}</p>
                    <Link href={`/${locale}/agence/vehicles/add`}>
                      <Button variant="secondary" size="sm" className="w-full gap-2">
                        <Plus size={16} />
                        {d("addVehicle")}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    {data.vehicles.map((v) => (
                      <div key={v.id} className="flex items-center justify-between py-1.5">
                        <p className="text-sm font-semibold text-mowsil-navy">
                          {v.brand} {v.model}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-mowsil-legend">{v.daily_price} DH/j</span>
                          <span className={`w-2 h-2 rounded-full ${v.is_available ? 'bg-mowsil-green' : 'bg-amber-400'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <ActivateCodeCard d={d} />

            <Message variant="info" className="text-xs">
              <p>{d("codeInfo")}</p>
            </Message>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivateCodeCard({ d }: { d: (key: string) => string }) {
  const [state, formAction, pending] = useActionState(activateBookingByCode, { error: "", success: false });

  return (
    <Card>
      <CardHeader className="p-5 pb-0">
        <h2 className="font-bold text-mowsil-navy">{d("activateCode")}</h2>
      </CardHeader>
      <CardBody className="p-5 space-y-3">
        <form action={formAction} className="space-y-3">
          <Input
            name="code"
            placeholder={d("codePlaceholder")}
            maxLength={12}
            style={{ textTransform: "uppercase" }}
            required
          />
          <Button
            variant="primary"
            size="sm"
            className="w-full gap-2"
            disabled={pending}
          >
            <KeyRound size={16} />
            {pending ? "..." : d("codeActivate")}
          </Button>
          {state.error && (
            <Message variant="error" className="text-xs">
              <p>{state.error}</p>
            </Message>
          )}
          {state.success && (
            <Message variant="success" className="text-xs">
              <p>{d("activatedSuccess")}</p>
            </Message>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
