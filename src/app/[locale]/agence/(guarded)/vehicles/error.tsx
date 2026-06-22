"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function VehiclesError({ reset }: { error: Error; reset: () => void }) {
  const c = useTranslations("common");
  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm mx-auto px-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle size={24} className="text-mowsil-error" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-mowsil-navy">{c("error")}</h2>
          <p className="text-sm text-mowsil-body mt-1">
            {c("errorDescription")}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={reset}>
          {c("retry")}
        </Button>
      </div>
    </div>
  );
}
