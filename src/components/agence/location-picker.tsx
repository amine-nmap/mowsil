"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLng } from "leaflet";

const OUJDA_CENTER: [number, number] = [34.6814, -1.9086];

type Props = {
  value: { lat: number; lng: number };
  onChange: (coord: { lat: number; lng: number }) => void;
};

function DraggableMarker({ position, onMove }: { position: [number, number]; onMove: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      onMove([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend(e) {
          const latlng = e.target.getLatLng() as LatLng;
          onMove([latlng.lat, latlng.lng]);
        },
      }}
    />
  );
}

export default function LocationPicker({ value, onChange }: Props) {
  const position: [number, number] = useMemo(
    () => [value.lat ?? OUJDA_CENTER[0], value.lng ?? OUJDA_CENTER[1]],
    [value.lat, value.lng],
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-mowsil-navy">
        Localisation sur la carte
      </label>
      <div className="rounded-lg overflow-hidden border border-mowsil-card-border h-[250px] sm:h-[300px]">
        <MapContainer
          center={position}
          zoom={14}
          className="w-full h-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker
            position={position}
            onMove={(pos) => onChange({ lat: pos[0], lng: pos[1] })}
          />
        </MapContainer>
      </div>
      <p className="text-xs text-mowsil-legend">
        Déplacez le marqueur ou cliquez sur la carte pour positionner votre agence
      </p>
    </div>
  );
}
