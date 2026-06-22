"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllBookings } from "@/actions/admin-bookings";
import { generateStickerUrl } from "@/lib/qr-sticker";
import { adminLocale } from "@/lib/admin-locale";
import { Button } from "@/components/ui/button";
import { Printer, RotateCcw } from "lucide-react";

const t = adminLocale;

type Booking = {
  id: string;
  client_name: string;
  status: string;
  unique_code: string | null;
  vehicles: any;
};

function getVehicleName(vehicles: any): string {
  if (!vehicles) return "—";
  const v = Array.isArray(vehicles) ? vehicles[0] : vehicles;
  return v ? `${v.brand ?? ""} ${v.model ?? ""}`.trim() || "—" : "—";
}

function getAgencyName(vehicles: any): string {
  if (!vehicles) return "—";
  const v = Array.isArray(vehicles) ? vehicles[0] : vehicles;
  if (!v?.agencies) return "—";
  const a = Array.isArray(v.agencies) ? v.agencies[0] : v.agencies;
  return a?.name ?? "—";
}

export default function AdminQrStickersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllBookings("all")
      .then((data) => {
        const filtered = data.filter(
          (b) => b.status === "confirmee" || b.status === "activee" || b.status === "terminee",
        );
        setBookings(filtered);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = bookings.find((b) => b.id === selectedId);

  const handleGenerate = useCallback(async () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const url = await generateStickerUrl({
        bookingId: selected.id,
        agencyName: getAgencyName(selected.vehicles),
        vehicleName: getVehicleName(selected.vehicles),
      });
      setQrDataUrl(url);
    } catch {
      setQrDataUrl(null);
    } finally {
      setGenerating(false);
    }
  }, [selected]);

  useEffect(() => {
    if (selectedId) handleGenerate();
  }, [selectedId, handleGenerate]);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-mowsil-navy">{t.qrTitle}</h1>
          <p className="text-sm text-mowsil-legend mt-1">{t.qrSubtitle}</p>
        </div>

        <div className="bg-white rounded-xl border border-mowsil-card-border p-6">
          {loading ? (
            <p className="text-mowsil-legend text-sm">{t.loading}</p>
          ) : bookings.length === 0 ? (
            <p className="text-mowsil-legend text-sm">{t.qrNoBookings}</p>
          ) : (
            <div className="space-y-6">
              <select
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); setQrDataUrl(null); }}
                className="w-full border border-mowsil-card-border rounded-lg px-4 py-2.5 text-sm text-mowsil-navy bg-white"
              >
                <option value="">{t.qrSelectBooking}</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {getVehicleName(b.vehicles)} — {getAgencyName(b.vehicles)} — {b.unique_code ?? b.status}
                  </option>
                ))}
              </select>

              {qrDataUrl && selected && (
                <div className="text-center space-y-4 pt-4 border-t border-mowsil-card-border">
                  <p className="font-bold text-mowsil-navy text-sm">{t.qrCodePreview}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR ${getVehicleName(selected.vehicles)}`}
                    className="mx-auto w-48 h-48 border border-mowsil-card-border rounded-xl"
                  />
                  <p className="text-xs text-mowsil-legend">
                    {getVehicleName(selected.vehicles)} · {getAgencyName(selected.vehicles)}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="secondary" size="sm" onClick={handleGenerate}>
                      <RotateCcw size={14} className="mr-1" />
                      {t.qrRegenerate}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => window.print()}>
                      <Printer size={14} className="mr-1" />
                      {t.qrPrint}
                    </Button>
                  </div>
                </div>
              )}

              {generating && (
                <p className="text-center text-mowsil-legend text-sm">{t.loading}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
