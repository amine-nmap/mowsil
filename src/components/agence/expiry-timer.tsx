"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Props = {
  expiresAt: string;
};

export default function ExpiryTimer({ expiresAt }: Props) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining("Expirée");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setRemaining(`${hours}h ${minutes}m`);
      } else {
        setRemaining(`${minutes}m`);
      }
    }

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!remaining || remaining === "Expirée") {
    return (
      <span className="text-xs text-mowsil-error flex items-center gap-1">
        <Clock size={12} /> Expirée
      </span>
    );
  }

  const isUrgent = !remaining.includes("h");

  return (
    <span className={`text-xs flex items-center gap-1 ${isUrgent ? 'text-red-500 font-bold' : 'text-amber-500'}`}>
      <Clock size={12} /> {remaining}
    </span>
  );
}

