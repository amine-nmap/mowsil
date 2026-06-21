"use client";

import { useRef, useState } from "react";
import { Upload, X, Image } from "lucide-react";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUploader({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null,
  );

  function handleFile(f: File | null) {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) return;
    if (f.size > MAX_SIZE) return;
    onChange(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-mowsil-navy">
        Photo de la devanture
        <span className="text-mowsil-legend font-normal"> (optionnelle)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-mowsil-card-border">
          <img
            src={preview}
            alt="Aperçu façade"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-mowsil-card-border rounded-lg p-6 text-center hover:border-mowsil-green transition-colors cursor-pointer"
        >
          <Upload size={24} className="mx-auto text-mowsil-legend mb-2" />
          <p className="text-xs text-mowsil-legend">
            Cliquez pour ajouter une photo (JPG/PNG/WebP, max 5 Mo)
          </p>
        </button>
      )}

      {error && <p className="text-xs text-mowsil-error">{error}</p>}
    </div>
  );
}
