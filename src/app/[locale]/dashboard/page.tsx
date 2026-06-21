"use client";

import { useTranslations } from "next-intl";
import {
  Car, Clock, Play, CheckCircle,
  Plus, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";

export default function DashboardPage() {
  const d = useTranslations("dashboard");
  const s = useTranslations("statuses");

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">{d("title")}</h1>
            <p className="text-sm text-mowsil-legend mt-1">{d("subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          {[
            { icon: Car, label: d("statsVehicles"), value: "6", color: "text-mowsil-navy" },
            { icon: Clock, label: d("statsPending"), value: "2", color: "text-amber-500" },
            { icon: Play, label: d("statsActive"), value: "1", color: "text-mowsil-green" },
            { icon: CheckCircle, label: d("statsCompleted"), value: "12", color: "text-mowsil-legend" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardBody className="flex items-center gap-3 p-4">
                <stat.icon size={20} className={stat.color} />
                <div>
                  <p className="text-2xl font-bold text-mowsil-navy">{stat.value}</p>
                  <p className="text-xs text-mowsil-legend">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-5 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-mowsil-navy">{d("requestsTitle")}</h2>
                  <Badge variant="warning">2 {d("pendingRequests")}</Badge>
                </div>
              </CardHeader>
              <CardBody className="p-5">
                <div className="space-y-3">
                  {[
                    { vehicle: "Dacia Sandero", client: "Ahmed A.", date: "22-25 juin", status: "pending" },
                    { vehicle: "Renault Clio", client: "Sara B.", date: "23-26 juin", status: "pending" },
                    { vehicle: "Dacia Logan", client: "Omar C.", date: "18-21 juin", status: "confirmed" },
                    { vehicle: "Hyundai Tucson", client: "Fatima D.", date: "15-18 juin", status: "activated" },
                  ].map((req, i) => {
                    const statusKey = req.status as "pending" | "confirmed" | "rejected" | "expired" | "activated" | "completed";
                    const badgeVariant = statusKey === "pending" ? "warning" as const : statusKey === "confirmed" ? "success" as const : statusKey === "activated" ? "default" as const : "outline" as const;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-mowsil-gray"
                      >
                        <div>
                          <p className="text-sm font-semibold text-mowsil-navy">{req.vehicle}</p>
                          <p className="text-xs text-mowsil-legend">{req.client} · {req.date}</p>
                        </div>
                        <Badge variant={badgeVariant}>
                          {s(statusKey)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="p-5 pb-0">
                <h2 className="font-bold text-mowsil-navy">{d("fleetTitle")}</h2>
              </CardHeader>
              <CardBody className="p-5">
                <p className="text-sm text-mowsil-legend mb-4">{d("noVehicles")}</p>
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  <Plus size={16} />
                  {d("addVehicle")}
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-0">
                <h2 className="font-bold text-mowsil-navy">{d("activateCode")}</h2>
              </CardHeader>
              <CardBody className="p-5 space-y-3">
                <Input placeholder={d("codePlaceholder")} />
                <Button variant="primary" size="sm" className="w-full gap-2">
                  <KeyRound size={16} />
                  {d("codeActivate")}
                </Button>
              </CardBody>
            </Card>

            <Message variant="info" className="text-xs">
              <p>{d("codeInfo")}</p>
            </Message>
          </div>
        </div>
      </div>
    </div>
  );
}
