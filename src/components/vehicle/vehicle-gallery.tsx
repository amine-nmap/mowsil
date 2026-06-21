"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  photos: string[];
  brand: string;
  model: string;
};

const PLACEHOLDER_COLORS = [
  "from-mowsil-navy to-[#0D2E4A]",
  "from-mowsil-green/20 to-mowsil-navy/80",
  "from-[#0D2E4A] to-[#0A2540]",
  "from-mowsil-navy/90 to-mowsil-green/10",
];

export default function VehicleGallery({ photos, brand, model }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allPhotos =
    photos.length > 0
      ? photos
      : Array.from({ length: 4 }, (_, i) => `placeholder-${i}`);

  const current = allPhotos[activeIndex];
  const isPlaceholder = current.startsWith("placeholder-");
  const colorIndex = isPlaceholder ? parseInt(current.split("-")[1]) : 0;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-mowsil-gray group">
        {isPlaceholder ? (
          <div className={`w-full h-full bg-gradient-to-br ${PLACEHOLDER_COLORS[colorIndex]} flex items-center justify-center`}>
            <div className="text-center">
              <p className="text-white/80 text-lg font-bold">{brand}</p>
              <p className="text-white/50 text-sm">{model}</p>
            </div>
          </div>
        ) : (
          <img
            src={current}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover"
          />
        )}

        {allPhotos.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? allPhotos.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Photo précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === allPhotos.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Photo suivante"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
          {activeIndex + 1}/{allPhotos.length}
        </div>
      </div>

      {allPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allPhotos.map((photo, i) => {
            const isPlaceholderThumb = photo.startsWith("placeholder-");
            const thumbColor = isPlaceholderThumb ? parseInt(photo.split("-")[1]) : 0;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === activeIndex
                    ? "ring-2 ring-mowsil-green ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {isPlaceholderThumb ? (
                  <div className={`w-full h-full bg-gradient-to-br ${PLACEHOLDER_COLORS[thumbColor % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}>
                    <span className="text-white/40 text-[10px]">{i + 1}</span>
                  </div>
                ) : (
                  <img
                    src={photo}
                    alt={`${brand} ${model} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
