"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/actions/vehicles";

type Props = {
  vehicleId: string;
};

export default function DeleteVehicleButton({ vehicleId }: Props) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown) => {
      return await deleteVehicle(vehicleId);
    },
    null,
  );

  return (
    <form action={formAction}>
      <Button variant="ghost" size="sm" className="text-mowsil-error gap-1 text-xs" disabled={pending} onClick={(e) => { if (!confirm("Supprimer ce véhicule ?")) e.preventDefault(); }}>
        <Trash2 size={14} />
        {pending ? "..." : "Supprimer"}
      </Button>
    </form>
  );
}
